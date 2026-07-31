import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  RecentEventsViewModel,
} from './recent-events.model';

@Component({
  selector: 'app-recent-events',
  standalone: true,
  templateUrl: './recent-events.component.html',
  styleUrl: './recent-events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentEventsComponent {
  readonly recentEvents =
    input.required<RecentEventsViewModel>();

  readonly eventSelected = output<string>();
  readonly detailsSelected = output<void>();

  protected selectEvent(eventId: string): void {
    this.eventSelected.emit(eventId);
  }

  protected openDetails(): void {
    this.detailsSelected.emit();
  }
}