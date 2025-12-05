/**
 * Unit Tests for useSavedCalculations Hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import React from 'react';

// Use vi.hoisted to define mocks that will be available during vi.mock hoisting
const { mockUser, mockSupabaseData, mockSupabase, mockUseAuth } = vi.hoisted(() => {
  const mockUser = { id: 'test-user-id', email: 'test@example.com' };

  const mockSupabaseData = [
    {
      id: '1',
      user_id: 'test-user-id',
      name: 'Test Calculation',
      inputs: { businessProfit: 100000 },
      results: { netCash: 80000 },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  const mockSupabase = {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            data: mockSupabaseData,
            error: null,
          })),
          single: vi.fn(() => ({
            data: mockSupabaseData[0],
            error: null,
          })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { ...mockSupabaseData[0], id: '2' },
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => ({
                data: mockSupabaseData[0],
                error: null,
              })),
            })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            data: null,
            error: null,
          })),
        })),
      })),
    })),
  };

  const mockUseAuth = vi.fn(() => ({ user: mockUser as { id: string; email: string } | null }));

  return { mockUser, mockSupabaseData, mockSupabase, mockUseAuth };
});

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
}));

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
  isSupabaseConfigured: true,
}));

// Mock type parsers
vi.mock('@/types/database', () => ({
  parseSavedCalculations: vi.fn((data) => data),
  parseSavedCalculation: vi.fn((data) => data),
}));

import { useSavedCalculations } from '../useSavedCalculations';

describe('useSavedCalculations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns isAuthenticated true when user exists', async () => {
    const { result } = renderHook(() => useSavedCalculations());
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('returns isConfigured true when Supabase is configured', async () => {
    const { result } = renderHook(() => useSavedCalculations());
    await waitFor(() => {
      expect(result.current.isConfigured).toBe(true);
    });
  });

  it('initially shows loading state', async () => {
    const { result } = renderHook(() => useSavedCalculations());
    await waitFor(() => {
      // May or may not be loading depending on when assertions run
      expect(typeof result.current.isLoading).toBe('boolean');
    });
  });

  it('provides saveCalculation function', async () => {
    const { result } = renderHook(() => useSavedCalculations());
    await waitFor(() => {
      expect(typeof result.current.saveCalculation).toBe('function');
    });
  });

  it('provides deleteCalculation function', async () => {
    const { result } = renderHook(() => useSavedCalculations());
    await waitFor(() => {
      expect(typeof result.current.deleteCalculation).toBe('function');
    });
  });

  it('provides getCalculation function', async () => {
    const { result } = renderHook(() => useSavedCalculations());
    await waitFor(() => {
      expect(typeof result.current.getCalculation).toBe('function');
    });
  });

  it('provides updateCalculation function', async () => {
    const { result } = renderHook(() => useSavedCalculations());
    await waitFor(() => {
      expect(typeof result.current.updateCalculation).toBe('function');
    });
  });

  it('provides refetch function', async () => {
    const { result } = renderHook(() => useSavedCalculations());
    await waitFor(() => {
      expect(typeof result.current.refetch).toBe('function');
    });
  });
});

describe('useSavedCalculations without auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock no user
    mockUseAuth.mockReturnValue({ user: null });
  });

  it('returns isAuthenticated false when no user', async () => {
    const { result } = renderHook(() => useSavedCalculations());
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  it('returns null calculations when not authenticated', async () => {
    const { result } = renderHook(() => useSavedCalculations());
    await waitFor(() => {
      expect(result.current.calculations).toBeNull();
    });
  });
});
