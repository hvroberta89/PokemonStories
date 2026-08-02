import { computed, inject, Injectable, signal } from '@angular/core';

import { GetAdventurePlanHandler } from '../../../application/adventure/queries/get-adventure-plan/get-adventure-plan.handler';
import { ADVENTURE_PLAN_READER } from '../../../application/adventure/tokens/adventure-plan.tokens';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { AdventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { ProjectId } from '../../../domain/project/value-objects/project-id';
import { ListCharactersHandler } from '../../../application/character/queries/list-characters/list-characters.handler';
import {
  CHARACTER_READER,
  CHARACTER_REPOSITORY,
} from '../../../application/character/tokens/character.tokens';
import { Character } from '../../../domain/character/models/character';
import { SetAdventureCharactersHandler } from '../../../application/adventure/commands/set-adventure-characters/set-adventure-characters.handler';
import { ADVENTURE_PLAN_REPOSITORY } from '../../../application/adventure/tokens/adventure-plan.tokens';
import { CharacterId } from '../../../domain/character/value-objects/character-id';

export type SessionPreparationStatus = 'idle' | 'loading' | 'loaded' | 'not-found' | 'error';

@Injectable()
export class SessionPreparationStore {
  private readonly getAdventure = new GetAdventurePlanHandler(inject(ADVENTURE_PLAN_READER));
  private readonly listCharacters = new ListCharactersHandler(inject(CHARACTER_READER));
  private readonly setCharacters = new SetAdventureCharactersHandler(
    inject(ADVENTURE_PLAN_REPOSITORY),
    inject(CHARACTER_REPOSITORY),
  );
  private readonly statusState = signal<SessionPreparationStatus>('idle');
  private readonly adventureState = signal<AdventurePlan | null>(null);
  private readonly charactersState = signal<readonly Character[]>([]);

  readonly status = this.statusState.asReadonly();
  readonly adventure = this.adventureState.asReadonly();
  readonly characters = this.charactersState.asReadonly();
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
      this.charactersState.set(
        (await this.listCharacters.execute(projectId)).filter(
          (character) => character.status === 'active',
        ),
      );
      this.statusState.set('loaded');
    } catch {
      this.statusState.set('error');
    }
  }

  async rememberTeam(
    projectId: ProjectId,
    adventureId: AdventurePlanId,
    characterIds: readonly CharacterId[],
  ): Promise<boolean> {
    const result = await this.setCharacters.execute({
      projectId,
      adventurePlanId: adventureId,
      characterIds,
    });
    if (!result.isSuccess) return false;
    const adventure = this.adventureState();
    if (adventure) this.adventureState.set(adventure.selectExpectedCharacters(characterIds));
    return true;
  }
}
