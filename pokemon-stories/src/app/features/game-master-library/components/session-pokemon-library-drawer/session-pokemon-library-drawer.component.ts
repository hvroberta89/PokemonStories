import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';

import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { LibraryReference, LibrarySection } from '../../models/library-reference.model';
import { GameMasterLibraryStore } from '../../services/game-master-library.store';
import { SessionPokemonRole } from '../../services/library-session-selection.service';

const sections: readonly LibrarySection[] = [
  'pokemon', 'moves', 'abilities', 'items', 'pokeballs', 'tms', 'origins', 'paths', 'types',
  'specializations', 'natures', 'feats', 'rules',
];
const sectionLabels: Record<LibrarySection, string> = {
  pokemon: 'Pokémon', moves: 'Move-ok', abilities: 'Képességek', items: 'Tárgyak',
  pokeballs: 'Poké Ballok', tms: 'TM-ek', origins: 'Trainer Originek', paths: 'Trainer Pathok',
  types: 'Típusok', specializations: 'Specializationök', natures: 'Nature-ök',
  feats: 'Pokémon Featek', rules: 'Szabályok',
};

@Component({
  selector: 'app-session-pokemon-library-drawer',
  standalone: true,
  imports: [PsIconComponent],
  templateUrl: './session-pokemon-library-drawer.component.html',
  styleUrl: './session-pokemon-library-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionPokemonLibraryDrawerComponent {
  private readonly library = inject(GameMasterLibraryStore);
  readonly selected = output<{ readonly reference: LibraryReference; readonly role: SessionPokemonRole }>();
  readonly closed = output<void>();
  protected readonly sections = sections;
  protected readonly sectionLabels = sectionLabels;
  protected readonly section = signal<LibrarySection>('pokemon');
  protected readonly query = signal('');
  protected readonly role = signal<SessionPokemonRole>('friendly');
  protected readonly entries = signal<readonly LibraryReference[]>([]);
  protected readonly detail = signal<LibraryReference | null>(null);
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

  protected updateSection(event: Event): void {
    this.section.set((event.target as HTMLSelectElement).value as LibrarySection);
    this.query.set('');
    this.detail.set(null);
    void this.loadEntries();
  }

  protected updateRole(event: Event): void {
    this.role.set((event.target as HTMLSelectElement).value as SessionPokemonRole);
  }

  protected select(entry: LibraryReference): void {
    this.selected.emit({ reference: entry, role: this.role() });
  }

  protected openDetail(entry: LibraryReference): void {
    this.detail.set(entry);
  }

  private async loadEntries(): Promise<void> {
    this.entries.set(await this.library.entries(this.section()));
  }
}