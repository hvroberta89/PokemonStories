import { DomainError } from '../../shared/errors/domain-error';

export class InvalidAdventurePlanError extends DomainError {
  constructor(message: string) {
    super('INVALID_ADVENTURE_PLAN', message);
  }
}