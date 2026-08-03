import { computed, Injectable, signal } from '@angular/core';
import { LibraryReference, LibrarySection } from '../models/library-reference.model';

interface ReferenceFile { readonly items: readonly Record<string, unknown>[]; }
const sections: readonly LibrarySection[] = ['pokemon', 'moves', 'abilities', 'items', 'tms'];
const files: Record<LibrarySection, string> = { pokemon: 'pokemon.json', moves: 'moves.json', abilities: 'abilities.json', items: 'items.json', tms: 'technical-machines.json' };
const favoritesKey = 'pokemon-stories.library.favorites';
const recentKey = 'pokemon-stories.library.recent';

@Injectable({ providedIn: 'root' })
export class GameMasterLibraryStore {
  private readonly entriesBySection = new Map<LibrarySection, readonly LibraryReference[]>();
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly favoritesState = signal<readonly string[]>(this.readKeys(favoritesKey));
  private readonly recentState = signal<readonly string[]>(this.readKeys(recentKey));
  readonly isLoading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly favorites = computed(() => this.resolve(this.favoritesState()));
  readonly recent = computed(() => this.resolve(this.recentState()));

  async entries(section: LibrarySection): Promise<readonly LibraryReference[]> {
    const cached = this.entriesBySection.get(section);
    if (cached) return cached;
    this.loadingState.set(true); this.errorState.set(null);
    try {
      const response = await fetch(`/reference-data/poke5e/${files[section]}`);
      if (!response.ok) throw new Error();
      const data = await response.json() as ReferenceFile;
      const entries = data.items.map((item) => this.toReference(section, item));
      this.entriesBySection.set(section, entries);
      return entries;
    } catch {
      this.errorState.set('A referenciaadatok most nem tölthetők be.');
      return [];
    } finally { this.loadingState.set(false); }
  }

  async find(section: LibrarySection, id: string): Promise<LibraryReference | null> {
    const entry = (await this.entries(section)).find((item) => item.id === id) ?? null;
    if (entry) this.addRecent(entry.key);
    return entry;
  }

  isFavorite(key: string): boolean { return this.favoritesState().includes(key); }
  toggleFavorite(key: string): void {
    const values = this.favoritesState();
    const next = values.includes(key) ? values.filter((item) => item !== key) : [key, ...values];
    this.favoritesState.set(next); this.writeKeys(favoritesKey, next);
  }
  async ensureAllLoaded(): Promise<void> { await Promise.all(sections.map((section) => this.entries(section))); }

  private addRecent(key: string): void {
    const next = [key, ...this.recentState().filter((item) => item !== key)].slice(0, 20);
    this.recentState.set(next); this.writeKeys(recentKey, next);
  }
  private resolve(keys: readonly string[]): readonly LibraryReference[] {
    const index = new Map([...this.entriesBySection.values()].flat().map((entry) => [entry.key, entry] as const));
    return keys.flatMap((key) => index.get(key) ? [index.get(key)!] : []);
  }
  private readKeys(key: string): readonly string[] {
    try { const values = JSON.parse(localStorage.getItem(key) ?? '[]'); return Array.isArray(values) && values.every((item) => typeof item === 'string') ? values : []; } catch { return []; }
  }
  private writeKeys(key: string, values: readonly string[]): void { localStorage.setItem(key, JSON.stringify(values)); }
  private toReference(section: LibrarySection, item: Record<string, unknown>): LibraryReference {
    const id = String(item['id']);
    const description = Array.isArray(item['description']) ? item['description'].join(' ') : typeof item['description'] === 'string' ? item['description'] : section === 'tms' ? `Move reference: ${String(item['moveId'])}` : 'Nincs leírás.';
    const tags = section === 'pokemon' ? [`#${String(item['number'])}`, ...((item['types'] as readonly string[] | undefined) ?? []), `SR ${String(item['sr'])}`] : section === 'moves' ? [String(item['type']), `${String(item['powerPoints'])} PP`, String(item['range'])] : section === 'items' ? [String(item['type']), item['cost'] ? `${String(item['cost'])} P` : 'Ár nélkül'] : section === 'tms' ? [`Move: ${String(item['moveId'])}`, `${String(item['cost'])} P`] : ['Képesség'];
    const fields = section === 'pokemon' ? [['Méret', item['size']], ['Páncél', item['armorClass']], ['Életerő', item['hitPoints']], ['Minimum szint', item['minimumLevel']]] : section === 'moves' ? [['Típus', item['type']], ['Idő', item['time']], ['Hatótáv', item['range']], ['PP', item['powerPoints']]] : section === 'items' ? [['Kategória', item['type']], ['Ár', item['cost']]] : section === 'tms' ? [['Kapcsolt Move', item['moveId']], ['Ár', item['cost']]] : [['Kategória', 'Képesség']];
    return { key: `${section}:${id}`, section, id, name: section === 'tms' ? `TM${id}` : String(item['name']), description, artworkPath: section === 'pokemon' ? `/assets/pokemon-artwork/${String(item['number'])}.png` : undefined, tags, detailRows: fields.filter(([, value]) => value != null).map(([label, value]) => ({ label: String(label), value: String(value) })) };
  }
}