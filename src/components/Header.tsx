import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Radio, 
  Activity, 
  AlertTriangle, 
  SlidersHorizontal,
  ChevronDown,
  Building2,
  RefreshCw,
  Bell,
  CheckCircle2,
  Lock,
  Layers,
  LogOut
} from 'lucide-react';
import { PlantSite } from '../types/ot-security';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  plantSites: PlantSite[];
  selectedSite: PlantSite;
  onSelectSite: (site: PlantSite) => void;
  criticalAlertCount: number;
  highAlertCount: number;
  onOpenSearch: () => void;
  onOpenAlerts: () => void;
  currentUser?: { name: string; role: string; email: string } | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  plantSites,
  selectedSite,
  onSelectSite,
  criticalAlertCount,
  highAlertCount,
  onOpenSearch,
  onOpenAlerts,
  currentUser,
  onSignOut,
}) => {
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const [plantModeOpen, setPlantModeOpen] = useState(false);
  const [activePlantMode, setActivePlantMode] = useState<PlantSite['operatingMode']>(selectedSite.operatingMode);

  const tabs = [
    { id: 'dashboard', label: 'Main Dashboard' },
    { id: 'attack-path', label: 'Attack Path Map' },
    { id: 'assets', label: 'Asset Inventory' },
    { id: 'alerts', label: 'Alerts & Detections', badge: criticalAlertCount + highAlertCount },
    { id: 'sensors', label: 'Sensor Health' },
    { id: 'protocols', label: 'Protocol DPI' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/95 backdrop-blur border-b border-[#1e293b] text-slate-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#162032] text-xs">
        {/* Left: Generic Brand & Facility Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 shadow-sm">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white uppercase">OT Security Platform</span>
              <span className="hidden md:inline-block ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                ENTERPRISE ICS/SCADA
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Site Selector Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
              className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[#131b2e] hover:bg-[#1a253f] border border-[#26334d] transition-colors text-slate-200 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-medium text-xs truncate max-w-[200px]">{selectedSite.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {siteDropdownOpen && (
              <div className="absolute left-0 mt-1 w-72 bg-[#131b2e] border border-[#26334d] rounded-md shadow-xl py-1 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-[#1e293b]">
                  Monitored Industrial Sites
                </div>
                {plantSites.map(site => (
                  <button
                    key={site.id}
                    onClick={() => {
                      onSelectSite(site);
                      setActivePlantMode(site.operatingMode);
                      setSiteDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#1e2a44] transition-colors ${
                      selectedSite.id === site.id ? 'bg-[#1e2a44] text-blue-400 font-medium' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-medium">{site.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{site.code} • {site.location}</div>
                    </div>
                    {site.activeAlerts > 0 ? (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-950 text-red-400 border border-red-800">
                        {site.activeAlerts} alerts
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> nominal
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Plant Operating Mode Badge */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setPlantModeOpen(!plantModeOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#101827] border border-[#223049] hover:border-slate-600 transition-colors"
            >
              <span className="text-slate-400">Plant State:</span>
              <span className={`font-semibold flex items-center space-x-1 ${
                activePlantMode === 'Emergency Islanding' 
                  ? 'text-red-400' 
                  : activePlantMode === 'Maintenance Window' 
                  ? 'text-amber-400' 
                  : 'text-emerald-400'
              }`}>
                <span className={`w-2 h-2 rounded-full inline-block ${
                  activePlantMode === 'Emergency Islanding' ? 'bg-red-500 animate-ping' :
                  activePlantMode === 'Maintenance Window' ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                }`} />
                <span>{activePlantMode}</span>
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {plantModeOpen && (
              <div className="absolute left-0 mt-1 w-56 bg-[#131b2e] border border-[#26334d] rounded shadow-lg py-1 z-50 text-xs">
                {(['Normal Operation', 'Maintenance Window', 'Emergency Islanding'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => {
                      setActivePlantMode(mode);
                      setPlantModeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-[#1c2740] ${activePlantMode === mode ? 'text-blue-400 font-semibold' : 'text-slate-300'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Sensor Health Pill, Incident Tickers, Search, Profile */}
        <div className="flex items-center space-x-3">
          {/* Sensor Health Indicator */}
          <div 
            onClick={() => onSelectTab('sensors')} 
            className="cursor-pointer hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/50 transition-colors"
            title="4 Physical TAPs & DPI Engines Online"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span className="font-mono text-[11px] font-medium">4/4 Sensors Active</span>
            <span className="text-[10px] text-emerald-500/80 font-mono hidden md:inline">• 0 dropped pkts</span>
          </div>

          {/* Quick Alert Counter Pills */}
          <div 
            onClick={onOpenAlerts}
            className="cursor-pointer flex items-center space-x-1 px-2 py-1 rounded bg-[#161f33] border border-[#26334d] hover:border-red-500/50 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-red-400 font-bold font-mono">{criticalAlertCount}</span>
            <span className="text-slate-500 text-[10px]">CRIT</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-bold font-mono">{highAlertCount}</span>
            <span className="text-slate-500 text-[10px]">HIGH</span>
          </div>

          {/* Quick Search Button */}
          <button 
            onClick={onOpenSearch}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#131b2e] border border-[#26334d] hover:bg-[#1c2740] text-slate-300 transition-colors cursor-pointer"
            title="Search Assets, CVEs, Protocols (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline text-xs text-slate-400">Search ICS...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700">⌘K</kbd>
          </button>

          {/* Analyst Status & Sign Out */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="w-6 h-6 rounded-full bg-orange-950/80 border border-orange-500/40 flex items-center justify-center text-[10px] font-bold text-orange-300">
              {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'JM'}
            </div>
            <div className="hidden xl:block text-left leading-tight">
              <div className="text-[11px] font-medium text-slate-200 truncate max-w-[120px]">
                {currentUser?.name || 'J. Martinez'}
              </div>
              <div className="text-[9px] text-slate-400 truncate max-w-[130px]">
                {currentUser?.role || 'SecOps Tier 3 (OT Lead)'}
              </div>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign out to landing page"
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors cursor-pointer ml-1"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center justify-between px-4 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 py-1 text-xs">
          {tabs.map(tab => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-t font-medium transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                  isActive 
                    ? 'border-blue-500 text-blue-400 bg-[#141e33] shadow-sm' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#131b2e]/60'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-950 text-red-400 border border-red-700/80">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Live Status indicator */}
        <div className="hidden md:flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-semibold">LIVE CAPTURE</span>
          </span>
          <span className="text-slate-600">|</span>
          <span>Buffer: 18.4%</span>
          <span className="text-slate-600">|</span>
          <span>Throughput: 1.17 Gbps</span>
        </div>
      </div>
    </header>
  );
};
