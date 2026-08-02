import { BrandedId } from '../../shared/identifiers/branded-id';

export type AdventureSceneId = BrandedId<'AdventureSceneId'>;

export function adventureSceneId(value: string): AdventureSceneId {
  const normalizedValue = value.trim();
  if (!normalizedValue) throw new Error('AdventureSceneId cannot be empty.');
  return normalizedValue as AdventureSceneId;
}
