# Config Package API Reference

The `@tax-engine/config` package contains all tax configuration: brackets, rates, and rules. This is where you update tax rates when they change.

## Installation

```bash
npm install @tax-engine/config
```

**Note:** This is a workspace package. In the monorepo, it's already linked.

## Quick Start

```typescript
import {
  calculatePersonalTaxFromBrackets,
  calculateCorporateTaxFromBrackets,
  calculateEmployerEPF,
  calculateEmployeeEPF,
  isAuditExempt,
  calculateDividendTax,
  getDefaultReliefs,
} from '@tax-engine/config';

// Calculate personal tax
const tax = calculatePersonalTaxFromBrackets(150000);
// ~RM18,900

// Calculate EPF
const employerEPF = calculateEmployerEPF(60000); // Annual salary
// RM7,800 (13% of RM60k)

// Check audit exemption
const exempt = isAuditExempt({
  revenue: 80000,
  totalAssets: 200000,
  employees: 3,
});
// true (all criteria met)
```

## Tax Brackets

### Personal Income Tax Brackets

**File:** `packages/config/personalTaxBrackets.ts`

**Brackets (YA 2024/2025):**

```typescript
import { PERSONAL_TAX_BRACKETS } from '@tax-engine/config';

// [
//   { min: 0, max: 5000, rate: 0 },
//   { min: 5000, max: 20000, rate: 0.01 },
//   { min: 20000, max: 35000, rate: 0.03 },
//   { min: 35000, max: 50000, rate: 0.06 },
//   { min: 50000, max: 70000, rate: 0.11 },
//   { min: 70000, max: 100000, rate: 0.19 },
//   { min: 100000, max: 250000, rate: 0.25 },
//   { min: 250000, max: 400000, rate: 0.26 },
//   { min: 400000, max: 600000, rate: 0.28 },
//   { min: 600000, max: null, rate: 0.3 },
// ]
```

**Calculate tax:**
```typescript
import { calculatePersonalTaxFromBrackets } from '@tax-engine/config';

const tax = calculatePersonalTaxFromBrackets(150000);
// RM18,900 (calculated using progressive brackets)
```

**How it works:**
- Progressive brackets: Each bracket applies only to income within that range
- Example: RM150k taxable income
  - RM0-RM5k: 0% = RM0
  - RM5k-RM20k: 1% = RM150
  - RM20k-RM35k: 3% = RM450
  - RM35k-RM50k: 6% = RM900
  - RM50k-RM70k: 11% = RM2,200
  - RM70k-RM100k: 19% = RM5,700
  - RM100k-RM150k: 25% = RM12,500
  - **Total: RM18,900**

### Corporate Tax Brackets (SME)

**File:** `packages/config/corporateTaxBrackets.ts`

**Brackets:**

```typescript
import { CORPORATE_TAX_BRACKETS } from '@tax-engine/config';

// [
//   { min: 0, max: 150000, rate: 0.15 },
//   { min: 150000, max: 600000, rate: 0.17 },
//   { min: 600000, max: null, rate: 0.24 },
// ]
```

**Calculate tax:**
```typescript
import { calculateCorporateTaxFromBrackets } from '@tax-engine/config';

const tax = calculateCorporateTaxFromBrackets(200000);
// RM30,000 (15% of RM150k + 17% of RM50k)
```

**SME Qualification:**
- Revenue < RM50 million
- Meeting shareholding requirements (usually 100% Malaysian-owned)

**If you don't qualify:** You pay 24% flat rate (not implemented here - we assume SME).

## EPF Rules

**File:** `packages/config/epfRules.ts`

### Employer EPF

