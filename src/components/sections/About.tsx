import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../common/SectionHeading';
import { personalData } from '../../data/portfolioData';
import { Code2, Cpu, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);

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

      // Parallax entrance for pillars
      gsap.from('.about-card', {
        scrollTrigger: {
          trigger: '.about-pillars',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
      });
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
        description="I am an undergraduate Computer Science & Engineering student at Academy of Technology, focused on understanding computing from the ground up."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 mt-12">
        {/* Left Column: Interactive Scroll Scrubbed Manifesto & Story */}
        <div className="lg:col-span-7 flex flex-col gap-8 text-[#a1a1aa] text-base md:text-lg font-light leading-relaxed">
          {/* Scroll Illuminating Manifesto */}
          <div
            ref={manifestoRef}
            className="p-8 sm:p-10 rounded-3xl bg-[#111114]/80 border border-[#27272a] backdrop-blur-md"
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
            My engineering foundation is built on foundational programming—starting with the low-level mechanical sympathy of <strong className="text-white font-medium">C</strong>, extending into enterprise-grade Object-Oriented rigor and concurrency in <strong className="text-white font-medium">Java</strong>, and scaling into modern machine learning architectures in <strong className="text-white font-medium">Python</strong>.
          </p>

          <p>
            Whether developing native offline applications like <strong className="text-white font-medium">A10s Walkman</strong> in Kotlin & Jetpack Compose, or modeling topological anomalies in relational networks via <strong className="text-white font-medium">Graph Neural Networks</strong>, I care deeply about writing software that is performant, maintainable, and resilient.
          </p>

          <p>
            Outside code, my visual sense and attention to pacing are shaped by cinema. On{' '}
            <a
              href={personalData.socials.letterboxd}
              target="_blank"
              rel="noreferrer"
              className="text-[#00e054] hover:underline underline-offset-4 font-normal"
            >
              Letterboxd
            </a>
            , I explore storytelling and direction—traits that directly influence my philosophy toward user experience and digital craft.
          </p>
        </div>

        {/* Right Column: Core Engineering Pillars */}
        <div className="about-pillars lg:col-span-5 flex flex-col gap-4 justify-center">
          <div className="about-card p-6 sm:p-8 rounded-2xl bg-[#111114] border border-[#222227] hover:border-[#383842] transition-colors">
            <div className="flex items-center gap-3 mb-3 text-white">
              <span className="p-2.5 rounded-xl bg-[#18181c] border border-white/10 text-[#e4a853]">
                <Code2 className="w-5 h-5" />
              </span>
              <h3 className="font-editorial-display font-medium text-base">Algorithmic Foundations</h3>
            </div>
            <p className="text-sm text-[#71717a] leading-relaxed">
              Prioritizing asymptotic efficiency, robust data structures, and deterministic logic before adding abstraction layers.
            </p>
          </div>

          <div className="about-card p-6 sm:p-8 rounded-2xl bg-[#111114] border border-[#222227] hover:border-[#383842] transition-colors">
            <div className="flex items-center gap-3 mb-3 text-white">
              <span className="p-2.5 rounded-xl bg-[#18181c] border border-white/10 text-sky-400">
                <Cpu className="w-5 h-5" />
              </span>
              <h3 className="font-editorial-display font-medium text-base">Applied Intelligence & GNNs</h3>
            </div>
            <p className="text-sm text-[#71717a] leading-relaxed">
              Moving beyond flat tabular representations into non-euclidean relational graphs for high-stakes fraud and authenticity security.
            </p>
          </div>

          <div className="about-card p-6 sm:p-8 rounded-2xl bg-[#111114] border border-[#222227] hover:border-[#383842] transition-colors">
            <div className="flex items-center gap-3 mb-3 text-white">
              <span className="p-2.5 rounded-xl bg-[#18181c] border border-white/10 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h3 className="font-editorial-display font-medium text-base">Native Craft & Systems</h3>
            </div>
            <p className="text-sm text-[#71717a] leading-relaxed">
              Crafting smooth Android applications in Kotlin with Jetpack Compose that respect device resources and user privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
