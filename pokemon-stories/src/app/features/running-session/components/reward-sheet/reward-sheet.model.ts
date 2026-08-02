import { PsIconName } from '../../../../shared/ui/public-api';
import type { RewardPhysicalStatus, RewardType } from '../../../../domain/reward/models/reward-grant';

export type RewardRecipientScope = 'character' | 'multiple' | 'everyone' | 'project' | 'unassigned';

export interface RewardOption {
  readonly type: RewardType;
  readonly label: string;
  readonly icon: PsIconName;
}

export interface RewardRecipient {
  readonly id: string;
  readonly name: string;
  readonly avatarUrl?: string;
}

export interface RewardDraft {
  readonly rewardType: RewardType;
  readonly rewardLabel: string;
  readonly amount: number;
  readonly recipientId?: string;
  readonly recipientName: string;
  readonly physicalStatus: RewardPhysicalStatus;
  readonly preparedRewardId?: string;
}

export type { RewardType };
