import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../common/SectionHeading';
import { Code2, Cpu, ShieldCheck, X, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface InsightToken {
  id: string;
  trigger: string;
  title: string;
  detail: string;
  accent: string;
}

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const [activeInsight, setActiveInsight] = useState<InsightToken | null>(null);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  const insightTokens: InsightToken[] = [
    {
      id: 'c-lang',
      trigger: 'mechanical sympathy of C',
      title: 'Low-Level Mechanical Sympathy',
      detail: 'Working directly with memory addresses, pointer arithmetic, and CPU cache locality to understand the true physical cost of every abstraction before writing high-level code.',
      accent: '#e4a853'
    },
    {
      id: 'java-oop',
      trigger: 'concurrency in Java',
      title: 'Enterprise Concurrency & OOP',
      detail: 'Leveraging Java for memory-conscious data structures, multi-threading synchronization, thread pools, and designing resilient Object-Oriented architectures.',
      accent: '#38bdf8'
    },
    {
      id: 'gnn-sec',
      trigger: 'Graph Neural Networks',
      title: 'Non-Euclidean Relational ML',
      detail: 'Traditional models treat transactions as independent rows. GNNs capture relational message passing across complex, multi-hop laundering and sybil rings in dynamic topological payment graphs.',
      accent: '#c084fc'
    },
    {
      id: 'letterboxd',
      trigger: 'Letterboxd',
      title: 'Cinematic Rhythm in Software',
      detail: 'Cinema teaches composition, negative space, pacing, and tension. I channel film direction directly into micro-interactions, motion curves, and user experience storytelling.',
      accent: '#00e054'
    }
  ];

  useEffect(() => {
    if (!sectionRef.current || !manifestoRef.current) return;

    const ctx = gsap.context(() => {
      // Scrubbed word illumination on scroll
      const words = manifestoRef.current?.querySelectorAll('.scroll-word');
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          { opacity: 0.2, y: 3 },
          {
            scrollTrigger: {
              trigger: manifestoRef.current,
              start: 'top 75%',
              end: 'bottom 45%',
              scrub: 0.8,
            },
            opacity: 1,
            y: 0,
            stagger: 0.04,
            ease: 'none',
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const manifestoText =
    "Software is not merely about stitching libraries together. It is about architectural discipline, memory efficiency, and mathematical truth. Computing is most rewarding when designed with structural integrity from the fundamental layer upward.";

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#222227]/60"
    >
      <SectionHeading
        index="01"
        tagline="Philosophy & Background"
        title="Engineering Rigor Meets Creative Depth"
        description="I am an undergraduate Computer Science & Engineering student at Academy of Technology. Tap underlined concepts to discover the architectural principles beneath."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 mt-12">
        {/* Left Column: Interactive Scroll Scrubbed Manifesto & Story */}
        <div className="lg:col-span-7 flex flex-col gap-8 text-[#a1a1aa] text-base md:text-lg font-light leading-relaxed">
          {/* Scroll Illuminating Manifesto */}
          <div
            ref={manifestoRef}
            data-cursor-label="PHILOSOPHY"
            className="p-8 sm:p-10 rounded-3xl bg-[#111114]/80 border border-[#27272a] hover:border-amber-400/40 transition-colors backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            <span className="text-[11px] uppercase tracking-widest text-[#e4a853] font-editorial-display block mb-4">
              Core Tenet • Scroll to Illuminate
            </span>
            <p className="text-2xl sm:text-3xl md:text-4xl font-editorial-serif italic leading-snug">
              {manifestoText.split(' ').map((word, index) => (
                <span
                  key={index}
                  className="scroll-word inline-block mr-2 will-change-opacity text-white transition-opacity"
                >
                  {word}
                </span>
              ))}
            </p>
          </div>

          <p>
            My engineering foundation is built on foundational programming—starting with the low-level{' '}
            <button
              onClick={() => setActiveInsight(insightTokens[0])}
              data-cursor="magnetic"
              data-cursor-label="C CODE"
              className="text-white font-medium underline underline-offset-4 decoration-[#e4a853] hover:text-[#e4a853] transition-colors cursor-pointer"
            >
              mechanical sympathy of C
            </button>
            , extending into enterprise-grade Object-Oriented rigor and{' '}
            <button
              onClick={() => setActiveInsight(insightTokens[1])}
              data-cursor="magnetic"
              data-cursor-label="JAVA"
              className="text-white font-medium underline underline-offset-4 decoration-[#38bdf8] hover:text-[#38bdf8] transition-colors cursor-pointer"
            >
              concurrency in Java
            </button>
            , and scaling into modern machine learning architectures in <strong className="text-white font-medium">Python</strong>.
          </p>

          <p>
            Whether developing native offline applications like <strong className="text-white font-medium">A10s Walkman</strong> in Kotlin & Jetpack Compose, or modeling topological anomalies in relational networks via{' '}
            <button
              onClick={() => setActiveInsight(insightTokens[2])}
              data-cursor="magnetic"
              data-cursor-label="GNN"
              className="text-white font-medium underline underline-offset-4 decoration-[#c084fc] hover:text-[#c084fc] transition-colors cursor-pointer"
            >
              Graph Neural Networks
            </button>
            , I care deeply about writing software that is performant, maintainable, and resilient.
          </p>

          <p>
            Outside code, my visual sense and attention to pacing are shaped by cinema. On{' '}
            <button
              onClick={() => setActiveInsight(insightTokens[3])}
              data-cursor="magnetic"
              data-cursor-label="FILM"
              className="text-[#00e054] underline underline-offset-4 hover:text-white transition-colors cursor-pointer font-medium"
            >
              Letterboxd
            </button>
            , I explore storytelling and direction—traits that directly influence my philosophy toward user experience and digital craft.
          </p>

          {/* Interactive Insight Drawer Popover */}
          {activeInsight && (
            <div className="p-6 rounded-2xl bg-[#16161c] border border-white/20 animate-in fade-in slide-in-from-top-4 duration-200 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between mb-3">
                <span
                  style={{ color: activeInsight.accent }}
                  className="text-xs uppercase tracking-widest font-editorial-display font-semibold"
                >
                  Deep Discovery • {activeInsight.title}
                </span>
                <button
                  onClick={() => setActiveInsight(null)}
                  className="p-1 rounded-full text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-[#e4e4e7] font-light leading-relaxed">
                {activeInsight.detail}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Expandable Engineering Pillars (Tap to Expand) */}
        <div className="lg:col-span-5 flex flex-col gap-4 justify-center">
          {/* Pillar 1 */}
          <div
            onClick={() => setExpandedPillar(expandedPillar === 'alg' ? null : 'alg')}
            data-cursor-label="EXPAND"
            className={`p-6 sm:p-8 rounded-2xl bg-[#111114] border transition-all duration-300 cursor-pointer active:scale-[0.99] ${
              expandedPillar === 'alg'
                ? 'border-[#e4a853] bg-[#141418] shadow-[0_0_25px_rgba(228,168,83,0.15)]'
                : 'border-[#222227] hover:border-[#383842]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <span className="p-2.5 rounded-xl bg-[#18181c] border border-white/10 text-[#e4a853]">
                  <Code2 className="w-5 h-5" />
                </span>
                <h3 className="font-editorial-display font-medium text-base">Algorithmic Foundations</h3>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-[#71717a] transition-transform duration-300 ${
                  expandedPillar === 'alg' ? 'rotate-90 text-[#e4a853]' : ''
                }`}
              />
            </div>
            <p className="text-sm text-[#71717a] mt-3 leading-relaxed">
              Prioritizing asymptotic efficiency, robust data structures, and deterministic logic before adding abstraction layers.
            </p>
            {expandedPillar === 'alg' && (
              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-[#d4d4d8] space-y-1.5 animate-in fade-in duration-200">
                <p>• Mastery of Tree/Graph Traversals & Dynamic Programming</p>
                <p>• Memory-conscious runtime profiling in high-load pipelines</p>
              </div>
            )}
          </div>

          {/* Pillar 2 */}
          <div
            onClick={() => setExpandedPillar(expandedPillar === 'gnn' ? null : 'gnn')}
            data-cursor-label="EXPAND"
            className={`p-6 sm:p-8 rounded-2xl bg-[#111114] border transition-all duration-300 cursor-pointer active:scale-[0.99] ${
              expandedPillar === 'gnn'
                ? 'border-sky-400 bg-[#141418] shadow-[0_0_25px_rgba(56,189,248,0.15)]'
                : 'border-[#222227] hover:border-[#383842]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <span className="p-2.5 rounded-xl bg-[#18181c] border border-white/10 text-sky-400">
                  <Cpu className="w-5 h-5" />
                </span>
                <h3 className="font-editorial-display font-medium text-base">Applied Intelligence & GNNs</h3>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-[#71717a] transition-transform duration-300 ${
                  expandedPillar === 'gnn' ? 'rotate-90 text-sky-400' : ''
                }`}
              />
            </div>
            <p className="text-sm text-[#71717a] mt-3 leading-relaxed">
              Moving beyond flat tabular representations into non-euclidean relational graphs for high-stakes fraud and authenticity security.
            </p>
            {expandedPillar === 'gnn' && (
              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-[#d4d4d8] space-y-1.5 animate-in fade-in duration-200">
                <p>• PyTorch Geometric spatial message-passing implementations</p>
                <p>• Relational Sybil & Smurfing Ring anomaly classification</p>
              </div>
            )}
          </div>

          {/* Pillar 3 */}
          <div
            onClick={() => setExpandedPillar(expandedPillar === 'sys' ? null : 'sys')}
            data-cursor-label="EXPAND"
            className={`p-6 sm:p-8 rounded-2xl bg-[#111114] border transition-all duration-300 cursor-pointer active:scale-[0.99] ${
              expandedPillar === 'sys'
                ? 'border-emerald-400 bg-[#141418] shadow-[0_0_25px_rgba(52,211,153,0.15)]'
                : 'border-[#222227] hover:border-[#383842]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <span className="p-2.5 rounded-xl bg-[#18181c] border border-white/10 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h3 className="font-editorial-display font-medium text-base">Native Craft & Systems</h3>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-[#71717a] transition-transform duration-300 ${
                  expandedPillar === 'sys' ? 'rotate-90 text-emerald-400' : ''
                }`}
              />
            </div>
            <p className="text-sm text-[#71717a] mt-3 leading-relaxed">
              Crafting smooth Android applications in Kotlin with Jetpack Compose that respect device resources and user privacy.
            </p>
            {expandedPillar === 'sys' && (
              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-[#d4d4d8] space-y-1.5 animate-in fade-in duration-200">
                <p>• Uncompressed buffer rendering for bit-perfect FLAC</p>
                <p>• Declarative state management with zero background telemetry</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
