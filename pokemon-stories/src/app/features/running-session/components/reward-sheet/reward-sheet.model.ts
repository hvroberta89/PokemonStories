import { PsIconName } from "../../../../shared/ui/public-api";

export type RewardType =
  | 'potion'
  | 'berry'
  | 'gold'
  | 'xp'
  | 'quest-item';

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
  readonly recipientId: string;
  readonly recipientName: string;
}