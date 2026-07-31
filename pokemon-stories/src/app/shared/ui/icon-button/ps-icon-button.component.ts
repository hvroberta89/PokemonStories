import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { PsIconComponent } from '../icon/ps-icon.component';
import type { PsIconName } from '../icon/ps-icon.registry';

export type PsIconButtonVariant =
  | 'parchment'
  | 'gold'
  | 'primary'
  | 'danger'
  | 'ghost';

export type PsIconButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ps-icon-button',
  standalone: true,
  imports: [PsIconComponent],
  template: `
    <button
      type="button"
      class="ps-icon-button"
      [class]="'ps-icon-button ps-icon-button--' + variant() + ' ps-icon-button--' + size()"
      [disabled]="disabled()"
      [attr.aria-label]="label()"
      [attr.title]="tooltip() || label()"
      (click)="pressed.emit()"
    >
      <ps-icon
        [name]="icon()"
        [size]="iconSize()"
        [glowing]="glowing()"
        [animated]="animated()"
      />
      @if (badge() !== null) {
        <span class="ps-icon-button__badge">{{ badge() }}</span>
      }
    </button>
  `,
  styleUrl: './ps-icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PsIconButtonComponent {
  readonly icon = input.required<PsIconName>();
  readonly label = input.required<string>();
  readonly tooltip = input('');
  readonly variant = input<PsIconButtonVariant>('parchment');
  readonly size = input<PsIconButtonSize>('md');
  readonly disabled = input(false);
  readonly glowing = input(false);
  readonly animated = input(false);
  readonly badge = input<string | number | null>(null);

  readonly pressed = output<void>();

  protected iconSize(): number {
    return {
      sm: 24,
      md: 32,
      lg: 42,
    }[this.size()];
  }
}
