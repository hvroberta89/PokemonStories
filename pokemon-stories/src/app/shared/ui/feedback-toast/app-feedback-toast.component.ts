import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PsIconComponent } from '../icon/ps-icon.component';
import { FeedbackToastStore } from './feedback-toast.store';

@Component({
  selector: 'app-feedback-toast',
  standalone: true,
  imports: [PsIconComponent],
  template: `
    @if (feedback.toast(); as toast) {
      <aside class="feedback-toast" [class]="'feedback-toast feedback-toast--' + toast.kind" role="status" aria-live="polite">
        <ps-icon [name]="toast.icon" [size]="32" [animated]="toast.kind === 'progress'" [glowing]="toast.kind !== 'error'" />
        <div><strong>{{ toast.title }}</strong><span>{{ toast.message }}</span></div>
        <button type="button" aria-label="Értesítés bezárása" (click)="feedback.dismiss()">×</button>
      </aside>
    }
  `,
  styleUrl: './app-feedback-toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFeedbackToastComponent {
  protected readonly feedback = inject(FeedbackToastStore);
}