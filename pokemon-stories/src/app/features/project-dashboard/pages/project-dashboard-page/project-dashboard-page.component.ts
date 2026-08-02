import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { ProjectDashboardStore } from '../../store/project-dashboard.store';
import { AdventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';

@Component({
  selector: 'app-project-dashboard-page',
  standalone: true,
  imports: [PsIconComponent, RouterLink],
  templateUrl: './project-dashboard-page.component.html',
  styleUrl: './project-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectDashboardStore],
})
export class ProjectDashboardPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly store = inject(ProjectDashboardStore);

  ngOnInit(): void {
    void this.load();
  }

  protected retry(): void {
    void this.load();
  }

  protected createAdventure(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    void this.router.navigate(['/projects', projectId, 'adventures', 'new']);
  }

  protected openAdventure(adventureId: AdventurePlanId): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    void this.router.navigate(['/projects', projectId, 'adventures', adventureId]);
  }

  private load(): Promise<void> {
    return this.store.load(this.route.snapshot.paramMap.get('projectId') ?? '');
  }
}
