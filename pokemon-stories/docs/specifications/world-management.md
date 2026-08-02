# World Management

## Purpose

World Management defines how long-lived campaign knowledge is created, organized and maintained inside a Pokémon Stories Project.

The World represents the persistent campaign context shared across Adventures and Sessions.

It contains reusable story elements such as:

* Characters;
* NPCs;
* Locations;
* World Facts.

World Management exists to preserve continuity.

It should help the Game Master remember what has already been established without turning the Project into a database administration system.

---

## Responsibilities

World Management allows the Game Master to:

* browse persistent campaign content;
* create and edit Characters;
* create and edit NPCs;
* create and edit Locations;
* create and edit World Facts;
* connect world elements to Adventures and Sessions;
* review recently changed world content;
* resolve duplicate or conflicting entries;
* archive world elements that are no longer active;
* promote Adventure-specific content into Project-level content;
* inspect where a world element appeared or changed.

World Management is not responsible for:

* designing complete Adventures;
* running live Sessions;
* accepting World Updates automatically;
* managing Collection ownership;
* replacing Adventure-specific preparation;
* acting as a complete campaign wiki;
* exposing technical entity relationships to the user;
* creating canonical content from AI Suggestions without approval.

---

## Experience Goal

World Management should feel like exploring a living campaign world.

It should not feel like:

* editing database rows;
* maintaining reference tables;
* completing mandatory forms;
* navigating an enterprise content management system;
* manually synchronizing every cross-reference.

The interface should emphasize:

* story relevance;
* relationships;
* recent changes;
* reuse;
* continuity.

The Game Master should be able to answer:

> Who is this?

> Where have we met them?

> What happened here?

> What is currently true in the world?

---

## Core Principles

### The World Is Persistent

World content survives individual Adventures and Sessions.

Examples:

* an NPC may return later;
* a Location may change over time;
* a World Fact may affect future Stories;
* Characters continue developing across multiple Adventures.

---

### World Content Must Be Canonical

Project-level world content represents accepted campaign truth.

AI Suggestions, Session Notes and Adventure drafts are not canonical until explicitly promoted or accepted.

---

### Reuse Before Duplication

When content already exists, the system should encourage reuse.

Examples:

* attach an existing NPC to a new Adventure;
* reference an existing Location;
* update a World Fact instead of creating a near-duplicate;
* use an existing Character rather than creating another copy.

The system should guide the user without preventing intentional alternatives.

---

### Contextual Creation Is Preferred

World content is often created while designing or running an Adventure.

The system should support lightweight creation in context and later refinement.

Example:

```text
Create NPC during Session

↓

Name and Role

↓

Use Immediately

↓

Complete Details Later

↓

Promote to Project NPC
```

---

### Permanent Changes Require Approval

Session events may suggest world changes.

The system must not apply them automatically.

Every permanent change should be:

* reviewed;
* edited when necessary;
* explicitly accepted.

---

### History Matters

The current state is important, but the system should preserve meaningful history.

Examples:

* an NPC changed allegiance;
* a bridge was repaired;
* a Character met a Pokémon;
* a Location became unsafe;
* a World Fact was replaced.

History should support storytelling, not become an audit-heavy interface.

---

## World Structure

The initial World area contains:

```text
World

├── Characters
├── NPCs
├── Locations
└── World Facts
```

Possible future areas:

```text
Story Threads

Organizations

Factions

Quests

Items

Regions

Relationships
```

These are out of scope until they provide clear product value.

---

## Navigation

World Management may be accessible from:

* Project Dashboard Quick Access;
* `More`;
* Adventure Designer;
* Session Summary;
* World Update review;
* contextual links from Scenes and Timeline Entries.

Recommended routes:

```text
/projects/:projectId/characters
/projects/:projectId/characters/:characterId

/projects/:projectId/npcs
/projects/:projectId/npcs/:npcId

/projects/:projectId/locations
/projects/:projectId/locations/:locationId

/projects/:projectId/world-facts
/projects/:projectId/world-facts/:worldFactId
```

The World does not require one separate root screen in the MVP if contextual and category navigation is sufficient.

A combined World overview may be added later.

---

# Characters

## Purpose

A Character represents a player-controlled trainer who persists across Adventures.

Characters are central participants in the campaign.

They own long-term progression such as:

* Pokémon;
* Inventory;
* Outfits;
* Badges;
* Achievements;
* Character history.

---

## Character Responsibilities

