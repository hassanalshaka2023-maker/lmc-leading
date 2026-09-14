import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/gsap';

/**
 * Scroll parallax for decorative layers:
 *  - `data-parallax-bg="<px>"` moves the background position
 *  - `data-parallax="<px>"` moves the element vertically
 * `<px>` is the distance travelled across the section. Off for reduced motion.
 */
export function useParallaxLayers(
  scope: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root || prefersReducedMotion()) return;

      const build = (el: HTMLElement, asBackground: boolean) => {
        const raw = asBackground ? el.dataset.parallaxBg : el.dataset.parallax;
        const distance = Number(raw) || 40;
        const trigger =
          el.closest<HTMLElement>('section') ?? el.parentElement ?? el;

        if (asBackground) {
          gsap.fromTo(
            el,
            { backgroundPosition: '50% 0px' },
            {
              backgroundPosition: `50% ${distance}px`,
              ease: 'none',
              scrollTrigger: {
                trigger,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        } else {
          gsap.fromTo(
            el,
            { y: -distance / 2 },
            {
              y: distance / 2,
              ease: 'none',
              scrollTrigger: {
                trigger,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      };

      const bgEls = gsap.utils.toArray<HTMLElement>(
        '[data-parallax-bg]',
        root,
      );
      const yEls = gsap.utils.toArray<HTMLElement>('[data-parallax]', root);
      bgEls.forEach((el) => build(el, true));
      yEls.forEach((el) => build(el, false));

      ScrollTrigger.refresh();
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  );
}
