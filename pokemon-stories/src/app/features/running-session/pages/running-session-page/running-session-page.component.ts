import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';

import { PsRewardToastComponent, PsIconComponent } from '../../../../shared/ui/public-api';

import { AssistantSheetComponent } from '../../components/assistant-sheet/assistant-sheet.component';
import type { AssistantQuickActionId } from '../../components/assistant-sheet/assistant-sheet.model';

import { CharactersStripComponent } from '../../components/characters-strip/characters-strip.component';

import { GoalCardComponent } from '../../components/goal-card/goal-card.component';

import { QuickActionMenuComponent } from '../../components/quick-action-menu/quick-action-menu.component';
import type { QuickActionType } from '../../components/quick-action-menu/quick-action-menu.model';

import { QuickDockComponent } from '../../components/quick-dock/quick-dock.component';
import type { QuickDockAction } from '../../components/quick-dock/quick-dock.model';

import { QuickNoteComponent } from '../../components/quick-note/quick-note.component';
import type { QuickNoteDraft } from '../../components/quick-note/quick-note.model';

import { RecentEventDetailsComponent } from '../../components/recent-event-details/recent-event-details.component';

import { RecentEventsComponent } from '../../components/recent-events/recent-events.component';
import type { RecentEventItemViewModel } from '../../components/recent-events/recent-events.model';

import { RewardCenterComponent } from '../../components/reward-center/reward-center.component';

import type { RewardHistoryItemViewModel } from '../../components/reward-history/reward-history.model';

import type { RewardQueueItemViewModel } from '../../components/reward-queue/reward-queue.model';

import { RewardSheetComponent } from '../../components/reward-sheet/reward-sheet.component';
import type {
  RewardDraft,
  RewardRecipient,
} from '../../components/reward-sheet/reward-sheet.model';

import { StoryCardComponent } from '../../components/story-card/story-card.component';
import type { AdventureAssistantViewModel } from '../../components/assistant-sheet/assistant-sheet.model';
import type { QuickActionMenuVm } from '../../components/quick-action-menu/quick-action-menu.model';

import { RecentEventFactory } from '../../services/recent-event.factory';

import { AssistantPromptComponent } from '../../components/assistant-prompt/assistant-prompt.component';
import type {
  AssistantPromptDraft,
  AssistantPromptType,
  AssistantPromptViewModel,
} from '../../components/assistant-prompt/assistant-prompt.model';

