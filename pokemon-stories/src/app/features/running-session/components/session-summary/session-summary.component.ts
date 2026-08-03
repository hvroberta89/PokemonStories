import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';

import { PsIconComponent } from '../../../../shared/ui/public-api';

import type { SessionSummaryViewModel } from './session-summary.model';

export type AdventureReviewDecision = 'keep-ready' | 'complete-adventure';

export type WorldFactApprovalStatus = 'idle' | 'saving' | 'saved' | 'error';

@Component({
  selector: 'app-session-summary',
  standalone: true,
  imports: [PsIconComponent],
  templateUrl: './session-summary.component.html',
  styleUrl: './session-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionSummaryComponent {
  readonly summary = input.required<SessionSummaryViewModel>();

  readonly reviewCompleted = output<AdventureReviewDecision>();

  readonly timelineSelected = output<void>();

  readonly rewardsSelected = output<void>();

  readonly closeSelected = output<void>();

  readonly storySaved = output<string | undefined>();

  readonly worldFactApproved = output<string>();

  readonly worldFactApprovalStatus = input<WorldFactApprovalStatus>('idle');

  protected readonly storyCopied = signal(false);

  protected readonly copyError = signal<string | null>(null);

  protected readonly storySaveMessage = signal<string | null>(null);

  protected readonly isEditingStory = signal(false);

  protected readonly worldFactDraft = signal('');

  private readonly storyDraft = signal<string | null>(null);

  private readonly generatedStoryText = computed(() => {
    const summary = this.summary();
    const eventLines = summary.events.map((event) => `${event.title}: ${event.content}`);
    const rewardLines = [...summary.queuedRewards, ...summary.givenRewards].map(
      (reward) => `${reward.recipientName} megkapta: ${reward.amount} db ${reward.rewardLabel}`,
    );
    const sections = [
      `${summary.adventureTitle} - ${summary.locationName}`,
      eventLines.length > 0
        ? eventLines.join(' ')
        : 'Ebben a sessionben nem került külön esemény rögzítésre.',
      rewardLines.length > 0 ? `Jutalmak: ${rewardLines.join('; ')}.` : '',
    ];

    return sections.filter(Boolean).join('\n\n');
  });

  protected readonly storyText = computed(
    () => this.storyDraft() ?? this.summary().story ?? this.generatedStoryText(),
  );

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.close();
  }

  protected openTimeline(): void {
    this.timelineSelected.emit();
  }

  protected openRewards(): void {
    this.rewardsSelected.emit();
  }

  protected completeReview(decision: AdventureReviewDecision): void {
    this.reviewCompleted.emit(decision);
  }

  protected async copyStory(): Promise<void> {
    this.storyCopied.set(false);
    this.copyError.set(null);
    try {
      await navigator.clipboard.writeText(this.storyText());
      this.storyCopied.set(true);
    } catch {
      this.copyError.set('Az összefoglaló másolása nem sikerült.');
    }
  }

  protected startEditingStory(): void {
    this.storyDraft.set(this.storyText());
    this.isEditingStory.set(true);
    this.storySaveMessage.set(null);
  }

  protected updateStory(event: Event): void {
    this.storyDraft.set((event.target as HTMLTextAreaElement).value);
  }

  protected finishEditingStory(): void {
    this.isEditingStory.set(false);
    this.storySaved.emit(this.storyDraft()?.trim() || undefined);
    this.storySaveMessage.set('A Session Story elmentve.');
  }

  protected resetStory(): void {
    this.storyDraft.set(null);
    this.isEditingStory.set(false);
    this.storyCopied.set(false);
    this.storySaved.emit(undefined);
    this.storySaveMessage.set('Az eredeti összefoglaló visszaállítva.');
  }

  protected updateWorldFactDraft(event: Event): void {
    this.worldFactDraft.set((event.target as HTMLTextAreaElement).value);
  }

  protected approveWorldFact(): void {
    const text = this.worldFactDraft().trim();
    if (!text) return;
    this.worldFactApproved.emit(text);
  }

  protected discardWorldFact(): void {
    this.worldFactDraft.set('');
  }

  protected close(): void {
    this.closeSelected.emit();
  }
}
