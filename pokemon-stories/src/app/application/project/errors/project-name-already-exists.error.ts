import { DomainError } from '../../../domain/shared/errors/domain-error';

export class ProjectNameAlreadyExistsError extends DomainError {
  constructor(name: string) {
    super(
      'PROJECT_NAME_ALREADY_EXISTS',
      `A project named "${name}" already exists.`,
    );
  }
}