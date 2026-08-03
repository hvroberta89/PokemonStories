import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import type { RewardHistoryItemViewModel } from './reward-history.model';

@Component({
  selector: 'app-reward-history',
  standalone: true,
  imports: [PsIconComponent],
  templateUrl: './reward-history.component.html',
  styleUrl: './reward-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RewardHistoryComponent {
  readonly items = input.required<readonly RewardHistoryItemViewModel[]>();

  readonly reprintRequested = output<RewardHistoryItemViewModel>();
}
