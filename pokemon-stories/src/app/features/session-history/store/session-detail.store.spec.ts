import { TestBed } from '@angular/core/testing';

import { ProjectSessionReader } from '../../../application/session/ports/project-session-reader';
import { PROJECT_SESSION_READER } from '../../../application/session/tokens/project-session.tokens';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { SessionDetailStore } from './session-detail.store';

describe('SessionDetailStore', () => {
  it('loads a completed session scoped to its project', async () => {
    const reader: ProjectSessionReader = {
      findByProject: async () => null,
      listCompletedByProject: async () => [],
      findCompletedById: async (id, sessionId) => ({
        sessionId,
        projectId: id,
        adventureId: 'adventure-1',
        adventureTitle: 'Az elveszett tojás',
        finalSceneTitle: 'Öreg híd',
        startedAt: '2026-08-02T10:00:00.000Z',
        completedAt: '2026-08-02T11:00:00.000Z',
        eventCount: 1,
        rewardCount: 0,
        narration: ['A tojás biztonságban hazakerült.'],
        sceneTitles: ['Virágos tisztás', 'Öreg híd'],
        events: [],
        rewards: [],
      }),
    };
    TestBed.configureTestingModule({
      providers: [SessionDetailStore, { provide: PROJECT_SESSION_READER, useValue: reader }],
    });
    const store = TestBed.inject(SessionDetailStore);

    await store.load(projectId('project-1'), 'session-1');

    expect(store.session()?.sessionId).toBe('session-1');
    expect(store.session()?.sceneTitles).toHaveLength(2);
  });
});
