# Session Summary

## Purpose

The Session Summary transforms a completed live Session into a clear, reviewable and lasting campaign record.

It connects the end of gameplay with long-term Project evolution.

The Session Summary helps the Game Master:

* remember what happened;
* review important decisions;
* confirm Rewards;
* identify new NPCs and Locations;
* recognize Character and Pokémon changes;
* approve World Updates;
* preserve the Session as a story;
* prepare the Project for future Adventures.

The Session Summary is not an administrative report.

It is the bridge between a played story and the living campaign world.

---

## Responsibilities

The Session Summary allows the Game Master to:

* end an active Session;
* review major Session events;
* generate a narrative Summary;
* edit and save the Summary;
* review earned Rewards;
* resolve incomplete Reward details;
* review unresolved physical Rewards;
* identify possible World Updates;
* accept, edit or ignore each proposed update;
* preserve new NPCs and Locations;
* update Characters and Pokémon;
* update World Facts;
* complete the Session;
* return to the Project Dashboard or next Adventure flow.

The Session Summary is not responsible for:

* replaying the Session;
* automatically modifying the Project;
* automatically approving AI Suggestions;
* automatically granting missing Rewards;
* resolving every printing task;
* replacing the original Timeline;
* editing the full Adventure;
* deciding what is canon without Game Master approval.

---

## Experience Goal

The end of a Session should feel satisfying.

The user should feel:

* closure;
* progress;
* accomplishment;
* confidence that nothing important was lost;
* excitement for what comes next.

The experience should not feel like:

* filling out a report;
* reconciling database changes;
* reviewing technical logs;
* completing mandatory administration;
* correcting AI output line by line.

The system should help the Game Master preserve the story with as little friction as possible.

---

## Core Principles

### Celebrate Before Administrating

The first step after ending a Session should recognize what happened.

The user should see the Adventure’s outcome before being asked to review detailed changes.

---

### Timeline Is the Source, Summary Is the Story

The Timeline and Session Notes contain raw Session events.

The Session Summary transforms those events into a readable narrative.

The Summary must not replace or delete the original Timeline.

---

### AI Produces Drafts, Not Truth

AI may generate:

* a narrative Summary;
* detected events;
* proposed World Updates;
* proposed new entities.

Every AI result remains a draft or Suggestion until reviewed.

---

### Permanent Changes Require Approval

Nothing should update the Project automatically after a Session.

Each proposed change must be:

* accepted;
* edited and accepted;
* ignored;
* deferred.

---

### Reward Ownership Must Remain Safe

Rewards already Unlocked during the Session remain owned.

Incomplete Summary review must not remove:

* Reward Grants;
* Collection ownership;
* Timeline events;
* queued print actions.

---

### Printing Must Not Block Completion

The user may complete the Session while physical Rewards remain:

* queued;
* unprinted;
* printed but not given;
* unresolved.

Printing is a follow-up action, not a mandatory completion requirement.

---

### Session Completion Must Be Resumable

The user may leave during Summary review and return later.

Progress must be preserved.

The Session should remain in a review state until the workflow is completed or intentionally deferred.

---

## High-Level Flow

```text
End Session

↓

Celebration

↓

Review Session Events

↓

Review Rewards

↓

Generate and Edit Story Summary

↓

Review World Updates

↓

Complete Session

↓

Return to Project
```

Not every step requires a separate screen.

The implementation may combine compatible steps while preserving clear responsibilities.

---

## Entry Points

The Session Summary may be opened from:

* End Session action;
* Project Dashboard;
* Running Session recovery;
* recent Session card;
* Session History;
* pending Session review notification.

Recommended route:

```text
/projects/:projectId/sessions/:sessionId/summary
```

The route must preserve explicit Project and Session context.

---

## Session Completion State

Ending gameplay should not immediately mark every post-Session activity as complete.

Recommended Session lifecycle:

```text
Running

↓

Review Pending

↓

Completed
```

### Running

The Session is actively being played.

### Review Pending

Gameplay has ended, but Summary or Project updates still require review.

### Completed

The Session record is finalized.

The Summary may still be edited later if product rules allow it, but post-Session changes have been resolved or deferred.

---

## End Session Action

The Game Master explicitly ends a Running Session.

Before ending, the application may show:

```text
End this Session?

You can review the story, Rewards and world changes next.
```

Actions:

