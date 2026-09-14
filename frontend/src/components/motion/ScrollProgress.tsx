import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/gsap';

/** Thin brand-gradient line under the navbar, tracking scroll progress. */
export function ScrollProgress() {
  const barRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!barRef.current || prefersReducedMotion()) return;
    gsap.set(barRef.current, { scaleX: 0 });
    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        gsap.to(barRef.current, {
          scaleX: self.progress,
          duration: 0.15,
          ease: 'none',
          overwrite: true,
        });
      },
    });
    return () => st.kill();
  }, []);

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-full h-[2px] origin-left bg-gradient-to-r from-orange-500 to-teal-600"
      ref={barRef}
    />
  );
}
