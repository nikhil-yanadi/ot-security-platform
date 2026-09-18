import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  ExternalLink, 
  Terminal, 
  FileCode, 
  AlertOctagon, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Radio, 
  Layers, 
  Zap, 
  Cpu, 
  ArrowRight, 
  Download, 
  FileText, 
  Check, 
  Clock, 
  User, 
  Send,
  Sliders,
  Flame,
  Maximize2,
  Minimize2,
  Copy,
  ChevronRight
} from 'lucide-react';
import { OTAsset, OTAlert, PurdueLevel } from '../types/ot-security';

interface InvestigationSidePanelProps {
  asset: OTAsset | null;
  alert: OTAlert | null;
  onClose: () => void;
  onSelectAssetById: (assetId: string) => void;
}

export const InvestigationSidePanel: React.FC<InvestigationSidePanelProps> = ({
  asset,
  alert,
  onClose,
  onSelectAssetById
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'mitre' | 'telemetry' | 'cves' | 'playbook' | 'audit'>('overview');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedHex, setCopiedHex] = useState(false);
  
  // Interactive remediation state
  const [remediationStates, setRemediationStates] = useState<{ [key: string]: boolean }>({
    firewall: false,
    dpi_ro: false,
    isolate: false,
    ticket: false,
    pcap: false
  });

  // Interactive notes state
  const [notes, setNotes] = useState<Array<{ id: string; user: string; text: string; time: string }>>([
    {
      id: '1',
      user: 'J. Martinez (SecOps Tier 3)',
      text: 'Verified anomalous packet on TAP-02. Modbus FC 0x06 targeting register 40012 coincides with off-shift contractor RDP session.',
      time: '12 mins ago'
    },
    {
      id: '2',
      user: 'D. Vance (OT Engineer)',
      text: 'Field technician dispatched to AER-1. Physical key switch verified in REMOTE position; advised switching to RUN mode.',
      time: '5 mins ago'
    }
  ]);
  const [newNote, setNewNote] = useState('');

  if (!asset && !alert) return null;

  const purdueBadgeColors: Record<PurdueLevel, string> = {
    'L0': 'bg-purple-950/80 text-purple-300 border-purple-800',
    'L1': 'bg-indigo-950/80 text-indigo-300 border-indigo-700',
    'L2': 'bg-blue-950/80 text-blue-300 border-blue-700',
    'L3': 'bg-teal-950/80 text-teal-300 border-teal-700',
    'L3.5': 'bg-amber-950/80 text-amber-300 border-amber-700',
    'L4': 'bg-slate-800 text-slate-300 border-slate-600'
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  const toggleRemediation = (key: string) => {
    setRemediationStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes(prev => [
      ...prev,
      {
        id: String(Date.now()),
        user: 'J. Martinez (SecOps Tier 3)',
        text: newNote.trim(),
        time: 'Just now'
      }
    ]);
    setNewNote('');
  };

  const purdueLevel = asset?.purdueLevel || 'L1';
  const riskScore = asset?.riskScore || (alert?.severity === 'CRITICAL' ? 95 : 75);

  return (
    <aside 
      className={`fixed top-14 right-0 bottom-0 z-50 bg-[#0d131f] border-l border-[#223049] shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-full md:w-[760px]' : 'w-full sm:w-[480px]'
      }`}
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-[#1e293b] bg-[#111827]">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono border ${purdueBadgeColors[purdueLevel]}`}>
                Purdue {purdueLevel}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {asset?.tag || alert?.sourceAsset}
              </span>
              {riskScore >= 90 ? (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-red-950 text-red-400 border border-red-800 flex items-center">
                  <Flame className="w-3 h-3 mr-1 text-red-400 animate-pulse" />
                  RISK: {riskScore}/100
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-amber-950 text-amber-400 border border-amber-800">
                  RISK: {riskScore}/100
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-white tracking-tight leading-snug">
              {asset?.name || alert?.title}
            </h3>
            <div className="text-xs text-slate-400 flex items-center space-x-3 font-mono">
              <span>IP: {asset?.ipAddress || alert?.sourceIp}</span>
              <span>•</span>
              <span>MAC: {asset?.macAddress || '00:60:AD:12:89:FE'}</span>
              <span>•</span>
              <span className="text-blue-400">{asset?.vendor || 'Industrial Hardware'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand Width'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-3 border-t border-[#1e293b] pt-2 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'mitre', label: 'Attack & MITRE' },
            { id: 'telemetry', label: 'DPI Telemetry' },
            { id: 'cves', label: `CVEs (${asset?.cveCount || 3})` },
            { id: 'playbook', label: 'Remediation' },
            { id: 'audit', label: 'Analyst Notes' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2337]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Panel Body Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-300">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Risk & Blast Radius Box */}
            <div className="p-3.5 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center">
                  <AlertOctagon className="w-4 h-4 text-red-400 mr-1.5" />
                  Industrial Impact & Blast Radius
                </span>
                <span className="text-[10px] uppercase font-bold text-red-400 bg-red-950/70 border border-red-800 px-2 py-0.5 rounded">
                  CRITICAL PROCESS HAZARD
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Target device governs the emergency trip protection loop for <strong className="text-white">Hydrocracker Unit 4 Reactor R-201</strong>. 
                Suppression of safety registers enables thermal runaway condition before operator intervention.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1f2b42] text-[11px]">
                <div>
                  <span className="text-slate-400 block">Assigned Zone:</span>
                  <span className="font-mono text-slate-200 font-semibold">{asset?.zone || 'Zone 1 - Safety Systems'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Active Conduit:</span>
                  <span className="font-mono text-slate-200 font-semibold">{asset?.conduit || 'Conduit C-SIS-ISOLATED'}</span>
                </div>
              </div>
            </div>

            {/* Asset Technical Specifications */}
            <div className="p-3.5 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-2.5">
              <h4 className="font-semibold text-slate-200 flex items-center">
                <Cpu className="w-4 h-4 text-blue-400 mr-1.5" />
                Hardware & Controller Specifications
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Vendor / Make:</span>
                  <span className="font-medium text-white">{asset?.vendor || 'Schneider/Triconex'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Model:</span>
                  <span className="font-medium text-white">{asset?.model || 'Tricon 3008 TMR'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Firmware:</span>
                  <span className="font-mono text-amber-300 flex items-center">
                    {asset?.firmware || 'v11.3.1'}
                    {asset?.firmwareVulnerable && (
                      <span className="ml-1 text-[9px] px-1 rounded bg-red-950 text-red-400 border border-red-800">
                        VULN
                      </span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Device Role:</span>
                  <span className="font-medium text-white">{asset?.deviceType || 'Safety Controller (SIS)'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[11px]">Physical Plant Location:</span>
                  <span className="font-mono text-slate-200">{asset?.physicalLocation || 'AER-1 Marshalling Cabinet 104'}</span>
                </div>
              </div>
            </div>

            {/* Connected Topology Neighbors */}
            <div className="p-3.5 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-2">
              <h4 className="font-semibold text-slate-200 flex items-center">
                <Layers className="w-4 h-4 text-teal-400 mr-1.5" />
                Direct OT Network Peers
              </h4>
              <div className="space-y-1.5">
                {asset?.connectedTo?.map(peerId => (
                  <button
                    key={peerId}
                    onClick={() => onSelectAssetById(peerId)}
                    className="w-full text-left p-2 rounded bg-[#0f1626] hover:bg-[#1a253f] border border-[#1e2a44] flex items-center justify-between text-xs transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-mono text-slate-200">{peerId}</span>
                    </div>
                    <span className="text-[11px] text-blue-400 flex items-center">
                      Inspect Node <ExternalLink className="w-3 h-3 ml-1" />
                    </span>
                  </button>
                )) || (
                  <div className="text-slate-400">No peers mapped.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MITRE ICS & ATTACK PATH */}
        {activeTab === 'mitre' && (
          <div className="space-y-3">
            <div className="p-3 rounded bg-blue-950/30 border border-blue-800/40 text-blue-200 leading-relaxed">
              Mapped against the <strong className="text-white">MITRE ATT&CK for Industrial Control Systems (ICS)</strong> framework.
            </div>

            <div className="space-y-2.5">
              {[
                {
                  tactic: 'Impair Process Control',
                  id: 'T0855',
                  name: 'Unauthorized Command Message',
                  desc: 'Adversary crafted industrial protocol messages (Modbus FC 0x06) to write to safety interlocking holding registers.',
                  status: 'CONFIRMED'
                },
                {
                  tactic: 'Inhibit Response Function',
                  id: 'T0814',
                  name: 'Denial of View',
                  desc: 'Manipulated HMI reporting values so control room operators observe normal 1250 PSI while internal pressure elevates.',
                  status: 'ACTIVE'
                },
                {
                  tactic: 'Lateral Movement',
                  id: 'T0800',
                  name: 'Exploitation of Remote Services',
                  desc: 'Pivoted from IDMZ Jump Host (172.24.10.15) into Level 2 Engineering Workstation using RDP protocol tunneling.',
                  status: 'DETECTED'
                },
                {
                  tactic: 'Execution',
                  id: 'T0843',
                  name: 'Program Download',
                  desc: 'Unapproved logic block injected into Siemens S7-1518 PLC via port 102 (ISO-on-TCP).',
                  status: 'CONTAINED'
                }
              ].map(tech => (
                <div key={tech.id} className="p-3 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-blue-400 font-bold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                      {tech.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                      {tech.status}
                    </span>
                  </div>
                  <div className="font-semibold text-white text-xs">{tech.name}</div>
                  <div className="text-[11px] text-slate-400">{tech.tactic}</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-[#1e2a42]">
                    {tech.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TELEMETRY & RAW PAYLOADS */}
        {activeTab === 'telemetry' && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center">
                  <Terminal className="w-4 h-4 text-emerald-400 mr-1.5" />
                  Live DPI Packet Payload (Hex Decoded)
                </span>
                <button
                  onClick={() => handleCopyHex(alert?.packetSummary?.rawHexPreview || '00 01 00 00 00 06 01 06 9C 4C 00 00')}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                >
                  {copiedHex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHex ? 'Copied' : 'Copy Hex'}</span>
                </button>
              </div>

              {/* Raw Hex Terminal */}
              <div className="p-2.5 rounded bg-black/80 font-mono text-[11px] text-emerald-400 overflow-x-auto border border-emerald-950">
                <code>{alert?.packetSummary?.rawHexPreview || '00 01 00 00 00 06 01 06 9C 4C 00 00 [Modbus/TCP Header: TransID 1, Unit 1, FC 06, Reg 40012, Val 0x0000]'}</code>
              </div>
            </div>

            {/* Decoded Field Table */}
            <div className="p-3 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-2">
              <h4 className="font-semibold text-slate-200">Decoded Protocol PDU Attributes</h4>
              <table className="w-full text-left font-mono text-[11px]">
                <tbody className="divide-y divide-[#1e2a42]">
                  {Object.entries(alert?.packetSummary?.decodedFields || {
                    'Protocol ID': '0x0000 (Modbus TCP)',
                    'Unit ID / Slave': '1',
                    'Function Code': '0x06 (Write Single Register)',
                    'Register Address': '40012 (0x9C4C - SIS_TRIP_INTERLOCK)',
                    'Write Value': '0x0000 (FORCED DISABLED)',
                    'Sensor Source': 'Core TAP-02 (Optical Mirror)'
                  }).map(([key, val]) => (
                    <tr key={key} className="py-1">
                      <td className="py-1.5 text-slate-400 font-sans font-medium w-1/3">{key}</td>
                      <td className="py-1.5 text-slate-200">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Function Code Distribution Chart / Meter */}
            <div className="p-3 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-2">
              <h4 className="font-semibold text-slate-200">24-Hour Industrial Function Code Baseline</h4>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span>FC 0x03 (Read Holding Registers)</span>
                  <span className="font-mono text-emerald-400">98.4% (Normal Polling)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98.4%' }} />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-red-300 font-medium">FC 0x06 (Write Single Register)</span>
                  <span className="font-mono text-red-400 font-bold">1.6% (ANOMALOUS SPIKE)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '1.6%' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CVEs & VULNERABILITIES */}
        {activeTab === 'cves' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded bg-[#101827] border border-[#202d44] text-[11px] text-slate-300">
              Identified <strong className="text-red-400 font-semibold">{asset?.cveCount || 3} Vulnerabilities</strong> matching controller firmware {asset?.firmware || 'v11.3.1'}.
            </div>

            {[
              {
                id: 'CVE-2022-45137',
                cvss: 9.8,
                severity: 'CRITICAL',
                title: 'Siemens / Industrial Controller Memory Corruption via Malformed PDU',
                desc: 'Remote unauthenticated attacker can execute arbitrary shellcode or force controller into Defective state by sending crafted packets to TCP port 102 / 502.',
                patch: 'Firmware Update v12.1.0 or implement DPI packet filtering on Conduits.'
              },
              {
                id: 'CVE-2023-3595',
                cvss: 8.8,
                severity: 'HIGH',
                title: 'Schneider / Rockwell CIP Stack Buffer Overflow',
                desc: 'A buffer overflow vulnerability in the CIP communication stack allows an attacker on adjacent network to overwrite configuration tags.',
                patch: 'Apply vendor hotfix KB-9941 or enforce CIP deep packet inspection.'
              },
              {
                id: 'CVE-2021-37207',
                cvss: 7.5,
                severity: 'HIGH',
                title: 'Improper Access Control in Engineering Workstation Interface',
                desc: 'Session tokens transmitted without TLS encapsulation allow replay attacks from dual-homed jump boxes.',
                patch: 'Enable Encrypted Communication Policy in TIA Portal / ControlLogix.'
              }
            ].map(cve => (
              <div key={cve.id} className="p-3 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-red-400 text-xs">{cve.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-800">
                    CVSS {cve.cvss} {cve.severity}
                  </span>
                </div>
                <div className="font-medium text-white text-xs">{cve.title}</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{cve.desc}</p>
                <div className="pt-2 border-t border-[#1e2a42] text-[11px] text-emerald-400 flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span><strong>Mitigation:</strong> {cve.patch}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: REMEDIATION PLAYBOOK */}
        {activeTab === 'playbook' && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-3">
              <h4 className="font-semibold text-slate-200 flex items-center">
                <ShieldAlert className="w-4 h-4 text-red-400 mr-1.5" />
                Active Containment Actions
              </h4>
              <p className="text-slate-300 text-[11px]">
                Execute real-time protective measures on network switches, DPI inspection engines, and OT firewalls to halt active lateral movement.
              </p>

              {/* Action 1: Sever Conduit */}
              <div className="p-3 rounded bg-[#0f1626] border border-[#1f2b42] flex items-center justify-between">
                <div>
                  <div className="font-medium text-white text-xs">Sever Conduit C-21 / C-35 Firewall Rule</div>
                  <div className="text-[11px] text-slate-400">Drops all cross-zone traffic into Level 1 Safety Zone</div>
                </div>
                <button
                  onClick={() => toggleRemediation('firewall')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                    remediationStates.firewall 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' 
                      : 'bg-red-600 hover:bg-red-700 text-white shadow'
                  }`}
                >
                  {remediationStates.firewall ? 'Rule Active ✓' : 'Enforce Block'}
                </button>
              </div>

              {/* Action 2: DPI Read-Only */}
              <div className="p-3 rounded bg-[#0f1626] border border-[#1f2b42] flex items-center justify-between">
                <div>
                  <div className="font-medium text-white text-xs">Enforce Strict Read-Only Mode via DPI</div>
                  <div className="text-[11px] text-slate-400">Rejects all Modbus write function codes (0x05, 0x06, 0x10)</div>
                </div>
                <button
                  onClick={() => toggleRemediation('dpi_ro')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                    remediationStates.dpi_ro 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow'
                  }`}
                >
                  {remediationStates.dpi_ro ? 'Enforced ✓' : 'Apply RO Filter'}
                </button>
              </div>

              {/* Action 3: Quarantine EWS */}
              <div className="p-3 rounded bg-[#0f1626] border border-[#1f2b42] flex items-center justify-between">
                <div>
                  <div className="font-medium text-white text-xs">Isolate Engineering Workstation (EWS-01)</div>
                  <div className="text-[11px] text-slate-400">Shuts down Switch SW-L2-01 port 12 (192.168.20.50)</div>
                </div>
                <button
                  onClick={() => toggleRemediation('isolate')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                    remediationStates.isolate 
                      ? 'bg-amber-950 text-amber-300 border border-amber-600' 
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {remediationStates.isolate ? 'Port Disabled ✓' : 'Isolate Port'}
                </button>
              </div>
            </div>

            {/* Evidence & Ticketing Box */}
            <div className="p-3 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-2.5">
              <h4 className="font-semibold text-slate-200">Incident Forensics & Ticketing</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toggleRemediation('pcap')}
                  className="p-2.5 rounded bg-[#0f1626] hover:bg-[#1a253f] border border-[#1f2b42] text-slate-200 flex items-center justify-center space-x-2 text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>{remediationStates.pcap ? 'PCAP Exported (14.2 MB) ✓' : 'Download PCAP'}</span>
                </button>

                <button
                  onClick={() => toggleRemediation('ticket')}
                  className="p-2.5 rounded bg-[#0f1626] hover:bg-[#1a253f] border border-[#1f2b42] text-slate-200 flex items-center justify-center space-x-2 text-xs transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{remediationStates.ticket ? 'Ticket #OT-8491 ✓' : 'Dispatch OT Ticket'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT TRAIL & NOTES */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="space-y-2.5">
              {notes.map(note => (
                <div key={note.id} className="p-3 rounded-lg bg-[#141c2e] border border-[#23314d] space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-blue-400 flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {note.user}
                    </span>
                    <span className="text-slate-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {note.time}
                    </span>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>

            {/* Add note input form */}
            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-[#1e2a42]">
              <label className="block text-[11px] font-semibold text-slate-300">
                Add SOC Analyst Operational Note
              </label>
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Log physical verification, technician report, or operational rationale..."
                rows={3}
                className="w-full p-2.5 rounded bg-[#0b0f17] border border-[#23314d] text-slate-200 text-xs focus:outline-none focus:border-blue-500 placeholder-slate-500"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Analyst Note</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Panel Footer */}
      <div className="p-3 border-t border-[#1e293b] bg-[#111827] flex items-center justify-between text-xs">
        <span className="text-slate-400 font-mono text-[11px]">Audit ID: AUD-882190</span>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
        >
          Close Inspector
        </button>
      </div>
    </aside>
  );
};
