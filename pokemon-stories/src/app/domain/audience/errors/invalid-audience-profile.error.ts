import { DomainError } from '../../shared/errors/domain-error';

export class InvalidAudienceProfileError extends DomainError {
  constructor(message: string) {
    super('INVALID_AUDIENCE_PROFILE', message);
  }
}