import {
  calculatePersonalTaxFromBrackets,
  calculateTotalReliefs,
  getDefaultReliefs,
  type PersonalReliefs,
} from '@tax-engine/config';
import { roundCurrency, roundPercentage, isNonNegative } from '../utils/rounding';

/**
 * Calculate personal income tax
 */
export function calculatePersonalTax(
  totalIncome: number,
  reliefs?: PersonalReliefs
): {
  tax: number;
  effectiveRate: number;
  taxableIncome: number;
  totalReliefs: number;
} {
  if (!isNonNegative(totalIncome)) {
    throw new Error('Total income must be a valid non-negative number');
  }

  const reliefProfile = reliefs ?? getDefaultReliefs();
  const totalReliefs = calculateTotalReliefs(reliefProfile);
  const taxableIncome = Math.max(0, totalIncome - totalReliefs);
  const tax = calculatePersonalTaxFromBrackets(taxableIncome);
  const effectiveRate = totalIncome > 0 ? tax / totalIncome : 0;

  return {
    tax: roundCurrency(tax),
    effectiveRate: roundPercentage(effectiveRate),
    taxableIncome: roundCurrency(taxableIncome),
    totalReliefs,
  };
}

