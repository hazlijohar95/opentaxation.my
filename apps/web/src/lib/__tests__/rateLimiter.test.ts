/**
 * Unit Tests for Rate Limiter
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  checkRateLimit,
  getRemainingRequests,
  getResetTime,
  resetRateLimit,
  clearAllRateLimits,
  RATE_LIMITS,
} from '../rateLimiter';

describe('checkRateLimit', () => {
  beforeEach(() => {
    clearAllRateLimits();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    clearAllRateLimits();
  });

  it('allows requests within limit', () => {
    const config = { maxRequests: 3, windowMs: 60000 };

    expect(checkRateLimit('test-action', config)).toBe(true);
    expect(checkRateLimit('test-action', config)).toBe(true);
    expect(checkRateLimit('test-action', config)).toBe(true);
  });

  it('blocks requests exceeding limit', () => {
    const config = { maxRequests: 3, windowMs: 60000 };

    expect(checkRateLimit('test-action', config)).toBe(true);
    expect(checkRateLimit('test-action', config)).toBe(true);
    expect(checkRateLimit('test-action', config)).toBe(true);
    expect(checkRateLimit('test-action', config)).toBe(false);
    expect(checkRateLimit('test-action', config)).toBe(false);
  });

  it('resets after window expires', () => {
    const config = { maxRequests: 2, windowMs: 60000 };

    expect(checkRateLimit('test-action', config)).toBe(true);
    expect(checkRateLimit('test-action', config)).toBe(true);
    expect(checkRateLimit('test-action', config)).toBe(false);

    // Advance time past the window
    vi.advanceTimersByTime(60001);

    expect(checkRateLimit('test-action', config)).toBe(true);
  });

  it('uses separate limits for different actions', () => {
    const config = { maxRequests: 2, windowMs: 60000 };

    expect(checkRateLimit('action-a', config)).toBe(true);
    expect(checkRateLimit('action-a', config)).toBe(true);
    expect(checkRateLimit('action-a', config)).toBe(false);

    // Different action should not be affected
    expect(checkRateLimit('action-b', config)).toBe(true);
    expect(checkRateLimit('action-b', config)).toBe(true);
  });

  it('uses default config when not provided', () => {
    // Default is 10 requests per minute
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit('default-action')).toBe(true);
    }
    expect(checkRateLimit('default-action')).toBe(false);
  });
});

describe('getRemainingRequests', () => {
  beforeEach(() => {
    clearAllRateLimits();
  });

  afterEach(() => {
    clearAllRateLimits();
  });

  it('returns full limit when no requests made', () => {
    const config = { maxRequests: 5, windowMs: 60000 };
    expect(getRemainingRequests('new-action', config)).toBe(5);
  });

  it('decreases as requests are made', () => {
    const config = { maxRequests: 5, windowMs: 60000 };

    checkRateLimit('test-action', config);
    expect(getRemainingRequests('test-action', config)).toBe(4);

    checkRateLimit('test-action', config);
    expect(getRemainingRequests('test-action', config)).toBe(3);
  });

  it('returns 0 when limit reached', () => {
    const config = { maxRequests: 2, windowMs: 60000 };

    checkRateLimit('test-action', config);
    checkRateLimit('test-action', config);
    expect(getRemainingRequests('test-action', config)).toBe(0);
  });
});

describe('getResetTime', () => {
  beforeEach(() => {
    clearAllRateLimits();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    clearAllRateLimits();
  });

  it('returns 0 when not rate limited', () => {
    const config = { maxRequests: 5, windowMs: 60000 };
    expect(getResetTime('test-action', config)).toBe(0);
  });

  it('returns time until reset when rate limited', () => {
    const config = { maxRequests: 2, windowMs: 60000 };

    checkRateLimit('test-action', config);
    checkRateLimit('test-action', config);

    // Now rate limited, should return time until oldest expires
    const resetTime = getResetTime('test-action', config);
    expect(resetTime).toBeGreaterThan(0);
    expect(resetTime).toBeLessThanOrEqual(60000);
  });

  it('decreases as time passes', () => {
    const config = { maxRequests: 2, windowMs: 60000 };

    checkRateLimit('test-action', config);
    checkRateLimit('test-action', config);

    const initialReset = getResetTime('test-action', config);

    vi.advanceTimersByTime(10000);

    const laterReset = getResetTime('test-action', config);
    expect(laterReset).toBeLessThan(initialReset);
  });
});

describe('resetRateLimit', () => {
  beforeEach(() => {
    clearAllRateLimits();
  });

  afterEach(() => {
    clearAllRateLimits();
  });

  it('clears rate limit for specific action', () => {
    const config = { maxRequests: 2, windowMs: 60000 };

    checkRateLimit('test-action', config);
    checkRateLimit('test-action', config);
    expect(checkRateLimit('test-action', config)).toBe(false);

    resetRateLimit('test-action');

    expect(checkRateLimit('test-action', config)).toBe(true);
  });

  it('does not affect other actions', () => {
    const config = { maxRequests: 2, windowMs: 60000 };

    checkRateLimit('action-a', config);
    checkRateLimit('action-a', config);
    checkRateLimit('action-b', config);
    checkRateLimit('action-b', config);

    resetRateLimit('action-a');

    expect(checkRateLimit('action-a', config)).toBe(true);
    expect(checkRateLimit('action-b', config)).toBe(false);
  });
});

describe('RATE_LIMITS', () => {
  it('has predefined configurations', () => {
    expect(RATE_LIMITS.SAVE_CALCULATION).toEqual({ maxRequests: 10, windowMs: 60000 });
    expect(RATE_LIMITS.ERROR_REPORT).toEqual({ maxRequests: 10, windowMs: 60000 });
    expect(RATE_LIMITS.SHARE_LINK).toEqual({ maxRequests: 20, windowMs: 60000 });
    expect(RATE_LIMITS.PDF_EXPORT).toEqual({ maxRequests: 5, windowMs: 60000 });
  });
});
