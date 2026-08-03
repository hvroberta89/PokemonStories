import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import type { RunningSessionState } from '../models/running-session-state.model';
import {
  CompletedProjectSessionDetail,
  CompletedProjectSessionSummary,
  ProjectSessionReader,
  ProjectSessionSummary,
} from '../../../application/session/ports/project-session-reader';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

@Injectable({
  providedIn: 'root',
})
export class RunningSessionStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly storageKey = 'pokemon-stories.running-session';
  private readonly historyStorageKey = 'pokemon-stories.session-history';

  load(): RunningSessionState | null {
    if (!this.isBrowser()) {
      return null;
    }

    const storedValue = window.localStorage.getItem(this.storageKey);

    if (!storedValue) {
      return null;
    }

    try {
      const parsedValue: unknown = this.migrate(JSON.parse(storedValue));

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
      if (state.status === 'completed') this.archive(state);
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

  findByProject(projectId: ProjectId): ProjectSessionSummary | null {
    const state = this.load();
    if (
      !state ||
      state.status === 'completed' ||
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
      status: state.status,
    };
  }

  listCompletedByProject(projectId: ProjectId): readonly CompletedProjectSessionSummary[] {
    return this.loadHistory()
      .filter((state) => state.projectId === projectId)
      .map((state) => ({
        sessionId: state.sessionId,
        projectId,
        adventureId: state.adventureId!,
        adventureTitle: state.adventureTitle!,
        finalSceneTitle: state.viewModel.story.locationName,
        startedAt: state.startedAt,
        completedAt: state.completedAt!,
        eventCount: state.viewModel.recentEvents.events.length,
        rewardCount: state.rewardHistory.length + state.rewardQueue.length,
        participantNames: state.participants?.map((participant) => participant.name) ?? [],
      }))
      .sort((left, right) => right.completedAt.localeCompare(left.completedAt));
  }

  findCompletedById(projectId: ProjectId, sessionId: string): CompletedProjectSessionDetail | null {
    const state = this.loadHistory().find(
      (item) => item.projectId === projectId && item.sessionId === sessionId,
    );
    if (!state) return null;
    return {
      sessionId: state.sessionId,
      projectId,
      adventureId: state.adventureId!,
      adventureTitle: state.adventureTitle!,
      finalSceneTitle: state.viewModel.story.locationName,
      startedAt: state.startedAt,
      completedAt: state.completedAt!,
      eventCount: state.viewModel.recentEvents.events.length,
      rewardCount: state.rewardHistory.length + state.rewardQueue.length,
      participantNames: state.participants?.map((participant) => participant.name) ?? [],
      story: state.sessionStory,
      narration: state.viewModel.story.narration,
      sceneTitles: state.scenes?.map((scene) => scene.title) ?? [
        state.viewModel.story.locationName,
      ],
      events: state.viewModel.recentEvents.events.map((event) => ({
        id: event.id,
        title: event.title,
        content: event.content,
        timeLabel: event.timeLabel,
      })),
      rewards: [...state.rewardHistory, ...state.rewardQueue].map((reward) => ({
        id: reward.id,
        recipientName: reward.recipientName,
        rewardLabel: reward.rewardLabel,
        amount: reward.amount,
      })),
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
      candidate.schemaVersion === 2 &&
      typeof candidate.sessionId === 'string' &&
      (candidate.projectId === undefined || typeof candidate.projectId === 'string') &&
      (candidate.adventureId === undefined || typeof candidate.adventureId === 'string') &&
      (candidate.adventureTitle === undefined || typeof candidate.adventureTitle === 'string') &&
      (candidate.scenes === undefined || Array.isArray(candidate.scenes)) &&
      (candidate.currentSceneIndex === undefined ||
        (typeof candidate.currentSceneIndex === 'number' &&
          Number.isInteger(candidate.currentSceneIndex) &&
          candidate.currentSceneIndex >= 0)) &&
      (candidate.participants === undefined || Array.isArray(candidate.participants)) &&
      (candidate.status === 'running' ||
        candidate.status === 'review-pending' ||
        candidate.status === 'completed') &&
      typeof candidate.startedAt === 'string' &&
      (candidate.completedAt === null || typeof candidate.completedAt === 'string') &&
      typeof candidate.viewModel === 'object' &&
      candidate.viewModel !== null &&
      Array.isArray(candidate.rewardQueue) &&
      Array.isArray(candidate.rewardHistory)
    );
  }

  private migrate(value: unknown): unknown {
    if (typeof value !== 'object' || value === null) return value;
    const candidate = value as { schemaVersion?: unknown; status?: unknown };
    if (candidate.schemaVersion !== 1) return value;
    return {
      ...candidate,
      schemaVersion: 2,
      status: candidate.status === 'completed' ? 'review-pending' : candidate.status,
    };
  }

  private archive(state: RunningSessionState): void {
    const history = this.loadHistory().filter((item) => item.sessionId !== state.sessionId);
    window.localStorage.setItem(this.historyStorageKey, JSON.stringify([...history, state]));
  }

  private loadHistory(): RunningSessionState[] {
    try {
      const value: unknown = JSON.parse(
        window.localStorage.getItem(this.historyStorageKey) ?? '[]',
      );
      if (!Array.isArray(value)) return [];
      return value
        .map((item) => this.migrate(item))
        .filter(
          (item): item is RunningSessionState =>
            this.isRunningSessionState(item) &&
            item.status === 'completed' &&
            Boolean(item.projectId && item.adventureId && item.adventureTitle && item.completedAt),
        );
    } catch {
      return [];
    }
  }
}
