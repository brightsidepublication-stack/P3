import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { getProfileById } from '@/services/profiles.service';
import {
  onAuthStateChange,
  resetPassword as resetPasswordService,
  signIn as signInService,
  signOut as signOutService,
  signUp as signUpService,
  updatePassword as updatePasswordService,
} from '@/services/auth.service';
import type { UserProfile } from '@/types/auth.types';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;

  isLoading: boolean;
  isProfileLoading: boolean;
  profileError: string | null;

  isAuthenticated: boolean;
  isAgent: boolean;
  isAdmin: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  retryProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const sessionRef = useRef<Session | null>(null);
  const profileRequestIdRef = useRef(0);

  const loadProfile = useCallback(async (currentSession: Session | null) => {
    const requestId = ++profileRequestIdRef.current;

    if (!currentSession) {
      if (!mountedRef.current) return;

      setProfile(null);
      setProfileError(null);
      setIsProfileLoading(false);
      return;
    }

    setIsProfileLoading(true);
    setProfileError(null);

    try {
      const nextProfile = await getProfileById(currentSession.user.id);

      if (
        !mountedRef.current ||
        requestId !== profileRequestIdRef.current ||
        sessionRef.current?.user.id !== currentSession.user.id
      ) {
        return;
      }

      setProfile(nextProfile);
    } catch {
      if (
        !mountedRef.current ||
        requestId !== profileRequestIdRef.current ||
        sessionRef.current?.user.id !== currentSession.user.id
      ) {
        return;
      }

      setProfile(null);
      setProfileError(
        'دریافت اطلاعات پروفایل با خطا مواجه شد. لطفاً دوباره تلاش کنید.',
      );
    } finally {
      if (
        mountedRef.current &&
        requestId === profileRequestIdRef.current
      ) {
        setIsProfileLoading(false);
      }
    }
  }, []);

  const applySession = useCallback(
    async (nextSession: Session | null) => {
      sessionRef.current = nextSession;

      if (!mountedRef.current) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      setProfile(null);
      setProfileError(null);

      await loadProfile(nextSession);
    },
    [loadProfile],
  );

  const retryProfile = useCallback(async () => {
    await loadProfile(sessionRef.current);
  }, [loadProfile]);

  useEffect(() => {
    mountedRef.current = true;

    const unsubscribe = onAuthStateChange(async (event, nextSession) => {
      if (!mountedRef.current) return;

      if (event === 'INITIAL_SESSION') {
        await applySession(nextSession);

        if (mountedRef.current) {
          setIsLoading(false);
        }

        return;
      }

      await applySession(nextSession);
    });

    return () => {
      mountedRef.current = false;
      profileRequestIdRef.current
