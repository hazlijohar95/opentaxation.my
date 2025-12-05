/**
 * Edge Case Tests for Scenario Calculations
 *
 * Tests edge cases for calculateSolePropScenario and calculateSdnBhdScenario
 */

import { describe, it, expect } from 'vitest';
import { calculateSolePropScenario } from '../calculateSolePropScenario';
import { calculateSdnBhdScenario } from '../calculateSdnBhdScenario';

describe('Sole Prop Scenario Edge Cases', () => {
  describe('zakat handling', () => {
    it('applies zakat as 100% tax rebate when zakat < tax', () => {
      const result = calculateSolePropScenario({
        businessProfit: 200000,
        otherIncome: 0,
        zakat: { enabled: true, amountPaid: 1000, autoCalculate: false },
      });

      expect(result.zakat).toBeDefined();
      expect(result.zakat?.zakatAmount).toBe(1000);
      // Tax benefit should equal zakat amount (100% rebate)
      expect(result.zakat?.taxBenefit).toBe(1000);
      expect(result.zakat?.excessZakat).toBe(0);
    });

    it('handles zakat exceeding tax (excess zakat)', () => {
      // Low income scenario where tax is minimal
      const result = calculateSolePropScenario({
        businessProfit: 30000,
        otherIncome: 0,
        zakat: { enabled: true, amountPaid: 5000, autoCalculate: false },
      });

      expect(result.zakat).toBeDefined();
      if (result.personalTax < 5000) {
        // When zakat > tax, excess is tracked
        expect(result.zakat?.excessZakat).toBeGreaterThan(0);
        // Tax benefit is capped at tax payable
        expect(result.zakat?.taxBenefit).toBeLessThanOrEqual(result.taxBeforeZakatRebate || result.personalTax);
      }
    });

    it('handles income below nisab threshold', () => {
      const result = calculateSolePropScenario({
        businessProfit: 20000, // Below RM29,961 nisab
        otherIncome: 0,
        zakat: { enabled: true, autoCalculate: true },
      });

      expect(result.zakat).toBeDefined();
      if (!result.zakat?.meetsNisab) {
        expect(result.zakat?.zakatAmount).toBe(0);
      }
    });

    it('auto-calculates zakat at 2.5% when enabled', () => {
      const result = calculateSolePropScenario({
        businessProfit: 100000,
        otherIncome: 0,
        zakat: { enabled: true, autoCalculate: true },
      });

      expect(result.zakat).toBeDefined();
      if (result.zakat?.meetsNisab) {
        // Zakat should be approximately 2.5% of income
        const expectedZakat = 100000 * 0.025;
        expect(result.zakat?.zakatAmount).toBeCloseTo(expectedZakat, 0);
      }
    });
  });

  describe('reliefs handling', () => {
    it('applies custom reliefs correctly', () => {
      const resultWithReliefs = calculateSolePropScenario({
        businessProfit: 100000,
        otherIncome: 0,
        reliefs: {
          personal: 9000,
          education: 2000,
          medical: 1000,
          lifestyle: 500,
          parentMedical: 0,
          childCare: 0,
        },
      });

      const resultDefault = calculateSolePropScenario({
        businessProfit: 100000,
        otherIncome: 0,
      });

      // Custom reliefs should affect taxable income
      expect(resultWithReliefs.breakdown.totalReliefs).toBe(12500);
    });

    it('handles zero reliefs', () => {
      const result = calculateSolePropScenario({
        businessProfit: 100000,
        otherIncome: 0,
        reliefs: {
          personal: 0,
          education: 0,
          medical: 0,
          lifestyle: 0,
          parentMedical: 0,
          childCare: 0,
        },
      });

      expect(result.breakdown.totalReliefs).toBe(0);
      // Without reliefs, taxable income equals total income
      expect(result.breakdown.taxableIncome).toBe(result.breakdown.totalIncome);
    });
  });

  describe('income combinations', () => {
    it('combines business profit and other income', () => {
      const result = calculateSolePropScenario({
        businessProfit: 50000,
        otherIncome: 30000,
      });

      expect(result.breakdown.totalIncome).toBe(80000);
    });

    it('handles zero profit with other income', () => {
      const result = calculateSolePropScenario({
        businessProfit: 0,
        otherIncome: 50000,
      });

      expect(result.breakdown.totalIncome).toBe(50000);
      expect(result.netCash).toBeLessThanOrEqual(50000);
    });
  });
});

