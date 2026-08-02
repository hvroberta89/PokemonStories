# Navigation

## Purpose

This document defines the navigation structure and information architecture of Pokémon Stories.

It describes how users move through the application, how screens are connected and how navigation changes depending on the current experience mode.

This document intentionally does not describe visual design.

Its purpose is to define navigation logic and screen relationships.

---

# Navigation Philosophy

Navigation should support the current task instead of exposing every available feature.

The application should always answer one question:

> What is the most likely thing the Game Master wants to do next?

The interface should guide users naturally without requiring them to remember where features are located.

---

# Information Architecture

The application consists of five primary experience areas.

```text
CREATE

↓

PREPARE

↓

PLAY

↓

COLLECT

↓

REMEMBER
```

These are experience modes rather than navigation entries.

Users should naturally move between them throughout the lifecycle of an Adventure.

---

# Global Navigation

Once a Project has been selected, the application exposes five primary navigation destinations.

```text
Home

Adventures

Play

Collection

More
```

This navigation remains consistent throughout the application except during an active Session.

---

# Home

Purpose:

Provide the next recommended action.

The Home screen should not behave like a dashboard.

Instead it answers:

> What should I do next?

Typical content:

- Continue current Adventure
- Resume Session
- Create Adventure
- Recent activity
- Quick access

---

# Adventures

Purpose:

Manage Adventures within the current Project.

Typical actions:

- Browse Adventures
- Create Adventure
- Continue designing
- Prepare Session
- View completed Adventures

---

# Play

Purpose:

Start or resume live gameplay.

Typical actions:

- Start Session
- Resume Session
- Review current Scene
- Continue running Adventure

If an active Session exists, Play should always navigate directly to it.

---

# Collection

Purpose:

Display long-term player progression.

Contains:

- Pokédex
- Inventory
- Badges
- Achievements
- Printable rewards
- Reward Queue

---

# More

Purpose:

Provide access to less frequently used features.

Contains:

- Characters
- NPCs
- Locations
- World Facts
- Printer Settings
- Project Settings
- Archive

These features support Adventures but are rarely the primary task.

---

# Navigation Hierarchy

```text
Projects

└── Project Home

    ├── Adventures

    │     ├── Adventure List

    │     ├── Adventure Overview

    │     ├── Adventure Designer

    │     └── Prepare Session

    │

    ├── Play

    │     └── Running Session

    │

    ├── Collection

    │

    └── More
```

Navigation should always remain shallow.

Avoid deep hierarchies whenever possible.

---

# Running Session Navigation

Running Session is a dedicated application mode.

When a Session starts, the standard navigation disappears.

The interface becomes task-focused.

Session navigation contains:

```text
Scene

People

Notes

Rewards

Assist
```

These destinations are optimized for rapid access during gameplay.

---

# Quick Actions

The primary interaction during gameplay is the Floating Action Button.

Available actions include:

- Add Note
- Create NPC
- Add Event
- Unlock Reward
- AI Assist
- Add Pokémon
- Add Item

Quick Actions should always be available from any Session screen.

---

# Breadcrumbs

The application should communicate the user's current context.

Example:

```text
Project

>

Adventure

>

Current Scene
```

The depth depends on the current screen.

Examples:

Project Home

```text
Pokémon Adventures
```

Adventure

```text
Pokémon Adventures

>

The Lost Egg
```

Running Session

```text
Pokémon Adventures

>

The Lost Egg

>

Forest Entrance
```

Breadcrumbs communicate context rather than serve as primary navigation.

---

# Navigation Principles

## Shallow Navigation

Users should rarely need more than two navigation steps.

Avoid deeply nested pages.

---

## Context Before Menu

Whenever possible, provide contextual actions instead of forcing users to navigate elsewhere.

Example:

Instead of navigating to Characters:

```text
Current Scene

↓

Present Characters

↓

Open Character
```

This reduces unnecessary navigation.

---

## Resume Where You Left Off

The application should remember unfinished work.

Examples:

- Current Adventure
- Active Session
- Last edited Scene

Whenever practical, users should continue instead of searching.

---

## Session Priority

If a Session is active, it becomes the primary focus.

The Home screen should immediately offer:

```text
Resume Session
```

The user should never have to search for an active Session.

---

# Mobile Navigation

Phones use a bottom navigation bar.

Characteristics:

- Thumb-friendly
- Maximum five destinations
- One primary action per screen

Running Session replaces the standard navigation with Session navigation.

---

# Tablet Navigation

Tablet layouts may use:

- Navigation Rail
- Side Navigation
- Two-panel layouts

The navigation model remains identical.

Only the presentation changes.

---

# Desktop Navigation

Desktop layouts may expose additional information simultaneously.

Examples:

- Navigation Sidebar
- Inspector Panel
- AI Assistant Panel

Navigation behavior should remain consistent with mobile.

---

# Deep Linking

Every important screen should have a stable route.

Examples:

```text
/projects

/projects/:projectId

/projects/:projectId/adventures

/projects/:projectId/adventures/:adventureId

/projects/:projectId/session

/projects/:projectId/collection
```

URLs should remain human-readable whenever possible.

---

# Navigation Recovery

The application should recover gracefully after interruption.

Examples:

Browser closed

↓

Offer Resume Session

Network restored

↓

Continue automatically

App reopened

↓

Return to last meaningful location

Users should rarely lose context.

---

# Offline Navigation

Prepared content remains accessible.

Unavailable features should explain why they are unavailable.

Example:

"AI assistance is unavailable while offline."

Navigation itself should never fail because of connectivity.

---

# Future Expansion

The navigation model should allow new sections without restructuring existing flows.

Possible future additions:

- Multiplayer
- Community Content
- Marketplace
- Plugin System

These should extend the existing architecture rather than replace it.

---

# Final Principle

Users should never think about navigation.

They should think about their story.

The application should simply take them to the next meaningful step.