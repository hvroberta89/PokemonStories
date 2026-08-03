import type { Npc } from '../../../../domain/npc/models/npc';
import type { NpcRepository } from '../../ports/npc-repository';

export class ArchiveNpcHandler {
  constructor(private readonly repository: NpcRepository) {}

  async execute(npc: Npc): Promise<Npc> {
    const archivedNpc = npc.archive();
    await this.repository.save(archivedNpc);
    return archivedNpc;
  }
}
