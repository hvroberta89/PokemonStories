import { ProjectSummary } from '../../../application/project/queries/models/project-summary';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

export type ProjectsLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface ProjectsState {
  readonly projects: readonly ProjectSummary[];
  readonly archivedProjects: readonly ProjectSummary[];
  readonly loadingStatus: ProjectsLoadingStatus;
  readonly errorMessage?: string;
  readonly creating: boolean;
  readonly lastCreatedProjectId?: ProjectId;
}

export const initialProjectsState: ProjectsState = {
  projects: [],
  archivedProjects: [],
  loadingStatus: 'idle',
  creating: false,
};
