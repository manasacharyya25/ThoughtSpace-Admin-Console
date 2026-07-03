import { NextResponse } from "next/server";
import { blogPostPatchSchema, blogPostSchema } from "@/lib/blog-validation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BlogPostRow } from "@/types/blog";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: data as BlogPostRow });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = blogPostPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const updates: Record<string, unknown> = { ...input };

  if (input.content_format === "tiptap") {
    updates.content_json = input.content_json ?? null;
  } else if (input.content_format === "plain") {
    updates.content_json = null;
  }

  if (input.image_label === undefined) {
    delete updates.image_label;
  }
  if (input.image_credit === undefined) {
    delete updates.image_credit;
  }
  if (input.image_credit_url === undefined) {
    delete updates.image_credit_url;
  }
  if (input.pillar_slug === undefined) {
    delete updates.pillar_slug;
  }

  if (input.status === "published" && !input.published_at) {
    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();

    if (!existing?.published_at) {
      updates.published_at = new Date().toISOString();
    }
  }

  if (input.status === "draft") {
    updates.published_at = null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .update(updates)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: data as BlogPostRow });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = createAdminClient();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
