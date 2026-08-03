import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';

import type { RecentEventItemViewModel } from '../components/recent-events/recent-events.model';
import type { RewardHistoryItemViewModel } from '../components/reward-history/reward-history.model';
import type { RewardQueueItemViewModel } from '../components/reward-queue/reward-queue.model';
import type { RunningSessionState } from '../models/running-session-state.model';
import type { RunningSessionViewModel } from '../models/running-session-view.model';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { Character } from '../../../domain/character/models/character';
import { RunningSessionStorageService } from './running-session-storage.service';
import { SESSION_CLOUD_REPOSITORY } from '../../../application/session/tokens/session-cloud-repository.token';
import { SessionSyncConflictError } from '../../../application/session/ports/session-cloud-repository';
import { REWARD_GRANT_REPOSITORY } from '../../../application/reward/tokens/reward-grant.tokens';
import { RewardGrant } from '../../../domain/reward/models/reward-grant';
import { projectId } from '../../../domain/project/value-objects/project-id';
import type { PreparedReward } from '../../../domain/reward/models/prepared-reward';
import { PREPARED_REWARD_REPOSITORY } from '../../../application/reward/tokens/prepared-reward.tokens';
import { Session } from '../../../domain/session/models/session';

export type SessionSyncStatus = 'local-only' | 'syncing' | 'synced' | 'offline' | 'conflict';

@Injectable({
  providedIn: 'root',
})
export class RunningSessionStore {
  private readonly storage = inject(RunningSessionStorageService);
  private readonly cloud = inject(SESSION_CLOUD_REPOSITORY);
  private readonly destroyRef = inject(DestroyRef);
  private readonly rewardGrants = inject(REWARD_GRANT_REPOSITORY);
  private readonly preparedRewards = inject(PREPARED_REWARD_REPOSITORY);
  private syncTimer: ReturnType<typeof setTimeout> | undefined;
  private retryTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly syncStatusState = signal<SessionSyncStatus>('local-only');

  private readonly state = signal<RunningSessionState>(this.createInitialState());

  readonly session = this.state.asReadonly();
  readonly syncStatus = this.syncStatusState.asReadonly();

  readonly viewModel = computed(() => this.state().viewModel);

  readonly rewardQueue = computed(() => this.state().rewardQueue);

  readonly rewardHistory = computed(() => this.state().rewardHistory);

  readonly availablePreparedRewards = computed(() => {
    const session = this.state();
    const currentScene = session.scenes?.[session.currentSceneIndex ?? 0];

    return (session.preparedRewards ?? []).filter(
      (reward) => !reward.sceneId || reward.sceneId === currentScene?.id,
    );
  });

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

