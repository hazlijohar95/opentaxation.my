/**
 * Utility functions for rounding financial values
 */

import { ROUNDING } from '../constants';

/**
 * Round a number to currency precision (2 decimal places)
 */
export function roundCurrency(value: number): number {
  return Math.round(value * Math.pow(10, ROUNDING.CURRENCY)) / Math.pow(10, ROUNDING.CURRENCY);
}

/**
 * Round a number to percentage precision (4 decimal places)
 */
export function roundPercentage(value: number): number {
  return Math.round(value * Math.pow(10, ROUNDING.PERCENTAGE)) / Math.pow(10, ROUNDING.PERCENTAGE);
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

