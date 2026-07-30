import { DomainError } from "../../shared/errors/domain-error";


export class InvalidAgeRangeError extends DomainError {
  constructor(message: string) {
    super('INVALID_AGE_RANGE', message);
  }
}