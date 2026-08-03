import { DomainError } from '../../shared/errors/domain-error';

export class InvalidSessionError extends DomainError {
  constructor(message: string) {
    super('INVALID_SESSION', message);
  }
}