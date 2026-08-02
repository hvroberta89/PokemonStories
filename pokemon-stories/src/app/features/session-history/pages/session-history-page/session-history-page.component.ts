import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { projectId } from '../../../../domain/project/value-objects/project-id';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { SessionHistoryStore } from '../../store/session-history.store';

@Component({
  selector: 'app-session-history-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent],
  templateUrl: './session-history-page.component.html',
  styleUrl: './session-history-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SessionHistoryStore],
})
export class SessionHistoryPageComponent {
  protected readonly projectId = projectId(
    inject(ActivatedRoute).snapshot.paramMap.get('projectId') ?? '',
  );
  protected readonly store = inject(SessionHistoryStore);

  constructor() {
    this.store.load(this.projectId);
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('hu-HU', { dateStyle: 'long' }).format(new Date(value));
  }

  protected duration(startedAt: string, completedAt: string): string {
    const minutes = Math.max(
      0,
      Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 60_000),
    );
    return `${minutes} perc`;
  }
}
