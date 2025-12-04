import type {
  ComparisonResult,
  SolePropScenarioResult,
  SdnBhdScenarioResult,
  TaxCalculationInputs,
} from '../types';
import { calculateSolePropScenario } from './calculateSolePropScenario';
import { calculateSdnBhdScenario } from './calculateSdnBhdScenario';
import { SIMILARITY_THRESHOLD, CROSSOVER_CALCULATION } from '../constants';

/**
 * Compare Sole Prop vs Sdn Bhd scenarios
 */
export function compareScenarios(
  solePropResult: SolePropScenarioResult,
  sdnBhdResult: SdnBhdScenarioResult,
  businessProfit: number,
  inputs: TaxCalculationInputs
): ComparisonResult {
  const difference = sdnBhdResult.netCash - solePropResult.netCash;
  const savingsIfSwitch = Math.abs(difference);

  // Check for salary affordability issues
  const hasAffordabilityIssue = sdnBhdResult.salaryAffordability.companyWouldBeInsolvent;
  const warnings: string[] = [];

  if (hasAffordabilityIssue) {
    const maxMonthly = Math.round(sdnBhdResult.salaryAffordability.maxAffordableSalary / 12);
    warnings.push(
      `Your proposed salary exceeds what the company can afford. ` +
      `The company would need an additional RM${sdnBhdResult.salaryAffordability.shortfall.toLocaleString('en-MY')} ` +
      `to pay this salary. Maximum affordable salary: RM${maxMonthly.toLocaleString('en-MY')}/month.`
    );
  }

  // Check for SME qualification issues
  // Company doesn't qualify for SME rates (15-17%) if:
  // - Revenue > RM50M (checked via auditCriteria.revenue)
  // - ≥20% foreign ownership (checked via hasForeignOwnership flag)
  const hasSmeQualificationIssue = Boolean(
    inputs.hasForeignOwnership ||
    (inputs.auditCriteria && inputs.auditCriteria.revenue > 50_000_000)
  );

  if (hasSmeQualificationIssue) {
    if (inputs.hasForeignOwnership) {
      warnings.push(
        `Your company may not qualify for SME tax rates (15-17%) due to foreign ownership. ` +
        `Companies with ≥20% foreign ownership pay a flat 24% corporate tax rate. ` +
        `The Sdn Bhd calculation shown assumes SME rates - actual tax may be higher.`
      );
    } else if (inputs.auditCriteria && inputs.auditCriteria.revenue > 50_000_000) {
      warnings.push(
        `Your company may not qualify for SME tax rates (15-17%) due to high revenue. ` +
        `Companies with revenue above RM50M pay a flat 24% corporate tax rate. ` +
        `The Sdn Bhd calculation shown assumes SME rates - actual tax may be higher.`
      );
    }
  }

  let whichIsBetter: 'soleProp' | 'sdnBhd' | 'similar';
  let recommendation: string;

  if (Math.abs(difference) < SIMILARITY_THRESHOLD) {
    whichIsBetter = 'similar';
    recommendation = `Both structures are similar at your current profit. The difference is only RM${savingsIfSwitch.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`;
  } else if (difference > 0) {
    whichIsBetter = 'sdnBhd';
    recommendation = `Better to switch to Sdn Bhd now. You'll save RM${savingsIfSwitch.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per year compared to staying as Enterprise.`;
  } else {
    whichIsBetter = 'soleProp';
    recommendation = `Better to stay as Enterprise. You save RM${savingsIfSwitch.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} compared to switching to Sdn Bhd.`;
  }

  // Override recommendation if there's an affordability issue
  if (hasAffordabilityIssue) {
    recommendation = `Warning: The Sdn Bhd scenario is not viable because your proposed salary exceeds the company's capacity. ` +
      `Consider reducing salary to RM${Math.round(sdnBhdResult.salaryAffordability.maxAffordableSalary / 12).toLocaleString('en-MY')}/month or less.`;
    // Don't recommend Sdn Bhd if it's insolvent
    if (whichIsBetter === 'sdnBhd') {
      whichIsBetter = 'soleProp';
    }
  }

  // Calculate crossover point (profit level where both scenarios are equal)
  const crossoverPointProfit = calculateCrossoverPoint(inputs, businessProfit);

  return {
    whichIsBetter,
    difference: Math.round(difference * 100) / 100,
    savingsIfSwitch: Math.round(savingsIfSwitch * 100) / 100,
    crossoverPointProfit,
    recommendation,
    solePropResult,
    sdnBhdResult,
    hasAffordabilityIssue,
    hasSmeQualificationIssue,
    warnings,
  };
}

