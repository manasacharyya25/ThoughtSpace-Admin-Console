import { NextResponse } from "next/server";
import { blogPostSchema } from "@/lib/blog-validation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BlogPostRow } from "@/types/blog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category_id");

  const supabase = createAdminClient();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (status === "draft" || status === "published") {
    query = query.eq("status", status);
  }

  if (category) {
    query = query.eq("category_id", category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data as BlogPostRow[] });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const row = {
    ...input,
    content_format: input.content_format ?? "plain",
    content_json:
      input.content_format === "tiptap" ? (input.content_json ?? null) : null,
    image_label: input.image_label ?? null,
    image_credit: input.image_credit ?? null,
    image_credit_url: input.image_credit_url || null,
    pillar_slug: input.pillar_slug ?? null,
    read_time_minutes: input.read_time_minutes ?? null,
    published_at:
      input.status === "published"
        ? input.published_at ?? new Date().toISOString()
        : null,
  };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ data: data as BlogPostRow }, { status: 201 });
}
