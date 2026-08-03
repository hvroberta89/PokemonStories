import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dataDirectory = resolve('public', 'reference-data', 'poke5e');
const translationsPath = resolve(dataDirectory, 'translations', 'hu.json');

const [technicalMachines, translations] = await Promise.all([
  readJson(resolve(dataDirectory, 'technical-machines.json')),
  readJson(translationsPath),
]);
const translatedMoveNames = new Map(
  translations.items
    .filter((item) => item.dataset === 'moves' && typeof item.payload?.name === 'string')
    .map((item) => [item.recordId, item.payload.name]),
);
const missingMoveTranslations = technicalMachines.items.filter((item) => !translatedMoveNames.has(item.moveId));
if (missingMoveTranslations.length) {
  throw new Error(`Missing Hungarian Move translations for ${missingMoveTranslations.length} Technical Machines.`);
}

const nonTechnicalMachineTranslations = translations.items.filter((item) => item.dataset !== 'tms');
const technicalMachineTranslations = technicalMachines.items.map((item) => ({
  dataset: 'tms',
  recordId: String(item.id),
  payload: { moveName: translatedMoveNames.get(item.moveId) },
}));

await writeFile(
  translationsPath,
  `${JSON.stringify({ items: [...nonTechnicalMachineTranslations, ...technicalMachineTranslations] }, null, 2)}\n`,
  'utf8',
);
console.log(`Wrote ${technicalMachineTranslations.length} Hungarian Technical Machine translations.`);

async function readJson(path) {
  const document = JSON.parse(await readFile(path, 'utf8'));
  if (!Array.isArray(document.items)) throw new Error(`${path} does not contain an items array.`);
  return document;
}