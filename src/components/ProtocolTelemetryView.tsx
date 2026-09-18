import React, { useState } from 'react';
import { 
  ProtocolTelemetry, 
  ProtocolType 
} from '../types/ot-security';
import { 
  Activity, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Radio, 
  FileCode, 
  Play, 
  Cpu, 
  Layers, 
  Sliders, 
  ArrowUpRight 
} from 'lucide-react';

interface ProtocolTelemetryViewProps {
  protocols: ProtocolTelemetry[];
}

export const ProtocolTelemetryView: React.FC<ProtocolTelemetryViewProps> = ({ protocols }) => {
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolTelemetry>(protocols[0]);
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulatedLog, setSimulatedLog] = useState<string | null>(null);

  const handleSimulateDpiTest = () => {
    setSimulationActive(true);
    setSimulatedLog('Injecting synthetic Modbus FC 0x06 Write Single Register packet to Port 502...');
    setTimeout(() => {
      setSimulatedLog('DPI Engine matched Rule #ICS-MODBUS-WRITE-DENY: Packet blocked, alert ALT-2026-901 generated!');
      setSimulationActive(false);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span>Industrial Protocol Deep Packet Inspection (DPI)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time dissection of OT protocol PDUs, function code baselines, and anomalous control write command detection.
          </p>
        </div>

        <button
          onClick={handleSimulateDpiTest}
          disabled={simulationActive}
          className="flex items-center space-x-2 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{simulationActive ? 'Running DPI Test...' : 'Test DPI Rule Trigger'}</span>
        </button>
      </div>

      {simulatedLog && (
        <div className="p-3 rounded-lg bg-[#0f172a] border border-blue-500/60 font-mono text-xs text-blue-300 flex items-center justify-between">
          <span>{simulatedLog}</span>
          <button onClick={() => setSimulatedLog(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Protocols Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {protocols.map(proto => {
          const isSelected = selectedProtocol.protocol === proto.protocol;
          const isAnomalous = proto.status === 'ANOMALOUS';

          return (
            <div
              key={proto.protocol}
              onClick={() => setSelectedProtocol(proto)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected 
                  ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/50 shadow-lg' 
                  : isAnomalous 
                  ? 'bg-[#151221] border-red-500/40 hover:border-red-400' 
                  : 'bg-[#131b2e] border-[#23314d] hover:bg-[#19243d]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300">
                  {proto.activeSessions} SESS
                </span>
                {isAnomalous ? (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </div>

              <div>
                <div className="font-bold text-white text-xs leading-snug">{proto.protocol}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {proto.packetsPerSec} pkts/s
                </div>
              </div>

              <div className="pt-2 border-t border-[#1e2a42] flex justify-between text-[10px]">
                <span className="text-slate-400">Anomalies:</span>
                <span className={proto.anomalousCommands24h > 0 ? 'text-red-400 font-bold font-mono' : 'text-emerald-400 font-mono'}>
                  {proto.anomalousCommands24h}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Protocol Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Function Code Distribution & Policy */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#131b2e] border border-[#23314d] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {selectedProtocol.protocol} Function Code Dissection
              </h3>
              <p className="text-xs text-slate-400">Baseline telemetry and inspected function code distribution over past 24 hours</p>
            </div>

            <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
              selectedProtocol.status === 'ANOMALOUS' 
                ? 'bg-red-950 text-red-400 border border-red-800' 
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              {selectedProtocol.status}
            </span>
          </div>

          {/* Function Codes Table */}
          <div className="rounded-lg border border-[#23314d] overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#101726] border-b border-[#23314d] text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Function Code</th>
                  <th className="p-3">Function Name / Description</th>
                  <th className="p-3">Count (24h)</th>
                  <th className="p-3 text-right">Policy Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {selectedProtocol.commonFunctionCodes.map(fc => {
                  const isAnomalousWrite = fc.name.includes('Alert') || fc.name.includes('CRITICAL');

                  return (
                    <tr key={fc.code} className="hover:bg-[#19243d] transition-colors">
                      <td className="p-3 font-mono font-bold text-blue-400">{fc.code}</td>
                      <td className="p-3 text-slate-200">
                        <div className="font-semibold">{fc.name}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-300">
                        {fc.count.toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        {isAnomalousWrite ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-800">
                            BLOCKED BY RULE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            ALLOWED (READ)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Protocol Security Policies */}
        <div className="p-5 rounded-xl bg-[#131b2e] border border-[#23314d] space-y-4 text-xs">
          <h3 className="text-base font-bold text-white tracking-tight">
            Industrial Conduit Policies
          </h3>
          <p className="text-slate-300 leading-relaxed">
            Active Layer 7 firewall and deep packet inspection constraints enforced for {selectedProtocol.protocol}.
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[#0d131f] border border-[#1e2a42] space-y-1">
              <div className="font-semibold text-white">Strict Read-Only Enforcement</div>
              <div className="text-[11px] text-slate-400">All write function codes rejected unless originating from verified EWS-01 MAC on Conduit C-21.</div>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">STATUS: ENFORCED ✓</span>
            </div>

            <div className="p-3 rounded-lg bg-[#0d131f] border border-[#1e2a42] space-y-1">
              <div className="font-semibold text-white">Unit ID / Slave Address Whitelist</div>
              <div className="text-[11px] text-slate-400">Only Slave IDs 1 through 16 accepted on L1 Substation segments.</div>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">STATUS: ACTIVE ✓</span>
            </div>

            <div className="p-3 rounded-lg bg-[#0d131f] border border-[#1e2a42] space-y-1">
              <div className="font-semibold text-white">Rate Anomaly Threshold</div>
              <div className="text-[11px] text-slate-400">Alert triggered if packet frequency exceeds 2,500 pkts/s per controller session.</div>
              <span className="text-[10px] text-blue-400 font-mono font-semibold">THRESHOLD: 2,500 pps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
