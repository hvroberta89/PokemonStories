import { TestBed } from '@angular/core/testing';

import { PROJECT_READER } from '../../../application/project/tokens/project.tokens';
import { REWARD_GRANT_REPOSITORY } from '../../../application/reward/tokens/reward-grant.tokens';
import { Project } from '../../../domain/project/models/project';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { RewardGrant } from '../../../domain/reward/models/reward-grant';
import { PrintQueueStore } from './print-queue.store';

describe('PrintQueueStore', () => {
  it('shows queued rewards and persists their printed status', async () => {
    const project = Project.create({ id: projectId('project-1'), name: 'Kanto kalandok' });
    if (!project.isSuccess) throw project.error;
    const queuedReward = RewardGrant.create({
      id: 'reward-1', projectId: projectId('project-1'), sessionId: 'session-1',
      adventureId: 'adventure-1', recipientName: 'Emma', type: 'badge', label: 'Erdei jelvény',
      amount: 1, physicalStatus: 'queued', deliveryStatus: 'pending',
    });
    const printedReward = RewardGrant.create({
      id: 'reward-2', projectId: projectId('project-1'), sessionId: 'session-1',
      adventureId: 'adventure-1', recipientName: 'Marci', type: 'item', label: 'Potion',
      amount: 1, physicalStatus: 'printed', deliveryStatus: 'pending',
    });
    const saveAll = vi.fn(async () => undefined);
    TestBed.configureTestingModule({
      providers: [
        PrintQueueStore,
        { provide: PROJECT_READER, useValue: { findById: async () => project.value } },
        { provide: REWARD_GRANT_REPOSITORY, useValue: { findByProject: async () => [queuedReward, printedReward], saveAll } },
      ],
    });
    const store = TestBed.inject(PrintQueueStore);

    await store.load('project-1');
    expect(store.queueItems().map((item) => item.id)).toEqual(['reward-1']);

    await store.markAsPrinted('reward-1');
    expect(saveAll).toHaveBeenCalledWith([
      expect.objectContaining({ value: expect.objectContaining({ physicalStatus: 'printed' }) }),
    ]);
    expect(store.queueItems()).toHaveLength(0);
    expect(store.historyItems().map((item) => item.id)).toEqual(['reward-1', 'reward-2']);
  });

  it('persists every selected queued reward in a batch', async () => {
    const project = Project.create({ id: projectId('project-1'), name: 'Kanto kalandok' });
    if (!project.isSuccess) throw project.error;
    const queuedRewards = ['reward-1', 'reward-2'].map((id) =>
      RewardGrant.create({
        id, projectId: projectId('project-1'), sessionId: 'session-1', adventureId: 'adventure-1',
        recipientName: 'Emma', type: 'badge', label: `Jelvény ${id}`, amount: 1,
        physicalStatus: 'queued', deliveryStatus: 'pending',
      }),
    );
    const saveAll = vi.fn(async () => undefined);
    TestBed.configureTestingModule({
      providers: [
        PrintQueueStore,
        { provide: PROJECT_READER, useValue: { findById: async () => project.value } },
        { provide: REWARD_GRANT_REPOSITORY, useValue: { findByProject: async () => queuedRewards, saveAll } },
      ],
    });
    const store = TestBed.inject(PrintQueueStore);

    await store.load('project-1');
    await store.markAllAsPrinted(['reward-1', 'reward-2']);

    expect(saveAll).toHaveBeenCalledWith([
      expect.objectContaining({ value: expect.objectContaining({ id: 'reward-1', physicalStatus: 'printed' }) }),
      expect.objectContaining({ value: expect.objectContaining({ id: 'reward-2', physicalStatus: 'printed' }) }),
    ]);
    expect(store.queueItems()).toHaveLength(0);
  });
});