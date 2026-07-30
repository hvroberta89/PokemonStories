import { DomainError } from '../../../domain/shared/errors/domain-error';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

export class ProjectNotFoundError extends DomainError {
  constructor(projectId: ProjectId) {
    super(
      'PROJECT_NOT_FOUND',
      `The project "${projectId}" does not exist.`,
    );
  }
}