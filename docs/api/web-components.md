# Web Components API Reference

The React components used in the web app. Built with shadcn/ui, TailwindCSS, and Framer Motion.

## Component Structure

All components are in `apps/web/src/components/`.

**Core components:**
- `InputField.tsx` - Number input with prefix
- `Slider.tsx` - Range slider for values
- `TaxCard.tsx` - Display tax breakdown
- `RecommendationCard.tsx` - Show recommendation
- `CrossoverChart.tsx` - Visual comparison chart
- `Logo.tsx` - App logo

**Section components:**
- `LandingSection.tsx` - Landing page
- `InputsSection.tsx` - Input form
- `ResultsSection.tsx` - Results display

**UI components (shadcn/ui):**
- `Button.tsx` - Button variants
- `Card.tsx` - Card container
- `Badge.tsx` - Badge component
- `Input.tsx` - Text input
- `Slider.tsx` - Slider primitive
- `Tooltip.tsx` - Tooltip component

## Core Components

### `InputField`

Number input field with RM prefix and validation.

```typescript
import InputField from '@/components/InputField';

<InputField
  label="Annual business profit"
  value={businessProfit}
  onChange={setBusinessProfit}
  placeholder="150,000"
  tooltip="Your annual business profit before paying yourself a salary"
  min={0}
  max={10000000}
  step={1000}
/>
```

**Props:**
- `label` (string): Field label
- `value` (number): Current value
- `onChange` (function): Callback when value changes
- `placeholder?` (string): Placeholder text
- `tooltip?` (string): Help text (shows question icon)
- `prefix?` (string): Prefix (default: "RM")
- `min?` (number): Minimum value (default: 0)
- `max?` (number): Maximum value
- `step?` (number): Step increment (default: 1000)
- `className?` (string): Additional CSS classes
- `helperText?` (string): Helper text below input

**Styling:** Uses shadcn/ui `Input` component with TailwindCSS.

### `Slider`

Range slider for selecting values.

```typescript
import Slider from '@/components/Slider';

<Slider
  label="Monthly salary"
  value={monthlySalary}
  onChange={setMonthlySalary}
  min={3000}
  max={20000}
  step={500}
  tooltip="Monthly salary you'd pay yourself"
  formatValue={(val) => `RM${val.toLocaleString('en-MY')}/mo`}
/>
```

**Props:**
- `label` (string): Slider label
- `value` (number): Current value
- `onChange` (function): Callback when value changes
- `min` (number): Minimum value
- `max` (number): Maximum value
- `step?` (number): Step increment (default: 100)
- `tooltip?` (string): Help text
- `prefix?` (string): Prefix for display (default: "RM")
- `formatValue?` (function): Custom formatter
- `className?` (string): Additional CSS classes
- `subtitle?` (string): Subtitle below label

**Styling:** Uses shadcn/ui `Slider` component with custom styling.

### `TaxCard`

Display tax breakdown for a scenario.

```typescript
import TaxCard from '@/components/TaxCard';

<TaxCard
  title="Enterprise"
  tax={solePropResult.personalTax}
  netCash={solePropResult.netCash}
  effectiveTaxRate={solePropResult.effectiveTaxRate}
  breakdown={{
    'Total Income': solePropResult.breakdown.totalIncome,
    'Total Reliefs': solePropResult.breakdown.totalReliefs,
    'Taxable Income': solePropResult.breakdown.taxableIncome,
  }}
/>
```

**Props:**
- `title` (string): Card title ("Enterprise" or "Sdn Bhd")
- `tax` (number): Total tax paid
- `netCash` (number): Net cash after tax
- `effectiveTaxRate` (number): Effective tax rate (0-1)
- `breakdown?` (object): Additional breakdown items
- `className?` (string): Additional CSS classes

**Styling:** Uses shadcn/ui `Card` component with custom layout.

### `RecommendationCard`

Display final recommendation.

```typescript
import RecommendationCard from '@/components/RecommendationCard';

<RecommendationCard comparison={comparison} />
```

**Props:**
- `comparison` (ComparisonResult): Comparison result from `compareScenarios()`

**Displays:**
- Which structure is better
- Savings amount
- Recommendation text
- Icon (arrow left/right/minus)

**Styling:** Uses shadcn/ui `Card` and `Badge` components.

### `CrossoverChart`

Visual chart showing Enterprise vs Sdn Bhd at different profit levels.

```typescript
import CrossoverChart from '@/components/CrossoverChart';

<CrossoverChart inputs={inputs} />
```

**Props:**
- `inputs` (TaxCalculationInputs): Current input values

**Displays:**
- X-axis: Business profit (RM0 to RM200k+)
- Y-axis: Net cash after tax
- Two lines: Enterprise (black) vs Sdn Bhd (gray)
- Crossover point highlighted

**Library:** Uses Recharts for rendering.

**Styling:** Responsive, adapts to container size.

### `Logo`

App logo component.

```typescript
import Logo from '@/components/Logo';

<Logo size="lg" showIcon={true} />
```

**Props:**
- `size?` ('sm' | 'md' | 'lg'): Logo size
- `showIcon?` (boolean): Show icon next to text
- `variant?` ('default' | 'minimal'): Style variant
- `className?` (string): Additional CSS classes

