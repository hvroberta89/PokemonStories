import { AudienceProfile } from '../../../../domain/audience/models/audience-profile';
import { AgeRange } from '../../../../domain/audience/value-objects/age-range';
import { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import { adventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { InMemoryAdventurePlanRepository } from '../../../../infrastructure/adventure/repositories/in-memory-adventure-plan.repository';
import { UpdateAdventureStoryHandler } from './update-adventure-story.handler';

describe('UpdateAdventureStoryHandler', () => {
  it('should persist the reviewed story outline', async () => {
    const repository = new InMemoryAdventurePlanRepository();
    await repository.save(createAdventure());
    const handler = new UpdateAdventureStoryHandler(repository);

    const result = await handler.execute({
      projectId: projectId('project-1'),
      adventurePlanId: adventurePlanId('adventure-1'),
      opening: 'A csapat különös lábnyomokra bukkan.',
      resolution: 'A tojás biztonságban hazakerül.',
    });

    expect(result.isSuccess).toBe(true);
    const stored = await repository.findById(adventurePlanId('adventure-1'));
    expect(stored?.story.resolution).toBe('A tojás biztonságban hazakerül.');
  });
});

function createAdventure(): AdventurePlan {
  const ageRange = AgeRange.create(7, 9);
  if (!ageRange.isSuccess) throw ageRange.error;
  const profile = AudienceProfile.create({
    ageRange: ageRange.value,
    complexity: 'easy',
    dangerIntensity: 'low',
    scaryContent: 'mild',
    consequenceSeverity: 'gentle',
    conflictStyle: 'balanced',
    sessionLengthMinutes: 60,
  });
  if (!profile.isSuccess) throw profile.error;
  const result = AdventurePlan.create({
    id: adventurePlanId('adventure-1'),
    projectId: projectId('project-1'),
    title: 'Az elveszett tojás',
    premise: 'Különös lábnyomok vezetnek az erdőbe.',
    audienceProfile: profile.value,
  });
  if (!result.isSuccess) throw result.error;
  return result.value;
}
