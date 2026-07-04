"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui";
import { BLOG_CATEGORIES, type BlogPostRow } from "@/types/blog";

type BlogPostPickerModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (post: BlogPostRow | null) => void;
};

export function BlogPostPickerModal({
  open,
  onClose,
  onSelect,
}: BlogPostPickerModalProps) {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    setError("");
    setQuery("");

    fetch("/api/blog-posts?status=published")
      .then(async (response) => {
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(body?.error ?? "Failed to load blog posts");
        }
        return response.json() as Promise<{ data: BlogPostRow[] }>;
      })
      .then((body) => setPosts(body.data ?? []))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return posts;

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(trimmed) ||
        post.slug.toLowerCase().includes(trimmed) ||
        post.category_label.toLowerCase().includes(trimmed)
    );
  }, [posts, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="blog-picker-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2
              id="blog-picker-title"
              className="text-sm font-semibold text-slate-900"
            >
              Add article from blog
            </h2>
            <p className="text-xs text-slate-500">
              Published posts only — fields auto-fill on select
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-200 px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, slug, or category…"
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="min-h-[240px] flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading published posts…
            </div>
          ) : error ? (
            <p className="px-4 py-8 text-center text-sm text-red-600">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">
              {posts.length === 0
                ? "No published blog posts yet."
                : "No posts match your search."}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((post) => {
                const categoryLabel =
                  BLOG_CATEGORIES.find((c) => c.id === post.category_id)
                    ?.label ?? post.category_label;

                return (
                  <li key={post.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(post);
                        onClose();
                      }}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50"
                    >
                      {post.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image_url}
                          alt=""
                          className="h-14 w-20 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-14 w-20 shrink-0 rounded-lg bg-slate-100" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900">{post.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {categoryLabel}
                          {post.read_time_minutes
                            ? ` · ${post.read_time_minutes} min read`
                            : ""}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                          {post.excerpt}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs text-slate-500">
            Or start with an empty card and fill fields manually
          </p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onSelect(null);
              onClose();
            }}
          >
            Blank article
          </Button>
        </div>
      </div>
    </div>
  );
}
