import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../common/SectionHeading';
import { SplitChars } from '../common/SplitChars';
import { ScrollGhostText } from '../common/ScrollGhostText';
import { isCoarsePointer, prefersReducedMotion } from '../../lib/motion';
import { projectsData } from '../../data/portfolioData';
import type { Project } from '../../types/portfolio';
import { ProjectModal } from './ProjectModal';
import { ArrowUpRight, ExternalLink, SlidersHorizontal, Shield, Network, Music2, Sparkles } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';

gsap.registerPlugin(ScrollTrigger);

export const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // 1. Title letters rise as the card arrives.
        gsap.from(card.querySelectorAll('.split-char'), {
          yPercent: 115,
          rotate: 6,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.03,
          scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' },
        });

        // 2. The oversized index numeral drifts at its own depth.
        const ghost = card.querySelector('.project-ghost');
        if (ghost) {
          gsap.fromTo(
            ghost,
            { yPercent: 30 },
            {
              yPercent: -30,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        }

        // 3. Architecture steps light up one by one while the card is pinned.
        const steps = card.querySelectorAll('.arch-step');
        if (steps.length) {
          gsap.fromTo(
            steps,
            { opacity: 0.18, x: 18 },
            {
              opacity: 1,
              x: 0,
              stagger: 0.3,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top 75%', end: 'top 20%', scrub: 0.6 },
            }
          );
        }

        // 4. As the next card slides over this one, this one recedes
        //    (scale + darken). No blur filter: it is far too costly on
        //    integrated GPUs and phones.
        const next = cardsRef.current[index + 1];
        if (next) {
          const dim = card.querySelector('.project-dim');
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 25%', scrub: true },
          });
          tl.to(card, { scale: 0.93, y: -20 }, 0);
          if (dim) tl.to(dim, { opacity: 0.6 }, 0);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3D tilt + specular glare. Tilt is applied to an INNER layer and glare
  // uses CSS variables, so it never fights the GSAP transforms on the outer
  // sticky card and never triggers React renders.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardIndex: number) => {
    if (isCoarsePointer()) return;
    const inner = innerRefs.current[cardIndex];
    if (!inner) return;
    const rect = inner.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -4;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4;

    inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    inner.style.setProperty('--mx', `${x}px`);
    inner.style.setProperty('--my', `${y}px`);
    inner.style.setProperty('--glare', '1');
  };

  const handleMouseLeave = (cardIndex: number) => {
    const inner = innerRefs.current[cardIndex];
    if (!inner) return;
    inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    inner.style.setProperty('--glare', '0');
  };

  const getProjectTheme = (id: string) => {
    switch (id) {
      case 'trustlens':
        return {
          icon: Shield,
          accent: '#38bdf8',
          borderHover: 'hover:border-[#38bdf8]/60',
          badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
          glow: 'from-sky-500/10 via-transparent to-transparent',
          sheen: 'rgba(56, 189, 248, 0.15)',
        };
      case 'gnn-fraud':
        return {
          icon: Network,
          accent: '#c084fc',
          borderHover: 'hover:border-[#c084fc]/60',
          badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
          glow: 'from-purple-500/10 via-transparent to-transparent',
          sheen: 'rgba(192, 132, 252, 0.15)',
        };
      case 'a10s-walkman':
        return {
          icon: Music2,
          accent: '#e4a853',
          borderHover: 'hover:border-[#e4a853]/60',
          badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
          glow: 'from-amber-500/10 via-transparent to-transparent',
          sheen: 'rgba(228, 168, 83, 0.15)',
        };
      default:
        return {
          icon: Sparkles,
          accent: '#e4a853',
          borderHover: 'hover:border-white/40',
          badgeBg: 'bg-white/10 text-white border-white/20',
          glow: 'from-white/5 via-transparent to-transparent',
          sheen: 'rgba(255, 255, 255, 0.1)',
        };
    }
  };

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto"
    >
      <ScrollGhostText text="Selected Works" className="top-10 md:top-16" from={6} to={-30} />
      <SectionHeading
        index="03"
        tagline="Selected Works"
        title="Featured Systems & Research Projects"
        description="Every project card is an interactive object. Tap or inspect any project to launch its bespoke interactive playground."
      />

      <div className="relative space-y-16 md:space-y-24">
        {projectsData.map((project, idx) => {
          const theme = getProjectTheme(project.id);
          const ProjectIcon = theme.icon;

          return (
            <div
              key={project.id}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              style={{ top: `calc(7rem + ${idx * 24}px)` }}
              className="sticky will-change-transform"
            >
              <div
                ref={(el) => {
                  innerRefs.current[idx] = el;
                }}
                data-cursor-label="VIEW PROJECT"
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                onClick={() => setSelectedProject(project)}
                className={`group relative rounded-3xl bg-[#111114] border border-[#27272a] ${theme.borderHover} transition-[border-color,transform] duration-300 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden cursor-pointer`}
                style={{ ['--mx' as string]: '0px', ['--my' as string]: '0px', ['--glare' as string]: '0' }}
              >
                {/* Specular glare follows the pointer (CSS variables only) */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    opacity: 'var(--glare)',
                    background: `radial-gradient(400px circle at var(--mx) var(--my), ${theme.sheen}, transparent 80%)`,
                  }}
                />

                {/* Atmospheric background glow */}
                <div
                  className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${theme.glow} rounded-full blur-3xl pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Oversized outlined index numeral */}
                <span
                  aria-hidden="true"
                  className="project-ghost absolute -right-4 -top-6 text-[11rem] sm:text-[16rem] leading-none font-editorial-serif italic text-outline pointer-events-none select-none"
                >
                  {project.index}
                </span>

                {/* Top Row: Index and Category */}
                <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6 z-10">
                  <div className="flex items-center gap-3">
                    <span
                      style={{ color: theme.accent }}
                      className="text-3xl sm:text-5xl font-editorial-display font-bold tracking-tighter"
                    >
                      {project.index}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]" />
                    <span className={`text-xs uppercase tracking-widest font-editorial-display px-3 py-1 rounded-full border ${theme.badgeBg}`}>
                      {project.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#18181c] border border-white/5 text-[#a1a1aa] group-hover:border-white/20 transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Middle: title / description (+ architecture on large screens) */}
                <div className="relative py-8 my-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 mb-2">
                      <ProjectIcon style={{ color: theme.accent }} className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" />
                      <h3
                        aria-label={project.title}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-editorial-serif text-white tracking-tight group-hover:text-amber-300 transition-colors"
                      >
                        <SplitChars text={project.title} />
                      </h3>
                    </div>
                    <p style={{ color: theme.accent }} className="text-sm sm:text-base mt-2 font-light">
                      {project.subtitle}
                    </p>
                    <p className="mt-4 text-base sm:text-lg text-[#8e8e99] max-w-3xl font-light leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Architecture pipeline: real data, lit up step by step on scroll */}
                  <div className="hidden lg:block lg:col-span-5" aria-label="Architecture" hidden={!project.architecture}>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#71717a] font-editorial-display">
                      Architecture
                    </span>
                    <ol className="mt-4 relative border-l border-white/10 pl-5 space-y-4">
                      {(project.architecture ?? []).map((step, i) => (
                        <li key={step} className="arch-step relative text-sm text-[#d4d4d8] font-light leading-snug">
                          <span
                            className="absolute -left-[26px] top-1.5 w-2 h-2 rounded-full"
                            style={{ backgroundColor: theme.accent, boxShadow: `0 0 10px ${theme.accent}` }}
                          />
                          <span className="font-mono text-[10px] mr-2" style={{ color: theme.accent }}>
                            0{i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div
                  className="relative pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedProject(project)}
                      data-cursor="magnetic"
                      data-cursor-label="PLAY"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-[#e4e4e7] text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer active:scale-95"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Launch Interactive Playground</span>
                    </button>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="magnetic"
                        data-cursor-label="VISIT"
                        className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-[#18181c] hover:bg-[#222228] border border-[#27272a] text-xs uppercase tracking-wider text-white transition-colors"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="magnetic"
                      data-cursor-label="CODE"
                      className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#a1a1aa] hover:text-white transition-colors py-2"
                    >
                      <GithubIcon className="w-4 h-4" />
                      <span>Repository</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Darkening veil used when the next project covers this one */}
                <div className="project-dim absolute inset-0 bg-[#070709] opacity-0 pointer-events-none z-20" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Deep-Dive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
