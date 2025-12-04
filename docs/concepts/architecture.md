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

## Project Structure

```
Open-Corporation.com/
├── apps/
│   └── web/                    # The React app (what users see)
│       ├── src/
│       │   ├── components/     # UI components
│       │   ├── pages/          # Page components
│       │   ├── hooks/          # React hooks
│       │   └── lib/            # Utilities
│       └── package.json
│
├── packages/
│   ├── core/                   # Tax calculation engine (pure TypeScript)
│   │   ├── tax/               # Calculation functions
│   │   ├── types.ts           # TypeScript types
│   │   └── validation.ts      # Input validation
│   │
│   └── config/                 # Tax configuration
│       ├── personalTaxBrackets.ts
│       ├── corporateTaxBrackets.ts
│       ├── epfRules.ts
│       └── ...
│
└── package.json                # Root config (Turborepo)
```

## Why We Split It This Way

### `packages/config` - Tax Rules

**What it does:** Contains all tax brackets, rates, and rules.

**Why separate:** Tax rules change. By keeping them separate, we can update rates without touching calculation logic.

**Files:**
- `personalTaxBrackets.ts` - Personal income tax brackets
- `corporateTaxBrackets.ts` - Corporate tax brackets
- `epfRules.ts` - EPF contribution rates
- `auditRules.ts` - Audit exemption criteria
- `dividendTax.ts` - Dividend tax rules
- `defaultReliefs.ts` - Default tax reliefs

**Key principle:** Configuration is separate from logic. Change rates without changing code.

### `packages/core` - Calculation Engine

**What it does:** Pure TypeScript functions that calculate tax. No React, no UI, just math.

**Why separate:** 
- Can be used in other projects (CLI tools, APIs, etc.)
- Easier to test (no React dependencies)
- Clear separation of concerns

**Files:**
- `tax/calculatePersonalTax.ts` - Calculate personal income tax
- `tax/calculateCorporateTax.ts` - Calculate corporate tax
- `tax/calculateSolePropScenario.ts` - Calculate Enterprise scenario
- `tax/calculateSdnBhdScenario.ts` - Calculate Sdn Bhd scenario
- `tax/compareScenarios.ts` - Compare both scenarios
- `types.ts` - TypeScript interfaces
- `validation.ts` - Input validation

**Key principle:** Pure functions. Same input = same output. No side effects.

### `apps/web` - The UI

**What it does:** React app that users interact with.

**Why separate:** UI changes frequently. Business logic (core) changes rarely.

**Structure:**
- `components/` - Reusable UI components
- `pages/` - Page-level components
- `hooks/` - Custom React hooks (like `useTaxCalculation`)
- `lib/` - UI utilities (analytics, error tracking)

**Key principle:** UI is a thin layer over the calculation engine.

## Data Flow

Here's how data flows through the app:

```
User Input (Form)
    ↓
Input Validation (validation.ts)
    ↓
Tax Calculation (core package)
    ├── calculateSolePropScenario()
    └── calculateSdnBhdScenario()
    ↓
Comparison (compareScenarios())
    ↓
Results Display (React components)
```

**Step by step:**

1. **User enters numbers** in the input form
2. **Input validation** checks for errors (negative numbers, etc.)
3. **Tax calculation** runs both scenarios:
   - Enterprise: Personal tax on profit
   - Sdn Bhd: Company tax + Personal tax on salary + Dividends
4. **Comparison** determines which is better
5. **Results** displayed in real-time

**Why real-time?** We use React hooks (`useTaxCalculation`) that recalculate whenever inputs change. No "Calculate" button needed.

## Key Design Decisions

### Decision 1: Client-Side Calculations

**Why:** No backend needed. Everything runs in the browser.

**Pros:**
- Fast (no network calls)
- Private (data never leaves your browser)
- Free to host (static site)
- Works offline (after first load)

**Cons:**
- Can't save calculations server-side
- Can't share links to specific calculations
- Limited by browser performance (but tax calcs are fast)

**Verdict:** For v1, client-side is perfect. We can add backend later if needed.

### Decision 2: Pure TypeScript Core

**Why:** Business logic should be framework-agnostic.

**Pros:**
- Can use in other projects (Node.js, Deno, etc.)
- Easier to test (no React dependencies)
- Clear separation of concerns

**Cons:**
- Can't use React hooks in core (but we don't need to)

**Verdict:** Pure functions are easier to reason about and test.

### Decision 3: Monorepo with Turborepo

**Why:** Multiple packages that need to work together.

**Pros:**
- Shared code between packages
- Single repo to clone
- Efficient builds (caching)
- Easy refactoring across packages

**Cons:**
- More complex setup (but Turborepo handles it)
- Larger repo size

**Verdict:** For this project, monorepo makes sense. We have 3 packages that work together.

### Decision 4: TypeScript Everywhere

**Why:** Type safety catches bugs before runtime.

**Pros:**
- Fewer bugs
- Better IDE support
- Self-documenting code
- Refactoring is safer

**Cons:**
- More verbose (but worth it)
- Learning curve (but TypeScript is common now)

