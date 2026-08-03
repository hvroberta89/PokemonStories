import { computed, inject, Injectable, signal } from '@angular/core';

import { ListAdventurePlansByProjectHandler } from '../../../application/adventure/queries/list-adventure-plans-by-project/list-adventure-plans-by-project.handler';
import { AdventurePlanSummary } from '../../../application/adventure/queries/models/adventure-plan-summary';
import { ADVENTURE_PLAN_READER } from '../../../application/adventure/tokens/adventure-plan.tokens';
import { ADVENTURE_PLAN_REPOSITORY } from '../../../application/adventure/tokens/adventure-plan.tokens';
import { PROJECT_READER } from '../../../application/project/tokens/project.tokens';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { adventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { ArchiveAdventureHandler } from '../../../application/adventure/commands/archive-adventure/archive-adventure.handler';
import { RestoreAdventureHandler } from '../../../application/adventure/commands/restore-adventure/restore-adventure.handler';
import { ListArchivedAdventurePlansByProjectHandler } from '../../../application/adventure/queries/list-archived-adventure-plans-by-project/list-archived-adventure-plans-by-project.handler';
import { PROJECT_SESSION_READER } from '../../../application/session/tokens/project-session.tokens';

type AdventureListStatus = 'idle' | 'loading' | 'loaded' | 'not-found' | 'error';

@Injectable()
export class AdventureListStore {
  private readonly projectReader = inject(PROJECT_READER);
  private readonly adventureReader = inject(ADVENTURE_PLAN_READER);
  private readonly listAdventures = new ListAdventurePlansByProjectHandler(
    this.adventureReader,
  );
  private readonly archiveAdventure = new ArchiveAdventureHandler(
    inject(PROJECT_SESSION_READER),
    inject(ADVENTURE_PLAN_REPOSITORY),
  );
  private readonly restoreAdventure = new RestoreAdventureHandler(inject(ADVENTURE_PLAN_REPOSITORY));
  private readonly listArchivedAdventures = new ListArchivedAdventurePlansByProjectHandler(
    this.adventureReader,
  );
  private readonly statusState = signal<AdventureListStatus>('idle');
  private readonly projectNameState = signal('');
  private readonly adventuresState = signal<readonly AdventurePlanSummary[]>([]);
  private readonly archivedAdventuresState = signal<readonly AdventurePlanSummary[]>([]);

  readonly status = this.statusState.asReadonly();
  readonly projectName = this.projectNameState.asReadonly();
  readonly adventures = this.adventuresState.asReadonly();
  readonly archivedAdventures = this.archivedAdventuresState.asReadonly();
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isNotFound = computed(() => this.status() === 'not-found');
  readonly hasError = computed(() => this.status() === 'error');

  async archive(rawAdventureId: string): Promise<'archived' | 'active-session' | 'error'> {
    try {
      const adventure = await this.adventureReader.findById(adventurePlanId(rawAdventureId));
      if (!adventure) return 'error';
      const result = await this.archiveAdventure.execute(adventure);
      if (!result.isSuccess) return 'active-session';
      this.adventuresState.update((adventures) =>
        adventures.filter((currentAdventure) => currentAdventure.id !== result.value.id),
      );
      this.archivedAdventuresState.update((adventures) => [
        ...adventures,
        this.toSummary(result.value),
      ]);
      return 'archived';
    } catch {
      return 'error';
    }
  }

  async restore(rawAdventureId: string): Promise<boolean> {
    try {
      const adventure = await this.adventureReader.findById(adventurePlanId(rawAdventureId));
      if (!adventure || adventure.status !== 'archived') return false;
      const restoredAdventure = await this.restoreAdventure.execute(adventure);
      this.archivedAdventuresState.update((adventures) =>
        adventures.filter((currentAdventure) => currentAdventure.id !== restoredAdventure.id),
      );
      this.adventuresState.update((adventures) => [...adventures, this.toSummary(restoredAdventure)]);
      return true;
    } catch {
      return false;
    }
  }
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
    this.archivedAdventuresState.set([]);
    try {
      const id = projectId(rawProjectId);
      const project = await this.projectReader.findById(id);
      if (!project || project.status === 'archived') {
        this.statusState.set('not-found');
        return;
      }
      this.projectNameState.set(project.name);
      const [adventures, archivedAdventures] = await Promise.all([
        this.listAdventures.execute({ projectId: id }),
        this.listArchivedAdventures.execute({ projectId: id }),
      ]);
      this.adventuresState.set(adventures);
      this.archivedAdventuresState.set(archivedAdventures);
      this.statusState.set('loaded');
    } catch {
      this.statusState.set('error');
    }
  }

  private toSummary(adventure: AdventurePlan): AdventurePlanSummary {
    return {
      id: adventure.id,
      projectId: adventure.projectId,
      title: adventure.title,
      premise: adventure.premise,
      status: adventure.status,
      minimumAge: adventure.audienceProfile.ageRange.minimum,
      maximumAge: adventure.audienceProfile.ageRange.maximum,
      sessionLengthMinutes: adventure.audienceProfile.sessionLengthMinutes,
    };
  }
}
