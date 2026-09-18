import { OTAsset, AttackPathGraph, OTAlert, OTSensor, ProtocolTelemetry, PlantSite } from '../types/ot-security';

export const PLANT_SITES: PlantSite[] = [
  {
    id: 'site-houston',
    name: 'Houston Refinery - Unit 4 (FCC/Cracker)',
    code: 'HOU-TX-04',
    location: 'Houston Ship Channel, TX',
    operatingMode: 'Normal Operation',
    criticalScore: 78,
    activeSensors: 4,
    totalSensors: 4,
    activeAlerts: 4
  },
  {
    id: 'site-rotterdam',
    name: 'Rotterdam Petrochemical Terminal',
    code: 'RTM-NL-02',
    location: 'Europoort, Rotterdam, NL',
    operatingMode: 'Normal Operation',
    criticalScore: 42,
    activeSensors: 6,
    totalSensors: 6,
    activeAlerts: 1
  },
  {
    id: 'site-singapore',
    name: 'Jurong Island Olefins Complex',
    code: 'SIN-JI-01',
    location: 'Jurong Island, Singapore',
    operatingMode: 'Maintenance Window',
    criticalScore: 35,
    activeSensors: 5,
    totalSensors: 5,
    activeAlerts: 0
  }
];

export const OT_ASSETS: OTAsset[] = [
  {
    id: 'ast-l4-vpn',
    name: 'Corporate IT/OT Boundary VPN Gateway',
    tag: 'GW-CORP-01',
    purdueLevel: 'L4',
    deviceType: 'OT Firewall',
    vendor: 'Cisco Industrial',
    model: 'Firepower 2130 OT Appliance',
    firmware: 'v7.2.4-SEC-P4',
    firmwareVulnerable: false,
    ipAddress: '10.240.10.1',
    macAddress: '00:1A:E8:44:B2:10',
    zone: 'Zone 4 - Enterprise IT',
    conduit: 'Conduit C-43 (Enterprise-to-DMZ)',
    riskScore: 34,
    criticality: 'MEDIUM',
    status: 'ONLINE',
    cveCount: 1,
    criticalCves: ['CVE-2023-20198'],
    protocols: ['HTTPS', 'SSH'],
    lastSeen: '1 minute ago',
    description: 'Perimeter gateway enforcing strict separation between corporate networks and industrial DMZ.',
    physicalLocation: 'Bldg A, Enterprise Telecom Closet, Rack 01',
    connectedTo: ['ast-l35-jump']
  },
  {
    id: 'ast-l35-jump',
    name: 'Industrial DMZ Dual-Homed Jump Host',
    tag: 'SRV-IDMZ-JUMP01',
    purdueLevel: 'L3.5',
    deviceType: 'Engineering Workstation',
    vendor: 'Honeywell',
    model: 'Experion Secure Jump Box (WinServer 2022)',
    firmware: 'Build 20348.2031',
    firmwareVulnerable: true,
    ipAddress: '172.24.10.15',
    macAddress: '00:50:56:A1:7B:44',
    zone: 'Zone 3.5 - Industrial DMZ',
    conduit: 'Conduit C-35 (IDMZ-to-Operations)',
    riskScore: 88,
    criticality: 'CRITICAL',
    status: 'ANOMALOUS',
    cveCount: 4,
    criticalCves: ['CVE-2024-21413', 'CVE-2023-36884'],
    protocols: ['RDP', 'HTTPS', 'SSH'],
    lastSeen: '30 seconds ago',
    description: 'Staging jump host for remote OT vendor support. Suspected compromised via unauthorized lateral RDP credential replay.',
    physicalLocation: 'Control Center Annex, Server Room 102, Rack 03',
    connectedTo: ['ast-l4-vpn', 'ast-l3-hist', 'ast-l2-ews01']
  },
  {
    id: 'ast-l3-hist',
    name: 'Plant Historian Server (OSIsoft PI)',
    tag: 'SRV-HIST-01',
    purdueLevel: 'L3',
    deviceType: 'Historian',
    vendor: 'OSIsoft',
    model: 'PI Data Archive 2023 SP2',
    firmware: 'PI Server 3.4.445',
    firmwareVulnerable: false,
    ipAddress: '192.168.30.20',
    macAddress: '00:0C:29:F4:11:8A',
    zone: 'Zone 3 - Operations & MES',
    conduit: 'Conduit C-32 (MES-to-Supervisory)',
    riskScore: 62,
    criticality: 'HIGH',
    status: 'ONLINE',
    cveCount: 2,
    criticalCves: ['CVE-2022-38144'],
    protocols: ['OPC UA', 'OPC DA', 'HTTPS'],
    lastSeen: 'Just now',
    description: 'Central plant process archive polling real-time tags from Supervisory PLCs and SIS loops.',
    physicalLocation: 'Main Control Room, Rack B2, Server 04',
    connectedTo: ['ast-l35-jump', 'ast-l2-ews01', 'ast-l2-hmi01']
  },
  {
    id: 'ast-l2-ews01',
    name: 'Engineering Workstation EWS-01 (Siemens TIA Portal)',
    tag: 'EWS-UNIT4-01',
    purdueLevel: 'L2',
    deviceType: 'Engineering Workstation',
    vendor: 'Siemens',
    model: 'SIMATIC Field PG M6 Industrial PC',
    firmware: 'TIA Portal V18 Update 2',
    firmwareVulnerable: true,
    ipAddress: '192.168.20.50',
    macAddress: '00:1B:1B:3C:99:12',
    zone: 'Zone 2 - Supervisory Control',
    conduit: 'Conduit C-21 (Supervisory-to-Basic-Control)',
    riskScore: 94,
    criticality: 'CRITICAL',
    status: 'ANOMALOUS',
    cveCount: 6,
    criticalCves: ['CVE-2022-45137', 'CVE-2023-3595'],
    protocols: ['Siemens S7comm', 'Modbus TCP', 'CIP / EtherNet/IP', 'RDP'],
    lastSeen: '10 seconds ago',
    description: 'Primary engineering station with unrestricted logic upload/download permissions to Level 1 PLCs. Unapproved S7comm logic push detected.',
    physicalLocation: 'FCC Operator Console Desk 01, Houston Unit 4',
    connectedTo: ['ast-l35-jump', 'ast-l1-s71500', 'ast-l1-triconex', 'ast-l1-ab5580']
  },
  {
    id: 'ast-l2-hmi01',
    name: 'Cracker Main Operator HMI Console',
    tag: 'HMI-FCC-CONSOLE-A',
    purdueLevel: 'L2',
    deviceType: 'HMI',
    vendor: 'Rockwell Automation',
    model: 'FactoryTalk View SE Station v13',
    firmware: 'Firmware 13.00.01',
    firmwareVulnerable: false,
    ipAddress: '192.168.20.12',
    macAddress: '00:00:BC:88:19:22',
    zone: 'Zone 2 - Supervisory Control',
    conduit: 'Conduit C-21 (Supervisory-to-Basic-Control)',
    riskScore: 48,
    criticality: 'MEDIUM',
    status: 'ONLINE',
    cveCount: 1,
    criticalCves: [],
    protocols: ['CIP / EtherNet/IP', 'OPC UA'],
    lastSeen: 'Just now',
    description: 'High-density multi-monitor operator station displaying real-time reactor temperatures and pressures.',
    physicalLocation: 'Main Control Room, Desk 02',
    connectedTo: ['ast-l3-hist', 'ast-l1-ab5580']
  },
  {
    id: 'ast-l1-s71500',
    name: 'Reactor R-201 Thermal Process Controller',
    tag: 'PLC-S7-1518-FCC',
    purdueLevel: 'L1',
    deviceType: 'PLC',
    vendor: 'Siemens',
    model: 'SIMATIC S7-1518-4 PN/DP',
    firmware: 'v2.9.2 (Outdated - Target of Exploit)',
    firmwareVulnerable: true,
    ipAddress: '192.168.10.101',
    macAddress: '00:1E:8C:55:04:31',
    zone: 'Zone 1 - Process Basic Control',
    conduit: 'Conduit C-10 (Basic-Control-to-Field)',
    riskScore: 96,
    criticality: 'CRITICAL',
    status: 'ANOMALOUS',
    cveCount: 5,
    criticalCves: ['CVE-2022-45137', 'CVE-2021-37207'],
    protocols: ['Siemens S7comm', 'PROFINET', 'Modbus TCP'],
    lastSeen: '5 seconds ago',
    description: 'High-performance PLC regulating catalyst feed rate and bed temperature in Catalytic Cracker Reactor. Target of unauthorized S7 CPU STOP injection.',
    physicalLocation: 'Unit 4 Substation Marshalling Cabinet 104',
    connectedTo: ['ast-l2-ews01', 'ast-l0-valve01', 'ast-l0-temp882']
  },
  {
    id: 'ast-l1-triconex',
    name: 'Unit 4 Emergency Shutdown Safety Controller (SIS)',
    tag: 'SIS-TRIC-3008-01',
    purdueLevel: 'L1',
    deviceType: 'Safety Controller (SIS)',
    vendor: 'Schneider/Triconex',
    model: 'Tricon 3008 Triple Modular Redundant (TMR)',
    firmware: 'v11.3.1 (Integrity Warning)',
    firmwareVulnerable: true,
    ipAddress: '192.168.10.200',
    macAddress: '00:60:AD:12:89:FE',
    zone: 'Zone 1 - Safety Instrumented Systems',
    conduit: 'Conduit C-SIS-ISOLATED',
    riskScore: 98,
    criticality: 'CRITICAL',
    status: 'WARNING',
    cveCount: 3,
    criticalCves: ['CVE-2023-3595', 'CVE-2022-29951'],
    protocols: ['Modbus TCP', 'CIP / EtherNet/IP'],
    lastSeen: '12 seconds ago',
    description: 'SIL-3 rated safety controller for high-pressure trip protection. Triplicate redundant processors. Unapproved write attempt detected to register 40012.',
    physicalLocation: 'Blast-Resistant Auxiliary Equipment Room (AER-1)',
    connectedTo: ['ast-l2-ews01', 'ast-l0-valve01']
  },
  {
    id: 'ast-l1-ab5580',
    name: 'Compressor Train C-401 Main Controller',
    tag: 'PLC-AB-CLX5580',
    purdueLevel: 'L1',
    deviceType: 'PLC',
    vendor: 'Rockwell Automation',
    model: 'ControlLogix 5580 (1756-L83E)',
    firmware: 'v33.011',
    firmwareVulnerable: false,
    ipAddress: '192.168.10.105',
    macAddress: '00:00:BC:77:4A:11',
    zone: 'Zone 1 - Process Basic Control',
    conduit: 'Conduit C-10 (Basic-Control-to-Field)',
    riskScore: 44,
    criticality: 'HIGH',
    status: 'ONLINE',
    cveCount: 1,
    criticalCves: ['CVE-2023-3595'],
    protocols: ['CIP / EtherNet/IP', 'Modbus TCP'],
    lastSeen: 'Just now',
    description: 'Centrifugal gas compressor PLC governing anti-surge loop valves and turbine speeds.',
    physicalLocation: 'Compressor Building Local Panel C-401',
    connectedTo: ['ast-l2-ews01', 'ast-l2-hmi01', 'ast-l0-pump104']
  },
  {
    id: 'ast-l0-valve01',
    name: 'Emergency Depressurizing Valve MOV-201',
    tag: 'MOV-201-DEPRESS',
    purdueLevel: 'L0',
    deviceType: 'Field Actuator/Sensor',
    vendor: 'Emerson',
    model: 'Bettis Electric Intelligent Actuator',
    firmware: 'DCM-2.1.8',
    firmwareVulnerable: false,
    ipAddress: '192.168.5.12',
    macAddress: '00:0E:8C:33:55:01',
    zone: 'Zone 0 - Physical Field Instruments',
    conduit: 'Conduit C-Field-Hardwired',
    riskScore: 92,
    criticality: 'CRITICAL',
    status: 'ANOMALOUS',
    cveCount: 0,
    criticalCves: [],
    protocols: ['Modbus TCP'],
    lastSeen: '8 seconds ago',
    description: 'Motor operated valve capable of dumping reactor pressure to flare stack in emergency overpressure scenarios.',
    physicalLocation: 'Reactor Column Upper Manifold (Structure Level 4)',
    connectedTo: ['ast-l1-s71500', 'ast-l1-triconex']
  },
  {
    id: 'ast-l0-temp882',
    name: 'Reactor Bed Multi-point Thermocouple PT-8821',
    tag: 'TT-8821-CATALYST',
    purdueLevel: 'L0',
    deviceType: 'Field Actuator/Sensor',
    vendor: 'Yokogawa',
    model: 'YTA710 Temperature Transmitter',
    firmware: 'HART 7 Rev 2',
    firmwareVulnerable: false,
    ipAddress: '192.168.5.34',
    macAddress: '00:1C:B0:11:44:90',
    zone: 'Zone 0 - Physical Field Instruments',
    conduit: 'Conduit C-Field-Hardwired',
    riskScore: 30,
    criticality: 'HIGH',
    status: 'ONLINE',
    cveCount: 0,
    criticalCves: [],
    protocols: ['Modbus TCP'],
    lastSeen: 'Just now',
    description: 'Precision temperature sensor transmitter for catalytic bed runaway detection.',
    physicalLocation: 'Reactor Vessel Thermowell Well 03',
    connectedTo: ['ast-l1-s71500']
  },
  {
    id: 'ast-l0-pump104',
    name: 'Crude Feed Pump Variable Speed Drive VFD-104',
    tag: 'VFD-104-CRUDE-FEED',
    purdueLevel: 'L0',
    deviceType: 'Field Actuator/Sensor',
    vendor: 'Schneider Electric',
    model: 'Altivar Process ATV930 450kW',
    firmware: 'v2.3IE18',
    firmwareVulnerable: false,
    ipAddress: '192.168.5.50',
    macAddress: '00:80:F4:7A:BC:33',
    zone: 'Zone 0 - Physical Field Instruments',
    conduit: 'Conduit C-Field-Hardwired',
    riskScore: 28,
    criticality: 'MEDIUM',
    status: 'ONLINE',
    cveCount: 0,
    criticalCves: [],
    protocols: ['CIP / EtherNet/IP', 'Modbus TCP'],
    lastSeen: 'Just now',
    description: 'High-voltage variable speed drive feeding raw hydrocarbon charge to preheat furnace.',
    physicalLocation: 'Pump House Bay 4',
    connectedTo: ['ast-l1-ab5580']
  }
];

