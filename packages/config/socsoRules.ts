/**
 * SOCSO (Social Security Organization) Rules for Malaysia
 *
 * SOCSO contributions are mandatory for employees earning ≤ RM6,000/month
 * Optional for employees earning > RM6,000/month
 *
 * Updated: October 2024 - Wage ceiling increased from RM5,000 to RM6,000
 * Source: https://www.perkeso.gov.my/en/rate-of-contribution.html
 *
 * Note: This uses simplified percentage rates for estimation.
 * Actual SOCSO uses a table-based contribution system.
 */

export interface SOCSORates {
  employee: number; // Employee contribution rate
  employer: number; // Employer contribution rate
}

/**
 * Calculate employer SOCSO contribution
 *
 * SOCSO rates vary by salary brackets (simplified for estimation)
 * Updated October 2024: Wage ceiling increased to RM6,000
 *
 * @param monthlySalary - Monthly salary
 * @returns Monthly employer SOCSO contribution
 */
export function calculateEmployerSOCSO(monthlySalary: number): number {
  if (monthlySalary <= 0) return 0;

  // SOCSO is calculated based on salary brackets
  // Simplified: For salary ≤ RM6,000/month, employer contributes ~1.75%
  // For salary > RM6,000/month, SOCSO is optional
  if (monthlySalary <= 6000) {
    return Math.round(monthlySalary * 0.0175 * 100) / 100;
  }

  // Optional for higher salaries - return 0
  return 0;
}

/**
 * Calculate employee SOCSO contribution
 *
 * Updated October 2024: Wage ceiling increased to RM6,000
 *
 * @param monthlySalary - Monthly salary
 * @returns Monthly employee SOCSO contribution
 */
export function calculateEmployeeSOCSO(monthlySalary: number): number {
  if (monthlySalary <= 0) return 0;

  // SOCSO is calculated based on salary brackets
  // Simplified: For salary ≤ RM6,000/month, employee contributes ~0.5%
  // For salary > RM6,000/month, SOCSO is optional
  if (monthlySalary <= 6000) {
    return Math.round(monthlySalary * 0.005 * 100) / 100;
  }

  // Optional for higher salaries - return 0
  return 0;
}

/**
 * SOCSO rates for reference
 * Note: Actual rates vary by salary brackets - this is simplified
 * Updated October 2024: Wage ceiling increased to RM6,000
 */
export const SOCSO_RATES = {
  employer: {
    low: 0.0175, // Approximate for salary ≤ RM6,000/month
    threshold: 6000,
  },
  employee: {
    low: 0.005, // Approximate for salary ≤ RM6,000/month
    threshold: 6000,
  },
} as const;

