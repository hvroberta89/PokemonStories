# Project Management

## Purpose

Project Management defines how users create, select, maintain and archive Projects in Pokémon Stories.

A Project represents one complete campaign world.

It is the highest-level context of the application and contains all Adventures, Characters, Locations, World Facts, Sessions and Collections related to that campaign.

The purpose of this feature is to make entering and managing campaign worlds simple without turning Project management into administration.

---

## Responsibilities

Project Management allows users to:

* create a new Project;
* view existing Projects;
* select an active Project;
* return to the most recently used Project;
* edit basic Project information;
* archive and restore Projects;
* switch between Projects;
* handle empty and unavailable Project states.

Project Management is not responsible for:

* editing Adventures;
* managing Characters or Locations;
* running Sessions;
* editing Collection items;
* generating complete campaign worlds;
* permanently deleting Projects in the initial version.

---

## Core Concepts

### Project

A Project represents one campaign world.

Examples:

* Pokémon Adventures with Emma and Marci;
* Kanto Beginner Campaign;
* Orange Islands.

A Project contains:

* Adventures;
* Characters;
* NPCs;
* Locations;
* World Facts;
* Sessions;
* Collections;
* Project-level settings.

A Project is expected to remain active for a long period and evolve across multiple Adventures.

---

### Active Project

The Active Project is the Project currently selected by the user.

Most application routes and features operate inside this context.

Only one Project may be active in the current application session.

Selecting a Project does not modify its domain state.

It only changes the current application context.

---

### Archived Project

An Archived Project remains stored but is removed from the default active Project list.

Archiving is reversible.

Archived Projects:

* cannot be selected through the normal Project list;
* do not appear in recent Projects;
* retain all associated data;
* may be restored later.

Archiving is not deletion.

---

## User Goals

The user should be able to:

* enter the application and continue the most relevant campaign quickly;
* create a Project with minimal setup;
* understand which Project was used most recently;
* switch campaigns without losing context;
* safely archive inactive campaigns;
* restore archived campaigns when needed.

---

## Primary User Flow

```text
Open Application

↓

Resolve Active Project

↓

Existing Active Project?
├── Yes → Open Project Dashboard
└── No
    ↓
    Show Project List
    ↓
    Select Existing Project
    or
    Create New Project
```

---

## First-Time User Flow

```text
Open Application

↓

No Projects Exist

↓

Welcome State

↓

Create Project

↓

Enter Basic Information

↓

Project Created

↓

Open Project Dashboard
```

The first-time experience should not require configuring the complete campaign world.

The user should be able to create a usable empty Project in one short flow.

---

## Returning User Flow

When the application opens and a valid recently active Project exists:

```text
Open Application

↓

Load Last Active Project

↓

Open Project Dashboard
```

The user should not be forced to visit the Project List on every launch.

The Project List must remain accessible for switching Projects.

---

## Project List

The Project List displays available, non-archived Projects.

Recommended route:

```text
/projects
```

The screen contains:

* recently active Project;
* remaining Projects;
* create Project action;
* archived Projects entry;
* empty state when no Projects exist.

---

## Project List Ordering

Projects should be ordered by relevance.

Recommended order:

1. currently active Project;
2. most recently opened Project;
3. Projects with an active Session;
4. remaining Projects ordered by recent activity.

Alphabetical ordering should not be the default because recency is more useful.

An active Session must be visually visible on the corresponding Project card.

---

## Project Card

Each Project is represented by a Project Card.

Recommended content:

* Project name;
* optional short description;
* optional artwork or visual identifier;
* latest relevant Adventure;
* last activity;
* active Session indicator;
* number of Adventures, when useful.

Example:

```text
Pokémon Adventures

5 Adventures

Last played:
The Mist Forest

[Continue]
```

The complete card should be interactive.

A single clear primary action is preferred over multiple competing buttons.

---

## Project Card States

### Default