Character Management allows the Game Master to:

* create a Character;
* edit Character identity;
* view Character progression;
* view recent Adventures and Sessions;
* inspect owned Pokémon and Collection content;
* attach a Character to an Adventure;
* archive a Character;
* restore an archived Character.

Detailed Collection interactions belong to the Collection feature.

---

## Character List

Recommended route:

```text
/projects/:projectId/characters
```

Recommended content:

* avatar;
* name;
* short description;
* active or archived state;
* recent Adventure;
* owned Pokémon preview;
* new progression indicator.

Example:

```text
Emma

Trainer · Explorer

3 Pokémon
2 Badges

Last played:
The Mist Forest
```

---

## Character Creation

Required information:

* name.

Optional information:

* avatar;
* short description;
* age or Audience-related context;
* personality;
* goals;
* preferred themes;
* notes for the Game Master.

The system should avoid collecting unnecessary personal information.

A Character represents a fictional or campaign identity.

It should not require real-world legal details.

---

## Character Fields

Recommended initial fields:

* Name;
* Display Image;
* Short Description;
* Personality Notes;
* Goals;
* Story Notes;
* Status.

Optional later fields:

* pronouns;
* trainer archetype;
* home Location;
* relationships;
* custom traits;
* ruleset-specific statistics.

Ruleset-specific mechanics should remain outside the core World model where practical.

---

## Character Status

Recommended lifecycle:

```text
Active

Archived
```

A Character should not be deleted merely because they stop participating.

Archived Characters retain:

* Session history;
* Collection ownership;
* Rewards;
* relationships;
* provenance.

---

## Character Detail

Recommended content:

* identity;
* short description;
* current Pokémon;
* recent Collection Items;
* Badges;
* active Outfit;
* recent Adventures;
* important Timeline events;
* Story Notes;
* related NPCs and Locations where useful.

The Character detail should be story-centered.

Avoid turning it into a dense statistics page.

---

## Character Adventure Participation

Characters may be selected as relevant for an Adventure.

Participation may mean:

* expected player;
* included in Narrative Context;
* eligible Reward recipient;
* shown in preparation.

Adventure participation does not change Character ownership or progression.

---

## Character Archiving

Before archiving, explain the effect:

```text
Archive Emma?

Her Adventures, Pokémon, Rewards and campaign history will remain saved.
```

Archiving:

* removes the Character from default active selectors;
* preserves historical references;
* does not remove Collection Items;
* does not rewrite Session history.

A Character with an active Session should not be archived until the Session is resolved.

---

# NPCs

## Purpose

An NPC is a reusable non-player Character controlled by the Game Master.

NPCs may appear across multiple Adventures and Sessions.

They help create continuity and emotional connection inside the campaign world.

---

## NPC Sources

An NPC may originate from:

* manual Project creation;
* Adventure Designer;
* Running Session Quick Create;
* AI Suggestion;
* Session Summary;
* accepted World Update.

NPC origin may be stored for provenance.

Origin does not affect canonical status after acceptance.

---

## NPC States

Recommended lifecycle:

```text
Draft

Active

Archived
```

### Draft

The NPC exists in lightweight form.

It may have only:

* name;
* role;
* short description.

Draft NPCs may be used in an Adventure or Session.

### Active

The NPC is accepted as reusable Project content.

### Archived

The NPC remains in history but is not shown in normal active selection.

---

## NPC List

Recommended route:

```text
/projects/:projectId/npcs
```

Recommended content:

* portrait or icon;
* name;
* role;
* short description;
* last appearance;
* associated Locations;
* current status.

Example:

```text
Professor Elm

Pokémon Researcher

Last appeared:
The Lost Pokémon Egg

New information available
```

---

## NPC Creation

Required information:

* Name;
* Role or short description.

Optional information:

* portrait;
* personality;
* motivation;
* relationship to Characters;
* associated Location;
* secrets;
* notes;
* current status.

During a Session, only Name and Role may be required.

Further detail may be completed later.

---

## NPC Detail

Recommended content:

* name;
* image;
* role;
* description;
* personality;
* motivation;
* current status;
* associated Locations;
* relationships;
* Adventure appearances;
* Session appearances;
* known secrets;
* Game Master notes;
* recent changes.

Player-facing and secret Game Master information must be visually separated.

---

## NPC Relationships

Relationships may exist between:

* NPC and Character;
* NPC and NPC;
* NPC and Location;
* NPC and organization later.

