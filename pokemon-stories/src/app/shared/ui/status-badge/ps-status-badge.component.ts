import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { PsIconComponent } from '../icon/ps-icon.component';
import type { PsIconName } from '../icon/ps-icon.registry';

export type PsStatusBadgeTone =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'magic';

@Component({
  selector: 'ps-status-badge',
  standalone: true,
  imports: [PsIconComponent],
  template: `
    <span
      class="ps-status-badge"
      [class]="'ps-status-badge ps-status-badge--' + tone()"
      [attr.aria-label]="ariaLabel()"
    >
      @if (resolvedIcon(); as iconName) {
        <ps-icon [name]="iconName" [size]="20" />
      }
      <span>{{ label() }}</span>
    </span>
  `,
  styleUrl: './ps-status-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PsStatusBadgeComponent {
  readonly label = input.required<string>();
  readonly tone = input<PsStatusBadgeTone>('neutral');
  readonly icon = input<PsIconName | null>(null);
  readonly ariaLabel = input<string | null>(null);

  protected readonly resolvedIcon = computed<PsIconName | null>(() => {
    if (this.icon()) {
      return this.icon();
    }

    return {
      success: 'success-check',
      warning: 'warning-triangle',
      danger: 'error-cross',
      info: 'info-orb',
      neutral: null,
      magic: 'ai-crystal',
    }[this.tone()] as PsIconName | null;
  });
}
