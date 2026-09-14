import { useEffect, useRef, useState } from 'react';

export interface Bar {
  label: string;
  value: number;
}

/** Vertical bar chart. Bars grow in when scrolled into view. */
export function BarChart({ bars }: { bars: Bar[] }) {
  const ref = useRef<HTMLDivElement>(null);
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

  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div>
      <div ref={ref} className="home-bar-track">
        {bars.map((b, i) => (
          <div
            key={b.label}
            className="home-bar"
            style={{
              height: inView ? `${Math.max((b.value / max) * 100, 4)}%` : '0%',
              transitionDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>
      <div className="mt-3 flex gap-[0.9rem]">
        {bars.map((b) => (
          <div key={b.label} className="flex-1 text-center">
            <div className="text-sm font-bold" style={{ color: 'var(--navy)' }}>
              {b.value}
            </div>
            <div className="mt-0.5 text-[0.68rem]" style={{ color: 'var(--muted)' }}>
              {b.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
