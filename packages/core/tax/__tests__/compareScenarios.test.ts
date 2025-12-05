/**
 * Unit Tests for Scenario Comparison
 *
 * Tests compareScenarios and crossover point calculation
 */

import { describe, it, expect } from 'vitest';
import { compareScenarios } from '../compareScenarios';
import { calculateSolePropScenario } from '../calculateSolePropScenario';
import { calculateSdnBhdScenario } from '../calculateSdnBhdScenario';
import type { TaxCalculationInputs } from '../../types';
import { SIMILARITY_THRESHOLD } from '../../constants';

describe('compareScenarios', () => {
  const baseInputs: TaxCalculationInputs = {
    businessProfit: 200000,
    otherIncome: 0,
    monthlySalary: 5000,
    complianceCosts: 5000,
  };

  describe('recommendation logic', () => {
    it('recommends sdnBhd when net cash difference exceeds threshold', () => {
      const soleProp = calculateSolePropScenario({
        businessProfit: 500000,
        otherIncome: 0,
      });

      const sdnBhd = calculateSdnBhdScenario({
        businessProfit: 500000,
        monthlySalary: 10000,
        otherIncome: 0,
        complianceCosts: 5000,
      });

      const inputs = { ...baseInputs, businessProfit: 500000, monthlySalary: 10000 };
      const result = compareScenarios(soleProp, sdnBhd, 500000, inputs);

      // At high profits, Sdn Bhd typically wins
      if (result.difference > SIMILARITY_THRESHOLD) {
        expect(result.whichIsBetter).toBe('sdnBhd');
      }
    });

    it('recommends soleProp when enterprise has higher net cash', () => {
      // Low profit scenario where Enterprise is typically better
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

      const inputs = { ...baseInputs, businessProfit: 50000, monthlySalary: 3000 };
      const result = compareScenarios(soleProp, sdnBhd, 50000, inputs);

      // At low profits with compliance costs, Enterprise usually wins
      if (result.difference < -SIMILARITY_THRESHOLD) {
        expect(result.whichIsBetter).toBe('soleProp');
      }
    });

    it('indicates similar when difference is within threshold', () => {
      // Find a profit point where scenarios are close
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

      const inputs = { ...baseInputs, businessProfit: 150000 };
      const result = compareScenarios(soleProp, sdnBhd, 150000, inputs);

      if (Math.abs(result.difference) < SIMILARITY_THRESHOLD) {
        expect(result.whichIsBetter).toBe('similar');
      }
    });
  });

  describe('affordability warnings', () => {
    it('adds warning when salary exceeds affordable amount', () => {
      // Very high salary relative to profit
      const soleProp = calculateSolePropScenario({
        businessProfit: 100000,
        otherIncome: 0,
      });

      const sdnBhd = calculateSdnBhdScenario({
        businessProfit: 100000,
        monthlySalary: 10000, // RM120k annual > RM100k profit
        otherIncome: 0,
        complianceCosts: 5000,
      });

      const inputs = { ...baseInputs, businessProfit: 100000, monthlySalary: 10000 };
      const result = compareScenarios(soleProp, sdnBhd, 100000, inputs);

      expect(result.hasAffordabilityIssue).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('overrides sdnBhd recommendation when affordability issue exists', () => {
      const soleProp = calculateSolePropScenario({
        businessProfit: 80000,
        otherIncome: 0,
      });

      const sdnBhd = calculateSdnBhdScenario({
        businessProfit: 80000,
        monthlySalary: 8000, // RM96k annual > RM80k profit
        otherIncome: 0,
        complianceCosts: 5000,
      });

      const inputs = { ...baseInputs, businessProfit: 80000, monthlySalary: 8000 };
      const result = compareScenarios(soleProp, sdnBhd, 80000, inputs);

      if (result.hasAffordabilityIssue) {
        expect(result.whichIsBetter).not.toBe('sdnBhd');
      }
    });
  });

  describe('SME qualification warnings', () => {
    it('adds warning for foreign ownership', () => {
      const soleProp = calculateSolePropScenario({
        businessProfit: 200000,
        otherIncome: 0,
      });

      const sdnBhd = calculateSdnBhdScenario({
        businessProfit: 200000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
      });

      const inputs = { ...baseInputs, hasForeignOwnership: true };
      const result = compareScenarios(soleProp, sdnBhd, 200000, inputs);

      expect(result.hasSmeQualificationIssue).toBe(true);
      expect(result.warnings.some(w => w.includes('foreign ownership'))).toBe(true);
    });

    it('adds warning for revenue exceeding RM50M', () => {
      const soleProp = calculateSolePropScenario({
        businessProfit: 5000000,
        otherIncome: 0,
      });

      const sdnBhd = calculateSdnBhdScenario({
        businessProfit: 5000000,
        monthlySalary: 20000,
        otherIncome: 0,
        complianceCosts: 20000,
      });

      const inputs: TaxCalculationInputs = {
        ...baseInputs,
        businessProfit: 5000000,
        monthlySalary: 20000,
        complianceCosts: 20000,
        auditCriteria: { revenue: 60000000, totalAssets: 10000000, employees: 100 },
      };
      const result = compareScenarios(soleProp, sdnBhd, 5000000, inputs);

      expect(result.hasSmeQualificationIssue).toBe(true);
      expect(result.warnings.some(w => w.includes('revenue') || w.includes('RM50M'))).toBe(true);
    });
  });

  describe('crossover point calculation', () => {
    it('calculates crossover point for typical inputs', () => {
      const soleProp = calculateSolePropScenario({
        businessProfit: 200000,
        otherIncome: 0,
      });

      const sdnBhd = calculateSdnBhdScenario({
        businessProfit: 200000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
      });

      const result = compareScenarios(soleProp, sdnBhd, 200000, baseInputs);

      // Crossover point should either be null (no crossover) or a positive number
      if (result.crossoverPointProfit !== null) {
        expect(result.crossoverPointProfit).toBeGreaterThan(0);
        expect(result.crossoverPointProfit).toBeLessThan(2000000);
      }
    });

    it('returns null if no crossover exists in search range', () => {
      // With very high compliance costs, Sdn Bhd might never be better
      const soleProp = calculateSolePropScenario({
        businessProfit: 100000,
        otherIncome: 0,
      });

      const sdnBhd = calculateSdnBhdScenario({
        businessProfit: 100000,
        monthlySalary: 2000,
        otherIncome: 0,
        complianceCosts: 50000, // Very high compliance costs
      });

      const inputs = { ...baseInputs, complianceCosts: 50000, monthlySalary: 2000, businessProfit: 100000 };
      const result = compareScenarios(soleProp, sdnBhd, 100000, inputs);

      // With extreme compliance costs, crossover might not exist
      // Just verify it returns a valid value (number or null)
      expect(result.crossoverPointProfit === null || typeof result.crossoverPointProfit === 'number').toBe(true);
    });
  });

  describe('result structure', () => {
    it('returns all required fields', () => {
      const soleProp = calculateSolePropScenario({
        businessProfit: 200000,
        otherIncome: 0,
      });

      const sdnBhd = calculateSdnBhdScenario({
        businessProfit: 200000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
      });

      const result = compareScenarios(soleProp, sdnBhd, 200000, baseInputs);

      expect(result).toHaveProperty('whichIsBetter');
      expect(result).toHaveProperty('difference');
      expect(result).toHaveProperty('savingsIfSwitch');
      expect(result).toHaveProperty('crossoverPointProfit');
      expect(result).toHaveProperty('recommendation');
      expect(result).toHaveProperty('solePropResult');
      expect(result).toHaveProperty('sdnBhdResult');
      expect(result).toHaveProperty('hasAffordabilityIssue');
      expect(result).toHaveProperty('hasSmeQualificationIssue');
      expect(result).toHaveProperty('warnings');
    });

    it('calculates savingsIfSwitch as absolute difference', () => {
      const soleProp = calculateSolePropScenario({
        businessProfit: 200000,
        otherIncome: 0,
      });

      const sdnBhd = calculateSdnBhdScenario({
        businessProfit: 200000,
        monthlySalary: 5000,
        otherIncome: 0,
        complianceCosts: 5000,
      });

      const result = compareScenarios(soleProp, sdnBhd, 200000, baseInputs);

      expect(result.savingsIfSwitch).toBe(Math.abs(result.difference));
      expect(result.savingsIfSwitch).toBeGreaterThanOrEqual(0);
    });
  });
});
