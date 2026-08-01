import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';

import {
  PsIconComponent,
} from '../../../../shared/ui/public-api';

import type {
  RecentEventItemViewModel,
} from '../recent-events/recent-events.model';

@Component({
  selector: 'app-session-timeline',
  standalone: true,
  imports: [
    PsIconComponent,
  ],
  templateUrl:
    './session-timeline.component.html',
  styleUrl:
    './session-timeline.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class SessionTimelineComponent {
  readonly events =
    input.required<
      readonly RecentEventItemViewModel[]
    >();

  readonly closed =
    output<void>();

  readonly eventSelected =
    output<string>();

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closed.emit();
  }
}
