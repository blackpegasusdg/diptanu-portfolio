import React, { useState, useRef } from 'react';
import type { Project } from '../../types/portfolio';
import { X, ExternalLink, Music, CheckCircle2, Sliders, Volume2, VolumeX } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import { GnnGraphPlayground } from '../common/GnnGraphPlayground';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  // Trustlens interactive simulator state
  const [velocity, setVelocity] = useState(65);
  const [skew, setSkew] = useState(80);
  const [clustering, setClustering] = useState(70);

  // A10s Walkman interactive player & Web Audio API state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFormat, setAudioFormat] = useState<'FLAC' | 'MP3'>('FLAC');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  if (!project) return null;

  // Real-time calculation for Trustlens simulator
  const attackScore = Math.min(
    100,
    Math.round(velocity * 0.35 + skew * 0.4 + clustering * 0.25)
  );
  const isAttack = attackScore > 60;

  // Real Web Audio API synthesizer for A10s Walkman demo
  const toggleAudioSynthesis = () => {
    if (isPlaying) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      setIsPlaying(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = audioCtxRef.current || new AudioContextClass();
        audioCtxRef.current = ctx;

        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // High-resolution warm frequency (432 Hz warm harmonic tone)
        osc.type = audioFormat === 'FLAC' ? 'sine' : 'sawtooth';
        osc.frequency.setValueAtTime(audioFormat === 'FLAC' ? 432 : 320, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        setIsPlaying(true);
      } catch {
        // Fallback if browser audio permissions block
        setIsPlaying(true);
      }
    }
  };

  const handleModalClose = () => {
    if (oscRef.current) {
      oscRef.current.stop();
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    setIsPlaying(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#070709]/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0e0e12] border border-[#27272a] shadow-2xl p-6 sm:p-10 text-[#f4f4f5]">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs uppercase tracking-widest text-[#e4a853] font-editorial-display font-medium">
                {project.category}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]" />
              <span className="text-xs text-[#71717a] font-mono">Index {project.index}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-editorial-serif text-white tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm sm:text-base text-[#a1a1aa] mt-1 font-light">
              {project.subtitle}
            </p>
          </div>

          <button
            onClick={handleModalClose}
            className="p-2 rounded-full bg-[#18181c] border border-white/10 text-[#a1a1aa] hover:text-white hover:border-white/40 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-8 space-y-8">
          {/* Detailed Narrative */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#71717a] font-editorial-display mb-3">
              Overview & Architecture
            </h3>
            <p className="text-base text-[#d4d4d8] font-light leading-relaxed">
              {project.longDescription}
            </p>
          </div>

          {/* Interactive Feature Simulator for TrustLens */}
          {project.id === 'trustlens' && (
            <div className="p-6 rounded-2xl bg-[#14141a] border border-[#27272a]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#e4a853]" />
                  <span className="text-xs uppercase tracking-widest text-white font-editorial-display font-medium">
                    Interactive Attack Simulator Playground
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#71717a]">Live Evaluation Engine</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
                <div>
                  <div className="flex justify-between text-xs text-[#a1a1aa] mb-1">
                    <span>Review Velocity</span>
                    <span className="font-mono text-white">{velocity} req/min</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={velocity}
                    onChange={(e) => setVelocity(Number(e.target.value))}
                    className="w-full accent-[#e4a853] bg-[#222228] h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-[#a1a1aa] mb-1">
                    <span>1★ / 5★ Rating Skew</span>
                    <span className="font-mono text-white">{skew}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={skew}
                    onChange={(e) => setSkew(Number(e.target.value))}
                    className="w-full accent-[#e4a853] bg-[#222228] h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-[#a1a1aa] mb-1">
                    <span>Bot Account Clustering</span>
                    <span className="font-mono text-white">{clustering}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={clustering}
                    onChange={(e) => setClustering(Number(e.target.value))}
                    className="w-full accent-[#e4a853] bg-[#222228] h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Real-time Result Verdict */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#71717a] uppercase tracking-wider block">Calculated Anomaly Probability</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-editorial-display font-bold ${isAttack ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {attackScore}%
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${isAttack ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'}`}>
                      {isAttack ? 'Coordinated Attack Detected' : 'Organic Traffic Pattern'}
                    </span>
                  </div>
                </div>

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-[#e4e4e7] transition-colors"
                  >
                    <span>Launch Live Vercel App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Interactive Feature Playground for GNN Fraud Detection */}
          {project.id === 'gnn-fraud' && (
            <GnnGraphPlayground />
          )}

          {/* Interactive Feature Player for A10s Walkman with Real Web Audio Synthesis */}
          {project.id === 'a10s-walkman' && (
            <div className="p-6 rounded-2xl bg-[#14141a] border border-[#27272a]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs uppercase tracking-widest text-white font-editorial-display font-medium">
                    FLAC Bit-Perfect Audio Engine Demo • Real Web Audio
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAudioFormat('MP3');
                      if (isPlaying && oscRef.current) {
                        oscRef.current.frequency.setValueAtTime(320, audioCtxRef.current!.currentTime);
                        oscRef.current.type = 'sawtooth';
                      }
                    }}
                    className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer ${audioFormat === 'MP3' ? 'bg-white text-black border-white' : 'bg-[#18181c] text-[#71717a] border-white/10'}`}
                  >
                    128 kbps MP3
                  </button>
                  <button
                    onClick={() => {
                      setAudioFormat('FLAC');
                      if (isPlaying && oscRef.current) {
                        oscRef.current.frequency.setValueAtTime(432, audioCtxRef.current!.currentTime);
                        oscRef.current.type = 'sine';
                      }
                    }}
                    className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer ${audioFormat === 'FLAC' ? 'bg-emerald-400 text-black border-emerald-400 font-bold' : 'bg-[#18181c] text-[#71717a] border-white/10'}`}
                  >
                    24-Bit / 96kHz FLAC
                  </button>
                </div>
              </div>

              {/* Dynamic Simulated Audio Waveform */}
              <div className="h-16 flex items-center justify-center gap-1.5 bg-[#0a0a0c] rounded-xl p-3 border border-white/5 overflow-hidden">
                {Array.from({ length: 32 }).map((_, i) => {
                  const barHeight = isPlaying
                    ? audioFormat === 'FLAC'
                      ? Math.max(15, (Math.sin(i * 0.4 + Date.now() * 0.005) * 50 + 50) % 90 + 10)
                      : Math.max(10, (i % 4) * 15 + 10)
                    : 15;
                  return (
                    <div
                      key={i}
                      style={{ height: `${barHeight}%` }}
                      className={`w-1 rounded-full transition-all duration-150 ${isPlaying ? (audioFormat === 'FLAC' ? 'bg-emerald-400' : 'bg-amber-400') : 'bg-[#27272a]'}`}
                    />
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleAudioSynthesis}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer active:scale-95"
                  >
                    {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Mute Audio Tone' : 'Play Audio Tone (Live Synth)'}</span>
                  </button>
                  <span className="text-[#a1a1aa] font-mono">
                    {audioFormat === 'FLAC' ? '432 Hz Sine (Uncompressed Bit-Perfect)' : '320 Hz Sawtooth (Compressed)'}
                  </span>
                </div>
                <span className="text-[#71717a] font-mono">
                  {audioFormat === 'FLAC' ? 'Dynamic Range: ~144 dB' : 'Dynamic Range: ~96 dB'}
                </span>
              </div>
            </div>
          )}

          {/* Key Engineering Highlights */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#71717a] font-editorial-display mb-3">
              Key Engineering Highlights
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[#a1a1aa] leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-[#e4a853] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies Used */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#71717a] font-editorial-display mb-3">
              Technologies & Frameworks
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-[#18181c] border border-white/10 text-xs font-mono text-[#d4d4d8]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#18181c] hover:bg-white hover:text-black border border-[#27272a] hover:border-white text-xs uppercase tracking-wider text-white transition-all duration-200"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View GitHub Repository</span>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs uppercase tracking-wider font-semibold hover:bg-[#e4e4e7] transition-colors"
              >
                <span>Live Vercel Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <button
            onClick={handleModalClose}
            className="text-xs uppercase tracking-wider text-[#71717a] hover:text-white transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
