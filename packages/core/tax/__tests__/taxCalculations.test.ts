/**
 * Unit Tests for Tax Calculations
 *
 * Tests tax calculation accuracy against known LHDN examples
 */

import { describe, it, expect } from 'vitest';
import {
  calculatePersonalTaxFromBrackets,
  calculateCorporateTaxFromBrackets,
  calculateProgressiveTax,
  getProgressiveTaxBreakdown,
  type TaxBracket,
} from '@tax-engine/config';
import { calculateSolePropScenario } from '../calculateSolePropScenario';
import { calculateSdnBhdScenario } from '../calculateSdnBhdScenario';

describe('Personal Tax Calculations', () => {
  it('should calculate zero tax for income ≤ RM5,000', () => {
    expect(calculatePersonalTaxFromBrackets(5000)).toBe(0);
    expect(calculatePersonalTaxFromBrackets(3000)).toBe(0);
  });

  it('should calculate correct tax for RM25,000', () => {
    // RM0-RM5,000: 0% = RM0
    // RM5,001-RM20,000: 1% = RM150
    // RM20,001-RM25,000: 3% = RM150
    // Total = RM300
    const tax = calculatePersonalTaxFromBrackets(25000);
    expect(tax).toBe(300);
  });

  it('should calculate correct tax for RM50,000', () => {
    // RM0-RM5,000: 0% = RM0
    // RM5,001-RM20,000: 1% = RM150
    // RM20,001-RM35,000: 3% = RM450
    // RM35,001-RM50,000: 6% = RM900
    // Total = RM1,500
    const tax = calculatePersonalTaxFromBrackets(50000);
    expect(tax).toBe(1500);
  });

  it('should calculate correct tax for RM100,000', () => {
    const tax = calculatePersonalTaxFromBrackets(100000);
    // Should be positive and reasonable
    expect(tax).toBeGreaterThan(0);
    expect(tax).toBeLessThan(20000); // Should be less than 20% of income
  });

  it('should handle zero and negative income', () => {
    expect(calculatePersonalTaxFromBrackets(0)).toBe(0);
    expect(calculatePersonalTaxFromBrackets(-1000)).toBe(0);
  });
});

describe('Corporate Tax Calculations', () => {
  it('should calculate zero tax for profit ≤ 0', () => {
    expect(calculateCorporateTaxFromBrackets(0)).toBe(0);
    expect(calculateCorporateTaxFromBrackets(-1000)).toBe(0);
  });

  it('should calculate correct tax for RM100,000 profit', () => {
    // First RM150,000 at 15%
    const tax = calculateCorporateTaxFromBrackets(100000);
    expect(tax).toBe(15000); // 15% of 100,000
  });

  it('should calculate correct tax for RM200,000 profit', () => {
    // First RM150,000: 15% = RM22,500
    // Next RM50,000: 17% = RM8,500
    // Total = RM31,000
    const tax = calculateCorporateTaxFromBrackets(200000);
    expect(tax).toBe(31000);
  });

  it('should calculate correct tax for RM700,000 profit', () => {
    // First RM150,000: 15% = RM22,500
    // Next RM450,000: 17% = RM76,500
    // Next RM100,000: 24% = RM24,000
    // Total = RM123,000
    const tax = calculateCorporateTaxFromBrackets(700000);
    expect(tax).toBe(123000);
  });
});

describe('Sole Prop Scenario', () => {
  it('should calculate correctly for basic scenario', () => {
    const result = calculateSolePropScenario({
      businessProfit: 100000,
      otherIncome: 0,
    });

    expect(result.personalTax).toBeGreaterThan(0);
    expect(result.netCash).toBeLessThan(100000);
    expect(result.effectiveTaxRate).toBeGreaterThan(0);
    expect(result.effectiveTaxRate).toBeLessThan(1);
  });

  it('should handle zero profit', () => {
    const result = calculateSolePropScenario({
      businessProfit: 0,
      otherIncome: 0,
    });

    expect(result.personalTax).toBe(0);
    expect(result.netCash).toBe(0);
  });
});

