import {
  AudienceProfile,
  AudienceProfileProps,
} from '../../audience/models/audience-profile';
import { AgeRange } from '../../audience/value-objects/age-range';
import { projectId } from '../../project/value-objects/project-id';
import { adventurePlanId } from '../value-objects/adventure-plan-id';
import {
  AdventurePlan,
  CreateAdventurePlanProps,
} from './adventure-plan';

describe('AdventurePlan', () => {
  it('should create a draft adventure plan', () => {
    const result = createAdventurePlan();

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.id).toBe('adventure-1');
      expect(result.value.projectId).toBe('project-1');
      expect(result.value.title).toBe(
        'Az eltűnt Pokémon-tojás',
      );
      expect(result.value.premise).toBe(
        'A játékosok egy eltűnt Pokémon-tojás nyomába erednek.',
      );
      expect(result.value.status).toBe('draft');
    }
  });

  it('should trim the title and premise', () => {
    const result = createAdventurePlan({
      title: '  Erdei rejtély  ',
      premise: '  Furcsa hangok hallatszanak az erdőből.  ',
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.title).toBe('Erdei rejtély');
      expect(result.value.premise).toBe(
        'Furcsa hangok hallatszanak az erdőből.',
      );
    }
  });

  it('should reject an empty title', () => {
    const result = createAdventurePlan({
      title: '   ',
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.code).toBe('INVALID_ADVENTURE_PLAN');
      expect(result.error.message).toContain(
        'title cannot be empty',
      );
    }
  });

  it('should reject a title longer than 100 characters', () => {
    const result = createAdventurePlan({
      title: 'a'.repeat(101),
    });

    expect(result.isSuccess).toBe(false);
  });

  it('should reject an empty premise', () => {
    const result = createAdventurePlan({
      premise: '   ',
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.message).toContain(
        'premise cannot be empty',
      );
    }
  });

  it('should reject a premise longer than 1000 characters', () => {
    const result = createAdventurePlan({
      premise: 'a'.repeat(1001),
    });

    expect(result.isSuccess).toBe(false);
  });

  it('should keep the audience profile', () => {
    const audienceProfile = getAudienceProfile({
      sessionLengthMinutes: 90,
    });

    const result = createAdventurePlan({
      audienceProfile,
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.audienceProfile).toBe(audienceProfile);
      expect(
        result.value.audienceProfile.sessionLengthMinutes,
      ).toBe(90);
    }
  });

  it('should create an immutable adventure plan', () => {
    const result = createAdventurePlan();

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(Object.isFrozen(result.value)).toBe(true);
    }
  });

  it('should belong to a project', () => {
    const result = createAdventurePlan({
      projectId: projectId('kanto-project'),
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.projectId).toBe('kanto-project');
    }
  });
});

function createAdventurePlan(
  overrides: Partial<CreateAdventurePlanProps> = {},
) {
  return AdventurePlan.create({
    id: adventurePlanId('adventure-1'),
    projectId: projectId('project-1'),
    title: 'Az eltűnt Pokémon-tojás',
    premise:
      'A játékosok egy eltűnt Pokémon-tojás nyomába erednek.',
    audienceProfile: getAudienceProfile(),
    ...overrides,
  });
}

function getAudienceProfile(
  overrides: Partial<AudienceProfileProps> = {},
): AudienceProfile {
  const ageRangeResult = AgeRange.create(7, 9);

  if (!ageRangeResult.isSuccess) {
    throw new Error(ageRangeResult.error.message);
  }

  const profileResult = AudienceProfile.create({
    ageRange: ageRangeResult.value,
    complexity: 'easy',
    dangerIntensity: 'low',
    scaryContent: 'mild',
    consequenceSeverity: 'gentle',
    conflictStyle: 'balanced',
    sessionLengthMinutes: 60,
    ...overrides,
  });

  if (!profileResult.isSuccess) {
    throw new Error(profileResult.error.message);
  }

  return profileResult.value;
}