import { calculateCorporateTaxFromBrackets } from '@tax-engine/config';
import { roundCurrency, roundPercentage, isNonNegative } from '../utils/rounding';

/**
 * Calculate corporate tax for SME companies
 */
export function calculateCorporateTax(taxableProfit: number): {
  tax: number;
  effectiveRate: number;
} {
  if (!isNonNegative(taxableProfit)) {
    throw new Error('Taxable profit must be a valid non-negative number');
  }

  const tax = calculateCorporateTaxFromBrackets(taxableProfit);
  const effectiveRate = taxableProfit > 0 ? tax / taxableProfit : 0;

  return {
    tax: roundCurrency(tax),
    effectiveRate: roundPercentage(effectiveRate),
  };
}