import { AssistantResultsComponent } from '../../components/assistant-results/assistant-results.component';
import type {
  AssistantResultsViewModel,
  AssistantSuggestionSelection,
} from '../../components/assistant-results/assistant-results.model';
import { AssistantSuggestionToastComponent } from '../../components/assistant-suggestion-toast/assistant-suggestion-toast.component';
import { RunningSessionStore } from '../../services/running-session.store';
import { Router } from '@angular/router';
import { SessionTimelineComponent } from '../../components/session-timeline/session-timeline.component';
import { SessionEndSheetComponent } from '../../components/session-end-sheet/session-end-sheet.component';
import { SessionSummaryComponent } from '../../components/session-summary/session-summary.component';
import type {
  AdventureReviewDecision,
  LocationApprovalDraft,
  NpcApprovalDraft,
  StoryGenerationStatus,
  WorldFactApprovalStatus,
} from '../../components/session-summary/session-summary.component';
import { SessionSummaryViewModel } from '../../components/session-summary/session-summary.model';
import { CompleteAdventureHandler } from '../../../../application/adventure/commands/complete-adventure/complete-adventure.handler';
import { ADVENTURE_PLAN_REPOSITORY } from '../../../../application/adventure/tokens/adventure-plan.tokens';
import { adventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { CreateWorldFactHandler } from '../../../../application/world/commands/create-world-fact/create-world-fact.handler';
import { WORLD_FACT_REPOSITORY } from '../../../../application/world/tokens/world-fact.tokens';
import { ID_GENERATOR } from '../../../../application/project/tokens/id-generator.token';
import { PROJECT_READER } from '../../../../application/project/tokens/project.tokens';
import { CreateNpcHandler } from '../../../../application/npc/commands/create-npc/create-npc.handler';
import { NPC_REPOSITORY } from '../../../../application/npc/tokens/npc.tokens';
import { CreateLocationHandler } from '../../../../application/location/commands/create-location/create-location.handler';
import { LOCATION_REPOSITORY } from '../../../../application/location/tokens/location.tokens';
import { GenerateSessionSuggestionsHandler } from '../../../../application/assistant/queries/generate-session-suggestions/generate-session-suggestions.handler';
import { SESSION_ASSISTANT } from '../../../../application/assistant/tokens/session-assistant.token';
import { GenerateSessionStoryHandler } from '../../../../application/assistant/queries/generate-session-story/generate-session-story.handler';

const sessionQuickActionMenu: QuickActionMenuVm = {
  title: 'Mit szeretnél hozzáadni?',
  subtitle: 'Válassz egy gyors műveletet a történet folytatásához.',
  actions: [
    { type: 'note', label: 'Jegyzet', description: 'Rögzíts valamit gyorsan.', icon: 'notes-scroll' },
    { type: 'npc', label: 'Új szereplő', description: 'Kérj NPC-ötletet.', icon: 'new-npc' },
    { type: 'event', label: 'Esemény', description: 'Adj új fordulatot.', icon: 'quick-event-dice' },
    { type: 'reward', label: 'Jutalom', description: 'Oldj fel jutalmat.', icon: 'reward-gift' },
    { type: 'ai', label: 'AI segítség', description: 'Kérj improvizációs ötleteket.', icon: 'ai-crystal' },
    { type: 'item', label: 'Tárgy', description: 'Adj tárgyat vagy felszerelést.', icon: 'items-potion' },
  ],
};

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
    SessionTimelineComponent,
    SessionEndSheetComponent,
    SessionSummaryComponent,
    PsIconComponent,
  ],
  templateUrl: './running-session-page.component.html',
  styleUrl: './running-session-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunningSessionPageComponent {
  // ---------------------------------------------------------------------------
  // Services
  // ---------------------------------------------------------------------------

  private readonly recentEventFactory = inject(RecentEventFactory);

  private readonly store = inject(RunningSessionStore);
  private readonly router = inject(Router);
  private readonly completeAdventure = new CompleteAdventureHandler(
    inject(ADVENTURE_PLAN_REPOSITORY),
  );
  private readonly projectReader = inject(PROJECT_READER);
  private readonly createWorldFact = new CreateWorldFactHandler(
    async (id) => Boolean(await this.projectReader.findById(id)),
    inject(WORLD_FACT_REPOSITORY),
    inject(ID_GENERATOR),
  );
  private readonly createNpc = new CreateNpcHandler(
    async (id) => Boolean(await this.projectReader.findById(id)),
    inject(NPC_REPOSITORY),
    inject(ID_GENERATOR),
  );
  private readonly createLocation = new CreateLocationHandler(
    async (id) => Boolean(await this.projectReader.findById(id)),
    inject(LOCATION_REPOSITORY),
    inject(ID_GENERATOR),
  );
  private readonly generateSessionSuggestions = new GenerateSessionSuggestionsHandler(
    inject(SESSION_ASSISTANT),
  );
  private readonly generateSessionStory = new GenerateSessionStoryHandler(
    inject(SESSION_ASSISTANT),
  );

  protected readonly adventureTitle = computed(
    () => this.store.session().adventureTitle ?? 'Nincs aktív kaland',
  );

  private readonly now = signal(Date.now());

  protected readonly elapsedTimeLabel = computed(() => {
    const elapsedMilliseconds = Math.max(
      0,
      this.now() - new Date(this.store.session().startedAt).getTime(),
    );
    const totalSeconds = Math.floor(elapsedMilliseconds / 1_000);
    const hours = Math.floor(totalSeconds / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
  });

  protected readonly sceneProgressSteps = computed(() => {
    const session = this.store.session();
    const sceneCount = session.scenes?.length ?? 1;
    const currentIndex = Math.min(session.currentSceneIndex ?? 0, sceneCount - 1);
    return Array.from({ length: sceneCount }, (_, index) => ({
      index,
      status: index < currentIndex ? 'completed' : index === currentIndex ? 'active' : 'pending',
    }));
  });

  protected goToNextScene(): void {
    this.store.nextScene();
  }

  protected leaveSession(): void {
    const projectId = this.store.session().projectId;
    void this.router.navigate(projectId ? ['/projects', projectId] : ['/projects']);
  }

  private readonly destroyRef = inject(DestroyRef);

  // ---------------------------------------------------------------------------
  // Timeout handles
  // ---------------------------------------------------------------------------

  private rewardToastTimeoutId: number | null = null;

  private assistantToastTimeoutId: number | null = null;

  private elapsedTimerId: number | null = null;

  constructor() {
    this.elapsedTimerId = window.setInterval(() => this.now.set(Date.now()), 1_000);
    this.destroyRef.onDestroy(() => {
      this.clearTimeouts();
      if (this.elapsedTimerId !== null) window.clearInterval(this.elapsedTimerId);
    });
  }

  // ---------------------------------------------------------------------------
  // Page data
  // ---------------------------------------------------------------------------

  protected readonly viewModel = this.store.viewModel;
  protected readonly syncStatus = this.store.syncStatus;
  protected readonly syncStatusLabel = computed(() => {
    switch (this.syncStatus()) {
      case 'syncing':
        return 'Szinkronizálás…';
      case 'synced':
        return 'Felhőbe mentve';
      case 'offline':
        return 'Offline – helyben mentve';
      case 'conflict':
        return 'Másik eszközön módosult';
      default:
        return 'Helyben mentve';
    }
  });

  protected readonly quickActionMenu = signal(sessionQuickActionMenu);

  protected readonly assistant = computed<AdventureAssistantViewModel>(() => {
    const session = this.store.session();
    const viewModel = session.viewModel;
    const latestEvent = viewModel.recentEvents.events[0];
    return {
      location: viewModel.story.locationName,
      objective: viewModel.goal.title,
      hints: latestEvent
        ? [`Legutóbbi esemény: ${latestEvent.content}`]
        : [viewModel.story.narration[0] ?? viewModel.goal.description],
      likelyQuestions: [
        `Mit látnak ${viewModel.story.locationName} környékén?`,
        `Hogyan haladhatnak ${viewModel.goal.title.toLocaleLowerCase('hu')} felé?`,
      ],
      quickActions: [
        { id: 'reward', label: 'Adj jutalmat', icon: 'reward-gift' },
        { id: 'event', label: 'Indíts eseményt', icon: 'quick-event-dice' },
        { id: 'clue', label: 'Új nyom', icon: 'exploration-footprints' },
        { id: 'character', label: 'Új szereplő', icon: 'new-npc' },
      ],
    };
  });

  // ---------------------------------------------------------------------------
  // Selection state
  // ---------------------------------------------------------------------------

  protected readonly selectedAction = signal<QuickDockAction | null>(null);

  protected readonly selectedQuickAction = signal<QuickActionType | null>(null);

  protected readonly selectedCharacterId = signal<string | null>(null);

  protected readonly selectedRecentEvent = signal<RecentEventItemViewModel | null>(null);

  protected readonly isSessionTimelineOpen = signal(false);

  protected readonly isSessionEndSheetOpen = signal(false);

  protected readonly isSessionSummaryOpen = signal(this.store.isReviewPending());

  protected readonly worldFactApprovalStatus = signal<WorldFactApprovalStatus>('idle');

  protected readonly npcApprovalStatus = signal<WorldFactApprovalStatus>('idle');

  protected readonly locationApprovalStatus = signal<WorldFactApprovalStatus>('idle');

  protected readonly aiStoryDraft = signal<string | null>(null);

  protected readonly storyGenerationStatus = signal<StoryGenerationStatus>('idle');

  // ---------------------------------------------------------------------------
  // Overlay state
  // ---------------------------------------------------------------------------

  protected readonly isQuickActionMenuOpen = signal(false);

  protected readonly isQuickNoteOpen = signal(false);

  protected readonly isRewardSheetOpen = signal(false);

  protected readonly isRewardCenterOpen = signal(false);

  protected readonly isAssistantOpen = signal(false);

  protected readonly isRewardToastVisible = signal(false);

  // ---------------------------------------------------------------------------
  // Reward state
  // ---------------------------------------------------------------------------

  protected readonly latestReward = signal<RewardDraft | null>(null);

  protected readonly rewardQueue = this.store.rewardQueue;

  protected readonly rewardHistory = this.store.rewardHistory;

  protected readonly rewardRecipients = computed<readonly RewardRecipient[]>(() =>
    (this.store.session().participants ?? []).map((participant) => ({
      id: participant.id,
      name: participant.name,
    })),
  );

  protected readonly preparedRewards = this.store.availablePreparedRewards;

  // ---------------------------------------------------------------------------
  // Assistant state
  // ---------------------------------------------------------------------------

  protected readonly selectedAssistantPrompt = signal<AssistantPromptViewModel | null>(null);

  protected readonly assistantResults = signal<AssistantResultsViewModel | null>(null);

  protected readonly isAssistantPromptOpen = signal(false);

  protected readonly isAssistantPromptLoading = signal(false);

  protected readonly assistantPromptError = signal<string | null>(null);

  protected readonly isAssistantResultsOpen = signal(false);

  protected readonly acceptedAssistantSuggestion = signal<AssistantSuggestionSelection | null>(
    null,
  );

  protected readonly isAssistantToastVisible = signal(false);

  // ---------------------------------------------------------------------------
  // Character actions
  // ---------------------------------------------------------------------------

  protected selectCharacter(characterId: string): void {
    this.selectedCharacterId.set(characterId);
  }

  protected addCharacter(): void {
    console.log('Add character');
  }

  protected openCharacterDetails(): void {
    console.log('Open character details');
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

  protected selectRecentEvent(eventId: string): void {
    const selectedEvent = this.viewModel().recentEvents.events.find(
      (event) => event.id === eventId,
    );

    if (!selectedEvent) {
      return;
    }

    this.selectedRecentEvent.set(selectedEvent);
  }

  protected closeRecentEventDetails(): void {
    this.selectedRecentEvent.set(null);
  }

  protected openRecentEvents(): void {
    this.isSessionTimelineOpen.set(true);
  }

  protected closeSessionTimeline(): void {
    this.isSessionTimelineOpen.set(false);
  }

  // ---------------------------------------------------------------------------
  // Quick Dock
  // ---------------------------------------------------------------------------

  protected selectQuickAction(action: QuickDockAction): void {
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

  protected selectQuickMenuAction(action: QuickActionType): void {
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
        this.openAssistantPrompt('character');
        return;

      case 'event':
        this.openAssistantPrompt('event');
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

  protected saveQuickNote(note: QuickNoteDraft): void {
    const recentEvent = this.recentEventFactory.createQuickNote(note);

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

  protected saveReward(rewards: readonly RewardDraft[]): void {
    for (const reward of rewards) {
      this.latestReward.set(reward);
      this.store.enqueueReward(this.createRewardQueueItem(reward));
      this.addRecentEvent(this.recentEventFactory.createReward(reward));
    }

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

  protected markRewardAsGiven(rewardId: string): void {
    this.store.markRewardAsGiven(rewardId);
  }

  protected markRewardAsPrinted(rewardId: string): void {
    this.store.markRewardAsPrinted(rewardId);
  }

  protected markRewardsAsPrinted(rewardIds: readonly string[]): void {
    this.store.markRewardsAsPrinted(rewardIds);
  }

  // ---------------------------------------------------------------------------
  // Reward toast
  // ---------------------------------------------------------------------------

  protected closeRewardToast(): void {
    this.isRewardToastVisible.set(false);

    if (this.rewardToastTimeoutId === null) {
      return;
    }

    window.clearTimeout(this.rewardToastTimeoutId);

    this.rewardToastTimeoutId = null;
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

  protected handleAssistantAction(action: AssistantQuickActionId): void {
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

  protected openAssistantPrompt(type: AssistantPromptType): void {
    const prompt = this.createAssistantPrompt(type);

    this.selectedAssistantPrompt.set(prompt);
    this.assistantPromptError.set(null);

    this.closeAssistant();

    this.isAssistantPromptOpen.set(true);
  }

  protected closeAssistantPrompt(): void {
    this.isAssistantPromptOpen.set(false);
    this.isAssistantPromptLoading.set(false);
    this.assistantPromptError.set(null);
    this.selectedAssistantPrompt.set(null);
  }

  protected backToAssistant(): void {
    this.isAssistantPromptOpen.set(false);
    this.isAssistantPromptLoading.set(false);
    this.selectedAssistantPrompt.set(null);
    this.assistantPromptError.set(null);

    this.openAssistant();
  }

  protected async submitAssistantPrompt(draft: AssistantPromptDraft): Promise<void> {
    this.isAssistantPromptLoading.set(true);
    this.assistantPromptError.set(null);
    try {
      const session = this.store.session();
      const suggestions = await this.generateSessionSuggestions.execute(draft.type, {
        adventureTitle: session.adventureTitle ?? 'Névtelen kaland',
        locationName: session.viewModel.story.locationName,
        goal: session.viewModel.goal.title,
        recentEvents: session.viewModel.recentEvents.events
          .slice(0, 5)
          .map((event) => `${event.title}: ${event.content}`),
        userContext: draft.context,
      });
      this.assistantResults.set({
        type: draft.type,
        eyebrow: 'Kalandsegítő',
        title: 'Három új ötlet',
        description: 'Válaszd ki és alakítsd tovább azt, amelyik a legjobban illik a Sessionhöz.',
        suggestions: suggestions.map((suggestion, index) => ({
          id: crypto.randomUUID(),
          ...suggestion,
          icon: this.assistantSuggestionIcon(draft.type, index),
        })),
      });
      this.isAssistantPromptLoading.set(false);
      this.isAssistantPromptOpen.set(false);
      this.isAssistantResultsOpen.set(true);
    } catch {
      this.assistantPromptError.set(
        'Az AI segítő most nem érhető el. Próbáld újra, vagy folytasd kézi ötlettel.',
      );
      this.isAssistantPromptLoading.set(false);
    }
  }

  protected closeAssistantResults(): void {
    this.isAssistantResultsOpen.set(false);
    this.assistantResults.set(null);
    this.selectedAssistantPrompt.set(null);
  }

  protected backToAssistantPrompt(): void {
    this.isAssistantResultsOpen.set(false);
    this.assistantResults.set(null);

    if (this.selectedAssistantPrompt() === null) {
      this.openAssistant();
      return;
    }

    this.isAssistantPromptOpen.set(true);
  }

  protected selectAssistantSuggestion(selection: AssistantSuggestionSelection): void {
    const recentEvent = this.createAssistantRecentEvent(selection);

    this.addRecentEvent(recentEvent);

    this.acceptedAssistantSuggestion.set(selection);

    this.closeAssistantResults();
    this.showAssistantToast();
  }

  protected closeAssistantToast(): void {
    this.isAssistantToastVisible.set(false);

    if (this.assistantToastTimeoutId !== null) {
      window.clearTimeout(this.assistantToastTimeoutId);

      this.assistantToastTimeoutId = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Timeline actions
  // ---------------------------------------------------------------------------

  protected selectTimelineEvent(eventId: string): void {
    this.closeSessionTimeline();
    this.selectRecentEvent(eventId);
  }

  // ---------------------------------------------------------------------------
  // Session end actions
  // ---------------------------------------------------------------------------

  protected readonly sessionEndSummary = computed(() => ({
    eventCount: this.store.eventCount(),

    queuedRewardCount: this.store.queuedRewardCount(),

    givenRewardCount: this.store.givenRewardCount(),
  }));

  protected openSessionEndSheet(): void {
    this.isSessionEndSheetOpen.set(true);
  }

  protected closeSessionEndSheet(): void {
    this.isSessionEndSheetOpen.set(false);
  }

  protected completeSession(): void {
    this.store.completeSession();

    this.closeSessionEndSheet();

    this.isSessionSummaryOpen.set(true);
  }

  // ---------------------------------------------------------------------------
  // Session summary actions
  // ---------------------------------------------------------------------------

  protected readonly sessionSummary = computed<SessionSummaryViewModel>(() => {
    const session = this.store.session();

    const startedAt = new Date(session.startedAt);

    const completedAt = session.completedAt ? new Date(session.completedAt) : new Date();

    return {
      sessionId: session.sessionId,

      adventureTitle: session.adventureTitle ?? 'Nincs aktív kaland',

      locationName: session.viewModel.story.locationName,

      startedAtLabel: this.formatDateTime(startedAt),

      completedAtLabel: this.formatDateTime(completedAt),

      durationLabel: this.formatDuration(startedAt, completedAt),

      story: session.sessionStory,

      eventCount: session.viewModel.recentEvents.events.length,

      queuedRewardCount: session.rewardQueue.length,

      givenRewardCount: session.rewardHistory.length,

      events: session.viewModel.recentEvents.events,

      queuedRewards: session.rewardQueue,

      givenRewards: session.rewardHistory,
    };
  });

  protected closeSessionSummary(): void {
    this.isSessionSummaryOpen.set(false);
    if (this.store.isReviewPending()) this.leaveSession();
  }

  protected async completeSessionReview(decision: AdventureReviewDecision): Promise<void> {
    const session = this.store.session();
    if (decision === 'complete-adventure') {
      if (!session.projectId || !session.adventureId) return;
      const result = await this.completeAdventure.execute({
        projectId: projectId(session.projectId),
        adventurePlanId: adventurePlanId(session.adventureId),
      });
      if (!result.isSuccess) return;
    }
    this.store.completeReview();
    this.isSessionSummaryOpen.set(false);
    this.leaveSession();
  }

  protected openSummaryTimeline(): void {
    this.isSessionSummaryOpen.set(false);

    this.isSessionTimelineOpen.set(true);
  }

  protected openSummaryRewards(): void {
    this.isSessionSummaryOpen.set(false);

    this.openRewardCenter();
  }

  protected saveSessionStory(story: string | undefined): void {
    this.store.saveSessionStory(story);
  }

  protected async generateAiStory(): Promise<void> {
    const summary = this.sessionSummary();
    this.storyGenerationStatus.set('generating');
    try {
      const story = await this.generateSessionStory.execute({
        adventureTitle: summary.adventureTitle,
        locationName: summary.locationName,
        events: summary.events.map((event) => `${event.title}: ${event.content}`),
        rewards: [...summary.queuedRewards, ...summary.givenRewards].map(
          (reward) => `${reward.recipientName} megkapta: ${reward.amount} db ${reward.rewardLabel}`,
        ),
      });
      this.aiStoryDraft.set(story);
      this.storyGenerationStatus.set('idle');
    } catch {
      this.storyGenerationStatus.set('error');
    }
  }

  protected async approveWorldFact(text: string): Promise<void> {
    const session = this.store.session();
    if (!session.projectId) {
      this.worldFactApprovalStatus.set('error');
      return;
    }

    this.worldFactApprovalStatus.set('saving');
    try {
      const result = await this.createWorldFact.execute({
        projectId: projectId(session.projectId),
        text,
      });
      this.worldFactApprovalStatus.set(result.isSuccess ? 'saved' : 'error');
    } catch {
      this.worldFactApprovalStatus.set('error');
    }
  }

  protected async approveNpc(draft: NpcApprovalDraft): Promise<void> {
    const session = this.store.session();
    if (!session.projectId) {
      this.npcApprovalStatus.set('error');
      return;
    }
    this.npcApprovalStatus.set('saving');
    try {
      const result = await this.createNpc.execute({
        projectId: projectId(session.projectId),
        ...draft,
      });
      this.npcApprovalStatus.set(result.isSuccess ? 'saved' : 'error');
    } catch {
      this.npcApprovalStatus.set('error');
    }
  }

  protected async approveLocation(draft: LocationApprovalDraft): Promise<void> {
    const session = this.store.session();
    if (!session.projectId) {
      this.locationApprovalStatus.set('error');
      return;
    }
    this.locationApprovalStatus.set('saving');
    try {
      const result = await this.createLocation.execute({
        projectId: projectId(session.projectId),
        ...draft,
      });
      this.locationApprovalStatus.set(result.isSuccess ? 'saved' : 'error');
    } catch {
      this.locationApprovalStatus.set('error');
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private createAssistantPrompt(type: AssistantPromptType): AssistantPromptViewModel {
    switch (type) {
      case 'event':
        return {
          type: 'event',
          eyebrow: 'Kalandsegítő',
          title: 'Találj ki egy eseményt',
          description:
            'Adj egy rövid helyzetleírást, és az asszisztens három eseményötletet készít.',
          placeholder: 'Például: A gyerekek túl gyorsan megtalálták az ösvényt...',
          icon: 'quick-event-dice',
          submitLabel: 'Adj 3 eseményötletet',
        };

      case 'clue':
        return {
          type: 'clue',
          eyebrow: 'Kalandsegítő',
          title: 'Adj egy új nyomot',
          description:
            'Írd le röviden, hol tartanak a játékosok, és az asszisztens három használható nyomot javasol.',
          placeholder: 'Például: A csapat a virágos tisztáson keresgél...',
          icon: 'exploration-footprints',
          submitLabel: 'Adj 3 nyomötletet',
        };

      case 'character':
        return {
          type: 'character',
          eyebrow: 'Kalandsegítő',
          title: 'Hozz létre egy szereplőt',
          description:
            'Adj meg egy rövid helyzetet vagy hangulatot, és az asszisztens három szereplőötletet készít.',
          placeholder: 'Például: Egy félénk erdei segítőre lenne szükség...',
          icon: 'new-npc',
          submitLabel: 'Adj 3 szereplőötletet',
        };
    }
  }

  private assistantSuggestionIcon(
    type: AssistantPromptType,
    index: number,
  ): 'environment-forest' | 'exploration-footprints' | 'npc-dialogue' | 'new-npc' {
    if (type === 'character') return index === 0 ? 'new-npc' : 'npc-dialogue';
    return index === 0 ? 'environment-forest' : 'exploration-footprints';
  }

  private createAssistantRecentEvent(
    selection: AssistantSuggestionSelection,
  ): RecentEventItemViewModel {
    return {
      id: crypto.randomUUID(),
      type: selection.type === 'character' ? 'conversation' : 'encounter',
      title: selection.suggestion.title,
      content: selection.suggestion.description,
      timeLabel: 'Most',
      icon: selection.suggestion.icon,
    };
  }

  private createRewardQueueItem(reward: RewardDraft): RewardQueueItemViewModel {
    return {
      id: crypto.randomUUID(),
      recipientId: reward.recipientId,
      recipientName: reward.recipientName,
      rewardType: reward.rewardType,
      rewardLabel: reward.rewardLabel,
      amount: reward.amount,
      icon: 'reward-gift',
      status: 'unlocked',
      physicalStatus: reward.physicalStatus,
      preparedRewardId: reward.preparedRewardId,
    };
  }

  private addRecentEvent(recentEvent: RecentEventItemViewModel): void {
    this.store.addRecentEvent(recentEvent);
  }

  private showRewardToast(): void {
    this.isRewardToastVisible.set(true);

    if (this.rewardToastTimeoutId !== null) {
      window.clearTimeout(this.rewardToastTimeoutId);
    }

    this.rewardToastTimeoutId = window.setTimeout(() => {
      this.closeRewardToast();
    }, 3500);
  }

  private showAssistantToast(): void {
    this.isAssistantToastVisible.set(true);

    if (this.assistantToastTimeoutId !== null) {
      window.clearTimeout(this.assistantToastTimeoutId);
    }

    this.assistantToastTimeoutId = window.setTimeout(() => {
      this.closeAssistantToast();
    }, 3000);
  }

  private clearTimeouts(): void {
    this.closeRewardToast();
    this.closeAssistantToast();
  }

  private formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('hu-HU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  private formatDuration(startedAt: Date, completedAt: Date): string {
    const durationInMilliseconds = Math.max(0, completedAt.getTime() - startedAt.getTime());

    const totalMinutes = Math.floor(durationInMilliseconds / 60_000);

    const hours = Math.floor(totalMinutes / 60);

    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes} perc`;
    }

    if (minutes === 0) {
      return `${hours} óra`;
    }

    return `${hours} óra ${minutes} perc`;
  }
}
