# How to Add a New UI Component

Guide to adding new UI components to the web app.

---

## When to Add a Component

**Add a component when:**
- You need reusable UI that doesn't exist
- You want to customize an existing component
- You're building a new feature

**Don't add:**
- If shadcn/ui already has it (use that instead)
- If you can use existing components (compose them)
- If it's a one-off (just inline it)

---

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
      <CardContent className="p-5 sm:p-6">
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

---

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
    <Card className={cn("border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300", className)}>
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

| Token | Usage |
|-------|-------|
| `foreground` | Text color |
| `background` | Background color |
| `muted` | Muted text/background |
| `border` | Border color |
| `primary` | Primary accent |
| `emerald-500` | Success/Sdn Bhd |
| `blue-500` | Info/Enterprise |
| `destructive` | Warnings/errors |

**Custom utilities:**
- `font-display` - Instrument Serif (headings)
- `font-numbers` - Inter with tabular numbers
- `pb-safe` - Safe area padding (mobile)

### Step 3: Touch Targets

All interactive elements need **48px minimum** touch target:

```typescript
// Input fields
<Input className="h-12 sm:h-11" />

// Buttons
<Button className="min-h-[48px]" />

// Toggle buttons
<button className="min-h-[48px] py-3.5 px-4" />

// Collapsible headers
<div className="min-h-[48px] p-4" />
```

### Step 4: Add Accessibility

**Required attributes:**

```typescript
<button
  aria-label="Close dialog"
  className="min-h-[48px]"
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
- Minimum touch target: 48px

### Step 5: Add Animations

**Use Framer Motion with our timing standards:**

```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.02, duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

**Animation Standards:**

| Property | Value | Rationale |
|----------|-------|-----------|
| Initial state | `opacity: 0, y: 10` | Subtle upward fade |
| Duration | `0.3s` | Smooth but quick |
| Stagger delay | `0.02s` increments | Fast cascade |
| Easing | `ease-out` | Natural deceleration |

**Stagger sequence example:**

```typescript
const sections = [
  { component: <SectionA />, delay: 0.02 },
  { component: <SectionB />, delay: 0.04 },
  { component: <SectionC />, delay: 0.06 },
];

{sections.map(({ component, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
  >
    {component}
  </motion.div>
))}
```

### Step 6: Use the Component

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

### Step 7: Test Responsively

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

---

## Callback Object Pattern

For components with many callbacks, use the **Callback Object Pattern**:

```typescript
// Define callback interface
interface MyCallbacks {
  onValueChange: (value: number) => void;
  onModeChange: (mode: string) => void;
  onToggle: (enabled: boolean) => void;
}

// Component receives callbacks object
interface MySectionProps {
  data: MyData;
  callbacks: MyCallbacks;
}

function MySection({ data, callbacks }: MySectionProps) {
  return (
    <div>
      <Input onChange={callbacks.onValueChange} />
      <Select onChange={callbacks.onModeChange} />
      <Switch onCheckedChange={callbacks.onToggle} />
    </div>
  );
}

// Usage - define callbacks once
const myCallbacks: MyCallbacks = {
  onValueChange: setValue,
  onModeChange: setMode,
  onToggle: setEnabled,
};

<MySection data={data} callbacks={myCallbacks} />
```

**Benefits:**
- Cleaner component interfaces
- Easier to pass down through multiple levels
- Self-documenting callback groups

---

## Using shadcn/ui Components

**Available components:** Check `apps/web/src/components/ui/`

**Common components:**

| Component | Usage |
|-----------|-------|
| `Button` | Buttons with variants |
| `Card` | Card container |
| `Input` | Text input |
| `Label` | Form labels |
| `Badge` | Status badges |
| `Slider` | Range slider |
| `Tooltip` | Help text |
| `Switch` | Toggle switch |
| `Separator` | Visual divider |

**Example:**

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

<Card className="hover:shadow-lg transition-all duration-300">
  <CardContent className="p-5 sm:p-6">
    <Button variant="default" className="min-h-[48px]">
      Click me
    </Button>
  </CardContent>
</Card>
```

---

## Hover & Interactive States

**Card hover:**
```css
hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300
```

**CTA button hover:**
```css
hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]
```

**Feature icon hover:**
```css
group-hover:shadow-md group-hover:scale-105 transition-all duration-200
```

**Ghost button:**
```css
hover:bg-muted/50 transition-colors duration-200
```

---

## Icons

**Use Phosphor Duotone:**

```typescript
import { ArrowRight, Download, Question } from 'phosphor-react';

<ArrowRight weight="duotone" className="h-5 w-5" />
```

**Always use `weight="duotone"`** for consistency.

**Common icons:**

| Icon | Usage |
|------|-------|
| `ArrowRight`, `ArrowLeft` | Navigation |
| `Download` | Download actions |
| `Question` | Help/tooltips |
| `CheckCircle`, `WarningCircle` | Status |
| `Sparkle` | Highlights |
| `Calculator` | Calculator related |
| `Heart` | Favorites |

---

## Common Mistakes

### Mistake 1: Wrong Touch Target

**Wrong:**
```typescript
<button className="h-8 p-2">Small button</button>
```

**Right:**
```typescript
<button className="min-h-[48px] py-3">Accessible button</button>
```

### Mistake 2: Slow Animations

**Wrong:**
```typescript
transition={{ duration: 0.8, delay: 0.5 }}
```

**Right:**
```typescript
transition={{ duration: 0.3, delay: 0.02 }}
```

### Mistake 3: Not Using Theme Colors

**Wrong:**
```typescript
<div className="text-gray-900 bg-white">
```

**Right:**
```typescript
<div className="text-foreground bg-background">
```

### Mistake 4: Missing Hover States

**Wrong:**
```typescript
<Card className="border">
```

**Right:**
```typescript
<Card className="border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
```

---

## Component Checklist

Before submitting:

- [ ] TypeScript types defined
- [ ] Uses TailwindCSS (no inline styles)
- [ ] 48px minimum touch targets
- [ ] Responsive (mobile + desktop)
- [ ] Accessible (aria-labels, keyboard nav)
- [ ] Uses theme colors
- [ ] Uses shadcn/ui components (if applicable)
- [ ] Uses `cn()` for className merging
- [ ] Animations use 0.3s duration, 0.02s stagger
- [ ] Hover states on interactive elements
- [ ] Exported as default
- [ ] File named PascalCase

---

## Getting Help

**Stuck?**
1. Check existing components for examples
2. Read the [Design System](../design-system.md)
3. Check shadcn/ui documentation
4. Check TailwindCSS docs
5. Ask in GitHub issues