Displays the Project summary and opens the Project Dashboard.

### Active Project

Indicates that this Project is currently selected.

Suggested label:

```text
Current Project
```

### Active Session

Indicates that a live Session exists.

Suggested status:

```text
Session in progress
```

The primary action becomes:

```text
Resume Session
```

### Recently Created

May show a subtle new state until meaningful content exists.

Primary action:

```text
Create first Adventure
```

### Loading

Displays a skeleton matching the card layout.

### Unavailable

Displayed when summary information cannot be loaded.

The Project must not disappear silently.

---

## Create Project

Recommended route:

```text
/projects/new
```

The Create Project flow should remain short.

Required information:

* Project name.

Optional information:

* short concept or description;
* audience;
* Project artwork;
* AI-assisted initial concept.

The user must not be required to create:

* Characters;
* Locations;
* World Facts;
* Adventures;
* rule configurations

before the Project can be saved.

---

## Create Project Form

### Project Name

Required.

The name should:

* be meaningful to the user;
* not need to be globally unique;
* allow common punctuation and accented characters;
* have a reasonable maximum length.

Recommended maximum:

```text
80 characters
```

Whitespace-only names are invalid.

Leading and trailing whitespace should be normalized.

---

### Short Concept

Optional.

Purpose:

Help the user remember the campaign premise and provide initial context for later creation.

Example:

```text
A light-hearted Pokémon adventure for two young trainers exploring a newly discovered island.
```

Recommended maximum:

```text
500 characters
```

The concept is not a World Fact and should not automatically become canonical structured world data.

---

### Audience

Optional during Project creation.

Audience may define:

* intended age group;
* tone;
* complexity;
* level of danger;
* AI content boundaries.

If no Audience is selected, the application may use a safe default.

The user can change this later in Project Settings.

---

### Artwork

Optional.

The Project may use:

* generated artwork;
* uploaded artwork;
* predefined visual themes;
* a default placeholder.

Artwork must not block Project creation.

---

## AI-Assisted Project Setup

AI assistance may optionally help create:

* a short Project concept;
* three initial campaign directions;
* a suggested first Adventure idea.

AI assistance must remain optional.

The standard interaction pattern is:

```text
Generate Ideas

↓

Three Suggestions

↓

Select or Dismiss

↓

Edit

↓

Create Project
```

AI-generated suggestions must not automatically create Characters, Locations or World Facts.

The user explicitly decides what becomes part of the Project.

---

## Project Creation Behaviour

When the user submits valid Project information:

1. the Project is created;
2. the new Project becomes Active;
3. the user is navigated to the Project Dashboard;
4. the Dashboard shows the Empty Project state;
5. the primary action is Create Adventure.

Project creation should be atomic from the user’s perspective.

The application must not create a partially visible Project when required creation fails.

---

## Project Selection

Selecting a Project:

* updates the Active Project context;
* records recent access;
* opens the Project Dashboard;
* does not start or resume a Session automatically unless the user selected an explicit Resume Session action.

If a selected Project contains an active Session, the Dashboard prioritizes that Session.

---

## Project Switching

The user can switch Projects from:

* the Project List;
* the Project context header;
* Project-related navigation;
* Project Settings.

Switching Projects must preserve unsaved state safely.

If the current screen has unsaved changes, the application should:

* save automatically when supported;
* otherwise warn before switching;
* never silently discard edits.

An active Session may remain active while another Project is viewed only if the architecture explicitly supports it.

For the MVP, switching away from a Project with an active Session should display:

```text
A Session is still running in this Project.
```

Actions:

* return to Session;
* switch Project without ending Session;
* cancel.

Switching Projects must not end the Session automatically.

---

## Recent Project Behaviour

The application should remember the most recently active Project locally.

On application startup:

* if the Project still exists and is accessible, open it;
* if it is archived, open the Project List;
* if it is unavailable, show the Project List with a clear message;
* if no Project exists, show the first-time empty state.

