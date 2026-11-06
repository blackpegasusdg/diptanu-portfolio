import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData } from '../../data/portfolioData';
import { ArrowUp } from 'lucide-react';
import { GithubIcon, InstagramIcon, LetterboxdIcon } from '../common/BrandIcons';
import { SplitChars } from '../common/SplitChars';
import { NAV_LINKS, goToSection } from './Navbar';
import { prefersReducedMotion, scrollToTarget } from '../../lib/motion';
import { useActiveSection } from '../../lib/useActiveSection';
import { useCharDrift } from '../../lib/useCharDrift';

gsap.registerPlugin(ScrollTrigger);

const NAV_IDS = NAV_LINKS.map((l) => l.id);

export const Footer: React.FC = () => {
  const [time, setTime] = useState('');
  const footerRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const active = useActiveSection(NAV_IDS);

  useCharDrift(wordmarkRef, { radius: 260, x: 18, y: 12, rotate: 3 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat('en-IN', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // The floating nav "lands" here: the dock grows out of the same pill shape
  // the top navigation collapses into, and the wordmark rises behind it.
  useEffect(() => {
    if (!footerRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      if (dockRef.current) {
        gsap.fromTo(
          dockRef.current,
          { scaleX: 0.5, opacity: 0, y: 36 },
          {
            scaleX: 1,
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
      if (wordmarkRef.current) {
        gsap.from(wordmarkRef.current.querySelectorAll('.split-char'), {
          yPercent: 120,
          rotate: 6,
          duration: 1.5,
          ease: 'expo.out',
          stagger: 0.045,
          scrollTrigger: {
            trigger: wordmarkRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="site-footer"
      ref={footerRef}
      className="relative bg-[#070709] text-[#a1a1aa] pt-24 md:pt-32 pb-10 overflow-hidden"
    >
      {/* Soft hand-off from the last section's background */}
      <div className="absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-[#070709] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Navigation dock (desktop): visual continuation of the floating nav */}
        <div
          ref={dockRef}
          className="hidden lg:flex mx-auto mb-16 w-max items-center gap-1 rounded-full border border-white/10 bg-[#0c0c10]/80 p-1.5 backdrop-blur-xl"
          style={{ opacity: 0 }}
        >
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            data-cursor="magnetic"
            data-cursor-label="TOP"
            aria-label="Back to top"
            className="w-10 h-10 rounded-full bg-[#18181c] border border-[#27272a] hover:border-amber-400/60 flex items-center justify-center font-editorial-display font-bold text-sm tracking-tighter text-white transition-colors cursor-pointer"
          >
            DG
          </button>
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              data-cursor="magnetic"
              data-cursor-label={link.label.toUpperCase()}
              onClick={(e) => {
                e.preventDefault();
                goToSection(link.id);
              }}
              className={`px-3.5 py-2 rounded-full text-[11px] uppercase tracking-[0.18em] transition-colors ${
                link.id === active ? 'bg-white/10 text-white' : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          {/* Brand info */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xl font-editorial-serif tracking-tight text-white italic">
                {personalData.name}
              </span>
              <p className="mt-3 text-sm text-[#71717a] max-w-sm font-light leading-relaxed">
                Computer Science & Engineering Student & Developer crafting software with architectural clarity and modern intelligence.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3 text-xs text-[#71717a]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>India (IST): <strong className="text-[#f4f4f5] font-mono">{time || '07:30 PM'}</strong></span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-widest text-[#71717a] mb-5 font-editorial-display">
              Index
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '#about', id: 'about', label: 'About Background', cursor: 'ABOUT' },
                { href: '#skills', id: 'skills', label: 'Technical Stack', cursor: 'SKILLS' },
                { href: '#projects', id: 'projects', label: 'Featured Projects', cursor: 'WORKS' },
                { href: '#learning', id: 'learning', label: 'Currently Exploring', cursor: 'STUDY' },
                { href: '#education', id: 'education', label: 'Education', cursor: 'SCHOOL' },
                { href: '#contact', id: 'contact', label: 'Get In Touch', cursor: 'TALK' },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    data-cursor="magnetic"
                    data-cursor-label={item.cursor}
                    onClick={(e) => {
                      e.preventDefault();
                      goToSection(item.id);
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Presence */}
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-widest text-[#71717a] mb-5 font-editorial-display">
              Online Profiles
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={personalData.socials.github}
                target="_blank"
                rel="noreferrer"
                data-cursor="magnetic"
                data-cursor-label="GITHUB"
                className="group flex items-center justify-between p-3 rounded-lg bg-[#111114] border border-[#222227] hover:border-white/50 transition-all hover:scale-[1.01] text-sm text-[#f4f4f5]"
              >
                <span className="flex items-center gap-3">
                  <GithubIcon className="w-4 h-4 text-[#a1a1aa] group-hover:text-white transition-colors" />
                  <span>GitHub</span>
                </span>
                <span className="text-xs text-[#71717a] group-hover:text-white font-mono">@blackpegasusdg</span>
              </a>

              <a
                href={personalData.socials.letterboxd}
                target="_blank"
                rel="noreferrer"
                data-cursor="magnetic"
                data-cursor-label="MOVIES"
                className="group flex items-center justify-between p-3 rounded-lg bg-[#111114] border border-[#222227] hover:border-[#00e054]/50 transition-all hover:scale-[1.01] text-sm text-[#f4f4f5]"
              >
                <span className="flex items-center gap-3">
                  <LetterboxdIcon className="w-4 h-4" />
                  <span>Letterboxd</span>
                </span>
                <span className="text-xs text-[#71717a] group-hover:text-white font-mono">@blackpegasusdg</span>
              </a>

              <a
                href={personalData.socials.instagram}
                target="_blank"
                rel="noreferrer"
                data-cursor="magnetic"
                data-cursor-label="INSTA"
                className="group flex items-center justify-between p-3 rounded-lg bg-[#111114] border border-[#222227] hover:border-[#e1306c]/50 transition-all hover:scale-[1.01] text-sm text-[#f4f4f5]"
              >
                <span className="flex items-center gap-3">
                  <InstagramIcon className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#e1306c] transition-colors" />
                  <span>Instagram</span>
                </span>
                <span className="text-xs text-[#71717a] group-hover:text-white font-mono">@_ghosh.d_</span>
              </a>
            </div>
          </div>
        </div>

        {/* Closing wordmark: letters rise and then react to the cursor */}
        <div
          ref={wordmarkRef}
          aria-label={personalData.name}
          className="relative select-none font-editorial-serif italic text-white/90 text-[13vw] leading-[0.95] tracking-tight whitespace-nowrap text-center"
        >
          <SplitChars text={personalData.name} />
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717a]">
          <p>© {new Date().getFullYear()} Diptanu Ghosh. Built with React, TypeScript & GSAP.</p>
          <button
            onClick={() => scrollToTarget(0)}
            data-cursor="magnetic"
            data-cursor-label="TOP"
            className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors group cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
