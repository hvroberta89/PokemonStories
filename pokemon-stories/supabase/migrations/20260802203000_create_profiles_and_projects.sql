create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (
    display_name is null or char_length(trim(display_name)) between 1 and 80
  )
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_name_length check (char_length(trim(name)) between 1 and 80),
  constraint projects_description_length check (
    description is null or char_length(trim(description)) between 1 and 500
  ),
  constraint projects_status check (status in ('active', 'archived'))
);

create index projects_owner_id_idx on public.projects (owner_id);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.projects from anon, authenticated;

grant select, update on table public.profiles to authenticated;
grant select, insert, update on table public.projects to authenticated;

create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users can read their own projects"
on public.projects for select
to authenticated
using ((select auth.uid()) = owner_id);

create policy "Users can create their own projects"
on public.projects for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy "Users can update their own projects"
on public.projects for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''));
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
