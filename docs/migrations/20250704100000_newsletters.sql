-- Newsletter issues for admin builder + scheduled send (publish_at trigger added later)
-- Run in Supabase SQL editor before using /newsletter persistence

create table if not exists public.newsletters (
  id uuid primary key default gen_random_uuid(),
  publish_at timestamptz null,
  state jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists newsletters_publish_at_idx
  on public.newsletters (publish_at)
  where publish_at is not null;

create index if not exists newsletters_updated_at_idx
  on public.newsletters (updated_at desc);

create or replace function public.set_newsletters_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists newsletters_updated_at on public.newsletters;

create trigger newsletters_updated_at
  before update on public.newsletters
  for each row
  execute function public.set_newsletters_updated_at();
