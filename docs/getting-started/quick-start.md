# Quick Start Guide

Get this running in 5 minutes (or less, if you're lucky).

## TL;DR

```bash
git clone <your-repo-url>
cd Open-Corporation.com
npm install
npm run dev
```

Open `http://localhost:3000` and you're done. If something breaks, keep reading.

## Prerequisites

You'll need:
- **Node.js** >= 18.0.0 (check with `node --version`)
- **npm** >= 10.0.0 (comes with Node.js, check with `npm --version`)

Don't have Node.js? Get it from [nodejs.org](https://nodejs.org/). Pick the LTS version. Trust me.

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Open-Corporation.com
```

Replace `<your-repo-url>` with your actual repo URL. If you're reading this on GitHub, just click the green "Code" button.

### 2. Install Dependencies

```bash
npm install
```

This installs everything for the monorepo (root, apps/web, packages/core, packages/config). It might take a minute or two. Go grab a coffee.

**If npm install fails:**
- Make sure you're using Node.js 18+ (`node --version`)
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- On Windows? Make sure you're using Git Bash or WSL, not Command Prompt (seriously)

### 3. Start the Dev Server

```bash
npm run dev
```

You should see something like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 4. Open Your Browser

Go to `http://localhost:3000`. You should see the landing page.

**Port 3000 already in use?** Vite will automatically use the next available port (3001, 3002, etc.). Check your terminal for the actual URL.

## What Success Looks Like

When everything works, you'll see:
- A clean landing page asking "Enterprise or Sdn Bhd?"
- A "Get Started" button
- No errors in the browser console (press F12 to check)

If you see errors, check the [Troubleshooting](#troubleshooting) section below.

## Your First Calculation

1. Click "Get Started" (or sign in if you have Clerk set up)
2. Enter some numbers:
   - **Annual business profit**: Try `150000` (RM150k - realistic for a small business)
   - **Other income**: `0` (unless you have a side hustle)
   - **Monthly salary** (if Sdn Bhd): `5000` (RM5k/month is reasonable)
   - **Compliance costs**: `5000` (typical for small companies)
3. Watch the magic happen - results appear instantly on the right

The calculation happens in real-time. Change any number and see the results update immediately.

## Common "Why Isn't This Working?" Scenarios

### "npm install fails with permission errors"

**On Mac/Linux:**
```bash
sudo npm install
```
But honestly, you shouldn't need sudo. If you do, something's wrong with your Node.js setup.

**Better fix:** Use a Node version manager like [nvm](https://github.com/nvm-sh/nvm).

### "Port 3000 is already in use"

Either:
1. Kill whatever's using port 3000:
   ```bash
   # Mac/Linux
   lsof -ti:3000 | xargs kill -9
   
   # Windows (PowerShell)
   netstat -ano | findstr :3000
   # Then kill the PID shown
   ```
2. Or change the port in `apps/web/vite.config.ts`:
   ```typescript
   server: {
     port: 3001, // or whatever you want
   }
   ```

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

They might be! This is v1. Check:
- Are you using the right tax year? (Currently YA 2024/2025)
- Did you enter realistic numbers?
- Read the [Tax Calculations guide](../concepts/tax-calculations.md) to understand how it works

## Next Steps

Now that you have it running:
- Read [How Tax Calculations Work](../concepts/tax-calculations.md) to understand what's happening under the hood
- Check out [Your First Calculation](./first-calculation.md) for a deeper dive
- Want to contribute? Read [Contributing Guide](../contributing/contributing.md)

## Troubleshooting

Still stuck? Here's what to check:

1. **Node.js version**: Must be 18+ (`node --version`)
2. **npm version**: Should be 10+ (`npm --version`)
3. **Dependencies installed**: Check if `node_modules` folder exists
4. **No port conflicts**: Make sure nothing else is using port 3000
5. **Browser console**: Check for JavaScript errors (F12)
6. **Terminal output**: Read the error messages (they're usually helpful)

If none of this helps, open an issue on GitHub. Include:
- Your Node.js version
- Your OS (Mac/Windows/Linux)
- The exact error message
- What you tried already

We're not mind readers, but we'll try to help.

---

**Made a mistake?** That's okay. We all do. Just delete `node_modules` and `package-lock.json`, then start over.

**Still confused?** Read the [Installation Guide](./installation.md) for more details.

