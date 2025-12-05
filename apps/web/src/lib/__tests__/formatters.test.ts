/**
 * Unit Tests for Formatters
 */

import { describe, it, expect } from 'vitest';
import { formatRM, formatBracketLabel, formatPercent } from '../formatters';

describe('formatRM', () => {
  it('formats standard amounts correctly', () => {
    expect(formatRM(1234.56)).toBe('RM1,234.56');
    expect(formatRM(100000)).toBe('RM100,000.00');
    expect(formatRM(0)).toBe('RM0.00');
  });

  it('handles negative amounts', () => {
    expect(formatRM(-1234.56)).toBe('RM1,234.56');
  });

  it('shows sign when requested', () => {
    expect(formatRM(1234.56, { showSign: true })).toBe('+RM1,234.56');
    expect(formatRM(-1234.56, { showSign: true })).toBe('-RM1,234.56');
    expect(formatRM(0, { showSign: true })).toBe('RM0.00');
  });

  it('uses compact notation for very large numbers (>= 10M)', () => {
    // Compact notation kicks in at 10 million or more
    expect(formatRM(10000000)).toBe('RM10.00M');
    expect(formatRM(15000000)).toBe('RM15.00M');
    // Below 10M threshold, no compact notation by default
    expect(formatRM(1000000)).toBe('RM1,000,000.00');
    expect(formatRM(1500000)).toBe('RM1,500,000.00');
  });

  it('uses B suffix for billions', () => {
    expect(formatRM(1000000000)).toBe('RM1.00B');
    expect(formatRM(2500000000)).toBe('RM2.50B');
  });

  it('respects compact option for smaller amounts', () => {
    // When compact is explicitly true, use M suffix even for smaller amounts
    expect(formatRM(1000000, { compact: true })).toBe('RM1.00M');
    expect(formatRM(1500000, { compact: true })).toBe('RM1.50M');
  });

  it('handles NaN and Infinity', () => {
    expect(formatRM(NaN)).toBe('RM0.00');
    expect(formatRM(Infinity)).toBe('RM0.00');
    expect(formatRM(-Infinity)).toBe('RM0.00');
  });

  it('respects fraction digit options', () => {
    expect(formatRM(1234.567, { minimumFractionDigits: 0, maximumFractionDigits: 0 })).toBe('RM1,235');
    expect(formatRM(1234, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toBe('RM1,234.00');
  });
});

describe('formatBracketLabel', () => {
  it('formats first bracket correctly', () => {
    expect(formatBracketLabel(0, 5000, true)).toBe('First RM5,000');
    expect(formatBracketLabel(0, 20000, true)).toBe('First RM20,000');
  });

  it('formats intermediate brackets', () => {
    expect(formatBracketLabel(5000, 20000, false)).toBe('Next RM15,000');
    expect(formatBracketLabel(20000, 35000, false)).toBe('Next RM15,000');
  });

  it('formats final bracket with no upper limit', () => {
    expect(formatBracketLabel(600000, null, false)).toBe('Above RM600,000');
  });

  it('handles first bracket with no upper limit', () => {
    expect(formatBracketLabel(0, null, true)).toBe('All income');
  });
});

describe('formatPercent', () => {
  it('formats decimal rates as percentages', () => {
    expect(formatPercent(0.15)).toBe('15%');
    expect(formatPercent(0.01)).toBe('1%');
    expect(formatPercent(0.24)).toBe('24%');
  });

  it('handles zero', () => {
    expect(formatPercent(0)).toBe('0%');
  });

  it('handles 100%', () => {
    expect(formatPercent(1)).toBe('100%');
  });

  it('respects decimal places option', () => {
    expect(formatPercent(0.155, 1)).toBe('15.5%');
    expect(formatPercent(0.1234, 2)).toBe('12.34%');
  });

  it('handles rates above 100%', () => {
    expect(formatPercent(1.5)).toBe('150%');
  });
});
