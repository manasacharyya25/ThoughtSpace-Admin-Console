"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { BlogPostRow } from "@/types/blog";
import { BLOG_CATEGORIES } from "@/types/blog";

type BlogListProps = {
  posts: BlogPostRow[];
  siteUrl: string;
};

export function BlogList({ posts, siteUrl }: BlogListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = posts.filter((post) =>
    filter === "all" ? true : post.status === filter
  );

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setDeletingId(id);
    const response = await fetch(`/api/blog-posts/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (!response.ok) {
      alert("Failed to delete post");
      return;
    }

    router.refresh();
  }

  async function handlePublishToggle(post: BlogPostRow) {
    const endpoint =
      post.status === "published"
        ? `/api/blog-posts/${post.id}/unpublish`
        : `/api/blog-posts/${post.id}/publish`;

    const response = await fetch(endpoint, { method: "POST" });
    if (!response.ok) {
      alert("Failed to update status");
      return;
    }

    router.refresh();
  }

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Blog posts</h1>
          <p className="mt-1 text-sm text-slate-500">
            {posts.length} total · published posts appear on {siteUrl}/blog
          </p>
        </div>
        <Link href="/blog/new">
          <Button>
            <Plus className="h-4 w-4" />
            New post
          </Button>
        </Link>
      </div>

      <div className="mb-4 flex gap-2">
        {(["all", "draft", "published"] as const).map((value) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize ${
              filter === value
                ? "bg-brand-500 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-500">No posts found.</p>
          <Link href="/blog/new" className="mt-4 inline-block">
            <Button variant="secondary">Create your first post</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{post.title}</div>
                    <div className="text-xs text-slate-400">/blog/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {BLOG_CATEGORIES.find((c) => c.id === post.category_id)?.label ??
                      post.category_label}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {post.status}
                    </span>
                    {(post.content_format ?? "plain") === "tiptap" ? (
                      <span className="ml-2 inline-flex rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                        rich
                      </span>
                    ) : (
                      <span className="ml-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                        plain
                      </span>
                    )}
                    {post.featured && (
                      <span className="ml-2 inline-flex rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                        featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {formatDate(post.updated_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/blog/${post.id}/edit`}
                        className="text-brand-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handlePublishToggle(post)}
                        className="text-slate-600 hover:underline"
                      >
                        {post.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      {post.status === "published" && (
                        <a
                          href={`${siteUrl}/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"
                        >
                          View
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deletingId === post.id}
                        className="inline-flex items-center gap-1 text-red-600 hover:underline disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
