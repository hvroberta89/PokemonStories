import {
  AudienceAgePreset,
  AudienceAgePresetId,
} from './audience-age-preset';
import { AgeRange } from '../value-objects/age-range';

function createAgeRange(minimum: number, maximum: number): AgeRange {
  const result = AgeRange.create(minimum, maximum);

  if (!result.isSuccess) {
    throw new Error(
      `Invalid built-in audience age preset: ${result.error.message}`,
    );
  }

  return result.value;
}

const presets: readonly AudienceAgePreset[] = Object.freeze([
  Object.freeze({
    id: 'young-children',
    label: '5–6 évesek',
    ageRange: createAgeRange(5, 6),
  }),
  Object.freeze({
    id: 'children',
    label: '7–9 évesek',
    ageRange: createAgeRange(7, 9),
  }),
  Object.freeze({
    id: 'preteens',
    label: '10–12 évesek',
    ageRange: createAgeRange(10, 12),
  }),
  Object.freeze({
    id: 'teenagers',
    label: '13–15 évesek',
    ageRange: createAgeRange(13, 15),
  }),
]);

export const audienceAgePresets = presets;

export function findAudienceAgePreset(
  id: AudienceAgePresetId,
): AudienceAgePreset {
  const preset = presets.find((item) => item.id === id);

  if (!preset) {
    throw new Error(`Unsupported audience age preset: ${id}`);
  }

  return preset;
}