import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomCursor } from './components/common/CustomCursor';
import { Preloader } from './components/common/Preloader';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Exploring } from './components/sections/Exploring';
import { Education } from './components/sections/Education';
import { Contact } from './components/sections/Contact';
import { ResumeModal } from './components/common/ResumeModal';
import { KineticMarquee } from './components/common/KineticMarquee';
import { DitheredPortraitCanvas } from './components/common/DitheredPortraitCanvas';
import { AmbientGlow } from './components/common/AmbientGlow';
import { GrainOverlay } from './components/common/GrainOverlay';
import { SoundToggle } from './components/common/SoundToggle';
import { SectionSounds } from './components/common/SectionSounds';
import { prefersReducedMotion, setLenis } from './lib/motion';

gsap.registerPlugin(ScrollTrigger);

// Section background chapters. Colours cross-fade continuously with scroll.
const CHAPTERS = [
  { id: 'about', bg: '#090a12' },
  { id: 'skills', bg: '#080c16' },
  { id: 'projects', bg: '#0d0d14' },
  { id: 'learning', bg: '#0b0a16' },
  { id: 'education', bg: '#090a10' },
  { id: 'contact', bg: '#08080a' },
];

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    let lenis: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;

    // Smooth scrolling is skipped entirely for reduced-motion visitors so the
    // browser's native scrolling (and anchor behaviour) is untouched.
    if (!reduced) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });
      setLenis(lenis);

      // One shared clock: Lenis is driven by GSAP's ticker, ScrollTrigger by Lenis.
      lenis.on('scroll', ScrollTrigger.update);
      tickerCallback = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    ScrollTrigger.config({ ignoreMobileResize: true });

    const ctx = gsap.context(() => {
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: reduced ? true : 0.3,
          },
          scaleX: 1,
          ease: 'none',
        });
      }

      // Continuous background colour: each boundary is a scrubbed cross-fade
      // rather than a hard switch.
      if (!reduced && mainRef.current) {
        let previous = '#070709';
        CHAPTERS.forEach(({ id, bg }) => {
          const el = document.getElementById(id);
          if (!el) return;
          gsap.fromTo(
            mainRef.current,
            { backgroundColor: previous },
            {
              backgroundColor: bg,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'top 35%',
                scrub: true,
              },
            }
          );
          previous = bg;
        });
      }
    });

    // Late layout changes (fonts, images, pinned sections) need a refresh so
    // every trigger measures the final layout.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
      if (tickerCallback) gsap.ticker.remove(tickerCallback);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  const marqueeKeywords = [
    'Systems Architecture',
    'Graph Neural Networks',
    'Retrieval-Augmented Generation',
    'Kotlin & Jetpack Compose',
    'Algorithmic Rigor',
    'Agentic AI Workflows',
  ];

  return (
    <div
      ref={mainRef}
      className="relative min-h-screen bg-[#070709] text-[#f4f4f5] selection:bg-[#27272a] selection:text-white"
    >
      {/* Precision Top Scroll Progress Bar */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#e4a853] z-50 origin-left scale-x-0 shadow-[0_0_10px_#e4a853]"
      />

      {/* Editorial subtle grid background */}
      <div className="fixed inset-0 pointer-events-none bg-editorial-grid z-0 opacity-40" />

      {/* Drifting coloured light that follows the page's chapters */}
      <AmbientGlow />

      {/* Scroll-Driven colour -> halftone -> dither portrait */}
      <DitheredPortraitCanvas />

      {/* Film grain over everything */}
      <GrainOverlay />

      {/* Intro Preloader */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* Desktop Magnetic Custom Cursor */}
      <CustomCursor />

      {/* Floating navigation + opt-in sound */}
      <Navbar onOpenResumeModal={() => setResumeModalOpen(true)} />
      <SoundToggle />
      <SectionSounds />

      {/* Main Content Sections */}
      <main className="relative z-10 flex flex-col">
        <Hero ready={!loading} onOpenResumeModal={() => setResumeModalOpen(true)} />
        <KineticMarquee items={marqueeKeywords} />
        <About />
        <Skills />
        <Projects />
        <Exploring />
        <Education />
        <Contact />
      </main>

      <Footer />

      {/* Interactive Resume View & Print Modal */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />
    </div>
  );
};

export default App;
