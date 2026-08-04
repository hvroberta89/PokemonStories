import { PsIconName } from '../../../../shared/ui/public-api';
import type { RewardPhysicalStatus, RewardType } from '../../../../domain/reward/models/reward-grant';
import type { LibrarySection } from '../../../game-master-library/models/library-reference.model';

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
  readonly referenceId?: string;
  readonly referenceSection?: LibrarySection;
}

export type { RewardType };