The company pays this (it's a cost).

```typescript
import { calculateEmployerEPF } from '@tax-engine/config';

// Salary ≤ RM5,000/month: 13%
const epf1 = calculateEmployerEPF(60000); // RM60k/year = RM5k/month
// RM7,800 (13% of RM60k)

// Salary > RM5,000/month: 12%
const epf2 = calculateEmployerEPF(72000); // RM72k/year = RM6k/month
// RM8,640 (12% of RM72k)
```

**Rates:**
- Salary ≤ RM5,000/month: **13%**
- Salary > RM5,000/month: **12%**

**Note:** Rate is based on monthly salary, but function takes annual salary. It calculates monthly first, then annualizes.

### Employee EPF

You pay this (deducted from salary).

```typescript
import { calculateEmployeeEPF } from '@tax-engine/config';

const epf = calculateEmployeeEPF(60000); // Annual salary
// RM6,600 (11% of RM60k)
```

**Rate:** Always **11%** of salary.

**Take-home salary:**
```typescript
const annualSalary = 60000;
const employeeEPF = calculateEmployeeEPF(annualSalary);
const takeHome = annualSalary - employeeEPF;
// RM53,400
```

## Audit Exemption

**File:** `packages/config/auditRules.ts`

Check if a company qualifies for audit exemption.

```typescript
import { isAuditExempt } from '@tax-engine/config';

// Exempt: All criteria met
const exempt1 = isAuditExempt({
  revenue: 80000,      // ≤ RM100k ✓
  totalAssets: 200000, // ≤ RM300k ✓
  employees: 3,        // ≤ 5 ✓
});
// true

// Not exempt: Revenue exceeds limit
const exempt2 = isAuditExempt({
  revenue: 150000,    // > RM100k ✗
  totalAssets: 200000,
  employees: 3,
});
// false

// Not exempt: Assets exceed limit
const exempt3 = isAuditExempt({
  revenue: 80000,
  totalAssets: 400000, // > RM300k ✗
  employees: 3,
});
// false

// Not exempt: Too many employees
const exempt4 = isAuditExempt({
  revenue: 80000,
  totalAssets: 200000,
  employees: 6,        // > 5 ✗
});
// false
```

**Criteria (ALL must be met):**
1. Revenue ≤ RM100,000
2. Total assets ≤ RM300,000
3. ≤ 5 employees

**If ANY criterion is exceeded:** Audit is required (costs RM3k-8k/year).

## Dividend Tax (YA 2025)

**File:** `packages/config/dividendTax.ts`

Calculate dividend tax for YA 2025.

```typescript
import { calculateDividendTax } from '@tax-engine/config';

// Dividends ≤ RM100k: Tax-free
const tax1 = calculateDividendTax(80000, true);
// RM0

// Dividends > RM100k: 2% on excess
const tax2 = calculateDividendTax(150000, true);
// RM1,000 (2% of RM50k excess)

// If surcharge not applied (YA 2024 or earlier)
const tax3 = calculateDividendTax(150000, false);
// RM0
```

**Rules (YA 2025):**
- Dividends ≤ RM100,000: **Tax-free**
- Dividends > RM100,000: **2% tax on excess**

**Example:** RM150,000 dividends
- First RM100,000: Tax-free
- Excess RM50,000: 2% = RM1,000
- **Total tax: RM1,000**

**Parameters:**
- `dividendAmount` (number): Total dividend amount
- `applySurcharge` (boolean): Whether to apply YA 2025 surcharge

**Constants:**
```typescript
import { DIVIDEND_TAX_THRESHOLD, DIVIDEND_TAX_RATE } from '@tax-engine/config';

DIVIDEND_TAX_THRESHOLD; // 100000
DIVIDEND_TAX_RATE;      // 0.02 (2%)
```

## Tax Reliefs

**File:** `packages/config/defaultReliefs.ts`

### Default Reliefs

```typescript
import { getDefaultReliefs, DEFAULT_RELIEFS } from '@tax-engine/config';

const reliefs = getDefaultReliefs();
// {
//   basic: 9000,
//   epfAndLifeInsurance: 7000,
//   medical: 8000
// }

// Or use constant
DEFAULT_RELIEFS;
// Same as above
```

**Default reliefs:**
- Basic relief: RM9,000
- EPF/Life Insurance: RM7,000 (combined max)
- Medical: RM8,000
- **Total: RM24,000**

### Calculate Total Reliefs

```typescript
import { calculateTotalReliefs } from '@tax-engine/config';

const reliefs = {
  basic: 9000,
  epfAndLifeInsurance: 7000,
  medical: 8000,
  spouse: 4000, // Additional
};

const total = calculateTotalReliefs(reliefs);
// RM28,000
```

### Relief Limits

```typescript
import { RELIEF_LIMITS } from '@tax-engine/config';

// {
//   basic: 9000,
//   epfAndLifeInsurance: 7000,
//   medical: 8000,
//   spouse: 4000,
//   children: 2000,
//   education: 8000
// }
```

**Use these limits** to validate user input or show maximum reliefs.

## SOCSO Rules (v2)

**File:** `packages/config/socsoRules.ts`

SOCSO rules are defined but not used in v1 calculations (marked for v2).

```typescript
import { SOCSO_RULES } from '@tax-engine/config';

// Rules are defined, but calculations not implemented yet
```

**When v2 comes:** SOCSO will be included in calculations.

## Updating Tax Rates

When tax rates change (usually announced in Budget):

### Step 1: Update Brackets

**Personal tax:**
- File: `packages/config/personalTaxBrackets.ts`
- Update: `PERSONAL_TAX_BRACKETS` array

**Corporate tax:**
- File: `packages/config/corporateTaxBrackets.ts`
- Update: `CORPORATE_TAX_BRACKETS` array

### Step 2: Update Reliefs (if changed)

- File: `packages/config/defaultReliefs.ts`
- Update: `DEFAULT_RELIEFS` object

### Step 3: Update Documentation

- Update `docs/concepts/tax-calculations.md`
- Update `packages/core/ASSUMPTIONS.md`
- Update `packages/config/CHANGELOG.md`

### Step 4: Test

```bash
npm run test
```

**Verify:** Calculations still work with new rates.

## Type Definitions

### `TaxBracket`

```typescript
interface TaxBracket {
  min: number;           // Minimum income for bracket
  max: number | null;    // Maximum income (null = no limit)
  rate: number;          // Tax rate (0.15 = 15%)
}
```

### `CorporateTaxBracket`

Same as `TaxBracket` (alias for clarity).

### `PersonalReliefs`

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

## Real-World Examples

### Example 1: Calculate Tax for Different Incomes

```typescript
import { calculatePersonalTaxFromBrackets } from '@tax-engine/config';

const incomes = [50000, 100000, 200000, 500000];

incomes.forEach(income => {
  const tax = calculatePersonalTaxFromBrackets(income);
  const effectiveRate = (tax / income) * 100;
  console.log(`RM${income.toLocaleString()}: RM${tax.toLocaleString()} tax (${effectiveRate.toFixed(1)}%)`);
});

// RM50,000: RM1,500 tax (3.0%)
// RM100,000: RM10,900 tax (10.9%)
// RM200,000: RM35,900 tax (18.0%)
// RM500,000: RM99,900 tax (20.0%)
```

### Example 2: Check Audit Exemption

```typescript
import { isAuditExempt } from '@tax-engine/config';

const companies = [
  { revenue: 80000, assets: 200000, employees: 3 },
  { revenue: 150000, assets: 200000, employees: 3 },
  { revenue: 80000, assets: 400000, employees: 3 },
];

companies.forEach(company => {
  const exempt = isAuditExempt(company);
  console.log(`${JSON.stringify(company)}: ${exempt ? 'Exempt' : 'Audit required'}`);
});

// {"revenue":80000,"assets":200000,"employees":3}: Exempt
// {"revenue":150000,"assets":200000,"employees":3}: Audit required
// {"revenue":80000,"assets":400000,"employees":3}: Audit required
```

### Example 3: Calculate EPF for Different Salaries

```typescript
import { calculateEmployerEPF, calculateEmployeeEPF } from '@tax-engine/config';

const salaries = [36000, 60000, 72000, 120000]; // Annual

salaries.forEach(salary => {
  const monthly = salary / 12;
  const employerEPF = calculateEmployerEPF(salary);
  const employeeEPF = calculateEmployeeEPF(salary);
  const takeHome = salary - employeeEPF;
  
  console.log(`RM${salary.toLocaleString()}/year (RM${monthly.toLocaleString()}/month):`);
  console.log(`  Employer EPF: RM${employerEPF.toLocaleString()}`);
  console.log(`  Employee EPF: RM${employeeEPF.toLocaleString()}`);
  console.log(`  Take-home: RM${takeHome.toLocaleString()}`);
});

// RM36,000/year (RM3,000/month):
//   Employer EPF: RM4,680 (13%)
//   Employee EPF: RM3,960 (11%)
//   Take-home: RM32,040
// 
// RM60,000/year (RM5,000/month):
//   Employer EPF: RM7,800 (13%)
//   Employee EPF: RM6,600 (11%)
//   Take-home: RM53,400
// 
// RM72,000/year (RM6,000/month):
//   Employer EPF: RM8,640 (12% - rate changes!)
//   Employee EPF: RM7,920 (11%)
//   Take-home: RM64,080
```

## Edge Cases & Gotchas

### Gotcha 1: Bracket Boundaries

Brackets are inclusive of `min`, exclusive of `max` (except last bracket).

**Example:** RM20,000 taxable income
- Falls in bracket: `{ min: 20000, max: 35000, rate: 0.03 }`
- Tax on RM20k: RM0 (because it's exactly at `min`)
- Tax on RM20,001: RM0.03 (RM1 × 3%)

**Why:** This matches LHDN's calculation method.

### Gotcha 2: EPF Rate Change

EPF rate changes at exactly RM5,000/month (RM60,000/year).

**Example:**
- RM59,999/year: 13% employer EPF
- RM60,000/year: 13% employer EPF (still 13%, because monthly is exactly RM5k)
- RM60,001/year: 12% employer EPF (monthly is RM5,000.08)

**Check the code** to see exact logic.

### Gotcha 3: Dividend Tax Threshold

Dividend tax applies to amounts **above** RM100k, not the full amount.

**Example:**
- RM100,000 dividends: RM0 tax
- RM100,001 dividends: RM0.02 tax (RM1 × 2%)
- RM150,000 dividends: RM1,000 tax (RM50k × 2%)

### Gotcha 4: Audit Exemption is ALL Criteria

All three criteria must be met. If ANY is exceeded, audit is required.

**Common mistake:** Thinking "if revenue is low, I'm exempt" - but if assets exceed RM300k, you still need audit.

## Contributing

Want to add new tax rules? Read [How to Add a Tax Rule](../how-to/add-tax-rule.md).

**Found outdated rates?** Open an issue or submit a PR with:
- Source of new rates (LHDN announcement, Budget document)
- What changed
- Date of change

---

**Questions?** Check [Tax Calculations Guide](../concepts/tax-calculations.md) or read the source code.