**Verdict:** TypeScript is worth it. The type safety saves time in the long run.

## Where to Find Things

### "I want to change tax rates"

**File:** `packages/config/personalTaxBrackets.ts` or `corporateTaxBrackets.ts`

**What to change:** The bracket arrays. Make sure brackets don't overlap and cover all ranges.

**Test it:** Run `npm run test` to make sure calculations still work.

### "I want to add a new calculation"

**File:** `packages/core/tax/` - Create a new file or add to existing one

**Example:** Want to calculate SOCSO? Create `calculateSOCSO.ts` in `packages/core/tax/`

**Export it:** Add to `packages/core/index.ts` so others can use it

### "I want to change the UI"

**File:** `apps/web/src/components/` or `apps/web/src/pages/`

**Styling:** Uses TailwindCSS. Check `apps/web/tailwind.config.js` for theme settings.

**Components:** Uses shadcn/ui components. Check `apps/web/src/components/ui/` for base components.

### "I want to add a new input field"

**Files:**
1. `apps/web/src/components/InputField.tsx` - The component (probably already exists)
2. `apps/web/src/pages/SinglePageApp.tsx` - Add state and handler
3. `packages/core/types.ts` - Add to `TaxCalculationInputs` interface if needed

### "I want to understand how calculations work"

**Start here:** `packages/core/tax/calculateSolePropScenario.ts` - Simple scenario, easy to understand

**Then read:** `packages/core/tax/calculateSdnBhdScenario.ts` - More complex, but follows same pattern

**Finally:** `packages/core/tax/compareScenarios.ts` - Compares both scenarios

### "I want to debug why calculations are wrong"

**Steps:**
1. Check inputs: Are they what you expect? (add `console.log`)
2. Check tax brackets: Are rates correct? (`packages/config/`)
3. Check calculation logic: Step through the code (`packages/core/tax/`)
4. Check rounding: Are numbers rounded correctly? (`packages/core/utils/rounding.ts`)

**Pro tip:** Write a test case that reproduces the bug, then fix it.

## Technology Stack

### Frontend
- **React 18** - UI library (industry standard)
- **TypeScript** - Type safety (catches bugs early)
- **Vite** - Build tool (fast, simple)
- **TailwindCSS** - Styling (utility-first, fast to write)
- **shadcn/ui** - UI components (accessible, customizable)
- **Framer Motion** - Animations (smooth, performant)
- **Recharts** - Charts (for crossover graph)

### Backend/Logic
- **Pure TypeScript** - No backend needed (client-side calculations)
- **Vitest** - Testing (fast, Vite-native)

### Monorepo
- **Turborepo** - Build system (caching, parallel builds)
- **npm workspaces** - Package management (built into npm)

## Build Process

**Development:**
```bash
npm run dev
```
- Starts Vite dev server
- Watches for changes
- Hot-reloads on save

**Production:**
```bash
npm run build
```
- Compiles TypeScript
- Bundles JavaScript
- Optimizes assets
- Outputs to `apps/web/dist/`

**Testing:**
```bash
npm run test
```
- Runs Vitest tests
- Checks calculation accuracy
- Validates edge cases

## Code Style

**TypeScript:** Strict mode enabled. No `any` types (mostly).

**React:** Functional components, hooks, no class components.

**Styling:** TailwindCSS utility classes. No CSS-in-JS (keeps it simple).

**Naming:**
- Components: PascalCase (`TaxCard.tsx`)
- Functions: camelCase (`calculatePersonalTax`)
- Files: camelCase for utilities, PascalCase for components
- Types: PascalCase (`TaxCalculationInputs`)

**Comments:** Explain **why**, not **what**. Code should be self-documenting.

## Testing Strategy

**Unit tests:** Test calculation functions in isolation
- Location: `packages/core/tax/__tests__/`
- Framework: Vitest
- Focus: Accuracy of calculations

**Component tests:** Test UI components (if we add them)
- Location: `apps/web/src/components/__tests__/`
- Framework: Vitest + React Testing Library
- Focus: Component behavior

**Integration tests:** Test full flows (if we add them)
- Test: User enters inputs → sees correct results
- Focus: End-to-end scenarios

**Current state:** We have unit tests for calculations. Component tests are minimal (but we can add more).

## Future Improvements

**Things we might add:**
- Backend API (to save calculations)
- User accounts (to save multiple scenarios)
- More tax rules (SOCSO, other reliefs)
- Export to Excel/CSV
- Comparison history
- Tax year selector (when rates change)

**Things we probably won't add:**
- Mobile app (web app works on mobile)
- Desktop app (Electron is heavy)
- Multi-language (English is fine for now)

## Contributing

Want to add something? Read [Contributing Guide](../contributing/contributing.md) first.

**Quick checklist:**
1. Understand the architecture (you're reading this, good!)
2. Find where your change fits
3. Make the change
4. Write tests
5. Update documentation
6. Submit PR

---

**Still confused?** Check the [API Reference](../api/core-package.md) for specific function documentation, or read the code (it's well-commented, we promise).

