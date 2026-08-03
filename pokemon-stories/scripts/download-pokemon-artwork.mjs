import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const artworkDirectory = resolve('public', 'assets', 'pokemon-artwork');
const pokemonFile = resolve('public', 'reference-data', 'poke5e', 'pokemon.json');
const sourceBaseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
const concurrency = 12;

const document = JSON.parse(await readFile(pokemonFile, 'utf8'));
const numbers = [...new Set(document.items.map((pokemon) => pokemon.number).filter(Number.isInteger))];
await mkdir(artworkDirectory, { recursive: true });

let downloaded = 0;
let skipped = 0;
let failed = 0;
for (let index = 0; index < numbers.length; index += concurrency) {
  await Promise.all(numbers.slice(index, index + concurrency).map(async (number) => {
    const target = resolve(artworkDirectory, `${number}.png`);
    try {
      await access(target);
      skipped += 1;
      return;
    } catch {}
    try {
      const response = await fetch(`${sourceBaseUrl}/${number}.png`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await writeFile(target, Buffer.from(await response.arrayBuffer()));
      downloaded += 1;
    } catch {
      failed += 1;
    }
  }));
  console.log(`Artwork: ${Math.min(index + concurrency, numbers.length)}/${numbers.length}`);
}

console.log(`Pokemon artwork complete. Downloaded: ${downloaded}; skipped: ${skipped}; unavailable: ${failed}.`);