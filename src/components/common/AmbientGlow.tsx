import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../lib/motion';

gsap.registerPlugin(ScrollTrigger);

const GLOWS = [
  { color: '228,168,83', at: 0.0 },
  { color: '56,189,248', at: 0.26 },
  { color: '192,132,252', at: 0.52 },
  { color: '52,211,153', at: 0.92 },
];

/**
 * A single drifting light source behind the whole page. Each coloured layer
 * is static; scroll only animates transform + opacity, so it stays on the
 * compositor and is cheap even on integrated GPUs.
 */
export const AmbientGlow: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || !moverRef.current) return;
    const layers = gsap.utils.toArray<HTMLElement>('.ambient-layer', rootRef.current);

    if (prefersReducedMotion()) {
      gsap.set(layers[0], { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(layers, { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });

      // Light travels down the page...
      tl.fromTo(
        moverRef.current,
        { x: '55vw', y: '-5vh' },
        { x: '-5vw', y: '55vh', duration: 1 },
        0
      );

      // ...and changes colour per chapter by cross-fading layers.
      layers.forEach((layer, i) => {
        const { at } = GLOWS[i];
        const next = GLOWS[i + 1]?.at ?? 1.2;
        tl.fromTo(layer, { opacity: i === 0 ? 1 : 0 }, { opacity: 1, duration: 0.12 }, Math.max(0, at - 0.12));
        if (i < GLOWS.length - 1) {
          tl.to(layer, { opacity: 0, duration: 0.14 }, next - 0.06);
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      <div ref={moverRef} className="absolute top-0 left-0 w-[70vmax] h-[70vmax] -ml-[20vmax] -mt-[20vmax] will-change-transform">
        {GLOWS.map((g) => (
          <div
            key={g.color}
            className="ambient-layer absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at center, rgba(${g.color},0.16) 0%, rgba(${g.color},0.05) 38%, transparent 66%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
