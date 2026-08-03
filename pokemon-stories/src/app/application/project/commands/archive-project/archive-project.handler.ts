import type { Project } from '../../../../domain/project/models/project';
import type { ProjectRepository } from '../../ports/project-repository';
import type { ProjectSessionReader } from '../../../session/ports/project-session-reader';

export type ArchiveProjectResult =
  | { readonly isSuccess: true; readonly value: Project }
  | { readonly isSuccess: false; readonly code: 'ACTIVE_SESSION' };

export class ArchiveProjectHandler {
  constructor(
    private readonly sessions: ProjectSessionReader,
    private readonly repository: ProjectRepository,
  ) {}

  async execute(project: Project): Promise<ArchiveProjectResult> {
    if (await this.sessions.findByProject(project.id)) {
      return { isSuccess: false, code: 'ACTIVE_SESSION' };
    }
    const archivedProject = project.archive();
    await this.repository.save(archivedProject);
    return { isSuccess: true, value: archivedProject };
  }
}