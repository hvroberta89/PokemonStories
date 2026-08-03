import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { ProjectDashboardStore } from '../../store/project-dashboard.store';
import { AdventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { PsVoiceInputDirective } from '../../../../shared/ui/voice-input/ps-voice-input.directive';

@Component({
  selector: 'app-project-dashboard-page',
  standalone: true,
  imports: [PsIconComponent, RouterLink, PsVoiceInputDirective],
  templateUrl: './project-dashboard-page.component.html',
  styleUrl: './project-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectDashboardStore],
})
export class ProjectDashboardPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly store = inject(ProjectDashboardStore);
  protected readonly archiveConfirmOpen = signal(false);
  protected readonly archiveError = signal<string | null>(null);
  protected readonly editOpen = signal(false);
  protected readonly editName = signal('');
  protected readonly editDescription = signal('');
  protected readonly editError = signal<string | null>(null);

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
    void this.router.navigate(['/projects', projectId, 'adventures', adventureId, 'design']);
  }

  protected prepareAdventure(adventureId: AdventurePlanId): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    void this.router.navigate(['/projects', projectId, 'adventures', adventureId, 'prepare']);
  }

  protected resumeSession(): void {
    void this.router.navigate(['/running-session']);
  }

  protected openEdit(): void {
    const project = this.store.dashboard()?.project;
    if (!project) return;
    this.editName.set(project.name);
    this.editDescription.set(project.description ?? '');
    this.editError.set(null);
    this.editOpen.set(true);
  }

  protected async saveProject(): Promise<void> {
    const result = await this.store.update(
      this.route.snapshot.paramMap.get('projectId') ?? '',
      this.editName(),
      this.editDescription(),
    );
    if (result === 'saved') {
      this.editOpen.set(false);
      return;
    }
    this.editError.set(
      result === 'invalid'
        ? 'Adj meg legfeljebb 80 karakteres projektnevet és 500 karakteres leírást.'
        : 'A projekt módosításait most nem sikerült elmenteni.',
    );
  }

  protected async archiveProject(): Promise<void> {
    const result = await this.store.archive(this.route.snapshot.paramMap.get('projectId') ?? '');
    if (result === 'archived') {
      void this.router.navigate(['/projects']);
      return;
    }
    this.archiveError.set(
      result === 'active-session'
        ? 'A futó vagy átnézésre váró Sessiont előbb fejezd be.'
        : 'A projekt archiválása most nem sikerült.',
    );
  }

  private load(): Promise<void> {
    return this.store.load(this.route.snapshot.paramMap.get('projectId') ?? '');
  }
}
