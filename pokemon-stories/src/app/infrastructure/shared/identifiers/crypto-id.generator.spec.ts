import { CryptoIdGenerator } from './crypto-id.generator';

describe('CryptoIdGenerator', () => {
  it('should generate a non-empty identifier', () => {
    const generator = new CryptoIdGenerator();

    const result = generator.generate();

    expect(result.length).toBeGreaterThan(0);
  });

  it('should generate different identifiers', () => {
    const generator = new CryptoIdGenerator();

    const first = generator.generate();
    const second = generator.generate();

    expect(first).not.toBe(second);
  });
});