import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'accent' | 'secondary' | 'secondaryInvert' | 'ghost';
type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 hover:scale-[1.02] active:scale-100 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none disabled:hover:scale-100';

const variants: Record<Variant, string> = {
  // Teal fill, orange only as a hover ring.
  primary:
    'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-[0_10px_22px_-10px_rgba(15,82,112,0.45)] ' +
    'hover:shadow-[0_14px_28px_-10px_rgba(15,82,112,0.55)] hover:-translate-y-0.5 hover:from-teal-400 hover:to-teal-500 ' +
    'ring-1 ring-inset ring-orange-300/0 hover:ring-orange-300/50',
  /** Orange, for the main call to action only. */
  accent:
    'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_10px_24px_-10px_rgba(240,82,35,0.5)] ' +
    'hover:shadow-[0_14px_30px_-10px_rgba(240,82,35,0.6)] hover:-translate-y-0.5 ' +
    'ring-1 ring-inset ring-white/15',
  secondary:
    'bg-surface text-teal-700 border border-line hover:border-teal-300 hover:bg-surface-3',
  /** For CTAs sitting on a dark/colored banner (Hero, CtaBand). */
  secondaryInvert:
    'bg-white/10 text-white border border-white/25 backdrop-blur-sm hover:bg-white/20 hover:border-white/40',
  ghost: 'bg-transparent text-teal-700 hover:bg-teal-50',
};

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** internal router link */
  to?: string;
  /** external link */
  href?: string;
}

type Props = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  to,
  href,
  ...buttonProps
}: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to !== undefined) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  if (href !== undefined) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...buttonProps}>
      {children}
    </button>
  );
}
