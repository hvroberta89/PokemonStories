import { computed, effect, inject, Injectable, signal } from '@angular/core';

import type { RecentEventItemViewModel } from '../components/recent-events/recent-events.model';
import type { RewardHistoryItemViewModel } from '../components/reward-history/reward-history.model';
import type { RewardQueueItemViewModel } from '../components/reward-queue/reward-queue.model';
import type { RunningSessionState } from '../models/running-session-state.model';
import type { RunningSessionViewModel } from '../models/running-session-view.model';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { mockRunningSession } from '../mocks/running-session.mock';
import { RunningSessionStorageService } from './running-session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RunningSessionStore {
  private readonly storage = inject(RunningSessionStorageService);

  private readonly state = signal<RunningSessionState>(this.createInitialState());

  readonly session = this.state.asReadonly();

  readonly viewModel = computed(() => this.state().viewModel);

  readonly rewardQueue = computed(() => this.state().rewardQueue);

  readonly rewardHistory = computed(() => this.state().rewardHistory);

  readonly status = computed(() => this.state().status);

  readonly isCompleted = computed(() => this.state().status === 'completed');

  readonly eventCount = computed(() => this.state().viewModel.recentEvents.events.length);

  readonly queuedRewardCount = computed(() => this.state().rewardQueue.length);

  readonly givenRewardCount = computed(() => this.state().rewardHistory.length);

  constructor() {
    effect(() => {
      this.storage.save(this.state());
    });
  }

  startFromAdventure(adventure: AdventurePlan): void {
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
    };

    this.state.set({
      schemaVersion: 1,
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
        recipientName: reward.recipientName,
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
      if (currentState.status === 'completed') {
        return currentState;
      }

      return {
        ...currentState,
        status: 'completed',
        completedAt: new Date().toISOString(),
      };
    });
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

    if (storedState?.status === 'running') {
      return storedState;
    }

    return this.createDefaultState();
  }

  private createDefaultState(): RunningSessionState {
    return {
      schemaVersion: 1,
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
}
