# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-04

### Added
- **PWA Support**: Install as native app on iOS/Android with offline capability
  - Service worker for caching assets and fonts
  - Web manifest for "Add to Home Screen"
  - Automatic updates when new version is available

- **Zakat Integration**: Calculate Islamic wealth tax and see tax benefits
  - Enterprise: 100% tax rebate (Section 6A(3) ITA 1967)
  - Sdn Bhd: 2.5% tax deduction from aggregate income (Section 44(11A) ITA 1967)
  - Auto-calculate at 2.5% or manual entry
  - Nisab threshold: ~RM29,961 (85g gold)

- **Tax Calendar Dashboard**: Never miss a tax deadline
  - Upcoming deadlines with countdown
  - Personal and corporate tax dates
  - EPF, SOCSO, PCB reminders

### Improved
- **Mobile Responsiveness**: Complete mobile-first redesign
  - NonTaxFactorsCard: Card-based layout on mobile with inline tooltips
  - TaxBracketBreakdown: Stacked layout for better mobile readability
  - UserMenu: Responsive dropdown that doesn't overflow screen
  - CrossoverChart: Adaptive height for different screen sizes

- **Type Safety**: Improved database type validation
  - Added type guards for Supabase data
  - Safer null handling for Supabase client
  - Removed unsafe `as unknown as` type assertions

### Fixed
- Negative salary calculation edge case in Sdn Bhd scenario
- Console warning spam for Supabase configuration

---

## [1.0.0] - 2025-12-01

### Initial Release
- Enterprise vs Sdn Bhd tax comparison calculator
- Real-time calculations with Malaysia YA 2024/2025 tax rates
- EPF and SOCSO contribution calculations
- Dividend tax (YA 2025 surcharge)
- Personal tax reliefs customization
- Crossover analysis chart
- PDF export functionality
- Supabase authentication with Google OAuth
- Dashboard with saved calculations
- Mobile responsive design
- Dark/light theme support