  startFromAdventure(
    adventure: AdventurePlan,
    participants: readonly Character[] = [],
    preparedRewards: readonly PreparedReward[] = [],
  ): void {
    const openingScene = adventure.scenes.find((scene) => scene.isOpening) ?? adventure.scenes[0];

    if (!openingScene || adventure.status !== 'ready') {
      throw new Error('Only a ready adventure with an opening scene can start a session.');
    }

    const viewModel = this.createViewModel({
      locationName: openingScene.title,
      narration: openingScene.description,
      goal: openingScene.goal,
      goalDescription: adventure.premise,
      currentPage: 1,
      pageCount: adventure.scenes.length,
      participants,
    });

    const session = Session.start({
      id: crypto.randomUUID(),
      projectId: adventure.projectId,
      adventureId: adventure.id,
      startedAt: new Date().toISOString(),
    });
    if (!session.isSuccess) throw session.error;

    this.state.set({
      schemaVersion: 2,
      sessionId: session.value.id,
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
      preparedRewards: preparedRewards.map((reward) => reward.value),
      status: session.value.status,
      startedAt: session.value.startedAt,
      completedAt: session.value.completedAt,
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

  markRewardAsPrinted(rewardId: string): void {
    this.markRewardsAsPrinted([rewardId]);
  }

  markRewardsAsPrinted(rewardIds: readonly string[]): void {
    const rewardIdSet = new Set(rewardIds);
    this.state.update((currentState) => ({
      ...currentState,
      rewardQueue: currentState.rewardQueue.map((reward) =>
        rewardIdSet.has(reward.id) && reward.physicalStatus === 'queued'
          ? { ...reward, status: 'printed', physicalStatus: 'printed' }
          : reward,
      ),
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
        physicalStatus: reward.physicalStatus === 'queued' ? 'printed' : reward.physicalStatus,
        preparedRewardId: reward.preparedRewardId,
      };

      return {
        ...currentState,
        rewardQueue: currentState.rewardQueue.filter((item) => item.id !== rewardId),
        rewardHistory: [historyItem, ...currentState.rewardHistory],
      };
    });
  }

  completeSession(): boolean {
    let completed = false;
    this.state.update((currentState) => {
      const session = this.restoreSession(currentState);
      if (!session) {
        return currentState;
      }
      const result = session.finishGameplay(new Date().toISOString());
      if (!result.isSuccess) return currentState;
      completed = true;

      return {
        ...currentState,
        status: result.value.status,
        completedAt: result.value.completedAt,
      };
    });
    if (completed) void this.syncImmediately();
    return completed;
  }

  completeReview(): boolean {
    let completed = false;
    this.state.update((currentState) => {
      const session = this.restoreSession(currentState);
      if (!session) return currentState;
      const result = session.completeReview();
      if (!result.isSuccess) return currentState;
      completed = true;
      return { ...currentState, status: result.value.status, completedAt: result.value.completedAt };
    });
    if (completed) void this.syncImmediately();
    return completed;
  }

  saveSessionStory(story: string | undefined): void {
    const sessionStory = story?.trim() || undefined;
    this.state.update((currentState) => ({ ...currentState, sessionStory }));
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

  private restoreSession(state: RunningSessionState): Session | null {
    if (!state.projectId || !state.adventureId) return null;
    const session = Session.restore({
      id: state.sessionId,
      projectId: state.projectId,
      adventureId: state.adventureId,
      status: state.status,
      startedAt: state.startedAt,
      completedAt: state.completedAt,
    });
    return session.isSuccess ? session.value : null;
  }

  private createDefaultState(): RunningSessionState {
    return {
      schemaVersion: 2,
      sessionId: crypto.randomUUID(),
      status: 'running',
      startedAt: new Date().toISOString(),
      completedAt: null,
      viewModel: this.createViewModel({
        locationName: 'Nincs aktív jelenet',
        narration: 'Indíts egy előkészített kalandot a Session megkezdéséhez.',
        goal: 'Válassz egy kalandot',
        goalDescription: 'A Session előkészítésénél választhatsz játékra kész kalandot.',
        currentPage: 0,
        pageCount: 0,
        participants: [],
      }),
      rewardQueue: [],
      rewardHistory: [],
    };
  }

  private createEventCountLabel(eventCount: number): string {
    return `${eventCount} esemény`;
  }

  private createViewModel(input: {
    readonly locationName: string;
    readonly narration: string;
    readonly goal: string;
    readonly goalDescription: string;
    readonly currentPage: number;
    readonly pageCount: number;
    readonly participants: readonly Character[];
  }): RunningSessionViewModel {
    return {
      story: {
        locationName: input.locationName,
        locationIcon: 'environment-forest',
        narration: [input.narration],
        imageUrl: '/images/story-cards/flower-meadow.png',
        imageAlt: `${input.locationName} illusztrációja`,
        mood: 'exploration',
        currentPage: input.currentPage,
        pageCount: input.pageCount,
      },
      goal: {
        title: input.goal,
        description: input.goalDescription,
        status: 'active',
        progressLabel:
          input.currentPage > 0 ? `${input.currentPage}. jelenet` : 'Session előkészítésre vár',
        actionLabel: 'Az aktuális cél részletei',
      },
      characters: {
        title: 'Kalandorok',
        countLabel: `${input.participants.length} játékos`,
        addLabel: 'Játékos hozzáadása',
        characters: input.participants.map((character) => ({
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
      recentEvents: {
        title: 'Legutóbbi események',
        newEventsLabel: 'Még nincs esemény',
        detailsLabel: 'Legutóbbi események megnyitása',
        events: [],
      },
      assistant: {
        title: 'Mi történjen most?',
        description: 'Kérj gyors segítséget az aktuális jelenethez.',
        options: [],
      },
      dock: {
        quickActionLabel: 'Gyors művelet',
        items: [
          { action: 'notes', label: 'Jegyzetek', icon: 'notes-scroll' },
          { action: 'rewards', label: 'Jutalmak', icon: 'reward-gift' },
          { action: 'assistant', label: 'AI segítő', icon: 'ai-crystal' },
          { action: 'inventory', label: 'Várólista', icon: 'print-queue' },
        ],
      },
    };
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
        preparedRewardId: reward.preparedRewardId,
        recipientId: reward.recipientId,
        recipientName: reward.recipientName,
        type: reward.rewardType ?? 'custom',
        label: reward.rewardLabel,
        amount: reward.amount,
        physicalStatus:
          reward.physicalStatus ?? (reward.status === 'printed' ? 'printed' : 'queued'),
        deliveryStatus: 'pending',
      }),
    );
    const given = state.rewardHistory.map((reward) =>
      RewardGrant.create({
        id: reward.id,
        projectId: projectId(state.projectId!),
        sessionId: state.sessionId,
        adventureId: state.adventureId!,
        preparedRewardId: reward.preparedRewardId,
        recipientId: reward.recipientId,
        recipientName: reward.recipientName,
        type: reward.rewardType ?? 'custom',
        label: reward.rewardLabel,
        amount: reward.amount,
        physicalStatus: reward.physicalStatus ?? 'printed',
        deliveryStatus: 'given',
      }),
    );
    await this.rewardGrants.saveAll([...queued, ...given]);
    const preparedRewardIds = [
      ...new Set(
        [...state.rewardQueue, ...state.rewardHistory]
          .map((reward) => reward.preparedRewardId)
          .filter((rewardId): rewardId is string => Boolean(rewardId)),
      ),
    ];
    await this.preparedRewards.markUnlocked(
      projectId(state.projectId),
      preparedRewardIds,
      state.sessionId,
    );
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
