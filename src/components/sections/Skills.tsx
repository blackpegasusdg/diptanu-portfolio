import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Terminal, Cpu, Layout, Smartphone, Wrench, Link2, Sparkles } from 'lucide-react';

interface TechNode {
  name: string;
  category: string;
  level: string;
  description: string;
  relatedTo: string[];
}

export const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Programming Languages');
  const [activeNode, setActiveNode] = useState<TechNode | null>(null);
  const [cardGlares, setCardGlares] = useState<{ [key: string]: { x: number; y: number; opacity: number } }>({});

  const categories = [
    { name: 'Programming Languages', icon: Terminal, color: '#e4a853' },
    { name: 'AI & Machine Learning', icon: Cpu, color: '#c084fc' },
    { name: 'Web Development', icon: Layout, color: '#38bdf8' },
    { name: 'Android Development', icon: Smartphone, color: '#34d399' },
    { name: 'Developer Tools', icon: Wrench, color: '#f43f5e' },
  ];

  const allNodes: TechNode[] = [
    // Programming Languages
    { name: 'Java', category: 'Programming Languages', level: 'Fundamental Rigor', description: 'Enterprise OOP, thread synchronization, DSA, algorithmic complexity.', relatedTo: ['Data Structures', 'OOP', 'DBMS'] },
    { name: 'Python', category: 'Programming Languages', level: 'Primary Research', description: 'Core language for TrustLens API, synthetic attack generator, PyTorch GNNs.', relatedTo: ['Machine Learning', 'Graph Neural Networks', 'TrustLens'] },
    { name: 'C', category: 'Programming Languages', level: 'Mechanical Sympathy', description: 'Pointers, explicit memory layouts, cache performance, OS interfaces.', relatedTo: ['Data Structures', 'Systems'] },
    { name: 'Kotlin', category: 'Programming Languages', level: 'Modern Native', description: 'First-class language for A10s Walkman with coroutines and Jetpack Compose.', relatedTo: ['Android Development', 'A10s Walkman'] },
    { name: 'SQL', category: 'Programming Languages', level: 'Relational Schema', description: 'Complex relational joins, transactions, normalization, and ACID guarantees.', relatedTo: ['DBMS', 'Developer Tools'] },
    { name: 'JavaScript', category: 'Programming Languages', level: 'Web Scripting', description: 'Modern asynchronous runtime, event loops, DOM orchestration.', relatedTo: ['Web Development', 'React'] },

    // AI & Machine Learning
    { name: 'Graph Neural Networks', category: 'AI & Machine Learning', level: 'Research Focus', description: 'Spatial message passing, node classification, fraud ring topology detection.', relatedTo: ['Python', 'GNN Fraud Detection', 'PyTorch'] },
    { name: 'Machine Learning', category: 'AI & Machine Learning', level: 'Applied Modeling', description: 'Feature engineering, anomaly thresholds, precision/recall evaluation.', relatedTo: ['TrustLens', 'Python'] },
    { name: 'PyTorch / Geometric', category: 'AI & Machine Learning', level: 'Framework', description: 'Graph neural network architectures, message-passing layers, tensor math.', relatedTo: ['Python', 'GNN Fraud Detection'] },
    { name: 'Data Anomaly Detection', category: 'AI & Machine Learning', level: 'Heuristics', description: 'Statistical dispersion analysis, velocity anomaly scoring, rating manipulation detection.', relatedTo: ['TrustLens', 'Machine Learning'] },

    // Web Development
    { name: 'React', category: 'Web Development', level: 'Frontend Core', description: 'Component lifecycles, declarative state hooks, virtual DOM reconciler.', relatedTo: ['TypeScript', 'JavaScript'] },
    { name: 'TypeScript', category: 'Web Development', level: 'Type Safety', description: 'Strict static typing, interfaces, generic constraints, zero runtime cost.', relatedTo: ['React', 'JavaScript'] },
    { name: 'HTML5 & Modern CSS', category: 'Web Development', level: 'Semantic Layout', description: 'CSS Grid, Flexbox, hardware-accelerated animations, glassmorphism.', relatedTo: ['React', 'Web Development'] },
    { name: 'REST APIs', category: 'Web Development', level: 'Integration', description: 'Endpoint contracts, JSON serialization, client-server decoupling.', relatedTo: ['Python', 'TrustLens'] },

    // Android Development
    { name: 'Jetpack Compose', category: 'Android Development', level: 'Declarative UI', description: 'State-driven reactive layouts, material design 3 tokens, smooth rendering.', relatedTo: ['Kotlin', 'A10s Walkman'] },
    { name: 'ExoPlayer / Media3', category: 'Android Development', level: 'Audio Engine', description: 'Direct uncompressed buffer streaming for 24-bit 96kHz FLAC playback.', relatedTo: ['Kotlin', 'A10s Walkman'] },
    { name: 'Android SDK', category: 'Android Development', level: 'Native Systems', description: 'Activity lifecycles, background services, Storage Access Framework.', relatedTo: ['Kotlin', 'Jetpack Compose'] },

    // Developer Tools
    { name: 'Git & GitHub', category: 'Developer Tools', level: 'Version Control', description: 'Branch topologies, collaborative PRs, CI deployment pipelines.', relatedTo: ['All Projects'] },
    { name: 'Data Structures & Algorithms', category: 'Developer Tools', level: 'Algorithmic Rigor', description: 'Graphs, trees, dynamic programming, sorting proofs, amortized bounds.', relatedTo: ['Java', 'C', 'Python'] },
    { name: 'DBMS & Relational Design', category: 'Developer Tools', level: 'Database Core', description: 'ER modeling, 3NF schema design, indexing, isolation levels.', relatedTo: ['SQL', 'Java'] },
  ];

  const currentNodes = allNodes.filter((n) => n.category === selectedCategory);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, nodeName: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -6;
    const rotY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;

    setCardGlares((prev) => ({
      ...prev,
      [nodeName]: { x, y, opacity: 1 },
    }));
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>, nodeName: string) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    setCardGlares((prev) => ({
      ...prev,
      [nodeName]: { ...prev[nodeName], opacity: 0 },
    }));
  };

  return (
    <section id="skills" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#222227]/60">
      <SectionHeading
        index="02"
        tagline="Interactive Technology Ecosystem"
        title="Explore Connected Engineering Capabilities"
        description="Select a domain hub to explore its connected technologies. Tap any technology to discover how it interconnects with my projects."
      />

      {/* Interactive Category Hubs Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-12">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.name;

          return (
            <button
              key={cat.name}
              data-cursor="magnetic"
              data-cursor-label="HUB"
              onClick={() => {
                setSelectedCategory(cat.name);
                setActiveNode(null);
              }}
              style={{
                borderColor: isSelected ? cat.color : undefined,
              }}
              className={`p-4 rounded-2xl border transition-all duration-300 text-left flex flex-col justify-between h-28 cursor-pointer select-none active:scale-95 ${
                isSelected
                  ? 'bg-[#181822] shadow-[0_0_25px_rgba(255,255,255,0.08)] scale-[1.02]'
                  : 'bg-[#111114] border-[#222227] hover:border-white/30 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  style={{ color: cat.color }}
                  className="p-2 rounded-xl bg-[#1c1c24] border border-white/5 transition-transform group-hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </span>
                {isSelected && (
                  <span
                    style={{ backgroundColor: cat.color }}
                    className="w-2 h-2 rounded-full animate-ping"
                  />
                )}
              </div>
              <span className="text-xs uppercase tracking-wider font-editorial-display font-medium text-white line-clamp-1">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Hub Technologies Matrix with 3D Tilt & Specular Light */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {currentNodes.map((node) => {
          const isActive = activeNode?.name === node.name;
          const glare = cardGlares[node.name] || { x: 0, y: 0, opacity: 0 };

          return (
            <div
              key={node.name}
              data-cursor-label="INSPECT"
              onMouseMove={(e) => handleCardMouseMove(e, node.name)}
              onMouseLeave={(e) => handleCardMouseLeave(e, node.name)}
              onClick={() => setActiveNode(isActive ? null : node)}
              className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer active:scale-[0.98] will-change-transform ${
                isActive
                  ? 'bg-[#1a1a24] border-amber-400/60 shadow-[0_0_30px_rgba(228,168,83,0.15)]'
                  : 'bg-[#111114] border-[#222227] hover:border-[#3f3f46] hover:bg-[#141418]'
              }`}
            >
              {/* Dynamic Specular Light Glare */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: glare.opacity,
                  background: `radial-gradient(280px circle at ${glare.x}px ${glare.y}px, rgba(255,255,255,0.09), transparent 80%)`,
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#71717a] font-editorial-display">
                    {node.level}
                  </span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono transition-colors ${
                    isActive ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-[#1c1c24] text-[#a1a1aa]'
                  }`}>
                    {isActive ? 'Active' : 'Tap to inspect'}
                  </span>
                </div>

                <h3 className="text-xl font-editorial-serif text-white tracking-tight flex items-center justify-between">
                  <span>{node.name}</span>
                  <Link2 className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-amber-400' : 'text-[#71717a]'}`} />
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-[#a1a1aa] font-light leading-relaxed">
                  {node.description}
                </p>
              </div>

              {/* Interconnected Project / Tech Relationship Tags */}
              <div className="relative z-10 mt-6 pt-4 border-t border-white/5">
                <span className="text-[10px] uppercase tracking-wider text-[#71717a] block mb-2 font-editorial-display flex items-center gap-1.5">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>Connected In Portfolio:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {node.relatedTo.map((rel) => (
                    <span
                      key={rel}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181820] border border-white/10 text-amber-300 hover:border-amber-400/40 transition-colors"
                    >
                      {rel}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
