import { createClient } from '@supabase/supabase-js';

import { env } from '@/lib/env';

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  },
);

export function getSupabaseClient() {
  return supabase;
}

export { supabase };
