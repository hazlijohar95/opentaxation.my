/**
 * Constants used throughout the tax calculation engine
 */

/**
 * Similarity threshold for comparing scenarios
 * If the difference is less than this amount, scenarios are considered "similar"
 */
export const SIMILARITY_THRESHOLD = 3000; // RM3,000

/**
 * Crossover point calculation constants
 */
export const CROSSOVER_CALCULATION = {
  MIN_PROFIT: 0 as number,
  MAX_PROFIT: 2_000_000 as number, // RM2M reasonable upper bound
  TOLERANCE: 100 as number, // RM100 tolerance
  MAX_ITERATIONS: 50 as number,
  EARLY_EXIT_THRESHOLD: 100 as number, // If difference < RM100, consider equal
};

/**
 * Salary validation constants
 * Note: We no longer enforce max salary as percentage of profit
 * because salary exceeding profit is a valid scenario (company loss)
 */
export const SALARY_VALIDATION = {
  // Removed MAX_PERCENTAGE_OF_PROFIT - salary can exceed profit
} as const;

/**
 * Rounding precision
 */
export const ROUNDING = {
  CURRENCY: 2, // 2 decimal places for currency
  PERCENTAGE: 4, // 4 decimal places for percentages
} as const;

