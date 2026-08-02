# Project Dashboard

## Purpose

The Project Dashboard is the primary entry point of an active Project.

Its purpose is not to display statistics or expose every available feature.

It should help the Game Master understand the current state of the Project and continue with the most meaningful next action.

The Dashboard answers one central question:

> What should I do next?

---

## Responsibilities

The Project Dashboard allows the user to:

* continue an active Session;
* continue designing the most recently edited Adventure;
* prepare or start a Ready Adventure;
* create a new Adventure;
* review recent Session results;
* access important Project content;
* understand the current state of the campaign at a glance.

The Dashboard is not responsible for:

* editing Adventures;
* managing complete world data;
* displaying detailed analytics;
* running a Session;
* editing Project settings.

These responsibilities belong to dedicated features.

---

## Navigation Entry

The Dashboard is opened after the user:

* selects an existing Project;
* creates a new Project;
* returns from another feature to the active Project Home;
* opens the application when a previously selected Project exists.

Recommended route:

```text
/projects/:projectId
```

The Dashboard should always operate within one explicit Project context.

---

## Experience Goal

The Dashboard should feel like returning to an ongoing story.

It should not feel like opening an administration panel.

The interface should prioritize:

1. active gameplay;
2. unfinished work;
3. the next useful action;
4. recent story developments;
5. supporting Project content.

---

## Priority Rules

Dashboard content must be ordered by relevance.

### Priority 1 — Active Session

If the Project contains an active Session, the first and most prominent element must be:

```text
Session in progress
```

Primary action:

```text
Resume Session
```

The user must never search for an active Session.

---

### Priority 2 — Adventure in Progress

If no Session is active, the Dashboard should display the most recently edited unfinished Adventure.

Possible actions depend on its state.

For an Adventure in `Idea` or `Designing` state:

```text
Continue designing
```

For a `Ready` Adventure:

```text
Prepare Session
```

For an Adventure with completed preparation:

```text
Start Session
```

---

### Priority 3 — Create Adventure

If there is no meaningful Adventure to continue, the primary action should be:

```text
Create a new Adventure
```

For a newly created empty Project, this becomes the main Dashboard content.

---

### Priority 4 — Recent Session

If a recently completed Session exists, the Dashboard may show a short recap.

Examples:

* last played Adventure;
* new Pokémon caught;
* rewards earned;
* new NPCs or Locations;
* pending World Updates;
* unprinted Rewards.

This section must remain concise.

---

### Priority 5 — Quick Access

Supporting Project areas may be exposed through compact contextual links.

Examples:

* Adventures;
* Characters;
* Locations;
* World Facts;
* Collection.

These actions must never compete visually with the main next action.

---

## Main Screen Structure

Recommended structure:

```text
Project Context

Primary Continue Card

Next Action

Recent Story Activity

Quick Access
```

Not every section must be shown.

Sections with no meaningful content should be omitted.

---

## Project Context

The top of the Dashboard displays the active Project.

Recommended information:

* Project name;
* optional short description;
* optional Project artwork;
* Project switch action.

Example:

```text
Pokémon Adventures

Adventures with Emma and Marci
```

The Project name should provide context but should not dominate the next action.

---

## Primary Continue Card

The Primary Continue Card is the most important Dashboard component.

It represents exactly one recommended action.

Possible variants:

* Active Session;
* Continue Adventure Design;
* Prepare Adventure;
* Start Session;
* Review Session;
* Create First Adventure.

Only one Primary Continue Card should be displayed.

---

## Active Session Variant

Displayed when a Session is currently running.

Content:

* Adventure title;
* current Scene;
* Session duration or start time;
* current Goal;
* optional number of pending Rewards.

Primary action:

```text
Resume Session
```

Secondary action:

```text
View Adventure
```

Example:

```text
Session in progress

The Lost Pokémon Egg

Current Scene: Flower Meadow
Goal: Find the missing egg

[Resume Session]
```

---

## Continue Adventure Variant

Displayed when the most relevant Adventure is still being designed.

Content:

* Adventure title;
* current lifecycle state;
* readiness summary;
* most recently edited section;
* missing required content, if applicable.

Primary action:

```text
Continue designing
```

Example:

```text
The Mist Forest

Designing
Story ready · 2 required sections missing

[Continue designing]
```

---

## Prepare Adventure Variant

Displayed when an Adventure is Ready but has not yet been prepared for play.

Content:

* Adventure title;
* estimated Session duration;
* Scene count;
* readiness status;
* optional preparation recommendations.

Primary action:

```text
Prepare Session
```

Secondary action:

```text
View Adventure
```

---

## Start Session Variant

Displayed when preparation has been completed sufficiently.

Content:

* Adventure title;
* selected Narrative Context summary;
* prepared Rewards;
* printer or export readiness, when relevant.

Primary action:

```text
Start Session
```

---

## Review Session Variant

Displayed when the latest Session has ended but its post-Session workflow is incomplete.

Examples:

* Session Summary not reviewed;
* World Updates waiting for approval;
* Rewards waiting to be marked as Given;
* pending printable items.

Primary action:

```text
Review Session
```

