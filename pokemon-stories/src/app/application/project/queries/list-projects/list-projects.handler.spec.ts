import { Project } from '../../../../domain/project/models/project';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { InMemoryProjectRepository } from '../../../../infrastructure/project/repositories/in-memory-project.repository';
import { ListProjectsHandler } from './list-projects.handler';

describe('ListProjectsHandler', () => {
  let repository: InMemoryProjectRepository;
  let handler: ListProjectsHandler;

  beforeEach(() => {
    repository = new InMemoryProjectRepository();
    handler = new ListProjectsHandler(repository);
  });

  it('should return all active projects', async () => {
    await repository.save(
      createProject('project-1', 'Kanto kalandok'),
    );

    await repository.save(
      createProject('project-2', 'Johto történetek'),
    );

    const result = await handler.execute({});

    expect(result.length).toBe(2);
  });

  it('should return project summaries', async () => {
    await repository.save(
      createProject(
        'project-1',
        'Kanto kalandok',
        'Kezdő Pokémon-kampány.',
      ),
    );

    const result = await handler.execute({});

    expect(result).toEqual([
      {
        id: projectId('project-1'),
        name: 'Kanto kalandok',
        description: 'Kezdő Pokémon-kampány.',
        status: 'active',
      },
    ]);
  });

  it('should sort projects by name', async () => {
    await repository.save(
      createProject('project-1', 'Johto történetek'),
    );

    await repository.save(
      createProject('project-2', 'Kanto kalandok'),
    );

    await repository.save(
      createProject('project-3', 'Alola kalandok'),
    );

    const result = await handler.execute({});

    expect(result.map(project => project.name)).toEqual([
      'Alola kalandok',
      'Johto történetek',
      'Kanto kalandok',
    ]);
  });

  it('should return an empty list when no projects exist', async () => {
    const result = await handler.execute({});

    expect(result).toEqual([]);
  });
});

function createProject(
  id: string,
  name: string,
  description?: string,
): Project {
  const result = Project.create({
    id: projectId(id),
    name,
    description,
  });

  if (!result.isSuccess) {
    throw new Error(result.error.message);
  }

  return result.value;
}