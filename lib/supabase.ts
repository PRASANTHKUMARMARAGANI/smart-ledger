/**
 * SmartLedger Supabase Client Integration Module
 * Handles PostgreSQL document persistence, real-time sync, and offline fallback.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'ey...demo_anon_key';

export const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-supabase-project.supabase.co'
  );
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
