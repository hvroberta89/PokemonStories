import { AudienceProfile } from '../../../../domain/audience/models/audience-profile';
import { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import { adventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { AgeRange } from '../../../../domain/audience/value-objects/age-range';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { InMemoryAdventurePlanRepository } from '../../../../infrastructure/adventure/repositories/in-memory-adventure-plan.repository';
import { UpdateAdventureFoundationHandler } from './update-adventure-foundation.handler';

describe('UpdateAdventureFoundationHandler', () => {
  it('should update and persist an adventure foundation', async () => {
    const repository = new InMemoryAdventurePlanRepository();
    const original = createAdventure('adventure-1', 'Kezdő kaland');
    await repository.save(original);
    const handler = new UpdateAdventureFoundationHandler(repository);

    const result = await handler.execute({
      projectId: projectId('project-1'),
      adventurePlanId: adventurePlanId('adventure-1'),
      title: 'A titkos liget',
      premise: 'Egy rejtett ösvény új helyre vezet.',
      audienceProfile: createAudienceProfile(90),
    });

    expect(result.isSuccess).toBe(true);
    expect((await repository.findById(adventurePlanId('adventure-1')))?.title).toBe(
      'A titkos liget',
    );
  });

  it('should reject an adventure from another project context', async () => {
    const repository = new InMemoryAdventurePlanRepository();
    await repository.save(createAdventure('adventure-1', 'Kezdő kaland'));
    const handler = new UpdateAdventureFoundationHandler(repository);

    const result = await handler.execute({
      projectId: projectId('project-2'),
      adventurePlanId: adventurePlanId('adventure-1'),
      title: 'Más cím',
      premise: 'Más alapötlet.',
      audienceProfile: createAudienceProfile(60),
    });

    expect(result.isSuccess).toBe(false);
    if (!result.isSuccess) expect(result.error.code).toBe('ADVENTURE_PLAN_NOT_FOUND');
  });
});

function createAdventure(id: string, title: string): AdventurePlan {
  const result = AdventurePlan.create({
    id: adventurePlanId(id),
    projectId: projectId('project-1'),
    title,
    premise: 'Egy különös kaland veszi kezdetét.',
    audienceProfile: createAudienceProfile(60),
  });
  if (!result.isSuccess) throw result.error;
  return result.value;
}

function createAudienceProfile(sessionLengthMinutes: number): AudienceProfile {
  const ageRange = AgeRange.create(7, 9);
  if (!ageRange.isSuccess) throw ageRange.error;
  const result = AudienceProfile.create({
    ageRange: ageRange.value,
    complexity: 'easy',
    dangerIntensity: 'low',
    scaryContent: 'mild',
    consequenceSeverity: 'gentle',
    conflictStyle: 'balanced',
    sessionLengthMinutes,
  });
  if (!result.isSuccess) throw result.error;
  return result.value;
}
