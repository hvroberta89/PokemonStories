# Printing

## Purpose

The Printing feature transforms digital campaign content into high-quality physical rewards that children can collect, own and treasure.

Printing is not only about producing paper.

It creates tangible memories of the Adventure.

The system supports:

* collectible Pokémon Cards;
* Badges;
* Certificates;
* Story Pages;
* Adventure Journals;
* Stickers;
* custom printable Rewards.

Printing is tightly connected to the Reward System but remains an independent feature.

---

# Responsibilities

Printing allows the Game Master to:

* prepare printable assets;
* queue physical Rewards;
* print individual Rewards;
* print batches;
* reprint damaged items;
* mark Rewards as printed;
* mark Rewards as given;
* review print history;
* recover failed print jobs.

Printing is **not** responsible for:

* granting Rewards;
* unlocking Collection ownership;
* determining Reward eligibility;
* changing campaign progression;
* modifying Adventures;
* editing Reward content.

---

# Experience Goal

Printing should feel effortless.

The Game Master should be able to finish a Session and immediately prepare physical rewards with only a few taps.

The workflow should feel closer to printing photos than managing documents.

---

# Core Principles

## Digital Ownership Comes First

A Reward becomes owned when it is granted.

Printing is optional.

A printed item represents an existing owned Reward.

Printing must never determine ownership.

---

## Printing Never Blocks Gameplay

A printer problem must never prevent:

* finishing a Session;
* granting Rewards;
* updating Collections;
* continuing the campaign.

Everything remains printable later.

---

## Printing Is Recoverable

Every failed print can be retried.

Nothing is permanently lost.

---

## Physical State Is Independent

Every printable Reward has its own physical lifecycle.

Example:

```text
Unlocked
↓

Queued

↓

Printed

↓

Given
```

Collection ownership is unchanged throughout the process.

---

# Printable Content

The MVP supports:

* Pokémon Cards
* Badges
* Certificates

Future versions may include:

* Story Books
* Adventure Journals
* Posters
* Maps
* NPC Cards
* Achievement Boards
* Stickers

---

# Print Queue

## Purpose

The Print Queue contains every owned Reward waiting for physical production.

Recommended route:

```text
/projects/:projectId/print-queue
```

---

## Queue Card

Each item shows:

* artwork
* reward name
* owner
* reward type
* print status
* creation date

Example:

```text
Pikachu

Emma

Pokémon Card

Waiting to Print
```

---

## Queue Actions

Available actions:

* Print
* Print Multiple Copies
* Remove From Queue
* Mark Printed
* View Reward

---

# Printing Flow

```text
Reward Granted

↓

Added To Queue

↓

Print

↓

Printed

↓

Given
```

If printing fails:

```text
Print Failed

↓

Retry Later
```

---

# Print States

Recommended lifecycle:

```text
Queued

Printing

Printed

Given

Failed
```

---

## Queued

Waiting for printing.

---

## Printing

Temporary state while generating or sending printable content.

---

## Printed

The physical item exists.

---

## Given

The child received the Reward.

---

## Failed

Printing could not be completed.

Retry is always available.

---

# Batch Printing

Multiple queued Rewards may be printed together.

Example:

```text
Emma

- Pikachu
- Forest Badge

Marci

- Bulbasaur
```

Actions:

* Print All
* Print Selected

---

# Print Preview

Before printing the user may preview:

* card layout
* margins
* crop marks
* artwork
* text

Preview must never modify Reward data.

---

# Reprinting

Reprinting is always allowed.

Possible reasons:

* damaged card
* lost badge
* improved printer settings
* additional copy

Reprinting does not create another owned Reward.

It only creates another physical copy.

---

# Print Templates

Each Reward type uses a dedicated template.

Examples:

```text
Pokemon Card

Badge

Certificate
```

Templates are infrastructure resources.

The domain only knows that a Reward is printable.

---

# Printer Independence

The feature should support multiple output methods.

Examples:

* PDF export
* Browser printing
* Local printer
* Future label printers

The domain must not know which printing technology is used.

---

# PDF Export

Every printable Reward should be exportable as PDF.

Possible uses:

* home printing
* professional printing
* backup
* sharing between devices

Generating a PDF does not change print state.

---

# Browser Printing

The simplest implementation may use the browser print dialog.

Advantages:

* works everywhere
* no printer integration
* minimal implementation