This state should take priority over starting unrelated work when unresolved changes may affect the Project world.

---

## Empty Project Variant

Displayed when the Project has no Adventures.

The screen should feel inviting rather than empty.

Recommended content:

```text
Your first adventure begins here.

Create a story, prepare the world and bring it to the table.

[Create Adventure]
```

Optional secondary action:

```text
Create with AI
```

The user should not be required to configure the complete Project before creating an Adventure.

---

## Next Action Section

The Next Action section provides one secondary recommendation when useful.

Examples:

* finish missing Adventure content;
* prepare Rewards;
* review pending World Updates;
* print queued Rewards;
* create the next Adventure.

The recommendation should be derived from Project state.

It must not be generated randomly.

---

## Recent Story Activity

This section shows recent campaign developments.

It should be narrative rather than administrative.

Possible entries:

```text
Emma caught Pikachu.

The Old Bridge was discovered.

Professor Elm joined the story.

The Lost Egg was returned safely.
```

The section may use:

* Timeline Entries;
* accepted World Updates;
* completed Sessions;
* unlocked Rewards.

Technical events should not appear.

Avoid entries such as:

```text
Adventure entity updated.
```

---

## Recent Session Summary

When a recent Session exists, a compact summary may appear.

Recommended content:

* Adventure title;
* completion date;
* one or two important events;
* number of Rewards;
* unresolved follow-up actions.

Example:

```text
Last Session

The Lost Pokémon Egg

Emma caught Pikachu.
The team found the hidden bridge.

3 Rewards earned
1 World Update waiting
```

Primary action:

```text
View Session
```

---

## Quick Access

Quick Access provides navigation to frequently useful supporting areas.

Recommended destinations:

```text
Adventures
Characters
Locations
World Facts
Collection
```

On mobile, this may appear as a horizontal card list or compact grid.

The section should not exceed five visible destinations.

Project Settings should remain under `More`.

---

## Adventure Summary

The Dashboard may show a compact Adventure overview.

Recommended information:

* number of active Adventures;
* number of Ready Adventures;
* recently completed Adventure.

This information should support action.

Avoid decorative metrics that do not help decision-making.

Bad example:

```text
Total database records: 47
```

Good example:

```text
2 Adventures ready to play
```

---

## User Interactions

The user can:

* resume an active Session;
* continue editing an Adventure;
* prepare or start a Session;
* create a new Adventure;
* open recent Session details;
* navigate to supporting Project areas;
* switch Projects.

Common actions should require one tap from the Dashboard.

---

## Business Rules

* The Dashboard always belongs to exactly one Project.
* Only one active Session may be promoted as the primary Dashboard action.
* An active Session always has higher priority than Adventure design.
* Unreviewed Session completion work has higher priority than unrelated new planning.
* Only one primary action is displayed at a time.
* Dashboard recommendations must be derived from stored state.
* The Dashboard does not change domain state without an explicit user action.
* The Dashboard must not automatically start a Session.
* The Dashboard must not automatically approve AI Suggestions or World Updates.

---

## State Model

The Dashboard does not need its own domain lifecycle.

Its presentation state is derived from Project-related state.

Suggested UI states:

```text
Loading

EmptyProject

ActiveSession

SessionReviewPending

AdventureDesignInProgress

AdventureReady

AdventurePrepared

ProjectOverview

Error
```

Only one primary state should be active at a time.

Secondary sections may still be displayed when relevant.

---

## State Resolution Order

Recommended resolution logic:

```text
if active Session exists
    show ActiveSession

else if completed Session requires review
    show SessionReviewPending

else if prepared Adventure can start
    show AdventurePrepared

else if Ready Adventure exists
    show AdventureReady

else if unfinished Adventure exists
    show AdventureDesignInProgress

else if no Adventures exist
    show EmptyProject

else
    show ProjectOverview
```

When multiple Adventures match the same state, prefer:

1. most recently interacted with;
2. explicitly pinned Adventure, when supported later;
3. most recently created.

---

## Data Requirements

The Dashboard may require:

* Project summary;
* active Session summary;
* recent Adventure summaries;
* latest Session summary;
* pending World Update count;
* pending Reward count;
* recent story activity;
* Project quick-access counts.

The Dashboard should load summary projections rather than complete aggregate graphs whenever possible.

It should not load full Adventure or Session content unless required.

---

## Domain Interaction

Related domain concepts:

* Project;
* Adventure;
* Session;
* Scene;
* Goal;
* Reward;
* Session Summary;
* World Update;
* Timeline Entry.

The Dashboard primarily reads data.

Domain-changing actions should delegate to application use cases.

Examples:

```text
CreateAdventure
StartSession
ResumeSession
OpenAdventure
ReviewSessionSummary
```

Navigation itself must not contain business rules.

---

## Application Responsibilities

The Application layer should:

* resolve the most relevant next action;
* retrieve Dashboard summary data;
* validate whether a Session can be started;
* identify pending post-Session work;
* provide recent story activity;
* coordinate Project selection.

The Presentation layer should not reproduce this decision logic independently.

---

## Suggested Angular Structure

