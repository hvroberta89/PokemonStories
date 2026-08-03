create table public.world_facts (
  id uuid primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  text text not null check (char_length(trim(text)) between 1 and 400),
  category text not null check (category in ('general','character','npc','location','relationship','story-state','custom')),
  status text not null check (status in ('active','archived')) default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index world_facts_project_updated_idx on public.world_facts (project_id, updated_at desc);
alter table public.world_facts enable row level security;
create policy "Project owners can manage world facts" on public.world_facts for all to authenticated
using (exists (select 1 from public.projects where projects.id = world_facts.project_id and projects.owner_id = auth.uid()))
with check (exists (select 1 from public.projects where projects.id = world_facts.project_id and projects.owner_id = auth.uid()));