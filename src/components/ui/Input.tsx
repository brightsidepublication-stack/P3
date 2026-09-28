import type { InputHTMLAttributes } from 'react';

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({
  className = '',
  ...props
}: InputProps) {
  return (
    <input
      className={[
        'w-full rounded-lg border border-slate-300 bg-white px-3 py-2',
        'text-sm text-slate-900 outline-none',
        'placeholder:text-slate-400',
        'focus:border-slate-500 focus:ring-2 focus:ring-slate-200',
        'disabled:cursor-not-allowed disabled:bg-slate-100',
        className,
      ].join(' ')}
      {...props}
    />
  );
}