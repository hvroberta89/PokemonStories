# Reward System

## Purpose

The Reward System defines how story achievements become meaningful rewards inside Pokémon Stories.

Rewards connect four major parts of the product:

```text
Adventure Designer

↓

Running Session

↓

Collection

↓

Physical Reward
```

The system must clearly separate:

* what has been prepared;
* what has been earned;
* what has been printed;
* what has been physically given to the player.

A Reward is first a narrative achievement.

Printing is only one possible representation of that achievement.

---

## Responsibilities

The Reward System allows the Game Master to:

* prepare Rewards during Adventure design;
* create Rewards during a live Session;
* unlock Rewards when they are earned;
* assign Rewards to one or more recipients;
* print immediately;
* add Rewards to a print queue;
* skip physical printing;
* mark printed Rewards as given;
* retry failed printing;
* reprint previously printed Rewards;
* review unresolved Rewards after a Session;
* add earned Rewards to the appropriate Collection.

The Reward System is not responsible for:

* deciding automatically when a Reward is earned;
* replacing Game Master judgment;
* controlling complete inventory mechanics;
* directly communicating with a specific printer in the domain layer;
* automatically granting AI-generated Rewards;
* requiring every Reward to have a physical representation.

---

## Experience Goal

Receiving a Reward should feel like a story moment.

The system should not reduce Rewards to database updates.

Examples of meaningful Reward moments:

* a Pokémon is caught;
* a Badge is earned;
* a useful Item is found;
* a new Outfit is received;
* a Location is discovered;
* a character achievement is recognized;
* a Quest Item is acquired;
* a player receives a physical sticker or card.

The experience should be:

* immediate;
* celebratory;
* understandable;
* optional;
* non-blocking.

The Game Master must be able to continue the story even if printing or synchronization fails.

---

## Core Principles

### Reward Ownership Is Narrative

A Reward becomes owned when the story establishes that it was earned.

Ownership must not depend on:

* successful printing;
* printer availability;
* internet connection;
* export completion;
* physical handover.

---

### Physical and Digital State Are Separate

The following states are not equivalent:

```text
Unlocked ≠ Printed ≠ Given
```

A Reward may be:

* earned but never printed;
* printed but not yet handed over;
* handed over after the Session;
* reprinted later;
* represented only digitally.

---

### The Game Master Controls Timing

The system may suggest that a Reward is available.

It must not decide when it is awarded.

The Game Master explicitly unlocks or confirms every Reward.

---

### Printing Must Not Block Play

Printing happens beside the story, not in front of it.

A failed or slow print operation must never prevent the Running Session from continuing.

---

### Rewards Should Be Easy to Resolve Later

During gameplay, the Game Master may not want to complete every detail.

The system should support:

```text
Unlock Now

↓

Complete Details Later
```

A minimally defined Reward may be recorded during the Session and refined afterward.

---

## Reward Types

The initial system supports the following Reward categories:

```text
Pokémon

Item

Badge

Outfit

Achievement

Quest Item

Card

Sticker

Narrative Reward

Custom
```

These categories describe the meaning of the Reward.

They do not determine whether a Reward is printable.

---

## Pokémon Reward

Represents a Pokémon that has become part of a Character’s story.

Possible examples:

* caught Pokémon;
* befriended Pokémon;
* temporary companion;
* Pokémon Egg;
* evolved Pokémon milestone.

A Pokémon Reward may update:

* Character Pokémon ownership;
* Pokédex status;
* Collection;
* printable Pokédex sticker;
* Session Timeline.

The precise Pokémon progression rules may be defined in a later Pokémon or Collection specification.

---

## Item Reward

Represents an object acquired through gameplay.

Examples:

* Potion;
* Explorer Hat;
* Rope;
* Berry Basket;
* Ancient Key;
* Poké Ball.

Possible Item states may later include:

```text
Owned

Equipped

Consumed

Lost
```

The Reward System grants the Item.

Detailed inventory behavior belongs to the Collection or Inventory feature.

---

## Badge Reward

Represents formal recognition or progress.

Examples:

* Gym Badge;
* Explorer Badge;
* Forest Helper Badge;
* Friendship Badge.

A Badge may be:

* personal;
* shared by multiple Characters;
* awarded to the whole group.

Badges should be visually collectible and usually support a printable representation.

---

## Outfit Reward

Represents wearable or cosmetic progression.

Examples:

