import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
} from '@angular/core';

import { PsIconComponent } from '../icon/ps-icon.component';
import type { PsIconName } from '../icon/ps-icon.registry';

@Component({
  selector: 'ps-reward-toast',
  standalone: true,
  imports: [
    PsIconComponent,
  ],
  template: `
    <aside
      class="ps-reward-toast"
      role="status"
      aria-live="polite"
    >
      <div
        class="
          ps-reward-toast__spark
          ps-reward-toast__spark--one
        "
        aria-hidden="true"
      >
        ✦
      </div>

      <div
        class="
          ps-reward-toast__spark
          ps-reward-toast__spark--two
        "
        aria-hidden="true"
      >
        ✧
      </div>

      <div class="ps-reward-toast__icon">
        <ps-icon
          [name]="icon()"
          [size]="44"
          [glowing]="true"
          [animated]="true"
        />
      </div>

      <div class="ps-reward-toast__copy">
        <span class="ps-reward-toast__eyebrow">
          {{ eyebrow() }}
        </span>

        <strong>
          {{ title() }}
        </strong>

        @if (description()) {
          <span class="ps-reward-toast__description">
            {{ description() }}
          </span>
        }
      </div>

      <button
        type="button"
        class="ps-reward-toast__close"
        aria-label="Jutalomértesítés bezárása"
        (click)="close()"
      >
        ×
      </button>

      <div
        class="ps-reward-toast__progress"
        aria-hidden="true"
      ></div>
    </aside>
  `,
  styleUrl: './ps-reward-toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PsRewardToastComponent {
  private readonly destroyRef =
    inject(DestroyRef);

  private timeoutId: number | null = null;

  readonly icon =
    input<PsIconName>('reward-box');

  readonly eyebrow =
    input('Új jutalom!');

  readonly title =
    input.required<string>();

  readonly description =
    input('');

  readonly duration =
    input(3500);

  readonly closed =
    output<void>();

  constructor() {
    this.startAutoClose();

    this.destroyRef.onDestroy(() => {
      this.clearAutoClose();
    });
  }

  protected close(): void {
    this.clearAutoClose();
    this.closed.emit();
  }

  private startAutoClose(): void {
    this.timeoutId = window.setTimeout(
      () => {
        this.close();
      },
      this.duration(),
    );
  }

  private clearAutoClose(): void {
    if (this.timeoutId === null) {
      return;
    }

    window.clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }
}