import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  GoalCardViewModel,
} from './goal-card.model';
import { PsIconComponent } from '../../../../shared/ui/public-api';

@Component({
  selector: 'app-goal-card',
  standalone: true,
  imports: [PsIconComponent],
  templateUrl: './goal-card.component.html',
  styleUrl: './goal-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalCardComponent {
  readonly goal = input.required<GoalCardViewModel>();

  readonly actionSelected = output<void>();

  protected selectAction(): void {
    this.actionSelected.emit();
  }
}