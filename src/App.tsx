import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './experience.css';
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

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = reduceMotion
      ? null
      : new Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.6,
        });

    const tickerCallback = (time: number) => {
      lenis?.raf(time * 1000);
    };

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    // Keep all page-level ScrollTriggers scoped and clean them up on unmount.
    const context = gsap.context(() => {
      if (!reduceMotion && progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.35,
          },
        });
      }

      // Subtle editorial reveal: section content settles into place as it enters view.
      if (!reduceMotion) {
        gsap.utils.toArray<HTMLElement>('main > section[id]:not(#home)').forEach((section) => {
          const content = Array.from(section.children).filter(
            (child): child is HTMLElement => child instanceof HTMLElement,
          );

          if (content.length) {
            gsap.fromTo(
              content,
              { y: 34, opacity: 0.18 },
              {
                y: 0,
                opacity: 1,
                ease: 'none',
                stagger: 0.06,
                scrollTrigger: {
                  trigger: section,
                  start: 'top 84%',
                  end: 'top 42%',
                  scrub: 0.7,
                  invalidateOnRefresh: true,
                },
              },
            );
          }
        });
      }

      // Let each chapter subtly shift the atmosphere without hard scene cuts.
      const sectionColors = [
        { id: 'home', bg: '#070709' },
        { id: 'about', bg: '#090a12' },
        { id: 'skills', bg: '#080c16' },
        { id: 'projects', bg: '#0d0d14' },
        { id: 'learning', bg: '#0b0a16' },
        { id: 'education', bg: '#090b12' },
        { id: 'contact', bg: '#08080a' },
      ];

      sectionColors.forEach(({ id, bg }) => {
        const section = document.getElementById(id);
        if (!section || !mainRef.current) return;

        ScrollTrigger.create({
          trigger: section,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => {
            if (mainRef.current) mainRef.current.style.backgroundColor = bg;
          },
          onEnterBack: () => {
            if (mainRef.current) mainRef.current.style.backgroundColor = bg;
          },
        });
      });
    }, mainRef);

    // Recalculate trigger positions after the browser has laid out the page.
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      context.revert();
      if (lenis) {
        gsap.ticker.remove(tickerCallback);
        lenis.destroy();
        gsap.ticker.lagSmoothing(500, 33);
      }
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
      className="relative min-h-screen bg-[#070709] text-[#f4f4f5] selection:bg-[#27272a] selection:text-white transition-colors duration-700 ease-out"
    >
      <div
        ref={progressBarRef}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#e4a853] z-50 origin-left scale-x-0 shadow-[0_0_10px_#e4a853]"
      />

      <div aria-hidden="true" className="fixed inset-0 pointer-events-none bg-editorial-grid z-0 opacity-40" />
      <div aria-hidden="true" className="experience-vignette" />
      <div aria-hidden="true" className="experience-grain" />

      <DitheredPortraitCanvas />

      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <CustomCursor />
      <Navbar onOpenResumeModal={() => setResumeModalOpen(true)} />

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

      <Footer />

      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />
    </div>
  );
};

export default App;
