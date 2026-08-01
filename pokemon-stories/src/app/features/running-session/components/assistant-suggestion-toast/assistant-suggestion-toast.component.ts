import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  PsIconComponent,
} from '../../../../shared/ui/public-api';

@Component({
  selector:
    'app-assistant-suggestion-toast',
  standalone: true,
  imports: [
    PsIconComponent,
  ],
  templateUrl:
    './assistant-suggestion-toast.component.html',
  styleUrl:
    './assistant-suggestion-toast.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class AssistantSuggestionToastComponent {
  readonly title =
    input.required<string>();

  readonly closed =
    output<void>();

  protected close(): void {
    this.closed.emit();
  }
}