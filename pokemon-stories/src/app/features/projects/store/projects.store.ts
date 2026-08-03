import { computed, inject, Injectable, signal } from '@angular/core';

import { CreateProjectHandler } from '../../../application/project/commands/create-project/create-project.handler';
import { ProjectSummary } from '../../../application/project/queries/models/project-summary';
import { ListProjectsHandler } from '../../../application/project/queries/list-projects/list-projects.handler';
import { ListArchivedProjectsHandler } from '../../../application/project/queries/list-archived-projects/list-archived-projects.handler';
import { RestoreProjectHandler } from '../../../application/project/commands/restore-project/restore-project.handler';
import {
  PROJECT_READER,
  PROJECT_REPOSITORY,
} from '../../../application/project/tokens/project.tokens';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { initialProjectsState, ProjectsState } from './projects-state';
import { ID_GENERATOR } from '../../../application/project/tokens/id-generator.token';

export interface CreateProjectInput {
  readonly name: string;
  readonly description?: string;
}

@Injectable()
export class ProjectsStore {
  private readonly projectReader = inject(PROJECT_READER);
  private readonly createProjectHandler = new CreateProjectHandler(
    inject(PROJECT_REPOSITORY),
    inject(ID_GENERATOR),
  );

  private readonly listProjectsHandler = new ListProjectsHandler(this.projectReader);
  private readonly listArchivedProjectsHandler = new ListArchivedProjectsHandler(this.projectReader);
  private readonly restoreProjectHandler = new RestoreProjectHandler(inject(PROJECT_REPOSITORY));

  private readonly state = signal<ProjectsState>(initialProjectsState);

  readonly projects = computed(() => this.state().projects);
  readonly archivedProjects = computed(() => this.state().archivedProjects);

  readonly loadingStatus = computed(() => this.state().loadingStatus);

  readonly isLoading = computed(() => this.loadingStatus() === 'loading');

  readonly isLoaded = computed(() => this.loadingStatus() === 'loaded');

  readonly errorMessage = computed(() => this.state().errorMessage);

  readonly creating = computed(() => this.state().creating);

  readonly hasProjects = computed(() => this.projects().length > 0);

  readonly lastCreatedProjectId = computed(() => this.state().lastCreatedProjectId);

  async load(): Promise<void> {
    this.patchState({
      loadingStatus: 'loading',
      errorMessage: undefined,
    });

    try {
      const [projects, archivedProjects] = await Promise.all([
        this.fetchProjects(),
        this.listArchivedProjectsHandler.execute(),
      ]);

      this.patchState({
        projects,
        archivedProjects,
        loadingStatus: 'loaded',
      });
    } catch {
      this.patchState({
        loadingStatus: 'error',
        errorMessage: 'A projektek betöltése nem sikerült.',
      });
    }
  }

  async create(input: CreateProjectInput): Promise<boolean> {
    this.patchState({
      creating: true,
      errorMessage: undefined,
    });

    try {
      const result = await this.createProjectHandler.execute({
        name: input.name,
        description: input.description,
      });

      if (!result.isSuccess) {
        this.patchState({
          creating: false,
          errorMessage: this.getErrorMessage(result.error.code),
        });

        return false;
      }

      const [projects, archivedProjects] = await Promise.all([
        this.fetchProjects(),
        this.listArchivedProjectsHandler.execute(),
      ]);

      this.patchState({
        projects,
        archivedProjects,
        loadingStatus: 'loaded',
        creating: false,
        lastCreatedProjectId: result.value.id,
      });

      return true;
    } catch {
      this.patchState({
        creating: false,
        errorMessage: 'A projekt létrehozása nem sikerült.',
      });

      return false;
    }
  }

  clearError(): void {
    this.patchState({
      errorMessage: undefined,
    });
  }

  async restore(rawProjectId: string): Promise<boolean> {
    try {
      const project = await this.projectReader.findById(projectId(rawProjectId));
      if (!project || project.status !== 'archived') return false;
      await this.restoreProjectHandler.execute(project);
      const [projects, archivedProjects] = await Promise.all([
        this.fetchProjects(),
        this.listArchivedProjectsHandler.execute(),
      ]);
      this.patchState({ projects, archivedProjects, loadingStatus: 'loaded' });
      return true;
    } catch {
      this.patchState({ errorMessage: 'A projekt visszaállítása nem sikerült.' });
      return false;
    }
  }

  private fetchProjects(): Promise<readonly ProjectSummary[]> {
    return this.listProjectsHandler.execute({});
  }

  private patchState(patch: Partial<ProjectsState>): void {
    this.state.update((currentState) => ({
      ...currentState,
      ...patch,
    }));
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'INVALID_PROJECT':
        return 'A projekt neve nem lehet üres.';

      default:
        return 'A projekt létrehozása nem sikerült.';
    }
  }
}
