<div align="center">

# opentaxation.my

<img src="apps/web/public/og-image.png" alt="opentaxation.my" width="600" />

### Instantly compare Enterprise vs Sdn Bhd tax. Free. Private. Malaysian.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8.svg)](https://web.dev/progressive-web-apps/)
[![Tax Year](https://img.shields.io/badge/Tax%20Year-YA%202024%2F2025-orange.svg)]()

[**Live Demo**](https://opentaxation.my) &nbsp;&bull;&nbsp; [**Documentation**](docs/) &nbsp;&bull;&nbsp; [**Report Bug**](https://github.com/your-repo/issues)

</div>

---

## How It Works

```
                         YOUR BUSINESS PROFIT
                                 |
                                 v
          +----------------------+----------------------+
          |                                             |
          v                                             v
   +-------------+                              +-------------+
   |  ENTERPRISE |                              |   SDN BHD   |
   |  (Sole Prop)|                              |  (Company)  |
   +------+------+                              +------+------+
          |                                            |
          v                                            v
   +-------------+                    +---------------------------------+
   | Personal    |                    |  Corporate Tax    + Personal    |
   | Tax Only    |                    |  (on profit)        (on salary) |
   | (0-30%)     |                    |  (15-24%)         + Dividend    |
   +------+------+                    |                     (on payout) |
          |                           +-----------------+---------------+
          |                                             |
          +---------------------+-----------------------+
                                |
                                v
                    +------------------------+
                    |   SIDE-BY-SIDE         |
                    |   COMPARISON           |
                    |                        |
                    |   + Tax Savings        |
                    |   + Crossover Point    |
                    |   + Recommendation     |
                    +------------------------+
```

---

## Feature Matrix

| Feature | Status | Description |
|:--------|:------:|:------------|
| Real-time Calculations | :white_check_mark: | Results update as you type |
| Malaysia Tax Brackets | :white_check_mark: | LHDN YA 2024/2025 rates |
| EPF Integration | :white_check_mark: | Employer (13%/12%) + Employee (11%) |
| Zakat Calculator | :white_check_mark: | 100% rebate (Enterprise) / 2.5% deduction (Sdn Bhd) |
| YA 2025 Dividend Surcharge | :white_check_mark: | 2% on dividends > RM100k |
| Tax Calendar | :white_check_mark: | Never miss a deadline |
| PDF Export | :white_check_mark: | Professional reports |
| Save Calculations | :white_check_mark: | Requires account (Supabase) |
| Crossover Chart | :white_check_mark: | Visual profit threshold |
| PWA / Offline | :white_check_mark: | Install on iOS/Android |
| Dark Mode | :white_check_mark: | Easy on the eyes |
| Mobile Responsive | :white_check_mark: | Works everywhere |
| Partner Referrals | :hourglass_flowing_sand: | Coming soon |
| SOCSO Calculations | :hourglass_flowing_sand: | Coming in v2 |

---

## Example Calculation

```
+---------------------------------------------------------------------+
|                   ANNUAL PROFIT: RM 150,000                         |
+---------------------------------------------------------------------+
|                                                                     |
|          ENTERPRISE                      SDN BHD                    |
|         (Sole Prop)                     (Company)                   |
|                                                                     |
+----------------------------------+----------------------------------+
|                                  |                                  |
|  Profit:        RM 150,000       |  Profit:        RM 150,000       |
|  - Reliefs:     -  RM 18,000     |  - Salary:      -  RM 60,000     |
|                 ---------------  |  - EPF (13%):   -   RM 7,800     |
|  Taxable:        RM 132,000      |                 ---------------  |
|                                  |  Corp Profit:    RM 82,200       |
|  Personal Tax:  -  RM 19,800     |                                  |
|                 ---------------  |  Corp Tax (15%): -  RM 12,330    |
|                                  |  Personal Tax:   -  RM  4,400    |
|  NET CASH:       RM 130,200      |  Dividend Tax:   -   RM 1,140    |
|                                  |                 ---------------  |
|  Effective:         13.2%        |  NET CASH:       RM 124,330      |
|                                  |                                  |
|                                  |  Effective:          17.1%       |
+----------------------------------+----------------------------------+
|                                                                     |
|     RECOMMENDATION: Stay as Enterprise (saves RM 5,870/year)        |
|                                                                     |
+---------------------------------------------------------------------+
```

> *Note: This is a simplified example. Actual calculations include EPF limits, audit exemption checks, and more.*

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-repo/opentaxation.my.git

# Navigate to the project
cd opentaxation.my

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start calculating!

---

## Architecture

```
opentaxation.my/
|
+-- apps/
|   +-- web/                    # React Frontend (Vite + TailwindCSS)
|       +-- src/
|           +-- components/     # UI Components (shadcn/ui)
|           +-- pages/          # Route pages
|           +-- hooks/          # Custom React hooks
|           +-- contexts/       # Auth, Theme providers
|           +-- lib/            # Utilities, Supabase client
|
+-- packages/
|   +-- core/                   # Tax Calculation Engine
|   |   +-- tax/
|   |       +-- calculateSoleProp.ts
|   |       +-- calculateSdnBhd.ts
|   |       +-- compareScenarios.ts
|   |       +-- crossover.ts
|   |       +-- zakat.ts
|   |
|   +-- config/                 # Tax Configuration
|       +-- brackets.ts         # YA 2024/2025 rates
|       +-- constants.ts        # EPF, limits, thresholds
|
+-- supabase/                   # Database schema
+-- docs/                       # Documentation
```

---

## Tech Stack

<table>
<tr>
<td align="center" width="120">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React" />
<br><strong>React 18</strong>
</td>
<td align="center" width="120">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript" />
<br><strong>TypeScript</strong>
</td>
<td align="center" width="120">
<img src="https://vitejs.dev/logo.svg" width="48" height="48" alt="Vite" />
<br><strong>Vite</strong>
</td>
<td align="center" width="120">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="48" height="48" alt="Tailwind" />
<br><strong>TailwindCSS</strong>
</td>
<td align="center" width="120">
<img src="https://ui.shadcn.com/apple-touch-icon.png" width="48" height="48" alt="shadcn/ui" />
<br><strong>shadcn/ui</strong>
</td>
</tr>
</table>

**Also using:** Turborepo, Framer Motion, Recharts, Phosphor Icons, Supabase

---

## Trust & Accuracy

```
+------------------------------------------------------------------+
|                                                                  |
|   Built by Malaysian Chartered Accountants                       |
|   who actually understand tax.                                   |
|                                                                  |
|   * Uses official LHDN tax brackets (YA 2024/2025)               |
|   * 100% client-side - your data never leaves your browser       |
|   * Open source - verify the calculations yourself               |
|   * Tested against real tax scenarios                            |
|                                                                  |
+------------------------------------------------------------------+
```

> **Disclaimer:** This is a calculator, not tax advice. For complex situations, consult a qualified tax professional.

---

## Roadmap

```
v1.0 (Current)                   v1.1 (Now)                      v2.0 (Future)
     |                                |                               |
     |                                |                               |
     +-- Core calculator              +-- Zakat integration           +-- SOCSO calculations
     +-- EPF integration              +-- Tax calendar                +-- Group company support
     +-- PDF export                   +-- Mobile redesign             +-- Multi-year planning
     +-- PWA ready                    +-- Partner referrals           +-- International expansion
     +-- Crossover chart              +-- Lead capture
```

---

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm >= 10.0.0

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run tests |
| `npm run lint` | Lint code |
| `npm run preview` | Preview production build |

### Testing

Tests are in `packages/core/tax/__tests__/`

```bash
npm run test
```

We test:
- Tax calculations (accuracy is critical)
- Edge cases (zero, negative, very high values)
- Boundary values (exactly at thresholds)

---

## Contributing

We love contributions! Here's how:

1. **Fork** the repository
2. **Create** a branch (`git checkout -b fix/my-fix`)
3. **Make** your changes
4. **Test** (`npm run test && npm run build`)
5. **Submit** a PR

See the [Contributing Guide](docs/contributing/contributing.md) for details.

---

## Documentation

### Getting Started
- [Quick Start Guide](docs/getting-started/quick-start.md)
- [Installation Guide](docs/getting-started/installation.md)
- [Your First Calculation](docs/getting-started/first-calculation.md)

### Core Concepts
- [How Tax Calculations Work](docs/concepts/tax-calculations.md)
- [Architecture Overview](docs/concepts/architecture.md)
- [Tax Year & Updates](docs/concepts/tax-year.md)

### API Reference
- [Core Package](docs/api/core-package.md)
- [Config Package](docs/api/config-package.md)
- [Web Components](docs/api/web-components.md)

---

## License

MIT License - use freely, contribute back.

---

<div align="center">

**Made with care by Malaysian Chartered Accountants**

[Live Demo](https://opentaxation.my) &nbsp;&bull;&nbsp; [Report Bug](https://github.com/your-repo/issues) &nbsp;&bull;&nbsp; [Documentation](docs/)

</div>