The MVP may represent relationships as concise narrative notes.

Example:

```text
Trusts Emma after the forest rescue.
```

A complex graph-based relationship engine is out of scope.

---

## NPC Adventure Use

When an NPC is added to an Adventure:

* the Adventure references the existing NPC;
* Adventure-specific role or notes may be added;
* the base NPC is not duplicated;
* Adventure-specific changes do not automatically update the Project NPC.

Permanent changes require World Update approval.

---

## Adventure-Specific NPC Promotion

An NPC created inside one Adventure may initially remain an Adventure draft.

Promotion flow:

```text
Adventure NPC

↓

Promote to Project

↓

Review Details

↓

Save as Project NPC
```

Promotion should preserve existing Adventure references.

It must not create a duplicate NPC.

---

## Session-Created NPC

A lightweight NPC created during a Session may be used immediately.

Minimum data:

* name;
* role.

After the Session, the system should offer:

```text
Save Mira as a Project NPC?
```

Actions:

* Save;
* Edit and Save;
* Keep in Session Only;
* Ignore.

---

## NPC Archiving

Archiving an NPC:

* removes it from default active selection;
* preserves appearances and history;
* retains references in completed Adventures and Sessions;
* does not delete related Notes.

If an active Adventure references the NPC, the interface should warn but not necessarily block archiving.

---

# Locations

## Purpose

A Location is a reusable place within the campaign world.

Locations provide continuity and context across Adventures.

Examples:

* Viridian Forest;
* Flower Meadow;
* Old Bridge;
* Professor Elm’s Laboratory;
* Hidden Cave.

---

## Location Scope

A Location may represent:

* region;
* city;
* building;
* room;
* natural area;
* landmark;
* temporary story place.

The MVP does not require a strict geographic hierarchy.

Location hierarchy may be introduced later when it improves navigation.

---

## Location States

Recommended lifecycle:

```text
Draft

Active

Archived
```

Draft Locations may exist in one Adventure before promotion to the Project.

---

## Location List

Recommended route:

```text
/projects/:projectId/locations
```

Recommended content:

* image;
* name;
* type;
* mood or short description;
* last visit;
* related NPCs;
* current story status.

Example:

```text
Old Bridge

Landmark

Repaired after the forest rescue

Last visited:
The Mist Forest
```

---

## Location Creation

Required information:

* Name.

Recommended information:

* short description;
* Location type;
* mood;
* important features.

Optional information:

* illustration;
* related NPCs;
* secrets;
* region;
* current state;
* Game Master notes.

---

## Location Detail

Recommended content:

* name;
* illustration;
* short description;
* mood;
* important features;
* current status;
* related NPCs;
* related Adventures;
* Session history;
* World Facts;
* secrets;
* recent changes.

Location Detail should answer:

> What is this place like now?

> What happened here before?

---

## Location Types

Suggested initial types:

```text
Region

Settlement

Building

Natural Area

Landmark

Room

Custom
```

Types support filtering.

They should not impose rigid structural rules.

---

## Location Relationships

Locations may be related through simple connections.

Examples:

* part of;
* near;
* route to;
* hidden inside.

The MVP may store these as explicit simple relationships or narrative notes.

A full map engine is out of scope.

---

## Adventure-Specific Location Promotion

A Location created during Adventure design may remain Adventure-specific.

Promotion flow:

```text
Adventure Location

↓

Promote to Project

↓

Review Details

↓

Save as Project Location
```

Existing Scene references must remain valid after promotion.

---

## Session-Created Location

A new Location may emerge unexpectedly during play.

Minimum information:

* name;
* short description.

After the Session, the Game Master may:

* promote it to Project;
* merge it with an existing Location;
* keep it only in the Session;
* ignore it.

---

## Location Changes

Locations may change over time.

Examples:

* bridge repaired;
* laboratory abandoned;
* forest made safe;
* village damaged;
* hidden entrance discovered.

Current state may be expressed through:

* World Facts;
* Location status;
* recent update summary.

Avoid overwriting meaningful history without preserving the previous state where useful.

---

## Location Archiving

Archiving a Location:

* removes it from default selectors;
* preserves completed Adventure and Session references;
* retains history;
* does not delete related World Facts automatically.

---

# World Facts

## Purpose

A World Fact represents accepted knowledge about the campaign world.

It records what is currently true.

Examples:

* The Old Bridge has been repaired.
* Professor Elm trusts the trainers.
* Team Rocket controls the abandoned laboratory.
* The northern forest is now safe.
* The royal garden requires an invitation.

