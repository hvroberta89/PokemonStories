import { ProjectReader } from '../../../application/project/ports/project-reader';
import { ProjectRepository } from '../../../application/project/ports/project-repository';
import { Project } from '../../../domain/project/models/project';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

export class InMemoryProjectRepository
  implements ProjectRepository, ProjectReader
{
  private readonly projects = new Map<ProjectId, Project>();

  async save(project: Project): Promise<void> {
    this.projects.set(project.id, project);
  }

  async findById(
    id: ProjectId,
  ): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async findAll(): Promise<readonly Project[]> {
    return Array.from(this.projects.values());
  }

  async existsByName(name: string): Promise<boolean> {
    const normalizedName = this.normalizeName(name);

    return Array.from(this.projects.values()).some(
      project =>
        this.normalizeName(project.name) === normalizedName,
    );
  }

  getAll(): readonly Project[] {
    return Array.from(this.projects.values());
  }

  private normalizeName(name: string): string {
    return name.trim().toLocaleLowerCase();
  }
}