The application should not remain stuck on an invalid Project identifier.

---

## Edit Project

Basic Project information can be edited from Project Settings.

Editable fields may include:

* name;
* short concept;
* audience;
* artwork;
* Project-level preferences.

Editing the Project must not modify unrelated campaign content.

Changing the Project name does not change Project identity or route identifiers.

---

## Project Settings

Recommended route:

```text
/projects/:projectId/settings
```

Initial settings may include:

* Project details;
* audience;
* AI preferences;
* printer and export defaults;
* archive action.

Advanced Project configuration should be introduced only when necessary.

The Settings screen should not become a generic dumping ground for unrelated features.

---

## Archive Project

A Project may be archived when it is no longer actively used.

Archive action should be available from Project Settings or an overflow action.

Before archiving, display a clear confirmation.

Example:

```text
Archive Pokémon Adventures?

The Project and all related Adventures, Sessions and Collections will remain saved.
You can restore it later.
```

Actions:

* Archive Project;
* Cancel.

Archiving must never delete associated data.

---

## Archive Rules

* A Project with an active Session should not be archived without resolving the Session.
* The user must explicitly confirm archiving.
* Archived Projects are removed from the default Project List.
* Archived Projects cannot remain Active.
* If the Active Project is archived, the application navigates to the Project List.
* Archiving is reversible.

For the MVP, a Project with an active Session should require the user to:

* return to the Session;
* end the Session;
* or cancel archiving.

Force-archiving an active Session is out of scope.

---

## Archived Projects

Recommended route:

```text
/projects/archived
```

The Archived Projects screen displays:

* Project name;
* archive date;
* last meaningful activity;
* restore action.

Archived Projects should not be visually presented as destroyed or deleted.

---

## Restore Project

Restoring a Project:

* returns it to the active Project list;
* preserves all content and history;
* does not automatically make it Active unless the user selects it;
* records a restoration event when relevant.

After restoration, offer:

```text
Open Project
```

---

## Permanent Deletion

Permanent Project deletion is out of scope for the initial version.

If added later, it must:

* be clearly separate from archiving;
* require strong confirmation;
* explain irreversible consequences;
* account for related Adventures, Sessions and assets;
* support legal and privacy requirements.

Do not use the word “Delete” for archiving.

---

## Business Rules

* Every Adventure belongs to exactly one Project.
* Every Character belongs to exactly one Project.
* Every Project has a stable identity.
* Project names do not need to be globally unique.
* Only non-archived Projects may become Active.
* Archiving does not delete Project content.
* A Project with an active Session cannot be archived in the MVP.
* Creating a Project does not require creating world content.
* Selecting a Project does not modify campaign state.
* Project switching must not silently discard unsaved work.
* AI-generated setup content requires explicit acceptance.

---

## Project Lifecycle

Recommended lifecycle:

```text
Active

↓

Archived

↓

Active
```

The initial Project lifecycle intentionally remains simple.

“Draft Project” is unnecessary because a newly created empty Project is already valid.

“Deleted” is not part of the MVP domain lifecycle.

---

## State Model

Suggested presentation states for the Project List:

```text
Loading

FirstUseEmpty

ProjectList

ArchivedProjectList

CreatingProject

Error
```

Suggested Project access states:

```text
Available

Archived

Unavailable

NotFound
```

---

## Data Requirements

Project List summary data may include:

* Project identifier;
* name;
* concept summary;
* artwork reference;
* last accessed timestamp;
* last activity timestamp;
* active Session summary;
* latest Adventure summary;
* Adventure count;
* archive state.

The Project List should load summary projections rather than complete Projects.

Opening the Project Dashboard may load richer Project-level information.

---

## Domain Interaction

Related domain concepts:

* Project;
* Adventure;
* Session;
* Character;
* Location;
* World Fact;
* Collection.

Project Management should avoid owning feature-specific business rules.

