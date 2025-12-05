# Architecture Overview

How this thing is put together, explained simply (because code should make sense).

## The Big Picture

This is a **monorepo** built with **Turborepo**. That means:
- All code lives in one repository
- Multiple packages that work together
- Build everything efficiently with caching

**Why monorepo?**
- Easier to share code between packages
- Single source of truth
- Easier to refactor across packages
- Better for open source (one repo to clone)

---

## Project Structure

```
opentaxation.my/
├── apps/
│   └── web/                         # React Frontend (Vite + TailwindCSS)
│       ├── src/
│       │   ├── components/
│       │   │   ├── calculator/      # Landing page components
│       │   │   ├── mobile/          # Mobile-specific components
│       │   │   │   ├── MobileTabLayout.tsx
│       │   │   │   ├── MobileHeader.tsx
│       │   │   │   └── MobileBottomTabs.tsx
│       │   │   ├── sections/        # Main app sections
│       │   │   │   ├── InputsSection/
│       │   │   │   │   ├── index.tsx
│       │   │   │   │   ├── ProfitInputSection.tsx
│       │   │   │   │   ├── SdnBhdSettingsSection.tsx
│       │   │   │   │   ├── AuditSection.tsx
│       │   │   │   │   ├── ZakatSection.tsx
│       │   │   │   │   ├── EducationalNotes.tsx
│       │   │   │   │   ├── shared.tsx
│       │   │   │   │   └── types.ts
│       │   │   │   ├── ResultsSection.tsx
│       │   │   │   └── LandingSection.tsx
│       │   │   ├── ui/              # shadcn/ui primitives
│       │   │   ├── InputField.tsx
│       │   │   ├── Slider.tsx
│       │   │   ├── TaxCard.tsx
│       │   │   ├── RecommendationCard.tsx
│       │   │   ├── CrossoverChart.tsx
│       │   │   ├── WaterfallBreakdown.tsx
│       │   │   ├── TaxBracketBreakdown.tsx
│       │   │   ├── ReliefsSection.tsx
│       │   │   ├── ShareModal.tsx
│       │   │   └── Logo.tsx
│       │   ├── contexts/            # React Context providers
│       │   │   ├── AuthContext.tsx  # Supabase auth
│       │   │   └── ThemeContext.tsx # Dark/light mode
│       │   ├── hooks/               # Custom React hooks
│       │   │   ├── useTaxCalculation.ts
│       │   │   ├── useLocalStorage.ts
│       │   │   ├── useShareableLink.ts
│       │   │   ├── usePWAInstall.ts
│       │   │   ├── useMediaQuery.ts
│       │   │   └── useSavedCalculations.ts
│       │   ├── lib/                 # Utilities
│       │   │   ├── supabase.ts      # Supabase client
│       │   │   ├── analytics.ts     # Analytics tracking
│       │   │   └── utils.ts         # Helper functions
│       │   ├── pages/               # Route pages
│       │   │   ├── SinglePageApp.tsx
│       │   │   ├── dashboard/       # Dashboard pages
│       │   │   └── blog/            # Blog pages
│       │   └── i18n/                # Internationalization
│       │       └── locales/
│       │           ├── en.ts        # English
│       │           └── ms.ts        # Malay
│       └── package.json
│
├── packages/
│   ├── core/                        # Tax Calculation Engine
│   │   ├── tax/
│   │   │   ├── calculatePersonalTax.ts
│   │   │   ├── calculateCorporateTax.ts
│   │   │   ├── calculateSolePropScenario.ts
│   │   │   ├── calculateSdnBhdScenario.ts
│   │   │   ├── compareScenarios.ts
│   │   │   ├── crossover.ts
│   │   │   └── zakat.ts
│   │   ├── utils/
│   │   │   └── rounding.ts
│   │   ├── types.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   │
│   └── config/                      # Tax Configuration
│       ├── personalTaxBrackets.ts
│       ├── corporateTaxBrackets.ts
│       ├── epfRules.ts
│       ├── socsoRules.ts
│       ├── auditRules.ts
│       ├── dividendTax.ts
│       ├── zakatRules.ts
│       ├── defaultReliefs.ts
│       └── taxYears.ts
│
├── supabase/                        # Database schema
│   └── migrations/
│
├── docs/                            # Documentation
│   ├── api/
│   ├── concepts/
│   ├── getting-started/
│   ├── how-to/
│   └── design-system.md
│
└── package.json                     # Root config (Turborepo)
```

