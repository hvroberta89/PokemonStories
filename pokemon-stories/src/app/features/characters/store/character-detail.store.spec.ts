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
import { REWARD_GRANT_REPOSITORY } from '../../../application/reward/tokens/reward-grant.tokens';
import { RewardGrant } from '../../../domain/reward/models/reward-grant';

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
    const reward = RewardGrant.create({
      id: 'reward-1', projectId: projectId('project-1'), sessionId: 'session-1',
      adventureId: 'adventure-1', recipientId: 'character-1', recipientName: 'Emma',
      type: 'badge', label: 'Erdei segítő', amount: 1,
      physicalStatus: 'queued', deliveryStatus: 'pending',
    });
    TestBed.configureTestingModule({
      providers: [
        CharacterDetailStore,
        { provide: CHARACTER_READER, useValue: repository },
        { provide: CHARACTER_REPOSITORY, useValue: repository },
        {
          provide: REWARD_GRANT_REPOSITORY,
          useValue: { findByProject: async () => [reward], findById: async () => reward, saveAll: async () => undefined },
        },
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
    expect(store.recentRewards()[0]?.value.label).toBe('Erdei segítő');
    expect(store.pendingRewardCount()).toBe(1);
  });
});
