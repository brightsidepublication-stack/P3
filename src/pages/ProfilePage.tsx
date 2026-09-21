import { useState } from 'react';

import { ProfileErrorState } from '@/components/auth/ProfileErrorState';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getAuthErrorMessage } from '@/utils/auth-errors';

export function ProfilePage() {
  const {
    user,
    profile,
    isLoading,
    isProfileLoading,
    profileError,
    retryProfile,
    signOut,
  } = useAuth();

  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setLogoutError(null);
    setIsLoggingOut(true);

    try {
      await signOut();
    } catch (error) {
      setLogoutError(getAuthErrorMessage(error));
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (isLoading || isProfileLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          در حال دریافت اطلاعات پروفایل...
        </p>
      </main>
    );
  }

  if (profileError) {
    return (
      <ProfileErrorState
        message={profileError}
        onRetry={retryProfile}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              پروفایل
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              اطلاعات حساب کاربری
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {isLoggingOut ? 'در حال خروج...' : 'خروج'}
          </button>
        </div>

        {logoutError && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {logoutError}
          </div>
        )}

        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">ایمیل</p>
            <p className="mt-1 break-all text-sm font-medium text-slate-900">
              {profile?.email ?? user?.email ?? '—'}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">نام نمایشی</p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {profile?.displayName ?? '—'}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">شماره تلفن</p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {profile?.phone ?? '—'}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">نقش کاربر</p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {profile?.role ?? '—'}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
