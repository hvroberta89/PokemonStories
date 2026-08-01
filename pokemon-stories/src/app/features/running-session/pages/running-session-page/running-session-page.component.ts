import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  PsRewardToastComponent,
} from '../../../../shared/ui/public-api';

import {
  AssistantSheetComponent,
} from '../../components/assistant-sheet/assistant-sheet.component';
import type {
  AssistantQuickActionId,
} from '../../components/assistant-sheet/assistant-sheet.model';

import {
  CharactersStripComponent,
} from '../../components/characters-strip/characters-strip.component';

import {
  GoalCardComponent,
} from '../../components/goal-card/goal-card.component';

import {
  QuickActionMenuComponent,
} from '../../components/quick-action-menu/quick-action-menu.component';
import type {
  QuickActionType,
} from '../../components/quick-action-menu/quick-action-menu.model';

import {
  QuickDockComponent,
} from '../../components/quick-dock/quick-dock.component';
import type {
  QuickDockAction,
} from '../../components/quick-dock/quick-dock.model';

import {
  QuickNoteComponent,
} from '../../components/quick-note/quick-note.component';
import type {
  QuickNoteDraft,
} from '../../components/quick-note/quick-note.model';

import {
  RecentEventDetailsComponent,
} from '../../components/recent-event-details/recent-event-details.component';

import {
  RecentEventsComponent,
} from '../../components/recent-events/recent-events.component';
import type {
  RecentEventItemViewModel,
} from '../../components/recent-events/recent-events.model';

import {
  RewardCenterComponent,
} from '../../components/reward-center/reward-center.component';

import type {
  RewardHistoryItemViewModel,
} from '../../components/reward-history/reward-history.model';

import type {
  RewardQueueItemViewModel,
} from '../../components/reward-queue/reward-queue.model';

import {
  RewardSheetComponent,
} from '../../components/reward-sheet/reward-sheet.component';
import type {
  RewardDraft,
  RewardRecipient,
} from '../../components/reward-sheet/reward-sheet.model';

import {
  StoryCardComponent,
} from '../../components/story-card/story-card.component';

import {
  mockAdventureAssistant,
  mockQuickActionMenu,
} from '../../mocks/running-session.mock';

import {
  RecentEventFactory,
} from '../../services/recent-event.factory';

import {
  AssistantPromptComponent,
} from '../../components/assistant-prompt/assistant-prompt.component';
import type {
  AssistantPromptDraft,
  AssistantPromptType,
  AssistantPromptViewModel,
} from '../../components/assistant-prompt/assistant-prompt.model';

import {
  AssistantResultsComponent,
} from '../../components/assistant-results/assistant-results.component';
import type {
  AssistantResultsViewModel,
  AssistantSuggestionSelection,
} from '../../components/assistant-results/assistant-results.model';
import { AssistantSuggestionToastComponent } from '../../components/assistant-suggestion-toast/assistant-suggestion-toast.component';
import { RunningSessionStore } from '../../services/running-session.store';

