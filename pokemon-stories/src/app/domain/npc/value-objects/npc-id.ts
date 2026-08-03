import type { BrandedId } from '../../shared/identifiers/branded-id';

export type NpcId = BrandedId<'NpcId'>;

export function npcId(value: string): NpcId {
  const normalized = value.trim();
  if (!normalized) throw new Error('NpcId cannot be empty.');
  return normalized as NpcId;
}