* Explorer Hat;
* Raincoat;
* Ranger Scarf;
* Festival Costume.

The Reward System grants ownership.

Equipping and outfit presentation belong to the Collection feature.

---

## Achievement Reward

Represents recognition for a meaningful action.

Examples:

* First Pokémon Caught;
* Clever Problem Solver;
* Helped Every Villager;
* Brave Explorer.

Achievements may be created manually or prepared in advance.

They must not be awarded automatically unless a future rule engine explicitly supports it.

---

## Quest Item Reward

Represents an Item with narrative importance.

Examples:

* Ancient Map;
* Laboratory Keycard;
* Mysterious Egg;
* Royal Invitation.

Quest Items may remain active across multiple Adventures.

Their broader lifecycle belongs to world or quest management.

---

## Card and Sticker Rewards

Card and Sticker are physical presentation-oriented Reward types.

They may represent:

* Pokémon;
* NPC;
* Location;
* Item;
* Badge;
* achievement;
* story memory.

A digital Reward may produce more than one printable format later.

For example:

```text
Pikachu Reward
├── Pokédex Sticker
├── Large Character Card
└── Session Journal Sticker
```

The Reward should not be duplicated merely because it has multiple physical templates.

---

## Narrative Reward

Represents an achievement that may not be an object.

Examples:

* the Ranger trusts the group;
* access to a hidden Location;
* honorary village title;
* permission to enter the royal garden;
* friendship with an NPC.

Narrative Rewards may generate World Updates or World Facts.

They do not require printing.

---

## Custom Reward

Allows the Game Master to create a Reward outside predefined categories.

A Custom Reward should still follow the same lifecycle and ownership rules.

The user may optionally classify it later.

---

## Reward Sources

A Reward may originate from:

* Adventure Designer;
* Running Session;
* AI Suggestion;
* Session completion review;
* manual Collection correction;
* later import or template features.

The Reward source should be recorded when useful for traceability.

The source must not change ownership semantics.

---

## Prepared Rewards

Prepared Rewards are created before gameplay.

They describe possible Rewards that may become available during the Adventure.

Examples:

* a Pikachu sticker prepared for a forest Scene;
* an Explorer Badge prepared for Adventure completion;
* an Item linked to an Encounter;
* a group Reward linked to an Ending.

Prepared Rewards are not owned.

Their initial lifecycle state is:

```text
Prepared
```

They may be:

* unlocked during a Session;
* edited before unlocking;
* skipped;
* left unused;
* reused in a later Session when appropriate.

---

## Session-Created Rewards

The Game Master may create a Reward during live gameplay.

This supports unexpected story developments.

Example:

```text
The players befriended a wild Vulpix unexpectedly.

↓

Create Reward

↓

Vulpix Companion

↓

Unlock for Emma
```

The creation flow should remain short.

Required information during play should be minimal.

Recommended minimum:

* Reward name;
* Reward type;
* recipient;
* optional physical action.

Additional details may be completed later.

---

## AI-Suggested Rewards

AI may propose Rewards based on:

* current Adventure;
* current Scene;
* Audience;
* player action;
* existing Characters;
* tone;
* relevant World Facts.

AI Suggestions are not Rewards until accepted.

Standard flow:

```text
Generate Suggestions

↓

Review Three Alternatives

↓

Select

↓

Edit

↓

Unlock or Prepare
```

AI must not:

* grant ownership automatically;
* print automatically;
* infer a recipient permanently without confirmation;
* create Collection changes without approval.

---

## Reward Lifecycle

The core Reward lifecycle is:

```text
Prepared

↓

Unlocked

↓

Printed

↓

Given
```

Not every Reward follows every step.

Valid examples:

```text
Prepared → Unlocked
```

Digital-only Reward.

```text
Prepared → Unlocked → Printed → Given
```

Physical Reward handed over immediately.

```text
Unlocked → Queued → Printed → Given
```

Reward created during play and printed later.

```text
Unlocked → Skipped
```

No physical representation required.

---

## Lifecycle Dimensions

A single linear status is insufficient because narrative and physical state are separate.

The model should distinguish at least:

```text
Narrative State

Physical State

Delivery State
```

Recommended conceptual model:

### Narrative State

```text
Prepared

Unlocked

Revoked
```

`Revoked` should be rare and may remain out of scope for the MVP.

### Physical State

```text
NotRequested

Queued

Preparing

ReadyForExport

Exported

PrintFailed

Printed

Skipped
```

