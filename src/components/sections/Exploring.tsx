import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { exploringData } from '../../data/portfolioData';
import { Sparkles, BrainCircuit, Network, BookOpen, Binary } from 'lucide-react';

export const Exploring: React.FC = () => {
  const [cardGlares, setCardGlares] = useState<{ [key: string]: { x: number; y: number; opacity: number } }>({});

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

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -5;
    const rotY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;

    setCardGlares((prev) => ({
      ...prev,
      [id]: { x, y, opacity: 1 },
    }));
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    setCardGlares((prev) => ({
      ...prev,
      [id]: { ...prev[id], opacity: 0 },
    }));
  };

  return (
    <section id="learning" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#222227]/60">
      <SectionHeading
        index="04"
        tagline="Continuous Horizon"
        title="Active Frontiers & Areas of Study"
        description="The technologies, paradigms, and algorithmic foundations I am actively dissecting, prototyping, and integrating into my engineering practice."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exploringData.map((item) => {
          const glare = cardGlares[item.id] || { x: 0, y: 0, opacity: 0 };

          return (
            <div
              key={item.id}
              data-cursor-label="STUDY"
              onMouseMove={(e) => handleCardMouseMove(e, item.id)}
              onMouseLeave={(e) => handleCardMouseLeave(e, item.id)}
              className="relative overflow-hidden group p-8 rounded-3xl bg-[#111114] border border-[#222227] hover:border-white/30 hover:bg-[#141418] transition-all duration-200 flex flex-col justify-between cursor-pointer will-change-transform"
            >
              {/* Dynamic Specular Light Glare */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: glare.opacity,
                  background: `radial-gradient(260px circle at ${glare.x}px ${glare.y}px, rgba(255,255,255,0.08), transparent 80%)`,
                }}
              />

              <div className="relative z-10">
                {/* Category & Status */}
                <div className="flex items-center justify-between mb-6">
                  <span className="p-2.5 rounded-xl bg-[#18181c] border border-white/10 group-hover:border-white/20 transition-colors">
                    {getIcon(item.id)}
                  </span>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#1c1c22] border border-white/5 text-[#a1a1aa]">
                    {item.status}
                  </span>
                </div>

                {/* Title & Category */}
                <span className="text-[11px] uppercase tracking-widest text-[#71717a] font-editorial-display block mb-1">
                  {item.category}
                </span>
                <h3 className="text-2xl font-editorial-serif text-white tracking-tight group-hover:text-[#e4a853] transition-colors">
                  {item.topic}
                </h3>

                {/* Focus text */}
                <p className="mt-3 text-xs sm:text-sm text-[#d4d4d8] font-light leading-relaxed">
                  {item.focus}
                </p>
              </div>

              {/* Bottom detail note */}
              <div className="relative z-10 mt-8 pt-4 border-t border-white/5 text-[11px] text-[#71717a] leading-normal font-light">
                {item.description}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
