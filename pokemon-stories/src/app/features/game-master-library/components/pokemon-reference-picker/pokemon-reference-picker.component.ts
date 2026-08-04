import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';

import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { LibraryReference } from '../../models/library-reference.model';
import { GameMasterLibraryStore } from '../../services/game-master-library.store';

@Component({
  selector: 'app-pokemon-reference-picker',
  standalone: true,
  imports: [PsIconComponent],
  templateUrl: './pokemon-reference-picker.component.html',
  styleUrl: './pokemon-reference-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonReferencePickerComponent {
  private readonly library = inject(GameMasterLibraryStore);
  readonly selected = output<LibraryReference>();
  readonly closed = output<void>();
  protected readonly query = signal('');
  protected readonly entries = signal<readonly LibraryReference[]>([]);
  protected readonly results = computed(() => {
    const query = this.query().trim().toLocaleLowerCase('hu');
    return query
      ? this.entries().filter((entry) => `${entry.name} ${entry.tags.join(' ')}`.toLocaleLowerCase('hu').includes(query))
      : this.entries();
  });
  protected readonly isLoading = this.library.isLoading;
  protected readonly error = this.library.error;

  constructor() {
    void this.loadEntries();
  }

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected select(entry: LibraryReference): void {
    this.selected.emit(entry);
  }

  private async loadEntries(): Promise<void> {
    this.entries.set(await this.library.entries('pokemon'));
  }
}