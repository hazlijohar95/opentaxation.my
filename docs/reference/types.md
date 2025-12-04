# Type Definitions Reference

All TypeScript interfaces and types used in the tax calculation engine.

## Core Types

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

**Usage:**
```typescript
const inputs: TaxCalculationInputs = {
  businessProfit: 150000,
  otherIncome: 0,
  monthlySalary: 5000,
  complianceCosts: 5000,
};
```

**Why this type exists:** Centralizes all input fields, making it easy to pass around and validate.

### `SolePropScenarioResult`

Result of Enterprise (Sole Proprietorship) scenario calculation.

```typescript
interface SolePropScenarioResult {
  personalTax: number;              // Total personal tax owed
  netCash: number;                  // Cash remaining after tax
  effectiveTaxRate: number;         // Effective tax rate (0-1)
  breakdown: {
    totalIncome: number;            // Business profit + other income
    totalReliefs: number;           // Total reliefs applied
    taxableIncome: number;          // Income after reliefs
  };
}
```

**Usage:**
```typescript
const result = calculateSolePropScenario({
  businessProfit: 150000,
  otherIncome: 0,
});

console.log(result.netCash); // ~RM131,100
console.log(result.personalTax); // ~RM18,900
```

**Why this type exists:** Provides structured output with breakdown for transparency.

### `SdnBhdScenarioResult`

Result of Sdn Bhd scenario calculation.

```typescript
interface SdnBhdScenarioResult {
  corporateTax: number;             // Company tax paid
  personalTax: number;               // Personal tax on salary
  employerEPF: number;               // EPF paid by company
  employeeEPF: number;               // EPF deducted from salary
  totalComplianceCost: number;       // Compliance + audit costs
  netCash: number;                  // Total cash to you after all taxes
  breakdown: {
    annualSalary: number;            // Annual salary (monthly × 12)
    companyTaxableProfit: number;   // Profit after salary and EPF
    postTaxProfit: number;           // Profit after corporate tax
    dividends: number;               // Dividends distributed
    dividendTax: number;             // Tax on dividends (YA 2025)
    salaryAfterEPF: number;         // Salary after employee EPF
    salaryAfterTax: number;          // Salary after personal tax
  };
}
```

**Usage:**
```typescript
const result = calculateSdnBhdScenario({
  businessProfit: 150000,
  monthlySalary: 5000,
  otherIncome: 0,
  complianceCosts: 5000,
});

console.log(result.netCash); // ~RM114,770
console.log(result.corporateTax); // ~RM12,330
```

**Why this type exists:** Sdn Bhd calculation is complex, so breakdown helps understand the result.

### `ComparisonResult`

Result of comparing Enterprise vs Sdn Bhd scenarios.

```typescript
interface ComparisonResult {
  whichIsBetter: 'soleProp' | 'sdnBhd' | 'similar';
  difference: number;                // Net cash difference (positive = Sdn Bhd better)
  savingsIfSwitch: number;          // Absolute value of difference
  crossoverPointProfit: number | null; // Profit level where both are equal
  recommendation: string;            // Human-readable recommendation
  solePropResult: SolePropScenarioResult;
  sdnBhdResult: SdnBhdScenarioResult;
}
```

**Usage:**
```typescript
const comparison = compareScenarios(soleProp, sdnBhd, 150000, inputs);

if (comparison.whichIsBetter === 'soleProp') {
  console.log('Stay as Enterprise');
} else if (comparison.whichIsBetter === 'sdnBhd') {
  console.log('Switch to Sdn Bhd');
} else {
  console.log('Both are similar');
}
```

**Why this type exists:** Provides comparison result with recommendation and both scenario results.

## Config Types

### `TaxBracket`

Tax bracket definition.

```typescript
interface TaxBracket {
  min: number;           // Minimum income for bracket
  max: number | null;     // Maximum income (null = no limit)
  rate: number;          // Tax rate (0.15 = 15%)
}
```

**Usage:**
```typescript
const bracket: TaxBracket = {
  min: 0,
  max: 5000,
  rate: 0,
};
```

**Why this type exists:** Standardizes bracket structure for personal and corporate tax.

### `CorporateTaxBracket`

Same as `TaxBracket` (alias for clarity).

```typescript
type CorporateTaxBracket = TaxBracket;
```

**Why this type exists:** Makes code more readable when dealing with corporate tax.

### `PersonalReliefs`

Tax reliefs interface.

