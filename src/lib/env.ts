import { z } from 'zod';

const configuredSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// Accept either the Supabase project URL or the REST endpoint accidentally
// entered in Cloudflare Pages, and normalize it for createClient().
const normalizedSupabaseUrl =
  typeof configuredSupabaseUrl === 'string'
    ? configuredSupabaseUrl.replace(/\/rest\/v1\/?$/, '')
    : configuredSupabaseUrl;

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
});

const parsed = envSchema.safeParse({
  VITE_SUPABASE_URL: normalizedSupabaseUrl,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

if (!parsed.success) {
  throw new Error('Invalid environment configuration.');
}

export const env = parsed.data;
