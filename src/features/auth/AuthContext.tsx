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
  getSession,
  onAuthStateChange,
  resetPassword as resetPasswordService,
  signIn as signInService,
  signInWithTelegram as signInWithTelegramService,
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
  signInWithTelegram: (redirectTo?: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  retryProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

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

  const loadProfile = useCallback(
    async (currentSession: Session | null) => {
      const requestId = ++profileRequestIdRef.current;

      if (!currentSession) {
        if (!mountedRef.current) {
          return;
        }

        setProfile(null);
        setProfileError(null);
        setIsProfileLoading(false);
        return;
      }

      setIsProfileLoading(true);
      setProfileError(null);

      try {
        const nextProfile = await getProfileById(
          currentSession.user.id,
        );

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
    },
    [],
  );

  const applySession = useCallback(
    async (nextSession: Session | null) => {
      sessionRef.current = nextSession;

      if (!mountedRef.current) {
        return;
      }

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

    let subscription:
      | ReturnType<typeof onAuthStateChange>
      | null = null;

    async function initializeAuth() {
      try {
        const initialSession = await getSession();

        if (mountedRef.current) {
          await applySession(initialSession);
        }
      } catch {
        if (mountedRef.current) {
          await applySession(null);
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }

      if (!mountedRef.current) {
        return;
      }

      subscription = onAuthStateChange(
        async (_event, nextSession) => {
          if (!mountedRef.current) {
            return;
          }

          await applySession(nextSession);
        },
      );
    }

    void initializeAuth();

    return () => {
      mountedRef.current = false;
      profileRequestIdRef.current += 1;
      subscription?.unsubscribe();
    };
  }, [applySession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await signInService(email, password);
    },
    [],
  );

  const signInWithTelegram = useCallback(
    async (redirectTo?: string) => {
      await signInWithTelegramService(redirectTo);
    },
    [],
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      await signUpService(email, password);
    },
    [],
  );

  const signOut = useCallback(async () => {
    await signOutService();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await resetPasswordService(email);
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    await updatePasswordService(password);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      isLoading,
      isProfileLoading,
      profileError,
      isAuthenticated: Boolean(user),
      isAgent: profile?.role === 'agent',
      isAdmin: profile?.role === 'admin',
      signIn,
      signInWithTelegram,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      retryProfile,
    }),
    [
      user,
      session,
      profile,
      isLoading,
      isProfileLoading,
      profileError,
      signIn,
      signInWithTelegram,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      retryProfile,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuthContext must be used within AuthProvider.',
    );
  }

  return context;
}