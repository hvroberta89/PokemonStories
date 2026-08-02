import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import type { RunningSessionState } from '../models/running-session-state.model';

@Injectable({
  providedIn: 'root',
})
export class RunningSessionStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly storageKey = 'pokemon-stories.running-session';

  load(): RunningSessionState | null {
    if (!this.isBrowser()) {
      return null;
    }

    const storedValue = window.localStorage.getItem(this.storageKey);

    if (!storedValue) {
      return null;
    }

    try {
      const parsedValue: unknown = JSON.parse(storedValue);

      if (!this.isRunningSessionState(parsedValue)) {
        this.clear();

        return null;
      }

      return parsedValue;
    } catch {
      this.clear();

      return null;
    }
  }

  save(state: RunningSessionState): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('A Running Session mentése sikertelen.', error);
    }
  }

  clear(): void {
    if (!this.isBrowser()) {
      return;
    }

    window.localStorage.removeItem(this.storageKey);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private isRunningSessionState(value: unknown): value is RunningSessionState {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const candidate = value as Partial<RunningSessionState>;

    return (
      candidate.schemaVersion === 1 &&
      typeof candidate.sessionId === 'string' &&
      (candidate.projectId === undefined || typeof candidate.projectId === 'string') &&
      (candidate.adventureId === undefined || typeof candidate.adventureId === 'string') &&
      (candidate.adventureTitle === undefined || typeof candidate.adventureTitle === 'string') &&
      (candidate.status === 'running' || candidate.status === 'completed') &&
      typeof candidate.startedAt === 'string' &&
      (candidate.completedAt === null || typeof candidate.completedAt === 'string') &&
      typeof candidate.viewModel === 'object' &&
      candidate.viewModel !== null &&
      Array.isArray(candidate.rewardQueue) &&
      Array.isArray(candidate.rewardHistory)
    );
  }
}
