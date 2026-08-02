# Adventure Designer

## Purpose

The Adventure Designer is the primary creative workspace of Pokémon Stories.

Its purpose is to help the Game Master transform an initial idea into a playable Adventure with the support of AI-generated suggestions.

The Adventure Designer must support creativity without turning the process into form completion or database administration.

The Game Master remains the author of the Adventure.

The AI provides alternatives, inspiration and refinement.

It never decides what becomes part of the Adventure.

---

## Responsibilities

The Adventure Designer allows the user to:

* create a new Adventure;
* define the Adventure foundation;
* develop the story;
* create and organize Scenes;
* attach Characters and NPCs;
* select or create Locations;
* define Encounters;
* prepare Rewards;
* add Secrets, Twists and Endings;
* request AI-generated suggestions;
* edit and save accepted suggestions;
* understand Adventure readiness;
* continue editing an unfinished Adventure;
* prepare the Adventure for a Session.

The Adventure Designer is not responsible for:

* running a live Session;
* updating the campaign world after gameplay;
* managing the complete Project;
* printing Rewards;
* tracking long-term Collection state;
* automatically generating and saving a complete Adventure;
* replacing the Game Master’s creative decisions.

---

## Experience Goal

The Adventure Designer should feel like a creative studio.

It should not feel like:

* a multi-page administration form;
* a database editor;
* a technical configuration screen;
* an AI chatbot;
* a mandatory linear wizard.

The user should feel that the Adventure grows gradually through their own choices.

The interface should support exploration, experimentation and revision.

---

## Core Principles

### The Game Master Is the Author

The Adventure belongs to the Game Master.

AI-generated content is always optional.

Nothing becomes part of the Adventure without explicit user acceptance.

---

### Generate, Choose, Edit, Save

Every AI-assisted section follows the same interaction pattern:

```text
Generate

↓

Review Suggestions

↓

Choose

↓

Edit

↓

Save
```

This pattern should remain consistent across the Designer.

---

### Alternatives Instead of One Answer

AI assistance should normally provide three meaningfully different suggestions.

Suggestions should differ in direction, tone or narrative approach.

They should not be minor rewrites of the same idea.

Example:

```text
Playful

Mysterious

Emotional
```

or:

```text
Simple

Unexpected

Dramatic
```

---

### Flexible Creation Order

The user may move between sections freely.

The Designer should not require every section to be completed in a strict sequence.

Some sections may depend on earlier content, but the interface should guide rather than block.

---

### Readiness, Not Perfection

An Adventure does not need every possible section to become playable.

Content is classified as:

* Required;
* Recommended;
* Optional.

Only Required content affects the basic Ready state.

Recommended and Optional content may improve the Adventure but must not prevent play.

---

### Autosave Without Losing Control

Accepted and manually entered content should be saved automatically when practical.

Autosave must not save unaccepted AI Suggestions into the Adventure.

The interface should communicate save state without interrupting the creative flow.

---

## Entry Points

The Adventure Designer may be opened from:

* Create Adventure;
* Adventure List;
* Adventure Overview;
* Project Dashboard;
* a direct route;
* a Continue Designing action.

Recommended routes:

```text
/projects/:projectId/adventures/new
```

```text
/projects/:projectId/adventures/:adventureId/design
```

The route should identify both the Project and Adventure context.

---

## Adventure Creation Flow

Recommended high-level flow:

```text
Create Adventure

↓

Foundation

↓

Story

↓

Scenes

↓

Characters and NPCs

↓

Locations

↓

Encounters

↓

Rewards

↓

Secrets and Twists

↓

Ending

↓

Review

↓

Ready
```

This flow represents the natural design order.

It is not a mandatory wizard.

The user may skip, revisit or reorder sections where domain rules allow it.

---

## Adventure Sections

The Designer contains the following major sections:

* Foundation;
* Story;
* Scenes;
* Characters;
* Locations;
* Encounters;
* Rewards;
* Secrets and Twists;
* Ending;
* Review.

