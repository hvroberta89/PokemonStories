# Collection

## Purpose

The Collection represents the long-term progression and memories created throughout a Pokémon Stories Project.

It brings together everything that Characters and the group have earned, discovered or collected across Adventures and Sessions.

The Collection is not only an inventory screen.

It is the visible history of the campaign.

It should help players and the Game Master remember:

* which Pokémon were encountered or caught;
* which Items were earned;
* which Badges and Achievements were unlocked;
* which Outfits belong to each Character;
* which important Quest Items are active;
* which physical Rewards were printed or still require attention.

---

## Responsibilities

The Collection allows the Game Master to:

* view all collected content within a Project;
* filter content by Character or group;
* browse the Pokédex;
* view Character Inventory;
* manage equipped Outfits;
* review Badges and Achievements;
* inspect Quest Items and Cards;
* open Reward details;
* access the Reward Queue;
* reprint previously earned Rewards;
* understand where and when content was earned;
* correct Collection information when necessary.

The Collection is not responsible for:

* deciding when a Reward is earned;
* running live Sessions;
* designing Adventures;
* automatically creating ownership;
* acting as a complete battle or equipment rules engine;
* replacing the Reward System;
* managing printer hardware directly.

---

## Experience Goal

The Collection should feel rewarding, visual and personal.

It should not feel like:

* a database table;
* a technical inventory;
* an audit log;
* a warehouse management interface;
* a list of unrelated records.

The user should feel that the Collection grows with every Adventure.

Opening it should communicate:

> This is what happened in our story.

---

## Core Principles

### Collection Reflects Earned Story Progress

Collection content must come from meaningful campaign events.

Examples:

* a Pokémon was caught;
* an Item was received;
* a Badge was earned;
* an Outfit was unlocked;
* an Achievement was awarded;
* a Quest Item was discovered.

The Collection should not create these events by itself.

It reflects ownership and history established elsewhere.

---

### Ownership and Physical Representation Are Separate

A Collection Item exists because it was earned.

It does not depend on:

* printing;
* successful export;
* physical delivery;
* printer availability.

A digital Collection Item may exist without any physical representation.

A physical Reward may be reprinted without creating a new Collection Item.

---

### Character and Group Ownership Must Be Clear

Some Collection Items belong to one Character.

Others belong to:

* multiple Characters;
* the full group;
* the Project world.

The interface must make ownership visible and understandable.

---

### The Collection Should Celebrate Progress

Collection growth should feel positive.

New Items may receive:

* subtle highlighting;
* “New” indicators;
* unlock animations;
* Session grouping;
* printable options.

Celebration should support the story without creating unnecessary friction.

---

### Collection Is Read-First

The primary purpose is browsing and remembering.

Editing and correction actions should remain available but secondary.

The Collection must not feel like an administrative editor.

---

## Collection Structure

The Collection may contain the following primary areas:

```text
Collection

├── Overview
├── Pokédex
├── Inventory
├── Outfits
├── Badges
├── Achievements
├── Quest Items
├── Cards
├── Reward Queue
└── Print History
```

The MVP may omit Print History as a dedicated screen while retaining essential print state.

---

## Collection Home

The Collection Home provides an overview of Project progression.

Recommended route:

```text
/projects/:projectId/collection
```

Recommended content:

* Character or ownership filter;
* new content from the latest Session;
* Pokédex summary;
* Inventory summary;
* Badge summary;
* Achievement summary;
* unresolved Reward Queue count;
* recently earned Items.

Example:

```text
Collection

New this Session
5 Items

Pokédex
18 caught · 32 seen

Inventory
12 owned Items

Badges
3 unlocked

Reward Queue
2 waiting
```

The screen should emphasize progress and recent story events rather than raw totals.

---

## Ownership Filter

The Collection should support filtering by ownership.

Recommended options:

```text
All

Emma

Marci

Everyone
```

Possible later options:

* Project;
* unassigned;
* archived Characters.

The selected filter should apply consistently across Collection areas when relevant.

---

## All View

The `All` view displays all content in the Project.

It may group content by:

* Character;
* Reward type;
* recent Session;
* ownership scope.

The view should avoid duplicate visual entries when one shared Reward belongs to everyone.

---

## Character View

A Character-specific view displays:

* Pokémon;
* Items;
* equipped Outfit;
* owned Outfits;
* Badges;
* Achievements;
* Quest Items;
* earned Cards;
* recent Collection activity.

