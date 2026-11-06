import type Lenis from 'lenis';

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isCoarsePointer = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;

let lenisInstance: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenisInstance = instance;
};

export const getLenis = () => lenisInstance;

/**
 * Single entry point for programmatic scrolling. Uses Lenis when it is
 * running (so the scroll stays in sync with ScrollTrigger) and falls back to
 * native scrolling when Lenis is disabled (e.g. prefers-reduced-motion).
 */
export const scrollToTarget = (target: string | HTMLElement | number) => {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      duration: 1.8,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }

  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior });
};
