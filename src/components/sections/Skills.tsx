import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Terminal, Cpu, Layout, Smartphone, Wrench, Link2 } from 'lucide-react';

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
              onClick={() => {
                setSelectedCategory(cat.name);
                setActiveNode(null);
              }}
              style={{
                borderColor: isSelected ? cat.color : undefined,
              }}
              className={`p-4 rounded-2xl border transition-all duration-300 text-left flex flex-col justify-between h-28 cursor-pointer select-none active:scale-95 ${
                isSelected
                  ? 'bg-[#181822] shadow-[0_0_25px_rgba(255,255,255,0.05)] scale-[1.02]'
                  : 'bg-[#111114] border-[#222227] hover:border-white/30 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  style={{ color: cat.color }}
                  className="p-2 rounded-xl bg-[#1c1c24] border border-white/5"
                >
                  <Icon className="w-4 h-4" />
                </span>
                {isSelected && (
                  <span
                    style={{ backgroundColor: cat.color }}
                    className="w-1.5 h-1.5 rounded-full animate-ping"
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

      {/* Active Hub Technologies Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {currentNodes.map((node) => {
          const isActive = activeNode?.name === node.name;

          return (
            <div
              key={node.name}
              onClick={() => setActiveNode(isActive ? null : node)}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.99] ${
                isActive
                  ? 'bg-[#1a1a24] border-white/40 shadow-xl'
                  : 'bg-[#111114] border-[#222227] hover:border-[#3f3f46] hover:bg-[#141418]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#71717a] font-editorial-display">
                    {node.level}
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#1c1c24] text-[#a1a1aa] font-mono">
                    Tap to inspect
                  </span>
                </div>

                <h3 className="text-xl font-editorial-serif text-white tracking-tight flex items-center justify-between">
                  <span>{node.name}</span>
                  <Link2 className={`w-3.5 h-3.5 text-[#71717a] transition-colors ${isActive ? 'text-[#e4a853]' : ''}`} />
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-[#a1a1aa] font-light leading-relaxed">
                  {node.description}
                </p>
              </div>

              {/* Interconnected Project / Tech Relationship Tags */}
              <div className="mt-6 pt-4 border-t border-white/5">
                <span className="text-[10px] uppercase tracking-wider text-[#71717a] block mb-2 font-editorial-display">
                  Connected In Portfolio:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {node.relatedTo.map((rel) => (
                    <span
                      key={rel}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181820] border border-white/10 text-[#e4a853]"
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