* End Session;
* Continue Playing;
* Cancel.

Ending a Session should:

1. preserve the final Session state;
2. record the end time;
3. stop active gameplay timing;
4. change status to Review Pending;
5. open the Session completion flow.

It should not:

* automatically approve World Updates;
* remove unresolved Rewards;
* archive the Adventure;
* assume the Adventure is permanently complete.

---

## End Session With Incomplete Actions

The Session may end while:

* AI generation is in progress;
* a Reward is queued;
* a Note is incomplete;
* printing is unresolved;
* a Quick Create entity has minimal details;
* the current Scene is unfinished.

The system should preserve these items and surface them during review.

The Session must not remain stuck in Running state because optional work is incomplete.

---

# Celebration

## Purpose

The Celebration step provides emotional closure before detailed review.

It highlights important outcomes from the Session.

Recommended content:

* Adventure title;
* Session participants;
* major accomplishments;
* newly caught Pokémon;
* earned Badges;
* important discoveries;
* completed Goal;
* number of Rewards;
* Session duration where useful.

Example:

```text
Adventure complete!

Today the team:

• found the missing Egg;
• caught Pikachu;
• met Professor Elm;
• discovered the Old Bridge.

3 Rewards earned
1 Reward waiting to print
```

---

## Celebration Data

Celebration content may be derived from:

* Timeline Entries;
* Reward Grants;
* current and completed Goals;
* accepted Session events;
* Scene progression;
* manually selected highlights.

AI may help summarize events, but deterministic facts should come from stored Session state.

---

## Celebration Actions

Recommended actions:

```text
Review the Story

Finish Rewards

Continue
```

The UI may use one primary Continue action and show unresolved Reward status as supporting information.

The Celebration screen must not require resolving every Reward immediately.

---

## Celebration Tone

The tone should match:

* Audience;
* Adventure tone;
* Session outcome.

A partially successful or unresolved Adventure should not be falsely presented as complete victory.

Possible variants:

* Adventure Complete;
* Session Complete;
* Chapter Complete;
* To Be Continued.

The wording should reflect actual state.

---

# Session Event Review

## Purpose

The event review helps the Game Master confirm what happened before generating permanent changes.

It may summarize:

* Timeline Entries;
* Notes;
* Scene transitions;
* Rewards;
* created NPCs;
* created Locations;
* Character changes;
* Pokémon events;
* open questions.

The user should not be forced to review every minor Note.

---

## Event Categories

Recommended categories:

```text
Major Event

Character Change

Pokémon Event

NPC Event

Location Discovery

Reward

World Change

Quest or Story Change

General Note
```

Categories support Summary generation and World Update detection.

---

## Important Event Detection

Important events may be identified by:

* explicit Quick Note type;
* Reward unlock;
* Goal completion;
* entity creation;
* Game Master highlight;
* AI analysis;
* repeated references.

AI-detected importance is advisory.

The Game Master may:

* mark an event important;
* remove it from highlights;
* edit its wording;
* reclassify it.

---

## Event Editing

Editing an event for the Summary should not necessarily rewrite the original raw Note.

Recommended distinction:

```text
Original Timeline Entry

↓

Summary Representation
```

The original event remains preserved.

The Summary may use a cleaner narrative version.

---

# Reward Review

## Purpose

Reward Review ensures that all earned Rewards are understandable and safely recorded.

It may show:

* Unlocked Rewards;
* recipients;
* incomplete details;
* queued physical Rewards;
* print failures;
* printed but not given Rewards;
* Prepared Rewards that remained unused.

---

## Reward Review Groups

Recommended groups:

```text
Earned

Needs Details

Waiting to Print

Printed but Not Given

Unused Prepared Rewards
```

Not every group needs to appear.

Empty groups should be omitted.

---

## Earned Rewards

Each earned Reward should show:

* name;
* type;
* recipient;
* source event;
* Collection destination;
* physical state.

The user may correct:

* recipient;
* name;
* type;
* description;
* physical choice.

Corrections must not create duplicate ownership.

---

## Incomplete Rewards

A Reward created quickly during play may have missing metadata.

Example:

```text
Vulpix Companion

For: Emma
Type: Pokémon
Details incomplete
```

Actions:

* Complete Details;
* Keep as Is;
* Remove Incorrect Grant.

Keeping incomplete details must not remove ownership.

---

## Unassigned Rewards

Unassigned Rewards require review.

