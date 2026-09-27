import { forwardRef, type InputHTMLAttributes } from 'react';

type BaseProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
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

export const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox(
  { label, className = '', id, ...rest },
  ref
) {
  return (
    <label
      className={`inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700 ${className}`}
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-100"
        {...rest}
      />
      {label ? <span>{label}</span> : null}
    </label>
  );
});