import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  CharacterStripItemViewModel,
} from './characters-strip.model';

@Component({
  selector: 'app-characters-strip',
  standalone: true,
  templateUrl: './characters-strip.component.html',
  styleUrl: './characters-strip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersStripComponent {
  readonly characters =
    input.required<readonly CharacterStripItemViewModel[]>();

  readonly characterSelected = output<string>();

  protected selectCharacter(characterId: string): void {
    this.characterSelected.emit(characterId);
  }
}