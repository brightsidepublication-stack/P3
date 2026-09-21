interface ProfileErrorStateProps {
  message: string;
  onRetry: () => void | Promise<void>;
  onLogout: () => void | Promise<void>;
}

export function ProfileErrorState({
  message,
  onRetry,
  onLogout,
}: ProfileErrorStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
        <h1 className="mb-2 text-lg font-semibold text-slate-900">
          خطا در دریافت پروفایل
        </h1>

        <p className="mb-6 text-sm leading-6 text-slate-600">
          {message}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => void onRetry()}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            تلاش مجدد
          </button>

          <button
            type="button"
            onClick={() => void onLogout()}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            خروج از حساب
          </button>
        </div>
      </div>
    </div>
  );
}
