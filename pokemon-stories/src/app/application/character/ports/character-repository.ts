import { Character } from '../../../domain/character/models/character';
import { CharacterId } from '../../../domain/character/value-objects/character-id';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

export interface CharacterRepository {
  save(character: Character): Promise<void>;
  findById(id: CharacterId): Promise<Character | undefined>;
  findByProjectId(projectId: ProjectId): Promise<readonly Character[]>;
  existsByName(projectId: ProjectId, name: string): Promise<boolean>;
}

export type CharacterReader = Pick<CharacterRepository, 'findById' | 'findByProjectId'>;
