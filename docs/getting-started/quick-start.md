# Quick Start Guide

Get this running in 5 minutes (or less, if you're lucky).

## TL;DR

```bash
git clone https://github.com/your-org/opentaxation.my
cd opentaxation.my
npm install
npm run dev
```

Open `http://localhost:5173` and you're done. If something breaks, keep reading.

---

## Prerequisites

You'll need:
- **Node.js** >= 18.0.0 (check with `node --version`)
- **npm** >= 10.0.0 (comes with Node.js, check with `npm --version`)

Don't have Node.js? Get it from [nodejs.org](https://nodejs.org/). Pick the LTS version.

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/opentaxation.my
cd opentaxation.my
```

### 2. Install Dependencies

```bash
npm install
```

This installs everything for the monorepo (root, apps/web, packages/core, packages/config). It might take a minute or two.

**If npm install fails:**
- Make sure you're using Node.js 18+ (`node --version`)
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- On Windows? Use Git Bash or WSL, not Command Prompt

### 3. Environment Setup (Optional)

For cloud features (saved calculations, cross-device sync), create `.env.local`:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Then add your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Don't have Supabase?** No problem. The app works fully offline with localStorage.

### 4. Start the Dev Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5. Open Your Browser

Go to `http://localhost:5173`. You should see the landing page.

**Port 5173 already in use?** Vite will automatically use the next available port (5174, 5175, etc.). Check your terminal for the actual URL.

---

## What Success Looks Like

When everything works, you'll see:
- A clean landing page with "Enterprise or Sdn Bhd?" headline
- A "Get Started" button with hover effects
- Feature cards with color-coded icons
- No errors in the browser console (press F12 to check)

---

## Your First Calculation

1. Click **"Get Started"** to scroll to the calculator
2. Enter some numbers:

| Field | Example Value | Notes |
|-------|---------------|-------|
| Annual business profit | `150,000` | RM150k - realistic for a small business |
| Other income | `0` | Unless you have a side hustle |
| Monthly salary (Sdn Bhd) | `5,000` | RM5k/month is reasonable |
| Compliance costs | `5,000` | Typical for small companies |

3. Watch the magic happen - results appear instantly
4. Toggle "Advanced" to configure:
   - Dividend distribution percentage
   - YA 2025 dividend surcharge
   - Zakat calculation
   - Tax reliefs

**The calculation happens in real-time.** Change any number and see the results update immediately.

---

## Mobile Experience

On mobile devices:
- Tab-based layout with bottom navigation
- Swipe between Inputs and Results tabs
- PWA installable (Add to Home Screen)
- Full offline support

**Install as PWA:**
1. Open in Safari (iOS) or Chrome (Android)
2. Tap Share → "Add to Home Screen"
3. Launch from home screen for app-like experience

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run all tests |
| `npm run lint` | Run ESLint |

---

## Troubleshooting

### "npm install fails with permission errors"

**On Mac/Linux:**
```bash
sudo npm install
```
But honestly, you shouldn't need sudo. Use a Node version manager like [nvm](https://github.com/nvm-sh/nvm) instead.

### "Port 5173 is already in use"

Either:
1. Kill whatever's using the port:
   ```bash
   # Mac/Linux
   lsof -ti:5173 | xargs kill -9

   # Windows (PowerShell)
   netstat -ano | findstr :5173
   # Then kill the PID shown
   ```
2. Or just let Vite auto-select the next port

### "I see a blank page"

1. Check the browser console (F12 → Console tab)
2. Check the terminal for errors
3. Make sure you ran `npm install` (yes, really)
4. Try `npm run build` to see if there are TypeScript errors

### "TypeScript errors everywhere"

Run:
```bash
npm run build
```

This will show you all the TypeScript errors. Fix them, or at least understand what's broken.

### "The calculations seem wrong"

They might be! Check:
- Are you using the right tax year? (Currently YA 2024/2025)
- Did you enter realistic numbers?
- Read the [Tax Calculations guide](../concepts/tax-calculations.md) to understand how it works

---

## Next Steps

Now that you have it running:
- Read [How Tax Calculations Work](../concepts/tax-calculations.md) to understand what's happening
- Explore the [Architecture Overview](../concepts/architecture.md) to understand the codebase
- Check out the [Design System](../design-system.md) for UI patterns
- Want to contribute? Read [Contributing Guide](../contributing/contributing.md)

---

## Still Stuck?

Open an issue on GitHub. Include:
- Your Node.js version
- Your OS (Mac/Windows/Linux)
- The exact error message
- What you tried already

**Made a mistake?** That's okay. Delete `node_modules` and `package-lock.json`, then start over.
