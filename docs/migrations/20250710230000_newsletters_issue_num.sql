-- Promote issue number from state.issueNum into a first-class column
-- Run in Supabase SQL editor

alter table public.newsletters
  add column if not exists issue_num text;

update public.newsletters
set issue_num = coalesce(nullif(trim(state->>'issueNum'), ''), '00')
where issue_num is null;

alter table public.newsletters
  alter column issue_num set not null;

alter table public.newsletters
  alter column issue_num set default '00';

create index if not exists newsletters_issue_num_idx
  on public.newsletters (issue_num);
