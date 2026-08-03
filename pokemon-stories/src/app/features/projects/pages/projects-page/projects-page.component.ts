import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ProjectsStore } from '../../store/projects.store';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { PsEmptyStateComponent } from '../../../../shared/ui/empty-state/ps-empty-state.component';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { ProjectId } from '../../../../domain/project/value-objects/project-id';
import { AuthStore } from '../../../auth/services/auth.store';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [ProjectCardComponent, PsEmptyStateComponent, PsIconComponent, RouterLink],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectsStore],
})
export class ProjectsPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthStore);
  protected readonly store = inject(ProjectsStore);
  protected readonly showArchived = signal(false);

  ngOnInit(): void {
    void this.store.load();
  }

  protected retryLoading(): void {
    void this.store.load();
  }

  protected openCreateProject(): void {
    void this.router.navigate(['/projects/new']);
  }

  protected openProject(projectId: ProjectId): void {
    void this.router.navigate(['/projects', projectId]);
  }

  protected restoreProject(projectId: ProjectId): void {
    void this.store.restore(projectId);
  }

  protected async signOut(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['/auth']);
  }
}
