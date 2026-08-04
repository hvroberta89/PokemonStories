import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { LibraryLocale, LibraryReference, LibrarySection, LibraryView } from '../../models/library-reference.model';
import { GameMasterLibraryStore } from '../../services/game-master-library.store';
import { LibrarySessionSelectionService, SessionPokemonRole } from '../../services/library-session-selection.service';
import { LibraryAdventureSelectionService } from '../../services/library-adventure-selection.service';

const sections: readonly LibrarySection[] = ['pokemon', 'moves', 'abilities', 'items', 'tms', 'origins', 'types', 'rules'];
const titles: Record<LibraryView, string> = { pokemon: 'Pokémon', moves: 'Move-ok', abilities: 'Képességek', items: 'Tárgyak', tms: 'Technical Machines', origins: 'Trainer Originek', types: 'Típusok', rules: 'Szabályok', favorites: 'Kedvencek', recent: 'Legutóbb megnyitott' };

@Component({
  selector: 'app-game-master-library-page', standalone: true, imports: [RouterLink, PsIconComponent],
  templateUrl: './game-master-library-page.component.html', styleUrl: './game-master-library-page.component.scss', changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameMasterLibraryPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sessionSelection = inject(LibrarySessionSelectionService);
  private readonly adventureSelection = inject(LibraryAdventureSelectionService);
  protected readonly store = inject(GameMasterLibraryStore);
  protected readonly view = signal<LibraryView>('pokemon');
  protected readonly detail = signal<LibraryReference | null>(null);
  protected readonly query = signal('');
  protected readonly entries = signal<readonly LibraryReference[]>([]);
  protected readonly useInSession = signal(false);
  protected readonly useInDesigner = signal(false);
  protected readonly sessionRole = signal<SessionPokemonRole>('friendly');
  protected readonly heading = computed(() => titles[this.view()]);
  protected readonly results = computed(() => {
    const query = this.query().trim().toLowerCase();
    return query ? this.entries().filter((entry) => `${entry.name} ${entry.description} ${entry.tags.join(' ')}`.toLowerCase().includes(query)) : this.entries();
  });
  constructor() {
    this.route.paramMap.subscribe((params) => void this.load(params.get('section'), params.get('id')));
    this.route.queryParamMap.subscribe((params) => { this.useInSession.set(params.get('use') === 'session'); this.useInDesigner.set(params.get('use') === 'designer'); });
  }
  protected updateQuery(event: Event): void { this.query.set((event.target as HTMLInputElement).value); }
  protected updateLocale(event: Event): void {
    this.store.setLocale((event.target as HTMLSelectElement).value as LibraryLocale);
    void this.load(this.view(), this.detail()?.id ?? null);
  }
  protected toggleFavorite(entry: LibraryReference): void { this.store.toggleFavorite(entry.key); }
  protected selectRole(event: Event): void { this.sessionRole.set((event.target as HTMLSelectElement).value as SessionPokemonRole); }
  protected usePokemon(entry: LibraryReference): void {
    this.sessionSelection.select({ reference: entry, role: this.sessionRole() });
    void this.router.navigate(['/running-session']);
  }
  protected usePokemonInDesigner(entry: LibraryReference): void {
    this.adventureSelection.select(entry);
    window.history.back();
  }
  private async load(rawView: string | null, id: string | null): Promise<void> {
    const view: LibraryView = rawView === 'favorites' || rawView === 'recent' ? rawView : sections.includes(rawView as LibrarySection) ? rawView as LibrarySection : 'pokemon';
    this.view.set(view); this.query.set(''); this.detail.set(null);
    if (view === 'favorites' || view === 'recent') { await this.store.ensureAllLoaded(); this.entries.set(view === 'favorites' ? this.store.favorites() : this.store.recent()); return; }
    this.entries.set(await this.store.entries(view));
    if (id) this.detail.set(await this.store.find(view, id));
  }
}