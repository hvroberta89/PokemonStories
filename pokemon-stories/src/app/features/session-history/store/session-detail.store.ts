import { computed, inject, Injectable, signal } from '@angular/core';

import { CompletedProjectSessionDetail } from '../../../application/session/ports/project-session-reader';
import { PROJECT_SESSION_READER } from '../../../application/session/tokens/project-session.tokens';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

@Injectable()
export class SessionDetailStore {
  private readonly reader = inject(PROJECT_SESSION_READER);
  private readonly sessionState = signal<CompletedProjectSessionDetail | null>(null);
  private readonly loadedState = signal(false);
  readonly session = this.sessionState.asReadonly();
  readonly isNotFound = computed(() => this.loadedState() && this.session() === null);

  load(projectId: ProjectId, sessionId: string): void {
    this.sessionState.set(this.reader.findCompletedById(projectId, sessionId));
    this.loadedState.set(true);
  }
}
