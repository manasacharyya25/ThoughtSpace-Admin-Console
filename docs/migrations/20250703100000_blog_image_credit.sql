-- Photo credit attribution for blog hero images
-- Existing rows: both columns null (no credit shown)

alter table public.blog_posts
  add column if not exists image_credit text,
  add column if not exists image_credit_url text;

comment on column public.blog_posts.image_credit is
  'Attribution text e.g. "Photo by Jane Doe". Shown below hero on article page.';

comment on column public.blog_posts.image_credit_url is
  'Optional URL for photo credit (photographer portfolio, Unsplash, etc.).';

alter table public.blog_posts
  drop constraint if exists blog_posts_image_credit_length;

alter table public.blog_posts
  add constraint blog_posts_image_credit_length
  check (image_credit is null or char_length(image_credit) <= 200);

alter table public.blog_posts
  drop constraint if exists blog_posts_image_credit_url_length;

alter table public.blog_posts
  add constraint blog_posts_image_credit_url_length
  check (image_credit_url is null or char_length(image_credit_url) <= 500);
