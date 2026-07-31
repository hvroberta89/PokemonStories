import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  PsIconComponent,
} from '../../../../shared/ui/icon/ps-icon.component';
import type {
  RewardQueueItemViewModel,
} from './reward-queue.model';

@Component({
  selector: 'app-reward-queue',
  standalone: true,
  imports: [
    PsIconComponent,
  ],
  templateUrl:
    './reward-queue.component.html',
  styleUrl:
    './reward-queue.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class RewardQueueComponent {
  readonly items =
    input.required<
      readonly RewardQueueItemViewModel[]
    >();

  readonly markedAsGiven =
    output<string>();

  protected markAsGiven(
    rewardId: string,
  ): void {
    this.markedAsGiven.emit(rewardId);
  }

  protected statusLabel(
    item: RewardQueueItemViewModel,
  ): string {
    switch (item.status) {
      case 'unlocked':
        return 'Feloldva';

      case 'printed':
        return 'Kinyomtatva';

      case 'given':
        return 'Átadva';
    }
  }
}