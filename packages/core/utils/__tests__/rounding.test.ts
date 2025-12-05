/**
 * Unit Tests for Rounding Utilities
 *
 * Tests roundCurrency, roundPercentage, isValidNumber, isNonNegative
 */

import { describe, it, expect } from 'vitest';
import {
  roundCurrency,
  roundPercentage,
  isValidNumber,
  isNonNegative,
} from '../rounding';

describe('roundCurrency', () => {
  it('rounds to 2 decimal places', () => {
    expect(roundCurrency(123.456)).toBe(123.46);
    expect(roundCurrency(123.454)).toBe(123.45);
  });

  it('handles exactly 0.5 cents (banker\'s rounding - rounds to even)', () => {
    // JavaScript Math.round rounds 0.5 up (not banker's rounding)
    expect(roundCurrency(123.455)).toBe(123.46);
    expect(roundCurrency(123.445)).toBe(123.45);
  });

  it('handles whole numbers', () => {
    expect(roundCurrency(100)).toBe(100);
    expect(roundCurrency(0)).toBe(0);
  });

  it('handles negative numbers', () => {
    expect(roundCurrency(-123.456)).toBe(-123.46);
    expect(roundCurrency(-123.454)).toBe(-123.45);
  });

  it('handles very small fractions', () => {
    expect(roundCurrency(0.001)).toBe(0);
    expect(roundCurrency(0.005)).toBe(0.01);
    expect(roundCurrency(0.004)).toBe(0);
  });

  it('handles very large numbers', () => {
    expect(roundCurrency(999999999.999)).toBe(1000000000);
    expect(roundCurrency(123456789.12)).toBe(123456789.12);
  });

  it('handles already rounded values', () => {
    expect(roundCurrency(123.45)).toBe(123.45);
    expect(roundCurrency(100.00)).toBe(100);
  });

  it('handles NaN and Infinity', () => {
    expect(roundCurrency(NaN)).toBeNaN();
    expect(roundCurrency(Infinity)).toBe(Infinity);
    expect(roundCurrency(-Infinity)).toBe(-Infinity);
  });
});

describe('roundPercentage', () => {
  it('rounds to 4 decimal places', () => {
    expect(roundPercentage(0.123456)).toBe(0.1235);
    expect(roundPercentage(0.123454)).toBe(0.1235);
  });

  it('handles tax rate precision', () => {
    expect(roundPercentage(0.15)).toBe(0.15);
    expect(roundPercentage(0.17)).toBe(0.17);
    expect(roundPercentage(0.24)).toBe(0.24);
  });

  it('handles effective tax rate calculations', () => {
    // Typical effective rate: tax / income
    expect(roundPercentage(15000 / 100000)).toBe(0.15);
    expect(roundPercentage(12345 / 100000)).toBe(0.1235);
  });

  it('handles zero and one', () => {
    expect(roundPercentage(0)).toBe(0);
    expect(roundPercentage(1)).toBe(1);
  });

  it('handles values greater than 1', () => {
    expect(roundPercentage(1.5)).toBe(1.5);
    expect(roundPercentage(2.12345)).toBe(2.1235);
  });

  it('handles negative percentages', () => {
    expect(roundPercentage(-0.1234)).toBe(-0.1234);
  });

  it('handles very small percentages', () => {
    expect(roundPercentage(0.00001)).toBe(0);
    expect(roundPercentage(0.00005)).toBe(0.0001);
  });

  it('handles NaN and Infinity', () => {
    expect(roundPercentage(NaN)).toBeNaN();
    expect(roundPercentage(Infinity)).toBe(Infinity);
  });
});

describe('isValidNumber', () => {
  it('returns true for valid integers', () => {
    expect(isValidNumber(0)).toBe(true);
    expect(isValidNumber(100)).toBe(true);
    expect(isValidNumber(-100)).toBe(true);
  });

  it('returns true for valid floats', () => {
    expect(isValidNumber(3.14)).toBe(true);
    expect(isValidNumber(-3.14)).toBe(true);
    expect(isValidNumber(0.001)).toBe(true);
  });

  it('returns false for NaN', () => {
    expect(isValidNumber(NaN)).toBe(false);
  });

  it('returns false for Infinity', () => {
    expect(isValidNumber(Infinity)).toBe(false);
    expect(isValidNumber(-Infinity)).toBe(false);
  });

  it('returns false for non-number types', () => {
    expect(isValidNumber('100' as any)).toBe(false);
    expect(isValidNumber(null as any)).toBe(false);
    expect(isValidNumber(undefined as any)).toBe(false);
    expect(isValidNumber({} as any)).toBe(false);
  });

  it('handles edge cases', () => {
    expect(isValidNumber(Number.MAX_VALUE)).toBe(true);
    expect(isValidNumber(Number.MIN_VALUE)).toBe(true);
    expect(isValidNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(isValidNumber(Number.MIN_SAFE_INTEGER)).toBe(true);
  });
});

describe('isNonNegative', () => {
  it('returns true for zero', () => {
    expect(isNonNegative(0)).toBe(true);
  });

  it('returns true for positive numbers', () => {
    expect(isNonNegative(1)).toBe(true);
    expect(isNonNegative(100000)).toBe(true);
    expect(isNonNegative(0.001)).toBe(true);
  });

  it('returns false for negative numbers', () => {
    expect(isNonNegative(-1)).toBe(false);
    expect(isNonNegative(-0.001)).toBe(false);
    expect(isNonNegative(-100000)).toBe(false);
  });

  it('handles negative zero', () => {
    // In JavaScript, -0 === 0, so -0 >= 0 is true
    expect(isNonNegative(-0)).toBe(true);
  });

  it('returns false for NaN', () => {
    expect(isNonNegative(NaN)).toBe(false);
  });

  it('returns false for Infinity', () => {
    // Infinity is valid but we might want to reconsider this
    expect(isNonNegative(Infinity)).toBe(false);
    expect(isNonNegative(-Infinity)).toBe(false);
  });

  it('returns false for non-number types', () => {
    expect(isNonNegative('100' as any)).toBe(false);
    expect(isNonNegative(null as any)).toBe(false);
    expect(isNonNegative(undefined as any)).toBe(false);
  });

  it('handles very small positive values', () => {
    expect(isNonNegative(Number.MIN_VALUE)).toBe(true);
    expect(isNonNegative(0.0000001)).toBe(true);
  });
});
