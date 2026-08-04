import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { createClient } from '@supabase/supabase-js';

const REQUIRED_DATASETS = [
  ['pokemon', 'pokemon.json'],
  ['moves', 'moves.json'],
  ['abilities', 'abilities.json'],
  ['items', 'items.json'],
  ['technical-machines', 'technical-machines.json'],
  ['origins', 'origins.json'],
  ['contest', 'contest.json'],
  ['contest-effects', 'contest-effects.json'],
  ['types', 'types.json'],
  ['specializations', 'specializations.json'],
  ['rules', 'rules.json'],
];
const TRANSLATION_LOCALES = ['hu'];
const BATCH_SIZE = 250;
const dataDirectory = resolve('public', 'reference-data', 'poke5e');
const isDryRun = process.argv.includes('--dry-run');

const manifest = await readJson(resolve(dataDirectory, 'manifest.json'));
validateManifest(manifest);
const datasets = await Promise.all(
  REQUIRED_DATASETS.map(async ([dataset, filename]) => {
    const document = await readJson(resolve(dataDirectory, filename));
    if (!Array.isArray(document.items)) fail(`${filename} does not contain an items array.`);
    return { dataset, records: document.items };
  }),
);
const translations = await Promise.all(
  TRANSLATION_LOCALES.map(async (locale) => ({
    locale,
    document: await readJson(resolve(dataDirectory, 'translations', `${locale}.json`)),
  })),
);
for (const { locale, document } of translations) {
  if (!Array.isArray(document.items)) fail(`${locale}.json does not contain an items array.`);
  for (const item of document.items) validateTranslation(item, locale);
}

if (isDryRun) {
  for (const { dataset, records } of datasets) {
    console.log(`Validated ${records.length} ${dataset} records.`);
  }
  console.log(`Poke5e ${manifest.source.version} snapshot is ready to migrate.`);
  for (const { locale, document } of translations) console.log(`Validated ${document.items.length} ${locale} translations.`);
  process.exit(0);
}

const supabaseUrl = requiredEnvironment('SUPABASE_URL');
const serviceRoleKey = requiredEnvironment('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
const importId = randomUUID();

const { error: importError } = await supabase.from('poke5e_reference_imports').insert({
  id: importId,
  source_name: manifest.source.name,
  source_url: manifest.source.url,
  source_version: manifest.source.version,
  source_commit: manifest.source.commit,
  schema_version: manifest.schemaVersion,
  manifest,
  imported_at: manifest.importedAt,
});
if (importError) fail(`Could not create Poke5e import record: ${importError.message}`);

try {
  for (const { dataset, records: sourceRecords } of datasets) {
    const records = sourceRecords.map((item) => ({
      dataset,
      record_id: String(item.id),
      payload: item,
      source_import_id: importId,
      updated_at: new Date().toISOString(),
    }));
    await upsertInBatches(records);

    const { error: cleanupError } = await supabase
      .from('poke5e_reference_records')
      .delete()
      .eq('dataset', dataset)
      .neq('source_import_id', importId);
    if (cleanupError) fail(`Could not remove stale ${dataset} records: ${cleanupError.message}`);
    console.log(`Migrated ${records.length} ${dataset} records.`);
  }
  for (const { locale, document } of translations) {
    const records = document.items.map((item) => ({
      dataset: item.dataset === 'tms' ? 'technical-machines' : item.dataset,
      record_id: String(item.recordId),
      locale,
      payload: item.payload,
      source_import_id: importId,
      updated_at: new Date().toISOString(),
    }));
    await upsertTranslationsInBatches(records);
    const { error: cleanupError } = await supabase
      .from('poke5e_reference_translations')
      .delete()
      .eq('locale', locale)
      .neq('source_import_id', importId);
    if (cleanupError) fail(`Could not remove stale ${locale} translations: ${cleanupError.message}`);
    console.log(`Migrated ${records.length} ${locale} translations.`);
  }
} catch (error) {
  await supabase.from('poke5e_reference_imports').delete().eq('id', importId);
  throw error;
}

console.log(`Poke5e ${manifest.source.version} migrated with import id ${importId}.`);

async function upsertInBatches(records) {
  for (let start = 0; start < records.length; start += BATCH_SIZE) {
    const { error } = await supabase
      .from('poke5e_reference_records')
      .upsert(records.slice(start, start + BATCH_SIZE), { onConflict: 'dataset,record_id' });
    if (error) fail(`Could not write Poke5e records: ${error.message}`);
  }
}

async function upsertTranslationsInBatches(records) {
  for (let start = 0; start < records.length; start += BATCH_SIZE) {
    const { error } = await supabase
      .from('poke5e_reference_translations')
      .upsert(records.slice(start, start + BATCH_SIZE), { onConflict: 'dataset,record_id,locale' });
    if (error) fail(`Could not write reference translations: ${error.message}`);
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

function validateManifest(manifest) {
  if (
    !manifest ||
    typeof manifest !== 'object' ||
    typeof manifest.schemaVersion !== 'number' ||
    !manifest.source ||
    typeof manifest.source.version !== 'string'
  ) {
    fail('The local Poke5e manifest is invalid. Run the snapshot importer first.');
  }
}

function validateTranslation(item, locale) {
  const datasets = new Set(['pokemon', 'moves', 'abilities', 'items', 'tms', 'origins', 'contest-effects', 'types', 'specializations', 'rules']);
  if (
    !item ||
    typeof item !== 'object' ||
    !datasets.has(item.dataset) ||
    typeof item.recordId !== 'string' ||
    !item.recordId ||
    !item.payload ||
    typeof item.payload !== 'object' ||
    Array.isArray(item.payload)
  ) {
    fail(`${locale}.json contains an invalid translation record.`);
  }
}

function requiredEnvironment(name) {
  const value = process.env[name];
  if (!value) fail(`${name} must be set for the Supabase reference-data migration.`);
  return value;
}

function fail(message) {
  throw new Error(message);
}
