import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { FileText, Menu, X } from 'lucide-react';
import { personalData } from '../../data/portfolioData';
import { getLenis, prefersReducedMotion, scrollToTarget } from '../../lib/motion';
import { useActiveSection } from '../../lib/useActiveSection';

export const NAV_LINKS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Exploring', id: 'learning' },
  { label: 'Education', id: 'education' },
  { label: 'Contact', id: 'contact' },
];

const NAV_IDS = NAV_LINKS.map((l) => l.id);
const pad = (n: number) => String(n + 1).padStart(2, '0');

export const goToSection = (id: string) => {
  if (id === 'home') scrollToTarget(0);
  else scrollToTarget(`#${id}`);
};

interface NavbarProps {
  onOpenResumeModal: () => void;
}

/**
 * Floating navigation.
 * - Desktop: a pill that contracts to "DG  03 Projects" while scrolling and
 *   expands (animated width + staggered items) on hover / focus / at the top.
 *   A sliding indicator tracks the active section.
 * - Mobile: a thumb-reach bottom pill with a scroll-progress ring that opens
 *   a full-screen menu with a circular reveal.
 * - Near the page end both hide while the footer's own dock takes over.
 */
export const Navbar: React.FC<NavbarProps> = ({ onOpenResumeModal }) => {
  const active = useActiveSection(NAV_IDS);
  const activeIndex = Math.max(0, NAV_IDS.indexOf(active));
  const activeLabel = NAV_LINKS[activeIndex].label;

  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [docked, setDocked] = useState(false);

  const hoveringRef = useRef(false);
  const atTopRef = useRef(true);
  const closeTimer = useRef<number | undefined>(undefined);

  const deskWrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const mobWrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // ---- Scroll: compact / expand, progress ring ---------------------------
  useEffect(() => {
    const circumference = 2 * Math.PI * 14;
    const onScroll = () => {
      const y = window.scrollY;
      const top = y < 80;
      atTopRef.current = top;
      if (top) setExpanded(true);
      else if (!hoveringRef.current) setExpanded(false);

      if (ringRef.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, y / max) : 0;
        ringRef.current.style.strokeDashoffset = String(circumference * (1 - progress));
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ---- Footer docking ------------------------------------------------------
  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) => setDocked(entry.isIntersecting), {
      rootMargin: '0px 0px -20% 0px',
      threshold: 0,
    });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const dur = prefersReducedMotion() ? 0 : 0.8;
    if (deskWrapRef.current) {
      gsap.to(deskWrapRef.current, {
        y: docked ? -90 : 0,
        scale: docked ? 0.92 : 1,
        autoAlpha: docked ? 0 : 1,
        duration: dur,
        ease: 'expo.inOut',
      });
    }
    if (mobWrapRef.current) {
      gsap.to(mobWrapRef.current, {
        y: docked ? 120 : 0,
        autoAlpha: docked ? 0 : 1,
        duration: dur,
        ease: 'expo.inOut',
      });
    }
  }, [docked]);

  // ---- Desktop expand / contract -----------------------------------------
  useEffect(() => {
    const links = linksRef.current;
    const label = labelRef.current;
    if (!links || !label) return;
    const dur = prefersReducedMotion() ? 0 : 0.7;

    gsap.to(links, {
      width: expanded ? 'auto' : 0,
      opacity: expanded ? 1 : 0,
      duration: dur,
      ease: 'expo.inOut',
      overwrite: true,
    });
    gsap.to(label, {
      width: expanded ? 0 : 'auto',
      opacity: expanded ? 0 : 1,
      duration: dur * 0.75,
      ease: 'expo.inOut',
      overwrite: true,
    });

    if (expanded && dur > 0) {
      gsap.fromTo(
        links.querySelectorAll('.nav-item'),
        { yPercent: 70, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.04, duration: 0.7, ease: 'expo.out', delay: 0.12, overwrite: 'auto' }
      );
    }
  }, [expanded]);

  // ---- Sliding active indicator -----------------------------------------
  const moveIndicator = useCallback(() => {
    const el = linkRefs.current[activeIndex];
    const ind = indicatorRef.current;
    if (!el || !ind) return;
    gsap.to(ind, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      duration: prefersReducedMotion() ? 0 : 0.6,
      ease: 'expo.out',
      overwrite: 'auto',
    });
  }, [activeIndex]);

  useEffect(() => {
    moveIndicator();
    window.addEventListener('resize', moveIndicator);
    return () => window.removeEventListener('resize', moveIndicator);
  }, [moveIndicator]);

  const open = () => {
    hoveringRef.current = true;
    window.clearTimeout(closeTimer.current);
    setExpanded(true);
  };
  const scheduleClose = () => {
    hoveringRef.current = false;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      if (!atTopRef.current && !hoveringRef.current) setExpanded(false);
    }, 600);
  };

  // ---- Mobile overlay ------------------------------------------------------
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const items = overlay.querySelectorAll('.menu-item');
    const instant = prefersReducedMotion();

    if (menuOpen) {
      const lenis = getLenis();
      lenis?.stop();
      if (!lenis) document.documentElement.style.overflow = 'hidden';
      gsap.killTweensOf([overlay, items]);
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.fromTo(
        overlay,
        { clipPath: 'circle(0% at 50% 94%)' },
        { clipPath: 'circle(150% at 50% 94%)', duration: instant ? 0 : 0.9, ease: 'expo.inOut' }
      );
      gsap.fromTo(
        items,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: instant ? 0 : 0.9, stagger: 0.06, delay: instant ? 0 : 0.3, ease: 'expo.out' }
      );
    } else {
      getLenis()?.start();
      document.documentElement.style.overflow = '';
      gsap.to(overlay, {
        clipPath: 'circle(0% at 50% 94%)',
        duration: instant ? 0 : 0.6,
        ease: 'expo.inOut',
        onComplete: () => {
          gsap.set(overlay, { autoAlpha: 0 });
        },
      });
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(
    () => () => {
      getLenis()?.start();
      document.documentElement.style.overflow = '';
    },
    []
  );

  const handleNav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    // Let the overlay start closing, then travel.
    window.setTimeout(() => goToSection(id), menuOpen ? 250 : 0);
  };

  return (
    <>
      {/* ---------- Desktop floating pill ---------- */}
      <div
        ref={deskWrapRef}
        className="hidden lg:block fixed top-5 left-1/2 z-40"
        style={{ translate: '-50% 0' }}
      >
        <nav
          aria-label="Primary"
          onMouseEnter={open}
          onMouseLeave={scheduleClose}
          onFocus={open}
          onBlur={scheduleClose}
          className="flex items-center gap-1 rounded-full border border-white/10 bg-[#0c0c10]/80 p-1.5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.55)]"
        >
          <a
            href="#home"
            data-cursor="magnetic"
            data-cursor-label="DIPTANU"
            aria-label={`${personalData.name} — back to top`}
            onClick={(e) => handleNav(e, 'home')}
            className="shrink-0 w-10 h-10 rounded-full bg-[#18181c] border border-[#27272a] hover:border-amber-400/60 flex items-center justify-center font-editorial-display font-bold text-sm tracking-tighter text-white transition-colors"
          >
            DG
          </a>

          {/* Compact state: current chapter */}
          <div ref={labelRef} className="overflow-hidden whitespace-nowrap" style={{ width: 0, opacity: 0 }}>
            <div className="flex items-center gap-3 px-4 text-[11px] uppercase tracking-[0.22em]">
              <span className="text-amber-400 font-mono">{pad(activeIndex)}</span>
              <span className="text-white">{activeLabel}</span>
              <span className="flex gap-[3px]" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-[3px] h-[3px] rounded-full bg-white/40" />
                ))}
              </span>
            </div>
          </div>

          {/* Expanded state: all destinations */}
          <div ref={linksRef} className="overflow-hidden" style={{ width: 'auto' }}>
            <div className="relative flex items-center whitespace-nowrap">
              <span
                ref={indicatorRef}
                aria-hidden="true"
                className="absolute top-1/2 left-0 h-8 -translate-y-1/2 rounded-full bg-white/10 border border-white/10 pointer-events-none"
                style={{ width: 0 }}
              />
              {NAV_LINKS.map((link, i) => {
                const isActive = link.id === active;
                return (
                  <a
                    key={link.id}
                    ref={(el) => {
                      linkRefs.current[i] = el;
                    }}
                    href={`#${link.id}`}
                    data-cursor="magnetic"
                    data-cursor-label={link.label.toUpperCase()}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={(e) => handleNav(e, link.id)}
                    className="nav-item relative z-10 px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors"
                    style={{ color: isActive ? '#ffffff' : '#a1a1aa' }}
                  >
                    {link.label}
                  </a>
                );
              })}
              <button
                type="button"
                onClick={onOpenResumeModal}
                data-cursor="magnetic"
                data-cursor-label="RESUME"
                className="nav-item ml-1 mr-0.5 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black hover:bg-amber-300 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ---------- Mobile / tablet floating pill ---------- */}
      <div
        ref={mobWrapRef}
        className="lg:hidden fixed bottom-5 left-1/2 z-40"
        style={{ translate: '-50% 0' }}
      >
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#0c0c10]/85 py-1.5 pl-2 pr-1.5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <span className="relative w-9 h-9 shrink-0" aria-hidden="true">
            <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
              <circle
                ref={ringRef}
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#e4a853"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 14}
                strokeDashoffset={2 * Math.PI * 14}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white">
              {pad(activeIndex)}
            </span>
          </span>
          <span className="min-w-[5.5rem] text-[11px] uppercase tracking-[0.22em] text-white">
            {activeLabel}
          </span>
          <button
            ref={menuBtnRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen((v) => !v)}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ---------- Mobile full-screen menu ---------- */}
      <div
        id="mobile-menu"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!menuOpen}
        className="lg:hidden fixed inset-0 z-[38] bg-[#08080b] flex flex-col justify-between px-7 pt-24 pb-32 overflow-y-auto"
        style={{ visibility: 'hidden', opacity: 0 }}
      >
        <ul className="flex flex-col">
          {NAV_LINKS.map((link, i) => (
            <li key={link.id} className="overflow-hidden border-b border-white/5">
              <a
                href={`#${link.id}`}
                onClick={(e) => handleNav(e, link.id)}
                tabIndex={menuOpen ? 0 : -1}
                className="menu-item flex items-baseline justify-between py-3 text-[2.6rem] leading-none font-editorial-serif italic tracking-tight"
                style={{ color: link.id === active ? '#e4a853' : '#ffffff' }}
              >
                <span>{link.label}</span>
                <span className="text-xs font-mono not-italic text-[#71717a]">{pad(i)}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="menu-item mt-8 flex flex-col gap-4">
          <button
            type="button"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => {
              setMenuOpen(false);
              onOpenResumeModal();
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-white text-black font-medium text-xs uppercase tracking-wider active:scale-95"
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>View Full Resume</span>
          </button>
          <div className="flex items-center justify-between text-xs text-[#71717a]">
            <span>{personalData.locationDetailed}</span>
            <span className="text-emerald-400">Available</span>
          </div>
        </div>
      </div>
    </>
  );
};
