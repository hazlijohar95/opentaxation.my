# Constants Reference

All magic numbers and constants used in the tax calculation engine, explained.

## Core Constants

### `SIMILARITY_THRESHOLD`

**Value:** `3000` (RM3,000)

**Location:** `packages/core/constants.ts`

**Purpose:** Difference threshold for comparing scenarios. If the difference is less than this amount, scenarios are considered "similar".

**Usage:**
```typescript
if (Math.abs(difference) < SIMILARITY_THRESHOLD) {
  return 'similar';
}
```

**Why RM3,000?** At lower profit levels, small differences (RM1k-2k) might be due to rounding or minor variations. RM3k is a reasonable threshold where differences become meaningful.

**When to change:** If you want stricter or looser similarity detection.

### `CROSSOVER_CALCULATION`

**Values:**
```typescript
{
  MIN_PROFIT: 0,
  MAX_PROFIT: 2_000_000,      // RM2M
  TOLERANCE: 100,              // RM100
  MAX_ITERATIONS: 50,
  EARLY_EXIT_THRESHOLD: 100,  // RM100
}
```

**Location:** `packages/core/constants.ts`

**Purpose:** Constants for crossover point calculation (finding profit level where both scenarios are equal).

**Usage:**
```typescript
// Binary search from MIN_PROFIT to MAX_PROFIT
// Stop when difference < TOLERANCE or iterations > MAX_ITERATIONS
```

**Why these values?**
- **MIN_PROFIT:** Can't have negative profit (well, you can, but we don't calculate for that)
- **MAX_PROFIT:** RM2M is reasonable upper bound (most businesses are below this)
- **TOLERANCE:** RM100 is close enough (we're not doing rocket science)
- **MAX_ITERATIONS:** 50 iterations should be enough (binary search is fast)
- **EARLY_EXIT_THRESHOLD:** If difference < RM100, consider equal (avoid infinite loops)

**When to change:** If you need higher precision or wider range.

### `SALARY_VALIDATION`

**Values:**
```typescript
{
  MAX_PERCENTAGE_OF_PROFIT: 0.8,  // 80%
}
```

**Location:** `packages/core/constants.ts`

**Purpose:** Maximum salary as percentage of profit (for validation).

**Usage:**
```typescript
if (annualSalary > businessProfit * SALARY_VALIDATION.MAX_PERCENTAGE_OF_PROFIT) {
  throw new Error('Salary cannot exceed 80% of profit');
}
```

**Why 80%?** You can't pay yourself more than your profit (well, you can, but it doesn't make sense). 80% leaves room for other costs.

**When to change:** If you want stricter or looser validation.

### `ROUNDING`

**Values:**
```typescript
{
  CURRENCY: 2,      // 2 decimal places
  PERCENTAGE: 4,    // 4 decimal places
}
```

**Location:** `packages/core/constants.ts`

**Purpose:** Rounding precision for currency and percentages.

**Usage:**
```typescript
const rounded = Math.round(value * 100) / 100; // Currency
const rounded = Math.round(value * 10000) / 10000; // Percentage
```

**Why these values?**
- **CURRENCY:** RM amounts use 2 decimals (RM123.45)
- **PERCENTAGE:** Rates use 4 decimals (0.1234 = 12.34%)

**When to change:** If you need different precision (unlikely).

## Config Constants

### Tax Brackets

**Location:** `packages/config/personalTaxBrackets.ts`, `packages/config/corporateTaxBrackets.ts`

**Personal tax brackets (YA 2024/2025):**
```typescript
[
  { min: 0, max: 5000, rate: 0 },
  { min: 5000, max: 20000, rate: 0.01 },
  { min: 20000, max: 35000, rate: 0.03 },
  // ... etc
]
```

**Corporate tax brackets (SME):**
```typescript
[
  { min: 0, max: 150000, rate: 0.15 },
  { min: 150000, max: 600000, rate: 0.17 },
  { min: 600000, max: null, rate: 0.24 },
]
```

