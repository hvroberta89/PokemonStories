import { GameMasterLibraryStore } from './game-master-library.store';

const localeKey = 'pokemon-stories.library.locale';

describe('GameMasterLibraryStore', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('overlays Hungarian Pokémon fields while retaining untranslated source fields', async () => {
    localStorage.setItem(localeKey, 'hu');
    mockReferenceFetch({
      '/reference-data/poke5e/pokemon.json': {
        items: [{
          id: 'bulbasaur', name: 'Bulbasaur', number: 1, types: ['grass'], sr: 1, description: 'Seed Pokemon.',
          size: 'small', armorClass: 12, hitPoints: 7, hitDie: '2d6', minimumLevel: 1,
          attributes: { str: 10, dex: 12, con: 11, int: 8, wis: 10, cha: 10 }, speeds: [], skills: [], savingThrows: [], senses: [], abilities: [], moves: {},
          habitat: { biomes: ['forest'], nativeRegion: 'Kanto', regions: ['Kanto'] },
        }],
      },
      '/reference-data/poke5e/translations/hu.json': {
        items: [{ dataset: 'pokemon', recordId: 'bulbasaur', payload: { types: ['fű'], description: 'Mag Pokémon.' } }],
      },
      '/reference-data/poke5e/evolution.json': { items: [] },
    });

    const entry = (await new GameMasterLibraryStore().entries('pokemon'))[0];

    expect(entry?.name).toBe('Bulbasaur');
    expect(entry?.description).toBe('Mag Pokémon.');
    expect(entry?.tags).toContain('fű');
    expect(entry?.detailGroups.find((group) => group.title === 'Élőhely')?.rows).toContainEqual({ label: 'Biómok', value: 'erdő' });
  });

  it('renders localized evolution conditions for a Pokémon', async () => {
    localStorage.setItem(localeKey, 'hu');
    mockReferenceFetch({
      '/reference-data/poke5e/pokemon.json': {
        items: [pokemon('eevee', 'Eevee'), pokemon('sylveon', 'Sylveon')],
      },
      '/reference-data/poke5e/translations/hu.json': { items: [] },
      '/reference-data/poke5e/evolution.json': {
        items: [{ id: 'eevee-to-sylveon', from: 'eevee', to: 'sylveon', nonCanon: false, conditions: [{ type: 'time', value: 'night' }, { type: 'move-type', value: 'fairy' }] }],
      },
    });

    const entry = await new GameMasterLibraryStore().find('pokemon', 'eevee');

    expect(entry?.detailGroups.find((group) => group.title === 'Evolúciók')?.rows).toContainEqual({ label: 'Fejlődik', value: 'Sylveon: időpont: éjjel, Move-típus: tündér' });
  });

  it('exposes Trainer Origin benefits and special ability details', async () => {
    localStorage.setItem(localeKey, 'en');
    mockReferenceFetch({
      '/reference-data/poke5e/origins.json': {
        items: [{
          id: 'alolan', name: 'Alolan', description: 'A tropical home.',
          abilityScores: { values: ['int', 'cha'], description: 'Spiritually rooted.' },
          proficiencies: { values: ['nature'], description: 'Island wilderness.' },
          feats: { name: 'A Different Bond', effect: 'Cast Speak with Pokemon once per long rest.' },
          languages: { values: ['Common', 'Alolan'] },
        }],
      },
    });

    const entry = (await new GameMasterLibraryStore().entries('origins'))[0];

    expect(entry?.tags).toEqual(['Trainer Origin']);
    expect(entry?.detailGroups.find((group) => group.title === 'Előnyök')?.rows).toContainEqual({ label: 'Nyelvek', value: 'Common, Alolan' });
    expect(entry?.detailGroups.find((group) => group.title === 'Különleges képesség')?.rows).toContainEqual({ label: 'Név', value: 'A Different Bond' });
  });

  it('shows Hungarian Contest mechanics on a Move detail', async () => {
    localStorage.setItem(localeKey, 'hu');
    mockReferenceFetch({
      '/reference-data/poke5e/moves.json': { items: [{ id: 'tackle', name: 'Tackle', type: 'normal', powerPoints: 10, time: 'action', duration: 'instant', range: 'melee', power: [], description: '', attack: null, save: null, damage: null, higherLevels: null, optional: [], beta: false, technicalMachine: null }] },
      '/reference-data/poke5e/translations/hu.json': { items: [{ dataset: 'contest-effects', recordId: '23', payload: { name: 'Látványos támadás', effect: 'Magyar szabályleírás.' } }] },
      '/reference-data/poke5e/contest.json': { items: [{ id: 'tackle', contest: 'tough', appeal: 4, jam: 0, effect: '23' }] },
      '/reference-data/poke5e/contest-effects.json': { items: [{ id: '23', name: 'Huge appeal', effect: 'English rule.' }] },
    });

    const entry = await new GameMasterLibraryStore().find('moves', 'tackle');
    const contestRows = entry?.detailGroups.find((group) => group.title === 'Contest')?.rows;

    expect(contestRows).toContainEqual({ label: 'Kategória', value: 'Keménység' });
    expect(contestRows).toContainEqual({ label: 'Effektus', value: 'Látványos támadás' });
    expect(contestRows).toContainEqual({ label: 'Szabály', value: 'Magyar szabályleírás.' });
  });
});

function pokemon(id: string, name: string): Record<string, unknown> {
  return {
    id, name, number: 1, types: ['normal'], sr: 1, description: '', size: 'small', armorClass: 10, hitPoints: 10, hitDie: '2d6', minimumLevel: 1,
    attributes: {}, speeds: [], skills: [], savingThrows: [], senses: [], abilities: [], moves: {}, habitat: { biomes: [], nativeRegion: null, regions: [] },
  };
}

function mockReferenceFetch(documents: Readonly<Record<string, unknown>>): void {
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const document = documents[String(input)];
    if (!document) return new Response(null, { status: 404 });
    return new Response(JSON.stringify(document), { status: 200 });
  });
}
