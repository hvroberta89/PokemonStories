import type { ProjectReader } from '../../ports/project-reader';
import type { ProjectSummary } from '../models/project-summary';

export class ListArchivedProjectsHandler {
  constructor(private readonly projectReader: ProjectReader) {}

  async execute(): Promise<readonly ProjectSummary[]> {
    return (await this.projectReader.findAll())
      .filter((project) => project.status === 'archived')
      .map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
      }))
      .sort((first, second) => first.name.localeCompare(second.name, 'hu'));
  }
}