import { computed, inject, Injectable, signal } from '@angular/core';

import { ListAdventurePlansByProjectHandler } from '../../../application/adventure/queries/list-adventure-plans-by-project/list-adventure-plans-by-project.handler';
import { AdventurePlanSummary } from '../../../application/adventure/queries/models/adventure-plan-summary';
import { ADVENTURE_PLAN_READER } from '../../../application/adventure/tokens/adventure-plan.tokens';
import { PROJECT_READER } from '../../../application/project/tokens/project.tokens';
import { projectId } from '../../../domain/project/value-objects/project-id';

type AdventureListStatus = 'idle' | 'loading' | 'loaded' | 'not-found' | 'error';

@Injectable()
export class AdventureListStore {
  private readonly projectReader = inject(PROJECT_READER);
  private readonly listAdventures = new ListAdventurePlansByProjectHandler(
    inject(ADVENTURE_PLAN_READER),
  );
  private readonly statusState = signal<AdventureListStatus>('idle');
  private readonly projectNameState = signal('');
  private readonly adventuresState = signal<readonly AdventurePlanSummary[]>([]);

  readonly status = this.statusState.asReadonly();
  readonly projectName = this.projectNameState.asReadonly();
  readonly adventures = this.adventuresState.asReadonly();
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isNotFound = computed(() => this.status() === 'not-found');
  readonly hasError = computed(() => this.status() === 'error');
  readonly draftAdventures = computed(() =>
    this.adventures().filter((adventure) => adventure.status === 'draft'),
  );
  readonly readyAdventures = computed(() =>
    this.adventures().filter((adventure) => adventure.status === 'ready'),
  );
  readonly completedAdventures = computed(() =>
    this.adventures().filter((adventure) => adventure.status === 'completed'),
  );

  async load(rawProjectId: string): Promise<void> {
    this.statusState.set('loading');
    this.adventuresState.set([]);
    try {
      const id = projectId(rawProjectId);
      const project = await this.projectReader.findById(id);
      if (!project || project.status === 'archived') {
        this.statusState.set('not-found');
        return;
      }
      this.projectNameState.set(project.name);
      this.adventuresState.set(await this.listAdventures.execute({ projectId: id }));
      this.statusState.set('loaded');
    } catch {
      this.statusState.set('error');
    }
  }
}
