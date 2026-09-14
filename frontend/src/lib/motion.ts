/** Motion settings shared by the GSAP and Framer Motion code. */

/** Default easing (ease-out-expo). */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const MOTION = {
  distance: 28,
  duration: 0.9,
  durationFast: 0.5,
  stagger: 0.09,
  ease: EASE,
  hoverDuration: 0.3,
};

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Real mouse + fine pointer (excludes touch/coarse pointers regardless of viewport width). */
export function hasFinePointer(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}
