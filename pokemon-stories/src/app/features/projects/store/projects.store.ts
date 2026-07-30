import {
  computed,
  inject,
  Injectable,
  signal,
} from '@angular/core';

import { CreateProjectHandler } from '../../../application/project/commands/create-project/create-project.handler';
import { ProjectSummary } from '../../../application/project/queries/models/project-summary';
import { ListProjectsHandler } from '../../../application/project/queries/list-projects/list-projects.handler';
import {
  PROJECT_READER,
  PROJECT_REPOSITORY,
} from '../../../application/project/tokens/project.tokens';
import {
  initialProjectsState,
  ProjectsState,
} from './projects-state';
import { ID_GENERATOR } from '../../../application/project/tokens/id-generator.token';

export interface CreateProjectInput {
  readonly name: string;
  readonly description?: string;
}

@Injectable()
export class ProjectsStore {
  private readonly createProjectHandler =
    new CreateProjectHandler(
      inject(PROJECT_REPOSITORY),
      inject(ID_GENERATOR),
    );

  private readonly listProjectsHandler =
    new ListProjectsHandler(
      inject(PROJECT_READER),
    );

  private readonly state = signal<ProjectsState>(
    initialProjectsState,
  );

  readonly projects = computed(
    () => this.state().projects,
  );

  readonly loadingStatus = computed(
    () => this.state().loadingStatus,
  );

  readonly isLoading = computed(
    () => this.loadingStatus() === 'loading',
  );

  readonly isLoaded = computed(
    () => this.loadingStatus() === 'loaded',
  );

  readonly errorMessage = computed(
    () => this.state().errorMessage,
  );

  readonly creating = computed(
    () => this.state().creating,
  );

  readonly hasProjects = computed(
    () => this.projects().length > 0,
  );

  async load(): Promise<void> {
    this.patchState({
      loadingStatus: 'loading',
      errorMessage: undefined,
    });

    try {
      const projects = await this.fetchProjects();

      this.patchState({
        projects,
        loadingStatus: 'loaded',
      });
    } catch {
      this.patchState({
        loadingStatus: 'error',
        errorMessage:
          'A projektek betöltése nem sikerült.',
      });
    }
  }

  async create(
    input: CreateProjectInput,
  ): Promise<boolean> {
    this.patchState({
      creating: true,
      errorMessage: undefined,
    });

    try {
      const result =
        await this.createProjectHandler.execute({
          name: input.name,
          description: input.description,
        });

      if (!result.isSuccess) {
        this.patchState({
          creating: false,
          errorMessage: this.getErrorMessage(
            result.error.code,
          ),
        });

        return false;
      }

      const projects = await this.fetchProjects();

      this.patchState({
        projects,
        loadingStatus: 'loaded',
        creating: false,
      });

      return true;
    } catch {
      this.patchState({
        creating: false,
        errorMessage:
          'A projekt létrehozása nem sikerült.',
      });

      return false;
    }
  }

  clearError(): void {
    this.patchState({
      errorMessage: undefined,
    });
  }

  private fetchProjects(): Promise<
    readonly ProjectSummary[]
  > {
    return this.listProjectsHandler.execute({});
  }

  private patchState(
    patch: Partial<ProjectsState>,
  ): void {
    this.state.update(currentState => ({
      ...currentState,
      ...patch,
    }));
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'INVALID_PROJECT':
        return 'A projekt neve nem lehet üres.';

      case 'PROJECT_NAME_ALREADY_EXISTS':
        return 'Már létezik projekt ezzel a névvel.';

      default:
        return 'A projekt létrehozása nem sikerült.';
    }
  }
}