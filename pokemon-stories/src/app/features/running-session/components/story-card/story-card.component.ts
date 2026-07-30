import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

import { StoryCardViewModel } from './story-card.model';

@Component({
  selector: 'app-story-card',
  standalone: true,
  templateUrl: './story-card.component.html',
  styleUrl: './story-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryCardComponent {
  readonly story = input.required<StoryCardViewModel>();
}
