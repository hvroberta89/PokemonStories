import type { Project } from '../../../../domain/project/models/project';
import type { Outcome } from '../../../../domain/shared/outcome/outcome';
import type { InvalidProjectError } from '../../../../domain/project/errors/invalid-project.error';
import type { ProjectRepository } from '../../ports/project-repository';

export interface UpdateProjectCommand {
  readonly project: Project;
  readonly name: string;
  readonly description?: string;
}

export class UpdateProjectHandler {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(command: UpdateProjectCommand): Promise<Outcome<Project, InvalidProjectError>> {
    const updated = command.project.update({ name: command.name, description: command.description });
    if (!updated.isSuccess) return updated;
    await this.repository.save(updated.value);
    return updated;
  }
}