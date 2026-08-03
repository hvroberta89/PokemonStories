import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dataDirectory = resolve('public', 'reference-data', 'poke5e');
const outputPath = resolve(dataDirectory, 'translations', 'hu.json');
const separator = '\n[[PS_TRANSLATION_SEPARATOR]]\n';
const maximumBatchLength = 3000;
const isDryRun = process.argv.includes('--dry-run');
const datasets = [
  { dataset: 'pokemon', filename: 'pokemon.json', fields: ['name', 'types', 'size', 'description'] },
  { dataset: 'moves', filename: 'moves.json', fields: ['name', 'type', 'time', 'duration', 'range', 'description', 'higherLevels', 'optional'] },
  { dataset: 'abilities', filename: 'abilities.json', fields: ['name', 'description'] },
  { dataset: 'items', filename: 'items.json', fields: ['name', 'type', 'description'] },
];

const sourceDatasets = await Promise.all(
  datasets.map(async (definition) => ({
    ...definition,
    items: (await readJson(resolve(dataDirectory, definition.filename))).items,
  })),
);
const sourceTexts = new Set();

for (const { fields, items } of sourceDatasets) {
  for (const item of items) {
    for (const field of fields) collectStrings(item[field], sourceTexts);
  }
}

console.log(`Found ${sourceTexts.size} unique English strings to translate.`);
if (isDryRun) process.exit(0);

const translations = new Map();
for (const batch of createBatches([...sourceTexts])) {
  const translated = await translateBatch(batch);
  if (translated.length !== batch.length) throw new Error('The translation service returned an incomplete batch.');
  for (let index = 0; index < batch.length; index += 1) translations.set(batch[index], translated[index]);
  console.log(`Translated ${translations.size}/${sourceTexts.size} strings.`);
}

const items = sourceDatasets.flatMap(({ dataset, fields, items: records }) =>
  records.map((record) => ({
    dataset,
    recordId: String(record.id),
    payload: Object.fromEntries(fields.map((field) => [field, translateValue(record[field], translations)])),
  })),
);

await writeFile(outputPath, `${JSON.stringify({ items }, null, 2)}\n`, 'utf8');
console.log(`Wrote ${items.length} Hungarian reference translations to ${outputPath}.`);

function collectStrings(value, strings) {
  if (typeof value === 'string' && value) strings.add(value);
  if (Array.isArray(value)) value.forEach((item) => collectStrings(item, strings));
}

function translateValue(value, translations) {
  if (typeof value === 'string') return translations.get(value) ?? value;
  if (Array.isArray(value)) return value.map((item) => translateValue(item, translations));
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