import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { hasFinePointer, MOTION, prefersReducedMotion } from './motion';

gsap.registerPlugin(ScrollTrigger);

/** GSAP-specific ease names — MOTION.ease (lib/motion.ts) is a Framer Motion
 * bezier array, not usable directly by GSAP's own easing strings. */
export const GSAP_EASE = 'power3.out';
export const GSAP_EASE_SOFT = 'power2.out';

export { gsap, hasFinePointer, MOTION, prefersReducedMotion, ScrollTrigger };
