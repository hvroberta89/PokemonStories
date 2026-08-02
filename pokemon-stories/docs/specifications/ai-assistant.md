# AI Assistant

## Purpose

The AI Assistant defines how artificial intelligence supports creativity, preparation and live storytelling inside Pokémon Stories.

The AI is not an autonomous Game Master.

It is a contextual creative companion that helps the Game Master:

* generate ideas;
* overcome creative blocks;
* explore alternatives;
* adapt prepared content;
* improvise during live Sessions;
* summarize completed gameplay;
* identify possible Project updates.

The Game Master remains responsible for every story decision.

AI-generated content is always a Suggestion until explicitly accepted.

---

## Responsibilities

The AI Assistant may support:

* Adventure creation;
* Story development;
* Scene generation;
* NPC and Location creation;
* Encounter generation;
* Reward ideas;
* Ending and Twist suggestions;
* live Session improvisation;
* Session Summary generation;
* possible World Update identification;
* content refinement;
* Audience-aware adaptation.

The AI Assistant is not responsible for:

* deciding what is canonical;
* automatically modifying the Project;
* starting or advancing Sessions;
* granting Rewards;
* printing;
* changing Collection ownership;
* making irreversible decisions;
* replacing the Game Master;
* enforcing gameplay rules unless a future rule-specific feature explicitly requires it.

---

## Experience Goal

The AI should feel like a helpful creative partner sitting beside the Game Master.

It should not feel like:

* a generic chatbot;
* an automated storyteller;
* a hidden decision engine;
* a content generator that takes over the Adventure;
* an unpredictable system with access to the entire Project;
* a mandatory dependency.

The user should always understand:

* what the AI is being asked to do;
* what context it is using;
* that its output is optional;
* what happens when a Suggestion is accepted;
* whether a result has been saved.

---

## Core Principles

### AI Suggests, Humans Decide

Every AI result is a Suggestion.

The AI cannot directly create canonical campaign content.

A Suggestion becomes part of the Project only after the Game Master:

1. reviews it;
2. selects or edits it;
3. explicitly saves or applies it.

---

### The AI Does Not Own the Story

The Game Master remains the author.

The AI may:

* expand;
* reframe;
* propose;
* adapt;
* summarize.

It must not define the story without human approval.

---

### Context Must Be Intentional

The AI must not receive the complete Project automatically.

Every AI request uses a purpose-built Narrative Context containing only information relevant to the current task.

This improves:

* relevance;
* performance;
* privacy;
* consistency;
* cost control;
* explainability.

---

### Multiple Alternatives Are Better Than One Answer

Creative generation should normally provide three meaningfully different Suggestions.

The Suggestions should differ in:

* narrative direction;
* tone;
* emotional focus;
* complexity;
* gameplay approach.

They should not be minor paraphrases.

Example labels:

```text
Playful

Mysterious

Emotional
```

or:

```text
Safe

Unexpected

Dramatic
```

---

### AI Must Respect the Audience

AI output must reflect the selected Audience.

Audience may influence:

* vocabulary;
* emotional intensity;
* danger;
* fear;
* violence;
* complexity;
* moral ambiguity;
* humor;
* Session length.

Content suitable for teenagers may not be appropriate for young children.

Audience constraints apply to every AI capability.

---

### AI Must Not Block the Product

The application must remain usable without AI.

If AI is unavailable, the Game Master can still:

* edit Adventures;
* run Sessions;
* add Notes;
* create NPCs manually;
* create Rewards;
* manage Collections;
* complete Session review.

AI failure must never block the story.

---

### AI Output Is Untrusted Input

AI-generated content must be validated before entering the domain.

Validation may include:

* required field checks;
* length limits;
* reference validation;
* Audience suitability;
* supported type validation;
* malformed output handling;
* duplicate detection.

The AI provider response must never be treated as valid domain state automatically.

---

## AI Capability Areas

The AI Assistant operates in four main contexts:

```text
DESIGN

PREPARE

PLAY

REMEMBER
```

Each context has different goals and interaction rules.

---

# DESIGN

## Purpose

Help the Game Master build and refine an Adventure.

The AI may generate:

* Premises;
* titles;
* Story outlines;
* Scenes;
* NPCs;
* Locations;
* Encounters;
* Rewards;
* Secrets;
* Twists;
* Endings.

The interaction is exploratory.

The user may compare alternatives and revise content before saving.

---

## Design Interaction Pattern

```text
Choose AI Action

↓

Provide Optional Direction

↓

Build Narrative Context

↓

Generate Three Suggestions

↓

Review Suggestions

↓

Use, Edit, Regenerate or Dismiss

↓

Save Accepted Content
```

---

## Design AI Actions

Examples:

