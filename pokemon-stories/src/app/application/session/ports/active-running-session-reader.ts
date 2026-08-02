import { ProjectId } from '../../../domain/project/value-objects/project-id';

export interface ActiveRunningSessionSummary {
  readonly sessionId: string;
  readonly projectId: ProjectId;
  readonly adventureId: string;
  readonly adventureTitle: string;
  readonly currentSceneTitle: string;
  readonly currentGoal: string;
  readonly startedAt: string;
}

export interface ActiveRunningSessionReader {
  findByProject(projectId: ProjectId): ActiveRunningSessionSummary | null;
}
