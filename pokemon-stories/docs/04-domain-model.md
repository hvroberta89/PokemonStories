# Domain Model

## Purpose

This document defines the core domain concepts of Pokémon Stories.

It establishes a shared language for developers, designers and AI assistants.

Every feature, API, UI component and business rule should use the terminology defined here.

The domain model describes **what the application is**, not how it is implemented.

---

# Core Domain

Pokémon Stories is an AI-assisted storytelling platform for Pokémon tabletop role-playing games.

The application supports the complete lifecycle of a campaign:

```text
Project

↓

Adventure

↓

Session

↓

Summary

↓

World Evolution
```

The application never replaces the Game Master.

Instead, it assists creativity, preparation and live storytelling.

---

# Ubiquitous Language

The following terms have precise meanings inside the project.

These names should be used consistently throughout the codebase and documentation.

---

# Project

A Project represents an entire campaign world.

A Project is the highest-level object in the application.

It contains everything related to a single campaign.

Examples:

- Pokémon Adventures with Emma and Marci
- Kanto Beginner Campaign
- Orange Islands

A Project owns:

- Adventures
- Characters
- NPCs
- Locations
- World Facts
- Collections
- Session History

A Project is long-lived.

Multiple Adventures belong to a single Project.

---

# Adventure

An Adventure is a playable story inside a Project.

It represents one mission, quest or episode.

Examples:

- The Lost Pokémon Egg
- The Mist Forest
- The Secret Laboratory

An Adventure contains:

- Story
- Scenes
- NPCs
- Locations
- Encounters
- Rewards
- Endings
- Secrets
- Twists

An Adventure can exist in different states.

Example lifecycle:

```text
Idea

↓

Designing

↓

Ready

↓

Running

↓

Completed

↓

Archived
```

---

# Scene

A Scene is the smallest meaningful storytelling unit.

Examples:

- Forest Entrance
- Abandoned Cabin
- Cave
- Laboratory

A Scene answers:

- Where are the players?
- What is happening?
- What is the objective?
- Which NPCs are present?

Scenes are sequential but not necessarily linear.

The Game Master always decides how the story progresses.

---

# Session

A Session represents one live play session.

A Session is created when an Adventure begins.

A Session contains:

- Timeline
- Notes
- Current Scene
- Rewards
- AI interactions

A Session is temporary.

Its outcome updates the Project.

---

# Character

A Character represents one player character.

Characters persist across Adventures.

A Character owns:

- Pokémon
- Inventory
- Badges
- Achievements
- Story Progress

Characters evolve over time.

---

# Pokémon

A Pokémon is part of a Character's story.

A Pokémon may have multiple states.

Examples:

- Seen
- Encountered
- Caught
- Trained
- Evolved

The application stores story progression rather than competitive battle statistics.

---

# NPC

A Non-Player Character is controlled by the Game Master.

NPCs may appear in multiple Adventures.

Examples:

- Professor Oak
- Nurse Joy
- Forest Ranger

NPCs belong to the Project rather than individual Sessions.

---

# Location

A Location is a reusable place inside the campaign world.

Examples:

- Viridian Forest
- Pewter City
- Hidden Cave

Locations may be shared between Adventures.

A Session references Locations rather than creating duplicates.

---

# Encounter

An Encounter is an interactive challenge.

Examples:

- Wild Pokémon
- Puzzle
- Conversation
- Environmental Hazard
- Battle

An Encounter always exists inside a Scene.

---

# Reward

A Reward represents something earned during the story.

Examples:

- Pokémon
- Item
- Badge
- Outfit
- Achievement
- Sticker
- Card

A Reward exists independently of printing.

Printing is only one possible representation.

Reward lifecycle:

```text
Prepared

↓

Unlocked

↓

Printed

↓

Given
```

Printing and ownership are separate concepts.

---

# Collection

The Collection represents all earned content.

Examples:

- Pokédex
- Inventory
- Badges
- Achievements
- Cards

The Collection reflects long-term progression across Adventures.

---

# World Fact

A World Fact describes permanent knowledge about the campaign world.

Examples:

- The bridge has been repaired.
- Team Rocket controls the laboratory.
- The old forest is now safe.

World Facts evolve after Sessions.

---

# Narrative Context

Narrative Context is the information provided to the AI.

It is intentionally limited.

It may include:

- Current Adventure
- Relevant Characters
- Relevant NPCs
- Relevant Locations
- Relevant World Facts
- Session History Summary

The entire Project is never sent to the AI.

The Narrative Context is assembled by the Application layer.

---

# AI Suggestion

An AI Suggestion is a proposal.

It is never part of the domain until accepted by the Game Master.

Examples:

- Story Idea
- NPC
- Reward
- Encounter
- Ending
- Twist

Suggestion lifecycle:

```text
Generated

↓

Reviewed

↓

Accepted

↓

Edited

↓

Saved
```

Rejected suggestions are discarded.

---

# Timeline Entry

A Timeline Entry records something that happened during a Session.

Examples:

- Pikachu was caught.
- The bridge collapsed.
- Professor Oak appeared.

Timeline Entries build the Session Summary.

---

# Session Summary

A Session Summary is a narrative description of completed gameplay.

It includes:

- Major events
- Decisions
- New NPCs
- New Locations
- Rewards
- World changes

The Summary is reviewed before updating the Project.

---

# World Update

A World Update applies permanent changes after a Session.

Examples:

- New NPC
- Updated Character
- New World Fact
- Completed Adventure

Updates require explicit approval.

Nothing is applied automatically.

---

# Printing

Printing is an infrastructure capability.

The domain only knows that a Reward can be represented physically.

The domain does not know:

- printer brand
- Bluetooth
- export format
- operating system

Printing never affects ownership.

---

# Relationships

```text
Project
│
├── Adventures
│
├── Characters
│
├── NPCs
│
├── Locations
│
├── Collection
│
└── Session History

Adventure
│
├── Scenes
│
├── Encounters
│
├── Rewards
│
└── Sessions

Session
│
├── Timeline
│
├── Notes
│
├── AI Suggestions
│
└── Rewards
```

---

# Aggregate Boundaries

The initial aggregate roots are expected to be:

- Project
- Adventure
- Session
- Character
- Collection

Additional aggregates should only be introduced when justified by business complexity.

---

# Domain Principles

The domain follows these principles:

- Story first
- Player-centric
- AI assisted
- Technology independent
- Immutable by default
- Explicit state transitions
- User approval before permanent changes

---

# Guiding Principle

The domain exists to model the story.

Technology, AI providers, databases and user interfaces exist only to support that story.