The exact technical states may be simplified based on the printing implementation.

### Delivery State

```text
NotApplicable

Pending

Given
```

This separation prevents ambiguous states.

---

## MVP State Model

For the initial implementation, the visible state model may remain simpler:

```text
Prepared

Unlocked

Queued

Printed

Given

Skipped
```

Internally, narrative ownership should still remain independent from print state.

A Reward must never lose `Unlocked` ownership because printing failed.

---

## Prepared

The Reward exists as Adventure preparation.

It has not yet been earned.

Allowed actions:

* edit;
* unlock;
* remove from preparation;
* duplicate later;
* associate with a Scene or Encounter.

---

## Unlocked

The Reward has been earned through the story.

This is the key narrative transition.

Unlocking may:

* create or update a Collection entry;
* create a Timeline Entry;
* offer physical Reward actions;
* mark the Reward as available for Session review.

Allowed actions:

* Print Now;
* Add to Queue;
* Skip Printing;
* edit non-critical details;
* assign or change recipient where valid;
* mark as Given when no printing is needed.

---

## Queued

The Reward is waiting for physical preparation or printing.

The Reward remains owned.

The Queue acts as a buffer between story timing and physical delivery.

Allowed actions:

* prepare for printing;
* remove from Queue without removing ownership;
* edit print details;
* change quantity;
* mark printing as unnecessary;
* batch with other Rewards.

---

## Printed

A physical representation has been produced or the user has confirmed successful printing.

The Reward remains in the Queue until delivery is resolved when relevant.

Allowed actions:

* mark as Given;
* reprint;
* inspect printable asset;
* correct recipient or quantity if appropriate.

---

## Given

The physical Reward has been handed to the intended recipient.

`Given` is the terminal delivery state for the current print instance.

The digital Reward remains available in Collection.

Reprinting does not reset ownership or original delivery history.

---

## Skipped

The Game Master decided that no physical version is currently needed.

The Reward remains Unlocked digitally.

Skipped printing may be reconsidered later.

`Skipped` must not mean rejected or lost.

---

## Reward Recipient

Every Unlocked Reward should have a defined recipient scope.

Supported recipient types:

```text
One Character

Multiple Characters

Everyone

Project

Unassigned
```

### One Character

Reward belongs to one Character.

### Multiple Characters

Reward is granted to selected Characters.

Each recipient may receive:

* a shared logical Reward;
* or separate ownership instances.

The domain model should make this distinction explicit when necessary.

### Everyone

Reward applies to the whole participating group.

Examples:

* group Badge;
* shared access;
* Adventure completion card.

### Project

Reward affects the campaign world rather than a specific Character.

Examples:

* new Location access;
* community reputation;
* World Fact.

### Unassigned

Temporary state used when the Reward is created quickly and recipient details will be completed later.

Unassigned Rewards should appear in Session review.

---

## Ownership Model

A Reward definition and an earned Reward instance should not be treated as the same concept.

Recommended distinction:

```text
Reward Definition
```

Describes what may be earned.

```text
Reward Grant
```

Records that a specific recipient earned it.

Example:

```text
Explorer Badge
```

is the Reward definition.

```text
Emma earned Explorer Badge during Session 42
```

is the Reward Grant.

This distinction is especially important when:

* multiple Characters earn the same Reward;
* the same Reward can be earned in different Adventures;
* printing occurs more than once;
* Collection history is preserved.

---

## Unlock Flow

Standard unlock flow:

```text
Select Prepared Reward
or
Create Reward

↓

Choose Recipient

↓

Confirm Reward Details

↓

Unlock

↓

Create Timeline Entry

↓

Update Collection

↓

Choose Physical Action
```

The physical action options are:

```text
Print Now

Add to Queue

No Physical Reward
```

Unlocking should complete before printing begins.

This guarantees that a print failure cannot prevent narrative ownership.

---

## Instant Reward Flow

During a Running Session, the flow should be optimized for speed.

Example:

```text
✨ Pikachu was caught!

For: Emma

[Print Now]
[Add to Queue]
[No Sticker]
```

The Game Master should be able to dismiss the panel and continue playing.

The Reward must already be safely recorded after unlocking.

---

## Quick Reward Creation

Recommended flow:

```text
Quick Action

↓

Reward

↓

Choose Type

↓

Name

↓

Recipient

↓

Unlock
```

Optional details may include:

