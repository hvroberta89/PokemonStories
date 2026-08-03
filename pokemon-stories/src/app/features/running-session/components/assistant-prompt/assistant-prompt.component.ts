import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PsIconComponent } from '../../../../shared/ui/public-api';

import type { AssistantPromptDraft, AssistantPromptViewModel } from './assistant-prompt.model';

@Component({
  selector: 'app-assistant-prompt',
  standalone: true,
  imports: [FormsModule, PsIconComponent],
  templateUrl: './assistant-prompt.component.html',
  styleUrl: './assistant-prompt.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistantPromptComponent {
  readonly prompt = input.required<AssistantPromptViewModel>();

  readonly isLoading = input(false);

  readonly errorMessage = input<string | null>(null);

  readonly closed = output<void>();

  readonly back = output<void>();

  readonly submitted = output<AssistantPromptDraft>();

  protected readonly context = signal('');

  protected readonly trimmedContext = computed(() => this.context().trim());

  protected readonly canSubmit = computed(() => !this.isLoading());

  protected submit(): void {
    if (!this.canSubmit()) {
      return;
    }

    this.submitted.emit({
      type: this.prompt().type,
      context: this.trimmedContext(),
    });
  }
}
