import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';

import {
  PsIconComponent,
} from '../../../../shared/ui/public-api';

import type {
  SessionEndSummaryViewModel,
} from './session-end-sheet.model';

@Component({
  selector: 'app-session-end-sheet',
  standalone: true,
  imports: [
    PsIconComponent,
  ],
  templateUrl:
    './session-end-sheet.component.html',
  styleUrl:
    './session-end-sheet.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class SessionEndSheetComponent {
  readonly summary =
    input.required<
      SessionEndSummaryViewModel
    >();

  readonly closed =
    output<void>();

  readonly confirmed =
    output<void>();

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closed.emit();
  }
}
