import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  showIOSInstructions: boolean;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [state, setState] = useState<PWAInstallState>({
    isInstallable: false,
    isInstalled: false,
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    showIOSInstructions: false,
  });
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('pwa-install-dismissed') === 'true';
  });

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMobile = isIOS || isAndroid || window.innerWidth < 768;

    // Check if already installed (standalone mode)
    const isInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    setState(prev => ({
      ...prev,
      isIOS,
      isAndroid,
      isMobile,
      isInstalled,
      // iOS doesn't support beforeinstallprompt, but we can still show instructions
      isInstallable: isIOS && !isInstalled,
    }));

    // Listen for the beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState(prev => ({ ...prev, isInstallable: true }));
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setState(prev => ({ ...prev, isInstalled: true, isInstallable: false }));
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (state.isIOS) {
      // For iOS, show instructions modal
      setState(prev => ({ ...prev, showIOSInstructions: true }));
      return false;
    }

    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [deferredPrompt, state.isIOS]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
    setState(prev => ({ ...prev, showIOSInstructions: false }));
  }, []);

  const closeIOSInstructions = useCallback(() => {
    setState(prev => ({ ...prev, showIOSInstructions: false }));
  }, []);

  // Reset dismissal after 7 days
  useEffect(() => {
    const dismissedAt = localStorage.getItem('pwa-install-dismissed-at');
    if (dismissedAt) {
      const timestamp = parseInt(dismissedAt, 10);
      // Validate parseInt result before using
      if (!isNaN(timestamp)) {
        const daysSinceDismissed = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissed > 7) {
          localStorage.removeItem('pwa-install-dismissed');
          localStorage.removeItem('pwa-install-dismissed-at');
          setDismissed(false);
        }
      }
    }
  }, []);

  const shouldShowPrompt =
    state.isMobile &&
    state.isInstallable &&
    !state.isInstalled &&
    !dismissed;

  return {
    ...state,
    shouldShowPrompt,
    install,
    dismiss,
    closeIOSInstructions,
  };
}