Future printer integrations remain possible.

---

# Print Confirmation

Printing should not automatically mark a Reward as Printed.

Recommended flow:

```text
Print

↓

User Confirms

↓

Mark Printed
```

This avoids incorrect state if the printer fails.

---

# Mark Printed

Manual action.

Changes physical state only.

Does not affect ownership.

---

# Mark Given

Manual action after handing the item to the child.

Changes:

```text
Printed

↓

Given
```

Nothing else changes.

---

# Failed Printing

If printing fails:

```text
Queued

↓

Failed

↓

Retry
```

The Reward remains owned.

---

# Missing Printer

If no printer is available:

Offer:

* Save PDF
* Try Again Later

Never block completion.

---

# Print History

Optional history:

* printed date
* copies
* printer used (future)
* reprints

Useful mainly for troubleshooting.

---

# Card Layout

Pokémon Cards should maintain a consistent layout.

Contains:

* artwork
* Pokémon name
* rarity
* description
* reward information

Artwork should scale correctly across supported page sizes.

---

# Badge Layout

Badges emphasize:

* icon
* badge name
* optional Adventure

Minimal text.

---

# Certificate Layout

Certificates contain:

* child name
* achievement
* Adventure
* optional signature
* optional date

---

# Accessibility

Printing UI should support:

* keyboard navigation
* high contrast
* descriptive labels
* large touch targets

Preview images require appropriate alternative text where meaningful.

---

# Offline Behaviour

If offline:

* queued Rewards remain visible
* PDFs may still be generated if supported
* browser printing may still work

Cloud services should not be mandatory.

---

# Error Handling

Possible failures:

* PDF generation failed
* printer unavailable
* browser print cancelled
* template missing

Every error should provide:

* explanation
* retry
* alternative action

---

# Business Rules

* Printing never grants ownership.
* Printing never removes ownership.
* Every printable Reward belongs to exactly one Project.
* Rewards may be printed multiple times.
* Reprinting does not duplicate Collection ownership.
* Printing failures never remove queued items.
* Printing never blocks Session completion.
* Mark Printed is manual.
* Mark Given is manual.
* Print Queue contains only owned printable Rewards.
* Deleting a queued print does not delete the Reward.
* Templates belong to Infrastructure.
* Domain objects never contain printer-specific logic.

---

# Domain Model Interaction

Related concepts:

* Reward
* Reward Grant
* Reward Fulfillment
* Collection
* Session
* Adventure
* Character

Printing consumes existing domain information.

It never creates campaign progression.

---

# Suggested Application Use Cases

```text
QueueRewardForPrinting

ListPrintQueue

PrintReward

PrintRewards

GenerateRewardPdf

MarkRewardPrinted

MarkRewardGiven

RetryFailedPrint

RemoveFromPrintQueue

LoadPrintHistory
```

---

# Suggested Angular Structure

```text
features/
  printing/
    pages/
      print-queue-page/
    components/
      print-card/
      print-preview/
      batch-print-toolbar/
      print-status-chip/
    application/
      print-reward/
      batch-print/
      mark-printed/
      mark-given/
    domain/
      printable-reward/
      print-job/
    infrastructure/
      pdf-generator/
      print-service/
      print-template-provider/
```

---

# Acceptance Criteria

The feature is complete when:

* printable Rewards enter the Print Queue;
* the Queue can be browsed;
* individual Rewards can be printed;
* batch printing works;
* print preview is available;
* PDF export is supported;
* Rewards can be marked Printed;
* Rewards can be marked Given;
* printing failures are recoverable;
* printing never changes Collection ownership;
* printing never blocks gameplay;
* the feature works on phone, tablet and desktop.

---

# Out of Scope

Not part of the MVP:

* direct thermal printer support;
* cloud printing;
* print scheduling;
* inventory management;
* print analytics;
* automatic printer discovery;
* custom template editor;
* print cost estimation.

---

# Future Enhancements

Possible future additions:

* Avery label sheets;
* sticker printing;
* foil Pokémon Cards;
* QR codes;
* NFC-enabled physical cards;
* custom certificate designer;
* campaign books;
* booklet printing;
* collectible binders;
* professional print shop export.

---

# Final Principle

Printing exists to bring the adventure into the real world.

The digital story creates the memory.

The printed reward lets the child hold it in their hands.
    