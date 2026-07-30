import { DomainError } from '../../../domain/shared/errors/domain-error';

export class AdventureTitleAlreadyExistsError extends DomainError {
  constructor(title: string) {
    super(
      'ADVENTURE_TITLE_ALREADY_EXISTS',
      `An adventure named "${title}" already exists in this project.`,
    );
  }
}