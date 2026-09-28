import { getSupabaseClient } from './supabase/client';
import { AppError, toAppError } from '@/lib/errors';
import type { Database } from '@/types/database.types';

export type PropertyRow = Database['public']['Tables']['properties']['Row'];
export type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
export type PropertyUpdate = Database['public']['Tables']['properties']['Update'];

/**
 * Properties service — Phase 6 MVP (corrected).
 *
 * Security contract:
 *  - All Supabase calls stay here.
 *  - `created_by` is set from the authenticated session, NEVER from input.
 *  - Verification / trust fields are NEVER written from this layer.
 *  - RLS is the sole authority for update/delete.
 */

/** Fields the MVP form is allowed to submit. */
export type PropertyFormInput = {
  title: string;
  description?: string | null;
  category_id: string;
  province_id: string;
  city_id: string;
  district_id?: string | null;
  neighborhood_id?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  land_area?: number | null;
  building_area?: number | null;
  year_built?: number | null;
};

function emptyToNull(v: string | undefined | null): string | null {
  if (v == null) return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

async function requireUserId(): Promise<string> {
  const sb = getSupabaseClient();
  const { data, error } = await sb.auth.getUser();

  if (error) throw toAppError(error);

  if (!data.user) {
    throw new AppError(
      'UNAUTHORIZED',
      'برای این عملیات باید وارد حساب شوید.'
    );
  }

  return data.user.id;
}

export async function listOwnProperties(): Promise<PropertyRow[]> {
  try {
    const userId = await requireUserId();
    const sb = getSupabaseClient();

    const { data, error } = await sb
      .from('properties')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data ?? []) as PropertyRow[];
  } catch (e) {
    throw toAppError(e);
  }
}

export async function getPropertyById(
  id: string
): Promise<PropertyRow | null> {
  try {
    const sb = getSupabaseClient();

    const { data, error } = await sb
      .from('properties')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    return (data as PropertyRow | null) ?? null;
  } catch (e) {
    throw toAppError(e);
  }
}

export async function createProperty(
  input: PropertyFormInput
): Promise<PropertyRow> {
  try {
    const userId = await requireUserId();
    const sb = getSupabaseClient();

    // SECURITY: created_by is set HERE, from the authenticated session.
    const payload: PropertyInsert = {
      title: input.title.trim(),
      description: emptyToNull(input.description),
      category_id: input.category_id,
      province_id: input.province_id,
      city_id: input.city_id,
      district_id: emptyToNull(input.district_id),
      neighborhood_id: emptyToNull(input.neighborhood_id),
      address: emptyToNull(input.address),
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      land_area: input.land_area ?? null,
      building_area: input.building_area ?? null,
      year_built: input.year_built ?? null,
      created_by: userId,
    };

    const { data, error } = await sb
      .from('properties')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;

    return data as PropertyRow;
  } catch (e) {
    throw toAppError(e);
  }
}

export async function updateProperty(
  id: string,
  input: PropertyFormInput
): Promise<PropertyRow> {
  try {
    const sb = getSupabaseClient();

    // SECURITY: created_by and verification fields are NEVER included here.
    const payload: PropertyUpdate = {
      title: input.title.trim(),
      description: emptyToNull(input.description),
      category_id: input.category_id,
      province_id: input.province_id,
      city_id: input.city_id,
      district_id: emptyToNull(input.district_id),
      neighborhood_id: emptyToNull(input.neighborhood_id),
      address: emptyToNull(input.address),
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      land_area: input.land_area ?? null,
      building_area: input.building_area ?? null,
      year_built: input.year_built ?? null,
    };

    const { data, error } = await sb
      .from('properties')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    return data as PropertyRow;
  } catch (e) {
    throw toAppError(e);
  }
}

/**
 * Deletion is admin/super_admin only per Phase 5 RLS.
 *
 * This function is exported for future admin flows. Phase 6 UI does NOT
 * expose it to normal users, and RLS rejects any attempt by a normal user
 * at the database level regardless of what the client sends.
 */
export async function deleteProperty(id: string): Promise<void> {
  try {
    const sb = getSupabaseClient();

    const { error } = await sb
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (e) {
    throw toAppError(e);
  }
}