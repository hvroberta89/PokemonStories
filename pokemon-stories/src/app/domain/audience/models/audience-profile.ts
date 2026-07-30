import { failure, Outcome, success } from '../../shared/outcome/outcome';
import { InvalidAudienceProfileError } from '../errors/invalid-audience-profile.error';
import { AgeRange } from '../value-objects/age-range';
import {
  ComplexityLevel,
  ConflictStyle,
  ConsequenceSeverity,
  DangerIntensity,
  ScaryContentLevel,
} from './audience-profile.types';

export interface AudienceProfileProps {
  readonly ageRange: AgeRange;
  readonly complexity: ComplexityLevel;
  readonly dangerIntensity: DangerIntensity;
  readonly scaryContent: ScaryContentLevel;
  readonly consequenceSeverity: ConsequenceSeverity;
  readonly conflictStyle: ConflictStyle;
  readonly sessionLengthMinutes: number;
}

export class AudienceProfile {
  private static readonly minimumSessionLengthMinutes = 20;
  private static readonly maximumSessionLengthMinutes = 240;

  private constructor(
    public readonly ageRange: AgeRange,
    public readonly complexity: ComplexityLevel,
    public readonly dangerIntensity: DangerIntensity,
    public readonly scaryContent: ScaryContentLevel,
    public readonly consequenceSeverity: ConsequenceSeverity,
    public readonly conflictStyle: ConflictStyle,
    public readonly sessionLengthMinutes: number,
  ) {
    Object.freeze(this);
  }

  static create(
    props: AudienceProfileProps,
  ): Outcome<AudienceProfile, InvalidAudienceProfileError> {
    const sessionLengthValidation = this.validateSessionLength(
      props.sessionLengthMinutes,
    );

    if (!sessionLengthValidation.isSuccess) {
      return sessionLengthValidation;
    }

    const compatibilityValidation = this.validateCompatibility(props);

    if (!compatibilityValidation.isSuccess) {
      return compatibilityValidation;
    }

    return success(
      new AudienceProfile(
        props.ageRange,
        props.complexity,
        props.dangerIntensity,
        props.scaryContent,
        props.consequenceSeverity,
        props.conflictStyle,
        props.sessionLengthMinutes,
      ),
    );
  }

  equals(other: AudienceProfile): boolean {
    return (
      this.ageRange.equals(other.ageRange) &&
      this.complexity === other.complexity &&
      this.dangerIntensity === other.dangerIntensity &&
      this.scaryContent === other.scaryContent &&
      this.consequenceSeverity === other.consequenceSeverity &&
      this.conflictStyle === other.conflictStyle &&
      this.sessionLengthMinutes === other.sessionLengthMinutes
    );
  }

  private static validateSessionLength(
    sessionLengthMinutes: number,
  ): Outcome<void, InvalidAudienceProfileError> {
    if (!Number.isInteger(sessionLengthMinutes)) {
      return failure(
        new InvalidAudienceProfileError(
          'The session length must be a whole number.',
        ),
      );
    }

    if (
      sessionLengthMinutes <
      AudienceProfile.minimumSessionLengthMinutes
    ) {
      return failure(
        new InvalidAudienceProfileError(
          `The session length must be at least ${AudienceProfile.minimumSessionLengthMinutes} minutes.`,
        ),
      );
    }

    if (
      sessionLengthMinutes >
      AudienceProfile.maximumSessionLengthMinutes
    ) {
      return failure(
        new InvalidAudienceProfileError(
          `The session length cannot exceed ${AudienceProfile.maximumSessionLengthMinutes} minutes.`,
        ),
      );
    }

    return success(undefined);
  }

  private static validateCompatibility(
    props: AudienceProfileProps,
  ): Outcome<void, InvalidAudienceProfileError> {
    if (
      props.ageRange.minimum <= 6 &&
      props.scaryContent === 'intense'
    ) {
      return failure(
        new InvalidAudienceProfileError(
          'Intense scary content is not supported for children aged 6 or younger.',
        ),
      );
    }

    if (
      props.ageRange.minimum <= 6 &&
      props.consequenceSeverity === 'serious'
    ) {
      return failure(
        new InvalidAudienceProfileError(
          'Serious consequences are not supported for children aged 6 or younger.',
        ),
      );
    }

    if (
      props.ageRange.minimum <= 6 &&
      props.complexity === 'challenging'
    ) {
      return failure(
        new InvalidAudienceProfileError(
          'Challenging complexity is not supported for children aged 6 or younger.',
        ),
      );
    }

    return success(undefined);
  }
}