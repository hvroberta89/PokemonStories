create table public.prepared_rewards (
  id uuid primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  adventure_id uuid not null references public.adventures(id) on delete cascade,
  scene_id uuid,
  reward_type text not null check (reward_type in ('pokemon','item','badge','outfit','achievement','quest-item','card','sticker','narrative','custom')),
  label text not null check (char_length(trim(label)) between 1 and 120),
  amount integer not null check (amount between 1 and 99),
  physical_status text not null check (physical_status in ('queued','skipped')),
  unlocked_at timestamptz,
  unlocked_session_id uuid references public.sessions(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index prepared_rewards_adventure_idx on public.prepared_rewards (adventure_id, created_at);
alter table public.reward_grants add column prepared_reward_id uuid references public.prepared_rewards(id) on delete set null;
alter table public.prepared_rewards enable row level security;
create policy "Project owners can read prepared rewards" on public.prepared_rewards for select to authenticated
using (exists (select 1 from public.projects where projects.id = prepared_rewards.project_id and projects.owner_id = auth.uid()));
create policy "Project owners can create prepared rewards" on public.prepared_rewards for insert to authenticated
with check (exists (select 1 from public.projects where projects.id = prepared_rewards.project_id and projects.owner_id = auth.uid()));
create policy "Project owners can update prepared rewards" on public.prepared_rewards for update to authenticated
using (exists (select 1 from public.projects where projects.id = prepared_rewards.project_id and projects.owner_id = auth.uid()))
with check (exists (select 1 from public.projects where projects.id = prepared_rewards.project_id and projects.owner_id = auth.uid()));
create policy "Project owners can delete prepared rewards" on public.prepared_rewards for delete to authenticated
using (exists (select 1 from public.projects where projects.id = prepared_rewards.project_id and projects.owner_id = auth.uid()));
