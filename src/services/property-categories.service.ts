import { getSupabaseClient } from './supabase/client';
import { toAppError } from '@/lib/errors';
import type { Database } from '@/types/database.types';

export type PropertyCategory =
  Database['public']['Tables']['property_categories']['Row'];

export async function listActivePropertyCategories(): Promise<
  PropertyCategory[]
> {
  try {
    const sb = getSupabaseClient();

    const { data, error } = await sb
      .from('property_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;

    return (data ?? []) as PropertyCategory[];
  } catch (error) {
    throw toAppError(error);
  }
}