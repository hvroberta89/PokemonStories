alter table public.poke5e_reference_translations
  drop constraint poke5e_reference_translations_dataset_check;

alter table public.poke5e_reference_records
  drop constraint poke5e_reference_records_dataset_check;

alter table public.poke5e_reference_records
  add constraint poke5e_reference_records_dataset_check
  check (dataset in ('pokemon', 'moves', 'abilities', 'items', 'technical-machines', 'origins'));

alter table public.poke5e_reference_translations
  add constraint poke5e_reference_translations_dataset_check
  check (dataset in ('pokemon', 'moves', 'abilities', 'items', 'technical-machines', 'origins'));