World Facts support continuity and AI context.

---

## World Fact Characteristics

A World Fact should be:

* concise;
* specific;
* understandable without technical context;
* relevant to future storytelling;
* explicitly accepted.

A World Fact is not:

* a raw Session Note;
* an unreviewed AI Suggestion;
* a long story summary;
* a temporary idea;
* hidden implementation metadata.

---

## World Fact Types

Suggested initial categories:

```text
General

Character

NPC

Location

Relationship

Organization

Rule

Story State

Custom
```

Categories are optional for display and filtering.

They should not overcomplicate creation.

---

## World Fact List

Recommended route:

```text
/projects/:projectId/world-facts
```

Recommended content:

* Fact text;
* category;
* related entity;
* last changed date;
* source Session or Adventure;
* active or superseded status.

Example:

```text
The Old Bridge has been repaired.

Location · Old Bridge

Established during:
The Mist Forest
```

---

## World Fact Creation

Required information:

* Fact text.

Optional information:

* category;
* related entities;
* source;
* effective date;
* Game Master note.

World Facts may be created manually or accepted from Session review.

---

## World Fact Detail

Recommended content:

* current Fact;
* category;
* related entities;
* source;
* effective date;
* change history;
* notes;
* affected Adventures where useful.

---

## World Fact Lifecycle

Recommended lifecycle:

```text
Active

Superseded

Archived
```

### Active

The Fact is currently true.

### Superseded

A newer Fact replaced it.

### Archived

The Fact is no longer useful but remains in history.

---

## Updating a World Fact

When a Fact changes, prefer an explicit transition.

Example:

```text
Previous Fact:
The Old Bridge is broken.

New Fact:
The Old Bridge has been repaired.
```

The previous Fact becomes Superseded.

The new Fact becomes Active.

This preserves world history.

---

## Contradictory World Facts

The system should detect obvious conflicts where practical.

Example:

```text
Active Fact:
The laboratory is abandoned.

Proposed Fact:
Team Rocket currently operates the laboratory.
```

The interface should ask whether to:

* replace the existing Fact;
* keep both because they describe different contexts;
* edit the new Fact;
* cancel.

AI may identify possible conflicts.

AI must not resolve them automatically.

---

## Temporary Facts

Some truths are temporary.

Examples:

* the road is blocked today;
* Professor Elm is missing;
* the town is under curfew.

The MVP may model them as normal World Facts with an optional state or note.

Advanced temporal validity is out of scope.

---

## Secret World Facts

Some Facts are known only to the Game Master.

Examples:

* the Mayor is secretly helping Team Rocket;
* the Egg is not a Pokémon Egg;
* the forest spirit caused the storm.

World Facts may have visibility:

```text
Game Master Only

Known to Players
```

The AI context must respect intended visibility.

Player-facing features must never expose Game Master-only Facts.

---

# World Overview

## Purpose

A future World Overview may summarize the Project’s living world.

Possible content:

* recently changed NPCs;
* recently discovered Locations;
* new World Facts;
* active Characters;
* unresolved proposed updates;
* frequently used world content.

The MVP may rely on category pages and Project Dashboard Quick Access.

---

# Creation Patterns

## Manual Creation

Standard manual creation flow:

```text
Create

↓

Enter Minimum Required Content

↓

Save

↓

Add More Details Later
```

The system should not require complete profiles before content becomes usable.

---

## AI-Assisted Creation

Standard AI flow:

```text
Generate Ideas

↓

Review Three Suggestions

↓

Select

↓

Edit

↓

Save
```

AI-generated content is not canonical until saved.

---

## Contextual Creation

World elements may be created from:

* Adventure Designer;
* Running Session;
* Session Summary;
* World Update review.

Contextual creation should preserve:

* source Adventure;
* source Session;
* related Scene;
* origin type.

---

# World Update Integration

## Purpose

World Updates transform Session events into persistent Project changes.

Possible updates:

* create NPC;
* update NPC;
* create Location;
* update Location;
* create World Fact;
* supersede World Fact;
* update Character;
* archive an element;
* add a relationship.

---

## World Update Flow

```text
Session Ends

↓

AI or User Identifies Possible Changes

↓

Review Individual Updates

↓

Accept, Edit or Ignore

↓

Apply Selected Updates
```

Each update must be independently reviewable.

---

## New Entity Suggestion

Example:

