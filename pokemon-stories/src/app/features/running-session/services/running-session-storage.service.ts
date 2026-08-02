import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import type { RunningSessionState } from '../models/running-session-state.model';
import {
  ActiveRunningSessionReader,
  ActiveRunningSessionSummary,
} from '../../../application/session/ports/active-running-session-reader';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

@Injectable({
  providedIn: 'root',
})
export class RunningSessionStorageService implements ActiveRunningSessionReader {
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

  findByProject(projectId: ProjectId): ActiveRunningSessionSummary | null {
    const state = this.load();
    if (
      !state ||
      state.status !== 'running' ||
      state.projectId !== projectId ||
      !state.adventureId ||
      !state.adventureTitle
    ) {
      return null;
    }
    return {
      sessionId: state.sessionId,
      projectId,
      adventureId: state.adventureId,
      adventureTitle: state.adventureTitle,
      currentSceneTitle: state.viewModel.story.locationName,
      currentGoal: state.viewModel.goal.title,
      startedAt: state.startedAt,
    };
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
      (candidate.scenes === undefined || Array.isArray(candidate.scenes)) &&
      (candidate.currentSceneIndex === undefined ||
        (typeof candidate.currentSceneIndex === 'number' &&
          Number.isInteger(candidate.currentSceneIndex) &&
          candidate.currentSceneIndex >= 0)) &&
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
