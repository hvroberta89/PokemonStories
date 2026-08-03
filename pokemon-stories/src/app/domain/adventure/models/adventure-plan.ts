import { AudienceProfile } from '../../audience/models/audience-profile';
import { ProjectId } from '../../project/value-objects/project-id';
import { failure, Outcome, success } from '../../shared/outcome/outcome';
import { InvalidAdventurePlanError } from '../errors/invalid-adventure-plan.error';
import { AdventurePlanId } from '../value-objects/adventure-plan-id';
import { AdventureSceneId } from '../value-objects/adventure-scene-id';
import { AdventurePlanStatus } from './adventure-plan-status';
import {
  AddAdventureSceneProps,
  AdventureScene,
  UpdateAdventureSceneProps,
} from './adventure-scene';
import { AdventureStory, UpdateAdventureStoryProps } from './adventure-story';
import { CharacterId } from '../../character/value-objects/character-id';

export interface CreateAdventurePlanProps {
  readonly id: AdventurePlanId;
  readonly projectId: ProjectId;
  readonly title: string;
  readonly premise: string;
  readonly audienceProfile: AudienceProfile;
}

export interface RestoreAdventurePlanProps extends CreateAdventurePlanProps {
  readonly status: AdventurePlanStatus;
  readonly scenes: readonly AdventureScene[];
  readonly story: AdventureStory;
  readonly expectedCharacterIds: readonly CharacterId[];
}

export interface UpdateAdventureFoundationProps {
  readonly title: string;
  readonly premise: string;
  readonly audienceProfile: AudienceProfile;
}

export interface AdventureReadiness {
  readonly isReady: boolean;
  readonly missingRequired: readonly ('premise' | 'opening-scene' | 'opening-scene-goal')[];
}

export class AdventurePlan {
  private static readonly maximumTitleLength = 100;
  private static readonly maximumPremiseLength = 1000;

  private constructor(
    public readonly id: AdventurePlanId,
    public readonly projectId: ProjectId,
    public readonly title: string,
    public readonly premise: string,
    public readonly audienceProfile: AudienceProfile,
    public readonly status: AdventurePlanStatus,
    public readonly scenes: readonly AdventureScene[],
    public readonly story: AdventureStory,
    public readonly expectedCharacterIds: readonly CharacterId[] = Object.freeze([]),
  ) {
    Object.freeze(this);
  }

  static create(
    props: CreateAdventurePlanProps,
  ): Outcome<AdventurePlan, InvalidAdventurePlanError> {
    const title = props.title.trim();
    const premise = props.premise.trim();

    const titleValidation = this.validateTitle(title);

    if (!titleValidation.isSuccess) {
      return titleValidation;
    }

    const premiseValidation = this.validatePremise(premise);

    if (!premiseValidation.isSuccess) {
      return premiseValidation;
    }

    return success(
      new AdventurePlan(
        props.id,
        props.projectId,
        title,
        premise,
        props.audienceProfile,
        'draft',
        Object.freeze([]),
        Object.freeze({}),
      ),
    );
  }

  static restore(
    props: RestoreAdventurePlanProps,
  ): Outcome<AdventurePlan, InvalidAdventurePlanError> {
    const created = this.create(props);
    if (!created.isSuccess) return created;

    const storyResult = created.value.updateStory(props.story);
    if (!storyResult.isSuccess) return storyResult;
    let restored = storyResult.value;

    const orderedScenes = [...props.scenes].sort((first, second) => first.order - second.order);
    if (orderedScenes.some((scene, order) => scene.order !== order)) {
      return failure(new InvalidAdventurePlanError('Stored scene order is invalid.'));
    }
    if (orderedScenes.length > 0 && orderedScenes.filter((scene) => scene.isOpening).length !== 1) {
      return failure(new InvalidAdventurePlanError('Stored opening scene is invalid.'));
    }

    for (const scene of orderedScenes) {
      const sceneResult = restored.addScene(scene);
      if (!sceneResult.isSuccess) return sceneResult;
      restored = sceneResult.value;
    }
    const openingScene = orderedScenes.find((scene) => scene.isOpening);
    if (openingScene) {
      const openingResult = restored.selectOpeningScene(openingScene.id);
      if (!openingResult.isSuccess) return openingResult;
      restored = openingResult.value;
    }
    restored = restored.selectExpectedCharacters(props.expectedCharacterIds);

    if ((props.status === 'ready' || props.status === 'completed') && !restored.readiness.isReady) {
      return failure(new InvalidAdventurePlanError('Stored adventure readiness is invalid.'));
    }

    return success(
      new AdventurePlan(
        restored.id,
        restored.projectId,
        restored.title,
        restored.premise,
        restored.audienceProfile,
        props.status,
        restored.scenes,
        restored.story,
        restored.expectedCharacterIds,
      ),
    );
  }

