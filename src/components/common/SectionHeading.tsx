import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  index: string;
  tagline: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  tagline,
  title,
  description,
  align = 'left',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`mb-16 md:mb-24 ${align === 'center' ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'}`}
    >
      {/* Category Index & Tagline */}
      <div className={`flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#a1a1aa] mb-4 font-editorial-display ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="text-[#e4a853] font-medium">{index}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]" />
        <span>{tagline}</span>
      </div>

      {/* Main Heading */}
      <div className="overflow-hidden">
        <h2
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-editorial-serif tracking-tight text-white leading-[1.1]"
        >
          {title}
        </h2>
      </div>

      {/* Optional Description */}
      {description && (
        <p className="mt-5 text-base sm:text-lg text-[#a1a1aa] leading-relaxed font-light">
          {description}
        </p>
      )}
    </div>
  );
};
