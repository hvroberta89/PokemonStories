import { DomainError } from '../errors/domain-error';

export type Outcome<T, E extends DomainError = DomainError> =
  | Success<T>
  | Failure<E>;

export interface Success<T> {
  readonly isSuccess: true;
  readonly value: T;
}

export interface Failure<E extends DomainError> {
  readonly isSuccess: false;
  readonly error: E;
}

export function success<T>(value: T): Success<T> {
  return {
    isSuccess: true,
    value,
  };
}

export function failure<E extends DomainError>(error: E): Failure<E> {
  return {
    isSuccess: false,
    error,
  };
}