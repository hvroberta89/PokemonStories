import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';

import type { RecentEventItemViewModel } from '../components/recent-events/recent-events.model';
import type { RewardHistoryItemViewModel } from '../components/reward-history/reward-history.model';
import type { RewardQueueItemViewModel } from '../components/reward-queue/reward-queue.model';
import type { RunningSessionState } from '../models/running-session-state.model';
import type { RunningSessionViewModel } from '../models/running-session-view.model';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { Character } from '../../../domain/character/models/character';
import { mockRunningSession } from '../mocks/running-session.mock';
import { RunningSessionStorageService } from './running-session-storage.service';
import { SESSION_CLOUD_REPOSITORY } from '../../../application/session/tokens/session-cloud-repository.token';
import { SessionSyncConflictError } from '../../../application/session/ports/session-cloud-repository';
import { REWARD_GRANT_REPOSITORY } from '../../../application/reward/tokens/reward-grant.tokens';
import { RewardGrant } from '../../../domain/reward/models/reward-grant';
import { projectId } from '../../../domain/project/value-objects/project-id';

export type SessionSyncStatus = 'local-only' | 'syncing' | 'synced' | 'offline' | 'conflict';

@Injectable({
  providedIn: 'root',
})
export class RunningSessionStore {
  private readonly storage = inject(RunningSessionStorageService);
  private readonly cloud = inject(SESSION_CLOUD_REPOSITORY);
  private readonly destroyRef = inject(DestroyRef);
  private readonly rewardGrants = inject(REWARD_GRANT_REPOSITORY);
  private syncTimer: ReturnType<typeof setTimeout> | undefined;
  private retryTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly syncStatusState = signal<SessionSyncStatus>('local-only');

  private readonly state = signal<RunningSessionState>(this.createInitialState());

  readonly session = this.state.asReadonly();
  readonly syncStatus = this.syncStatusState.asReadonly();

  readonly viewModel = computed(() => this.state().viewModel);

  readonly rewardQueue = computed(() => this.state().rewardQueue);

  readonly rewardHistory = computed(() => this.state().rewardHistory);

  readonly status = computed(() => this.state().status);

  readonly isReviewPending = computed(() => this.state().status === 'review-pending');

  readonly eventCount = computed(() => this.state().viewModel.recentEvents.events.length);

  readonly queuedRewardCount = computed(() => this.state().rewardQueue.length);

  readonly givenRewardCount = computed(() => this.state().rewardHistory.length);

  constructor() {
    effect(() => {
      const state = this.state();
      this.storage.save(state);
      this.scheduleCloudSync(state);
    });
    void this.restoreFromCloud();
    this.registerBrowserSyncEvents();
  }

  startFromAdventure(adventure: AdventurePlan, participants: readonly Character[] = []): void {
    const openingScene = adventure.scenes.find((scene) => scene.isOpening) ?? adventure.scenes[0];

    if (!openingScene || adventure.status !== 'ready') {
      throw new Error('Only a ready adventure with an opening scene can start a session.');
    }

    const defaults = structuredClone(mockRunningSession);
    const viewModel: RunningSessionViewModel = {
      ...defaults,
      story: {
        ...defaults.story,
        locationName: openingScene.title,
        narration: [openingScene.description],
        currentPage: 1,
        pageCount: adventure.scenes.length,
      },
      goal: {
        ...defaults.goal,
        title: openingScene.goal,
        description: adventure.premise,
        progressLabel: 'A kaland most kezdődik',
      },
      recentEvents: {
        ...defaults.recentEvents,
        newEventsLabel: 'Még nincs esemény',
        events: [],
      },
      characters: {
        ...defaults.characters,
        countLabel: `${participants.length} játékos`,
        characters: participants.map((character) => ({
          id: character.id,
          name: character.name,
          initials: character.name
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toLocaleUpperCase('hu'),
          status: 'ready',
          statusLabel: 'Készen áll',
        })),
      },
    };

    this.state.set({
      schemaVersion: 2,
      sessionId: crypto.randomUUID(),
      projectId: adventure.projectId,
      adventureId: adventure.id,
      adventureTitle: adventure.title,
      scenes: adventure.scenes.map((scene) => ({
        id: scene.id,
        title: scene.title,
        description: scene.description,
        goal: scene.goal,
      })),
      currentSceneIndex: adventure.scenes.indexOf(openingScene),
      participants: participants.map((character) => ({ id: character.id, name: character.name })),
      status: 'running',
      startedAt: new Date().toISOString(),
      completedAt: null,
      viewModel,
      rewardQueue: [],
      rewardHistory: [],
    });
  }

