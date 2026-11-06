import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitChars } from './SplitChars';
import { prefersReducedMotion } from '../../lib/motion';
import { useCharDrift } from '../../lib/useCharDrift';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  index: string;
  tagline: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  /** Tighter spacing, used when the heading shares a pinned screen. */
  compact?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  tagline,
  title,
  description,
  align = 'left',
  compact = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);

  useCharDrift(containerRef, { radius: 200, x: 12, y: 8, rotate: 5 });

  useEffect(() => {
    const container = containerRef.current;
    const titleEl = titleRef.current;
    if (!container || !titleEl || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const chars = titleEl.querySelectorAll('.split-char');

      // Staggered character entrance (masked rise with a slight twist).
      gsap.from(chars, {
        yPercent: 118,
        rotate: 7,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: { each: 0.018 },
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      // Scroll-linked horizontal drift: the headline slides through the frame.
      gsap.fromTo(
        titleEl,
        { xPercent: 5 },
        {
          xPercent: -3,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        }
      );

      // Hairline that draws itself as the heading arrives.
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top 90%',
              end: 'top 40%',
              scrub: true,
            },
          }
        );
      }

      // Outlined section numeral drifts at a different depth.
      if (ghostRef.current) {
        gsap.fromTo(
          ghostRef.current,
          { yPercent: 25 },
          {
            yPercent: -25,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${compact ? 'mb-8 lg:mb-10' : 'mb-16 md:mb-24'} ${
        align === 'center' ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'
      }`}
    >
      <span
        ref={ghostRef}
        aria-hidden="true"
        className={`absolute -top-10 md:-top-16 ${
          align === 'center' ? 'inset-x-0 text-center' : '-left-2 md:-left-6'
        } text-[8rem] md:text-[13rem] leading-none font-editorial-serif italic text-outline pointer-events-none select-none -z-0`}
      >
        {index}
      </span>

      {/* Category Index & Tagline */}
      <div
        className={`relative flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#a1a1aa] mb-4 font-editorial-display ${
          align === 'center' ? 'justify-center' : ''
        }`}
      >
        <span className="text-[#e4a853] font-medium">{index}</span>
        <span
          ref={lineRef}
          className="h-px w-16 bg-[#e4a853]/70 origin-left"
          aria-hidden="true"
        />
        <span>{tagline}</span>
      </div>

      {/* Main Heading */}
      <h2
        ref={titleRef}
        aria-label={title}
        className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-editorial-serif tracking-tight text-white leading-[1.1]"
      >
        <SplitChars text={title} />
      </h2>

      {/* Optional Description */}
      {description && (
        <p
          className={`relative mt-5 text-base sm:text-lg text-[#a1a1aa] leading-relaxed font-light ${
            compact ? '[@media(max-height:760px)]:hidden' : ''
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
