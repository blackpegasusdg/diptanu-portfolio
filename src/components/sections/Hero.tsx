import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData } from '../../data/portfolioData';
import { MagneticButton } from '../common/MagneticButton';
import { VariableProximityText } from '../common/VariableProximityText';
import { ArrowDown, ArrowUpRight, FileText, Terminal, Sparkles } from 'lucide-react';
import { GithubIcon, InstagramIcon, LetterboxdIcon } from '../common/BrandIcons';
import { Hero3DCanvas } from '../common/Hero3DCanvas';
import { isCoarsePointer, prefersReducedMotion, scrollToTarget } from '../../lib/motion';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  /** Becomes true once the preloader has finished; starts the entrance. */
  ready?: boolean;
  onOpenResumeModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ ready = true, onOpenResumeModal }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const introRef = useRef<gsap.core.Timeline | null>(null);

  const interactiveChips = [
    { label: 'Python & PyTorch', highlight: 'GNN & TrustLens Core' },
    { label: 'Kotlin & Compose', highlight: 'A10s Walkman Audio Engine' },
    { label: 'C & Java', highlight: 'Systems & Algorithmic Rigor' },
    { label: 'Graph Neural Nets', highlight: 'Relational Fraud Defense' },
  ];

  // Entrance + scroll choreography. Entrance tweens animate the INNER elements
  // (.hero-word, chips, ...) while the scroll scrub animates their OUTER
  // wrappers (.hero-name-*, .hero-scrub-*), so the two never fight over the
  // same transform. Pointer depth uses x / y while scrub uses xPercent / scale.
  useEffect(() => {
    const root = heroRef.current;
    if (!root || prefersReducedMotion()) return;

    let removePointer: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.hero-line');
      const words = gsap.utils.toArray<HTMLElement>('.hero-word');

      // Words rise out of a mask; mask is released afterwards so the
      // proximity-scale hover effect is never clipped.
      gsap.set(lines, { overflow: 'hidden' });

      const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
      intro
        .from(badgeRef.current, { opacity: 0, y: -16, duration: 0.8 })
        .from('.hero-eyebrow', { opacity: 0, x: -24, duration: 1 }, '<0.1')
        .from(words, { yPercent: 118, rotate: 4, duration: 1.4, stagger: 0.12 }, '<0.05')
        .add(() => {
          gsap.set(lines, { overflow: 'visible' });
        })
        .from(subtitleRef.current, { opacity: 0, y: 28, duration: 1 }, '-=0.9')
        .from('.hero-chip', { opacity: 0, y: 18, stagger: 0.06, duration: 0.8 }, '-=0.8')
        .from(actionsRef.current, { opacity: 0, y: 20, duration: 0.9 }, '-=0.7')
        .from('.hero-3d-wrapper', { scale: 0.8, opacity: 0, rotate: -6, duration: 1.6 }, '-=1.4')
        .from('.hero-bottom', { opacity: 0, y: 20, duration: 0.9 }, '-=1');
      introRef.current = intro;

      // Scroll: the name splits apart, supporting layers peel away at
      // different depths while the portrait starts its colour -> dither arc.
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 1 },
        })
        .to('.hero-name-a', { xPercent: -30, opacity: 0.08 }, 0)
        .to('.hero-name-b', { xPercent: 30, opacity: 0.08 }, 0)
        .to(headlineRef.current, { y: -40 }, 0)
        .to('.hero-scrub-b', { y: -110, opacity: 0 }, 0)
        .to('.hero-scrub-c', { scale: 1.3, y: -90, opacity: 0 }, 0);

      // Pointer depth: each layer moves a different distance.
      if (!isCoarsePointer()) {
        const ease = { duration: 1.2, ease: 'power3' };
        const ax = gsap.quickTo('.hero-name-a', 'x', ease);
        const ay = gsap.quickTo('.hero-name-a', 'y', ease);
        const bx = gsap.quickTo('.hero-name-b', 'x', ease);
        const by = gsap.quickTo('.hero-name-b', 'y', ease);
        const cx = gsap.quickTo('.hero-scrub-c', 'x', ease);

        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          ax(nx * -26);
          ay(ny * -14);
          bx(nx * 20);
          by(ny * 12);
          cx(nx * 34);
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        removePointer = () => window.removeEventListener('pointermove', onMove);
      }
    }, root);

    return () => {
      removePointer?.();
      introRef.current = null;
      ctx.revert();
    };
  }, []);

  // Play the entrance once the preloader is gone (with a safety net).
  useEffect(() => {
    if (!ready) return;
    const intro = introRef.current;
    if (!intro) return;
    intro.play();
    const safety = window.setTimeout(() => intro.progress(1), 7000);
    return () => window.clearTimeout(safety);
  }, [ready]);

  const scrollTo = (id: string) => {
    scrollToTarget(`#${id}`);
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Top Status & Editorial Mission Stamp */}
      <div ref={badgeRef} className="pt-4 flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <div
            data-cursor-label="ONLINE"
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#141418]/90 border border-[#27272a] text-xs text-[#a1a1aa] shadow-sm cursor-pointer hover:border-amber-400/40 transition-colors backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wide">{personalData.availability}</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-white/50 tracking-wider uppercase">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span>BEYOND THE INTERFACE</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-[#71717a] font-editorial-display hidden md:inline">
            BUILDING THINGS THAT MATTER
          </span>
          <span className="text-xs uppercase tracking-widest text-[#a1a1aa] font-editorial-display">
            {personalData.locationDetailed}
          </span>
        </div>
      </div>

      {/* Main Hero Split Grid: Typography & 3D Interactive Polytope */}
      <div className="my-auto py-8 md:py-12 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7">
          <div className="mb-2">
            <p className="hero-eyebrow text-xs sm:text-sm uppercase tracking-[0.3em] text-[#a1a1aa] font-editorial-display flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#e4a853]" />
              <span>Computer Science & Engineering Student / Developer</span>
            </p>
          </div>

          {/* Interactive Variable Proximity Typography */}
          <h1
            ref={headlineRef}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-editorial-serif tracking-tight text-white leading-[0.95] mt-2 mb-6 select-none will-change-transform"
          >
            <div className="block leading-none py-2" aria-label={personalData.name}>
              <span className="hero-name hero-name-a inline-block will-change-transform">
                <span className="hero-line inline-block align-bottom">
                  <span className="hero-word inline-block">
                    <VariableProximityText
                      text="Diptanu"
                      className="font-editorial-serif italic mr-3 sm:mr-5 cursor-pointer text-white"
                      radius={160}
                      maxScale={1.28}
                      highlightColor="#e4a853"
                    />
                  </span>
                </span>
              </span>
              <span className="hero-name hero-name-b inline-block will-change-transform">
                <span className="hero-line inline-block align-bottom">
                  <span className="hero-word inline-block">
                    <VariableProximityText
                      text="Ghosh"
                      className="font-editorial-serif font-normal cursor-pointer text-white"
                      radius={160}
                      maxScale={1.28}
                      highlightColor="#38bdf8"
                    />
                  </span>
                </span>
              </span>
            </div>
          </h1>

          <div className="hero-scrub-b">
          {/* Subtitle & Focus with Proximity Text */}
          <div>
            <p
              ref={subtitleRef}
              className="max-w-2xl text-base sm:text-lg md:text-xl text-[#d4d4d8] font-light leading-relaxed"
            >
              Passionate about <span className="text-white font-normal underline decoration-amber-400/40 underline-offset-4">Software Systems</span>,{' '}
              <span className="text-white font-normal underline decoration-sky-400/40 underline-offset-4">Graph Neural Networks</span>, and{' '}
              <span className="text-white font-normal underline decoration-emerald-400/40 underline-offset-4">Applied AI</span>. Engineering real-world solutions grounded in data structures, algorithms, and thoughtful software design.
            </p>
          </div>

          {/* Interactive Responsive Floating Technology Chips */}
          <div className="hero-chips mt-6 flex flex-wrap gap-2">
            {interactiveChips.map((chip) => (
              <button
                key={chip.label}
                data-cursor="magnetic"
                data-cursor-label="TECH"
                onClick={() => setActiveChip(activeChip === chip.label ? null : chip.label)}
                className={`hero-chip text-xs px-3.5 py-1.5 rounded-full border transition-[background-color,border-color,color,box-shadow] duration-200 cursor-pointer active:scale-95 ${
                  activeChip === chip.label
                    ? 'bg-[#e4a853] text-black border-[#e4a853] font-semibold shadow-[0_0_15px_rgba(228,168,83,0.3)]'
                    : 'bg-[#121216]/90 text-[#a1a1aa] border-white/10 hover:border-white/40 hover:text-white backdrop-blur-sm'
                }`}
              >
                <span>{chip.label}</span>
                {activeChip === chip.label && (
                  <span className="ml-2 text-[10px] opacity-80">({chip.highlight})</span>
                )}
              </button>
            ))}
          </div>

          {/* Interactive Magnetic CTA Buttons */}
          <div
            ref={actionsRef}
            className="mt-8 flex flex-wrap items-center gap-4 pt-2"
          >
            <MagneticButton
              variant="primary"
              cursorLabel="EXPLORE"
              onClick={() => scrollTo('projects')}
            >
              <span>Explore My Work</span>
              <ArrowDown className="w-4 h-4" />
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              cursorLabel="TALK"
              onClick={() => scrollTo('contact')}
            >
              <span>Get In Touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </MagneticButton>

            <MagneticButton
              variant="outline"
              cursorLabel="RESUME"
              onClick={onOpenResumeModal}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Download Resume</span>
            </MagneticButton>
          </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Three.js Polytope alongside Dithered Background */}
        <div
          className="hero-3d-wrapper lg:col-span-5 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
          data-cursor-label="DRAG 3D"
        >
          <div className="hero-scrub-c">
            <Hero3DCanvas />
          </div>
        </div>
      </div>

      {/* Bottom Bar: Social Links & Scroll Indicator */}
      <div className="hero-bottom flex items-end justify-between border-t border-[#222227] pt-6 z-10 bg-[#070709]/40 backdrop-blur-sm px-2 rounded-xl">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-xs uppercase tracking-widest text-[#71717a] hidden sm:inline-block font-editorial-display mr-2">
            Profiles:
          </span>
          <a
            href={personalData.socials.github}
            target="_blank"
            rel="noreferrer"
            data-cursor="magnetic"
            data-cursor-label="GITHUB"
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#a1a1aa] hover:text-white transition-colors py-1"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href={personalData.socials.letterboxd}
            target="_blank"
            rel="noreferrer"
            data-cursor="magnetic"
            data-cursor-label="MOVIES"
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#a1a1aa] hover:text-[#00e054] transition-colors py-1"
          >
            <LetterboxdIcon className="w-3.5 h-3.5" />
            <span>Letterboxd</span>
          </a>
          <a
            href={personalData.socials.instagram}
            target="_blank"
            rel="noreferrer"
            data-cursor="magnetic"
            data-cursor-label="INSTA"
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#a1a1aa] hover:text-[#e1306c] transition-colors py-1"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </a>
        </div>

        {/* Animated Scroll Indicator & Stage Guidance */}
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/40 hidden md:inline">
            SCROLL TO DITHER
          </span>
          <button
            onClick={() => scrollTo('about')}
            data-cursor="magnetic"
            data-cursor-label="DOWN"
            className="group flex items-center gap-2 text-xs uppercase tracking-widest text-[#71717a] hover:text-white transition-colors cursor-pointer"
          >
            <span>Scroll</span>
            <div className="w-5 h-8 rounded-full border border-[#3f3f46] flex items-start justify-center p-1 group-hover:border-amber-400 transition-colors">
              <span className="w-1 h-2 rounded-full bg-white group-hover:bg-amber-400 transition-colors animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
