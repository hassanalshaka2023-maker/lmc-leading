import type { ReactNode } from 'react';

/** Card using `.home-card` from home.css. */
export function GlassCard({
  children,
  className = '',
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={`home-card ${dark ? 'home-card-dark' : ''} p-8 ${className}`}>
      {children}
    </div>
  );
}
