# How to Add a New UI Component

Guide to adding new UI components to the web app (because sometimes you need custom components).

## When to Add a Component

**Add a component when:**
- You need reusable UI that doesn't exist
- You want to customize an existing component
- You're building a new feature

**Don't add:**
- If shadcn/ui already has it (use that instead)
- If you can use existing components (compose them)
- If it's a one-off (just inline it)

## Component Structure

**Standard component structure:**

```typescript
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface MyComponentProps {
  title: string;
  value: number;
  className?: string;
}

export default function MyComponent({
  title,
  value,
  className,
}: MyComponentProps) {
  return (
    <Card className={cn("border", className)}>
      <CardContent className="p-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="font-numbers text-2xl">{value}</p>
      </CardContent>
    </Card>
  );
}
```

**Key points:**
- Use TypeScript interfaces for props
- Use `cn()` utility for className merging
- Use shadcn/ui components as base
- Use TailwindCSS for styling
- Export as default

## Step-by-Step Guide

### Step 1: Create Component File

**Location:** `apps/web/src/components/`

**Naming:** PascalCase, descriptive name

**Example:** `apps/web/src/components/ProfitDisplay.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProfitDisplayProps {
  profit: number;
  label?: string;
  className?: string;
}

export default function ProfitDisplay({
  profit,
  label = "Profit",
  className,
}: ProfitDisplayProps) {
  return (
    <Card className={cn("border", className)}>
      <CardHeader>
        <CardTitle className="text-sm">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-numbers text-2xl font-bold">
          RM{profit.toLocaleString('en-MY')}
        </p>
      </CardContent>
    </Card>
  );
}
```

### Step 2: Style with TailwindCSS

**Use Tailwind utilities:**

```typescript
<div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
  <span className="text-sm text-muted-foreground">Label</span>
  <span className="font-numbers text-lg font-semibold">Value</span>
</div>
```

**Theme colors:**
- `foreground` - Text color
- `background` - Background color
- `muted` - Muted text/background
- `border` - Border color
- `--blue` - Primary blue (use sparingly)

**Custom utilities:**
- `font-display` - Instrument Serif (headings)
- `font-numbers` - Inter with tabular numbers
- `touch-target` - Minimum 44px touch target

### Step 3: Add Accessibility

**Required attributes:**

```typescript
<button
  aria-label="Close dialog"
  className="touch-target"
>
  <XIcon />
</button>

<input
  aria-label="Business profit"
  aria-describedby="profit-help"
/>
<span id="profit-help" className="sr-only">
  Enter your annual business profit
</span>
```

**Guidelines:**
- All interactive elements need `aria-label`
- Form inputs need labels (use `Label` component)
- Use `sr-only` for screen-reader-only text
- Minimum touch target: 44px (`touch-target` class)

### Step 4: Add Animations (Optional)

**Use Framer Motion:**

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

**Common patterns:**
- Fade in: `opacity: 0 → 1`
- Slide up: `y: 10 → 0`
- Duration: 0.2-0.4s (fast, not slow)

### Step 5: Use the Component

**Import and use:**

```typescript
import ProfitDisplay from '@/components/ProfitDisplay';

function MyPage() {
  return (
    <ProfitDisplay
      profit={150000}
      label="Annual Profit"
    />
  );
}
```

### Step 6: Test Responsively

**Test on:**
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)

**Use Tailwind breakpoints:**
```typescript
<div className="text-sm sm:text-base lg:text-lg">
  Responsive text
</div>
```

## Using shadcn/ui Components

**Available components:** Check `apps/web/src/components/ui/`

**Common components:**
- `Button` - Buttons with variants
- `Card` - Card container
- `Input` - Text input
- `Label` - Form labels
- `Badge` - Badge component
- `Slider` - Range slider
- `Tooltip` - Tooltip component

**Example:**

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

<Card>
  <CardContent>
    <Button variant="default">Click me</Button>
  </CardContent>
</Card>
```

**Variants:** Check component file for available variants.

## Styling Guidelines

### Use TailwindCSS

**Don't use:**
- Inline styles (`style={{}}`)
- CSS modules (unless necessary)
- Global CSS (use Tailwind utilities)

**Do use:**
- Tailwind utility classes
- `cn()` for conditional classes
- Theme colors from Tailwind config

### Responsive Design

**Mobile-first approach:**

```typescript
// Mobile: small, Desktop: large
<div className="text-sm lg:text-lg">

// Mobile: stacked, Desktop: side-by-side
<div className="flex flex-col lg:flex-row">

