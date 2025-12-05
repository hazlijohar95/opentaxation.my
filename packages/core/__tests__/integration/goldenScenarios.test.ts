/**
 * Golden Scenario Integration Tests
 *
 * These tests verify complete end-to-end calculations against known reference values.
 * They serve as regression tests when tax formulas change and help validate
 * that the calculation engine produces correct results.
 *
 * ## How to maintain these tests:
 * 1. When tax rates change (new YA), update the expected values
 * 2. Document any formula changes in ASSUMPTIONS.md
 * 3. Run these tests to verify the entire calculation pipeline
 *
 * ## Reference calculations verified against:
 * - Manual calculations using LHDN tax brackets
 * - EPF rates from EPF Act 1991
 * - Corporate tax rates for SME companies
 */

import { describe, it, expect } from 'vitest';
import { calculateSolePropScenario } from '../../tax/calculateSolePropScenario';
import { calculateSdnBhdScenario } from '../../tax/calculateSdnBhdScenario';
import { compareScenarios } from '../../tax/compareScenarios';

describe('Golden Scenarios - Enterprise (Sole Prop)', () => {
  /**
   * Scenario: RM100,000 profit, single individual, no other income
   *
   * Expected calculation:
   * - Taxable Income: RM100,000 - RM9,000 (basic relief) = RM91,000
   * - Tax breakdown:
   *   - RM0-5,000: 0% = RM0
   *   - RM5,001-20,000: 1% = RM150
   *   - RM20,001-35,000: 3% = RM450
   *   - RM35,001-50,000: 6% = RM900
   *   - RM50,001-70,000: 11% = RM2,200
   *   - RM70,001-91,000: 19% = RM3,990
   *   - Total Tax: RM7,690
   * - Net Cash: RM100,000 - RM7,690 = RM92,310
   */
  it('RM100k profit, basic reliefs only', () => {
    const result = calculateSolePropScenario({
      businessProfit: 100000,
      otherIncome: 0,
      reliefs: { basic: 9000, epfAndLifeInsurance: 0, medical: 0 },
    });

    // Allow small rounding tolerance
    expect(result.personalTax).toBeCloseTo(7690, 0);
    expect(result.netCash).toBeCloseTo(92310, 0);
    expect(result.effectiveTaxRate).toBeCloseTo(0.0769, 2);
  });

  /**
   * Scenario: RM300,000 profit with full reliefs
   *
   * Expected calculation:
   * - Total Reliefs: RM9,000 + RM7,000 + RM8,000 = RM24,000
   * - Taxable Income: RM300,000 - RM24,000 = RM276,000
   * - Tax breakdown (progressive):
   *   - RM0-5,000: 0% = RM0
   *   - RM5,001-20,000: 1% = RM150
   *   - RM20,001-35,000: 3% = RM450
   *   - RM35,001-50,000: 6% = RM900
   *   - RM50,001-70,000: 11% = RM2,200
   *   - RM70,001-100,000: 19% = RM5,700
   *   - RM100,001-250,000: 25% = RM37,500
   *   - RM250,001-276,000: 26% = RM6,760
   *   - Total Tax: RM53,660
   * - Net Cash: RM300,000 - RM53,660 = RM246,340
   */
  it('RM300k profit with full reliefs', () => {
    const result = calculateSolePropScenario({
      businessProfit: 300000,
      otherIncome: 0,
      reliefs: { basic: 9000, epfAndLifeInsurance: 7000, medical: 8000 },
    });

    expect(result.personalTax).toBeCloseTo(53660, 0);
    expect(result.netCash).toBeCloseTo(246340, 0);
    expect(result.effectiveTaxRate).toBeLessThan(0.19); // Should be below 19%
  });

  /**
   * Scenario: Low income below tax threshold
   *
   * Expected:
   * - Taxable Income: RM20,000 - RM9,000 = RM11,000
   * - Tax: RM0 (first RM5k) + RM60 (1% on RM6k) = RM60
   */
  it('RM20k profit - low income scenario', () => {
    const result = calculateSolePropScenario({
      businessProfit: 20000,
      otherIncome: 0,
      reliefs: { basic: 9000, epfAndLifeInsurance: 0, medical: 0 },
    });

    expect(result.personalTax).toBeCloseTo(60, 0);
    expect(result.netCash).toBeCloseTo(19940, 0);
  });

  /**
   * Scenario: With zakat enabled
   *
   * Expected:
   * - Zakat: 2.5% of RM150,000 = RM3,750
   * - Tax before rebate: ~RM17,890 (on taxable income RM141,000)
   * - Zakat rebate: RM3,750 (100% since less than tax)
   * - Final tax: RM17,890 - RM3,750 = RM14,140
   */
  it('RM150k profit with zakat', () => {
    const result = calculateSolePropScenario({
      businessProfit: 150000,
      otherIncome: 0,
      reliefs: { basic: 9000, epfAndLifeInsurance: 0, medical: 0 },
      zakat: { enabled: true, autoCalculate: true },
    });

    expect(result.zakat).toBeDefined();
    expect(result.zakat?.zakatAmount).toBeCloseTo(3750, 0);
    expect(result.zakat?.taxBenefit).toBeGreaterThan(0);
    // Zakat should reduce the final tax
    expect(result.personalTax).toBeLessThan(17890);
  });
});

