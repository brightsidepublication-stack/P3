import { getSupabaseClient } from './supabase/client';
import { toAppError } from '@/lib/errors';
import type { Database } from '@/types/database.types';

export type Province =
  Database['public']['Tables']['provinces']['Row'];

export type City =
  Database['public']['Tables']['cities']['Row'];

export async function listActiveProvinces(): Promise<Province[]> {
  try {
    const sb = getSupabaseClient();

    const { data, error } = await sb
      .from('provinces')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;

    return (data ?? []) as Province[];
  } catch (error) {
    throw toAppError(error);
  }
}

export async function listActiveCities(
  provinceId: string
): Promise<City[]> {
  try {
    const sb = getSupabaseClient();

    const { data, error } = await sb
      .from('cities')
      .select('*')
      .eq('province_id', provinceId)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;

    return (data ?? []) as City[];
  } catch (error) {
    throw toAppError(error);
  }
}