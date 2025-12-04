/**
 * Generic Progressive Tax Calculator
 *
 * This utility provides a reusable implementation for calculating
 * progressive (tiered) taxes used by both personal and corporate tax systems.
 */

/**
 * Generic tax bracket definition
 */
export interface TaxBracket {
  min: number;
  max: number | null; // null means no upper limit
  rate: number;
}

/**
 * Breakdown item showing how income is taxed in each tier
 */
export interface TaxBracketBreakdownItem {
  bracketMin: number;
  bracketMax: number | null;
  rate: number;
  amountInBracket: number; // Generic name for income/profit in bracket
  taxForBracket: number;
}

/**
 * Result of a tax calculation
 */
export interface ProgressiveTaxResult {
  tax: number;
  breakdown: TaxBracketBreakdownItem[];
}

/**
 * Calculate tax using progressive brackets
 *
 * This function correctly calculates progressive tax by:
 * 1. Determining how much taxable amount falls in each bracket
 * 2. Applying the bracket rate only to the amount within that bracket
 * 3. Summing all bracket taxes
 *
 * @param taxableAmount - The taxable income or profit
 * @param brackets - The tax brackets to apply
 * @returns Total tax rounded to 2 decimal places
 */
export function calculateProgressiveTax(
  taxableAmount: number,
  brackets: readonly TaxBracket[]
): number {
  if (taxableAmount <= 0) return 0;

  let tax = 0;
  let remaining = taxableAmount;

  for (const bracket of brackets) {
    if (remaining <= bracket.min) break;

    const bracketMax = bracket.max ?? Infinity;

    // Calculate how much falls in this bracket
    const amountInBracket = Math.min(
      remaining - bracket.min,
      bracketMax - bracket.min
    );

    if (amountInBracket > 0) {
      tax += amountInBracket * bracket.rate;
    }
  }

  return Math.round(tax * 100) / 100;
}

/**
 * Get detailed breakdown of how tax is calculated across brackets
 *
 * Shows exactly how much taxable amount falls into each tier
 * and the tax calculated for each.
 *
 * @param taxableAmount - The taxable income or profit
 * @param brackets - The tax brackets to apply
 * @returns Array of breakdown items for each applicable bracket
 */
export function getProgressiveTaxBreakdown(
  taxableAmount: number,
  brackets: readonly TaxBracket[]
): TaxBracketBreakdownItem[] {
  if (taxableAmount <= 0) return [];

  const breakdown: TaxBracketBreakdownItem[] = [];
  let remaining = taxableAmount;

  for (const bracket of brackets) {
    if (remaining <= bracket.min) break;

    const bracketMax = bracket.max ?? Infinity;

    // Calculate how much falls in this bracket
    const amountInBracket = Math.min(
      remaining - bracket.min,
      bracketMax - bracket.min
    );

    if (amountInBracket > 0) {
      const taxForBracket = Math.round(amountInBracket * bracket.rate * 100) / 100;

      breakdown.push({
        bracketMin: bracket.min,
        bracketMax: bracket.max,
        rate: bracket.rate,
        amountInBracket: Math.round(amountInBracket * 100) / 100,
        taxForBracket,
      });
    }
  }

  return breakdown;
}

/**
 * Calculate both tax and breakdown in a single pass
 *
 * More efficient when you need both the total tax and the breakdown.
 *
 * @param taxableAmount - The taxable income or profit
 * @param brackets - The tax brackets to apply
 * @returns Object containing total tax and breakdown array
 */
export function calculateProgressiveTaxWithBreakdown(
  taxableAmount: number,
  brackets: readonly TaxBracket[]
): ProgressiveTaxResult {
  if (taxableAmount <= 0) {
    return { tax: 0, breakdown: [] };
  }

  const breakdown: TaxBracketBreakdownItem[] = [];
  let tax = 0;
  let remaining = taxableAmount;

  for (const bracket of brackets) {
    if (remaining <= bracket.min) break;

    const bracketMax = bracket.max ?? Infinity;

    const amountInBracket = Math.min(
      remaining - bracket.min,
      bracketMax - bracket.min
    );

    if (amountInBracket > 0) {
      const taxForBracket = Math.round(amountInBracket * bracket.rate * 100) / 100;
      tax += taxForBracket;

      breakdown.push({
        bracketMin: bracket.min,
        bracketMax: bracket.max,
        rate: bracket.rate,
        amountInBracket: Math.round(amountInBracket * 100) / 100,
        taxForBracket,
      });
    }
  }

  return {
    tax: Math.round(tax * 100) / 100,
    breakdown,
  };
}
