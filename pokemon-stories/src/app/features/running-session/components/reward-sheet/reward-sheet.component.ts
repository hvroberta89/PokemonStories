import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

import {
  PsIconComponent,
} from '../../../../shared/ui/icon/ps-icon.component';
import { PsVoiceInputDirective } from '../../../../shared/ui/voice-input/ps-voice-input.directive';

import {
  RewardDraft,
  RewardOption,
  RewardRecipient,
  RewardRecipientScope,
  RewardType,
} from './reward-sheet.model';
import type { PreparedRewardProps } from '../../../../domain/reward/models/prepared-reward';

@Component({
  selector: 'app-reward-sheet',
  standalone: true,
  imports: [
    PsIconComponent,
    PsVoiceInputDirective,
  ],
  templateUrl: './reward-sheet.component.html',
  styleUrl: './reward-sheet.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class RewardSheetComponent {
  readonly recipients =
    input.required<readonly RewardRecipient[]>();
  readonly preparedRewards = input<readonly PreparedRewardProps[]>([]);

  readonly dismissed =
    output<void>();

  readonly saved = output<readonly RewardDraft[]>();

  protected readonly rewardOptions:
    readonly RewardOption[] = [
      { type: 'pokemon', label: 'Pokémon', icon: 'pokemon-sticker' },
      { type: 'item', label: 'Tárgy', icon: 'items-potion' },
      { type: 'badge', label: 'Jelvény', icon: 'badge-medal' },
      { type: 'outfit', label: 'Öltözék', icon: 'clothing-shirt' },
      { type: 'achievement', label: 'Teljesítmény', icon: 'achievement-star' },
      { type: 'quest-item', label: 'Küldetéstárgy', icon: 'quest-card' },
      { type: 'card', label: 'Kártya', icon: 'npc-card' },
      { type: 'sticker', label: 'Matrica', icon: 'reward-gift' },
      { type: 'narrative', label: 'Történeti', icon: 'timeline-scroll' },
      { type: 'custom', label: 'Egyedi', icon: 'reward-box' },
    ];

  protected readonly selectedRewardType =
    signal<RewardType>('item');

  protected readonly rewardName = signal('');
  protected readonly selectedPreparedRewardId = signal<string | undefined>(undefined);

  protected readonly recipientScope = signal<RewardRecipientScope>('character');

  protected readonly selectedRecipientId =
    signal<readonly string[]>([]);

  protected readonly physicalStatus = signal<'queued' | 'skipped'>('queued');

  protected readonly amount =
    signal(1);

  protected readonly canSave =
    computed(
      () =>
        this.rewardName().trim().length > 0 &&
        this.hasValidRecipients() &&
        this.amount() > 0,
    );

  protected selectReward(
    rewardType: RewardType,
  ): void {
    this.selectedPreparedRewardId.set(undefined);
    this.selectedRewardType.set(rewardType);
  }

  protected selectScope(scope: RewardRecipientScope): void {
    this.recipientScope.set(scope);
    this.selectedRecipientId.set([]);
  }

  protected selectRecipient(recipientId: string): void {
    if (this.recipientScope() === 'multiple') {
      this.selectedRecipientId.update((ids) =>
        ids.includes(recipientId) ? ids.filter((id) => id !== recipientId) : [...ids, recipientId],
      );
      return;
    }
    this.selectedRecipientId.set([recipientId]);
  }

  protected updateRewardName(event: Event): void {
    this.rewardName.set((event.target as HTMLInputElement).value);
  }

  protected selectPreparedReward(reward: PreparedRewardProps): void {
    this.selectedPreparedRewardId.set(reward.id);
    this.selectedRewardType.set(reward.type);
    this.rewardName.set(reward.label);
    this.amount.set(reward.amount);
    this.physicalStatus.set(reward.physicalStatus);
  }

  protected decreaseAmount(): void {
    this.amount.update(
      amount => Math.max(1, amount - 1),
    );
  }

  protected increaseAmount(): void {
    this.amount.update(
      amount => Math.min(99, amount + 1),
    );
  }

  protected dismiss(): void {
    this.dismissed.emit();
  }

  protected save(): void {
    if (!this.canSave()) return;
    const selected = this.resolveRecipients();
    this.saved.emit(selected.map((recipient) => ({
      rewardType: this.selectedRewardType(),
      rewardLabel: this.rewardName().trim(),
      amount: this.amount(),
      recipientId: recipient.id,
      recipientName: recipient.name,
      physicalStatus: this.physicalStatus(),
      preparedRewardId: this.selectedPreparedRewardId(),
    })));
  }

  private hasValidRecipients(): boolean {
    switch (this.recipientScope()) {
      case 'character':
      case 'multiple': return this.selectedRecipientId().length > 0;
      case 'everyone': return this.recipients().length > 0;
      default: return true;
    }
  }

  private resolveRecipients(): readonly { id?: string; name: string }[] {
    switch (this.recipientScope()) {
      case 'everyone': return this.recipients();
      case 'project': return [{ name: 'A teljes projekt' }];
      case 'unassigned': return [{ name: 'Nincs hozzárendelve' }];
      default: return this.recipients().filter((item) => this.selectedRecipientId().includes(item.id));
    }
  }
}
