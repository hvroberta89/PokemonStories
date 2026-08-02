import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { RunningSessionStorageService } from './running-session-storage.service';
import { mockRunningSession } from '../mocks/running-session.mock';
import { projectId } from '../../../domain/project/value-objects/project-id';

describe('RunningSessionStorageService', () => {
  const storageKey = 'pokemon-stories.running-session';
  const historyStorageKey = 'pokemon-stories.session-history';

  afterEach(() => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(historyStorageKey);
  });

  it('migrates a legacy ended session to review pending', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        schemaVersion: 1,
        sessionId: 'session-1',
        status: 'completed',
        startedAt: '2026-08-02T10:00:00.000Z',
        completedAt: '2026-08-02T11:00:00.000Z',
        viewModel: {},
        rewardQueue: [],
        rewardHistory: [],
      }),
    );
    TestBed.configureTestingModule({
      providers: [RunningSessionStorageService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });

    const state = TestBed.inject(RunningSessionStorageService).load();

    expect(state?.schemaVersion).toBe(2);
    expect(state?.status).toBe('review-pending');
  });

  it('archives a completed session idempotently', () => {
    TestBed.configureTestingModule({
      providers: [RunningSessionStorageService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const service = TestBed.inject(RunningSessionStorageService);
    const state = {
      schemaVersion: 2 as const,
      sessionId: 'session-1',
      projectId: 'project-1',
      adventureId: 'adventure-1',
      adventureTitle: 'Az elveszett tojás',
      status: 'completed' as const,
      startedAt: '2026-08-02T10:00:00.000Z',
      completedAt: '2026-08-02T11:00:00.000Z',
      viewModel: mockRunningSession,
      rewardQueue: [],
      rewardHistory: [],
    };

    service.save(state);
    service.save(state);

    const history = service.listCompletedByProject(projectId('project-1'));
    expect(history).toHaveLength(1);
    expect(history[0]?.adventureTitle).toBe('Az elveszett tojás');
    expect(service.findCompletedById(projectId('project-1'), 'session-1')?.sessionId).toBe(
      'session-1',
    );
    expect(service.findCompletedById(projectId('another-project'), 'session-1')).toBeNull();
  });
});
