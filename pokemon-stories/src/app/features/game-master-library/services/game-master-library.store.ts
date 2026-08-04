import { computed, Injectable, signal } from '@angular/core';
import { LibraryDetailGroup, LibraryLocale, LibraryReference, LibrarySection } from '../models/library-reference.model';

interface ReferenceFile { readonly items: readonly Record<string, unknown>[]; }
interface EvolutionFile { readonly items: readonly EvolutionReference[]; }
interface EvolutionReference {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly conditions: readonly Record<string, unknown>[];
  readonly nonCanon: boolean;
}
interface ContestFile { readonly items: readonly ContestReference[]; }
interface ContestEffectsFile { readonly items: readonly ContestEffect[]; }
interface ContestReference { readonly id: string; readonly contest: string; readonly appeal: number; readonly jam: number; readonly effect: string; }
interface ContestEffect { readonly id: string; readonly name: string; readonly effect: string; }
interface ContestData { readonly byMove: ReadonlyMap<string, ContestReference>; readonly effects: ReadonlyMap<string, ContestEffect>; }
interface TranslationFile { readonly items: readonly ReferenceTranslation[]; }
interface ReferenceTranslation {
  readonly dataset: string;
  readonly recordId: string;
  readonly payload: Readonly<Record<string, unknown>>;
}
const sections: readonly LibrarySection[] = ['pokemon', 'moves', 'abilities', 'items', 'tms', 'origins', 'types', 'specializations', 'rules'];
const files: Record<LibrarySection, string> = { pokemon: 'pokemon.json', moves: 'moves.json', abilities: 'abilities.json', items: 'items.json', tms: 'technical-machines.json', origins: 'origins.json', types: 'types.json', specializations: 'specializations.json', rules: 'rules.json' };
const favoritesKey = 'pokemon-stories.library.favorites';
const recentKey = 'pokemon-stories.library.recent';
const localeKey = 'pokemon-stories.library.locale';
const habitatLabels: Readonly<Record<string, string>> = {
  abyss: 'mélység', badland: 'kopár vidék', beach: 'part', cave: 'barlang', city: 'város', desert: 'sivatag', field: 'mező', forest: 'erdő', glacier: 'gleccser', grassland: 'füves puszta', industrial: 'ipari terület', jungle: 'őserdő', lake: 'tó', mountain: 'hegyvidék', ocean: 'óceán', 'polar-sea': 'sarkvidéki tenger', pond: 'tó', reef: 'zátony', river: 'folyó', riverside: 'folyópart', ruin: 'rom', swamp: 'mocsár', tundra: 'tundra', volcano: 'vulkán', woodland: 'liget',
};
const evolutionValueLabels: Readonly<Record<string, string>> = {
  afternoon: 'délután', day: 'nappal', female: 'nőstény', male: 'hím', morning: 'reggel', night: 'éjjel', fairy: 'tündér',
};

