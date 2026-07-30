import { BrandedId } from '../../shared/identifiers/branded-id';

export type AdventurePlanId = BrandedId<'AdventurePlanId'>;

export function adventurePlanId(value: string): AdventurePlanId {
  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    throw new Error('AdventurePlanId cannot be empty.');
  }

  return normalizedValue as AdventurePlanId;
}