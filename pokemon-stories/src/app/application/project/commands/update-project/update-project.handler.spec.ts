import { Project } from '../../../../domain/project/models/project';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { InMemoryProjectRepository } from '../../../../infrastructure/project/repositories/in-memory-project.repository';
import { UpdateProjectHandler } from './update-project.handler';

describe('UpdateProjectHandler', () => {
  it('updates and persists the Project name and description', async () => {
    const created = Project.create({ id: projectId('project-1'), name: 'Kanto kalandok' });
    if (!created.isSuccess) throw created.error;
    const repository = new InMemoryProjectRepository();
    const result = await new UpdateProjectHandler(repository).execute({
      project: created.value,
      name: ' Johto kalandok ',
      description: '  Legendak a Toronyban.  ',
    });

    expect(result).toMatchObject({
      isSuccess: true,
      value: { name: 'Johto kalandok', description: 'Legendak a Toronyban.' },
    });
    expect(await repository.findById(projectId('project-1'))).toMatchObject({
      name: 'Johto kalandok',
      description: 'Legendak a Toronyban.',
    });
  });

  it('does not persist an invalid Project name', async () => {
    const created = Project.create({ id: projectId('project-1'), name: 'Kanto kalandok' });
    if (!created.isSuccess) throw created.error;
    const repository = new InMemoryProjectRepository();
    const result = await new UpdateProjectHandler(repository).execute({
      project: created.value,
      name: ' ',
    });

    expect(result.isSuccess).toBe(false);
    expect(await repository.findById(projectId('project-1'))).toBeUndefined();
  });
});