Actions:

* assign to one Character;
* assign to multiple Characters;
* assign to everyone;
* assign to Project;
* leave unresolved.

The Session may still be completed with unresolved assignment only if the domain allows it.

Unresolved ownership should remain visible in follow-up tasks.

---

## Unused Prepared Rewards

Prepared Rewards that were not earned should not enter Collection.

The user may:

* keep them attached to the Adventure;
* move them to a later Adventure;
* archive them;
* remove the preparation;
* ignore them.

No automatic action is required.

---

## Physical Reward Review

Physical actions may include:

* Prepare Now;
* Keep in Queue;
* Mark as Printed;
* Mark as Given;
* Skip Printing;
* Retry Failed.

The Session may be completed without resolving these actions.

---

# Session Story

## Purpose

The Session Story is a readable narrative recap of the gameplay.

It should preserve the emotional and narrative meaning of the Session.

It may later be:

* viewed in Session History;
* printed;
* added to an Adventure Journal;
* shared privately;
* used as context for future AI requests.

---

## Story Generation

The Story may be:

* written manually;
* generated by AI;
* generated and edited;
* regenerated with a different style.

Recommended flow:

```text
Timeline and Notes

↓

Generate Draft

↓

Review

↓

Edit

↓

Save
```

---

## Story Inputs

The AI may receive:

* Audience;
* Adventure title and Premise;
* participating Characters;
* relevant Pokémon;
* Timeline Entries;
* selected Notes;
* Scene progression;
* Rewards;
* accepted highlights;
* Session outcome.

The AI should not receive unrelated Project content.

---

## Story Output

The generated Story should:

* remain faithful to recorded events;
* preserve established names;
* avoid inventing major actions;
* avoid adding unrecorded Rewards;
* avoid presenting Suggestions as facts;
* match the selected language;
* match Audience complexity;
* remain editable.

---

## Story Length

Suggested options:

```text
Short Recap

Story Summary

Adventure Journal
```

### Short Recap

A few sentences.

Useful for Project Dashboard and history lists.

### Story Summary

Several paragraphs.

Default Session record.

### Adventure Journal

Longer, more narrative form.

May be used for printing or child-facing keepsakes.

The MVP may support one default Summary length plus a shorter preview.

---

## Story Tone

Possible transformations:

```text
More Playful

More Emotional

More Adventurous

Shorter

Simpler Language
```

Transformations operate on the current draft.

They must not introduce new facts.

---

## Manual Editing

The user may edit the Story freely.

Once edited and saved, it becomes user-approved content.

AI origin should not restrict future editing.

---

## Save States

Recommended states:

```text
Not Generated

Draft

Edited

Saved

Save Failed
```

A Session may be completed with a manual short Summary if AI is unavailable.

---

# World Update Review

## Purpose

World Update Review identifies which Session events should become permanent Project changes.

Possible updates include:

* new NPC;
* updated NPC;
* new Location;
* updated Location;
* new World Fact;
* superseded World Fact;
* Character change;
* Pokémon change;
* Adventure state change;
* Story Thread change later.

---

## Update Sources

World Updates may originate from:

* explicit Timeline Entries;
* Quick Create entities;
* Reward Grants;
* Game Master-created proposals;
* AI-detected Suggestions;
* Session Story analysis.

Source information should remain visible where useful.

---

## Update States

Recommended lifecycle:

```text
Proposed

↓

Accepted
or
Edited and Accepted
or
Ignored
or
Deferred

↓

Applied
```

### Proposed

The update is waiting for review.

### Accepted

The proposed content is approved.

### Edited and Accepted

The Game Master modified the proposal before approval.

### Ignored

The update will not be applied.

### Deferred

The update remains for later review.

### Applied

The accepted update has successfully changed Project state.

---

## Update Card

Each World Update should be independently reviewable.

Recommended content:

* update type;
* proposed change;
* related entity;
* source event;
* conflict warning;
* available actions.

Example:

```text
New Location

Old Bridge

A damaged bridge hidden beyond the Flower Meadow.

Source:
The players followed the river during Session.
```

Actions:

* Accept;
* Edit;
* Merge with Existing;
* Keep in Session Only;
* Ignore.

---

## New NPC Update

Possible actions:

* Save as Project NPC;
* Edit and Save;
* Merge with Existing NPC;
* Keep in Session Only;
* Ignore.

