import React, { useState, useEffect } from 'react';
import { personalData } from '../../data/portfolioData';
import { Menu, X, FileText } from 'lucide-react';

interface NavbarProps {
  onOpenResumeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResumeModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Learning', href: '#learning', id: 'learning' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Simple active section spy
      const sections = navLinks.map((l) => document.getElementById(l.id));
      const scrollPos = window.scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0a0a0c]/85 backdrop-blur-md border-b border-[#222227] py-4'
            : 'bg-transparent py-6 md:py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo / Monogram */}
          <a
            href="#home"
            data-cursor="magnetic"
            data-cursor-label="DIPTANU"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="group flex items-center gap-3 cursor-pointer select-none"
          >
            <span className="w-9 h-9 rounded-full bg-[#18181c] border border-[#27272a] group-hover:border-amber-400/60 group-hover:scale-105 flex items-center justify-center font-editorial-display font-bold text-sm tracking-tighter text-white transition-all duration-200">
              DG
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium tracking-tight text-white group-hover:text-amber-300 transition-colors">
                {personalData.name}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#71717a]">
                Student & Developer
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#121215]/85 border border-[#222227] px-3 py-1.5 rounded-full backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  data-cursor="magnetic"
                  data-cursor-label={link.label.toUpperCase()}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`relative px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all duration-200 select-none ${
                    isActive
                      ? 'text-white font-medium bg-white/10 shadow-inner'
                      : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#e4a853]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenResumeModal}
              data-cursor="magnetic"
              data-cursor-label="RESUME"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider bg-[#18181c] hover:bg-white hover:text-black border border-[#27272a] hover:border-white transition-all duration-200 text-[#f4f4f5] active:scale-95 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Resume</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full bg-[#18181c] border border-[#27272a] text-white hover:border-white/50 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-30 bg-[#0a0a0c]/95 backdrop-blur-xl md:hidden transition-all duration-400 flex flex-col justify-between p-8 pt-28 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6">
          <p className="text-xs uppercase tracking-widest text-[#71717a] font-editorial-display">
            Navigation
          </p>
          <div className="flex flex-col gap-4">
            {navLinks.map((link, idx) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-2xl font-editorial-serif tracking-tight text-white hover:text-amber-400 flex items-center justify-between border-b border-white/5 pb-3 transition-colors"
              >
                <span>{link.label}</span>
                <span className="text-xs font-editorial-display text-[#71717a]">
                  0{idx + 1}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
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
