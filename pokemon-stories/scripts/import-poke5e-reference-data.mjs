import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const SOURCE_NAME = 'Poke5e';
const SOURCE_URL = 'https://poke5e.app/';
const OUTPUT_SCHEMA_VERSION = 1;

const sourceRootArgument = process.argv[2];

if (!sourceRootArgument) {
  fail('Missing Poke5e source directory. Usage: npm run data:import:poke5e -- <path-to-poke5e>');
}

const sourceRoot = resolve(sourceRootArgument);
const sourceDataDirectory = resolve(sourceRoot, 'static', 'data');
const outputDirectory = resolve('public', 'reference-data', 'poke5e');

const [packageJson, pokemonSource, movesSource, abilitiesSource, itemsSource] = await Promise.all([
  readJson(resolve(sourceRoot, 'package.json')),
  readFile(resolve(sourceDataDirectory, 'pokemon.json'), 'utf8'),
  readFile(resolve(sourceDataDirectory, 'moves.json'), 'utf8'),
  readFile(resolve(sourceDataDirectory, 'abilities.json'), 'utf8'),
  readFile(resolve(sourceDataDirectory, 'items.json'), 'utf8'),
]);
const pokemonDocument = parseJson(pokemonSource, 'pokemon.json');
const movesDocument = parseJson(movesSource, 'moves.json');
const abilitiesDocument = parseJson(abilitiesSource, 'abilities.json');
const itemsDocument = parseJson(itemsSource, 'items.json');

if (!packageJson.version || typeof packageJson.version !== 'string') {
  fail('The Poke5e package version is missing or invalid.');
}
if (!Array.isArray(pokemonDocument.items)) {
  fail('Expected static/data/pokemon.json to contain an items array.');
}
if (!Array.isArray(movesDocument.moves)) {
  fail('Expected static/data/moves.json to contain a moves array.');
}
if (!Array.isArray(abilitiesDocument.items)) {
  fail('Expected static/data/abilities.json to contain an items array.');
}
if (!Array.isArray(itemsDocument.items)) {
  fail('Expected static/data/items.json to contain an items array.');
}

const moves = movesDocument.moves.map(normalizeMove);
const technicalMachines = moves
  .filter((move) => move.technicalMachine !== null)
  .map(normalizeTechnicalMachine);
const sourceAbilities = abilitiesDocument.items;
const abilities = sourceAbilities.filter((entry) => !entry.deprecated).map(normalizeAbility);
const items = itemsDocument.items.map(normalizeItem);
validateUniqueIds(moves, 'Move');
validateUniqueIds(abilities, 'Ability');
validateUniqueIds(items, 'Item');
validateUniqueIds(technicalMachines, 'Technical Machine');

const moveIds = new Set(moves.map((entry) => entry.id));
const abilityIds = new Set(abilities.map((entry) => entry.id));
const technicalMachineIds = new Set(technicalMachines.map((entry) => entry.id));
const unresolvedMoveReferences = [];
const unresolvedTechnicalMachineReferences = [];
const sourcePokemon = pokemonDocument.items;
const pokemon = sourcePokemon
  .filter((entry) => entry?.number !== 0)
  .map((entry, index) =>
    normalizePokemon(
      entry,
      index,
      moveIds,
      abilityIds,
      technicalMachineIds,
      unresolvedMoveReferences,
      unresolvedTechnicalMachineReferences,
    ),
  );
validateUniqueIds(pokemon, 'Pokémon');

const serializedPokemon = serialize({ items: pokemon });
const serializedMoves = serialize({ items: moves });
const serializedAbilities = serialize({ items: abilities });
const serializedItems = serialize({ items });
const serializedTechnicalMachines = serialize({ items: technicalMachines });
const manifest = {
  schemaVersion: OUTPUT_SCHEMA_VERSION,
  source: {
    name: SOURCE_NAME,
    url: SOURCE_URL,
    version: packageJson.version,
    commit: await readGitCommit(sourceRoot),
    usage: 'Non-commercial fan use only',
  },
  importedAt: new Date().toISOString(),
  datasets: {
    pokemon: {
      ...createDatasetManifest('pokemon.json', pokemon, pokemonSource, serializedPokemon),
      excludedRecords: sourcePokemon.length - pokemon.length,
    },
    moves: createDatasetManifest('moves.json', moves, movesSource, serializedMoves),
    abilities: {
      ...createDatasetManifest('abilities.json', abilities, abilitiesSource, serializedAbilities),
      excludedRecords: sourceAbilities.length - abilities.length,
    },
    items: createDatasetManifest('items.json', items, itemsSource, serializedItems),
    technicalMachines: createDerivedDatasetManifest(
      'technical-machines.json',
      technicalMachines,
      serializedTechnicalMachines,
      'moves',
    ),
  },
  validation: {
    unresolvedMoveReferences,
    unresolvedTechnicalMachineReferences,
  },
};

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(resolve(outputDirectory, 'pokemon.json'), serializedPokemon, 'utf8'),
  writeFile(resolve(outputDirectory, 'moves.json'), serializedMoves, 'utf8'),
  writeFile(resolve(outputDirectory, 'abilities.json'), serializedAbilities, 'utf8'),
  writeFile(resolve(outputDirectory, 'items.json'), serializedItems, 'utf8'),
  writeFile(
    resolve(outputDirectory, 'technical-machines.json'),
    serializedTechnicalMachines,
    'utf8',
  ),
  writeFile(resolve(outputDirectory, 'manifest.json'), serialize(manifest), 'utf8'),
]);

