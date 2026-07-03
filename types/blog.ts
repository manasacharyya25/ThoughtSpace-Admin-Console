export type BlogPostStatus = "draft" | "published";

export type BlogContentFormat = "plain" | "tiptap";

export type BlogPostCategoryId =
  | "connection"
  | "philosophy"
  | "privacy"
  | "product";

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  content_format?: BlogContentFormat;
  content_json?: Record<string, unknown> | null;
  image_url: string;
  image_alt: string;
  image_accent: string;
  image_label: string | null;
  image_credit?: string | null;
  image_credit_url?: string | null;
  category_id: BlogPostCategoryId;
  category_label: string;
  pillar_slug: string | null;
  status: BlogPostStatus;
  featured: boolean;
  read_time_minutes: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export const BLOG_CATEGORIES: { id: BlogPostCategoryId; label: string }[] = [
  { id: "connection", label: "Connection" },
  { id: "philosophy", label: "Philosophy" },
  { id: "privacy", label: "Privacy" },
  { id: "product", label: "Product" },
];

export const BLOG_PILLAR_SLUGS = [
  "anonymous-chat",
  "omegle-alternative",
  "make-friends-online",
] as const;
