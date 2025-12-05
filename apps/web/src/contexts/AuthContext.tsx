/* eslint-disable react-refresh/only-export-components -- Provider and hook exported together by design */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  isBlogAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlogAdmin, setIsBlogAdmin] = useState(false);

  // Check if user is a blog admin (exists in blog_authors table)
  // Note: User-to-author linking is handled by SQL trigger (link_user_to_author)
  const checkBlogAdmin = async (userId: string | undefined, email: string | undefined) => {
    if (!supabase || (!userId && !email)) {
      setIsBlogAdmin(false);
      return;
    }

    try {
      // Check by user_id first, then by email as fallback
      let query = supabase
        .from('blog_authors')
        .select('id, user_id')
        .eq('is_active', true);

      if (userId && email) {
        query = query.or(`user_id.eq.${userId},email.eq.${email}`);
      } else if (userId) {
        query = query.eq('user_id', userId);
      } else if (email) {
        query = query.eq('email', email);
      }

      const { data, error } = await query.single();

      if (error && error.code !== 'PGRST116') {
        // Log real errors, not "not found"
        console.error('[AuthContext] Error checking blog admin:', error);
      }

      setIsBlogAdmin(!!data);
    } catch (err) {
      console.error('[AuthContext] Unexpected error checking blog admin:', err);
      setIsBlogAdmin(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkBlogAdmin(session?.user?.id, session?.user?.email);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkBlogAdmin(session?.user?.id, session?.user?.email);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase not configured');
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured || !supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured: isSupabaseConfigured,
        isBlogAdmin,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
