import type { ReactNode } from 'react';

/** Small uppercase kicker above a heading, with a short orange→teal rule. */
export function Eyebrow({
  children,
  invert = false,
  className = '',
}: {
  children: ReactNode;
  /** Use on dark/colored banners — lighter text, brighter rule. */
  invert?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-base font-bold uppercase tracking-[0.14em] ${
        invert ? 'text-orange-200' : 'text-orange-600'
      } ${className}`}
    >
      <span
        className={`lmc-rule w-6 ${invert ? 'opacity-90 brightness-125' : ''}`}
        aria-hidden
      />
      {children}
    </span>
  );
}
