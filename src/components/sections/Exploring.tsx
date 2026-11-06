import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../common/SectionHeading';
import { ScrollGhostText } from '../common/ScrollGhostText';
import { exploringData } from '../../data/portfolioData';
import { isCoarsePointer, prefersReducedMotion } from '../../lib/motion';
import { Sparkles, BrainCircuit, Network, BookOpen, Binary } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * "Currently Exploring" as a pinned horizontal journey on desktop: the screen
 * locks and the topics travel past while a progress rail fills. On smaller
 * screens (or with reduced motion) it falls back to a normal responsive grid
 * with a staggered entrance, so no content is ever gated behind the pin.
 */
export const Exploring: React.FC = () => {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();

    // Desktop: pinned horizontal scroll
    mm.add('(min-width: 1024px)', () => {
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!pin || !track) return;

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          pin: true,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (railRef.current) railRef.current.style.transform = `scaleX(${self.progress})`;
            if (counterRef.current) {
              const idx = Math.min(
                exploringData.length,
                Math.floor(self.progress * exploringData.length) + 1
              );
              counterRef.current.textContent = `${pad(idx)} / ${pad(exploringData.length)}`;
            }
          },
        },
      });
    });

    // Tablet / phone: staggered entrance of the grid
    mm.add('(max-width: 1023px)', () => {
      const track = trackRef.current;
      if (!track) return;
      gsap.from(track.children, {
        y: 50,
        opacity: 0,
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.1,
        clearProps: 'clipPath,opacity,transform',
        scrollTrigger: { trigger: track, start: 'top 85%', once: true },
      });
    });

    return () => mm.revert();
  }, []);

  const getIcon = (id: string) => {
    switch (id) {
      case 'gen-ai':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'rag':
        return <BookOpen className="w-5 h-5 text-sky-400" />;
      case 'agentic-ai':
        return <BrainCircuit className="w-5 h-5 text-emerald-400" />;
      case 'gnn':
        return <Network className="w-5 h-5 text-purple-400" />;
      case 'dsa-daa':
        return <Binary className="w-5 h-5 text-rose-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-white" />;
    }
  };

  // Tilt + glare through CSS variables (no React renders per mouse move)
  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCoarsePointer()) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
    const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
    card.style.setProperty('--glare', '1');
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.setProperty('--glare', '0');
  };

  return (
    <section id="learning" className="relative">
      <ScrollGhostText text="Frontiers" className="top-10 md:top-16" from={10} to={-38} />

      <div
        ref={pinRef}
        className="relative py-24 md:py-36 lg:py-12 lg:min-h-screen lg:flex lg:flex-col lg:justify-center overflow-x-clip"
      >
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeading
            index="04"
            tagline="Continuous Horizon"
            title="Active Frontiers & Areas of Study"
            description="The technologies, paradigms, and algorithmic foundations I am actively dissecting, prototyping, and integrating into my engineering practice."
            compact
          />
        </div>

        <div
          ref={trackRef}
          className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:flex lg:w-max lg:gap-6 lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] lg:pr-12 will-change-transform"
        >
          {exploringData.map((item, i) => (
            <div
              key={item.id}
              data-cursor-label="STUDY"
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
              className="relative overflow-hidden group p-8 rounded-3xl bg-[#111114] border border-[#222227] hover:border-white/30 hover:bg-[#141418] transition-[border-color,background-color] duration-200 flex flex-col justify-between cursor-pointer will-change-transform lg:w-[26rem] lg:shrink-0"
              style={{ ['--glare' as string]: '0', ['--mx' as string]: '0px', ['--my' as string]: '0px' }}
            >
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: 'var(--glare)',
                  background:
                    'radial-gradient(260px circle at var(--mx) var(--my), rgba(255,255,255,0.08), transparent 80%)',
                }}
              />

              <span
                aria-hidden="true"
                className="absolute -right-2 -top-4 text-[7rem] leading-none font-editorial-serif italic text-outline pointer-events-none select-none"
              >
                {pad(i + 1)}
              </span>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="p-2.5 rounded-xl bg-[#18181c] border border-white/10 group-hover:border-white/20 transition-colors">
                    {getIcon(item.id)}
                  </span>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#1c1c22] border border-white/5 text-[#a1a1aa]">
                    {item.status}
                  </span>
                </div>

                <span className="text-[11px] uppercase tracking-widest text-[#71717a] font-editorial-display block mb-1">
                  {item.category}
                </span>
                <h3 className="text-2xl font-editorial-serif text-white tracking-tight group-hover:text-[#e4a853] transition-colors">
                  {item.topic}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-[#d4d4d8] font-light leading-relaxed">
                  {item.focus}
                </p>
              </div>

              <div className="relative z-10 mt-8 pt-4 border-t border-white/5 text-[11px] text-[#71717a] leading-normal font-light">
                {item.description}
              </div>
            </div>
          ))}
        </div>

        {/* Progress rail (desktop pin only) */}
        <div className="hidden lg:flex items-center gap-4 mt-8 w-full max-w-7xl mx-auto px-12">
          <span ref={counterRef} className="font-mono text-xs text-[#a1a1aa] tabular-nums">
            {`01 / ${pad(exploringData.length)}`}
          </span>
          <span className="relative h-px flex-1 bg-white/10 overflow-hidden" aria-hidden="true">
            <span
              ref={railRef}
              className="absolute inset-0 bg-[#e4a853] origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#71717a]">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
};
