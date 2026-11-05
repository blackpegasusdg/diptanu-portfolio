import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData } from '../../data/portfolioData';
import { MagneticButton } from '../common/MagneticButton';
import { ArrowDown, ArrowUpRight, FileText, Terminal } from 'lucide-react';
import { GithubIcon, InstagramIcon, LetterboxdIcon } from '../common/BrandIcons';
import { Hero3DCanvas } from '../common/Hero3DCanvas';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onOpenResumeModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResumeModal }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const interactiveChips = [
    { label: 'Python & PyTorch', highlight: 'GNN & TrustLens Core' },
    { label: 'Kotlin & Compose', highlight: 'A10s Walkman Audio Engine' },
    { label: 'C & Java', highlight: 'Systems & Algorithmic Rigor' },
    { label: 'Graph Neural Nets', highlight: 'Relational Fraud Defense' },
  ];

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(badgeRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'power3.out',
      })
      .from('.hero-word', {
        y: 80,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power4.out',
      }, '-=0.3')
      .from(subtitleRef.current, {
        opacity: 0,
        y: 25,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.6')
      .from(actionsRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.6')
      .from('.hero-3d-wrapper', {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      }, '-=0.8');

      // Scroll-driven Parallax Depth
      gsap.to(headlineRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: 100,
        opacity: 0.25,
        ease: 'none',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Top Status Pill */}
      <div ref={badgeRef} className="pt-4 flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#141418] border border-[#27272a] text-xs text-[#a1a1aa] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wide">{personalData.availability}</span>
        </div>

        <span className="text-xs uppercase tracking-widest text-[#71717a] font-editorial-display">
          {personalData.locationDetailed}
        </span>
      </div>

      {/* Main Hero Split Grid: Typography & 3D Interactive Polytope */}
      <div className="my-auto py-8 md:py-12 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <div className="overflow-hidden mb-2">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#a1a1aa] font-editorial-display flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#e4a853]" />
              <span>Computer Science & Engineering Student / Developer</span>
            </p>
          </div>

          {/* Interactive Bouncing Name Typography */}
          <h1
            ref={headlineRef}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-editorial-serif tracking-tight text-white leading-[0.95] mt-2 mb-6 select-none will-change-transform"
          >
            <span className="block overflow-hidden">
              <span className="hero-word inline-block italic hover:text-[#e4a853] hover:-translate-y-2 transition-transform duration-200 cursor-pointer">
                Diptanu
              </span>{' '}
              <span className="hero-word inline-block font-normal hover:text-[#38bdf8] hover:-translate-y-2 transition-transform duration-200 cursor-pointer">
                Ghosh
              </span>
            </span>
          </h1>

          {/* Subtitle & Focus */}
          <div className="overflow-hidden">
            <p
              ref={subtitleRef}
              className="max-w-2xl text-base sm:text-lg md:text-xl text-[#a1a1aa] font-light leading-relaxed"
            >
              Passionate about <span className="text-white font-normal">Software Systems</span>,{' '}
              <span className="text-white font-normal">Graph Neural Networks</span>, and{' '}
              <span className="text-white font-normal">Applied AI</span>. Engineering real-world solutions grounded in data structures, algorithms, and thoughtful software design.
            </p>
          </div>

          {/* Interactive Responsive Floating Technology Chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {interactiveChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => setActiveChip(activeChip === chip.label ? null : chip.label)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer active:scale-95 ${
                  activeChip === chip.label
                    ? 'bg-[#e4a853] text-black border-[#e4a853] font-semibold'
                    : 'bg-[#121216] text-[#a1a1aa] border-white/10 hover:border-white/40 hover:text-white'
                }`}
              >
                <span>{chip.label}</span>
                {activeChip === chip.label && (
                  <span className="ml-2 text-[10px] opacity-80">({chip.highlight})</span>
                )}
              </button>
            ))}
          </div>

          {/* Interactive CTA Buttons */}
          <div
            ref={actionsRef}
            className="mt-8 flex flex-wrap items-center gap-4 pt-2"
          >
            <MagneticButton
              variant="primary"
              onClick={() => scrollTo('projects')}
            >
              <span>Explore My Work</span>
              <ArrowDown className="w-4 h-4" />
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              onClick={() => scrollTo('contact')}
            >
              <span>Get In Touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </MagneticButton>

            <MagneticButton
              variant="outline"
              onClick={onOpenResumeModal}
            >
              <FileText className="w-4 h-4" />
              <span>Download Resume</span>
            </MagneticButton>
          </div>
        </div>

        {/* Right Column: Interactive 3D Three.js Polytope */}
        <div className="hero-3d-wrapper lg:col-span-5 flex flex-col items-center justify-center">
          <Hero3DCanvas />
        </div>
      </div>

      {/* Bottom Bar: Social Links & Scroll Indicator */}
      <div className="flex items-end justify-between border-t border-[#222227] pt-6 z-10">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-xs uppercase tracking-widest text-[#71717a] hidden sm:inline-block font-editorial-display mr-2">
            Profiles:
          </span>
          <a
            href={personalData.socials.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#a1a1aa] hover:text-white transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href={personalData.socials.letterboxd}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#a1a1aa] hover:text-[#00e054] transition-colors"
          >
            <LetterboxdIcon className="w-3.5 h-3.5" />
            <span>Letterboxd</span>
          </a>
          <a
            href={personalData.socials.instagram}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#a1a1aa] hover:text-[#e1306c] transition-colors"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </a>
        </div>

        {/* Animated Scroll Indicator */}
        <button
          onClick={() => scrollTo('about')}
          className="group flex items-center gap-2 text-xs uppercase tracking-widest text-[#71717a] hover:text-white transition-colors cursor-pointer"
        >
          <span>Scroll</span>
          <div className="w-5 h-8 rounded-full border border-[#3f3f46] flex items-start justify-center p-1">
            <span className="w-1 h-2 rounded-full bg-white animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};

