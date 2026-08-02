import { computed, inject, Injectable, signal } from '@angular/core';

import { ManageCharacterHandler } from '../../../application/character/commands/manage-character/manage-character.handler';
import { GetCharacterHandler } from '../../../application/character/queries/get-character/get-character.handler';
import {
  CHARACTER_READER,
  CHARACTER_REPOSITORY,
} from '../../../application/character/tokens/character.tokens';
import { Character } from '../../../domain/character/models/character';
import { CharacterId } from '../../../domain/character/value-objects/character-id';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

type CharacterDetailStatus = 'idle' | 'loading' | 'loaded' | 'saving' | 'not-found' | 'error';

export interface CharacterDraft {
  readonly name: string;
  readonly description: string;
  readonly personalityNotes: string;
  readonly goals: string;
  readonly storyNotes: string;
}

@Injectable()
export class CharacterDetailStore {
  private readonly getHandler = new GetCharacterHandler(inject(CHARACTER_READER));
  private readonly manageHandler = new ManageCharacterHandler(inject(CHARACTER_REPOSITORY));
  private readonly statusState = signal<CharacterDetailStatus>('idle');
  private readonly characterState = signal<Character | null>(null);
  private readonly errorState = signal<string | null>(null);

  readonly status = this.statusState.asReadonly();
  readonly character = this.characterState.asReadonly();
  readonly errorMessage = this.errorState.asReadonly();
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isSaving = computed(() => this.status() === 'saving');
  readonly isNotFound = computed(() => this.status() === 'not-found');
  readonly hasError = computed(() => this.status() === 'error');

  async load(projectId: ProjectId, id: CharacterId): Promise<void> {
    this.statusState.set('loading');
    try {
      const character = await this.getHandler.execute(projectId, id);
      if (!character) {
        this.statusState.set('not-found');
        return;
      }
      this.characterState.set(character);
      this.statusState.set('loaded');
    } catch {
      this.statusState.set('error');
    }
  }

  async save(projectId: ProjectId, id: CharacterId, draft: CharacterDraft): Promise<boolean> {
    return this.manage({ action: 'update', projectId, characterId: id, ...draft });
  }

  async toggleArchive(projectId: ProjectId, id: CharacterId): Promise<boolean> {
    return this.manage({
      action: this.character()?.status === 'archived' ? 'restore' : 'archive',
      projectId,
      characterId: id,
    });
  }

  private async manage(
    command: Parameters<ManageCharacterHandler['execute']>[0],
  ): Promise<boolean> {
    this.statusState.set('saving');
    this.errorState.set(null);
    try {
      const result = await this.manageHandler.execute(command);
      if (!result.isSuccess) {
        this.errorState.set(
          result.code === 'DUPLICATE_NAME'
            ? 'Már van ilyen nevű karakter ebben a projektben.'
            : 'A módosításokat nem sikerült elmenteni.',
        );
        this.statusState.set('loaded');
        return false;
      }
      this.characterState.set(result.value);
      this.statusState.set('loaded');
      return true;
    } catch {
      this.errorState.set('A módosításokat most nem sikerült elmenteni.');
      this.statusState.set('loaded');
      return false;
    }
  }
}
