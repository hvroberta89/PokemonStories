import { TestBed } from '@angular/core/testing';

import { ActiveProjectStorage } from '../../../application/project/ports/active-project-storage';
import { ACTIVE_PROJECT_STORAGE } from '../../../application/project/tokens/active-project-storage.token';
import { projectId, ProjectId } from '../../../domain/project/value-objects/project-id';
import { ActiveProjectStore } from './active-project.store';

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

describe('ActiveProjectStore', () => {
  it('should persist and expose the selected project', () => {
    const storage = new MemoryActiveProjectStorage();
    TestBed.configureTestingModule({
      providers: [ActiveProjectStore, { provide: ACTIVE_PROJECT_STORAGE, useValue: storage }],
    });

    const store = TestBed.inject(ActiveProjectStore);
    store.select(projectId('project-1'));

    expect(store.projectId()).toBe('project-1');
    expect(store.status()).toBe('selected');
    expect(store.hasActiveProject()).toBe(true);
    expect(storage.value).toBe('project-1');
  });

  it('should clear the active project', () => {
    const storage = new MemoryActiveProjectStorage();
    storage.value = projectId('project-1');
    TestBed.configureTestingModule({
      providers: [ActiveProjectStore, { provide: ACTIVE_PROJECT_STORAGE, useValue: storage }],
    });

    const store = TestBed.inject(ActiveProjectStore);
    store.clear();

    expect(store.projectId()).toBeNull();
    expect(store.status()).toBe('none');
    expect(storage.value).toBeNull();
  });
});
