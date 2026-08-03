# Game Master Library Specification

## Status

Planned

---

# Goal

The Game Master Library is a global reference system available outside of any project.

Its purpose is to provide quick access to Pokémon TTRPG reference material while designing adventures and running live sessions.

The Library is **not** project-specific.

Projects may reference Library items, but never own them.

---

# Product Philosophy

The Game Master Library exists to reduce the amount of time a Game Master spends searching through external websites during preparation and gameplay.

Instead of opening Poke5e or PDFs in another browser tab, the Game Master should be able to find everything inside Pokémon Stories.

The Library is a reference system.

It is not a database editor.

---

# Primary Goals

The Library should allow the Game Master to:

- search Pokémon
- browse Moves
- browse Abilities
- browse Items
- browse Technical Machines
- quickly open rule references
- favourite frequently used content
- immediately use library content inside Adventures and Running Sessions

---

# Navigation

The Library is available globally.

It is accessible even when no Project is selected.

Application

```
Projects

Library

Settings
```

After opening a Project, the Library remains globally accessible.

---

# Information Architecture

Library

```
Pokemon
Moves
Abilities
Items
Technical Machines
Favorites
Recent
```

Future sections:

```
Conditions
Types
Rules
Encounter Builder
GM Guides
```

These are intentionally excluded from the MVP.

---

# Design Principles

The Library is designed for speed.

It should require:

- minimal navigation
- powerful search
- instant loading
- mobile-first interaction

The Game Master should never need more than:

Search

↓

Open

↓

Use

for the most common workflows.

---

# Pokémon Browser

The Pokémon browser displays all available Pokémon reference entries.

Each card displays:

- artwork (optional)
- Pokémon name
- Pokédex number
- primary type
- secondary type
- CR / level information (when available)

Selecting a Pokémon opens the detail page.

---

# Pokémon Detail

Example:

```
Pikachu

Electric

--------------------

Stats

Abilities

Moves

Evolution

Habitat

Description
```

Actions:

```
Add to Adventure

Use in Session

Favourite

Copy Link
```

The detail page must never allow editing.

Library content is read-only.

---

# Search

Every library section supports:

- full text search
- filtering
- sorting

Pokémon filters:

- type
- generation
- habitat
- evolution stage

Items:

- category

Moves:

- type
- damage class
- level

Abilities:

- category

---

# Favorites

Any reference item can be favourited.

Favorites are user-specific.

Projects do not own favorites.

---

# Recent

Recently opened reference items.

Maximum:

20 items

Newest first.

---

# Read-only Content

Library data cannot be modified.

Reasons:

- reference consistency
- easier updates
- deterministic AI context

Custom content belongs to Projects.

---

# Integration with Adventure Designer

Every designer screen may import Library entries.

Examples:

NPC encounter

↓

Choose Pokémon

↓

Library

Reward

↓

Choose Item

↓

Library

Encounter

↓

Choose Move

↓

Library

The Designer stores only references.

---

# Integration with Running Session

The Library is directly available from Quick Actions.

Quick Action

```
+

↓

Pokémon

↓

Search

↓

Use
```

Using a Pokémon creates a session entity referencing the selected Pokémon.

The original reference data remains unchanged.

---

# Session Integration

Example flow:

```
Search Pikachu

↓

Use in Session

↓

Role

Friendly

Wild

Enemy

Companion

↓

Save
```

Only session-specific information is created.

Reference data is shared.

---

# AI Integration

The AI never receives the complete Library.

Instead:

User request

↓

Reference Resolver

↓

Relevant entries

↓

Narrative Context

↓

LLM

Only relevant reference data should be included.

---

# Reference Model

Reference entities are immutable.

Example:

PokemonSpeciesReference

MoveReference

AbilityReference

ItemReference

TechnicalMachineReference

Instances created during gameplay reference these immutable records.

Example:

PokemonInstance

InventoryItem

KnownMove

NPCPokemon

---

# Project References

Projects never duplicate Library content.

Instead they reference it.

Example:

Adventure Encounter

↓

PokemonSpeciesReferenceId

This allows Library updates without modifying project data.

---

# Source Data

The initial implementation uses the locally imported Poke5e reference dataset.

Runtime code must never depend on undocumented Poke5e APIs.

The import pipeline is already responsible for:

- validation
- normalization
- versioning

The UI consumes only Pokémon Stories reference models.

---

# Offline Support

Reference data should be available offline.

Searching must work without internet access.

---

# Performance

Search results should appear instantly.

The application should never request data from external services while browsing the Library.

---

# Permissions

The Library is available for every authenticated user.

Projects do not affect Library visibility.

---

# Future Extensions

Future versions may include:

- Rule Browser
- Encounter Builder
- Encounter Templates
- GM Cheat Sheets
- Random Tables
- Conditions
- Type Matchup Calculator
- Dice Reference
- Printable Reference Cards

These are explicitly outside the MVP.

---

# UI Components

The Library module should contain reusable components.

Example:

LibrarySearchBar

LibrarySectionTabs

PokemonCard

ReferenceList

ReferenceDetail

FavoriteButton

RecentList

ReferenceBadge

ReferenceTag

---

# Suggested Routes

```
/library

/library/pokemon

/library/pokemon/:id

/library/moves

/library/moves/:id

/library/items

/library/items/:id

/library/abilities

/library/abilities/:id

/library/tms

/library/tms/:id

/library/favorites

/library/recent
```

---

# Acceptance Criteria

The MVP is complete when:

✓ Library is globally accessible

✓ Pokémon can be searched

✓ Pokémon details can be opened

✓ Pokémon can be favourited

✓ Pokémon can be used inside Running Session

✓ Pokémon can be selected inside Adventure Designer

✓ No Library content is editable

✓ Runtime never depends on external Poke5e APIs

✓ Project data stores only references

✓ Search works offline
