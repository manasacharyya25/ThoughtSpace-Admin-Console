-- Public read access for published newsletters (ThoughtSpace webapp)
-- Run in Supabase SQL editor if not applied via migrations

alter table public.newsletters enable row level security;

drop policy if exists "Published newsletters are publicly readable"
  on public.newsletters;

create policy "Published newsletters are publicly readable"
  on public.newsletters for select
  to anon, authenticated
  using (status = 'published');