  get readiness(): AdventureReadiness {
    const missingRequired: AdventureReadiness['missingRequired'][number][] = [];
    if (!this.premise.trim()) missingRequired.push('premise');
    const openingScene = this.scenes.find((scene) => scene.isOpening);
    if (!openingScene) missingRequired.push('opening-scene');
    else if (!openingScene.goal.trim()) missingRequired.push('opening-scene-goal');
    return Object.freeze({
      isReady: missingRequired.length === 0,
      missingRequired: Object.freeze(missingRequired),
    });
  }

  markReady(): Outcome<AdventurePlan, InvalidAdventurePlanError> {
    if (!this.readiness.isReady) {
      return failure(
        new InvalidAdventurePlanError(
          'The adventure cannot be ready while required content is missing.',
        ),
      );
    }
    return success(
      new AdventurePlan(
        this.id,
        this.projectId,
        this.title,
        this.premise,
        this.audienceProfile,
        'ready',
        this.scenes,
        this.story,
        this.expectedCharacterIds,
      ),
    );
  }

  complete(): Outcome<AdventurePlan, InvalidAdventurePlanError> {
    if (this.status !== 'ready') {
      return failure(new InvalidAdventurePlanError('Only a ready adventure can be completed.'));
    }
    return success(
      new AdventurePlan(
        this.id,
        this.projectId,
        this.title,
        this.premise,
        this.audienceProfile,
        'completed',
        this.scenes,
        this.story,
        this.expectedCharacterIds,
      ),
    );
  }

  archive(): AdventurePlan {
    return new AdventurePlan(
      this.id,
      this.projectId,
      this.title,
      this.premise,
      this.audienceProfile,
      'archived',
      this.scenes,
      this.story,
      this.expectedCharacterIds,
    );
  }

  restoreForEditing(): AdventurePlan {
    return new AdventurePlan(
      this.id,
      this.projectId,
      this.title,
      this.premise,
      this.audienceProfile,
      'draft',
      this.scenes,
      this.story,
      this.expectedCharacterIds,
    );
  }

  updateFoundation(
    props: UpdateAdventureFoundationProps,
  ): Outcome<AdventurePlan, InvalidAdventurePlanError> {
    if (!this.isEditable()) return this.notEditable();
    const title = props.title.trim();
    const premise = props.premise.trim();
    const titleValidation = AdventurePlan.validateTitle(title);

    if (!titleValidation.isSuccess) return titleValidation;

    const premiseValidation = AdventurePlan.validatePremise(premise);

    if (!premiseValidation.isSuccess) return premiseValidation;

    return success(
      new AdventurePlan(
        this.id,
        this.projectId,
        title,
        premise,
        props.audienceProfile,
        this.status,
        this.scenes,
        this.story,
        this.expectedCharacterIds,
      ),
    );
  }

