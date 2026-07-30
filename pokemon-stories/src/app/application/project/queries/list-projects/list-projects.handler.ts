import { ProjectReader } from '../../ports/project-reader';
import { ProjectSummary } from '../models/project-summary';
import { ListProjectsQuery } from './list-projects.query';

export class ListProjectsHandler {
  constructor(
    private readonly projectReader: ProjectReader,
  ) {}

  async execute(
    _query: ListProjectsQuery,
  ): Promise<readonly ProjectSummary[]> {
    const projects = await this.projectReader.findAll();

    return projects
      .filter(project => project.status === 'active')
      .map(
        (project): ProjectSummary => ({
            id: project.id,
            name: project.name,
            description: project.description,
            status: project.status,
        }),
      )
      .sort((first, second) =>
        first.name.localeCompare(second.name),
      );
  }
}