import { inject, Injectable, signal } from '@angular/core';

import { CompletedProjectSessionSummary } from '../../../application/session/ports/project-session-reader';
import { PROJECT_SESSION_READER } from '../../../application/session/tokens/project-session.tokens';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

@Injectable()
export class SessionHistoryStore {
  private readonly reader = inject(PROJECT_SESSION_READER);
  private readonly sessionsState = signal<readonly CompletedProjectSessionSummary[]>([]);
  readonly sessions = this.sessionsState.asReadonly();

  load(projectId: ProjectId): void {
    this.sessionsState.set(this.reader.listCompletedByProject(projectId));
  }
}
