import { TestBed } from '@angular/core/testing';

import {
  CHARACTER_READER,
  CHARACTER_REPOSITORY,
} from '../../../application/character/tokens/character.tokens';
import { Character } from '../../../domain/character/models/character';
import { characterId } from '../../../domain/character/value-objects/character-id';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { InMemoryCharacterRepository } from '../../../infrastructure/character/repositories/in-memory-character.repository';
import { CharacterDetailStore } from './character-detail.store';

describe('CharacterDetailStore', () => {
  it('updates and archives the project character without losing story data', async () => {
    const repository = new InMemoryCharacterRepository();
    const created = Character.create({
      id: characterId('character-1'),
      projectId: projectId('project-1'),
      name: 'Emma',
    });
    if (!created.isSuccess) throw created.error;
    await repository.save(created.value);
    TestBed.configureTestingModule({
      providers: [
        CharacterDetailStore,
        { provide: CHARACTER_READER, useValue: repository },
        { provide: CHARACTER_REPOSITORY, useValue: repository },
      ],
    });
    const store = TestBed.inject(CharacterDetailStore);
    await store.load(projectId('project-1'), characterId('character-1'));

    expect(
      await store.save(projectId('project-1'), characterId('character-1'), {
        name: 'Emma',
        description: 'Felfedező trainer.',
        personalityNotes: 'Kíváncsi.',
        goals: 'Segíteni a Pokémonoknak.',
        storyNotes: 'Ismeri az öreg hidat.',
      }),
    ).toBe(true);
    expect(await store.toggleArchive(projectId('project-1'), characterId('character-1'))).toBe(
      true,
    );
    expect(store.character()?.status).toBe('archived');
    expect(store.character()?.storyNotes).toContain('hidat');
  });
});
