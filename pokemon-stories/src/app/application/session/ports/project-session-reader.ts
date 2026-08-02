import { ProjectId } from '../../../domain/project/value-objects/project-id';

export interface ProjectSessionSummary {
  readonly sessionId: string;
  readonly projectId: ProjectId;
  readonly adventureId: string;
  readonly adventureTitle: string;
  readonly currentSceneTitle: string;
  readonly currentGoal: string;
  readonly startedAt: string;
  readonly status: 'running' | 'review-pending';
}

export interface CompletedProjectSessionSummary {
  readonly sessionId: string;
  readonly projectId: ProjectId;
  readonly adventureId: string;
  readonly adventureTitle: string;
  readonly finalSceneTitle: string;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly eventCount: number;
  readonly rewardCount: number;
}

export interface CompletedProjectSessionDetail extends CompletedProjectSessionSummary {
  readonly narration: readonly string[];
  readonly sceneTitles: readonly string[];
  readonly events: readonly {
    readonly id: string;
    readonly title: string;
    readonly content: string;
    readonly timeLabel: string;
  }[];
  readonly rewards: readonly {
    readonly id: string;
    readonly recipientName: string;
    readonly rewardLabel: string;
    readonly amount: number;
  }[];
}

export interface ProjectSessionReader {
  findByProject(projectId: ProjectId): ProjectSessionSummary | null;
  listCompletedByProject(projectId: ProjectId): readonly CompletedProjectSessionSummary[];
  findCompletedById(projectId: ProjectId, sessionId: string): CompletedProjectSessionDetail | null;
}
