# Architecture

## Purpose

This document defines the architectural foundation of the Pokémon Stories application.

Its purpose is to establish a stable set of technical principles that guide every implementation decision. The architecture is intentionally designed to maximize maintainability, testability, scalability and long-term flexibility.

Whenever a future implementation conflicts with this document, the decision should be considered carefully and documented as an Architecture Decision Record (ADR).

---

# Architectural Goals

The architecture must support the following goals:

- Domain-first development
- Framework independence
- Long-term maintainability
- High testability
- Clear separation of responsibilities
- AI provider independence
- Infrastructure independence
- Mobile-first user experience
- Incremental feature development

The architecture should make changing technologies easier than changing business logic.

---

# Core Principles

## Domain-Driven Design

Pokémon Stories is designed using Domain-Driven Design (DDD).

The domain model is the most important part of the application.

Business rules belong to the domain.

Technology does not.

The domain must be understandable without any knowledge of Angular, databases or AI providers.

---

## Clean Architecture

Dependencies always point inward.

```text
Presentation
        ↓
Application
        ↓
Domain
```

Infrastructure implements interfaces defined by the application or domain.

The domain never depends on infrastructure.

---

## Vertical Slice Architecture

Features are developed as complete vertical slices instead of horizontal technical layers.

A feature should contain everything required for its implementation.

Example:

```text
Adventure

├── Domain
├── Application
├── Infrastructure
└── Presentation
```

Whenever possible, new functionality should be implemented by extending a feature rather than creating shared abstractions too early.

---

## Framework Independence

The domain must not depend on any framework.

Specifically, the domain must not reference:

- Angular
- RxJS
- OpenAI SDK
- Supabase SDK
- Firebase
- HTTP libraries
- Browser APIs

The domain should be executable inside any .NET, Node.js, Angular or test environment without modification.

---

## AI as Infrastructure

Artificial Intelligence is treated as an infrastructure service.

The AI never owns business rules.

The AI provides suggestions.

The Game Master always makes the final decision.

This allows the AI provider to be replaced without affecting the application logic.

---

# High-Level Architecture

```text
┌────────────────────────────┐
│        Presentation        │
├────────────────────────────┤
│        Application         │
├────────────────────────────┤
│           Domain           │
├────────────────────────────┤
│       Infrastructure       │
└────────────────────────────┘
```

Each layer has a single responsibility.

---

# Layer Responsibilities

## Domain

The Domain layer contains the business model of Pokémon Stories.

Responsibilities include:

- Entities
- Value Objects
- Domain Services
- Domain Events
- Business Rules
- Invariants

The Domain never knows:

- where data comes from
- how data is stored
- how AI works
- how printing works
- how the UI works

The Domain answers only one question:

> What is correct according to the rules of the game?

---

## Application

The Application layer coordinates business use cases.

Responsibilities include:

- Use Cases
- Commands
- Queries
- AI orchestration
- Narrative Context creation
- Transaction boundaries
- Authorization decisions

The Application layer does not contain business rules.

Instead, it coordinates domain objects.

---

## Infrastructure

Infrastructure connects the application to external systems.

Examples include:

- OpenAI
- Supabase
- File Storage
- Local Storage
- Printing
- Image Generation
- Analytics

Infrastructure is replaceable.

Replacing OpenAI with another AI provider should require changes only inside the infrastructure layer.

---

## Presentation

The Presentation layer contains everything related to the user interface.

Responsibilities include:

- Angular Components
- Routing
- UI State
- User Interaction
- Form Validation
- Animations
- Responsive Layout

Presentation must not contain business logic.

---

# Dependency Rules

Allowed dependencies:

```text
Presentation
    ↓
Application
    ↓
Domain
```

Infrastructure implements interfaces defined by the Application or Domain.

Forbidden dependencies:

```text
Domain → Angular

Domain → HTTP

Domain → OpenAI

Domain → Database

Application → Angular Components

Presentation → Database

Presentation → OpenAI
```

These rules should never be violated.

---

# Folder Structure

The project follows a feature-oriented structure.

Example:

```text
src/

features/

    project/

    adventure/

    session/

    collection/

shared/

core/

infrastructure/
```

Each feature contains its own presentation, application and infrastructure code when appropriate.

The goal is to keep features self-contained.

---

# State Management

Application state is managed using Angular Signals.

Preferred primitives:

- signal()
- computed()
- effect()

Observable streams should be reserved for external asynchronous APIs.

Signals are the default state management solution.

---

# Dependency Injection

Dependency Injection uses Angular's inject() function.

Constructor injection should be avoided in new code.

Services should expose clear responsibilities and remain focused.

---

# Data Flow

Data flows in a single direction.

```text
User

↓

Presentation

↓

Application

↓

Domain

↓

Infrastructure

↓

External Services
```

Responses return through the same path.

Business rules are always evaluated inside the domain.

---

# Error Handling

Errors should be classified into three categories.

## Domain Errors

Business rule violations.

Example:

- Adventure cannot be started because required scenes are missing.

---

## Application Errors

Use case failures.

Example:

- User is not authorized.

---

## Infrastructure Errors

External failures.

Example:

- Network unavailable.
- AI provider timeout.
- Printing failed.

Infrastructure errors should never corrupt domain state.

---

# Testing Strategy

Every layer has its own testing responsibilities.

## Domain

- Unit Tests
- No mocks whenever possible
- Fast execution

The domain should have the highest test coverage.

---

## Application

- Use Case tests
- Mock infrastructure
- Verify orchestration

---

## Infrastructure

- Integration tests
- Provider-specific behavior

---

## Presentation

- Component tests
- Interaction tests
- Visual verification

---

# Future Evolution

The architecture should support future capabilities without significant restructuring.

Potential future extensions include:

- Multiple AI providers
- Multiple printing providers
- Cloud synchronization
- Offline mode
- Multiplayer Game Masters
- Plugin system
- Custom rule systems

These additions should require extending the infrastructure rather than changing the domain.

---

# Non Goals

The architecture intentionally avoids:

- Anemic domain models
- Business logic inside Angular components
- Direct database access from the UI
- AI-dependent business rules
- Framework-specific domain code
- Premature microservices
- Over-engineered abstractions

The application should remain simple until complexity is justified.

---

# Architectural Motto

Every architectural decision should support the project's core philosophy:

> The domain defines the game.
>
> The application coordinates the game.
>
> The infrastructure supports the game.
>
> The presentation enables the Game Master.
>
> **The phone supports the adventure.**
>
> **The adventure happens at the table.**