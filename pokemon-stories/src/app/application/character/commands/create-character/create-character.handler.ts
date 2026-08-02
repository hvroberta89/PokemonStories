import { IdGenerator } from '../../../shared/ports/id-generator';
import { Character } from '../../../../domain/character/models/character';
import { characterId } from '../../../../domain/character/value-objects/character-id';
import { ProjectId } from '../../../../domain/project/value-objects/project-id';
import { CharacterRepository } from '../../ports/character-repository';

export interface CreateCharacterCommand {
  readonly projectId: ProjectId;
  readonly name: string;
  readonly description?: string;
}

export type CreateCharacterResult =
  | { readonly isSuccess: true; readonly value: Character }
  | {
      readonly isSuccess: false;
      readonly code: 'PROJECT_NOT_FOUND' | 'DUPLICATE_NAME' | 'INVALID';
    };

export class CreateCharacterHandler {
  constructor(
    private readonly projectExists: (projectId: ProjectId) => Promise<boolean>,
    private readonly repository: CharacterRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(command: CreateCharacterCommand): Promise<CreateCharacterResult> {
    if (!(await this.projectExists(command.projectId))) {
      return { isSuccess: false, code: 'PROJECT_NOT_FOUND' };
    }
    if (await this.repository.existsByName(command.projectId, command.name)) {
      return { isSuccess: false, code: 'DUPLICATE_NAME' };
    }
    const result = Character.create({
      id: characterId(this.ids.generate()),
      projectId: command.projectId,
      name: command.name,
      description: command.description,
    });
    if (!result.isSuccess) return { isSuccess: false, code: 'INVALID' };
    await this.repository.save(result.value);
    return result;
  }
}
