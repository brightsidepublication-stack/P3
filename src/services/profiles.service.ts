import type { UserProfile } from '@/types/user.types';
import { toAppError } from '@/lib/errors';
import { getSupabaseClient } from './supabase/client';

function mapProfile(row: {
  id: string;
  role: UserProfile['role'];
  email: string | null;
  phone: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}): UserProfile {
  return {
    id: row.id,
    role: row.role,
    email: row.email,
    phone: row.phone,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getProfileById(
  userId: string,
): Promise<UserProfile | null> {
  try {
    const sb = getSupabaseClient();

    const { data, error } = await sb
      .from('profiles')
      .select(
        'id, role, email, phone, display_name, avatar_url, created_at, updated_at',
      )
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? mapProfile(data) : null;
  } catch (error) {
    throw toAppError(
      error,
      'اطلاعات پروفایل دریافت نشد. لطفاً دوباره تلاش کنید.',
    );
  }
}

export async function updateOwnProfile(
  userId: string,
  patch: {
    display_name?: string | null;
    avatar_url?: string | null;
    phone?: string | null;
  },
): Promise<UserProfile> {
  try {
    const sb = getSupabaseClient();

    const { data, error } = await sb
      .from('profiles')
      .update(patch)
      .eq('id', userId)
      .select(
        'id, role, email, phone, display_name, avatar_url, created_at, updated_at',
      )
      .single();

    if (error) {
      throw error;
    }

    return mapProfile(data);
  } catch (error) {
    throw toAppError(
      error,
      'اطلاعات پروفایل به‌روزرسانی نشد. لطفاً دوباره تلاش کنید.',
    );
  }
}
