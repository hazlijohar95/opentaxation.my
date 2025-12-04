/**
 * Simple error tracking system
 * Logs errors to console and optionally sends to a custom endpoint
 * Includes rate limiting to prevent spam
 * No external dependencies required
 */

import { checkRateLimit, RATE_LIMITS } from './rateLimiter';

interface ErrorLog {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  userId?: string;
  errorType: string;
  componentStack?: string;
}

/**
 * Log error to console and optionally send to backend
 * Rate limited to prevent spam (10 errors per minute)
 */
export function logError(
  error: Error,
  errorInfo?: {
    componentStack?: string;
    userId?: string;
  }
) {
  // Rate limit error reporting to prevent spam
  if (!checkRateLimit('error-report', RATE_LIMITS.ERROR_REPORT)) {
    console.warn('Error rate limit exceeded, not reporting additional errors');
    return;
  }

  const errorLog: ErrorLog = {
    message: error.message,
    stack: error.stack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    userId: errorInfo?.userId,
    errorType: error.name || 'Error',
    componentStack: errorInfo?.componentStack,
  };

  // Always log to console for development
  console.error('Error occurred:', errorLog);

  // In production, you can send to your own API endpoint
  if (import.meta.env.MODE === 'production' && import.meta.env.VITE_ERROR_TRACKING_ENABLED === 'true') {
    sendErrorToBackend(errorLog).catch((err) => {
      console.error('Failed to send error to backend:', err);
    });
  }

  // Store in localStorage for debugging (last 10 errors)
  storeErrorLocally(errorLog);
}

/**
 * Send error to your own backend API
 * Replace this with your actual API endpoint
 */
async function sendErrorToBackend(errorLog: ErrorLog): Promise<void> {
  const endpoint = import.meta.env.VITE_ERROR_TRACKING_ENDPOINT || '/api/errors';
  
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorLog),
    });
  } catch (err) {
    // Silently fail - don't break the app if error tracking fails
    console.warn('Error tracking failed:', err);
  }
}

/**
 * Store errors locally for debugging
 */
function storeErrorLocally(errorLog: ErrorLog): void {
  try {
    const stored = localStorage.getItem('app_errors');
    const errors: ErrorLog[] = stored ? JSON.parse(stored) : [];
    
    // Keep only last 10 errors
    errors.unshift(errorLog);
    if (errors.length > 10) {
      errors.pop();
    }
    
    localStorage.setItem('app_errors', JSON.stringify(errors));
  } catch (err) {
    // Ignore localStorage errors
  }
}

/**
 * Get stored errors (for debugging/admin panel)
 */
export function getStoredErrors(): ErrorLog[] {
  try {
    const stored = localStorage.getItem('app_errors');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear stored errors
 */
export function clearStoredErrors(): void {
  localStorage.removeItem('app_errors');
}

/**
 * Track unhandled errors globally
 */
export function initErrorTracking() {
  // Track unhandled errors
  window.addEventListener('error', (event) => {
    logError(new Error(event.message), {
      componentStack: event.filename ? `${event.filename}:${event.lineno}` : undefined,
    });
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    logError(error);
  });
}

