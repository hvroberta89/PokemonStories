import { computed, Injectable, signal } from '@angular/core';
import { LibraryLocale, LibraryReference, LibrarySection } from '../models/library-reference.model';

interface ReferenceFile { readonly items: readonly Record<string, unknown>[]; }
interface TranslationFile { readonly items: readonly ReferenceTranslation[]; }
interface ReferenceTranslation {
  readonly dataset: LibrarySection;
  readonly recordId: string;
  readonly payload: Readonly<Record<string, unknown>>;
}
const sections: readonly LibrarySection[] = ['pokemon', 'moves', 'abilities', 'items', 'tms'];
const files: Record<LibrarySection, string> = { pokemon: 'pokemon.json', moves: 'moves.json', abilities: 'abilities.json', items: 'items.json', tms: 'technical-machines.json' };
const favoritesKey = 'pokemon-stories.library.favorites';
const recentKey = 'pokemon-stories.library.recent';
const localeKey = 'pokemon-stories.library.locale';

@Injectable({ providedIn: 'root' })
export class GameMasterLibraryStore {
  private readonly entriesBySection = new Map<LibrarySection, readonly LibraryReference[]>();
  private translations: ReadonlyMap<string, Readonly<Record<string, unknown>>> | null = null;
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly localeState = signal<LibraryLocale>(this.readLocale());
  private readonly favoritesState = signal<readonly string[]>(this.readKeys(favoritesKey));
  private readonly recentState = signal<readonly string[]>(this.readKeys(recentKey));
  readonly isLoading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly locale = this.localeState.asReadonly();
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
      const translations = this.localeState() === 'hu' ? await this.loadTranslations() : new Map();
      const entries = data.items.map((item) => this.toReference(section, item, translations.get(`${section}:${String(item['id'])}`)));
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
  setLocale(locale: LibraryLocale): void {
    if (locale === this.localeState()) return;
    this.localeState.set(locale);
    this.entriesBySection.clear();
    localStorage.setItem(localeKey, locale);
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
  private readLocale(): LibraryLocale {
    return localStorage.getItem(localeKey) === 'en' ? 'en' : 'hu';
  }
  private writeKeys(key: string, values: readonly string[]): void { localStorage.setItem(key, JSON.stringify(values)); }
  private async loadTranslations(): Promise<ReadonlyMap<string, Readonly<Record<string, unknown>>>> {
    if (this.translations) return this.translations;
    try {
      const response = await fetch('/reference-data/poke5e/translations/hu.json');
      if (!response.ok) return new Map();
      const data = await response.json() as TranslationFile;
      this.translations = new Map(data.items.map((item) => [`${item.dataset}:${item.recordId}`, item.payload]));
    } catch {
      this.translations = new Map();
    }
    return this.translations;
  }
  private toReference(section: LibrarySection, item: Record<string, unknown>, translation?: Readonly<Record<string, unknown>>): LibraryReference {
    const localizedItem = translation ? { ...item, ...translation } : item;
    const id = String(localizedItem['id']);
    const description = Array.isArray(localizedItem['description']) ? localizedItem['description'].join(' ') : typeof localizedItem['description'] === 'string' ? localizedItem['description'] : section === 'tms' ? `Move reference: ${String(localizedItem['moveId'])}` : 'Nincs leírás.';
    const tags = section === 'pokemon' ? [`#${String(localizedItem['number'])}`, ...((localizedItem['types'] as readonly string[] | undefined) ?? []), `SR ${String(localizedItem['sr'])}`] : section === 'moves' ? [String(localizedItem['type']), `${String(localizedItem['powerPoints'])} PP`, String(localizedItem['range'])] : section === 'items' ? [String(localizedItem['type']), localizedItem['cost'] ? `${String(localizedItem['cost'])} P` : 'Ár nélkül'] : section === 'tms' ? [`Move: ${String(localizedItem['moveId'])}`, `${String(localizedItem['cost'])} P`] : ['Képesség'];
    const fields = section === 'pokemon' ? [['Méret', localizedItem['size']], ['Páncél', localizedItem['armorClass']], ['Életerő', localizedItem['hitPoints']], ['Minimum szint', localizedItem['minimumLevel']]] : section === 'moves' ? [['Típus', localizedItem['type']], ['Idő', localizedItem['time']], ['Hatótáv', localizedItem['range']], ['PP', localizedItem['powerPoints']]] : section === 'items' ? [['Kategória', localizedItem['type']], ['Ár', localizedItem['cost']]] : section === 'tms' ? [['Kapcsolt Move', localizedItem['moveId']], ['Ár', localizedItem['cost']]] : [['Kategória', 'Képesség']];
    return { key: `${section}:${id}`, section, id, name: section === 'tms' ? `TM${id}` : String(localizedItem['name']), description, artworkPath: section === 'pokemon' ? `/assets/pokemon-artwork/${String(localizedItem['number'])}.png` : undefined, tags, detailRows: fields.filter(([, value]) => value != null).map(([label, value]) => ({ label: String(label), value: String(value) })) };
  }
}