import React, { useState, useMemo } from 'react';
import { 
  OTAsset, 
  PurdueLevel 
} from '../types/ot-security';
import { 
  Layers, 
  List, 
  Search, 
  Filter, 
  Download, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Server, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown,
  Tag,
  Radio,
  FileText
} from 'lucide-react';

interface AssetInventoryViewProps {
  assets: OTAsset[];
  onSelectAsset: (asset: OTAsset) => void;
  selectedAssetId: string | null;
}

export const AssetInventoryView: React.FC<AssetInventoryViewProps> = ({
  assets,
  onSelectAsset,
  selectedAssetId
}) => {
  const [viewMode, setViewMode] = useState<'hierarchy' | 'table'>('hierarchy');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [vendorFilter, setVendorFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [vulnerableOnly, setVulnerableOnly] = useState(false);

  // Filter logic
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      if (levelFilter !== 'ALL' && asset.purdueLevel !== levelFilter) return false;
      if (vendorFilter !== 'ALL' && asset.vendor !== vendorFilter) return false;
      if (statusFilter !== 'ALL' && asset.status !== statusFilter) return false;
      if (vulnerableOnly && !asset.firmwareVulnerable) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          asset.name.toLowerCase().includes(q) ||
          asset.tag.toLowerCase().includes(q) ||
          asset.ipAddress.toLowerCase().includes(q) ||
          asset.vendor.toLowerCase().includes(q) ||
          asset.model.toLowerCase().includes(q) ||
          asset.zone.toLowerCase().includes(q) ||
          asset.protocols.some(p => p.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [assets, levelFilter, vendorFilter, statusFilter, vulnerableOnly, searchQuery]);

  // Grouped by Purdue Level for Hierarchy view
  const groupedHierarchy: Record<PurdueLevel, { title: string; desc: string; color: string; items: OTAsset[] }> = {
    'L4': {
      title: 'Level 4: Enterprise Operations & Corporate Boundary',
      desc: 'Enterprise IT boundary gateways, enterprise patch servers, corporate ERP/MES sync conduits',
      color: 'border-slate-600 text-slate-300',
      items: filteredAssets.filter(a => a.purdueLevel === 'L4')
    },
    'L3.5': {
      title: 'Level 3.5: Industrial DMZ (IDMZ)',
      desc: 'Dual-homed jump boxes, OT remote vendor access staging, data diodes, antivirus mirrors',
      color: 'border-amber-600 text-amber-300',
      items: filteredAssets.filter(a => a.purdueLevel === 'L3.5')
    },
    'L3': {
      title: 'Level 3: Site Operations & MES',
      desc: 'Plant Historians (OSIsoft PI), Manufacturing Execution Systems, OT domain controllers',
      color: 'border-teal-600 text-teal-300',
      items: filteredAssets.filter(a => a.purdueLevel === 'L3')
    },
    'L2': {
      title: 'Level 2: Supervisory Control & Human-Machine Interfaces (HMI)',
      desc: 'Engineering Workstations (TIA Portal, ControlLogix), Operator consoles, Supervisory SCADA servers',
      color: 'border-blue-600 text-blue-300',
      items: filteredAssets.filter(a => a.purdueLevel === 'L2')
    },
    'L1': {
      title: 'Level 1: Basic Process Control & Safety Instrumented Systems (SIS)',
      desc: 'Programmable Logic Controllers (PLCs), Remote Terminal Units (RTUs), SIL-3 Safety Controllers (Triconex)',
      color: 'border-indigo-600 text-indigo-300',
      items: filteredAssets.filter(a => a.purdueLevel === 'L1')
    },
    'L0': {
      title: 'Level 0: Physical Process Field Instruments & Actuators',
      desc: 'Motor-operated valves (MOV), variable speed drives (VFD), temperature transmitters, pressure transmitters',
      color: 'border-purple-600 text-purple-300',
      items: filteredAssets.filter(a => a.purdueLevel === 'L0')
    }
  };

  const purdueBadgeColors: Record<PurdueLevel, string> = {
    'L0': 'bg-purple-950/80 text-purple-300 border-purple-800',
    'L1': 'bg-indigo-950/80 text-indigo-300 border-indigo-700',
    'L2': 'bg-blue-950/80 text-blue-300 border-blue-700',
    'L3': 'bg-teal-950/80 text-teal-300 border-teal-700',
    'L3.5': 'bg-amber-950/80 text-amber-300 border-amber-700',
    'L4': 'bg-slate-800 text-slate-300 border-slate-600'
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Tag,Name,PurdueLevel,DeviceType,Vendor,Model,Firmware,IPAddress,MACAddress,RiskScore,Zone,Conduit,Status,CVEs"]
        .concat(filteredAssets.map(a => 
          `"${a.tag}","${a.name}","${a.purdueLevel}","${a.deviceType}","${a.vendor}","${a.model}","${a.firmware}","${a.ipAddress}","${a.macAddress}",${a.riskScore},"${a.zone}","${a.conduit}","${a.status}","${a.cveCount}"`
        )).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `OT_Security_Asset_Inventory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto text-slate-200">
      {/* Header & Metric Highlights */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Purdue Model Asset Inventory & OT Hierarchy</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete discovery catalog of industrial control systems, field instruments, conduits, and firmware vulnerability postures.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#162032] hover:bg-[#1e2a44] border border-[#26334d] text-slate-200 text-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export CSV</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex rounded bg-[#162032] p-0.5 border border-[#23314d] text-xs">
            <button
              onClick={() => setViewMode('hierarchy')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition-colors ${
                viewMode === 'hierarchy' ? 'bg-blue-600 text-white font-medium shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Purdue View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-blue-600 text-white font-medium shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Asset Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3.5 rounded-xl bg-[#131b2e] border border-[#23314d] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by asset tag, name, IP address, vendor, firmware, zone..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0b0f17] border border-[#23314d] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Purdue Level Filter */}
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="bg-[#0b0f17] border border-[#23314d] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
          >
            <option value="ALL">All Purdue Levels</option>
            <option value="L4">Level 4 Enterprise</option>
            <option value="L3.5">Level 3.5 IDMZ</option>
            <option value="L3">Level 3 Operations</option>
            <option value="L2">Level 2 Supervisory</option>
            <option value="L1">Level 1 Basic Control</option>
            <option value="L0">Level 0 Field</option>
          </select>

          {/* Vendor Filter */}
          <select
            value={vendorFilter}
            onChange={e => setVendorFilter(e.target.value)}
            className="bg-[#0b0f17] border border-[#23314d] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
          >
            <option value="ALL">All Vendors</option>
            <option value="Siemens">Siemens</option>
            <option value="Rockwell Automation">Rockwell Automation</option>
            <option value="Schneider/Triconex">Schneider / Triconex</option>
            <option value="Schneider Electric">Schneider Electric</option>
            <option value="Honeywell">Honeywell</option>
            <option value="Yokogawa">Yokogawa</option>
            <option value="Emerson">Emerson</option>
            <option value="OSIsoft">OSIsoft</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#0b0f17] border border-[#23314d] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ONLINE">Online Nominal</option>
            <option value="ANOMALOUS">Anomalous Spike</option>
            <option value="WARNING">Warning</option>
          </select>

          {/* Vulnerable Only Toggle */}
          <label className="flex items-center space-x-1.5 text-slate-300 cursor-pointer select-none bg-[#0b0f17] px-2.5 py-1.5 rounded-lg border border-[#23314d]">
            <input
              type="checkbox"
              checked={vulnerableOnly}
              onChange={e => setVulnerableOnly(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-red-500 focus:ring-0"
            />
            <span className="text-red-400 font-medium">Vulnerable FW Only</span>
          </label>
        </div>
      </div>

      {/* VIEW 1: PURDUE HIERARCHY */}
      {viewMode === 'hierarchy' && (
        <div className="space-y-6">
          {(['L4', 'L3.5', 'L3', 'L2', 'L1', 'L0'] as PurdueLevel[]).map(levelKey => {
            const lane = groupedHierarchy[levelKey];
            if (lane.items.length === 0) return null;

            return (
              <div key={levelKey} className="space-y-3">
                {/* Lane Header */}
                <div className="flex items-center justify-between border-b border-[#1e2a42] pb-2">
                  <div className="flex items-center space-x-2.5">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono border ${purdueBadgeColors[levelKey]}`}>
                      Purdue {levelKey}
                    </span>
                    <h3 className="font-bold text-white text-sm">{lane.title}</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {lane.items.length} {lane.items.length === 1 ? 'device' : 'devices'}
                  </span>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {lane.items.map(asset => {
                    const isSelected = selectedAssetId === asset.id;
                    const isHighRisk = asset.riskScore >= 80;

                    return (
                      <div
                        key={asset.id}
                        onClick={() => onSelectAsset(asset)}
                        className={`p-4 rounded-xl bg-[#131b2e] border transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:bg-[#19243d] hover:border-slate-500 ${
                          isSelected ? 'ring-2 ring-blue-500 border-blue-500 shadow-xl' :
                          isHighRisk ? 'border-red-500/40 bg-red-950/10' : 'border-[#23314d]'
                        }`}
                      >
                        {/* Card Top */}
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[11px] font-mono text-blue-400 font-bold block">{asset.tag}</span>
                              <h4 className="font-bold text-white text-sm leading-snug mt-0.5">{asset.name}</h4>
                            </div>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              asset.riskScore >= 90 ? 'bg-red-950 text-red-400 border border-red-800' :
                              asset.riskScore >= 60 ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              RISK: {asset.riskScore}%
                            </span>
                          </div>

                          <div className="mt-2 text-xs text-slate-400 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span>Hardware / Make:</span>
                              <span className="font-medium text-slate-200">{asset.vendor} {asset.model}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span>IP Address:</span>
                              <span className="font-mono text-slate-200">{asset.ipAddress}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span>Firmware:</span>
                              <span className="font-mono text-slate-200 flex items-center">
                                {asset.firmware}
                                {asset.firmwareVulnerable && (
                                  <span className="ml-1 text-[9px] px-1 rounded bg-red-950 text-red-400 border border-red-800 font-bold">
                                    CVE
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom: Protocols & Conduit */}
                        <div className="pt-2.5 border-t border-[#1e2a42] flex items-center justify-between text-[11px]">
                          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none max-w-[70%]">
                            {asset.protocols.slice(0, 2).map(proto => (
                              <span key={proto} className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 font-mono text-[10px] border border-slate-700">
                                {proto}
                              </span>
                            ))}
                          </div>

                          <span className="text-blue-400 font-medium flex items-center hover:underline">
                            Inspect <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: DENSE INDUSTRIAL ASSET TABLE */}
      {viewMode === 'table' && (
        <div className="rounded-xl border border-[#23314d] bg-[#131b2e] overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#101726] border-b border-[#23314d] text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Purdue</th>
                  <th className="p-3">Asset Tag & Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Vendor / Model</th>
                  <th className="p-3">Firmware</th>
                  <th className="p-3">IP & MAC</th>
                  <th className="p-3">Zone & Conduit</th>
                  <th className="p-3">CVEs</th>
                  <th className="p-3">Risk</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {filteredAssets.map(asset => (
                  <tr
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className="hover:bg-[#19243d] transition-colors cursor-pointer"
                  >
                    <td className="p-3 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${purdueBadgeColors[asset.purdueLevel]}`}>
                        {asset.purdueLevel}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-white">{asset.name}</div>
                      <div className="text-[11px] font-mono text-blue-400">{asset.tag}</div>
                    </td>
                    <td className="p-3 text-slate-300">{asset.deviceType}</td>
                    <td className="p-3 font-medium text-slate-200">
                      <div>{asset.vendor}</div>
                      <div className="text-[10px] text-slate-400">{asset.model}</div>
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      <span className={asset.firmwareVulnerable ? 'text-red-400' : 'text-slate-300'}>
                        {asset.firmware}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      <div>{asset.ipAddress}</div>
                      <div className="text-[10px] text-slate-500">{asset.macAddress}</div>
                    </td>
                    <td className="p-3 text-[11px]">
                      <div className="text-slate-200 truncate max-w-[140px]">{asset.zone}</div>
                      <div className="text-slate-400 font-mono text-[10px] truncate max-w-[140px]">{asset.conduit}</div>
                    </td>
                    <td className="p-3 font-mono text-center">
                      {asset.cveCount > 0 ? (
                        <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold">
                          {asset.cveCount}
                        </span>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>
                    <td className="p-3 font-mono">
                      <span className={`font-bold ${
                        asset.riskScore >= 90 ? 'text-red-400' :
                        asset.riskScore >= 60 ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {asset.riskScore}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        asset.status === 'ANOMALOUS' ? 'bg-red-950 text-red-400 border border-red-800' :
                        asset.status === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 font-medium text-[11px]">
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
