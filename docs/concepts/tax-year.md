# Tax Year & Updates

Current tax year, how to update when rates change, and the honest truth about staying current.

## Current Tax Year

**Year of Assessment (YA):** 2024/2025

**Last Updated:** January 2025

**What this means:** All tax rates and rules in this calculator are based on Malaysia's tax laws for Year of Assessment 2024/2025.

## What's Included

### Personal Income Tax
- Tax brackets: YA 2024/2025 rates
- Reliefs: Current relief amounts
- Calculation method: Progressive brackets (as per LHDN)

### Corporate Tax (SME)
- Tax brackets: 15-24% progressive rates
- SME qualification: Revenue < RM50M, shareholding requirements
- Calculation method: Progressive brackets

### EPF Contributions
- Employer: 13% (≤RM5k/month), 12% (>RM5k/month)
- Employee: 11%
- Rates as of 2024/2025

### Dividend Tax
- **YA 2025 change:** 2% surcharge on dividends > RM100k
- Previous years: Dividends were tax-free
- This is a new rule starting YA 2025

### Audit Exemption
- Criteria: Revenue ≤ RM100k, Assets ≤ RM300k, ≤ 5 employees
- Based on Companies Act 2016

## How Tax Years Work

**Year of Assessment (YA)** is the year you file taxes for. It's usually the same as the calendar year, but can be different for companies.

**Example:**
- Calendar year 2024 → Year of Assessment 2024/2025
- You file taxes in 2025 for income earned in 2024

**Why the "/2025"?** Because you file in 2025, even though the income was earned in 2024.

## When Rates Change

Tax rates don't change every year. Usually:
- **Personal tax brackets:** Change every few years (or never)
- **Corporate tax rates:** Change when government announces budget
- **Reliefs:** Change occasionally (government announcements)
- **EPF rates:** Very stable (rarely change)

**Malaysia's tax system is relatively stable.** Rates don't change as often as you might think.

## How to Update Rates

When LHDN announces new tax rates (usually in Budget announcements):

### Step 1: Update Configuration Files

**Personal tax brackets:**
- File: `packages/config/personalTaxBrackets.ts`
- Update: `PERSONAL_TAX_BRACKETS` array
- Test: Run `npm run test` to verify calculations

**Corporate tax brackets:**
- File: `packages/config/corporateTaxBrackets.ts`
- Update: `CORPORATE_TAX_BRACKETS` array
- Test: Run `npm run test`

**Reliefs:**
- File: `packages/config/defaultReliefs.ts`
- Update: `DEFAULT_RELIEFS` object
- Test: Verify calculations still work

### Step 2: Update Documentation

**Files to update:**
- `docs/concepts/tax-calculations.md` - Update brackets table
- `packages/core/ASSUMPTIONS.md` - Update tax year and rates
- `README.md` - Update "Current tax year" if mentioned

### Step 3: Update Tests

**File:** `packages/core/tax/__tests__/taxCalculations.test.ts`

**What to do:**
- Update test cases with new rates
- Add tests for new brackets
- Verify edge cases still work

### Step 4: Update Changelog

**File:** `packages/config/CHANGELOG.md`

**What to add:**
- Date of update
- What changed (brackets, rates, etc.)
- Source (LHDN announcement, Budget 202X, etc.)

### Step 5: Test Everything

```bash
npm run test
npm run build
npm run dev  # Test in browser
```

**Verify:**
- Calculations are correct
- UI displays correctly
- No TypeScript errors
- No broken tests

## Example: Updating Personal Tax Brackets

**Scenario:** Government announces new brackets for YA 2025/2026

**Step 1:** Update `packages/config/personalTaxBrackets.ts`:

```typescript
export const PERSONAL_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 5000, rate: 0 },
  { min: 5000, max: 20000, rate: 0.01 },
  // ... new brackets here
];
```

**Step 2:** Update `packages/core/ASSUMPTIONS.md`:
- Change "YA 2024/2025" to "YA 2025/2026"
- Update brackets table
- Update "Last Updated" date

**Step 3:** Update tests in `packages/core/tax/__tests__/taxCalculations.test.ts`:
- Update expected values
- Add tests for new brackets

**Step 4:** Update `packages/config/CHANGELOG.md`:
```markdown
## [2025-01-XX] - YA 2025/2026 Update
- Updated personal tax brackets
- Source: Budget 2025 announcement
```

**Step 5:** Test:
```bash
npm run test
npm run build
```

**Done!** The calculator now uses new rates.

## Staying Current

**How often should you update?**

- **When government announces changes:** Update immediately (or as soon as you can)
- **At start of new tax year:** Check if anything changed
- **When users report issues:** Verify rates are still correct

**Pro tip:** Subscribe to LHDN announcements or check their website annually.

## We're Not Tax Advisors

**Important disclaimer:** This calculator is a tool, not professional tax advice.

**What we do:**
- Calculate tax based on standard rates
- Show comparisons between structures
- Provide estimates

**What we don't do:**
- Verify your specific situation
- Account for all possible deductions
- Guarantee accuracy for your case
- Replace professional tax advice

**When to consult a tax advisor:**
- You have complex tax situations
- You're not sure about deductions
- You need tax planning strategies
- You're making major business decisions

**Use this calculator as a starting point, not the final answer.**

## Sources

**Where we get tax rates from:**
- LHDN Malaysia (Inland Revenue Board of Malaysia) - Official source
- Budget announcements - When rates change
- Companies Act 2016 - For audit exemption rules
- EPF Act 1991 - For EPF contribution rates

**How to verify:**
- Check LHDN website: [www.hasil.gov.my](https://www.hasil.gov.my)
- Read Budget announcements
- Consult with tax advisors

## Version History

**v1.0 (January 2025):**
- Initial release
- YA 2024/2025 rates
- Basic calculations (Enterprise vs Sdn Bhd)
- EPF, audit exemption, dividend tax

**Future versions:**
- SOCSO calculations (v2)
- More relief options
- Tax year selector
- Historical rate comparisons

## Contributing Updates

**Found outdated rates?** Open an issue or submit a PR.

**What to include:**
- Source of new rates (LHDN announcement, Budget document, etc.)
- What changed (brackets, rates, reliefs, etc.)
- Date of change
- Link to official source (if available)

**We'll verify and update as soon as possible.**

---

**Questions about tax years?** Check [LHDN website](https://www.hasil.gov.my) or consult a tax advisor.

**Want to update rates yourself?** Read [How to Add a Tax Rule](../how-to/add-tax-rule.md).

