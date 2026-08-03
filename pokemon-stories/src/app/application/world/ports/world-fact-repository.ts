import type { ProjectId } from '../../../domain/project/value-objects/project-id';
import type { WorldFact } from '../../../domain/world/models/world-fact';

export interface WorldFactRepository {
  save(fact: WorldFact): Promise<void>;
  findByProject(projectId: ProjectId): Promise<readonly WorldFact[]>;
}
