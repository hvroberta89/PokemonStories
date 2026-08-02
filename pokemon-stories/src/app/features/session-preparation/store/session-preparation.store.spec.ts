import { TestBed } from '@angular/core/testing';

import {
  ADVENTURE_PLAN_READER,
  ADVENTURE_PLAN_REPOSITORY,
} from '../../../application/adventure/tokens/adventure-plan.tokens';
import {
  CHARACTER_READER,
  CHARACTER_REPOSITORY,
} from '../../../application/character/tokens/character.tokens';
import { AudienceProfile } from '../../../domain/audience/models/audience-profile';
import { AgeRange } from '../../../domain/audience/value-objects/age-range';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { adventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { adventureSceneId } from '../../../domain/adventure/value-objects/adventure-scene-id';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { InMemoryAdventurePlanRepository } from '../../../infrastructure/adventure/repositories/in-memory-adventure-plan.repository';
import { SessionPreparationStore } from './session-preparation.store';
import { InMemoryCharacterRepository } from '../../../infrastructure/character/repositories/in-memory-character.repository';

describe('SessionPreparationStore', () => {
  let repository: InMemoryAdventurePlanRepository;
  let store: SessionPreparationStore;

  beforeEach(() => {
    repository = new InMemoryAdventurePlanRepository();
    TestBed.configureTestingModule({
      providers: [
        SessionPreparationStore,
        { provide: ADVENTURE_PLAN_READER, useValue: repository },
        { provide: ADVENTURE_PLAN_REPOSITORY, useValue: repository },
        { provide: CHARACTER_READER, useValue: new InMemoryCharacterRepository() },
        { provide: CHARACTER_REPOSITORY, useValue: new InMemoryCharacterRepository() },
      ],
    });
    store = TestBed.inject(SessionPreparationStore);
  });

  it('loads a ready adventure for preparation', async () => {
    const draft = createAdventure();
    const withScene = draft.addScene({
      id: adventureSceneId('scene-1'),
      title: 'Virágos tisztás',
      description: 'Egy összetört fészek hever az öreg fa alatt.',
      goal: 'Találjátok meg az eltűnt tojást.',
    });
    if (!withScene.isSuccess) throw withScene.error;
    const ready = withScene.value.markReady();
    if (!ready.isSuccess) throw ready.error;
    await repository.save(ready.value);

    await store.load(projectId('project-1'), adventurePlanId('adventure-1'));

    expect(store.status()).toBe('loaded');
    expect(store.adventure()?.title).toBe('Az elveszett tojás');
  });

  it('does not expose a draft adventure as prepared', async () => {
    await repository.save(createAdventure());

    await store.load(projectId('project-1'), adventurePlanId('adventure-1'));

    expect(store.isNotFound()).toBe(true);
    expect(store.adventure()).toBeNull();
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
