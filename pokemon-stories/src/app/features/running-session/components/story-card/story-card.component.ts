import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

import { StoryCardViewModel } from './story-card.model';
import { PsIconComponent } from '../../../../shared/ui/public-api';

@Component({
  selector: 'app-story-card',
  standalone: true,
  imports: [PsIconComponent],
  templateUrl: './story-card.component.html',
  styleUrl: './story-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryCardComponent {
  readonly story = input.required<StoryCardViewModel>();
}