Each section should:

* show its current completion state;
* provide manual creation;
* provide AI assistance where useful;
* explain what the section contributes;
* allow editing after completion.

---

## Section Status

Each section may have one of the following presentation states:

```text
Empty

Draft

Complete

Needs Attention
```

### Empty

No meaningful content has been added.

### Draft

Some content exists, but it is not considered complete.

### Complete

The section satisfies its current readiness requirements.

### Needs Attention

The section contains a problem or missing dependency.

Examples:

* a Scene references a removed Location;
* an Encounter has no Scene;
* a Reward has no recipient type;
* an accepted AI Suggestion was not saved successfully.

Section status is derived from Adventure content.

It is not manually selected.

---

## Foundation

The Foundation defines the basic identity and direction of the Adventure.

Recommended fields:

* Title;
* Premise;
* Audience;
* expected Session length;
* difficulty;
* tone;
* optional short description.

The Foundation should be lightweight.

It should provide enough context for the AI and later sections without forcing the user to define the whole Adventure immediately.

---

## Title

The Adventure Title is required.

The title:

* should clearly identify the Adventure;
* does not need to be unique across all Projects;
* should allow Unicode and accented characters;
* should be editable later.

Recommended maximum:

```text
120 characters
```

Whitespace-only titles are invalid.

Leading and trailing whitespace should be normalized.

---

## Premise

The Premise describes the central idea of the Adventure.

It should answer:

* What is happening?
* Why should the players care?
* What begins the Adventure?

Example:

```text
A rare Pokémon Egg disappeared from Professor Elm’s garden during the night, and strange footprints lead toward the nearby forest.
```

The Premise is Required.

It should remain concise enough to support quick understanding and AI context construction.

Recommended maximum:

```text
1000 characters
```

---

## Audience

Audience defines the intended player group.

It may influence:

* language complexity;
* emotional intensity;
* danger level;
* puzzle difficulty;
* humor;
* AI content restrictions.

Suggested presets:

```text
Young Children
Children
Preteens
Teenagers
Custom
```

Audience defaults may come from the Project.

Adventure-level Audience may override the Project default.

---

## Session Length

Expected Session length helps shape the Adventure.

Suggested values:

```text
30 minutes

45–60 minutes

60–90 minutes

Multiple Sessions

Custom
```

Session length is advisory.

It does not create a strict gameplay timer.

---

## Difficulty

Difficulty communicates the intended challenge level.

Suggested values:

```text
Gentle

Balanced

Challenging

Custom
```

Difficulty should influence AI Suggestions but should not automatically alter domain state.

The initial version should avoid complex numeric balancing.

---

## Tone

Tone describes the intended emotional style.

Examples:

* Playful;
* Adventurous;
* Mysterious;
* Emotional;
* Light-hearted;
* Dramatic.

Multiple tones may be selected if the UI remains simple.

Tone should be used as Narrative Context for AI-assisted creation.

---

## Foundation AI Assistance

AI assistance may generate:

* three Premise options;
* three title options;
* tone variations;
* a refined version of the user’s idea.

The user may:

* use one suggestion;
* edit a suggestion;
* regenerate;
* dismiss all;
* write their own content.

The AI must not overwrite existing Foundation content without confirmation.

---

## Story

The Story section defines the main narrative direction.

It should describe:

* the opening situation;
* the central conflict;
* likely progression;
* important turning points;
* possible resolution.

The Story is not a complete script.

It provides structure while leaving room for player choice and improvisation.

---

## Story Structure

The initial version may use a simple structure:

```text
Opening

Development

Climax

Resolution
```

These blocks are conceptual.

The user should not be forced to write all four as long-form text.

A shorter story outline may be sufficient.

---

## Story AI Assistance

AI actions may include:

* generate Story outline;
* expand Premise;
* create three possible conflicts;
* suggest turning points;
* simplify for a younger Audience;
* make the Story more mysterious;
* create alternative resolutions.

