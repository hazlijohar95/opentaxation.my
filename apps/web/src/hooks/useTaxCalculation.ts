import { useMemo } from 'react';
import {
  calculateSolePropScenario,
  calculateSdnBhdScenario,
  compareScenarios,
  type TaxCalculationInputs,
  type ComparisonResult,
} from '@tax-engine/core';

/**
 * Custom hook for tax calculations
 * Uses useMemo with primitive dependencies to avoid unnecessary recalculations
 * 
 * Per React best practices: https://react.dev/learn/you-might-not-need-an-effect
 * - Calculates expensive computations during render (not in Effects)
 * - Uses useMemo to cache results based on primitive dependencies
 */
export function useTaxCalculation(inputs: TaxCalculationInputs): ComparisonResult | null {
  // Use primitive values in dependency array instead of the object
  // This ensures memoization works correctly
  // Extract reliefs values for dependency array
  // Using individual properties ensures proper memoization
  const reliefs = inputs.reliefs;
  const reliefsKey = reliefs
    ? `${reliefs.basic || 0}-${reliefs.epfAndLifeInsurance || 0}-${reliefs.medical || 0}-${reliefs.spouse || 0}-${reliefs.children || 0}-${reliefs.education || 0}`
    : '';

  return useMemo(() => {
    if (!inputs.businessProfit && inputs.businessProfit !== 0) {
      return null;
    }

    const solePropResult = calculateSolePropScenario({
      businessProfit: inputs.businessProfit,
      otherIncome: inputs.otherIncome || 0,
      reliefs: inputs.reliefs,
    });

    const sdnBhdResult = calculateSdnBhdScenario({
      businessProfit: inputs.businessProfit,
      monthlySalary: inputs.monthlySalary || 5000,
      otherIncome: inputs.otherIncome || 0,
      complianceCosts: inputs.complianceCosts || 5000,
      auditCost: inputs.auditCost,
      auditCriteria: inputs.auditCriteria,
      reliefs: inputs.reliefs,
      applyYa2025DividendSurcharge: inputs.applyYa2025DividendSurcharge,
      dividendDistributionPercent: inputs.dividendDistributionPercent,
    });

    return compareScenarios(solePropResult, sdnBhdResult, inputs.businessProfit, inputs);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Using primitive values intentionally to avoid unnecessary recalculations from object reference changes
  }, [
    inputs.businessProfit,
    inputs.otherIncome,
    inputs.monthlySalary,
    inputs.complianceCosts,
    inputs.auditCost,
    inputs.auditCriteria?.revenue,
    inputs.auditCriteria?.totalAssets,
    inputs.auditCriteria?.employees,
    reliefsKey, // Use serialized reliefs instead of object reference
    inputs.applyYa2025DividendSurcharge,
    inputs.dividendDistributionPercent,
  ]);
}

