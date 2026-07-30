import { DomainError } from '../../shared/errors/domain-error';

export class InvalidProjectError extends DomainError {
  constructor(message: string) {
    super('INVALID_PROJECT', message);
  }
}