  addScene(props: AddAdventureSceneProps): Outcome<AdventurePlan, InvalidAdventurePlanError> {
    if (!this.isEditable()) return this.notEditable();
    const title = props.title.trim();
    const description = props.description.trim();
    const goal = props.goal.trim();
    const pokemonReference = this.validatePokemonReferenceId(props.pokemonReferenceId);
    if (!pokemonReference.isSuccess) return pokemonReference;

    if (!title) return failure(new InvalidAdventurePlanError('The scene title cannot be empty.'));
    if (!description) {
      return failure(new InvalidAdventurePlanError('The scene description cannot be empty.'));
    }
    if (!goal) return failure(new InvalidAdventurePlanError('The scene goal cannot be empty.'));
    if (title.length > 120) {
      return failure(
        new InvalidAdventurePlanError('The scene title cannot exceed 120 characters.'),
      );
    }
    if (description.length > 1000) {
      return failure(
        new InvalidAdventurePlanError('The scene description cannot exceed 1000 characters.'),
      );
    }
    if (goal.length > 200) {
      return failure(new InvalidAdventurePlanError('The scene goal cannot exceed 200 characters.'));
    }
    if (this.scenes.some((scene) => scene.id === props.id)) {
      return failure(new InvalidAdventurePlanError('The scene identifier must be unique.'));
    }

    const scene: AdventureScene = Object.freeze({
      id: props.id,
      title,
      description,
      goal,
      pokemonReferenceId: pokemonReference.value,
      order: this.scenes.length,
      isOpening: this.scenes.length === 0,
    });

    return success(
      new AdventurePlan(
        this.id,
        this.projectId,
        this.title,
        this.premise,
        this.audienceProfile,
        this.status,
        Object.freeze([...this.scenes, scene]),
        this.story,
        this.expectedCharacterIds,
      ),
    );
  }

  updateStory(props: UpdateAdventureStoryProps): Outcome<AdventurePlan, InvalidAdventurePlanError> {
    if (!this.isEditable()) return this.notEditable();
    const story = Object.freeze({
      opening: this.normalizeStoryBlock(props.opening),
      development: this.normalizeStoryBlock(props.development),
      climax: this.normalizeStoryBlock(props.climax),
      resolution: this.normalizeStoryBlock(props.resolution),
    });

    if (Object.values(story).some((block) => block !== undefined && block.length > 1500)) {
      return failure(new InvalidAdventurePlanError('A story block cannot exceed 1500 characters.'));
    }

    return success(
      new AdventurePlan(
        this.id,
        this.projectId,
        this.title,
        this.premise,
        this.audienceProfile,
        this.status,
        this.scenes,
        story,
        this.expectedCharacterIds,
      ),
    );
  }

  updateScene(
    sceneId: AdventureSceneId,
    props: UpdateAdventureSceneProps,
  ): Outcome<AdventurePlan, InvalidAdventurePlanError> {
    if (!this.isEditable()) return this.notEditable();
    const index = this.scenes.findIndex((scene) => scene.id === sceneId);
    if (index < 0) return this.sceneNotFound();
    const validated = this.validateScene(props);
    if (!validated.isSuccess) return validated;
    return success(
      this.withScenes(
        this.scenes.map((scene, currentIndex) =>
          currentIndex === index ? Object.freeze({ ...scene, ...validated.value }) : scene,
        ),
      ),
    );
  }

  removeScene(sceneId: AdventureSceneId): Outcome<AdventurePlan, InvalidAdventurePlanError> {
    if (!this.isEditable()) return this.notEditable();
    if (!this.scenes.some((scene) => scene.id === sceneId)) return this.sceneNotFound();
    const remaining = this.scenes.filter((scene) => scene.id !== sceneId);
    const hasOpeningScene = remaining.some((scene) => scene.isOpening);
    return success(
      this.withScenes(
        remaining.map((scene, order) =>
          Object.freeze({
            ...scene,
            order,
            isOpening: hasOpeningScene ? scene.isOpening : order === 0,
          }),
        ),
      ),
    );
  }

