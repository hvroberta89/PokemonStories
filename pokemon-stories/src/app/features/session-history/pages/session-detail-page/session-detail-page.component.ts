import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { projectId } from '../../../../domain/project/value-objects/project-id';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { SessionDetailStore } from '../../store/session-detail.store';

@Component({
  selector: 'app-session-detail-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent],
  templateUrl: './session-detail-page.component.html',
  styleUrl: './session-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SessionDetailStore],
})
export class SessionDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly projectId = projectId(this.route.snapshot.paramMap.get('projectId') ?? '');
  protected readonly store = inject(SessionDetailStore);

  constructor() {
    this.store.load(this.projectId, this.route.snapshot.paramMap.get('sessionId') ?? '');
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('hu-HU', { dateStyle: 'long', timeStyle: 'short' }).format(
      new Date(value),
    );
  }
}
