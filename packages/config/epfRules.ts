/**
 * EPF (Employees Provident Fund) Rules for Malaysia
 * 
 * Rates verified as of 2024/2025
 * Source: EPF Act 1991, EPF Malaysia
 */

/**
 * Calculate employer EPF contribution
 * - Salary ≤ RM5,000/month: 13%
 * - Salary > RM5,000/month: 12%
 * 
 * Note: EPF is calculated on monthly salary, but we use annual salary for convenience
 * and apply the rate based on monthly equivalent
 */
export function calculateEmployerEPF(annualSalary: number): number {
  if (annualSalary <= 0) return 0;
  
  const monthlySalary = annualSalary / 12;
  const rate = monthlySalary <= 5000 ? 0.13 : 0.12;
  
  return Math.round(annualSalary * rate * 100) / 100;
}

/**
 * Calculate employee EPF contribution
 * - Employee contribution: 11% of salary
 * 
 * Note: Employee can opt for lower rate (minimum 8%) but 11% is standard
 */
export function calculateEmployeeEPF(annualSalary: number): number {
  if (annualSalary <= 0) return 0;
  
  return Math.round(annualSalary * 0.11 * 100) / 100;
}

/**
 * EPF rates for reference
 */
export const EPF_RATES = {
  employer: {
    low: 0.13, // For salary ≤ RM5,000/month
    high: 0.12, // For salary > RM5,000/month
    threshold: 5000, // Monthly threshold
  },
  employee: 0.11, // Standard employee contribution rate
} as const;

/**
 * Calculate maximum affordable annual salary given business profit
 *
 * This is the salary where: salary + employer EPF = businessProfit exactly
 * Formula: maxSalary = businessProfit / (1 + employerEPFRate)
 *
 * Note: EPF rate depends on salary level, so we need to check which rate applies
 */
export function calculateMaxAffordableSalary(businessProfit: number): number {
  if (businessProfit <= 0) return 0;

  // First try with lower EPF rate (12% for salary > RM5k/month)
  // maxSalary = businessProfit / (1 + 0.12) = businessProfit / 1.12
  const maxWithLowerRate = businessProfit / 1.12;
  const monthlyWithLowerRate = maxWithLowerRate / 12;

  // If monthly salary would be > RM5,000, the 12% rate applies
  if (monthlyWithLowerRate > EPF_RATES.employer.threshold) {
    return Math.round(maxWithLowerRate * 100) / 100;
  }

  // Otherwise, use higher rate (13% for salary <= RM5k/month)
  // maxSalary = businessProfit / (1 + 0.13) = businessProfit / 1.13
  return Math.round((businessProfit / 1.13) * 100) / 100;
}
