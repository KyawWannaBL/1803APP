import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

const hasConfig = Boolean(env.supabaseUrl && env.supabaseAnonKey);

export const supabase: SupabaseClient | null = hasConfig
  ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

export const isSupabaseConfigured = hasConfig;