export const PRIMARY_ATTACK_PATH: AttackPathGraph = {
  id: 'path-active-01',
  title: 'CRITICAL: Multi-Hop ICS Lateral Movement to Triconex Safety SIS',
  description: 'Adversary leveraged stolen IT VPN credentials, pivoted through IDMZ Jump Host via credential dumping, acquired Engineering Workstation session, and injected unapproved S7comm/Modbus commands targeting Level 1 Safety Instrumented System.',
  severity: 'CRITICAL',
  targetAsset: 'SIS-TRIC-3008-01',
  initialCompromise: 'GW-CORP-01 (10.240.10.1)',
  detectedAt: '18 minutes ago (11:24 UTC)',
  mitreICSMatrix: [
    {
      tactic: 'Initial Access',
      techniqueId: 'T0886',
      techniqueName: 'Remote Services (External VPN)',
      description: 'Stolen vendor credential accessed L4 VPN perimeter without MFA prompt.'
    },
    {
      tactic: 'Lateral Movement',
      techniqueId: 'T0800',
      techniqueName: 'Exploitation of Remote Services (RDP)',
      description: 'Pivoted across Conduit C-43 into IDMZ Jump Host using RDP session hijacking.'
    },
    {
      tactic: 'Privilege Escalation',
      techniqueId: 'T0890',
      techniqueName: 'Exploit Public-Facing Application',
      description: 'Elevated local NT AUTHORITY/SYSTEM on EWS-01 using CVE-2022-45137.'
    },
    {
      tactic: 'Impair Process Control',
      techniqueId: 'T0855',
      techniqueName: 'Unauthorized Command Message',
      description: 'Issued Siemens S7comm CPU STOP code and Modbus Function Code 0x06 write to safety register 40012.'
    },
    {
      tactic: 'Inhibit Response Function',
      techniqueId: 'T0814',
      techniqueName: 'Denial of View / Control Manipulation',
      description: 'Attempting to suppress safety trip interlocking before pressure excursion.'
    }
  ],
  nodes: [
    {
      id: 'node-l4-vpn',
      assetId: 'ast-l4-vpn',
      name: 'L4 IT Perimeter VPN',
      purdueLevel: 'L4',
      role: 'Perimeter Gateway',
      ip: '10.240.10.1',
      vendor: 'Cisco',
      status: 'compromised',
      riskScore: 72,
      x: 100,
      y: 220,
      mitreTechniques: ['T0886'],
      blastRadiusScore: 35
    },
    {
      id: 'node-l35-jump',
      assetId: 'ast-l35-jump',
      name: 'L3.5 IDMZ Jump Box',
      purdueLevel: 'L3.5',
      role: 'Remote Access Host',
      ip: '172.24.10.15',
      vendor: 'Honeywell',
      status: 'compromised',
      riskScore: 88,
      x: 270,
      y: 220,
      mitreTechniques: ['T0800', 'T0890'],
      blastRadiusScore: 68
    },
    {
      id: 'node-l3-hist',
      assetId: 'ast-l3-hist',
      name: 'L3 Plant Historian',
      purdueLevel: 'L3',
      role: 'OSIsoft PI Archive',
      ip: '192.168.30.20',
      vendor: 'OSIsoft',
      status: 'at_risk',
      riskScore: 62,
      x: 440,
      y: 110,
      mitreTechniques: ['T0882'],
      blastRadiusScore: 50
    },
    {
      id: 'node-l2-ews',
      assetId: 'ast-l2-ews01',
      name: 'L2 Engineering EWS-01',
      purdueLevel: 'L2',
      role: 'TIA Portal Station',
      ip: '192.168.20.50',
      vendor: 'Siemens',
      status: 'compromised',
      riskScore: 94,
      x: 440,
      y: 330,
      mitreTechniques: ['T0843', 'T0855'],
      blastRadiusScore: 90
    },
    {
      id: 'node-l1-s7',
      assetId: 'ast-l1-s71500',
      name: 'L1 Cracker PLC S7-1518',
      purdueLevel: 'L1',
      role: 'Process Basic Controller',
      ip: '192.168.10.101',
      vendor: 'Siemens',
      status: 'compromised',
      riskScore: 96,
      x: 640,
      y: 250,
      mitreTechniques: ['T0855', 'T0814'],
      blastRadiusScore: 95
    },
    {
      id: 'node-l1-sis',
      assetId: 'ast-l1-triconex',
      name: 'L1 Triconex Safety SIS',
      purdueLevel: 'L1',
      role: 'Emergency Shutdown SIS',
      ip: '192.168.10.200',
      vendor: 'Schneider/Triconex',
      status: 'target',
      riskScore: 98,
      x: 640,
      y: 390,
      mitreTechniques: ['T0855', 'T0814'],
      blastRadiusScore: 98
    },
    {
      id: 'node-l0-valve',
      assetId: 'ast-l0-valve01',
      name: 'L0 Flare Valve MOV-201',
      purdueLevel: 'L0',
      role: 'Emergency Depressurizing',
      ip: '192.168.5.12',
      vendor: 'Emerson',
      status: 'target',
      riskScore: 92,
      x: 820,
      y: 320,
      mitreTechniques: ['T0814'],
      blastRadiusScore: 94
    }
  ],
  edges: [
    {
      id: 'e1',
      source: 'node-l4-vpn',
      target: 'node-l35-jump',
      protocol: 'RDP',
      port: 3389,
      conduit: 'Conduit C-43 (Enterprise-to-IDMZ)',
      activeAttack: true,
      lateralMovementStep: 1,
      description: 'Unauthorized RDP session initiated from VPN client address using harvested vendor token.',
      anomalyDetected: 'Off-hours RDP connection with non-standard cipher'
    },
    {
      id: 'e2',
      source: 'node-l35-jump',
      target: 'node-l2-ews',
      protocol: 'RDP',
      port: 3389,
      conduit: 'Conduit C-35 (IDMZ-to-Supervisory)',
      activeAttack: true,
      lateralMovementStep: 2,
      description: 'Direct cross-boundary jump from IDMZ into Level 2 Engineering Workstation without MFA token validation.',
      anomalyDetected: 'Cross-zone admin credential relay'
    },
    {
      id: 'e3',
      source: 'node-l35-jump',
      target: 'node-l3-hist',
      protocol: 'HTTPS',
      port: 443,
      conduit: 'Conduit C-35 (IDMZ-to-Operations)',
      activeAttack: false,
      lateralMovementStep: 0,
      description: 'Read-only web telemetry scraping of tag database.'
    },
    {
      id: 'e4',
      source: 'node-l2-ews',
      target: 'node-l1-s7',
      protocol: 'Siemens S7comm',
      port: 102,
      conduit: 'Conduit C-21 (Supervisory-to-Basic-Control)',
      activeAttack: true,
      lateralMovementStep: 3,
      description: 'Unapproved S7comm PDU carrying Function 0x28 (CPU STOP) injected during normal operating cycle.',
      anomalyDetected: 'S7comm PLC Mode Change during Production Run'
    },
    {
      id: 'e5',
      source: 'node-l2-ews',
      target: 'node-l1-sis',
      protocol: 'Modbus TCP',
      port: 502,
      conduit: 'Conduit C-SIS-ISOLATED',
      activeAttack: true,
      lateralMovementStep: 4,
      description: 'Modbus FC 0x06 (Write Single Register) targeted safety interlock override register 40012 on Triconex SIS.',
      anomalyDetected: 'Modbus Function 0x06 to Safety Zone from Non-Designated Gateway'
    },
    {
      id: 'e6',
      source: 'node-l1-s7',
      target: 'node-l0-valve',
      protocol: 'Modbus TCP',
      port: 502,
      conduit: 'Conduit C-10 (Basic-Control-to-Field)',
      activeAttack: true,
      lateralMovementStep: 5,
      description: 'Actuator command signals disrupted; valve feedback loop suppressed.',
      anomalyDetected: 'Discrepancy between command signal and limit switch'
    },
    {
      id: 'e7',
      source: 'node-l1-sis',
      target: 'node-l0-valve',
      protocol: 'Modbus TCP',
      port: 502,
      conduit: 'Conduit C-SIS-ISOLATED',
      activeAttack: true,
      lateralMovementStep: 5,
      description: 'Safety Trip signal transmission line monitored for forced lockout.'
    }
  ],
  recommendations: [
    'Immediately sever Conduit C-35 by applying emergency firewall rule ACL-ISOLATE-EWS01 on OT Boundary Switch.',
    'Quarantine EWS-01 (192.168.20.50) from the Level 2 Supervisory VLAN.',
    'Switch Triconex SIS 3008 Key Switch from "REMOTE/PROGRAM" to physical "RUN" mode to block network logic writes.',
    'Execute DPI rule modbus_strict_ro_502 to reject all Modbus write functions (0x05, 0x06, 0x0F, 0x10) network-wide.'
  ]
};