Every result remains a Suggestion until accepted.

---

## Scenes

Scenes are the main playable units of the Adventure.

Each Scene should answer:

* Where are the players?
* What is happening?
* What is the current Goal?
* Who is present?
* What may happen next?

An Adventure must contain at least one playable opening Scene to become Ready.

---

## Scene Structure

Recommended Scene fields:

* Title;
* short narrative description;
* Goal;
* Location;
* present Characters or NPCs;
* Encounters;
* Rewards;
* notes for the Game Master;
* possible next Scenes.

Optional fields:

* mood;
* illustration;
* secrets;
* environmental details;
* estimated duration.

---

## Scene Ordering

Scenes may be displayed in a preferred narrative order.

The order represents preparation, not forced gameplay.

The Game Master may move between Scenes freely during a Session.

The initial implementation may support:

* move Scene up;
* move Scene down;
* add Scene;
* duplicate Scene later;
* remove Scene.

Complex graph editing is out of scope for the MVP.

---

## Opening Scene

At least one Scene should be marked or resolved as the opening Scene.

The opening Scene is the default starting point during Session preparation.

Only one opening Scene should be active at a time.

Changing the opening Scene must not delete or reorder other Scenes automatically.

---

## Scene Goal

A Scene should contain one primary Goal.

Examples:

* Find the missing Egg;
* enter the locked laboratory;
* convince the Ranger to help;
* escape the flooding cave.

A Goal should be short and actionable.

A Scene may contain secondary notes, but the Running Session should prioritize one current Goal.

---

## Scene AI Assistance

AI actions may include:

* generate three Scene ideas;
* generate a next Scene;
* create a Scene from an existing Story beat;
* create a detour;
* create a child-friendly challenge;
* suggest Scene Goals;
* suggest environmental details;
* generate alternate outcomes.

AI-generated Scenes must be reviewed before becoming part of the Adventure.

---

## Characters and NPCs

This section defines which Characters and NPCs are relevant to the Adventure.

Player Characters usually come from the Project.

NPCs may be:

* selected from existing Project NPCs;
* created manually;
* generated with AI;
* created as Adventure-specific drafts.

The user should not be forced to duplicate existing Project Characters or NPCs.

---

## Character Selection

The user may select relevant Player Characters for:

* preparation;
* Narrative Context;
* suggested Rewards;
* Scene presence.

Selecting a Character for an Adventure does not create ownership or progression changes.

It only marks relevance.

---

## NPC Creation

Recommended NPC fields:

* Name;
* Role;
* short description;
* motivation;
* relationship to the Adventure;
* optional visual;
* optional secrets.

An NPC may begin as a lightweight Adventure draft.

The user may later promote it to a reusable Project NPC.

This promotion requires explicit confirmation.

---

## NPC AI Assistance

AI-generated NPC Suggestions should differ meaningfully.

Example directions:

```text
Friendly Guide

Suspicious Rival

Unexpected Comic Character
```

The user may:

* use;
* edit;
* regenerate similar;
* dismiss;
* save for later.

Generated NPCs are not automatically stored at Project level.

---

## Locations

Locations define where Adventure events occur.

A Location may be:

* selected from existing Project Locations;
* created manually;
* generated by AI;
* created as an Adventure-specific draft.

The Designer should encourage reuse where it supports world consistency.

It should not prevent temporary one-off Locations.

---

## Location Structure

Recommended fields:

* Name;
* short description;
* mood;
* important features;
* related NPCs;
* related Scenes;
* optional illustration;
* optional secrets.

A Location does not need complete geographic data.

The focus is narrative usefulness.

---

## Location AI Assistance

AI actions may include:

* generate three Locations;
* create a Location from the Premise;
* make an existing Location more mysterious;
* suggest important features;
* create child-friendly exploration details;
* create hidden secrets.

Accepted Locations may remain Adventure-specific or be promoted to Project level.

