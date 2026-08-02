import type {
  PsIconName,
} from '../../../../shared/ui/icon/ps-icon.registry';
import type { RewardPhysicalStatus, RewardType } from '../../../../domain/reward/models/reward-grant';

export type RewardQueueStatus =
  | 'unlocked'
  | 'printed'
  | 'given';

export interface RewardQueueItemViewModel {
  readonly id: string;
  readonly recipientId?: string;
  readonly recipientName: string;
  readonly rewardType: RewardType;
  readonly rewardLabel: string;
  readonly amount: number;
  readonly icon: PsIconName;
  readonly status: RewardQueueStatus;
  readonly physicalStatus: RewardPhysicalStatus;
  readonly preparedRewardId?: string;
}
