import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';

import { PsIconComponent } from '../../../../shared/ui/public-api';

import type { SessionSummaryViewModel } from './session-summary.model';

@Component({
  selector: 'app-session-summary',
  standalone: true,
  imports: [PsIconComponent],
  templateUrl: './session-summary.component.html',
  styleUrl: './session-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionSummaryComponent {
  readonly summary = input.required<SessionSummaryViewModel>();

  readonly reviewCompleted = output<void>();

  readonly timelineSelected = output<void>();

  readonly rewardsSelected = output<void>();

  readonly closeSelected = output<void>();

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.close();
  }

  protected openTimeline(): void {
    this.timelineSelected.emit();
  }

  protected openRewards(): void {
    this.rewardsSelected.emit();
  }

  protected completeReview(): void {
    this.reviewCompleted.emit();
  }

  protected close(): void {
    this.closeSelected.emit();
  }
}