```text
Generate three Premises

Expand this Story idea

Create an opening Scene

Suggest three NPCs

Create a non-combat Encounter

Generate three possible Rewards

Suggest an unexpected Twist

Create multiple Endings

Adapt for younger children

Make this more mysterious
```

Actions should be task-oriented.

Avoid presenting an empty general chat box as the primary interaction.

---

## Design Suggestion Quality

Suggestions should:

* be concise enough to compare;
* provide meaningful differences;
* use current Adventure context;
* respect existing accepted content;
* avoid contradicting known World Facts;
* remain editable;
* avoid over-specifying player decisions;
* leave room for Game Master creativity.

---

# PREPARE

## Purpose

Help the Game Master prepare a playable Session.

The AI may assist with:

* identifying missing preparation;
* summarizing the Adventure;
* selecting relevant context;
* suggesting likely player questions;
* preparing fallback ideas;
* generating optional Rewards;
* creating short NPC reminders;
* estimating potential Session flow.

The AI must not require the Game Master to complete every recommended item.

---

## Preparation Actions

Examples:

```text
Summarize this Adventure for play

What should I remember?

Suggest three backup Scenes

Create likely player questions

Identify unclear preparation

Create a quick NPC reference

Suggest one optional Reward
```

---

## Preparation Review

The AI may identify possible gaps.

Example:

```text
You may want to prepare:

- one fallback Scene;
- a motivation for Professor Elm;
- a possible Ending.
```

These are recommendations.

They must not automatically change readiness or block Session start.

Domain readiness rules remain deterministic and separate from AI review.

---

# PLAY

## Purpose

Support rapid improvisation during a live Session.

This is the most time-sensitive AI context.

The AI must prioritize:

* speed;
* relevance;
* short output;
* actionable alternatives;
* minimal user input;
* non-blocking behavior.

The AI must not produce long essays during play unless explicitly requested.

---

## Running Session AI Entry

The Running Session should provide structured actions.

Recommended options:

```text
Players went off track

We are stuck

Create an NPC

Create an Encounter

Create a Pokémon event

Add a complication

Suggest what happens next

Something else
```

The user should not need to formulate a detailed prompt for common needs.

---

## Running Session Flow

```text
Choose Situation

↓

Provide Short Description

↓

Build Session Context

↓

Generate Three Immediate Ideas

↓

Use Now, Modify, Save or Retry
```

The AI may ask at most one short follow-up question when necessary.

Avoid multi-step conversational interrogation during play.

---

## Running Session Output

Output should normally include three concise options.

Example:

```text
1. Friendly Detour

A young Hoothoot leads the group toward an abandoned Ranger camp.

2. Hidden Clue

The riverbank contains pieces of the missing Egg’s nest.

3. Unexpected Danger

A sudden storm forces the group into a hidden cave.
```

Each option should be understandable at a glance.

---

## Running Session Actions

For each Suggestion:

* Use Now;
* Modify;
* Save as Scene;
* Save as NPC;
* Save as Encounter;
* Try Again;
* Dismiss.

`Use Now` does not automatically create permanent Project content.

It may temporarily mark the Suggestion as used in the current Session.

Permanent storage requires explicit action.

---

## Fast AI Response

The Running Session should optimize for perceived and actual speed.

Recommended behavior:

* send limited context;
* request concise structured output;
* show progressive loading when supported;
* keep existing Session UI interactive;
* allow the user to dismiss the AI panel;
* preserve the request if the panel is reopened.

AI generation must not block Notes, Scene navigation or Reward actions.

---

# REMEMBER

## Purpose

Help transform Session events into useful campaign history.

The AI may:

* generate a narrative Session Summary;
* identify important decisions;
* detect possible new NPCs;
* identify new Locations;
* propose Character changes;
* propose World Facts;
* identify completed or opened story threads;
* summarize earned Rewards.

All proposed changes require review.

---

## Session Summary Flow

```text
Session Ends

↓

Collect Timeline Entries and Notes

↓

Build Summary Context

↓

Generate Draft Summary

↓

Game Master Reviews and Edits

↓

Save Summary
```

The generated Summary is a draft.

The user may:

* edit;
* regenerate;
* shorten;
* change tone;
* save;
* discard.

---

## World Update Suggestion Flow

```text
Session Notes and Summary

↓

AI Identifies Possible Changes

↓

Display Individual Suggestions

↓

Accept, Edit or Ignore Each Change

↓

Apply Selected Updates
```

The AI must not apply updates automatically.

---

## World Update Categories

Possible AI-proposed updates:

```text
New NPC

New Location

Character Change

Pokémon Change

New World Fact

Updated World Fact

Quest or Story Thread Change

Adventure Status Change

Collection Correction
```

Every update must use a supported structured type.

Unsupported output should remain plain text until the user classifies it.

---

## AI Interaction Types

The system should distinguish between:

```text
Generation

Transformation

Analysis

Summarization

Classification
```

