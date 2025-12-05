/**
 * Unit Tests for EPF Rules
 *
 * Tests calculateEmployerEPF, calculateEmployeeEPF, calculateMaxAffordableSalary
 */

import { describe, it, expect } from 'vitest';
import {
  calculateEmployerEPF,
  calculateEmployeeEPF,
  calculateMaxAffordableSalary,
  EPF_RATES,
} from '../epfRules';

describe('calculateEmployerEPF', () => {
  it('returns 0 for zero salary', () => {
    expect(calculateEmployerEPF(0)).toBe(0);
  });

  it('returns 0 for negative salary', () => {
    expect(calculateEmployerEPF(-1000)).toBe(0);
  });

  it('applies 13% rate for salary exactly at RM5k/month threshold', () => {
    const annualSalary = 5000 * 12; // RM60,000
    const expectedEPF = annualSalary * 0.13;
    expect(calculateEmployerEPF(annualSalary)).toBe(expectedEPF);
  });

  it('applies 13% rate for salary below RM5k/month', () => {
    const annualSalary = 4000 * 12; // RM48,000
    const expectedEPF = annualSalary * 0.13;
    expect(calculateEmployerEPF(annualSalary)).toBe(expectedEPF);
  });

  it('applies 12% rate for salary above RM5k/month', () => {
    const annualSalary = 6000 * 12; // RM72,000
    const expectedEPF = annualSalary * 0.12;
    expect(calculateEmployerEPF(annualSalary)).toBe(expectedEPF);
  });

  it('applies 12% rate for high salaries', () => {
    const annualSalary = 20000 * 12; // RM240,000
    const expectedEPF = annualSalary * 0.12;
    expect(calculateEmployerEPF(annualSalary)).toBe(expectedEPF);
  });

  it('rounds to 2 decimal places', () => {
    // Use a value that would produce a non-round result
    const result = calculateEmployerEPF(12345.67);
    const decimalPlaces = (result.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });
});

describe('calculateEmployeeEPF', () => {
  it('returns 0 for zero salary', () => {
    expect(calculateEmployeeEPF(0)).toBe(0);
  });

  it('returns 0 for negative salary', () => {
    expect(calculateEmployeeEPF(-1000)).toBe(0);
  });

  it('applies standard 11% rate', () => {
    const annualSalary = 60000;
    const expectedEPF = annualSalary * 0.11;
    expect(calculateEmployeeEPF(annualSalary)).toBe(expectedEPF);
  });

  it('applies same rate regardless of salary level', () => {
    const lowSalary = 36000; // RM3k/month
    const highSalary = 240000; // RM20k/month

    expect(calculateEmployeeEPF(lowSalary)).toBe(lowSalary * 0.11);
    expect(calculateEmployeeEPF(highSalary)).toBe(highSalary * 0.11);
  });

  it('rounds to 2 decimal places', () => {
    const result = calculateEmployeeEPF(12345.67);
    const decimalPlaces = (result.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });
});

describe('calculateMaxAffordableSalary', () => {
  it('returns 0 for zero profit', () => {
    expect(calculateMaxAffordableSalary(0)).toBe(0);
  });

  it('returns 0 for negative profit', () => {
    expect(calculateMaxAffordableSalary(-10000)).toBe(0);
  });

  it('calculates correctly for profit where salary > RM5k/month (12% rate)', () => {
    // If max salary / 12 > 5000, use 12% rate
    // maxSalary = profit / 1.12
    const profit = 100000;
    const expectedMax = profit / 1.12;

    // Monthly should be > 5000 to use 12% rate
    if (expectedMax / 12 > EPF_RATES.employer.threshold) {
      const result = calculateMaxAffordableSalary(profit);
      expect(result).toBeCloseTo(expectedMax, 0);
    }
  });

  it('calculates correctly for profit where salary <= RM5k/month (13% rate)', () => {
    // Small profit = small salary = 13% rate
    // maxSalary = profit / 1.13
    const profit = 50000;
    const expectedWith13 = profit / 1.13;
    const expectedWith12 = profit / 1.12;

    // Monthly should be <= 5000 to use 13% rate
    if (expectedWith12 / 12 <= EPF_RATES.employer.threshold) {
      const result = calculateMaxAffordableSalary(profit);
      expect(result).toBeCloseTo(expectedWith13, 0);
    }
  });

  it('verifies max salary + EPF equals profit', () => {
    const profit = 150000;
    const maxSalary = calculateMaxAffordableSalary(profit);
    const epf = calculateEmployerEPF(maxSalary);

    // Salary + EPF should approximately equal profit
    expect(maxSalary + epf).toBeCloseTo(profit, 0);
  });

  it('rounds to 2 decimal places', () => {
    const result = calculateMaxAffordableSalary(123456.78);
    const decimalPlaces = (result.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });
});

describe('EPF_RATES constant', () => {
  it('has correct employer rates', () => {
    expect(EPF_RATES.employer.low).toBe(0.13);
    expect(EPF_RATES.employer.high).toBe(0.12);
    expect(EPF_RATES.employer.threshold).toBe(5000);
  });

  it('has correct employee rate', () => {
    expect(EPF_RATES.employee).toBe(0.11);
  });
});
