import type { Npc } from '../../../domain/npc/models/npc';
import type { ProjectId } from '../../../domain/project/value-objects/project-id';

export interface NpcRepository {
  save(npc: Npc): Promise<void>;
  findByProject(projectId: ProjectId): Promise<readonly Npc[]>;
}
