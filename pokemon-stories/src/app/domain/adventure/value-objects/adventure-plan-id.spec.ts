import { adventurePlanId } from './adventure-plan-id';

describe('adventurePlanId', () => {
  it('should create an adventure plan identifier', () => {
    const id = adventurePlanId('adventure-1');

    expect(id).toBe('adventure-1');
  });

  it('should trim the identifier', () => {
    const id = adventurePlanId('  adventure-1  ');

    expect(id).toBe('adventure-1');
  });

  it('should reject an empty identifier', () => {
    expect(() => adventurePlanId('   ')).toThrowError(
      'AdventurePlanId cannot be empty.',
    );
  });
});