import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import type { RewardPhysicalStatus, RewardType } from '../../../../domain/reward/models/reward-grant';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import type { PsIconName } from '../../../../shared/ui/icon/ps-icon.registry';
import { RewardDetailStore } from '../../store/reward-detail.store';

@Component({
  selector: 'app-reward-detail-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent],
  templateUrl: './reward-detail-page.component.html',
  styleUrl: './reward-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RewardDetailStore],
})
export class RewardDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
  protected readonly rewardId = this.route.snapshot.paramMap.get('rewardId') ?? '';
  protected readonly store = inject(RewardDetailStore);

  constructor() { void this.store.load(this.projectId, this.rewardId); }

  protected assign(event: Event): void {
    void this.store.assignTo((event.target as HTMLSelectElement).value);
  }

  protected setPhysicalStatus(event: Event): void {
    void this.store.setPhysicalStatus((event.target as HTMLSelectElement).value as RewardPhysicalStatus);
  }

  protected icon(type: RewardType): PsIconName {
    switch (type) {
      case 'pokemon': return 'pokemon-sticker';
      case 'badge': return 'badge-medal';
      case 'outfit': return 'clothing-shirt';
      case 'achievement': return 'achievement-star';
      case 'quest-item': return 'quest-card';
      default: return 'items-potion';
    }
  }
}