### Generation

Creates new creative possibilities.

Examples:

* NPC;
* Scene;
* Reward;
* Twist.

### Transformation

Changes existing content while preserving intent.

Examples:

* simplify language;
* make more mysterious;
* shorten;
* adapt for younger children.

### Analysis

Reviews existing content.

Examples:

* identify missing preparation;
* detect contradictions;
* find possible story consequences.

### Summarization

Condenses content.

Examples:

* Adventure summary;
* Session recap;
* NPC reminder.

### Classification

Maps content into known types.

Examples:

* identify a Note as a Pokémon catch;
* classify a proposed World Update;
* determine likely Reward type.

Classification must not create state changes automatically.

---

## Suggestion Lifecycle

Recommended lifecycle:

```text
Requested

↓

Generating

↓

Generated

↓

Reviewed

├── Accepted
├── Edited
├── Dismissed
└── Regenerated
```

A Suggestion is not canonical in `Generated` or `Reviewed` state.

Only accepted and saved content enters the relevant feature.

---

## Suggestion States

### Requested

The user initiated an AI action.

### Generating

The provider request is in progress.

### Generated

One or more Suggestions were returned and validated for display.

### Accepted

The user selected a Suggestion.

Acceptance may open an editor before saving.

### Edited

The user modified the selected Suggestion.

The edited content becomes user-authored input.

### Dismissed

The Suggestion was rejected.

Dismissed Suggestions should not affect future domain state.

### Regenerated

The user requested new Suggestions.

Previous Suggestions may remain visible temporarily but should not be treated as active results.

---

## Accept Versus Save

Acceptance and persistence are distinct when editing is supported.

Recommended flow:

```text
Accept Suggestion

↓

Open Editable Draft

↓

Save
```

For simple actions, acceptance and save may occur together if the user clearly understands the result.

The UI must not imply that a Suggestion is already saved when it is not.

---

## Regeneration

Regeneration may support:

```text
Try Again

More Like This

Make It Simpler

Make It Stranger

Make It Safer

Make It More Dramatic
```

Regeneration should use the original request plus explicit user direction.

It should not silently include rejected Suggestions unless necessary for avoiding repetition.

---

## Save for Later

Some design Suggestions may be stored in an idea pool.

`Save for Later` means:

* preserve the Suggestion as non-canonical inspiration;
* do not add it to the Adventure;
* do not treat it as a World Fact;
* allow later review.

This capability may be deferred from the MVP.

---

# Narrative Context

## Purpose

Narrative Context is the curated information supplied to the AI for one specific request.

It exists to provide enough context for relevance without exposing the complete Project.

---

## Context Principles

Narrative Context must be:

* purpose-specific;
* minimal;
* current;
* structured;
* explainable;
* privacy-aware;
* bounded in size.

The same context should not be reused blindly across different capabilities.

---

## Context Sources

Narrative Context may include:

* Audience;
* Project summary;
* Adventure Foundation;
* current Story;
* current Scene;
* current Goal;
* relevant Characters;
* relevant Pokémon;
* relevant NPCs;
* relevant Locations;
* relevant World Facts;
* selected previous Session Summaries;
* recent Timeline Entries;
* current user instruction.

---

## Context Selection

Context selection may be:

```text
Explicit

Automatic

Hybrid
```

### Explicit

The user chooses relevant entities.

Preferred for early versions and high-control workflows.

### Automatic

The Application layer selects context based on references and relevance.

Useful for fast Session actions.

### Hybrid

The system proposes context and the user may adjust it.

This is the preferred long-term model.

---

## Context Boundaries

The AI must not receive by default:

* the entire Project;
* unrelated Adventures;
* archived content;
* complete Collection history;
* rejected Suggestions;
* hidden technical metadata;
* authentication data;
* printer configuration;
* data from another Project;
* private user data unrelated to the task.

---

## Context Size Management

The Application layer should control context size through:

* summaries;
* relevance selection;
* recency;
* explicit references;
* structured projections;
* token budgeting;
* removal of duplicate information.

When context is too large, prefer summarization or selection.

Do not silently truncate critical current Scene information.

---

## Context Precedence

When information conflicts, preferred precedence is:

1. explicit current user instruction;
2. accepted current Session state;
3. accepted Adventure content;
4. accepted Project World Facts;
5. previous Session Summaries;
6. AI-generated summaries;
7. general fallback knowledge.

The AI should not overwrite higher-precedence facts.

---

## Canonical Versus Non-Canonical Context

Context should distinguish:

```text
Canonical Content

Temporary Session Content

AI Suggestions

User Request
```

AI Suggestions must never be presented to the provider as established fact unless the user explicitly requests refinement of that Suggestion.

---

## Narrative Context Example

