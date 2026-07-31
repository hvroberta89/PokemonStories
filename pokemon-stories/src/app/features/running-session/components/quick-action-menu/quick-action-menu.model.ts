import { PsIconName } from "../../../../shared/ui/public-api";


export type QuickActionType =
  | 'note'
  | 'npc'
  | 'event'
  | 'reward'
  | 'ai'
  | 'item';

export interface QuickActionItem {
  readonly type: QuickActionType;
  readonly label: string;
  readonly description: string;
  readonly icon: PsIconName;
}

export interface QuickActionMenuVm {
  readonly title: string;
  readonly subtitle: string;
  readonly actions: readonly QuickActionItem[];
}