console.log(
  `Imported ${pokemon.length} Pokémon, ${moves.length} moves, ${abilities.length} abilities, ${items.length} items and ${technicalMachines.length} TMs from ${SOURCE_NAME} v${packageJson.version}.`,
);

function normalizePokemon(
  value,
  index,
  moveIds,
  abilityIds,
  technicalMachineIds,
  unresolvedMoveReferences,
  unresolvedTechnicalMachineReferences,
) {
  validateNamedReference(value, index, 'Pokémon');

  for (const field of ['size', 'hitDice', 'description']) {
    requireNonEmptyString(value[field], value.id, field);
  }
  for (const field of ['number', 'sr', 'minLevel', 'ac', 'hp']) {
    if (typeof value[field] !== 'number' || !Number.isFinite(value[field])) {
      fail(`Pokémon ${value.id} has an invalid ${field}.`);
    }
  }

  return {
    id: value.id,
    name: value.name,
    number: value.number,
    types: requireStringArray(value.type, value.id, 'type'),
    size: value.size,
    sr: value.sr,
    minimumLevel: value.minLevel,
    description: value.description,
    armorClass: value.ac,
    hitPoints: value.hp,
    hitDie: value.hitDice,
    attributes: requireObject(value.attributes, value.id, 'attributes'),
    speeds: requireArray(value.speed, value.id, 'speed'),
    skills: requireStringArray(value.skills, value.id, 'skills'),
    savingThrows: requireStringArray(value.savingThrows, value.id, 'savingThrows'),
    senses: requireArray(value.senses, value.id, 'senses'),
    abilities: normalizePokemonAbilities(value.abilities, value.id, abilityIds),
    moves: normalizePokemonMoves(
      value.moves,
      value.id,
      moveIds,
      technicalMachineIds,
      unresolvedMoveReferences,
      unresolvedTechnicalMachineReferences,
    ),
    habitat: {
      biomes: requireStringArray(value.habitat?.biomes, value.id, 'habitat.biomes'),
      nativeRegion:
        typeof value.habitat?.nativeRegion === 'string' ? value.habitat.nativeRegion : null,
      regions: requireStringArray(value.habitat?.regions, value.id, 'habitat.regions'),
    },
  };
}

function normalizeTechnicalMachine(move) {
  const technicalMachine = requireObject(move.technicalMachine, move.id, 'technicalMachine');
  if (!Number.isInteger(technicalMachine.id) || technicalMachine.id <= 0) {
    fail(`Move ${move.id} has an invalid technical machine id.`);
  }
  if (typeof technicalMachine.cost !== 'number' || technicalMachine.cost < 0) {
    fail(`Move ${move.id} has an invalid technical machine cost.`);
  }

  return {
    id: technicalMachine.id,
    moveId: move.id,
    cost: technicalMachine.cost,
  };
}

function normalizeItem(value, index) {
  validateNamedReference(value, index, 'Item');
  requireNonEmptyString(value.type, value.id, 'type');
  if (value.cost !== null && (typeof value.cost !== 'number' || value.cost < 0)) {
    fail(`Item ${value.id} has an invalid cost.`);
  }

  return {
    id: value.id,
    name: value.name,
    type: value.type,
    cost: value.cost,
    description: Array.isArray(value.description) ? value.description : [],
    beta: value.beta === true,
  };
}

