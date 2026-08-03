import type { Project } from '../../../../domain/project/models/project';
import type { ProjectRepository } from '../../ports/project-repository';

export class RestoreProjectHandler {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(project: Project): Promise<Project> {
    const restoredProject = project.restoreFromArchive();
    await this.repository.save(restoredProject);
    return restoredProject;
  }
}