---

## Encounters

An Encounter is an interactive challenge inside a Scene.

Encounter types may include:

* Pokémon encounter;
* conversation;
* puzzle;
* exploration challenge;
* environmental hazard;
* battle;
* social conflict;
* chase;
* discovery.

Every Encounter belongs to at least one Scene.

---

## Encounter Structure

Recommended fields:

* Title;
* type;
* description;
* objective;
* possible player approaches;
* possible consequences;
* related Pokémon or NPCs;
* related Rewards;
* optional difficulty.

The Encounter should support multiple approaches when possible.

The application should avoid assuming that every Encounter is a battle.

---

## Encounter Outcomes

An Encounter may define:

* successful outcome;
* partial success;
* complication;
* optional failure consequence.

These outcomes support preparation.

They do not determine what must happen during play.

The Game Master may improvise a different result.

---

## Encounter AI Assistance

AI actions may include:

* generate three Encounter ideas;
* create a non-combat alternative;
* create a puzzle;
* create a Pokémon event;
* add a complication;
* adjust difficulty;
* adapt for Audience;
* suggest multiple player approaches.

Generated outcomes must avoid forcing a single solution.

---

## Rewards

The Rewards section defines possible Rewards prepared for the Adventure.

A Reward may include:

* Pokémon;
* Item;
* Badge;
* Outfit;
* Achievement;
* Quest Item;
* Sticker;
* Card;
* narrative recognition.

Prepared Rewards are not yet owned.

They become Unlocked only during gameplay through an explicit Session action.

---

## Reward Structure

Recommended fields:

* Name;
* Reward type;
* description;
* intended recipient type;
* related Scene or Encounter;
* optional printable representation;
* optional unlock condition.

Recipient type may be:

```text
One Character

Multiple Characters

Everyone

Decide During Session
```

The Designer should not require a final recipient if the Story does not determine one yet.

---

## Reward State in Designer

Rewards created in the Adventure Designer begin in:

```text
Prepared
```

They must not become:

```text
Unlocked
```

until the Session records that they were earned.

Creating or editing a Reward must never alter Collection ownership.

---

## Reward AI Assistance

AI actions may include:

* generate three suitable Rewards;
* create a Reward for a specific Scene;
* create a non-item Reward;
* create a Badge;
* create a child-friendly collectible;
* suggest a physical representation.

AI Suggestions must respect Audience and Adventure tone.

---

## Secrets and Twists

Secrets and Twists provide optional narrative depth.

Examples:

* an NPC hides an important connection;
* the missing Pokémon left voluntarily;
* the apparent villain is protecting something;
* a Location changes unexpectedly.

Secrets and Twists are Optional.

They should never block Adventure readiness.

---

## Secret Structure

Recommended fields:

* Title;
* hidden information;
* who knows it;
* possible reveal condition;
* related Scene or NPC.

The Designer should clearly separate secret GM information from player-facing descriptions.

---

## Twist Structure

Recommended fields:

* Description;
* trigger;
* affected Scenes;
* possible consequences.

A Twist is preparation, not automatic execution.

The Game Master decides whether and when to use it.

---

## Ending

The Ending section describes possible ways the Adventure may conclude.

An Ending is Recommended but not strictly Required for play.

The Game Master may prepare:

* one likely Ending;
* multiple alternative Endings;
* an open Ending;
* a continuation hook.

---

## Multiple Endings

The Designer may support multiple possible Endings.

Examples:

* success;
* partial success;
* unexpected alliance;
* unresolved mystery;
* continuation into another Adventure.

One Ending may be marked as the expected Ending, but none should be forced during gameplay.

---

## Ending AI Assistance

AI actions may include:

* generate three Ending options;
* create an emotional Ending;
* create a surprising Ending;
* create a continuation hook;
* adapt an Ending to player choices;
* create a non-combat resolution.

---

## Review

The Review section provides a concise Adventure overview.

It should show:

