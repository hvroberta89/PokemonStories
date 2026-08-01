import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  PsIconComponent,
} from '../../../../shared/ui/public-api';

import type {
  AssistantResultsViewModel,
  AssistantSuggestionSelection,
  AssistantSuggestionViewModel,
} from './assistant-results.model';

@Component({
  selector: 'app-assistant-results',
  standalone: true,
  imports: [
    PsIconComponent,
  ],
  templateUrl:
    './assistant-results.component.html',
  styleUrl:
    './assistant-results.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class AssistantResultsComponent {
  readonly results =
    input.required<
      AssistantResultsViewModel
    >();

  readonly closed =
    output<void>();

  readonly back =
    output<void>();

  readonly selected =
    output<
      AssistantSuggestionSelection
    >();

  protected selectSuggestion(
    suggestion:
      AssistantSuggestionViewModel,
  ): void {
    this.selected.emit({
      type:
        this.results().type,
      suggestion,
    });
  }
}