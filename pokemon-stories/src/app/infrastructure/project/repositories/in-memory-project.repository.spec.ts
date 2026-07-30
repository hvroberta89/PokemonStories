import { Project } from '../../../domain/project/models/project';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { InMemoryProjectRepository } from './in-memory-project.repository';

describe('InMemoryProjectRepository', () => {
  it('should save and find a project', async () => {
    const repository = new InMemoryProjectRepository();
    const project = createProject('project-1', 'Kanto kalandok');

    await repository.save(project);

    const storedProject = await repository.findById(
      projectId('project-1'),
    );

    expect(storedProject).toBe(project);
  });

  it('should return undefined when the project does not exist', async () => {
    const repository = new InMemoryProjectRepository();

    const result = await repository.findById(
      projectId('missing-project'),
    );

    expect(result).toBeUndefined();
  });

  it('should detect an existing name case-insensitively', async () => {
    const repository = new InMemoryProjectRepository();

    await repository.save(
      createProject('project-1', 'Kanto kalandok'),
    );

    expect(
      await repository.existsByName('KANTO KALANDOK'),
    ).toBe(true);
  });

  it('should return all projects', async () => {
    const repository = new InMemoryProjectRepository();

    const firstProject = createProject(
      'project-1',
      'Kanto kalandok',
    );

    const secondProject = createProject(
      'project-2',
      'Johto történetek',
    );

    await repository.save(firstProject);
    await repository.save(secondProject);

    const result = await repository.findAll();

    expect(result).toEqual([
      firstProject,
      secondProject,
    ]);
  });

  it('should return an empty list when no projects exist', async () => {
    const repository = new InMemoryProjectRepository();

    const result = await repository.findAll();

    expect(result).toEqual([]);
  });
});

function createProject(id: string, name: string): Project {
  const result = Project.create({
    id: projectId(id),
    name,
  });

  if (!result.isSuccess) {
    throw new Error(result.error.message);
  }

  return result.value;
}