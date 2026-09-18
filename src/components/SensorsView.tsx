import React, { useState } from 'react';
import { 
  OTSensor 
} from '../types/ot-security';
import { 
  Radio, 
  Activity, 
  CheckCircle2, 
  Download, 
  HardDrive, 
  Cpu, 
  RefreshCw, 
  AlertTriangle,
  Server,
  Zap,
  Sliders,
  Layers,
  Terminal,
  Clock
} from 'lucide-react';

interface SensorsViewProps {
  sensors: OTSensor[];
}

export const SensorsView: React.FC<SensorsViewProps> = ({ sensors }) => {
  const [downloadingSensorId, setDownloadingSensorId] = useState<string | null>(null);
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  const handleDownloadPcap = (sensor: OTSensor) => {
    setDownloadingSensorId(sensor.id);
    setTimeout(() => {
      setDownloadingSensorId(null);
      setDownloadNotification(`Forensic PCAP stream (48.2 MB) successfully exported for ${sensor.name}.`);
      setTimeout(() => setDownloadNotification(null), 4000);
    }, 1200);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span>OT Sensor Fleet & Industrial Network DPI Telemetry</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Zero-loss network visibility across passive optical TAPs, switch SPAN mirrors, and hardware inline DPI packet analyzers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700 font-mono text-xs flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            4/4 Sensors Operational (0.00% Packet Loss)
          </span>
        </div>
      </div>

      {downloadNotification && (
        <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/60 font-mono text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadNotification}</span>
          </div>
          <button onClick={() => setDownloadNotification(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Aggregate Health Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] space-y-1">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Total Packet Loss</span>
          <div className="text-2xl font-mono font-bold text-emerald-400">0.00%</div>
          <div className="text-[11px] text-slate-400">Zero packet drops across all fiber taps</div>
        </div>

        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] space-y-1">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Aggregate Ingestion Rate</span>
          <div className="text-2xl font-mono font-bold text-white">1.17 <span className="text-base text-slate-400">Gbps</span></div>
          <div className="text-[11px] text-slate-400">400,820,620 packets in last hour</div>
        </div>

        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] space-y-1">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">NIC Ring Buffer Headroom</span>
          <div className="text-2xl font-mono font-bold text-blue-400">81.6% <span className="text-base text-slate-400">free</span></div>
          <div className="text-[11px] text-slate-400">Avg buffer load: 18.4%</div>
        </div>

        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] space-y-1">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Sensor Heartbeat Jitter</span>
          <div className="text-2xl font-mono font-bold text-emerald-400">&lt; 2 ms</div>
          <div className="text-[11px] text-slate-400">Sync status: PTP IEEE 1588 active</div>
        </div>
      </div>

      {/* Sensor Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sensors.map(sensor => {
          const isDownloading = downloadingSensorId === sensor.id;

          return (
            <div
              key={sensor.id}
              className="p-5 rounded-xl bg-[#131b2e] border border-[#23314d] flex flex-col justify-between space-y-4 shadow"
            >
              {/* Sensor Header */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                        {sensor.status}
                      </span>
                      <span className="text-xs font-mono text-slate-400">IP: {sensor.ipAddress}</span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {sensor.name}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {sensor.type}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mt-2">
                  <span>Location: </span>
                  <span className="text-slate-200 font-medium">{sensor.location}</span>
                </div>

                {/* Purdue Coverage Tags */}
                <div className="flex items-center space-x-1.5 mt-2 text-[11px]">
                  <span className="text-slate-400">Purdue Coverage:</span>
                  {sensor.purdueCoverage.map(lvl => (
                    <span key={lvl} className="px-1.5 py-0.2 rounded bg-slate-900 text-blue-300 font-mono text-[10px] border border-slate-700">
                      {lvl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Real-time Hardware Meters */}
              <div className="p-3 rounded-lg bg-[#0d131f] border border-[#1e2a42] space-y-2 text-xs">
                {/* Throughput */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Ingestion Throughput</span>
                    <span className="font-mono text-white">
                      {sensor.throughputMbps} Mbps / {sensor.bandwidthGbps * 1000} Mbps
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${Math.min((sensor.throughputMbps / (sensor.bandwidthGbps * 10)) * 100, 100)}%` }} 
                    />
                  </div>
                </div>

                {/* Ring Buffer */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Buffer Utilization</span>
                    <span className="font-mono text-emerald-400">{sensor.bufferUtilizationPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${sensor.bufferUtilizationPct}%` }} 
                    />
                  </div>
                </div>

                {/* CPU / Memory grid */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">CPU Load:</span>
                    <span className="font-mono text-slate-200">{sensor.cpuLoadPct}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Memory:</span>
                    <span className="font-mono text-slate-200">{sensor.memoryPct}%</span>
                  </div>
                </div>
              </div>

              {/* Sensor Footer & PCAP Export */}
              <div className="pt-2 border-t border-[#1e2a42] flex items-center justify-between text-xs">
                <div className="text-slate-400 font-mono text-[11px]">
                  <span>FW: {sensor.firmwareVersion}</span> • <span>Ping: {sensor.lastHeartbeat}</span>
                </div>

                <button
                  onClick={() => handleDownloadPcap(sensor)}
                  disabled={isDownloading}
                  className="px-3 py-1.5 rounded bg-[#162032] hover:bg-[#1e2a44] border border-[#23314d] text-slate-200 text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Download className={`w-3.5 h-3.5 text-blue-400 ${isDownloading ? 'animate-bounce' : ''}`} />
                  <span>{isDownloading ? 'Generating PCAP...' : 'Export Sensor PCAP'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
