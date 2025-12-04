# Tax Configuration Package

This package contains all tax-related configuration and rules for Malaysia (YA 2024/2025).

## Files

- `personalTaxBrackets.ts` - Personal income tax brackets and calculation
- `corporateTaxBrackets.ts` - SME corporate tax brackets and calculation
- `epfRules.ts` - EPF contribution rates and calculations
- `auditRules.ts` - Audit exemption criteria
- `defaultReliefs.ts` - Default personal tax reliefs
- `dividendTax.ts` - Dividend tax calculation (YA 2025)
- `socsoRules.ts` - SOCSO contribution rules (for v2)

## Tax Year

- **Year of Assessment**: 2024/2025
- **Last Updated**: January 2025

## Usage

```typescript
import {
  calculatePersonalTaxFromBrackets,
  calculateCorporateTaxFromBrackets,
  calculateEmployerEPF,
  calculateEmployeeEPF,
  calculateDividendTax,
  isAuditExempt,
  getDefaultReliefs,
} from '@tax-engine/config';
```

## Updates

When tax rates change:
1. Update the relevant configuration file
2. Update the "Last Updated" date
3. Update ASSUMPTIONS.md
4. Add entry to CHANGELOG.md