Minimal Session-created NPCs should be eligible for refinement before saving.

---

## New Location Update

Possible actions:

* Save as Project Location;
* Edit and Save;
* Merge with Existing Location;
* Keep in Session Only;
* Ignore.

Promotion must preserve Session and Scene references.

---

## Character Change Update

Examples:

* Character gained trust from an NPC;
* Character completed a personal Goal;
* Character received a title;
* Character changed a Story Note.

Character changes require review.

Collection ownership already granted through the Reward System should not be duplicated as a second update.

---

## Pokémon Change Update

Examples:

* Pokémon caught;
* Pokémon befriended;
* Pokémon evolved;
* Pokémon renamed;
* Pokémon left temporarily.

If the event was already applied through the Reward or Collection system, World Update Review should reference the existing change rather than duplicate it.

---

## World Fact Update

Example:

```text
Previous Fact:
The Old Bridge is broken.

Proposed Fact:
The Old Bridge has been repaired.
```

Actions:

* Supersede Existing Fact;
* Keep Both;
* Edit;
* Ignore.

World Fact conflicts require explicit user choice.

---

## Adventure Status Update

Possible proposals:

* mark Adventure Completed;
* keep Adventure Running for another Session;
* return Adventure to Ready;
* archive later.

Ending one Session does not always mean the Adventure is Completed.

The Game Master decides.

---

## Merge Suggestions

When a proposed NPC or Location resembles an existing entity, offer:

```text
Use Existing

Merge

Keep Both

Edit Proposal
```

The system must not merge automatically.

---

## Apply Updates

Accepted updates may be applied:

* immediately one by one;
* in one selected batch;
* after final confirmation.

Recommended MVP flow:

```text
Review Updates

↓

Select Accepted Changes

↓

Apply Selected Updates
```

The operation should preserve partial success information.

---

## Partial Apply Failure

If some updates succeed and others fail:

* preserve applied changes;
* identify failed updates;
* allow retry;
* do not reapply successful updates;
* avoid duplicate entities or Facts.

Example:

```text
4 updates applied
1 update needs attention
```

---

# Session Finalization

## Purpose

Finalization closes the post-Session workflow.

Before completion, the interface should summarize:

* Session Story saved state;
* Rewards earned;
* unresolved Reward tasks;
* World Updates applied;
* deferred updates;
* Adventure status.

---

## Completion Checklist

Recommended review summary:

```text
Session Story
Saved

Rewards
3 earned
1 waiting to print

World Updates
4 applied
1 deferred

Adventure
Completed
```

The user should be able to open any unresolved section.

---

## Complete Session

Completing the Session should:

1. preserve the final Summary;
2. preserve Timeline and Notes;
3. preserve Reward Grants;
4. preserve unresolved print tasks;
5. apply accepted World Updates;
6. record deferred updates;
7. set final Session status to Completed;
8. update Project recent activity;
9. navigate to a completion destination.

---

## Completion Destination

Recommended options:

```text
Return to Project

View Session Story

Create Next Adventure
```

The primary default should normally be:

```text
Return to Project
```

The Project Dashboard should reflect:

* latest completed Session;
* new Collection Items;
* unresolved Reward Queue count;
* next recommended action.

---

## Complete With Deferred Work

The Game Master may complete the Session while:

* Rewards remain queued;
* updates remain deferred;
* some metadata remains incomplete;
* printing remains unresolved.

Deferred work should remain accessible from:

* Project Dashboard;
* Session History;
* Reward Queue;
* World Update review.

The system should not repeatedly interrupt the user with non-critical tasks.

---

# Session History

## Purpose

Completed Sessions should remain accessible as campaign history.

Recommended route:

```text
/projects/:projectId/sessions
```

Session detail:

```text
/projects/:projectId/sessions/:sessionId
```

---

## Session History Card

Recommended content:

* Adventure title;
* Session date;
* participating Characters;
* short recap;
* Rewards count;
* important change count;
* completion state.

Example:

```text
The Lost Pokémon Egg

August 2, 2026

Emma and Marci found the Egg
and discovered the Old Bridge.

3 Rewards
4 World Updates
```

---

## Session Detail

Recommended content:

* Session Story;
* Timeline;
* Notes;
* participating Characters;
* Scene progression;
* Rewards;
* applied World Updates;
* deferred items;
* Adventure link.

The default view should prioritize the Story.

