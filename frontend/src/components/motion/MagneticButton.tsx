import { useGSAP } from '@gsap/react';
import { useRef, type ReactNode } from 'react';
import { gsap, hasFinePointer, prefersReducedMotion } from '../../lib/gsap';

const MAX_PULL = 10;

/** Slight pull toward the cursor. Desktop only, off for reduced motion. */
export function MagneticButton({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      xTo((relX / r.width) * MAX_PULL * 2);
      yTo((relY / r.height) * MAX_PULL * 2);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