* description;
* image;
* related Scene;
* printable template;
* notes.

The flow should support a “Finish Later” path.

---

## Save Details for Later

During live play, the Game Master may record only:

* name;
* type;
* recipient.

The Reward then receives a status indicating incomplete metadata.

Example:

```text
Unlocked · Details incomplete
```

The Session completion workflow should surface it for review.

Incomplete metadata must not invalidate ownership.

---

## Reward Queue

The Reward Queue contains Unlocked Rewards awaiting physical action.

It should be accessible:

* during a Running Session;
* from Collection;
* during Session completion;
* from printer or export settings where relevant.

The Queue should display:

* Reward name;
* recipient;
* type;
* current physical status;
* quantity;
* source Session;
* available action.

---

## Reward Queue Example

```text
Reward Queue

Pikachu
For Emma
Ready to prepare

Potion
For Marci
Printed · Not given

Forest Badge
For everyone
Queued
```

Possible actions:

* Prepare Selected;
* Prepare All;
* Mark as Printed;
* Mark as Given;
* Skip Printing;
* Remove from Queue;
* Retry Failed;
* Reprint.

Removing from the Queue must not remove the Reward from Collection.

---

## Queue Ordering

Recommended order:

1. print failures requiring attention;
2. ready but not printed;
3. printed but not given;
4. newest queued Rewards;
5. older unresolved Rewards.

During a Session, newly unlocked Rewards may appear first.

The Queue should support grouping by:

* recipient;
* Session;
* Reward type;
* status.

Advanced filtering may remain out of scope for the MVP.

---

## Print Now

`Print Now` means:

> Prepare the physical asset and start the available printing or export flow immediately.

It must not promise direct printer communication unless the integration supports it.

For an export-based MVP, the actual flow may be:

```text
Print Now

↓

Generate Printable Asset

↓

Open Share Sheet or Printer App

↓

User Confirms Result
```

User-facing terminology should remain honest.

If direct printing is unavailable, prefer:

```text
Prepare for Printing
```

or:

```text
Open in Printer App
```

---

## Add to Queue

This action:

* preserves the Reward as Unlocked;
* records that physical preparation is desired;
* does not interrupt gameplay;
* allows batch processing later.

The user should receive subtle confirmation:

```text
Added to Reward Queue
```

---

## No Physical Reward

This action records that the Reward does not currently need printing.

The Reward remains in Collection.

Possible labels:

```text
No Physical Reward

Skip Printing

Digital Only
```

The exact wording should depend on context.

The action must remain reversible where practical.

---

## Printable Asset

A Printable Asset is a generated physical representation of a Reward.

It may include:

* Reward image;
* title;
* recipient;
* icon;
* Adventure name;
* date;
* category-specific content;
* template metadata.

Printable Assets belong to infrastructure or presentation concerns.

The Reward domain should only reference printable capability and selected representation where required.

---

## Printable Formats

Possible formats:

* Pokédex sticker;
* Item sticker;
* Badge sticker;
* large card;
* NPC card;
* Location card;
* achievement certificate;
* journal sticker.

The MVP may support only a limited subset.

Unsupported formats should not block Reward ownership.

---

## Printable Template Selection

A Reward may have:

* one default template;
* multiple compatible templates;
* no printable template.

The user may select a template before preparation.

For fast Session actions, the system should use a safe default when one exists.

Template configuration belongs to the printing specification.

---

## Print Confirmation

When the system cannot verify physical printer success, it should not automatically mark the Reward as Printed.

After returning from an external app or Share Sheet, the user may be asked:

```text
Was the Reward printed successfully?
```

Actions:

* Yes, Mark as Printed;
* Not Yet;
* Printing Failed.

Avoid repeatedly asking when the user intentionally leaves the status unresolved.

---

## Printing Failure

If physical preparation or export fails:

* the Reward remains Unlocked;
* it remains available in the Queue;
* no Collection state is reverted;
* the user may retry;
* the failure is recorded separately.

Example:

```text
The sticker could not be prepared.

The Reward is safe in your Queue.
```

Actions:

* Retry;
* Keep for Later;
* Skip Printing.

---

## Duplicate Printing

Before reprinting a Reward already marked Printed, display a warning:

```text
This Reward was already printed.

Print another copy?
```

Actions:

* Reprint;
* Cancel.

This is a warning, not a restriction.

Legitimate reasons include:

* damaged sticker;
* multiple recipients;
* lost card;
* alternate format;
* replacement.

---

## Print Quantity

Quantity may differ from recipient count.

Examples:

* one group Badge;
* one sticker per Character;
* two copies for a shared Reward;
* replacement copy.

The initial default should be derived from recipient scope when practical.

The user must be able to override quantity before printing.

Changing print quantity must not create additional ownership Grants.

---

## Mark as Given

A printed physical Reward may be marked as Given.

This records that handover occurred.

The user may perform this action:

* immediately after printing;
* later from the Queue;
* during Session completion;
* from Collection history.

For a digital-only Reward, delivery may be Not Applicable.

---

## Given Without Printing

Some physical Rewards may be prepared outside Pokémon Stories.

The user may need to record:

```text
Given Externally
```

This may mark delivery as Given without requiring an internal Printed state.

The implementation should avoid forcing false printing history.

For MVP simplicity, this can be represented through:

```text
Mark as Given
```

with an optional external preparation note.

---

## Reprint

Reprint creates a new print attempt or print record.

It does not:

* create a new Reward Grant;
* change original ownership;
* create duplicate Collection entries;
* replay the original unlock event.

Reprint history should record:

* timestamp;
* template;
* quantity;
* outcome;
* optional reason.

Detailed print history may be introduced later.

---

## Reward History

The system should preserve meaningful Reward history.

Possible events:

```text
Prepared

Unlocked

Added to Queue

Prepared for Printing

Printed

Given

Reprinted

Printing Skipped
```

History should support troubleshooting and storytelling without becoming an audit-heavy UI.

The user-facing experience should show only useful events.

---

## Collection Integration

Unlocking a Reward should update the appropriate Collection area.

Examples:

| Reward Type      | Collection Destination           |
| ---------------- | -------------------------------- |
| Pokémon          | Pokédex / Character Pokémon      |
| Item             | Inventory                        |
| Badge            | Badges                           |
| Outfit           | Outfits                          |
| Achievement      | Achievements                     |
| Quest Item       | Inventory / Quest Items          |
| Card             | Cards                            |
| Narrative Reward | World state or Character history |

The Reward System coordinates the Grant.

The Collection feature controls how granted content is displayed and managed later.

---

## Timeline Integration

Unlocking a Reward should usually create a Session Timeline Entry.

Examples:

```text
Emma caught Pikachu.
```

```text
Marci received the Explorer Hat.
```

```text
The team earned the Forest Badge.
```

The Timeline wording should be narrative.

It should not expose internal status language such as:

```text
Reward Grant created.
```

---

## Session Summary Integration

The Session Summary should include:

* Rewards unlocked;
* recipients;
* unresolved Reward details;
* queued physical items;
* printed but not given items.

The user should be able to resolve outstanding Reward tasks before or after completing World Updates.

Unresolved physical actions must not block Session completion.

---

## Adventure Designer Integration

The Adventure Designer may prepare Rewards and link them to:

* Scene;
* Encounter;
* Ending;
* Secret;
* Adventure completion;
* custom unlock condition.

Unlock conditions are descriptive in the MVP.

They are not executed automatically.

Example:

```text
Unlock when the players return the Egg safely.
```

The Game Master confirms the unlock during play.

---

## Running Session Integration

The Running Session should provide:

* prepared Rewards for the current Scene;
* Quick Reward creation;
* Unlock action;
* Reward Queue count;
* print or queue actions;
* subtle success feedback.

The Session UI should not require navigating to Collection to award a Reward.

---

## AI Integration

AI may help with:

* Reward ideas;
* Reward names;
* descriptions;
* Badge concepts;
* age-appropriate Rewards;
* physical representation ideas;
* narrative Reward alternatives.

AI must not:

* unlock;
* print;
* mark as Given;
* create ownership;
* assign permanent recipients without approval.

---

## Business Rules

* A Prepared Reward is not owned.
* An Unlocked Reward is owned regardless of print state.
* Printing failure never removes ownership.
* Printing does not create ownership.
* Marking a Reward as Given does not create ownership.
* Every Reward Grant belongs to a source Project.
* Character-owned Rewards require a valid Character recipient.
* Group Rewards may have multiple recipients or group scope.
* A Reward may exist without a printable representation.
* A Printable Asset may not exist without a related Reward or supported standalone memory artifact.
* AI Suggestions require explicit acceptance.
* Prepared Rewards may remain unused.
* Removing a Prepared Reward must not remove an existing Grant created from it.
* Reprinting must not create duplicate Collection ownership.
* Queue removal must not remove the Reward from Collection.
* Session completion must not require physical Reward resolution.
* Reward state-changing actions must be explicit.
* Print and delivery history must not be inferred falsely.