```typescript
interface NarrativeContext {
  readonly audience: AudienceContext;
  readonly project: ProjectContextSummary;
  readonly adventure: AdventureContextSummary | null;
  readonly session: SessionContextSummary | null;
  readonly currentScene: SceneContextSummary | null;
  readonly characters: readonly CharacterContextSummary[];
  readonly npcs: readonly NpcContextSummary[];
  readonly locations: readonly LocationContextSummary[];
  readonly worldFacts: readonly WorldFactContextSummary[];
  readonly previousSummaries: readonly SessionSummaryContext[];
}
```

This is a conceptual contract.

It is not necessarily the provider payload.

---

# Prompt Architecture

## Prompt Ownership

Prompts belong to infrastructure.

The Domain must not contain provider-specific prompts.

The Application layer expresses intent through structured AI requests.

The Infrastructure layer converts these requests into provider-specific prompts.

---

## Structured Request

Example:

```typescript
interface AiGenerationRequest<TInput> {
  readonly capability: AiCapability;
  readonly input: TInput;
  readonly context: NarrativeContext;
  readonly audience: AudienceContext;
  readonly outputFormat: AiOutputFormat;
}
```

The request should describe what is needed without embedding provider-specific syntax.

---

## AI Capabilities

Suggested capability identifiers:

```text
GenerateAdventurePremises

GenerateStoryOutline

GenerateScenes

GenerateNpcSuggestions

GenerateLocationSuggestions

GenerateEncounterSuggestions

GenerateRewardSuggestions

GenerateTwists

GenerateEndings

AssistSessionDetour

AssistSessionStuck

GenerateQuickNpc

GenerateQuickEncounter

GenerateSessionSummary

SuggestWorldUpdates

TransformContent

SummarizeContent
```

Capability names should describe intent clearly.

Avoid generic capabilities such as:

```text
AskAI
```

for internal Application contracts.

---

## Provider Prompt

A provider prompt may contain:

* system behavior;
* Audience rules;
* domain terminology;
* relevant Narrative Context;
* requested output schema;
* output length limits;
* safety constraints;
* creative diversity instructions.

Provider prompts should be versioned when behavior materially changes.

---

## Prompt Versioning

Prompt versions should support:

* debugging;
* evaluation;
* rollback;
* comparing provider behavior;
* tracing generated Suggestions.

Example:

```text
generate-scenes:v1
```

Prompt version is infrastructure metadata.

It should not appear in normal UI.

---

# Output Contracts

## Structured Output

Whenever possible, AI responses should use structured output.

Example:

```typescript
interface AiSuggestionResponse<TSuggestion> {
  readonly suggestions: readonly TSuggestion[];
}
```

For three-option generation:

```typescript
interface CreativeSuggestion<TContent> {
  readonly label: string;
  readonly summary: string;
  readonly content: TContent;
}
```

Structured output reduces parsing ambiguity.

---

## Validation

Every response must be validated before use.

Validation should check:

* expected number of Suggestions;
* required fields;
* supported enum values;
* string limits;
* identifier references;
* malformed JSON;
* empty content;
* duplicate Suggestions;
* Audience constraints where deterministic checks are possible.

Invalid responses should not enter the domain.

---

## Partial Validity

If two of three Suggestions are valid:

* valid Suggestions may be displayed;
* the UI may state that fewer results were available;
* the system may optionally retry the missing result;
* valid content should not be discarded unnecessarily.

If no Suggestion is valid, treat the operation as failed.

---

## Plain Text Fallback

If structured output is unavailable:

* keep parsing isolated in Infrastructure;
* validate the parsed result;
* do not spread provider-specific text parsing into Presentation or Domain;
* allow the user to retry.

Structured provider capabilities are preferred.

---

# Provider Abstraction

## Purpose

The application should not depend directly on one AI provider.

The AI provider is replaceable infrastructure.

Suggested abstraction:

```typescript
interface AiAssistantGateway {
  generate<TInput, TOutput>(
    request: AiGenerationRequest<TInput>,
  ): Promise<AiGenerationResult<TOutput>>;
}
```

The actual interface may use feature-specific methods if stronger typing and clarity improve maintainability.

Avoid an untyped generic string-in/string-out service.

---

## Provider Responsibilities

The provider adapter may handle:

* authentication;
* model selection;
* prompt construction;
* structured output configuration;
* retries;
* timeout;
* provider error translation;
* usage metadata;
* safety response handling.

The provider adapter must not:

* update domain state;
* accept Suggestions;
* create ownership;
* approve World Updates;
* decide the user’s next action.

---

## Multiple Providers

Future versions may support multiple providers.

Provider selection may depend on:

* capability;
* availability;
* cost;
* latency;
* structured output support;
* language quality;
* privacy requirements.

The user should not need to understand provider complexity during normal use.

---

# Model Selection

Model selection is an infrastructure concern.