The Character view represents one Character’s progression.

---

## Everyone View

The `Everyone` view displays group-owned content.

Examples:

* shared Badges;
* discovered Locations;
* group achievements;
* Project access Rewards;
* shared Quest Items;
* Adventure completion Cards.

Group-owned content should not be duplicated under each Character unless separate ownership Grants exist.

---

## Collection Item

A Collection Item represents owned or discovered content visible in the Collection.

A Collection Item may be based on:

* a Reward Grant;
* Pokémon progression;
* an accepted World Update;
* an explicitly recorded discovery;
* a manual correction.

Recommended common fields:

* identifier;
* Project;
* type;
* name;
* description;
* owner or ownership scope;
* source Adventure;
* source Session;
* earned or discovered date;
* image or icon;
* physical representation state;
* category-specific metadata.

The exact data differs by Collection category.

---

## Collection Item Provenance

Where practical, every Collection Item should preserve its story origin.

Possible provenance:

* Adventure;
* Session;
* Scene;
* Encounter;
* Reward;
* manual correction;
* import.

Example:

```text
Pikachu

Caught by Emma

First met:
Flower Meadow

Adventure:
The Lost Pokémon Egg
```

Provenance strengthens the narrative value of the Collection.

It should not be required when historic or manually entered data lacks complete information.

---

## Recent and New Items

New Collection Items should be highlighted after they are earned.

Possible states:

```text
New

Viewed
```

The `New` state is a presentation concern.

It must not affect ownership.

An Item may be marked Viewed when the user:

* opens its details;
* acknowledges the latest Session collection summary;
* explicitly clears new indicators.

The application should avoid persistent notification clutter.

---

# Pokédex

## Purpose

The Pokédex records Pokémon encountered throughout the Project.

It supports discovery, ownership and story memory.

It is not intended to replace a complete external Pokémon encyclopedia.

The focus is campaign-specific progression.

---

## Pokédex States

Recommended progression states:

```text
Unknown

Seen

Encountered

Caught

Befriended

Owned

Evolved
```

The exact set should remain as simple as the gameplay requires.

For the MVP, a reduced model may use:

```text
Seen

Caught
```

with optional narrative details.

---

## State Meanings

### Unknown

The Pokémon has no campaign record.

Unknown Pokémon may be hidden from the Collection.

### Seen

The Pokémon became known to the players.

It was not necessarily directly encountered.

### Encountered

The players interacted with the Pokémon.

### Caught

A Character caught the Pokémon.

### Befriended

The Pokémon became a companion through story rather than capture.

### Owned

The Pokémon currently belongs to a Character.

### Evolved

An owned Pokémon reached an evolved form.

Evolution history should preserve the story relationship where appropriate.

---

## Pokédex List

Recommended route:

```text
/projects/:projectId/collection/pokedex
```

The list may display:

* image or silhouette;
* Pokédex number when available;
* Pokémon name;
* status;
* owner;
* first encounter Location;
* new indicator.

Example:

```text
#001 Bulbasaur
Caught by Marci

#025 Pikachu
Caught by Emma

#037 Vulpix
Seen
```

---

## Pokédex Search and Filtering

Recommended filters:

* status;
* owner;
* type;
* recently discovered.

Search may match:

* Pokémon name;
* owner;
* Adventure;
* Location.

Advanced biological or competitive filters are out of scope for the MVP.

---

## Pokémon Entry

Recommended route:

```text
/projects/:projectId/collection/pokedex/:entryId
```

Recommended content:

* Pokémon name;
* image;
* campaign status;
* owner or owners;
* first seen date;
* first encounter;
* caught or befriended event;
* related Adventure;
* related Session;
* story notes;
* printable options;
* evolution history where relevant.

Example:

```text
Pikachu

Caught by
Emma

First met
Flower Meadow

Adventure
The Lost Pokémon Egg

Printable
Pokédex Sticker
Large Card
```

---

## Multiple Characters and the Same Pokémon Species

Multiple Characters may own Pokémon of the same species.

The Pokédex must distinguish:

```text
Species Entry
```

from:

```text
Owned Pokémon Instance
```

Example:

* Pikachu has one species-level Pokédex entry;
* Emma’s Pikachu is one owned instance;
* Marci’s Pikachu is another owned instance.

Species discovery must not be duplicated unnecessarily.

Owned instances must preserve individual story identity.