function normalizeMove(value, index) {
  validateNamedReference(value, index, 'Move');
  for (const field of ['type', 'time', 'duration', 'range']) {
    requireNonEmptyString(value[field], value.id, field);
  }
  if (typeof value.pp !== 'number' || !Number.isFinite(value.pp)) {
    fail(`Move ${value.id} has invalid pp.`);
  }

  return {
    id: value.id,
    name: value.name,
    type: value.type,
    power: value.power,
    time: value.time,
    powerPoints: value.pp,
    duration: value.duration,
    range: value.range,
    description: requireArray(value.description, value.id, 'description'),
    higherLevels: typeof value.higherLevels === 'string' ? value.higherLevels : null,
    optional: Array.isArray(value.optional) ? value.optional : null,
    attack: value.attack ?? null,
    save: value.save ?? null,
    damage: value.damage ?? null,
    technicalMachine: value.tm ?? null,
    beta: value.beta === true,
  };
}

function normalizeAbility(value, index) {
  validateNamedReference(value, index, 'Ability');
  requireNonEmptyString(value.description, value.id, 'description');
  return { id: value.id, name: value.name, description: value.description };
}

function normalizePokemonAbilities(value, pokemonId, abilityIds) {
  const abilities = requireArray(value, pokemonId, 'abilities');
  for (const ability of abilities) {
    if (!ability || typeof ability.id !== 'string' || !abilityIds.has(ability.id)) {
      fail(`Pokémon ${pokemonId} references an unknown ability.`);
    }
  }
  return abilities;
}

function normalizePokemonMoves(
  value,
  pokemonId,
  moveIds,
  technicalMachineIds,
  unresolvedMoveReferences,
  unresolvedTechnicalMachineReferences,
) {
  const moveGroups = requireObject(value, pokemonId, 'moves');
  const normalized = {};

  for (const [group, references] of Object.entries(moveGroups)) {
    if (group === 'tm') {
      normalized[group] = requireArray(references, pokemonId, `moves.${group}`).filter(
        (technicalMachineId) => {
          if (Number.isInteger(technicalMachineId) && technicalMachineIds.has(technicalMachineId)) {
            return true;
          }
          unresolvedTechnicalMachineReferences.push({ pokemonId, technicalMachineId });
          return false;
        },
      );
      continue;
    }

    normalized[group] = requireStringArray(references, pokemonId, `moves.${group}`).filter(
      (moveId) => {
        if (moveIds.has(moveId)) {
          return true;
        }
        unresolvedMoveReferences.push({ pokemonId, group, moveId });
        return false;
      },
    );
  }
  return normalized;
}

function validateNamedReference(value, index, entityName) {
  if (!value || typeof value !== 'object') {
    fail(`Invalid ${entityName} record at index ${index}.`);
  }
  requireNonEmptyString(value.id, index, 'id');
  requireNonEmptyString(value.name, value.id, 'name');
}

function requireNonEmptyString(value, entityId, field) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail(`Record ${entityId} has an invalid ${field}.`);
  }
  return value;
}

function requireArray(value, entityId, field) {
  if (!Array.isArray(value)) {
    fail(`Record ${entityId} has an invalid ${field}.`);
  }
  return value;
}

function requireStringArray(value, entityId, field) {
  const items = requireArray(value, entityId, field);
  if (items.some((item) => typeof item !== 'string')) {
    fail(`Record ${entityId} has an invalid ${field}.`);
  }
  return items;
}

function requireObject(value, entityId, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`Record ${entityId} has an invalid ${field}.`);
  }
  return value;
}

function validateUniqueIds(entries, entityName) {
  const ids = new Set();
  for (const entry of entries) {
    if (ids.has(entry.id)) {
      fail(`Duplicate ${entityName} id: ${entry.id}.`);
    }
    ids.add(entry.id);
  }
}

function createDatasetManifest(path, entries, source, serialized) {
  return {
    path,
    records: entries.length,
    sourceSha256: createHash('sha256').update(source).digest('hex'),
    sha256: createHash('sha256').update(serialized).digest('hex'),
  };
}

function createDerivedDatasetManifest(path, entries, serialized, derivedFrom) {
  return {
    path,
    records: entries.length,
    derivedFrom,
    sha256: createHash('sha256').update(serialized).digest('hex'),
  };
}

function serialize(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function parseJson(source, filename) {
  try {
    return JSON.parse(source);
  } catch (error) {
    fail(`Could not parse ${filename}: ${error.message}`);
  }
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    fail(`Could not read ${path}: ${error.message}`);
  }
}

async function readGitCommit(repositoryRoot) {
  try {
    const head = (await readFile(resolve(repositoryRoot, '.git', 'HEAD'), 'utf8')).trim();
    if (!head.startsWith('ref: ')) {
      return head;
    }
    return (await readFile(resolve(repositoryRoot, '.git', head.slice(5)), 'utf8')).trim();
  } catch {
    return null;
  }
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
  throw new Error(message);
}
