# Your First Calculation

Let's calculate tax for a fictional business.

---

## The Scenario

Meet **Ahmad's Tech Services**:
- **Annual profit**: RM150,000 (decent side business)
- **Other income**: RM0 (just this business)
- **Considering**: Should Ahmad stay as Enterprise or switch to Sdn Bhd?

This is a realistic scenario. RM150k profit is common for small Malaysian businesses.

---

## Step-by-Step Walkthrough

### Step 1: Open the App

If you haven't already:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Step 2: Get to the Calculator

Click **"Get Started"** on the landing page. This scrolls to the calculator section.

**On Desktop:** You'll see a two-column layout:
- Left: Input form
- Right: Results

**On Mobile:** You'll see a tab-based layout:
- Bottom tabs to switch between "Inputs" and "Results"
- Swipe or tap to navigate

### Step 3: Enter Business Details

**Business Income:**

| Field | Value | Notes |
|-------|-------|-------|
| Annual business profit | `150,000` | Your gross profit |
| Other income | `0` | Side income, if any |

**Sdn Bhd Settings:**

| Field | Value | Notes |
|-------|-------|-------|
| Monthly salary | `5,000` | RM5k/month = RM60k/year |
| Compliance cost | `5,000` | Company secretary, SSM fees |

**Audit Status:**

| Field | Value | Notes |
|-------|-------|-------|
| Revenue | `150,000` | Same as profit for simplicity |
| Assets | `200,000` | Reasonable for small business |
| Employees | `2` | Ahmad + 1 employee |

Since revenue (RM150k) > RM100k, audit is **required**. Enter:
- **Audit cost**: `5,000` (typical audit fee)

### Step 4: Watch the Magic

Results appear instantly. No button to click - it's live calculation.

**What you should see:**

**Enterprise Card (Blue border):**
- Personal tax: ~RM15,000-20,000
- Net cash: ~RM130,000-135,000
- Effective tax rate: ~10-13%

**Sdn Bhd Card (Emerald border):**
- Company tax: ~RM12,000-15,000
- Personal tax: ~RM4,000-6,000
- Compliance costs: RM10,000
- Net cash: ~RM120,000-125,000

**Recommendation Card:**
- Probably shows "Stay as Enterprise"
- Savings: ~RM5,000-10,000 per year

### Step 5: Understand the Results

**Why Enterprise wins here?**

1. **Lower compliance costs**: No audit fees, no company secretary
2. **Simpler structure**: Less paperwork, less hassle
3. **RM150k profit**: Not high enough for corporate tax benefits

**When would Sdn Bhd win?**

- Higher profit (RM300k+)
- Need for limited liability
- Want EPF benefits from salary
- Planning to scale or get investors

### Step 6: Explore Advanced Options

Toggle **"Advanced"** to see more options:

**Dividend Settings:**
- Distribution percentage (default 100%)
- YA 2025 dividend surcharge toggle

**Zakat Section:**
- Enable Zakat calculation
- See how Zakat offsets tax

**Tax Reliefs:**
- Expand to customize reliefs
- Default is RM24,000

---

## Try Different Scenarios

### Scenario A: Higher Profit

Change profit to `300,000`:
- Sdn Bhd becomes more competitive
- Corporate tax rate benefits kick in
- Watch the crossover chart

### Scenario B: Lower Compliance Costs

- Set compliance cost to `3,000`
- Set audit cost to `0` (if exempted)
- Sdn Bhd becomes more attractive

### Scenario C: Target Net Income Mode

Toggle to "Target Mode":
- Enter your desired net income
- Calculator figures out required profit
- Useful for planning

### Scenario D: With Zakat

Enable Zakat in Advanced settings:
- See Zakat amount calculated
- Watch how it offsets personal tax
- Compare both scenarios with Zakat

---

## Understanding the Waterfall Breakdown

Click **"Show breakdown"** on any tax card to see the waterfall:

**Enterprise Waterfall:**
```
Starting Profit        RM150,000
- Tax Reliefs          -RM24,000
= Taxable Income       RM126,000
- Personal Tax         -RM18,000
= Net Cash             RM132,000
```

**Sdn Bhd Waterfall (Two levels):**

Company Level:
```
Starting Profit        RM150,000
- Director Salary      -RM60,000
- Employer EPF         -RM7,800
= Taxable Profit       RM82,200
- Corporate Tax        -RM12,330
= After-Tax Profit     RM69,870
```

Personal Level:
```
Salary Received        RM60,000
+ Dividends            RM69,870
- Tax Reliefs          -RM24,000
= Taxable Income       RM105,870
- Personal Tax         -RM8,000
- Compliance Costs     -RM10,000
= Net Cash             RM121,870
```

---

## Understanding the Crossover Chart

Scroll down to see the **Crossover Analysis** chart.

**What it shows:**
- X-axis: Business profit (RM0 to RM500k+)
- Y-axis: Net cash after tax
- Two lines: Enterprise vs Sdn Bhd

**The crossover point** is where both lines meet - that's the profit level where both structures are equal.

**For Ahmad's scenario:**
- At RM150k: Enterprise wins
- Crossover point: ~RM200k-250k
- Above crossover: Sdn Bhd wins

---

## Mobile Experience

On mobile, the experience is optimized:

**Bottom Navigation:**
- **Inputs** tab: All input fields
- **Results** tab: Tax cards and charts

**Features:**
- Pull down to see header
- Results badge shows when new results available
- Tap tabs or swipe to navigate

**Install as PWA:**
1. Tap Share → "Add to Home Screen"
2. Launch for app-like experience
3. Works offline

---

## Common Mistakes

### Mistake 1: Forgetting Audit Costs

- If you qualify for audit exemption, set audit cost to `0`
- If you don't, include audit fees (RM3k-8k typical)

### Mistake 2: Unrealistic Salary

- Salary can't exceed profit
- Too high salary = less company profit = less dividends

### Mistake 3: Ignoring Compliance Costs

Sdn Bhd has real costs:
- Company secretary: RM1k-3k
- SSM annual return: RM200-500
- Tax agent: RM2k-5k
- Audit (if required): RM3k-8k

### Mistake 4: Not Considering Reliefs

- Default reliefs are RM24k
- If you have spouse/kids, add more
- More reliefs = less tax = Enterprise more attractive

---

## What's Next?

- [How Tax Calculations Work](../concepts/tax-calculations.md) - Deep dive into the math
- [Architecture Overview](../concepts/architecture.md) - How the code works
- [API Reference](../api/core-package.md) - Use calculation functions directly

---

**Questions?** The calculations are open source. Read the code, understand it, and if you find bugs, let us know!
