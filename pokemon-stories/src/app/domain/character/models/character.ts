import { ProjectId } from '../../project/value-objects/project-id';
import { failure, Outcome, success } from '../../shared/outcome/outcome';
import { InvalidCharacterError } from '../errors/invalid-character.error';
import { CharacterId } from '../value-objects/character-id';

export type CharacterStatus = 'active' | 'archived';

export interface CreateCharacterProps {
  readonly id: CharacterId;
  readonly projectId: ProjectId;
  readonly name: string;
  readonly description?: string;
}

export interface UpdateCharacterProps {
  readonly name: string;
  readonly description?: string;
  readonly personalityNotes?: string;
  readonly goals?: string;
  readonly storyNotes?: string;
}

export interface RestoreCharacterProps extends CreateCharacterProps, UpdateCharacterProps {
  readonly status: CharacterStatus;
}

export class Character {
  private constructor(
    public readonly id: CharacterId,
    public readonly projectId: ProjectId,
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly personalityNotes: string | undefined,
    public readonly goals: string | undefined,
    public readonly storyNotes: string | undefined,
    public readonly status: CharacterStatus,
  ) {
    Object.freeze(this);
  }

  static create(props: CreateCharacterProps): Outcome<Character, InvalidCharacterError> {
    const name = props.name.trim();
    const description = props.description?.trim() || undefined;
    if (!name) return failure(new InvalidCharacterError('Character name cannot be empty.'));
    if (name.length > 80) {
      return failure(new InvalidCharacterError('Character name cannot exceed 80 characters.'));
    }
    if (description && description.length > 300) {
      return failure(
        new InvalidCharacterError('Character description cannot exceed 300 characters.'),
      );
    }
    return success(
      new Character(
        props.id,
        props.projectId,
        name,
        description,
        undefined,
        undefined,
        undefined,
        'active',
      ),
    );
  }

  static restore(props: RestoreCharacterProps): Outcome<Character, InvalidCharacterError> {
    const created = this.create({
      id: props.id,
      projectId: props.projectId,
      name: props.name,
    });
    if (!created.isSuccess) {
      return created;
    }

    const updated = created.value.update(props);
    if (!updated.isSuccess) {
      return updated;
    }

    return success(props.status === 'archived' ? updated.value.archive() : updated.value);
  }

  update(props: UpdateCharacterProps): Outcome<Character, InvalidCharacterError> {
    const name = props.name.trim();
    const description = this.normalize(props.description);
    const personalityNotes = this.normalize(props.personalityNotes);
    const goals = this.normalize(props.goals);
    const storyNotes = this.normalize(props.storyNotes);
    if (!name) return failure(new InvalidCharacterError('Character name cannot be empty.'));
    if (name.length > 80) return failure(new InvalidCharacterError('Character name is too long.'));
    if (
      [description, personalityNotes, goals, storyNotes].some(
        (value) => (value?.length ?? 0) > 1000,
      )
    ) {
      return failure(new InvalidCharacterError('Character content is too long.'));
    }
    return success(
      new Character(
        this.id,
        this.projectId,
        name,
        description,
        personalityNotes,
        goals,
        storyNotes,
        this.status,
      ),
    );
  }

  archive(): Character {
    return this.withStatus('archived');
  }

  restore(): Character {
    return this.withStatus('active');
  }

  private normalize(value: string | undefined): string | undefined {
    return value?.trim() || undefined;
  }

  private withStatus(status: CharacterStatus): Character {
    return new Character(
      this.id,
      this.projectId,
      this.name,
      this.description,
      this.personalityNotes,
      this.goals,
      this.storyNotes,
      status,
    );
  }
}
