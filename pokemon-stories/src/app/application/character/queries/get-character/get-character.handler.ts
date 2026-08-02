import { Character } from '../../../../domain/character/models/character';
import { CharacterId } from '../../../../domain/character/value-objects/character-id';
import { ProjectId } from '../../../../domain/project/value-objects/project-id';
import { CharacterReader } from '../../ports/character-repository';

export class GetCharacterHandler {
  constructor(private readonly reader: CharacterReader) {}

  async execute(projectId: ProjectId, id: CharacterId): Promise<Character | undefined> {
    const character = await this.reader.findById(id);
    return character?.projectId === projectId ? character : undefined;
  }
}
