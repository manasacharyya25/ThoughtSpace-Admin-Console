"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { JSONContent } from "@tiptap/react";
import { AdminShell } from "@/components/admin-shell";
import { RichTextEditor } from "@/components/rich-text-editor";
import { PexelsImageSearch } from "@/components/pexels-image-search";
import { Button, FieldError, Input, Label, Select, Textarea } from "@/components/ui";
import type { PexelsPhotoResult } from "@/lib/pexels";
import {
  emptyTipTapDoc,
  estimateReadTimeFromText,
  postToEditorDoc,
  tiptapDocToPlainText,
} from "@/lib/tiptap-content";
import {
  BLOG_CATEGORIES,
  BLOG_PILLAR_SLUGS,
  type BlogPostRow,
} from "@/types/blog";

export type BlogFormValues = {
  slug: string;
  title: string;
  excerpt: string;
  image_url: string;
  image_alt: string;
  image_accent: string;
  image_label: string;
  image_credit: string;
  image_credit_url: string;
  category_id: (typeof BLOG_CATEGORIES)[number]["id"];
  pillar_slug: string;
  status: "draft" | "published";
  featured: boolean;
  read_time_minutes: string;
};

const EMPTY_FORM: BlogFormValues = {
  slug: "",
  title: "",
  excerpt: "",
  image_url: "/blog/",
  image_alt: "",
  image_accent: "bg-[#2F9CFA]",
  image_label: "",
  image_credit: "",
  image_credit_url: "",
  category_id: "connection",
  pillar_slug: "",
  status: "draft",
  featured: false,
  read_time_minutes: "",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function rowToForm(post: BlogPostRow): BlogFormValues {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    image_url: post.image_url,
    image_alt: post.image_alt,
    image_accent: post.image_accent,
    image_label: post.image_label ?? "",
    image_credit: post.image_credit ?? "",
    image_credit_url: post.image_credit_url ?? "",
    category_id: post.category_id,
    pillar_slug: post.pillar_slug ?? "",
    status: post.status,
    featured: post.featured,
    read_time_minutes: post.read_time_minutes?.toString() ?? "",
  };
}

type BlogFormProps = {
  post?: BlogPostRow;
  mode: "create" | "edit";
};

