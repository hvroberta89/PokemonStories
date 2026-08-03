import { Project } from '../../../../domain/project/models/project';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { InMemoryProjectRepository } from '../../../../infrastructure/project/repositories/in-memory-project.repository';
import type { ProjectSessionReader } from '../../../session/ports/project-session-reader';
import { ArchiveProjectHandler } from './archive-project.handler';

describe('ArchiveProjectHandler', () => {
  const projectResult = Project.create({ id: projectId('project-1'), name: 'Kanto kalandok' });
  if (!projectResult.isSuccess) throw projectResult.error;

  it('archives a Project when it has no active Session', async () => {
    const repository = new InMemoryProjectRepository();
    const result = await new ArchiveProjectHandler(noActiveSession(), repository).execute(projectResult.value);

    expect(result).toMatchObject({ isSuccess: true, value: { status: 'archived' } });
    expect((await repository.findById(projectId('project-1')))?.status).toBe('archived');
  });

  it('does not archive a Project with an active Session', async () => {
    const repository = new InMemoryProjectRepository();
    const result = await new ArchiveProjectHandler(activeSession(), repository).execute(projectResult.value);

    expect(result).toEqual({ isSuccess: false, code: 'ACTIVE_SESSION' });
    expect(repository.getAll()).toHaveLength(0);
  });
});

function noActiveSession(): ProjectSessionReader {
  return { findByProject: async () => null, listCompletedByProject: async () => [], findCompletedById: async () => null };
}

function activeSession(): ProjectSessionReader {
  return {
    ...noActiveSession(),
    findByProject: async () => ({
      sessionId: 'session-1', projectId: projectId('project-1'), adventureId: 'adventure-1',
      adventureTitle: 'Erdei kaland', currentSceneTitle: 'Tisztás', currentGoal: 'Keresés',
      startedAt: '2026-08-03T10:00:00.000Z', status: 'running',
    }),
  };
}