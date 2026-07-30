import {
  audienceAgePresets,
  findAudienceAgePreset,
} from './audience-age-presets';

describe('audienceAgePresets', () => {
  it('should provide the supported age presets', () => {
    expect(audienceAgePresets.length).toBe(4);

    expect(audienceAgePresets.map((preset) => preset.id)).toEqual([
      'young-children',
      'children',
      'preteens',
      'teenagers',
    ]);
  });

  it('should provide valid age ranges for every preset', () => {
    for (const preset of audienceAgePresets) {
      expect(preset.ageRange.minimum).toBeLessThanOrEqual(
        preset.ageRange.maximum,
      );
    }
  });

  it('should return the requested preset', () => {
    const preset = findAudienceAgePreset('children');

    expect(preset.label).toBe('7–9 évesek');
    expect(preset.ageRange.minimum).toBe(7);
    expect(preset.ageRange.maximum).toBe(9);
  });

  it('should keep the preset collection immutable', () => {
    expect(Object.isFrozen(audienceAgePresets)).toBe(true);
  });

  it('should keep every preset immutable', () => {
    for (const preset of audienceAgePresets) {
      expect(Object.isFrozen(preset)).toBe(true);
    }
  });
});