-- Add draft/published visibility status (independent of publish_at schedule)
-- Run in Supabase SQL editor

alter table public.newsletters
  add column if not exists status text not null default 'draft';

alter table public.newsletters
  drop constraint if exists newsletters_status_check;

alter table public.newsletters
  add constraint newsletters_status_check
  check (status in ('draft', 'published'));

create index if not exists newsletters_status_idx
  on public.newsletters (status);
