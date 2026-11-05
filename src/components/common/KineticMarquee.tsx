import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface KineticMarqueeProps {
  items: string[];
}

export const KineticMarquee: React.FC<KineticMarqueeProps> = ({ items }) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current || !trackRef.current) return;

    const track = trackRef.current;

    // ScrollTrigger to accelerate and translate track based on scroll
    const ctx = gsap.context(() => {
      gsap.to(track, {
        scrollTrigger: {
          trigger: marqueeRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        xPercent: -20,
        ease: 'none',
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={marqueeRef}
      className="relative w-full overflow-hidden py-10 md:py-14 border-y border-[#222227]/80 bg-[#0d0d10] select-none"
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform gap-8 text-sm sm:text-base md:text-lg uppercase tracking-[0.25em] font-editorial-display text-[#71717a]"
      >
        {/* Repeating sequence for continuous visual flow */}
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 shrink-0">
            <span className="hover:text-white transition-colors duration-200">
              {item}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#e4a853] shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
