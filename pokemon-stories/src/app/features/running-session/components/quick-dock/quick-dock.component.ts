import {
  ChangeDetectionStrategy,
  Component,
  output,
} from '@angular/core';

import {
  QuickDockAction,
  QuickDockItem,
} from './quick-dock.model';

@Component({
  selector: 'app-quick-dock',
  standalone: true,
  templateUrl: './quick-dock.component.html',
  styleUrl: './quick-dock.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickDockComponent {
  readonly actionSelected = output<QuickDockAction>();

  protected readonly items: readonly QuickDockItem[] = [
    {
      action: 'characters',
      label: 'Karakterek',
      icon: '👥',
    },
    {
      action: 'notes',
      label: 'Jegyzetek',
      icon: '📖',
    },
    {
      action: 'dice',
      label: 'Dobókocka',
      icon: '🎲',
    },
    {
      action: 'settings',
      label: 'Beállítások',
      icon: '⚙️',
    },
  ];

  protected selectAction(action: QuickDockAction): void {
    this.actionSelected.emit(action);
  }
}