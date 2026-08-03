create table public.poke5e_reference_imports (
  id uuid primary key,
  source_name text not null,
  source_url text not null,
  source_version text not null,
  source_commit text,
  schema_version integer not null,
  manifest jsonb not null,
  imported_at timestamptz not null
);

create table public.poke5e_reference_records (
  dataset text not null check (dataset in ('pokemon', 'moves', 'abilities', 'items', 'technical-machines')),
  record_id text not null,
  payload jsonb not null,
  source_import_id uuid not null references public.poke5e_reference_imports(id) on delete restrict,
  updated_at timestamptz not null default now(),
  primary key (dataset, record_id)
);

create index poke5e_reference_records_import_idx on public.poke5e_reference_records (source_import_id);

alter table public.poke5e_reference_imports enable row level security;
alter table public.poke5e_reference_records enable row level security;

create policy "Authenticated users can read Poke5e import metadata"
on public.poke5e_reference_imports for select to authenticated using (true);

create policy "Authenticated users can read Poke5e reference data"
on public.poke5e_reference_records for select to authenticated using (true);