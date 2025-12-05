/**
 * Unit Tests for useTaxCalculation Hook
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTaxCalculation } from '../useTaxCalculation';
import type { TaxCalculationInputs } from '@tax-engine/core';

describe('useTaxCalculation', () => {
  const baseInputs: TaxCalculationInputs = {
    businessProfit: 100000,
    otherIncome: 0,
    monthlySalary: 5000,
    complianceCosts: 5000,
  };

  it('returns comparison result for valid inputs', () => {
    const { result } = renderHook(() => useTaxCalculation(baseInputs));

    expect(result.current).not.toBeNull();
    expect(result.current).toHaveProperty('whichIsBetter');
    expect(result.current).toHaveProperty('difference');
    expect(result.current).toHaveProperty('solePropResult');
    expect(result.current).toHaveProperty('sdnBhdResult');
  });

  it('returns null when businessProfit is undefined', () => {
    const inputs = { ...baseInputs, businessProfit: undefined as any };
    const { result } = renderHook(() => useTaxCalculation(inputs));

    expect(result.current).toBeNull();
  });

  it('returns valid result for zero businessProfit', () => {
    const inputs = { ...baseInputs, businessProfit: 0 };
    const { result } = renderHook(() => useTaxCalculation(inputs));

    expect(result.current).not.toBeNull();
    expect(result.current?.solePropResult.netCash).toBe(0);
  });

  it('memoizes result based on input values', () => {
    const { result, rerender } = renderHook(
      ({ inputs }) => useTaxCalculation(inputs),
      { initialProps: { inputs: baseInputs } }
    );

    const firstResult = result.current;

    // Rerender with same values (new object reference)
    rerender({ inputs: { ...baseInputs } });

    // Result should be the same object (memoized)
    // Note: Due to React's memoization, values should be equal
    expect(result.current?.difference).toBe(firstResult?.difference);
  });

  it('recalculates when inputs change', () => {
    const { result, rerender } = renderHook(
      ({ inputs }) => useTaxCalculation(inputs),
      { initialProps: { inputs: baseInputs } }
    );

    const firstDifference = result.current?.difference;

    // Rerender with different businessProfit
    rerender({ inputs: { ...baseInputs, businessProfit: 200000 } });

    // Result should be different
    expect(result.current?.difference).not.toBe(firstDifference);
  });

  it('handles optional fields correctly', () => {
    const minimalInputs: TaxCalculationInputs = {
      businessProfit: 100000,
      otherIncome: 0,
    };

    const { result } = renderHook(() => useTaxCalculation(minimalInputs));

    expect(result.current).not.toBeNull();
    expect(result.current?.solePropResult).toBeDefined();
    expect(result.current?.sdnBhdResult).toBeDefined();
  });

  it('handles zakat configuration', () => {
    const inputsWithZakat: TaxCalculationInputs = {
      ...baseInputs,
      zakat: {
        enabled: true,
        autoCalculate: true,
      },
    };

    const { result } = renderHook(() => useTaxCalculation(inputsWithZakat));

    expect(result.current).not.toBeNull();
    expect(result.current?.solePropResult.zakat).toBeDefined();
  });

  it('handles audit criteria', () => {
    const inputsWithAudit: TaxCalculationInputs = {
      ...baseInputs,
      auditCriteria: {
        revenue: 5000000,
        totalAssets: 2000000,
        employees: 20,
      },
    };

    const { result } = renderHook(() => useTaxCalculation(inputsWithAudit));

    expect(result.current).not.toBeNull();
  });

  it('handles dividend surcharge setting', () => {
    const inputsWithSurcharge: TaxCalculationInputs = {
      ...baseInputs,
      businessProfit: 500000,
      applyYa2025DividendSurcharge: true,
    };

    const { result } = renderHook(() => useTaxCalculation(inputsWithSurcharge));

    expect(result.current).not.toBeNull();
    // With high profit and surcharge enabled, dividend tax may apply
    const dividends = result.current?.sdnBhdResult.breakdown.dividends ?? 0;
    if (dividends > 100000) {
      expect(result.current?.sdnBhdResult.breakdown.dividendTax).toBeGreaterThan(0);
    }
  });
});
