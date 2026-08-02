import { TestBed } from '@angular/core/testing';

import { AudienceProfile } from '../../../domain/audience/models/audience-profile';
import { AgeRange } from '../../../domain/audience/value-objects/age-range';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { adventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { adventureSceneId } from '../../../domain/adventure/value-objects/adventure-scene-id';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { RunningSessionStorageService } from './running-session-storage.service';
import { RunningSessionStore } from './running-session.store';
import { Character } from '../../../domain/character/models/character';
import { characterId } from '../../../domain/character/value-objects/character-id';

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

    const character = Character.create({
      id: characterId('character-1'),
      projectId: projectId('project-1'),
      name: 'Emma',
    });
    if (!character.isSuccess) throw character.error;
    store.startFromAdventure(createReadyAdventure(), [character.value]);

    expect(store.session().adventureTitle).toBe('Az elveszett tojás');
    expect(store.viewModel().story.locationName).toBe('Virágos tisztás');
    expect(store.viewModel().story.narration).toEqual(['Egy törött fészek hever a fa alatt.']);
    expect(store.viewModel().goal.title).toBe('Találjátok meg az eltűnt tojást.');
    expect(store.viewModel().recentEvents.events).toEqual([]);
    expect(store.viewModel().characters.characters[0]?.name).toBe('Emma');
    expect(store.session().participants).toEqual([{ id: 'character-1', name: 'Emma' }]);

    expect(store.nextScene()).toBe(true);
    expect(store.viewModel().story.locationName).toBe('Erdei ösvény');
    expect(store.viewModel().goal.title).toBe('Kövessétek a lábnyomokat.');
    expect(store.viewModel().recentEvents.events[0]?.title).toBe('Jelenetváltás: Erdei ösvény');
    expect(store.nextScene()).toBe(false);

    store.completeSession();
    expect(store.status()).toBe('review-pending');
    store.completeReview();
    expect(store.status()).toBe('completed');
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
  const withSecondScene = withScene.value.addScene({
    id: adventureSceneId('scene-2'),
    title: 'Erdei ösvény',
    description: 'Apró lábnyomok vezetnek a sűrűbe.',
    goal: 'Kövessétek a lábnyomokat.',
  });
  if (!withSecondScene.isSuccess) throw withSecondScene.error;
  const ready = withSecondScene.value.markReady();
  if (!ready.isSuccess) throw ready.error;
  return ready.value;
}
