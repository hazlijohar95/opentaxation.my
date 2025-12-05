# Web Components API Reference

The React components used in the web app. Built with shadcn/ui, TailwindCSS, and Framer Motion.

---

## Component Architecture

```
apps/web/src/components/
├── calculator/
│   └── CalculatorContent.tsx      # Landing page content
├── mobile/
│   ├── MobileTabLayout.tsx        # Mobile tab-based layout
│   ├── MobileHeader.tsx           # Mobile header with actions
│   └── MobileBottomTabs.tsx       # Bottom navigation tabs
├── sections/
│   ├── LandingSection.tsx         # Landing page wrapper
│   ├── InputsSection/             # Modular input sections
│   │   ├── index.tsx              # Main InputsSection
│   │   ├── ProfitInputSection.tsx # Profit/target mode inputs
│   │   ├── SdnBhdSettingsSection.tsx
│   │   ├── AuditSection.tsx
│   │   ├── ZakatSection.tsx
│   │   ├── EducationalNotes.tsx
│   │   ├── shared.tsx             # Shared components
│   │   └── types.ts               # TypeScript interfaces
│   └── ResultsSection.tsx         # Results display
├── ui/                            # shadcn/ui primitives
├── InputField.tsx
├── Slider.tsx
├── TaxCard.tsx
├── RecommendationCard.tsx
├── CrossoverChart.tsx
├── WaterfallBreakdown.tsx
├── TaxBracketBreakdown.tsx
├── ReliefsSection.tsx
├── ShareModal.tsx
├── UserMenu.tsx
├── ThemeToggle.tsx
└── Logo.tsx
```

---

## Core Components

### `InputField`

Number input field with RM prefix, formatting, and validation.

```typescript
import InputField from '@/components/InputField';

<InputField
  label="Annual business profit"
  value={businessProfit}
  onChange={setBusinessProfit}
  placeholder="150,000"
  tooltip="Your annual business profit before paying yourself a salary"
  helperText="Enter your estimated annual profit"
  min={0}
  max={100_000_000}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | required | Field label |
| `value` | number | required | Current value |
| `onChange` | (value: number) => void | required | Change handler |
| `placeholder` | string | - | Placeholder text |
| `tooltip` | string | - | Help text (shows ? icon) |
| `prefix` | string | "RM" | Input prefix |
| `min` | number | 0 | Minimum value |
| `max` | number | 10B | Maximum value |
| `helperText` | string | - | Text below input |
| `className` | string | - | Additional classes |

**Styling:**
- Height: `h-12 sm:h-11` (48px mobile, 44px desktop)
- Touch target: 48px minimum
- Font: `font-numbers tabular-nums`

---

### `Slider`

Range slider for selecting values with visual feedback.

```typescript
import Slider from '@/components/Slider';

<Slider
  label="Monthly salary"
  value={monthlySalary}
  onChange={setMonthlySalary}
  min={0}
  max={20000}
  step={500}
  formatValue={(val) => `RM${val.toLocaleString()}/mo`}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | required | Slider label |
| `value` | number | required | Current value |
| `onChange` | (value: number) => void | required | Change handler |
| `min` | number | required | Minimum value |
| `max` | number | required | Maximum value |
| `step` | number | 100 | Step increment |
| `prefix` | string | "RM" | Value prefix |
| `formatValue` | (value: number) => string | - | Custom formatter |

---

### `TaxCard`

Display tax breakdown with expandable waterfall visualization.

```typescript
import TaxCard from '@/components/TaxCard';

<TaxCard
  title="Enterprise"
  tax={result.personalTax}
  netCash={result.netCash}
  effectiveTaxRate={result.effectiveTaxRate}
  waterfall={result.waterfall}
  taxBracketBreakdown={result.taxBracketBreakdown}
  taxableIncome={result.taxableIncome}
  zakat={result.zakat}
  hasWarning={result.hasWarning}
  warningText={result.warningMessage}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | Card title |
| `tax` | number | Total tax paid |
| `netCash` | number | Net cash after tax |
| `effectiveTaxRate` | number | Effective rate (0-1) |
| `waterfall` | WaterfallStep[] | Single waterfall (Enterprise) |
| `companyWaterfall` | WaterfallStep[] | Company level (Sdn Bhd) |
| `personalWaterfall` | WaterfallStep[] | Personal level (Sdn Bhd) |
| `taxBracketBreakdown` | TaxBracketBreakdown[] | Tax bracket details |
| `taxableIncome` | number | Taxable income amount |
| `zakat` | ZakatResult | Zakat calculation result |
| `hasWarning` | boolean | Show warning banner |
| `warningText` | string | Warning message |

**Features:**
- Expandable waterfall breakdown
- Tax bracket visualization
- Zakat savings indicator
- Hover lift effect: `hover:shadow-lg hover:-translate-y-0.5`

---

### `RecommendationCard`

Display comparison result with color-coded recommendation.

```typescript
import RecommendationCard from '@/components/RecommendationCard';

