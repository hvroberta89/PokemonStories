import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { PsIconComponent } from '../icon/ps-icon.component';
import type { PsIconName } from '../icon/ps-icon.registry';

@Component({
  selector: 'ps-reward-toast',
  standalone: true,
  imports: [PsIconComponent],
  template: `
    <aside class="ps-reward-toast" role="status" aria-live="polite">
      <div class="ps-reward-toast__spark ps-reward-toast__spark--one">✦</div>
      <div class="ps-reward-toast__spark ps-reward-toast__spark--two">✧</div>

      <div class="ps-reward-toast__icon">
        <ps-icon
          [name]="icon()"
          [size]="56"
          [glowing]="true"
          [animated]="true"
        />
      </div>

      <div class="ps-reward-toast__copy">
        <span class="ps-reward-toast__eyebrow">{{ eyebrow() }}</span>
        <strong>{{ title() }}</strong>
        @if (description()) {
          <span>{{ description() }}</span>
        }
      </div>

      <button
        type="button"
        class="ps-reward-toast__close"
        aria-label="Jutalomértesítés bezárása"
        (click)="closed.emit()"
      >
        ×
      </button>
    </aside>
  `,
  styleUrl: './ps-reward-toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PsRewardToastComponent {
  readonly icon = input<PsIconName>('reward-box');
  readonly eyebrow = input('Új jutalom!');
  readonly title = input.required<string>();
  readonly description = input('');

  readonly closed = output<void>();
}
