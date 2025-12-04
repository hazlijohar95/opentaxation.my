import type { PersonalReliefs, ZakatCalculationMethod } from '@tax-engine/config';

/**
 * Input types for tax calculations
 */

export type InputMode = 'profit' | 'target';

/**
 * Zakat input configuration
 */
export interface ZakatInput {
  /** Whether the user pays zakat */
  enabled: boolean;

  /** Annual zakat amount paid (if manually specified) */
  amountPaid?: number;

  /** Whether to auto-calculate zakat at 2.5% */
  autoCalculate?: boolean;

  /** Calculation method (gross_income by default) */
  method?: ZakatCalculationMethod;
}

export interface TaxCalculationInputs {
  businessProfit: number;
  otherIncome: number;
  monthlySalary?: number; // For Sdn Bhd scenario
  complianceCosts?: number; // Annual Sdn Bhd compliance costs
  auditCost?: number; // Annual audit cost (if required)
  auditCriteria?: {
    revenue: number;
    totalAssets: number;
    employees: number;
  };
  reliefs?: PersonalReliefs;
  applyYa2025DividendSurcharge?: boolean; // Whether to apply YA 2025 dividend surcharge
  dividendDistributionPercent?: number; // Percentage of post-tax profit to distribute as dividends (0-100, default 100)
  hasForeignOwnership?: boolean; // Whether company has ≥20% foreign ownership (disqualifies SME rates)
  // Input mode fields
  inputMode?: InputMode; // 'profit' (default) or 'target' (reverse calculation)
  targetNetIncome?: number; // If inputMode is 'target' - desired monthly take-home
  // Zakat configuration
  zakat?: ZakatInput; // Zakat payment settings
}

/**
 * Waterfall step for breakdown display
 * Used to show step-by-step calculation flow
 */
export interface WaterfallStep {
  label: string;
  amount: number;
  type: 'add' | 'subtract' | 'equals' | 'total';
  indent?: boolean;
  highlight?: boolean;
}

/**
 * Tax bracket breakdown showing how income is taxed tier by tier
 * Shows the progressive tax calculation transparently
 */
export interface TaxBracketBreakdown {
  bracketMin: number;       // Start of bracket (e.g., 0, 5000, 20000)
  bracketMax: number | null; // End of bracket (null = no limit)
  rate: number;             // Tax rate for this bracket (e.g., 0.01 = 1%)
  incomeInBracket: number;  // How much of user's income falls in this bracket
  taxForBracket: number;    // Tax amount for this bracket
}

/**
 * Zakat calculation result
 */
export interface ZakatResult {
  /** Whether zakat is enabled */
  enabled: boolean;
  /** Zakat amount paid/calculated */
  zakatAmount: number;
  /** Whether income meets nisab threshold */
  meetsNisab: boolean;
  /** Tax benefit from zakat (rebate for individual, deduction value for company) */
  taxBenefit: number;
  /** For Enterprise: Amount of zakat that exceeds tax (cannot be rebated) */
  excessZakat?: number;
}

export interface SolePropScenarioResult {
  personalTax: number;
  netCash: number;
  effectiveTaxRate: number;
  breakdown: {
    businessProfit: number;
    otherIncome: number;
    totalIncome: number;
    totalReliefs: number;
    taxableIncome: number;
  };
  waterfall: WaterfallStep[];
  insights: string[];
  taxBracketBreakdown: TaxBracketBreakdown[]; // Progressive tax tier breakdown
  // Zakat information
  zakat?: ZakatResult;
  /** Tax before zakat rebate (for display purposes) */
  taxBeforeZakatRebate?: number;
}

export interface SalaryAffordability {
  maxAffordableSalary: number;       // Maximum annual salary company can pay
  isAffordable: boolean;              // true if current salary <= max
  shortfall: number;                  // How much salary+EPF exceeds profit (0 if affordable)
  companyWouldBeInsolvent: boolean;   // true if salary + EPF > profit
}

export interface SdnBhdScenarioResult {
  corporateTax: number;
  personalTax: number;
  employerEPF: number;
  employeeEPF: number;
  employerSOCSO: number;
  employeeSOCSO: number;
  totalComplianceCost: number;
  netCash: number;
  salaryAffordability: SalaryAffordability;
  breakdown: {
    annualSalary: number;
    companyTaxableProfit: number;
    postTaxProfit: number;
    dividends: number;
    dividendTax: number;
    retainedEarnings: number;
    salaryAfterEPF: number;
    salaryAfterTax: number;
    otherIncome: number;
    businessProfit: number; // Original profit for waterfall display
  };
  companyWaterfall: WaterfallStep[];
  personalWaterfall: WaterfallStep[];
  insights: string[];
  epfSavings: number; // Total EPF (employer + employee) as forced retirement savings
  corporateTaxBracketBreakdown: TaxBracketBreakdown[]; // Corporate tax tier breakdown
  personalTaxBracketBreakdown: TaxBracketBreakdown[];  // Personal tax tier breakdown
  // Zakat information (for Sdn Bhd, zakat is a 2.5% deduction from aggregate income)
  zakat?: ZakatResult;
  /** Corporate tax before zakat deduction (for display purposes) */
  corporateTaxBeforeZakat?: number;
}

export interface ComparisonResult {
  whichIsBetter: 'soleProp' | 'sdnBhd' | 'similar';
  difference: number; // Positive = Sdn Bhd better, Negative = Sole Prop better
  savingsIfSwitch: number; // Absolute value of difference
  crossoverPointProfit: number | null; // Profit level where both are equal
  recommendation: string;
  solePropResult: SolePropScenarioResult;
  sdnBhdResult: SdnBhdScenarioResult;
  hasAffordabilityIssue: boolean; // true if Sdn Bhd salary exceeds company capacity
  hasSmeQualificationIssue: boolean; // true if company may not qualify for SME rates
  warnings: string[]; // List of warnings about the comparison
}