Different capabilities may require different priorities.

### Running Session

Prioritize:

* low latency;
* sufficient reasoning;
* concise output;
* reliability.

### Adventure Design

Prioritize:

* creativity;
* coherence;
* structured alternatives;
* quality.

### Session Summary

Prioritize:

* accuracy;
* faithful use of Notes;
* structured extraction;
* low hallucination.

The system should avoid using the most expensive model for every action without justification.

---

# Language Behavior

The AI should respond in the Project or user-selected language.

It should preserve:

* names;
* established terminology;
* accented characters;
* Project-specific phrasing.

The AI must not switch languages unexpectedly.

Provider prompts may use an internal language, but user-facing output must follow the selected language.

---

# Audience Safety

## Audience Presets

Audience presets may include:

```text
Young Children

Children

Preteens

Teenagers
```

Each preset should define content boundaries.

Possible dimensions:

* vocabulary;
* violence;
* fear;
* injury;
* death;
* moral complexity;
* betrayal;
* humor;
* puzzle complexity;
* Session intensity.

---

## Young Children

Output should:

* use simple language;
* avoid graphic harm;
* avoid permanent frightening consequences;
* provide reassuring paths;
* prefer clear motivations;
* keep danger mild;
* support playful problem solving.

---

## Children

Output may include:

* mild suspense;
* simple conflicts;
* non-graphic danger;
* emotionally meaningful choices;
* age-appropriate mystery.

---

## Preteens

Output may include:

* stronger suspense;
* more complex motivations;
* moderate consequences;
* deeper mysteries;
* more challenging choices.

---

## Teenagers

Output may include:

* more serious conflict;
* complex relationships;
* stronger emotional themes;
* greater ambiguity.

Content must still remain within the Project’s intended style and safety rules.

---

## Custom Audience Rules

A future Custom Audience may define:

* allowed themes;
* avoided themes;
* intensity;
* language level;
* specific child sensitivities.

These settings should be applied consistently.

Sensitive personal details should be minimized in provider requests.

---

# Hallucination Management

The AI may generate incorrect or contradictory information.

The system must assume this can happen.

Mitigations include:

* limited context;
* structured references;
* explicit fact lists;
* validation;
* contradiction detection;
* user review;
* clear Suggestion status.

The AI must not present invented Project facts as established truth.

---

## Referenced Entity Validation

If an AI result references:

* a Character;
* an NPC;
* a Location;
* a Reward;
* a World Fact;

the Application layer should validate the reference.

Unknown references may be:

* treated as newly proposed entities;
* flagged for review;
* rejected when the capability requires existing references.

Do not silently map an unknown name to an existing entity.

---

## Contradiction Handling

If a Suggestion conflicts with canonical content:

* mark the conflict;
* show relevant facts;
* allow the user to edit;
* optionally regenerate with stronger constraints.

Example:

```text
This Suggestion conflicts with a World Fact:

“The Old Bridge was destroyed.”
```

The user may still intentionally change the world through a proper update flow.

---

# AI Memory

## No Hidden Canonical Memory

The AI provider’s conversational memory must not become the Project source of truth.

The application should construct each request from stored Project state.

This ensures:

* reproducibility;
* provider replacement;
* privacy control;
* clear canonical state;
* predictable context.

---

## Session Conversation State

A temporary AI interaction thread may be retained during one Session for convenience.

It must not silently introduce facts outside accepted Session state.

Important outcomes should be explicitly saved as:

* Scene;
* Note;
* NPC;
* Encounter;
* Reward;
* Timeline Entry.

---

## Rejected Suggestions

Rejected Suggestions should not normally influence later AI requests.

Possible exceptions:

* user requests “something different”;
* system uses rejection metadata only to reduce repetition;
* user explicitly asks to compare with a rejected idea.

Rejected content must not become canonical.

---

# Persistence

## What May Be Stored

The application may store:

* AI request capability;
* sanitized input;
* Narrative Context references or snapshot;
* generated Suggestions;
* prompt version;
* model metadata;
* user action;
* accepted result;
* error category;
* usage metrics.

Storage should follow privacy and cost requirements.

---

## What Should Not Be Stored by Default

Avoid storing:

* provider secrets;
* unnecessary full prompts containing personal data;
* complete unrelated Project context;
* raw provider debugging data indefinitely;
* hidden reasoning;
* sensitive child-related information beyond product need.

---

## Accepted Content

Once the user edits and saves an AI Suggestion, the saved content becomes normal user-approved domain content.

Its origin may be retained internally for analytics or traceability.

The UI should not permanently label all AI-assisted content unless useful.

---

# Cost Management

AI requests have cost.

The system should control cost without degrading the core experience.

Possible strategies:

