import { useEffect } from 'react';
import type { RefObject } from 'react';
import { isCoarsePointer, prefersReducedMotion } from './motion';

interface CharDriftOptions {
  radius?: number;
  x?: number;
  y?: number;
  rotate?: number;
}

/**
 * Cursor-reactive typography: every `.split-char` inside the container is
 * pushed away from the pointer and tilted slightly. Uses the independent CSS
 * `translate` / `rotate` properties so it never fights GSAP's `transform`.
 */
export const useCharDrift = (
  ref: RefObject<HTMLElement | null>,
  { radius = 180, x = 10, y = 8, rotate = 4 }: CharDriftOptions = {}
) => {
  useEffect(() => {
    const root = ref.current;
    if (!root || isCoarsePointer() || prefersReducedMotion()) return;

    let raf = 0;
    let px = 0;
    let py = 0;

    const reset = () => {
      root.querySelectorAll<HTMLElement>('.split-char').forEach((c) => {
        c.style.translate = '';
        c.style.rotate = '';
      });
    };

    const apply = () => {
      raf = 0;
      root.querySelectorAll<HTMLElement>('.split-char').forEach((c) => {
        const r = c.getBoundingClientRect();
        const dx = r.left + r.width / 2 - px;
        const dy = r.top + r.height / 2 - py;
        const d = Math.hypot(dx, dy);
        if (d < radius && d > 0.001) {
          const f = Math.pow(1 - d / radius, 2);
          c.style.translate = `${(dx / d) * f * x}px ${(dy / d) * f * y}px`;
          c.style.rotate = `${(dx / d) * f * rotate}deg`;
        } else {
          c.style.translate = '';
          c.style.rotate = '';
        }
      });
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      reset();
    };

    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      reset();
    };
  }, [ref, radius, x, y, rotate]);
};
