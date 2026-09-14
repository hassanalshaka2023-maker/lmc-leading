import { useEffect, useRef, useState } from 'react';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

/** SVG donut chart. Segments draw in when scrolled into view. */
export function DonutChart({
  segments,
  size = 180,
  strokeWidth = 22,
}: {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const total = segments.reduce((sum, seg) => sum + seg.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Start of each segment as a fraction of the total.
  const cumulativeBefore = segments.map((_, i) =>
    segments.slice(0, i).reduce((sum, s) => sum + s.value, 0) / total,
  );

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="-rotate-90"
      role="img"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--line)"
        strokeWidth={strokeWidth}
      />
      {segments.map((seg, i) => {
        const fraction = seg.value / total;
        const dash = fraction * circumference;
        const offset = cumulativeBefore[i] * circumference;
        return (
          <circle
            key={seg.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${inView ? dash : 0} ${circumference}`}
            strokeDashoffset={-offset}
            style={{ transition: `stroke-dasharray 1.1s var(--ease-standard) ${i * 0.15}s` }}
          />
        );
      })}
    </svg>
  );
}
