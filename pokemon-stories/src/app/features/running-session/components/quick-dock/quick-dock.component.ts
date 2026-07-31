import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  QuickDockAction,
  QuickDockViewModel,
} from './quick-dock.model';

@Component({
  selector: 'app-quick-dock',
  standalone: true,
  templateUrl: './quick-dock.component.html',
  styleUrl: './quick-dock.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickDockComponent {
  readonly dock =
    input.required<QuickDockViewModel>();

  readonly actionSelected =
    output<QuickDockAction>();

  protected selectAction(
    action: QuickDockAction,
  ): void {
    this.actionSelected.emit(action);
  }
}