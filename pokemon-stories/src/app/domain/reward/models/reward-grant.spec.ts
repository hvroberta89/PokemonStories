import { projectId } from '../../project/value-objects/project-id';
import { RewardGrant } from './reward-grant';

describe('RewardGrant', () => {
  it('records unlocked ownership independently from physical delivery', () => {
    const grant = RewardGrant.create({
      id: 'reward-1',
      projectId: projectId('project-1'),
      sessionId: 'session-1',
      adventureId: 'adventure-1',
      recipientId: 'character-1',
      recipientName: 'Emma',
      type: 'item',
      label: 'Potion',
      amount: 2,
      physicalStatus: 'queued',
      deliveryStatus: 'pending',
    });

    expect(grant.value.label).toBe('Potion');
    expect(grant.value.physicalStatus).toBe('queued');
    expect(grant.value.deliveryStatus).toBe('pending');
  });

  it('supports temporarily unassigned rewards', () => {
    const grant = RewardGrant.create({
      id: 'reward-1',
      projectId: projectId('project-1'),
      sessionId: 'session-1',
      adventureId: 'adventure-1',
      recipientName: 'Nincs hozzárendelve',
      type: 'custom',
      label: 'Titokzatos kulcs',
      amount: 1,
      physicalStatus: 'not-requested',
      deliveryStatus: 'pending',
    });

    expect(grant.value.recipientId).toBeUndefined();
  });

  it('rejects invalid quantities', () => {
    expect(() =>
      RewardGrant.create({
        id: 'reward-1',
        projectId: projectId('project-1'),
        sessionId: 'session-1',
        adventureId: 'adventure-1',
        recipientName: 'Emma',
        type: 'badge',
        label: 'Erdei segítő',
        amount: 0,
        physicalStatus: 'skipped',
        deliveryStatus: 'given',
      }),
    ).toThrow();
  });

  it('updates delivery and recipient without changing ownership', () => {
    const original = RewardGrant.create({
      id: 'reward-1', projectId: projectId('project-1'), sessionId: 'session-1',
      adventureId: 'adventure-1', recipientName: 'Nincs hozzárendelve', type: 'badge',
      label: 'Erdei segítő', amount: 1, physicalStatus: 'queued', deliveryStatus: 'pending',
    });

    const given = original.assignTo('character-1', 'Emma').markAsGiven();

    expect(given.value.id).toBe(original.value.id);
    expect(given.value.recipientName).toBe('Emma');
    expect(given.value.physicalStatus).toBe('printed');
    expect(given.value.deliveryStatus).toBe('given');
  });
});
