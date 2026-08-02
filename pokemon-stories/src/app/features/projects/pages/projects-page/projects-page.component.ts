import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  private readonly router = inject(Router);
  protected readonly store = inject(ProjectsStore);

  ngOnInit(): void {
    void this.store.load();
  }

  protected retryLoading(): void {
    void this.store.load();
  }

  protected openCreateProject(): void {
    void this.router.navigate(['/projects/new']);
  }
}