describe('Golden Scenarios - Sdn Bhd', () => {
  /**
   * Scenario: RM200k profit, RM5k/month salary
   *
   * Company Side:
   * - Annual Salary: RM60,000
   * - Employer EPF (13%): RM7,800
   * - Employer SOCSO: ~RM1,050
   * - Taxable Profit: RM200,000 - RM60,000 - RM7,800 - RM1,050 = RM131,150
   * - Corporate Tax (15%): RM19,672.50
   *
   * Personal Side:
   * - Gross Salary: RM60,000
   * - Employee EPF (11%): RM6,600
   * - Net after EPF: RM53,400
   * - Personal Tax on RM60k with RM9k+RM6.6k relief: ~RM900
   * - Net from salary: RM53,400 - RM900 = RM52,500
   */
  it('RM200k profit, RM5k/month salary', () => {
    const result = calculateSdnBhdScenario({
      businessProfit: 200000,
      monthlySalary: 5000,
      otherIncome: 0,
      complianceCosts: 5000,
    });

    // Verify company calculations
    expect(result.breakdown.annualSalary).toBe(60000);
    expect(result.employerEPF).toBeCloseTo(7800, 0);

    // Verify corporate tax is within expected range
    // Taxable profit should be ~RM131k, tax at 15% is ~RM19.7k
    expect(result.corporateTax).toBeGreaterThan(15000);
    expect(result.corporateTax).toBeLessThan(25000);

    // Verify salary affordability
    expect(result.salaryAffordability.isAffordable).toBe(true);
    expect(result.salaryAffordability.companyWouldBeInsolvent).toBe(false);

    // Net cash should be positive and reasonable
    expect(result.netCash).toBeGreaterThan(100000);
  });

  /**
   * Scenario: RM500k profit, RM8k/month salary
   *
   * Expected:
   * - Higher profit bracket (17% for portion above RM150k)
   * - Salary generates more EPF savings
   */
  it('RM500k profit, RM8k/month salary', () => {
    const result = calculateSdnBhdScenario({
      businessProfit: 500000,
      monthlySalary: 8000,
      otherIncome: 0,
      complianceCosts: 8000,
    });

    expect(result.breakdown.annualSalary).toBe(96000);
    // With RM96k salary, EPF rate is 12% (above RM5k threshold)
    expect(result.employerEPF).toBeCloseTo(11520, 0);

    // Should be in the 17% tax bracket territory
    expect(result.corporateTax).toBeGreaterThan(40000);

    // Large profit should generate significant dividends
    expect(result.breakdown.dividends).toBeGreaterThan(200000);
  });

  /**
   * Scenario: Salary exceeds profit (affordability issue)
   *
   * Expected:
   * - Company would be insolvent
   * - Warning should be generated
   */
  it('RM100k profit, RM10k/month salary - affordability issue', () => {
    const result = calculateSdnBhdScenario({
      businessProfit: 100000,
      monthlySalary: 10000,
      otherIncome: 0,
      complianceCosts: 5000,
    });

    // RM120k salary + ~RM14k EPF > RM100k profit
    expect(result.salaryAffordability.isAffordable).toBe(false);
    expect(result.salaryAffordability.companyWouldBeInsolvent).toBe(true);
    expect(result.salaryAffordability.shortfall).toBeGreaterThan(0);
  });

  /**
   * Scenario: With YA 2025 dividend surcharge
   *
   * Expected:
   * - Dividends > RM100k should incur 2% surcharge on excess
   */
  it('High dividends with YA 2025 surcharge', () => {
    const result = calculateSdnBhdScenario({
      businessProfit: 500000,
      monthlySalary: 5000,
      otherIncome: 0,
      complianceCosts: 5000,
      applyYa2025DividendSurcharge: true,
    });

    // With RM500k profit and low salary, dividends should exceed RM100k
    expect(result.breakdown.dividends).toBeGreaterThan(100000);
    // Dividend tax should be applied (2% on excess above RM100k)
    expect(result.breakdown.dividendTax).toBeGreaterThan(0);
  });
});