**When to change:** When government announces new tax rates (usually in Budget).

### EPF Rates

**Location:** `packages/config/epfRules.ts`

**Values:**
```typescript
{
  employer: {
    low: 0.13,        // 13% for salary ≤ RM5k/month
    high: 0.12,       // 12% for salary > RM5k/month
    threshold: 5000,  // Monthly threshold
  },
  employee: 0.11,    // 11% (always)
}
```

**When to change:** When EPF announces rate changes (rare).

### Audit Exemption Thresholds

**Location:** `packages/config/auditRules.ts`

**Values:**
```typescript
{
  revenue: 100000,      // RM100k
  totalAssets: 300000,  // RM300k
  employees: 5,         // 5 employees
}
```

**When to change:** When Companies Act changes (rare).

### Dividend Tax

**Location:** `packages/config/dividendTax.ts`

**Values:**
```typescript
DIVIDEND_TAX_THRESHOLD = 100000;  // RM100k
DIVIDEND_TAX_RATE = 0.02;         // 2%
```

**When to change:** When government announces changes (YA 2025 was recent change).

### Default Reliefs

**Location:** `packages/config/defaultReliefs.ts`

**Values:**
```typescript
{
  basic: 9000,
  epfAndLifeInsurance: 7000,
  medical: 8000,
}
```

**When to change:** When government announces relief changes (usually in Budget).

## UI Constants

### Font Sizes

**Not in constants file** (use Tailwind classes), but common sizes:

- `text-xs` - 12px
- `text-sm` - 14px
- `text-base` - 16px
- `text-lg` - 18px
- `text-xl` - 20px
- `text-2xl` - 24px
- `text-3xl` - 30px

### Colors

**Theme colors** (from Tailwind config):

- `foreground` - Text color
- `background` - Background color
- `muted` - Muted text/background
- `border` - Border color
- `--blue` - Primary blue (sparingly used)

## Magic Numbers Explained

### Why RM3,000 for Similarity?

**Reason:** At lower profit levels (RM100k-200k), differences of RM1k-2k might be due to:
- Rounding errors
- Minor variations in inputs
- Not meaningful enough to make a decision

**RM3k threshold:** Differences above this are meaningful enough to consider.

**Example:**
- Difference of RM2,500 → "similar" (not meaningful)
- Difference of RM5,000 → "Enterprise better" (meaningful)

### Why RM2M for Max Profit?

**Reason:** Most Malaysian SMEs have profit below RM2M. Going higher:
- Increases calculation time (binary search)
- Rarely needed (most users are below RM1M)
- Can cause precision issues at very high values

**If needed:** Can increase, but unlikely.

### Why RM100 Tolerance?

**Reason:** We're calculating tax, not rocket science. RM100 difference is:
- Close enough for decision-making
- Accounts for rounding errors
- Prevents infinite loops in binary search

**If needed:** Can decrease for higher precision, but probably unnecessary.

## When to Change Constants

**Change when:**
- Government announces new rates (tax brackets, reliefs)
- EPF changes rates (rare)
- Companies Act changes (audit exemption)
- You need different thresholds (similarity, crossover)

**Don't change:**
- Rounding precision (unless you have a good reason)
- Validation rules (unless you have a good reason)
- UI constants (use Tailwind classes instead)

## Finding Constants

**Core constants:** `packages/core/constants.ts`

**Config constants:** `packages/config/` (various files)

**UI constants:** Tailwind config (`apps/web/tailwind.config.js`)

## Contributing

**Found a constant that's wrong?**
- Check LHDN website for official rates
- Submit PR with updated constant
- Include source (LHDN announcement, Budget document)

**Want to add a constant?**
- Add to appropriate file
- Document it here
- Use it in code

---

**Questions?** Check the source code - constants are well-commented.