@Injectable({ providedIn: 'root' })
export class GameMasterLibraryStore {
  private readonly entriesBySection = new Map<LibrarySection, readonly LibraryReference[]>();
  private translations: ReadonlyMap<string, Readonly<Record<string, unknown>>> | null = null;
  private evolutions: readonly EvolutionReference[] | null = null;
  private contestData: ContestData | null = null;
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
      const names = new Map(data.items.map((item) => [String(item['id']), String(translations.get(`${section}:${String(item['id'])}`)?.['name'] ?? item['name'])]));
      const evolutions = section === 'pokemon' ? await this.loadEvolutions() : [];
      const contestData = section === 'moves' ? await this.loadContestData() : null;
      const entries = data.items.map((item) => this.toReference(section, item, translations.get(`${section}:${String(item['id'])}`), evolutions.filter((evolution) => evolution.from === item['id']), names, contestData, translations));
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
  private async loadEvolutions(): Promise<readonly EvolutionReference[]> {
    if (this.evolutions) return this.evolutions;
    try {
      const response = await fetch('/reference-data/poke5e/evolution.json');
      if (!response.ok) return [];
      const data = await response.json() as EvolutionFile;
      this.evolutions = data.items;
    } catch {
      this.evolutions = [];
    }
    return this.evolutions;
  }
  private async loadContestData(): Promise<ContestData> {
    if (this.contestData) return this.contestData;
    try {
      const [contestResponse, effectsResponse] = await Promise.all([fetch('/reference-data/poke5e/contest.json'), fetch('/reference-data/poke5e/contest-effects.json')]);
      if (!contestResponse.ok || !effectsResponse.ok) throw new Error();
      const contest = await contestResponse.json() as ContestFile;
      const effects = await effectsResponse.json() as ContestEffectsFile;
      this.contestData = { byMove: new Map(contest.items.map((entry) => [entry.id, entry])), effects: new Map(effects.items.map((entry) => [entry.id, entry])) };
    } catch { this.contestData = { byMove: new Map(), effects: new Map() }; }
    return this.contestData;
  }
  private toReference(section: LibrarySection, item: Record<string, unknown>, translation?: Readonly<Record<string, unknown>>, evolutions: readonly EvolutionReference[] = [], names = new Map<string, string>(), contestData: ContestData | null = null, translations: ReadonlyMap<string, Readonly<Record<string, unknown>>> = new Map()): LibraryReference {
    const localizedItem = translation ? { ...item, ...translation } : item;
    const id = String(localizedItem['id']);
    const description = Array.isArray(localizedItem['description']) ? localizedItem['description'].join(' ') : typeof localizedItem['description'] === 'string' ? localizedItem['description'] : section === 'tms' ? `Move hivatkozás: ${String(localizedItem['moveName'] ?? localizedItem['moveId'])}` : section === 'types' ? 'A Pokémon típusa meghatározza a sebzéstípusokkal szembeni gyengeségeit, ellenállásait és immunitásait.' : section === 'specializations' ? this.specializationDescription() : 'Nincs leírás.';
    const tags = section === 'pokemon' ? [`#${String(localizedItem['number'])}`, ...((localizedItem['types'] as readonly string[] | undefined) ?? []), `SR ${String(localizedItem['sr'])}`] : section === 'moves' ? [String(localizedItem['type']), `${String(localizedItem['powerPoints'])} PP`, String(localizedItem['range'])] : section === 'items' ? [String(localizedItem['type']), localizedItem['cost'] ? `${String(localizedItem['cost'])} P` : 'Ár nélkül'] : section === 'tms' ? [`Move: ${String(localizedItem['moveName'] ?? localizedItem['moveId'])}`, `${String(localizedItem['cost'])} P`] : section === 'origins' ? ['Trainer Origin'] : section === 'types' ? ['Típusmátrix'] : section === 'specializations' ? [String(localizedItem['type']), 'Specialization'] : section === 'rules' ? [String(localizedItem['category'])] : ['Képesség'];
    const detailGroups = this.detailGroups(section, localizedItem, evolutions, names, contestData, translations);
    return { key: `${section}:${id}`, section, id, name: section === 'tms' ? `TM${id}` : String(localizedItem['name']), description, artworkPath: section === 'pokemon' ? `/assets/pokemon-artwork/${String(localizedItem['number'])}.png` : undefined, sourceUrl: typeof localizedItem['sourceUrl'] === 'string' ? localizedItem['sourceUrl'] : section === 'types' ? 'https://poke5e.app/reference/damage-types' : section === 'specializations' ? 'https://poke5e.app/reference/specializations' : undefined, tags, detailRows: detailGroups[0]?.rows ?? [], detailGroups };
  }
  private detailGroups(section: LibrarySection, item: Record<string, unknown>, evolutions: readonly EvolutionReference[], names: ReadonlyMap<string, string>, contestData: ContestData | null, translations: ReadonlyMap<string, Readonly<Record<string, unknown>>>): readonly LibraryDetailGroup[] {
    if (section === 'pokemon') return this.pokemonDetailGroups(item, evolutions, names);
    if (section === 'moves') return this.moveDetailGroups(item, contestData?.byMove.get(String(item['id'])), contestData?.effects, translations);
    if (section === 'items') return this.groups([['Adatok', [['Kategória', item['type']], ['Ár', item['cost'] ? `${String(item['cost'])} P` : 'Ár nélkül'], ['Béta tartalom', item['beta'] === true ? 'Igen' : 'Nem']]]]);
    if (section === 'tms') return this.groups([['Adatok', [['Kapcsolt Move', item['moveName'] ?? item['moveId']], ['Ár', `${String(item['cost'])} P`]]]]);
    if (section === 'origins') return this.originDetailGroups(item);
    if (section === 'types') return this.typeDetailGroups(item, names);
    if (section === 'specializations') return this.specializationDetailGroups(item);
    if (section === 'rules') return this.groups([['Szabályrészletek', (item['details'] as readonly Record<string, unknown>[] | undefined)?.map((detail) => [String(detail['label']), detail['value']] as const) ?? []]]);
    return this.groups([['Adatok', [['Kategória', 'Képesség']]]]);
  }
  private typeDetailGroups(item: Record<string, unknown>, names: ReadonlyMap<string, string>): readonly LibraryDetailGroup[] {
    const typeName = (value: unknown) => names.get(String(value)) ?? String(value);
    return this.groups([['Típuselőnyök', [['Sebezhető', this.listValues(item['vulnerableTo'], typeName)], ['Ellenáll', this.listValues(item['resistantTo'], typeName)], ['Immunis', this.listValues(item['immuneTo'], typeName)]]]]);
  }
  private specializationDetailGroups(item: Record<string, unknown>): readonly LibraryDetailGroup[] {
    const isHungarian = this.localeState() === 'hu';
    return this.groups([[
      isHungarian ? 'Specialization előnyei' : 'Specialization benefits',
      [
        [isHungarian ? 'Trainer előny' : 'Trainer benefit', item['trainerBenefit']],
        [isHungarian ? 'Pokémon előny' : 'Pokémon benefit', isHungarian ? 'Az ilyen típusú Pokémonok minden képességpróbájára +1 bónuszt kapnak.' : 'Pokémon of this type gain a +1 bonus to all skill checks.'],
        [isHungarian ? 'Választás' : 'Selection', isHungarian ? 'Az 1., 7. és 18. szinten választható; ismételt választással a képességpróba-bónusz további +1-gyel nő, és az előnyöket újra megkapod.' : 'Choose at levels 1, 7, and 18; choosing it again adds another +1 to skill checks and grants its benefits again.'],
      ],
    ]]);
  }
  private specializationDescription(): string {
    return this.localeState() === 'hu'
      ? 'A Specialization a Trainer fejlődését és egy választott Pokémon-típus képességpróbáit erősíti.'
      : 'A Specialization strengthens a Trainer and the skill checks of one chosen Pokémon type.';
  }
  private originDetailGroups(item: Record<string, unknown>): readonly LibraryDetailGroup[] {
    const abilityScores = item['abilityScores'] as Record<string, unknown> | undefined;
    const proficiencies = item['proficiencies'] as Record<string, unknown> | undefined;
    const feats = item['feats'] as Record<string, unknown> | undefined;
    const languages = item['languages'] as Record<string, unknown> | undefined;
    return this.groups([
      ['Előnyök', [['Attribútumválasztás', this.listValues(abilityScores?.['values'])], ['Jártasság', this.listValues(proficiencies?.['values'])], ['Nyelvek', this.listValues(languages?.['values'])]]],
      ['Különleges képesség', [['Név', feats?.['name']], ['Hatás', feats?.['effect']]]],
      ['Háttértörténet', [['Életmód', abilityScores?.['description']], ['Jártasság leírása', proficiencies?.['description']]]],
    ]);
  }
  private pokemonDetailGroups(item: Record<string, unknown>, evolutions: readonly EvolutionReference[], names: ReadonlyMap<string, string>): readonly LibraryDetailGroup[] {
    const attributes = item['attributes'] as Record<string, unknown> | undefined;
    const moves = item['moves'] as Record<string, readonly unknown[]> | undefined;
    const habitat = item['habitat'] as Record<string, unknown> | undefined;
    const abilities = (item['abilities'] as readonly Record<string, unknown>[] | undefined)?.map((ability) => `${String(ability['id'])}${ability['hidden'] === true ? ' (rejtett)' : ''}`).join(', ');
    const moveRows = Object.entries(moves ?? {}).map(([level, references]) => [this.moveGroupLabel(level), references.map(String).join(', ')] as const);
    return this.groups([
      ['Alapértékek', [['Méret', item['size']], ['Páncél', item['armorClass']], ['Életerő', item['hitPoints']], ['Életerő kocka', item['hitDie']], ['SR', item['sr']], ['Minimum szint', item['minimumLevel']]]],
      ['Attribútumok', [['Erő', attributes?.['str']], ['Ügyesség', attributes?.['dex']], ['Állóképesség', attributes?.['con']], ['Intelligencia', attributes?.['int']], ['Bölcsesség', attributes?.['wis']], ['Karizma', attributes?.['cha']]]],
      ['Jártasságok', [['Mozgás', this.listValues(item['speeds'], (speed) => `${String((speed as Record<string, unknown>)['type'])} ${String((speed as Record<string, unknown>)['value'])} ft`)], ['Képzettségek', this.listValues(item['skills'])], ['Mentődobások', this.listValues(item['savingThrows'])], ['Érzékek', this.listValues(item['senses'])]]],
      ['Képességek', [['Képességek', abilities]]],
      ['Élőhely', [['Biómok', this.listValues(habitat?.['biomes'], (biome) => habitatLabels[String(biome)] ?? String(biome))], ['Őshonos régió', habitat?.['nativeRegion']], ['Régiók', this.listValues(habitat?.['regions'])]]],
      ['Evolúciók', evolutions.map((evolution) => ['Fejlődik', `${names.get(evolution.to) ?? evolution.to}: ${this.evolutionConditions(evolution.conditions)}${evolution.nonCanon ? ' (nem kanonikus)' : ''}`] as const)],
      ['Megtanulható Move-ok', moveRows],
    ]);
  }
  private moveDetailGroups(item: Record<string, unknown>, contest: ContestReference | undefined, contestEffects: ReadonlyMap<string, ContestEffect> | undefined, translations: ReadonlyMap<string, Readonly<Record<string, unknown>>>): readonly LibraryDetailGroup[] {
    const attack = item['attack'] as Record<string, unknown> | null;
    const save = item['save'] as Record<string, unknown> | null;
    const damage = item['damage'] as Record<string, unknown> | null;
    const dice = damage?.['dice'] as Record<string, unknown> | undefined;
    const effect = contest ? contestEffects?.get(contest.effect) : undefined;
    const effectTranslation = effect ? translations.get(`contest-effects:${effect.id}`) : undefined;
    return this.groups([
      ['Alapadatok', [['Típus', item['type']], ['Használt attribútumok', this.listValues(item['power'])], ['Idő', item['time']], ['Időtartam', item['duration']], ['Hatótáv', item['range']], ['PP', item['powerPoints']]]],
      ['Próba és sebzés', [['Támadás típusa', attack?.['scope']], ['Mentődobás', save ? `${this.listValues(save['attribute'])} (DC: ${String(save['dc'])})` : null], ['Sebzés', dice ? Object.entries(dice).map(([level, value]) => `${level}. szint: ${String(value)}`).join(', ') : null], ['Sebzés típusa', this.listValues(damage?.['type'])], ['Sebzés módosító', damage?.['modifier']]]],
      ['További szabályok', [['Magasabb szinteken', item['higherLevels']], ['Technikai gép', item['technicalMachine'] ? `TM${String((item['technicalMachine'] as Record<string, unknown>)['id'])}` : null], ['Választható', this.listValues(item['optional'])], ['Béta tartalom', item['beta'] === true ? 'Igen' : 'Nem']]],
      ['Contest', [['Kategória', contest ? this.contestCategory(contest.contest) : null], ['Appeal', contest?.appeal], ['Jam', contest?.jam], ['Effektus', effectTranslation?.['name'] ?? effect?.name], ['Szabály', effectTranslation?.['effect'] ?? effect?.effect]]],
    ]);
  }
  private groups(groups: readonly [string, readonly (readonly [string, unknown])[]][]): readonly LibraryDetailGroup[] {
    return groups.map(([title, rows]) => ({ title, rows: rows.filter(([, value]) => value != null && value !== '').map(([label, value]) => ({ label, value: String(value) })) })).filter((group) => group.rows.length > 0);
  }
  private listValues(value: unknown, formatter: (value: unknown) => string = (item) => String(item)): string | null {
    return Array.isArray(value) && value.length ? value.map(formatter).join(', ') : null;
  }
  private moveGroupLabel(group: string): string {
    if (group === 'start') return 'Kezdő';
    if (group === 'tm') return 'TM';
    if (group === 'egg') return 'Tojás Move-ok';
    const level = group.match(/^level(\d+)$/)?.[1];
    return level ? `${level}. szint` : group;
  }
  private evolutionConditions(conditions: readonly Record<string, unknown>[]): string {
    return conditions.map((condition) => {
      const type = String(condition['type']);
      const rawValue = String(condition['value']);
      const value = evolutionValueLabels[rawValue] ?? rawValue;
      switch (type) {
        case 'level': return `${value}. szint`;
        case 'item': return `tárgy: ${value}`;
        case 'move': return `ismeri: ${value}`;
        case 'move-type': return `Move-típus: ${value}`;
        case 'loyalty': return `hűség: ${value}`;
        case 'time': return `időpont: ${value}`;
        case 'gender': return `nem: ${value}`;
        default: return value;
      }
    }).join(', ');
  }
  private contestCategory(category: string): string {
    return ({ beauty: 'Szépség', clever: 'Ügyesség', cool: 'Menőség', cute: 'Aranyosság', tough: 'Keménység' } as Record<string, string>)[category] ?? category;
  }
}