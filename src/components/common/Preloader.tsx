import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Rapid, natural progression
        const increment = Math.floor(Math.random() * 18) + 8;
        return Math.min(prev + increment, 100);
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        }
      });

      tl.to('.preloader-content', {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: 'power3.in'
      })
      .to('.preloader-curtain', {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut'
      }, '-=0.2');
    }
  }, [progress, onComplete]);

  return (
    <div className="preloader-curtain fixed inset-0 z-50 flex flex-col justify-between bg-[#070709] p-8 md:p-16 text-[#f4f4f5]">
      {/* Top bar info */}
      <div className="preloader-content flex items-center justify-between text-xs tracking-widest uppercase text-[#71717a] font-editorial-display">
        <span>Portfolio 2026</span>
        <span>Diptanu Ghosh</span>
      </div>

      {/* Middle typography */}
      <div className="preloader-content flex flex-col items-center justify-center my-auto">
        <div className="overflow-hidden">
          <p className="text-xs uppercase tracking-[0.3em] text-[#a1a1aa] mb-3 text-center">
            Software • Intelligence • Systems
          </p>
        </div>
        <div className="overflow-hidden">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-editorial-serif italic text-white tracking-tight">
            Crafting with Precision
          </h1>
        </div>
      </div>

      {/* Bottom counter */}
      <div className="preloader-content flex items-end justify-between border-t border-white/10 pt-6">
        <div className="text-xs text-[#71717a] tracking-wider uppercase">
          Initializing Engine
        </div>
        <div className="text-4xl sm:text-6xl md:text-8xl font-editorial-display font-medium tabular-nums text-white">
          {String(progress).padStart(3, '0')}%
        </div>
      </div>
    </div>
  );
};
