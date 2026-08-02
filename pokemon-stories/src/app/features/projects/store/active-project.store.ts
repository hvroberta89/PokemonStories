import { computed, inject, Injectable, signal } from '@angular/core';

import { ACTIVE_PROJECT_STORAGE } from '../../../application/project/tokens/active-project-storage.token';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

export type ActiveProjectStatus = 'none' | 'selected';

@Injectable({ providedIn: 'root' })
export class ActiveProjectStore {
  private readonly storage = inject(ACTIVE_PROJECT_STORAGE);
  private readonly selectedProjectId = signal<ProjectId | null>(this.storage.load());

  readonly projectId = this.selectedProjectId.asReadonly();
  readonly status = computed<ActiveProjectStatus>(() => (this.projectId() ? 'selected' : 'none'));
  readonly hasActiveProject = computed(() => this.projectId() !== null);

  select(projectId: ProjectId): void {
    this.storage.save(projectId);
    this.selectedProjectId.set(projectId);
  }

  clear(): void {
    this.storage.clear();
    this.selectedProjectId.set(null);
  }
}
