export interface AdventureEvent {
  readonly id: string;
  readonly createdAt: Date;

  readonly type:
    | 'reward'
    | 'note'
    | 'encounter'
    | 'conversation';

  readonly title: string;
  readonly description: string;
}