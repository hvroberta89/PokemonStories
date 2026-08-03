import type { ProjectId } from '../../../domain/project/value-objects/project-id';
import type { Location } from '../../../domain/location/models/location';

export interface LocationRepository {
  save(location: Location): Promise<void>;
  findByProject(projectId: ProjectId): Promise<readonly Location[]>;
}
