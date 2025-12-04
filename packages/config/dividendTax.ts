/**
 * Malaysia Dividend Tax Rules (YA 2025)
 * 
 * Starting YA 2025, individual taxpayers receiving dividend income exceeding RM100,000
 * annually are subject to an additional 2% tax on the excess amount.
 * 
 * Source: Budget 2025, LHDN Malaysia
 */

/**
 * Calculate dividend tax for individuals (YA 2025)
 * 
 * @param dividendAmount - Total dividend income received
 * @returns Tax amount (2% on excess above RM100,000)
 */
export function calculateDividendTax(dividendAmount: number): number {
  if (dividendAmount <= 100000) {
    return 0;
  }

  const excessAmount = dividendAmount - 100000;
  const tax = excessAmount * 0.02; // 2% on excess

  return Math.round(tax * 100) / 100;
}

/**
 * Dividend tax threshold
 */
export const DIVIDEND_TAX_THRESHOLD = 100000;

/**
 * Dividend tax rate (on excess above threshold)
 */
export const DIVIDEND_TAX_RATE = 0.02; // 2%

