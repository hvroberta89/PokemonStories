import { ProjectId } from '../../../../domain/project/value-objects/project-id';
import { CharacterReader } from '../../ports/character-repository';

export class ListCharactersHandler {
  constructor(private readonly reader: CharacterReader) {}

  async execute(projectId: ProjectId) {
    const characters = await this.reader.findByProjectId(projectId);
    return [...characters].sort((left, right) => left.name.localeCompare(right.name, 'hu'));
  }
}
