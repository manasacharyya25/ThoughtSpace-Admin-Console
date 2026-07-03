import { z } from "zod";

const categoryIdSchema = z.enum([
  "connection",
  "philosophy",
  "privacy",
  "product",
]);

const tiptapJsonSchema = z.record(z.unknown());

export const blogPostBaseSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Lowercase letters, numbers, hyphens only"
    ),
  title: z.string().min(3).max(200),
  excerpt: z.string().min(20).max(500),
  content: z.string().min(100).max(50000),
  content_format: z.enum(["plain", "tiptap"]).default("plain"),
  content_json: tiptapJsonSchema.nullable().optional(),
  image_url: z.string().min(1),
  image_alt: z.string().min(3).max(200),
  image_accent: z.string().default("bg-[#2F9CFA]"),
  image_label: z.string().nullable().optional(),
  image_credit: z.string().max(200).nullable().optional(),
  image_credit_url: z
    .string()
    .max(500)
    .nullable()
    .optional()
    .refine(
      (value) =>
        !value ||
        value.startsWith("http://") ||
        value.startsWith("https://"),
      { message: "Credit link must start with http:// or https://" }
    ),
  category_id: categoryIdSchema,
  category_label: z.string().min(1),
  pillar_slug: z.string().nullable().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
  read_time_minutes: z.number().int().min(1).max(120).nullable().optional(),
  published_at: z.string().nullable().optional(),
});

function richContentRefine<T extends z.ZodTypeAny>(schema: T) {
  return schema.superRefine((data, ctx) => {
    const record = data as z.infer<typeof blogPostBaseSchema>;
    if (record.content_format === "tiptap") {
      if (!record.content_json || typeof record.content_json !== "object") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Rich text posts require content_json",
          path: ["content_json"],
        });
      }
    }
  });
}

export const blogPostSchema = richContentRefine(blogPostBaseSchema);
export const blogPostPatchSchema = richContentRefine(blogPostBaseSchema.partial());

export type BlogPostInput = z.infer<typeof blogPostBaseSchema>;

export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
