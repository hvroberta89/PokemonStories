import { TestBed } from '@angular/core/testing';

import { ADVENTURE_PLAN_READER } from '../../../application/adventure/tokens/adventure-plan.tokens';
import { PROJECT_READER } from '../../../application/project/tokens/project.tokens';
import { AudienceProfile } from '../../../domain/audience/models/audience-profile';
import { AgeRange } from '../../../domain/audience/value-objects/age-range';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { adventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { adventureSceneId } from '../../../domain/adventure/value-objects/adventure-scene-id';
import { Project } from '../../../domain/project/models/project';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { InMemoryAdventurePlanRepository } from '../../../infrastructure/adventure/repositories/in-memory-adventure-plan.repository';
import { InMemoryProjectRepository } from '../../../infrastructure/project/repositories/in-memory-project.repository';
import { AdventureListStore } from './adventure-list.store';

describe('AdventureListStore', () => {
  it('groups project adventures by lifecycle status', async () => {
    const projects = new InMemoryProjectRepository();
    const adventures = new InMemoryAdventurePlanRepository();
    const project = Project.create({ id: projectId('project-1'), name: 'Kanto kalandok' });
    if (!project.isSuccess) throw project.error;
    await projects.save(project.value);
    await adventures.save(createAdventure('draft-1', 'Tervezett kaland', 'draft'));
    await adventures.save(createAdventure('ready-1', 'Kész kaland', 'ready'));
    await adventures.save(createAdventure('completed-1', 'Lezárt kaland', 'completed'));
    TestBed.configureTestingModule({
      providers: [
        AdventureListStore,
        { provide: PROJECT_READER, useValue: projects },
        { provide: ADVENTURE_PLAN_READER, useValue: adventures },
      ],
    });
    const store = TestBed.inject(AdventureListStore);

    await store.load('project-1');

    expect(store.draftAdventures()).toHaveLength(1);
    expect(store.readyAdventures()).toHaveLength(1);
    expect(store.completedAdventures()).toHaveLength(1);
  });
});

function createAdventure(
  id: string,
  title: string,
  status: 'draft' | 'ready' | 'completed',
): AdventurePlan {
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
  const draft = AdventurePlan.create({
    id: adventurePlanId(id),
    projectId: projectId('project-1'),
    title,
    premise: 'Egy új kaland kezdődik.',
    audienceProfile: profile.value,
  });
  if (!draft.isSuccess) throw draft.error;
  if (status === 'draft') return draft.value;
  const withScene = draft.value.addScene({
    id: adventureSceneId(`${id}-scene`),
    title: 'Nyitány',
    description: 'A csapat útnak indul.',
    goal: 'Találjátok meg a nyomot.',
  });
  if (!withScene.isSuccess) throw withScene.error;
  const ready = withScene.value.markReady();
  if (!ready.isSuccess) throw ready.error;
  if (status === 'ready') return ready.value;
  const completed = ready.value.complete();
  if (!completed.isSuccess) throw completed.error;
  return completed.value;
}