  moveScene(
    sceneId: AdventureSceneId,
    direction: 'up' | 'down',
  ): Outcome<AdventurePlan, InvalidAdventurePlanError> {
    if (!this.isEditable()) return this.notEditable();
    const index = this.scenes.findIndex((scene) => scene.id === sceneId);
    if (index < 0) return this.sceneNotFound();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= this.scenes.length) return success(this);
    const reordered = [...this.scenes];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    return success(
      this.withScenes(reordered.map((scene, order) => Object.freeze({ ...scene, order }))),
    );
  }

  selectOpeningScene(sceneId: AdventureSceneId): Outcome<AdventurePlan, InvalidAdventurePlanError> {
    if (!this.isEditable()) return this.notEditable();
    if (!this.scenes.some((scene) => scene.id === sceneId)) return this.sceneNotFound();
    return success(
      this.withScenes(
        this.scenes.map((scene) => Object.freeze({ ...scene, isOpening: scene.id === sceneId })),
      ),
    );
  }

  selectExpectedCharacters(characterIds: readonly CharacterId[]): AdventurePlan {
    const uniqueIds = Object.freeze([...new Set(characterIds)]);
    return new AdventurePlan(
      this.id,
      this.projectId,
      this.title,
      this.premise,
      this.audienceProfile,
      this.status,
      this.scenes,
      this.story,
      uniqueIds,
    );
  }

  private validateScene(
    props: UpdateAdventureSceneProps,
  ): Outcome<Pick<AdventureScene, 'title' | 'description' | 'goal' | 'pokemonReferenceId'>, InvalidAdventurePlanError> {
    const pokemonReference = this.validatePokemonReferenceId(props.pokemonReferenceId);
    if (!pokemonReference.isSuccess) return pokemonReference;
    const value = {
      title: props.title.trim(),
      description: props.description.trim(),
      goal: props.goal.trim(),
      pokemonReferenceId: pokemonReference.value,
    };
    if (!value.title || !value.description || !value.goal) {
      return failure(
        new InvalidAdventurePlanError('Every scene requires a title, description and goal.'),
      );
    }
    if (value.title.length > 120 || value.description.length > 1000 || value.goal.length > 200) {
      return failure(
        new InvalidAdventurePlanError('The scene content exceeds its maximum length.'),
      );
    }
    return success(value);
  }

  private withScenes(scenes: readonly AdventureScene[]): AdventurePlan {
    const updated = new AdventurePlan(
      this.id,
      this.projectId,
      this.title,
      this.premise,
      this.audienceProfile,
      this.status,
      Object.freeze(scenes),
      this.story,
      this.expectedCharacterIds,
    );
    return this.status === 'ready' && !updated.readiness.isReady
      ? new AdventurePlan(
          updated.id,
          updated.projectId,
          updated.title,
          updated.premise,
          updated.audienceProfile,
          'draft',
          updated.scenes,
          updated.story,
          updated.expectedCharacterIds,
        )
      : updated;
  }

  private normalizeStoryBlock(value: string | undefined): string | undefined {
    const normalized = value?.trim();
    return normalized ? normalized : undefined;
  }

  private validatePokemonReferenceId(
    value: string | undefined,
  ): Outcome<string | undefined, InvalidAdventurePlanError> {
    const normalized = value?.trim();
    if (!normalized) return success(undefined);
    if (normalized.length > 120 || !/^[a-z0-9-]+$/i.test(normalized)) {
      return failure(new InvalidAdventurePlanError('The Pokemon reference identifier is invalid.'));
    }
    return success(normalized);
  }

  private sceneNotFound(): Outcome<never, InvalidAdventurePlanError> {
    return failure(new InvalidAdventurePlanError('The scene does not exist in this adventure.'));
  }

  private isEditable(): boolean {
    return this.status === 'draft' || this.status === 'ready';
  }

  private notEditable(): Outcome<never, InvalidAdventurePlanError> {
    return failure(new InvalidAdventurePlanError('A completed adventure cannot be edited.'));
  }

  private static validateTitle(title: string): Outcome<void, InvalidAdventurePlanError> {
    if (title.length === 0) {
      return failure(new InvalidAdventurePlanError('The adventure title cannot be empty.'));
    }

    if (title.length > AdventurePlan.maximumTitleLength) {
      return failure(
        new InvalidAdventurePlanError(
          `The adventure title cannot exceed ${AdventurePlan.maximumTitleLength} characters.`,
        ),
      );
    }

    return success(undefined);
  }

  private static validatePremise(premise: string): Outcome<void, InvalidAdventurePlanError> {
    if (premise.length === 0) {
      return failure(new InvalidAdventurePlanError('The adventure premise cannot be empty.'));
    }

    if (premise.length > AdventurePlan.maximumPremiseLength) {
      return failure(
        new InvalidAdventurePlanError(
          `The adventure premise cannot exceed ${AdventurePlan.maximumPremiseLength} characters.`,
        ),
      );
    }

    return success(undefined);
  }
}
