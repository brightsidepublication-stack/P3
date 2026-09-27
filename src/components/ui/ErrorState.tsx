import { AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';

type ErrorStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title = 'خطایی رخ داد',
  message,
  action,
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

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}