Raw Notes and Timeline may be secondary.

---

## Editing Completed Summaries

The Game Master may edit the Session Story later.

Editing the Story should not automatically re-run or alter previously applied World Updates.

If changed Story content suggests new changes, the user may explicitly request a new analysis later.

---

## Reopening Session Review

A Completed Session should not normally return to Running.

However, unresolved review items may be reopened.

Possible actions:

* edit Summary;
* resolve deferred World Updates;
* resolve Reward details;
* print or reprint;
* correct metadata.

Resuming gameplay from a Completed Session is out of scope.

A new Session should be created instead.

---

# AI Integration

## AI Capabilities

AI may support:

* generate Session Story;
* shorten Summary;
* simplify language;
* change tone;
* identify major events;
* classify Notes;
* propose World Updates;
* detect possible new NPCs;
* detect possible Locations;
* identify unresolved story threads;
* identify possible contradictions.

---

## AI Limitations

AI must not:

* apply World Updates;
* grant missing Rewards automatically;
* rewrite Timeline history;
* mark the Adventure Completed automatically;
* remove Notes;
* merge entities;
* decide ownership;
* mark printing as complete;
* invent major unrecorded events.

---

## Summary Accuracy

AI-generated Summary must be grounded in Session data.

The provider should be instructed to:

* use only supplied events;
* preserve names;
* avoid adding actions;
* mark uncertainty where Notes conflict;
* avoid resolving unresolved outcomes.

---

## Conflicting Notes

If Notes conflict:

* do not silently choose;
* flag the conflict;
* ask the Game Master to resolve it;
* exclude uncertain details from canonical Summary until confirmed.

Example:

```text
Two different outcomes were recorded for the Old Bridge.

Which one happened?
```

---

# Business Rules

* Every Session belongs to exactly one Project.
* Every Session belongs to one Adventure.
* A Running Session must be explicitly ended.
* Ending gameplay changes the Session to Review Pending.
* Review Pending Sessions are resumable.
* A Session Summary is not automatically canonical until saved.
* AI-generated Summary content is a draft.
* Timeline and Notes remain preserved after Summary generation.
* World Updates require explicit approval.
* World Updates are independently reviewable.
* Applying one update must not require accepting all updates.
* Reward Grants already created during play must not be duplicated.
* Printing state must not affect Reward ownership.
* Session completion must not require all physical Rewards to be resolved.
* Session completion may allow deferred World Updates.
* New NPCs and Locations must not be promoted automatically.
* Duplicate entities must not be merged automatically.
* World Fact conflicts require explicit resolution.
* Ending a Session does not automatically mark the Adventure Completed.
* Applied updates must be idempotent where practical.
* Partial update failure must not reapply successful updates.
* Completed Sessions retain their Timeline, Notes, Story, Rewards and update history.
* Editing a completed Story must not silently alter Project state.
* Session data from one Project must not update another Project.
* Game Master-only information must remain protected.
* Presentation templates must not implement update transition logic.

---

# Domain Model Interaction

Related concepts:

* Session;
* Session Status;
* Session Summary;
* Timeline Entry;
* Session Note;
* Adventure;
* Adventure Status;
* Scene;
* Goal;
* Reward Grant;
* Reward Fulfillment;
* Character;
* Pokémon;
* NPC;
* Location;
* World Fact;
* World Update;
* Narrative Context;
* AI Suggestion.

---

## Session Summary Model

Conceptual shape:

```typescript
interface SessionSummary {
  readonly sessionId: string;
  readonly projectId: string;
  readonly adventureId: string;
  readonly shortRecap: string;
  readonly story: string;
  readonly highlights: readonly SessionHighlight[];
  readonly generatedAt: string | null;
  readonly lastEditedAt: string | null;
  readonly status: SessionSummaryStatus;
}
```

---

## Session Highlight

```typescript
interface SessionHighlight {
  readonly id: string;
  readonly type: SessionHighlightType;
  readonly text: string;
  readonly sourceTimelineEntryIds: readonly string[];
}
```

---

## World Update Proposal

```typescript
interface WorldUpdateProposal {
  readonly id: string;
  readonly projectId: string;
  readonly sessionId: string;
  readonly type: WorldUpdateType;
  readonly sourceReferenceIds: readonly string[];
  readonly proposedChange: unknown;
  readonly reviewState: WorldUpdateReviewState;
  readonly conflict: WorldUpdateConflict | null;
}
```

