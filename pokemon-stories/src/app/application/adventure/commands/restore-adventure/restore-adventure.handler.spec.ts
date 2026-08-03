import { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import { AudienceProfile } from '../../../../domain/audience/models/audience-profile';
import { AgeRange } from '../../../../domain/audience/value-objects/age-range';
import { adventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { InMemoryAdventurePlanRepository } from '../../../../infrastructure/adventure/repositories/in-memory-adventure-plan.repository';
import { RestoreAdventureHandler } from './restore-adventure.handler';

describe('RestoreAdventureHandler', () => {
  it('restores an archived Adventure as a draft while preserving its story foundation', async () => {
    const ageRange = AgeRange.create(7, 9);
    if (!ageRange.isSuccess) throw ageRange.error;
    const audience = AudienceProfile.create({
      ageRange: ageRange.value, complexity: 'easy', dangerIntensity: 'low', scaryContent: 'mild',
      consequenceSeverity: 'gentle', conflictStyle: 'balanced', sessionLengthMinutes: 60,
    });
    if (!audience.isSuccess) throw audience.error;
    const created = AdventurePlan.create({
      id: adventurePlanId('adventure-1'), projectId: projectId('project-1'), title: 'Erdei kaland',
      premise: 'A csapat egy elveszett tojást keres.', audienceProfile: audience.value,
    });
    if (!created.isSuccess) throw created.error;
    const repository = new InMemoryAdventurePlanRepository();

    const restored = await new RestoreAdventureHandler(repository).execute(created.value.archive());

    expect(restored).toMatchObject({ status: 'draft', title: 'Erdei kaland' });
    expect((await repository.findById(adventurePlanId('adventure-1')))?.premise).toBe(
      'A csapat egy elveszett tojást keres.',
    );
  });
});