import type {
  PsIconName,
} from '../../../../shared/ui/icon/ps-icon.registry';

export interface RewardHistoryItemViewModel {
  readonly id: string;
  readonly recipientId?: string;
  readonly recipientName: string;
  readonly rewardType: 'item' | 'quest-item' | 'achievement';
  readonly rewardLabel: string;
  readonly amount: number;
  readonly icon: PsIconName;
  readonly givenAtLabel: string;
}
