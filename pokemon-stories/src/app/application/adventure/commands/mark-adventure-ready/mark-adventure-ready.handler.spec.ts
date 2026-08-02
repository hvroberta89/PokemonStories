import { AudienceProfile } from '../../../../domain/audience/models/audience-profile';
import { AgeRange } from '../../../../domain/audience/value-objects/age-range';
import { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import { adventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { adventureSceneId } from '../../../../domain/adventure/value-objects/adventure-scene-id';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { InMemoryAdventurePlanRepository } from '../../../../infrastructure/adventure/repositories/in-memory-adventure-plan.repository';
import { MarkAdventureReadyHandler } from './mark-adventure-ready.handler';

describe('MarkAdventureReadyHandler', () => {
  it('should persist the explicit ready transition', async () => {
    const repository = new InMemoryAdventurePlanRepository();
    const adventure = createAdventure();
    const withScene = adventure.addScene({
      id: adventureSceneId('scene-1'),
      title: 'Virágos tisztás',
      description: 'Egy összetört fészek hever az öreg fa alatt.',
      goal: 'Találjátok meg az eltűnt tojást.',
    });
    if (!withScene.isSuccess) throw withScene.error;
    await repository.save(withScene.value);
    const handler = new MarkAdventureReadyHandler(repository);

    const result = await handler.execute({
      projectId: projectId('project-1'),
      adventurePlanId: adventurePlanId('adventure-1'),
    });

    expect(result.isSuccess).toBe(true);
    expect((await repository.findById(adventurePlanId('adventure-1')))?.status).toBe('ready');
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
