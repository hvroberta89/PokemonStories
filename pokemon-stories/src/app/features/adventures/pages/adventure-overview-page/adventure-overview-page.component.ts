import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { adventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { AdventureOverviewStore } from '../../store/adventure-overview.store';

@Component({
  selector: 'app-adventure-overview-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent],
  templateUrl: './adventure-overview-page.component.html',
  styleUrl: './adventure-overview-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AdventureOverviewStore],
})
export class AdventureOverviewPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly projectId = projectId(this.route.snapshot.paramMap.get('projectId') ?? '');
  protected readonly adventureId = adventurePlanId(
    this.route.snapshot.paramMap.get('adventureId') ?? '',
  );
  protected readonly store = inject(AdventureOverviewStore);
  protected readonly readyError = signal<string | null>(null);
  protected readonly readinessHint = computed(() => {
    const adventure = this.store.adventure();
    if (!adventure || adventure.readiness.isReady) return null;
    if (adventure.readiness.missingRequired.includes('opening-scene')) {
      return 'Adj hozzá egy nyitójelenetet, hogy elindulhasson a történet.';
    }
    return 'Adj meg egy egyértelmű célt a nyitójelenethez.';
  });

  constructor() {
    void this.store.load(this.projectId, this.adventureId);
  }

  protected retry(): void {
    void this.store.load(this.projectId, this.adventureId);
  }

  protected async markReady(): Promise<void> {
    this.readyError.set(null);
    if (!(await this.store.markReady(this.projectId, this.adventureId))) {
      this.readyError.set('A kaland állapotát most nem sikerült frissíteni.');
    }
  }
}