<RecommendationCard comparison={comparison} />
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `comparison` | ComparisonResult | Result from `compareScenarios()` |

**Visual States:**

| State | Border | Background |
|-------|--------|------------|
| Sdn Bhd Better | `emerald-500/40` | emerald gradient |
| Enterprise Better | `blue-500/40` | blue gradient |
| Similar | `border/50` | card background |
| Warning | `destructive/30` | destructive gradient |

---

### `CrossoverChart`

Visual chart showing Enterprise vs Sdn Bhd crossover point.

```typescript
import CrossoverChart from '@/components/CrossoverChart';

<CrossoverChart inputs={inputs} />
```

**Features:**
- X-axis: Business profit (RM0 to RM500k+)
- Y-axis: Net cash after tax
- Two lines: Enterprise vs Sdn Bhd
- Crossover point highlighted
- Built with Recharts

---

## Section Components

### `InputsSection`

Main input form using the **Callback Object Pattern** for cleaner prop drilling.

```typescript
import InputsSection, { type InputCallbacks } from '@/components/sections/InputsSection';

// Define callbacks object
const inputCallbacks: InputCallbacks = {
  onBusinessProfitChange: setBusinessProfit,
  onOtherIncomeChange: setOtherIncome,
  onMonthlySalaryChange: setMonthlySalary,
  onComplianceCostsChange: setComplianceCosts,
  onAuditRevenueChange: setAuditRevenue,
  onAuditAssetsChange: setAuditAssets,
  onAuditEmployeesChange: setAuditEmployees,
  onAuditCostChange: setAuditCost,
  onReliefsChange: setReliefs,
  onApplyYa2025DividendSurchargeChange: setApplyDividendSurcharge,
  onDividendDistributionPercentChange: setDividendPercent,
  onForeignOwnershipChange: setHasForeignOwnership,
  onInputModeChange: setInputMode,
  onTargetNetIncomeChange: setTargetNetIncome,
  onZakatChange: setZakat,
  onClearInputs: handleClearInputs,
};

<InputsSection
  inputs={inputs}
  auditRequired={auditRequired}
  callbacks={inputCallbacks}
  calculatedProfit={effectiveBusinessProfit}
  hideHeader={isMobile}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `inputs` | TaxCalculationInputs | Current input values |
| `auditRequired` | boolean | Whether audit is required |
| `callbacks` | InputCallbacks | Object containing all change handlers |
| `calculatedProfit` | number | Calculated profit (for target mode) |
| `hideHeader` | boolean | Hide header (for mobile layout) |

**Sub-components:**
- `ProfitInputSection` - Profit/target mode toggle + inputs
- `SdnBhdSettingsSection` - Salary, compliance, dividend settings
- `AuditSection` - Audit exemption criteria
- `ZakatSection` - Zakat calculation toggle
- `EducationalNotes` - Expandable educational content

---

### `ResultsSection`

Results display with tax cards and charts.

```typescript
import ResultsSection from '@/components/sections/ResultsSection';

<ResultsSection
  comparison={comparison}
  inputs={inputs}
  onShareClick={() => setIsShareModalOpen(true)}
  hideHeader={isMobile}
  isSignedIn={isSignedIn}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `comparison` | ComparisonResult | null | Comparison result |
| `inputs` | TaxCalculationInputs | Current inputs |
| `onShareClick` | () => void | Share button handler |
| `hideHeader` | boolean | Hide header (mobile) |
| `isSignedIn` | boolean | User auth status |

---

## Mobile Components

### `MobileTabLayout`

Tab-based layout for mobile devices.

```typescript
import { MobileTabLayout, type TabType } from '@/components/mobile';

<MobileTabLayout
  activeTab={activeTab}
  onTabChange={setActiveTab}
  hasResults={!!comparison}
  onClearInputs={handleClearInputs}
  inputsContent={<InputsSection ... />}
  resultsContent={<ResultsSection ... />}
/>
```

**Features:**
- Full-height layout with `h-screen min-h-[100dvh]`
- Safe area handling for iOS
- Animated tab transitions
- Bottom navigation with badge indicator

### `MobileBottomTabs`

Bottom navigation tabs.

```typescript
import MobileBottomTabs from '@/components/mobile/MobileBottomTabs';

<MobileBottomTabs
  activeTab={activeTab}
  onTabChange={onTabChange}
  hasResults={hasResults}
/>
```

