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
];
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

if (isDryRun) {
  for (const { dataset, records } of datasets) {
    console.log(`Validated ${records.length} ${dataset} records.`);
  }
  console.log(`Poke5e ${manifest.source.version} snapshot is ready to migrate.`);
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

function requiredEnvironment(name) {
  const value = process.env[name];
  if (!value) fail(`${name} must be set for the Supabase reference-data migration.`);
  return value;
}

function fail(message) {
  throw new Error(message);
}
