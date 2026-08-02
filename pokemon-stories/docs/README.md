# Pokémon Stories Documentation

Welcome to the Pokémon Stories documentation.

This documentation serves as the single source of truth for the project.

Its purpose is to provide a stable foundation for developers, designers and AI assistants by documenting the product vision, architecture, user experience and technical decisions.

Whenever implementation and documentation differ, the documentation should be reviewed and updated.

---

# Reading Order

New contributors should read the documents in the following order.

## 1. Project Overview

**File**

```text
00-project-overview.md
```

Introduces the project at a high level.

Read this first.

---

## 2. Product Vision

**File**

```text
01-product-vision.md
```

Explains:

- what Pokémon Stories is
- why it exists
- who it is built for

---

## 3. Product Philosophy

**File**

```text
02-product-philosophy.md
```

Defines the principles behind product decisions.

Whenever multiple solutions are possible, this document should guide the choice.

---

## 4. Architecture

**File**

```text
03-architecture.md
```

Defines:

- architectural principles
- dependency rules
- layer responsibilities
- project structure

Every technical decision should respect this document.

---

## 5. Domain Model

**File**

```text
04-domain-model.md
```

Defines the business model of Pokémon Stories.

Explains:

- Projects
- Adventures
- Sessions
- Characters
- Rewards
- Narrative Context
- Collections

This is the most important document for understanding the domain.

---

## 6. System Glossary

**File**

```text
05-system-glossary.md
```

Defines the project's ubiquitous language.

Every concept has exactly one official meaning.

Always use the terminology defined here.

---

## 7. User Experience

**File**

```text
06-user-experience.md
```

Explains how the application should feel.

Focuses on:

- experience modes
- interaction principles
- user journey
- emotional design

---

## 8. Navigation

**File**

```text
07-navigation.md
```

Defines:

- information architecture
- navigation hierarchy
- routing philosophy
- application flow

---

## 9. Coding Guidelines

**File**

```text
08-coding-guidelines.md
```

Defines coding standards for the project.

Includes:

- Angular conventions
- Signals
- naming
- testing
- component design
- code review expectations

Every implementation should follow these guidelines.

---

## 10. Design System

**File**

```text
09-design-system.md
```

Defines the visual language of Pokémon Stories.

Includes:

- design principles
- component library
- typography
- spacing
- colors
- responsive behavior
- accessibility

---

# Future Documentation

The documentation will continue to grow.

Future documents are expected to cover feature-specific specifications.

Examples:

```text
10-mvp-roadmap.md

11-backlog.md

specifications/

    adventure-designer.md

    running-session.md

    reward-system.md

    collection.md

    ai-assistant.md

    printing.md
```

Architecture Decision Records (ADRs) will also be maintained separately.

```text
adr/

    ADR-001-...

    ADR-002-...
```

---

# How to Use This Documentation

## Before Designing

Read:

- Product Vision
- Product Philosophy
- User Experience

---

## Before Writing Code

Read:

- Architecture
- Domain Model
- Coding Guidelines

---

## Before Building UI

Read:

- User Experience
- Navigation
- Design System

---

## Before Naming Anything

Read:

- System Glossary

The glossary defines the official language of the project.

---

# Documentation Principles

The documentation should remain:

- accurate
- concise
- consistent
- implementation-independent where possible

Documentation should explain *why* before *how*.

Implementation details belong in code or feature specifications.

---

# AI Usage

This documentation is intentionally structured to provide high-quality context for AI-assisted development tools such as GitHub Copilot and ChatGPT.

When using AI:

- follow the terminology defined in the System Glossary
- respect the Architecture document
- follow the Coding Guidelines
- use the Design System for UI work
- prefer extending existing concepts over introducing new ones

AI-generated code should always be reviewed by a developer.

---

# Living Documentation

This documentation is a living resource.

Whenever the architecture, domain or product evolves, the corresponding document should be updated.

Keeping the documentation aligned with the implementation is part of the Definition of Done.

---

# Guiding Principle

Every document ultimately supports one goal:

> Help Game Masters tell better stories.

Technology, architecture and design exist only to support that mission.