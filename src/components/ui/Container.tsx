import type { HTMLAttributes, ReactNode } from 'react';

type ContainerSize = 'narrow' | 'default' | 'wide';

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  size?: ContainerSize;
};

const sizeClasses: Record<ContainerSize, string> = {
  narrow: 'max-w-xl',
  default: 'max-w-3xl',
  wide: 'max-w-6xl',
};

export function Container({
  children,
  size = 'default',
  className = '',
  ...rest
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}