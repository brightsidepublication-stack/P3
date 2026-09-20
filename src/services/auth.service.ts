import type { Session, AuthChangeEvent, Subscription } from '@supabase/supabase-js';
import { getSupabaseClient } from './supabase/client';
import { getProfileById } from './profiles.service';
import { toAppError } from '@/lib/errors';
import { mapAuthError } from '@/utils/auth-errors';
import { logger } from '@/lib/logger';
import type { AuthUser, UserProfile } from '@/types/user.types';

/**
 * Auth service — Phase 3.
 *
 * Composes Supabase Auth identity with the matching `profiles` row.
 *
 * SECURITY RULES (enforced here, not in UI):
 *  - `role` is NEVER accepted from callers.
 *  - `role` is NEVER written from this file.
 *  - `role` is NEVER read from user_metadata or any frontend source.
 *  - Session tokens are managed by Supabase (no manual localStorage writes).
 *  - Raw Supabase errors are mapped to safe user-facing messages.
 */

export type SignUpParams = {
  email: string;
  password: string;
  fullName?: string;
};

export type SignInParams = {
  email: string;
  password: string;
};

// ---------------------------------------------------------------------------
// Session / identity
// ---------------------------------------------------------------------------

export async function getSession(): Promise<Session | null> {
  try {
    const sb = getSupabaseClient();
    const { data, error } = await sb.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (e) {
    throw toAppError(e);
  }
}

function toAuthUser(u: {
  id: string;
  email?: string | null;
  phone?: string | null;
  user_metadata?: Record<string, unknown> | null;
  created_at: string;
}): AuthUser {
  return {
    id: u.id,
    email: u.email ?? null,
    phone: u.phone ?? null,
    displayName:
      (u.user_metadata?.full_name as string | undefined) ?? null,
    createdAt: u.created_at,
  };
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  try {
    const sb = getSupabaseClient();
    const { data, error } = await sb.auth.getUser();
    if (error) throw error;
    if (!data.user) return null;
    return toAuthUser(data.user);
  } catch (e) {
    throw toAppError(e);
  }
}

export type CurrentUser = {
  auth: AuthUser;
  profile: UserProfile | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const auth = await getCurrentAuthUser();
  if (!auth) return null;

  let profile: UserProfile | null = null;
  try {
    profile = await getProfileById(auth.id);
  } catch (e) {
    logger.warn('Failed to load profile for current user', e);
  }

  return { auth, profile };
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export async function signUp(params: SignUpParams): Promise<void> {
  try {
    const sb = getSupabaseClient();
    const { error } = await sb.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          full_name: params.fullName ?? null,
        },
      },
    });
    if (error) throw error;
  } catch (e) {
    throw mapAuthError(e);
  }
}

export async function signIn(params: SignInParams): Promise<void> {
  try {
    const sb = getSupabaseClient();
    const { error } = await sb.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });
    if (error) throw error;
  } catch (e) {
    throw mapAuthError(e);
  }
}

export async function signOut(): Promise<void> {
  try {
    const sb = getSupabaseClient();
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  } catch (e) {
    throw mapAuthError(e);
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    const sb = getSupabaseClient();
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/login`
        : undefined;

    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) throw error;
  } catch (e) {
    throw mapAuthError(e);
  }
}

export async function updatePassword(newPassword: string): Promise<void> {
  try {
    const sb = getSupabaseClient();
    const { error } = await sb.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  } catch (e) {
    throw mapAuthError(e);
  }
}

// ---------------------------------------------------------------------------
// Auth state subscription
// ---------------------------------------------------------------------------

export type AuthSubscription = Pick<Subscription, 'unsubscribe'>;

export function subscribeToAuthChanges(
  callback: (
    event: AuthChangeEvent,
    session: Session | null,
  ) => void,
): AuthSubscription {
  const sb = getSupabaseClient();
  const { data } = sb.auth.onAuthStateChange(callback);
  return data.subscription;
}
