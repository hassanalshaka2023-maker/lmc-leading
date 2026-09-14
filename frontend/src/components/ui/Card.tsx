import type { ReactNode } from 'react';

type Tone = 'surface' | 'tinted' | 'outlined' | 'dark';

const tones: Record<Tone, string> = {
  surface: 'border border-line bg-surface shadow-[var(--shadow-card)]',
  tinted: 'border border-teal-100 bg-teal-50/70 shadow-none',
  outlined: 'border border-line bg-transparent shadow-none',
  dark: 'border border-white/10 bg-teal-800 text-white shadow-[var(--shadow-card)]',
};

export function Card({
  className = '',
  interactive = false,
  tone = 'surface',
  accent = true,
  reveal = true,
  children,
}: {
  className?: string;
  interactive?: boolean;
  tone?: Tone;
  /** Thin orange→teal accent bar along the card's top edge. */
  accent?: boolean;
  /** `false` to skip, or a variant name — see useScrollReveals. */
  reveal?: boolean | 'up' | 'fade' | 'scale' | 'left' | 'right';
  children: ReactNode;
}) {
  return (
    <div
      data-reveal={reveal === false ? undefined : reveal === true ? 'up' : reveal}
      className={`group relative overflow-hidden rounded-card p-6 ${tones[tone]} ${
        interactive
          ? 'transition duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_44px_-18px_rgba(15,82,112,0.28)]'
          : ''
      } ${className}`}
    >
      {accent ? (
        <span
          aria-hidden
          className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-orange-400 to-teal-600 ${
            interactive
              ? 'opacity-70 transition-opacity duration-300 group-hover:opacity-100'
              : ''
          }`}
        />
      ) : null}
      {children}
    </div>
  );
}
