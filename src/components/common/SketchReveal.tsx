import React, { useEffect, useRef } from 'react';
import { personalData } from '../../data/portfolioData';
import { prefersReducedMotion } from '../../lib/motion';

const COVER = '#0d0d11';

/**
 * Hidden sketch interaction. A dark dithered layer covers a hidden message;
 * moving the pointer across it (or dragging on touch) erases the cover and
 * the trail slowly grows back. The canvas is pointer-events:none and the
 * wrapper uses touch-action: pan-y, so page scrolling, clicking and text
 * selection are never blocked.
 */
export const SketchReveal: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!wrap || !canvas || !ctx) return;

    const reduced = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let raf = 0;
    let lastDraw = 0;
    let lx = -1;
    let ly = -1;

    const paintCover = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = COVER;
      ctx.fillRect(0, 0, w, h);
      // Sparse dither dots so the cover reads as "pixel" material, not flat.
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (let y = 0; y < h; y += 8) {
        for (let x = (y / 8) % 2 ? 4 : 0; x < w; x += 8) ctx.fillRect(x, y, 1.5, 1.5);
      }
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintCover();
    };

    const loop = (now: number) => {
      raf = 0;
      if (!reduced) {
        // Slowly regrow the cover so the trail fades like a breath on glass.
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(13,13,17,0.012)';
        ctx.fillRect(0, 0, w, h);
      }
      if (now - lastDraw < 4200) {
        raf = requestAnimationFrame(loop);
      } else if (!reduced) {
        paintCover();
      }
    };

    const draw = (x: number, y: number, big: boolean) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = big ? 90 : 46;
      ctx.beginPath();
      ctx.moveTo(lx < 0 ? x : lx, ly < 0 ? y : ly);
      ctx.lineTo(x + 0.01, y);
      ctx.stroke();
      lx = x;
      ly = y;
      lastDraw = performance.now();
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const local = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onMove = (e: PointerEvent) => {
      const { x, y } = local(e);
      draw(x, y, false);
    };
    const onDown = (e: PointerEvent) => {
      const { x, y } = local(e);
      lx = -1;
      draw(x, y, true); // tap stamps a larger reveal (helps on touch)
    };
    const onLeave = () => {
      lx = -1;
      ly = -1;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    wrap.addEventListener('pointermove', onMove, { passive: true });
    wrap.addEventListener('pointerdown', onDown, { passive: true });
    wrap.addEventListener('pointerleave', onLeave);

    return () => {
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerdown', onDown);
      wrap.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      data-cursor-label="TRACE"
      data-cursor-variant="draw"
      className="relative h-56 sm:h-72 mb-12 lg:mb-16 rounded-3xl overflow-hidden border border-white/10 bg-[#0d0d11] select-none"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Hidden layer, only visible where the cover has been erased */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-[radial-gradient(ellipse_at_center,rgba(228,168,83,0.28),rgba(56,189,248,0.12)_45%,transparent_75%)]">
        <span className="text-4xl sm:text-6xl font-editorial-serif italic text-white tracking-tight">
          Say hello.
        </span>
        <span className="mt-3 text-xs sm:text-sm font-mono text-amber-200/90 break-all">
          {personalData.email}
        </span>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />

      <span className="absolute bottom-3 left-4 text-[10px] font-mono uppercase tracking-[0.25em] text-white/25 pointer-events-none">
        Leave a trace
      </span>
    </div>
  );
};
