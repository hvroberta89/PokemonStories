import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  PsIconComponent,
} from '../../../../shared/ui/icon/ps-icon.component';
import type {
  AdventureAssistantViewModel,
  AssistantQuickActionId,
} from './assistant-sheet.model';

@Component({
  selector: 'app-assistant-sheet',
  standalone: true,
  imports: [
    PsIconComponent,
  ],
  templateUrl:
    './assistant-sheet.component.html',
  styleUrl:
    './assistant-sheet.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class AssistantSheetComponent {
  readonly assistant =
    input.required<
      AdventureAssistantViewModel
    >();

  readonly closed =
    output<void>();

  readonly actionSelected =
    output<AssistantQuickActionId>();
}