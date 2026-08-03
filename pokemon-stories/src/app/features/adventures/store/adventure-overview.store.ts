import { computed, inject, Injectable, signal } from '@angular/core';

import { GetAdventurePlanHandler } from '../../../application/adventure/queries/get-adventure-plan/get-adventure-plan.handler';
import { ADVENTURE_PLAN_READER } from '../../../application/adventure/tokens/adventure-plan.tokens';
import { ADVENTURE_PLAN_REPOSITORY } from '../../../application/adventure/tokens/adventure-plan.tokens';
import { MarkAdventureReadyHandler } from '../../../application/adventure/commands/mark-adventure-ready/mark-adventure-ready.handler';
import { CompletedProjectSessionSummary } from '../../../application/session/ports/project-session-reader';
import { PROJECT_SESSION_READER } from '../../../application/session/tokens/project-session.tokens';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { AdventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

type AdventureOverviewStatus = 'idle' | 'loading' | 'loaded' | 'not-found' | 'error';

@Injectable()
export class AdventureOverviewStore {
  private readonly getAdventure = new GetAdventurePlanHandler(inject(ADVENTURE_PLAN_READER));
  private readonly markAdventureReady = new MarkAdventureReadyHandler(inject(ADVENTURE_PLAN_REPOSITORY));
  private readonly sessionReader = inject(PROJECT_SESSION_READER);
  private readonly statusState = signal<AdventureOverviewStatus>('idle');
  private readonly adventureState = signal<AdventurePlan | null>(null);
  private readonly sessionsState = signal<readonly CompletedProjectSessionSummary[]>([]);

  readonly status = this.statusState.asReadonly();
  readonly adventure = this.adventureState.asReadonly();
  readonly sessions = this.sessionsState.asReadonly();
  readonly latestSession = computed(() => this.sessions()[0] ?? null);
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isNotFound = computed(() => this.status() === 'not-found');
  readonly hasError = computed(() => this.status() === 'error');

  async markReady(projectId: ProjectId, adventureId: AdventurePlanId): Promise<boolean> {
    try {
      const result = await this.markAdventureReady.execute({ projectId, adventurePlanId: adventureId });
      if (!result.isSuccess) return false;
      this.adventureState.set(result.value);
      return true;
    } catch {
      return false;
    }
  }

  async load(projectId: ProjectId, adventureId: AdventurePlanId): Promise<void> {
    this.statusState.set('loading');
    this.adventureState.set(null);
    try {
      const adventure = await this.getAdventure.execute({
        projectId,
        adventurePlanId: adventureId,
      });
      if (!adventure) {
        this.statusState.set('not-found');
        return;
      }
      this.adventureState.set(adventure);
      this.sessionsState.set(
        (await this.sessionReader.listCompletedByProject(projectId))
          .filter((session) => session.adventureId === adventureId),
      );
      this.statusState.set('loaded');
    } catch {
      this.statusState.set('error');
    }
  }
}