```text
New NPC

Mira
Forest Ranger

Appeared during:
The Mist Forest
```

Actions:

* Accept;
* Edit;
* Merge with Existing;
* Keep in Session Only;
* Ignore.

---

## Update Existing Entity Suggestion

Example:

```text
Update NPC

Professor Elm now trusts Emma.
```

Actions:

* Accept;
* Edit;
* Convert to World Fact;
* Ignore.

---

## Merge With Existing

When a new proposed NPC or Location resembles existing content, the system may suggest a merge.

The user must choose.

Merging should:

* preserve references;
* preserve history;
* avoid duplicate canonical entities;
* allow field-level review.

Automatic merge is not allowed.

---

# Duplicate Detection

Possible duplicate signals:

* same normalized name;
* similar role;
* same source;
* matching associated Location;
* close semantic description.

Duplicate detection should be advisory.

The system should never silently merge world elements.

---

## Duplicate Resolution

Actions:

```text
Use Existing

Merge

Keep Both

Edit New Entry

Cancel
```

If both are kept, the user may distinguish them with:

* role;
* Location;
* descriptive label;
* nickname.

---

# References

World elements may be referenced by:

* Adventures;
* Scenes;
* Encounters;
* Sessions;
* Timeline Entries;
* Rewards;
* Narrative Context;
* World Updates.

References should use stable identifiers.

Display names may change without breaking references.

---

## Missing References

If a referenced element is archived or unavailable:

* preserve the reference;
* show its status;
* allow replacement where needed;
* do not silently create a duplicate;
* do not crash the consuming feature.

Example:

```text
Professor Elm

Archived NPC
```

---

# Search

World-wide search may match:

* Character name;
* NPC name;
* Location name;
* World Fact text;
* descriptions;
* related Adventure;
* related Session.

Search results should identify category.

Example:

```text
Professor Elm
NPC

Elm Laboratory
Location

Professor Elm trusts the trainers.
World Fact
```

Global World search may be deferred if category-level search is sufficient for the MVP.

---

# Filtering

Recommended category filters:

## Characters

* Active;
* Archived;
* recently played.

## NPCs

* Active;
* Draft;
* Archived;
* recent;
* Location;
* Adventure.

## Locations

* type;
* active;
* archived;
* recent;
* related Adventure.

## World Facts

* category;
* active;
* superseded;
* visibility;
* related entity.

Avoid dense advanced filter panels by default on mobile.

---

# Sorting

Recommended default:

* recently updated.

Optional sorting:

* name;
* first appearance;
* last appearance;
* created date;
* category.

---

# Recent Activity

World Management may show recent narrative changes.

Examples:

```text
Professor Elm now trusts Emma.

The Old Bridge was repaired.

Mira was added as an NPC.

The Hidden Cave was discovered.
```

Avoid technical wording such as:

```text
NPC entity updated.
```

---

# Editing

## Autosave

Simple edits may autosave.

For structured multi-field editing, explicit Save may be used when clearer.

The chosen pattern should be consistent inside each editor.

---

## Edit Conflicts

If the same world element is edited in multiple places:

* preserve both versions when possible;
* avoid silent overwrite;
* show conflict context;
* ask the user to choose when changes are incompatible.

Complex multi-user conflict resolution is out of scope for the MVP.

---

# Archive Versus Delete

World elements should normally be archived rather than deleted.

Archiving preserves:

* references;
* history;
* Session continuity;
* Collection provenance.

Permanent deletion should be reserved for:

* accidental empty drafts;
* invalid duplicate entries;
* privacy-related removal;
* explicitly supported correction flows.

---

## Delete Draft

An unused Draft with no references may be deleted with minimal confirmation.

---

## Delete Referenced Content

Content referenced by Adventures or Sessions should not be permanently deleted in the MVP.

Offer Archive instead.

---

# Business Rules

* Every Character belongs to exactly one Project.
* Every NPC belongs to exactly one Project when promoted to Project level.
* Every Location belongs to exactly one Project when promoted to Project level.
* Every World Fact belongs to exactly one Project.
* Adventure-specific drafts are not automatically Project-level content.
* AI Suggestions are not canonical until accepted.
* Session Notes are not World Facts automatically.
* Permanent world changes require explicit approval.
* Existing entities should be referenced rather than duplicated.
* Promotion must preserve existing references.
* Archived entities retain historical references.
* Character Collection ownership remains after Character archiving.
* World Facts may be superseded without deleting history.
* Game Master-only content must not be exposed to player-facing contexts.
* The complete World is not automatically sent to AI.
* Narrative Context includes only relevant World elements.
* Duplicate detection is advisory.
* Merge actions require explicit user confirmation.
* Browsing World content must not mutate state.
* Display name changes must not change entity identity.
* Removing a draft must not cascade-delete accepted domain content.
* An entity used by an active Session must not be destructively removed.
* Project-level content must not reference entities from another Project.
* World Update approval must use explicit Application-layer actions.

