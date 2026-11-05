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

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Scroll progress bar indicator
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
        scaleX: 1,
        ease: 'none',
      });
    }

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
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
    <div className="relative min-h-screen bg-[#0a0a0c] text-[#f4f4f5] selection:bg-[#27272a] selection:text-white">
      {/* Precision Top Scroll Progress Bar */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#e4a853] z-50 origin-left scale-x-0 shadow-[0_0_10px_#e4a853]"
      />

      {/* Editorial subtle grid background */}
      <div className="fixed inset-0 pointer-events-none bg-editorial-grid z-0 opacity-40" />

      {/* Intro Preloader */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* Desktop Magnetic Custom Cursor */}
      <CustomCursor />

      {/* Sticky Editorial Navigation */}
      <Navbar onOpenResumeModal={() => setResumeModalOpen(true)} />

      {/* Main Content Sections */}
      <main className="relative z-10 flex flex-col">
        <Hero onOpenResumeModal={() => setResumeModalOpen(true)} />
        <KineticMarquee items={marqueeKeywords} />
        <About />
        <Skills />
        <Projects />
        <Exploring />
        <Education />
        <Contact />
      </main>

      {/* Minimalist Editorial Footer */}
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