@Component({
  selector: 'app-running-session-page',
  standalone: true,
  imports: [
    AssistantSheetComponent,
    AssistantPromptComponent,
    AssistantResultsComponent,
    AssistantSuggestionToastComponent,
    CharactersStripComponent,
    GoalCardComponent,
    PsRewardToastComponent,
    QuickActionMenuComponent,
    QuickDockComponent,
    QuickNoteComponent,
    RecentEventDetailsComponent,
    RecentEventsComponent,
    RewardCenterComponent,
    RewardSheetComponent,
    StoryCardComponent,
  ],
  templateUrl:
    './running-session-page.component.html',
  styleUrl:
    './running-session-page.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class RunningSessionPageComponent {
  // ---------------------------------------------------------------------------
  // Services
  // ---------------------------------------------------------------------------

  private readonly recentEventFactory =
    inject(RecentEventFactory);

  private readonly store =
    inject(RunningSessionStore);

  // ---------------------------------------------------------------------------
  // Timeout handles
  // ---------------------------------------------------------------------------

  private rewardToastTimeoutId:
    number | null = null;

  private assistantToastTimeoutId:
    number | null = null;  

  // ---------------------------------------------------------------------------
  // Page data
  // ---------------------------------------------------------------------------

  protected readonly viewModel =
    this.store.viewModel;

  protected readonly quickActionMenu =
    signal(mockQuickActionMenu);

  protected readonly assistant =
    signal(mockAdventureAssistant);

  // ---------------------------------------------------------------------------
  // Selection state
  // ---------------------------------------------------------------------------

  protected readonly selectedAction =
    signal<QuickDockAction | null>(null);

  protected readonly selectedQuickAction =
    signal<QuickActionType | null>(null);

  protected readonly selectedCharacterId =
    signal<string | null>(null);

  protected readonly selectedRecentEvent =
    signal<RecentEventItemViewModel | null>(
      null,
    );

  // ---------------------------------------------------------------------------
  // Overlay state
  // ---------------------------------------------------------------------------

  protected readonly isQuickActionMenuOpen =
    signal(false);

  protected readonly isQuickNoteOpen =
    signal(false);

  protected readonly isRewardSheetOpen =
    signal(false);

  protected readonly isRewardCenterOpen =
    signal(false);

  protected readonly isAssistantOpen =
    signal(false);

  protected readonly isRewardToastVisible =
    signal(false);

  // ---------------------------------------------------------------------------
  // Reward state
  // ---------------------------------------------------------------------------

  protected readonly latestReward =
    signal<RewardDraft | null>(null);

  protected readonly rewardQueue =
    this.store.rewardQueue;

  protected readonly rewardHistory =
    this.store.rewardHistory;

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

  // ---------------------------------------------------------------------------
  // Assistant state
  // ---------------------------------------------------------------------------

  protected readonly selectedAssistantPrompt =
    signal<AssistantPromptViewModel | null>(
      null,
    );

  protected readonly assistantResults =
    signal<AssistantResultsViewModel | null>(
      null,
    );

  protected readonly isAssistantPromptOpen =
    signal(false);

  protected readonly isAssistantPromptLoading =
    signal(false);

  protected readonly isAssistantResultsOpen =
    signal(false);

  protected readonly acceptedAssistantSuggestion =
    signal<AssistantSuggestionSelection | null>(
      null,
    );

  protected readonly isAssistantToastVisible =
    signal(false);  

  // ---------------------------------------------------------------------------
  // Character actions
  // ---------------------------------------------------------------------------

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

  protected openCharacterDetails(): void {
    console.log(
      'Open character details',
    );
  }

  // ---------------------------------------------------------------------------
  // Goal actions
  // ---------------------------------------------------------------------------

  protected openGoalDetails(): void {
    console.log('Open goal details');
  }

  // ---------------------------------------------------------------------------
  // Recent event actions
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Quick Dock
  // ---------------------------------------------------------------------------

  protected selectQuickAction(
    action: QuickDockAction,
  ): void {
    this.selectedAction.set(action);

    switch (action) {
      case 'rewards':
        this.openRewardCenter();
        return;

      case 'assistant':
        this.openAssistant();
        return;

      case 'notes':
        this.openRecentEvents();
        return;

      case 'inventory':
        this.openRewardCenter();
        return;
          }
  }

  // ---------------------------------------------------------------------------
  // Quick action menu
  // ---------------------------------------------------------------------------

  protected openQuickActions(): void {
    this.isQuickActionMenuOpen.set(true);
  }

  protected closeQuickActions(): void {
    this.isQuickActionMenuOpen.set(false);
  }

  protected selectQuickMenuAction(
    action: QuickActionType,
  ): void {
    this.selectedQuickAction.set(action);
    this.closeQuickActions();

    switch (action) {
      case 'note':
        this.isQuickNoteOpen.set(true);
        return;

      case 'reward':
        this.openRewardSheet();
        return;

      case 'ai':
        this.openAssistant();
        return;

      case 'npc':
        this.openAssistantPrompt(
          'character',
        );
        return;

      case 'event':
        this.openAssistantPrompt(
          'event',
        );
        return;

      case 'item':
        return;
    }
  }

  // ---------------------------------------------------------------------------
  // Quick note
  // ---------------------------------------------------------------------------

  protected closeQuickNote(): void {
    this.isQuickNoteOpen.set(false);
  }

  protected saveQuickNote(
    note: QuickNoteDraft,
  ): void {
    const recentEvent =
      this.recentEventFactory
        .createQuickNote(note);

    this.addRecentEvent(recentEvent);

    this.closeQuickNote();
  }

  // ---------------------------------------------------------------------------
  // Reward sheet
  // ---------------------------------------------------------------------------

  protected openRewardSheet(): void {
    this.isRewardSheetOpen.set(true);
  }

  protected closeRewardSheet(): void {
    this.isRewardSheetOpen.set(false);
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

    this.latestReward.set(
      reward,
    );

    this.store.enqueueReward(
      queueItem,
    );

    this.addRecentEvent(
      recentEvent,
    );

    this.closeRewardSheet();
    this.showRewardToast();
  }

  // ---------------------------------------------------------------------------
  // Reward Center
  // ---------------------------------------------------------------------------

  protected openRewardCenter(): void {
    this.isRewardCenterOpen.set(true);
  }

  protected closeRewardCenter(): void {
    this.isRewardCenterOpen.set(false);
  }

  protected markRewardAsGiven(
    rewardId: string,
  ): void {
    this.store.markRewardAsGiven(
      rewardId,
    );
  }

  // ---------------------------------------------------------------------------
  // Reward toast
  // ---------------------------------------------------------------------------

  protected closeRewardToast(): void {
    this.isRewardToastVisible.set(false);

    if (
      this.rewardToastTimeoutId ===
      null
    ) {
      return;
    }

    window.clearTimeout(
      this.rewardToastTimeoutId,
    );

    this.rewardToastTimeoutId =
      null;
  }

  // ---------------------------------------------------------------------------
  // Assistant
  // ---------------------------------------------------------------------------

  protected openAssistant(): void {
    this.isAssistantOpen.set(true);
  }

  protected closeAssistant(): void {
    this.isAssistantOpen.set(false);
  }

  protected handleAssistantAction(
    action: AssistantQuickActionId,
  ): void {
    switch (action) {
      case 'reward':
        this.closeAssistant();
        this.openRewardSheet();
        return;

      case 'event':
      case 'clue':
      case 'character':
        this.openAssistantPrompt(action);
        return;
    }
  }

  protected openAssistantPrompt(
    type: AssistantPromptType,
  ): void {
    const prompt =
      this.createAssistantPrompt(type);

    this.selectedAssistantPrompt.set(
      prompt,
    );

    this.closeAssistant();

    this.isAssistantPromptOpen.set(true);
  }

  protected closeAssistantPrompt(): void {
    this.isAssistantPromptOpen.set(false);
    this.isAssistantPromptLoading.set(false);
    this.selectedAssistantPrompt.set(null);
  }

  protected backToAssistant(): void {
    this.isAssistantPromptOpen.set(false);
    this.isAssistantPromptLoading.set(false);
    this.selectedAssistantPrompt.set(null);

    this.openAssistant();
  }

  protected submitAssistantPrompt(
    draft: AssistantPromptDraft,
  ): void {
    this.isAssistantPromptLoading.set(true);

    window.setTimeout(
      () => {
        this.assistantResults.set(
          this.createMockAssistantResults(
            draft,
          ),
        );

        this.isAssistantPromptLoading.set(
          false,
        );

        this.isAssistantPromptOpen.set(
          false,
        );

        this.isAssistantResultsOpen.set(
          true,
        );
      },
      800,
    );
  }

  protected closeAssistantResults(): void {
    this.isAssistantResultsOpen.set(false);
    this.assistantResults.set(null);
    this.selectedAssistantPrompt.set(null);
  }

  protected backToAssistantPrompt(): void {
    this.isAssistantResultsOpen.set(false);
    this.assistantResults.set(null);

    if (
      this.selectedAssistantPrompt() ===
      null
    ) {
      this.openAssistant();
      return;
    }

    this.isAssistantPromptOpen.set(true);
  }

  protected selectAssistantSuggestion(
    selection: AssistantSuggestionSelection,
  ): void {
    const recentEvent =
      this.createAssistantRecentEvent(
        selection,
      );

    this.addRecentEvent(recentEvent);

    this.acceptedAssistantSuggestion.set(
      selection,
    );

    this.closeAssistantResults();
    this.showAssistantToast();
  }

  protected closeAssistantToast(): void {
    this.isAssistantToastVisible.set(false);

    if (
      this.assistantToastTimeoutId !==
      null
    ) {
      window.clearTimeout(
        this.assistantToastTimeoutId,
      );

      this.assistantToastTimeoutId =
        null;
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private createAssistantPrompt(
    type: AssistantPromptType,
  ): AssistantPromptViewModel {
    switch (type) {
      case 'event':
        return {
          type: 'event',
          eyebrow:
            'Kalandsegítő',
          title:
            'Találj ki egy eseményt',
          description:
            'Adj egy rövid helyzetleírást, és az asszisztens három eseményötletet készít.',
          placeholder:
            'Például: A gyerekek túl gyorsan megtalálták az ösvényt...',
          icon:
            'quick-event-dice',
          submitLabel:
            'Adj 3 eseményötletet',
        };

      case 'clue':
        return {
          type: 'clue',
          eyebrow:
            'Kalandsegítő',
          title:
            'Adj egy új nyomot',
          description:
            'Írd le röviden, hol tartanak a játékosok, és az asszisztens három használható nyomot javasol.',
          placeholder:
            'Például: A csapat a virágos tisztáson keresgél...',
          icon:
            'exploration-footprints',
          submitLabel:
            'Adj 3 nyomötletet',
        };

      case 'character':
        return {
          type: 'character',
          eyebrow:
            'Kalandsegítő',
          title:
            'Hozz létre egy szereplőt',
          description:
            'Adj meg egy rövid helyzetet vagy hangulatot, és az asszisztens három szereplőötletet készít.',
          placeholder:
            'Például: Egy félénk erdei segítőre lenne szükség...',
          icon:
            'new-npc',
          submitLabel:
            'Adj 3 szereplőötletet',
        };
    }
  }

  private createMockAssistantResults(
    draft: AssistantPromptDraft,
  ): AssistantResultsViewModel {
    switch (draft.type) {
      case 'event':
        return {
          type: 'event',
          eyebrow:
            'Kalandsegítő',
          title:
            'Három eseményötlet',
          description:
            'Válassz egy eseményt, amelyik legjobban illik a jelenlegi kalandhoz.',
          suggestions: [
            {
              id:
                crypto.randomUUID(),
              title:
                'Mozgás a bokrok között',
              description:
                'A közeli bokrok hirtelen megmozdulnak. Egy félénk Pokémon bújik elő, aki láthatóan segítséget keres.',
              icon:
                'environment-forest',
            },
            {
              id:
                crypto.randomUUID(),
              title:
                'Titokzatos nyomok',
              description:
                'Friss lábnyomok jelennek meg az ösvényen, és egy eddig rejtett ösvényhez vezetnek.',
              icon:
                'exploration-footprints',
            },
            {
              id:
                crypto.randomUUID(),
              title:
                'Váratlan találkozás',
              description:
                'Egy izgatott erdei őrző érkezik, aki sürgős segítséget kér a kalandozóktól.',
              icon:
                'npc-dialogue',
            },
          ],
        };

      case 'clue':
        return {
          type: 'clue',
          eyebrow:
            'Kalandsegítő',
          title:
            'Három új nyom',
          description:
            'Válaszd ki azt a nyomot, amelyik segíti a csapatot anélkül, hogy azonnal elárulná a megoldást.',
          suggestions: [
            {
              id:
                crypto.randomUUID(),
              title:
                'Aranyló virágpor',
              description:
                'A földön apró, aranyló virágporszemek csillognak, és egy keskeny ösvény irányába vezetnek.',
              icon:
                'exploration-footprints',
            },
            {
              id:
                crypto.randomUUID(),
              title:
                'Letört különleges levél',
              description:
                'Az egyik bokor ágán sárga-lila levél akadt fenn, amely nem illik a környező növényekhez.',
              icon:
                'environment-forest',
            },
            {
              id:
                crypto.randomUUID(),
              title:
                'Távoli Pokémon-hang',
              description:
                'A csapat halk Pokémon-hangot hall a fák közül, mintha valaki tudatosan hívná őket.',
              icon:
                'npc-dialogue',
            },
          ],
        };

      case 'character':
        return {
          type: 'character',
          eyebrow:
            'Kalandsegítő',
          title:
            'Három szereplőötlet',
          description:
            'Válassz egy szereplőt, aki természetesen kapcsolódhat a jelenlegi jelenethez.',
          suggestions: [
            {
              id:
                crypto.randomUUID(),
              title:
                'Mira, az erdei őrző',
              description:
                'Kedves, de óvatos fiatal őrző, aki jól ismeri az erdő titkos ösvényeit és Pokémonjait.',
              icon:
                'new-npc',
            },
            {
              id:
                crypto.randomUUID(),
              title:
                'Tüsi, a kíváncsi Pokémon',
              description:
                'Játékos Pokémon, aki apró tárgyakat rejt el, majd próbára teszi az arra járó kalandozókat.',
              icon:
                'encounter-claw',
            },
            {
              id:
                crypto.randomUUID(),
              title:
                'Boroszlán bácsi',
              description:
                'Idős vándor, aki sok történetet ismer, de a fontos információkat találós kérdésekbe rejti.',
              icon:
                'npc-dialogue',
            },
          ],
        };
    }
  }

  private createAssistantRecentEvent(
    selection: AssistantSuggestionSelection,
  ): RecentEventItemViewModel {
    return {
      id:
        crypto.randomUUID(),
      type:
        selection.type === 'character'
          ? 'conversation'
          : 'encounter',
      title:
        selection.suggestion.title,
      content:
        selection.suggestion.description,
      timeLabel:
        'Most',
      icon:
        selection.suggestion.icon,
    };
  }

  private createRewardQueueItem(
    reward: RewardDraft,
  ): RewardQueueItemViewModel {
    return {
      id:
        crypto.randomUUID(),
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

  private addRecentEvent(
    recentEvent:
      RecentEventItemViewModel,
  ): void {
    this.store.addRecentEvent(
      recentEvent,
    );
  }

  private showRewardToast(): void {
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

  private showAssistantToast(): void {
    this.isAssistantToastVisible.set(true);

    if (
      this.assistantToastTimeoutId !==
      null
    ) {
      window.clearTimeout(
        this.assistantToastTimeoutId,
      );
    }

    this.assistantToastTimeoutId =
      window.setTimeout(
        () => {
          this.closeAssistantToast();
        },
        3000,
      );
  }
}