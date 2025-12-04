# How to Customize Tax Reliefs

Guide to understanding, customizing, and adding tax reliefs (because everyone's situation is different).

## What Are Tax Reliefs?

**Tax reliefs** reduce your taxable income, which reduces your tax. Think of them as discounts on your tax bill.

**Example:**
- Income: RM150,000
- Reliefs: RM24,000
- Taxable income: RM126,000
- **You pay tax on RM126k, not RM150k** (saves you money!)

## Default Reliefs

**What you get by default:**

```typescript
{
  basic: 9000,              // Everyone gets this
  epfAndLifeInsurance: 7000, // EPF + Life Insurance (combined max)
  medical: 8000             // Medical insurance/expenses
}
// Total: RM24,000
```

**These are applied automatically** unless you provide custom reliefs.

## How Reliefs Work

### Step 1: Calculate Total Reliefs

All relief values are summed:

```typescript
import { calculateTotalReliefs } from '@tax-engine/config';

const reliefs = {
  basic: 9000,
  epfAndLifeInsurance: 7000,
  medical: 8000,
  spouse: 4000,
};

const total = calculateTotalReliefs(reliefs);
// RM28,000
```

### Step 2: Subtract from Income

```typescript
const income = 150000;
const reliefs = 28000;
const taxableIncome = income - reliefs;
// RM122,000
```

### Step 3: Calculate Tax on Taxable Income

Tax is calculated on the reduced amount, saving you money.

## Available Reliefs

### Basic Relief

**Amount:** RM9,000

**Who gets it:** Everyone (mandatory)

**Can you change it?** Technically yes, but why would you? It's always RM9,000.

### EPF & Life Insurance

**Amount:** RM7,000 (combined max)

**Who gets it:** If you contribute to EPF or pay life insurance premiums

**Limits:**
- EPF contributions: Up to RM7,000
- Life insurance: Up to RM7,000
- **Combined max: RM7,000** (not RM14,000!)

**Example:**
- EPF contributions: RM8,000 → Counts as RM7,000 (max)
- Life insurance: RM5,000 → Counts as RM5,000
- **Total relief: RM7,000** (not RM12,000 - it's combined max)

**Note:** The calculator uses default RM7,000. If you contribute more, you'd get more relief (but we don't calculate actual EPF contributions).

### Medical Relief

**Amount:** RM8,000

**Who gets it:** If you have medical insurance or medical expenses

**What counts:**
- Medical insurance premiums
- Medical expenses (with receipts)
- Up to RM8,000 total

### Spouse Relief

**Amount:** RM4,000

**Who gets it:** If your spouse has no income (or very low income)

**Conditions:**
- Spouse must have no income OR
- Spouse's income is below threshold

**Not in default:** You need to add this manually if applicable.

### Children Relief

**Amount:** RM2,000 per child (varies by age)

**Who gets it:** If you have children

**Rates (approximate):**
- Per child: RM2,000
- Varies by age and status
- Check LHDN for exact amounts

**Not in default:** You need to add this manually.

### Education/Medical (Children)

**Amount:** RM8,000 per child

**Who gets it:** If you pay for children's education or medical expenses

**Not in default:** You need to add this manually.

## Customizing Reliefs in the App

### Using the UI

1. Open the app
2. Scroll to "Tax Reliefs (Optional)" section
3. Click to expand
4. Enter custom values
5. Results update automatically

**Example:** Adding spouse relief
- Find "Spouse Relief" field
- Enter `4000`
- Results recalculate with more reliefs = less tax

### Programmatically

```typescript
import { calculateSolePropScenario } from '@tax-engine/core';

const result = calculateSolePropScenario({
  businessProfit: 150000,
  otherIncome: 0,
  reliefs: {
    basic: 9000,
    epfAndLifeInsurance: 7000,
    medical: 8000,
    spouse: 4000, // Custom
    children: 4000, // 2 children × RM2k
  },
});

// More reliefs = less tax = more net cash
```

## Adding New Relief Types

**Want to add a new relief type?** (e.g., "Digital Business Relief")

### Step 1: Update Interface

**File:** `packages/config/defaultReliefs.ts`

```typescript
export interface PersonalReliefs {
  // ... existing fields
  digitalBusiness?: number; // New relief
  [key: string]: number | undefined; // Already allows this
}
```

**Note:** The `[key: string]` index signature already allows additional reliefs, so you might not need to update the interface.

### Step 2: Add to UI

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

### Step 3: Update Documentation

Add to reliefs documentation and examples.

**That's it!** The calculation already handles additional reliefs automatically.

## Relief Limits

**Maximum reliefs (reference):**

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

**Use these limits** to:
- Validate user input
- Show maximum reliefs in UI
- Prevent invalid values

## Common Scenarios

### Scenario 1: Single, No Dependents

**Reliefs:**
```typescript
{
  basic: 9000,
  epfAndLifeInsurance: 7000,
  medical: 8000,
}
// Total: RM24,000 (default)
```

### Scenario 2: Married, Spouse Has No Income

**Reliefs:**
```typescript
{
  basic: 9000,
  epfAndLifeInsurance: 7000,
  medical: 8000,
  spouse: 4000,
}
// Total: RM28,000
```

### Scenario 3: Married, 2 Children

**Reliefs:**
```typescript
{
  basic: 9000,
  epfAndLifeInsurance: 7000,
  medical: 8000,
  spouse: 4000,
  children: 4000, // 2 × RM2k
}
// Total: RM32,000
```

### Scenario 4: Maximum Reliefs (Hypothetical)

**Reliefs:**
```typescript
{
  basic: 9000,
  epfAndLifeInsurance: 7000,
  medical: 8000,
  spouse: 4000,
  children: 10000, // 5 children × RM2k
  education: 40000, // 5 children × RM8k
}
// Total: RM78,000
```

**Note:** This is hypothetical. Real reliefs have limits and conditions.

## How Reliefs Affect Calculations

### More Reliefs = Less Tax

**Example:** RM150k income

**With default reliefs (RM24k):**
- Taxable income: RM126k
- Tax: ~RM18,900

**With custom reliefs (RM32k):**
- Taxable income: RM118k
- Tax: ~RM16,500
- **Savings: RM2,400**

### Reliefs Make Enterprise More Attractive

**Why:** More reliefs reduce personal tax, which benefits Enterprise more than Sdn Bhd (because Enterprise pays personal tax on all profit).

**Example:**
- RM150k profit
- Default reliefs: Enterprise wins by RM5k
- More reliefs (+RM8k): Enterprise wins by RM7k (bigger advantage)

## Testing Relief Combinations

**Test different scenarios:**

```typescript
// Test 1: Default reliefs
const result1 = calculateSolePropScenario({
  businessProfit: 150000,
  otherIncome: 0,
});

// Test 2: With spouse
const result2 = calculateSolePropScenario({
  businessProfit: 150000,
  otherIncome: 0,
  reliefs: {
    basic: 9000,
    epfAndLifeInsurance: 7000,
    medical: 8000,
    spouse: 4000,
  },
});

// Compare results
console.log('Default:', result1.netCash);
console.log('With spouse:', result2.netCash);
console.log('Difference:', result2.netCash - result1.netCash);
```

## Common Mistakes

### Mistake 1: Thinking EPF Relief is Separate

**Wrong:** EPF relief (RM7k) + Life Insurance relief (RM7k) = RM14k

**Right:** EPF + Life Insurance combined max = RM7k

### Mistake 2: Not Understanding Limits

**Example:** Medical relief is RM8k max. If you spend RM15k, you still only get RM8k relief.

### Mistake 3: Adding Reliefs That Don't Apply

**Example:** Adding spouse relief when spouse has income (doesn't qualify).

**Solution:** Only add reliefs you actually qualify for.

### Mistake 4: Forgetting Children Relief

**Common:** People forget to add children relief, losing RM2k per child.

**Solution:** Check if you have children and add the relief.

## Verification

**How to verify reliefs are correct:**

1. **Check LHDN website:** [www.hasil.gov.my](https://www.hasil.gov.my)
2. **Read Budget announcements:** Reliefs are announced annually
3. **Consult tax advisor:** They know current reliefs
4. **Check your EA form:** Shows reliefs you claimed

**The calculator uses standard reliefs.** Your actual reliefs might be different based on your specific situation.

## Contributing

**Found incorrect relief amounts?**
- Check LHDN website for current rates
- Submit PR with updated amounts
- Include source (LHDN announcement, Budget document)

**Want to add new relief type?**
- Follow steps in "Adding New Relief Types" above
- Include source for the relief
- Add tests
- Update documentation

---

**Questions?** Check [Tax Calculations Guide](../concepts/tax-calculations.md) or consult a tax advisor for your specific situation.

