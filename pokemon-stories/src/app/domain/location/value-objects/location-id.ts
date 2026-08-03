import type { BrandedId } from '../../shared/identifiers/branded-id';

export type LocationId = BrandedId<'LocationId'>;

export function locationId(value: string): LocationId {
  const normalized = value.trim();
  if (!normalized) throw new Error('LocationId cannot be empty.');
  return normalized as LocationId;
}
