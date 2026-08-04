import { Injectable, signal } from '@angular/core';

import type { PsIconName } from '../icon/ps-icon.registry';

export type FeedbackToastKind = 'progress' | 'success' | 'error';

export interface FeedbackToast {
  readonly kind: FeedbackToastKind;
  readonly title: string;
  readonly message: string;
  readonly icon: PsIconName;
}

@Injectable({ providedIn: 'root' })
export class FeedbackToastStore {
  private readonly toastState = signal<FeedbackToast | null>(null);
  private timeoutId: number | null = null;

  readonly toast = this.toastState.asReadonly();

  show(toast: FeedbackToast, duration = 4_000): void {
    this.clearTimeout();
    this.toastState.set(toast);
    if (duration > 0) {
      this.timeoutId = window.setTimeout(() => this.dismiss(), duration);
    }
  }

  dismiss(): void {
    this.clearTimeout();
    this.toastState.set(null);
  }

  private clearTimeout(): void {
    if (this.timeoutId === null) return;
    window.clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }
}