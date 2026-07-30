import {
  AudienceProfile,
  AudienceProfileProps,
} from '../../../../domain/audience/models/audience-profile';
import { AgeRange } from '../../../../domain/audience/value-objects/age-range';
import { Project } from '../../../../domain/project/models/project';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { InMemoryAdventurePlanRepository } from '../../../../infrastructure/adventure/repositories/in-memory-adventure-plan.repository';
import { InMemoryProjectRepository } from '../../../../infrastructure/project/repositories/in-memory-project.repository';
import { FixedIdGenerator } from '../../../../infrastructure/shared/identifiers/fixed-id.generator';
import { CreateAdventurePlanHandler } from './create-adventure-plan.handler';

describe('CreateAdventurePlanHandler', () => {
  let projectRepository: InMemoryProjectRepository;
  let adventurePlanRepository: InMemoryAdventurePlanRepository;
  let handler: CreateAdventurePlanHandler;

  beforeEach(async () => {
    projectRepository = new InMemoryProjectRepository();
    adventurePlanRepository =
      new InMemoryAdventurePlanRepository();

    handler = new CreateAdventurePlanHandler(
      projectRepository,
      adventurePlanRepository,
      new FixedIdGenerator('adventure-1'),
    );

    await projectRepository.save(
      createProject('project-1', 'Pokémon kalandok'),
    );
  });

  it('should create and save an adventure plan', async () => {
    const audienceProfile = createAudienceProfile();

    const result = await handler.execute({
      projectId: projectId('project-1'),
      title: 'Az eltűnt Pokémon-tojás',
      premise:
        'A játékosok egy eltűnt tojás nyomába erednek.',
      audienceProfile,
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.id).toBe('adventure-1');
      expect(result.value.projectId).toBe('project-1');
      expect(result.value.title).toBe(
        'Az eltűnt Pokémon-tojás',
      );
      expect(result.value.status).toBe('draft');
      expect(result.value.audienceProfile).toBe(
        audienceProfile,
      );
    }

    expect(adventurePlanRepository.getAll().length).toBe(1);
  });

  it('should use the generated identifier', async () => {
    handler = new CreateAdventurePlanHandler(
      projectRepository,
      adventurePlanRepository,
      new FixedIdGenerator('generated-adventure-id'),
    );

    const result = await handler.execute({
      projectId: projectId('project-1'),
      title: 'Az éneklő barlang',
      premise:
        'Titokzatos dallam hallatszik egy közeli barlangból.',
      audienceProfile: createAudienceProfile(),
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.id).toBe(
        'generated-adventure-id',
      );
    }
  });

  it('should reject a missing project', async () => {
    const result = await handler.execute({
      projectId: projectId('missing-project'),
      title: 'Az eltűnt Pokémon-tojás',
      premise:
        'A játékosok egy eltűnt tojás nyomába erednek.',
      audienceProfile: createAudienceProfile(),
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.code).toBe(
        'PROJECT_NOT_FOUND',
      );
    }

    expect(adventurePlanRepository.getAll().length).toBe(0);
  });

  it('should reject an invalid adventure plan', async () => {
    const result = await handler.execute({
      projectId: projectId('project-1'),
      title: '   ',
      premise:
        'A játékosok egy eltűnt tojás nyomába erednek.',
      audienceProfile: createAudienceProfile(),
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.code).toBe(
        'INVALID_ADVENTURE_PLAN',
      );
    }

    expect(adventurePlanRepository.getAll().length).toBe(0);
  });

  it('should reject a duplicate title within the same project', async () => {
    const command = {
      projectId: projectId('project-1'),
      title: 'Az eltűnt Pokémon-tojás',
      premise:
        'A játékosok egy eltűnt tojás nyomába erednek.',
      audienceProfile: createAudienceProfile(),
    };

    const firstResult = await handler.execute(command);
    const secondResult = await handler.execute(command);

    expect(firstResult.isSuccess).toBe(true);
    expect(secondResult.isSuccess).toBe(false);

    if (!secondResult.isSuccess) {
      expect(secondResult.error.code).toBe(
        'ADVENTURE_TITLE_ALREADY_EXISTS',
      );
    }

    expect(adventurePlanRepository.getAll().length).toBe(1);
  });

  it('should treat titles case-insensitively', async () => {
    await handler.execute({
      projectId: projectId('project-1'),
      title: 'Az eltűnt tojás',
      premise: 'Első történet.',
      audienceProfile: createAudienceProfile(),
    });

    const result = await handler.execute({
      projectId: projectId('project-1'),
      title: 'AZ ELTŰNT TOJÁS',
      premise: 'Második történet.',
      audienceProfile: createAudienceProfile(),
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.code).toBe(
        'ADVENTURE_TITLE_ALREADY_EXISTS',
      );
    }
  });

  it('should allow the same title in different projects', async () => {
    await projectRepository.save(
      createProject('project-2', 'Johto kalandok'),
    );

    const firstResult = await handler.execute({
      projectId: projectId('project-1'),
      title: 'Az eltűnt tojás',
      premise: 'Kanto történet.',
      audienceProfile: createAudienceProfile(),
    });

    handler = new CreateAdventurePlanHandler(
      projectRepository,
      adventurePlanRepository,
      new FixedIdGenerator('adventure-2'),
    );

    const secondResult = await handler.execute({
      projectId: projectId('project-2'),
      title: 'Az eltűnt tojás',
      premise: 'Johto történet.',
      audienceProfile: createAudienceProfile(),
    });

    expect(firstResult.isSuccess).toBe(true);
    expect(secondResult.isSuccess).toBe(true);
    expect(adventurePlanRepository.getAll().length).toBe(2);
  });
});

function createProject(
  id: string,
  name: string,
): Project {
  const result = Project.create({
    id: projectId(id),
    name,
  });

  if (!result.isSuccess) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function createAudienceProfile(
  overrides: Partial<AudienceProfileProps> = {},
): AudienceProfile {
  const ageRangeResult = AgeRange.create(7, 9);

  if (!ageRangeResult.isSuccess) {
    throw new Error(ageRangeResult.error.message);
  }

  const audienceProfileResult = AudienceProfile.create({
    ageRange: ageRangeResult.value,
    complexity: 'easy',
    dangerIntensity: 'low',
    scaryContent: 'mild',
    consequenceSeverity: 'gentle',
    conflictStyle: 'balanced',
    sessionLengthMinutes: 60,
    ...overrides,
  });

  if (!audienceProfileResult.isSuccess) {
    throw new Error(audienceProfileResult.error.message);
  }

  return audienceProfileResult.value;
}