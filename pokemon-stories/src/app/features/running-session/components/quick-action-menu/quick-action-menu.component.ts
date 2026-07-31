import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  QuickActionMenuVm,
  QuickActionType,
} from './quick-action-menu.model';
import { PsIconComponent } from '../../../../shared/ui/public-api';

@Component({
  selector: 'app-quick-action-menu',
  standalone: true,
  imports: [
    PsIconComponent,
  ],
  templateUrl:
    './quick-action-menu.component.html',
  styleUrl:
    './quick-action-menu.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class QuickActionMenuComponent {
  readonly menu =
    input.required<QuickActionMenuVm>();

  readonly actionSelected =
    output<QuickActionType>();

  readonly dismissed =
    output<void>();

  protected selectAction(
    action: QuickActionType,
  ): void {
    this.actionSelected.emit(action);
  }

  protected dismiss(): void {
    this.dismissed.emit();
  }
}