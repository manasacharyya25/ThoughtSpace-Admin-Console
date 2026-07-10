import { NextResponse } from "next/server";
import { newsletterCreateSchema } from "@/lib/newsletter-validation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { NewsletterRow } from "@/types/newsletter";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletters")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data as NewsletterRow[] });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = newsletterCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { state, publish_at = null } = parsed.data;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletters")
    .insert({
      state,
      publish_at: publish_at ?? null,
      status: "draft",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data as NewsletterRow }, { status: 201 });
}
