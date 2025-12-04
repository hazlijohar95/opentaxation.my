import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if a media query matches
 * Used for responsive layout branching between mobile and desktop
 *
 * @param query - CSS media query string (e.g., '(max-width: 1023px)')
 * @returns boolean indicating if the query matches
 */
function useMediaQuery(query: string): boolean {
  // Initialize with null to avoid hydration mismatch
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event handler
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers support addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

/**
 * Convenience hook for mobile detection
 * Returns true when viewport is less than 1024px (lg breakpoint)
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 1023px)');
}
