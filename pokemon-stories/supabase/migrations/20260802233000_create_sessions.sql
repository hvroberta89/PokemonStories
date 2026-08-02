create table public.sessions (
  id uuid primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  adventure_id uuid not null references public.adventures(id) on delete restrict,
  status text not null check (status in ('running', 'review-pending', 'completed')),
  started_at timestamptz not null,
  completed_at timestamptz,
  state jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint completed_session_has_timestamp check (status = 'running' or completed_at is not null)
);

create index sessions_project_status_idx on public.sessions (project_id, status);
create index sessions_project_completed_idx on public.sessions (project_id, completed_at desc)
  where status = 'completed';

alter table public.sessions enable row level security;

create policy "Project owners can read sessions"
on public.sessions for select
to authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = sessions.project_id
      and projects.owner_id = auth.uid()
  )
);

create policy "Project owners can create sessions"
on public.sessions for insert
to authenticated
with check (
  exists (
    select 1 from public.projects
    where projects.id = sessions.project_id
      and projects.owner_id = auth.uid()
  )
);

create policy "Project owners can update sessions"
on public.sessions for update
to authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = sessions.project_id
      and projects.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects
    where projects.id = sessions.project_id
      and projects.owner_id = auth.uid()
  )
);

create policy "Project owners can delete sessions"
on public.sessions for delete
to authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = sessions.project_id
      and projects.owner_id = auth.uid()
  )
);
