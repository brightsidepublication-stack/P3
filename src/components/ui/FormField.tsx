import type { ReactNode } from 'react';

type BaseProps = {
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

type WithLabel = BaseProps & {
  label: string;
  id: string;
};

type WithoutLabel = BaseProps & {
  label?: undefined;
  id?: string;
};

type Props = WithLabel | WithoutLabel;

export function FormField({
  id,
  label,
  hint,
  error,
  required,
  children,
  className = '',
}: Props) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
          {required ? <span className="text-red-500"> *</span> : null}
        </label>
      ) : null}

      {children}

      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}