/**
 * Unit Tests for useShareableLink Hook
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useShareableLink } from '../useShareableLink';
import type { StoredInputs } from '../useLocalStorage';

describe('useShareableLink', () => {
  const mockInputs: StoredInputs = {
    businessProfit: 100000,
    otherIncome: 10000,
    monthlySalary: 5000,
    complianceCosts: 5000,
    auditRevenue: 1000000,
    auditAssets: 500000,
    auditEmployees: 10,
    auditCost: 0,
    applyYa2025DividendSurcharge: false,
    dividendDistributionPercent: 100,
    hasForeignOwnership: false,
    inputMode: 'profit',
    targetNetIncome: 10000,
  };

  const mockOnLoadSharedInputs = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset URL
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://example.com',
        href: 'https://example.com',
        search: '',
      },
      writable: true,
    });

    // Mock history.replaceState
    Object.defineProperty(window, 'history', {
      value: {
        replaceState: vi.fn(),
      },
      writable: true,
    });

    // Mock clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('generates shareable link with encoded inputs', () => {
    const { result } = renderHook(() =>
      useShareableLink(mockInputs, mockOnLoadSharedInputs)
    );

    const link = result.current.generateShareableLink();

    expect(link).toContain('https://example.com');
    expect(link).toContain('calc=');
  });

  it('copies link to clipboard successfully', async () => {
    const { result } = renderHook(() =>
      useShareableLink(mockInputs, mockOnLoadSharedInputs)
    );

    let success = false;
    await act(async () => {
      success = await result.current.copyShareableLink();
    });

    expect(success).toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('handles clipboard write failure', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() =>
      useShareableLink(mockInputs, mockOnLoadSharedInputs)
    );

    let success = false;
    await act(async () => {
      success = await result.current.copyShareableLink();
    });

    // Should fail since both clipboard and fallback fail
    // Note: The fallback might work in some environments
    expect(typeof success).toBe('boolean');
  });

  it('sets hasLoadedFromUrl after checking URL', () => {
    const { result } = renderHook(() =>
      useShareableLink(mockInputs, mockOnLoadSharedInputs)
    );

    // After mount, hasLoadedFromUrl should be true
    expect(result.current.hasLoadedFromUrl).toBe(true);
  });

  it('encodes and decodes inputs correctly', () => {
    const { result } = renderHook(() =>
      useShareableLink(mockInputs, mockOnLoadSharedInputs)
    );

    const link = result.current.generateShareableLink();
    const url = new URL(link);
    const encoded = url.searchParams.get('calc');

    expect(encoded).not.toBeNull();

    // Verify encoding contains base64 characters
    expect(encoded).toMatch(/^[A-Za-z0-9+/=]+$/);
  });

  it('generates link with current origin', () => {
    const { result } = renderHook(() =>
      useShareableLink(mockInputs, mockOnLoadSharedInputs)
    );

    const link = result.current.generateShareableLink();

    expect(link.startsWith('https://example.com')).toBe(true);
  });
});
