import { Project } from '../../../domain/project/models/project';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

export interface ProjectReader {
  findById(id: ProjectId): Promise<Project | undefined>;

  findAll(): Promise<readonly Project[]>;
}