* limited context;
* capability-specific models;
* concise output;
* caching safe repeated transformations;
* request debouncing;
* duplicate submission protection;
* user-visible retry rather than uncontrolled automatic retries;
* usage limits where necessary.

Cost controls must not produce unpredictable data loss.

---

## Duplicate Request Protection

Repeated taps must not create multiple identical AI requests.

While generating:

* disable or change the primary action;
* show progress;
* prevent accidental resubmission;
* allow intentional retry after completion or failure.

---

## Caching

Caching may be appropriate for:

* deterministic transformations;
* repeated summaries of unchanged content;
* reusable provider-independent metadata.

Creative Suggestions should not appear stale or unintentionally repeated.

Cache keys must include relevant context and prompt version.

---

# Latency

## Target Behavior

The UI should communicate immediately that a request started.

The application should remain interactive.

Recommended perceived behavior:

* under one second: immediate;
* one to several seconds: show Suggestion placeholders;
* longer response: allow user to continue elsewhere;
* timeout: preserve input and offer retry.

Do not promise exact completion times.

---

## Timeout

Provider requests should have capability-specific timeouts.

A Running Session action should time out sooner than a long design generation action.

Timeout must produce a recoverable Application error.

---

# Retry Strategy

Automatic retry may be used only for safe transient failures.

Recommended:

* limited retry count;
* exponential backoff;
* no uncontrolled repeated billing;
* no automatic retry after explicit provider safety rejection;
* preserve user input.

The UI should allow manual retry.

---

# Cancellation

Where supported, the user may cancel generation.

Cancellation should:

* stop displaying loading;
* preserve existing content;
* not save partial invalid output;
* allow a new request.

If the provider cannot truly cancel, the application may ignore the late result.

---

# Error Categories

The Application layer should translate provider failures into meaningful categories.

Suggested categories:

```text
Unavailable

Timeout

RateLimited

InvalidResponse

SafetyRejected

ContextTooLarge

Unauthorized

Unknown
```

Provider-specific codes must not leak into the domain.

---

## Unavailable

```text
AI assistance is unavailable right now.

You can continue manually.
```

---

## Timeout

```text
The AI took too long to respond.

Try again or continue without it.
```

---

## Rate Limited

```text
AI assistance is temporarily busy.

Try again shortly or continue manually.
```

Avoid exposing provider quota details unless useful to the account owner.

---

## Invalid Response

```text
The generated result could not be used.

Try again.
```

Existing content must remain unchanged.

---

## Safety Rejected

```text
The request could not be completed with the current content settings.
```

The UI may allow the user to adjust the request.

Do not encourage bypassing Audience or safety constraints.

---

## Context Too Large

```text
There is too much information for this request.

Choose fewer Characters, Locations or previous Sessions.
```

The system should preferably prevent this before sending.

---

## Unauthorized

This usually indicates configuration or account issues.

User-facing wording:

```text
AI assistance is not available for this account.
```

Administrative details belong in logs or settings.

---

# Privacy

AI requests may contain campaign information and child-related names.

The system should:

* minimize personal data;
* send only relevant context;
* use Character display names rather than unnecessary real-world identities;
* avoid precise personal information;
* explain when external AI services process data;
* support data retention requirements;
* protect provider credentials;
* avoid public logging of prompts and responses.

---

## Personal Data Minimization

Prefer:

```text
Character: Emma
Age preset: Children
```

over unnecessary details such as:

* full legal name;
* birth date;
* school;
* home address;
* personal medical information.

Audience configuration should not require storing sensitive details.

---

# Observability

AI operations should be observable for debugging and quality improvement.

Possible metadata:

* capability;
* prompt version;
* provider;
* model;
* latency;
* success or failure category;
* Suggestion count;
* accepted or dismissed outcome;
* token or cost estimate;
* context size.

Do not log sensitive full content by default.

---

# Evaluation

AI quality should be evaluated intentionally.

Possible criteria:

* relevance;
* diversity;
* Audience suitability;
* consistency with context;
* usefulness;
* brevity during play;
* acceptance rate;
* regeneration rate;
* contradiction rate;
* response time.

Automated evaluation may supplement but not replace user feedback.

---

## Capability Test Cases

Each AI capability should have representative test fixtures.

Examples:

* young-child Adventure Premise;
* conflicting World Fact;
* Session detour;
* missing context;
* multiple Characters;
* non-combat Encounter;
* Summary from incomplete Notes;
* malformed provider response.

Prompt changes should be tested against these fixtures.

---

# Business Rules

