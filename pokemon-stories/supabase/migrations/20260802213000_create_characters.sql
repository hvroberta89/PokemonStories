create table public.characters (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  description text,
  personality_notes text,
  goals text,
  story_notes text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint characters_name_length check (char_length(trim(name)) between 1 and 80),
  constraint characters_description_length check (
    description is null or char_length(trim(description)) <= 1000
  ),
  constraint characters_personality_notes_length check (
    personality_notes is null or char_length(trim(personality_notes)) <= 1000
  ),
  constraint characters_goals_length check (
    goals is null or char_length(trim(goals)) <= 1000
  ),
  constraint characters_story_notes_length check (
    story_notes is null or char_length(trim(story_notes)) <= 1000
  ),
  constraint characters_status check (status in ('active', 'archived'))
);

create index characters_project_id_idx on public.characters (project_id);
create unique index characters_project_name_unique
on public.characters (project_id, lower(name));

alter table public.characters enable row level security;

revoke all on table public.characters from anon, authenticated;
grant select, insert, update on table public.characters to authenticated;

create policy "Project owners can read characters"
on public.characters for select
to authenticated
using (
  exists (
    select 1
    from public.projects
    where projects.id = characters.project_id
      and projects.owner_id = (select auth.uid())
  )
);

create policy "Project owners can create characters"
on public.characters for insert
to authenticated
with check (
  exists (
    select 1
    from public.projects
    where projects.id = characters.project_id
      and projects.owner_id = (select auth.uid())
  )
);

create policy "Project owners can update characters"
on public.characters for update
to authenticated
using (
  exists (
    select 1
    from public.projects
    where projects.id = characters.project_id
      and projects.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.projects
    where projects.id = characters.project_id
      and projects.owner_id = (select auth.uid())
  )
);
