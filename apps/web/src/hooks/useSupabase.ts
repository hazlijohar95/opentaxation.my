import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to get the Supabase client and auth state.
 * Uses native Supabase Auth (with Google OAuth).
 */
export function useSupabase() {
  const { user, isLoading } = useAuth();

  return {
    supabase: isSupabaseConfigured ? supabase : null,
    isConfigured: isSupabaseConfigured,
    isAuthenticated: Boolean(user),
    isLoading,
  };
}
