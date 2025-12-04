# Error Handling Reference

How errors are handled, tracked, and displayed in the application.

## Error Types

### Calculation Errors

**When they occur:**
- Invalid inputs (negative numbers, NaN, Infinity)
- Division by zero (shouldn't happen, but handled)
- Invalid tax brackets (shouldn't happen, but handled)

**How handled:**
```typescript
if (!isFinite(totalIncome) || totalIncome < 0) {
  throw new Error('Total income must be a valid non-negative number');
}
```

**User sees:** Error toast notification (non-blocking)

### Validation Errors

**When they occur:**
- User enters invalid values (negative, too high, etc.)
- Required fields missing
- Invalid combinations (salary > profit)

**How handled:**
```typescript
export function sanitizeInputs(inputs: Partial<TaxCalculationInputs>): TaxCalculationInputs {
  return {
    businessProfit: Math.max(0, inputs.businessProfit || 0),
    otherIncome: Math.max(0, inputs.otherIncome || 0),
    // ... sanitize all fields
  };
}
```

**User sees:** Input validation (prevents invalid values)

### React Errors

**When they occur:**
- Component crashes
- Unhandled promise rejections
- Rendering errors

**How handled:** React Error Boundary

**User sees:** Error page with "Something went wrong" message

## Error Tracking

### Custom Error Tracking

**Location:** `apps/web/src/lib/errorTracking.ts`

**What it does:**
- Logs errors to console (development)
- Stores errors in localStorage (limited history)
- Can send to custom backend API (if configured)

**How to use:**
```typescript
import { logError } from '@/lib/errorTracking';

try {
  // Some code
} catch (error) {
  logError(error, {
    context: 'tax-calculation',
    userId: user?.id,
  });
}
```

**Configuration:**
```bash
# .env.local
VITE_ERROR_TRACKING_ENABLED=true
VITE_ERROR_TRACKING_ENDPOINT=/api/errors
```

**Why custom?** We wanted a self-hosted solution without external dependencies (like Sentry).

### Error Log Structure

```typescript
interface ErrorLog {
  id: string;
  timestamp: number;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userAgent?: string;
  url?: string;
}
```

**Stored in:** localStorage (limited to last 50 errors)

**Can send to:** Custom backend API endpoint (if configured)

## Error Display

### Toast Notifications

**Location:** `apps/web/src/hooks/useErrorToast.tsx`

**What it does:** Shows non-blocking error toasts

**How to use:**
```typescript
import { useErrorToast } from '@/hooks/useErrorToast';

function MyComponent() {
  const { showError } = useErrorToast();
  
  const handleError = () => {
    showError('Something went wrong', 'Please try again');
  };
}
```

**Features:**
- Auto-dismisses after 5 seconds
- Can be dismissed manually
- Non-blocking (doesn't prevent interaction)
- Stacks multiple errors

### Error Boundary

**Location:** `apps/web/src/components/ErrorBoundary.tsx`

**What it does:** Catches React errors and shows error page

**How to use:**
```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Features:**
- Catches unhandled errors
- Shows error page
- Logs error for tracking
- Allows app to continue (other parts unaffected)

## Common Errors

### "Total income must be a valid non-negative number"

**Cause:** Invalid input (NaN, Infinity, negative)

**Fix:** Validate inputs before calculation

```typescript
if (!isFinite(totalIncome) || totalIncome < 0) {
  // Handle error
}
```

### "Business profit must be a valid non-negative number"

**Cause:** Invalid business profit input

**Fix:** Sanitize inputs

```typescript
const sanitized = sanitizeInputs(inputs);
```

### "Salary cannot exceed 80% of profit"

**Cause:** Salary too high relative to profit

**Fix:** Validate salary

```typescript
if (annualSalary > businessProfit * 0.8) {
  throw new Error('Salary cannot exceed 80% of profit');
}
```

### React Error Boundary Triggered

**Cause:** Component crash (unhandled error)

**Fix:** Check error logs, fix the bug

**Temporary:** Refresh page (error boundary resets)

## Error Prevention

### Input Validation

**Always validate inputs:**

```typescript
function calculateTax(income: number) {
  if (!isFinite(income) || income < 0) {
    throw new Error('Invalid income');
  }
  // ... calculation
}
```

### Type Safety

**Use TypeScript:**

```typescript
function calculateTax(income: number): number {
  // TypeScript ensures income is number
  // Still validate at runtime (defense in depth)
}
```

### Default Values

**Provide defaults:**

```typescript
const inputs = sanitizeInputs(rawInputs);
// Ensures all fields have valid values
```

## Debugging Errors

### Check Console

**Development:** Errors logged to console

**Look for:**
- Error message
- Stack trace
- Context (what was happening)

### Check localStorage

**Error logs stored in:** `localStorage.getItem('errorLogs')`

**View:** Open browser console, run:
```javascript
JSON.parse(localStorage.getItem('errorLogs'))
```

### Check Network

**If sending to backend:** Check network tab for failed requests

**Look for:**
- Failed POST to `/api/errors`
- Error response
- Network errors

## Error Recovery

### User Actions

**What users can do:**
- Dismiss error toast (if non-critical)
- Refresh page (if error boundary triggered)
- Try again (if transient error)
- Report issue (if persistent)

### Automatic Recovery

**What happens automatically:**
- Input validation prevents invalid inputs
- Error boundary catches React errors
- Toast notifications auto-dismiss
- Error logs stored for debugging

## Production Error Handling

### Error Tracking Enabled

**In production:**
- Errors logged to console (for debugging)
- Errors stored in localStorage (limited history)
- Errors can be sent to backend (if configured)

### Error Tracking Disabled

**If disabled:**
- Errors still logged to console
- No localStorage storage
- No backend sending

**Why disable?** Privacy concerns, or if you have your own error tracking.

## Best Practices

### Do

- **Validate inputs** before calculations
- **Use TypeScript** for type safety
- **Handle errors gracefully** (show user-friendly messages)
- **Log errors** for debugging
- **Provide defaults** for optional fields

### Don't

- **Ignore errors** (they'll come back to bite you)
- **Show technical errors** to users (show friendly messages)
- **Let errors crash the app** (use error boundaries)
- **Log sensitive data** (passwords, API keys, etc.)

## Contributing

**Found an error handling issue?**
- Open an issue with:
  - Error message
  - Steps to reproduce
  - Expected behavior
  - Actual behavior

**Want to improve error handling?**
- Submit PR with:
  - Better error messages
  - Better error recovery
  - Better error tracking

---

**Questions?** Check the source code in `apps/web/src/lib/errorTracking.ts` and `apps/web/src/components/ErrorBoundary.tsx`.

