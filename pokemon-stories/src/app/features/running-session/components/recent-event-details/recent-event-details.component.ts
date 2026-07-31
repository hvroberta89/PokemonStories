import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  PsIconComponent,
} from '../../../../shared/ui/icon/ps-icon.component';
import {
  RecentEventItemViewModel,
  RecentEventType,
} from '../recent-events/recent-events.model';

@Component({
  selector: 'app-recent-event-details',
  standalone: true,
  imports: [
    PsIconComponent,
  ],
  templateUrl:
    './recent-event-details.component.html',
  styleUrl:
    './recent-event-details.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class RecentEventDetailsComponent {
  readonly event =
    input.required<RecentEventItemViewModel>();

  readonly dismissed =
    output<void>();

  protected dismiss(): void {
    this.dismissed.emit();
  }

  protected getTypeLabel(
    type: RecentEventType,
  ): string {
    switch (type) {
      case 'encounter':
        return 'Találkozás';

      case 'conversation':
        return 'Beszélgetés';

      case 'reward':
        return 'Jutalom';

      case 'discovery':
        return 'Felfedezés';

      case 'note':
        return 'Jegyzet';
    }
  }
}