---

## Owned Pokémon Instance

An owned Pokémon may contain:

* nickname;
* species;
* owner;
* date acquired;
* source Session;
* personality notes;
* current progression state;
* evolution history;
* printable options.

Detailed combat statistics belong to a future rule-system feature, not the Collection MVP.

---

## Evolution

When a Pokémon evolves:

* the owned instance remains the same story participant;
* its current species or form changes;
* evolution history is retained;
* the Pokédex marks relevant species as discovered;
* new printable representations may become available.

Evolution must not create an unrelated duplicate Pokémon instance.

---

# Inventory

## Purpose

Inventory displays Items owned by Characters or the group.

It should remain lightweight and story-focused.

The MVP does not require a complex weight, slot or equipment engine.

---

## Inventory Route

```text
/projects/:projectId/collection/inventory
```

Recommended filters:

* owner;
* Item type;
* status;
* recently received.

---

## Item States

Recommended initial states:

```text
Owned

Equipped

Consumed

Lost
```

Not every Item supports every state.

Examples:

* Potion may become Consumed;
* Explorer Hat may become Equipped;
* Ancient Key may remain Owned;
* stolen map may become Lost.

---

## Owned

The Item belongs to the recipient and is available.

---

## Equipped

The Item is currently worn or actively used.

Equipped should not necessarily imply exclusive equipment-slot rules in the MVP.

---

## Consumed

The Item was used and is no longer available.

Its history remains visible where useful.

Consumed Items may be hidden from the default active Inventory while remaining available in history.

---

## Lost

The Item was lost through the story.

Ownership history remains recorded.

A Lost Item may later be recovered.

---

## Inventory Item

Recommended content:

* name;
* image or icon;
* owner;
* state;
* description;
* source Adventure;
* earned date;
* quantity where supported;
* printable representation;
* story notes.

Quantities should only be introduced when they provide actual gameplay value.

Avoid adding numeric stock management by default.

---

## Item Actions

Possible actions:

* Equip;
* Unequip;
* Consume;
* Mark Lost;
* Restore;
* View Story;
* Reprint.

State-changing actions should require explicit intent.

Important or irreversible-looking actions should clearly describe their meaning.

---

## Shared Items

Some Items may belong to the group.

Examples:

* map;
* shared tent;
* laboratory key;
* Quest Item.

Shared Items should appear in the Everyone view.

They should not be automatically duplicated into each Character’s Inventory.

---

# Outfits

## Purpose

Outfits represent wearable and cosmetic progression.

They provide visual and emotional Character customization.

Outfits may come from:

* Rewards;
* shops or story events;
* Adventure completion;
* custom creation.

---

## Outfit Route

```text
/projects/:projectId/collection/outfits
```

Recommended content:

* current equipped Outfit;
* owned Outfit pieces;
* owner;
* source;
* printable sticker;
* visual preview where available.

---

## Outfit States

Recommended states:

```text
Owned

Equipped

Unavailable
```

`Unavailable` may represent temporarily unusable or lost content but may be deferred.

For the MVP:

```text
Owned

Equipped
```

may be sufficient.

---

## Equip Behaviour

Equipping an Outfit:

* changes presentation state;
* does not alter ownership;
* should be reversible;
* may replace another equipped Item in the same future category.

Complex Outfit slots are out of scope unless required later.

---

## Outfit Ownership

Outfits usually belong to one Character.

Group-owned costume sets may be represented as separate Grants or shared definitions.

The interface should clearly indicate who can use an Outfit.

---

# Badges

## Purpose

Badges represent important recognition, milestones or formal achievements.

They should feel collectible and visually distinctive.

---

## Badge Route

```text
/projects/:projectId/collection/badges
```

Badge categories may include:

* Gym Badge;
* Adventure Badge;
* Explorer Badge;
* friendship recognition;
* custom Badge.

---

## Badge Ownership

A Badge may belong to:

* one Character;
* multiple Characters;
* everyone.

The ownership model must preserve whether one shared Badge or multiple individual Badge Grants exist.

---

## Badge Detail

Recommended content:

* Badge name;
* illustration;
* recipient;
* description;
* earned date;
* source Adventure;
* source Session;
* unlock story;
* printable options;
* print and delivery state.

---

## Badge Ordering

Possible ordering:

* recently earned;
* campaign order;
* custom display order;
* Badge category.

The MVP should use recent or earned order.