* AI output is always a Suggestion until accepted.
* AI cannot modify domain state directly.
* Every permanent AI-assisted change requires explicit user action.
* The complete Project is not sent to the AI by default.
* Narrative Context must belong to one Project.
* Context must be purpose-specific.
* AI Suggestions must respect Audience settings.
* AI Suggestions must be validated before display or use.
* Invalid provider output must not enter the domain.
* Rejected Suggestions are not canonical.
* AI failure must not block manual workflows.
* Running Session AI must not block Session interaction.
* AI cannot unlock Rewards.
* AI cannot create Collection ownership.
* AI cannot approve World Updates.
* AI cannot mark physical Rewards as Printed or Given.
* AI cannot start, advance or end Sessions automatically.
* Accepted and saved AI content becomes normal user-approved content.
* Provider-specific behavior must remain in Infrastructure.
* Prompt text must not be embedded in domain entities.
* AI requests from one Project must not include another Project’s data.
* User language and Project terminology should be preserved.
* The system must not falsely claim certainty about generated content.

---

# Domain Model Interaction

Related concepts:

* AI Suggestion;
* Narrative Context;
* Audience;
* Project;
* Adventure;
* Scene;
* NPC;
* Location;
* Encounter;
* Reward;
* Session;
* Timeline Entry;
* Session Summary;
* World Update.

The AI Assistant does not own these domain objects.

It produces typed proposals consumed by Application use cases.

---

# Suggested Application Contracts

```typescript
interface AiAssistant {
  generateAdventurePremises(
    request: GenerateAdventurePremisesRequest,
  ): Promise<AiResult<AdventurePremiseSuggestion>>;

  generateSceneSuggestions(
    request: GenerateSceneSuggestionsRequest,
  ): Promise<AiResult<SceneSuggestion>>;

  assistRunningSession(
    request: RunningSessionAssistRequest,
  ): Promise<AiResult<SessionAssistSuggestion>>;

  generateSessionSummary(
    request: GenerateSessionSummaryRequest,
  ): Promise<AiSingleResult<SessionSummaryDraft>>;

  suggestWorldUpdates(
    request: SuggestWorldUpdatesRequest,
  ): Promise<AiResult<WorldUpdateSuggestion>>;
}
```

Feature-specific contracts may provide stronger typing than one generic AI method.

---

## AI Result

```typescript
interface AiResult<TSuggestion> {
  readonly requestId: string;
  readonly suggestions: readonly TSuggestion[];
  readonly metadata: AiResultMetadata;
}
```

```typescript
interface AiResultMetadata {
  readonly capability: AiCapability;
  readonly promptVersion: string;
  readonly provider: string;
  readonly model: string;
  readonly generatedAt: string;
}
```

Metadata should not force provider details into the Domain.

It may remain Application or Infrastructure data.

---

## Suggestion Base

```typescript
interface AiSuggestion<TContent> {
  readonly id: string;
  readonly label: string;
  readonly summary: string;
  readonly content: TContent;
}
```

Suggestion identifiers are temporary unless persistence is explicitly required.

---

# Suggested Application Use Cases

```text
GenerateAdventurePremises

GenerateStorySuggestions

GenerateSceneSuggestions

GenerateNpcSuggestions

GenerateLocationSuggestions

GenerateEncounterSuggestions

GenerateRewardSuggestions

GenerateTwistSuggestions

GenerateEndingSuggestions

TransformAdventureContent

BuildNarrativeContext

AssistRunningSession

SaveSessionSuggestionAsScene

SaveSessionSuggestionAsNpc

SaveSessionSuggestionAsEncounter

GenerateSessionSummary

SuggestWorldUpdates

AcceptAiSuggestion

DismissAiSuggestion

RegenerateAiSuggestions
```

Acceptance should usually delegate to the relevant feature use case.

Example:

```text
Accept Scene Suggestion
    ↓
Add Scene
```

The AI feature should not create a parallel persistence path for every domain object.

---

# Suggested Angular Structure

```text
features/
  ai-assistant/
    components/
      ai-action-menu/
      ai-input-sheet/
      ai-suggestion-list/
      ai-suggestion-card/
      ai-generation-state/
      ai-error-state/
      ai-context-summary/
    application/
      build-narrative-context/
      generate-suggestions/
      transform-content/
      assist-running-session/
      generate-session-summary/
      suggest-world-updates/
    domain/
      ai-capability/
      ai-suggestion/
      narrative-context/
      audience-context/
    infrastructure/
      ai-assistant-gateway/
      provider-adapters/
      prompt-builders/
      response-parsers/
      ai-configuration/
```

Feature-specific UI may remain inside Adventure Designer, Running Session or Session Summary.

Shared AI interaction components belong in the AI Assistant feature only when they are genuinely reusable.

---

# State Management

Angular Signals should manage UI state.

Suggested state:

```typescript
readonly requestState = signal<AiRequestState>('idle');
readonly suggestions = signal<readonly AiSuggestion<unknown>[]>([]);
readonly selectedSuggestionId = signal<string | null>(null);
readonly error = signal<AiError | null>(null);
```

```typescript
type AiRequestState =
  | 'idle'
  | 'generating'
  | 'success'
  | 'error';
```