For example:

* it may show that an Adventure exists;
* it does not determine Adventure readiness;
* it may show an active Session;
* it does not control Session progression.

---

## Application Use Cases

Suggested application use cases:

```text
CreateProject
ListProjects
GetProjectSummary
SelectActiveProject
GetActiveProject
UpdateProjectDetails
ArchiveProject
RestoreProject
ListArchivedProjects
```

Optional later use cases:

```text
DuplicateProject
DeleteProject
ExportProject
ImportProject
ShareProject
```

Each use case should have one clear responsibility.

---

## Suggested Angular Structure

```text
features/
  project-management/
    pages/
      project-list-page/
      create-project-page/
      archived-projects-page/
      project-settings-page/
    components/
      project-card/
      project-list/
      create-project-form/
      project-context-switcher/
      project-empty-state/
      archived-project-card/
      archive-project-dialog/
    application/
      create-project/
      list-projects/
      select-active-project/
      update-project/
      archive-project/
      restore-project/
    domain/
      project/
      project-summary/
      project-status/
    infrastructure/
      project-repository/
      active-project-store/
```

This structure should be adapted to the existing repository conventions.

Do not duplicate domain types if they already exist in another feature boundary.

---

## Active Project State

The Active Project is application state rather than mutable Project domain state.

A dedicated Active Project store may expose:

```typescript
interface ActiveProjectState {
  readonly projectId: string | null;
  readonly status: 'initializing' | 'selected' | 'none' | 'error';
}
```

Possible signal API:

```typescript
readonly activeProjectId = signal<string | null>(null);
readonly hasActiveProject = computed(() => this.activeProjectId() !== null);
```

The store should not contain complete Project business logic.

Its responsibility is Project context selection.

---

## Routing

Recommended routes:

```text
/projects
/projects/new
/projects/archived
/projects/:projectId
/projects/:projectId/settings
```

Feature routes within a Project should consistently include `projectId`.

Examples:

```text
/projects/:projectId/adventures
/projects/:projectId/collection
/projects/:projectId/characters
```

This makes Project context explicit and supports deep linking.

---

## Route Guards and Resolution

When opening a Project route:

1. validate the Project identifier;
2. confirm the Project exists;
3. confirm it is not archived;
4. set or update Active Project context;
5. load the requested feature.

An invalid or archived Project must not produce a blank screen.

Archived Project routes should redirect to:

* the Archived Projects screen;
* or a Project unavailable state with a Restore action.

Authorization rules may be introduced later when multi-user access exists.

---

## Loading Behaviour

Project summaries should load progressively.

Preferred behaviour:

* show the page structure immediately;
* use Project Card skeletons;
* retain known Project names during background refresh;
* avoid blocking the entire application with a full-screen spinner.

Project creation may use a blocking submit state to prevent duplicate submissions.

---

## Duplicate Submission Protection

The Create Project action must prevent accidental duplicate creation.

While creation is in progress:

* disable repeated submission;
* preserve entered data;
* show clear progress;
* allow safe retry after failure.

A timeout or network retry must not create multiple Projects.

The infrastructure layer should support idempotent behaviour where practical.

---

## Error Handling

### Project List Loading Failed

Display:

```text
We could not load your Projects.
```

Actions:

* Retry;
* use locally cached Projects when available.

---

### Project Creation Failed

Display:

```text
Your Project could not be created.
Your information has not been lost.
```

Actions:

* Retry;
* continue editing;
* return to Project List.

Form values must remain intact after failure.

---

### Project Not Found

Display:

```text
This Project could not be found.
```

Actions:

* return to Project List;
* retry when relevant.

---

### Project Is Archived

Display:

```text
This Project is archived.
```

Actions:

* restore Project;
* return to Project List.

---

### Archive Failed

The Project must remain active and visible.

Display:

```text
The Project could not be archived.
```

Actions:

* Retry;
* Cancel.