Manual display arrangement may be added later.

---

# Achievements

## Purpose

Achievements recognize meaningful actions or campaign milestones.

They may be formal or playful.

Examples:

* First Pokémon Caught;
* Clever Problem Solver;
* Helped Every Villager;
* Brave Explorer;
* Perfect Teamwork.

---

## Achievement Route

```text
/projects/:projectId/collection/achievements
```

Achievements may belong to:

* one Character;
* multiple Characters;
* everyone.

---

## Achievement Creation

Achievements may originate from:

* prepared Rewards;
* Game Master decisions during a Session;
* Session completion review;
* AI Suggestions accepted by the Game Master.

The MVP should not automatically award Achievements from hidden rule detection.

---

## Achievement Detail

Recommended content:

* title;
* icon or artwork;
* recipient;
* description;
* why it was earned;
* source Adventure;
* source Session;
* date;
* printable options.

The reason should be written narratively.

Example:

```text
Clever Problem Solver

Emma discovered how to redirect the river without fighting the wild Pokémon.
```

---

# Quest Items

## Purpose

Quest Items are story-important objects that may remain relevant across Adventures.

Examples:

* Ancient Map;
* Royal Invitation;
* Mysterious Egg;
* Laboratory Keycard;
* broken artifact.

Quest Items are different from ordinary Inventory Items because they carry campaign significance.

---

## Quest Item States

Recommended states:

```text
Active

Used

Completed

Lost
```

### Active

Still relevant to an open story.

### Used

Used in the story but may still exist physically.

### Completed

Its narrative purpose has ended.

### Lost

Currently unavailable through story events.

---

## Quest Item Detail

Recommended content:

* name;
* owner or group;
* description;
* current state;
* related Adventure;
* related open question or objective;
* acquisition event;
* history;
* printable representation.

Quest Items may later integrate with a Quest or Story Thread feature.

---

# Cards

## Purpose

Cards represent collectible physical or digital story artifacts.

Examples:

* NPC Card;
* Location Card;
* Pokémon Card;
* Adventure Memory Card;
* Item Card.

Cards may be associated with other Collection Items.

They should not duplicate ownership semantics unnecessarily.

---

## Card Relationship

A Card may represent:

* a Pokémon;
* an NPC;
* a Location;
* a Reward;
* a completed Adventure;
* a Session memory.

The underlying story object remains the source of truth.

The Card is a collectible representation.

---

## Cards Route

```text
/projects/:projectId/collection/cards
```

Recommended content:

* card preview;
* represented subject;
* owner or group;
* source;
* printed state;
* reprint action.

---

# Reward Queue Integration

The Collection provides a persistent entry point to the Reward Queue.

The Queue contains unresolved physical Reward actions.

Recommended route:

```text
/projects/:projectId/collection/reward-queue
```

The Collection Home should show:

* waiting count;
* failed print count;
* printed but not given count.

Example:

```text
Reward Queue

2 waiting
1 printed but not given
```

The Collection must not duplicate Queue transition logic.

It uses the Reward System as the source of truth.

---

# Print State

A Collection Item may show physical representation status.

Possible display states:

```text
Not Requested

Queued

Printed

Given

Printing Failed

Digital Only
```

These states describe physical fulfillment.

They do not affect Collection ownership.

---

# Reprint

A Collection Item with a supported printable representation may be reprinted.

Reprinting:

* creates a new print attempt;
* does not create new ownership;
* does not duplicate the Collection Item;
* may use a different template;
* may use a different quantity.

The UI should warn when an Item was previously printed.

---

# Collection History

The Collection may preserve meaningful history.

Possible events:

* earned;
* first viewed;
* equipped;
* consumed;
* lost;
* restored;
* evolved;
* printed;
* given;
* reprinted.

The MVP does not require a full audit timeline on every Item.

However, essential provenance and story events should remain available.

---

# Manual Corrections

The Game Master must be able to correct Collection data.

Examples:

* assign the correct Character;
* correct an Item name;
* restore an accidentally consumed Item;
* add missing provenance;
* remove an accidental duplicate Grant;
* correct print status.

Correction actions should be clearly separate from normal story actions.

Destructive corrections may require confirmation.

Corrections should avoid rewriting history silently where provenance matters.

---

# Adding Collection Items Manually

Manual addition may be needed for:

* migration from paper records;
* campaign history created before the application;
* synchronization recovery;
* external Rewards;
* correcting missing data.

