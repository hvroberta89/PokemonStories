import { ProjectId } from '../../../domain/project/value-objects/project-id';

export interface ActiveProjectStorage {
  load(): ProjectId | null;
  save(projectId: ProjectId): void;
  clear(): void;
}
