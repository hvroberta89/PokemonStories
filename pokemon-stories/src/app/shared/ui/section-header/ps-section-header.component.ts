import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

import { PsIconComponent } from '../icon/ps-icon.component';
import type { PsIconName } from '../icon/ps-icon.registry';

@Component({
  selector: 'ps-section-header',
  standalone: true,
  imports: [PsIconComponent],
  template: `
    <header class="ps-section-header">
      <div class="ps-section-header__icon">
        <ps-icon [name]="icon()" [size]="42" [glowing]="glowing()" />
      </div>

      <div class="ps-section-header__copy">
        <p class="ps-section-header__eyebrow">{{ eyebrow() }}</p>
        <h2>{{ title() }}</h2>

        @if (description()) {
          <p class="ps-section-header__description">{{ description() }}</p>
        }
      </div>

      <div class="ps-section-header__actions">
        <ng-content select="[psSectionActions]" />
      </div>
    </header>
  `,
  styleUrl: './ps-section-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PsSectionHeaderComponent {
  readonly icon = input.required<PsIconName>();
  readonly title = input.required<string>();
  readonly eyebrow = input('Pokémon Stories');
  readonly description = input('');
  readonly glowing = input(false);
}