Manual creation should require:

* type;
* name;
* owner or scope.

Optional:

* source;
* date;
* description;
* image;
* printable representation.

Manually added content should be marked as such internally where useful.

---

# Removing Collection Items

Removing an owned Collection Item is not a normal browsing action.

Possible reasons:

* accidental duplicate;
* invalid migration;
* user correction;
* Reward Grant created by mistake.

The UI should distinguish:

```text
Remove Incorrect Entry
```

from story transitions such as:

```text
Consume Item

Mark Lost
```

Removing an entry must not be used to represent normal narrative loss.

---

# Search

Collection-wide search may match:

* name;
* owner;
* Reward type;
* Adventure;
* Session;
* Location;
* story description.

Search results should indicate the Collection category and owner.

Example:

```text
Pikachu
Pokédex · Emma

Explorer Hat
Outfit · Marci

Forest Badge
Badge · Everyone
```

Collection-wide search may be deferred if category-level search is sufficient for the MVP.

---

# Filtering

Recommended shared filters:

* owner;
* type;
* state;
* recently earned;
* printable state.

Category-specific filters may be added where useful.

Avoid exposing complex filter panels by default on mobile.

---

# Sorting

Recommended sort options:

* newest earned;
* oldest earned;
* name;
* owner;
* status.

The default should usually be newest earned.

Pokédex may use Pokédex number or discovery order where appropriate.

---

# Collection Statistics

Statistics should support progress and storytelling.

Useful examples:

```text
18 Pokémon caught

3 Badges earned

5 new Items this Session
```

Avoid meaningless or technical counts.

Statistics should not dominate the Collection Home.

---

# Session Integration

During a Session:

* new Collection Items may be created through Reward Grants;
* Pokémon discoveries may update the Pokédex;
* Item state may change;
* new Badges or Achievements may be awarded;
* Quest Items may be acquired or used.

The Running Session should not require navigating into Collection for common actions.

Collection becomes the long-term view after the event.

---

# Session Completion Integration

Session completion should summarize:

* newly earned Collection Items;
* unresolved ownership;
* incomplete Item details;
* queued physical Rewards;
* possible state changes.

The Game Master may review and correct Collection changes before finalizing Project updates where appropriate.

Unlocked Reward ownership should not be lost because the Session Summary is incomplete.

---

# World Update Integration

Some Collection events may create or depend on World Updates.

Examples:

* group gains access to a Location;
* Narrative Reward creates a World Fact;
* Quest Item completes a campaign objective;
* Pokémon evolution changes Character state.

The Collection should display accepted results.

It should not automatically approve unrelated World Updates.

---

# AI Integration

AI may help with:

* generating Item descriptions;
* summarizing the story behind an Achievement;
* suggesting Badge names;
* categorizing manually added content;
* generating printable text;
* proposing visual descriptions.

AI must not:

* create ownership automatically;
* delete Collection Items;
* change owners;
* consume Items;
* equip Outfits;
* mark Rewards as Given;
* create permanent corrections without approval.

---

# Business Rules

* Every Collection Item belongs to exactly one Project.
* Character-owned Items require a valid Character owner.
* Group-owned Items must not be duplicated automatically for each Character.
* Ownership originates from a Reward Grant, accepted progression event or explicit manual correction.
* Printing does not create ownership.
* Reprinting does not create duplicate Collection Items.
* Removing from the Reward Queue does not remove Collection ownership.
* Consumed and Lost Items retain history.
* Pokémon species discovery and owned Pokémon instances are separate concepts.
* Evolving a Pokémon must preserve the owned instance’s identity.
* Shared Rewards and individual Grants must remain distinguishable.
* AI-generated content requires explicit acceptance.
* Collection browsing must not modify state.
* State-changing actions must be explicit.
* Manual correction must not be confused with normal gameplay transitions.
* Archived Characters may retain historical Collection Items.
* Session completion must not be blocked by unresolved printing.
* Collection projections must remain recoverable from ownership records where practical.

---

# Domain Model Interaction

Related concepts:

* Collection;
* Collection Item;
* Reward Grant;
* Reward Definition;
* Character;
* Pokémon Species Entry;
* Owned Pokémon;
* Inventory Item;
* Outfit;
* Badge;
* Achievement;
* Quest Item;
* Card;
* Session;
* Adventure;
* Timeline Entry;
* World Update;
* Print Fulfillment.