---

## Domain Model Interaction

Related concepts:

* Reward Definition;
* Reward Grant;
* Reward Type;
* Reward Recipient;
* Reward Narrative State;
* Reward Physical State;
* Reward Delivery State;
* Printable Asset Reference;
* Print Attempt;
* Character;
* Collection;
* Session;
* Timeline Entry;
* Adventure;
* Scene;
* Encounter.

Recommended conceptual distinction:

```text
RewardDefinition
```

Defines a possible Reward.

```text
RewardGrant
```

Records ownership.

```text
RewardFulfillment
```

Tracks physical preparation and delivery.

The exact class boundaries may be simplified while preserving these meanings.

---

## Suggested Model

Example conceptual shape:

```typescript
interface RewardDefinition {
  readonly id: string;
  readonly projectId: string;
  readonly adventureId: string | null;
  readonly name: string;
  readonly type: RewardType;
  readonly description: string | null;
  readonly printableOptions: readonly PrintableOption[];
}
```

```typescript
interface RewardGrant {
  readonly id: string;
  readonly rewardDefinitionId: string | null;
  readonly projectId: string;
  readonly sessionId: string | null;
  readonly recipients: readonly RewardRecipient[];
  readonly unlockedAt: string;
  readonly detailsComplete: boolean;
}
```

```typescript
interface RewardFulfillment {
  readonly rewardGrantId: string;
  readonly physicalState: RewardPhysicalState;
  readonly deliveryState: RewardDeliveryState;
  readonly quantity: number;
  readonly printableTemplateId: string | null;
}
```

These examples express the domain distinctions.

They are not mandatory persistence schemas.

---

## Suggested Application Use Cases

```text
PrepareReward

UpdatePreparedReward

RemovePreparedReward

UnlockPreparedReward

CreateAndUnlockReward

AssignRewardRecipients

CompleteRewardDetails

AddRewardToQueue

RemoveRewardFromQueue

PreparePrintableAsset

ConfirmRewardPrinted

MarkRewardPrintFailed

SkipRewardPrinting

MarkRewardGiven

ReprintReward

ListRewardQueue

ListSessionRewards

ListCharacterRewards
```

Use cases may be grouped when the project’s current style supports simpler orchestration.

Avoid a generic `UpdateRewardStatus` use case that permits invalid transitions.

Prefer explicit intent.

---

## State Transition Validation

State transitions should be validated centrally.

Examples of valid transitions:

```text
Prepared → Unlocked
```

```text
Unlocked → Queued
```

```text
Queued → Printed
```

```text
Printed → Given
```

```text
Unlocked → Skipped
```

```text
PrintFailed → Queued
```

Invalid examples:

```text
Prepared → Given
```

unless a separate unlock operation occurs.

```text
Printed → Prepared
```

```text
Given → Prepared
```

Reprint should create a new print attempt rather than reverse the Reward lifecycle.

---

## Suggested Angular Structure

```text
features/
  rewards/
    pages/
      reward-queue-page/
      reward-details-page/
    components/
      reward-card/
      reward-unlocked-sheet/
      reward-recipient-selector/
      reward-type-selector/
      reward-queue-list/
      reward-queue-item/
      reward-print-options/
      reward-status-pill/
      reward-given-action/
      print-result-dialog/
    application/
      prepare-reward/
      unlock-reward/
      create-reward/
      manage-reward-queue/
      prepare-printable-asset/
      confirm-reward-delivery/
    domain/
      reward-definition/
      reward-grant/
      reward-recipient/
      reward-state/
      reward-fulfillment/
    infrastructure/
      reward-repository/
      printable-asset-provider/
      reward-export-provider/
```

Reuse Running Session and Collection components where responsibilities align.

Do not create separate incompatible Reward models in each feature.

---

## Suggested Reward Queue View Model

```typescript
interface RewardQueueViewModel {
  readonly items: readonly RewardQueueItemViewModel[];
  readonly selectedIds: ReadonlySet<string>;
  readonly canPrepareSelected: boolean;
  readonly unresolvedCount: number;
  readonly isProcessing: boolean;
}
```

