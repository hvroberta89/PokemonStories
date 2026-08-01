import type {
  RewardHistoryItemViewModel,
} from '../components/reward-history/reward-history.model';
import type {
  RewardQueueItemViewModel,
} from '../components/reward-queue/reward-queue.model';
import type {
  RunningSessionViewModel,
} from './running-session-view.model';

export type RunningSessionStatus =
  | 'running'
  | 'completed';

export interface RunningSessionState {
  readonly schemaVersion: 1;

  readonly sessionId: string;

  readonly status:
    RunningSessionStatus;

  readonly startedAt: string;

  readonly completedAt:
    string | null;

  readonly viewModel:
    RunningSessionViewModel;

  readonly rewardQueue:
    readonly RewardQueueItemViewModel[];

  readonly rewardHistory:
    readonly RewardHistoryItemViewModel[];
}