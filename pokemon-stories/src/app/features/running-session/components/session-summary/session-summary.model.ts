import type {
  RecentEventItemViewModel,
} from '../recent-events/recent-events.model';
import type {
  RewardHistoryItemViewModel,
} from '../reward-history/reward-history.model';
import type {
  RewardQueueItemViewModel,
} from '../reward-queue/reward-queue.model';

export interface SessionSummaryViewModel {
  readonly sessionId: string;

  readonly adventureTitle: string;

  readonly locationName: string;

  readonly startedAtLabel: string;

  readonly completedAtLabel: string;

  readonly durationLabel: string;

  readonly eventCount: number;

  readonly queuedRewardCount: number;

  readonly givenRewardCount: number;

  readonly events:
    readonly RecentEventItemViewModel[];

  readonly queuedRewards:
    readonly RewardQueueItemViewModel[];

  readonly givenRewards:
    readonly RewardHistoryItemViewModel[];
}