* Foundation;
* Story;
* Scene count;
* Characters and NPCs;
* Locations;
* Encounters;
* Rewards;
* Ending;
* readiness status;
* missing Required content;
* missing Recommended content.

The Review is not a second editor for every detail.

It should provide links back to relevant sections.

---

## Adventure Readiness

Adventure readiness is derived from content.

Recommended classification:

### Required

* Title;
* Premise;
* at least one opening Scene;
* one current Goal for the opening Scene.

### Recommended

* Story outline;
* at least one relevant NPC or Pokémon;
* at least one Location;
* possible Ending;
* one prepared Reward.

### Optional

* additional Scenes;
* Secrets;
* Twists;
* multiple Endings;
* printable assets;
* illustrations;
* detailed Encounter outcomes.

---

## Ready State

An Adventure becomes Ready when all Required content exists and is valid.

The user should see:

```text
Your Adventure is ready to play.
```

If Recommended content is missing:

```text
Your Adventure can be played.

You may still want to add:
- an Ending;
- one Reward;
- a supporting NPC.
```

Available actions:

```text
Prepare Session

Continue Designing
```

The system should not force the user to complete Recommended or Optional content.

---

## Marking Adventure Ready

Readiness should normally be computed.

The user should not manually set an invalid Adventure to Ready.

However, the user may still proceed to Session preparation when only Recommended content is missing.

If Required content is missing, the interface should explain exactly what is needed.

---

## Adventure Lifecycle

Recommended lifecycle:

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

### Idea

The Adventure exists with minimal content.

### Designing

Meaningful design work has started.

### Ready

All Required content exists.

### Running

An active Session exists for the Adventure.

### Completed

At least one Session has completed and the Adventure is treated as finished.

### Archived

The Adventure is no longer actively used.

The Adventure Designer primarily operates during Idea, Designing and Ready states.

---

## Editing a Ready Adventure

A Ready Adventure may still be edited.

If editing removes Required content, its state should return to Designing.

The interface should warn when an edit may affect an active preparation or Session.

An Adventure with an active Session should not allow destructive structural changes without clear handling.

Examples:

* deleting the current Scene;
* removing the active Goal;
* deleting a referenced NPC;
* removing a prepared Reward already used in the Session.

---

## Autosave

The Designer should autosave accepted and manually entered content.

Recommended save states:

```text
Saving

Saved

Unsaved Changes

Save Failed
```

Save status should be visible but unobtrusive.

Autosave should use a short debounce for text input.

Navigation between sections should not normally require a manual Save button.

---

## Save Failure

If autosave fails:

* preserve local edits;
* communicate the failure;
* allow retry;
* do not silently revert the content;
* do not navigate away without warning if changes remain unsaved.

Example:

```text
Your changes are saved on this device but could not be synchronized.
```

Where offline support is not available:

```text
We could not save your latest changes.
```

Actions:

* Retry;
* Continue editing;
* Leave only with warning.

---

## AI Suggestion Workflow

The standard AI workflow is:

```text
Request Suggestions

↓

Build Narrative Context

↓

Generate Three Suggestions

↓

Review

↓

Use, Edit, Regenerate or Dismiss

↓

Save Accepted Content
```

The full Project should not be sent to the AI.

The Application layer assembles only relevant context.

---

## AI Suggestion Actions

Each Suggestion may support:

* Use This;
* Edit;
* Regenerate Similar;
* Dismiss;
* Save for Later;
* Combine, when later supported.

For the MVP, the essential actions are:

* Use This;
* Edit;
* Regenerate;
* Dismiss.

---

## AI Loading Behaviour

AI generation should not block the entire Designer.

While generating:

* the current section remains visible;
* existing content remains editable where safe;
* progress is communicated;
* cancellation may be supported later.

Use skeleton Suggestion Cards or progressive placeholders.

Avoid full-screen blocking loaders.

---

## AI Failure

If AI generation fails:

