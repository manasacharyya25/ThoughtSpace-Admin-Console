import { notFound } from "next/navigation";
import { BlogForm } from "@/components/blog-form";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BlogPostRow } from "@/types/blog";

type PageProps = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("title")
    .eq("id", id)
    .maybeSingle();

  return { title: data?.title ? `Edit: ${data.title}` : "Edit post" };
}

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    notFound();
  }

  return <BlogForm mode="edit" post={data as BlogPostRow} />;
}
