import { Project } from '../../../domain/project/models/project';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

export interface ProjectRepository {
  save(project: Project): Promise<void>;

  findById(id: ProjectId): Promise<Project | undefined>;

  existsByName(name: string): Promise<boolean>;
}