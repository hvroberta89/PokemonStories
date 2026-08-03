import { Project } from '../../../../domain/project/models/project';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { InMemoryProjectRepository } from '../../../../infrastructure/project/repositories/in-memory-project.repository';
import { RestoreProjectHandler } from './restore-project.handler';

describe('RestoreProjectHandler', () => {
  it('restores an archived Project to the active list', async () => {
    const created = Project.create({ id: projectId('project-1'), name: 'Kanto kalandok' });
    if (!created.isSuccess) throw created.error;
    const repository = new InMemoryProjectRepository();
    const restored = await new RestoreProjectHandler(repository).execute(created.value.archive());

    expect(restored.status).toBe('active');
    expect((await repository.findById(projectId('project-1')))?.status).toBe('active');
  });
});