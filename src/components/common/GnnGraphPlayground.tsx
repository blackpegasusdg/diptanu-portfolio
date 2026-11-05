import React, { useState, useRef } from 'react';
import { Play, RotateCcw, AlertTriangle, ShieldAlert } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'account' | 'sybil' | 'merchant';
  riskScore: number;
}

interface Edge {
  from: string;
  to: string;
  amount: string;
  isAnomalous?: boolean;
}

export const GnnGraphPlayground: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', label: 'ACC-101', x: 80, y: 120, type: 'account', riskScore: 12 },
    { id: '2', label: 'ACC-102', x: 220, y: 70, type: 'sybil', riskScore: 89 },
    { id: '3', label: 'ACC-103', x: 360, y: 110, type: 'sybil', riskScore: 94 },
    { id: '4', label: 'ACC-104', x: 230, y: 220, type: 'sybil', riskScore: 91 },
    { id: '5', label: 'MERCHANT-X', x: 480, y: 190, type: 'merchant', riskScore: 8 },
  ]);

  const [edges] = useState<Edge[]>([
    { from: '1', to: '2', amount: '$420' },
    { from: '2', to: '3', amount: '$12,500', isAnomalous: true },
    { from: '3', to: '4', amount: '$12,450', isAnomalous: true },
    { from: '4', to: '2', amount: '$12,400', isAnomalous: true }, // Cyclic smurfing ring
    { from: '3', to: '5', amount: '$85' },
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handlePointerDown = (id: string) => {
    setDraggingNodeId(id);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingNodeId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left));
    const y = Math.max(30, Math.min(rect.height - 30, e.clientY - rect.top));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x, y } : n))
    );
  };

  const handlePointerUp = () => {
    setDraggingNodeId(null);
  };

  const runGnnDetection = () => {
    setIsScanning(true);
    setScanComplete(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1200);
  };

  const resetGraph = () => {
    setScanComplete(false);
    setIsScanning(false);
    setNodes([
      { id: '1', label: 'ACC-101', x: 80, y: 120, type: 'account', riskScore: 12 },
      { id: '2', label: 'ACC-102', x: 220, y: 70, type: 'sybil', riskScore: 89 },
      { id: '3', label: 'ACC-103', x: 360, y: 110, type: 'sybil', riskScore: 94 },
      { id: '4', label: 'ACC-104', x: 230, y: 220, type: 'sybil', riskScore: 91 },
      { id: '5', label: 'MERCHANT-X', x: 480, y: 190, type: 'merchant', riskScore: 8 },
    ]);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#14141a] border border-[#27272a] select-none">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-purple-400" />
          <span className="text-xs uppercase tracking-widest text-white font-editorial-display font-medium">
            Interactive GNN Graph Topology • Drag Nodes
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runGnnDetection}
            disabled={isScanning}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500 hover:bg-purple-600 text-white font-medium text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer active:scale-95"
          >
            <Play className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Running Message Passing...' : 'Run GNN Detection'}</span>
          </button>

          <button
            onClick={resetGraph}
            className="p-1.5 rounded-full bg-[#18181c] border border-white/10 hover:border-white text-xs text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
            title="Reset Graph Position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Graph Surface */}
      <div className="relative w-full h-72 sm:h-80 bg-[#08080c] rounded-xl border border-white/5 overflow-hidden">
        <svg
          ref={svgRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="graph-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#graph-grid)" />

          {/* Edges */}
          {edges.map((edge, idx) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isAnomalousEdge = scanComplete && edge.isAnomalous;

            return (
              <g key={idx}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isAnomalousEdge ? '#f43f5e' : isScanning ? '#c084fc' : '#3f3f46'}
                  strokeWidth={isAnomalousEdge ? 2.5 : 1.5}
                  strokeDasharray={isAnomalousEdge ? '4 2' : 'none'}
                  className="transition-colors duration-300"
                />
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 - 4}
                  fill={isAnomalousEdge ? '#f43f5e' : '#71717a'}
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {edge.amount}
                </text>
              </g>
            );
          })}

          {/* Draggable Nodes */}
          {nodes.map((node) => {
            const isSybil = scanComplete && node.type === 'sybil';
            const nodeFill = isSybil ? '#e11d48' : node.type === 'merchant' ? '#0284c7' : '#27272a';
            const nodeStroke = isSybil ? '#fda4af' : '#52525b';

            return (
              <g
                key={node.id}
                onPointerDown={() => handlePointerDown(node.id)}
                className="cursor-pointer"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="18"
                  fill={nodeFill}
                  stroke={nodeStroke}
                  strokeWidth="2"
                  className="transition-colors duration-300 filter drop-shadow-md"
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  fill="#ffffff"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {node.label.slice(-3)}
                </text>
                <text
                  x={node.x}
                  y={node.y + 30}
                  fill={isSybil ? '#f43f5e' : '#a1a1aa'}
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating live inspection badge */}
        <div className="absolute bottom-3 left-3 bg-[#111116]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-[#a1a1aa] flex items-center gap-2">
          {scanComplete ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Coordinated Cycle Identified (ACC-102 ⇄ 103 ⇄ 104) • GNN Conf: <strong>94.2%</strong></span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>Topology Ready: Drag accounts to rearrange network layers</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

