import {
  failure,
  Outcome,
  success,
} from '../../shared/outcome/outcome';
import { InvalidProjectError } from '../errors/invalid-project.error';
import { ProjectId } from '../value-objects/project-id';
import { ProjectStatus } from './project-status';

export interface CreateProjectProps {
  readonly id: ProjectId;
  readonly name: string;
  readonly description?: string;
}

export class Project {
  private static readonly maximumNameLength = 100;
  private static readonly maximumDescriptionLength = 1000;

  private constructor(
    public readonly id: ProjectId,
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly status: ProjectStatus,
  ) {
    Object.freeze(this);
  }

  static create(
    props: CreateProjectProps,
  ): Outcome<Project, InvalidProjectError> {
    const name = props.name.trim();
    const description = this.normalizeDescription(
      props.description,
    );

    const nameValidation = this.validateName(name);

    if (!nameValidation.isSuccess) {
      return nameValidation;
    }

    const descriptionValidation =
      this.validateDescription(description);

    if (!descriptionValidation.isSuccess) {
      return descriptionValidation;
    }

    return success(
      new Project(
        props.id,
        name,
        description,
        'active',
      ),
    );
  }

  private static normalizeDescription(
    description: string | undefined,
  ): string | undefined {
    if (description === undefined) {
      return undefined;
    }

    const normalizedDescription = description.trim();

    return normalizedDescription.length === 0
      ? undefined
      : normalizedDescription;
  }

  private static validateName(
    name: string,
  ): Outcome<void, InvalidProjectError> {
    if (name.length === 0) {
      return failure(
        new InvalidProjectError(
          'The project name cannot be empty.',
        ),
      );
    }

    if (name.length > Project.maximumNameLength) {
      return failure(
        new InvalidProjectError(
          `The project name cannot exceed ${Project.maximumNameLength} characters.`,
        ),
      );
    }

    return success(undefined);
  }

  private static validateDescription(
    description: string | undefined,
  ): Outcome<void, InvalidProjectError> {
    if (
      description !== undefined &&
      description.length > Project.maximumDescriptionLength
    ) {
      return failure(
        new InvalidProjectError(
          `The project description cannot exceed ${Project.maximumDescriptionLength} characters.`,
        ),
      );
    }

    return success(undefined);
  }
}