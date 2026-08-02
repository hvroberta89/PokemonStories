import { TestBed } from '@angular/core/testing';

import { ProjectSessionReader } from '../../../application/session/ports/project-session-reader';
import { PROJECT_SESSION_READER } from '../../../application/session/tokens/project-session.tokens';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { SessionHistoryStore } from './session-history.store';

describe('SessionHistoryStore', () => {
  it('loads completed sessions for the selected project', () => {
    const reader: ProjectSessionReader = {
      findByProject: () => null,
      listCompletedByProject: (id) => [
        {
          sessionId: 'session-1',
          projectId: id,
          adventureId: 'adventure-1',
          adventureTitle: 'Az elveszett tojás',
          finalSceneTitle: 'Öreg híd',
          startedAt: '2026-08-02T10:00:00.000Z',
          completedAt: '2026-08-02T11:00:00.000Z',
          eventCount: 3,
          rewardCount: 1,
        },
      ],
    };
    TestBed.configureTestingModule({
      providers: [SessionHistoryStore, { provide: PROJECT_SESSION_READER, useValue: reader }],
    });
    const store = TestBed.inject(SessionHistoryStore);

    store.load(projectId('project-1'));

    expect(store.sessions()).toHaveLength(1);
    expect(store.sessions()[0]?.finalSceneTitle).toBe('Öreg híd');
  });
});
