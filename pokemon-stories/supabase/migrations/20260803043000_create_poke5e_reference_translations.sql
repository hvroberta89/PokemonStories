create table public.poke5e_reference_translations (
  dataset text not null check (dataset in ('pokemon', 'moves', 'abilities', 'items', 'technical-machines')),
  record_id text not null,
  locale text not null check (locale in ('hu')),
  payload jsonb not null,
  source_import_id uuid not null references public.poke5e_reference_imports(id) on delete restrict,
  updated_at timestamptz not null default now(),
  primary key (dataset, record_id, locale),
  foreign key (dataset, record_id) references public.poke5e_reference_records(dataset, record_id) on delete cascade
);

create index poke5e_reference_translations_import_idx on public.poke5e_reference_translations (source_import_id);

alter table public.poke5e_reference_translations enable row level security;

create policy "Authenticated users can read Poke5e reference translations"
on public.poke5e_reference_translations for select to authenticated using (true);