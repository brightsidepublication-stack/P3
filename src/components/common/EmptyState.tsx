import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <h2 className="text-base font-semibold text-slate-800">
        {title}
      </h2>

      {description ? (
        <p className="mt-2 text-sm text-slate-500">
          {description}
        </p>
      ) : null}

      {action ? (
        <div className="mt-4 flex justify-center">
          {action}
        </div>
      ) : null}
    </div>
  );
}