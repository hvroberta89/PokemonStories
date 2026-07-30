import { AudienceProfile } from '../../../../domain/audience/models/audience-profile';
import { AgeRange } from '../../../../domain/audience/value-objects/age-range';
import { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import { adventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { InMemoryAdventurePlanRepository } from '../../../../infrastructure/adventure/repositories/in-memory-adventure-plan.repository';
import { ListAdventurePlansByProjectHandler } from './list-adventure-plans-by-project.handler';

describe('ListAdventurePlansByProjectHandler', () => {
  let repository: InMemoryAdventurePlanRepository;
  let handler: ListAdventurePlansByProjectHandler;

  beforeEach(() => {
    repository = new InMemoryAdventurePlanRepository();
    handler =
      new ListAdventurePlansByProjectHandler(repository);
  });

  it('should return adventures belonging to the project', async () => {
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

    const result = await handler.execute({
      projectId: projectId('project-1'),
    });

    expect(result.length).toBe(2);

    expect(
      result.every(
        adventure =>
          adventure.projectId === projectId('project-1'),
      ),
    ).toBe(true);
  });

  it('should return adventure plan summaries', async () => {
    await repository.save(
      createAdventurePlan(
        'adventure-1',
        'project-1',
        'Az eltűnt tojás',
      ),
    );

    const result = await handler.execute({
      projectId: projectId('project-1'),
    });

    expect(result).toEqual([
      {
        id: adventurePlanId('adventure-1'),
        projectId: projectId('project-1'),
        title: 'Az eltűnt tojás',
        premise: 'Egy izgalmas Pokémon-kaland.',
        status: 'draft',
        minimumAge: 7,
        maximumAge: 9,
        sessionLengthMinutes: 60,
      },
    ]);
  });

  it('should sort adventures by title', async () => {
    await repository.save(
      createAdventurePlan(
        'adventure-1',
        'project-1',
        'Titokzatos vihar',
      ),
    );

    await repository.save(
      createAdventurePlan(
        'adventure-2',
        'project-1',
        'Az eltűnt tojás',
      ),
    );

    await repository.save(
      createAdventurePlan(
        'adventure-3',
        'project-1',
        'Fények az erdőben',
      ),
    );

    const result = await handler.execute({
      projectId: projectId('project-1'),
    });

    expect(result.map(adventure => adventure.title)).toEqual([
      'Az eltűnt tojás',
      'Fények az erdőben',
      'Titokzatos vihar',
    ]);
  });

  it('should return an empty list when the project has no adventures', async () => {
    const result = await handler.execute({
      projectId: projectId('project-1'),
    });

    expect(result).toEqual([]);
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