export const OT_ALERTS: OTAlert[] = [
  {
    id: 'ALT-2026-901',
    title: 'CRITICAL: Unauthorized Modbus FC 0x06 Write to Triconex Safety Register',
    severity: 'CRITICAL',
    timestamp: '3 mins ago (11:39:12 UTC)',
    sourceAsset: 'EWS-UNIT4-01',
    sourceIp: '192.168.20.50',
    destinationAsset: 'SIS-TRIC-3008-01',
    destinationIp: '192.168.10.200',
    purdueTransition: 'L2 -> L1 (Safety Zone)',
    protocol: 'Modbus TCP',
    functionCode: '0x06 (Write Single Register)',
    anomalyType: 'Safety System Tag Overwrite',
    status: 'NEW',
    description: 'Anomalous Modbus TCP request sent from Engineering Station attempting to force Register 40012 to value 0x0000 (Safety Trip Interlock Override). Normal operation allows read-only (FC 0x03/0x04) telemetry.',
    packetSummary: {
      rawHexPreview: '00 01 00 00 00 06 01 06 9C 4C 00 00 [Modbus/TCP Header: TransID 1, ProtoID 0, Len 6, UnitID 1, FC 06, Reg 40012, Val 0x0000]',
      decodedFields: {
        'Transaction ID': '0x0001',
        'Protocol ID': '0x0000 (Modbus TCP)',
        'Length': '6 bytes',
        'Unit ID / Slave': '1',
        'Function Code': '0x06 (Write Single Register)',
        'Register Address': '40012 (0x9C4C - SIS_TRIP_INTERLOCK)',
        'Write Value': '0x0000 (DISABLED)'
      }
    },
    recommendedActions: [
      'Activate OT Firewall Rule to block Modbus Port 502 writes between L2 and L1',
      'Verify physical Triconex key position in Marshalling Room AER-1',
      'Export PCAP capture for forensic analysis'
    ]
  },
  {
    id: 'ALT-2026-902',
    title: 'CRITICAL: Siemens S7comm CPU STOP Command Injected to Reactor PLC',
    severity: 'CRITICAL',
    timestamp: '14 mins ago (11:28:44 UTC)',
    sourceAsset: 'EWS-UNIT4-01',
    sourceIp: '192.168.20.50',
    destinationAsset: 'PLC-S7-1518-FCC',
    destinationIp: '192.168.10.101',
    purdueTransition: 'L2 -> L1',
    protocol: 'Siemens S7comm',
    functionCode: '0x28 (PLC Stop)',
    anomalyType: 'Unauthorized PLC Logic Write',
    status: 'INVESTIGATING',
    description: 'S7comm Job request containing function code 0x28 (CPU STOP) sent to Siemens S7-1518 during hot catalyst cracking cycle. If executed, reactor cooling loops would stall.',
    packetSummary: {
      rawHexPreview: '03 00 00 21 02 F0 80 32 01 00 00 00 01 00 0E 00 00 28 00 00 00 00 00 00 FD 00 00 09 50 5F 50 52 4F 47 52 41 4D',
      decodedFields: {
        'TPKT': 'Version 3, Length 33',
        'ISO-COTP': 'Data Transfer, PDU Type 0xF0',
        'S7 Header': 'Protocol ID 0x32, ROSCTR 1 (Job)',
        'Function': '0x28 (PLC Stop)',
        'Parameter': 'P_PROGRAM invocation',
        'Target CPU': 'S7-1518 CPU 0'
      }
    },
    recommendedActions: [
      'Isolate EWS-01 interface on Hirschmann Industrial Switch port 12',
      'Check TIA Portal project file integrity hash against baseline in repository',
      'Confirm PLC operational LED status via local technician'
    ]
  },
  {
    id: 'ALT-2026-903',
    title: 'HIGH: Cross-Zone Remote Desktop Pivot via IDMZ Jump Host',
    severity: 'HIGH',
    timestamp: '22 mins ago (11:20:05 UTC)',
    sourceAsset: 'GW-CORP-01',
    sourceIp: '10.240.10.1',
    destinationAsset: 'SRV-IDMZ-JUMP01',
    destinationIp: '172.24.10.15',
    purdueTransition: 'L4 -> L3.5',
    protocol: 'RDP',
    anomalyType: 'Brute Force RDP to EWS',
    status: 'INVESTIGATING',
    description: 'Multiple failed Kerberos ticket requests followed by successful RDP login from external IP using privileged contractor credential "vendor_svc_tier2".',
    packetSummary: {
      rawHexPreview: '03 00 00 13 0E E0 00 00 00 00 00 01 00 08 00 03 00 00 00 [RDP Connection Request PDU]',
      decodedFields: {
        'Protocol': 'RDP over TLS v1.3',
        'Port': '3389',
        'User Account': 'CONTOSO\\vendor_svc_tier2',
        'Client Name': 'LAPTOP-EXT-9821'
      }
    },
    recommendedActions: [
      'Revoke Active Directory session for vendor_svc_tier2',
      'Terminate active RDP connection ID 10842',
      'Review IDMZ firewall logs for credential spray indicators'
    ]
  },
  {
    id: 'ALT-2026-904',
    title: 'HIGH: Rogue MAC Address Detected in Basic Control Subnet 192.168.10.0/24',
    severity: 'HIGH',
    timestamp: '41 mins ago (11:01:18 UTC)',
    sourceAsset: 'Unknown Device (Raspberry Pi OUI)',
    sourceIp: '192.168.10.188',
    destinationAsset: 'PLC-AB-CLX5580',
    destinationIp: '192.168.10.105',
    purdueTransition: 'Internal L1 Subnet',
    protocol: 'CIP / EtherNet/IP',
    anomalyType: 'Rogue MAC in Basic Control Zone',
    status: 'NEW',
    description: 'DPI Sensor TAP-02 identified unauthorized ARP announcement and CIP broadcast from unapproved MAC vendor prefix B8:27:EB (Raspberry Pi Foundation) connected to Switch SW-L1-02.',
    packetSummary: {
      rawHexPreview: 'FF FF FF FF FF FF B8 27 EB 92 41 80 08 06 00 01 08 00 06 04 00 01 B8 27 EB 92 41 80 C0 A8 0A BC',
      decodedFields: {
        'Sender MAC': 'B8:27:EB:92:41:80 (Raspberry Pi)',
        'Sender IP': '192.168.10.188',
        'Target IP': '192.168.10.105',
        'Protocol': 'ARP Probe / CIP Broadcast'
      }
    },
    recommendedActions: [
      'Trigger 802.1X Port Security shutdown on Switch SW-L1-02 Port 8',
      'Dispatch physical security to Substation 104 Marshalling Rack',
      'Review CCTV camera feed covering Rack 04'
    ]
  },
  {
    id: 'ALT-2026-905',
    title: 'MEDIUM: Unapproved OPC UA Session Request to Plant Historian',
    severity: 'MEDIUM',
    timestamp: '1 hour ago (10:35:10 UTC)',
    sourceAsset: 'SRV-IDMZ-JUMP01',
    sourceIp: '172.24.10.15',
    destinationAsset: 'SRV-HIST-01',
    destinationIp: '192.168.30.20',
    purdueTransition: 'L3.5 -> L3',
    protocol: 'OPC UA',
    anomalyType: 'Unapproved OPC UA Session',
    status: 'CONTAINED',
    description: 'OPC UA client from Jump Host requested bulk export of 14,000 process tag values with SecurityPolicy#None.',
    packetSummary: {
      rawHexPreview: '4F 50 43 46 48 00 00 00 00 00 00 00 01 00 00 00 [OPC UA Hello Message: None Security]',
      decodedFields: {
        'Message Type': 'HEL (Hello)',
        'Security Policy': 'http://opcfoundation.org/UA/SecurityPolicy#None',
        'Tag Namespace': 'Plant.FCC.Reactors.*'
      }
    },
    recommendedActions: [
      'Enforced certificate-based authentication on OPC UA endpoint',
      'Restricted OPC UA read permissions to approved service accounts'
    ]
  }
];