These are conceptual contracts.

Feature-specific update payloads should use strong typing rather than unrestricted `unknown` in production code.

---

## Session Completion State

```typescript
type SessionStatus =
  | 'running'
  | 'review-pending'
  | 'completed';
```

Summary state:

```typescript
type SessionSummaryStatus =
  | 'not-created'
  | 'draft'
  | 'saved'
  | 'error';
```

Update review state:

```typescript
type WorldUpdateReviewState =
  | 'proposed'
  | 'accepted'
  | 'edited'
  | 'ignored'
  | 'deferred'
  | 'applied'
  | 'failed';
```

---

# Suggested Application Use Cases

```text
EndSession

LoadSessionCompletion

ReviewSessionEvents

MarkSessionHighlight

GenerateSessionSummary

UpdateSessionSummary

SaveSessionSummary

ListSessionRewards

CompleteRewardDetails

ReviewPhysicalRewards

SuggestWorldUpdates

CreateWorldUpdateProposal

AcceptWorldUpdate

EditAndAcceptWorldUpdate

IgnoreWorldUpdate

DeferWorldUpdate

ApplySelectedWorldUpdates

ResolveWorldUpdateConflict

SetAdventurePostSessionStatus

CompleteSessionReview

LoadSessionHistory

LoadSessionDetails

ReopenDeferredSessionReview
```

The exact number of use cases may be reduced where a simpler design preserves clear intent.

Avoid one unrestricted `FinalizeEverything` operation that hides partial failures and business rules.

---

# Suggested Angular Structure

```text
features/
  session-summary/
    pages/
      session-completion-page/
      session-history-page/
      session-details-page/
    components/
      session-celebration/
      session-highlight-list/
      session-event-review/
      session-reward-review/
      session-story-editor/
      session-story-preview/
      world-update-list/
      world-update-card/
      world-update-conflict/
      session-completion-summary/
      deferred-work-summary/
      session-history-card/
    application/
      end-session/
      load-session-completion/
      generate-session-summary/
      manage-session-summary/
      review-session-rewards/
      suggest-world-updates/
      apply-world-updates/
      complete-session-review/
      load-session-history/
    domain/
      session-summary/
      session-highlight/
      world-update-proposal/
      session-review-state/
    infrastructure/
      session-summary-repository/
      session-summary-ai-provider/
      world-update-repository/
```

World entity creation and Reward transitions should reuse their owning feature use cases.

The Session Summary feature should coordinate rather than duplicate those domain implementations.

---

# Suggested Completion View Model

```typescript
interface SessionCompletionViewModel {
  readonly sessionId: string;
  readonly adventure: AdventureSummary;
  readonly participants: readonly CharacterSummary[];
  readonly celebration: SessionCelebrationViewModel;
  readonly highlights: readonly SessionHighlightViewModel[];
  readonly rewards: SessionRewardReviewViewModel;
  readonly story: SessionStoryViewModel;
  readonly worldUpdates: readonly WorldUpdateViewModel[];
  readonly adventureResolution: AdventureResolutionViewModel;
  readonly canComplete: boolean;
  readonly unresolvedItems: readonly SessionReviewIssue[];
}
```

---

## Step State

```typescript
type SessionCompletionStep =
  | 'celebration'
  | 'events'
  | 'rewards'
  | 'story'
  | 'world-updates'
  | 'complete';
```

The UI may expose the flow as steps without forcing strict linear completion.

---

# State Management

Angular Signals should manage UI state.

Example:

```typescript
readonly activeStep =
  signal<SessionCompletionStep>('celebration');

readonly summary =
  signal<SessionSummaryEditorModel | null>(null);

readonly worldUpdates =
  signal<readonly WorldUpdateViewModel[]>([]);

readonly isGeneratingSummary =
  signal(false);

readonly isApplyingUpdates =
  signal(false);

readonly error =
  signal<SessionCompletionError | null>(null);
```

Derived values:

```typescript
readonly acceptedUpdates = computed(() =>
  this.worldUpdates().filter(
    update =>
      update.reviewState === 'accepted' ||
      update.reviewState === 'edited'
  )
);
```

```typescript
readonly unresolvedCount = computed(() =>
  calculateUnresolvedSessionItems(
    this.rewards(),
    this.worldUpdates(),
    this.summary()
  )
);
```

