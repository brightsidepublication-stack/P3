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
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUser {
  auth: User;
  profile: UserProfile | null;
}
