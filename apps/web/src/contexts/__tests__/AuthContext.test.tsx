/**
 * Unit Tests for AuthContext
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

// Use vi.hoisted to define mocks that will be available during vi.mock hoisting
const { mockSession, mockSubscription, mockGetSession, mockOnAuthStateChange, mockSignInWithOAuth, mockSignOut, mockFrom } = vi.hoisted(() => {
  const mockSession = {
    user: { id: 'test-user-id', email: 'test@example.com' },
    access_token: 'mock-token',
  };

  const mockSubscription = {
    unsubscribe: vi.fn(),
  };

  const mockGetSession = vi.fn(() => Promise.resolve({ data: { session: mockSession } }));
  const mockOnAuthStateChange = vi.fn(() => ({ data: { subscription: mockSubscription } }));
  const mockSignInWithOAuth = vi.fn(() => Promise.resolve({ error: null }));
  const mockSignOut = vi.fn(() => Promise.resolve({ error: null }));
  const mockFrom = vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        or: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: null,
            error: { code: 'PGRST116' },
          })),
        })),
        single: vi.fn(() => Promise.resolve({
          data: null,
          error: { code: 'PGRST116' },
        })),
      })),
    })),
  }));

  return { mockSession, mockSubscription, mockGetSession, mockOnAuthStateChange, mockSignInWithOAuth, mockSignOut, mockFrom };
});

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      signInWithOAuth: mockSignInWithOAuth,
      signOut: mockSignOut,
    },
    from: mockFrom,
  },
  isSupabaseConfigured: true,
}));

import { AuthProvider, useAuth } from '../AuthContext';

// Test component that uses the auth context
function TestConsumer() {
  const { user, isLoading, isConfigured, isBlogAdmin, signInWithGoogle, signOut } = useAuth();

  return (
    <div>
      <span data-testid="loading">{isLoading.toString()}</span>
      <span data-testid="configured">{isConfigured.toString()}</span>
      <span data-testid="user">{user?.email || 'null'}</span>
      <span data-testid="admin">{isBlogAdmin.toString()}</span>
      <button onClick={signInWithGoogle}>Sign In</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('provides isConfigured as true when Supabase is configured', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('configured')).toHaveTextContent('true');
    });
  });

  it('provides user from session', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
  });

  it('throws error when useAuth is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });

  it('calls getSession on mount', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalled();
    });
  });

  it('subscribes to auth state changes', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockOnAuthStateChange).toHaveBeenCalled();
    });
  });

  it('unsubscribes on unmount', async () => {
    const { unmount } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockOnAuthStateChange).toHaveBeenCalled();
    });

    unmount();

    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('provides signInWithGoogle function', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    screen.getByText('Sign In').click();

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: expect.any(Object),
      });
    });
  });

  it('provides signOut function', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    screen.getByText('Sign Out').click();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
