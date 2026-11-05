import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData } from '../../data/portfolioData';
import { MagneticButton } from '../common/MagneticButton';
import { ArrowDown, ArrowUpRight, FileText } from 'lucide-react';
import { GithubIcon, InstagramIcon, LetterboxdIcon } from '../common/BrandIcons';

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
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Entrance sequence
      tl.from(badgeRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'power3.out',
      })
      .from('.hero-word', {
        y: 90,
        opacity: 0,
        stagger: 0.12,
        duration: 1.1,
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
      .from('.hero-socials', {
        opacity: 0,
        duration: 0.8,
      }, '-=0.4');

      // Scroll-driven Parallax Depth
      gsap.to(headlineRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: 120,
        opacity: 0.3,
        ease: 'none',
      });

      gsap.to(orbRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
        y: 180,
        scale: 1.4,
        opacity: 0.08,
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
      {/* Subtle ambient editorial lighting with scroll parallax */}
      <div
        ref={orbRef}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-sky-500/5 to-white/5 rounded-full blur-[100px] pointer-events-none will-change-transform"
      />

      {/* Top Status Pill */}
      <div ref={badgeRef} className="pt-4 flex items-center justify-between z-10">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#141418] border border-[#27272a] text-xs text-[#a1a1aa] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wide">{personalData.availability}</span>
        </div>

        <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#71717a] font-editorial-display">
          {personalData.locationDetailed}
        </span>
      </div>

      {/* Center Cinematic Typography */}
      <div className="my-auto py-12 md:py-16 z-10">
        <div className="overflow-hidden mb-2">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#a1a1aa] font-editorial-display">
            Computer Science & Engineering Student / Developer
          </p>
        </div>

        {/* Large Masked Expressive Headline */}
        <h1
          ref={headlineRef}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-editorial-serif tracking-tight text-white leading-[0.95] mt-2 mb-8 will-change-transform"
        >
          <span className="block overflow-hidden">
            <span className="hero-word inline-block italic">Diptanu</span>{' '}
            <span className="hero-word inline-block font-normal">Ghosh</span>
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

        {/* Interactive CTA Buttons */}
        <div
          ref={actionsRef}
          className="mt-10 flex flex-wrap items-center gap-4 pt-2"
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

      {/* Bottom Bar: Social Links & Scroll Indicator */}
      <div className="hero-socials flex items-end justify-between border-t border-[#222227] pt-6 z-10">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-xs uppercase tracking-widest text-[#71717a] hidden sm:inline-block font-editorial-display mr-2">
            Connect:
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
