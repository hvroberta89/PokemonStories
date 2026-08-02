# ADR-002: Hosted Supabase and Authentication

## Status

Accepted

## Decision

Pokémon Stories uses hosted Supabase for persistent application data and
Supabase Auth with verified email and password authentication.

- The Angular client receives only the project URL and publishable key.
- Secret and `service_role` keys must never be included in client code.
- Database changes are defined in version-controlled SQL migrations.
- Every user-owned table enables Row Level Security explicitly.
- Policies use `auth.uid()` to isolate each Game Master's data.
- Data API grants are explicit and follow least privilege.
- Poke5e snapshots remain versioned reference assets until their database import
  is implemented as a separate migration process.

## Consequences

Users must authenticate before accessing Projects or live Sessions. Creating an
account requires email confirmation. A hosted environment requires production
SMTP configuration before external users are invited.
