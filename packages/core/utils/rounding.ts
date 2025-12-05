/**
 * Utility functions for rounding financial values
 */

/**
 * Round a number to currency precision (2 decimal places)
 * Using direct multipliers for clarity and performance
 */
export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Round a number to percentage precision (4 decimal places)
 * Using direct multipliers for clarity and performance
 */
export function roundPercentage(value: number): number {
  return Math.round(value * 10000) / 10000;
}

/**
 * Safely check if a number is valid and finite
 */
export function isValidNumber(value: number): boolean {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

/**
 * Safely check if a number is non-negative
 */
export function isNonNegative(value: number): boolean {
  return isValidNumber(value) && value >= 0;
}