The exact Aggregate boundaries should avoid one excessively large Collection Aggregate.

A useful conceptual model is:

```text
Ownership Records
        ↓
Collection Projections
        ↓
Category Views
```

Ownership and progression records are the source of truth.

Collection screens may use optimized read models.

---

# Collection Aggregate Considerations

The Collection should not necessarily be implemented as one giant mutable Aggregate containing every earned Item.

Potential boundaries:

* Character progression;
* Pokédex;
* Reward Grants;
* Inventory;
* Project collection summary.

Choose boundaries based on consistency requirements.

Avoid loading the entire Project Collection to update one Item.

---

# Suggested Model

Example shared summary:

```typescript
interface CollectionItemSummary {
  readonly id: string;
  readonly projectId: string;
  readonly type: CollectionItemType;
  readonly name: string;
  readonly owner: CollectionOwner;
  readonly imageUrl: string | null;
  readonly earnedAt: string | null;
  readonly sourceAdventureId: string | null;
  readonly isNew: boolean;
  readonly physicalStatus: CollectionPhysicalStatus;
}
```

Owner:

```typescript
type CollectionOwner =
  | {
      readonly type: 'character';
      readonly characterId: string;
    }
  | {
      readonly type: 'multiple-characters';
      readonly characterIds: readonly string[];
    }
  | {
      readonly type: 'everyone';
    }
  | {
      readonly type: 'project';
    }
  | {
      readonly type: 'unassigned';
    };
```

Collection type:

```typescript
type CollectionItemType =
  | 'pokemon'
  | 'item'
  | 'outfit'
  | 'badge'
  | 'achievement'
  | 'quest-item'
  | 'card'
  | 'narrative';
```

These are conceptual read models.

Category-specific domain models may contain richer data.

---

# Suggested Application Use Cases

```text
LoadCollectionOverview

ListCollectionItems

SearchCollection

GetCollectionItemDetails

ListPokedexEntries

GetPokedexEntry

RecordPokemonSeen

RecordPokemonCaught

RegisterPokemonEvolution

ListInventory

EquipItem

UnequipItem

ConsumeItem

MarkItemLost

RestoreItem

ListOutfits

EquipOutfit

ListBadges

ListAchievements

ListQuestItems

UpdateQuestItemState

MarkCollectionItemViewed

CorrectCollectionItem

AddCollectionItemManually

RemoveIncorrectCollectionEntry

OpenRewardQueue

RequestCollectionItemReprint
```

Use cases may be grouped where the project structure benefits from simpler boundaries.

Avoid a generic unrestricted `UpdateCollectionItem` use case.

Prefer intent-specific operations for state transitions.

---

# Suggested Angular Structure

```text
features/
  collection/
    pages/
      collection-home-page/
      pokedex-page/
      pokemon-entry-page/
      inventory-page/
      outfits-page/
      badges-page/
      achievements-page/
      quest-items-page/
      cards-page/
      collection-item-page/
    components/
      collection-summary-card/
      collection-category-card/
      collection-owner-filter/
      collection-item-card/
      collection-item-grid/
      collection-item-list/
      new-collection-items/
      pokemon-card/
      pokemon-status-pill/
      inventory-item-card/
      outfit-card/
      badge-card/
      achievement-card/
      quest-item-card/
      collection-empty-state/
      collection-search/
      collection-filter-sheet/
      printable-actions/
    application/
      load-collection-overview/
      browse-collection/
      manage-pokedex/
      manage-inventory/
      manage-outfits/
      manage-collection-item/
      correct-collection/
    domain/
      collection-owner/
      collection-item/
      pokedex-entry/
      owned-pokemon/
      inventory-item/
      badge/
      achievement/
      quest-item/
    infrastructure/
      collection-repository/
      collection-query-repository/
```

Reward Queue components should remain owned by the Reward feature and be reused or routed to from Collection.

Avoid creating a second Reward Queue implementation.

---

# Suggested Collection Home View Model

```typescript
interface CollectionHomeViewModel {
  readonly projectId: string;
  readonly selectedOwner: CollectionOwnerFilter;
  readonly recentItems: readonly CollectionItemSummary[];
  readonly categories: readonly CollectionCategorySummary[];
  readonly rewardQueue: RewardQueueSummary;
  readonly isLoading: boolean;
}
```

