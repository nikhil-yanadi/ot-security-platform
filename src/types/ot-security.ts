export type PurdueLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L3.5' | 'L4';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type ProtocolType = 
  | 'Modbus TCP'
  | 'Siemens S7comm'
  | 'CIP / EtherNet/IP'
  | 'DNP3'
  | 'OPC UA'
  | 'OPC DA'
  | 'BACnet/IP'
  | 'IEC 60870-5-104'
  | 'PROFINET'
  | 'RDP'
  | 'SSH'
  | 'HTTPS';

export interface OTAsset {
  id: string;
  name: string;
  tag: string; // e.g. "PLC-FCC-01", "SIS-TRIC-02"
  purdueLevel: PurdueLevel;
  deviceType: 'PLC' | 'RTU' | 'Safety Controller (SIS)' | 'HMI' | 'Engineering Workstation' | 'Historian' | 'DCS Controller' | 'Industrial Switch' | 'OT Firewall' | 'Field Actuator/Sensor';
  vendor: 'Siemens' | 'Rockwell Automation' | 'Schneider Electric' | 'Yokogawa' | 'Honeywell' | 'Schneider/Triconex' | 'Emerson' | 'Moxa' | 'Cisco Industrial' | 'OSIsoft';
  model: string;
  firmware: string;
  firmwareVulnerable: boolean;
  ipAddress: string;
  macAddress: string;
  zone: string;
  conduit: string;
  riskScore: number; // 0 - 100
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ONLINE' | 'WARNING' | 'ANOMALOUS' | 'OFFLINE';
  cveCount: number;
  criticalCves: string[];
  protocols: ProtocolType[];
  lastSeen: string;
  description: string;
  physicalLocation: string; // e.g. "Building C, Rack 04, Unit 2"
  connectedTo: string[]; // Asset IDs
}

export interface AttackPathNode {
  id: string;
  assetId: string;
  name: string;
  purdueLevel: PurdueLevel;
  role: string;
  ip: string;
  vendor: string;
  status: 'compromised' | 'at_risk' | 'target' | 'uncompromised';
  riskScore: number;
  x: number;
  y: number;
  mitreTechniques: string[];
  blastRadiusScore: number;
}

export interface AttackPathEdge {
  id: string;
  source: string;
  target: string;
  protocol: ProtocolType;
  port: number;
  conduit: string;
  activeAttack: boolean;
  lateralMovementStep: number;
  description: string;
  anomalyDetected?: string;
}

export interface AttackPathGraph {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  targetAsset: string;
  initialCompromise: string;
  detectedAt: string;
  mitreICSMatrix: {
    tactic: string;
    techniqueId: string;
    techniqueName: string;
    description: string;
  }[];
  nodes: AttackPathNode[];
  edges: AttackPathEdge[];
  recommendations: string[];
}

export interface OTAlert {
  id: string;
  title: string;
  severity: Severity;
  timestamp: string;
  sourceAsset: string;
  sourceIp: string;
  destinationAsset: string;
  destinationIp: string;
  purdueTransition: string; // e.g. "L3.5 -> L1" or "L2 -> L1"
  protocol: ProtocolType;
  functionCode?: string;
  anomalyType: 
    | 'Unauthorized PLC Logic Write'
    | 'Abnormal Modbus Function Code'
    | 'Safety System Tag Overwrite'
    | 'Firmware Hash Discrepancy'
    | 'Rogue MAC in Basic Control Zone'
    | 'Brute Force RDP to EWS'
    | 'Unapproved OPC UA Session';
  status: 'NEW' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'FALSE_POSITIVE';
  description: string;
  packetSummary: {
    rawHexPreview: string;
    decodedFields: Record<string, string>;
  };
  recommendedActions: string[];
}

export interface OTSensor {
  id: string;
  name: string;
  type: 'Passive Optical TAP' | 'Inline DPI Engine' | 'Switch SPAN Feed' | 'OT NetFlow Probe';
  location: string;
  purdueCoverage: PurdueLevel[];
  status: 'OPTIMAL' | 'DEGRADED' | 'OFFLINE';
  bandwidthGbps: number;
  throughputMbps: number;
  droppedPacketsPct: number;
  totalPacketsLastHour: string;
  bufferUtilizationPct: number;
  cpuLoadPct: number;
  memoryPct: number;
  firmwareVersion: string;
  lastHeartbeat: string;
  ipAddress: string;
}

export interface ProtocolTelemetry {
  protocol: ProtocolType;
  packetsPerSec: number;
  bandwidthKbps: number;
  activeSessions: number;
  anomalousCommands24h: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  status: 'NORMAL' | 'ELEVATED' | 'ANOMALOUS';
  commonFunctionCodes: { code: string; name: string; count: number }[];
}

export interface PlantSite {
  id: string;
  name: string;
  code: string;
  location: string;
  operatingMode: 'Normal Operation' | 'Maintenance Window' | 'Emergency Islanding';
  criticalScore: number;
  activeSensors: number;
  totalSensors: number;
  activeAlerts: number;
}
