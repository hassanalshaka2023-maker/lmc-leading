import type { ReactNode } from 'react';

export function IconBox({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`home-icon-box ${className}`} aria-hidden>
      {children}
    </span>
  );
}
