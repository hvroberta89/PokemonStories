# Coding Guidelines

## Purpose

This document defines the coding standards for the Pokémon Stories project.

The goal is not to enforce personal preferences, but to ensure that the entire codebase remains:

- consistent
- maintainable
- readable
- testable
- scalable

Every new feature should follow these guidelines unless an Architecture Decision Record (ADR) explicitly states otherwise.

---

# General Principles

## Write code for humans

Code is read far more often than it is written.

Prefer clarity over cleverness.

Avoid unnecessary abstractions.

A junior developer should be able to understand most code without additional explanation.

---

## Keep Things Simple

Always choose the simplest solution that satisfies the requirements.

Do not introduce complexity for hypothetical future needs.

Avoid premature optimization.

---

## Prefer Composition

Favor composition over inheritance.

Build reusable components by combining smaller pieces.

Avoid deep inheritance hierarchies.

---

## Single Responsibility

Every class, component and function should have one clear responsibility.

If a file requires scrolling for several screens, consider splitting it.

---

# Angular Guidelines

## Standalone Components

Always use standalone components.

Do not introduce new NgModules.

Example:

```typescript
@Component({
    standalone: true
})
```

---

## Dependency Injection

Always use the `inject()` function.

Preferred:

```typescript
private readonly router = inject(Router);
```

Avoid:

```typescript
constructor(
    private router: Router
) {}
```

---

## Signals

Signals are the default state management solution.

Preferred:

- signal()
- computed()
- effect()

Avoid introducing RxJS for local component state.

RxJS should primarily be used for:

- HTTP
- WebSockets
- External APIs
- Streams

---

## Change Detection

Always rely on Angular's default signal-based reactivity.

Avoid manual change detection.

Do not use ChangeDetectorRef unless absolutely necessary.

---

## Template Guidelines

Templates should remain declarative.

Avoid business logic inside templates.

Good:

```html
{{ fullName() }}
```

Avoid:

```html
{{ firstName() + " " + lastName() }}
```

Complex calculations belong in computed signals.

---

# Component Design

## Smart Components

Responsibilities:

- orchestration
- loading data
- calling use cases
- navigation

---

## Presentational Components

Responsibilities:

- rendering
- user interaction
- events

Presentational components should not know where data comes from.

---

## Component Size

Prefer many small components over large components.

As a guideline:

- 50–150 lines is ideal
- 300+ lines should trigger a review
- 500+ lines should almost always be refactored

These are guidelines, not hard limits.

---

# File Organization

One primary responsibility per file.

Example:

```text
story-card/

    story-card.component.ts

    story-card.component.html

    story-card.component.scss

    story-card.component.spec.ts
```

Avoid unrelated helper classes inside component files.

---

# Naming

## Components

Use nouns.

Examples:

- StoryCardComponent
- RewardCardComponent
- SessionTimelineComponent

Avoid generic names like:

- DataComponent
- MainComponent
- UtilComponent

---

## Services

Services should describe responsibilities.

Good:

- SessionService
- AdventureRepository
- RewardPrinter

Avoid:

- CommonService
- DataService
- HelperService

---

## Functions

Functions should describe actions.

Good:

- startSession()
- generateReward()
- printSticker()

Avoid:

- doStuff()
- process()
- handleEverything()

---

## Variables

Prefer descriptive names.

Good:

```typescript
currentAdventure
```

Avoid:

```typescript
data
```

---

# Domain Rules

Business rules belong inside the Domain.

Never duplicate business logic inside:

- components
- services
- repositories

The Domain is the single source of truth.

---

# Immutability

Prefer immutable objects.

Avoid mutating state directly.

Preferred:

```typescript
return {
    ...session,
    currentScene: nextScene
};
```

Avoid:

```typescript
session.currentScene = nextScene;
```

---

# Error Handling

Never silently ignore errors.

Infrastructure errors should be transformed into meaningful application errors.

Unexpected errors should be logged.

---

# Async Code

Prefer async/await where appropriate.

Avoid deeply nested Promise chains.

Keep asynchronous code easy to follow.

---

# Comments

Code should explain itself whenever possible.

Use comments only when explaining:

- business reasoning
- architectural decisions
- non-obvious behavior

Avoid comments that merely repeat the code.

Bad:

```typescript
// Increment counter
counter++;
```

---

# Testing

Every business rule should be testable.

Prioritize testing:

1. Domain
2. Application
3. Components
4. Infrastructure

Avoid testing framework internals.

---

# Styling

Use SCSS.

Prefer CSS variables for theming.

Avoid inline styles.

Keep styles component-scoped.

---

# Accessibility

Every interactive element should be accessible.

Support:

- keyboard navigation
- screen readers
- focus indicators

Accessibility is a requirement, not an enhancement.

---

# Performance

Optimize only after measuring.

Avoid unnecessary optimization.

Use lazy loading for feature areas.

Minimize unnecessary rendering.

---

# AI Generated Code

AI-generated code must always be reviewed.

Never accept generated code without checking:

- correctness
- readability
- architecture
- naming
- consistency

The AI assists development.

Developers remain responsible for the final implementation.

---

# Code Review Checklist

Before committing code, verify:

- Single Responsibility
- Clear naming
- Small functions
- Small components
- Signals instead of unnecessary RxJS
- No business logic in components
- Immutable updates
- Proper error handling
- Tests updated
- Architecture respected

---

# Definition of Done

A feature is considered complete when:

- Requirements are implemented
- Tests pass
- Architecture rules are respected
- Code follows these guidelines
- UI matches the design
- No obvious technical debt remains
- Documentation is updated when necessary

---

# Guiding Principle

Every line of code should make the project easier to understand tomorrow than it is today.