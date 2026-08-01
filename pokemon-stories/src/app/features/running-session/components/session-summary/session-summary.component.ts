import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  PsIconComponent,
} from '../../../../shared/ui/public-api';

import type {
  SessionSummaryViewModel,
} from './session-summary.model';

@Component({
  selector: 'app-session-summary',
  standalone: true,
  imports: [
    PsIconComponent,
  ],
  templateUrl:
    './session-summary.component.html',
  styleUrl:
    './session-summary.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class SessionSummaryComponent {
  readonly summary =
    input.required<
      SessionSummaryViewModel
    >();

  readonly newSessionSelected =
    output<void>();

  readonly timelineSelected =
    output<void>();

  readonly rewardsSelected =
    output<void>();

  readonly closeSelected =
    output<void>();

  protected openTimeline(): void {
    this.timelineSelected.emit();
  }

  protected openRewards(): void {
    this.rewardsSelected.emit();
  }

  protected startNewSession(): void {
    this.newSessionSelected.emit();
  }

  protected close(): void {
    this.closeSelected.emit();
  }
}