* existing Adventure content remains unchanged;
* the user can retry;
* manual creation remains available;
* the error should not expose technical provider details.

Example:

```text
We could not generate ideas right now.

You can try again or continue manually.
```

---

## Narrative Context

The Designer AI may receive:

* Project Audience;
* Adventure Foundation;
* accepted Story content;
* relevant Characters;
* relevant NPCs;
* relevant Locations;
* relevant World Facts;
* current section data;
* explicitly selected previous Session summaries.

The AI should not receive:

* the complete Project by default;
* archived unrelated content;
* rejected Suggestions;
* private data unrelated to the request.

The Application layer owns context assembly.

---

## User Interactions

The user can:

* create an Adventure;
* navigate between sections;
* enter content manually;
* generate AI Suggestions;
* accept or reject Suggestions;
* edit accepted content;
* add, reorder and remove Scenes;
* attach existing Project content;
* create Adventure-specific drafts;
* review readiness;
* continue to Session preparation;
* leave and return later.

Common creative actions should remain easy to discover.

---

## Navigation

### Mobile

Use a compact section selector.

Possible pattern:

```text
Foundation · Story · Scenes · Characters · Locations · Rewards
```

The selector may scroll horizontally.

Only the active section is shown in the main content area.

### Tablet and Desktop

Use a left-side section navigation.

Example:

```text
✓ Foundation
✓ Story
● Scenes
○ Characters
○ Locations
○ Rewards
○ Ending
```

A right-side AI panel may be shown when space allows.

The navigation model must remain the same across devices.

---

## Leaving the Designer

When the user leaves:

* saved content remains available;
* unsaved local changes are protected;
* accepted AI content is not lost;
* active AI generation may be cancelled or safely ignored;
* returning should reopen the last meaningful section where practical.

If all changes are saved, navigation should not require confirmation.

---

## Delete Content

Removing important content requires proportionate confirmation.

Examples:

### Removing an Empty Scene

No confirmation may be necessary.

### Removing a Scene with Encounters or Rewards

Confirm and explain affected content.

Example:

```text
Remove Forest Entrance?

This Scene contains:
- 2 Encounters;
- 1 Reward;
- 1 connected next Scene.
```

Available actions:

* Remove Scene and detach related content;
* Cancel.

Cascading deletion should be avoided where possible.

Prefer detaching or asking the user what should happen.

---

## Business Rules

* Every Adventure belongs to exactly one Project.
* Every Adventure must have a Title.
* A Ready Adventure must have a Premise.
* A Ready Adventure must have at least one opening Scene.
* The opening Scene must have a Goal.
* Every Encounter belongs to at least one Scene.
* Prepared Rewards do not imply ownership.
* AI Suggestions are never saved automatically.
* AI Suggestions never become canonical without user acceptance.
* Existing Project Characters, NPCs and Locations should be referenced rather than duplicated.
* Adventure-specific NPCs and Locations may later be promoted to Project-level entities.
* Recommended content must not block play.
* The Designer does not start gameplay directly without Session preparation.
* The Designer must not update long-term Collection state.

---

## Domain Interaction

Related domain concepts:

* Project;
* Adventure;
* Adventure Status;
* Scene;
* Goal;
* Character;
* NPC;
* Location;
* Encounter;
* Reward;
* Secret;
* Twist;
* Ending;
* Narrative Context;
* AI Suggestion.

The Designer edits the Adventure Aggregate through Application-layer use cases.

The Presentation layer should not directly mutate persisted domain state.

---

## Suggested Application Use Cases

```text
CreateAdventure

LoadAdventureDesigner

UpdateAdventureFoundation

UpdateAdventureStory

AddScene

UpdateScene

ReorderScenes

RemoveScene

SetOpeningScene

AttachCharacter

AttachNpc

CreateAdventureNpc

AttachLocation

CreateAdventureLocation

AddEncounter

UpdateEncounter

AddPreparedReward

UpdatePreparedReward

AddSecret

AddTwist

AddEnding

GenerateAdventureSuggestions

AcceptAdventureSuggestion

CalculateAdventureReadiness

PrepareAdventureForSession
```