```typescript
readonly canComplete = computed(() =>
  !this.isApplyingUpdates() &&
  hasMinimumCompletionData(this.summary())
);
```

Business rules must remain outside templates.

---

# Autosave

Session Summary review should preserve progress automatically.

Autosaved content may include:

* Story edits;
* selected Highlights;
* World Update review decisions;
* deferred status;
* Reward detail corrections;
* current completion step.

Autosave must not apply accepted World Updates before the explicit Apply action.

---

## Save Failure

If review progress cannot be synchronized:

* preserve local changes;
* communicate the issue;
* allow retry;
* prevent silent loss;
* permit safe exit when local persistence exists.

Example:

```text
Your review is saved on this device and will synchronize later.
```

Where local persistence is unavailable:

```text
We could not save your latest changes.
```

---

# Loading Behaviour

The completion shell should appear quickly.

Recommended loading order:

1. Adventure and Session identity;
2. deterministic Celebration data;
3. Rewards;
4. Timeline and Highlights;
5. saved Summary draft;
6. World Update proposals;
7. AI-generated content where requested.

Do not block Celebration while AI analysis is running.

---

# Empty States

## No Timeline Events

```text
No major events were recorded.

You can still write a Session Story manually.
```

---

## No Rewards

Do not show an empty Reward section prominently.

Optional message:

```text
No Rewards were recorded during this Session.
```

---

## No World Updates

```text
No permanent world changes were identified.

You can complete the Session or add one manually.
```

---

## No Session Story

```text
Turn your Session Notes into a lasting story.

[Generate Draft]
[Write Manually]
```

---

# Error Handling

## Session Cannot Be Ended

Keep the Session Running.

Display:

```text
The Session could not be ended safely.
```

Actions:

* Retry;
* Continue Playing.

---

## Completion Data Loading Failed

Display cached sections where available.

```text
Some Session details could not be loaded.
```

Actions:

* Retry missing sections;
* return to Project;
* continue with available data when safe.

---

## Summary Generation Failed

Keep Timeline and Notes unchanged.

```text
The Session Story could not be generated.

You can try again or write it manually.
```

---

## Summary Save Failed

Preserve the draft locally.

Do not lose user edits.

---

## World Update Analysis Failed

The user may:

* retry;
* add updates manually;
* complete the Session without AI Suggestions.

---

## World Update Apply Failed

Identify failed items individually.

Successful updates remain applied.

Actions:

* Retry Failed;
* Edit;
* Defer;
* Ignore.

---

## Duplicate Entity Conflict

Show possible existing matches.

Do not silently create or merge.

---

## Missing Source Reference

The proposed update may remain reviewable.

Display:

```text
The original Session event is unavailable.
```

The user may still accept the update if the proposal is understandable.

---

## Reward Projection Error

If Reward ownership exists but Collection projection is unavailable:

* preserve ownership;
* retry projection;
* communicate synchronization state;
* do not recreate the Grant.

---

# Offline Behaviour

When offline, the user should be able to:

* end a locally stored Session;
* view deterministic Celebration data;
* review Timeline and Notes;
* edit or write the Session Story;
* review Rewards;
* defer World Updates;
* create manual update proposals;
* complete locally when synchronization architecture supports it.

Unavailable capabilities may include:

* AI Summary generation;
* AI World Update detection;
* cloud entity search;
* cloud image generation.

Example:

```text
AI assistance is unavailable offline.

You can complete the Session manually.
```

Offline completion must synchronize without duplicating:

* Session completion;
* Rewards;
* NPCs;
* Locations;
* World Facts.

---

# Recovery Behaviour

If the application closes during review:

* the Session remains Review Pending;
* current progress is restored;
* the Project Dashboard shows Review Session;
* no accepted but unapplied update is assumed applied;
* applied updates are not repeated;
* Summary edits are restored where saved.

---

## Interrupted Update Application

If interruption occurs during batch apply:

* reconcile update identifiers;
* mark confirmed successes as Applied;
* leave unknown outcomes for verification;
* do not blindly retry all updates;
* surface unresolved results.

Idempotent update commands are strongly recommended.

---

# Responsive Behaviour

## Phone

* step-based single-column flow;
* Celebration as focused first screen;
* Reward and World Update Cards stacked;
* Story editor full-screen;
* bottom sheets for update actions;
* one primary action at a time;
* persistent progress indicator where useful.

