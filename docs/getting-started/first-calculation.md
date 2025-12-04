# Your First Calculation

Let's calculate tax for a fictional business. Because real businesses have real problems, and we don't want those.

## The Scenario

Meet **Ahmad's Tech Services**:
- **Annual profit**: RM150,000 (decent side business)
- **Other income**: RM0 (just this business)
- **Considering**: Should Ahmad stay as Enterprise or switch to Sdn Bhd?

This is a realistic scenario. RM150k profit is common for small Malaysian businesses.

## Step-by-Step Walkthrough

### Step 1: Open the App

If you haven't already:
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Step 2: Enter Business Details

On the input form (left side), enter:

**Business Income:**
- **Annual business profit**: `150000`
- **Other income**: `0`

**If Sdn Bhd:**
- **Monthly salary**: `5000` (RM5k/month = RM60k/year)
- **Annual compliance cost**: `5000` (typical for small companies)

**Audit Exemption:**
- **Revenue**: `150000` (same as profit for simplicity)
- **Assets**: `200000` (reasonable for a small business)
- **Employees**: `2` (Ahmad + 1 employee)

Since revenue (RM150k) > RM100k, audit is **required**. Enter:
- **Audit cost**: `5000` (typical audit fee)

### Step 3: Watch the Magic

Results appear instantly on the right side. No button to click - it's live calculation.

**What you should see:**

**Enterprise (Sole Prop) Card:**
- Personal tax: Around RM15,000-20,000 (depends on reliefs)
- Net cash: Around RM130,000-135,000

**Sdn Bhd Card:**
- Company tax: Around RM13,500-15,000
- Personal tax: Around RM5,000-8,000
- Total compliance cost: RM10,000 (RM5k compliance + RM5k audit)
- Net cash: Around RM120,000-125,000

**Recommendation:**
Probably "Stay as Enterprise" - saves around RM5,000-10,000 per year.

### Step 4: Understand the Results

**Why Enterprise wins here?**

1. **Lower compliance costs**: No audit needed (if you qualify), no company secretary fees
2. **Simpler structure**: Less paperwork, less hassle
3. **RM150k profit**: Not high enough for corporate tax benefits to outweigh costs

**When would Sdn Bhd win?**

- Higher profit (RM300k+)
- Need for limited liability
- Want to pay yourself a salary (EPF benefits)
- Planning to scale or get investors

### Step 5: Try Different Scenarios

**Scenario A: Higher Profit**
- Change profit to `300000`
- Now Sdn Bhd might win (lower corporate tax rate kicks in)

**Scenario B: Lower Compliance Costs**
- Change compliance cost to `3000`
- Change audit cost to `0` (if you qualify for exemption)
- Sdn Bhd becomes more attractive

**Scenario C: Higher Salary**
- Change monthly salary to `10000`
- More EPF contributions, but also more personal tax
- See how it affects the comparison

## Expected Output Explained

### Enterprise Scenario

**Calculation:**
1. Total income = Business profit + Other income = RM150,000
2. Minus reliefs (default RM24,000) = RM126,000 taxable income
3. Personal tax calculated using progressive brackets
4. Net cash = Profit - Tax

**Breakdown:**
- Tax brackets: 0-5k (0%), 5-20k (1%), 20-35k (3%), 35-50k (6%), 50-70k (11%), 70-100k (19%), 100-250k (25%)
- Tax on RM126k ≈ RM18,000-20,000
- Net cash ≈ RM130,000-132,000

### Sdn Bhd Scenario

**Calculation:**
1. Company pays you salary: RM60,000/year
2. Employer EPF (13% of RM60k): RM7,800
3. Company taxable profit = RM150,000 - RM60,000 - RM7,800 = RM82,200
4. Company tax (15% on first RM150k): RM12,330
5. Post-tax profit: RM69,870
6. Dividends: RM69,870 (assumed fully distributed)
7. Dividend tax: RM0 (under RM100k threshold)
8. You pay personal tax on salary: RM60,000 - reliefs = RM36,000 taxable → ~RM4,000 tax
9. Compliance costs: RM10,000 (RM5k compliance + RM5k audit)
10. Net cash = Salary after EPF + Dividends - Personal tax - Compliance = ~RM120,000-125,000

**Why it's lower:**
- Compliance costs eat into savings
- Audit requirement adds cost
- At RM150k profit, corporate tax benefits don't outweigh costs

## Now Try Breaking It

**Edge Cases to Test:**

1. **Zero profit**: Enter `0` - should show no tax, but still calculate
2. **Negative numbers**: Try `-1000` - should be prevented or handled
3. **Very high profit**: Try `1000000` - see how brackets work
4. **No salary**: Set salary to `0` - Sdn Bhd scenario breaks (as it should)
5. **Extreme compliance costs**: Set to `50000` - Enterprise always wins

**What breaks?**
- Negative numbers should be prevented (input validation)
- Zero salary in Sdn Bhd doesn't make sense (should warn)
- Very high numbers might cause precision issues (but should work)

## Understanding the Crossover Chart

Scroll down to see the **Crossover Analysis** chart.

**What it shows:**
- X-axis: Business profit (RM0 to RM200k+)
- Y-axis: Net cash after tax
- Two lines: Enterprise (black) vs Sdn Bhd (gray)

**The crossover point** is where both lines meet - that's the profit level where both structures are equal.

**For Ahmad's scenario:**
- At RM150k: Enterprise wins
- Crossover point: Probably around RM200k-250k
- Above crossover: Sdn Bhd wins

## Common Mistakes

**Mistake 1: Forgetting Audit Costs**
- If you qualify for audit exemption, set audit cost to `0`
- If you don't, include audit fees (RM3k-8k typical)

**Mistake 2: Unrealistic Salary**
- Salary can't exceed 80% of profit (validation should catch this)
- Too high salary = less company profit = less dividends

**Mistake 3: Ignoring Compliance Costs**
- Sdn Bhd has real costs: company secretary, SSM fees, tax agent
- RM3k-15k is realistic range

**Mistake 4: Not Considering Reliefs**
- Default reliefs are RM24k
- If you have spouse/kids, add more reliefs
- More reliefs = less tax = Enterprise becomes more attractive

## What's Next?

- [How Tax Calculations Work](../concepts/tax-calculations.md) - Deep dive into the math
- [Architecture Overview](../concepts/architecture.md) - How the code works
- [API Reference](../api/core-package.md) - Use the calculation functions directly

---

**Questions?** The calculations are open source. Read the code, understand it, and if you find bugs, let us know!

