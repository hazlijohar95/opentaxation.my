# Design System

**Reference:** [Figma Source](https://www.figma.com/design/Lsc3cUSYdmKkWL15jCh6el/-1-Prototype---Current?node-id=14638-44358)

---

## Quick Reference

| Specification | Value |
|---------------|-------|
| Touch Targets | 48px minimum |
| Animation Duration | 0.3s |
| Animation Stagger | 0.02s increments |
| Card Hover | lift + shadow |

---

## Colors

### Core Palette

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | #4F46E5 | Buttons, CTA sections, links |
| `background-primary` | #FFFFFF | Main content areas |
| `background-secondary` | #F5F5F5 | Alternating sections |
| `text-primary` | #000000 | Headlines, body text |
| `text-secondary` | #6B7280 | Subtle text, descriptions |
| `surface-dark` | #1E1E1E | Code blocks, terminal UI |

### Semantic Colors

| State | Border | Background | Usage |
|-------|--------|------------|-------|
| Success (Sdn Bhd) | `emerald-500/40` | `from-emerald-500/5 to-emerald-500/10` | Recommended choice |
| Info (Enterprise) | `blue-500/40` | `from-blue-500/5 to-blue-500/10` | Alternative choice |
| Warning | `destructive/30` | `from-destructive/5 to-destructive/10` | Alerts, caveats |
| Neutral | `border/50` | `card` | Default state |

### Feature Icon Colors

| Category | Color | Tailwind Class |
|----------|-------|----------------|
| Financial | Emerald | `text-emerald-600` |
| Income | Amber | `text-amber-600` |
| Tax | Blue | `text-blue-600` |
| Business | Purple | `text-purple-600` |
| Growth | Rose | `text-rose-600` |
| Verification | Teal | `text-teal-600` |

---

## Typography

| Element | Style |
|---------|-------|
| Headlines | Large, bold, sans-serif (`font-display`) |
| Body | Regular weight, sans-serif |
| Numbers | Tabular nums, monospace (`font-numbers`) |
| Code/Terminal | Monospace |

### Heading Scale

| Level | Desktop | Mobile | Usage |
|-------|---------|--------|-------|
| Hero | `text-5xl`/`text-6xl` | `text-4xl` | Landing page headline |
| Section | `text-2xl`/`text-3xl` | `text-xl` | Section headers |
| Card | `text-lg`/`text-xl` | `text-base` | Card titles |
| Label | `text-sm` | `text-sm` | Form labels, metadata |

---

## Layout

### Breakpoints

| Name | Width | Tailwind Prefix |
|------|-------|-----------------|
| Mobile | < 640px | (default) |
| Tablet | ≥ 640px | `sm:` |
| Desktop | ≥ 1024px | `lg:` |
| Wide | ≥ 1280px | `xl:` |

### Container

| Property | Value |
|----------|-------|
| Desktop Width | 1440px |
| Container Width | ~1112px |
| Side Margins | ~164px (desktop), 20px (mobile) |
| Grid | 12-column implied |

### Touch Targets

| Element | Height | Tailwind Class |
|---------|--------|----------------|
| Input fields | 48px (mobile) / 44px (desktop) | `h-12 sm:h-11` |
| Buttons | 48px minimum | `min-h-[48px]` |
| Toggle buttons | 48px | `min-h-[48px]` |
| Collapsible headers | 48px | `min-h-[48px]` |
| Mobile tab labels | 11px | `text-[11px]` |

### Spacing

| Context | Padding |
|---------|---------|
| Section (vertical) | `py-8 sm:py-12 lg:py-16` |
| Card content | `p-5 sm:p-6` |
| Header | `py-3 sm:py-4 lg:py-6` |
| Safe area (mobile) | `pb-safe` |

---

## Animation Guidelines

### Entry Animations

| Property | Value | Rationale |
|----------|-------|-----------|
| Initial state | `opacity: 0, y: 10` | Subtle upward fade |
| Duration | `0.3s` | Smooth but quick |
| Stagger delay | `0.02s` increments | Fast cascade effect |
| Total form render | `~0.4s` | Responsive feel |
| Easing | `ease-out` | Natural deceleration |

### Stagger Sequence (InputsSection)

| Component | Delay |
|-----------|-------|
| ProfitInputSection | 0.02s |
| SdnBhdSettingsSection | 0.04s |
| AuditSection | 0.06s |
| ZakatSection | 0.08s |
| ReliefsSection | 0.10s |
| EducationalNotes | 0.12s |

### Transition Best Practices

- Use `transition-all duration-200` for micro-interactions
- Use `transition-all duration-300` for card hover states
- Avoid `mode="wait"` on nested AnimatePresence (causes jank)
- Keep opacity transitions simple (no height animation when not needed)

---

## Components

### Navigation Bar

- Horizontal layout
- Logo (left)
- Nav links (center)
- Text link + Primary button (right)
- Background: `bg-background/95 backdrop-blur-xl`

### Primary Button (CTA)

| Property | Value |
|----------|-------|
| Height | `h-16` (hero), `h-12` (standard) |
| Padding | `px-12` (hero), `px-6` (standard) |
| Border radius | `rounded-2xl` |
| Shadow | `shadow-lg shadow-primary/25` |
| Hover | `hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]` |
| Active | `active:scale-[0.98]` |

### Input Field

| Property | Mobile | Desktop |
|----------|--------|---------|
| Height | `h-12` (48px) | `h-11` (44px) |
| Font size | `text-base` | `text-sm` |
| Padding (with prefix) | `pl-10` | `pl-10` |

### Cards

#### Base Card

```css
border-border/50
shadow-sm
hover:shadow-lg
hover:-translate-y-0.5
transition-all duration-300
hover:border-primary/20
```

#### Recommendation Card States

| State | Classes |
|-------|---------|
| Sdn Bhd Better | `border-emerald-500/40 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10` |
| Enterprise Better | `border-blue-500/40 bg-gradient-to-br from-blue-500/5 to-blue-500/10` |
| Similar | `border-border/50 bg-card` |
| Warning | `border-destructive/30 bg-gradient-to-br from-destructive/5 to-destructive/10` |

#### Feature Card

```css
group
flex flex-col items-center
p-4 rounded-2xl
hover:bg-muted/50
transition-colors duration-200
```

#### Feature Icon Container

```css
w-14 h-14
rounded-xl
bg-background
border border-border/50
shadow-sm
group-hover:shadow-md
group-hover:scale-105
transition-all duration-200
```

### Toggle Buttons

```css
flex-1
py-3.5 px-4
rounded-lg
text-[13px] sm:text-sm
font-medium
min-h-[48px]
transition-all duration-200
```

Active: `bg-background text-foreground shadow-sm`
Inactive: `text-muted-foreground hover:text-foreground`

### Collapsible Section

```css
border border-border/50
rounded-2xl
overflow-hidden
bg-card
```

Header: `p-4 min-h-[48px] hover:bg-muted/30`

---

## Mobile Layout

### Safe Area Handling

```css
/* Full height with safe area */
h-screen min-h-[100dvh]

/* Bottom padding for fixed nav */
padding-bottom: calc(49px + env(safe-area-inset-bottom, 0px))

/* Content padding */
pb-20 md:pb-8
```

### Bottom Navigation

| Property | Value |
|----------|-------|
| Height | 49px |
| Background | `bg-background/80 backdrop-blur-xl` |
| Border | `border-t border-border/30` |
| Tab label size | `text-[11px]` |
| Icon size | `h-6 w-6` |

---

## Interactive States

### Hover States

| Element | Effect |
|---------|--------|
| Cards | `hover:shadow-lg hover:-translate-y-0.5` |
| Buttons | `hover:scale-[1.02]` (CTA), `hover:bg-muted/50` (ghost) |
| Icons | `group-hover:scale-105 group-hover:shadow-md` |
| Links | `hover:text-primary` |

### Active States

| Element | Effect |
|---------|--------|
| Buttons | `active:scale-[0.98]` |
| Tabs | `active:bg-muted/30` |

### Focus States

```css
focus:ring-2
focus:ring-ring
focus:ring-offset-2
focus:outline-none
```

---

## Section Patterns

### Alternating Backgrounds

Sections alternate between:
- White (`section-primary`)
- Light gray (`section-secondary`)
- Brand blue (`primary`) for CTA emphasis

### Two-Column Layout

- Text content on one side
- Visual/image on the other
- Used for feature showcases

### Full-Width CTA

- Blue background with gradient
- Centered content
- Primary button with enhanced shadow

---

## Assets Required

- [x] Logo (SVG)
- [x] Partner/client logos (for social proof)
- [x] Product screenshots
- [x] User avatars (circular)
- [x] Feature icons (Phosphor icons, duotone)
- [x] Decorative grid pattern (CSS generated)

---

## Accessibility

### Keyboard Navigation

- All interactive elements focusable
- Focus visible indicator on all elements
- Skip links for main content areas
- Tab order follows visual layout

### Screen Readers

- Proper heading hierarchy
- ARIA labels on icon buttons
- `role="tablist"` on tab navigation
- Descriptive `aria-describedby` on form fields

### Motion

- Respect `prefers-reduced-motion`
- Animations are subtle and quick
- No auto-playing animations