describe('Sdn Bhd Scenario Edge Cases', () => {
  describe('salary affordability', () => {
    it('detects when salary exceeds business profit', () => {
      const result = calculateSdnBhdScenario({
        businessProfit: 60000,
        monthlySalary: 6000, // RM72k annual > RM60k profit
        otherIncome: 0,
        complianceCosts: 5000,
      });

      expect(result.salaryAffordability.companyWouldBeInsolvent).toBe(true);
      expect(result.salaryAffordability.shortfall).toBeGreaterThan(0);
    });

    it('identifies maximum affordable salary', () => {
      const result = calculateSdnBhdScenario({
        businessProfit: 100000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
      });

      expect(result.salaryAffordability.maxAffordableSalary).toBeGreaterThan(0);
      expect(result.salaryAffordability.maxAffordableSalary).toBeLessThanOrEqual(100000);
    });
  });

  describe('EPF rate boundaries', () => {
    it('applies 13% employer EPF for salary <= RM5k/month', () => {
      const result = calculateSdnBhdScenario({
        businessProfit: 200000,
        monthlySalary: 5000, // Exactly at boundary
        otherIncome: 0,
        complianceCosts: 5000,
      });

      // Employer EPF should be 13% of annual salary
      const expectedEPF = 5000 * 12 * 0.13;
      expect(result.employerEPF).toBeCloseTo(expectedEPF, 0);
    });

    it('applies 12% employer EPF for salary > RM5k/month', () => {
      const result = calculateSdnBhdScenario({
        businessProfit: 300000,
        monthlySalary: 6000, // Above boundary
        otherIncome: 0,
        complianceCosts: 5000,
      });

      // Employer EPF should be 12% of annual salary
      const expectedEPF = 6000 * 12 * 0.12;
      expect(result.employerEPF).toBeCloseTo(expectedEPF, 0);
    });
  });

  describe('zakat handling (business deduction)', () => {
    it('applies zakat as tax deduction (max 2.5% of aggregate income)', () => {
      const result = calculateSdnBhdScenario({
        businessProfit: 200000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
        zakat: { enabled: true, amountPaid: 3000, autoCalculate: false },
      });

      expect(result.zakat).toBeDefined();
      expect(result.zakat?.zakatAmount).toBe(3000);
    });

    it('caps zakat deduction at 2.5% of aggregate income', () => {
      // Company with low profit but high zakat
      const result = calculateSdnBhdScenario({
        businessProfit: 100000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
        zakat: { enabled: true, amountPaid: 10000, autoCalculate: false }, // High zakat
      });

      expect(result.zakat).toBeDefined();
      // If zakat exceeds 2.5% cap, there should be excess
      const maxDeduction = result.breakdown.companyTaxableProfit * 0.025;
      if (10000 > maxDeduction) {
        expect(result.zakat?.excessZakat).toBeGreaterThan(0);
      }
    });
  });

  describe('dividend surcharge (YA 2025)', () => {
    it('applies 2% surcharge on dividends > RM100k when enabled', () => {
      const result = calculateSdnBhdScenario({
        businessProfit: 500000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
        applyYa2025DividendSurcharge: true,
      });

      if (result.breakdown.dividends > 100000) {
        // Tax should be 2% of excess above RM100k
        const expectedTax = (result.breakdown.dividends - 100000) * 0.02;
        expect(result.breakdown.dividendTax).toBeCloseTo(expectedTax, 0);
      }
    });

    it('no dividend tax when disabled', () => {
      const result = calculateSdnBhdScenario({
        businessProfit: 500000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
        applyYa2025DividendSurcharge: false,
      });

      expect(result.breakdown.dividendTax).toBe(0);
    });

    it('no dividend tax when dividends <= RM100k', () => {
      const result = calculateSdnBhdScenario({
        businessProfit: 150000, // Lower profit = lower dividends
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
        applyYa2025DividendSurcharge: true,
      });

      if (result.breakdown.dividends <= 100000) {
        expect(result.breakdown.dividendTax).toBe(0);
      }
    });
  });

  describe('dividend distribution percentage', () => {
    it('distributes specified percentage of post-tax profit', () => {
      const result100 = calculateSdnBhdScenario({
        businessProfit: 200000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
        dividendDistributionPercent: 100,
      });

      const result50 = calculateSdnBhdScenario({
        businessProfit: 200000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
        dividendDistributionPercent: 50,
      });

      // 50% distribution should result in roughly half the dividends
      expect(result50.breakdown.dividends).toBeCloseTo(result100.breakdown.dividends * 0.5, 0);
    });

    it('retains earnings when distribution < 100%', () => {
      const result = calculateSdnBhdScenario({
        businessProfit: 200000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
        dividendDistributionPercent: 70,
      });

      expect(result.breakdown.retainedEarnings).toBeGreaterThan(0);
    });
  });

  describe('SOCSO boundaries', () => {
    it('applies SOCSO for salary <= RM6k/month', () => {
      const result = calculateSdnBhdScenario({
        businessProfit: 200000,
        monthlySalary: 6000, // At boundary
        otherIncome: 0,
        complianceCosts: 5000,
      });

      expect(result.employerSOCSO).toBeGreaterThan(0);
      expect(result.employeeSOCSO).toBeGreaterThan(0);
    });

    it('no SOCSO for salary > RM6k/month', () => {
      const result = calculateSdnBhdScenario({
        businessProfit: 300000,
        monthlySalary: 7000, // Above boundary
        otherIncome: 0,
        complianceCosts: 5000,
      });

      expect(result.employerSOCSO).toBe(0);
      expect(result.employeeSOCSO).toBe(0);
    });
  });

  describe('compliance costs', () => {
    it('includes compliance costs in calculation', () => {
      const resultWithCosts = calculateSdnBhdScenario({
        businessProfit: 200000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 10000,
      });

      const resultLowCosts = calculateSdnBhdScenario({
        businessProfit: 200000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 2000,
      });

      // Higher compliance costs should result in lower net cash
      expect(resultWithCosts.netCash).toBeLessThan(resultLowCosts.netCash);
    });
  });

  describe('waterfall breakdown', () => {
    it('generates company waterfall steps', () => {
      const result = calculateSdnBhdScenario({
        businessProfit: 200000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
      });

      expect(result.companyWaterfall.length).toBeGreaterThan(0);
      expect(result.companyWaterfall.some(s => s.label.includes('Profit') || s.label.includes('profit'))).toBe(true);
    });

    it('generates personal waterfall steps', () => {
      const result = calculateSdnBhdScenario({
        businessProfit: 200000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
      });

      expect(result.personalWaterfall.length).toBeGreaterThan(0);
      expect(result.personalWaterfall.some(s => s.label.includes('Salary') || s.label.includes('salary'))).toBe(true);
    });
  });
});
