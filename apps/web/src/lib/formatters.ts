/**
 * Shared formatting utilities for consistent display across the application
 */

/**
 * Format a number as Malaysian Ringgit currency
 * Uses compact notation (M, B) for very large numbers to prevent UI overflow
 *
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted string like "RM123,456.78" or "RM1.5M" for large values
 */
export function formatRM(
  amount: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSign?: boolean;
    compact?: boolean;
  } = {}
): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSign = false,
    compact = false,
  } = options;

  // Safeguard against NaN/Infinity
  if (!isFinite(amount)) {
    return 'RM0.00';
  }

  const absAmount = Math.abs(amount);
  const sign = showSign && amount !== 0 ? (amount > 0 ? '+' : '-') : '';

  // Use compact notation for very large numbers
  if (compact || absAmount >= 10_000_000) {
    if (absAmount >= 1_000_000_000) {
      return `${sign}RM${(absAmount / 1_000_000_000).toFixed(2)}B`;
    }
    if (absAmount >= 1_000_000) {
      return `${sign}RM${(absAmount / 1_000_000).toFixed(2)}M`;
    }
  }

  const formatted = absAmount.toLocaleString('en-MY', {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return `${sign}RM${formatted}`;
}

/**
 * Format a tax bracket label for display
 *
 * Examples:
 * - formatBracketLabel(0, 5000, true) => "First RM5,000"
 * - formatBracketLabel(5000, 20000, false) => "Next RM15,000"
 * - formatBracketLabel(600000, null, false) => "Above RM600,000"
 *
 * @param min - Bracket minimum
 * @param max - Bracket maximum (null for no upper limit)
 * @param isFirst - Whether this is the first bracket
 * @returns Formatted bracket label
 */
export function formatBracketLabel(
  min: number,
  max: number | null,
  isFirst: boolean
): string {
  if (isFirst && min === 0) {
    if (max !== null) {
      return `First RM${max.toLocaleString('en-MY')}`;
    }
    return 'All income';
  }

  if (max === null) {
    return `Above RM${min.toLocaleString('en-MY')}`;
  }

  const bracketSize = max - min;
  return `Next RM${bracketSize.toLocaleString('en-MY')}`;
}

/**
 * Format a percentage for display
 *
 * @param rate - The rate as a decimal (e.g., 0.15 for 15%)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string like "15%"
 */
export function formatPercent(rate: number, decimals: number = 0): string {
  return `${(rate * 100).toFixed(decimals)}%`;
}
