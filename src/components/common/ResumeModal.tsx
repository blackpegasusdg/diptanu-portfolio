import React, { useState } from 'react';
import { personalData, educationData } from '../../data/portfolioData';
import { X, Printer, Copy, Check, FileText } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRaw = () => {
    const rawText = `
DIPTANU GHOSH
Computer Science & Engineering Student / Developer
Naihati, West Bengal, India | ${personalData.phone} | ${personalData.email}
GitHub: ${personalData.socials.github}

PROFILE:
B.Tech Computer Science and Engineering student at Academy of Technology with a solid foundation in programming, web development, and machine learning. Seeking an internship or entry-level software role to build real-world solutions.

TECHNICAL SKILLS:
- Languages: C, Java, Python, Kotlin, SQL, JavaScript
- Development: HTML5, CSS3, React, Android (Jetpack Compose)
- Machine Learning: Python ML, Graph Neural Networks, Model Training & Evaluation
- Core: Data Structures & Algorithms, OOP, DBMS, Git & GitHub

PROJECTS:
1. TrustLens (Python | Vercel)
- Built a system detecting coordinated rating attacks and fake review clusters.
- Live Demo: https://trustlens-tau.vercel.app | Repo: https://github.com/blackpegasusdg/Trustlens

2. Graph Neural Network Based Fraud Detection
- Financial transaction fraud detection modeling relationships using GNNs.

3. A10s Walkman (Kotlin | Android)
- Offline FLAC lossless music player with Jetpack Compose.
- Repo: https://github.com/blackpegasusdg/A10S-Walkman

EDUCATION:
- B.Tech in Computer Science and Engineering, Academy of Technology
    `.trim();

    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#070709]/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0e0e12] border border-[#27272a] shadow-2xl p-6 sm:p-10 text-[#f4f4f5]">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#e4a853]" />
            <span className="text-xs uppercase tracking-widest text-[#a1a1aa] font-editorial-display font-medium">
              Curriculum Vitae • Diptanu Ghosh
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181c] border border-white/10 hover:border-white text-xs text-[#d4d4d8] hover:text-white transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={handleCopyRaw}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181c] border border-white/10 hover:border-white text-xs text-[#d4d4d8] hover:text-white transition-colors"
              title="Copy plain text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#18181c] border border-white/10 text-[#a1a1aa] hover:text-white transition-colors ml-2"
              aria-label="Close resume modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Editorial CV Document Sheet */}
        <div className="bg-[#131317] border border-white/5 rounded-2xl p-6 sm:p-10 space-y-8 font-light text-sm text-[#d4d4d8]">
          {/* Header */}
          <div className="border-b border-white/10 pb-6">
            <h1 className="text-3xl sm:text-4xl font-editorial-serif text-white tracking-tight">
              {personalData.name}
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#e4a853] mt-1 font-editorial-display">
              B.Tech Computer Science and Engineering | Academy of Technology
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#71717a] mt-3 font-mono">
              <span>{personalData.locationDetailed}</span>
              <span>•</span>
              <span>{personalData.phone}</span>
              <span>•</span>
              <span>{personalData.email}</span>
            </div>
          </div>

          {/* Profile */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-white font-editorial-display font-semibold mb-2">
              Profile Summary
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
              B.Tech Computer Science and Engineering student with a solid foundation in programming, web development, and machine learning. Seeking an internship or entry-level software role where I can apply my technical skills, build real-world solutions, and keep growing as an engineer.
            </p>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-white font-editorial-display font-semibold mb-2">
              Education
            </h2>
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-white">{educationData.degree}</span>
              <span className="text-xs text-[#71717a]">{educationData.institution}</span>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-white font-editorial-display font-semibold mb-3">
              Technical Skills
            </h2>
            <div className="space-y-2 text-xs">
              <div>
                <strong className="text-white font-medium">Languages:</strong>{' '}
                <span className="text-[#a1a1aa]">C, Java, Python, Kotlin, SQL, JavaScript</span>
              </div>
              <div>
                <strong className="text-white font-medium">Web Development:</strong>{' '}
                <span className="text-[#a1a1aa]">HTML5, CSS3, React, TypeScript</span>
              </div>
              <div>
                <strong className="text-white font-medium">Machine Learning:</strong>{' '}
                <span className="text-[#a1a1aa]">Python ML, Graph Neural Networks, Model Training & Evaluation</span>
              </div>
              <div>
                <strong className="text-white font-medium">Core Concepts & Databases:</strong>{' '}
                <span className="text-[#a1a1aa]">Data Structures and Algorithms, Object-Oriented Programming, DBMS, Git & GitHub</span>
              </div>
            </div>
          </div>

          {/* Featured Projects */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-white font-editorial-display font-semibold mb-3">
              Projects
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-white">TrustLens</span>
                  <span className="text-xs text-[#71717a]">Python | Vercel</span>
                </div>
                <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                  Built a Python system that detects rating attacks (coordinated fake or manipulated ratings) on social platforms. Deployed live on Vercel with an attack scenario testing backend.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-white">Graph Neural Network Fraud Detection</span>
                  <span className="text-xs text-[#71717a]">Python | PyTorch Geometric</span>
                </div>
                <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                  Financial transaction fraud detection research modeling relationships between transacting accounts using graph neural networks.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-white">A10s Walkman</span>
                  <span className="text-xs text-[#71717a]">Kotlin | Android</span>
                </div>
                <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                  Offline music player app in Kotlin and Jetpack Compose designed specifically for FLAC (lossless audio) enthusiasts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


