/** Stroke icons used on the home page. */
type IconProps = { className?: string };

const base = 'stroke-current';

export function IconGlobe({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} h-6 w-6 ${className}`} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" strokeWidth="1.7" />
      <ellipse cx="12" cy="12" rx="4" ry="9" strokeWidth="1.5" />
      <path d="M3.5 12h17M4.7 7.5h14.6M4.7 16.5h14.6" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function IconBriefcase({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} h-6 w-6 ${className}`} fill="none" aria-hidden>
      <rect x="3.5" y="8" width="17" height="11" rx="2.2" strokeWidth="1.7" />
      <path d="M8.5 8V6a2.2 2.2 0 0 1 2.2-2.2h2.6A2.2 2.2 0 0 1 15.5 6v2" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M3.5 13.2h17" strokeWidth="1.4" />
      <rect x="10.3" y="11.6" width="3.4" height="2.8" rx="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGraduationCap({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} h-6 w-6 ${className}`} fill="none" aria-hidden>
      <path d="M12 5 3 9.5 12 14l9-4.5-9-4.5Z" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 12.3v3.5c0 1.3 2.3 2.7 5 2.7s5-1.4 5-2.7v-3.5" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M20.5 9.5v4.6" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconAward({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} h-6 w-6 ${className}`} fill="none" aria-hidden>
      <circle cx="12" cy="9" r="5.2" strokeWidth="1.6" />
      <path d="M9 13.5 7.5 20l4.5-2.4 4.5 2.4-1.5-6.5" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconUsers({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} h-6 w-6 ${className}`} fill="none" aria-hidden>
      <circle cx="9" cy="8.3" r="3.1" strokeWidth="1.6" />
      <path d="M3.3 19c.6-3 2.9-4.8 5.7-4.8s5 1.8 5.7 4.8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="8.6" r="2.3" strokeWidth="1.4" />
      <path d="M15.8 14.5c2.2.2 3.9 1.7 4.4 4" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconTarget({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} h-6 w-6 ${className}`} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.3" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.6" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconCheck({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} h-4 w-4 ${className}`} fill="none" aria-hidden>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowStart({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} h-4 w-4 rtl:-scale-x-100 ${className}`} fill="none" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTrendingUp({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} h-6 w-6 ${className}`} fill="none" aria-hidden>
      <path d="M3.5 16.5 9.5 10.5 13.5 14.5 20.5 7.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7.5h5.5V13" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCompass({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} h-6 w-6 ${className}`} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
      <path d="m15 9-4.2 1.8L9 15l4.2-1.8L15 9Z" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function IconClipboard({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} h-6 w-6 ${className}`} fill="none" aria-hidden>
      <rect x="5" y="4.5" width="14" height="16" rx="2" strokeWidth="1.6" />
      <rect x="9" y="3" width="6" height="3" rx="1.2" strokeWidth="1.4" />
      <path d="M8.5 11.5h7M8.5 15h7" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function IconSparkle({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} h-6 w-6 ${className}`} fill="none" aria-hidden>
      <path
        d="M12 3.5c.6 3 2 4.4 5 5-3 .6-4.4 2-5 5-.6-3-2-4.4-5-5 3-.6 4.4-2 5-5Z"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M19 15.5c.3 1.4.9 2 2.3 2.3-1.4.3-2 .9-2.3 2.3-.3-1.4-.9-2-2.3-2.3 1.4-.3 2-.9 2.3-2.3Z" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}
