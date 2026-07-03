import { BlogList } from "@/components/blog-list";
import { createAdminClient } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import type { BlogPostRow } from "@/types/blog";

export const metadata = {
  title: "Blog posts",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <BlogList
      posts={(data ?? []) as BlogPostRow[]}
      siteUrl={env.siteUrl()}
    />
  );
}