## Tablet

* step navigation and content may coexist;
* Story preview and editor may appear side by side;
* World Update list and details may use two panels.

## Desktop

* left completion navigation;
* central review content;
* optional right context panel;
* batch update actions supported;
* avoid administrative table-heavy presentation.

All core actions must remain touch-compatible.

---

# Accessibility

* Completion steps must have clear accessible labels.
* Progress must not rely only on color.
* Celebration animations must respect reduced motion.
* Summary editors require persistent labels.
* Generated content must be identified as a draft.
* World Update actions require explicit text labels.
* Conflict details must be understandable without visual comparison alone.
* Focus must move predictably between steps.
* Error messages must be announced appropriately.
* Batch selection must support keyboard use.
* Status changes should not produce excessive screen reader announcements.
* Touch targets should be at least 44 × 44 CSS pixels where practical.
* Story preview typography must remain readable on small screens.

---

# Privacy

Session Summaries may contain:

* child Character names;
* story events;
* custom Notes;
* Game Master-only information;
* generated content;
* printable stories.

The system should:

* keep Session content private by default;
* avoid public asset URLs;
* exclude secret Notes from player-facing exports unless selected;
* minimize personal data sent to AI;
* allow review before external sharing;
* protect completed and Review Pending Sessions equally.

---

# Performance

Long Sessions may contain many Notes and Timeline Entries.

The implementation should support:

* incremental event loading;
* compact AI context projections;
* batched World Update analysis;
* lazy loading of images;
* cached Session summaries;
* avoiding full Project graph loading;
* efficient update reconciliation.

The Session Summary should not require loading all Project history before opening.

---

# Acceptance Criteria

The feature is complete when:

* the Game Master can explicitly end a Running Session;
* ending changes the Session to Review Pending;
* the Session completion flow opens after ending;
* the user sees a Celebration summary;
* major Session events are reviewable;
* the user can mark or edit important Highlights;
* earned Rewards are visible;
* Reward ownership is preserved independently of Summary review;
* incomplete Reward details can be completed or deferred;
* physical Reward tasks can remain unresolved;
* the user can generate an AI Session Story;
* the generated Story is editable;
* the user can write a Story manually when AI is unavailable;
* the saved Story remains separate from the raw Timeline;
* the system can propose World Updates;
* every World Update can be accepted, edited, ignored or deferred independently;
* new NPCs and Locations are not promoted automatically;
* duplicate entities are not merged automatically;
* World Fact conflicts require explicit resolution;
* selected updates can be applied;
* partial apply failure is recoverable;
* applied updates are not duplicated on retry;
* the user can choose the Adventure’s post-Session state;
* the Session can be completed with unresolved printing;
* the Session can be completed with deferred non-critical updates;
* completed Sessions appear in Session History;
* the Project Dashboard reflects the completed Session;
* interrupted review can be resumed;
* loading, empty, offline and error states are handled;
* the feature works on phone, tablet and desktop;
* AI output remains non-canonical until approved;
* Angular templates do not implement completion or update transition rules;
* state-changing actions use Application-layer use cases.

---

# Out of Scope

Not part of the initial implementation:

* automatic full Project updates;
* automatic NPC or Location merging;
* automatic Adventure completion;
* automatic Reward creation from AI guesses;
* autonomous Story rewriting;
* public Session publishing;
* player comments;
* collaborative Summary editing;
* real-time multi-device review;
* video or audio Session replay;
* automatic speech transcription;
* advanced campaign analytics;
* branching world histories;
* rollback of full Session effects;
* AI-generated comic books;
* automatic child-facing export;
* complex quest engine integration;
* cross-Project Session migration.

---

# Future Enhancements

Possible future additions:

* voice transcription;
* illustrated Adventure Journal;
* printable Session Story;
* family recap mode;
* player-facing Session history;
* Session photos and attachments;
* richer Story Thread updates;
* automatic but reviewable unresolved-hook detection;
* comparison between planned and actual Adventure flow;
* Session quality reflection;
* collaborative Game Master review;
* world state snapshots;
* reversible update batches;
* child-friendly narrated recap;
* campaign book generation;
* milestone and chapter summaries.

These additions must preserve explicit Game Master control over permanent campaign truth.

---

# Final Principle

A Session Summary should not feel like paperwork after the fun.

It should feel like preserving the adventure while it is still alive.
