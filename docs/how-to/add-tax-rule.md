# How to Add a New Tax Rule

Step-by-step guide to adding new tax rules (because tax rules change, and we need to keep up).

## When to Add a Tax Rule

**Add a new rule when:**
- Government announces new tax rates (Budget announcements)
- LHDN updates brackets or reliefs
- New tax types are introduced (like YA 2025 dividend tax)

**Don't add:**
- Hypothetical rules ("what if tax was 50%?")
- Rules from other countries (this is Malaysia-specific)
- Rules that don't exist yet (wait for official announcement)

## Step-by-Step Guide

### Step 1: Understand the Rule

**Before coding, understand:**
- What is the rule? (new bracket, new relief, new tax type?)
- When does it apply? (all taxpayers, specific conditions?)
- What are the exact amounts? (rates, thresholds, limits?)
- What's the source? (LHDN announcement, Budget document?)

**Example:** Adding YA 2025 dividend tax
- **Rule:** 2% tax on dividends > RM100k
- **Applies to:** Dividends from Malaysian companies (YA 2025+)
- **Amounts:** RM100k threshold, 2% rate
- **Source:** Budget 2025 announcement

### Step 2: Add Configuration

**File:** `packages/config/` - Create new file or update existing

**Example:** Adding dividend tax (already done, but here's how):

**File:** `packages/config/dividendTax.ts`

```typescript
/**
 * YA 2025 Dividend Tax Rules
 * Starting YA 2025, dividends > RM100k are subject to 2% tax on excess
 */

export const DIVIDEND_TAX_THRESHOLD = 100000;
export const DIVIDEND_TAX_RATE = 0.02; // 2%

export function calculateDividendTax(
  dividendAmount: number,
  applySurcharge: boolean
): number {
  if (!applySurcharge || dividendAmount <= DIVIDEND_TAX_THRESHOLD) {
    return 0;
  }
  
  const excessAmount = dividendAmount - DIVIDEND_TAX_THRESHOLD;
  const tax = excessAmount * DIVIDEND_TAX_RATE;
  
  return Math.round(tax * 100) / 100; // Round to 2 decimals
}
```

**Key points:**
- Export constants (thresholds, rates)
- Export calculation function
- Round to 2 decimal places
- Add comments explaining the rule

### Step 3: Export from Config Package

**File:** `packages/config/index.ts`

```typescript
export * from './dividendTax';
```

**Why:** Makes it available to other packages.

### Step 4: Use in Core Package

**File:** `packages/core/tax/calculateSdnBhdScenario.ts` (or wherever needed)

```typescript
import { calculateDividendTax } from '@tax-engine/config';

// In the calculation:
const dividends = postTaxProfit;
const dividendTax = calculateDividendTax(
  dividends,
  inputs.applyYa2025DividendSurcharge
);
```

**Key points:**
- Import from `@tax-engine/config`
- Use in calculation logic
- Pass through user input (if applicable)

### Step 5: Update Types (if needed)

**File:** `packages/core/types.ts`

If the new rule needs new input fields:

```typescript
export interface TaxCalculationInputs {
  // ... existing fields
  applyYa2025DividendSurcharge?: boolean; // New field
}
```

**Why:** TypeScript needs to know about new fields.

### Step 6: Update Validation (if needed)

**File:** `packages/core/validation.ts`

If the new rule needs validation:

```typescript
export function sanitizeInputs(inputs: Partial<TaxCalculationInputs>): TaxCalculationInputs {
  return {
    // ... existing fields
    applyYa2025DividendSurcharge: inputs.applyYa2025DividendSurcharge ?? false,
  };
}
```

**Why:** Ensure inputs are valid before calculation.

### Step 7: Update UI (if needed)

**File:** `apps/web/src/components/sections/InputsSection.tsx` (or wherever)

If users need to toggle the rule:

```typescript
<input
  type="checkbox"
  checked={inputs.applyYa2025DividendSurcharge || false}
  onChange={(e) => onApplyYa2025DividendSurchargeChange(e.target.checked)}
/>
```

**Why:** Users need to control the rule (if it's optional).

### Step 8: Write Tests

**File:** `packages/core/tax/__tests__/taxCalculations.test.ts` (or create new test file)

```typescript
import { calculateDividendTax } from '@tax-engine/config';

describe('calculateDividendTax', () => {
  it('should return 0 for dividends <= RM100k', () => {
    expect(calculateDividendTax(100000, true)).toBe(0);
    expect(calculateDividendTax(50000, true)).toBe(0);
  });

  it('should calculate 2% on excess > RM100k', () => {
    expect(calculateDividendTax(150000, true)).toBe(1000); // RM50k × 2%
    expect(calculateDividendTax(200000, true)).toBe(2000); // RM100k × 2%
  });

  it('should return 0 if surcharge not applied', () => {
    expect(calculateDividendTax(150000, false)).toBe(0);
  });
});
```

**Why:** Tests ensure the rule works correctly.

**Run tests:**
```bash
npm run test
```

### Step 9: Update Documentation

**Files to update:**
- `docs/concepts/tax-calculations.md` - Explain the rule
- `docs/api/config-package.md` - Document the function
- `packages/core/ASSUMPTIONS.md` - Add to assumptions
- `packages/config/CHANGELOG.md` - Log the change

**Example:** Adding to `tax-calculations.md`:

```markdown
## Dividend Tax (YA 2025)

Starting Year of Assessment 2025, dividends have a new rule:
- Dividends ≤ RM100,000: Tax-free
- Dividends > RM100,000: 2% tax on excess

**Example:** RM150,000 dividends
- First RM100,000: Tax-free
- Excess RM50,000: 2% = RM1,000 tax
```

### Step 10: Test Everything

**Manual testing:**
1. Run the app: `npm run dev`
2. Enter test values
3. Verify calculations are correct
4. Check UI displays correctly

**Automated testing:**
```bash
npm run test
npm run build
```

**Edge cases to test:**
- Zero values
- Very high values
- Boundary values (exactly at threshold)
- Negative values (should be prevented)

## Example: Adding a New Relief

**Scenario:** Government announces new "Digital Business Relief" of RM5,000.

### Step 1: Add to Reliefs Interface

**File:** `packages/config/defaultReliefs.ts`

```typescript
export interface PersonalReliefs {
  // ... existing fields
  digitalBusiness?: number; // New relief
}

export const DEFAULT_RELIEFS: PersonalReliefs = {
  // ... existing
  digitalBusiness: 0, // Not in default (user must opt-in)
};
```

### Step 2: Update Calculation

**File:** `packages/core/tax/calculatePersonalTax.ts`

No changes needed - it already uses `calculateTotalReliefs()` which sums all relief values.

### Step 3: Update UI

**File:** `apps/web/src/components/ReliefsSection.tsx`

```typescript
<InputField
  label="Digital Business Relief"
  value={reliefs.digitalBusiness || 0}
  onChange={(val) => updateRelief('digitalBusiness', val)}
  tooltip="New relief for digital businesses (RM5,000)"
  min={0}
  max={5000}
/>
```

### Step 4: Write Tests

```typescript
it('should include digital business relief in total', () => {
  const reliefs = {
    basic: 9000,
    epfAndLifeInsurance: 7000,
    medical: 8000,
    digitalBusiness: 5000,
  };
  
  const result = calculatePersonalTax(150000, reliefs);
  expect(result.totalReliefs).toBe(29000); // RM24k + RM5k
});
```

### Step 5: Update Documentation

Add to reliefs documentation and examples.

## Common Mistakes

### Mistake 1: Not Rounding

**Wrong:**
```typescript
return tax; // Might have many decimals
```

**Right:**
```typescript
return Math.round(tax * 100) / 100; // Round to 2 decimals
```

### Mistake 2: Wrong Bracket Logic

**Wrong:**
```typescript
if (income > bracket.min && income < bracket.max) {
  tax = income * bracket.rate; // Wrong! Only applies to income in bracket
}
```

**Right:**
```typescript
const incomeInBracket = Math.min(
  income - bracket.min,
  bracket.max - bracket.min
);
tax = incomeInBracket * bracket.rate;
```

### Mistake 3: Not Testing Edge Cases

**Test:**
- Zero values
- Boundary values (exactly at threshold)
- Very high values
- Negative values (should be prevented)

### Mistake 4: Forgetting to Export

**Always export:**
- From `packages/config/index.ts`
- From `packages/core/index.ts` (if adding to core)

### Mistake 5: Not Updating Documentation

**Update:**
- API reference
- Concepts guide
- Assumptions file
- Changelog

## Testing Checklist

Before submitting:

- [ ] Code compiles (`npm run build`)
- [ ] Tests pass (`npm run test`)
- [ ] Manual testing works
- [ ] Edge cases handled
- [ ] Documentation updated
- [ ] Types updated (if needed)
- [ ] Validation added (if needed)
- [ ] UI updated (if needed)

## Getting Help

**Stuck?**
1. Check existing rules for examples
2. Read the code (it's well-commented)
3. Ask in GitHub issues
4. Check LHDN website for official rules

**Found a bug?**
- Write a test that reproduces it
- Fix the bug
- Submit PR with test

---

**Ready to add a rule?** Follow the steps above, test thoroughly, and submit a PR. We'll review it and merge if it's correct.

