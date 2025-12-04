/**
 * Malaysia Audit Exemption Rules
 * 
 * Private companies are audit-exempt if ALL criteria are met:
 * - Revenue ≤ RM100,000
 * - Total assets ≤ RM300,000
 * - ≤ 5 employees
 * 
 * Source: Companies Act 2016, Section 267
 * Verified as of 2024/2025
 */

export interface AuditExemptionCriteria {
  revenue: number;
  totalAssets: number;
  employees: number;
}

/**
 * Check if a company qualifies for audit exemption
 * 
 * All three criteria must be met:
 * 1. Revenue must not exceed RM100,000
 * 2. Total assets must not exceed RM300,000
 * 3. Number of employees must not exceed 5
 * 
 * @param criteria - Company criteria to check
 * @returns true if company qualifies for audit exemption
 */
export function isAuditExempt(criteria: AuditExemptionCriteria): boolean {
  return (
    criteria.revenue <= 100000 &&
    criteria.totalAssets <= 300000 &&
    criteria.employees <= 5
  );
}

/**
 * Audit exemption thresholds
 */
export const AUDIT_EXEMPTION_THRESHOLDS = {
  revenue: 100000,
  totalAssets: 300000,
  employees: 5,
} as const;