```typescript
interface RewardQueueItemViewModel {
  readonly grantId: string;
  readonly name: string;
  readonly type: RewardType;
  readonly recipientsLabel: string;
  readonly physicalState: RewardPhysicalState;
  readonly deliveryState: RewardDeliveryState;
  readonly quantity: number;
  readonly thumbnailUrl: string | null;
  readonly primaryAction: RewardQueueAction;
}
```

The Presentation layer should receive resolved available actions.

Templates should not contain transition rules.

---

## State Management

Angular Signals should manage UI state.

Possible state:

```typescript
readonly queueItems = signal<readonly RewardQueueItemViewModel[]>([]);
readonly selectedRewardIds = signal<ReadonlySet<string>>(new Set());
readonly isPreparing = signal(false);
readonly error = signal<string | null>(null);
```

Derived state:

```typescript
readonly selectedItems = computed(() =>
  this.queueItems().filter(item =>
    this.selectedRewardIds().has(item.grantId)
  )
);
```

```typescript
readonly canPrepareSelected = computed(() =>
  this.selectedItems().some(item =>
    item.physicalState === 'queued' ||
    item.physicalState === 'print-failed'
  )
);
```

External printer or export streams may use RxJS where appropriate.

---

## Optimistic Behaviour

Unlocking a Reward should feel immediate.

The UI may optimistically show the Reward as Unlocked when local persistence is reliable.

However:

* failure must be recoverable;
* ownership must not appear permanently saved if the operation was lost;
* duplicate unlocks must be prevented;
* local and remote identifiers must reconcile safely.

Printing status should not be optimistically marked Printed before confirmation.

---

## Duplicate Unlock Protection

A prepared Reward should not be accidentally unlocked twice for the same recipient through repeated taps.

While unlocking:

* disable repeated submission;
* show progress;
* use idempotent commands where practical;
* safely retry after network failure.

Legitimate repeated Grants must still be possible when explicitly intended.

Example:

* two Characters each receive the same Item;
* the same Badge is awarded in separate campaign runs.

---

## Error Handling

### Unlock Failed

Display:

```text
The Reward could not be saved.

Nothing has been added to the Collection yet.
```

Actions:

* Retry;
* keep draft;
* cancel.

If the Reward was safely stored locally:

```text
The Reward is saved on this device and will synchronize later.
```

---

### Collection Update Failed

Ownership and Collection projection must reconcile consistently.

The application should avoid a state where the Reward is Unlocked but permanently invisible.

If the Grant succeeded but projection update failed:

* preserve the Grant;
* retry projection update;
* show a non-destructive synchronization message.

---

### Printable Asset Generation Failed

Display:

```text
The Reward is safe, but the printable version could not be created.
```

Actions:

* Retry;
* keep in Queue;
* skip printing.

---

### External Printer App Unavailable

Display:

```text
The printer app could not be opened.

The Reward remains in your Queue.
```

Actions:

* Retry;
* Save Image;
* Share;
* Keep for Later.

Available actions depend on platform support.

---

### Print Outcome Unknown

If the application cannot determine whether printing succeeded:

```text
Printing status is unknown.
```

Actions:

* Mark as Printed;
* Try Again;
* Leave Unresolved.

Do not guess.

---

### Invalid Recipient

If a Character was deleted, archived or unavailable:

* keep the Reward visible;
* mark recipient as needing attention;
* allow reassignment;
* do not silently assign another Character.

---

## Offline Behaviour

When offline, the Game Master should be able to:

* unlock locally available prepared Rewards;
* create manual Rewards;
* assign recipients;
* add Rewards to the Queue;
* mark physical delivery manually;
* view locally cached Collection data;
* prepare local printable assets when supported.

Unavailable functions may include:

* AI Reward generation;
* cloud image generation;
* cloud template retrieval;
* remote synchronization.

Offline ownership changes should synchronize later.

Conflict resolution must not duplicate Reward Grants.

---

## Session Interruption

If the application closes after a Reward is Unlocked but before physical action is selected:

* the Reward remains Unlocked;
* it appears in unresolved Session Rewards;
* it may be added to the Queue during Session recovery or completion;
* no ownership is lost.

If the application closes during asset preparation:

* the Reward remains Unlocked;
* physical state becomes unresolved or returns to Queued;
* the user may retry.

---

## Empty States

### Empty Reward Queue