// Cache for crossover point calculations to avoid redundant computations
const crossoverCache = new Map<string, number | null>();
const CACHE_MAX_SIZE = 50;

/**
 * Generate cache key from inputs (excluding businessProfit)
 */
function getCacheKey(inputs: TaxCalculationInputs): string {
  return JSON.stringify({
    otherIncome: inputs.otherIncome || 0,
    monthlySalary: inputs.monthlySalary || 5000,
    complianceCosts: inputs.complianceCosts || 5000,
    auditCost: inputs.auditCost || 0,
    auditCriteria: inputs.auditCriteria,
    reliefs: inputs.reliefs,
    applyYa2025DividendSurcharge: inputs.applyYa2025DividendSurcharge || false,
    dividendDistributionPercent: inputs.dividendDistributionPercent ?? 100,
    zakat: inputs.zakat,
  });
}

/**
 * Calculate crossover point where both scenarios result in equal net cash
 * Uses binary search to find the profit level where Enterprise and Sdn Bhd are equal
 * Results are memoized based on input parameters (excluding businessProfit)
 * 
 * @param inputs - Tax calculation inputs (excluding businessProfit which we'll vary)
 * @param currentProfit - Current business profit level
 * @returns Crossover profit point, or null if not found within reasonable range
 */
function calculateCrossoverPoint(
  inputs: TaxCalculationInputs,
  currentProfit: number
): number | null {
  // Check cache first
  const cacheKey = getCacheKey(inputs);
  if (crossoverCache.has(cacheKey)) {
    return crossoverCache.get(cacheKey)!;
  }
  // If they're already very similar, return current profit
  const currentSoleProp = calculateSolePropScenario({
    businessProfit: currentProfit,
    otherIncome: inputs.otherIncome || 0,
    reliefs: inputs.reliefs,
    zakat: inputs.zakat,
  });

  const currentSdnBhd = calculateSdnBhdScenario({
    businessProfit: currentProfit,
    monthlySalary: inputs.monthlySalary || 5000,
    otherIncome: inputs.otherIncome || 0,
    complianceCosts: inputs.complianceCosts || 5000,
    auditCost: inputs.auditCost,
    auditCriteria: inputs.auditCriteria,
    reliefs: inputs.reliefs,
    applyYa2025DividendSurcharge: inputs.applyYa2025DividendSurcharge,
    dividendDistributionPercent: inputs.dividendDistributionPercent,
    zakat: inputs.zakat,
  });

  const currentDiff = Math.abs(currentSdnBhd.netCash - currentSoleProp.netCash);
  if (currentDiff < CROSSOVER_CALCULATION.EARLY_EXIT_THRESHOLD) {
    return Math.round(currentProfit);
  }

  // Binary search for crossover point
  let minProfit = CROSSOVER_CALCULATION.MIN_PROFIT;
  let maxProfit = CROSSOVER_CALCULATION.MAX_PROFIT;
  const tolerance = CROSSOVER_CALCULATION.TOLERANCE;
  const maxIterations = CROSSOVER_CALCULATION.MAX_ITERATIONS;
  let iterations = 0;

  // Check if there's a crossover point in the search range
  const minSoleProp = calculateSolePropScenario({
    businessProfit: minProfit,
    otherIncome: inputs.otherIncome || 0,
    reliefs: inputs.reliefs,
    zakat: inputs.zakat,
  });

  const minSdnBhd = calculateSdnBhdScenario({
    businessProfit: minProfit,
    monthlySalary: inputs.monthlySalary || 5000,
    otherIncome: inputs.otherIncome || 0,
    complianceCosts: inputs.complianceCosts || 5000,
    auditCost: inputs.auditCost,
    auditCriteria: inputs.auditCriteria,
    reliefs: inputs.reliefs,
    applyYa2025DividendSurcharge: inputs.applyYa2025DividendSurcharge,
    dividendDistributionPercent: inputs.dividendDistributionPercent,
    zakat: inputs.zakat,
  });

  const maxSoleProp = calculateSolePropScenario({
    businessProfit: maxProfit,
    otherIncome: inputs.otherIncome || 0,
    reliefs: inputs.reliefs,
    zakat: inputs.zakat,
  });

  const maxSdnBhd = calculateSdnBhdScenario({
    businessProfit: maxProfit,
    monthlySalary: inputs.monthlySalary || 5000,
    otherIncome: inputs.otherIncome || 0,
    complianceCosts: inputs.complianceCosts || 5000,
    auditCost: inputs.auditCost,
    auditCriteria: inputs.auditCriteria,
    reliefs: inputs.reliefs,
    applyYa2025DividendSurcharge: inputs.applyYa2025DividendSurcharge,
    dividendDistributionPercent: inputs.dividendDistributionPercent,
    zakat: inputs.zakat,
  });

  // Check if crossover exists (sign change in difference)
  const minDiff = minSdnBhd.netCash - minSoleProp.netCash;
  const maxDiff = maxSdnBhd.netCash - maxSoleProp.netCash;

  // If both ends have same sign, no crossover in this range
  if ((minDiff > 0 && maxDiff > 0) || (minDiff < 0 && maxDiff < 0)) {
    return null;
  }

  // Binary search for crossover point
  while (iterations < maxIterations && (maxProfit - minProfit) > tolerance) {
    const midProfit = (minProfit + maxProfit) / 2;

    const midSoleProp = calculateSolePropScenario({
      businessProfit: midProfit,
      otherIncome: inputs.otherIncome || 0,
      reliefs: inputs.reliefs,
      zakat: inputs.zakat,
    });

    const midSdnBhd = calculateSdnBhdScenario({
      businessProfit: midProfit,
      monthlySalary: inputs.monthlySalary || 5000,
      otherIncome: inputs.otherIncome || 0,
      complianceCosts: inputs.complianceCosts || 5000,
      auditCost: inputs.auditCost,
      auditCriteria: inputs.auditCriteria,
      reliefs: inputs.reliefs,
      applyYa2025DividendSurcharge: inputs.applyYa2025DividendSurcharge,
      dividendDistributionPercent: inputs.dividendDistributionPercent,
      zakat: inputs.zakat,
    });

    const midDiff = midSdnBhd.netCash - midSoleProp.netCash;

    if (Math.abs(midDiff) < tolerance) {
      return Math.round(midProfit);
    }

    // Determine which side to search
    if ((minDiff > 0 && midDiff > 0) || (minDiff < 0 && midDiff < 0)) {
      minProfit = midProfit;
    } else {
      maxProfit = midProfit;
    }

    iterations++;
  }

  // Return midpoint if we converged
  let result: number | null = null;
  if (iterations < maxIterations) {
    result = Math.round((minProfit + maxProfit) / 2);
  }

  // Cache the result (with size limit)
  if (crossoverCache.size >= CACHE_MAX_SIZE) {
    const firstKey = crossoverCache.keys().next().value;
    if (firstKey !== undefined) {
      crossoverCache.delete(firstKey);
    }
  }
  crossoverCache.set(cacheKey, result);

  return result;
}
