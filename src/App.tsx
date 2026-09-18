import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AttackPathView } from './components/AttackPathView';
import { AssetInventoryView } from './components/AssetInventoryView';
import { AlertsView } from './components/AlertsView';
import { SensorsView } from './components/SensorsView';
import { ProtocolTelemetryView } from './components/ProtocolTelemetryView';
import { InvestigationSidePanel } from './components/InvestigationSidePanel';
import { QuickSearchModal } from './components/QuickSearchModal';
import { LandingPage } from './components/LandingPage';
import { SignInPage } from './components/SignInPage';
import { SignUpPage } from './components/SignUpPage';

import { 
  PLANT_SITES, 
  OT_ASSETS, 
  PRIMARY_ATTACK_PATH, 
  OT_ALERTS, 
  OT_SENSORS, 
  PROTOCOL_TELEMETRY_LIST, 
  TOPOLOGY_CHANGE_TIMELINE 
} from './data/mockData';
import { OTAsset, OTAlert, PlantSite } from './types/ot-security';

type AuthView = 'landing' | 'signin' | 'signup' | 'app';

export default function App() {
  // Authentication & Session State
  const [authView, setAuthView] = useState<AuthView>(() => {
    try {
      const savedAuth = sessionStorage.getItem('ot_sec_authenticated');
      return savedAuth === 'true' ? 'app' : 'landing';
    } catch {
      return 'landing';
    }
  });

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    try {
      const savedUser = sessionStorage.getItem('ot_sec_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Existing App State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedSite, setSelectedSite] = useState<PlantSite>(PLANT_SITES[0]);
  const [selectedAsset, setSelectedAsset] = useState<OTAsset | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<OTAlert | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auth Handlers
  const handleAuthSuccess = (user: { name: string; email: string; role: string }) => {
    setCurrentUser(user);
    setAuthView('app');
    try {
      sessionStorage.setItem('ot_sec_authenticated', 'true');
      sessionStorage.setItem('ot_sec_user', JSON.stringify(user));
    } catch {
      // Storage unavailable
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setAuthView('landing');
    try {
      sessionStorage.removeItem('ot_sec_authenticated');
      sessionStorage.removeItem('ot_sec_user');
    } catch {
      // Storage unavailable
    }
  };

  // Existing App Handlers
  const handleSelectAsset = (asset: OTAsset) => {
    setSelectedAsset(asset);
    // Find matching alert if any
    const matchingAlert = OT_ALERTS.find(a => a.destinationAsset === asset.tag || a.sourceAsset === asset.tag) || null;
    setSelectedAlert(matchingAlert);
  };

  const handleSelectAlert = (alert: OTAlert) => {
    setSelectedAlert(alert);
    // Find matching asset if any
    const matchingAsset = OT_ASSETS.find(a => a.tag === alert.destinationAsset || a.tag === alert.sourceAsset) || null;
    setSelectedAsset(matchingAsset || OT_ASSETS[0]);
  };

  const handleSelectAssetById = (assetId: string) => {
    const found = OT_ASSETS.find(a => a.id === assetId || a.tag === assetId);
    if (found) {
      handleSelectAsset(found);
    }
  };

  const handleCloseSidePanel = () => {
    setSelectedAsset(null);
    setSelectedAlert(null);
  };

  const criticalCount = OT_ALERTS.filter(a => a.severity === 'CRITICAL').length;
  const highCount = OT_ALERTS.filter(a => a.severity === 'HIGH').length;

  // Render Front-Door Authentication Flow
  if (authView === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setAuthView('signup')}
        onSignIn={() => setAuthView('signin')}
      />
    );
  }

  if (authView === 'signin') {
    return (
      <SignInPage
        onSuccess={handleAuthSuccess}
        onNavigateToSignUp={() => setAuthView('signup')}
        onBackToLanding={() => setAuthView('landing')}
      />
    );
  }

  if (authView === 'signup') {
    return (
      <SignUpPage
        onSuccess={handleAuthSuccess}
        onNavigateToSignIn={() => setAuthView('signin')}
        onBackToLanding={() => setAuthView('landing')}
      />
    );
  }

  // Render Existing Application (Intact with all capabilities)
  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 flex flex-col font-sans selection:bg-orange-600 selection:text-white">
      {/* Global Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        plantSites={PLANT_SITES}
        selectedSite={selectedSite}
        onSelectSite={setSelectedSite}
        criticalAlertCount={criticalCount}
        highAlertCount={highCount}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAlerts={() => setCurrentTab('alerts')}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden relative">
        {currentTab === 'dashboard' && (
          <DashboardView
            assets={OT_ASSETS}
            alerts={OT_ALERTS}
            attackPath={PRIMARY_ATTACK_PATH}
            sensors={OT_SENSORS}
            protocols={PROTOCOL_TELEMETRY_LIST}
            timeline={TOPOLOGY_CHANGE_TIMELINE}
            onSelectAsset={handleSelectAsset}
            onSelectAlert={handleSelectAlert}
            onNavigateToAttackPath={() => setCurrentTab('attack-path')}
            onNavigateToAssets={() => setCurrentTab('assets')}
            onNavigateToAlerts={() => setCurrentTab('alerts')}
            onNavigateToSensors={() => setCurrentTab('sensors')}
          />
        )}

        {currentTab === 'attack-path' && (
          <div className="h-[calc(100vh-84px)]">
            <AttackPathView
              graph={PRIMARY_ATTACK_PATH}
              assets={OT_ASSETS}
              onSelectNode={handleSelectAssetById}
              selectedAssetId={selectedAsset?.id || null}
            />
          </div>
        )}

        {currentTab === 'assets' && (
          <AssetInventoryView
            assets={OT_ASSETS}
            onSelectAsset={handleSelectAsset}
            selectedAssetId={selectedAsset?.id || null}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsView
            alerts={OT_ALERTS}
            assets={OT_ASSETS}
            onSelectAlert={handleSelectAlert}
            onSelectAssetById={handleSelectAssetById}
          />
        )}

        {currentTab === 'sensors' && (
          <SensorsView sensors={OT_SENSORS} />
        )}

        {currentTab === 'protocols' && (
          <ProtocolTelemetryView protocols={PROTOCOL_TELEMETRY_LIST} />
        )}
      </main>

      {/* Docked / Drawer Investigation Side Panel */}
      <InvestigationSidePanel
        asset={selectedAsset}
        alert={selectedAlert}
        onClose={handleCloseSidePanel}
        onSelectAssetById={handleSelectAssetById}
      />

      {/* Global Quick Search Modal (⌘K) */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={OT_ASSETS}
        alerts={OT_ALERTS}
        onSelectAsset={handleSelectAsset}
        onSelectAlert={handleSelectAlert}
        onNavigateToTab={setCurrentTab}
      />
    </div>
  );
}