  nextScene(): boolean {
    const current = this.state();
    const scenes = current.scenes;
    const currentIndex = current.currentSceneIndex ?? 0;
    const nextScene = scenes?.[currentIndex + 1];
    if (!scenes || !nextScene || current.status !== 'running') return false;

    this.state.set({
      ...current,
      currentSceneIndex: currentIndex + 1,
      viewModel: {
        ...current.viewModel,
        story: {
          ...current.viewModel.story,
          locationName: nextScene.title,
          narration: [nextScene.description],
          currentPage: currentIndex + 2,
          pageCount: scenes.length,
        },
        goal: {
          ...current.viewModel.goal,
          title: nextScene.goal,
          description: nextScene.description,
          progressLabel: 'Új jelenet',
        },
        recentEvents: {
          ...current.viewModel.recentEvents,
          newEventsLabel: this.createEventCountLabel(
            current.viewModel.recentEvents.events.length + 1,
          ),
          events: [
            {
              id: crypto.randomUUID(),
              type: 'discovery',
              title: `Jelenetváltás: ${nextScene.title}`,
              content: nextScene.description,
              timeLabel: 'Most',
              icon: 'scene-change',
            },
            ...current.viewModel.recentEvents.events,
          ],
        },
      },
    });
    return true;
  }

  addRecentEvent(recentEvent: RecentEventItemViewModel): void {
    this.state.update((currentState) => {
      const currentEvents = currentState.viewModel.recentEvents.events;

      const updatedEvents = [recentEvent, ...currentEvents];

      return {
        ...currentState,
        viewModel: {
          ...currentState.viewModel,
          recentEvents: {
            ...currentState.viewModel.recentEvents,
            newEventsLabel: this.createEventCountLabel(updatedEvents.length),
            events: updatedEvents,
          },
        },
      };
    });
  }

  enqueueReward(reward: RewardQueueItemViewModel): void {
    this.state.update((currentState) => ({
      ...currentState,
      rewardQueue: [reward, ...currentState.rewardQueue],
    }));
  }

  markRewardAsGiven(rewardId: string): void {
    this.state.update((currentState) => {
      const reward = currentState.rewardQueue.find((item) => item.id === rewardId);

      if (!reward) {
        return currentState;
      }

      const historyItem: RewardHistoryItemViewModel = {
        id: reward.id,
        recipientId: reward.recipientId,
        recipientName: reward.recipientName,
        rewardType: reward.rewardType,
        rewardLabel: reward.rewardLabel,
        amount: reward.amount,
        icon: reward.icon,
        givenAtLabel: 'Most',
      };

      return {
        ...currentState,
        rewardQueue: currentState.rewardQueue.filter((item) => item.id !== rewardId),
        rewardHistory: [historyItem, ...currentState.rewardHistory],
      };
    });
  }

  completeSession(): void {
    this.state.update((currentState) => {
      if (currentState.status !== 'running') {
        return currentState;
      }

      return {
        ...currentState,
        status: 'review-pending',
        completedAt: new Date().toISOString(),
      };
    });
    void this.syncImmediately();
  }

  completeReview(): void {
    this.state.update((currentState) =>
      currentState.status === 'review-pending'
        ? { ...currentState, status: 'completed' }
        : currentState,
    );
    void this.syncImmediately();
  }

  restartSession(): void {
    const initialState = this.createDefaultState();

    this.state.set(initialState);
  }

  clearSession(): void {
    this.storage.clear();

    this.state.set(this.createDefaultState());
  }

