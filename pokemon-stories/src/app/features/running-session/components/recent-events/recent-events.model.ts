import {
  PsIconName,
} from '../../../../shared/ui/public-api';

export type RecentEventType =
  | 'encounter'
  | 'conversation'
  | 'reward'
  | 'discovery'
  | 'note';

export interface RecentEventItemViewModel {
  readonly id: string;
  readonly type: RecentEventType;
  readonly title: string;
  readonly content: string;
  readonly timeLabel: string;
  readonly icon: PsIconName;
}

export interface RecentEventsViewModel {
  readonly title: string;
  readonly newEventsLabel: string;
  readonly detailsLabel: string;
  readonly events:
    readonly RecentEventItemViewModel[];
}