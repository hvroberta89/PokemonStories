import type { WorldFact, WorldFactCategory } from '../../domain/world/models/world-fact';

const IGNORED_WORDS = new Set(['a', 'az', 'és', 'egy', 'ez', 'hogy', 'is', 'már', 'nem', 'van']);

export function findPotentialWorldFactConflict(
  facts: readonly WorldFact[],
  text: string,
  category: WorldFactCategory,
): WorldFact | undefined {
  const normalizedText = normalize(text);
  const proposalWords = words(normalizedText);

  return facts.find((fact) => {
    if (fact.value.status !== 'active' || fact.value.category !== category) return false;
    const existingText = normalize(fact.value.text);
    if (existingText === normalizedText) return true;
    const existingWords = words(existingText);
    return [...proposalWords].filter((word) => existingWords.has(word)).length >= 2;
  });
}

function normalize(text: string): string {
  return text
    .trim()
    .toLocaleLowerCase('hu')
    .replace(/[^\p{L}\p{N}\s]/gu, '');
}

function words(text: string): Set<string> {
  return new Set(text.split(/\s+/).filter((word) => word.length >= 4 && !IGNORED_WORDS.has(word)));
}
