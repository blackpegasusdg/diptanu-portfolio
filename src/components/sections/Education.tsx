import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { educationData } from '../../data/portfolioData';
import { GraduationCap, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export const Education: React.FC = () => {
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -4;
    const rotY = ((x - centerX) / centerX) * 4;

    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.01, 1.01, 1.01)`;
    setGlare({ x, y, opacity: 1 });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    setGlare({ x: 0, y: 0, opacity: 0 });
  };

  return (
    <section id="education" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#222227]/60">
      <SectionHeading
        index="05"
        tagline="Academic Formation"
        title="Education & Formal Foundations"
        description="Developing systematic computer science principles, algorithmic maturity, and systems design through formal coursework."
      />

      <div className="max-w-4xl">
        <div className="relative pl-6 sm:pl-8 border-l border-[#27272a] space-y-12">
          {/* Timeline node */}
          <div className="relative">
            <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#e4a853] ring-4 ring-[#0a0a0c]" />

            <div
              data-cursor-label="ACADEMICS"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-[#111114] border border-[#222227] hover:border-amber-400/40 transition-all duration-200 cursor-pointer will-change-transform shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
            >
              {/* Dynamic Specular Light Glare */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: glare.opacity,
                  background: `radial-gradient(350px circle at ${glare.x}px ${glare.y}px, rgba(228, 168, 83, 0.1), transparent 80%)`,
                }}
              />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181c] border border-white/10 text-xs font-mono text-[#e4a853]">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{educationData.degree}</span>
                  </span>
                  <span className="text-xs text-[#71717a] flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{educationData.period} • {educationData.status}</span>
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-editorial-serif text-white tracking-tight">
                  {educationData.institution}
                </h3>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#71717a] mt-2 mb-6 font-light">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{educationData.location}</span>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <h4 className="text-xs uppercase tracking-widest text-[#a1a1aa] font-editorial-display mb-3">
                    Academic Highlights & Focus
                  </h4>
                  <ul className="space-y-3">
                    {educationData.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#8e8e99] leading-relaxed font-light">
                        <CheckCircle2 className="w-4 h-4 text-[#e4a853] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