export function BlogForm({ post, mode }: BlogFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<BlogFormValues>(
    post ? rowToForm(post) : EMPTY_FORM
  );
  const [editorDoc, setEditorDoc] = useState<JSONContent>(() =>
    post
      ? postToEditorDoc({
          content: post.content,
          content_format: post.content_format ?? "plain",
          content_json: post.content_json as JSONContent | null,
        })
      : emptyTipTapDoc()
  );
  const [plainText, setPlainText] = useState(() =>
    post ? tiptapDocToPlainText(postToEditorDoc({
      content: post.content,
      content_format: post.content_format ?? "plain",
      content_json: post.content_json as JSONContent | null,
    })) : ""
  );
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(mode === "create");
  const [upgradingFromPlain, setUpgradingFromPlain] = useState(
    post ? (post.content_format ?? "plain") === "plain" : false
  );

  const content = useMemo(() => tiptapDocToPlainText(editorDoc), [editorDoc]);

  const estimatedReadTime = useMemo(
    () => estimateReadTimeFromText(plainText || content),
    [plainText, content]
  );

  function updateField<K extends keyof BlogFormValues>(
    key: K,
    value: BlogFormValues[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && autoSlug) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  function applyPexelsPhoto(photo: PexelsPhotoResult) {
    setForm((prev) => ({
      ...prev,
      image_url: photo.imageUrl,
      image_alt: photo.alt,
      image_credit: photo.credit,
      image_credit_url: photo.creditUrl,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const category = BLOG_CATEGORIES.find((c) => c.id === form.category_id);
    const readMinutes = form.read_time_minutes
      ? Number.parseInt(form.read_time_minutes, 10)
      : estimatedReadTime;

    const payload = {
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      content,
      content_format: "tiptap" as const,
      content_json: editorDoc,
      image_url: form.image_url,
      image_alt: form.image_alt,
      image_accent: form.image_accent || "bg-[#2F9CFA]",
      image_label: form.image_label || null,
      image_credit: form.image_credit || null,
      image_credit_url: form.image_credit_url || null,
      category_id: form.category_id,
      category_label: category?.label ?? form.category_id,
      pillar_slug: form.pillar_slug || null,
      status: form.status,
      featured: form.featured,
      read_time_minutes: Number.isFinite(readMinutes) ? readMinutes : null,
    };

    const url =
      mode === "create" ? "/api/blog-posts" : `/api/blog-posts/${post!.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as {
      error?: string;
      details?: { fieldErrors: Record<string, string[]> };
    };

    if (!response.ok) {
      if (result.details?.fieldErrors) {
        const mapped: Record<string, string> = {};
        for (const [key, messages] of Object.entries(
          result.details.fieldErrors
        )) {
          mapped[key] = messages[0] ?? "Invalid value";
        }
        setFieldErrors(mapped);
      }
      setError(result.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    router.push("/blog");
    router.refresh();
  }

  return (
    <AdminShell>
      <div className="mb-6">
        <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to posts
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          {mode === "create" ? "New blog post" : "Edit blog post"}
        </h1>
        {upgradingFromPlain && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            This post uses legacy plain text. Saving will upgrade it to rich text
            format. The plain-text fallback column is preserved for search and
            compatibility.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-slate-900">Basics</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
              />
              <FieldError message={fieldErrors.title} />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  updateField("slug", e.target.value);
                }}
                placeholder="my-article-slug"
                required
              />
              <p className="mt-1 text-xs text-slate-400">/blog/{form.slug || "…"}</p>
              <FieldError message={fieldErrors.slug} />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value as "draft" | "published")
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="excerpt">Excerpt (SEO & cards, 20–500 chars)</Label>
              <Textarea
                id="excerpt"
                rows={3}
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-slate-400">{form.excerpt.length} / 500</p>
              <FieldError message={fieldErrors.excerpt} />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-900">Content</h2>
            <p className="text-xs text-slate-400">
              {content.length} chars · ~{estimatedReadTime} min read
            </p>
          </div>
          <RichTextEditor
            value={editorDoc}
            onChange={(doc) => {
              setEditorDoc(doc);
              setUpgradingFromPlain(false);
            }}
            onPlainTextChange={setPlainText}
            disabled={loading}
          />
          <FieldError message={fieldErrors.content} />
          <FieldError message={fieldErrors.content_json} />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-slate-900">Hero image</h2>

          <PexelsImageSearch
            defaultQuery={form.title}
            onSelect={applyPexelsPhoto}
            disabled={loading}
          />

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              or enter manually
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={form.image_url}
                onChange={(e) => updateField("image_url", e.target.value)}
                placeholder="/blog/my-image.jpg"
                required
              />
              <FieldError message={fieldErrors.image_url} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="image_alt">Alt text</Label>
              <Input
                id="image_alt"
                value={form.image_alt}
                onChange={(e) => updateField("image_alt", e.target.value)}
                required
              />
              <FieldError message={fieldErrors.image_alt} />
            </div>

            <div className="md:col-span-2 mt-2 border-t border-slate-100 pt-4">
              <p className="mb-3 text-sm font-medium text-slate-700">Card badge</p>
              <p className="mb-3 text-xs text-slate-500">
                Shown on the image overlay in blog cards and the article hero.
              </p>
            </div>
            <div>
              <Label htmlFor="image_label">Card label</Label>
              <Input
                id="image_label"
                value={form.image_label}
                onChange={(e) => updateField("image_label", e.target.value)}
                placeholder="Dialogue"
              />
            </div>
            <div>
              <Label htmlFor="image_accent">Badge accent class</Label>
              <Input
                id="image_accent"
                value={form.image_accent}
                onChange={(e) => updateField("image_accent", e.target.value)}
                placeholder="bg-[#2F9CFA]"
              />
            </div>

            <div className="md:col-span-2 mt-2 border-t border-slate-100 pt-4">
              <p className="mb-3 text-sm font-medium text-slate-700">Photo credit</p>
              <p className="mb-3 text-xs text-slate-500">
                Attribution shown below the hero image on the public article page.
              </p>
            </div>
            <div>
              <Label htmlFor="image_credit">Credit text</Label>
              <Input
                id="image_credit"
                value={form.image_credit}
                onChange={(e) => updateField("image_credit", e.target.value)}
                placeholder="Abner Velázquez"
              />
              <FieldError message={fieldErrors.image_credit} />
            </div>
            <div>
              <Label htmlFor="image_credit_url">Credit link (optional)</Label>
              <Input
                id="image_credit_url"
                type="url"
                value={form.image_credit_url}
                onChange={(e) => updateField("image_credit_url", e.target.value)}
                placeholder="https://unsplash.com/@photographer"
              />
              <FieldError message={fieldErrors.image_credit_url} />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-slate-900">Taxonomy</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="category_id">Category</Label>
              <Select
                id="category_id"
                value={form.category_id}
                onChange={(e) =>
                  updateField(
                    "category_id",
                    e.target.value as BlogFormValues["category_id"]
                  )
                }
              >
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="pillar_slug">SEO pillar (optional)</Label>
              <Select
                id="pillar_slug"
                value={form.pillar_slug}
                onChange={(e) => updateField("pillar_slug", e.target.value)}
              >
                <option value="">None</option>
                {BLOG_PILLAR_SLUGS.map((slug) => (
                  <option key={slug} value={slug}>
                    {slug}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="read_time_minutes">Read time (minutes)</Label>
              <Input
                id="read_time_minutes"
                type="number"
                min={1}
                max={120}
                value={form.read_time_minutes}
                onChange={(e) => updateField("read_time_minutes", e.target.value)}
                placeholder={String(estimatedReadTime)}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateField("featured", e.target.checked)}
                  className="rounded border-slate-300"
                />
                Featured post
              </label>
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving…"
              : mode === "create"
                ? "Create post"
                : "Save changes"}
          </Button>
          <Link href="/blog">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </AdminShell>
  );
}
