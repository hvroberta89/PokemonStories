import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { PS_ICON_PATHS, type PsIconName } from './ps-icon.registry';

export type PsIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'ps-icon',
  standalone: true,
  template: `
    <span
      class="ps-icon"
      [class.ps-icon--glowing]="glowing()"
      [class.ps-icon--pulse]="animated()"
      [style.--ps-icon-size.px]="sizeInPixels()"
    >
      <img
        [src]="src()"
        [alt]="decorative() ? '' : alt()"
        [attr.aria-hidden]="decorative() ? 'true' : null"
        draggable="false"
      />
    </span>
  `,
  styleUrl: './ps-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PsIconComponent {
  readonly name = input.required<PsIconName>();
  readonly size = input<PsIconSize | number>('md');
  readonly alt = input('');
  readonly decorative = input(true);
  readonly glowing = input(false);
  readonly animated = input(false);

  readonly src = computed(
    () => `/assets/ui/icons/${PS_ICON_PATHS[this.name()]}`,
  );

  readonly sizeInPixels = computed(() => {
    const value = this.size();

    if (typeof value === 'number') {
      return Math.max(12, value);
    }

    return {
      xs: 20,
      sm: 28,
      md: 36,
      lg: 48,
      xl: 64,
    }[value];
  });
}