  updateViewModel(update: (current: RunningSessionViewModel) => RunningSessionViewModel): void {
    this.state.update((currentState) => ({
      ...currentState,
      viewModel: update(currentState.viewModel),
    }));
  }

  private createInitialState(): RunningSessionState {
    const storedState = this.storage.load();

    if (storedState) {
      return storedState;
    }

    return this.createDefaultState();
  }

  private createDefaultState(): RunningSessionState {
    return {
      schemaVersion: 2,
      sessionId: crypto.randomUUID(),
      status: 'running',
      startedAt: new Date().toISOString(),
      completedAt: null,
      viewModel: structuredClone(mockRunningSession),
      rewardQueue: [],
      rewardHistory: [],
    };
  }

  private createEventCountLabel(eventCount: number): string {
    return `${eventCount} esemény`;
  }

  private scheduleCloudSync(state: RunningSessionState): void {
    if (!state.projectId || !state.adventureId) return;
    clearTimeout(this.syncTimer);
    this.syncTimer = setTimeout(() => void this.saveToCloud(state), 800);
  }

  private async syncImmediately(): Promise<void> {
    clearTimeout(this.syncTimer);
    await this.saveToCloud(this.state());
  }

  private async saveToCloud(state: RunningSessionState): Promise<void> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.syncStatusState.set('offline');
      this.scheduleRetry();
      return;
    }
    this.syncStatusState.set('syncing');
    try {
      await this.cloud.save(state);
      await this.syncRewardGrants(state);
      this.syncStatusState.set('synced');
      clearTimeout(this.retryTimer);
    } catch (error) {
      if (error instanceof SessionSyncConflictError) {
        this.syncStatusState.set('conflict');
        return;
      }
      this.syncStatusState.set('offline');
      this.scheduleRetry();
      console.error('A Session felhőszinkronja sikertelen; a helyi mentés megmaradt.', error);
    }
  }

  private async syncRewardGrants(state: RunningSessionState): Promise<void> {
    if (!state.projectId || !state.adventureId) return;
    const queued = state.rewardQueue.map((reward) =>
      RewardGrant.create({
        id: reward.id,
        projectId: projectId(state.projectId!),
        sessionId: state.sessionId,
        adventureId: state.adventureId!,
        recipientId: reward.recipientId,
        recipientName: reward.recipientName,
        type: reward.rewardType ?? 'custom',
        label: reward.rewardLabel,
        amount: reward.amount,
        physicalStatus: reward.status === 'printed' ? 'printed' : 'queued',
        deliveryStatus: 'pending',
      }),
    );
    const given = state.rewardHistory.map((reward) =>
      RewardGrant.create({
        id: reward.id,
        projectId: projectId(state.projectId!),
        sessionId: state.sessionId,
        adventureId: state.adventureId!,
        recipientId: reward.recipientId,
        recipientName: reward.recipientName,
        type: reward.rewardType ?? 'custom',
        label: reward.rewardLabel,
        amount: reward.amount,
        physicalStatus: 'printed',
        deliveryStatus: 'given',
      }),
    );
    await this.rewardGrants.saveAll([...queued, ...given]);
  }

  private async restoreFromCloud(): Promise<void> {
    try {
      const remote = await this.cloud.findRestorable();
      const local = this.storage.load();
      if (remote && (!local?.projectId || remote.startedAt > local.startedAt)) {
        this.state.set(remote);
      }
    } catch (error) {
      console.error('A felhőben tárolt Session visszaállítása sikertelen.', error);
    }
  }

  private scheduleRetry(): void {
    clearTimeout(this.retryTimer);
    this.retryTimer = setTimeout(() => void this.syncImmediately(), 5_000);
  }

  private registerBrowserSyncEvents(): void {
    if (typeof window === 'undefined') return;
    const retry = () => void this.syncImmediately();
    const flush = () => void this.syncImmediately();
    window.addEventListener('online', retry);
    window.addEventListener('pagehide', flush);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('online', retry);
      window.removeEventListener('pagehide', flush);
      clearTimeout(this.syncTimer);
      clearTimeout(this.retryTimer);
    });
  }
}
