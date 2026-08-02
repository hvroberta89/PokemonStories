create table public.adventures (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  premise text not null,
  status text not null default 'draft',
  audience_profile jsonb not null,
  story jsonb not null default '{}'::jsonb,
  scenes jsonb not null default '[]'::jsonb,
  expected_character_ids jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint adventures_title_length check (char_length(trim(title)) between 1 and 100),
  constraint adventures_premise_length check (char_length(trim(premise)) between 1 and 1000),
  constraint adventures_status check (status in ('draft', 'ready', 'completed', 'archived')),
  constraint adventures_audience_object check (jsonb_typeof(audience_profile) = 'object'),
  constraint adventures_story_object check (jsonb_typeof(story) = 'object'),
  constraint adventures_scenes_array check (jsonb_typeof(scenes) = 'array'),
  constraint adventures_characters_array check (jsonb_typeof(expected_character_ids) = 'array')
);

create index adventures_project_id_idx on public.adventures (project_id);
create unique index adventures_project_title_unique
on public.adventures (project_id, lower(title));

alter table public.adventures enable row level security;

revoke all on table public.adventures from anon, authenticated;
grant select, insert, update on table public.adventures to authenticated;

create policy "Project owners can read adventures"
on public.adventures for select to authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = adventures.project_id
      and projects.owner_id = (select auth.uid())
  )
);

create policy "Project owners can create adventures"
on public.adventures for insert to authenticated
with check (
  exists (
    select 1 from public.projects
    where projects.id = adventures.project_id
      and projects.owner_id = (select auth.uid())
  )
);

create policy "Project owners can update adventures"
on public.adventures for update to authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = adventures.project_id
      and projects.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.projects
    where projects.id = adventures.project_id
      and projects.owner_id = (select auth.uid())
  )
);
