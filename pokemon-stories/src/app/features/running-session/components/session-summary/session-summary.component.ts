import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  output,
  signal,
  effect,
} from '@angular/core';

import { PsIconComponent } from '../../../../shared/ui/public-api';
import { PsVoiceInputDirective } from '../../../../shared/ui/voice-input/ps-voice-input.directive';

import type { SessionSummaryViewModel } from './session-summary.model';

export type AdventureReviewDecision = 'keep-ready' | 'complete-adventure';

export type WorldFactApprovalStatus = 'idle' | 'saving' | 'saved' | 'error';

export type StoryGenerationStatus = 'idle' | 'generating' | 'error';

export interface NpcApprovalDraft {
  readonly name: string;
  readonly role: string;
  readonly description: string;
}

export interface LocationApprovalDraft {
  readonly name: string;
  readonly description: string;
}

@Component({
  selector: 'app-session-summary',
  standalone: true,
  imports: [PsIconComponent, PsVoiceInputDirective],
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

  readonly storyGenerationRequested = output<void>();

  readonly worldFactApproved = output<string>();

  readonly npcApproved = output<NpcApprovalDraft>();

  readonly locationApproved = output<LocationApprovalDraft>();

  readonly worldFactApprovalStatus = input<WorldFactApprovalStatus>('idle');

  readonly npcApprovalStatus = input<WorldFactApprovalStatus>('idle');

  readonly locationApprovalStatus = input<WorldFactApprovalStatus>('idle');

  readonly aiStoryDraft = input<string | null>(null);

  readonly storyGenerationStatus = input<StoryGenerationStatus>('idle');

  readonly reviewError = input<string | null>(null);

  protected readonly storyCopied = signal(false);

  protected readonly copyError = signal<string | null>(null);

  protected readonly storySaveMessage = signal<string | null>(null);

  protected readonly isEditingStory = signal(false);

  protected readonly worldFactDraft = signal('');

  protected readonly npcNameDraft = signal('');

  protected readonly npcRoleDraft = signal('');

  protected readonly npcDescriptionDraft = signal('');

  protected readonly locationNameDraft = signal('');

  protected readonly locationDescriptionDraft = signal('');

  private readonly storyDraft = signal<string | null>(null);

  private readonly appliedAiStoryDraft = signal<string | null>(null);

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

  constructor() {
    effect(() => {
      const draft = this.aiStoryDraft();
      if (!draft || draft === this.appliedAiStoryDraft()) return;
      this.appliedAiStoryDraft.set(draft);
      this.storyDraft.set(draft);
      this.isEditingStory.set(true);
      this.storySaveMessage.set(
        'Az AI-vázlat szerkeszthető, és csak a Kész gombbal lesz Session Story.',
      );
    });
  }

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

  protected requestAiStory(): void {
    this.storyGenerationRequested.emit();
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

  protected updateNpcDraft(field: keyof NpcApprovalDraft, event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    if (field === 'name') this.npcNameDraft.set(value);
    else if (field === 'role') this.npcRoleDraft.set(value);
    else this.npcDescriptionDraft.set(value);
  }

  protected approveNpc(): void {
    const name = this.npcNameDraft().trim();
    const role = this.npcRoleDraft().trim();
    if (!name || !role) return;
    this.npcApproved.emit({ name, role, description: this.npcDescriptionDraft().trim() });
  }

  protected discardNpc(): void {
    this.npcNameDraft.set('');
    this.npcRoleDraft.set('');
    this.npcDescriptionDraft.set('');
  }

  protected updateLocationDraft(field: keyof LocationApprovalDraft, event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    if (field === 'name') this.locationNameDraft.set(value);
    else this.locationDescriptionDraft.set(value);
  }

  protected approveLocation(): void {
    const name = this.locationNameDraft().trim();
    const description = this.locationDescriptionDraft().trim();
    if (!name || !description) return;
    this.locationApproved.emit({ name, description });
  }

  protected discardLocation(): void {
    this.locationNameDraft.set('');
    this.locationDescriptionDraft.set('');
  }

  protected close(): void {
    this.closeSelected.emit();
  }
}
