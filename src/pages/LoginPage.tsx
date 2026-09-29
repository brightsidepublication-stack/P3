import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getAuthErrorMessage } from '@/utils/auth-errors';
import { getSafeRedirect } from '@/utils/safe-redirect';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const { signInWithTelegram } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleTelegramLogin() {
    setError(null);
    setIsSubmitting(true);

    try {
      const redirect = getSafeRedirect(
        searchParams.get('redirect'),
        ROUTES.PROFILE,
      );

      await signInWithTelegram(redirect);
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            ورود به مینی‌اپ املاک
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            برای ورود و ادامه، از حساب تلگرام خود استفاده کنید.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
          >
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleTelegramLogin}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            'در حال انتقال به تلگرام...'
          ) : (
            <>
              <span
                aria-hidden="true"
                className="text-lg"
              >
                ➤
              </span>
              ورود با تلگرام
            </>
          )}
        </button>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          ورود با ایمیل و رمز عبور در حال حاضر غیرفعال است.
        </p>
      </section>
    </main>
  );
}