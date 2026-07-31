import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  CharactersStripComponent,
} from '../../components/characters-strip/characters-strip.component';
import {
  GoalCardComponent,
} from '../../components/goal-card/goal-card.component';
import {
  QuickDockComponent,
} from '../../components/quick-dock/quick-dock.component';
import {
  QuickDockAction,
} from '../../components/quick-dock/quick-dock.model';
import {
  StoryCardComponent,
} from '../../components/story-card/story-card.component';
import {
  mockQuickActionMenu,
  mockRunningSession,
} from '../../mocks/running-session.mock';
import {
  RecentEventItemViewModel,
} from '../../components/recent-events/recent-events.model';
import {
  RecentEventsComponent,
} from '../../components/recent-events/recent-events.component';
import {
  QuickActionMenuComponent,
} from '../../components/quick-action-menu/quick-action-menu.component';
import {
  QuickActionType,
} from '../../components/quick-action-menu/quick-action-menu.model';
import {
  QuickNoteComponent,
} from '../../components/quick-note/quick-note.component';
import {
  QuickNoteDraft,
} from '../../components/quick-note/quick-note.model';
import {
  RecentEventDetailsComponent,
} from '../../components/recent-event-details/recent-event-details.component';
import {
  RewardSheetComponent,
} from '../../components/reward-sheet/reward-sheet.component';
import {
  RewardDraft,
  RewardRecipient,
} from '../../components/reward-sheet/reward-sheet.model';
import {
  RecentEventFactory,
} from '../../services/recent-event.factory';
import {
  PsRewardToastComponent,
} from '../../../../shared/ui/public-api';
import {
  RewardQueueItemViewModel,
} from '../../components/reward-queue/reward-queue.model';
import { RewardCenterComponent } from '../../components/reward-center/reward-center.component';
import { RewardHistoryItemViewModel } from '../../components/reward-history/reward-history.model';

