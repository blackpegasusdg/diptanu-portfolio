import React, { useEffect, useState } from 'react';
import { personalData } from '../../data/portfolioData';
import { ArrowUp } from 'lucide-react';
import { GithubIcon, InstagramIcon, LetterboxdIcon } from '../common/BrandIcons';

export const Footer: React.FC = () => {
  const [time, setTime] = useState('');

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#222227] bg-[#070709] text-[#a1a1aa] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5">
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
              <li>
                <a href="#about" data-cursor="magnetic" data-cursor-label="ABOUT" className="hover:text-white transition-colors">About Background</a>
              </li>
              <li>
                <a href="#skills" data-cursor="magnetic" data-cursor-label="SKILLS" className="hover:text-white transition-colors">Technical Stack</a>
              </li>
              <li>
                <a href="#projects" data-cursor="magnetic" data-cursor-label="WORKS" className="hover:text-white transition-colors">Featured Projects</a>
              </li>
              <li>
                <a href="#learning" data-cursor="magnetic" data-cursor-label="STUDY" className="hover:text-white transition-colors">Currently Exploring</a>
              </li>
              <li>
                <a href="#contact" data-cursor="magnetic" data-cursor-label="TALK" className="hover:text-white transition-colors">Get In Touch</a>
              </li>
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

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717a]">
          <p>© {new Date().getFullYear()} Diptanu Ghosh. Built with React, TypeScript & GSAP.</p>
          <button
            onClick={scrollToTop}
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
