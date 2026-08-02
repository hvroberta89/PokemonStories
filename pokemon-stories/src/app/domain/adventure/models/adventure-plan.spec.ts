import { AudienceProfile, AudienceProfileProps } from '../../audience/models/audience-profile';
import { AgeRange } from '../../audience/value-objects/age-range';
import { projectId } from '../../project/value-objects/project-id';
import { characterId } from '../../character/value-objects/character-id';
import { adventureSceneId } from '../value-objects/adventure-scene-id';
import { adventurePlanId } from '../value-objects/adventure-plan-id';
import { AdventurePlan, CreateAdventurePlanProps } from './adventure-plan';

describe('AdventurePlan', () => {
  it('should create a draft adventure plan', () => {
    const result = createAdventurePlan();

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.id).toBe('adventure-1');
      expect(result.value.projectId).toBe('project-1');
      expect(result.value.title).toBe('Az eltűnt Pokémon-tojás');
      expect(result.value.premise).toBe('A játékosok egy eltűnt Pokémon-tojás nyomába erednek.');
      expect(result.value.status).toBe('draft');
    }
  });

  it('should trim the title and premise', () => {
    const result = createAdventurePlan({
      title: '  Erdei rejtély  ',
      premise: '  Furcsa hangok hallatszanak az erdőből.  ',
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.title).toBe('Erdei rejtély');
      expect(result.value.premise).toBe('Furcsa hangok hallatszanak az erdőből.');
    }
  });

  it('should reject an empty title', () => {
    const result = createAdventurePlan({
      title: '   ',
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.code).toBe('INVALID_ADVENTURE_PLAN');
      expect(result.error.message).toContain('title cannot be empty');
    }
  });

  it('should reject a title longer than 100 characters', () => {
    const result = createAdventurePlan({
      title: 'a'.repeat(101),
    });

    expect(result.isSuccess).toBe(false);
  });

  it('should reject an empty premise', () => {
    const result = createAdventurePlan({
      premise: '   ',
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.message).toContain('premise cannot be empty');
    }
  });

  it('should reject a premise longer than 1000 characters', () => {
    const result = createAdventurePlan({
      premise: 'a'.repeat(1001),
    });

    expect(result.isSuccess).toBe(false);
  });

  it('should keep the audience profile', () => {
    const audienceProfile = getAudienceProfile({
      sessionLengthMinutes: 90,
    });

    const result = createAdventurePlan({
      audienceProfile,
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.audienceProfile).toBe(audienceProfile);
      expect(result.value.audienceProfile.sessionLengthMinutes).toBe(90);
    }
  });

  it('should create an immutable adventure plan', () => {
    const result = createAdventurePlan();

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(Object.isFrozen(result.value)).toBe(true);
    }
  });

  it('should update the foundation immutably', () => {
    const originalResult = createAdventurePlan();
    const audienceProfile = getAudienceProfile({ sessionLengthMinutes: 90 });

    expect(originalResult.isSuccess).toBe(true);
    if (!originalResult.isSuccess) return;

    const updatedResult = originalResult.value.updateFoundation({
      title: '  A titkos liget  ',
      premise: '  Egy rejtett ösvény új helyre vezet.  ',
      audienceProfile,
    });

    expect(updatedResult.isSuccess).toBe(true);
    if (!updatedResult.isSuccess) return;

    expect(updatedResult.value).not.toBe(originalResult.value);
    expect(updatedResult.value.title).toBe('A titkos liget');
    expect(updatedResult.value.premise).toBe('Egy rejtett ösvény új helyre vezet.');
    expect(updatedResult.value.audienceProfile).toBe(audienceProfile);
    expect(updatedResult.value.id).toBe(originalResult.value.id);
    expect(originalResult.value.title).not.toBe('A titkos liget');
  });

  it('should add the first scene as the opening scene', () => {
    const adventureResult = createAdventurePlan();
    expect(adventureResult.isSuccess).toBe(true);
    if (!adventureResult.isSuccess) return;

    const result = adventureResult.value.addScene({
      id: adventureSceneId('scene-1'),
      title: 'Virágos tisztás',
      description: 'Egy összetört fészek hever az öreg fa alatt.',
      goal: 'Találjátok meg az eltűnt tojást.',
    });

    expect(result.isSuccess).toBe(true);
    if (!result.isSuccess) return;
    expect(result.value.scenes).toHaveLength(1);
    expect(result.value.scenes[0].isOpening).toBe(true);
    expect(result.value.scenes[0].order).toBe(0);
    expect(adventureResult.value.scenes).toEqual([]);
  });

  it('should require a goal for every scene', () => {
    const adventureResult = createAdventurePlan();
    expect(adventureResult.isSuccess).toBe(true);
    if (!adventureResult.isSuccess) return;

    const result = adventureResult.value.addScene({
      id: adventureSceneId('scene-1'),
      title: 'Virágos tisztás',
      description: 'Egy összetört fészek hever az öreg fa alatt.',
      goal: '   ',
    });

    expect(result.isSuccess).toBe(false);
  });

  it('should reorder scenes without changing the opening scene', () => {
    const adventureResult = createAdventurePlan();
    if (!adventureResult.isSuccess) throw adventureResult.error;
    const first = adventureResult.value.addScene({
      id: adventureSceneId('scene-1'),
      title: 'Első',
      description: 'Első leírás.',
      goal: 'Első cél.',
    });
    if (!first.isSuccess) throw first.error;
    const second = first.value.addScene({
      id: adventureSceneId('scene-2'),
      title: 'Második',
      description: 'Második leírás.',
      goal: 'Második cél.',
    });
    if (!second.isSuccess) throw second.error;

    const moved = second.value.moveScene(adventureSceneId('scene-2'), 'up');
    expect(moved.isSuccess).toBe(true);
    if (!moved.isSuccess) return;
    expect(moved.value.scenes.map((scene) => scene.id)).toEqual(['scene-2', 'scene-1']);
    expect(moved.value.scenes.find((scene) => scene.isOpening)?.id).toBe('scene-1');
  });

  it('should promote the first remaining scene when the opening scene is removed', () => {
    const adventureResult = createAdventurePlan();
    if (!adventureResult.isSuccess) throw adventureResult.error;
    const first = adventureResult.value.addScene({
      id: adventureSceneId('scene-1'),
      title: 'Első',
      description: 'Első leírás.',
      goal: 'Első cél.',
    });
    if (!first.isSuccess) throw first.error;
    const second = first.value.addScene({
      id: adventureSceneId('scene-2'),
      title: 'Második',
      description: 'Második leírás.',
      goal: 'Második cél.',
    });
    if (!second.isSuccess) throw second.error;

    const removed = second.value.removeScene(adventureSceneId('scene-1'));
    expect(removed.isSuccess).toBe(true);
    if (!removed.isSuccess) return;
    expect(removed.value.scenes[0].id).toBe('scene-2');
    expect(removed.value.scenes[0].isOpening).toBe(true);
    expect(removed.value.scenes[0].order).toBe(0);
  });

  it('should explicitly select exactly one opening scene', () => {
    const adventureResult = createAdventurePlan();
    if (!adventureResult.isSuccess) throw adventureResult.error;
    const first = adventureResult.value.addScene({
      id: adventureSceneId('scene-1'),
      title: 'Első',
      description: 'Első leírás.',
      goal: 'Első cél.',
    });
    if (!first.isSuccess) throw first.error;
    const second = first.value.addScene({
      id: adventureSceneId('scene-2'),
      title: 'Második',
      description: 'Második leírás.',
      goal: 'Második cél.',
    });
    if (!second.isSuccess) throw second.error;

    const selected = second.value.selectOpeningScene(adventureSceneId('scene-2'));
    expect(selected.isSuccess).toBe(true);
    if (!selected.isSuccess) return;
    expect(selected.value.scenes.filter((scene) => scene.isOpening)).toHaveLength(1);
    expect(selected.value.scenes.find((scene) => scene.isOpening)?.id).toBe('scene-2');
  });

  it('should update the story outline without changing scenes', () => {
    const adventureResult = createAdventurePlan();
    if (!adventureResult.isSuccess) throw adventureResult.error;
    const withScene = adventureResult.value.addScene({
      id: adventureSceneId('scene-1'),
      title: 'Virágos tisztás',
      description: 'Egy összetört fészek hever az öreg fa alatt.',
      goal: 'Találjátok meg az eltűnt tojást.',
    });
    if (!withScene.isSuccess) throw withScene.error;

    const result = withScene.value.updateStory({
      opening: '  A csapat különös lábnyomokra bukkan.  ',
      climax: 'A tojás veszélybe kerül.',
    });

    expect(result.isSuccess).toBe(true);
    if (!result.isSuccess) return;
    expect(result.value.story.opening).toBe('A csapat különös lábnyomokra bukkan.');
    expect(result.value.story.development).toBeUndefined();
    expect(result.value.scenes).toBe(withScene.value.scenes);
  });

  it('should require an explicit transition after readiness requirements are met', () => {
    const adventureResult = createAdventurePlan();
    if (!adventureResult.isSuccess) throw adventureResult.error;
    expect(adventureResult.value.readiness.isReady).toBe(false);
    expect(adventureResult.value.markReady().isSuccess).toBe(false);

    const withOpening = adventureResult.value.addScene({
      id: adventureSceneId('scene-1'),
      title: 'Virágos tisztás',
      description: 'Egy összetört fészek hever az öreg fa alatt.',
      goal: 'Találjátok meg az eltűnt tojást.',
    });
    if (!withOpening.isSuccess) throw withOpening.error;
    expect(withOpening.value.readiness.isReady).toBe(true);
    expect(withOpening.value.status).toBe('draft');

    const ready = withOpening.value.markReady();
    expect(ready.isSuccess).toBe(true);
    if (!ready.isSuccess) return;
    expect(ready.value.status).toBe('ready');
  });

  it('should return a ready adventure to draft when its last scene is removed', () => {
    const adventureResult = createAdventurePlan();
    if (!adventureResult.isSuccess) throw adventureResult.error;
    const withOpening = adventureResult.value.addScene({
      id: adventureSceneId('scene-1'),
      title: 'Virágos tisztás',
      description: 'Egy összetört fészek hever az öreg fa alatt.',
      goal: 'Találjátok meg az eltűnt tojást.',
    });
    if (!withOpening.isSuccess) throw withOpening.error;
    const ready = withOpening.value.markReady();
    if (!ready.isSuccess) throw ready.error;

    const removed = ready.value.removeScene(adventureSceneId('scene-1'));
    expect(removed.isSuccess).toBe(true);
    if (!removed.isSuccess) return;
    expect(removed.value.status).toBe('draft');
    expect(removed.value.readiness.isReady).toBe(false);
  });

  it('should only complete an adventure after it becomes ready', () => {
    const draft = createAdventurePlan();
    if (!draft.isSuccess) throw draft.error;
    expect(draft.value.complete().isSuccess).toBe(false);
    const withOpening = draft.value.addScene({
      id: adventureSceneId('scene-1'),
      title: 'Virágos tisztás',
      description: 'Egy összetört fészek hever az öreg fa alatt.',
      goal: 'Találjátok meg az eltűnt tojást.',
    });
    if (!withOpening.isSuccess) throw withOpening.error;
    const ready = withOpening.value.markReady();
    if (!ready.isSuccess) throw ready.error;

    const completed = ready.value.complete();

    expect(completed.isSuccess).toBe(true);
    if (completed.isSuccess) expect(completed.value.status).toBe('completed');
  });

  it('should belong to a project', () => {
    const result = createAdventurePlan({
      projectId: projectId('kanto-project'),
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.projectId).toBe('kanto-project');
    }
  });

  it('stores a unique default character team', () => {
    const result = createAdventurePlan();
    if (!result.isSuccess) throw result.error;

    const updated = result.value.selectExpectedCharacters([
      characterId('emma'),
      characterId('emma'),
      characterId('marci'),
    ]);

    expect(updated.expectedCharacterIds).toEqual(['emma', 'marci']);
  });

  it('restores a complete persisted aggregate', () => {
    const result = AdventurePlan.restore({
      id: adventurePlanId('adventure-1'),
      projectId: projectId('project-1'),
      title: 'Erdei rejtély',
      premise: 'Egy különös nyom az erdőbe vezet.',
      audienceProfile: getAudienceProfile(),
      status: 'ready',
      story: { opening: 'A csapat megérkezik az erdő széléhez.' },
      scenes: [
        {
          id: adventureSceneId('scene-1'),
          title: 'Erdei ösvény',
          description: 'Árnyas ösvény vezet a fák közé.',
          goal: 'Találjátok meg a nyom forrását.',
          order: 0,
          isOpening: true,
        },
      ],
      expectedCharacterIds: [characterId('emma')],
    });

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.status).toBe('ready');
      expect(result.value.scenes[0].id).toBe('scene-1');
      expect(result.value.expectedCharacterIds).toEqual(['emma']);
    }
  });
});

function createAdventurePlan(overrides: Partial<CreateAdventurePlanProps> = {}) {
  return AdventurePlan.create({
    id: adventurePlanId('adventure-1'),
    projectId: projectId('project-1'),
    title: 'Az eltűnt Pokémon-tojás',
    premise: 'A játékosok egy eltűnt Pokémon-tojás nyomába erednek.',
    audienceProfile: getAudienceProfile(),
    ...overrides,
  });
}

function getAudienceProfile(overrides: Partial<AudienceProfileProps> = {}): AudienceProfile {
  const ageRangeResult = AgeRange.create(7, 9);

  if (!ageRangeResult.isSuccess) {
    throw new Error(ageRangeResult.error.message);
  }

  const profileResult = AudienceProfile.create({
    ageRange: ageRangeResult.value,
    complexity: 'easy',
    dangerIntensity: 'low',
    scaryContent: 'mild',
    consequenceSeverity: 'gentle',
    conflictStyle: 'balanced',
    sessionLengthMinutes: 60,
    ...overrides,
  });

  if (!profileResult.isSuccess) {
    throw new Error(profileResult.error.message);
  }

  return profileResult.value;
}