describe('Golden Scenarios - Comparison', () => {
  /**
   * Scenario: Low profit where Enterprise wins
   *
   * Expected:
   * - At RM50k profit, Enterprise should be better due to lower compliance costs
   */
  it('RM50k profit - Enterprise should win', () => {
    const soleProp = calculateSolePropScenario({
      businessProfit: 50000,
      otherIncome: 0,
    });

    const sdnBhd = calculateSdnBhdScenario({
      businessProfit: 50000,
      monthlySalary: 3000,
      otherIncome: 0,
      complianceCosts: 5000,
    });

    const comparison = compareScenarios(soleProp, sdnBhd, 50000, {
      businessProfit: 50000,
      monthlySalary: 3000,
      otherIncome: 0,
      complianceCosts: 5000,
    });

    expect(comparison.whichIsBetter).toBe('soleProp');
    expect(comparison.difference).toBeLessThan(0);
  });

  /**
   * Scenario: High profit where Sdn Bhd wins
   *
   * Expected:
   * - At RM1M profit with optimized salary, Sdn Bhd should be better
   * - Higher profit amplifies the corporate tax advantage
   */
  it('RM1M profit - Sdn Bhd should win', () => {
    const soleProp = calculateSolePropScenario({
      businessProfit: 1000000,
      otherIncome: 0,
    });

    const sdnBhd = calculateSdnBhdScenario({
      businessProfit: 1000000,
      monthlySalary: 10000,
      otherIncome: 0,
      complianceCosts: 10000,
    });

    const comparison = compareScenarios(soleProp, sdnBhd, 1000000, {
      businessProfit: 1000000,
      monthlySalary: 10000,
      otherIncome: 0,
      complianceCosts: 10000,
    });

    // At RM1M, Sdn Bhd should clearly win
    expect(comparison.whichIsBetter).toBe('sdnBhd');
    expect(comparison.difference).toBeGreaterThan(0);
    expect(comparison.savingsIfSwitch).toBeGreaterThan(10000);
  });

  /**
   * Scenario: Crossover point calculation
   *
   * The crossover point depends heavily on the compliance costs and salary settings.
   * With higher compliance costs, Sdn Bhd becomes less attractive, pushing crossover higher.
   * With lower compliance costs, crossover is lower.
   *
   * Note: Crossover may not exist if one scenario always wins across the profit range.
   */
  it('Crossover point calculation behavior', () => {
    const soleProp = calculateSolePropScenario({
      businessProfit: 200000,
      otherIncome: 0,
    });

    const sdnBhd = calculateSdnBhdScenario({
      businessProfit: 200000,
      monthlySalary: 5000,
      otherIncome: 0,
      complianceCosts: 3000, // Lower compliance to enable potential crossover
    });

    const comparison = compareScenarios(soleProp, sdnBhd, 200000, {
      businessProfit: 200000,
      monthlySalary: 5000,
      otherIncome: 0,
      complianceCosts: 3000,
    });

    // Crossover may or may not exist depending on inputs
    // This test verifies the calculation completes without error
    // and if crossover exists, it's within reasonable bounds
    if (comparison.crossoverPointProfit !== null) {
      expect(comparison.crossoverPointProfit).toBeGreaterThan(0);
      expect(comparison.crossoverPointProfit).toBeLessThan(2000000);
    }
    // Comparison should always return a valid result
    expect(['soleProp', 'sdnBhd', 'similar']).toContain(comparison.whichIsBetter);
  });

  /**
   * Scenario: Similar scenarios
   *
   * Expected:
   * - At certain profit levels, both scenarios are within RM3k threshold
   * - "similar" recommendation when difference is small
   */
  it('Similar scenarios detection', () => {
    // Test with settings that produce similar results
    const soleProp = calculateSolePropScenario({
      businessProfit: 150000,
      otherIncome: 0,
    });

    const sdnBhd = calculateSdnBhdScenario({
      businessProfit: 150000,
      monthlySalary: 5000,
      otherIncome: 0,
      complianceCosts: 5000,
    });

    const comparison = compareScenarios(soleProp, sdnBhd, 150000, {
      businessProfit: 150000,
      monthlySalary: 5000,
      otherIncome: 0,
      complianceCosts: 5000,
    });

    // At mid-range profits, scenarios may be similar
    // The key test is that the difference is calculated correctly
    expect(comparison.difference).toBeDefined();
    expect(comparison.savingsIfSwitch).toBeDefined();

    // If difference is within RM3k, should be marked as similar
    if (Math.abs(comparison.difference) < 3000) {
      expect(comparison.whichIsBetter).toBe('similar');
    }
  });
});

