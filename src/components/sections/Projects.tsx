import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../common/SectionHeading';
import { projectsData } from '../../data/portfolioData';
import type { Project } from '../../types/portfolio';
import { ProjectModal } from './ProjectModal';
import { ArrowUpRight, ExternalLink, SlidersHorizontal } from 'lucide-react';
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
        description="Crafted software projects with architectural depth, real-world utility, and verified codebases. Experience sticky card depth on scroll."
      />

      <div className="relative space-y-16 md:space-y-24">
        {projectsData.map((project, idx) => (
          <div
            key={project.id}
            ref={(el) => { cardsRef.current[idx] = el; }}
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
            className="sticky group rounded-3xl bg-[#111114] border border-[#27272a] hover:border-[#4b4b56] transition-shadow duration-500 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl will-change-transform flex flex-col justify-between"
          >
            {/* Top Row: Index and Category */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-5xl font-editorial-display font-bold text-[#e4a853] tracking-tighter">
                  {project.index}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]" />
                <span className="text-xs uppercase tracking-widest text-[#a1a1aa] font-editorial-display">
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
            <div className="py-8 my-auto">
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-editorial-serif text-white tracking-tight group-hover:text-white transition-colors">
                {project.title}
              </h3>
              <p className="text-sm sm:text-base text-[#e4a853] mt-2 font-light">
                {project.subtitle}
              </p>
              <p className="mt-4 text-base sm:text-lg text-[#8e8e99] max-w-3xl font-light leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-[#e4e4e7] text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer active:scale-95"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Inspect & Try Project</span>
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
        ))}
      </div>

      {/* Project Deep-Dive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

