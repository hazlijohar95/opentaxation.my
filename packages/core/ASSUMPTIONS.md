# Tax Calculation Assumptions & Methodology

## Tax Year
- **Year of Assessment (YA)**: 2024/2025
- **Last Updated**: January 2025

## Personal Income Tax

### Tax Brackets
Source: LHDN Malaysia Official Rates

| Chargeable Income (RM) | Tax Rate |
|------------------------|----------|
| 0 - 5,000 | 0% |
| 5,001 - 20,000 | 1% |
| 20,001 - 35,000 | 3% |
| 35,001 - 50,000 | 6% |
| 50,001 - 70,000 | 11% |
| 70,001 - 100,000 | 19% |
| 100,001 - 250,000 | 25% |
| 250,001 - 400,000 | 26% |
| 400,001 - 600,000 | 28% |
| Above 600,000 | 30% |

### Calculation Method
Progressive tax brackets - each bracket applies only to income within that range.

**Example**: RM25,000 taxable income
- RM0-RM5,000: 0% = RM0
- RM5,001-RM20,000: 1% = RM150
- RM20,001-RM25,000: 3% = RM150
- **Total Tax = RM300**

### Default Reliefs
- Basic Relief: RM9,000
- EPF/Life Insurance: RM7,000 (combined max)
- Medical: RM8,000
- **Total Default Reliefs: RM24,000**

Note: Other reliefs (spouse, children, education) are available but not included in default calculation as they vary by individual circumstances.

## Corporate Tax (SME)

### Tax Brackets
For resident companies with:
- Revenue < RM50 million
- Meeting shareholding requirements

| Taxable Profit (RM) | Tax Rate |
|---------------------|----------|
| 0 - 150,000 | 15% |
| 150,001 - 600,000 | 17% |
| Above 600,000 | 24% |

### Calculation Method
Progressive tax brackets applied to company taxable profit (after deducting salary and employer EPF).

## EPF Contributions

### Employer EPF
- Salary ≤ RM5,000/month: **13%**
- Salary > RM5,000/month: **12%**

### Employee EPF
- **11%** of salary (deducted from take-home)

## Dividend Tax (YA 2025)

Starting YA 2025:
- Dividends ≤ RM100,000: **Tax-free**
- Dividends > RM100,000: **2% tax on excess**

**Example**: RM150,000 dividends
- First RM100,000: Tax-free
- Excess RM50,000: 2% = RM1,000 tax
- **Total Dividend Tax = RM1,000**

## Audit Exemption

Private companies are audit-exempt if **ALL** criteria are met:
- Revenue ≤ RM100,000
- Total assets ≤ RM300,000
- ≤ 5 employees

If any criterion is exceeded, audit is required.

## SOCSO

SOCSO contributions are:
- **Mandatory** for employees earning ≤ RM5,000/month
- **Optional** for employees earning > RM5,000/month

For v1, SOCSO is not included in calculations (marked for v2).

## Key Assumptions

1. **Full Dividend Distribution**: Assumes all post-tax company profit is distributed as dividends
2. **Single-Tier System**: Dividends are from Malaysian resident companies (tax-free up to RM100k, then 2% on excess)
3. **SME Qualification**: Assumes company qualifies for SME tax rates
4. **Reliefs**: Uses default reliefs unless user provides custom values
5. **EPF**: Automatically calculated based on salary
6. **Compliance Costs**: User-provided estimates
7. **Other Income**: Treated as personal income and subject to personal tax

## Limitations

1. Does not account for:
   - SOCSO contributions (v2)
   - Other tax reliefs (spouse, children, education) unless specified
   - Tax planning strategies
   - Loss carry-forwards
   - Capital allowances
   - Other deductions

2. Simplified calculations:
   - EPF relief uses default RM7,000 (not actual EPF contributions)
   - Assumes full dividend distribution
   - Does not verify SME qualification criteria

## Disclaimer

This calculator provides estimates based on standard tax rates and common scenarios. Actual tax liability may vary based on:
- Individual circumstances
- Specific tax reliefs and deductions
- Changes in tax laws
- Interpretation by tax authorities

**Always consult with a qualified tax advisor for your specific situation.**

## Sources

- LHDN Malaysia (Inland Revenue Board of Malaysia)
- Budget 2025 announcements
- Malaysia Companies Act 2016
- EPF Act 1991

