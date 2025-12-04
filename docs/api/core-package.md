# Core Package API Reference

The `@tax-engine/core` package contains all tax calculation logic. Pure TypeScript, no dependencies (except `@tax-engine/config`).

## Installation

```bash
npm install @tax-engine/core
```

**Note:** This is a workspace package. In the monorepo, it's already linked. For external use, you'd need to publish it to npm (we haven't done that yet).

## Quick Start

```typescript
import {
  calculateSolePropScenario,
  calculateSdnBhdScenario,
  compareScenarios,
  type TaxCalculationInputs,
} from '@tax-engine/core';

const inputs: TaxCalculationInputs = {
  businessProfit: 150000,
  otherIncome: 0,
  monthlySalary: 5000,
  complianceCosts: 5000,
};

const soleProp = calculateSolePropScenario({
  businessProfit: inputs.businessProfit,
  otherIncome: inputs.otherIncome,
});

const sdnBhd = calculateSdnBhdScenario({
  businessProfit: inputs.businessProfit,
  monthlySalary: inputs.monthlySalary!,
  otherIncome: inputs.otherIncome,
  complianceCosts: inputs.complianceCosts!,
});

const comparison = compareScenarios(soleProp, sdnBhd, inputs.businessProfit, inputs);

console.log(comparison.recommendation);
// "Better to stay as Enterprise. You save RM5,000 per year..."
```

## Core Functions

### `calculatePersonalTax`

Calculate personal income tax for a given income and reliefs.

```typescript
import { calculatePersonalTax } from '@tax-engine/core';

const result = calculatePersonalTax(
  150000, // totalIncome
  {
    basic: 9000,
    epfAndLifeInsurance: 7000,
    medical: 8000,
  }
);

// Returns:
// {
//   tax: 18900.00,
//   effectiveRate: 0.126,
//   taxableIncome: 126000.00,
//   totalReliefs: 24000
// }
```

**Parameters:**
- `totalIncome` (number): Total income before reliefs
- `reliefs?` (PersonalReliefs): Optional reliefs object. Uses defaults if not provided.

**Returns:**
- `tax` (number): Total tax owed (rounded to 2 decimals)
- `effectiveRate` (number): Effective tax rate (tax / totalIncome)
- `taxableIncome` (number): Income after reliefs
- `totalReliefs` (number): Total reliefs applied

**Example:**
```typescript
// RM150k income, default reliefs
const result = calculatePersonalTax(150000);
// tax: ~RM18,900
// effectiveRate: ~0.126 (12.6%)

// RM150k income, custom reliefs
const result2 = calculatePersonalTax(150000, {
  basic: 9000,
  epfAndLifeInsurance: 7000,
  medical: 8000,
  spouse: 4000, // Additional relief
});
// tax: ~RM16,500 (less tax due to more reliefs)
```

**Edge cases:**
- Zero income: Returns `{ tax: 0, effectiveRate: 0, taxableIncome: 0, totalReliefs: 24000 }`
- Negative income: Throws error (use validation first)
- Very high income: Works fine (tested up to RM10M)

### `calculateCorporateTax`

Calculate corporate tax for SME companies.

```typescript
import { calculateCorporateTax } from '@tax-engine/core';

const result = calculateCorporateTax(150000);

// Returns:
// {
//   tax: 22500.00,
//   effectiveRate: 0.15
// }
```

**Parameters:**
- `taxableProfit` (number): Company profit after deducting salary and employer EPF

**Returns:**
- `tax` (number): Corporate tax owed (rounded to 2 decimals)
- `effectiveRate` (number): Effective tax rate (tax / taxableProfit)

**Tax brackets:**
- RM0 - RM150,000: 15%
- RM150,001 - RM600,000: 17%
- Above RM600,000: 24%

**Example:**
```typescript
// RM150k profit
calculateCorporateTax(150000);
// tax: RM22,500 (15% of RM150k)

// RM200k profit
calculateCorporateTax(200000);
// tax: RM30,000 (15% of RM150k + 17% of RM50k)

// RM700k profit
calculateCorporateTax(700000);
// tax: RM144,000 (15% of RM150k + 17% of RM450k + 24% of RM100k)
```

**Note:** This assumes SME qualification. If your company doesn't qualify, you'd pay 24% flat rate (not implemented here - we assume SME).

### `calculateSolePropScenario`

Calculate the Enterprise (Sole Proprietorship) scenario.

```typescript
import { calculateSolePropScenario } from '@tax-engine/core';

const result = calculateSolePropScenario({
  businessProfit: 150000,
  otherIncome: 0,
  reliefs: {
    basic: 9000,
    epfAndLifeInsurance: 7000,
    medical: 8000,
  },
});

// Returns:
// {
//   personalTax: 18900.00,
//   netCash: 131100.00,
//   effectiveTaxRate: 0.126,
//   breakdown: {
//     totalIncome: 150000.00,
//     totalReliefs: 24000,
//     taxableIncome: 126000.00
//   }
// }
```

**Parameters:**
- `businessProfit` (number): Annual business profit
- `otherIncome` (number): Other personal income (salary, rental, etc.)
- `reliefs?` (PersonalReliefs): Optional reliefs. Uses defaults if not provided.

**Returns:**
- `personalTax` (number): Total personal tax owed
- `netCash` (number): Cash remaining after tax (businessProfit - tax on business portion)
- `effectiveTaxRate` (number): Effective tax rate
- `breakdown` (object): Detailed breakdown of calculation

**How it works:**
1. Total income = businessProfit + otherIncome
2. Calculate personal tax on total income
3. Apportion tax to business profit portion
4. Net cash = businessProfit - tax on business portion

**Example:**
```typescript
// Simple case: RM150k profit, no other income
const result = calculateSolePropScenario({
  businessProfit: 150000,
  otherIncome: 0,
});
// netCash: ~RM131,100

// With other income: RM150k profit + RM30k salary
const result2 = calculateSolePropScenario({
  businessProfit: 150000,
  otherIncome: 30000, // Part-time salary
});
// Total income: RM180k
// Tax is higher, netCash is lower
```

### `calculateSdnBhdScenario`

Calculate the Sdn Bhd scenario. More complex because it involves company tax, personal tax, EPF, and dividends.

```typescript
import { calculateSdnBhdScenario } from '@tax-engine/core';

const result = calculateSdnBhdScenario({
  businessProfit: 150000,
  monthlySalary: 5000,
  otherIncome: 0,
  complianceCosts: 5000,
  auditCost: 5000, // If audit required
  auditCriteria: {
    revenue: 150000,
    totalAssets: 200000,
    employees: 2,
  },
  reliefs: {
    basic: 9000,
    epfAndLifeInsurance: 7000,
    medical: 8000,
  },
  applyYa2025DividendSurcharge: false,
});

// Returns:
// {
//   corporateTax: 12330.00,
//   personalTax: 3500.00,
//   employerEPF: 7800.00,
//   employeeEPF: 6600.00,
//   totalComplianceCost: 10000.00,
//   netCash: 114770.00,
//   breakdown: {
//     annualSalary: 60000.00,
//     companyTaxableProfit: 82200.00,
//     postTaxProfit: 69870.00,
//     dividends: 69870.00,
//     dividendTax: 0.00,
//     salaryAfterEPF: 53400.00,
//     salaryAfterTax: 49900.00
//   }
// }
```

**Parameters:**
- `businessProfit` (number): Annual business profit (required)
- `monthlySalary` (number): Monthly salary you pay yourself (required)
- `otherIncome` (number): Other personal income (required)
- `complianceCosts` (number): Annual compliance costs (required)
- `auditCost?` (number): Audit cost if required (default: 0)
- `auditCriteria?` (object): Revenue, assets, employees (for exemption check)
- `reliefs?` (PersonalReliefs): Optional reliefs
- `applyYa2025DividendSurcharge?` (boolean): Apply 2% dividend tax on excess >RM100k (default: false)

**Returns:**
- `corporateTax` (number): Company tax paid
- `personalTax` (number): Personal tax on salary
- `employerEPF` (number): EPF paid by company
- `employeeEPF` (number): EPF deducted from salary
- `totalComplianceCost` (number): Compliance + audit costs
- `netCash` (number): Total cash to you after all taxes and costs
- `breakdown` (object): Detailed breakdown

**How it works:**
1. Company pays you salary: monthlySalary × 12
2. Company pays employer EPF (13% or 12% depending on salary)
3. Company taxable profit = businessProfit - salary - employerEPF
4. Company pays corporate tax on taxable profit
5. Post-tax profit can be distributed as dividends
6. Dividends are mostly tax-free (YA 2025: 2% on excess >RM100k)
7. You pay personal tax on salary (after EPF deduction)
8. Net cash = Salary after EPF + Dividends - Personal tax - Compliance costs

**Example:**
```typescript
// RM150k profit, RM5k/month salary
const result = calculateSdnBhdScenario({
  businessProfit: 150000,
  monthlySalary: 5000,
  otherIncome: 0,
  complianceCosts: 5000,
  auditCost: 5000, // Audit required (revenue > RM100k)
});
// netCash: ~RM114,770

// Same scenario, but audit exempt
const result2 = calculateSdnBhdScenario({
  businessProfit: 150000,
  monthlySalary: 5000,
  otherIncome: 0,
  complianceCosts: 5000,
  auditCost: 0, // No audit needed
  auditCriteria: {
    revenue: 80000, // Under RM100k
    totalAssets: 200000,
    employees: 2,
  },
});
// netCash: ~RM119,770 (RM5k more due to no audit)
```

**Edge cases:**
- Salary > 80% of profit: Should be validated (not enforced in function, but UI should check)
- Zero salary: Doesn't make sense for Sdn Bhd (but function allows it)
- Very high dividends: YA 2025 surcharge applies if >RM100k

### `compareScenarios`

Compare Enterprise vs Sdn Bhd scenarios and determine which is better.

```typescript
import { compareScenarios } from '@tax-engine/core';

const soleProp = calculateSolePropScenario({...});
const sdnBhd = calculateSdnBhdScenario({...});

const comparison = compareScenarios(
  soleProp,
  sdnBhd,
  150000, // businessProfit
  inputs // TaxCalculationInputs
);

// Returns:
// {
//   whichIsBetter: 'soleProp' | 'sdnBhd' | 'similar',
//   difference: -5000.00, // Negative = Enterprise better
//   savingsIfSwitch: 5000.00,
//   crossoverPointProfit: 220000.00, // Where both are equal
//   recommendation: "Better to stay as Enterprise. You save RM5,000...",
//   solePropResult: {...},
//   sdnBhdResult: {...}
// }
```

**Parameters:**
- `solePropResult` (SolePropScenarioResult): Enterprise scenario result
- `sdnBhdResult` (SdnBhdScenarioResult): Sdn Bhd scenario result
- `businessProfit` (number): Current business profit
- `inputs` (TaxCalculationInputs): Original inputs (for crossover calculation)

**Returns:**
- `whichIsBetter` ('soleProp' | 'sdnBhd' | 'similar'): Which structure is better
- `difference` (number): Net cash difference (positive = Sdn Bhd better, negative = Enterprise better)
- `savingsIfSwitch` (number): Absolute value of difference
- `crossoverPointProfit` (number | null): Profit level where both are equal (or null if no crossover)
- `recommendation` (string): Human-readable recommendation
- `solePropResult` (SolePropScenarioResult): Enterprise result (passed through)
- `sdnBhdResult` (SdnBhdScenarioResult): Sdn Bhd result (passed through)

**Similarity threshold:** If difference is < RM3,000, scenarios are considered "similar".

**Crossover calculation:** Uses binary search to find profit level where both scenarios are equal. Searches from RM0 to RM2M.

**Example:**
```typescript
const comparison = compareScenarios(soleProp, sdnBhd, 150000, inputs);

if (comparison.whichIsBetter === 'soleProp') {
  console.log(`Stay as Enterprise. Save RM${comparison.savingsIfSwitch} per year.`);
} else if (comparison.whichIsBetter === 'sdnBhd') {
  console.log(`Switch to Sdn Bhd. Save RM${comparison.savingsIfSwitch} per year.`);
} else {
  console.log('Both structures are similar. Choose based on other factors.');
}

if (comparison.crossoverPointProfit) {
  console.log(`Crossover point: RM${comparison.crossoverPointProfit}`);
  console.log(`Above this profit, Sdn Bhd becomes better.`);
}
```

## Types

### `TaxCalculationInputs`

Input interface for tax calculations.

```typescript
interface TaxCalculationInputs {
  businessProfit: number;           // Required: Annual business profit
  otherIncome: number;               // Required: Other personal income
  monthlySalary?: number;            // Optional: Monthly salary (for Sdn Bhd)
  complianceCosts?: number;          // Optional: Annual compliance costs
  auditCost?: number;                // Optional: Audit cost if required
  auditCriteria?: {                  // Optional: For audit exemption check
    revenue: number;
    totalAssets: number;
    employees: number;
  };
  reliefs?: PersonalReliefs;        // Optional: Custom reliefs
  applyYa2025DividendSurcharge?: boolean; // Optional: Apply YA 2025 dividend tax
}
```

### `SolePropScenarioResult`

Result of Enterprise scenario calculation.

```typescript
interface SolePropScenarioResult {
  personalTax: number;
  netCash: number;
  effectiveTaxRate: number;
  breakdown: {
    totalIncome: number;
    totalReliefs: number;
    taxableIncome: number;
  };
}
```

### `SdnBhdScenarioResult`

Result of Sdn Bhd scenario calculation.

```typescript
interface SdnBhdScenarioResult {
  corporateTax: number;
  personalTax: number;
  employerEPF: number;
  employeeEPF: number;
  totalComplianceCost: number;
  netCash: number;
  breakdown: {
    annualSalary: number;
    companyTaxableProfit: number;
    postTaxProfit: number;
    dividends: number;
    dividendTax: number;
    salaryAfterEPF: number;
    salaryAfterTax: number;
  };
}
```

### `ComparisonResult`

Result of comparing both scenarios.

```typescript
interface ComparisonResult {
  whichIsBetter: 'soleProp' | 'sdnBhd' | 'similar';
  difference: number;
  savingsIfSwitch: number;
  crossoverPointProfit: number | null;
  recommendation: string;
  solePropResult: SolePropScenarioResult;
  sdnBhdResult: SdnBhdScenarioResult;
}
```

## Validation

### `sanitizeInputs`

Sanitize and validate inputs before calculation.

```typescript
import { sanitizeInputs } from '@tax-engine/core';

const inputs = sanitizeInputs({
  businessProfit: -1000, // Invalid: negative
  otherIncome: 'not a number', // Invalid: not a number
});

// Returns sanitized inputs:
// {
//   businessProfit: 0, // Clamped to 0
//   otherIncome: 0,    // Defaulted to 0
//   ...
// }
```

**What it does:**
- Clamps negative numbers to 0
- Converts invalid numbers to 0
- Rounds employee count
- Applies defaults for optional fields

**Use this** before calling calculation functions to prevent errors.

## Constants

### `SIMILARITY_THRESHOLD`

Difference threshold for "similar" scenarios. Default: RM3,000.

```typescript
import { SIMILARITY_THRESHOLD } from '@tax-engine/core';
// 3000
```

### `CROSSOVER_CALCULATION`

Constants for crossover point calculation.

```typescript
import { CROSSOVER_CALCULATION } from '@tax-engine/core';

// {
//   MIN_PROFIT: 0,
//   MAX_PROFIT: 2000000,
//   TOLERANCE: 100,
//   MAX_ITERATIONS: 50,
//   EARLY_EXIT_THRESHOLD: 100
// }
```

## Utilities

### Rounding Functions

```typescript
import { roundToTwoDecimalPlaces, roundToFourDecimalPlaces } from '@tax-engine/core';

roundToTwoDecimalPlaces(123.456); // 123.46
roundToFourDecimalPlaces(0.123456); // 0.1235
```

**When to use:**
- `roundToTwoDecimalPlaces`: For currency (RM amounts)
- `roundToFourDecimalPlaces`: For percentages/rates

## Real-World Examples

### Example 1: Simple Comparison

```typescript
import {
  calculateSolePropScenario,
  calculateSdnBhdScenario,
  compareScenarios,
  sanitizeInputs,
} from '@tax-engine/core';

const rawInputs = {
  businessProfit: 150000,
  otherIncome: 0,
  monthlySalary: 5000,
  complianceCosts: 5000,
};

// Sanitize inputs
const inputs = sanitizeInputs(rawInputs);

// Calculate both scenarios
const soleProp = calculateSolePropScenario({
  businessProfit: inputs.businessProfit,
  otherIncome: inputs.otherIncome,
});

const sdnBhd = calculateSdnBhdScenario({
  businessProfit: inputs.businessProfit,
  monthlySalary: inputs.monthlySalary!,
  otherIncome: inputs.otherIncome,
  complianceCosts: inputs.complianceCosts!,
});

// Compare
const comparison = compareScenarios(
  soleProp,
  sdnBhd,
  inputs.businessProfit,
  inputs
);

console.log(comparison.recommendation);
// "Better to stay as Enterprise. You save RM5,000 per year..."
```

### Example 2: Custom Reliefs

```typescript
import { calculateSolePropScenario } from '@tax-engine/core';

const result = calculateSolePropScenario({
  businessProfit: 200000,
  otherIncome: 0,
  reliefs: {
    basic: 9000,
    epfAndLifeInsurance: 7000,
    medical: 8000,
    spouse: 4000, // Spouse has no income
    children: 4000, // 2 children
  },
});

console.log(`Net cash: RM${result.netCash.toLocaleString()}`);
// More reliefs = less tax = more net cash
```

### Example 3: High Profit Scenario

```typescript
import {
  calculateSolePropScenario,
  calculateSdnBhdScenario,
  compareScenarios,
} from '@tax-engine/core';

// RM500k profit - Sdn Bhd should win
const soleProp = calculateSolePropScenario({
  businessProfit: 500000,
  otherIncome: 0,
});

const sdnBhd = calculateSdnBhdScenario({
  businessProfit: 500000,
  monthlySalary: 10000, // RM10k/month
  otherIncome: 0,
  complianceCosts: 8000,
  auditCost: 0, // Audit exempt (revenue < RM100k... wait, that's wrong)
  // Actually, at RM500k profit, audit is definitely required
  auditCost: 6000,
});

const comparison = compareScenarios(soleProp, sdnBhd, 500000, {
  businessProfit: 500000,
  monthlySalary: 10000,
  otherIncome: 0,
  complianceCosts: 8000,
});

// At RM500k, Sdn Bhd should win due to lower corporate tax rates
console.log(comparison.whichIsBetter); // 'sdnBhd'
```

## Edge Cases & Gotchas

### Gotcha 1: Salary Validation

The function doesn't validate that salary is reasonable. You should check:
```typescript
if (monthlySalary * 12 > businessProfit * 0.8) {
  throw new Error('Salary cannot exceed 80% of profit');
}
```

### Gotcha 2: Negative Results

If compliance costs are very high, `netCash` can be negative. This is correct (you're losing money), but might not be what you expect.

### Gotcha 3: Crossover Point May Not Exist

If one scenario is always better (e.g., Enterprise always wins), `crossoverPointProfit` will be `null`.

### Gotcha 4: Rounding Precision

All amounts are rounded to 2 decimal places. For very large numbers, this might cause small discrepancies.

### Gotcha 5: EPF Relief vs Actual EPF

The calculator uses default EPF relief (RM7,000), not your actual EPF contributions. If you contribute more, you'd get more relief (but we don't calculate that).

## Testing

All functions have unit tests. See `packages/core/tax/__tests__/taxCalculations.test.ts`.

**Run tests:**
```bash
npm run test
```

**Test coverage:** Core calculation functions are well-tested. Edge cases are covered.

## Performance

**Calculation speed:** Very fast. All calculations are O(1) or O(n) where n is number of tax brackets (usually 10 or less).

**Typical performance:**
- Single calculation: < 1ms
- Comparison with crossover: < 10ms
- 1000 calculations: < 100ms

**Memoization:** The `compareScenarios` function uses memoization for crossover calculations to avoid recalculating the same inputs.

## Contributing

Want to add a new calculation function? Read [How to Add a Tax Rule](../how-to/add-tax-rule.md).

---

**Questions?** Check the [Architecture Overview](../concepts/architecture.md) or read the source code (it's well-commented, we promise).

