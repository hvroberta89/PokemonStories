import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  ImprovAssistantAction,
  ImprovAssistantViewModel,
} from './improv-assistant.model';

@Component({
  selector: 'app-improv-assistant',
  standalone: true,
  templateUrl: './improv-assistant.component.html',
  styleUrl: './improv-assistant.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImprovAssistantComponent {
  readonly assistant =
    input.required<ImprovAssistantViewModel>();

  readonly actionSelected =
    output<ImprovAssistantAction>();

  protected selectAction(
    action: ImprovAssistantAction,
  ): void {
    this.actionSelected.emit(action);
  }
}