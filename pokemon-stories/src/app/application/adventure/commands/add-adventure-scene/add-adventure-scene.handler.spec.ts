import { AudienceProfile } from '../../../../domain/audience/models/audience-profile';
import { AgeRange } from '../../../../domain/audience/value-objects/age-range';
import { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import { adventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { InMemoryAdventurePlanRepository } from '../../../../infrastructure/adventure/repositories/in-memory-adventure-plan.repository';
import { FixedIdGenerator } from '../../../../infrastructure/shared/identifiers/fixed-id.generator';
import { AddAdventureSceneHandler } from './add-adventure-scene.handler';

describe('AddAdventureSceneHandler', () => {
  it('should add and persist a scene', async () => {
    const repository = new InMemoryAdventurePlanRepository();
    await repository.save(createAdventure());
    const handler = new AddAdventureSceneHandler(repository, new FixedIdGenerator('scene-1'));

    const result = await handler.execute({
      projectId: projectId('project-1'),
      adventurePlanId: adventurePlanId('adventure-1'),
      title: 'Virágos tisztás',
      description: 'Egy összetört fészek hever az öreg fa alatt.',
      goal: 'Találjátok meg az eltűnt tojást.',
      pokemonReferenceId: 'pikachu',
    });

    expect(result.isSuccess).toBe(true);
    const stored = await repository.findById(adventurePlanId('adventure-1'));
    expect(stored?.scenes[0].id).toBe('scene-1');
    expect(stored?.scenes[0].isOpening).toBe(true);
    expect(stored?.scenes[0].pokemonReferenceId).toBe('pikachu');
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
  const adventure = AdventurePlan.create({
    id: adventurePlanId('adventure-1'),
    projectId: projectId('project-1'),
    title: 'Az elveszett tojás',
    premise: 'Különös lábnyomok vezetnek az erdőbe.',
    audienceProfile: profile.value,
  });
  if (!adventure.isSuccess) throw adventure.error;
  return adventure.value;
}
