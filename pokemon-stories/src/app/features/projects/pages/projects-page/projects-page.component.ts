import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { ProjectsStore } from '../../store/projects.store';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { PsEmptyStateComponent } from '../../../../shared/ui/empty-state/ps-empty-state.component';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [ProjectCardComponent, PsEmptyStateComponent, PsIconComponent],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectsStore],
})
export class ProjectsPageComponent implements OnInit {
  protected readonly store = inject(ProjectsStore);

  ngOnInit(): void {
    void this.store.load();
  }

  protected retryLoading(): void {
    void this.store.load();
  }
}
