import { BrandedId } from '../../shared/identifiers/branded-id';

export type CharacterId = BrandedId<'CharacterId'>;

export function characterId(value: string): CharacterId {
  const normalized = value.trim();
  if (!normalized) throw new Error('CharacterId cannot be empty.');
  return normalized as CharacterId;
}
