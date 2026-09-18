import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Activity, 
  Radio, 
  Layers, 
  ArrowRight, 
  Flame, 
  Clock, 
  Server, 
  Cpu, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  HardDrive,
  FileCode,
  Lock,
  Zap,
  Sliders
} from 'lucide-react';
import { 
  OTAsset, 
  OTAlert, 
  AttackPathGraph, 
  OTSensor, 
  ProtocolTelemetry, 
  PurdueLevel 
} from '../types/ot-security';

interface DashboardViewProps {
  assets: OTAsset[];
  alerts: OTAlert[];
  attackPath: AttackPathGraph;
  sensors: OTSensor[];
  protocols: ProtocolTelemetry[];
  timeline: Array<{
    id: string;
    time: string;
    type: string;
    title: string;
    actor: string;
    level: string;
    severity: string;
  }>;
  onSelectAsset: (asset: OTAsset) => void;
  onSelectAlert: (alert: OTAlert) => void;
  onNavigateToAttackPath: () => void;
  onNavigateToAssets: () => void;
  onNavigateToAlerts: () => void;
  onNavigateToSensors: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  assets,
  alerts,
  attackPath,
  sensors,
  protocols,
  timeline,
  onSelectAsset,
  onSelectAlert,
  onNavigateToAttackPath,
  onNavigateToAssets,
  onNavigateToAlerts,
  onNavigateToSensors
}) => {
  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL');
  const highAlerts = alerts.filter(a => a.severity === 'HIGH');
  const anomalousAssets = assets.filter(a => a.status === 'ANOMALOUS' || a.status === 'WARNING');

  // Purdue Level counts
  const purdueCounts: Record<PurdueLevel, { total: number; anomalous: number }> = {
    'L4': { total: 0, anomalous: 0 },
    'L3.5': { total: 0, anomalous: 0 },
    'L3': { total: 0, anomalous: 0 },
    'L2': { total: 0, anomalous: 0 },
    'L1': { total: 0, anomalous: 0 },
    'L0': { total: 0, anomalous: 0 },
  };

  assets.forEach(a => {
    if (purdueCounts[a.purdueLevel]) {
      purdueCounts[a.purdueLevel].total += 1;
      if (a.status === 'ANOMALOUS' || a.status === 'WARNING') {
        purdueCounts[a.purdueLevel].anomalous += 1;
      }
    }
  });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto text-slate-200">
      {/* 1. Executive Summary & Operational Posture Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Posture Score Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#19152b] via-[#141a2e] to-[#0f172a] border border-red-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Plant Cybersecurity Posture
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-800 animate-pulse">
              HIGH RISK
            </span>
          </div>

          <div className="mt-3 flex items-baseline space-x-3">
            <div className="text-4xl font-extrabold text-white font-mono tracking-tight">
              78<span className="text-xl text-slate-400 font-normal">/100</span>
            </div>
            <div className="text-xs text-red-400 font-medium">
              +24 Risk points (Active L1 compromise)
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            Multi-hop lateral movement detected targeting Triconex Safety SIS (SIL-3) & Siemens S7-1518.
          </p>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Purdue Integrity:</span>
            <span className="text-red-400 font-mono font-semibold">Conduit C-35 & C-21 Breached</span>
          </div>
        </div>

        {/* Active Findings Metric */}
        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Active ICS Incidents
            </span>
            <button 
              onClick={onNavigateToAlerts}
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center cursor-pointer"
            >
              View All <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-red-950/40 border border-red-900/60">
              <div className="text-2xl font-bold font-mono text-red-400">{criticalAlerts.length}</div>
              <div className="text-[10px] text-red-300 uppercase font-semibold">Critical</div>
            </div>
            <div className="p-2 rounded bg-amber-950/40 border border-amber-900/60">
              <div className="text-2xl font-bold font-mono text-amber-400">{highAlerts.length}</div>
              <div className="text-[10px] text-amber-300 uppercase font-semibold">High</div>
            </div>
            <div className="p-2 rounded bg-blue-950/40 border border-blue-900/60">
              <div className="text-2xl font-bold font-mono text-blue-400">1</div>
              <div className="text-[10px] text-blue-300 uppercase font-semibold">Medium</div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-400 flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Top event: Modbus FC 0x06 Write to SIS register 40012</span>
          </div>
        </div>

        {/* Asset Inventory Visibility */}
        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Monitored OT Assets
            </span>
            <button 
              onClick={onNavigateToAssets}
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center cursor-pointer"
            >
              Inventory <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-extrabold text-white font-mono">{assets.length}</span>
              <span className="text-xs text-slate-400 ml-1.5">Controllers & Field Devices</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
              {anomalousAssets.length} Anomalous
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="p-1.5 rounded bg-[#0e1524] border border-[#1e2a42]">
              <span className="text-slate-400 block text-[10px]">Vulnerable Firmware</span>
              <span className="text-red-400 font-mono font-bold">4 Controllers</span>
            </div>
            <div className="p-1.5 rounded bg-[#0e1524] border border-[#1e2a42]">
              <span className="text-slate-400 block text-[10px]">Safety SIS Loops</span>
              <span className="text-emerald-400 font-mono font-bold">1 SIL-3 Loop</span>
            </div>
          </div>
        </div>

        {/* Sensor & Telemetry Health */}
        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              DPI Sensor Fleet
            </span>
            <button 
              onClick={onNavigateToSensors}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center cursor-pointer"
            >
              Fleet Health <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          <div className="mt-3 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-lg font-bold text-white font-mono">4/4 Active</div>
              <div className="text-[11px] text-emerald-400 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> 0.00% dropped packets
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
            <span>Throughput: <strong className="text-slate-200">1.17 Gbps</strong></span>
            <span>Avg Buffer: <strong className="text-slate-200">18.4%</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Attack-Path Preview Banner (with Jump to Attack Path Map) */}
      <div className="p-5 rounded-xl bg-[#101726] border border-red-500/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-950 text-red-300 border border-red-700">
                MITRE ATT&CK ICS DETECTED
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {attackPath.id}</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {attackPath.title}
            </h2>
            <p className="text-xs text-slate-300 max-w-4xl leading-relaxed">
              {attackPath.description}
            </p>
          </div>

          <button
            onClick={onNavigateToAttackPath}
            className="flex-shrink-0 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer"
          >
            <span>Investigate Attack Path Graph</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mini Step-by-Step Hop Pipeline */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2 border-t border-slate-800/80">
          {[
            { step: '1', level: 'L4', name: 'VPN Gateway', ip: '10.240.10.1', proto: 'RDP' },
            { step: '2', level: 'L3.5', name: 'IDMZ Jump Host', ip: '172.24.10.15', proto: 'RDP Creds' },
            { step: '3', level: 'L2', name: 'EWS-01 (TIA)', ip: '192.168.20.50', proto: 'S7comm' },
            { step: '4', level: 'L1', name: 'S7-1518 PLC', ip: '192.168.10.101', proto: 'STOP Cmd' },
            { step: '5', level: 'L1', name: 'Triconex SIS', ip: '192.168.10.200', proto: 'Modbus 0x06' }
          ].map((hop, idx) => (
            <div key={hop.step} className="p-2.5 rounded-lg bg-[#0d131f] border border-[#1e293b] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-red-400 font-bold">HOP #{hop.step}</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">{hop.level}</span>
              </div>
              <div className="font-semibold text-white text-xs mt-1 truncate">{hop.name}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{hop.ip}</div>
              <div className="mt-1 text-[10px] text-red-300 font-mono bg-red-950/40 px-1 py-0.5 rounded border border-red-900/50 text-center">
                {hop.proto}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Purdue Model Asset Visibility Breakdown & Protocol Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purdue Model Hierarchy Breakdown */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-[#131b2e] border border-[#23314d] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Purdue Model Asset Visibility & Zone Health</h3>
              <p className="text-xs text-slate-400">Distribution of OT and Industrial control assets across Purdue Levels</p>
            </div>
            <button 
              onClick={onNavigateToAssets}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Open Full Hierarchy →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { level: 'L4', name: 'Enterprise IT', count: purdueCounts.L4.total, bad: purdueCounts.L4.anomalous, color: 'border-slate-600 bg-slate-800/40' },
              { level: 'L3.5', name: 'Industrial DMZ', count: purdueCounts['L3.5'].total, bad: purdueCounts['L3.5'].anomalous, color: 'border-amber-700 bg-amber-950/30' },
              { level: 'L3', name: 'Site Ops & MES', count: purdueCounts.L3.total, bad: purdueCounts.L3.anomalous, color: 'border-teal-700 bg-teal-950/30' },
              { level: 'L2', name: 'Supervisory / HMI', count: purdueCounts.L2.total, bad: purdueCounts.L2.anomalous, color: 'border-blue-700 bg-blue-950/30' },
              { level: 'L1', name: 'Basic Control & SIS', count: purdueCounts.L1.total, bad: purdueCounts.L1.anomalous, color: 'border-indigo-700 bg-indigo-950/30' },
              { level: 'L0', name: 'Process Field Instruments', count: purdueCounts.L0.total, bad: purdueCounts.L0.anomalous, color: 'border-purple-700 bg-purple-950/30' },
            ].map(zone => (
              <div key={zone.level} className={`p-3 rounded-lg border ${zone.color} flex flex-col justify-between space-y-2`}>
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-white">{zone.level}</span>
                  {zone.bad > 0 ? (
                    <span className="px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800 text-[10px]">
                      {zone.bad} ALERTS
                    </span>
                  ) : (
                    <span className="text-emerald-400 text-[10px]">NOMINAL</span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200 truncate">{zone.name}</div>
                  <div className="text-[11px] text-slate-400">{zone.count} devices monitored</div>
                </div>
              </div>
            ))}
          </div>

          {/* High-Risk Controllers Quick Table */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Priority Controller Investigation Targets
            </h4>
            <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden text-xs">
              {assets.filter(a => a.riskScore >= 80).map(asset => (
                <div 
                  key={asset.id} 
                  onClick={() => onSelectAsset(asset)}
                  className="p-3 bg-[#0f1626] hover:bg-[#19243d] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                      {asset.purdueLevel}
                    </span>
                    <div>
                      <div className="font-semibold text-white flex items-center space-x-2">
                        <span>{asset.name}</span>
                        <span className="text-slate-400 font-mono text-[11px]">({asset.tag})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {asset.ipAddress} • {asset.vendor} {asset.model}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-950 text-red-400 border border-red-800 font-mono">
                      Risk: {asset.riskScore}%
                    </span>
                    <button className="text-blue-400 hover:text-blue-300 p-1">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: OT Protocol DPI Telemetry & Timeline */}
        <div className="space-y-4">
          {/* Protocol DPI widget */}
          <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">OT Protocol Telemetry (24h)</h3>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping" /> DPI Active
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {protocols.slice(0, 4).map(proto => (
                <div key={proto.protocol} className="p-2.5 rounded bg-[#0f1626] border border-[#1f2b42] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{proto.protocol}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {proto.packetsPerSec} pkts/sec • {proto.activeSessions} sessions
                    </div>
                  </div>
                  <div className="text-right">
                    {proto.anomalousCommands24h > 0 ? (
                      <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-mono text-[10px] font-bold">
                        {proto.anomalousCommands24h} anomalous
                      </span>
                    ) : (
                      <span className="text-emerald-400 text-[10px] font-mono">nominal</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Change & Topology Timeline */}
          <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Industrial Event Timeline</h3>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2.5 text-xs">
              {timeline.map(item => (
                <div key={item.id} className="flex items-start space-x-2.5">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    item.severity === 'CRITICAL' ? 'bg-red-500 animate-pulse' :
                    item.severity === 'HIGH' ? 'bg-amber-400' : 'bg-blue-400'
                  }`} />
                  <div className="leading-tight flex-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-white">{item.title}</span>
                      <span className="text-slate-500 font-mono text-[10px]">{item.time}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {item.actor} • <span className="text-blue-400">{item.level}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
