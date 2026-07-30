import { Outcome, failure, success } from "../../shared/outcome/outcome";
import { InvalidAgeRangeError } from "../errors/invalid-age-range.error";


export class AgeRange {
  private static readonly minimumSupportedAge = 4;
  private static readonly maximumSupportedAge = 17;

  private constructor(
    public readonly minimum: number,
    public readonly maximum: number,
  ) {}

  static create(
    minimum: number,
    maximum: number,
  ): Outcome<AgeRange, InvalidAgeRangeError> {
    if (!Number.isInteger(minimum) || !Number.isInteger(maximum)) {
      return failure(
        new InvalidAgeRangeError(
          'The minimum and maximum ages must be whole numbers.',
        ),
      );
    }

    if (minimum < AgeRange.minimumSupportedAge) {
      return failure(
        new InvalidAgeRangeError(
          `The minimum age cannot be lower than ${AgeRange.minimumSupportedAge}.`,
        ),
      );
    }

    if (maximum > AgeRange.maximumSupportedAge) {
      return failure(
        new InvalidAgeRangeError(
          `The maximum age cannot be greater than ${AgeRange.maximumSupportedAge}.`,
        ),
      );
    }

    if (minimum > maximum) {
      return failure(
        new InvalidAgeRangeError(
          'The minimum age cannot be greater than the maximum age.',
        ),
      );
    }

    return success(new AgeRange(minimum, maximum));
  }

  equals(other: AgeRange): boolean {
    return (
      this.minimum === other.minimum &&
      this.maximum === other.maximum
    );
  }

  includes(age: number): boolean {
    return age >= this.minimum && age <= this.maximum;
  }

  toString(): string {
    return `${this.minimum}–${this.maximum} years`;
  }
}