Use cases may be consolidated when a simpler existing project structure supports clear responsibilities.

Avoid creating one class for every field update if it adds no value.

---

## Suggested Angular Structure

```text
features/
  adventure-designer/
    pages/
      adventure-designer-page/
    components/
      designer-header/
      designer-section-navigation/
      foundation-section/
      story-section/
      scenes-section/
      scene-editor/
      characters-section/
      locations-section/
      encounters-section/
      rewards-section/
      secrets-and-twists-section/
      ending-section/
      adventure-review/
      readiness-summary/
      ai-suggestion-list/
      ai-suggestion-card/
      save-status/
    application/
      load-adventure-designer/
      update-adventure/
      manage-scenes/
      generate-suggestions/
      calculate-readiness/
    domain/
      adventure-designer-state/
      adventure-readiness/
    infrastructure/
      adventure-repository/
      adventure-ai-provider/
```

This structure should be adapted to existing feature boundaries.

Do not duplicate shared components that already exist.

---

## Suggested View Model

Example:

```typescript
interface AdventureDesignerViewModel {
  readonly adventureId: string;
  readonly projectId: string;
  readonly title: string;
  readonly activeSection: AdventureDesignerSection;
  readonly sections: readonly AdventureSectionSummary[];
  readonly readiness: AdventureReadinessViewModel;
  readonly saveState: DesignerSaveState;
  readonly aiState: AiSuggestionState;
}
```

Section type:

```typescript
type AdventureDesignerSection =
  | 'foundation'
  | 'story'
  | 'scenes'
  | 'characters'
  | 'locations'
  | 'encounters'
  | 'rewards'
  | 'secrets-and-twists'
  | 'ending'
  | 'review';
```

Save state:

```typescript
type DesignerSaveState =
  | 'saved'
  | 'saving'
  | 'unsaved'
  | 'error';
```

The UI should render derived state.

Templates should not contain readiness calculation or AI orchestration logic.

---

## State Management

Angular Signals are the default state mechanism.

Potential state:

```typescript
readonly adventure = signal<AdventureEditorModel | null>(null);
readonly activeSection = signal<AdventureDesignerSection>('foundation');
readonly saveState = signal<DesignerSaveState>('saved');
readonly suggestions = signal<readonly AiSuggestion[]>([]);
readonly isGenerating = signal(false);
```

Derived values should use `computed()`.

Examples:

```typescript
readonly readiness = computed(() =>
  calculateAdventureReadiness(this.adventure())
);
```

```typescript
readonly canPrepareSession = computed(() =>
  this.readiness().requiredComplete
);
```

Use RxJS only for external asynchronous streams where appropriate.

---

## Loading State

The Designer should display:

* shell and section navigation;
* skeleton content for the active section;
* known Adventure title when available.

Avoid a blank full-screen loader.

The user should understand that they are opening an Adventure workspace.

---

## Empty States

Each empty section should explain its purpose and offer two clear paths:

```text
Generate with AI

Create Manually
```

Example for Scenes:

```text
Every Adventure begins somewhere.

Create the opening Scene or ask for three ideas.
```

Empty states should be encouraging rather than technical.

---

## Error Handling

### Adventure Not Found

```text
This Adventure could not be found.
```

Actions:

* return to Adventures;
* retry where relevant.

### Loading Failed

```text
We could not open this Adventure.
```

Actions:

* Retry;
* return to Adventure List.

### Save Failed

Preserve edits and offer retry.

### AI Failed

Keep manual editing available.

### Invalid Reference

If a referenced NPC, Location or Character no longer exists:

* show Needs Attention;
* identify the missing reference;
* allow replacement or removal.

Do not crash or silently remove the reference.

---

## Offline Behaviour

When offline, the Designer should support locally available work where practical.