export const OT_SENSORS: OTSensor[] = [
  {
    id: 'sensor-tap-01',
    name: 'Core TAP-01 (Houston L3/L2 Boundary)',
    type: 'Passive Optical TAP',
    location: 'Houston Unit 4 Main Telecom Room, Rack 02',
    purdueCoverage: ['L3', 'L2'],
    status: 'OPTIMAL',
    bandwidthGbps: 10.0,
    throughputMbps: 482.4,
    droppedPacketsPct: 0.00,
    totalPacketsLastHour: '142,890,120',
    bufferUtilizationPct: 18.4,
    cpuLoadPct: 24.1,
    memoryPct: 38.5,
    firmwareVersion: 'v4.8.2-ICS-DPI',
    lastHeartbeat: '3 seconds ago',
    ipAddress: '10.200.1.11'
  },
  {
    id: 'sensor-tap-02',
    name: 'Industrial DPI Engine (L1 Process & Safety)',
    type: 'Inline DPI Engine',
    location: 'Unit 4 Substation Marshalling Cabinet 104',
    purdueCoverage: ['L1', 'L0'],
    status: 'OPTIMAL',
    bandwidthGbps: 1.0,
    throughputMbps: 68.2,
    droppedPacketsPct: 0.00,
    totalPacketsLastHour: '38,410,500',
    bufferUtilizationPct: 22.0,
    cpuLoadPct: 31.8,
    memoryPct: 44.0,
    firmwareVersion: 'v4.8.2-ICS-DPI',
    lastHeartbeat: '1 second ago',
    ipAddress: '10.200.1.12'
  },
  {
    id: 'sensor-tap-03',
    name: 'IDMZ SPAN Mirror Feed (L4/L3.5 Conduit)',
    type: 'Switch SPAN Feed',
    location: 'Bldg A, IDMZ DMZ Switch Core',
    purdueCoverage: ['L4', 'L3.5'],
    status: 'OPTIMAL',
    bandwidthGbps: 10.0,
    throughputMbps: 610.9,
    droppedPacketsPct: 0.00,
    totalPacketsLastHour: '210,400,000',
    bufferUtilizationPct: 14.5,
    cpuLoadPct: 19.2,
    memoryPct: 32.0,
    firmwareVersion: 'v4.8.1-ICS-DPI',
    lastHeartbeat: '4 seconds ago',
    ipAddress: '10.200.1.13'
  },
  {
    id: 'sensor-tap-04',
    name: 'Remote NetFlow Collector (Substation Feeders)',
    type: 'OT NetFlow Probe',
    location: 'West Substation 02 Remote Marshalling Hub',
    purdueCoverage: ['L2', 'L1'],
    status: 'OPTIMAL',
    bandwidthGbps: 1.0,
    throughputMbps: 18.4,
    droppedPacketsPct: 0.00,
    totalPacketsLastHour: '9,120,400',
    bufferUtilizationPct: 9.2,
    cpuLoadPct: 12.0,
    memoryPct: 28.0,
    firmwareVersion: 'v4.7.9-ICS-DPI',
    lastHeartbeat: '6 seconds ago',
    ipAddress: '10.200.1.14'
  }
];

