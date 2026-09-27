import type { User } from '@supabase/supabase-js';
import type { UserRoleEnum } from './database.types';

export interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  displayName: string | null;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  role: UserRoleEnum;
  email: string | null;
  phone: string | null;
  phoneVerifiedAt: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUser {
  auth: AuthUser;
  profile: UserProfile | null;
}

/**
 * Raw Supabase Auth user.
 *
 * Use this type only where direct Supabase Auth data is required.
 * Application-level current-user state should use CurrentUser above.
 */
export type SupabaseAuthUser = User;
