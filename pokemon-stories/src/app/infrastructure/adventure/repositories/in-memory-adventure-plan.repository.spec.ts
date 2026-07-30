import { AudienceProfile } from '../../../domain/audience/models/audience-profile';
import { AgeRange } from '../../../domain/audience/value-objects/age-range';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { adventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { InMemoryAdventurePlanRepository } from './in-memory-adventure-plan.repository';

describe('InMemoryAdventurePlanRepository', () => {
  it('should save and find an adventure plan', async () => {
    const repository =
      new InMemoryAdventurePlanRepository();
    const adventurePlan = createAdventurePlan(
      'adventure-1',
      'project-1',
      'Az eltűnt tojás',
    );

    await repository.save(adventurePlan);

    const storedAdventurePlan = await repository.findById(
      adventurePlanId('adventure-1'),
    );

    expect(storedAdventurePlan).toBe(adventurePlan);
  });

  it('should return adventures belonging to a project', async () => {
    const repository =
      new InMemoryAdventurePlanRepository();

    await repository.save(
      createAdventurePlan(
        'adventure-1',
        'project-1',
        'Az eltűnt tojás',
      ),
    );

    await repository.save(
      createAdventurePlan(
        'adventure-2',
        'project-1',
        'Az éneklő barlang',
      ),
    );

    await repository.save(
      createAdventurePlan(
        'adventure-3',
        'project-2',
        'A titkos kert',
      ),
    );

    const result = await repository.findByProjectId(
      projectId('project-1'),
    );

    expect(result.length).toBe(2);
    expect(
      result.every(
        adventurePlan =>
          adventurePlan.projectId ===
          projectId('project-1'),
      ),
    ).toBe(true);
  });

  it('should detect a title within a project', async () => {
    const repository =
      new InMemoryAdventurePlanRepository();

    await repository.save(
      createAdventurePlan(
        'adventure-1',
        'project-1',
        'Az eltűnt tojás',
      ),
    );

    expect(
      await repository.existsByTitle(
        projectId('project-1'),
        'AZ ELTŰNT TOJÁS',
      ),
    ).toBe(true);
  });

  it('should not detect the title in another project', async () => {
    const repository =
      new InMemoryAdventurePlanRepository();

    await repository.save(
      createAdventurePlan(
        'adventure-1',
        'project-1',
        'Az eltűnt tojás',
      ),
    );

    expect(
      await repository.existsByTitle(
        projectId('project-2'),
        'Az eltűnt tojás',
      ),
    ).toBe(false);
  });
});

function createAdventurePlan(
  id: string,
  project: string,
  title: string,
): AdventurePlan {
  const result = AdventurePlan.create({
    id: adventurePlanId(id),
    projectId: projectId(project),
    title,
    premise: 'Egy izgalmas Pokémon-kaland.',
    audienceProfile: createAudienceProfile(),
  });

  if (!result.isSuccess) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function createAudienceProfile(): AudienceProfile {
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
  });

  if (!profileResult.isSuccess) {
    throw new Error(profileResult.error.message);
  }

  return profileResult.value;
}