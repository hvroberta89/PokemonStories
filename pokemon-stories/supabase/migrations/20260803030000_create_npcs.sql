create table public.npcs (
  id uuid primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 100),
  role text not null check (char_length(trim(role)) between 1 and 160),
  description text check (description is null or char_length(trim(description)) <= 500),
  status text not null check (status in ('active','archived')) default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index npcs_project_created_idx on public.npcs (project_id, created_at);
alter table public.npcs enable row level security;
create policy "Project owners can manage NPCs" on public.npcs for all to authenticated
using (exists (select 1 from public.projects where projects.id = npcs.project_id and projects.owner_id = auth.uid()))
with check (exists (select 1 from public.projects where projects.id = npcs.project_id and projects.owner_id = auth.uid()));