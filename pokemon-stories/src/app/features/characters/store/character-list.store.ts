import { computed, inject, Injectable, signal } from '@angular/core';

import { CreateCharacterHandler } from '../../../application/character/commands/create-character/create-character.handler';
import { ListCharactersHandler } from '../../../application/character/queries/list-characters/list-characters.handler';
import {
  CHARACTER_READER,
  CHARACTER_REPOSITORY,
} from '../../../application/character/tokens/character.tokens';
import { ID_GENERATOR } from '../../../application/project/tokens/id-generator.token';
import { PROJECT_READER } from '../../../application/project/tokens/project.tokens';
import { Character } from '../../../domain/character/models/character';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

type CharacterListStatus = 'idle' | 'loading' | 'loaded' | 'not-found' | 'error';

@Injectable()
export class CharacterListStore {
  private readonly projectReader = inject(PROJECT_READER);
  private readonly listHandler = new ListCharactersHandler(inject(CHARACTER_READER));
  private readonly createHandler = new CreateCharacterHandler(
    async (id) => Boolean(await this.projectReader.findById(id)),
    inject(CHARACTER_REPOSITORY),
    inject(ID_GENERATOR),
  );
  private readonly statusState = signal<CharacterListStatus>('idle');
  private readonly projectNameState = signal('');
  private readonly charactersState = signal<readonly Character[]>([]);
  private readonly savingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly status = this.statusState.asReadonly();
  readonly projectName = this.projectNameState.asReadonly();
  readonly characters = this.charactersState.asReadonly();
  readonly activeCharacters = computed(() =>
    this.characters().filter((character) => character.status === 'active'),
  );
  readonly archivedCharacters = computed(() =>
    this.characters().filter((character) => character.status === 'archived'),
  );
  readonly saving = this.savingState.asReadonly();
  readonly errorMessage = this.errorState.asReadonly();
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isNotFound = computed(() => this.status() === 'not-found');
  readonly hasError = computed(() => this.status() === 'error');

  async load(projectId: ProjectId): Promise<void> {
    this.statusState.set('loading');
    try {
      const project = await this.projectReader.findById(projectId);
      if (!project || project.status === 'archived') {
        this.statusState.set('not-found');
        return;
      }
      this.projectNameState.set(project.name);
      this.charactersState.set(await this.listHandler.execute(projectId));
      this.statusState.set('loaded');
    } catch {
      this.statusState.set('error');
    }
  }

  async create(projectId: ProjectId, name: string, description: string): Promise<boolean> {
    this.savingState.set(true);
    this.errorState.set(null);
    try {
      const result = await this.createHandler.execute({ projectId, name, description });
      if (!result.isSuccess) {
        this.errorState.set(
          result.code === 'DUPLICATE_NAME'
            ? 'Már van ilyen nevű karakter ebben a projektben.'
            : 'Ellenőrizd a karakter nevét és leírását.',
        );
        return false;
      }
      this.charactersState.set(await this.listHandler.execute(projectId));
      return true;
    } catch {
      this.errorState.set('A karaktert most nem sikerült elmenteni.');
      return false;
    } finally {
      this.savingState.set(false);
    }
  }
}
