# Design System

## Purpose

This document defines the visual language and component system of Pokémon Stories.

The Design System ensures that every screen, component and interaction feels like part of the same product.

It provides a shared foundation for designers, developers and AI-assisted code generation.

The goal is consistency rather than decoration.

---

# Design Vision

Pokémon Stories is not an administration tool.

It is a storytelling companion.

The interface should feel:

- magical
- playful
- premium
- warm
- calm
- trustworthy

The design should support imagination without becoming distracting.

---

# Design Principles

## Story Before Interface

The interface exists to support the story.

Users should notice the adventure before they notice the application.

---

## Calm by Default

Most screens should feel relaxed.

Avoid visual noise.

Avoid unnecessary colors.

Avoid competing focal points.

---

## Delight Through Details

Small moments matter.

Examples:

- reward animations
- badge unlocks
- Pokémon discovery
- subtle motion
- beautiful illustrations

Delight should emerge naturally from gameplay.

---

## Consistency Creates Confidence

Components should always behave predictably.

Identical actions should produce identical interactions.

Consistency reduces cognitive load.

---

# Visual Language

The application combines modern mobile design with light fantasy-inspired details.

The visual identity should communicate:

- exploration
- adventure
- discovery
- friendship
- wonder

Avoid:

- dark sci-fi
- futuristic cyberpunk
- corporate dashboards
- overly realistic textures

---

# Color System

## Primary

Used for primary actions.

Examples:

- Continue
- Start Session
- Generate
- Save

---

## Secondary

Used for supporting actions.

Examples:

- Cancel
- Back
- Preview

---

## Success

Used for:

- Rewards
- Completed Adventures
- Successful printing
- Positive confirmations

---

## Warning

Used for:

- Missing preparation
- Incomplete Adventures
- Optional recommendations

---

## Error

Used only for genuine problems.

Examples:

- Failed printing
- AI unavailable
- Save failed

Never use red for ordinary notifications.

---

## Neutral

The majority of the interface should use neutral colors.

Content should stand out more than chrome.

---

# Typography

Typography should prioritize readability.

Hierarchy should be obvious.

Recommended levels:

```text
Display

Heading

Title

Body

Caption

Label
```

Text should remain readable on small phones.

Avoid decorative fonts in body text.

Fantasy styling belongs to illustrations rather than typography.

---

# Spacing

Use a consistent spacing scale.

Example:

```text
4

8

12

16

24

32

48

64
```

Spacing should communicate hierarchy.

Avoid arbitrary values.

---

# Corner Radius

The application favors rounded components.

Rounded corners should feel friendly rather than playful.

Examples:

- Cards
- Buttons
- Chips
- Dialogs

Radius should remain consistent throughout the application.

---

# Elevation

Use elevation sparingly.

Cards should separate content without appearing to float excessively.

Avoid excessive shadows.

Prefer subtle depth.

---

# Icons

Icons should belong to a single visual family.

Characteristics:

- rounded
- simple
- consistent stroke width
- easily recognizable

Examples:

- Poké Ball
- Footprints
- Backpack
- Reward
- Badge
- AI Crystal
- Location
- Character
- Note
- Collection

Avoid mixing different icon styles.

---

# Illustrations

Illustrations are a core part of the product identity.

They should feel:

- colorful
- warm
- hand-crafted
- adventurous

Illustrations support emotion.

They do not replace content.

---

# Component Library

---

## Story Card

Purpose:

Represent the current narrative.

Contains:

- illustration
- location
- story description
- atmosphere

This is the visual centerpiece of Running Session.

---

## Goal Card

Purpose:

Display the current objective.

Only one primary Goal should be visible.

Goals should be concise.

---

## Character Chip

Displays:

- avatar
- name
- optional status

Examples:

- Happy
- Injured
- Busy
- Speaking

Character Chips should remain compact.

---

## Reward Card

Represents an unlocked reward.

Contains:

- illustration
- reward type
- owner
- available actions

Examples:

- Print
- Queue
- Skip

Reward Cards should feel celebratory.

---

## AI Suggestion Card

Displays one AI-generated suggestion.

Possible actions:

- Accept
- Edit
- Regenerate
- Dismiss

Suggestions should never feel mandatory.

---

## Timeline Entry

Represents one event from the Session.

Contains:

- timestamp
- icon
- short description

Timeline entries should be easy to scan.

---

## Status Pill

Used for concise state information.

Examples:

- Ready
- Running
- Completed
- Printing
- Offline

Status Pills should be color-coded.

---

## Badge

Represents achievements.

Badges should feel collectible.

Avoid plain labels.

---

## Progress Card

Shows overall progress.

Examples:

- Adventure readiness
- Collection completion
- Session preparation

Progress should encourage action rather than report statistics.

---

## Bottom Navigation

Contains exactly five primary destinations.

Navigation should always remain stable.

Avoid dynamic reordering.

---

## Floating Action Button

The primary action during Running Session.

Always visible.

Provides quick access to:

- Notes
- Rewards
- AI
- NPC
- Events

The FAB is the center of gameplay interaction.

---

## Quick Action Sheet

Opens from the Floating Action Button.

Should require minimal scrolling.

Frequently used actions appear first.

---

# Empty States

Empty states should inspire users.

Examples:

Instead of:

"No Adventures."

Use:

"Your next adventure begins here."

Whenever appropriate, provide a clear next action.

---

# Loading States

Loading should communicate progress without blocking the user.

Prefer:

- skeleton screens
- placeholder cards
- progressive loading

Avoid large blocking spinners whenever possible.

---

# Error States

Errors should explain:

- what happened
- why it happened (if known)
- what the user can do next

Avoid technical jargon.

---

# Motion

Motion should reinforce meaning.

Examples:

- reward unlock
- card expansion
- page transition
- successful save

Motion should never delay interaction.

Animations should generally remain under 300 milliseconds.

---

# Responsive Behavior

The same design language applies across devices.

## Phone

Single-column layout.

Large touch targets.

Bottom navigation.

---

## Tablet

Two-column layout where appropriate.

Navigation rail.

Additional context panels.

---

## Desktop

Three-panel layouts become possible.

Focus remains on storytelling rather than data density.

---

# Accessibility

Every component should support:

- keyboard navigation
- screen readers
- sufficient contrast
- large touch targets
- reduced motion preferences

Accessibility is a design requirement.

---

# Design Tokens

Every visual value should originate from design tokens.

Examples:

```text
Color.Primary

Color.Surface

Spacing.Medium

Radius.Large

Elevation.Card

Motion.Fast

Typography.Title
```

Hardcoded values should be avoided whenever practical.

---

# Future Evolution

The Design System should support future additions without breaking consistency.

Examples:

- multiplayer
- plugins
- community content
- additional campaign settings

New components should extend the existing system rather than introducing new visual paradigms.

---

# Final Principle

Every component should answer one question:

"Does this help the Game Master tell a better story?"

If the answer is no, the component does not belong in Pokémon Stories.