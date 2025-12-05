/**
 * Constants used throughout the tax calculation engine
 */

/**
 * Similarity threshold for comparing scenarios
 * If the difference is less than this amount, scenarios are considered "similar"
 */
export const SIMILARITY_THRESHOLD = 3000; // RM3,000

/**
 * Default values for calculation inputs
 */
export const DEFAULTS = {
  /** Default monthly salary for Sdn Bhd calculations (RM5,000/month) */
  MONTHLY_SALARY: 5000,
  /** Default annual compliance costs for Sdn Bhd (RM5,000/year) */
  COMPLIANCE_COSTS: 5000,
} as const;

/**
 * SME qualification thresholds
 * Companies exceeding these limits pay standard 24% rate instead of SME rates (15-17%)
 */
export const SME_THRESHOLDS = {
  /** Maximum annual revenue to qualify for SME rates (RM50 million) */
  MAX_REVENUE: 50_000_000,
} as const;

/**
 * Crossover point calculation constants
 * Used for binary search to find the profit level where Enterprise = Sdn Bhd
 */
export const CROSSOVER_CALCULATION = {
  /** Starting profit for search range */
  MIN_PROFIT: 0 as number,
  /** Upper bound for search - RM2M covers most SME scenarios */
  MAX_PROFIT: 2_000_000 as number,
  /** Binary search convergence tolerance in RM - stops when difference < this */
  TOLERANCE: 100 as number,
  /** Maximum binary search iterations - 50 gives precision of RM2M/2^50 ≈ RM0.000002 */
  MAX_ITERATIONS: 50 as number,
  /** Early exit if scenarios differ by < this amount (same as TOLERANCE) */
  EARLY_EXIT_THRESHOLD: 100 as number,
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

