import type { ReactNode } from 'react';

/** Small floating pill badge. */
export function FloatingChip({
  children,
  tone = 'orange',
  className = '',
}: {
  children: ReactNode;
  tone?: 'orange' | 'blue';
  className?: string;
}) {
  return (
    <span className={`home-chip ${tone === 'blue' ? 'blue' : ''} ${className}`}>
      <span className="home-dot" />
      {children}
    </span>
  );
}