// Mobile: full width, Desktop: max width
<div className="w-full lg:max-w-2xl">
```

### Typography

**Headings:** Use `font-display` (Instrument Serif)

```typescript
<h1 className="font-display text-3xl font-bold">Title</h1>
```

**Numbers:** Use `font-numbers` (Inter with tabular numbers)

```typescript
<span className="font-numbers text-2xl">RM150,000</span>
```

**Body:** Default font (Urbanist)

```typescript
<p className="text-sm text-muted-foreground">Body text</p>
```

## Icons

**Use Phosphor Duotone:**

```typescript
import { ArrowRight, Download, Question } from 'phosphor-react';

<ArrowRight weight="duotone" className="h-4 w-4" />
```

**Always use `weight="duotone"`** for consistency.

**Common icons:**
- `ArrowRight`, `ArrowLeft` - Navigation
- `Download` - Download actions
- `Question` - Help/tooltips
- `CheckCircle`, `WarningCircle` - Status
- `Sparkle` - Highlights

## Component Patterns

### Controlled Component

```typescript
interface ControlledInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ControlledInput({
  value,
  onChange,
}: ControlledInputProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
```

### Composition

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function MyCard({ title, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
```

## Example: Creating a Custom Input

**Scenario:** Need a currency input with validation

**File:** `apps/web/src/components/CurrencyInput.tsx`

```typescript
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function CurrencyInput({
  label,
  value,
  onChange,
  min = 0,
  max,
  className,
}: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value) || 0;
    const clamped = Math.max(min, max !== undefined ? Math.min(numValue, max) : numValue);
    onChange(clamped);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          RM
        </span>
        <Input
          type="number"
          value={value || ''}
          onChange={handleChange}
          min={min}
          max={max}
          className="pl-8"
        />
      </div>
    </div>
  );
}
```

**Usage:**

```typescript
<CurrencyInput
  label="Business Profit"
  value={businessProfit}
  onChange={setBusinessProfit}
  min={0}
  max={10000000}
/>
```

## Testing Components

**Manual testing:**
1. Use the component in a page
2. Test all props
3. Test edge cases (empty, null, very large values)
4. Test responsive behavior
5. Test accessibility (keyboard navigation, screen reader)

**Automated testing (if we add it):**
```typescript
import { render, screen } from '@testing-library/react';
import CurrencyInput from '@/components/CurrencyInput';

test('renders currency input', () => {
  render(<CurrencyInput label="Profit" value={1000} onChange={() => {}} />);
  expect(screen.getByLabelText('Profit')).toBeInTheDocument();
});
```

## Common Mistakes

### Mistake 1: Not Using TypeScript

**Wrong:**
```typescript
export default function MyComponent(props) {
  return <div>{props.title}</div>;
}
```

**Right:**
```typescript
interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

### Mistake 2: Inline Styles

**Wrong:**
```typescript
<div style={{ color: 'red', fontSize: '16px' }}>
```

**Right:**
```typescript
<div className="text-red-500 text-base">
```

### Mistake 3: Not Making It Responsive

**Wrong:**
```typescript
<div className="w-64">Fixed width</div>
```

**Right:**
```typescript
<div className="w-full sm:w-64">Responsive width</div>
```

### Mistake 4: Missing Accessibility

**Wrong:**
```typescript
<button><Icon /></button>
```

**Right:**
```typescript
<button aria-label="Close"><Icon /></button>
```

### Mistake 5: Not Using Theme Colors

**Wrong:**
```typescript
<div className="text-gray-900 bg-white">
```

**Right:**
```typescript
<div className="text-foreground bg-background">
```

## Component Checklist

Before submitting:

- [ ] TypeScript types defined
- [ ] Uses TailwindCSS (no inline styles)
- [ ] Responsive (mobile + desktop)
- [ ] Accessible (aria-labels, keyboard nav)
- [ ] Uses theme colors
- [ ] Uses shadcn/ui components (if applicable)
- [ ] Uses `cn()` for className merging
- [ ] Exported as default
- [ ] File named PascalCase
- [ ] Comments explain complex logic

## Getting Help

**Stuck?**
1. Check existing components for examples
2. Read shadcn/ui documentation
3. Check TailwindCSS docs
4. Ask in GitHub issues

**Found a bug?**
- Write a test that reproduces it
- Fix the bug
- Submit PR

---

**Ready to add a component?** Follow the steps above, test thoroughly, and submit a PR. We'll review it and merge if it follows the patterns.