export const PROTOCOL_TELEMETRY_LIST: ProtocolTelemetry[] = [
  {
    protocol: 'Modbus TCP',
    packetsPerSec: 1240,
    bandwidthKbps: 940,
    activeSessions: 18,
    anomalousCommands24h: 3,
    trend: 'UP',
    status: 'ANOMALOUS',
    commonFunctionCodes: [
      { code: '0x03', name: 'Read Holding Registers', count: 84210 },
      { code: '0x04', name: 'Read Input Registers', count: 42100 },
      { code: '0x06', name: 'Write Single Register (Alert Trigger)', count: 4 },
      { code: '0x10', name: 'Write Multiple Registers', count: 12 }
    ]
  },
  {
    protocol: 'Siemens S7comm',
    packetsPerSec: 890,
    bandwidthKbps: 710,
    activeSessions: 6,
    anomalousCommands24h: 1,
    trend: 'UP',
    status: 'ANOMALOUS',
    commonFunctionCodes: [
      { code: '0x04', name: 'Read Var (DB/M/I/Q)', count: 68100 },
      { code: '0x05', name: 'Write Var', count: 1800 },
      { code: '0x28', name: 'PLC Stop Command (CRITICAL)', count: 1 },
      { code: '0xF0', name: 'Setup Comm', count: 24 }
    ]
  },
  {
    protocol: 'CIP / EtherNet/IP',
    packetsPerSec: 1650,
    bandwidthKbps: 1280,
    activeSessions: 12,
    anomalousCommands24h: 1,
    trend: 'STABLE',
    status: 'ELEVATED',
    commonFunctionCodes: [
      { code: '0x4C', name: 'Read Tag Service', count: 112000 },
      { code: '0x4D', name: 'Write Tag Service', count: 3200 },
      { code: '0x0A', name: 'Multiple Service Packet', count: 4100 },
      { code: '0x0E', name: 'Get Attribute Single', count: 8900 }
    ]
  },
  {
    protocol: 'OPC UA',
    packetsPerSec: 420,
    bandwidthKbps: 340,
    activeSessions: 8,
    anomalousCommands24h: 1,
    trend: 'STABLE',
    status: 'NORMAL',
    commonFunctionCodes: [
      { code: 'MSG', name: 'ReadRequest', count: 34100 },
      { code: 'MSG', name: 'PublishRequest', count: 12900 },
      { code: 'HEL', name: 'Hello Message', count: 18 }
    ]
  },
  {
    protocol: 'DNP3',
    packetsPerSec: 180,
    bandwidthKbps: 110,
    activeSessions: 4,
    anomalousCommands24h: 0,
    trend: 'STABLE',
    status: 'NORMAL',
    commonFunctionCodes: [
      { code: '0x01', name: 'Read Class 0/1/2/3', count: 18200 },
      { code: '0x02', name: 'Write Output Block', count: 340 }
    ]
  },
  {
    protocol: 'BACnet/IP',
    packetsPerSec: 95,
    bandwidthKbps: 64,
    activeSessions: 2,
    anomalousCommands24h: 0,
    trend: 'DOWN',
    status: 'NORMAL',
    commonFunctionCodes: [
      { code: '0x0C', name: 'ReadProperty', count: 8200 },
      { code: '0x0E', name: 'WriteProperty', count: 80 }
    ]
  }
];

