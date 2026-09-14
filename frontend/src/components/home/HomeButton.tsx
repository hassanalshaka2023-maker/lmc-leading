import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'ghost' | 'ghost-dark';
type Size = 'md' | 'lg';

const variantClass: Record<Variant, string> = {
  primary: 'home-btn-primary',
  ghost: 'home-btn-ghost',
  'ghost-dark': 'home-btn-ghost-dark',
};

/** Home page button (styles in home.css). */
export function HomeButton({
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}: {
  to: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  const cls = `home-btn ${variantClass[variant]} ${size === 'lg' ? 'lg' : ''} ${className}`;
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}
