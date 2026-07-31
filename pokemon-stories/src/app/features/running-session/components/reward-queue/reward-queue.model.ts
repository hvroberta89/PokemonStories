import type {
  PsIconName,
} from '../../../../shared/ui/icon/ps-icon.registry';

export type RewardQueueStatus =
  | 'unlocked'
  | 'printed'
  | 'given';

export interface RewardQueueItemViewModel {
  readonly id: string;
  readonly recipientName: string;
  readonly rewardLabel: string;
  readonly amount: number;
  readonly icon: PsIconName;
  readonly status: RewardQueueStatus;
}