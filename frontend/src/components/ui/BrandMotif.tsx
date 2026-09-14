import type { Ref } from 'react';

/** Decorative rings based on the LMC logo. */
export function RingMotif({
  className = '',
  tone = 'light',
  svgRef,
}: {
  className?: string;
  tone?: 'light' | 'dark';
  /** Optional ref to the `<svg>` — used for the hero's draw-in entrance. */
  svgRef?: Ref<SVGSVGElement>;
}) {
  const teal = tone === 'dark' ? '#DCEAF0' : '#0F5270';
  const orange = tone === 'dark' ? '#FBD8CC' : '#F05223';
  const tealOpacity = tone === 'dark' ? 0.16 : 0.14;
  const orangeOpacity = tone === 'dark' ? 0.2 : 0.16;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 420 420"
      className={`pointer-events-none absolute ${className}`}
      aria-hidden
    >
      <circle
        cx="210"
        cy="210"
        r="190"
        fill="none"
        stroke={teal}
        strokeWidth="1.5"
        strokeOpacity={tealOpacity}
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="62 100"
      />
      <circle
        cx="210"
        cy="210"
        r="148"
        fill="none"
        stroke={orange}
        strokeWidth="3"
        strokeOpacity={orangeOpacity}
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="38 100"
        strokeDashoffset="-20"
      />
      <circle
        cx="210"
        cy="210"
        r="104"
        fill="none"
        stroke={teal}
        strokeWidth="1"
        strokeOpacity={tealOpacity * 1.3}
        pathLength="100"
        strokeDasharray="80 100"
      />
      <circle cx="86" cy="128" r="7" fill={teal} fillOpacity={tealOpacity * 1.6} />
      <circle cx="332" cy="292" r="5" fill={orange} fillOpacity={orangeOpacity * 1.2} />
    </svg>
  );
}
