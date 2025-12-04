# How to Debug Tax Calculations

Guide to finding and fixing calculation bugs (because bugs happen, and we need to fix them).

## When Calculations Seem Wrong

**First, verify it's actually wrong:**
1. Check LHDN website for official rates
2. Calculate manually (with a calculator)
3. Compare with other tax calculators (if available)
4. Consult a tax advisor (they know the rules)

**Then, if it's definitely wrong, debug it.**

## Debugging Process

### Step 1: Reproduce the Bug

**Create a test case:**

```typescript
// In packages/core/tax/__tests__/taxCalculations.test.ts

it('should calculate tax correctly for RM150k income', () => {
  const result = calculatePersonalTax(150000);
  
  // Expected: ~RM18,900
  // Actual: ???
  expect(result.tax).toBeCloseTo(18900, 0);
});
```

**Key points:**
- Use realistic numbers (RM150k, not RM1)
- Know the expected result (calculate manually)
- Write a failing test first

### Step 2: Trace Through the Code

**Start from the entry point:**

```typescript
// User calls this:
const result = calculateSolePropScenario({
  businessProfit: 150000,
  otherIncome: 0,
});

// Which calls:
calculatePersonalTax(150000, reliefs);

// Which calls:
calculatePersonalTaxFromBrackets(126000); // After reliefs

// Which loops through brackets...
```

**Add console.logs:**

```typescript
export function calculatePersonalTaxFromBrackets(taxableIncome: number): number {
  console.log('Input:', taxableIncome);
  
  let tax = 0;
  for (const bracket of PERSONAL_TAX_BRACKETS) {
    const incomeInBracket = /* calculation */;
    const bracketTax = incomeInBracket * bracket.rate;
    console.log(`Bracket ${bracket.min}-${bracket.max}: RM${incomeInBracket} × ${bracket.rate} = RM${bracketTax}`);
    tax += bracketTax;
  }
  
  console.log('Total tax:', tax);
  return tax;
}
```

**Run the test and check output.**

### Step 3: Check Input Values

**Verify inputs are correct:**

```typescript
const result = calculateSolePropScenario({
  businessProfit: 150000,
  otherIncome: 0,
  reliefs: {
    basic: 9000,
    epfAndLifeInsurance: 7000,
    medical: 8000,
  },
});

console.log('Inputs:', {
  businessProfit: 150000,
  otherIncome: 0,
  reliefs: { basic: 9000, epfAndLifeInsurance: 7000, medical: 8000 },
});

console.log('Result:', result);
```

**Check:**
- Are inputs what you expect?
- Are reliefs correct?
- Is taxable income calculated correctly?

### Step 4: Check Tax Brackets

**Verify brackets are correct:**

```typescript
import { PERSONAL_TAX_BRACKETS } from '@tax-engine/config';

console.log('Brackets:', PERSONAL_TAX_BRACKETS);

// Check against LHDN website
// Verify rates are correct
// Verify ranges don't overlap
```

**Common issues:**
- Wrong rates (typo: 0.15 instead of 0.25)
- Overlapping brackets (RM20k-RM35k and RM30k-RM40k)
- Missing brackets (gap between brackets)
- Wrong order (brackets not sorted)

### Step 5: Check Calculation Logic

**Verify bracket calculation:**

```typescript
// For RM150k taxable income:
// Should calculate:
// - RM0-RM5k: 0% = RM0
// - RM5k-RM20k: 1% = RM150
// - RM20k-RM35k: 3% = RM450
// - RM35k-RM50k: 6% = RM900
// - RM50k-RM70k: 11% = RM2,200
// - RM70k-RM100k: 19% = RM5,700
// - RM100k-RM150k: 25% = RM12,500
// Total: RM18,900

// Check if calculation matches
```

**Common bugs:**
- Applying rate to full income (not just bracket portion)
- Not handling bracket boundaries correctly
- Rounding errors
- Off-by-one errors

### Step 6: Check Edge Cases

**Test edge cases:**

```typescript
// Zero income
calculatePersonalTax(0);
// Should return: { tax: 0, ... }

// Exactly at bracket boundary
calculatePersonalTax(5000);
// Should use 0% rate (first bracket)

// Very high income
calculatePersonalTax(1000000);
// Should use 30% rate (top bracket)

// Negative income (should be prevented)
calculatePersonalTax(-1000);
// Should throw error or return 0
```

**Edge cases to check:**
- Zero values
- Negative values (should be prevented)
- Boundary values (exactly at bracket min/max)
- Very high values (precision issues?)
- Very low values (rounding issues?)

## Common Calculation Bugs

### Bug 1: Wrong Bracket Calculation

**Symptom:** Tax is too high or too low

**Cause:** Applying rate to full income instead of bracket portion

**Fix:**
```typescript
// Wrong:
tax = taxableIncome * bracket.rate;

// Right:
const incomeInBracket = Math.min(
  taxableIncome - bracket.min,
  bracket.max - bracket.min
);
tax = incomeInBracket * bracket.rate;
```

### Bug 2: Reliefs Not Applied

**Symptom:** Tax is same regardless of reliefs

**Cause:** Reliefs not being subtracted from income

**Fix:**
```typescript
// Check if reliefs are being used:
const totalReliefs = calculateTotalReliefs(reliefs);
const taxableIncome = totalIncome - totalReliefs; // Make sure this happens
```

### Bug 3: Rounding Errors

**Symptom:** Tax is off by a few cents

**Cause:** Not rounding at the right time

**Fix:**
```typescript
// Round at the end:
return Math.round(tax * 100) / 100;

// Not during calculation (causes precision loss)
```

### Bug 4: EPF Rate Wrong

**Symptom:** EPF calculation seems off

**Cause:** Using wrong rate or threshold

