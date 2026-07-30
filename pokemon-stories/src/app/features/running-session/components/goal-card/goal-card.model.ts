export type GoalStatus =
  | 'active'
  | 'completed'
  | 'failed';

export interface GoalCardViewModel {
  readonly title: string;
  readonly description: string;
  readonly status: GoalStatus;
  readonly progressLabel?: string;
  readonly actionLabel: string;
}