```text
No Rewards are waiting.

Rewards you save for later will appear here.
```

### No Prepared Rewards in Scene

Do not show an empty section by default.

The Running Session may offer:

```text
Create Reward
```

### Character Has No Rewards

Collection-specific empty messaging belongs to the Collection specification.

---

## Loading States

Reward Cards should use skeleton placeholders when required.

Queue loading should not block the rest of the Running Session.

A small Queue count may use cached information while the full list loads.

Asset preparation should show item-level progress rather than freezing the entire Queue.

---

## Responsive Behaviour

### Phone

* Reward Unlocked appears as a bottom sheet or focused overlay;
* actions are large and vertically stacked when necessary;
* Queue uses single-column cards;
* recipient selection uses a bottom sheet;
* batch actions remain accessible without small controls.

### Tablet

* Queue list and selected Reward details may appear side by side;
* print preview may open in a detail panel;
* multi-select becomes easier.

### Desktop

* Queue may use a structured list or two-panel layout;
* bulk preparation is supported;
* maintain clear narrative labels;
* avoid turning the experience into warehouse management.

---

## Accessibility

* Reward type must not be communicated only through imagery.
* Status must not rely only on color.
* Unlock confirmations must be announced appropriately.
* Bottom sheets and dialogs must trap and restore focus correctly.
* Recipient selection must support keyboard navigation.
* Batch selection must have accessible labels.
* Print result confirmation must use explicit wording.
* Animations must respect reduced-motion preferences.
* Celebratory effects must not flash excessively.
* Touch targets should be at least 44 × 44 CSS pixels where practical.
* Printable previews require meaningful alternative descriptions where possible.

---

## Privacy

Rewards may contain:

* child names;
* custom character names;
* campaign events;
* generated artwork.

The system should:

* avoid exposing Reward assets publicly;
* use protected or temporary asset references;
* avoid including unnecessary personal data in exported filenames;
* allow the user to review content before sharing with external apps.

Printer apps and Share Sheets are external systems.

The user should understand when data leaves Pokémon Stories.

---

## Acceptance Criteria

The feature is complete when:

* the user can prepare a Reward in the Adventure Designer;
* the user can create a Reward during a Running Session;
* the user can unlock a prepared Reward;
* unlocking records narrative ownership before printing;
* the user can assign one or more recipients;
* the user can temporarily leave a Reward unassigned;
* unlocked Rewards appear in the appropriate Collection;
* unlocking creates a narrative Timeline Entry where applicable;
* the user can choose Print Now, Add to Queue or No Physical Reward;
* printing failure does not remove ownership;
* queued Rewards remain accessible after leaving the Session;
* the user can view the Reward Queue;
* the user can prepare selected Rewards;
* the user can confirm a Reward as Printed;
* the user can mark a printed Reward as Given;
* the user can reprint without creating duplicate ownership;
* removing a Reward from the Queue does not remove it from Collection;
* unresolved Rewards appear in Session completion review;
* duplicate taps do not create accidental duplicate Grants;
* AI Suggestions require explicit acceptance;
* loading, offline and error states are handled;
* the feature works on phone, tablet and desktop;
* state transitions are validated outside Angular templates;
* domain-changing actions use Application-layer use cases.

---

## Out of Scope

Not part of the initial implementation:

* automated rule-based achievement detection;
* direct Bluetooth printer integration;
* printer hardware discovery;
* advanced template editor;
* physical inventory quantities;
* shipping physical Rewards;
* marketplace for Reward templates;
* player self-service printing;
* complex Reward trading;
* Reward revocation workflows;
* blockchain or ownership verification;
* automatic AI Reward granting;
* cross-Project Reward ownership;
* configurable achievement engine;
* real-time multi-device print synchronization.

---

## Future Enhancements

Possible future additions:

* direct printer SDK integration;
* advanced printable template selection;
* custom sticker designer;
* batch layout optimization;
* Reward rarity;
* animated digital Reward reveals;
* player-facing Collection view;
* automatic achievement suggestions;
* Reward trading with explicit rules;
* physical sticker sheet generation;
* QR-linked cards;
* print history and consumable tracking;
* shared family printer profiles;
* configurable Reward templates;
* campaign milestone Rewards.

These additions must preserve the separation between narrative ownership and physical fulfillment.

---

## Final Principle

A Reward is earned in the story.

The system may record it, celebrate it and turn it into something physical.

But printing never creates the achievement.

The story does.
