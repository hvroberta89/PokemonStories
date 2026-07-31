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

import {
  RewardDraft,
  RewardOption,
  RewardRecipient,
  RewardType,
} from './reward-sheet.model';

@Component({
  selector: 'app-reward-sheet',
  standalone: true,
  imports: [
    PsIconComponent,
  ],
  templateUrl: './reward-sheet.component.html',
  styleUrl: './reward-sheet.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class RewardSheetComponent {
  readonly recipients =
    input.required<readonly RewardRecipient[]>();

  readonly dismissed =
    output<void>();

  readonly saved =
    output<RewardDraft>();

  protected readonly rewardOptions:
    readonly RewardOption[] = [
      {
        type: 'potion',
        label: 'Potion',
        icon: 'items-potion',
      },
      {
        type: 'berry',
        label: 'Bogyó',
        icon: 'reward-gift',
      },
      {
        type: 'gold',
        label: 'Arany',
        icon: 'reward-gift',
      },
      {
        type: 'xp',
        label: 'Tapasztalat',
        icon: 'reward-gift',
      },
      {
        type: 'quest-item',
        label: 'Küldetéstárgy',
        icon: 'notes-scroll',
      },
    ];

  protected readonly selectedRewardType =
    signal<RewardType>('potion');

  protected readonly selectedRecipientId =
    signal<string | null>(null);

  protected readonly amount =
    signal(1);

  protected readonly canSave =
    computed(
      () =>
        this.selectedRecipientId() !== null &&
        this.amount() > 0,
    );

  protected selectReward(
    rewardType: RewardType,
  ): void {
    this.selectedRewardType.set(rewardType);
  }

  protected selectRecipient(
    recipientId: string,
  ): void {
    this.selectedRecipientId.set(recipientId);
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
    const recipientId =
      this.selectedRecipientId();

    if (!recipientId) {
      return;
    }

    const recipient =
      this.recipients().find(
        item => item.id === recipientId,
      );

    const reward =
      this.rewardOptions.find(
        item =>
          item.type ===
          this.selectedRewardType(),
      );

    if (!recipient || !reward) {
      return;
    }

    this.saved.emit({
      rewardType: reward.type,
      rewardLabel: reward.label,
      amount: this.amount(),
      recipientId: recipient.id,
      recipientName: recipient.name,
    });
  }
}