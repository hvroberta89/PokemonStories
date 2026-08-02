import { TestBed } from '@angular/core/testing';

import { ADVENTURE_PLAN_READER } from '../../../application/adventure/tokens/adventure-plan.tokens';
import { ActiveProjectStorage } from '../../../application/project/ports/active-project-storage';
import { ACTIVE_PROJECT_STORAGE } from '../../../application/project/tokens/active-project-storage.token';
import { PROJECT_READER } from '../../../application/project/tokens/project.tokens';
import { Project } from '../../../domain/project/models/project';
import { projectId, ProjectId } from '../../../domain/project/value-objects/project-id';
import { InMemoryAdventurePlanRepository } from '../../../infrastructure/adventure/repositories/in-memory-adventure-plan.repository';
import { InMemoryProjectRepository } from '../../../infrastructure/project/repositories/in-memory-project.repository';
import { ActiveProjectStore } from '../../projects/store/active-project.store';
import { ProjectDashboardStore } from './project-dashboard.store';
import {
  ProjectSessionReader,
  ProjectSessionSummary,
} from '../../../application/session/ports/project-session-reader';
import { PROJECT_SESSION_READER } from '../../../application/session/tokens/project-session.tokens';

class MemoryActiveProjectStorage implements ActiveProjectStorage {
  value: ProjectId | null = null;
  load(): ProjectId | null {
    return this.value;
  }
  save(id: ProjectId): void {
    this.value = id;
  }
  clear(): void {
    this.value = null;
  }
}

class MemoryRunningSessionReader implements ProjectSessionReader {
  value: ProjectSessionSummary | null = null;
  findByProject(id: ProjectId): ProjectSessionSummary | null {
    return this.value?.projectId === id ? this.value : null;
  }
  listCompletedByProject(): readonly [] {
    return [];
  }
  findCompletedById(): null {
    return null;
  }
}

describe('ProjectDashboardStore', () => {
  let projects: InMemoryProjectRepository;
  let store: ProjectDashboardStore;
  let sessions: MemoryRunningSessionReader;

  beforeEach(() => {
    projects = new InMemoryProjectRepository();
    sessions = new MemoryRunningSessionReader();
    TestBed.configureTestingModule({
      providers: [
        ProjectDashboardStore,
        ActiveProjectStore,
        { provide: PROJECT_READER, useValue: projects },
        {
          provide: ADVENTURE_PLAN_READER,
          useValue: new InMemoryAdventurePlanRepository(),
        },
        {
          provide: ACTIVE_PROJECT_STORAGE,
          useValue: new MemoryActiveProjectStorage(),
        },
        { provide: PROJECT_SESSION_READER, useValue: sessions },
      ],
    });
    store = TestBed.inject(ProjectDashboardStore);
  });

  it('should resolve an empty project to creating an adventure', async () => {
    const result = Project.create({
      id: projectId('project-1'),
      name: 'Kanto kalandok',
    });
    if (!result.isSuccess) throw result.error;
    await projects.save(result.value);

    await store.load('project-1');

    expect(store.status()).toBe('loaded');
    expect(store.dashboard()?.project.name).toBe('Kanto kalandok');
    expect(store.dashboard()?.primaryAction.kind).toBe('create-adventure');
    expect(TestBed.inject(ActiveProjectStore).projectId()).toBe('project-1');
  });

  it('should expose a not-found state for an unavailable project', async () => {
    await store.load('missing-project');

    expect(store.isNotFound()).toBe(true);
    expect(store.dashboard()).toBeNull();
  });

  it('should prioritize resuming an active project session', async () => {
    const result = Project.create({ id: projectId('project-1'), name: 'Kanto kalandok' });
    if (!result.isSuccess) throw result.error;
    await projects.save(result.value);
    sessions.value = {
      sessionId: 'session-1',
      projectId: projectId('project-1'),
      adventureId: 'adventure-1',
      adventureTitle: 'Az elveszett tojás',
      currentSceneTitle: 'Virágos tisztás',
      currentGoal: 'Találjátok meg a tojást.',
      startedAt: new Date().toISOString(),
      status: 'running',
    };

    await store.load('project-1');

    expect(store.dashboard()?.primaryAction.kind).toBe('resume-session');
  });

  it('should prioritize reviewing a completed project session', async () => {
    const result = Project.create({ id: projectId('project-1'), name: 'Kanto kalandok' });
    if (!result.isSuccess) throw result.error;
    await projects.save(result.value);
    sessions.value = {
      sessionId: 'session-1',
      projectId: projectId('project-1'),
      adventureId: 'adventure-1',
      adventureTitle: 'Az elveszett tojás',
      currentSceneTitle: 'Öreg híd',
      currentGoal: 'Vigyétek haza a tojást.',
      startedAt: new Date().toISOString(),
      status: 'review-pending',
    };

    await store.load('project-1');

    expect(store.dashboard()?.primaryAction.kind).toBe('review-session');
  });
});
