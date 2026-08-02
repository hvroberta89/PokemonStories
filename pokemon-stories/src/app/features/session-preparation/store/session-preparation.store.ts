import { computed, inject, Injectable, signal } from '@angular/core';

import { GetAdventurePlanHandler } from '../../../application/adventure/queries/get-adventure-plan/get-adventure-plan.handler';
import { ADVENTURE_PLAN_READER } from '../../../application/adventure/tokens/adventure-plan.tokens';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { AdventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

export type SessionPreparationStatus = 'idle' | 'loading' | 'loaded' | 'not-found' | 'error';

@Injectable()
export class SessionPreparationStore {
  private readonly getAdventure = new GetAdventurePlanHandler(inject(ADVENTURE_PLAN_READER));
  private readonly statusState = signal<SessionPreparationStatus>('idle');
  private readonly adventureState = signal<AdventurePlan | null>(null);

  readonly status = this.statusState.asReadonly();
  readonly adventure = this.adventureState.asReadonly();
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isNotFound = computed(() => this.status() === 'not-found');
  readonly hasError = computed(() => this.status() === 'error');

  async load(projectId: ProjectId, adventureId: AdventurePlanId): Promise<void> {
    this.statusState.set('loading');
    this.adventureState.set(null);
    try {
      const adventure = await this.getAdventure.execute({
        projectId,
        adventurePlanId: adventureId,
      });
      if (!adventure || adventure.status !== 'ready') {
        this.statusState.set('not-found');
        return;
      }
      this.adventureState.set(adventure);
      this.statusState.set('loaded');
    } catch {
      this.statusState.set('error');
    }
  }
}
