import { CharacterRepository } from '../../../application/character/ports/character-repository';
import { Character } from '../../../domain/character/models/character';
import { CharacterId } from '../../../domain/character/value-objects/character-id';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

export class InMemoryCharacterRepository implements CharacterRepository {
  private readonly characters = new Map<CharacterId, Character>();

  async save(character: Character): Promise<void> {
    this.characters.set(character.id, character);
  }
  async findById(id: CharacterId): Promise<Character | undefined> {
    return this.characters.get(id);
  }
  async findByProjectId(projectId: ProjectId): Promise<readonly Character[]> {
    return [...this.characters.values()].filter((character) => character.projectId === projectId);
  }
  async existsByName(projectId: ProjectId, name: string): Promise<boolean> {
    const normalized = name.trim().toLocaleLowerCase('hu');
    return [...this.characters.values()].some(
      (character) =>
        character.projectId === projectId && character.name.toLocaleLowerCase('hu') === normalized,
    );
  }
}
