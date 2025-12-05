/**
 * Tax Year Configuration - Centralized versioning for Malaysian tax rates
 *
 * This file contains all tax-related constants organized by Year of Assessment (YA).
 * When tax rates change (e.g., YA 2026), simply:
 * 1. Add a new entry to TAX_YEARS
 * 2. Update CURRENT_TAX_YEAR constant
 * 3. Run golden file tests to verify impact
 *
 * No calculation logic changes should be needed.
 */

import type { TaxBracket } from './progressiveTax';

/**
 * Personal tax relief limits
 */
export interface ReliefLimits {
  /** Basic individual relief */
  basic: number;
  /** EPF + Life Insurance combined max */
  epfAndLifeInsurance: number;
  /** Medical insurance/expenses */
  medical: number;
  /** Spouse relief (if spouse has no income) */
  spouse: number;
  /** Per child relief */
  children: number;
  /** Education per child */
  education: number;
}

/**
 * EPF rate configuration
 */
export interface EPFConfig {
  /** Employee contribution rate (standard 11%) */
  employeeRate: number;
  /** Employer rate for salary <= threshold */
  employerRateLow: number;
  /** Employer rate for salary > threshold */
  employerRateHigh: number;
  /** Monthly salary threshold for rate change (RM5,000) */
  salaryThreshold: number;
  /** Max EPF contribution eligible for relief */
  maxReliefContribution: number;
}

/**
 * SOCSO rate configuration
 */
export interface SOCSOConfig {
  /** Employer rate (simplified) */
  employerRate: number;
  /** Employee rate (simplified) */
  employeeRate: number;
  /** Monthly salary threshold (contributions mandatory below, optional above) */
  wageThreshold: number;
}

/**
 * Dividend tax configuration (YA 2025+)
 */
export interface DividendConfig {
  /** Threshold above which surcharge applies */
  threshold: number;
  /** Surcharge rate on excess */
  surchargeRate: number;
}

/**
 * Zakat configuration
 */
export interface ZakatConfig {
  /** Zakat rate (standard 2.5%) */
  rate: number;
  /** Nisab threshold (based on 85g gold) */
  nisabThreshold: number;
  /** Max business zakat deduction rate (2.5% of aggregate income) */
  maxBusinessDeductionRate: number;
}

/**
 * Complete tax year configuration
 */
export interface TaxYearConfig {
  /** Year of Assessment identifier */
  yearAssessment: string;

  /** Personal income tax configuration */
  personal: {
    brackets: TaxBracket[];
    reliefLimits: ReliefLimits;
  };

  /** Corporate tax configuration (SME rates) */
  corporate: {
    smeBrackets: TaxBracket[];
    /** Standard rate for non-SME companies */
    standardRate: number;
  };

  /** EPF contribution rates */
  epf: EPFConfig;

  /** SOCSO contribution rates */
  socso: SOCSOConfig;

  /** Dividend tax rules */
  dividend: DividendConfig;

  /** Zakat rules */
  zakat: ZakatConfig;
}

/**
 * Tax Year 2024/2025 Configuration
 *
 * Sources:
 * - LHDN Malaysia personal tax brackets
 * - EPF Act 1991
 * - Budget 2025 (dividend surcharge)
 * - PERKESO (SOCSO rates, updated Oct 2024)
 */
const YA_2024_2025: TaxYearConfig = {
  yearAssessment: 'YA2024-2025',

  personal: {
    brackets: [
      { min: 0, max: 5000, rate: 0 },
      { min: 5000, max: 20000, rate: 0.01 },
      { min: 20000, max: 35000, rate: 0.03 },
      { min: 35000, max: 50000, rate: 0.06 },
      { min: 50000, max: 70000, rate: 0.11 },
      { min: 70000, max: 100000, rate: 0.19 },
      { min: 100000, max: 250000, rate: 0.25 },
      { min: 250000, max: 400000, rate: 0.26 },
      { min: 400000, max: 600000, rate: 0.28 },
      { min: 600000, max: null, rate: 0.3 },
    ],
    reliefLimits: {
      basic: 9000,
      epfAndLifeInsurance: 7000,
      medical: 8000,
      spouse: 4000,
      children: 2000,
      education: 8000,
    },
  },

  corporate: {
    smeBrackets: [
      { min: 0, max: 150000, rate: 0.15 },
      { min: 150000, max: 600000, rate: 0.17 },
      { min: 600000, max: null, rate: 0.24 },
    ],
    standardRate: 0.24,
  },

  epf: {
    employeeRate: 0.11,
    employerRateLow: 0.13,
    employerRateHigh: 0.12,
    salaryThreshold: 5000,
    maxReliefContribution: 7000,
  },

  socso: {
    employerRate: 0.0175,
    employeeRate: 0.005,
    wageThreshold: 6000,
  },

  dividend: {
    threshold: 100000,
    surchargeRate: 0.02,
  },

  zakat: {
    rate: 0.025,
    nisabThreshold: 29961,
    maxBusinessDeductionRate: 0.025,
  },
};

/**
 * All supported tax years
 * Add new entries here when tax rates change
 */
export const TAX_YEARS: Record<string, TaxYearConfig> = {
  'YA2024-2025': YA_2024_2025,
};

/**
 * Current tax year in use
 * Update this when switching to a new tax year
 */
export const CURRENT_TAX_YEAR = 'YA2024-2025';

/**
 * Get the current tax year configuration
 */
export function getCurrentTaxYear(): TaxYearConfig {
  return TAX_YEARS[CURRENT_TAX_YEAR];
}

/**
 * Get a specific tax year configuration
 * @param year - Tax year identifier (e.g., 'YA2024-2025')
 * @returns Tax year config or undefined if not found
 */
export function getTaxYear(year: string): TaxYearConfig | undefined {
  return TAX_YEARS[year];
}

/**
 * Get list of available tax years
 */
export function getAvailableTaxYears(): string[] {
  return Object.keys(TAX_YEARS);
}
