import { AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';

type ErrorStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = 'خطایی رخ داد',
  message,
  action,
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`rounded-2xl border border-red-200 bg-red-50 p-6 text-center ${className}`}
    >
      <AlertCircle
        aria-hidden="true"
        className="mx-auto h-10 w-10 text-red-500"
      />

      <h2 className="mt-3 text-base font-semibold text-red-800">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-red-700">
        {message}
      </p>

      {onRetry ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            تلاش مجدد
          </button>
        </div>
      ) : null}

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}