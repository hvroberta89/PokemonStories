export type RecentEventType =
  | 'encounter'
  | 'conversation'
  | 'reward'
  | 'discovery';

export interface RecentEventItemViewModel {
  readonly id: string;
  readonly type: RecentEventType;
  readonly title: string;
  readonly timeLabel: string;
  readonly icon: string;
}

export interface RecentEventsViewModel {
  readonly title: string;
  readonly newEventsLabel: string;
  readonly detailsLabel: string;
  readonly events:
    readonly RecentEventItemViewModel[];
}