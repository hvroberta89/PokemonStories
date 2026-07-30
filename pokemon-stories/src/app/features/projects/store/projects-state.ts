import { ProjectSummary } from '../../../application/project/queries/models/project-summary';

export type ProjectsLoadingStatus =
  | 'idle'
  | 'loading'
  | 'loaded'
  | 'error';

export interface ProjectsState {
  readonly projects: readonly ProjectSummary[];
  readonly loadingStatus: ProjectsLoadingStatus;
  readonly errorMessage?: string;
  readonly creating: boolean;
}

export const initialProjectsState: ProjectsState = {
  projects: [],
  loadingStatus: 'idle',
  creating: false,
};