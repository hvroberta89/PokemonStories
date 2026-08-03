# Pokemon Stories

Angular application for running and recording Pokemon-themed tabletop story sessions.

## Architecture

The application uses standalone Angular components, signals, zoneless change detection, and lazy-loaded features. Business rules live in `src/app/domain`, use cases and ports in `src/app/application`, and concrete adapters in `src/app/infrastructure`.

Feature-specific UI state belongs to the feature store. Components receive typed view models and emit user intent through outputs.

## Development

```bash
npm start
npm test -- --watch=false
npm run build
npm run format:check
```

The production build enforces bundle budgets. Component styles have an 8 kB warning and 12 kB error threshold.

## Testing conventions

Required component inputs must be provided in every component fixture via `fixture.componentRef.setInput(...)` before Angular renders the template. This keeps the public component contract strict while making fixtures representative of real usage.

## Persistence

The active running session is persisted in browser local storage under the `pokemon-stories.running-session` key. The persisted format uses `schemaVersion`; update the decoder and add a migration when its shape changes.

## Poke5e Reference Data

Poke5e reference data is stored as a versioned local snapshot for non-commercial fan use only. The snapshot must be imported from a local Poke5e source checkout before it is migrated:

```bash
npm run data:import:poke5e -- <path-to-poke5e>
npm run data:migrate:poke5e -- --dry-run
```

Apply [20260803040000_create_poke5e_reference_data.sql](supabase/migrations/20260803040000_create_poke5e_reference_data.sql) in the target Supabase project, then run the database migration locally with a service-role key. Do not commit or share that key.

```powershell
$env:SUPABASE_URL = "https://<project-ref>.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "<service-role-key>"
npm run data:migrate:poke5e
```

### Hungarian Library Localization

The Library supports English and Hungarian reference content. Choose the language from the Library header. The selected language is saved in browser local storage.

Hungarian translations are kept as field-level overrides in [hu.json](public/reference-data/poke5e/translations/hu.json), while the source Poke5e snapshot stays unchanged. Missing translated fields fall back to their English source values.

Generate or refresh the machine-translated Hungarian overlays with:

```bash
npm run data:translate:poke5e:hu
```

Review game terminology and amend the generated values in `hu.json` before publishing. Validate the complete dataset locally with:

```bash
npm run data:migrate:poke5e -- --dry-run
```

Apply both reference-data migrations in the target Supabase project before publishing translations:

- [20260803040000_create_poke5e_reference_data.sql](supabase/migrations/20260803040000_create_poke5e_reference_data.sql)
- [20260803043000_create_poke5e_reference_translations.sql](supabase/migrations/20260803043000_create_poke5e_reference_translations.sql)

Then upload the reference snapshot and Hungarian translations:

```bash
npm run data:migrate:poke5e
```

After publishing, start the application with `npm start`, open `/library`, choose `Magyar`, and check the list, search, detail, favorite, Adventure, and Session workflows. Technical Machines currently use their English source values because they do not yet have localized records.
