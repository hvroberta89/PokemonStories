import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

  constructor() {
    void this.store.load(this.projectId, this.adventureId);
  }

  protected retry(): void {
    void this.store.load(this.projectId, this.adventureId);
  }
}
