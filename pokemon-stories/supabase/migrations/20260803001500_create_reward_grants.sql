create table public.reward_grants (
  id uuid primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  session_id uuid not null references public.sessions(id) on delete cascade,
  adventure_id uuid not null references public.adventures(id) on delete restrict,
  recipient_id uuid references public.characters(id) on delete set null,
  recipient_name text not null,
  reward_type text not null check (
    reward_type in ('pokemon', 'item', 'badge', 'outfit', 'achievement', 'quest-item', 'card', 'sticker', 'narrative', 'custom')
  ),
  label text not null check (char_length(trim(label)) between 1 and 120),
  amount integer not null check (amount > 0),
  narrative_status text not null default 'unlocked' check (narrative_status in ('unlocked', 'revoked')),
  physical_status text not null default 'not-requested' check (
    physical_status in ('not-requested', 'queued', 'printed', 'skipped')
  ),
  delivery_status text not null default 'pending' check (delivery_status in ('pending', 'given')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reward_grants_project_idx on public.reward_grants (project_id, created_at desc);
create index reward_grants_recipient_idx on public.reward_grants (recipient_id, created_at desc);
create index reward_grants_session_idx on public.reward_grants (session_id);

alter table public.reward_grants enable row level security;

create policy "Project owners can read reward grants"
on public.reward_grants for select to authenticated
using (exists (
  select 1 from public.projects
  where projects.id = reward_grants.project_id and projects.owner_id = auth.uid()
));

create policy "Project owners can create reward grants"
on public.reward_grants for insert to authenticated
with check (exists (
  select 1 from public.projects
  where projects.id = reward_grants.project_id and projects.owner_id = auth.uid()
));

create policy "Project owners can update reward grants"
on public.reward_grants for update to authenticated
using (exists (
  select 1 from public.projects
  where projects.id = reward_grants.project_id and projects.owner_id = auth.uid()
))
with check (exists (
  select 1 from public.projects
  where projects.id = reward_grants.project_id and projects.owner_id = auth.uid()
));
