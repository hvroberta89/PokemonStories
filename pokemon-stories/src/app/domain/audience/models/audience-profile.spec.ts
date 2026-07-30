import { AgeRange } from '../value-objects/age-range';
import {
  AudienceProfile,
  AudienceProfileProps,
} from './audience-profile';

describe('AudienceProfile', () => {
  it('should create a valid audience profile', () => {
    const result = createProfile();

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.ageRange.minimum).toBe(7);
      expect(result.value.ageRange.maximum).toBe(9);
      expect(result.value.complexity).toBe('easy');
      expect(result.value.sessionLengthMinutes).toBe(60);
    }
  });

  it('should create an immutable audience profile', () => {
    const result = createProfile();

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(Object.isFrozen(result.value)).toBe(true);
    }
  });

  it('should reject a session shorter than the minimum', () => {
    const result = createProfile({
      sessionLengthMinutes: 15,
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.code).toBe('INVALID_AUDIENCE_PROFILE');
    }
  });

  it('should reject a session longer than the maximum', () => {
    const result = createProfile({
      sessionLengthMinutes: 300,
    });

    expect(result.isSuccess).toBe(false);
  });

  it('should reject a non-integer session length', () => {
    const result = createProfile({
      sessionLengthMinutes: 60.5,
    });

    expect(result.isSuccess).toBe(false);
  });

  it('should reject intense scary content for young children', () => {
    const ageRange = getAgeRange(5, 6);

    const result = createProfile({
      ageRange,
      scaryContent: 'intense',
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.message).toContain(
        'Intense scary content',
      );
    }
  });

  it('should reject serious consequences for young children', () => {
    const ageRange = getAgeRange(5, 6);

    const result = createProfile({
      ageRange,
      consequenceSeverity: 'serious',
    });

    expect(result.isSuccess).toBe(false);
  });

  it('should reject challenging complexity for young children', () => {
    const ageRange = getAgeRange(5, 6);

    const result = createProfile({
      ageRange,
      complexity: 'challenging',
    });

    expect(result.isSuccess).toBe(false);
  });

  it('should consider identical profiles equal', () => {
    const first = createProfile();
    const second = createProfile();

    expect(first.isSuccess).toBe(true);
    expect(second.isSuccess).toBe(true);

    if (first.isSuccess && second.isSuccess) {
      expect(first.value.equals(second.value)).toBe(true);
    }
  });

  it('should consider different profiles unequal', () => {
    const first = createProfile();
    const second = createProfile({
      sessionLengthMinutes: 90,
    });

    expect(first.isSuccess).toBe(true);
    expect(second.isSuccess).toBe(true);

    if (first.isSuccess && second.isSuccess) {
      expect(first.value.equals(second.value)).toBe(false);
    }
  });
});

function createProfile(
  overrides: Partial<AudienceProfileProps> = {},
) {
  return AudienceProfile.create({
    ageRange: getAgeRange(7, 9),
    complexity: 'easy',
    dangerIntensity: 'low',
    scaryContent: 'mild',
    consequenceSeverity: 'gentle',
    conflictStyle: 'balanced',
    sessionLengthMinutes: 60,
    ...overrides,
  });
}

function getAgeRange(minimum: number, maximum: number): AgeRange {
  const result = AgeRange.create(minimum, maximum);

  if (!result.isSuccess) {
    throw new Error(result.error.message);
  }

  return result.value;
}