describe('Sdn Bhd Scenario', () => {
  it('should calculate correctly for basic scenario', () => {
    const result = calculateSdnBhdScenario({
      businessProfit: 200000,
      monthlySalary: 5000,
      otherIncome: 0,
      complianceCosts: 5000,
    });

    expect(result.corporateTax).toBeGreaterThan(0);
    expect(result.personalTax).toBeGreaterThan(0);
    expect(result.netCash).toBeGreaterThan(0);
    expect(result.netCash).toBeLessThan(200000);
  });

  it('should include dividend tax for dividends > RM100k when surcharge is enabled', () => {
    // Create scenario with high profit to generate dividends > RM100k
    const result = calculateSdnBhdScenario({
      businessProfit: 300000,
      monthlySalary: 5000,
      otherIncome: 0,
      complianceCosts: 5000,
      applyYa2025DividendSurcharge: true, // Enable YA 2025 dividend surcharge
    });

    if (result.breakdown.dividends > 100000) {
      expect(result.breakdown.dividendTax).toBeGreaterThan(0);
    } else {
      // If dividends are <= RM100k, dividend tax should be 0
      expect(result.breakdown.dividendTax).toBe(0);
    }
  });
  
  it('should not include dividend tax when surcharge is disabled', () => {
    const result = calculateSdnBhdScenario({
      businessProfit: 300000,
      monthlySalary: 5000,
      otherIncome: 0,
      complianceCosts: 5000,
      applyYa2025DividendSurcharge: false, // Disable YA 2025 dividend surcharge
    });

    // Dividend tax should always be 0 when surcharge is disabled
    expect(result.breakdown.dividendTax).toBe(0);
  });
});

describe('Progressive Tax Utility', () => {
  const SIMPLE_BRACKETS: TaxBracket[] = [
    { min: 0, max: 10000, rate: 0.1 },
    { min: 10000, max: 20000, rate: 0.2 },
    { min: 20000, max: null, rate: 0.3 },
  ];

  it('should calculate tax for amount in first bracket only', () => {
    const tax = calculateProgressiveTax(5000, SIMPLE_BRACKETS);
    expect(tax).toBe(500); // 5000 * 10%
  });

  it('should calculate tax across multiple brackets', () => {
    const tax = calculateProgressiveTax(15000, SIMPLE_BRACKETS);
    // First 10000 at 10% = 1000
    // Next 5000 at 20% = 1000
    // Total = 2000
    expect(tax).toBe(2000);
  });

  it('should calculate tax for amount exceeding all defined brackets', () => {
    const tax = calculateProgressiveTax(25000, SIMPLE_BRACKETS);
    // First 10000 at 10% = 1000
    // Next 10000 at 20% = 2000
    // Next 5000 at 30% = 1500
    // Total = 4500
    expect(tax).toBe(4500);
  });

  it('should return zero for zero or negative amounts', () => {
    expect(calculateProgressiveTax(0, SIMPLE_BRACKETS)).toBe(0);
    expect(calculateProgressiveTax(-1000, SIMPLE_BRACKETS)).toBe(0);
  });

  it('should return empty breakdown for zero amount', () => {
    const breakdown = getProgressiveTaxBreakdown(0, SIMPLE_BRACKETS);
    expect(breakdown).toHaveLength(0);
  });

  it('should provide correct breakdown for amount across brackets', () => {
    const breakdown = getProgressiveTaxBreakdown(15000, SIMPLE_BRACKETS);

    expect(breakdown).toHaveLength(2);

    expect(breakdown[0].bracketMin).toBe(0);
    expect(breakdown[0].bracketMax).toBe(10000);
    expect(breakdown[0].rate).toBe(0.1);
    expect(breakdown[0].amountInBracket).toBe(10000);
    expect(breakdown[0].taxForBracket).toBe(1000);

    expect(breakdown[1].bracketMin).toBe(10000);
    expect(breakdown[1].bracketMax).toBe(20000);
    expect(breakdown[1].rate).toBe(0.2);
    expect(breakdown[1].amountInBracket).toBe(5000);
    expect(breakdown[1].taxForBracket).toBe(1000);
  });

  it('should round tax amounts to 2 decimal places', () => {
    const FRACTIONAL_BRACKETS: TaxBracket[] = [
      { min: 0, max: 1000, rate: 0.033 }, // 3.3%
    ];
    const tax = calculateProgressiveTax(100, FRACTIONAL_BRACKETS);
    expect(tax).toBe(3.3); // 100 * 0.033 = 3.3
  });
});

