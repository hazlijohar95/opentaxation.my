import type { TaxCalculationInputs } from './types';

/**
 * Validation functions for tax calculation inputs
 */

export interface ValidationError {
  field: string;
  message: string;
}

export function validateInputs(inputs: TaxCalculationInputs): ValidationError[] {
  const errors: ValidationError[] = [];

  // Business profit must be >= 0
  if (inputs.businessProfit < 0) {
    errors.push({
      field: 'businessProfit',
      message: 'Business profit cannot be negative',
    });
  }

  // Other income must be >= 0
  if (inputs.otherIncome < 0) {
    errors.push({
      field: 'otherIncome',
      message: 'Other income cannot be negative',
    });
  }

  // Monthly salary validation (if provided)
  if (inputs.monthlySalary !== undefined) {
    if (inputs.monthlySalary < 0) {
      errors.push({
        field: 'monthlySalary',
        message: 'Monthly salary cannot be negative',
      });
    }
    // Note: Salary can exceed business profit - this results in company loss
    // which is a valid scenario to model (e.g., during business downturn)
  }

  // Compliance costs validation
  if (inputs.complianceCosts !== undefined && inputs.complianceCosts < 0) {
    errors.push({
      field: 'complianceCosts',
      message: 'Compliance costs cannot be negative',
    });
  }

  // Audit cost validation
  if (inputs.auditCost !== undefined && inputs.auditCost < 0) {
    errors.push({
      field: 'auditCost',
      message: 'Audit cost cannot be negative',
    });
  }

  // Audit criteria validation
  if (inputs.auditCriteria) {
    if (inputs.auditCriteria.revenue < 0) {
      errors.push({
        field: 'auditCriteria.revenue',
        message: 'Revenue cannot be negative',
      });
    }
    if (inputs.auditCriteria.totalAssets < 0) {
      errors.push({
        field: 'auditCriteria.totalAssets',
        message: 'Total assets cannot be negative',
      });
    }
    if (inputs.auditCriteria.employees < 0) {
      errors.push({
        field: 'auditCriteria.employees',
        message: 'Number of employees cannot be negative',
      });
    }
  }

  // Dividend distribution percentage validation
  if (inputs.dividendDistributionPercent !== undefined) {
    if (inputs.dividendDistributionPercent < 0 || inputs.dividendDistributionPercent > 100) {
      errors.push({
        field: 'dividendDistributionPercent',
        message: 'Dividend distribution percentage must be between 0 and 100',
      });
    }
  }

  return errors;
}

/**
 * Sanitize inputs to ensure they are valid numbers
 */
export function sanitizeInputs(inputs: Partial<TaxCalculationInputs>): TaxCalculationInputs {
  return {
    businessProfit: Math.max(0, inputs.businessProfit ?? 0),
    otherIncome: Math.max(0, inputs.otherIncome ?? 0),
    monthlySalary: inputs.monthlySalary !== undefined ? Math.max(0, inputs.monthlySalary) : undefined,
    complianceCosts: inputs.complianceCosts !== undefined ? Math.max(0, inputs.complianceCosts) : undefined,
    auditCost: inputs.auditCost !== undefined ? Math.max(0, inputs.auditCost) : undefined,
    auditCriteria: inputs.auditCriteria
      ? {
          revenue: Math.max(0, inputs.auditCriteria.revenue ?? 0),
          totalAssets: Math.max(0, inputs.auditCriteria.totalAssets ?? 0),
          employees: Math.max(0, Math.round(inputs.auditCriteria.employees ?? 0)),
        }
      : undefined,
    reliefs: inputs.reliefs,
    dividendDistributionPercent: inputs.dividendDistributionPercent !== undefined
      ? Math.max(0, Math.min(100, inputs.dividendDistributionPercent))
      : undefined,
  };
}

