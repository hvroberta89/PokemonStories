import { DomainError } from '../errors/domain-error';
import { failure, success } from './outcome';

class TestDomainError extends DomainError {
  constructor() {
    super('TEST_ERROR', 'A test domain error occurred.');
  }
}

describe('Outcome', () => {
  it('should create a successful outcome', () => {
    const result = success('adventure');

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value).toBe('adventure');
    }
  });

  it('should create a failed outcome', () => {
    const error = new TestDomainError();
    const result = failure(error);

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error).toBe(error);
      expect(result.error.code).toBe('TEST_ERROR');
    }
  });

  it('should allow TypeScript to narrow the outcome type', () => {
    const result =
      Math.random() > 0.5
        ? success(42)
        : failure(new TestDomainError());

    if (result.isSuccess) {
      expect(typeof result.value).toBe('number');
    } else {
      expect(result.error).toBeInstanceOf(TestDomainError);
    }
  });
});