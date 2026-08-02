import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

import {
  PsIconComponent,
} from '../../../../shared/ui/icon/ps-icon.component';
import {
  RewardQueueComponent,
} from '../reward-queue/reward-queue.component';
import type {
  RewardQueueItemViewModel,
} from '../reward-queue/reward-queue.model';
import type {
  RewardCenterTab,
} from './reward-center.model';
import { RewardHistoryComponent } from '../reward-history/reward-history.component';
import { RewardHistoryItemViewModel } from '../reward-history/reward-history.model';

@Component({
  selector: 'app-reward-center',
  standalone: true,
  imports: [
    PsIconComponent,
    RewardQueueComponent,
    RewardHistoryComponent,
  ],
  templateUrl:
    './reward-center.component.html',
  styleUrl:
    './reward-center.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class RewardCenterComponent {
  readonly items =
    input.required<
      readonly RewardQueueItemViewModel[]
    >();

  readonly historyItems =
    input.required<
      readonly RewardHistoryItemViewModel[]
    >();  

  readonly closed =
    output<void>();

  readonly markedAsGiven =
    output<string>();

  readonly markedAsPrinted =
    output<string>();

  protected readonly activeTab =
    signal<RewardCenterTab>('queue');

  protected readonly title = computed(() => {
    switch (this.activeTab()) {
      case 'queue':
        return 'Átadásra vár';

      case 'print':
        return 'Nyomtatás';

      case 'history':
        return 'Előzmények';
    }
  });

  protected readonly icon = computed(() => {
    switch (this.activeTab()) {
      case 'queue':
        return 'queue-box';

      case 'print':
        return 'printer';

      case 'history':
        return 'achievement-star';
    }
  });

  protected readonly printableItems = computed(() =>
    this.items().filter((item) => item.physicalStatus === 'queued'),
  );

  protected selectTab(
    tab: RewardCenterTab,
  ): void {
    this.activeTab.set(tab);
  }
}