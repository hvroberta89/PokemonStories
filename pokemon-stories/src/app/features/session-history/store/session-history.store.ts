import { inject, Injectable, signal } from '@angular/core';

import { CompletedProjectSessionSummary } from '../../../application/session/ports/project-session-reader';
import { PROJECT_SESSION_READER } from '../../../application/session/tokens/project-session.tokens';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

@Injectable()
export class SessionHistoryStore {
  private readonly reader = inject(PROJECT_SESSION_READER);
  private readonly sessionsState = signal<readonly CompletedProjectSessionSummary[]>([]);
  readonly sessions = this.sessionsState.asReadonly();

  async load(projectId: ProjectId): Promise<void> {
    this.sessionsState.set(await this.reader.listCompletedByProject(projectId));
  }
}
