import { SequentialIdGenerator } from './sequential-id.generator';

describe('SequentialIdGenerator', () => {
  it('should generate sequential identifiers', () => {
    const generator = new SequentialIdGenerator('adventure');

    expect(generator.generate()).toBe('adventure-1');
    expect(generator.generate()).toBe('adventure-2');
    expect(generator.generate()).toBe('adventure-3');
  });
});