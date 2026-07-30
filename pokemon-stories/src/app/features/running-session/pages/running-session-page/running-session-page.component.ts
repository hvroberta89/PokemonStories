import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';

import { QuickDockComponent } from '../../components/quick-dock/quick-dock.component';
import { QuickDockAction } from '../../components/quick-dock/quick-dock.model';
import { StoryCardComponent } from '../../components/story-card/story-card.component';
import { StoryCardViewModel } from '../../components/story-card/story-card.model';
import { GoalCardComponent } from '../../components/goal-card/goal-card.component';
import { GoalCardViewModel } from '../../components/goal-card/goal-card.model';

@Component({
  selector: 'app-running-session-page',
  standalone: true,
  imports: [
    StoryCardComponent,
    GoalCardComponent,
    QuickDockComponent,
  ],
  templateUrl: './running-session-page.component.html',
  styleUrl: './running-session-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunningSessionPageComponent {
  protected readonly currentStory =
    signal<StoryCardViewModel>({
      locationName: 'Virágmező',
      narration:
        'A szél finoman megmozgatja a virágokat. A távolban valami aranyszínűen csillan.',
      imageUrl:
        '/images/story-cards/flower-meadow.png',
      imageAlt:
        'Színes virágokkal borított napsütötte rét',
      mood: 'exploration',
    });

  protected readonly currentGoal =
    signal<GoalCardViewModel>({
      title: 'Találjátok meg a Napviráglevelet',
      description:
        'Kövessétek az aranyszínű nyomokat a Virágmezőn.',
      status: 'active',
      progressLabel: '1 nyom megtalálva',
    });

  protected readonly selectedAction =
    signal<QuickDockAction | null>(null);

  protected selectQuickAction(
    action: QuickDockAction,
  ): void {
    this.selectedAction.set(action);
  }
}