export const TOPOLOGY_CHANGE_TIMELINE = [
  {
    id: 't-1',
    time: '11:39 UTC',
    type: 'CRITICAL_PAYLOAD',
    title: 'Modbus Write 0x06 to SIS-TRIC-3008-01',
    actor: 'EWS-UNIT4-01 (192.168.20.50)',
    level: 'L1',
    severity: 'CRITICAL'
  },
  {
    id: 't-2',
    time: '11:28 UTC',
    type: 'PLC_COMMAND',
    title: 'Siemens S7comm CPU STOP transmitted to S7-1518',
    actor: 'EWS-UNIT4-01 (192.168.20.50)',
    level: 'L1',
    severity: 'CRITICAL'
  },
  {
    id: 't-3',
    time: '11:20 UTC',
    type: 'LATERAL_MOVE',
    title: 'Privileged RDP session opened into EWS-01',
    actor: 'SRV-IDMZ-JUMP01 (172.24.10.15)',
    level: 'L2',
    severity: 'HIGH'
  },
  {
    id: 't-4',
    time: '11:01 UTC',
    type: 'NEW_ASSET',
    title: 'New unapproved MAC B8:27:EB:92:41:80 on L1 Switch SW-L1-02',
    actor: 'Unknown Hardware',
    level: 'L1',
    severity: 'HIGH'
  },
  {
    id: 't-5',
    time: '10:15 UTC',
    type: 'POLICY_UPDATE',
    title: 'OT Firewall Conduit C-43 rule modified by admin',
    actor: 'j.martinez_admin',
    level: 'L4',
    severity: 'INFO'
  }
];
