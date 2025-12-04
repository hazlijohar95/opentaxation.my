# Contributing Guide

We love contributions, but... let's be honest, we have standards (sort of).

## How to Contribute

**Ways to contribute:**
1. **Fix bugs** - Found a bug? Fix it!
2. **Add features** - Want something new? Add it!
3. **Improve docs** - Docs unclear? Make them better!
4. **Report issues** - Found a problem? Tell us!

**What we're looking for:**
- Bug fixes (especially calculation bugs)
- Documentation improvements
- Performance improvements
- Accessibility improvements
- New tax rules (when government announces them)

**What we're NOT looking for:**
- Features that don't fit the project scope
- Changes that break existing calculations
- Code that doesn't follow our patterns
- PRs without tests (for code changes)

## Getting Started

### 1. Fork the Repository

Click "Fork" on GitHub. This creates your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/Open-Corporation.com.git
cd Open-Corporation.com
```

### 3. Install Dependencies

```bash
npm install
```

**If this fails:** Check [Installation Guide](../getting-started/installation.md).

### 4. Create a Branch

```bash
git checkout -b fix/calculation-bug
# or
git checkout -b feature/new-tax-rule
```

**Branch naming:**
- `fix/` - Bug fixes
- `feature/` - New features
- `docs/` - Documentation
- `refactor/` - Code improvements

### 5. Make Your Changes

**Code style:**
- TypeScript strict mode (no `any` types)
- Functional React components (no classes)
- TailwindCSS for styling
- Follow existing patterns

**Test your changes:**
```bash
npm run test
npm run build
npm run dev  # Test in browser
```

### 6. Write Tests (for code changes)

**If you add/fix calculations:**
- Add test cases
- Test edge cases
- Test boundary values

**Example:**
```typescript
it('should calculate tax correctly for RM150k', () => {
  const result = calculatePersonalTax(150000);
  expect(result.tax).toBeCloseTo(18900, 0);
});
```

### 7. Update Documentation

**If you change:**
- Tax rates → Update `docs/concepts/tax-calculations.md`
- API → Update `docs/api/`
- Features → Update relevant guides

**Don't skip this.** Documentation is important.

### 8. Commit Your Changes

```bash
git add .
git commit -m "fix: correct personal tax calculation for RM150k income"
```

**Commit message format:**
- `fix:` - Bug fix
- `feat:` - New feature
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Tests

**Examples:**
- `fix: correct EPF calculation for salaries > RM5k/month`
- `feat: add SOCSO calculation support`
- `docs: update tax brackets for YA 2025/2026`

### 9. Push to Your Fork

```bash
git push origin fix/calculation-bug
```

### 10. Open a Pull Request

1. Go to GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit!

## Code Style

**We're not perfect, but we try:**

### TypeScript

- **Strict mode:** Enabled (no `any` types)
- **Interfaces:** Use interfaces, not types (mostly)
- **Naming:** PascalCase for types, camelCase for functions

### React

- **Components:** Functional components only
- **Hooks:** Use hooks, not class components
- **Props:** TypeScript interfaces for props

### Styling

- **TailwindCSS:** Use utility classes
- **No inline styles:** Use Tailwind instead
- **Theme colors:** Use theme variables (`foreground`, `background`, etc.)

### Naming

- **Components:** PascalCase (`TaxCard.tsx`)
- **Functions:** camelCase (`calculatePersonalTax`)
- **Files:** Match export name
- **Types:** PascalCase (`TaxCalculationInputs`)

## Testing Requirements

**For code changes:**

- [ ] Write tests for new code
- [ ] Update tests for changed code
- [ ] All tests pass (`npm run test`)
- [ ] No TypeScript errors (`npm run build`)

**For bug fixes:**

- [ ] Write test that reproduces bug
- [ ] Fix bug
- [ ] Test passes
- [ ] No regressions (other tests still pass)

**For new features:**

- [ ] Write tests for feature
- [ ] Test edge cases
- [ ] Test error handling
- [ ] Manual testing in browser

## Pull Request Process

### PR Checklist

Before submitting:

- [ ] Code compiles (`npm run build`)
- [ ] Tests pass (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

### PR Description

**Include:**
- What changed (brief summary)
- Why changed (problem it solves)
- How to test (steps to verify)
- Screenshots (if UI changed)

**Example:**
```markdown
## What Changed
Fixed personal tax calculation for incomes > RM100k.

## Why
Tax was calculated incorrectly due to bracket boundary bug.

## How to Test
1. Enter RM150k income
2. Verify tax is ~RM18,900 (not RM20,000)

## Screenshots
[If UI changed]
```

### Review Process

**What we check:**
1. Code quality (follows patterns?)
2. Tests (are they good?)
3. Documentation (updated?)
4. Calculations (are they correct?)
5. No breaking changes (does it break existing code?)

**We'll ask for changes if:**
- Code doesn't follow patterns
- Tests are missing/weak
- Documentation not updated
- Calculations seem wrong
- Breaking changes without discussion

**We'll merge if:**
- Everything looks good
- Tests pass
- Documentation updated
- No breaking changes (or discussed)

## What We're Looking For

### High Priority

- **Calculation bugs** - If calculations are wrong, that's critical
- **Tax rate updates** - When government announces new rates
- **Accessibility** - Making the app usable for everyone
- **Documentation** - Making docs better

### Medium Priority

- **Performance** - Making things faster
- **UI improvements** - Better user experience
- **New features** - That fit the project scope
- **Code quality** - Refactoring, cleanup

### Low Priority

- **Styling tweaks** - Minor visual changes
- **Optimization** - Premature optimization
- **Features outside scope** - Nice to have, but not essential

## What We're NOT Looking For

**Please don't submit:**
- Features that don't fit the project (e.g., "add cryptocurrency tax")
- Breaking changes without discussion
- Code that doesn't follow patterns
- PRs without tests (for code changes)
- PRs that break existing functionality

**If unsure:** Open an issue first to discuss.

## Code of Conduct

**Be nice, be helpful.**

- Respectful communication
- Constructive feedback
- Help others learn
- No harassment or discrimination

**We're all here to help.** Let's keep it friendly.

## Getting Help

**Stuck?**
- Read the docs (we wrote them for a reason)
- Check existing code (it's well-commented)
- Open an issue (we'll help)
- Ask questions (no question is stupid)

**Found a bug but can't fix it?**
- Open an issue with:
  - Steps to reproduce
  - Expected result
  - Actual result
  - Screenshots (if UI)
- We'll fix it (or help you fix it)

## Recognition

**Contributors are awesome.** We'll:
- Credit you in the project
- Thank you in release notes
- Appreciate your help (seriously, thank you!)

**You don't get:**
- Money (this is open source)
- Guaranteed merge (we review everything)
- Immediate response (we're volunteers)

## Questions?

**Not sure about something?**
- Open an issue to discuss
- Check existing issues/PRs
- Read the docs
- Ask in discussions

**We're here to help.** Don't be shy!

---

**Ready to contribute?** Fork, branch, code, test, document, PR. We'll review it and merge if it's good. Simple as that!

