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

export interface ProjectSessionReader {
  findByProject(projectId: ProjectId): ProjectSessionSummary | null;
  listCompletedByProject(projectId: ProjectId): readonly CompletedProjectSessionSummary[];
}
