import { animate, inView, stagger } from 'framer-motion';
import { useEffect, type RefObject } from 'react';
import { EASE, MOTION, prefersReducedMotion } from '../lib/motion';

type Variant = 'up' | 'fade' | 'scale' | 'left' | 'right';

function keyframesFor(variant: Variant) {
  switch (variant) {
    case 'fade':
      return { opacity: [0, 1] };
    case 'scale':
      return { opacity: [0, 1], scale: [0.94, 1] };
    case 'left':
      return { opacity: [0, 1], x: [-MOTION.distance, 0] };
    case 'right':
      return { opacity: [0, 1], x: [MOTION.distance, 0] };
    case 'up':
    default:
      return { opacity: [0, 1], y: [MOTION.distance, 0] };
  }
}

function flush(queue: HTMLElement[]) {
  if (queue.length === 0) return;
  const groups = new Map<Variant, HTMLElement[]>();
  queue.forEach((el) => {
    const variant = (el.dataset.reveal || 'up') as Variant;
    const list = groups.get(variant) ?? [];
    list.push(el);
    groups.set(variant, list);
  });
  groups.forEach((list, variant) => {
    animate(list, keyframesFor(variant), {
      duration: MOTION.duration,
      ease: EASE,
      delay: stagger(MOTION.stagger),
    });
  });
}

/**
 * Animates `[data-reveal]` elements under `scope` when they scroll into view,
 * including elements added after data loads (MutationObserver). Elements that
 * appear together are staggered. Runs again when `deps` change.
 */
export function useScrollReveals(
  scope: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const reduced = prefersReducedMotion();

    const claim = (els: HTMLElement[]) =>
      els.filter((el) => {
        if (el.dataset.revealDone) return false;
        el.dataset.revealDone = '1';
        return true;
      });

    let pending: HTMLElement[] = [];
    let raf = 0;
    const scheduleFlush = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const batch = pending;
        pending = [];
        flush(batch);
      });
    };

    const stopFns: Array<() => void> = [];
    const watch = (els: HTMLElement[]) => {
      els.forEach((el) => {
        if (reduced) {
          el.style.opacity = '1';
          el.style.transform = 'none';
          return;
        }
        const stopFn = inView(
          el,
          () => {
            pending.push(el);
            scheduleFlush();
            stopFn();
          },
          { margin: '0px 0px -15% 0px' },
        );
        stopFns.push(stopFn);
      });
    };

    watch(claim(Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))));

    const observer = new MutationObserver((mutations) => {
      const found: HTMLElement[] = [];
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches('[data-reveal]')) found.push(node);
          found.push(
            ...Array.from(node.querySelectorAll<HTMLElement>('[data-reveal]')),
          );
        });
      }
      watch(claim(found));
    });
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      stopFns.forEach((stop) => stop());
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
