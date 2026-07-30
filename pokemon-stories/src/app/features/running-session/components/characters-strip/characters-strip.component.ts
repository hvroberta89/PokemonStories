import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  CharactersStripViewModel,
} from './characters-strip.model';

@Component({
  selector: 'app-characters-strip',
  standalone: true,
  templateUrl: './characters-strip.component.html',
  styleUrl: './characters-strip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersStripComponent {
  readonly strip =
    input.required<CharactersStripViewModel>();

  readonly characterSelected = output<string>();
  readonly addSelected = output<void>();
  readonly detailsSelected = output<void>();

  protected selectCharacter(
    characterId: string,
  ): void {
    this.characterSelected.emit(characterId);
  }

  protected addCharacter(): void {
    this.addSelected.emit();
  }

  protected openDetails(): void {
    this.detailsSelected.emit();
  }
}