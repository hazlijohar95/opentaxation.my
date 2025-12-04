# Development Workflow

How we work (or try to work, anyway).

## Branch Strategy

**Main branch:** `main` (or `master`)

**Branch naming:**
- `fix/calculation-bug` - Bug fixes
- `feature/new-tax-rule` - New features
- `docs/update-readme` - Documentation
- `refactor/cleanup-code` - Refactoring

**Create branch from:** `main` (always up to date)

**Merge to:** `main` (after review)

## Development Process

### 1. Start Working

```bash
# Update main
git checkout main
git pull origin main

# Create branch
git checkout -b fix/my-bug-fix

# Make changes
# ... edit files ...

# Test
npm run test
npm run build
npm run dev
```

### 2. Commit Often

**Small commits are better:**
```bash
git add file1.ts
git commit -m "fix: correct tax bracket calculation"

git add file2.ts
git commit -m "test: add test case for RM150k income"
```

**Not:**
```bash
git add .
git commit -m "fix stuff"  # Too vague, too many changes
```

### 3. Write Good Commit Messages

**Format:**
```
type: brief description

Optional longer description explaining why and how.
```

**Types:**
- `fix:` - Bug fix
- `feat:` - New feature
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Build/tooling

**Examples:**
```
fix: correct personal tax calculation for RM150k income

The calculation was applying 25% rate to full income instead
of just the portion above RM100k. Fixed by calculating income
in bracket correctly.

fix: correct EPF rate for salaries > RM5k/month

feat: add SOCSO calculation support

docs: update tax brackets for YA 2025/2026
```

**Why:** Good commit messages help us understand what changed and why.

### 4. Test Before Committing

**Always test:**
```bash
npm run test    # Unit tests
npm run build   # TypeScript compilation
npm run lint    # Linting
npm run dev     # Manual testing
```

**Don't commit broken code.** It makes reviews harder.

### 5. Push and Create PR

```bash
git push origin fix/my-bug-fix
```

Then create PR on GitHub.

## Pull Request Process

### Before Submitting

**Checklist:**
- [ ] Code compiles (`npm run build`)
- [ ] Tests pass (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] Branch is up to date

### PR Description

**Include:**
- What changed
- Why changed
- How to test
- Screenshots (if UI)

**Template:**
```markdown
## What Changed
Brief description of what you changed.

## Why
Why this change was needed (problem it solves).

## How to Test
Steps to verify the change works:
1. Do this
2. Then this
3. Verify that

## Screenshots
[If UI changed, add screenshots]
```

### Review Process

**What happens:**
1. We review your PR
2. We might ask for changes
3. You make changes (or discuss)
4. We approve and merge

**Review checklist:**
- Code quality (follows patterns?)
- Tests (are they good?)
- Documentation (updated?)
- Calculations (correct?)
- No breaking changes

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
- No breaking changes

### After Merge

**We'll:**
- Merge your PR
- Close the branch (you can delete your fork's branch)
- Thank you (seriously, thank you!)

**You can:**
- Delete your branch
- Update your fork
- Start on next contribution

## Code Review Guidelines

### For Contributors

**When submitting PR:**
- Make it easy to review (small PRs are better)
- Explain what and why
- Respond to feedback promptly
- Be open to suggestions

**Don't:**
- Take feedback personally (it's about code, not you)
- Argue without reason (but do explain your choices)
- Ignore feedback (address it or discuss it)

### For Reviewers

**When reviewing:**
- Be constructive (suggest improvements, don't just criticize)
- Explain why (help contributors learn)
- Be respectful (we're all learning)
- Approve when ready (don't hold up good PRs)

**Don't:**
- Nitpick (focus on important issues)
- Be rude (be nice, be helpful)
- Block without reason (explain your concerns)

## Testing Workflow

### Before Committing

**Always test:**
```bash
npm run test    # Unit tests
npm run build   # Compilation
npm run lint    # Linting
```

### Before PR

**Test everything:**
- All tests pass
- No TypeScript errors
- No linting errors
- Manual testing in browser
- Edge cases handled

### After PR Merge

**We run CI/CD:**
- Automated tests
- Build verification
- Linting checks

**If CI fails:** We'll fix it (or ask you to).

## Release Process

**We release when:**
- Significant changes accumulated
- Critical bugs fixed
- Tax rates updated

**Process:**
1. Update version numbers
2. Update changelog
3. Create release tag
4. Deploy (if applicable)

**You don't need to worry about this** - maintainers handle releases.

## Getting Help

**Stuck?**
- Read the docs
- Check existing code
- Open an issue
- Ask questions

**We're here to help.** Don't hesitate to ask!

---

**Ready to contribute?** Follow this workflow, and you'll be fine. We're not strict, but consistency helps everyone.

