import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../lib/motion';

gsap.registerPlugin(ScrollTrigger);

interface ScrollGhostTextProps {
  text: string;
  className?: string;
  /** Start / end horizontal offsets in percent of the text width. */
  from?: number;
  to?: number;
}

/**
 * Oversized outlined word that slides horizontally with scroll. It bleeds
 * across section boundaries so sections read as one continuous journey
 * instead of separate rectangles.
 */
export const ScrollGhostText: React.FC<ScrollGhostTextProps> = ({
  text,
  className = '',
  from = 8,
  to = -28,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current || !trackRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        trackRef.current,
        { xPercent: from },
        {
          xPercent: to,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, [from, to]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none select-none absolute left-1/2 w-screen -translate-x-1/2 overflow-hidden ${className}`}
    >
      <div
        ref={trackRef}
        className="whitespace-nowrap font-editorial-serif italic text-outline text-[20vw] leading-[0.9] will-change-transform"
      >
        {text}
      </div>
    </div>
  );
};
