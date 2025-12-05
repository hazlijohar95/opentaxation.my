/**
 * Unit Tests for usePWAInstall Hook
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePWAInstall } from '../usePWAInstall';

describe('usePWAInstall', () => {
  const originalNavigator = { ...navigator };
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Mock userAgent
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
      writable: true,
    });

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalNavigator.userAgent,
      writable: true,
    });
    window.matchMedia = originalMatchMedia;
    localStorage.clear();
  });

  it('detects desktop as not mobile', () => {
    const { result } = renderHook(() => usePWAInstall());
    expect(result.current.isMobile).toBe(false);
  });

  it('detects iOS device', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      writable: true,
    });

    const { result } = renderHook(() => usePWAInstall());
    expect(result.current.isIOS).toBe(true);
  });

  it('detects Android device', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 11; Pixel 5)',
      writable: true,
    });

    const { result } = renderHook(() => usePWAInstall());
    expect(result.current.isAndroid).toBe(true);
  });

  it('handles dismiss correctly', () => {
    const { result } = renderHook(() => usePWAInstall());

    act(() => {
      result.current.dismiss();
    });

    expect(localStorage.getItem('pwa-install-dismissed')).toBe('true');
  });

  it('respects dismissed state', () => {
    localStorage.setItem('pwa-install-dismissed', 'true');

    const { result } = renderHook(() => usePWAInstall());

    expect(result.current.shouldShowPrompt).toBe(false);
  });

  it('handles beforeinstallprompt event', () => {
    const { result } = renderHook(() => usePWAInstall());

    const mockEvent = new Event('beforeinstallprompt');
    Object.defineProperty(mockEvent, 'prompt', { value: vi.fn() });
    Object.defineProperty(mockEvent, 'userChoice', {
      value: Promise.resolve({ outcome: 'accepted' }),
    });

    act(() => {
      window.dispatchEvent(mockEvent);
    });

    expect(result.current.isInstallable).toBe(true);
  });

  it('closes iOS instructions', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      writable: true,
    });
    Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });

    const { result } = renderHook(() => usePWAInstall());

    // Trigger iOS install flow
    act(() => {
      result.current.install();
    });

    expect(result.current.showIOSInstructions).toBe(true);

    act(() => {
      result.current.closeIOSInstructions();
    });

    expect(result.current.showIOSInstructions).toBe(false);
  });

  it('resets dismissal after 7 days', () => {
    // Set dismissed 10 days ago
    const tenDaysAgo = Date.now() - 10 * 24 * 60 * 60 * 1000;
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-dismissed-at', tenDaysAgo.toString());

    renderHook(() => usePWAInstall());

    // After 7 days, dismissal should be cleared
    expect(localStorage.getItem('pwa-install-dismissed')).toBeNull();
  });

  it('keeps dismissal within 7 days', () => {
    // Set dismissed 3 days ago
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-dismissed-at', threeDaysAgo.toString());

    renderHook(() => usePWAInstall());

    // Within 7 days, dismissal should remain
    expect(localStorage.getItem('pwa-install-dismissed')).toBe('true');
  });
});
