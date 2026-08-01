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
