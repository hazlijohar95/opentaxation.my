# opentaxation.my

<div align="center">

![opentaxation.my](apps/web/public/og-image.png)

**Malaysia's Free Enterprise vs Sdn Bhd Tax Calculator**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8.svg)](https://web.dev/progressive-web-apps/)

[Live Demo](https://opentaxation.my) · [Documentation](docs/) · [Report Bug](https://github.com/your-repo/issues)

</div>

---

Malaysia's most accurate, public-facing "Enterprise vs Sdn Bhd" tax decision engine. Built for SME owners, self-employed individuals, and side-hustlers who want to know: **should I stay as Enterprise or switch to Sdn Bhd?**

> **TL;DR:** Enter your numbers, get instant comparison, see which structure saves you more money. It's that simple.

## What This Is

- ✅ **Tax calculator** - Compares Enterprise vs Sdn Bhd side-by-side
- ✅ **Malaysia-specific** - Uses actual LHDN tax brackets (YA 2024/2025)
- ✅ **Real-time** - Results update as you type (no "Calculate" button needed)
- ✅ **Open source** - Code is public, contributions welcome
- ✅ **Free** - No sign-up required (though we have auth if you want it)

## What This Isn't

- ❌ **Not tax advice** - We're not tax advisors. This is a calculator, not professional advice.
- ❌ **Not a replacement for an accountant** - For complex situations, talk to a professional.
- ❌ **Not perfect** - We try to be accurate, but tax is complicated. Use at your own risk.
- ❌ **Not v2 yet** - SOCSO calculations coming in v2 (we're working on it).

## Quick Start

**Get this running in 5 minutes (or less, if you're lucky):**

```bash
git clone <your-repo-url>
cd Open-Corporation.com
npm install
npm run dev
```

Open `http://localhost:3000` and you're done.

**If something breaks:** Check the [Quick Start Guide](docs/getting-started/quick-start.md) or [Installation Guide](docs/getting-started/installation.md).

## How It Works

1. **Enter your numbers:**
   - Annual business profit
   - Other income (if any)
   - Monthly salary (if Sdn Bhd)
   - Compliance costs
   - Audit criteria (revenue, assets, employees)

2. **Watch the magic:**
   - Enterprise scenario calculated (personal tax on profit)
   - Sdn Bhd scenario calculated (company tax + personal tax + dividends)
   - Comparison shows which is better
   - Crossover chart shows when to switch

3. **Make a decision:**
   - See exact savings
   - Read the recommendation
   - Download PDF for your records

**That's it.** No complicated forms, no jargon, just clear numbers.

## Project Structure

This is a **Turborepo monorepo** (fancy way of saying "multiple packages in one repo"):

```
Open-Corporation.com/
├── apps/
│   └── web/              # The React app (what you see)
├── packages/
│   ├── core/             # Tax calculation engine (pure TypeScript)
│   └── config/           # Tax brackets, rates, rules
└── package.json          # Root config
```

**Why monorepo?** Easier to share code, easier to refactor, easier to maintain. Trust us, it's worth it.

## Tech Stack

**Frontend:**
- React 18 + TypeScript + Vite
- TailwindCSS + shadcn/ui
- Framer Motion (smooth animations)
- Phosphor Duotone icons
- Recharts (for crossover chart)

**Backend:**
- None! Everything runs client-side (your data never leaves your browser)

**Monorepo:**
- Turborepo (fast builds with caching)
- npm workspaces (package management)

**Why these?** They're modern, fast, and work well together. Also, we like them.

## Features

- ✅ **Real-time calculations** - Change any number, see results instantly
- ✅ **Malaysia tax brackets** - Personal tax (YA 2024/2025), SME corporate tax
- ✅ **EPF calculations** - Employer (13%/12%) and employee (11%) contributions
- ✅ **Audit exemption** - Checks if you qualify (revenue ≤ RM100k, assets ≤ RM300k, ≤ 5 employees)
- ✅ **Dividend tax** - YA 2025 surcharge (2% on excess > RM100k)
- ✅ **Custom reliefs** - Add spouse, children, education reliefs
- ✅ **Crossover analysis** - Visual chart showing profit level where both structures are equal
- ✅ **PDF export** - Download your comparison as PDF
- ✅ **Mobile responsive** - Works on phone, tablet, desktop
- ✅ **Accessible** - Keyboard navigation, screen reader friendly
- ✅ **PWA support** - Install as app on iOS/Android, works offline
- ✅ **Zakat integration** - Calculate zakat and see tax benefits (100% rebate for Enterprise, 2.5% deduction for Sdn Bhd)
- ✅ **Tax calendar** - Never miss a deadline with reminders

**Coming in v2:**
- Maybe for group company
- Expand international

## Documentation

**I wrote docs. Lots of them. Read them.**

### Getting Started
- [Quick Start Guide](docs/getting-started/quick-start.md) - Get running in 5 minutes
- [Installation Guide](docs/getting-started/installation.md) - Detailed setup instructions
- [Your First Calculation](docs/getting-started/first-calculation.md) - Walkthrough with examples

### Core Concepts
- [How Tax Calculations Work](docs/concepts/tax-calculations.md) - The honest truth about Malaysian tax
- [Architecture Overview](docs/concepts/architecture.md) - How the code is structured
- [Tax Year & Updates](docs/concepts/tax-year.md) - Current tax year, how to update rates

### API Reference
- [Core Package](docs/api/core-package.md) - Tax calculation functions
- [Config Package](docs/api/config-package.md) - Tax brackets, rates, rules
- [Web Components](docs/api/web-components.md) - React components

### How-To Guides
- [Add a New Tax Rule](docs/how-to/add-tax-rule.md) - Step-by-step guide
- [Customize Tax Reliefs](docs/how-to/customize-reliefs.md) - Understanding reliefs
- [Add a UI Component](docs/how-to/add-ui-component.md) - Component patterns
- [Debug Tax Calculations](docs/how-to/debug-calculations.md) - Finding and fixing bugs

### Contributing
- [Contributing Guide](docs/contributing/contributing.md) - How to contribute
- [Code of Conduct](docs/contributing/code-of-conduct.md) - Be nice, be helpful
- [Development Workflow](docs/contributing/development-workflow.md) - How we work

### Reference
- [Type Definitions](docs/reference/types.md) - All TypeScript interfaces
- [Constants](docs/reference/constants.md) - Magic numbers explained
- [Error Handling](docs/reference/error-handling.md) - How errors are handled

**Can't find something?** Open an issue, we'll help.

## Development

### Prerequisites

- **Node.js** >= 18.0.0 (check with `node --version`)
- **npm** >= 10.0.0 (comes with Node.js)

**Don't have Node.js?** Get it from [nodejs.org](https://nodejs.org/). Pick the LTS version.

### Scripts

**Root level:**
```bash
npm run dev      # Start dev server
npm run build    # Build everything
npm run test     # Run tests
npm run lint     # Lint code
```

**Web app:**
```bash
cd apps/web
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

**Core package:**
```bash
cd packages/core
npm run test     # Run Vitest tests
npm run build    # Compile TypeScript
```

### Testing

**Run tests:**
```bash
npm run test
```

**Tests are in:** `packages/core/tax/__tests/`

**We test:**
- Tax calculations (accuracy is critical)
- Edge cases (zero, negative, very high values)
- Boundary values (exactly at thresholds)

**We don't test (yet):**
- UI components (manual testing for now)
- Integration tests (coming soon)

### Building

**Production build:**
```bash
npm run build
```

**Output:** `apps/web/dist/` (static files, ready to deploy)

**Preview:**
```bash
npm run preview
```

## Contributing

**We love contributions.** Here's how:

1. **Fork the repo** (click "Fork" on GitHub)
2. **Create a branch** (`git checkout -b fix/my-bug-fix`)
3. **Make changes** (code, docs, whatever)
4. **Test** (`npm run test`, `npm run build`)
5. **Submit PR** (we'll review it)

**What we're looking for:**
- Bug fixes (especially calculation bugs)
- Documentation improvements
- New tax rules (when government announces them)
- Performance improvements
- Accessibility improvements

**What we're NOT looking for:**
- Features outside scope
- Breaking changes without discussion
- Code that doesn't follow patterns

**Read the [Contributing Guide](docs/contributing/contributing.md) for details.**

## Accuracy & Disclaimer

**This calculator is accurate as of YA 2024/2025.** 

If LHDN changes tax rates tomorrow, we'll update it (eventually). But tax rates don't change that often, so you're probably fine.

**We're not tax advisors.** This is a calculator, not professional advice. For your actual business decisions, talk to a qualified tax advisor.

**The calculations are based on:**
- Standard tax rates (LHDN Malaysia)
- Common scenarios
- Reasonable assumptions

**Your actual tax might be different** based on:
- Specific deductions you qualify for
- Tax planning strategies
- Changes in tax laws
- How LHDN interprets your situation

**Use at your own risk.** We're not liable if you make bad decisions based on this calculator.

**Sources:**
- LHDN Malaysia (Inland Revenue Board of Malaysia)
- Budget 2025 announcements
- Malaysia Companies Act 2016
- EPF Act 1991

## Troubleshooting

**Port 3000 already in use?**
- Vite will use next available port (check terminal)
- Or change port in `apps/web/vite.config.ts`

**npm install fails?**
- Make sure Node.js >= 18
- Try deleting `node_modules` and `package-lock.json`, then `npm install` again

**Build errors?**
- Run `npm run build` to see TypeScript errors
- Fix errors, then try again

**Still stuck?** Check the [Installation Guide](docs/getting-started/installation.md) or open an issue.

## License

MIT License, use and contribute, do whatever you want.

## Acknowledgments

- **LHDN Malaysia** - For official tax rates and rules
- **Open source community** - For amazing tools and libraries
- **Contributors** - For helping make this better

---

**Made by Chartered Accountants for Malaysian entrepreneurs**

**Questions?** Open an issue or check the [documentation](docs/).

**Found a bug?** Open an issue with steps to reproduce.

**Want to contribute?** Read the [Contributing Guide](docs/contributing/contributing.md).

**Just want to use it?** Go to [the app](http://localhost:3000) (if running locally) or check the live site (if deployed).
