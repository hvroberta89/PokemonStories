import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import type { RewardType } from '../../../../domain/reward/models/reward-grant';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import type { PsIconName } from '../../../../shared/ui/icon/ps-icon.registry';
import {
  CollectionDeliveryFilter,
  ProjectCollectionStore,
} from '../../store/project-collection.store';

@Component({
  selector: 'app-project-collection-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent],
  templateUrl: './project-collection-page.component.html',
  styleUrl: './project-collection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectCollectionStore],
})
export class ProjectCollectionPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
  protected readonly store = inject(ProjectCollectionStore);
  protected readonly types: readonly { value: RewardType | 'all'; label: string }[] = [
    { value: 'all', label: 'Minden típus' },
    { value: 'pokemon', label: 'Pokémon' },
    { value: 'item', label: 'Tárgy' },
    { value: 'badge', label: 'Jelvény' },
    { value: 'achievement', label: 'Teljesítmény' },
    { value: 'quest-item', label: 'Küldetéstárgy' },
    { value: 'custom', label: 'Egyedi' },
  ];

  constructor() {
    void this.store.load(this.projectId);
  }

  protected setType(event: Event): void {
    this.store.typeFilter.set((event.target as HTMLSelectElement).value as RewardType | 'all');
  }

  protected setRecipient(event: Event): void {
    this.store.recipientFilter.set((event.target as HTMLSelectElement).value);
  }

  protected setDelivery(value: CollectionDeliveryFilter): void {
    this.store.deliveryFilter.set(value);
  }

  protected rewardIcon(type: RewardType): PsIconName {
    switch (type) {
      case 'pokemon': return 'pokemon-sticker';
      case 'badge': return 'badge-medal';
      case 'outfit': return 'clothing-shirt';
      case 'achievement': return 'achievement-star';
      case 'quest-item': return 'quest-card';
      default: return 'items-potion';
    }
  }

  protected typeLabel(type: RewardType): string {
    return this.types.find((item) => item.value === type)?.label ?? 'Egyedi jutalom';
  }
}
