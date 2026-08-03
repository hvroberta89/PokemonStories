alter table public.world_facts drop constraint world_facts_status_check;
alter table public.world_facts add constraint world_facts_status_check
check (status in ('active', 'superseded', 'archived'));