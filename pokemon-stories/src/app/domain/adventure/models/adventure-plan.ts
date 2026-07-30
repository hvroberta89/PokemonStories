import { AudienceProfile } from '../../audience/models/audience-profile';
import { ProjectId } from '../../project/value-objects/project-id';
import {
  failure,
  Outcome,
  success,
} from '../../shared/outcome/outcome';
import { InvalidAdventurePlanError } from '../errors/invalid-adventure-plan.error';
import { AdventurePlanId } from '../value-objects/adventure-plan-id';
import { AdventurePlanStatus } from './adventure-plan-status';

export interface CreateAdventurePlanProps {
  readonly id: AdventurePlanId;
  readonly projectId: ProjectId;
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
      ),
    );
  }

  private static validateTitle(
    title: string,
  ): Outcome<void, InvalidAdventurePlanError> {
    if (title.length === 0) {
      return failure(
        new InvalidAdventurePlanError(
          'The adventure title cannot be empty.',
        ),
      );
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

  private static validatePremise(
    premise: string,
  ): Outcome<void, InvalidAdventurePlanError> {
    if (premise.length === 0) {
      return failure(
        new InvalidAdventurePlanError(
          'The adventure premise cannot be empty.',
        ),
      );
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