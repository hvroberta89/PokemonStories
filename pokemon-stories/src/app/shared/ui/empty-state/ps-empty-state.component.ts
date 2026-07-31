import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { PsIconComponent } from '../icon/ps-icon.component';
import type { PsIconName } from '../icon/ps-icon.registry';

@Component({
  selector: 'ps-empty-state',
  standalone: true,
  imports: [PsIconComponent],
  template: `
    <section class="ps-empty-state">
      <div class="ps-empty-state__illustration">
        <ps-icon
          [name]="icon()"
          [size]="88"
          [glowing]="true"
        />
      </div>

      <h2>{{ title() }}</h2>
      <p>{{ description() }}</p>

      @if (actionLabel()) {
        <button type="button" (click)="action.emit()">
          <ps-icon [name]="actionIcon()" [size]="24" />
          <span>{{ actionLabel() }}</span>
        </button>
      }
    </section>
  `,
  styleUrl: './ps-empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PsEmptyStateComponent {
  readonly icon = input<PsIconName>('world-map');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly actionLabel = input('');
  readonly actionIcon = input<PsIconName>('add-spark');

  readonly action = output<void>();
}
