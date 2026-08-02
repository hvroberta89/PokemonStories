import { TestBed } from '@angular/core/testing';

import { AudienceProfile } from '../../../domain/audience/models/audience-profile';
import { AgeRange } from '../../../domain/audience/value-objects/age-range';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { adventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { adventureSceneId } from '../../../domain/adventure/value-objects/adventure-scene-id';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { RunningSessionStorageService } from './running-session-storage.service';
import { RunningSessionStore } from './running-session.store';

describe('RunningSessionStore', () => {
  it('starts a clean session from the ready adventure opening scene', () => {
    TestBed.configureTestingModule({
      providers: [
        RunningSessionStore,
        {
          provide: RunningSessionStorageService,
          useValue: { load: () => null, save: () => undefined, clear: () => undefined },
        },
      ],
    });
    const store = TestBed.inject(RunningSessionStore);

    store.startFromAdventure(createReadyAdventure());

    expect(store.session().adventureTitle).toBe('Az elveszett tojás');
    expect(store.viewModel().story.locationName).toBe('Virágos tisztás');
    expect(store.viewModel().story.narration).toEqual(['Egy törött fészek hever a fa alatt.']);
    expect(store.viewModel().goal.title).toBe('Találjátok meg az eltűnt tojást.');
    expect(store.viewModel().recentEvents.events).toEqual([]);
  });
});

function createReadyAdventure(): AdventurePlan {
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
  const draft = AdventurePlan.create({
    id: adventurePlanId('adventure-1'),
    projectId: projectId('project-1'),
    title: 'Az elveszett tojás',
    premise: 'Egy eltűnt Pokémon-tojás nyomába eredtek.',
    audienceProfile: profile.value,
  });
  if (!draft.isSuccess) throw draft.error;
  const withScene = draft.value.addScene({
    id: adventureSceneId('scene-1'),
    title: 'Virágos tisztás',
    description: 'Egy törött fészek hever a fa alatt.',
    goal: 'Találjátok meg az eltűnt tojást.',
  });
  if (!withScene.isSuccess) throw withScene.error;
  const ready = withScene.value.markReady();
  if (!ready.isSuccess) throw ready.error;
  return ready.value;
}
