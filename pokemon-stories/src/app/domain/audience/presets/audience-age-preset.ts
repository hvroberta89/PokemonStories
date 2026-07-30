import { AgeRange } from '../value-objects/age-range';

export type AudienceAgePresetId =
  | 'young-children'
  | 'children'
  | 'preteens'
  | 'teenagers';

export interface AudienceAgePreset {
  readonly id: AudienceAgePresetId;
  readonly label: string;
  readonly ageRange: AgeRange;
}