describe('Tax Bracket Verification', () => {
  /**
   * Verify personal tax bracket boundaries
   */
  it('Personal tax at bracket boundaries', () => {
    // At RM5,000 taxable (0% bracket boundary)
    const at5k = calculateSolePropScenario({
      businessProfit: 5000 + 9000, // +9k relief
      otherIncome: 0,
      reliefs: { basic: 9000, epfAndLifeInsurance: 0, medical: 0 },
    });
    expect(at5k.personalTax).toBe(0);

    // At RM20,000 taxable (1% bracket boundary)
    const at20k = calculateSolePropScenario({
      businessProfit: 20000 + 9000,
      otherIncome: 0,
      reliefs: { basic: 9000, epfAndLifeInsurance: 0, medical: 0 },
    });
    // Tax: RM0 (0-5k) + RM150 (1% on 15k) = RM150
    expect(at20k.personalTax).toBe(150);

    // At RM100,000 taxable (25% bracket starts)
    const at100k = calculateSolePropScenario({
      businessProfit: 100000 + 9000,
      otherIncome: 0,
      reliefs: { basic: 9000, epfAndLifeInsurance: 0, medical: 0 },
    });
    // Tax should be exactly at the 25% threshold
    // RM0 + RM150 + RM450 + RM900 + RM2,200 + RM5,700 = RM9,400
    expect(at100k.personalTax).toBe(9400);
  });

  /**
   * Verify corporate SME tax brackets
   */
  it('Corporate tax at bracket boundaries', () => {
    // At RM150,000 (15% bracket boundary)
    const at150k = calculateSdnBhdScenario({
      businessProfit: 150000,
      monthlySalary: 0,
      otherIncome: 0,
      complianceCosts: 0,
    });
    // Tax: 15% of RM150k = RM22,500
    expect(at150k.corporateTax).toBe(22500);

    // At RM600,000 (17% bracket boundary)
    const at600k = calculateSdnBhdScenario({
      businessProfit: 600000,
      monthlySalary: 0,
      otherIncome: 0,
      complianceCosts: 0,
    });
    // Tax: RM22,500 (15% on first 150k) + RM76,500 (17% on next 450k) = RM99,000
    expect(at600k.corporateTax).toBe(99000);
  });
});