```typescript
interface CollectionCategorySummary {
  readonly type: CollectionCategory;
  readonly title: string;
  readonly ownedCount: number;
  readonly secondaryCount: number | null;
  readonly newCount: number;
  readonly previewItems: readonly CollectionItemSummary[];
}
```

Example secondary counts:

* Pokédex: caught and seen;
* Inventory: active and consumed;
* Rewards: waiting and printed;
* Outfits: owned and equipped.

The Presentation layer should receive user-facing summaries.

Templates should not calculate ownership or lifecycle state.

---

# State Management

Angular Signals should manage Collection UI state.

Example:

```typescript
readonly selectedOwner = signal<CollectionOwnerFilter>('all');
readonly selectedCategory = signal<CollectionCategory | null>(null);
readonly searchQuery = signal('');
readonly items = signal<readonly CollectionItemSummary[]>([]);
readonly isLoading = signal(false);
```

Derived values:

```typescript
readonly visibleItems = computed(() =>
  filterCollectionItems(
    this.items(),
    this.selectedOwner(),
    this.searchQuery()
  )
);
```

Server-backed filtering may replace local filtering for large Collections later.

RxJS may be used for repository streams or debounced remote search where appropriate.

---

# Loading Behaviour

Collection Home should load progressively.

Preferred order:

1. Project and owner context;
2. category summaries;
3. recent Items;
4. preview images;
5. Reward Queue details.

Use skeleton cards matching the final layout.

Avoid blocking the entire screen because one category fails to load.

---

# Empty States

## Empty Collection

```text
Your Collection will grow with every Adventure.

Caught Pokémon, Rewards, Badges and story memories will appear here.
```

Suggested action:

```text
Start an Adventure
```

or:

```text
View Adventures
```

---

## Empty Character Collection

```text
Emma has not collected anything yet.

Her first Reward will appear here.
```

---

## Empty Pokédex

```text
No Pokémon have been discovered yet.

The first encounter is waiting somewhere in the story.
```

---

## Empty Inventory

```text
No Items have been collected yet.
```

Avoid showing empty categories prominently on Collection Home when they do not help the user.

---

## Empty Search

```text
No Collection Items match your search.
```

Actions:

* clear search;
* change filters.

---

# Error Handling

## Collection Loading Failed

Display:

```text
We could not load the Collection right now.
```

Actions:

* Retry;
* show locally cached data when available.

One failed category should not prevent all other Collection areas from loading.

---

## Item Details Unavailable

Keep the Item visible in lists.

Display:

```text
Some details could not be loaded.
```

Actions:

* Retry;
* return to Collection.

---

## State Change Failed

Example:

```text
The Item could not be marked as equipped.
```

The previous valid state must remain visible.

Actions:

* Retry;
* cancel.

Do not optimistically retain a failed state without recovery.

---

## Duplicate Projection

If synchronization creates duplicate visible entries:

* preserve source ownership records;
* identify probable duplicates;
* allow safe correction;
* avoid automatically deleting uncertain data.

---

## Missing Owner

If the original Character is unavailable or archived:

* preserve the Item;
* display historical owner information when known;
* allow correction;
* do not silently reassign ownership.

---

## Missing Source

A Collection Item may remain valid when its source Adventure or Session is unavailable.

Display:

```text
Original Adventure unavailable
```

Do not remove the Collection Item.

---

# Offline Behaviour

When offline, the Collection should support:

* viewing cached Items;
* browsing downloaded Pokémon entries;
* viewing ownership;
* changing local Item state where synchronization is supported;
* accessing queued Rewards;
* opening locally generated printable assets;
* recording manual corrections locally.

Unavailable actions may include:

* cloud image generation;
* AI descriptions;
* remote search;
* unavailable printable templates.

Offline state changes must synchronize safely later.

Synchronization must avoid duplicate ownership Grants.

---

# Synchronization Conflicts

Potential conflicts include:

* Item equipped on one device and consumed on another;
* owner corrected differently;
* duplicate manual Item creation;
* Pokémon evolution changed concurrently;
* print state updated from multiple devices.

Conflict handling should prioritize:

1. preserving ownership history;
2. avoiding data loss;
3. surfacing unresolved conflicts;
4. requiring user choice for ambiguous narrative changes.

The MVP may avoid complex multi-device editing until collaboration is introduced.

---

# Responsive Behaviour

## Phone

