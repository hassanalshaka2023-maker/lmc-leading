import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/gsap';

/**
 * Counts every `[data-count-to]` number inside `scope` up from 0 once it
 * scrolls into view. The element's own text is the final value + suffix
 * (e.g. "1,500+"); `data-count-to` carries the plain numeric target.
 */
export function useCountUp(
  scope: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useGSAP(
    () => {
      if (!scope.current) return;
      const els = scope.current.querySelectorAll<HTMLElement>('[data-count-to]');
      if (els.length === 0 || prefersReducedMotion()) return;

      els.forEach((el) => {
        const target = Number(el.dataset.countTo ?? 0);
        const suffix = el.dataset.countSuffix ?? '';
        const counter = { value: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () =>
            gsap.to(counter, {
              value: target,
              duration: 1.4,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent =
                  Math.round(counter.value).toLocaleString('en-US') + suffix;
              },
            }),
        });
      });
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  );
}
