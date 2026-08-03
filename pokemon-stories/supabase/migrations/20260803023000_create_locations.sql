create table public.locations (
  id uuid primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 100),
  description text check (description is null or char_length(trim(description)) <= 500),
  type text not null check (type in ('region','settlement','building','natural-area','landmark','room','custom')) default 'custom',
  status text not null check (status in ('active','archived')) default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index locations_project_created_idx on public.locations (project_id, created_at);
alter table public.locations enable row level security;
create policy "Project owners can manage locations" on public.locations for all to authenticated
using (exists (select 1 from public.projects where projects.id = locations.project_id and projects.owner_id = auth.uid()))
with check (exists (select 1 from public.projects where projects.id = locations.project_id and projects.owner_id = auth.uid()));