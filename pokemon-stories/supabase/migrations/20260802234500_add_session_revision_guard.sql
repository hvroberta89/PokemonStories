alter table public.sessions
  add column revision bigint not null default 1;

create or replace function public.save_session_snapshot(
  session_id uuid,
  session_project_id uuid,
  session_adventure_id uuid,
  session_status text,
  session_started_at timestamptz,
  session_completed_at timestamptz,
  session_state jsonb,
  expected_revision bigint default null
)
returns bigint
language plpgsql
security invoker
set search_path = public
as $$
declare
  next_revision bigint;
begin
  if expected_revision is null then
    insert into public.sessions (
      id, project_id, adventure_id, status, started_at, completed_at, state
    ) values (
      session_id, session_project_id, session_adventure_id, session_status,
      session_started_at, session_completed_at, session_state
    )
    on conflict (id) do nothing
    returning revision into next_revision;

    if next_revision is null then
      raise exception 'The session has changed on another device.' using errcode = '40001';
    end if;
  else
    update public.sessions
    set status = session_status,
        completed_at = session_completed_at,
        state = session_state,
        updated_at = now(),
        revision = revision + 1
    where id = session_id
      and project_id = session_project_id
      and revision = expected_revision
    returning revision into next_revision;

    if next_revision is null then
      raise exception 'The session has changed on another device.' using errcode = '40001';
    end if;
  end if;

  return next_revision;
end;
$$;

revoke all on function public.save_session_snapshot(uuid, uuid, uuid, text, timestamptz, timestamptz, jsonb, bigint) from public;
grant execute on function public.save_session_snapshot(uuid, uuid, uuid, text, timestamptz, timestamptz, jsonb, bigint) to authenticated;
