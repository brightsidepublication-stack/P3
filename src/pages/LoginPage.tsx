import { FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getAuthErrorMessage } from '@/utils/auth-errors';
import { getSafeRedirect } from '@/utils/safe-redirect';
import { loginSchema } from '@/utils/validators';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'اطلاعات واردشده معتبر نیست.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(result.data.email, result.data.password);

      const redirect = getSafeRedirect(
        searchParams.get('redirect'),
        ROUTES.PROFILE,
      );

      navigate(redirect, { replace: true });
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            ورود
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            برای ادامه وارد حساب کاربری خود شوید.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              ایمیل
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="example@email.com"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              رمز عبور
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="رمز عبور"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          حساب کاربری ندارید؟{' '}
          <Link
            to={ROUTES.SIGNUP}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            ثبت‌نام کنید
          </Link>
        </p>
      </section>
    </main>
  );
}