---

# Domain Model Interaction

Related concepts:

* Project;
* Character;
* NPC;
* Location;
* World Fact;
* Adventure;
* Scene;
* Session;
* Timeline Entry;
* Session Summary;
* World Update;
* Narrative Context;
* AI Suggestion.

---

## Aggregate Considerations

Avoid one large World Aggregate containing every Character, NPC, Location and Fact.

Potential Aggregate roots:

* Character;
* NPC;
* Location;
* World Fact;
* Project as ownership boundary.

The Project may enforce ownership through identifiers and Application coordination rather than loading every world entity together.

---

## Character Model

Conceptual shape:

```typescript
interface Character {
  readonly id: string;
  readonly projectId: string;
  readonly name: string;
  readonly description: string | null;
  readonly personalityNotes: string | null;
  readonly goals: readonly string[];
  readonly status: CharacterStatus;
}
```

---

## NPC Model

```typescript
interface Npc {
  readonly id: string;
  readonly projectId: string;
  readonly name: string;
  readonly role: string;
  readonly description: string | null;
  readonly motivation: string | null;
  readonly status: NpcStatus;
  readonly visibility: WorldVisibility;
}
```

---

## Location Model

```typescript
interface Location {
  readonly id: string;
  readonly projectId: string;
  readonly name: string;
  readonly type: LocationType;
  readonly description: string | null;
  readonly mood: string | null;
  readonly status: LocationStatus;
}
```

---

## World Fact Model

```typescript
interface WorldFact {
  readonly id: string;
  readonly projectId: string;
  readonly text: string;
  readonly category: WorldFactCategory;
  readonly visibility: WorldVisibility;
  readonly status: WorldFactStatus;
  readonly relatedEntityIds: readonly string[];
  readonly sourceAdventureId: string | null;
  readonly sourceSessionId: string | null;
}
```

These are conceptual models.

They are not mandatory persistence schemas.

---

# Suggested Application Use Cases

## Characters

```text
CreateCharacter

UpdateCharacter

GetCharacter

ListCharacters

ArchiveCharacter

RestoreCharacter

AttachCharacterToAdventure
```

## NPCs

```text
CreateNpc

CreateNpcDraft

PromoteNpcToProject

UpdateNpc

GetNpc

ListNpcs

ArchiveNpc

RestoreNpc

AttachNpcToAdventure

MergeNpc
```

## Locations

```text
CreateLocation

CreateLocationDraft

PromoteLocationToProject

UpdateLocation

GetLocation

ListLocations

ArchiveLocation

RestoreLocation

AttachLocationToAdventure

MergeLocation
```

## World Facts

```text
CreateWorldFact

UpdateWorldFact

SupersedeWorldFact

ArchiveWorldFact

RestoreWorldFact

ListWorldFacts

GetWorldFact

DetectWorldFactConflict
```

## World Updates

```text
ListProposedWorldUpdates

AcceptWorldUpdate

EditAndAcceptWorldUpdate

IgnoreWorldUpdate

MergeProposedEntity

ApplySelectedWorldUpdates
```

Avoid unrestricted generic update operations where explicit intent provides safer domain transitions.

---

# Suggested Angular Structure

```text
features/
  world-management/
    pages/
      character-list-page/
      character-details-page/
      npc-list-page/
      npc-details-page/
      location-list-page/
      location-details-page/
      world-fact-list-page/
      world-fact-details-page/
      world-update-review-page/
    components/
      world-category-header/
      world-search/
      world-filter-sheet/
      character-card/
      character-form/
      npc-card/
      npc-form/
      npc-relationship-list/
      location-card/
      location-form/
      world-fact-card/
      world-fact-form/
      world-history-list/
      entity-reference-list/
      promotion-dialog/
      duplicate-resolution-dialog/
      world-update-card/
      archive-world-entity-dialog/
    application/
      manage-characters/
      manage-npcs/
      manage-locations/
      manage-world-facts/
      promote-world-entity/
      resolve-duplicates/
      review-world-updates/
    domain/
      character/
      npc/
      location/
      world-fact/
      world-visibility/
      world-update/
    infrastructure/
      character-repository/
      npc-repository/
      location-repository/
      world-fact-repository/
      world-search-repository/
```

