import React from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  Layers, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Cpu, 
  Radio, 
  Lock, 
  ChevronRight,
  Server,
  Zap,
  Flame,
  Search,
  Crosshair,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 flex flex-col font-sans selection:bg-orange-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0b0f17]/90 backdrop-blur border-b border-[#1e293b] px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Platform Label */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-orange-950/60 border border-orange-500/50 flex items-center justify-center text-orange-400 shadow-sm shadow-orange-950/50">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm tracking-tight text-white uppercase">OT Security Platform</span>
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-orange-400 border border-orange-900/60 font-mono font-semibold">
                  ICS/SCADA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden md:block">Industrial Cyber Defense & Purdue Model Visibility</p>
            </div>
          </div>

          {/* Center Info Indicator */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#131b2e] border border-[#23314d] text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">TELEMETRY:</span>
            <span className="text-emerald-400 font-semibold">PURDUE L0–L4 ACTIVE</span>
          </div>

          {/* Auth CTA Buttons */}
          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={onSignIn}
              id="landing-nav-signin-btn"
              className="px-3.5 py-1.5 rounded-lg border border-[#26334d] hover:border-slate-500 bg-[#131b2e] hover:bg-[#1a253f] text-slate-200 font-medium transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              id="landing-nav-getstarted-btn"
              className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-all shadow-md shadow-orange-900/30 flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16 flex flex-col justify-center space-y-16">
        {/* Headline & Primary CTA */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-950/40 border border-orange-500/30 text-orange-400 text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
            <span>Operational Technology Cyber Exposure Management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            See Risk Before <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              It Spreads.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Understand your industrial environment, identify critical exposure, and trace how risk can move across connected OT assets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onGetStarted}
              id="hero-primary-getstarted-btn"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-900/40 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onSignIn}
              id="hero-secondary-signin-btn"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#131b2e] hover:bg-[#1a253f] border border-[#26334d] hover:border-slate-500 text-slate-200 font-semibold text-sm transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Sign In to Platform</span>
            </button>
          </div>
        </div>

        {/* Restrained Attack Path Map Representation */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="p-1 rounded-2xl bg-gradient-to-b from-[#23314d] via-[#162032] to-[#0f1726] shadow-2xl">
            <div className="rounded-xl bg-[#0d131f] border border-[#1e293b] p-5 sm:p-6 space-y-4">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-3 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="font-mono font-bold text-white uppercase tracking-wider text-[11px]">
                    Attack Path Trace • Active Conduit Trajectory
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                  <span>Purdue Conduits: <strong className="text-orange-400">C-12 / C-21</strong></span>
                  <span className="hidden sm:inline text-slate-600">|</span>
                  <span className="hidden sm:inline">Hop Count: <strong className="text-slate-200">3 Hops</strong></span>
                </div>
              </div>

              {/* 4 Connected Nodes: Exposure -> Engineering Workstation -> OT Network -> Critical System */}
              <div className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
                  {/* Node 1: Exposure */}
                  <div className="p-3.5 rounded-xl bg-[#131b2e] border border-red-500/50 relative shadow-lg flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-800">
                        Purdue L3.5 IDMZ
                      </span>
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-slate-400">STEP 01 • ENTRY</div>
                      <div className="text-sm font-bold text-white mt-0.5">Exposure Point</div>
                      <div className="text-[11px] text-red-300 font-mono mt-1">Dual-Homed Jump Host</div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono border-t border-[#1e293b] pt-2 flex items-center justify-between">
                      <span>CVSS 9.8 (RCE)</span>
                      <span className="text-orange-400 font-semibold">10.14.30.5</span>
                    </div>
                  </div>

                  {/* Node 2: Engineering Workstation */}
                  <div className="p-3.5 rounded-xl bg-[#131b2e] border border-orange-500/50 relative shadow-lg flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950 text-orange-400 border border-orange-800">
                        Purdue L2 Supervisory
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">RDP • 3389</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-slate-400">STEP 02 • PIVOT</div>
                      <div className="text-sm font-bold text-white mt-0.5">Engineering Workstation</div>
                      <div className="text-[11px] text-orange-300 font-mono mt-1">TIA Portal EWS-01</div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono border-t border-[#1e293b] pt-2 flex items-center justify-between">
                      <span>Stolen Credentials</span>
                      <span className="text-slate-300">192.168.20.14</span>
                    </div>
                  </div>

                  {/* Node 3: OT Network */}
                  <div className="p-3.5 rounded-xl bg-[#131b2e] border border-amber-500/50 relative shadow-lg flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800">
                        Purdue L1 Control
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">S7comm • 102</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-slate-400">STEP 03 • CONDUIT</div>
                      <div className="text-sm font-bold text-white mt-0.5">OT Network Switch</div>
                      <div className="text-[11px] text-amber-300 font-mono mt-1">Stratix 5700 Ring</div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono border-t border-[#1e293b] pt-2 flex items-center justify-between">
                      <span>DPI Anomaly Flag</span>
                      <span className="text-slate-300">192.168.10.2</span>
                    </div>
                  </div>

                  {/* Node 4: Critical System */}
                  <div className="p-3.5 rounded-xl bg-[#131b2e] border border-red-600/70 relative shadow-lg flex flex-col justify-between space-y-3 bg-gradient-to-b from-red-950/20 to-[#131b2e]">
                    <div className="flex items-start justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-700">
                        Purdue L1 Safety (SIS)
                      </span>
                      <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-red-400">TARGET • HIGH VALUE</div>
                      <div className="text-sm font-bold text-white mt-0.5">Critical System</div>
                      <div className="text-[11px] text-red-300 font-mono mt-1">Triconex SIS Controller</div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono border-t border-[#1e293b] pt-2 flex items-center justify-between">
                      <span className="text-red-400 font-bold">SIL-3 Interlock</span>
                      <span className="text-slate-300">192.168.10.88</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Caption Bar */}
              <div className="bg-[#111827] rounded-lg p-3 border border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Activity className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>
                    Deterministic blast radius calculation evaluates <strong>14 lateral connections</strong> and isolates threatened safety loops before actuation.
                  </span>
                </div>
                <button
                  onClick={onGetStarted}
                  className="text-orange-400 hover:text-orange-300 font-semibold text-xs flex items-center space-x-1 cursor-pointer whitespace-nowrap"
                >
                  <span>Explore Full Map</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Three Concise Capability Areas */}
        <div className="space-y-6 pt-4">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Purpose-Built for Industrial Control Systems
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Engineered specifically for operational continuity, safety instrumentation, and zero-impact passive monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Capability 1: Environment Visibility */}
            <div className="p-6 rounded-xl bg-[#131b2e] border border-[#23314d] hover:border-slate-500 transition-all flex flex-col justify-between space-y-4 shadow-lg">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Environment Visibility
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Understand connected assets, zones, operational state, and visibility gaps across all Purdue Model levels from enterprise edge to field instrumentation.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0b0f17] border border-[#1e293b] space-y-2 text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Purdue Coverage:</span>
                  <span className="text-blue-400 font-bold">L0, L1, L2, L3, L3.5, L4</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Sensor Ingestion:</span>
                  <span className="text-emerald-400 font-bold">100% Zero Loss TAP</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Protocols Monitored:</span>
                  <span className="text-slate-200 font-bold">Modbus, S7, CIP, DNP3</span>
                </div>
              </div>
            </div>

            {/* Capability 2: Risk & Exposure */}
            <div className="p-6 rounded-xl bg-[#131b2e] border border-[#23314d] hover:border-slate-500 transition-all flex flex-col justify-between space-y-4 shadow-lg">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-orange-950/60 border border-orange-500/40 flex items-center justify-center text-orange-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Risk & Exposure
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Identify critical assets, findings, exposure, and priority risks with OT-specific context including safety integrity levels (SIL) and firmware vulnerabilities.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0b0f17] border border-[#1e293b] space-y-2 text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Overall Posture:</span>
                  <span className="text-orange-400 font-bold">78 / 100 Health</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Critical Findings:</span>
                  <span className="text-red-400 font-bold">3 High Priority CVEs</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Conduit Integrity:</span>
                  <span className="text-amber-400 font-bold">1 Policy Deviation</span>
                </div>
              </div>
            </div>

            {/* Capability 3: Attack Paths */}
            <div className="p-6 rounded-xl bg-[#131b2e] border border-[#23314d] hover:border-slate-500 transition-all flex flex-col justify-between space-y-4 shadow-lg">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Crosshair className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Attack Paths
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Understand how risk can move from exposed sources through connected assets toward high-value systems, enabling preemptive isolation before process disruption.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0b0f17] border border-[#1e293b] space-y-2 text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Lateral Vector Analysis:</span>
                  <span className="text-red-400 font-bold">Active ICS Graph</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Blast Radius Simulation:</span>
                  <span className="text-orange-400 font-bold">Choke-Point Mapping</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Remediation Playbook:</span>
                  <span className="text-emerald-400 font-bold">Automated Guardrails</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Callout */}
        <div className="rounded-xl bg-[#131b2e] border border-[#23314d] p-6 sm:p-8 text-center space-y-4 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Ready to inspect your OT cybersecurity posture?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Access real-time telemetry, full Purdue Model asset hierarchy, and live attack path simulations for your industrial control systems.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onGetStarted}
              id="landing-bottom-getstarted-btn"
              className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-900/40 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onSignIn}
              id="landing-bottom-signin-btn"
              className="px-6 py-2.5 rounded-lg bg-[#0b0f17] hover:bg-[#162032] border border-[#26334d] text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>Sign In with Existing Credentials</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e293b] px-4 lg:px-8 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>OT Security Platform • Industrial Control System Cyber Exposure</span>
          <span className="font-mono text-[11px] text-slate-400">Purdue Model Levels 0 to 4 • IEC 62443 / NIST CSF Compliant</span>
        </div>
      </footer>
    </div>
  );
};
