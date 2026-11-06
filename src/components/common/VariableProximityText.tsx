import React, { useRef, useEffect, useState, useCallback } from 'react';

interface VariableProximityTextProps {
  text: string;
  className?: string;
  radius?: number;
  maxScale?: number;
  minScale?: number;
  highlightColor?: string;
  baseColor?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'span' | 'div' | 'p';
}

export const VariableProximityText: React.FC<VariableProximityTextProps> = ({
  text,
  className = '',
  radius = 120,
  maxScale = 1.35,
  minScale = 1.0,
  highlightColor = '#e4a853',
  tag: Tag = 'span',
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const rafRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  // Runs at most once per frame and skips work while the text is off-screen.
  const applyProximity = useCallback(() => {
    rafRef.current = 0;
    const container = containerRef.current;
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    if (bounds.bottom < -radius || bounds.top > window.innerHeight + radius) return;

    const { x: mouseX, y: mouseY } = pointerRef.current;

    letterRefs.current.forEach((letter) => {
      if (!letter) return;
      const rect = letter.getBoundingClientRect();
      const letterCenterX = rect.left + rect.width / 2;
      const letterCenterY = rect.top + rect.height / 2;

      const dist = Math.hypot(mouseX - letterCenterX, mouseY - letterCenterY);

      if (dist < radius) {
        const proximity = 1 - dist / radius; // 0 to 1
        const scale = minScale + (maxScale - minScale) * Math.pow(proximity, 1.8);
        const yOffset = -4 * Math.pow(proximity, 1.5);
        const glow = proximity * 0.9;

        letter.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${scale})`;
        letter.style.color = proximity > 0.3 ? highlightColor : '';
        letter.style.textShadow = glow > 0.2 ? `0 0 ${16 * glow}px ${highlightColor}88` : '';
        letter.style.fontWeight = proximity > 0.4 ? '800' : '';
      } else {
        letter.style.transform = 'translate3d(0, 0, 0) scale(1)';
        letter.style.color = '';
        letter.style.textShadow = '';
        letter.style.fontWeight = '';
      }
    });
  }, [radius, maxScale, minScale, highlightColor]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      if (!rafRef.current) rafRef.current = requestAnimationFrame(applyProximity);
    },
    [applyProximity]
  );

  const handleMouseLeave = useCallback(() => {
    letterRefs.current.forEach((letter) => {
      if (!letter) return;
      letter.style.transform = 'translate3d(0, 0, 0) scale(1)';
      letter.style.color = '';
      letter.style.textShadow = '';
      letter.style.fontWeight = '';
    });
  }, []);

  // For touch devices, trigger a wave ripple on tap
  const handleTouchWave = () => {
    letterRefs.current.forEach((letter, i) => {
      if (!letter) return;
      setTimeout(() => {
        letter.style.transform = `translate3d(0, -6px, 0) scale(${maxScale * 0.95})`;
        letter.style.color = highlightColor;
        letter.style.textShadow = `0 0 14px ${highlightColor}`;
        setTimeout(() => {
          letter.style.transform = 'translate3d(0, 0, 0) scale(1)';
          letter.style.color = '';
          letter.style.textShadow = '';
        }, 260);
      }, i * 35);
    });
  };

  useEffect(() => {
    if (isTouchDevice) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      if (container) {
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [handleMouseMove, handleMouseLeave, isTouchDevice]);

  // Split text into characters while preserving spaces
  const chars = text.split('');

  return (
    <Tag
      ref={containerRef as any}
      className={`inline-block select-none cursor-default ${className}`}
      onClick={handleTouchWave}
    >
      {chars.map((char, index) => {
        if (char === ' ') {
          return (
            <span key={index} className="inline-block">
              &nbsp;
            </span>
          );
        }
        return (
          <span
            key={index}
            ref={(el) => { letterRefs.current[index] = el; }}
            className="inline-block transition-transform duration-100 ease-out will-change-transform"
            style={{ display: 'inline-block' }}
          >
            {char}
          </span>
        );
      })}
    </Tag>
  );
};
