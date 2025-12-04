/**
 * Analytics tracking utilities
 * Supports multiple analytics providers
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
}

/**
 * Track a page view
 */
export function trackPageView(path: string) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag && import.meta.env.VITE_GA_MEASUREMENT_ID) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }

  // Plausible Analytics
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible('pageview');
  }
}

/**
 * Track a custom event
 */
export function trackEvent(event: AnalyticsEvent) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.name, event.properties);
  }

  // Plausible Analytics
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(event.name, {
      props: event.properties,
    });
  }
}

/**
 * Initialize analytics
 */
export function initAnalytics() {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;

  if (!gaId && !plausibleDomain) {
    return; // No analytics configured
  }

  // Google Analytics 4
  if (gaId) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    if (!window.dataLayer) {
      window.dataLayer = [];
    }
    const gtag = (...args: unknown[]) => {
      if (window.dataLayer) {
        window.dataLayer.push(args);
      }
    };
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', gaId, {
      anonymize_ip: true,
      respect_dnt: true,
    });
  }

  // Plausible Analytics
  if (plausibleDomain) {
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-domain', plausibleDomain);
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }
}

// Extend Window interface
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}