Feature-specific selectors inside Adventure Designer and Running Session may reuse shared World components when responsibilities align.

Avoid creating parallel NPC and Location models inside each feature.

---

# Suggested List View Model

```typescript
interface WorldEntitySummary {
  readonly id: string;
  readonly type: 'character' | 'npc' | 'location' | 'world-fact';
  readonly title: string;
  readonly subtitle: string | null;
  readonly imageUrl: string | null;
  readonly status: string;
  readonly lastActivityAt: string | null;
  readonly sourceLabel: string | null;
}
```

Use category-specific detail View Models for richer pages.

---

# State Management

Angular Signals should manage UI state.

Example:

```typescript
readonly activeFilter = signal<WorldFilter>('active');
readonly searchQuery = signal('');
readonly entities = signal<readonly WorldEntitySummary[]>([]);
readonly isLoading = signal(false);
readonly selectedEntityId = signal<string | null>(null);
```

Derived state:

```typescript
readonly visibleEntities = computed(() =>
  filterWorldEntities(
    this.entities(),
    this.activeFilter(),
    this.searchQuery(),
  ),
);
```

Server-backed search may later replace local filtering.

---

# Data Loading

World lists should load summary projections.

Detail pages should load the selected entity and relevant relationship summaries.

Avoid loading:

* all Adventures;
* all Sessions;
* all Collection content;
* the complete Project graph

for every World screen.

Related content should load progressively.

---

# Loading States

Use category-specific skeleton Cards.

Known titles may remain visible during background refresh.

One failed relationship section should not prevent the main entity from loading.

Example:

* NPC profile loads;
* Session history temporarily fails;
* NPC remains usable.

---

# Empty States

## No Characters

```text
No Characters yet.

Create the trainers who will shape this world.
```

Primary action:

```text
Create Character
```

---

## No NPCs

```text
No NPCs have joined the story yet.

Create one or add them while designing an Adventure.
```

Primary action:

```text
Create NPC
```

---

## No Locations

```text
The world is waiting to be discovered.

Create the first Location or add one during Adventure design.
```

Primary action:

```text
Create Location
```

---

## No World Facts

```text
No permanent World Facts have been recorded yet.

Important changes from Sessions will appear here after approval.
```

Primary action may be omitted or:

```text
Add World Fact
```

---

## No Search Results

```text
No world content matches your search.
```

Actions:

* clear search;
* adjust filters.

---

# Error Handling

## List Loading Failed

```text
We could not load this part of the world.
```

Actions:

* Retry;
* show cached content where available.

---

## Entity Not Found

```text
This world element could not be found.
```

Actions:

* return to category list;
* retry.

---

## Save Failed

Preserve entered values.

Display:

```text
Your changes could not be saved.
```

Actions:

* Retry;
* continue editing;
* leave with warning.

---

## Promotion Failed

The Adventure or Session draft remains intact.

Display:

```text
The NPC could not be added to the Project yet.

It remains available in the current Adventure.
```

---

## Merge Failed

Do not remove either entity.

Display a recoverable error.

---

## Missing Reference

Preserve the current entity.

Mark the unavailable reference as needing attention.

Allow:

* remove reference;
* replace reference;
* restore archived entity where supported.

---

## World Fact Conflict

Show the existing and proposed Facts together.

Do not guess which one is correct.

---

# Offline Behaviour

When offline, the user should be able to:

* browse cached Characters;
* browse cached NPCs;
* browse cached Locations;
* browse cached World Facts;
* create and edit local drafts;
* use locally available content in Adventure preparation;
* review pending World Updates locally where supported.

Unavailable capabilities may include:

* AI generation;
* cloud image generation;
* remote semantic duplicate detection;
* uncached history.

Offline changes should synchronize later.

Synchronization must preserve stable identifiers and avoid duplicates.

---

# Synchronization Conflicts

Potential conflicts include:

* same NPC edited on multiple devices;
* Location archived while referenced elsewhere;
* two different updates supersede the same World Fact;
* duplicate NPC promotion;
* Character renamed concurrently.

Conflict handling should prioritize:

