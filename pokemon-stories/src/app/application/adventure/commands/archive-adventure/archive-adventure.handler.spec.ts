import { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import { AudienceProfile } from '../../../../domain/audience/models/audience-profile';
import { AgeRange } from '../../../../domain/audience/value-objects/age-range';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { adventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { InMemoryAdventurePlanRepository } from '../../../../infrastructure/adventure/repositories/in-memory-adventure-plan.repository';
import type { ProjectSessionReader } from '../../../session/ports/project-session-reader';
import { ArchiveAdventureHandler } from './archive-adventure.handler';

describe('ArchiveAdventureHandler', () => {
  const adventureResult = AdventurePlan.create({
    id: adventurePlanId('adventure-1'), projectId: projectId('project-1'), title: 'Erdei kaland',
    premise: 'A csapat egy elveszett tojást keres.', audienceProfile: audience(),
  });
  if (!adventureResult.isSuccess) throw adventureResult.error;

  it('archives an Adventure when it has no active Session', async () => {
    const repository = new InMemoryAdventurePlanRepository();
    const result = await new ArchiveAdventureHandler(noActiveSession(), repository).execute(adventureResult.value);

    expect(result).toMatchObject({ isSuccess: true, value: { status: 'archived' } });
    expect((await repository.findById(adventurePlanId('adventure-1')))?.status).toBe('archived');
  });

  it('does not archive the Adventure played by an active Session', async () => {
    const repository = new InMemoryAdventurePlanRepository();
    const result = await new ArchiveAdventureHandler(activeSession(), repository).execute(adventureResult.value);

    expect(result).toEqual({ isSuccess: false, code: 'ACTIVE_SESSION' });
    expect(repository.getAll()).toHaveLength(0);
  });
});

function audience(): AudienceProfile {
  const ageRange = AgeRange.create(7, 9);
  if (!ageRange.isSuccess) throw ageRange.error;
  const result = AudienceProfile.create({
    ageRange: ageRange.value, complexity: 'easy', dangerIntensity: 'low', scaryContent: 'mild',
    consequenceSeverity: 'gentle', conflictStyle: 'balanced', sessionLengthMinutes: 60,
  });
  if (!result.isSuccess) throw result.error;
  return result.value;
}

function noActiveSession(): ProjectSessionReader {
  return { findByProject: async () => null, listCompletedByProject: async () => [], findCompletedById: async () => null };
}

function activeSession(): ProjectSessionReader {
  return {
    ...noActiveSession(),
    findByProject: async () => ({
      sessionId: 'session-1', projectId: projectId('project-1'), adventureId: 'adventure-1',
      adventureTitle: 'Erdei kaland', currentSceneTitle: 'Tisztás', currentGoal: 'Keresés',
      startedAt: '2026-08-03T10:00:00.000Z', status: 'running',
    }),
  };
}