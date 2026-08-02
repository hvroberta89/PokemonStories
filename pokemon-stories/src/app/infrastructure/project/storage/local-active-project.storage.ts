import { Injectable } from '@angular/core';

import { ActiveProjectStorage } from '../../../application/project/ports/active-project-storage';
import { projectId, ProjectId } from '../../../domain/project/value-objects/project-id';

@Injectable()
export class LocalActiveProjectStorage implements ActiveProjectStorage {
  private readonly storageKey = 'pokemon-stories.active-project-id';

  load(): ProjectId | null {
    const value = globalThis.localStorage?.getItem(this.storageKey);
    return value ? projectId(value) : null;
  }

  save(id: ProjectId): void {
    globalThis.localStorage?.setItem(this.storageKey, id);
  }

  clear(): void {
    globalThis.localStorage?.removeItem(this.storageKey);
  }
}