**Styling:**
- Height: 49px
- Tab label: `text-[11px]`
- Active indicator line
- Results badge when new results available

---

## Shared Components

### `SectionHeader`

Reusable section header with optional tip.

```typescript
import { SectionHeader } from '@/components/sections/InputsSection/shared';

<SectionHeader
  title="Business Profit"
  subtitle="Enter your annual profit"
  tip="This is your gross profit before expenses"
/>
```

### `CollapsibleSection`

Animated collapsible container.

```typescript
import { CollapsibleSection } from '@/components/sections/InputsSection/shared';

<CollapsibleSection title="Advanced Options" defaultOpen={false}>
  {/* Content */}
</CollapsibleSection>
```

**Styling:**
- Header: `min-h-[48px]`
- Animated with Framer Motion

---

## Animation Guidelines

### Entry Animations

```typescript
<motion.div
  initial={{ y: 10, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.02, duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

### Stagger Sequence

| Component | Delay |
|-----------|-------|
| ProfitInputSection | 0.02s |
| SdnBhdSettingsSection | 0.04s |
| AuditSection | 0.06s |
| ZakatSection | 0.08s |
| ReliefsSection | 0.10s |
| EducationalNotes | 0.12s |

### Hover Effects

```css
/* Cards */
hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300

/* CTA Buttons */
hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]

/* Feature Icons */
group-hover:shadow-md group-hover:scale-105
```

---

## Styling Patterns

### Touch Targets

All interactive elements have 48px minimum touch target:

```css
/* Input fields */
h-12 sm:h-11

/* Buttons */
min-h-[48px]

/* Toggle buttons */
min-h-[48px]

/* Collapsible headers */
min-h-[48px]
```

### Theme Colors

```typescript
// Core
foreground      // Text color
background      // Background color
muted           // Muted text/background
border          // Border color
primary         // Primary accent

// Semantic
emerald-500     // Success/Sdn Bhd better
blue-500        // Info/Enterprise better
destructive     // Warning/errors
```

### Custom Utilities

```css
font-display    /* Instrument Serif (headings) */
font-numbers    /* Tabular numbers */
touch-target    /* 48px minimum touch area */
pb-safe         /* Safe area padding */
```

---

## Accessibility

### Keyboard Navigation

- All interactive elements focusable
- Focus visible: `focus:ring-2 focus:ring-ring focus:ring-offset-2`
- Skip links for main content areas
- Tab order follows visual layout

### Screen Readers

- `aria-label` on icon buttons
- `aria-describedby` on form fields
- `role="tablist"` on tab navigation
- Proper heading hierarchy

### ARIA Patterns

```typescript
// Tab navigation
<nav role="tablist" aria-label="Main navigation">
  <button
    role="tab"
    aria-selected={isActive}
    aria-controls={`${tab.id}-panel`}
  >
    {tab.label}
  </button>
</nav>

// Form fields
<Input
  id={fieldId}
  aria-describedby={helperId}
  aria-label={`${label} in ${prefix}`}
/>
```

---

## Icons

Uses Phosphor Duotone icons throughout.

```typescript
import { Question, ArrowRight, Download, Heart } from 'phosphor-react';

<Question weight="duotone" className="h-4 w-4" />
<ArrowRight weight="bold" className="h-5 w-5" />
```

**Icon Weights:**
- `duotone` - Default for most icons
- `bold` - Chevrons, arrows
- `fill` - Active states

---

## Usage Examples

### Example 1: Custom Section with Callback Pattern

```typescript
interface MyCallbacks {
  onValueChange: (value: number) => void;
  onToggle: (enabled: boolean) => void;
}

function MySection({ callbacks }: { callbacks: MyCallbacks }) {
  return (
    <Card>
      <InputField
        label="Value"
        value={0}
        onChange={callbacks.onValueChange}
      />
      <Switch
        checked={false}
        onCheckedChange={callbacks.onToggle}
      />
    </Card>
  );
}
```

### Example 2: Mobile-Responsive Component

```typescript
function ResponsiveCard() {
  const isMobile = useIsMobile();

  return (
    <Card className={cn(
      "p-5 sm:p-6",
      isMobile && "rounded-none border-x-0"
    )}>
      {/* Content */}
    </Card>
  );
}
```

---

## Contributing

See [How to Add a UI Component](../how-to/add-ui-component.md).

**Guidelines:**
- Use TypeScript with strict types
- Follow the Callback Object Pattern for forms
- Add accessibility attributes
- Use design system tokens
- Test on mobile devices
