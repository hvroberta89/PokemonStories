import { TestBed } from '@angular/core/testing';

import { PROJECT_READER } from '../../../application/project/tokens/project.tokens';
import { REWARD_GRANT_REPOSITORY } from '../../../application/reward/tokens/reward-grant.tokens';
import { Project } from '../../../domain/project/models/project';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { RewardGrant } from '../../../domain/reward/models/reward-grant';
import { ProjectCollectionStore } from './project-collection.store';

describe('ProjectCollectionStore', () => {
  it('loads and filters the project rewards', async () => {
    const project = Project.create({ id: projectId('project-1'), name: 'Kanto kalandok' });
    if (!project.isSuccess) throw project.error;
    const grants = [
      RewardGrant.create({
        id: 'reward-1', projectId: projectId('project-1'), sessionId: 'session-1',
        adventureId: 'adventure-1', recipientId: 'character-1', recipientName: 'Emma',
        type: 'item', label: 'Potion', amount: 1, physicalStatus: 'queued', deliveryStatus: 'pending',
      }),
      RewardGrant.create({
        id: 'reward-2', projectId: projectId('project-1'), sessionId: 'session-1',
        adventureId: 'adventure-1', recipientId: 'character-2', recipientName: 'Marci',
        type: 'badge', label: 'Erdei jelvény', amount: 1, physicalStatus: 'printed', deliveryStatus: 'given',
      }),
    ];
    TestBed.configureTestingModule({
      providers: [
        ProjectCollectionStore,
        { provide: PROJECT_READER, useValue: { findById: async () => project.value } },
        { provide: REWARD_GRANT_REPOSITORY, useValue: { findByProject: async () => grants, saveAll: async () => undefined } },
      ],
    });
    const store = TestBed.inject(ProjectCollectionStore);

    await store.load('project-1');
    expect(store.totalCount()).toBe(2);
    expect(store.pendingCount()).toBe(1);
    store.typeFilter.set('badge');
    expect(store.grants().map((grant) => grant.value.label)).toEqual(['Erdei jelvény']);
    store.typeFilter.set('all');
    store.recipientFilter.set('Emma');
    expect(store.grants()).toHaveLength(1);
  });
});