```typescript
interface PersonalReliefs {
  basic: number;                    // Basic relief (RM9,000)
  epfAndLifeInsurance: number;      // EPF + Life Insurance (max RM7,000)
  medical: number;                  // Medical (RM8,000)
  spouse?: number;                  // Spouse relief (RM4,000)
  children?: number;                 // Children relief (varies)
  education?: number;                // Education/Medical (children)
  [key: string]: number | undefined; // Allow additional reliefs
}
```

**Usage:**
```typescript
const reliefs: PersonalReliefs = {
  basic: 9000,
  epfAndLifeInsurance: 7000,
  medical: 8000,
  spouse: 4000,
};
```

**Why this type exists:** Allows flexible relief configuration while maintaining type safety.

### `AuditExemptionCriteria`

Criteria for audit exemption check.

```typescript
interface AuditExemptionCriteria {
  revenue: number;        // Annual revenue
  totalAssets: number;    // Total company assets
  employees: number;      // Number of employees
}
```

**Usage:**
```typescript
const criteria: AuditExemptionCriteria = {
  revenue: 80000,
  totalAssets: 200000,
  employees: 3,
};

const exempt = isAuditExempt(criteria); // true
```

**Why this type exists:** Groups related fields for audit exemption check.

## Type Utilities

### Index Signature

**`PersonalReliefs`** uses index signature to allow additional reliefs:

```typescript
[key: string]: number | undefined;
```

**Why:** Allows adding new relief types without changing the interface.

**Example:**
```typescript
const reliefs: PersonalReliefs = {
  basic: 9000,
  digitalBusiness: 5000, // New relief type (allowed by index signature)
};
```

## Type Guards

### Checking Result Types

**No built-in type guards**, but you can check:

```typescript
function isSolePropResult(result: any): result is SolePropScenarioResult {
  return (
    typeof result.personalTax === 'number' &&
    typeof result.netCash === 'number' &&
    'breakdown' in result
  );
}
```

**Why:** TypeScript's type system handles most cases, but runtime checks can be useful.

## Common Patterns

### Optional Fields

**Many fields are optional** (`?`):

```typescript
monthlySalary?: number;
```

**Why:** Not all fields are needed for all scenarios (e.g., salary only for Sdn Bhd).

**Usage:**
```typescript
const inputs: TaxCalculationInputs = {
  businessProfit: 150000,
  otherIncome: 0,
  // monthlySalary not needed for Enterprise scenario
};
```

### Union Types

**`whichIsBetter`** uses union type:

```typescript
whichIsBetter: 'soleProp' | 'sdnBhd' | 'similar';
```

**Why:** Limits to valid values, catches typos at compile time.

### Nullable Types

**`crossoverPointProfit`** can be null:

```typescript
crossoverPointProfit: number | null;
```

**Why:** Crossover point might not exist (if one scenario always wins).

## Type Exports

**All types are exported from:**

```typescript
import type {
  TaxCalculationInputs,
  SolePropScenarioResult,
  SdnBhdScenarioResult,
  ComparisonResult,
} from '@tax-engine/core';
```

**Config types:**

```typescript
import type {
  TaxBracket,
  PersonalReliefs,
  AuditExemptionCriteria,
} from '@tax-engine/config';
```

## Examples

### Example 1: Creating Inputs

```typescript
import type { TaxCalculationInputs } from '@tax-engine/core';

const inputs: TaxCalculationInputs = {
  businessProfit: 150000,
  otherIncome: 0,
  monthlySalary: 5000,
  complianceCosts: 5000,
  auditCost: 5000,
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
};
```

### Example 2: Using Results

```typescript
import type { ComparisonResult } from '@tax-engine/core';

function displayResults(comparison: ComparisonResult) {
  console.log(comparison.recommendation);
  console.log(`Enterprise net cash: RM${comparison.solePropResult.netCash}`);
  console.log(`Sdn Bhd net cash: RM${comparison.sdnBhdResult.netCash}`);
  console.log(`Difference: RM${comparison.difference}`);
}
```

### Example 3: Type Narrowing

```typescript
if (comparison.whichIsBetter === 'soleProp') {
  // TypeScript knows this is 'soleProp'
  console.log('Enterprise is better');
} else if (comparison.whichIsBetter === 'sdnBhd') {
  // TypeScript knows this is 'sdnBhd'
  console.log('Sdn Bhd is better');
} else {
  // TypeScript knows this is 'similar'
  console.log('Both are similar');
}
```

## Contributing

**Want to add a new type?**
1. Define it in `packages/core/types.ts` or `packages/config/`
2. Export it from package `index.ts`
3. Document it here
4. Use it in code

**Found a type issue?**
- Open an issue
- Submit PR with fix

---

**Questions?** Check the source code in `packages/core/types.ts` - it's well-commented.

