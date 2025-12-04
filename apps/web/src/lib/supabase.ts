import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Log warning once for missing config (not on every import)
let hasLoggedWarning = false;
if (!isSupabaseConfigured && !hasLoggedWarning) {
  hasLoggedWarning = true;
  console.warn(
    'Supabase credentials not configured. Auth and dashboard features will be disabled.',
  );
}

// Create Supabase client only if configured, otherwise create a null-safe stub
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(
      supabaseUrl!,
      supabaseAnonKey!,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      },
    )
  : null;
