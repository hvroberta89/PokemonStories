import {
  ChangeDetectionStrategy,
  Component,
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
  mockRunningSession,
} from '../../mocks/running-session.mock';

@Component({
  selector: 'app-running-session-page',
  standalone: true,
  imports: [
    StoryCardComponent,
    GoalCardComponent,
    CharactersStripComponent,
    QuickDockComponent,
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
}