Derived state:

```typescript
readonly hasSuggestions = computed(
  () => this.suggestions().length > 0,
);
```

```typescript
readonly selectedSuggestion = computed(() =>
  this.suggestions().find(
    suggestion => suggestion.id === this.selectedSuggestionId(),
  ) ?? null,
);
```

Templates must not build prompts or validate provider responses.

---

# Loading States

AI loading should match the current context.

### Adventure Designer

Display three Suggestion Card skeletons.

### Running Session

Display a compact progress state while keeping Scene content visible.

### Session Summary

Display a narrative skeleton or progress panel.

Avoid generic full-screen spinners.

---

# Empty States

### No Suggestion Requested

Show contextual actions.

Example:

```text
Need inspiration?

Generate three Scene ideas or create your own.
```

### No Valid Suggestions Returned

```text
No usable Suggestions were generated.

Try again or continue manually.
```

---

# Offline Behavior

When offline:

* AI actions are unavailable;
* existing accepted content remains available;
* saved Suggestions may remain viewable;
* manual workflows remain functional;
* AI entry points should explain the limitation.

Example:

```text
AI assistance is unavailable offline.

You can continue manually.
```

The application should not repeatedly attempt requests while offline.

---

# Accessibility

* AI-generated content must be clearly labeled as a Suggestion.
* Loading states must have accessible descriptions.
* Suggestion Cards must support keyboard navigation.
* Actions must use explicit labels such as `Use This` rather than icon-only controls.
* Regeneration must not unexpectedly move focus.
* Error messages must be announced appropriately.
* AI context summaries must be readable by screen readers.
* Differences between Suggestions must not rely only on color.
* Reduced-motion preferences must be respected.
* Live Session AI results must not produce excessive announcements.

---

# Responsive Behavior

## Phone

* AI actions open in a bottom sheet or focused screen;
* Suggestions appear as stacked Cards;
* actions remain reachable with one hand;
* Running Session results remain concise;
* long AI configuration is avoided.

## Tablet

* AI Suggestions may appear in a side panel;
* Designer content remains visible;
* Suggestions and editing may be displayed together.

## Desktop

* persistent AI panel may be supported;
* context preview may be visible;
* multiple Suggestions may appear side by side;
* the experience must not become a generic chatbot workspace.

---

# Acceptance Criteria

The feature is complete when:

* the user can request AI assistance from supported features;
* the AI request uses purpose-specific Narrative Context;
* the complete Project is not sent by default;
* design generation returns multiple meaningfully different Suggestions;
* Running Session assistance returns concise actionable options;
* AI Suggestions are clearly marked as non-canonical;
* Suggestions require explicit acceptance;
* the user can edit accepted Suggestions;
* rejected Suggestions do not change domain state;
* AI results are validated before use;
* malformed responses are handled safely;
* AI respects the selected Audience;
* AI failure leaves manual workflows available;
* the interface remains usable during generation;
* duplicate taps do not create accidental duplicate requests;
* Session Summary generation creates an editable draft;
* World Updates are proposed individually;
* World Updates require explicit approval;
* AI cannot grant Rewards or modify Collection ownership;
* AI cannot start, advance or end Sessions;
* offline state is handled clearly;
* provider errors are translated into meaningful Application errors;
* prompts and provider-specific logic remain in Infrastructure;
* the feature works on phone, tablet and desktop;
* templates do not construct prompts or parse provider output.

---

# Out of Scope

Not part of the initial implementation:

* autonomous AI Game Master;
* continuous voice listening;
* automatic speech transcription;
* automatic domain updates;
* unrestricted general chatbot;
* AI-controlled Session progression;
* hidden long-term provider memory;
* AI-generated complete campaign without review;
* automatic Reward granting;
* automatic Achievement detection;
* automatic rules adjudication;
* AI-to-printer actions;
* fine-tuning custom models;
* user-created prompt editor;
* public prompt marketplace;
* real-time multiplayer AI conversations;
* child-facing AI chat;
* AI image generation inside every workflow;
* automatic provider switching based only on output style.

---

# Future Enhancements

Possible future additions:

* voice-based Session assistance;
* optional transcription;
* AI consistency review;
* contradiction detection;
* automatic context recommendations;
* richer hybrid context selection;
* model routing;
* local AI support;
* reusable creative styles;
* campaign-specific tone profiles;
* AI-assisted rules reference;
* Adventure quality review;
* suggested unresolved story threads;
* player choice prediction;
* provider comparison;
* cost and usage controls;
* configurable privacy modes;
* evaluation dashboards for prompt quality.

These enhancements must preserve human authorship and explicit approval.

---

# Final Principle

The AI Assistant should make the Game Master feel more creative, not less necessary.

The AI offers possibilities.

The Game Master creates the story.
