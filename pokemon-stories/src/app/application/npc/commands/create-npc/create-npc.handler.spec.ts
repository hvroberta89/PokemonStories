import type { Npc } from '../../../../domain/npc/models/npc';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { FixedIdGenerator } from '../../../../infrastructure/shared/identifiers/fixed-id.generator';
import type { NpcRepository } from '../../ports/npc-repository';
import { CreateNpcHandler } from './create-npc.handler';

class RecordingNpcRepository implements NpcRepository {
  readonly saved: Npc[] = [];

  async save(npc: Npc): Promise<void> {
    this.saved.push(npc);
  }

  async findByProject(): Promise<readonly Npc[]> {
    return this.saved;
  }
}

describe('CreateNpcHandler', () => {
  it('creates an active Project NPC with normalized identity', async () => {
    const repository = new RecordingNpcRepository();
    const handler = new CreateNpcHandler(
      async () => true,
      repository,
      new FixedIdGenerator('npc-1'),
    );

    const result = await handler.execute({
      projectId: projectId('project-1'),
      name: '  Mira  ',
      role: '  Erdei őr  ',
      description: 'Segítőkész útmutató.',
    });

    expect(result.isSuccess).toBe(true);
    expect(repository.saved[0]?.value).toMatchObject({
      name: 'Mira',
      role: 'Erdei őr',
      status: 'active',
    });
  });

  it('does not save an NPC without a role', async () => {
    const repository = new RecordingNpcRepository();
    const handler = new CreateNpcHandler(
      async () => true,
      repository,
      new FixedIdGenerator('npc-1'),
    );

    const result = await handler.execute({
      projectId: projectId('project-1'),
      name: 'Mira',
      role: ' ',
    });

    expect(result).toEqual({ isSuccess: false, code: 'INVALID' });
    expect(repository.saved).toHaveLength(0);
  });
});
