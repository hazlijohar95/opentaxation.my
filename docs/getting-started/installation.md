# Installation Guide

The boring but necessary details about getting this thing installed.

## Prerequisites

### Node.js

You need **Node.js 18.0.0 or higher**. Why? Because we use modern JavaScript features and that's what works.

**Check your version:**
```bash
node --version
```

**Don't have Node.js?**
- Download from [nodejs.org](https://nodejs.org/)
- Pick the **LTS version** (Long Term Support)
- Install it like any other program
- Restart your terminal after installing

**Using a version manager?** Good choice.
- **nvm** (Mac/Linux): `nvm install 18 && nvm use 18`
- **nvm-windows** (Windows): Same commands
- **fnm** (Fast Node Manager): `fnm install 18 && fnm use 18`

### npm

npm comes with Node.js. You should have it automatically.

**Check your version:**
```bash
npm --version
```

Should be 10.0.0 or higher. If not, update Node.js.

## Monorepo Setup Explained Simply

This is a **Turborepo monorepo**. What does that mean?

- **Monorepo**: All code lives in one repository
- **Turborepo**: A tool that helps build everything efficiently
- **Workspaces**: npm feature that links packages together

**Structure:**
```
Open-Corporation.com/
├── apps/
│   └── web/          # The React app you see in browser
├── packages/
│   ├── core/         # Tax calculation logic (pure TypeScript)
│   └── config/       # Tax brackets, rules, etc.
└── package.json      # Root config
```

When you run `npm install` at the root, it installs dependencies for everything. Magic!

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Open-Corporation.com
```

If you're forking or contributing, use your fork's URL instead.

### Step 2: Install Dependencies

```bash
npm install
```

**What this does:**
- Reads `package.json` files in root, apps/web, packages/core, packages/config
- Downloads all dependencies to `node_modules/`
- Links packages together using npm workspaces
- Creates `package-lock.json` (don't commit this, it's auto-generated)

**How long?** Depends on your internet. Usually 1-3 minutes.

**What if it fails?**

1. **Permission errors** (Mac/Linux):
   ```bash
   # Don't use sudo! Instead, fix permissions:
   sudo chown -R $(whoami) ~/.npm
   ```

2. **Network errors**:
   - Check your internet connection
   - Try again (npm can be flaky)
   - Use a different network if possible

3. **Out of memory**:
   - Close other programs
   - Try `npm install --legacy-peer-deps` (not ideal, but works)

4. **Still failing?**
   ```bash
   # Nuclear option - start fresh:
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

### Step 3: Verify Installation

Check that everything installed:

```bash
# Should show version numbers
node --version
npm --version

# Should list all packages
npm list --depth=0
```

You should see packages like `@tax-engine/core`, `@tax-engine/config`, `@tax-engine/web`.

### Step 4: Build Everything (Optional but Recommended)

```bash
npm run build
```

This compiles TypeScript and checks for errors. If this fails, you have problems.

**Common build errors:**
- TypeScript errors → Fix the code
- Missing dependencies → Run `npm install` again
- Path errors → Check your file structure

## Environment Variables

For the web app to work fully, you need Clerk authentication set up.

### Development

Create `apps/web/.env.local`:
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

Get your key from [Clerk Dashboard](https://dashboard.clerk.com).

**Don't have Clerk set up yet?** The app will show an error, but you can still see the UI. Authentication is optional for development (but required for production).

### Production

Set these in your hosting platform:
- `VITE_CLERK_PUBLISHABLE_KEY` - Your production Clerk key (starts with `pk_live_`)

## Development Server

Start the dev server:

```bash
npm run dev
```

**What happens:**
- Vite starts a dev server (usually on port 3000)
- Watches for file changes
- Hot-reloads when you save files
- Shows errors in browser and terminal

**Stop the server:** Press `Ctrl+C` in the terminal.

## Production Build

To build for production:

```bash
npm run build
```

**Output:** `apps/web/dist/` folder with static files.

**Preview production build:**
```bash
npm run preview
```

This serves the production build locally so you can test it.

## Troubleshooting

### "Command not found: npm"

Node.js isn't installed or not in your PATH. Install Node.js properly.

### "Cannot find module"

Run `npm install` again. Sometimes dependencies don't install correctly.

### "Port 3000 already in use"

Something else is using port 3000. Either:
- Kill the other process
- Change the port in `apps/web/vite.config.ts`

### "Permission denied"

Don't use `sudo` with npm. Fix your npm permissions instead:
```bash
sudo chown -R $(whoami) ~/.npm
```

### "Out of memory"

Node.js ran out of memory. Increase the limit:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm install
```

### "Workspace not found"

The monorepo structure might be broken. Make sure you're in the root directory and all folders exist.

## What's Next?

- [Quick Start Guide](./quick-start.md) - Get running in 5 minutes
- [Your First Calculation](./first-calculation.md) - Learn how to use it
- [Architecture Overview](../concepts/architecture.md) - Understand the codebase

---

**Still having issues?** Check the [Contributing Guide](../contributing/contributing.md) or open an issue on GitHub.