**Fix:**
```typescript
// Check threshold:
const monthlySalary = annualSalary / 12;
const rate = monthlySalary <= 5000 ? 0.13 : 0.12; // Correct

// Not:
const rate = annualSalary <= 60000 ? 0.13 : 0.12; // Wrong!
```

### Bug 5: Audit Exemption Logic Wrong

**Symptom:** Audit required when it shouldn't be (or vice versa)

**Cause:** Wrong comparison operator

**Fix:**
```typescript
// Should be <= (inclusive):
return (
  criteria.revenue <= 100000 &&
  criteria.totalAssets <= 300000 &&
  criteria.employees <= 5
);

// Not < (exclusive):
return (
  criteria.revenue < 100000 && // Wrong! RM100k should be exempt
  ...
);
```

## Debugging Tools

### Console Logging

**Add logs at key points:**

```typescript
console.log('Input:', input);
console.log('After step 1:', intermediateValue);
console.log('After step 2:', anotherValue);
console.log('Final result:', result);
```

**Remove logs before committing** (or use a debug flag).

### Breakpoints (VS Code)

**Set breakpoints:**
1. Click left of line number (red dot appears)
2. Run debugger (F5)
3. Step through code (F10)
4. Inspect variables

**Useful for:** Complex calculations with many steps.

### Test Cases

**Write failing test:**

```typescript
it('should calculate tax correctly for RM150k', () => {
  const result = calculatePersonalTax(150000);
  expect(result.tax).toBeCloseTo(18900, 0);
});
```

**Run test:**
```bash
npm run test
```

**Fix bug until test passes.**

### Manual Calculation

**Calculate manually:**

```
RM150,000 income
- RM24,000 reliefs
= RM126,000 taxable

Tax:
- RM0-RM5k: 0% = RM0
- RM5k-RM20k: 1% = RM150
- RM20k-RM35k: 3% = RM450
- RM35k-RM50k: 6% = RM900
- RM50k-RM70k: 11% = RM2,200
- RM70k-RM100k: 19% = RM5,700
- RM100k-RM126k: 25% = RM6,500
Total: RM18,900
```

**Compare with code output.**

## Step-by-Step Debugging Example

**Problem:** Tax calculation returns RM20,000 for RM150k income (should be ~RM18,900)

### Step 1: Write Test

```typescript
it('should calculate RM18,900 tax for RM150k income', () => {
  const result = calculatePersonalTax(150000);
  expect(result.tax).toBeCloseTo(18900, 0);
});
```

**Test fails** (returns RM20,000).

### Step 2: Add Logs

```typescript
export function calculatePersonalTaxFromBrackets(taxableIncome: number): number {
  console.log('Taxable income:', taxableIncome);
  
  let tax = 0;
  for (const bracket of PERSONAL_TAX_BRACKETS) {
    const incomeInBracket = /* ... */;
    const bracketTax = incomeInBracket * bracket.rate;
    console.log(`Bracket ${bracket.min}-${bracket.max}: RM${bracketTax}`);
    tax += bracketTax;
  }
  
  console.log('Total tax:', tax);
  return tax;
}
```

### Step 3: Check Output

**Console output:**
```
Taxable income: 126000
Bracket 0-5000: RM0
Bracket 5000-20000: RM150
Bracket 20000-35000: RM450
Bracket 35000-50000: RM900
Bracket 50000-70000: RM2200
Bracket 70000-100000: RM5700
Bracket 100000-250000: RM6500
Total tax: 18900
```

**Wait, that's correct!** But test says RM20,000...

### Step 4: Check Reliefs

```typescript
const reliefs = getDefaultReliefs();
console.log('Reliefs:', reliefs);
console.log('Total reliefs:', calculateTotalReliefs(reliefs));

// Output:
// Reliefs: { basic: 9000, epfAndLifeInsurance: 7000, medical: 8000 }
// Total reliefs: 24000
```

**That's correct too.**

### Step 5: Check Full Flow

```typescript
const result = calculatePersonalTax(150000);
console.log('Result:', result);

// Output:
// Result: { tax: 20000, ... }
```

**Tax is RM20,000, but bracket calculation gives RM18,900...**

### Step 6: Find the Bug

**Check `calculatePersonalTax`:**

```typescript
export function calculatePersonalTax(totalIncome: number, reliefs?: PersonalReliefs) {
  const totalReliefs = calculateTotalReliefs(reliefs ?? getDefaultReliefs());
  const taxableIncome = totalIncome - totalReliefs;
  const tax = calculatePersonalTaxFromBrackets(taxableIncome);
  
  // Aha! Found it:
  return {
    tax: tax + 1100, // BUG: Adding extra RM1,100 for some reason
    // ...
  };
}
```

**Found the bug!** Remove the `+ 1100`.

### Step 7: Fix and Test

```typescript
return {
  tax: tax, // Fixed: removed + 1100
  // ...
};
```

**Run test again** - should pass now.

## When in Doubt, Check LHDN

**Official source:** [www.hasil.gov.my](https://www.hasil.gov.my)

**What to check:**
- Current tax brackets
- Relief amounts
- Calculation methods
- Recent changes

**If LHDN says one thing and code says another:** Code is wrong (probably).

## Getting Help

**Still stuck?**
1. Write a test case that reproduces the bug
2. Add detailed logs showing the issue
3. Open GitHub issue with:
   - Test case
   - Expected result
   - Actual result
   - Logs/output
4. We'll help debug it

**Found a bug?**
1. Write a test that reproduces it
2. Fix the bug
3. Submit PR with test
4. We'll review and merge

---

**Remember:** Tax calculations are complex. When in doubt, check LHDN website or consult a tax advisor. The code might be wrong, but it might also be that your understanding of the rules is wrong. Verify both!

