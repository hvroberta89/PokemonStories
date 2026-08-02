import { DomainError } from '../../shared/errors/domain-error';

export class InvalidCharacterError extends DomainError {
  constructor(message: string) {
    super('INVALID_CHARACTER', message);
  }
}
