/**
 * Client-side rate limiter to prevent API abuse
 * Implements a sliding window rate limiting algorithm
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60000, // 1 minute
};

// Store timestamps of requests per action
const rateLimits = new Map<string, number[]>();

/**
 * Check if an action is rate limited
 * @param action - Unique identifier for the action (e.g., 'save-calculation', 'error-report')
 * @param config - Optional rate limit configuration
 * @returns true if action is allowed, false if rate limited
 */
export function checkRateLimit(
  action: string,
  config: Partial<RateLimitConfig> = {}
): boolean {
  const { maxRequests, windowMs } = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const timestamps = rateLimits.get(action) || [];

  // Filter to only recent timestamps within the window
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= maxRequests) {
    // Update the map with filtered timestamps (cleanup old ones)
    rateLimits.set(action, recent);
    return false; // Rate limited
  }

  // Add current timestamp and update map
  recent.push(now);
  rateLimits.set(action, recent);
  return true;
}

/**
 * Get remaining requests for an action
 * @param action - Unique identifier for the action
 * @param config - Optional rate limit configuration
 * @returns Number of remaining requests allowed
 */
export function getRemainingRequests(
  action: string,
  config: Partial<RateLimitConfig> = {}
): number {
  const { maxRequests, windowMs } = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const timestamps = rateLimits.get(action) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  return Math.max(0, maxRequests - recent.length);
}

/**
 * Get time until rate limit resets (in ms)
 * @param action - Unique identifier for the action
 * @param config - Optional rate limit configuration
 * @returns Milliseconds until oldest request expires, or 0 if not rate limited
 */
export function getResetTime(
  action: string,
  config: Partial<RateLimitConfig> = {}
): number {
  const { maxRequests, windowMs } = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const timestamps = rateLimits.get(action) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length < maxRequests) {
    return 0; // Not rate limited
  }

  // Find the oldest timestamp and calculate when it expires
  const oldest = Math.min(...recent);
  return Math.max(0, windowMs - (now - oldest));
}

/**
 * Reset rate limit for an action (useful for testing or manual reset)
 * @param action - Unique identifier for the action
 */
export function resetRateLimit(action: string): void {
  rateLimits.delete(action);
}

/**
 * Clear all rate limits (useful for testing)
 */
export function clearAllRateLimits(): void {
  rateLimits.clear();
}

// Predefined rate limit configurations for common actions
export const RATE_LIMITS = {
  SAVE_CALCULATION: { maxRequests: 10, windowMs: 60000 }, // 10 per minute
  ERROR_REPORT: { maxRequests: 10, windowMs: 60000 }, // 10 per minute
  SHARE_LINK: { maxRequests: 20, windowMs: 60000 }, // 20 per minute
  PDF_EXPORT: { maxRequests: 5, windowMs: 60000 }, // 5 per minute (heavy operation)
} as const;
