import { TestBed } from '@angular/core/testing';

import { ADVENTURE_PLAN_READER } from '../../../application/adventure/tokens/adventure-plan.tokens';
import { ProjectSessionReader } from '../../../application/session/ports/project-session-reader';
import { PROJECT_SESSION_READER } from '../../../application/session/tokens/project-session.tokens';
import { AudienceProfile } from '../../../domain/audience/models/audience-profile';
import { AgeRange } from '../../../domain/audience/value-objects/age-range';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { adventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { InMemoryAdventurePlanRepository } from '../../../infrastructure/adventure/repositories/in-memory-adventure-plan.repository';
import { AdventureOverviewStore } from './adventure-overview.store';

describe('AdventureOverviewStore', () => {
  it('loads the project-scoped adventure and its sessions', async () => {
    const adventures = new InMemoryAdventurePlanRepository();
    await adventures.save(createAdventure());
    const sessions: ProjectSessionReader = {
      findByProject: () => null,
      findCompletedById: () => null,
      listCompletedByProject: (id) => [
        {
          sessionId: 'session-1',
          projectId: id,
          adventureId: 'adventure-1',
          adventureTitle: 'Az elveszett tojás',
          finalSceneTitle: 'Öreg híd',
          startedAt: '2026-08-02T10:00:00.000Z',
          completedAt: '2026-08-02T11:00:00.000Z',
          eventCount: 2,
          rewardCount: 1,
        },
      ],
    };
    TestBed.configureTestingModule({
      providers: [
        AdventureOverviewStore,
        { provide: ADVENTURE_PLAN_READER, useValue: adventures },
        { provide: PROJECT_SESSION_READER, useValue: sessions },
      ],
    });
    const store = TestBed.inject(AdventureOverviewStore);

    await store.load(projectId('project-1'), adventurePlanId('adventure-1'));

    expect(store.adventure()?.title).toBe('Az elveszett tojás');
    expect(store.latestSession()?.sessionId).toBe('session-1');
  });

  it('rejects an adventure from another project', async () => {
    const adventures = new InMemoryAdventurePlanRepository();
    await adventures.save(createAdventure());
    const sessions: ProjectSessionReader = {
      findByProject: () => null,
      findCompletedById: () => null,
      listCompletedByProject: () => [],
    };
    TestBed.configureTestingModule({
      providers: [
        AdventureOverviewStore,
        { provide: ADVENTURE_PLAN_READER, useValue: adventures },
        { provide: PROJECT_SESSION_READER, useValue: sessions },
      ],
    });
    const store = TestBed.inject(AdventureOverviewStore);

    await store.load(projectId('other-project'), adventurePlanId('adventure-1'));

    expect(store.isNotFound()).toBe(true);
  });
});

function createAdventure(): AdventurePlan {
  const range = AgeRange.create(7, 9);
  if (!range.isSuccess) throw range.error;
  const profile = AudienceProfile.create({
    ageRange: range.value,
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
    premise: 'Egy elveszett tojás nyomába eredtek.',
    audienceProfile: profile.value,
  });
  if (!result.isSuccess) throw result.error;
  return result.value;
}
