import { getSupabaseClient } from './supabase/client';
import { toAppError } from '@/lib/errors';
import type { Database } from '@/types/database.types';

export type Province =
  Database['public']['Tables']['provinces']['Row'];

export type City =
  Database['public']['Tables']['cities']['Row'];

export type District =
  Database['public']['Tables']['districts']['Row'];

export type Neighborhood =
  Database['public']['Tables']['neighborhoods']['Row'];

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

export async function listActiveDistricts(
  cityId: string
): Promise<District[]> {
  try {
    const sb = getSupabaseClient();

    const { data, error } = await sb
      .from('districts')
      .select('*')
      .eq('city_id', cityId)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;

    return (data ?? []) as District[];
  } catch (error) {
    throw toAppError(error);
  }
}

export async function listActiveNeighborhoods(
  districtId: string
): Promise<Neighborhood[]> {
  try {
    const sb = getSupabaseClient();

    const { data, error } = await sb
      .from('neighborhoods')
      .select('*')
      .eq('district_id', districtId)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;

    return (data ?? []) as Neighborhood[];
  } catch (error) {
    throw toAppError(error);
  }
}