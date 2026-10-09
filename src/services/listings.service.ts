
import { getSupabaseClient } from './supabase/client';
import { AppError, toAppError } from '@/lib/errors';
import type { Database } from '@/types/database.types';

export type ListingRow =
  Database['public']['Tables']['listings']['Row'];

export type ListingInsert =
  Database['public']['Tables']['listings']['Insert'];

export type ListingUpdate =
  Database['public']['Tables']['listings']['Update'];

export type ListingFormInput = {
  property_id: string;
  title: string;
  description?: string | null;
  advertiser_type: Database['public']['Enums']['advertiser_type'];
  transaction_type: Database['public']['Enums']['transaction_type'];
  listing_kind?: Database['public']['Enums']['listing_kind'];
  advertiser_user_id?: string | null;
};

async function requireUserId(): Promise<string> {
  const sb = getSupabaseClient();
  const { data, error } = await sb.auth.getUser();

  if (error) {
    throw toAppError(error);
  }

  if (!data.user) {
    throw new AppError(
      'AUTH',
      'برای این عملیات باید وارد حساب شوید.',
    );
  }

  return data.user.id;
}

function emptyToNull(
  value: string | undefined | null,
): string | null {
  if (value == null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/** دریافت آگهی‌های ایجادشده توسط کاربر فعلی. */
export async function listOwnListings(): Promise<ListingRow[]> {
  try {
    const userId = await requireUserId();
    const sb = getSupabaseClient();

    const { data, error } = await sb
      .from('listings')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as ListingRow[];
  } catch (error) {
    throw toAppError(error);
  }
}

/** دریافت یک آگهی با شناسه. */
export async function getListingById(
  id: string,
): Promise<ListingRow | null> {
  try {
    const sb = getSupabaseClient();

    const { data, error } = await sb
      .from('listings')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as ListingRow | null) ?? null;
  } catch (error) {
    throw toAppError(error);
  }
}

/** ایجاد آگهی جدید با وضعیت draft. */
export async function createListing(
  input: ListingFormInput,
): Promise<ListingRow> {
  try {
    const userId = await requireUserId();
    const sb = getSupabaseClient();

    const payload: ListingInsert = {
      property_id: input.property_id,
      title: input.title.trim(),
      description: emptyToNull(input.description),
      advertiser_type: input.advertiser_type,

      // سیاست RLS درج، آگهی‌دهنده را برابر کاربر فعلی می‌خواهد.
      advertiser_user_id: input.advertiser_user_id ?? userId,

      transaction_type: input.transaction_type,
      listing_kind: input.listing_kind ?? 'standard',
      created_by: userId,
      status: 'draft',
      result: 'active',
      visibility: 'hidden',
      flexible_attributes: {},
    };

    const { data, error } = await sb
      .from('listings')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data as ListingRow;
  } catch (error) {
    throw toAppError(error);
  }
}

/** ویرایش محتوای آگهی بدون تغییر شناسه‌های هویتی آن. */
export async function updateListing(
  id: string,
  input: ListingFormInput,
): Promise<ListingRow> {
  try {
    await requireUserId();
    const sb = getSupabaseClient();

    const payload: ListingUpdate = {
      // شناسه ملک در این مسیر تغییر داده نمی‌شود.
      // تریگر دیتابیس تغییر property_id را منع می‌کند.
      title: input.title.trim(),
      description: emptyToNull(input.description),
      advertiser_type: input.advertiser_type,
      transaction_type: input.transaction_type,
      listing_kind: input.listing_kind ?? 'standard',
    };

    const { data, error } = await sb
      .from('listings')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data as ListingRow;
  } catch (error) {
    throw toAppError(error);
  }
}

/** ارسال آگهی برای بررسی. */
export async function submitListingForReview(
  id: string,
): Promise<ListingRow> {
  try {
    const userId = await requireUserId();
    const sb = getSupabaseClient();

    const { data: existing, error: existingError } = await sb
      .from('listings')
      .select('id, created_by, status')
      .eq('id', id)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (!existing) {
      throw new AppError(
        'NOT_FOUND',
        'آگهی موردنظر پیدا نشد.',
      );
    }

    if (existing.created_by !== userId) {
      throw new AppError(
        'FORBIDDEN',
        'شما اجازه ارسال این آگهی را ندارید.',
      );
    }

    if (
      existing.status !== 'draft' &&
      existing.status !== 'rejected'
    ) {
      throw new AppError(
        'VALIDATION',
        'این آگهی در وضعیت فعلی قابل ارسال برای بررسی نیست.',
      );
    }

    const { data, error } = await sb
      .from('listings')
      .update({
        status: 'pending_review',
        rejected_reason: null,
      })
      .eq('id', id)
      .eq('created_by', userId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data as ListingRow;
  } catch (error) {
    throw toAppError(error);
  }
}
