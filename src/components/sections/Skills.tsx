import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { skillsData } from '../../data/portfolioData';


export const Skills: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', ...skillsData.map((c) => c.name)];

  const displayedSkills =
    activeTab === 'All'
      ? skillsData.flatMap((c) => c.skills.map((s) => ({ ...s, category: c.name })))
      : skillsData
          .find((c) => c.name === activeTab)
          ?.skills.map((s) => ({ ...s, category: activeTab })) || [];

  return (
    <section id="skills" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#222227]/60">
      <SectionHeading
        index="02"
        tagline="Technical Arsenal"
        title="Focused Mastery Across Core Disciplines"
        description="Structured engineering knowledge grounded in principles, not superficial buzzwords. No artificial percentage bars."
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-12 border-b border-[#222227] pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all duration-200 ${
              activeTab === cat
                ? 'bg-white text-black font-semibold'
                : 'bg-[#141418] text-[#a1a1aa] hover:text-white border border-[#222227] hover:border-white/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skill Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {displayedSkills.map((skill, idx) => (
          <div
            key={`${skill.name}-${idx}`}
            className="group relative p-6 rounded-2xl bg-[#111114] border border-[#222227] hover:border-[#3f3f46] hover:bg-[#141418] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Category chip & Level */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-widest text-[#71717a] font-editorial-display font-medium">
                  {skill.category}
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#1c1c22] border border-white/5 text-[#a1a1aa] font-mono">
                  {skill.level}
                </span>
              </div>

              {/* Skill Name */}
              <h3 className="text-xl font-editorial-serif text-white tracking-tight group-hover:text-[#e4a853] transition-colors">
                {skill.name}
              </h3>

              {/* Description */}
              <p className="mt-2 text-xs sm:text-sm text-[#8e8e99] font-light leading-relaxed">
                {skill.description}
              </p>
            </div>

            {/* Subtle bottom indicator */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-[#71717a]">
              <span>Production / Academic</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3f3f46] group-hover:bg-[#e4a853] transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

