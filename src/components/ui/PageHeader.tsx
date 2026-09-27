import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
};

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <header className="border-b border-slate-200 pb-5">
      {breadcrumb ? (
        <div className="mb-3 text-sm text-slate-500">{breadcrumb}</div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>

          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}