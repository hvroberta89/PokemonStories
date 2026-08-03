import type { RewardHistoryItemViewModel } from '../components/reward-history/reward-history.model';
import type { RewardQueueItemViewModel } from '../components/reward-queue/reward-queue.model';
import type { RunningSessionViewModel } from './running-session-view.model';
import type { PreparedRewardProps } from '../../../domain/reward/models/prepared-reward';
import type { SessionStatus } from '../../../domain/session/models/session';

export type RunningSessionStatus = SessionStatus;

export interface RunningSessionScene {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly goal: string;
  readonly pokemonReferenceId?: string;
}

export interface RunningSessionParticipant {
  readonly id: string;
  readonly name: string;
}

export interface RunningSessionState {
  readonly schemaVersion: 2;

  readonly sessionId: string;

  readonly projectId?: string;

  readonly adventureId?: string;

  readonly adventureTitle?: string;

  readonly scenes?: readonly RunningSessionScene[];

  readonly currentSceneIndex?: number;

  readonly participants?: readonly RunningSessionParticipant[];
  readonly preparedRewards?: readonly PreparedRewardProps[];

  readonly status: RunningSessionStatus;

  readonly startedAt: string;

  readonly completedAt: string | null;

  readonly sessionStory?: string;

  readonly viewModel: RunningSessionViewModel;

  readonly rewardQueue: readonly RewardQueueItemViewModel[];

  readonly rewardHistory: readonly RewardHistoryItemViewModel[];
}
