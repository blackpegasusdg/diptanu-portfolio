import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { exploringData } from '../../data/portfolioData';
import { Sparkles, BrainCircuit, Network, BookOpen, Binary } from 'lucide-react';

export const Exploring: React.FC = () => {
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

  return (
    <section id="learning" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#222227]/60">
      <SectionHeading
        index="04"
        tagline="Continuous Horizon"
        title="Active Frontiers & Areas of Study"
        description="The technologies, paradigms, and algorithmic foundations I am actively dissecting, prototyping, and integrating into my engineering practice."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exploringData.map((item) => (
          <div
            key={item.id}
            className="group relative p-8 rounded-3xl bg-[#111114] border border-[#222227] hover:border-[#383842] hover:bg-[#141418] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
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
            <div className="mt-8 pt-4 border-t border-white/5 text-[11px] text-[#71717a] leading-normal font-light">
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
