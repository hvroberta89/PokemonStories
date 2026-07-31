import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';

import { CharactersStripComponent, } from '../../components/characters-strip/characters-strip.component';
import { GoalCardComponent, } from '../../components/goal-card/goal-card.component';
import { QuickDockComponent, } from '../../components/quick-dock/quick-dock.component';
import { QuickDockAction, } from '../../components/quick-dock/quick-dock.model';
import { StoryCardComponent, } from '../../components/story-card/story-card.component';
import { mockQuickActionMenu, mockRunningSession, } from '../../mocks/running-session.mock';
import { RecentEventItemViewModel, } from '../../components/recent-events/recent-events.model';
import { RecentEventsComponent } from '../../components/recent-events/recent-events.component';
import { QuickActionMenuComponent } from '../../components/quick-action-menu/quick-action-menu.component';
import { QuickActionType } from '../../components/quick-action-menu/quick-action-menu.model';
import { QuickNoteComponent } from '../../components/quick-note/quick-note.component';
import { QuickNoteDraft } from '../../components/quick-note/quick-note.model';
import { RecentEventDetailsComponent } from '../../components/recent-event-details/recent-event-details.component';

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
  ],
  templateUrl:
    './running-session-page.component.html',
  styleUrl:
    './running-session-page.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class RunningSessionPageComponent {
  protected readonly viewModel =
    signal(mockRunningSession);

  protected readonly selectedAction =
    signal<QuickDockAction | null>(null);

  protected readonly selectedCharacterId =
    signal<string | null>(null);

  protected selectQuickAction(
    action: QuickDockAction,
  ): void {
    this.selectedAction.set(action);
  }

  protected selectCharacter(
    characterId: string,
  ): void {
    this.selectedCharacterId.set(characterId);
  }

  protected addCharacter(): void {
    console.log('Add character');
  }

  protected readonly selectedRecentEvent =
    signal<RecentEventItemViewModel | null>(
      null,
    );

  protected selectRecentEvent(
    eventId: string,
  ): void {
    const selectedEvent =
      this.viewModel()
        .recentEvents
        .events
        .find(event => event.id === eventId);

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
    console.log('Open character details');
  }

  protected openGoalDetails(): void {
    console.log('Open goal details');
  }

  protected readonly quickActionMenu =
    signal(mockQuickActionMenu);

  protected readonly isQuickActionMenuOpen =
    signal(false);

  protected readonly selectedQuickAction =
    signal<QuickActionType | null>(null);

  protected openQuickActions(): void {
    this.isQuickActionMenuOpen.set(true);
  }

  protected closeQuickActions(): void {
    this.isQuickActionMenuOpen.set(false);
  }

  protected readonly isQuickNoteOpen =
  signal(false);

  protected closeQuickNote(): void {
    this.isQuickNoteOpen.set(false);
  }

  protected saveQuickNote(
    note: QuickNoteDraft,
  ): void {
    const recentEvent =
      this.createQuickNoteEvent(note);

    this.viewModel.update(
      currentViewModel => {
        const currentEvents =
          currentViewModel.recentEvents.events;

        const updatedEvents = [
          recentEvent,
          ...currentEvents,
        ].slice(0, 3);

        return {
          ...currentViewModel,
          recentEvents: {
            ...currentViewModel.recentEvents,
            newEventsLabel:
              `${updatedEvents.length} új esemény`,
            events: updatedEvents,
          },
        };
      },
    );

    this.isQuickNoteOpen.set(false);
  }

  private createQuickNoteEvent(
    note: QuickNoteDraft,
  ): RecentEventItemViewModel {
    return {
      id: crypto.randomUUID(),
      type: 'note',
      title: this.createQuickNoteTitle(note),
      content: note.content,
      timeLabel: 'Most',
      icon: 'add-note',
    };
  }

  private createQuickNoteTitle(
    note: QuickNoteDraft,
  ): string {
    const prefix =
      this.getQuickNoteTypeLabel(note.type);

    const maximumLength = 72;

    const shortenedContent =
      note.content.length > maximumLength
        ? `${note.content.slice(
            0,
            maximumLength,
          ).trimEnd()}…`
        : note.content;

    return `${prefix}: ${shortenedContent}`;
  }

  private getQuickNoteTypeLabel(
    type: QuickNoteDraft['type'],
  ): string {
    switch (type) {
      case 'general':
        return 'Jegyzet';

      case 'clue':
        return 'Új nyom';

      case 'npc':
        return 'Szereplőjegyzet';

      case 'secret':
        return 'Titkos jegyzet';
    }
  }

  protected selectQuickMenuAction(
    action: QuickActionType,
  ): void {
    this.selectedQuickAction.set(action);
    this.isQuickActionMenuOpen.set(false);

    if (action === 'note') {
      this.isQuickNoteOpen.set(true);
    }
  }
}