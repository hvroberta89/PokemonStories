import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { RewardCenterComponent } from '../../../running-session/components/reward-center/reward-center.component';
import { PrintQueueStore } from '../../store/print-queue.store';

@Component({
  selector: 'app-print-queue-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent, RewardCenterComponent],
  templateUrl: './print-queue-page.component.html',
  styleUrl: './print-queue-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PrintQueueStore],
})
export class PrintQueuePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
  protected readonly store = inject(PrintQueueStore);

  constructor() {
    void this.store.load(this.projectId);
  }

  protected close(): void {
    void this.router.navigate(['/projects', this.projectId]);
  }

  protected markAsPrinted(rewardId: string): void {
    void this.store.markAsPrinted(rewardId);
  }

  protected markAsGiven(rewardId: string): void {
    void this.store.markAsGiven(rewardId);
  }

  protected markAllAsPrinted(rewardIds: readonly string[]): void {
    void this.store.markAllAsPrinted(rewardIds);
  }
}