/**
 * Malaysia Personal Income Tax Brackets (YA 2024/2025)
 * Source: LHDN Malaysia
 *
 * Progressive tax brackets - each bracket applies only to income within that range
 * Example: RM25,000 taxable income
 * - RM0-RM5,000: 0% = RM0
 * - RM5,001-RM20,000: 1% = RM150
 * - RM20,001-RM25,000: 3% = RM150
 * Total tax = RM300
 */

import {
  type TaxBracket,
  type TaxBracketBreakdownItem,
  calculateProgressiveTax,
  getProgressiveTaxBreakdown,
} from './progressiveTax';

// Re-export TaxBracket for backward compatibility
export type { TaxBracket };

export const PERSONAL_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 5000, rate: 0 },
  { min: 5000, max: 20000, rate: 0.01 },
  { min: 20000, max: 35000, rate: 0.03 },
  { min: 35000, max: 50000, rate: 0.06 },
  { min: 50000, max: 70000, rate: 0.11 },
  { min: 70000, max: 100000, rate: 0.19 },
  { min: 100000, max: 250000, rate: 0.25 },
  { min: 250000, max: 400000, rate: 0.26 },
  { min: 400000, max: 600000, rate: 0.28 },
  { min: 600000, max: null, rate: 0.3 },
];

/**
 * Calculate personal tax using progressive brackets
 */
export function calculatePersonalTaxFromBrackets(taxableIncome: number): number {
  return calculateProgressiveTax(taxableIncome, PERSONAL_TAX_BRACKETS);
}

/**
 * Tax bracket breakdown with personal-tax-specific field names
 */
export interface PersonalTaxBracketBreakdownItem {
  bracketMin: number;
  bracketMax: number | null;
  rate: number;
  incomeInBracket: number;
  taxForBracket: number;
}

// Re-export for backward compatibility
export type { TaxBracketBreakdownItem };

/**
 * Get detailed breakdown of how personal tax is calculated across brackets
 * Shows exactly how much income falls into each tier and the tax for each
 */
export function getPersonalTaxBracketBreakdown(
  taxableIncome: number
): PersonalTaxBracketBreakdownItem[] {
  const breakdown = getProgressiveTaxBreakdown(taxableIncome, PERSONAL_TAX_BRACKETS);

  // Map to personal-tax-specific field names for backward compatibility
  return breakdown.map((item: TaxBracketBreakdownItem) => ({
    bracketMin: item.bracketMin,
    bracketMax: item.bracketMax,
    rate: item.rate,
    incomeInBracket: item.amountInBracket,
    taxForBracket: item.taxForBracket,
  }));
}

/**
 * Reverse calculation: Given a target net cash, find the required gross income
 *
 * Uses binary search since the relationship between income and net cash is monotonic.
 *
 * @param targetNetCash - Desired annual net cash after tax
 * @param totalReliefs - Total personal reliefs to apply
 * @returns Required gross income (business profit + other income)
 */
export function calculateRequiredIncomeForNetCash(
  targetNetCash: number,
  totalReliefs: number = 9000 // Default individual relief
): number {
  if (targetNetCash <= 0) return 0;

  // Binary search bounds
  let low = targetNetCash;
  let high = targetNetCash * 2;

  const tolerance = 1; // RM1 tolerance for convergence

  // Ensure high is enough for high tax scenarios
  const testHigh = high - calculatePersonalTaxFromBrackets(Math.max(0, high - totalReliefs));
  if (testHigh < targetNetCash) {
    high = targetNetCash * 3;
  }

  // Binary search
  let iterations = 0;
  const maxIterations = 50;

  while (high - low > tolerance && iterations < maxIterations) {
    const mid = (low + high) / 2;
    const taxableIncome = Math.max(0, mid - totalReliefs);
    const tax = calculatePersonalTaxFromBrackets(taxableIncome);
    const netCash = mid - tax;

    if (netCash < targetNetCash) {
      low = mid;
    } else {
      high = mid;
    }
    iterations++;
  }

  return Math.round((low + high) / 2);
}
