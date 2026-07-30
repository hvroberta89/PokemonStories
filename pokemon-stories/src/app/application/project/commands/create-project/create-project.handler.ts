import { Project } from '../../../../domain/project/models/project';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import {
  failure,
  success,
} from '../../../../domain/shared/outcome/outcome';
import { IdGenerator } from '../../../shared/ports/id-generator';
import { ProjectNameAlreadyExistsError } from '../../errors/project-name-already-exists.error';
import { ProjectRepository } from '../../ports/project-repository';
import { CreateProjectCommand } from './create-project.command';
import { CreateProjectResult } from './create-project.result';

export class CreateProjectHandler {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(
    command: CreateProjectCommand,
  ): Promise<CreateProjectResult> {
    const projectResult = Project.create({
      id: projectId(this.idGenerator.generate()),
      name: command.name,
      description: command.description,
    });

    if (!projectResult.isSuccess) {
      return projectResult;
    }

    const project = projectResult.value;

    const nameAlreadyExists =
      await this.projectRepository.existsByName(project.name);

    if (nameAlreadyExists) {
      return failure(
        new ProjectNameAlreadyExistsError(project.name),
      );
    }

    await this.projectRepository.save(project);

    return success(project);
  }
}