**Font:** Uses Instrument Serif for text.

## Section Components

### `LandingSection`

Landing page section.

```typescript
import LandingSection from '@/components/sections/LandingSection';

<LandingSection onStart={() => setShowApp(true)} />
```

**Props:**
- `onStart` (function): Callback when user clicks "Get Started"

**Features:**
- Hero text
- CTA button
- Stats display
- GitHub link
- Illustration (right side)

### `InputsSection`

Input form section.

```typescript
import InputsSection from '@/components/sections/InputsSection';

<InputsSection
  inputs={inputs}
  auditRequired={auditRequired}
  onBusinessProfitChange={setBusinessProfit}
  onOtherIncomeChange={setOtherIncome}
  // ... other handlers
/>
```

**Props:**
- `inputs` (TaxCalculationInputs): Current input values
- `auditRequired` (boolean): Whether audit is required
- `onBusinessProfitChange` (function): Handler for business profit
- `onOtherIncomeChange` (function): Handler for other income
- `onMonthlySalaryChange` (function): Handler for monthly salary
- `onComplianceCostsChange` (function): Handler for compliance costs
- `onAuditRevenueChange` (function): Handler for audit revenue
- `onAuditAssetsChange` (function): Handler for audit assets
- `onAuditEmployeesChange` (function): Handler for audit employees
- `onAuditCostChange` (function): Handler for audit cost
- `onReliefsChange` (function): Handler for reliefs
- `onApplyYa2025DividendSurchargeChange` (function): Handler for dividend surcharge

**Layout:** Left side of split-screen layout.

### `ResultsSection`

Results display section.

```typescript
import ResultsSection from '@/components/sections/ResultsSection';

<ResultsSection comparison={comparison} inputs={inputs} />
```

**Props:**
- `comparison` (ComparisonResult | null): Comparison result
- `inputs` (TaxCalculationInputs): Current input values

**Displays:**
- Two tax cards (Enterprise vs Sdn Bhd)
- Recommendation card
- Crossover chart
- PDF download button

**Layout:** Right side of split-screen layout.

## Styling Guidelines

### TailwindCSS

All components use TailwindCSS utility classes.

**Theme colors:**
- `foreground` - Text color
- `background` - Background color
- `muted` - Muted text/background
- `border` - Border color
- `--blue` - Primary blue (sparingly used)

**Custom utilities:**
- `font-display` - Instrument Serif (headings)
- `font-numbers` - Inter with tabular numbers
- `touch-target` - Minimum 44px touch target

### Responsive Design

**Breakpoints:**
- Mobile: Default (< 640px)
- Tablet: `sm:` (≥ 640px)
- Desktop: `lg:` (≥ 1024px)

**Layout:**
- Mobile: Stacked (inputs above results)
- Desktop: Side-by-side (inputs left, results right)

### Animations

Uses Framer Motion for animations.

**Common patterns:**
```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

## Accessibility

**Requirements:**
- All interactive elements have `aria-label`
- Keyboard navigation supported
- Focus states visible
- Screen reader friendly
- Minimum touch target: 44px

**Skip links:**
- "Skip to inputs" link
- "Skip to results" link

**Tooltips:**
- Question icons have `aria-label="Help"`
- Tooltip content is accessible

## Icons

Uses Phosphor Duotone icons.

```typescript
import { Question, ArrowRight, Download } from 'phosphor-react';

<Question weight="duotone" className="h-4 w-4" />
```

**Weight:** Always use `weight="duotone"` for consistency.

## Usage Examples

### Example 1: Create Custom Input Field

```typescript
import InputField from '@/components/InputField';

function MyComponent() {
  const [value, setValue] = useState(0);
  
  return (
    <InputField
      label="Custom Field"
      value={value}
      onChange={setValue}
      tooltip="This is a custom field"
      min={0}
      max={1000000}
    />
  );
}
```

### Example 2: Create Custom Tax Card

```typescript
import TaxCard from '@/components/TaxCard';

function MyTaxCard({ result }) {
  return (
    <TaxCard
      title="My Scenario"
      tax={result.tax}
      netCash={result.netCash}
      effectiveTaxRate={result.effectiveRate}
      breakdown={{
        'Item 1': result.item1,
        'Item 2': result.item2,
      }}
    />
  );
}
```

### Example 3: Custom Styling

```typescript
import { Card } from '@/components/ui/card';

<Card className="border-2 border-blue-500 shadow-lg">
  {/* Custom card */}
</Card>
```

## Component Patterns

### Controlled Components

All form components are controlled (value + onChange).

```typescript
const [value, setValue] = useState(0);

<InputField
  value={value}
  onChange={setValue}
/>
```

### Composition

Components are composable. Use shadcn/ui primitives for custom components.

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>My Card</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

## Contributing

Want to add a new component? Read [How to Add a UI Component](../how-to/add-ui-component.md).

**Guidelines:**
- Use TypeScript
- Follow existing patterns
- Add accessibility attributes
- Use TailwindCSS for styling
- Add to Storybook (if we set it up)

---

**Questions?** Check the source code in `apps/web/src/components/` - it's well-commented.

