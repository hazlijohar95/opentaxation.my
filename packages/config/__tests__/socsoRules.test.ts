/**
 * Unit Tests for SOCSO Rules
 *
 * Tests calculateEmployerSOCSO, calculateEmployeeSOCSO
 */

import { describe, it, expect } from 'vitest';
import {
  calculateEmployerSOCSO,
  calculateEmployeeSOCSO,
  SOCSO_RATES,
} from '../socsoRules';

describe('calculateEmployerSOCSO', () => {
  it('returns 0 for zero salary', () => {
    expect(calculateEmployerSOCSO(0)).toBe(0);
  });

  it('returns 0 for negative salary', () => {
    expect(calculateEmployerSOCSO(-1000)).toBe(0);
  });

  it('applies ~1.75% rate for salary below RM6k/month', () => {
    const monthlySalary = 5000;
    const expectedSOCSO = monthlySalary * 0.0175;
    expect(calculateEmployerSOCSO(monthlySalary)).toBeCloseTo(expectedSOCSO, 2);
  });

  it('applies rate for salary exactly at RM6k/month threshold', () => {
    const monthlySalary = 6000;
    const expectedSOCSO = monthlySalary * 0.0175;
    expect(calculateEmployerSOCSO(monthlySalary)).toBeCloseTo(expectedSOCSO, 2);
  });

  it('returns 0 for salary above RM6k/month', () => {
    expect(calculateEmployerSOCSO(6001)).toBe(0);
    expect(calculateEmployerSOCSO(10000)).toBe(0);
    expect(calculateEmployerSOCSO(20000)).toBe(0);
  });

  it('rounds to 2 decimal places', () => {
    const result = calculateEmployerSOCSO(5123);
    const decimalPlaces = (result.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });
});

describe('calculateEmployeeSOCSO', () => {
  it('returns 0 for zero salary', () => {
    expect(calculateEmployeeSOCSO(0)).toBe(0);
  });

  it('returns 0 for negative salary', () => {
    expect(calculateEmployeeSOCSO(-1000)).toBe(0);
  });

  it('applies ~0.5% rate for salary below RM6k/month', () => {
    const monthlySalary = 5000;
    const expectedSOCSO = monthlySalary * 0.005;
    expect(calculateEmployeeSOCSO(monthlySalary)).toBeCloseTo(expectedSOCSO, 2);
  });

  it('applies rate for salary exactly at RM6k/month threshold', () => {
    const monthlySalary = 6000;
    const expectedSOCSO = monthlySalary * 0.005;
    expect(calculateEmployeeSOCSO(monthlySalary)).toBeCloseTo(expectedSOCSO, 2);
  });

  it('returns 0 for salary above RM6k/month', () => {
    expect(calculateEmployeeSOCSO(6001)).toBe(0);
    expect(calculateEmployeeSOCSO(10000)).toBe(0);
  });

  it('rounds to 2 decimal places', () => {
    const result = calculateEmployeeSOCSO(5123);
    const decimalPlaces = (result.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });
});

describe('SOCSO_RATES constant', () => {
  it('has correct employer rates', () => {
    expect(SOCSO_RATES.employer.low).toBe(0.0175);
    expect(SOCSO_RATES.employer.threshold).toBe(6000);
  });

  it('has correct employee rates', () => {
    expect(SOCSO_RATES.employee.low).toBe(0.005);
    expect(SOCSO_RATES.employee.threshold).toBe(6000);
  });
});
