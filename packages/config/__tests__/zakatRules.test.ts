/**
 * Unit Tests for Zakat Rules
 *
 * Tests calculateZakatGrossIncome, calculateIndividualZakatRebate, calculateBusinessZakatDeduction
 */

import { describe, it, expect } from 'vitest';
import {
  calculateZakatGrossIncome,
  calculateZakatNetIncome,
  calculateIndividualZakatRebate,
  calculateBusinessZakatDeduction,
  getCurrentNisab,
  meetsNisabThreshold,
  ZAKAT_RATE,
  ZAKAT_NISAB_2025,
} from '../zakatRules';

describe('calculateZakatGrossIncome', () => {
  it('returns 0 for income below nisab', () => {
    expect(calculateZakatGrossIncome(20000)).toBe(0);
    expect(calculateZakatGrossIncome(29960)).toBe(0);
  });

  it('returns 0 for income exactly at nisab boundary minus 1', () => {
    expect(calculateZakatGrossIncome(ZAKAT_NISAB_2025.individual - 1)).toBe(0);
  });

  it('calculates 2.5% for income at nisab threshold', () => {
    const income = ZAKAT_NISAB_2025.individual;
    const expectedZakat = income * ZAKAT_RATE;
    expect(calculateZakatGrossIncome(income)).toBeCloseTo(expectedZakat, 2);
  });

  it('calculates 2.5% for income above nisab', () => {
    const income = 100000;
    const expectedZakat = income * ZAKAT_RATE; // RM2,500
    expect(calculateZakatGrossIncome(income)).toBeCloseTo(expectedZakat, 2);
  });

  it('handles large income amounts', () => {
    const income = 1000000;
    const expectedZakat = income * 0.025; // RM25,000
    expect(calculateZakatGrossIncome(income)).toBeCloseTo(expectedZakat, 2);
  });

  it('returns 0 for zero income', () => {
    expect(calculateZakatGrossIncome(0)).toBe(0);
  });

  it('rounds to 2 decimal places', () => {
    const result = calculateZakatGrossIncome(50123);
    const decimalPlaces = (result.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });
});

describe('calculateZakatNetIncome', () => {
  it('subtracts deductions before calculating zakat', () => {
    const grossIncome = 100000;
    const deductions = { epf: 11000, expenses: 5000 };
    const netIncome = grossIncome - 11000 - 5000; // RM84,000
    const expectedZakat = netIncome * 0.025;
    expect(calculateZakatNetIncome(grossIncome, deductions)).toBeCloseTo(expectedZakat, 2);
  });

  it('returns 0 if net income is below nisab', () => {
    const grossIncome = 40000;
    const deductions = { epf: 15000, expenses: 5000 }; // Net = RM20,000
    expect(calculateZakatNetIncome(grossIncome, deductions)).toBe(0);
  });

  it('handles empty deductions object', () => {
    const grossIncome = 100000;
    const expectedZakat = grossIncome * 0.025;
    expect(calculateZakatNetIncome(grossIncome, {})).toBeCloseTo(expectedZakat, 2);
  });
});

describe('calculateIndividualZakatRebate', () => {
  it('applies 100% rebate when zakat < tax', () => {
    const zakatPaid = 1000;
    const taxPayable = 5000;
    const result = calculateIndividualZakatRebate(zakatPaid, taxPayable);

    expect(result.rebate).toBe(1000);
    expect(result.netTax).toBe(4000);
    expect(result.excessZakat).toBe(0);
  });

  it('applies 100% rebate when zakat equals tax', () => {
    const zakatPaid = 5000;
    const taxPayable = 5000;
    const result = calculateIndividualZakatRebate(zakatPaid, taxPayable);

    expect(result.rebate).toBe(5000);
    expect(result.netTax).toBe(0);
    expect(result.excessZakat).toBe(0);
  });

  it('caps rebate at tax payable when zakat > tax', () => {
    const zakatPaid = 8000;
    const taxPayable = 5000;
    const result = calculateIndividualZakatRebate(zakatPaid, taxPayable);

    expect(result.rebate).toBe(5000);
    expect(result.netTax).toBe(0);
    expect(result.excessZakat).toBe(3000);
  });

  it('handles zero tax payable', () => {
    const zakatPaid = 1000;
    const taxPayable = 0;
    const result = calculateIndividualZakatRebate(zakatPaid, taxPayable);

    expect(result.rebate).toBe(0);
    expect(result.netTax).toBe(0);
    expect(result.excessZakat).toBe(1000);
  });

  it('handles zero zakat paid', () => {
    const zakatPaid = 0;
    const taxPayable = 5000;
    const result = calculateIndividualZakatRebate(zakatPaid, taxPayable);

    expect(result.rebate).toBe(0);
    expect(result.netTax).toBe(5000);
    expect(result.excessZakat).toBe(0);
  });

  it('rounds all values to 2 decimal places', () => {
    const result = calculateIndividualZakatRebate(1234.567, 3456.789);
    expect(result.rebate.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    expect(result.netTax.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    expect(result.excessZakat.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
  });
});

describe('calculateBusinessZakatDeduction', () => {
  it('allows full deduction when zakat <= 2.5% of aggregate income', () => {
    const zakatPaid = 2000;
    const aggregateIncome = 100000; // 2.5% = RM2,500
    const result = calculateBusinessZakatDeduction(zakatPaid, aggregateIncome);

    expect(result.deduction).toBe(2000);
    expect(result.excessZakat).toBe(0);
  });

  it('caps deduction at 2.5% of aggregate income', () => {
    const zakatPaid = 5000;
    const aggregateIncome = 100000; // 2.5% = RM2,500
    const result = calculateBusinessZakatDeduction(zakatPaid, aggregateIncome);

    expect(result.deduction).toBe(2500);
    expect(result.excessZakat).toBe(2500);
  });

  it('handles zero aggregate income', () => {
    const zakatPaid = 1000;
    const aggregateIncome = 0;
    const result = calculateBusinessZakatDeduction(zakatPaid, aggregateIncome);

    expect(result.deduction).toBe(0);
    expect(result.excessZakat).toBe(1000);
  });

  it('handles zero zakat paid', () => {
    const zakatPaid = 0;
    const aggregateIncome = 100000;
    const result = calculateBusinessZakatDeduction(zakatPaid, aggregateIncome);

    expect(result.deduction).toBe(0);
    expect(result.excessZakat).toBe(0);
  });

  it('rounds all values to 2 decimal places', () => {
    const result = calculateBusinessZakatDeduction(1234.567, 50000.123);
    expect(result.deduction.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    expect(result.excessZakat.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
  });
});

describe('helper functions', () => {
  describe('getCurrentNisab', () => {
    it('returns current nisab value', () => {
      expect(getCurrentNisab()).toBe(ZAKAT_NISAB_2025.individual);
      expect(getCurrentNisab()).toBe(29961);
    });
  });

  describe('meetsNisabThreshold', () => {
    it('returns false for income below nisab', () => {
      expect(meetsNisabThreshold(20000)).toBe(false);
      expect(meetsNisabThreshold(29960)).toBe(false);
    });

    it('returns true for income at nisab', () => {
      expect(meetsNisabThreshold(ZAKAT_NISAB_2025.individual)).toBe(true);
    });

    it('returns true for income above nisab', () => {
      expect(meetsNisabThreshold(50000)).toBe(true);
      expect(meetsNisabThreshold(100000)).toBe(true);
    });
  });
});

describe('constants', () => {
  it('ZAKAT_RATE is 2.5%', () => {
    expect(ZAKAT_RATE).toBe(0.025);
  });

  it('ZAKAT_NISAB_2025 has correct values', () => {
    expect(ZAKAT_NISAB_2025.individual).toBe(29961);
    expect(ZAKAT_NISAB_2025.business).toBe(29961);
  });
});
