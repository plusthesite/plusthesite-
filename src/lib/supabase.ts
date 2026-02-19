import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const isConfigured = supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 0;

// Client-side Supabase client (for use in React components)
export const supabase: SupabaseClient<Database> | null = isConfigured
  ? createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side Supabase client (for use in API routes / server components)
export const createServerSupabaseClient = (): SupabaseClient<Database> | null => {
  if (!isConfigured) return null;

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
};
