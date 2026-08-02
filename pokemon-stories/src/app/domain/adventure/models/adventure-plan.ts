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

export interface CreateAdventurePlanProps {
  readonly id: AdventurePlanId;
  readonly projectId: ProjectId;
  readonly title: string;
  readonly premise: string;
  readonly audienceProfile: AudienceProfile;
}

export interface UpdateAdventureFoundationProps {
  readonly title: string;
  readonly premise: string;
  readonly audienceProfile: AudienceProfile;
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
      ),
    );
  }

  updateFoundation(
    props: UpdateAdventureFoundationProps,
  ): Outcome<AdventurePlan, InvalidAdventurePlanError> {
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
      ),
    );
  }

  addScene(props: AddAdventureSceneProps): Outcome<AdventurePlan, InvalidAdventurePlanError> {
    const title = props.title.trim();
    const description = props.description.trim();
    const goal = props.goal.trim();

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
      ),
    );
  }

  updateScene(
    sceneId: AdventureSceneId,
    props: UpdateAdventureSceneProps,
  ): Outcome<AdventurePlan, InvalidAdventurePlanError> {
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
    if (!this.scenes.some((scene) => scene.id === sceneId)) return this.sceneNotFound();
    return success(
      this.withScenes(
        this.scenes.map((scene) => Object.freeze({ ...scene, isOpening: scene.id === sceneId })),
      ),
    );
  }

  private validateScene(
    props: UpdateAdventureSceneProps,
  ): Outcome<Pick<AdventureScene, 'title' | 'description' | 'goal'>, InvalidAdventurePlanError> {
    const value = {
      title: props.title.trim(),
      description: props.description.trim(),
      goal: props.goal.trim(),
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
    return new AdventurePlan(
      this.id,
      this.projectId,
      this.title,
      this.premise,
      this.audienceProfile,
      this.status,
      Object.freeze(scenes),
    );
  }

  private sceneNotFound(): Outcome<never, InvalidAdventurePlanError> {
    return failure(new InvalidAdventurePlanError('The scene does not exist in this adventure.'));
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