---

### Restore Failed

The Project remains archived.

Display a clear retry action.

---

## Offline Behaviour

When offline, the user should be able to:

* view locally available Projects;
* select a cached Project;
* open locally available Project content;
* create a local Project when offline creation is supported.

If offline Project creation is not yet supported, explain this clearly.

Example:

```text
A new Project cannot be created while offline yet.
Your existing downloaded Projects are still available.
```

Project List navigation must remain usable without AI or network access.

---

## Empty States

### No Projects

```text
Your next world begins here.

Create a Project to start building Adventures, Characters and memories.
```

Primary action:

```text
Create Project
```

Optional supporting content may explain what a Project represents.

---

### No Archived Projects

```text
You have no archived Projects.
```

No additional action is required.

---

### Search Has No Results

Project search is optional for the MVP.

If later introduced:

```text
No Projects match your search.
```

---

## Responsive Behaviour

### Phone

* single-column Project Card list;
* prominent Create Project action;
* Project switching through a full-screen list or bottom sheet;
* short creation form;
* no dense campaign statistics.

### Tablet

* two-column Project Card grid;
* creation form may use a wider centered layout;
* Project details and supporting artwork may be shown together.

### Desktop

* two- or three-column Project grid;
* sidebar Project switcher may be supported;
* maintain clear visual priority;
* avoid turning the screen into an administrative table.

---

## Accessibility

* Project Cards must be fully keyboard accessible.
* Card actions must have descriptive accessible names.
* Active Project status must not rely on color alone.
* Archive confirmation must clearly describe the consequence.
* Form fields must have persistent labels.
* Validation messages must be associated with their fields.
* Focus should move predictably after creation, archive and restore.
* Project artwork must use appropriate alternative text or be decorative.
* Touch targets should be at least 44 × 44 CSS pixels where practical.

---

## Security and Privacy

Project content may contain personal names and child-related campaign information.

The implementation should:

* avoid exposing Project content in public URLs;
* use opaque Project identifiers;
* restrict Project access to authorized users when authentication is introduced;
* avoid logging full Project descriptions unnecessarily;
* protect archived Projects with the same rules as active Projects.

Project names may appear in browser history and interface navigation.

Sensitive personal information should not be placed in Project names.

---

## Acceptance Criteria

The feature is complete when:

* the user can view all active Projects;
* the user can create a Project with a valid name;
* newly created Projects become Active;
* the user is taken to the Project Dashboard after creation;
* the user can select an existing Project;
* the most recently active Project can be restored on application launch;
* the user can switch between Projects;
* switching does not silently discard unsaved changes;
* the user can edit basic Project details;
* the user can archive a Project without deleting its content;
* Projects with active Sessions cannot be archived;
* the user can view archived Projects;
* the user can restore an archived Project;
* loading, empty, offline and error states are handled;
* Project routes use explicit Project context;
* the UI works on phone, tablet and desktop;
* all Project-changing actions delegate to Application-layer use cases.

---

## Out of Scope

Not part of the initial implementation:

* permanent Project deletion;
* Project collaboration;
* Project ownership transfer;
* shared editing;
* Project invitations;
* public Projects;
* Project marketplace;
* complete Project import and export;
* Project duplication;
* configurable Project templates;
* detailed analytics;
* Project-level permissions;
* cross-Project Adventures or Characters.

---

## Future Enhancements

Possible future additions:

* duplicate Project;
* export and import Project;
* share Project with another Game Master;
* Project templates;
* scheduled Sessions;
* Project-level roles and permissions;
* cloud backup status;
* Project search and filtering;
* custom Project themes;
* Project cover generation;
* permanent deletion with recovery period.

These additions must preserve the simplicity of the initial Project selection and creation experience.

---

## Final Principle

A Project is not a folder of records.

It is a living campaign world.

Project Management should make entering that world effortless while keeping administrative complexity out of the way.
