import React, { useState, useMemo } from 'react';
import { 
  OTAlert, 
  Severity,
  OTAsset 
} from '../types/ot-security';
import { 
  AlertTriangle, 
  Flame, 
  Search, 
  Filter, 
  Terminal, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  ArrowRight, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  Lock,
  Layers
} from 'lucide-react';

interface AlertsViewProps {
  alerts: OTAlert[];
  assets: OTAsset[];
  onSelectAlert: (alert: OTAlert) => void;
  onSelectAssetById: (assetId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts: initialAlerts,
  assets,
  onSelectAlert,
  onSelectAssetById
}) => {
  const [alerts, setAlerts] = useState<OTAlert[]>(initialAlerts);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(initialAlerts[0]?.id || null);
  const [copiedHexId, setCopiedHexId] = useState<string | null>(null);

  // Status mutation
  const handleUpdateStatus = (alertId: string, newStatus: OTAlert['status']) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
  };

  const handleCopyHex = (alertId: string, hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHexId(alertId);
    setTimeout(() => setCopiedHexId(null), 2000);
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      if (severityFilter !== 'ALL' && alert.severity !== severityFilter) return false;
      if (statusFilter !== 'ALL' && alert.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          alert.title.toLowerCase().includes(q) ||
          alert.sourceAsset.toLowerCase().includes(q) ||
          alert.destinationAsset.toLowerCase().includes(q) ||
          alert.protocol.toLowerCase().includes(q) ||
          alert.anomalyType.toLowerCase().includes(q) ||
          alert.sourceIp.includes(q) ||
          alert.destinationIp.includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [alerts, severityFilter, statusFilter, searchQuery]);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span>OT Security Incident & Anomaly Detections</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time deep packet inspection (DPI) of industrial protocols, unauthorized PLC command writes, and lateral movement attempts.
          </p>
        </div>

        {/* Counters summary */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-800">
            {alerts.filter(a => a.severity === 'CRITICAL').length} Critical
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
            {alerts.filter(a => a.severity === 'HIGH').length} High
          </span>
          <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800">
            {alerts.filter(a => a.severity === 'MEDIUM').length} Medium
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-xl bg-[#131b2e] border border-[#23314d] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search alerts by IP, controller tag, protocol, function code, anomaly type..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0b0f17] border border-[#23314d] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        {/* Severity filter */}
        <div className="flex items-center space-x-2">
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-[#0b0f17] border border-[#23314d] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#0b0f17] border border-[#23314d] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
          >
            <option value="ALL">All Investigation States</option>
            <option value="NEW">New Alert</option>
            <option value="INVESTIGATING">Under Investigation</option>
            <option value="CONTAINED">Contained</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => {
          const isExpanded = expandedAlertId === alert.id;
          const isCritical = alert.severity === 'CRITICAL';
          const isHigh = alert.severity === 'HIGH';

          return (
            <div
              key={alert.id}
              className={`rounded-xl bg-[#131b2e] border transition-all overflow-hidden shadow ${
                isCritical ? 'border-red-500/50 bg-gradient-to-r from-red-950/20 via-[#131b2e] to-[#131b2e]' :
                isHigh ? 'border-amber-500/40' : 'border-[#23314d]'
              }`}
            >
              {/* Alert Header Row */}
              <div 
                onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-[#18233c] transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isCritical ? 'bg-red-950 text-red-400 border border-red-800' :
                    isHigh ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}>
                    {isCritical ? <Flame className="w-4 h-4 animate-pulse" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        isCritical ? 'bg-red-950 text-red-300 border border-red-800' :
                        isHigh ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {alert.purdueTransition}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800">
                        {alert.protocol} {alert.functionCode && `• ${alert.functionCode}`}
                      </span>
                      <span className="text-slate-400 text-xs font-mono">{alert.timestamp}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {alert.title}
                    </h3>
                  </div>
                </div>

                {/* Status selector & Action */}
                <div className="flex items-center space-x-3 self-end md:self-center">
                  <select
                    value={alert.status}
                    onClick={e => e.stopPropagation()}
                    onChange={e => handleUpdateStatus(alert.id, e.target.value as any)}
                    className="bg-[#0b0f17] border border-[#23314d] text-slate-300 rounded px-2.5 py-1 text-xs focus:outline-none"
                  >
                    <option value="NEW">NEW</option>
                    <option value="INVESTIGATING">INVESTIGATING</option>
                    <option value="CONTAINED">CONTAINED</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSelectAlert(alert);
                    }}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center space-x-1"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </button>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Collapsible Expanded Details */}
              {isExpanded && (
                <div className="p-4 border-t border-[#1e293b] bg-[#0d131f] space-y-4 text-xs">
                  <p className="text-slate-300 leading-relaxed max-w-5xl">
                    {alert.description}
                  </p>

                  {/* Flow Endpoint Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-1">
                      <span className="text-slate-400 block text-[11px]">Source Controller / Station:</span>
                      <div className="font-bold text-white">{alert.sourceAsset}</div>
                      <div className="font-mono text-slate-300 text-[11px]">{alert.sourceIp}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-1">
                      <span className="text-slate-400 block text-[11px]">Destination Target:</span>
                      <div className="font-bold text-red-400">{alert.destinationAsset}</div>
                      <div className="font-mono text-slate-300 text-[11px]">{alert.destinationIp}</div>
                    </div>
                  </div>

                  {/* Raw Packet Hex & Decoded Fields */}
                  <div className="p-3 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 flex items-center">
                        <Terminal className="w-4 h-4 text-emerald-400 mr-1.5" />
                        Captured DPI Packet Payload
                      </span>
                      <button
                        onClick={() => handleCopyHex(alert.id, alert.packetSummary.rawHexPreview)}
                        className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-[11px]"
                      >
                        {copiedHexId === alert.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedHexId === alert.id ? 'Copied' : 'Copy Hex'}</span>
                      </button>
                    </div>

                    <div className="p-2.5 rounded bg-black/80 font-mono text-[11px] text-emerald-400 border border-emerald-950 overflow-x-auto">
                      {alert.packetSummary.rawHexPreview}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
                      {Object.entries(alert.packetSummary.decodedFields).map(([k, v]) => (
                        <div key={k} className="p-1.5 rounded bg-[#0f1626] border border-[#1e2a42]">
                          <span className="text-slate-400 block font-sans text-[10px]">{k}</span>
                          <span className="text-slate-200 font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Containment Actions */}
                  <div className="p-3 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-2">
                    <span className="font-semibold text-slate-200 block">Recommended SOC Action Playbook</span>
                    <ul className="space-y-1.5 text-[11px]">
                      {alert.recommendedActions.map((action, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
