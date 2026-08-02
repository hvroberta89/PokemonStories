import { Character } from '../../../../domain/character/models/character';
import { CharacterId } from '../../../../domain/character/value-objects/character-id';
import { ProjectId } from '../../../../domain/project/value-objects/project-id';
import { CharacterRepository } from '../../ports/character-repository';

export type ManageCharacterCommand =
  | {
      readonly action: 'update';
      readonly projectId: ProjectId;
      readonly characterId: CharacterId;
      readonly name: string;
      readonly description?: string;
      readonly personalityNotes?: string;
      readonly goals?: string;
      readonly storyNotes?: string;
    }
  | {
      readonly action: 'archive' | 'restore';
      readonly projectId: ProjectId;
      readonly characterId: CharacterId;
    };

export type ManageCharacterResult =
  | { readonly isSuccess: true; readonly value: Character }
  | { readonly isSuccess: false; readonly code: 'NOT_FOUND' | 'DUPLICATE_NAME' | 'INVALID' };

export class ManageCharacterHandler {
  constructor(private readonly repository: CharacterRepository) {}

  async execute(command: ManageCharacterCommand): Promise<ManageCharacterResult> {
    const character = await this.repository.findById(command.characterId);
    if (!character || character.projectId !== command.projectId) {
      return { isSuccess: false, code: 'NOT_FOUND' };
    }
    let updated: Character;
    if (command.action === 'update') {
      if (
        command.name.trim().toLocaleLowerCase('hu') !== character.name.toLocaleLowerCase('hu') &&
        (await this.repository.existsByName(command.projectId, command.name))
      ) {
        return { isSuccess: false, code: 'DUPLICATE_NAME' };
      }
      const result = character.update(command);
      if (!result.isSuccess) return { isSuccess: false, code: 'INVALID' };
      updated = result.value;
    } else {
      updated = command.action === 'archive' ? character.archive() : character.restore();
    }
    await this.repository.save(updated);
    return { isSuccess: true, value: updated };
  }
}
