import React, { useState, useMemo } from 'react';
import { 
  AttackPathGraph, 
  AttackPathNode, 
  AttackPathEdge, 
  PurdueLevel, 
  ProtocolType,
  OTAsset 
} from '../types/ot-security';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Filter, 
  Flame, 
  ShieldAlert, 
  Layers, 
  Activity, 
  Play, 
  Pause, 
  Maximize2, 
  SlidersHorizontal,
  ChevronRight,
  Info,
  Network,
  Cpu,
  Server,
  Lock,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AttackPathViewProps {
  graph: AttackPathGraph;
  assets: OTAsset[];
  onSelectNode: (assetId: string) => void;
  selectedAssetId: string | null;
}

export const AttackPathView: React.FC<AttackPathViewProps> = ({
  graph,
  assets,
  onSelectNode,
  selectedAssetId
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedEdge, setSelectedEdge] = useState<AttackPathEdge | null>(null);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const [selectedProtocolFilter, setSelectedProtocolFilter] = useState<string>('ALL');
  const [showBlastRadius, setShowBlastRadius] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'hierarchy' | 'cluster'>('hierarchy');
  const [animationPlaying, setAnimationPlaying] = useState(true);

  // Swimlanes for Purdue Levels
  const purdueLanes: { level: PurdueLevel; label: string; desc: string; color: string; bg: string }[] = [
    { level: 'L4', label: 'Level 4: Enterprise IT', desc: 'Corporate DMZ & VPN', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.04)' },
    { level: 'L3.5', label: 'Level 3.5: Industrial DMZ', desc: 'Jump Boxes & Patch Mgmt', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.04)' },
    { level: 'L3', label: 'Level 3: Operations & MES', desc: 'Historian & Process Data', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.04)' },
    { level: 'L2', label: 'Level 2: Supervisory', desc: 'HMI & Engineering Stations', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.04)' },
    { level: 'L1', label: 'Level 1: Basic Control & SIS', desc: 'PLCs & Safety Instruments', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.05)' },
    { level: 'L0', label: 'Level 0: Process Field', desc: 'Actuators, Valves, Sensors', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.04)' },
  ];

  // Coordinates mapping per node depending on layout mode
  const nodePositions = useMemo(() => {
    return graph.nodes.map(n => {
      if (layoutMode === 'cluster') {
        // Radial/Cluster projection
        const angles: Record<string, number> = {
          'node-l4-vpn': 0,
          'node-l35-jump': Math.PI * 0.35,
          'node-l3-hist': Math.PI * 0.7,
          'node-l2-ews': Math.PI * 1.05,
          'node-l1-s7': Math.PI * 1.4,
          'node-l1-sis': Math.PI * 1.75,
          'node-l0-valve': Math.PI * 2.0
        };
        const angle = angles[n.id] ?? 0;
        const radius = n.purdueLevel === 'L1' || n.purdueLevel === 'L0' ? 240 : 180;
        const cx = 500;
        const cy = 260;
        return {
          ...n,
          renderedX: cx + Math.cos(angle) * radius,
          renderedY: cy + Math.sin(angle) * radius
        };
      }

      // Hierarchical Purdue Model layout (swimlane columns)
      const laneXMapping: Record<PurdueLevel, number> = {
        'L4': 80,
        'L3.5': 240,
        'L3': 400,
        'L2': 560,
        'L1': 740,
        'L0': 920
      };

      let yOffset = n.y;
      if (n.id === 'node-l3-hist') yOffset = 130;
      if (n.id === 'node-l2-ews') yOffset = 290;
      if (n.id === 'node-l1-s7') yOffset = 180;
      if (n.id === 'node-l1-sis') yOffset = 340;
      if (n.id === 'node-l0-valve') yOffset = 260;

      return {
        ...n,
        renderedX: laneXMapping[n.purdueLevel] || n.x,
        renderedY: yOffset
      };
    });
  }, [graph.nodes, layoutMode]);

  // Filtering
  const filteredNodes = useMemo(() => {
    return nodePositions.filter(n => {
      if (selectedLevelFilter !== 'ALL' && n.purdueLevel !== selectedLevelFilter) return false;
      return true;
    });
  }, [nodePositions, selectedLevelFilter]);

  const filteredEdges = useMemo(() => {
    return graph.edges.filter(e => {
      if (selectedProtocolFilter !== 'ALL' && e.protocol !== selectedProtocolFilter) return false;
      return true;
    });
  }, [graph.edges, selectedProtocolFilter]);

  // Protocol colors
  const protocolBadgeColors: Record<string, { text: string; bg: string; border: string }> = {
    'RDP': { text: '#d8b4fe', bg: 'rgba(147, 51, 234, 0.2)', border: '#9333ea' },
    'Siemens S7comm': { text: '#38bdf8', bg: 'rgba(2, 132, 199, 0.2)', border: '#0284c7' },
    'Modbus TCP': { text: '#f87171', bg: 'rgba(220, 38, 38, 0.2)', border: '#dc2626' },
    'CIP / EtherNet/IP': { text: '#34d399', bg: 'rgba(5, 150, 105, 0.2)', border: '#059669' },
    'HTTPS': { text: '#94a3b8', bg: 'rgba(100, 116, 139, 0.2)', border: '#64748b' },
    'OPC UA': { text: '#facc15', bg: 'rgba(202, 138, 4, 0.2)', border: '#ca8a04' }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f17] text-slate-200 select-none">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111827] border-b border-[#1e293b] text-xs">
        {/* Left: Title & Mode Toggle */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Network className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white tracking-tight">Active Multi-Hop Attack Path</span>
            <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-mono text-[10px] font-bold animate-pulse">
              ACTIVE COMPROMISE (5 HOPS)
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Hierarchy vs Cluster Layout */}
          <div className="flex rounded bg-[#162032] p-0.5 border border-[#23314d]">
            <button
              onClick={() => setLayoutMode('hierarchy')}
              className={`px-2.5 py-1 rounded transition-colors font-medium ${
                layoutMode === 'hierarchy' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Purdue Swimlanes
            </button>
            <button
              onClick={() => setLayoutMode('cluster')}
              className={`px-2.5 py-1 rounded transition-colors font-medium ${
                layoutMode === 'cluster' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Blast Cluster
            </button>
          </div>

          {/* Blast Radius Toggle */}
          <button
            onClick={() => setShowBlastRadius(!showBlastRadius)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded border transition-colors ${
              showBlastRadius 
                ? 'bg-red-950/50 text-red-300 border-red-800' 
                : 'bg-[#162032] text-slate-400 border-[#23314d]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Blast Radius {showBlastRadius ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Right: Filters, Animation Play/Pause, Zoom */}
        <div className="flex items-center space-x-2.5">
          {/* Purdue Level Filter */}
          <div className="flex items-center space-x-1">
            <span className="text-slate-400 text-[11px]">Level:</span>
            <select
              value={selectedLevelFilter}
              onChange={e => setSelectedLevelFilter(e.target.value)}
              className="bg-[#162032] border border-[#23314d] rounded px-2 py-1 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Purdue Levels</option>
              <option value="L4">L4 Enterprise</option>
              <option value="L3.5">L3.5 IDMZ</option>
              <option value="L3">L3 Operations</option>
              <option value="L2">L2 Supervisory</option>
              <option value="L1">L1 Basic Control</option>
              <option value="L0">L0 Field</option>
            </select>
          </div>

          {/* Protocol Filter */}
          <div className="flex items-center space-x-1">
            <span className="text-slate-400 text-[11px]">Protocol:</span>
            <select
              value={selectedProtocolFilter}
              onChange={e => setSelectedProtocolFilter(e.target.value)}
              className="bg-[#162032] border border-[#23314d] rounded px-2 py-1 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All OT Protocols</option>
              <option value="Modbus TCP">Modbus TCP</option>
              <option value="Siemens S7comm">Siemens S7comm</option>
              <option value="RDP">RDP</option>
              <option value="CIP / EtherNet/IP">CIP / EtherNet/IP</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Animation Play/Pause */}
          <button
            onClick={() => setAnimationPlaying(!animationPlaying)}
            className="p-1.5 rounded bg-[#162032] hover:bg-[#1e2a44] border border-[#23314d] text-slate-300 transition-colors"
            title={animationPlaying ? 'Pause Attack Packet Flow' : 'Play Attack Packet Flow'}
          >
            {animationPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Zoom In / Out / Reset */}
          <div className="flex items-center space-x-1 bg-[#162032] p-0.5 rounded border border-[#23314d]">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.8))}
              className="p-1 rounded hover:bg-[#23314d] text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1 text-slate-400">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.6))}
              className="p-1 rounded hover:bg-[#23314d] text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded hover:bg-[#23314d] text-slate-400 hover:text-slate-200"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative overflow-auto bg-[#090d14] flex flex-col justify-between">
        {/* SVG Graph Canvas */}
        <div className="relative min-w-[1020px] min-h-[580px] p-6 flex-1">
          {/* Background Purdue Swimlane Columns (when in hierarchy mode) */}
          {layoutMode === 'hierarchy' && (
            <div className="absolute inset-0 grid grid-cols-6 pointer-events-none px-4">
              {purdueLanes.map(lane => (
                <div 
                  key={lane.level} 
                  className="h-full border-r border-[#162032] p-3 flex flex-col justify-between"
                  style={{ backgroundColor: lane.bg }}
                >
                  <div>
                    <span 
                      className="text-[11px] font-bold font-mono uppercase tracking-wider block"
                      style={{ color: lane.color }}
                    >
                      {lane.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{lane.desc}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono text-right opacity-30">
                    CONDUIT BOUNDARY
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interactive SVG Diagram */}
          <div 
            className="relative z-10 transition-transform duration-200 origin-top-left"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg className="w-[1040px] h-[520px]">
              <defs>
                {/* Attack packet flow animated marker */}
                <marker 
                  id="arrow-attack" 
                  viewBox="0 0 10 10" 
                  refX="6" 
                  refY="5" 
                  markerWidth="6" 
                  markerHeight="6" 
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#ef4444" />
                </marker>
                <marker 
                  id="arrow-normal" 
                  viewBox="0 0 10 10" 
                  refX="6" 
                  refY="5" 
                  markerWidth="6" 
                  markerHeight="6" 
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#64748b" />
                </marker>
              </defs>

              {/* Render Edges */}
              {filteredEdges.map(edge => {
                const src = nodePositions.find(n => n.id === edge.source);
                const tgt = nodePositions.find(n => n.id === edge.target);
                if (!src || !tgt) return null;

                const isSelected = selectedEdge?.id === edge.id;
                const midX = (src.renderedX + tgt.renderedX) / 2;
                const midY = (src.renderedY + tgt.renderedY) / 2;
                const protoColor = protocolBadgeColors[edge.protocol] || { border: '#64748b', text: '#cbd5e1', bg: '#1e293b' };

                return (
                  <g key={edge.id} className="cursor-pointer" onClick={() => setSelectedEdge(edge)}>
                    {/* Shadow / Click Area line */}
                    <line
                      x1={src.renderedX}
                      y1={src.renderedY}
                      x2={tgt.renderedX}
                      y2={tgt.renderedY}
                      stroke="transparent"
                      strokeWidth="16"
                    />

                    {/* Edge Base Line */}
                    <line
                      x1={src.renderedX}
                      y1={src.renderedY}
                      x2={tgt.renderedX}
                      y2={tgt.renderedY}
                      stroke={edge.activeAttack ? '#dc2626' : '#334155'}
                      strokeWidth={isSelected ? '3' : edge.activeAttack ? '2' : '1.5'}
                      strokeDasharray={edge.activeAttack && animationPlaying ? '6 4' : undefined}
                      strokeDashoffset={edge.activeAttack && animationPlaying ? '-10' : undefined}
                      className={edge.activeAttack && animationPlaying ? 'animate-pulse' : ''}
                      markerEnd={edge.activeAttack ? 'url(#arrow-attack)' : 'url(#arrow-normal)'}
                    />

                    {/* Protocol & Step Label Pill */}
                    <foreignObject x={midX - 52} y={midY - 14} width="104" height="28">
                      <div 
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-center border shadow-sm transition-transform hover:scale-105 ${
                          edge.activeAttack ? 'bg-red-950 text-red-200 border-red-700' : 'bg-slate-900 text-slate-300 border-slate-700'
                        } ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
                      >
                        {edge.activeAttack && <span className="text-red-400 mr-1">#{edge.lateralMovementStep}</span>}
                        <span>{edge.protocol.split(' ')[0]}</span>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}

              {/* Render Blast Radius Glows */}
              {showBlastRadius && nodePositions.filter(n => n.status === 'target' || n.status === 'compromised').map(n => (
                <circle
                  key={`blast-${n.id}`}
                  cx={n.renderedX}
                  cy={n.renderedY}
                  r={n.status === 'target' ? '54' : '44'}
                  fill="none"
                  stroke={n.status === 'target' ? '#dc2626' : '#ea580c'}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.6"
                  className="animate-spin"
                  style={{ animationDuration: '14s' }}
                />
              ))}

              {/* Render Graph Nodes */}
              {filteredNodes.map(node => {
                const isSelected = selectedAssetId === node.assetId;
                const isTarget = node.status === 'target';
                const isCompromised = node.status === 'compromised';
                const isAtRisk = node.status === 'at_risk';

                let ringColor = 'border-slate-700 bg-[#131b2e]';
                let iconColor = 'text-slate-400';
                if (isTarget) {
                  ringColor = 'border-red-500 bg-red-950/80 ring-2 ring-red-400/60 shadow-red-900/50 shadow-lg';
                  iconColor = 'text-red-400';
                } else if (isCompromised) {
                  ringColor = 'border-orange-500 bg-orange-950/80 ring-1 ring-orange-400/50';
                  iconColor = 'text-orange-400';
                } else if (isAtRisk) {
                  ringColor = 'border-amber-500 bg-amber-950/80';
                  iconColor = 'text-amber-400';
                }

                return (
                  <foreignObject
                    key={node.id}
                    x={node.renderedX - 70}
                    y={node.renderedY - 45}
                    width="140"
                    height="92"
                    className="overflow-visible cursor-pointer"
                    onClick={() => onSelectNode(node.assetId)}
                  >
                    <div 
                      className={`p-2 rounded-lg border text-center transition-all duration-200 transform hover:-translate-y-1 ${ringColor} ${
                        isSelected ? 'ring-2 ring-blue-400 shadow-xl' : ''
                      }`}
                    >
                      {/* Node Header Pill */}
                      <div className="flex items-center justify-between text-[9px] font-mono font-bold mb-1">
                        <span className="px-1 py-0.2 rounded bg-slate-900/80 text-slate-300">
                          {node.purdueLevel}
                        </span>
                        <span className={node.riskScore >= 90 ? 'text-red-400' : 'text-amber-400'}>
                          {node.riskScore}%
                        </span>
                      </div>

                      {/* Name & Role */}
                      <div className="font-semibold text-white text-[11px] truncate" title={node.name}>
                        {node.name}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate font-mono">
                        {node.ip}
                      </div>

                      {/* MITRE technique badge */}
                      {node.mitreTechniques.length > 0 && (
                        <div className="mt-1 flex justify-center space-x-1">
                          {node.mitreTechniques.slice(0, 2).map(t => (
                            <span key={t} className="text-[8px] font-mono px-1 rounded bg-red-950 text-red-300 border border-red-800">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </foreignObject>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Edge Inspector Card (if an edge was clicked) */}
        {selectedEdge && (
          <div className="mx-4 mb-3 p-3 bg-[#131b2e] border border-red-500/50 rounded-lg shadow-xl text-xs flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-7 h-7 rounded bg-red-950 border border-red-700 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white flex items-center space-x-2">
                  <span>Conduit Hop #{selectedEdge.lateralMovementStep}: {selectedEdge.conduit}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                    Port {selectedEdge.port} ({selectedEdge.protocol})
                  </span>
                </div>
                <div className="text-slate-300 text-[11px] mt-0.5">
                  {selectedEdge.description}
                </div>
                {selectedEdge.anomalyDetected && (
                  <div className="text-red-400 font-mono text-[10px] mt-0.5">
                    🚨 Detected Anomaly: {selectedEdge.anomalyDetected}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedEdge(null)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Bottom Legend & Mini-Map Bar */}
        <div className="p-3 bg-[#0d131f] border-t border-[#1e293b] flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Left: Node & Severity Semantics */}
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Graph Legend:</span>
            
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600 border border-red-400 shadow-sm" />
              <span>Target Asset (Critical SIS / Reactor)</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-600 border border-orange-400" />
              <span>Compromised Node</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-600 border border-amber-400" />
              <span>At-Risk Lateral Pivot</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-700 border border-slate-500" />
              <span>Nominal Baseline</span>
            </div>

            <div className="h-3 w-px bg-slate-700" />

            {/* Protocol color tags */}
            <div className="flex items-center space-x-2">
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">RDP 3389</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-red-950 text-red-300 border border-red-800">Modbus 502</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800">S7comm 102</span>
            </div>
          </div>

          {/* Right: Floating Mini-Map Preview */}
          <div className="flex items-center space-x-2 bg-[#141d2e] border border-[#23314d] p-1.5 rounded shadow">
            <div className="text-[10px] font-mono text-slate-400">GRAPH MINI-MAP:</div>
            <div className="w-24 h-10 bg-[#090e17] border border-[#1e293b] rounded relative overflow-hidden flex items-center justify-around px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {/* Mini viewport indicator frame */}
              <div className="absolute inset-0 border border-blue-500/60 rounded pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