@Component({
  selector: 'app-running-session-page',
  standalone: true,
  imports: [
    StoryCardComponent,
    GoalCardComponent,
    CharactersStripComponent,
    RecentEventsComponent,
    RecentEventDetailsComponent,
    QuickActionMenuComponent,
    QuickDockComponent,
    QuickNoteComponent,
    RewardSheetComponent,
    PsRewardToastComponent,
    RewardCenterComponent,
  ],
  templateUrl:
    './running-session-page.component.html',
  styleUrl:
    './running-session-page.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class RunningSessionPageComponent {
  private rewardToastTimeoutId:
    number | null = null;

  private readonly recentEventFactory =
    inject(RecentEventFactory);

  protected readonly viewModel =
    signal(mockRunningSession);

  protected readonly selectedAction =
    signal<QuickDockAction | null>(null);

  protected readonly selectedCharacterId =
    signal<string | null>(null);

  protected readonly selectedRecentEvent =
    signal<RecentEventItemViewModel | null>(
      null,
    );

  protected readonly quickActionMenu =
    signal(mockQuickActionMenu);

  protected readonly isQuickActionMenuOpen =
    signal(false);

  protected readonly selectedQuickAction =
    signal<QuickActionType | null>(null);

  protected readonly isQuickNoteOpen =
    signal(false);

  protected readonly isRewardSheetOpen =
    signal(false);

  protected readonly isRewardToastVisible =
    signal(false);

  protected readonly latestReward =
    signal<RewardDraft | null>(null);

  protected readonly rewardQueue =
    signal<
      readonly RewardQueueItemViewModel[]
    >([]);

  protected readonly isRewardQueueOpen =
    signal(false);

  protected readonly rewardRecipients =
    signal<readonly RewardRecipient[]>([
      {
        id: 'lili',
        name: 'Lili',
      },
      {
        id: 'marci',
        name: 'Marci',
      },
      {
        id: 'piko',
        name: 'Pikó',
      },
    ]);

  protected selectCharacter(
    characterId: string,
  ): void {
    this.selectedCharacterId.set(
      characterId,
    );
  }

  protected addCharacter(): void {
    console.log('Add character');
  }

  protected selectRecentEvent(
    eventId: string,
  ): void {
    const selectedEvent =
      this.viewModel()
        .recentEvents
        .events
        .find(
          event =>
            event.id === eventId,
        );

    if (!selectedEvent) {
      return;
    }

    this.selectedRecentEvent.set(
      selectedEvent,
    );
  }

  protected closeRecentEventDetails(): void {
    this.selectedRecentEvent.set(null);
  }

  protected openRecentEvents(): void {
    console.log('Open recent events');
  }

  protected openCharacterDetails(): void {
    console.log(
      'Open character details',
    );
  }

  protected openGoalDetails(): void {
    console.log('Open goal details');
  }

  protected openQuickActions(): void {
    this.isQuickActionMenuOpen.set(
      true,
    );
  }

  protected closeQuickActions(): void {
    this.isQuickActionMenuOpen.set(
      false,
    );
  }

  protected closeQuickNote(): void {
    this.isQuickNoteOpen.set(false);
  }

  protected closeRewardSheet(): void {
    this.isRewardSheetOpen.set(false);
  }

  protected openRewardQueue(): void {
    this.isRewardQueueOpen.set(true);
  }

  protected closeRewardQueue(): void {
    this.isRewardQueueOpen.set(false);
  }

  protected readonly isRewardCenterOpen =
  signal(false);

  protected selectQuickAction(
    action: QuickDockAction,
  ): void {
    this.selectedAction.set(action);

    if (action === 'rewards') {
      this.openRewardCenter();
    }
  }

  protected openRewardCenter(): void {
    this.isRewardCenterOpen.set(true);
  }

  protected closeRewardCenter(): void {
    this.isRewardCenterOpen.set(false);
  }

  protected saveReward(
    reward: RewardDraft,
  ): void {
    const recentEvent =
      this.recentEventFactory
        .createReward(reward);

    const queueItem =
      this.createRewardQueueItem(
        reward,
      );

    this.latestReward.set(reward);

    this.rewardQueue.update(
      currentItems => [
        queueItem,
        ...currentItems,
      ],
    );

    this.viewModel.update(
      currentViewModel => {
        const currentEvents =
          currentViewModel
            .recentEvents
            .events;

        const updatedEvents = [
          recentEvent,
          ...currentEvents,
        ].slice(0, 3);

        return {
          ...currentViewModel,
          recentEvents: {
            ...currentViewModel
              .recentEvents,
            newEventsLabel:
              `${updatedEvents.length} új esemény`,
            events: updatedEvents,
          },
        };
      },
    );

    this.isRewardSheetOpen.set(false);
    this.isRewardToastVisible.set(true);

    if (
      this.rewardToastTimeoutId !==
      null
    ) {
      window.clearTimeout(
        this.rewardToastTimeoutId,
      );
    }

    this.rewardToastTimeoutId =
      window.setTimeout(
        () => {
          this.closeRewardToast();
        },
        3500,
      );
  }

  protected closeRewardToast(): void {
    this.isRewardToastVisible.set(
      false,
    );

    if (
      this.rewardToastTimeoutId !==
      null
    ) {
      window.clearTimeout(
        this.rewardToastTimeoutId,
      );

      this.rewardToastTimeoutId =
        null;
    }
  }

  protected readonly rewardHistory =
    signal<
      readonly RewardHistoryItemViewModel[]
    >([]);

  protected markRewardAsGiven(
    rewardId: string,
  ): void {
    const reward =
      this.rewardQueue()
        .find(item => item.id === rewardId);

    if (!reward) {
      return;
    }

    const historyItem:
      RewardHistoryItemViewModel = {
        id: reward.id,
        recipientName:
          reward.recipientName,
        rewardLabel:
          reward.rewardLabel,
        amount:
          reward.amount,
        icon:
          reward.icon,
        givenAtLabel:
          'Most',
      };

    this.rewardQueue.update(
      currentItems =>
        currentItems.filter(
          item => item.id !== rewardId,
        ),
    );

    this.rewardHistory.update(
      currentItems => [
        historyItem,
        ...currentItems,
      ],
    );
  }

  protected saveQuickNote(
    note: QuickNoteDraft,
  ): void {
    const recentEvent =
      this.recentEventFactory
        .createQuickNote(note);

    this.viewModel.update(
      currentViewModel => {
        const currentEvents =
          currentViewModel
            .recentEvents
            .events;

        const updatedEvents = [
          recentEvent,
          ...currentEvents,
        ].slice(0, 3);

        return {
          ...currentViewModel,
          recentEvents: {
            ...currentViewModel
              .recentEvents,
            newEventsLabel:
              `${updatedEvents.length} új esemény`,
            events: updatedEvents,
          },
        };
      },
    );

    this.isQuickNoteOpen.set(false);
  }

  protected selectQuickMenuAction(
    action: QuickActionType,
  ): void {
    this.selectedQuickAction.set(
      action,
    );

    this.isQuickActionMenuOpen.set(
      false,
    );

    if (action === 'note') {
      this.isQuickNoteOpen.set(true);
      return;
    }

    if (action === 'reward') {
      this.isRewardSheetOpen.set(
        true,
      );
    }
  }

  private createRewardQueueItem(
    reward: RewardDraft,
  ): RewardQueueItemViewModel {
    return {
      id: crypto.randomUUID(),
      recipientName:
        reward.recipientName,
      rewardLabel:
        reward.rewardLabel,
      amount:
        reward.amount,
      icon:
        'reward-gift',
      status:
        'unlocked',
    };
  }
}