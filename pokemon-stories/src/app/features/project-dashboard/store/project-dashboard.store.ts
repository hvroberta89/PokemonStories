import { computed, inject, Injectable, signal } from '@angular/core';

import { ListAdventurePlansByProjectHandler } from '../../../application/adventure/queries/list-adventure-plans-by-project/list-adventure-plans-by-project.handler';
import { ADVENTURE_PLAN_READER } from '../../../application/adventure/tokens/adventure-plan.tokens';
import { ProjectSummary } from '../../../application/project/queries/models/project-summary';
import { PROJECT_READER } from '../../../application/project/tokens/project.tokens';
import { PROJECT_REPOSITORY } from '../../../application/project/tokens/project.tokens';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { ActiveProjectStore } from '../../projects/store/active-project.store';
import { ProjectDashboardViewModel } from '../models/project-dashboard-view.model';
import { PROJECT_SESSION_READER } from '../../../application/session/tokens/project-session.tokens';
import { ArchiveProjectHandler } from '../../../application/project/commands/archive-project/archive-project.handler';

type DashboardLoadingStatus = 'idle' | 'loading' | 'loaded' | 'not-found' | 'error';

@Injectable()
export class ProjectDashboardStore {
  private readonly projectReader = inject(PROJECT_READER);
  private readonly activeProjectStore = inject(ActiveProjectStore);
  private readonly sessionReader = inject(PROJECT_SESSION_READER);
  private readonly archiveProject = new ArchiveProjectHandler(
    this.sessionReader,
    inject(PROJECT_REPOSITORY),
  );
  private readonly adventureHandler = new ListAdventurePlansByProjectHandler(
    inject(ADVENTURE_PLAN_READER),
  );

  private readonly loadingState = signal<DashboardLoadingStatus>('idle');
  private readonly dashboardState = signal<ProjectDashboardViewModel | null>(null);

  readonly status = this.loadingState.asReadonly();
  readonly dashboard = this.dashboardState.asReadonly();
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isNotFound = computed(() => this.status() === 'not-found');
  readonly hasError = computed(() => this.status() === 'error');

  async archive(rawProjectId: string): Promise<'archived' | 'active-session' | 'error'> {
    try {
      const project = await this.projectReader.findById(projectId(rawProjectId));
      if (!project) return 'error';
      const result = await this.archiveProject.execute(project);
      return result.isSuccess ? 'archived' : 'active-session';
    } catch {
      return 'error';
    }
  }

  async load(rawProjectId: string): Promise<void> {
    this.loadingState.set('loading');
    this.dashboardState.set(null);

    try {
      const id = projectId(rawProjectId);
      const project = await this.projectReader.findById(id);

      if (!project || project.status === 'archived') {
        this.activeProjectStore.clear();
        this.loadingState.set('not-found');
        return;
      }

      const adventures = await this.adventureHandler.execute({ projectId: id });
      const projectSession = await this.sessionReader.findByProject(id);
      const summary: ProjectSummary = {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
      };

      this.activeProjectStore.select(id);
      this.dashboardState.set({
        project: summary,
        adventureCount: adventures.length,
        primaryAction: projectSession
          ? {
              kind: projectSession.status === 'running' ? 'resume-session' : 'review-session',
              session: projectSession,
            }
          : this.resolvePrimaryAction(adventures),
      });
      this.loadingState.set('loaded');
    } catch {
      this.loadingState.set('error');
    }
  }

  private resolvePrimaryAction(
    adventures: Awaited<ReturnType<ListAdventurePlansByProjectHandler['execute']>>,
  ): ProjectDashboardViewModel['primaryAction'] {
    const readyAdventure = adventures.find((adventure) => adventure.status === 'ready');

    if (readyAdventure) {
      return { kind: 'prepare-adventure', adventure: readyAdventure };
    }

    const draftAdventure = adventures.find((adventure) => adventure.status === 'draft');

    if (draftAdventure) {
      return { kind: 'continue-adventure', adventure: draftAdventure };
    }

    return { kind: 'create-adventure' };
  }
}
