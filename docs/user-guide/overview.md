# User Guide: opentaxation.my

Welcome to the complete user guide for opentaxation.my - Malaysia's free tax calculator for comparing Enterprise vs Sdn Bhd.

## Quick Navigation

| Section | Description |
|---------|-------------|
| [Getting Started](#getting-started) | Your first calculation in 60 seconds |
| [Understanding Results](#understanding-the-results) | How to read the comparison |
| [Zakat Calculator](#zakat-calculator) | Islamic wealth tax integration |
| [Installing as App](#install-as-mobile-app) | PWA installation guide |

---

## Getting Started

### Step 1: Enter Your Business Profit

Enter your **annual business profit** - this is your revenue minus expenses.

```
Example: If you earn RM20,000/month with RM5,000/month expenses
Annual Profit = (20,000 - 5,000) × 12 = RM180,000
```

### Step 2: Set Your Preferences

| Field | Description | Default |
|-------|-------------|---------|
| Other Income | Rental, interest, etc. | RM0 |
| Monthly Salary | For Sdn Bhd director salary | RM5,000 |
| Compliance Costs | Sdn Bhd annual costs | RM5,000 |
| Audit Criteria | Revenue, assets, employees | Auto-calculated |

### Step 3: View Comparison

The calculator shows side-by-side comparison:

```
┌─────────────────────┬─────────────────────┐
│     ENTERPRISE      │      SDN BHD        │
├─────────────────────┼─────────────────────┤
│ Total Tax: RM X     │ Total Tax: RM Y     │
│ Net Cash: RM A      │ Net Cash: RM B      │
│ Effective: X.XX%    │ Effective: Y.YY%    │
└─────────────────────┴─────────────────────┘
```

---

## Understanding the Results

### The Waterfall Breakdown

Each card shows a step-by-step flow of your money:

**Enterprise Waterfall:**
```
Business Profit         RM180,000
  - Personal Reliefs    -RM18,000
  = Taxable Income      RM162,000
  - Personal Tax        -RM24,200
  = Net Cash to You     RM155,800
```

**Sdn Bhd Waterfall:**
```
Company Level:
  Business Profit       RM180,000
  - Director Salary     -RM60,000
  - Employer EPF        -RM7,800
  = Company Profit      RM112,200
  - Corporate Tax       -RM18,430
  = Post-Tax Profit     RM93,770

Personal Level:
  Salary (gross)        RM60,000
  - Employee EPF        -RM6,600
  = Salary Take-Home    RM53,400
  + Dividends           RM93,770
  - Compliance          -RM5,000
  = Net Cash to You     RM142,170
```

### The Crossover Chart

The chart shows at what profit level both structures become equal.

- **Below crossover**: Enterprise is usually better (simpler, lower costs)
- **Above crossover**: Sdn Bhd may be better (tax optimization possible)

---

## Zakat Calculator

For Muslim business owners, the calculator includes zakat integration.

### How It Works

| Business Type | Tax Treatment | Reference |
|---------------|---------------|-----------|
| Enterprise | 100% Tax Rebate | Section 6A(3) ITA 1967 |
| Sdn Bhd | 2.5% Tax Deduction | Section 44(11A) ITA 1967 |

### Using Zakat

1. Toggle **"I pay zakat"** in the Zakat section
2. Choose **Auto-calculate (2.5%)** or **Enter amount**
3. View impact in the waterfall breakdown

### Example

```
With Zakat (Enterprise):
  Income Tax (before)   RM24,200
  - Zakat Rebate (100%) -RM4,500
  = Net Tax After Zakat RM19,700
  - Zakat Paid          -RM4,500
  = Net Cash            RM155,800
```

---

## Install as Mobile App

opentaxation.my is a Progressive Web App (PWA) - install it like a native app!

### iOS (Safari)

1. Open opentaxation.my in Safari
2. Tap the **Share** button (square with arrow)
3. Scroll down, tap **"Add to Home Screen"**
4. Tap **"Add"**

### Android (Chrome)

1. Open opentaxation.my in Chrome
2. Tap the **three dots** menu
3. Tap **"Install app"** or **"Add to Home screen"**
4. Confirm installation

### Benefits of Installing

- Works offline (cached calculations)
- Faster loading
- Full-screen experience
- Quick access from home screen

---

## Tips for Best Results

### Be Accurate with Numbers

The calculator is only as good as your inputs. Use actual figures, not estimates.

### Consider All Factors

Tax savings isn't everything. See the "Beyond Tax" section for:
- Liability protection
- Banking access
- Business credibility
- Compliance burden

### Update Regularly

Tax rates may change. Check you're using the latest rates (currently YA 2024/2025).

### Save Your Calculations

Sign in with Google to:
- Save calculations for later
- Compare scenarios over time
- Access from any device

---

## Need Help?

- **Documentation**: See the full [docs](../README.md)
- **Bug Report**: [Open an issue](https://github.com/your-repo/issues)
- **Questions**: Check the [FAQ](./faq.md)
