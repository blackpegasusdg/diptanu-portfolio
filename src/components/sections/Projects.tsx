import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../common/SectionHeading';
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

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Loop over cards and create subtle parallax scrub scaling
      cardsRef.current.forEach((card, index) => {
        if (!card || index === cardsRef.current.length - 1) return;

        gsap.to(card, {
          scrollTrigger: {
            trigger: cardsRef.current[index + 1],
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
          },
          scale: 0.93,
          opacity: 0.45,
          y: -20,
          filter: 'blur(3px)',
          ease: 'power1.out',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3D Card tilt handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardElement: HTMLDivElement) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    cardElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = (cardElement: HTMLDivElement) => {
    cardElement.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  const getProjectTheme = (id: string) => {
    switch (id) {
      case 'trustlens':
        return {
          icon: Shield,
          accent: '#38bdf8',
          borderHover: 'hover:border-[#38bdf8]/60',
          badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
          glow: 'from-sky-500/5 via-transparent to-transparent',
        };
      case 'gnn-fraud':
        return {
          icon: Network,
          accent: '#c084fc',
          borderHover: 'hover:border-[#c084fc]/60',
          badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
          glow: 'from-purple-500/5 via-transparent to-transparent',
        };
      case 'a10s-walkman':
        return {
          icon: Music2,
          accent: '#e4a853',
          borderHover: 'hover:border-[#e4a853]/60',
          badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
          glow: 'from-amber-500/5 via-transparent to-transparent',
        };
      default:
        return {
          icon: Sparkles,
          accent: '#e4a853',
          borderHover: 'hover:border-white/40',
          badgeBg: 'bg-white/10 text-white border-white/20',
          glow: 'from-white/5 via-transparent to-transparent',
        };
    }
  };

  return (
    <section
      id="projects"
      ref={containerRef}
      className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#222227]/60"
    >
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
              style={{
                top: `calc(7rem + ${idx * 24}px)`,
              }}
              onMouseMove={(e) => {
                if (cardsRef.current[idx]) {
                  handleMouseMove(e, cardsRef.current[idx]!);
                }
              }}
              onMouseLeave={() => {
                if (cardsRef.current[idx]) {
                  handleMouseLeave(cardsRef.current[idx]!);
                }
              }}
              className={`sticky group rounded-3xl bg-[#111114] border border-[#27272a] ${theme.borderHover} transition-all duration-500 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl will-change-transform flex flex-col justify-between overflow-hidden cursor-pointer`}
              onClick={() => setSelectedProject(project)}
            >
              {/* Atmospheric background glow */}
              <div
                className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${theme.glow} rounded-full blur-3xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Top Row: Index and Category */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6 z-10">
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

                {/* Technologies Badges */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#18181c] border border-white/5 text-[#a1a1aa]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Middle Section: Title, Subtitle, Description */}
              <div className="py-8 my-auto z-10">
                <div className="flex items-center gap-3 mb-2">
                  <ProjectIcon style={{ color: theme.accent }} className="w-6 h-6" />
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-editorial-serif text-white tracking-tight group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                </div>
                <p style={{ color: theme.accent }} className="text-sm sm:text-base mt-2 font-light">
                  {project.subtitle}
                </p>
                <p className="mt-4 text-base sm:text-lg text-[#8e8e99] max-w-3xl font-light leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Bottom Actions Row */}
              <div
                className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedProject(project)}
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
                    className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#a1a1aa] hover:text-white transition-colors py-2"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>Repository</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
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