1. no data loss;
2. preserving historical references;
3. showing both versions;
4. explicit user resolution for ambiguous story truth.

The MVP may limit multi-device editing complexity until collaboration is introduced.

---

# Responsive Behaviour

## Phone

* single-column lists;
* full-screen detail pages;
* bottom sheets for filters and selection;
* short creation flows;
* clear contextual actions;
* relationship details shown progressively.

## Tablet

* list and detail may appear side by side;
* filters remain visible;
* related content may use a secondary panel;
* World Update review may use two columns.

## Desktop

* persistent category navigation may be introduced;
* list, detail and context inspector may coexist;
* avoid dense administrative tables as the default;
* preserve visual storytelling.

All essential actions must work without hover or drag-and-drop.

---

# Accessibility

* Cards acting as links must be keyboard accessible.
* Status must not rely only on color.
* Game Master-only content must have clear text labels.
* Form controls require persistent labels.
* Validation errors must be connected to fields.
* Archive and merge actions must explain consequences.
* Relationships must be understandable without visual diagrams.
* Search and filters require accessible names.
* Focus must move predictably after creation, promotion, archive and restore.
* Touch targets should be at least 44 × 44 CSS pixels where practical.
* Images require useful alternative text or must be decorative.
* Dynamic updates should be announced only when necessary.

---

# Privacy

World content may contain:

* child Character names;
* personal campaign details;
* custom images;
* Game Master-only secrets;
* generated content.

The system should:

* avoid public exposure;
* use protected identifiers;
* prevent secret content from appearing in player-facing contexts;
* minimize personal information sent to AI;
* protect archived content with the same access controls;
* avoid logging complete secret content unnecessarily.

---

# Performance

World content may grow significantly over time.

The implementation should support:

* paginated or incremental lists;
* optimized summary projections;
* lazy-loaded images;
* category-specific queries;
* cached recent content;
* server-side search when needed;
* avoiding full Project graph loading.

The initial version may use simpler list loading while preserving clear query boundaries.

---

# Acceptance Criteria

The feature is complete when:

* the user can browse Characters within a Project;
* the user can create and edit a Character;
* the user can archive and restore a Character;
* Character history and Collection ownership remain after archiving;
* the user can browse NPCs;
* the user can create a lightweight NPC;
* the user can edit NPC details;
* the user can promote an Adventure- or Session-created NPC to Project level;
* promotion preserves existing references;
* the user can archive and restore an NPC;
* the user can browse Locations;
* the user can create and edit a Location;
* the user can promote an Adventure- or Session-created Location;
* the user can archive and restore a Location;
* the user can browse World Facts;
* the user can create a World Fact;
* the user can supersede an existing World Fact without deleting history;
* secret and player-known content remain distinguishable;
* the user can review proposed World Updates;
* every World Update can be accepted, edited or ignored independently;
* duplicate entities are not merged automatically;
* the user can merge or keep possible duplicates explicitly;
* archived entities retain historical references;
* missing references are handled safely;
* AI Suggestions do not become canonical automatically;
* loading, empty, offline and error states are handled;
* the feature works on phone, tablet and desktop;
* list browsing does not mutate domain state;
* state-changing actions use Application-layer use cases;
* Angular templates do not implement merge, conflict or lifecycle rules.

---

# Out of Scope

Not part of the initial implementation:

* complete campaign wiki;
* public world sharing;
* collaborative world editing;
* organization and faction management;
* complex relationship graphs;
* interactive geographic maps;
* custom ontology;
* automatic entity merging;
* automatic World Update approval;
* automatic contradiction resolution;
* ruleset-specific Character sheets;
* full quest management;
* dynamic time simulation;
* branching world versions;
* cross-Project world content;
* public player encyclopedia;
* advanced permissions per world element;
* semantic search across external sources.

---

# Future Enhancements

Possible future additions:

* organizations and factions;
* Story Threads;
* relationship visualization;
* interactive world map;
* Location hierarchy;
* reusable world templates;
* Project import and export;
* player-facing known-world view;
* richer entity history;
* automatic but reviewable contradiction detection;
* advanced duplicate suggestions;
* shared NPC libraries;
* campaign timeline;
* role-based visibility;
* collaborative editing;
* world state snapshots;
* branchable campaign alternatives.

These additions must preserve explicit Game Master control over canonical world truth.

---

# Final Principle

The World is not a collection of reference records.

It is the accumulated consequence of every Adventure.

World Management should preserve continuity without making the Game Master maintain a database.
