import { BrandedId } from '../../shared/identifiers/branded-id';

export type ProjectId = BrandedId<'ProjectId'>;

export function projectId(value: string): ProjectId {
  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    throw new Error('ProjectId cannot be empty.');
  }

  return normalizedValue as ProjectId;
}