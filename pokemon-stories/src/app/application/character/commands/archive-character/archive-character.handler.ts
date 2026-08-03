import type { Character } from '../../../../domain/character/models/character';
import type { ProjectSessionReader } from '../../../session/ports/project-session-reader';
import type { CharacterRepository } from '../../ports/character-repository';

export type ArchiveCharacterResult =
  | { readonly isSuccess: true; readonly value: Character }
  | { readonly isSuccess: false; readonly code: 'ACTIVE_SESSION' };

export class ArchiveCharacterHandler {
  constructor(
    private readonly sessions: ProjectSessionReader,
    private readonly repository: CharacterRepository,
  ) {}

  async execute(character: Character): Promise<ArchiveCharacterResult> {
    if (await this.sessions.findByProject(character.projectId)) {
      return { isSuccess: false, code: 'ACTIVE_SESSION' };
    }
    const archivedCharacter = character.archive();
    await this.repository.save(archivedCharacter);
    return { isSuccess: true, value: archivedCharacter };
  }
}