```text
features/
  project-dashboard/
    pages/
      project-dashboard-page/
    components/
      project-context-header/
      primary-continue-card/
      active-session-card/
      adventure-progress-card/
      recent-session-card/
      recent-story-activity/
      project-quick-access/
      empty-project-state/
    application/
      load-project-dashboard/
      project-dashboard-view-model/
      project-dashboard-state-resolver/
    domain/
      project-dashboard-summary/
    infrastructure/
      project-dashboard-repository/
```

The exact structure may be simplified if existing project conventions already provide equivalent boundaries.

Avoid creating abstractions that are only used once without clear value.

---

## Suggested View Model

Example shape:

```typescript
interface ProjectDashboardViewModel {
  readonly project: ProjectSummary;
  readonly primaryAction: DashboardPrimaryAction;
  readonly recentSession: RecentSessionSummary | null;
  readonly recentActivity: readonly StoryActivityItem[];
  readonly quickAccess: readonly QuickAccessItem[];
}
```

Primary action:

```typescript
type DashboardPrimaryAction =
  | ActiveSessionAction
  | ReviewSessionAction
  | StartSessionAction
  | PrepareAdventureAction
  | ContinueAdventureAction
  | CreateAdventureAction;
```

The UI should render the resolved action rather than implementing priority logic in the template.

---

## Loading State

The loading state should use skeleton components matching the final layout.

Avoid replacing the complete screen with a blocking spinner.

If the Project identity is already known, it may remain visible while Dashboard content loads.

---

## Empty States

### No Adventures

```text
Your first adventure begins here.
```

Action:

```text
Create Adventure
```

### No Recent Activity

Do not display an empty Recent Activity section.

### No Collection Items

Do not promote Collection until it becomes relevant, but Quick Access may remain available.

---

## Error Handling

### Project Not Found

Display:

```text
This Project could not be found.
```

Actions:

* return to Project list;
* retry when appropriate.

---

### Dashboard Loading Failed

Display a non-technical message.

```text
We could not load this Project right now.
```

Actions:

* retry;
* return to Project list.

Previously cached meaningful information may remain visible when safe.

---

### Active Session Cannot Be Loaded

The Session must not be silently discarded.

Display:

```text
Your Session is still saved, but it could not be opened.
```

Actions:

* retry;
* return to Project;
* use offline data when available.

---

## Offline Behaviour

When offline, the Dashboard should show locally available Project data.

Supported offline actions may include:

* resume a locally stored Session;
* open prepared Adventures;
* view recent Session information;
* access Collection content;
* create local notes.

Unavailable cloud or AI actions should be clearly marked.

Example:

```text
AI-assisted creation is unavailable offline.
```

Offline mode must not make the entire Dashboard unusable.

---

## Responsive Behaviour

### Phone

* single-column layout;
* one dominant Primary Continue Card;
* compact Project header;
* horizontal or grid-based Quick Access;
* bottom application navigation;
* large touch targets.

### Tablet

* primary action and recent Session may appear side by side;
* Quick Access may use a wider grid;
* supporting Project information may remain visible.

### Desktop

* a two-column Dashboard is allowed;
* the primary action remains visually dominant;
* additional content must not turn the screen into an analytics dashboard.

---

## Accessibility

* All cards acting as links must be keyboard accessible.
* Primary actions must use clear accessible labels.
* Status must not be communicated by color alone.
* Touch targets should be at least 44 × 44 CSS pixels where practical.
* Headings must follow a logical hierarchy.
* Dynamic state changes should be announced when necessary.
* Skeleton loading should not create noisy screen reader output.
* Project artwork must use meaningful alternative text or be marked decorative.

---

## Acceptance Criteria

The feature is complete when:

* the user can open the Dashboard of an active Project;
* the correct primary action is selected from Project state;
* an active Session is always prioritized;
* the user can resume an active Session with one action;
* the user can continue designing an unfinished Adventure;
* the user can prepare or start a Ready Adventure;
* an empty Project presents a clear Adventure creation action;
* recent Session information is shown when available;
* pending Session review work is clearly visible;
* supporting Project areas are accessible;
* the Dashboard works on phone, tablet and desktop;
* loading, empty, offline and error states are handled;
* the Dashboard contains no business logic inside Angular templates;
* all state-changing actions use Application-layer use cases.

---

## Out of Scope

Not part of the initial implementation:

* analytics dashboards;
* campaign performance metrics;
* configurable Dashboard widgets;
* drag-and-drop card rearrangement;
* multiplayer activity feeds;
* Project sharing;
* Project templates;
* AI-generated Dashboard recommendations;
* custom Dashboard themes;
* detailed world editing;
* full Adventure editing.

---

## Future Enhancements

Possible future improvements:

* pin a preferred Adventure;
* personalized Dashboard ordering;
* shared Project activity;
* upcoming Session scheduling;
* campaign milestones;
* richer visual Project maps;
* player-facing campaign recap;
* optional Dashboard customization.

These enhancements must preserve the action-oriented nature of the Dashboard.

---

## Final Principle

The Project Dashboard is not a report.

It is the doorway back into the story.

Its most important responsibility is to make the next meaningful action obvious.
