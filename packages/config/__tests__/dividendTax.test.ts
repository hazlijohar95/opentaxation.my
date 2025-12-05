/**
 * Unit Tests for Dividend Tax Rules (YA 2025)
 *
 * Tests calculateDividendTax
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDividendTax,
  DIVIDEND_TAX_THRESHOLD,
  DIVIDEND_TAX_RATE,
} from '../dividendTax';

describe('calculateDividendTax', () => {
  it('returns 0 for dividend below threshold', () => {
    expect(calculateDividendTax(50000)).toBe(0);
    expect(calculateDividendTax(99999)).toBe(0);
  });

  it('returns 0 for dividend exactly at threshold', () => {
    expect(calculateDividendTax(100000)).toBe(0);
  });

  it('calculates 2% on excess above RM100k', () => {
    const dividend = 150000;
    const expectedTax = (150000 - 100000) * 0.02; // RM1,000
    expect(calculateDividendTax(dividend)).toBe(expectedTax);
  });

  it('calculates correctly for RM100,001 (minimum taxable)', () => {
    const dividend = 100001;
    const expectedTax = 1 * 0.02; // RM0.02
    expect(calculateDividendTax(dividend)).toBeCloseTo(0.02, 2);
  });

  it('calculates correctly for large dividends', () => {
    const dividend = 500000;
    const expectedTax = (500000 - 100000) * 0.02; // RM8,000
    expect(calculateDividendTax(dividend)).toBe(expectedTax);
  });

  it('returns 0 for zero dividend', () => {
    expect(calculateDividendTax(0)).toBe(0);
  });

  it('rounds to 2 decimal places', () => {
    const result = calculateDividendTax(123456.78);
    const decimalPlaces = (result.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });
});

describe('constants', () => {
  it('DIVIDEND_TAX_THRESHOLD is RM100,000', () => {
    expect(DIVIDEND_TAX_THRESHOLD).toBe(100000);
  });

  it('DIVIDEND_TAX_RATE is 2%', () => {
    expect(DIVIDEND_TAX_RATE).toBe(0.02);
  });
});
