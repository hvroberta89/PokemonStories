import { Npc } from '../../../../domain/npc/models/npc';
import { npcId } from '../../../../domain/npc/value-objects/npc-id';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import type { NpcRepository } from '../../ports/npc-repository';
import { ArchiveNpcHandler } from './archive-npc.handler';

class RecordingNpcRepository implements NpcRepository {
  readonly saved: Npc[] = [];

  async save(npc: Npc): Promise<void> {
    this.saved.push(npc);
  }

  async findByProject(): Promise<readonly Npc[]> {
    return this.saved;
  }
}

describe('ArchiveNpcHandler', () => {
  it('persists the archived NPC without changing its canonical identity', async () => {
    const repository = new RecordingNpcRepository();
    const handler = new ArchiveNpcHandler(repository);
    const npc = Npc.create({
      id: npcId('npc-1'),
      projectId: projectId('project-1'),
      name: 'Mira',
      role: 'Erdei őr',
    });

    const archived = await handler.execute(npc);

    expect(archived.value).toMatchObject({
      id: 'npc-1',
      name: 'Mira',
      role: 'Erdei őr',
      status: 'archived',
    });
    expect(repository.saved).toEqual([archived]);
  });
});