---

## Package Responsibilities

### `packages/config` - Tax Rules

**What it does:** Contains all tax brackets, rates, and rules.

**Why separate:** Tax rules change yearly. By keeping them separate, we can update rates without touching calculation logic.

**Key files:**
- `personalTaxBrackets.ts` - YA 2024/2025 personal income tax brackets
- `corporateTaxBrackets.ts` - Corporate tax rates (SME vs non-SME)
- `epfRules.ts` - EPF contribution rates (employer 13%/12%, employee 11%)
- `socsoRules.ts` - SOCSO contribution limits
- `auditRules.ts` - Audit exemption criteria
- `dividendTax.ts` - YA 2025 dividend surcharge rules
- `zakatRules.ts` - Zakat calculation and nisab thresholds
- `defaultReliefs.ts` - Standard tax reliefs

**Key principle:** Configuration is separate from logic. Change rates without changing code.

### `packages/core` - Calculation Engine

**What it does:** Pure TypeScript functions that calculate tax. No React, no UI, just math.

**Why separate:**
- Can be used in other projects (CLI tools, APIs, etc.)
- Easier to test (no React dependencies)
- Clear separation of concerns

**Key files:**
- `tax/calculateSolePropScenario.ts` - Calculate Enterprise scenario
- `tax/calculateSdnBhdScenario.ts` - Calculate Sdn Bhd scenario
- `tax/compareScenarios.ts` - Compare both and generate recommendation
- `tax/crossover.ts` - Find crossover point
- `tax/zakat.ts` - Zakat calculations
- `validation.ts` - Input validation with error messages
- `types.ts` - TypeScript interfaces

**Key principle:** Pure functions. Same input = same output. No side effects.

### `apps/web` - The UI

**What it does:** React app that users interact with.

**Why separate:** UI changes frequently. Business logic (core) changes rarely.

**Structure:**
- `components/` - Reusable UI components (modular architecture)
- `contexts/` - Auth and Theme providers
- `hooks/` - Custom hooks for state and calculations
- `pages/` - Page-level components
- `lib/` - Utilities and Supabase client
- `i18n/` - Multi-language support (English, Malay)

**Key principle:** UI is a thin layer over the calculation engine.

---

## Data Flow

```
User Input (Form)
    ↓
Input Validation (validation.ts)
    ↓
LocalStorage Persistence (useLocalStorage hook)
    ↓
Tax Calculation (core package)
    ├── calculateSolePropScenario()
    └── calculateSdnBhdScenario()
    ↓
Comparison (compareScenarios())
    ↓
Results Display (React components)
    ↓
Optional: Save to Supabase (useSavedCalculations hook)
```

**Step by step:**

1. **User enters numbers** in the input form
2. **Inputs persist** to localStorage automatically
3. **Input validation** checks for errors (negative numbers, etc.)
4. **Tax calculation** runs both scenarios in real-time
5. **Comparison** determines which is better
6. **Results** displayed instantly (no "Calculate" button)
7. **Optionally** save to cloud if signed in

---

## Key Design Patterns

### 1. Callback Object Pattern

Instead of passing 20+ individual callbacks, we group them:

```typescript
// Before (prop drilling nightmare)
<InputsSection
  onBusinessProfitChange={...}
  onOtherIncomeChange={...}
  onMonthlySalaryChange={...}
  // ... 15 more props
/>

// After (clean Callback Object Pattern)
const callbacks: InputCallbacks = {
  onBusinessProfitChange: setBusinessProfit,
  onOtherIncomeChange: setOtherIncome,
  // ... all handlers in one object
};

<InputsSection callbacks={callbacks} />
```

### 2. Modular Section Components

Large components are split into focused sub-components:

```
InputsSection/
├── index.tsx              # Orchestrator
├── ProfitInputSection.tsx # Just profit inputs
├── SdnBhdSettingsSection.tsx
├── AuditSection.tsx
├── ZakatSection.tsx
├── EducationalNotes.tsx
├── shared.tsx             # Reusable pieces
└── types.ts               # Interfaces
```

### 3. Mobile-First Responsive

- Desktop: Side-by-side layout (inputs left, results right)
- Mobile: Tab-based layout with bottom navigation
- Uses `useIsMobile()` hook for conditional rendering

### 4. Real-Time Calculations

No "Submit" button. Everything recalculates on input change:

```typescript
const comparison = useTaxCalculation(inputs);
// Automatically recalculates when inputs change
```

---

## Key Technologies

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 | UI library |
| TypeScript | Type safety |
| Vite | Build tool |
| TailwindCSS | Styling |
| shadcn/ui | UI components |
| Framer Motion | Animations |
| Recharts | Charts |
| i18next | Internationalization |

### Backend / Data
| Tech | Purpose |
|------|---------|
| Supabase | Auth + Database |
| localStorage | Offline persistence |
| PWA | Offline support |

### Monorepo
| Tech | Purpose |
|------|---------|
| Turborepo | Build system |
| npm workspaces | Package management |

---

## Authentication Flow

```
App Load
    ↓
Check Supabase Session
    ├── Has session → Load user, enable cloud features
    └── No session → Guest mode (localStorage only)
    ↓
User can:
    ├── Use calculator (no auth required)
    ├── Download PDF (no auth required)
    ├── Share via URL (no auth required)
    └── Save calculations (auth required)
```

**Guest users get:**
- Full calculator functionality
- PDF export
- URL sharing
- localStorage persistence

**Signed-in users get:**
- Everything above, plus:
- Cloud-saved calculations
- Cross-device sync
- Tax calendar

---

## Where to Find Things

### "I want to change tax rates"
**File:** `packages/config/personalTaxBrackets.ts` or `corporateTaxBrackets.ts`

### "I want to add a new calculation"
**File:** `packages/core/tax/` - Create a new file

### "I want to change the UI"
**File:** `apps/web/src/components/`

### "I want to add a new input field"
**Files:**
1. `apps/web/src/components/sections/InputsSection/` - Add to appropriate section
2. `apps/web/src/hooks/useLocalStorage.ts` - Add to StoredInputs type
3. `packages/core/types.ts` - Add to TaxCalculationInputs

### "I want to understand how calculations work"
**Start here:** `packages/core/tax/calculateSolePropScenario.ts`

### "I want to debug calculations"
**Steps:**
1. Check inputs in React DevTools
2. Check tax brackets in `packages/config/`
3. Step through calculation logic in `packages/core/tax/`
4. Check rounding in `packages/core/utils/rounding.ts`

---

## Testing Strategy

| Test Type | Location | Framework |
|-----------|----------|-----------|
| Unit (calculations) | `packages/core/**/__tests__/` | Vitest |
| Unit (config) | `packages/config/__tests__/` | Vitest |
| Component | `apps/web/src/**/__tests__/` | Vitest + RTL |
| Integration | Golden scenarios in core | Vitest |

**Run all tests:**
```bash
npm run test
```

---

## Build Process

**Development:**
```bash
npm run dev
# Starts Vite at http://localhost:5173
```

**Production:**
```bash
npm run build
# Outputs to apps/web/dist/
# Includes PWA service worker
```

**Testing:**
```bash
npm run test
```

---

## Future Improvements

**Things we might add:**
- Tax news & updates
- What-if scenarios
- Multi-year planning
- Partner referrals
- Accountant directory

**Things we probably won't add:**
- Native mobile app (PWA works great)
- Desktop app (Electron is heavy)
- Complex tax scenarios (keep it simple)

---

## Contributing

Want to add something? Read [Contributing Guide](../contributing/contributing.md).

**Quick checklist:**
1. Understand the architecture (you're reading this, good!)
2. Find where your change fits
3. Make the change
4. Write tests
5. Update documentation
6. Submit PR
