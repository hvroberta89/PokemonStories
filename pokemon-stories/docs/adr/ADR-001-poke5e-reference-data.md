# ADR-001: Poke5e Reference Data

## Status

Accepted

## Context

Pokémon Stories needs a stable reference catalogue for Pokémon tabletop data.
Poke5e provides the selected source material, but its public website and internal
storage are allowed to evolve independently from this application.

Permission was granted to use the Poke5e data for non-commercial fan use. This
permission does not extend to commercial use.

## Decision

Pokémon Stories owns its reference-data contract and imports versioned snapshots
from a local Poke5e source checkout.

- Runtime features never call undocumented Poke5e endpoints.
- Importers validate and normalize upstream data into our own stable schema.
- Every snapshot records the upstream version, import time and checksum.
- Poke5e provenance and the non-commercial restriction remain visible.
- Imported artwork is excluded until its usage and storage are decided separately.
- Project, Adventure, Session and Character data never depend on Poke5e storage.

The initial datasets are the Pokémon, Move, Ability, Item and Technical Machine
catalogues. Evolutions will be added as a separate, validated slice.

Pokémon Stories supports only the current Poke5e 2024 ruleset. Technical Machines
are derived from the `tm` metadata on Move records. The legacy 2018 `tms.json`
dataset is intentionally not imported.

References that do not resolve to a known record are removed from the normalized
snapshot and recorded in the manifest validation report. This prevents malformed
upstream data from silently entering the application while preserving an audit
trail for correction.

## Consequences

The application remains available when Poke5e is offline and upstream schema
changes cannot silently break live gameplay. Updating reference data becomes an
explicit, reviewable operation. Each new upstream release requires importing,
validating and reviewing a new snapshot.

The application and imported data must remain non-commercial unless a new
permission replaces the current restriction.
