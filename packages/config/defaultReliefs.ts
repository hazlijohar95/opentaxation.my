/**
 * Default Personal Tax Reliefs (Malaysia)
 * Common reliefs for individuals
 * 
 * Source: LHDN Malaysia - YA 2024/2025
 */

export interface PersonalReliefs {
  basic: number; // Basic relief (RM9,000)
  epfAndLifeInsurance: number; // EPF + Life Insurance (combined max RM7,000)
  medical: number; // Medical insurance/expenses (RM8,000)
  spouse?: number; // Spouse relief (RM4,000 if spouse has no income)
  children?: number; // Children relief (RM2,000 per child, max varies)
  education?: number; // Education/medical expenses for children
  [key: string]: number | undefined; // Allow for additional reliefs
}

/**
 * Default reliefs used in calculations
 * Based on common reliefs for typical taxpayers
 * 
 * - Basic relief: RM9,000 (mandatory)
 * - EPF/Life Insurance: RM7,000 (max combined)
 * - Medical: RM8,000
 * 
 * Note: Other reliefs (spouse, children, etc.) can be added but are not included
 * in default calculation as they vary by individual circumstances
 */
export const DEFAULT_RELIEFS: PersonalReliefs = {
  basic: 9000,
  epfAndLifeInsurance: 7000,
  medical: 8000,
};

/**
 * Calculate total reliefs from relief profile
 * 
 * @param reliefs - Relief profile object
 * @returns Total relief amount
 */
export function calculateTotalReliefs(reliefs: PersonalReliefs): number {
  return Object.values(reliefs).reduce((sum: number, value) => {
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
}

/**
 * Get default reliefs (can be overridden by user input)
 * 
 * @returns Default relief profile
 */
export function getDefaultReliefs(): PersonalReliefs {
  return { ...DEFAULT_RELIEFS };
}

/**
 * Common relief limits for reference
 */
export const RELIEF_LIMITS = {
  basic: 9000,
  epfAndLifeInsurance: 7000, // Combined max
  medical: 8000,
  spouse: 4000, // If spouse has no income
  children: 2000, // Per child (varies by age/status)
  education: 8000, // Per child
} as const;
