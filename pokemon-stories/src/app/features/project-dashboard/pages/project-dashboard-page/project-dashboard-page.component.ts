import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { ProjectDashboardStore } from '../../store/project-dashboard.store';

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
  protected readonly store = inject(ProjectDashboardStore);

  ngOnInit(): void {
    void this.load();
  }

  protected retry(): void {
    void this.load();
  }

  private load(): Promise<void> {
    return this.store.load(this.route.snapshot.paramMap.get('projectId') ?? '');
  }
}
