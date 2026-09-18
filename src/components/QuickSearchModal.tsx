import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Layers, 
  ShieldAlert, 
  Activity, 
  ArrowRight, 
  Cpu, 
  Flame, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { OTAsset, OTAlert } from '../types/ot-security';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: OTAsset[];
  alerts: OTAlert[];
  onSelectAsset: (asset: OTAsset) => void;
  onSelectAlert: (alert: OTAlert) => void;
  onNavigateToTab: (tab: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  assets,
  alerts,
  onSelectAsset,
  onSelectAlert,
  onNavigateToTab
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAssets = query.trim() ? assets.filter(a => 
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.tag.toLowerCase().includes(query.toLowerCase()) ||
    a.ipAddress.includes(query) ||
    a.vendor.toLowerCase().includes(query.toLowerCase()) ||
    a.model.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5) : assets.slice(0, 4);

  const filteredAlerts = query.trim() ? alerts.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.sourceAsset.toLowerCase().includes(query.toLowerCase()) ||
    a.destinationAsset.toLowerCase().includes(query.toLowerCase()) ||
    a.protocol.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4) : alerts.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-xl bg-[#111827] border border-[#26334d] shadow-2xl overflow-hidden flex flex-col text-slate-200">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-[#1e293b] flex items-center space-x-3 bg-[#131c2e]">
          <Search className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search industrial assets, alerts, IP addresses, CVEs, or Purdue levels..."
            autoFocus
            className="w-full bg-transparent border-none text-white text-sm focus:outline-none placeholder-slate-500 font-sans"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700">
            ESC
          </kbd>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Navigation Shortcuts */}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2">
              Platform Views
            </span>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {[
                { id: 'dashboard', label: 'Main Dashboard' },
                { id: 'attack-path', label: 'Attack Path Map' },
                { id: 'assets', label: 'Asset Inventory' },
                { id: 'alerts', label: 'Alerts & Detections' },
                { id: 'sensors', label: 'Sensor Health' },
                { id: 'protocols', label: 'Protocol DPI' },
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => {
                    onNavigateToTab(v.id);
                    onClose();
                  }}
                  className="p-2 rounded-lg bg-[#0d131f] hover:bg-[#19243d] border border-[#1e2a42] text-left text-slate-200 text-xs transition-colors flex items-center justify-between"
                >
                  <span>{v.label}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Asset matches */}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2">
              OT Assets & Controllers ({filteredAssets.length})
            </span>
            <div className="space-y-1.5 mt-1.5">
              {filteredAssets.map(asset => (
                <button
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-lg bg-[#0d131f] hover:bg-[#19243d] border border-[#1e2a42] text-left transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-bold bg-slate-800 text-slate-300">
                      {asset.purdueLevel}
                    </span>
                    <div>
                      <div className="font-semibold text-white">{asset.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {asset.tag} • {asset.ipAddress} • {asset.vendor}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-blue-400 flex items-center">
                    Inspect <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Alert matches */}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2">
              Security Incidents & Anomalies ({filteredAlerts.length})
            </span>
            <div className="space-y-1.5 mt-1.5">
              {filteredAlerts.map(alert => (
                <button
                  key={alert.id}
                  onClick={() => {
                    onSelectAlert(alert);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-lg bg-[#0d131f] hover:bg-[#19243d] border border-[#1e2a42] text-left transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    <div>
                      <div className="font-semibold text-white">{alert.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {alert.purdueTransition} • {alert.protocol} • {alert.timestamp}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-red-400 font-mono font-bold">
                    {alert.severity}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-2.5 bg-[#0b0f17] border-t border-[#1e293b] flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Search tip: Type "PLC", "Triconex", "Modbus", or an IP like "192.168"</span>
          <span>ENTER to select • ESC to close</span>
        </div>
      </div>
    </div>
  );
};
