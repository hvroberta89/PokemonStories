import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dataDirectory = resolve('public', 'reference-data', 'poke5e');
const outputPath = resolve(dataDirectory, 'translations', 'hu.json');
const separator = '\n[[PS_TRANSLATION_SEPARATOR]]\n';
const maximumBatchLength = 3000;
const isDryRun = process.argv.includes('--dry-run');
const overwriteExisting = process.argv.includes('--overwrite');
const datasets = [
  { dataset: 'pokemon', filename: 'pokemon.json', fields: ['name', 'types', 'size', 'description'] },
  { dataset: 'moves', filename: 'moves.json', fields: ['name', 'type', 'time', 'duration', 'range', 'description', 'higherLevels', 'optional'] },
  { dataset: 'abilities', filename: 'abilities.json', fields: ['name', 'description'] },
  { dataset: 'items', filename: 'items.json', fields: ['name', 'type', 'description'] },
  { dataset: 'origins', filename: 'origins.json', fields: ['name', 'description', 'abilityScores', 'proficiencies', 'feats', 'languages'] },
  { dataset: 'contest-effects', filename: 'contest-effects.json', fields: ['name', 'effect'] },
  { dataset: 'types', filename: 'types.json', fields: ['name'] },
  { dataset: 'rules', filename: 'rules.json', fields: ['name', 'category', 'description', 'details'] },
];

const sourceDatasets = await Promise.all(
  datasets.map(async (definition) => ({
    ...definition,
    items: (await readJson(resolve(dataDirectory, definition.filename))).items,
  })),
);
const sourceTexts = new Set();
const existingTranslations = await readTranslations(outputPath);

const existingTranslationsByKey = new Map(existingTranslations.map((item) => [`${item.dataset}:${item.recordId}`, item.payload]));
for (const { dataset, fields, items } of sourceDatasets) {
  for (const item of items) {
    const existingPayload = existingTranslationsByKey.get(`${dataset}:${String(item.id)}`);
    for (const field of fields) {
      if (overwriteExisting || existingPayload?.[field] == null) collectStrings(item[field], sourceTexts);
    }
  }
}

console.log(`Found ${sourceTexts.size} unique English strings to translate.`);
console.log(
  `Found ${existingTranslations.length} existing Hungarian records; ${overwriteExisting ? 'they will be replaced.' : 'they will be preserved.'}`,
);
if (isDryRun) process.exit(0);

const translations = new Map();
for (const batch of createBatches([...sourceTexts])) {
  const translated = await translateBatch(batch);
  if (translated.length !== batch.length) throw new Error('The translation service returned an incomplete batch.');
  for (let index = 0; index < batch.length; index += 1) translations.set(batch[index], translated[index]);
  console.log(`Translated ${translations.size}/${sourceTexts.size} strings.`);
}

const generatedItems = sourceDatasets.flatMap(({ dataset, fields, items: records }) =>
  records.map((record) => ({
    dataset,
    recordId: String(record.id),
    payload: Object.fromEntries(fields.map((field) => [field, translateValue(record[field], translations)])),
  })),
);
const items = mergeTranslations(existingTranslations, generatedItems, overwriteExisting);

await writeFile(outputPath, `${JSON.stringify({ items }, null, 2)}\n`, 'utf8');
console.log(`Wrote ${items.length} Hungarian reference translations to ${outputPath}.`);

function collectStrings(value, strings) {
  if (typeof value === 'string' && value) strings.add(value);
  if (Array.isArray(value)) value.forEach((item) => collectStrings(item, strings));
  if (value && typeof value === 'object') Object.values(value).forEach((item) => collectStrings(item, strings));
}

function translateValue(value, translations) {
  if (typeof value === 'string') return translations.get(value) ?? value;
  if (Array.isArray(value)) return value.map((item) => translateValue(item, translations));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translateValue(item, translations)]));
  return value;
}

function createBatches(strings) {
  const batches = [];
  let batch = [];
  let length = 0;
  for (const text of strings) {
    const nextLength = length + text.length + separator.length;
    if (batch.length && nextLength > maximumBatchLength) {
      batches.push(batch);
      batch = [];
      length = 0;
    }
    batch.push(text);
    length += text.length + separator.length;
  }
  if (batch.length) batches.push(batch);
  return batches;
}

async function translateBatch(texts) {
  const query = new URLSearchParams({
    client: 'gtx',
    sl: 'en',
    tl: 'hu',
    dt: 't',
    q: texts.join(separator),
  });
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?${query}`);
  if (!response.ok) throw new Error(`The translation service returned ${response.status}.`);
  const document = await response.json();
  const translated = document[0].map((part) => part[0]).join('');
  return translated.split(separator);
}

async function readJson(path) {
  const document = JSON.parse(await readFile(path, 'utf8'));
  if (!Array.isArray(document.items)) throw new Error(`${path} does not contain an items array.`);
  return document;
}

async function readTranslations(path) {
  try {
    return (await readJson(path)).items;
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

function mergeTranslations(existingItems, generatedItems, overwrite) {
  if (overwrite) return generatedItems;

  const generatedByKey = new Map(
    generatedItems.map((item) => [`${item.dataset}:${item.recordId}`, item]),
  );
  const mergedItems = existingItems.map((item) => {
    const generated = generatedByKey.get(`${item.dataset}:${item.recordId}`);
    if (!generated) return item;
    generatedByKey.delete(`${item.dataset}:${item.recordId}`);
    return { ...generated, payload: { ...generated.payload, ...item.payload } };
  });

  return [...mergedItems, ...generatedByKey.values()];
}