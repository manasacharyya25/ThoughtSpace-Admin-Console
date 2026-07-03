-- Rich text support for blog_posts
-- Run in Supabase SQL editor or: supabase db push
-- Existing rows stay content_format = 'plain' with content_json = null

alter table public.blog_posts
  add column if not exists content_format text not null default 'plain'
    constraint blog_posts_content_format_check
    check (content_format in ('plain', 'tiptap'));

alter table public.blog_posts
  add column if not exists content_json jsonb;

comment on column public.blog_posts.content is
  'Plain-text fallback. Legacy posts use this as source of truth. Rich posts store searchable text here too.';

comment on column public.blog_posts.content_format is
  'plain = legacy paragraph text in content; tiptap = rich document in content_json';

comment on column public.blog_posts.content_json is
  'TipTap / ProseMirror document JSON when content_format = tiptap';

-- Rich posts must have JSON; plain posts must not
alter table public.blog_posts
  add constraint blog_posts_content_json_check
  check (
    (content_format = 'plain' and content_json is null)
    or (content_format = 'tiptap' and content_json is not null)
  );

create index if not exists blog_posts_content_format_idx
  on public.blog_posts (content_format);
