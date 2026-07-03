import { BlogForm } from "@/components/blog-form";

export const metadata = {
  title: "New blog post",
};

export default function NewBlogPage() {
  return <BlogForm mode="create" />;
}
