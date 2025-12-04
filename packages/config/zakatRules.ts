/**
 * Malaysian Zakat Rules and Configuration
 *
 * Zakat on income/business is calculated at 2.5% of nisab-eligible amount.
 *
 * TAX TREATMENT:
 * - Individual (Enterprise/Sole Prop): 100% TAX REBATE
 *   Zakat paid to state authorities is a REBATE (direct reduction from tax payable).
 *   Capped at the tax amount itself (cannot create negative tax).
 *   Reference: Section 6A(3) Income Tax Act 1967
 *
 * - Company (Sdn Bhd): 2.5% TAX DEDUCTION
 *   Zakat paid is treated as a DEDUCTION from aggregate income.
 *   Maximum deduction is 2.5% of aggregate income.
 *   Reference: Section 44(11A) Income Tax Act 1967
 *
 * Note: This calculator uses simplified gross income method.
 * For accurate zakat obligations, consult your state zakat authority (e.g., PPZ-MAIWP, MAIS).
 */

/**
 * Zakat rate - standard across all states in Malaysia
 */
export const ZAKAT_RATE = 0.025; // 2.5%

/**
 * Nisab thresholds for 2025
 * Based on 85 grams of gold (24 karat)
 *
 * These are approximate values - actual nisab varies by state and gold price.
 * Users should check their state zakat authority for current nisab.
 */
export const ZAKAT_NISAB_2025 = {
  // Approximate nisab based on RM352.48/gram (average 2024-2025)
  // 85g × RM352.48 = RM29,960.80
  individual: 29961,

  // Business nisab is the same threshold
  business: 29961,
};

/**
 * Zakat calculation method types
 */
export type ZakatCalculationMethod =
  | 'gross_income'      // Simple: 2.5% of gross income (most common for salary)
  | 'net_income'        // After deductions (EPF, expenses, etc.)
  | 'working_capital';  // For business: Current Assets - Current Liabilities

/**
 * Input for zakat calculation
 */
export interface ZakatCalculationInput {
  /** Whether zakat is enabled/paid */
  enabled: boolean;

  /** Amount of zakat paid (if known), or null to auto-calculate */
  amountPaid?: number;

  /** The calculation method used */
  method?: ZakatCalculationMethod;

  /** For net income method: deductions to subtract before calculating zakat */
  deductions?: {
    epf?: number;
    expenses?: number;
    other?: number;
  };
}

/**
 * Result of zakat calculation
 */
export interface ZakatCalculationResult {
  /** Zakat amount payable */
  zakatAmount: number;

  /** Whether income/profit meets nisab threshold */
  meetsNisab: boolean;

  /** The nisab threshold used */
  nisabThreshold: number;

  /** For individuals: Tax rebate amount (100% of zakat, capped at tax payable) */
  taxRebate?: number;

  /** For companies: Tax deduction amount (max 2.5% of aggregate income) */
  taxDeduction?: number;

  /** Net tax impact (reduction in tax payable) */
  netTaxImpact: number;

  /** Calculation method used */
  method: ZakatCalculationMethod;
}

/**
 * Calculate zakat using gross income method
 * Simple: 2.5% of gross income if above nisab
 *
 * @param grossIncome - Total gross income for the year
 * @returns Zakat amount payable
 */
export function calculateZakatGrossIncome(grossIncome: number): number {
  if (grossIncome < ZAKAT_NISAB_2025.individual) {
    return 0;
  }
  return Math.round(grossIncome * ZAKAT_RATE * 100) / 100;
}

/**
 * Calculate zakat using net income method
 * Accounts for deductions like EPF before calculating
 *
 * @param grossIncome - Total gross income
 * @param deductions - Allowable deductions (EPF, expenses)
 * @returns Zakat amount payable
 */
export function calculateZakatNetIncome(
  grossIncome: number,
  deductions: { epf?: number; expenses?: number; other?: number } = {}
): number {
  const totalDeductions = (deductions.epf ?? 0) + (deductions.expenses ?? 0) + (deductions.other ?? 0);
  const netIncome = Math.max(0, grossIncome - totalDeductions);

  if (netIncome < ZAKAT_NISAB_2025.individual) {
    return 0;
  }
  return Math.round(netIncome * ZAKAT_RATE * 100) / 100;
}

/**
 * Calculate individual zakat with tax rebate
 *
 * For individuals (Enterprise/Sole Prop), zakat is a 100% TAX REBATE.
 * The rebate is capped at the tax payable amount.
 *
 * @param zakatPaid - Amount of zakat paid to authorized body
 * @param taxPayable - Personal income tax calculated before rebate
 * @returns Zakat result with tax rebate
 */
export function calculateIndividualZakatRebate(
  zakatPaid: number,
  taxPayable: number
): { rebate: number; netTax: number; excessZakat: number } {
  // Rebate is 100% of zakat paid, but cannot exceed tax payable
  const rebate = Math.min(zakatPaid, taxPayable);
  const netTax = Math.max(0, taxPayable - rebate);
  const excessZakat = Math.max(0, zakatPaid - taxPayable);

  return {
    rebate: Math.round(rebate * 100) / 100,
    netTax: Math.round(netTax * 100) / 100,
    excessZakat: Math.round(excessZakat * 100) / 100,
  };
}

/**
 * Calculate business zakat deduction for Sdn Bhd
 *
 * For companies, zakat is a TAX DEDUCTION from aggregate income.
 * Maximum deduction: 2.5% of aggregate income
 *
 * @param zakatPaid - Amount of zakat paid to authorized body
 * @param aggregateIncome - Company's aggregate income (before zakat deduction)
 * @returns Zakat result with tax deduction
 */
export function calculateBusinessZakatDeduction(
  zakatPaid: number,
  aggregateIncome: number
): { deduction: number; excessZakat: number; effectiveDeduction: number } {
  // Maximum deduction is 2.5% of aggregate income
  const maxDeduction = aggregateIncome * 0.025;
  const deduction = Math.min(zakatPaid, maxDeduction);
  const excessZakat = Math.max(0, zakatPaid - maxDeduction);

  return {
    deduction: Math.round(deduction * 100) / 100,
    excessZakat: Math.round(excessZakat * 100) / 100,
    effectiveDeduction: Math.round(deduction * 100) / 100,
  };
}

/**
 * Get current nisab value
 * In production, this could fetch real-time gold prices
 */
export function getCurrentNisab(): number {
  return ZAKAT_NISAB_2025.individual;
}

/**
 * Check if income meets nisab threshold
 */
export function meetsNisabThreshold(income: number): boolean {
  return income >= ZAKAT_NISAB_2025.individual;
}
