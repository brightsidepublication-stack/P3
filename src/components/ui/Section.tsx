import type { HTMLAttributes, ReactNode } from 'react';

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  title?: string;
  description?: string;
};

export function Section({
  children,
  title,
  description,
  className = '',
  ...rest
}: SectionProps) {
  return (
    <section className={`py-6 ${className}`} {...rest}>
      {title || description ? (
        <div className="mb-5">
          {title ? (
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          ) : null}

          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
      ) : null}

      {children}
    </section>
  );
}