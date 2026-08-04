import { ChangeDetectionStrategy, Component, computed, effect, inject, output, signal } from '@angular/core';

import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { LibraryReference, LibrarySection } from '../../models/library-reference.model';
import { GameMasterLibraryStore } from '../../services/game-master-library.store';

type RewardReferenceSection = 'pokemon' | 'items' | 'pokeballs';

const sections: readonly RewardReferenceSection[] = ['pokemon', 'items', 'pokeballs'];
const sectionLabels: Record<RewardReferenceSection, string> = {
  pokemon: 'Pokémonok',
  items: 'Tárgyak',
  pokeballs: 'Poké Ballok',
};

@Component({
  selector: 'app-reward-reference-picker',
  standalone: true,
  imports: [PsIconComponent],
  templateUrl: './reward-reference-picker.component.html',
  styleUrl: './reward-reference-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RewardReferencePickerComponent {
  private readonly library = inject(GameMasterLibraryStore);
  readonly selected = output<LibraryReference>();
  readonly closed = output<void>();
  protected readonly sections = sections;
  protected readonly sectionLabels = sectionLabels;
  protected readonly section = signal<RewardReferenceSection>('pokemon');
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
    effect(() => void this.loadEntries(this.section()));
  }

  protected updateSection(event: Event): void {
    this.section.set((event.target as HTMLSelectElement).value as RewardReferenceSection);
    this.query.set('');
  }

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected select(entry: LibraryReference): void {
    this.selected.emit(entry);
  }

  private async loadEntries(section: LibrarySection): Promise<void> {
    this.entries.set(await this.library.entries(section));
  }
}