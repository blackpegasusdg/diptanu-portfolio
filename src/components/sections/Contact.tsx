import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { personalData } from '../../data/portfolioData';
import { Copy, Check, Send } from 'lucide-react';
import { GithubIcon, InstagramIcon, LetterboxdIcon } from '../common/BrandIcons';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please include a message or inquiry.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      const mailtoUrl = `mailto:${personalData.email}?subject=Portfolio Inquiry from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message + '\n\nSender Email: ' + formData.email)}`;
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 1000);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#222227]/60">
      <SectionHeading
        index="06"
        tagline="Initiate Contact"
        title="Let's Discuss Engineering & Opportunities"
        description="Whether you have an internship role, an AI/GNN research project, or want to discuss software craft—my inbox is always monitored."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        {/* Left Column: Direct channels and social presence */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#71717a] font-editorial-display mb-4">
              Direct Inquiries
            </h3>

            {/* Email Copy Card with dynamic cursor */}
            <div
              data-cursor-label="COPY"
              onClick={copyEmail}
              className="p-6 rounded-2xl bg-[#111114] border border-[#222227] hover:border-amber-400/50 hover:bg-[#15151a] transition-all cursor-pointer shadow-md"
            >
              <span className="text-xs text-[#71717a] uppercase tracking-wider block mb-1">
                Primary Email
              </span>
              <div className="flex items-center justify-between gap-3 mt-2">
                <span className="text-base sm:text-lg font-mono text-white truncate">
                  {personalData.email}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyEmail();
                  }}
                  className="p-2.5 rounded-xl bg-[#18181c] border border-white/10 text-[#a1a1aa] hover:text-white hover:border-white/30 transition-colors shrink-0 cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied ? (
                <span className="text-[11px] text-emerald-400 mt-2 block font-editorial-display animate-fadeIn">
                  ✓ Copied to clipboard
                </span>
              ) : (
                <span className="text-[10px] text-[#71717a] mt-2 block font-mono">
                  Tap anywhere on card to copy address
                </span>
              )}
            </div>

            <div className="mt-4 p-6 rounded-2xl bg-[#111114] border border-[#222227]">
              <span className="text-xs text-[#71717a] uppercase tracking-wider block mb-1">
                Location & Availability
              </span>
              <p className="text-sm text-[#f4f4f5] mt-1 font-light">
                {personalData.locationDetailed}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Open for summer/winter internships & engineering positions</span>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#71717a] font-editorial-display mb-4">
              Digital Footprint
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={personalData.socials.github}
                target="_blank"
                rel="noreferrer"
                data-cursor="magnetic"
                data-cursor-label="GITHUB"
                className="p-4 rounded-xl bg-[#111114] border border-[#222227] hover:border-white/50 text-center flex flex-col items-center justify-center gap-2 group transition-all hover:scale-105 active:scale-95"
              >
                <GithubIcon className="w-5 h-5 text-[#a1a1aa] group-hover:text-white transition-colors" />
                <span className="text-xs text-[#d4d4d8] font-medium">GitHub</span>
              </a>

              <a
                href={personalData.socials.letterboxd}
                target="_blank"
                rel="noreferrer"
                data-cursor="magnetic"
                data-cursor-label="MOVIES"
                className="p-4 rounded-xl bg-[#111114] border border-[#222227] hover:border-[#00e054]/50 text-center flex flex-col items-center justify-center gap-2 group transition-all hover:scale-105 active:scale-95"
              >
                <LetterboxdIcon className="w-5 h-5" />
                <span className="text-xs text-[#d4d4d8] font-medium">Letterboxd</span>
              </a>

              <a
                href={personalData.socials.instagram}
                target="_blank"
                rel="noreferrer"
                data-cursor="magnetic"
                data-cursor-label="INSTA"
                className="p-4 rounded-xl bg-[#111114] border border-[#222227] hover:border-[#e1306c]/50 text-center flex flex-col items-center justify-center gap-2 group transition-all hover:scale-105 active:scale-95"
              >
                <InstagramIcon className="w-5 h-5 text-[#a1a1aa] group-hover:text-[#e1306c] transition-colors" />
                <span className="text-xs text-[#d4d4d8] font-medium">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Working Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#111114] border border-[#222227] shadow-[0_15px_45px_rgba(0,0,0,0.5)]">
            <h3 className="text-xl sm:text-2xl font-editorial-serif text-white tracking-tight mb-2">
              Send a Direct Message
            </h3>
            <p className="text-xs sm:text-sm text-[#71717a] font-light mb-8">
              Fill out the form below; you will receive a direct reply to your specified address.
            </p>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-editorial-serif text-white">Message Prepared</h4>
                <p className="text-sm text-[#a1a1aa] font-light">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Opening your mail client to dispatch your transmission to <strong className="text-white">{personalData.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  className="mt-4 px-4 py-2 rounded-full text-xs uppercase tracking-wider bg-[#18181c] text-[#d4d4d8] hover:text-white border border-white/10 cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#a1a1aa] font-editorial-display block mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Elena Vance"
                    className={`w-full px-4 py-3.5 rounded-xl bg-[#18181c] border ${
                      errors.name ? 'border-rose-500/60' : 'border-[#27272a] focus:border-amber-400/50'
                    } text-white placeholder-[#52525b] text-sm outline-none transition-colors`}
                  />
                  {errors.name && (
                    <span className="text-xs text-rose-400 mt-1 block font-light">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#a1a1aa] font-editorial-display block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className={`w-full px-4 py-3.5 rounded-xl bg-[#18181c] border ${
                      errors.email ? 'border-rose-500/60' : 'border-[#27272a] focus:border-amber-400/50'
                    } text-white placeholder-[#52525b] text-sm outline-none transition-colors`}
                  />
                  {errors.email && (
                    <span className="text-xs text-rose-400 mt-1 block font-light">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#a1a1aa] font-editorial-display block mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry, project scope, or opportunity..."
                    className={`w-full px-4 py-3.5 rounded-xl bg-[#18181c] border ${
                      errors.message ? 'border-rose-500/60' : 'border-[#27272a] focus:border-amber-400/50'
                    } text-white placeholder-[#52525b] text-sm outline-none transition-colors resize-none`}
                  />
                  {errors.message && (
                    <span className="text-xs text-rose-400 mt-1 block font-light">
                      {errors.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  data-cursor="magnetic"
                  data-cursor-label="SUBMIT"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#e4e4e7] transition-all duration-200 active:scale-[0.98] select-none cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Transmission</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
