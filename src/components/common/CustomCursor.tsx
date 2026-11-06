import React, { useEffect, useRef, useState } from 'react';
import { isCoarsePointer } from '../../lib/motion';

type Variant = 'default' | 'hover' | 'magnetic' | 'labeled' | 'draw' | 'text';

const SIZES: Record<Variant, number> = {
  default: 40,
  hover: 56,
  magnetic: 64,
  labeled: 96,
  draw: 80,
  text: 18,
};

/**
 * Desktop cursor: a sharp dot plus a damped follower that stretches along its
 * velocity, snaps toward magnetic targets and changes shape / label per
 * context (`data-cursor`, `data-cursor-label`, `data-cursor-variant`).
 * It is pointer-events:none and never hides the native cursor, so clicking
 * and text selection are untouched. Only rendered for fine pointers.
 */
export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const stretchRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [variant, setVariant] = useState<Variant>('default');
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (isCoarsePointer()) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let magnet: HTMLElement | null = null;
    let raf = 0;
    let shown = false;

    const loop = () => {
      raf = 0;
      let tx = mouseX;
      let ty = mouseY;
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        tx = mouseX + (r.left + r.width / 2 - mouseX) * 0.35;
        ty = mouseY + (r.top + r.height / 2 - mouseY) * 0.35;
      }

      const px = ringX;
      const py = ringY;
      ringX += (tx - ringX) * 0.18;
      ringY += (ty - ringY) * 0.18;

      const vx = ringX - px;
      const vy = ringY - py;
      const speed = Math.min(Math.hypot(vx, vy) / 38, 0.42);
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      if (stretchRef.current) {
        stretchRef.current.style.transform = `rotate(${angle}deg) scale(${1 + speed}, ${1 - speed * 0.45})`;
      }

      // Keep running only while the follower is still catching up.
      if (Math.abs(tx - ringX) > 0.15 || Math.abs(ty - ringY) > 0.15 || speed > 0.01) {
        raf = requestAnimationFrame(loop);
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!shown) {
        shown = true;
        ringX = mouseX;
        ringY = mouseY;
        setVisible(true);
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      kick();
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const labeled = target.closest<HTMLElement>('[data-cursor-label]');
      const magnetic = target.closest<HTMLElement>('[data-cursor="magnetic"]');
      const interactive = target.closest('a, button, [data-cursor="pointer"], select');
      const textField = target.closest('input, textarea, [contenteditable="true"]');

      magnet = magnetic;

      if (textField) {
        setLabel('');
        setVariant('text');
      } else if (labeled) {
        setLabel(labeled.getAttribute('data-cursor-label') || '');
        setVariant(labeled.getAttribute('data-cursor-variant') === 'draw' ? 'draw' : 'labeled');
      } else if (magnetic) {
        setLabel('');
        setVariant('magnetic');
      } else if (interactive) {
        setLabel('');
        setVariant('hover');
      } else {
        setLabel('');
        setVariant('default');
      }
      kick();
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => {
      shown = false;
      setVisible(false);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const size = SIZES[variant];
  const filled = variant === 'labeled' || variant === 'draw';

  const ringStyle: React.CSSProperties = {
    width: size,
    height: size,
    marginLeft: -size / 2,
    marginTop: -size / 2,
    transition:
      'width .3s cubic-bezier(.2,.8,.2,1), height .3s cubic-bezier(.2,.8,.2,1), margin .3s cubic-bezier(.2,.8,.2,1), background-color .25s, border-color .25s, opacity .25s',
    borderWidth: filled ? 0 : variant === 'magnetic' ? 2 : 1,
    borderStyle: 'solid',
    borderColor:
      variant === 'magnetic'
        ? 'rgba(228,168,83,0.8)'
        : variant === 'hover'
        ? 'rgba(255,255,255,0.6)'
        : 'rgba(255,255,255,0.3)',
    backgroundColor:
      variant === 'labeled'
        ? 'rgba(228,168,83,0.95)'
        : variant === 'draw'
        ? 'rgba(56,189,248,0.92)'
        : variant === 'magnetic'
        ? 'rgba(228,168,83,0.1)'
        : variant === 'hover'
        ? 'rgba(255,255,255,0.1)'
        : 'transparent',
    boxShadow: filled ? '0 0 30px rgba(228,168,83,0.45)' : undefined,
    opacity: variant === 'text' ? 0.5 : 1,
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-50 hidden md:block transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-amber-400 will-change-transform pointer-events-none"
        style={{
          opacity: filled ? 0 : 1,
          scale: pressed ? '0.5' : '1',
          transition: 'opacity .15s, scale .15s',
        }}
      />

      <div ref={ringRef} className="fixed top-0 left-0 will-change-transform pointer-events-none">
        <div
          ref={stretchRef}
          className="absolute top-0 left-0 rounded-full backdrop-blur-[1px]"
          style={{ ...ringStyle, scale: pressed ? '0.9' : '1' }}
        />
        {filled && label && (
          <span
            className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-[11px] font-mono font-bold tracking-widest uppercase text-black select-none whitespace-nowrap animate-fadeIn"
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
