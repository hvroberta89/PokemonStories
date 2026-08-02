import { Project } from '../../../../domain/project/models/project';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { success } from '../../../../domain/shared/outcome/outcome';
import { IdGenerator } from '../../../shared/ports/id-generator';
import { ProjectRepository } from '../../ports/project-repository';
import { CreateProjectCommand } from './create-project.command';
import { CreateProjectResult } from './create-project.result';

export class CreateProjectHandler {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(command: CreateProjectCommand): Promise<CreateProjectResult> {
    const projectResult = Project.create({
      id: projectId(this.idGenerator.generate()),
      name: command.name,
      description: command.description,
    });

    if (!projectResult.isSuccess) {
      return projectResult;
    }

    const project = projectResult.value;

    await this.projectRepository.save(project);

    return success(project);
  }
}
