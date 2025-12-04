/**
 * Malaysia SME Corporate Tax Brackets
 * For resident companies with revenue < RM50M and meeting shareholding requirements
 *
 * Progressive tax brackets:
 * - First RM150,000: 15%
 * - Next RM450,000 (RM150,001-RM600,000): 17%
 * - Above RM600,000: 24%
 */

import {
  type TaxBracket,
  type TaxBracketBreakdownItem,
  calculateProgressiveTax,
  getProgressiveTaxBreakdown,
} from './progressiveTax';

// Re-export as CorporateTaxBracket for backward compatibility
export type CorporateTaxBracket = TaxBracket;

export const CORPORATE_TAX_BRACKETS: CorporateTaxBracket[] = [
  { min: 0, max: 150000, rate: 0.15 },
  { min: 150000, max: 600000, rate: 0.17 },
  { min: 600000, max: null, rate: 0.24 },
];

/**
 * Calculate corporate tax for SME companies
 */
export function calculateCorporateTaxFromBrackets(taxableProfit: number): number {
  return calculateProgressiveTax(taxableProfit, CORPORATE_TAX_BRACKETS);
}

/**
 * Tax bracket breakdown with corporate-tax-specific field names
 */
export interface CorporateTaxBracketBreakdownItem {
  bracketMin: number;
  bracketMax: number | null;
  rate: number;
  profitInBracket: number;
  taxForBracket: number;
}

/**
 * Get detailed breakdown of how corporate tax is calculated across SME brackets
 * Shows exactly how much profit falls into each tier and the tax for each
 */
export function getCorporateTaxBracketBreakdown(
  taxableProfit: number
): CorporateTaxBracketBreakdownItem[] {
  const breakdown = getProgressiveTaxBreakdown(taxableProfit, CORPORATE_TAX_BRACKETS);

  // Map to corporate-tax-specific field names for backward compatibility
  return breakdown.map((item: TaxBracketBreakdownItem) => ({
    bracketMin: item.bracketMin,
    bracketMax: item.bracketMax,
    rate: item.rate,
    profitInBracket: item.amountInBracket,
    taxForBracket: item.taxForBracket,
  }));
}
