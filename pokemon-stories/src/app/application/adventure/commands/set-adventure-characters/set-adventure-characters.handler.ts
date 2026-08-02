import { CharacterReader } from '../../../character/ports/character-repository';
import { AdventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { CharacterId } from '../../../../domain/character/value-objects/character-id';
import { ProjectId } from '../../../../domain/project/value-objects/project-id';
import { AdventurePlanRepository } from '../../ports/adventure-plan-repository';

export interface SetAdventureCharactersCommand {
  readonly projectId: ProjectId;
  readonly adventurePlanId: AdventurePlanId;
  readonly characterIds: readonly CharacterId[];
}

export type SetAdventureCharactersResult =
  | { readonly isSuccess: true }
  | { readonly isSuccess: false; readonly code: 'ADVENTURE_NOT_FOUND' | 'INVALID_CHARACTER' };

export class SetAdventureCharactersHandler {
  constructor(
    private readonly adventures: AdventurePlanRepository,
    private readonly characters: CharacterReader,
  ) {}

  async execute(command: SetAdventureCharactersCommand): Promise<SetAdventureCharactersResult> {
    const adventure = await this.adventures.findById(command.adventurePlanId);
    if (!adventure || adventure.projectId !== command.projectId) {
      return { isSuccess: false, code: 'ADVENTURE_NOT_FOUND' };
    }
    const uniqueIds = [...new Set(command.characterIds)];
    const characters = await Promise.all(uniqueIds.map((id) => this.characters.findById(id)));
    if (
      characters.some(
        (character) =>
          !character || character.projectId !== command.projectId || character.status !== 'active',
      )
    ) {
      return { isSuccess: false, code: 'INVALID_CHARACTER' };
    }
    await this.adventures.save(adventure.selectExpectedCharacters(uniqueIds));
    return { isSuccess: true };
  }
}
