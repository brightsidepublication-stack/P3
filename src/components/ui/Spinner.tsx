interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-4',
};

export function Spinner({
  size = 'md',
  className = '',
}: SpinnerProps) {
  return (
    <span
      aria-label="در حال بارگذاری"
      role="status"
      className={[
        'inline-block animate-spin rounded-full border-slate-300 border-t-slate-800',
        sizeClasses[size],
        className,
      ].join(' ')}
    />
  );
}