Possible offline capabilities:

* open downloaded Adventures;
* edit text;
* create Scenes;
* reorder content;
* create manual NPCs and Locations;
* prepare Rewards;
* calculate readiness.

Unavailable capabilities:

* AI generation;
* cloud-only asset generation;
* remote content search.

Example:

```text
AI assistance is unavailable offline.

You can continue designing manually.
```

Offline edits should synchronize later where supported.

---

## Responsive Behaviour

### Phone

* one active section at a time;
* horizontally scrollable section selector;
* bottom sheets for selection;
* full-screen Scene editing;
* AI Suggestions displayed as stacked Cards;
* one prominent primary action.

### Tablet

* left section navigation;
* central editor;
* optional right AI panel;
* Scene list and Scene editor may appear side by side.

### Desktop

* persistent left navigation;
* wide editor area;
* optional context or AI inspector;
* avoid excessive density;
* maintain the creative studio feeling.

Desktop must not introduce interactions unavailable on touch devices.

---

## Accessibility

* Section navigation must be keyboard accessible.
* Active section state must be announced.
* Form controls require persistent labels.
* Validation errors must be linked to their fields.
* AI Suggestions must be understandable without color.
* Reordering must have keyboard-accessible alternatives.
* Drag-and-drop, if introduced later, cannot be the only reordering method.
* Buttons must use clear action labels.
* Focus must move predictably after adding or removing content.
* Save state changes should not create excessive screen reader announcements.
* Touch targets should be at least 44 × 44 CSS pixels where practical.
* Reduced motion preferences must be respected.

---

## Acceptance Criteria

The feature is complete when:

* the user can create an Adventure;
* the Adventure belongs to the selected Project;
* the user can edit the Foundation;
* the user can create and edit Story content;
* the user can add, edit, reorder and remove Scenes;
* one Scene can be selected as the opening Scene;
* the user can attach existing Characters, NPCs and Locations;
* the user can create Adventure-specific NPCs and Locations;
* the user can create Encounters;
* the user can create Prepared Rewards;
* the user can add optional Secrets, Twists and Endings;
* the user can request AI Suggestions in supported sections;
* AI generation returns multiple alternatives;
* AI Suggestions require explicit acceptance;
* the user can edit accepted Suggestions before saving;
* Adventure readiness is calculated from content;
* missing Required content is clearly identified;
* missing Recommended content does not block preparation;
* the user can continue to Prepare Session when Required content is complete;
* autosave preserves accepted and manually entered content;
* save failures preserve local edits;
* loading, empty, offline and error states are handled;
* the Designer works on phone, tablet and desktop;
* business rules are not implemented inside Angular templates;
* domain-changing actions delegate to Application-layer use cases.

---

## Out of Scope

Not part of the initial implementation:

* collaborative editing;
* real-time multi-user design;
* Adventure marketplace;
* public Adventure sharing;
* version history;
* branchable Adventure versions;
* visual story graph editor;
* complex conditional logic;
* automatic complete Adventure generation;
* automatic acceptance of AI content;
* automatic Project-level promotion of NPCs or Locations;
* drag-and-drop as a required interaction;
* advanced battle balancing;
* rules-engine validation;
* player-facing Adventure editing;
* Adventure import and export;
* Adventure templates.

---

## Future Enhancements

Possible future additions:

* Adventure templates;
* duplicate Adventure;
* version history;
* AI consistency review;
* Scene graph visualization;
* reusable Encounter templates;
* collaborative planning;
* Adventure sharing;
* community content;
* richer illustrations;
* voice-based idea capture;
* Story quality suggestions;
* automatic unresolved-reference detection;
* configurable readiness rules;
* multiple ruleset support.

These enhancements must preserve the Game Master’s creative ownership.

---

## Final Principle

The Adventure Designer should never feel like the application is writing the Adventure.

It should feel like the Game Master is creating faster, with better ideas and greater confidence.
