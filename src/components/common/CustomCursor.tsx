import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'magnetic' | 'labeled'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const labeledEl = target.closest('[data-cursor-label]') as HTMLElement | null;
      const magneticEl = target.closest('[data-cursor="magnetic"]') as HTMLElement | null;
      const interactiveEl = target.closest('a, button, [data-cursor="pointer"], input, textarea, select') as HTMLElement | null;

      if (labeledEl) {
        const label = labeledEl.getAttribute('data-cursor-label') || '';
        setCursorLabel(label);
        setCursorVariant('labeled');
      } else if (magneticEl) {
        setCursorLabel('');
        setCursorVariant('magnetic');
      } else if (interactiveEl) {
        setCursorLabel('');
        setCursorVariant('hover');
      } else {
        setCursorLabel('');
        setCursorVariant('default');
      }
    };

    const render = () => {
      // If hovering magnetic element, pull cursor slightly towards center
      const magneticTarget = document.querySelector(':hover[data-cursor="magnetic"]') as HTMLElement | null;
      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        targetX = mouseX + (centerX - mouseX) * 0.35;
        targetY = mouseY + (centerY - mouseY) * 0.35;
      } else {
        targetX = mouseX;
        targetY = mouseY;
      }

      // Smooth dampening lerp
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 hidden md:block ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Center sharp dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-amber-400 will-change-transform pointer-events-none transition-all duration-150 ${
          cursorVariant === 'labeled' ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        } ${isClicking ? 'scale-50' : ''}`}
      />

      {/* Smooth outer follower badge / ring */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 will-change-transform pointer-events-none flex items-center justify-center transition-all duration-300 ease-out ${
          cursorVariant === 'labeled'
            ? 'w-24 h-24 -ml-12 -mt-12 rounded-full bg-amber-500/95 text-black font-black shadow-[0_0_30px_rgba(228,168,83,0.6)] backdrop-blur-md scale-100'
            : cursorVariant === 'magnetic'
            ? 'w-16 h-16 -ml-8 -mt-8 rounded-full border-2 border-amber-400/80 bg-amber-400/10 scale-110 shadow-[0_0_20px_rgba(228,168,83,0.3)]'
            : cursorVariant === 'hover'
            ? 'w-14 h-14 -ml-7 -mt-7 rounded-full border border-white/60 bg-white/10 scale-105 backdrop-blur-[2px]'
            : 'w-10 h-10 -ml-5 -mt-5 rounded-full border border-white/30 scale-100'
        } ${isClicking ? 'scale-90' : ''}`}
      >
        {cursorVariant === 'labeled' && cursorLabel && (
          <span className="text-[11px] font-mono tracking-widest uppercase select-none animate-fadeIn">
            {cursorLabel}
          </span>
        )}
      </div>
    </div>
  );
};
