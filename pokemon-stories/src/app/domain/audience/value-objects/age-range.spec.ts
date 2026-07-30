import { AgeRange } from './age-range';

describe('AgeRange', () => {
  describe('create', () => {
    it('should create a valid age range', () => {
      const result = AgeRange.create(7, 9);

      expect(result.isSuccess).toBe(true);

      if (result.isSuccess) {
        expect(result.value.minimum).toBe(7);
        expect(result.value.maximum).toBe(9);
      }
    });

    it('should reject an age below the supported minimum', () => {
      const result = AgeRange.create(3, 6);

      expect(result.isSuccess).toBe(false);

      if (!result.isSuccess) {
        expect(result.error.code).toBe('INVALID_AGE_RANGE');
      }
    });

    it('should reject an age above the supported maximum', () => {
      const result = AgeRange.create(14, 18);

      expect(result.isSuccess).toBe(false);

      if (!result.isSuccess) {
        expect(result.error.code).toBe('INVALID_AGE_RANGE');
      }
    });

    it('should reject a minimum age greater than the maximum age', () => {
      const result = AgeRange.create(10, 7);

      expect(result.isSuccess).toBe(false);

      if (!result.isSuccess) {
        expect(result.error.code).toBe('INVALID_AGE_RANGE');
      }
    });

    it('should reject non-integer ages', () => {
      const result = AgeRange.create(7.5, 9);

      expect(result.isSuccess).toBe(false);

      if (!result.isSuccess) {
        expect(result.error.code).toBe('INVALID_AGE_RANGE');
      }
    });
  });

  describe('includes', () => {
    it('should return true when the age is inside the range', () => {
      const result = AgeRange.create(7, 9);

      expect(result.isSuccess).toBe(true);

      if (result.isSuccess) {
        expect(result.value.includes(8)).toBe(true);
      }
    });

    it('should include the minimum and maximum boundaries', () => {
      const result = AgeRange.create(7, 9);

      expect(result.isSuccess).toBe(true);

      if (result.isSuccess) {
        expect(result.value.includes(7)).toBe(true);
        expect(result.value.includes(9)).toBe(true);
      }
    });

    it('should return false when the age is outside the range', () => {
      const result = AgeRange.create(7, 9);

      expect(result.isSuccess).toBe(true);

      if (result.isSuccess) {
        expect(result.value.includes(6)).toBe(false);
        expect(result.value.includes(10)).toBe(false);
      }
    });
  });

  describe('equals', () => {
    it('should consider identical age ranges equal', () => {
      const first = AgeRange.create(7, 9);
      const second = AgeRange.create(7, 9);

      expect(first.isSuccess).toBe(true);
      expect(second.isSuccess).toBe(true);

      if (first.isSuccess && second.isSuccess) {
        expect(first.value.equals(second.value)).toBe(true);
      }
    });

    it('should consider different age ranges unequal', () => {
      const first = AgeRange.create(7, 9);
      const second = AgeRange.create(10, 12);

      expect(first.isSuccess).toBe(true);
      expect(second.isSuccess).toBe(true);

      if (first.isSuccess && second.isSuccess) {
        expect(first.value.equals(second.value)).toBe(false);
      }
    });
  });

  describe('toString', () => {
    it('should return a readable representation', () => {
      const result = AgeRange.create(7, 9);

      expect(result.isSuccess).toBe(true);

      if (result.isSuccess) {
        expect(result.value.toString()).toBe('7–9 years');
      }
    });
  });
});