* single-column Collection Home;
* owner filter as horizontal selector;
* category cards;
* two-column visual grids where space permits;
* list fallback for text-heavy categories;
* bottom sheets for filtering and actions;
* full-screen Item details.

## Tablet

* wider grids;
* category list and detail panel may appear side by side;
* owner filter remains visible;
* recent Items may use a horizontal gallery.

## Desktop

* sidebar category navigation may be introduced;
* Collection grid and detail inspector may coexist;
* preserve visual storytelling;
* avoid dense administrative tables as the default view.

All essential actions must remain available without hover.

---

# Accessibility

* Ownership must not be communicated only through color.
* Images require meaningful alternative text or should be marked decorative.
* Collection grids must follow logical keyboard order.
* Cards acting as links must be fully keyboard accessible.
* New indicators must have accessible text.
* Status Pills must include readable labels.
* Search and filters require persistent accessible names.
* Item state actions must communicate their result.
* Reprint actions must explain that ownership will not be duplicated.
* Touch targets should be at least 44 × 44 CSS pixels where practical.
* Focus should move predictably when filters, details or correction dialogs open.
* Reduced-motion preferences must be respected.
* Silhouette-based unknown Pokémon must remain understandable without relying only on shape.

---

# Privacy

Collection content may contain:

* child names;
* custom Pokémon nicknames;
* personal story events;
* generated artwork;
* exported physical assets.

The system should:

* avoid public asset exposure;
* use protected references;
* minimize personal information in filenames;
* allow review before external sharing;
* apply Project access rules consistently;
* avoid exposing archived Character data to unauthorized users.

---

# Performance

Collections may grow significantly over time.

The implementation should support:

* pagination or incremental loading;
* image lazy loading;
* optimized category projections;
* summary queries;
* virtual scrolling only when justified;
* cached thumbnails;
* avoiding full Project Aggregate loading for browsing.

The initial implementation may load small Collections directly while keeping query boundaries ready for growth.

---

# Acceptance Criteria

The feature is complete when:

* the user can open the Collection Home for an active Project;
* the user can filter Collection content by Character or group;
* recent Collection Items are visible;
* Pokédex summary and entries are available;
* the user can distinguish seen and caught Pokémon;
* multiple owned Pokémon of the same species remain distinct;
* Pokémon evolution preserves owned Pokémon identity;
* the user can browse Inventory;
* the user can Equip and Unequip supported Items;
* the user can mark supported Items as Consumed or Lost;
* the user can browse Outfits;
* the user can Equip an Outfit;
* the user can browse Badges;
* the user can browse Achievements;
* the user can browse Quest Items;
* each Collection Item shows ownership clearly;
* source Adventure or Session is shown when available;
* unlocked Rewards appear in the correct Collection category;
* physical print state does not affect ownership;
* the user can access the Reward Queue;
* the user can request a reprint without duplicating ownership;
* the user can correct invalid Collection data;
* empty, loading, offline and error states are handled;
* the feature works on phone, tablet and desktop;
* Collection browsing does not mutate domain state;
* state-changing actions use explicit Application-layer use cases;
* templates do not implement ownership or state-transition logic.

---

# Out of Scope

Not part of the initial implementation:

* competitive battle statistics;
* complete Pokémon encyclopedia data;
* trading between players;
* advanced equipment slots;
* weight and capacity systems;
* Item crafting;
* Item economy and shops;
* automatic Achievement engine;
* player-facing Collection accounts;
* public Collection sharing;
* Collection marketplace;
* complex rarity systems;
* animated 3D models;
* automatic external Pokédex synchronization;
* cross-Project ownership;
* configurable inventory rules;
* real-time collaborative Collection editing;
* advanced print history analytics.

---

# Future Enhancements

Possible future additions:

* player-facing Pokédex;
* Character profile pages;
* Collection sharing;
* Pokémon nicknames and personality profiles;
* richer evolution history;
* custom Item categories;
* equipment slots;
* collectible sets;
* rarity and special variants;
* manual Collection arrangement;
* family display mode;
* physical binder page layouts;
* Collection export;
* QR-linked printable Cards;
* story replay by Collection Item;
* milestone tracking;
* search across all Projects;
* automated but reviewable Achievement Suggestions.

These additions must preserve the Collection’s purpose as a story memory, not turn it into administrative complexity.

---

# Final Principle

The Collection is not a list of owned objects.

It is the visible memory of the campaign.

Every Pokémon, Badge, Item and Card should remind the user of something that happened at the table.
