# Spaces app: rich blog rendering handoff

Give this document to the agent updating the **Spaces** public app (`c:\Workspace\Spaces`).

## Context

The **ThoughtSpace Admin** console now saves blog posts in two formats:

| `content_format` | Source of truth | `content` column | `content_json` column |
|------------------|-----------------|------------------|------------------------|
| `plain` (default) | `content` | `\n\n`-separated paragraphs | `null` |
| `tiptap` | `content_json` | plain-text fallback (search, read time) | TipTap ProseMirror JSON |

**All existing seeded posts remain `plain`.** Do not migrate them unless explicitly edited in admin.

## Prerequisite

Apply the DB migration first:

```
docs/migrations/20250703000001_blog_rich_content.sql
```

(in the Admin repo, or copy to `Spaces/supabase/migrations/`)

## Files to update in Spaces

### 1. Types — `types/blog-row.ts`

Add:

```ts
export type BlogContentFormat = "plain" | "tiptap";

// On BlogPostRow:
content_format?: BlogContentFormat;
content_json?: Record<string, unknown> | null;
```

### 2. Types — `types/blog.ts`

Extend `BlogPost`:

```ts
export type BlogPost = {
  // ...existing fields
  contentFormat: "plain" | "tiptap";
  contentJson?: Record<string, unknown> | null;
};
```

### 3. Mapper — `lib/blog-mapper.ts`

- Select `content_format, content_json` in queries (via `lib/supabase/blog.ts` BLOG_POST_SELECT).
- In `mapBlogPostRow`:
  - If `content_format === 'tiptap'` && `content_json`: set `contentFormat: 'tiptap'`, `contentJson`, and still derive `content: string[]` from plain `content` column OR from JSON for backward compat.
  - Else: `contentFormat: 'plain'`, parse `content` with existing `parseContent()`.

### 4. Supabase query — `lib/supabase/blog.ts`

Add to `BLOG_POST_SELECT`:

```
content_format,
content_json,
```

### 5. Renderer — new `components/blog/blog-rich-content.tsx`

Install in Spaces:

```bash
npm install @tiptap/html @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-highlight @tiptap/extension-underline
```

Render TipTap JSON to React HTML:

```tsx
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import { PullQuote } from "@/lib/tiptap/pull-quote"; // copy from admin repo

const extensions = [StarterKit, PullQuote, Link, Highlight, Underline];

export function BlogRichContent({ doc }: { doc: Record<string, unknown> }) {
  const html = generateHTML(doc, extensions);
  return (
    <div
      className="prose-blog font-claude-response-body ..."
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

Add matching CSS in `globals.css` for `.prose-blog` (headings, blockquote, **pull quote**, mark/highlight, lists, links, hr, **code/pre**) — mirror admin `app/globals.css` `.prose-editor` rules but use public site colors (`#1C1D1E`, `#2F9CFA`).

**Pull quote:** copy `lib/tiptap/pull-quote.ts` from the admin repo. Renders as `<blockquote data-pull-quote="true" class="pull-quote">`. Style centered, larger type — see admin `globals.css`.

**Code block:** included in StarterKit; style `pre` / `code` blocks.

### 6. View — `components/blog/blog-post-view.tsx`

Replace the paragraph loop:

```tsx
{post.contentFormat === "tiptap" && post.contentJson ? (
  <BlogRichContent doc={post.contentJson} />
) : (
  <div className="prose-blog ... space-y-6">
    {post.content.map((paragraph) => (
      <p key={...}>{paragraph}</p>
    ))}
  </div>
)}
```

### 7. Static fallback — `lib/blog.ts`

No change needed for static `BLOG_POSTS` fallback — those remain plain `string[]` content. Only DB-backed posts can be `tiptap`.

### 8. Photo credit — hero image attribution

Apply migration: `docs/migrations/20250703100000_blog_image_credit.sql`

New columns on `blog_posts`:

| Column | Type | Notes |
|--------|------|--------|
| `image_credit` | text, nullable | e.g. `"Photo by Jane Doe"` |
| `image_credit_url` | text, nullable | Optional `https://…` link |

**Card label** (`image_label`) is unchanged — badge overlay on the image. **Photo credit** is separate — show below the hero on the article page.

Update in Spaces:

1. `types/blog-row.ts` — add `image_credit`, `image_credit_url`
2. `types/blog.ts` — extend `BlogPostImage`:
   ```ts
   credit?: string;
   creditUrl?: string;
   ```
3. `lib/supabase/blog.ts` — add columns to `BLOG_POST_SELECT`
4. `lib/blog-mapper.ts` — map credit fields
5. `components/blog/blog-post-view.tsx` — below `<BlogPostImage variant="hero" />`:
   ```tsx
   {post.image.credit && (
     <p className="mt-2 text-center text-xs text-[#1C1D1E]/45">
       {post.image.creditUrl ? (
         <a href={post.image.creditUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2F9CFA]">
           {post.image.credit}
         </a>
       ) : (
         post.image.credit
       )}
     </p>
   )}
   ```

Existing posts: both fields `null` — nothing rendered.

### 9. Pexels hero images

Blog posts may use hotlinked Pexels URLs (`https://images.pexels.com/...`). Add to `next.config.ts`:

```ts
images: {
  remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
},
```

Credits are auto-filled in admin as the **photographer name only** (link in `image_credit_url`). Public site can format e.g. `Photo by {name} on Pexels` when rendering if desired.

## TipTap JSON shape (reference)

Document root:

```json
{
  "type": "doc",
  "content": [
    { "type": "paragraph", "content": [{ "type": "text", "text": "Hello" }] },
    { "type": "heading", "attrs": { "level": 2 }, "content": [...] },
    { "type": "blockquote", "content": [...] },
    { "type": "pullQuote", "content": [{ "type": "paragraph", "content": [...] }] },
    { "type": "codeBlock", "content": [{ "type": "text", "text": "..." }] }
  ]
}
```

Marks on text nodes: `bold`, `italic`, `underline`, `strike`, `highlight`, `link` (with `attrs.href`).

## Testing checklist

- [ ] Existing plain posts render unchanged (paragraphs with spacing)
- [ ] New rich post from admin renders headings, bold, highlight, blockquote, pull quote, code blocks, lists, links
- [ ] Sitemap / metadata still use `title`, `excerpt` (unchanged)
- [ ] `getBlogPostsByPillar` works for both formats
- [ ] RLS unchanged — published posts only

## Admin reference

- Editor component: `ThoughtSpace Admin Cosole/components/rich-text-editor.tsx`
- Plain ↔ TipTap conversion: `lib/tiptap-content.ts`
- Pull quote extension: `lib/tiptap/pull-quote.ts`
- Validation: `content` min 100 chars (plain fallback), `content_json` required when `content_format = tiptap`
