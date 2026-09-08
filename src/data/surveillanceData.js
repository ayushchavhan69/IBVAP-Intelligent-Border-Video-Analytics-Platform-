export const initialSurveillanceData = {
  stats: {
    cameras: { count: '48', sub: '42 Online', label: 'Total Cameras', color: 'cyan' },
    persons: { count: '1,246', change: '+12%', label: 'Total Persons Detected', color: 'teal' },
    vehicles: { count: '342', change: '+8%', label: 'Total Vehicles Detected', color: 'green' },
    anpr: { count: '128', change: '+15%', label: 'ANPR Detections', color: 'purple' },
    alerts: { count: '7', linkText: 'View all alerts →', label: 'Active Alerts', color: 'red' }
  },
  
  cameras: [
    {
      id: 'cam-1',
      name: 'BOP Alpha - North Gate',
      location: 'North Perimeter Gate Sector 2',
      status: 'LIVE',
      fps: 25,
      resolution: '1920x1080',
      bitrate: '4.2 Mbps',
      aiModel: 'YOLOv10x-Border-Trained',
      image: 'http://localhost:8000/video_feed/cam-1',
      detections: [
        {
          label: 'Person 95%',
          type: 'person',
          confidence: 0.95,
          color: '#10B981',
          box: { top: '23%', left: '29%', width: '18%', height: '48%' }
        }
      ]
    },
    {
      id: 'cam-2',
      name: 'Check Post - Road 32',
      location: 'Highway Checkpost Sector 4',
      status: 'LIVE',
      fps: 30,
      resolution: '1920x1080',
      bitrate: '4.8 Mbps',
      aiModel: 'VehicleClassNet-v3',
      image: 'http://localhost:8000/video_feed/cam-2',
      detections: [
        {
          label: 'Vehicle 97%',
          type: 'vehicle',
          confidence: 0.97,
          color: '#A855F7',
          box: { top: '18%', left: '32%', width: '30%', height: '52%' }
        }
      ]
    },
    {
      id: 'cam-3',
      name: 'BOP Alpha - East Fence',
      location: 'East Perimeter Smart Fence Line',
      status: 'LIVE',
      alertLevel: 'critical',
      fps: 25,
      resolution: '1920x1080',
      bitrate: '3.9 Mbps',
      aiModel: 'VirtualFence-Intrusion-v2',
      image: 'http://localhost:8000/video_feed/cam-3',
      detections: [
        {
          label: 'Intrusion 93%',
          type: 'intrusion',
          confidence: 0.93,
          color: '#EF4444',
          box: { top: '40%', left: '34%', width: '16%', height: '48%' }
        }
      ]
    },
    {
      id: 'cam-4',
      name: 'Border Road - Sector 7',
      location: 'Sector 7 Patrol Corridor',
      status: 'LIVE',
      fps: 25,
      resolution: '1920x1080',
      bitrate: '4.1 Mbps',
      aiModel: 'HeavyVehicleClassifier-v1',
      image: 'http://localhost:8000/video_feed/cam-4',
      detections: [
        {
          label: 'Truck 96%',
          type: 'truck',
          confidence: 0.96,
          color: '#A855F7',
          box: { top: '24%', left: '16%', width: '70%', height: '70%' }
        }
      ]
    }
  ],

  alerts: [
    {
      id: 'alert-1',
      title: 'Virtual Fence Breach',
      location: 'BOP Alpha - East Fence',
      time: '11:28:31 AM',
      type: 'critical',
      severityTag: 'CRITICAL BREACH',
      thumbnail: '/assets/alerts/alert_fence_breach.jpg',
      details: 'Automated tripwire breach detected. Unidentified subject entered perimeter restricted zone from zero line boundary. Ground contact confirmed. Track duration: 18s.',
      actionTaken: 'Pending Operator Triage'
    },
    {
      id: 'alert-2',
      title: 'ANPR Hotlist Intercept',
      location: 'Check Post - Road 32',
      time: '11:26:40 AM',
      type: 'intel',
      severityTag: 'STOLEN VEHICLE',
      thumbnail: '/assets/alerts/alert_anpr_intercept.jpg',
      details: 'Registration PB10MF1234 identified via HSRP OCR scanner. Matched National Hotlist database (Tag: Stolen / Contraband Transport). Automated barrier lock deployed.',
      actionTaken: 'Barrier Lock Engaged'
    },
    {
      id: 'alert-3',
      title: 'Biometric Watchlist Match',
      location: 'Check Post - Pedestrian Gate',
      time: '11:24:18 AM',
      type: 'critical',
      severityTag: 'SUSPECT IDENTIFIED',
      thumbnail: '/assets/alerts/alert_face_suspect.jpg',
      details: 'Biometric face recognition engine matched facial signature against Watchlist Database (Target Alpha / WLIST-SUS-991, 94% cosine similarity).',
      actionTaken: 'Flagged for Immediate Detainment'
    },
    {
      id: 'alert-4',
      title: 'Thermal IR Perimeter Anomaly',
      location: 'Zero Line Corridor - Culvert 14',
      time: '11:22:05 AM',
      type: 'high',
      severityTag: 'THERMAL BREACH',
      thumbnail: '/assets/alerts/alert_thermal_breach.jpg',
      details: 'Long-wave infrared thermal sensor detected human heat signature moving through unlit ditch along zero line perimeter fence.',
      actionTaken: 'Floodlight Array Engaged'
    },
    {
      id: 'alert-5',
      title: 'Restricted Lane Loitering',
      location: 'Sector 7 - Military Supply Corridor',
      time: '11:19:50 AM',
      type: 'medium',
      severityTag: 'LOITERING > 180s',
      thumbnail: '/assets/alerts/alert_corridor_loitering.jpg',
      details: 'Vehicle stationary within restricted military transit lane for 184 seconds without assigned security manifest or transit clearance.',
      actionTaken: 'Auditory Broadcast Dispatched'
    },
    {
      id: 'alert-6',
      title: 'Hotlist Carrier Intercept',
      location: 'Check Post 32 - Lane 2',
      time: '11:15:12 AM',
      type: 'intel',
      severityTag: 'WANTED TRUCK',
      thumbnail: '/assets/alerts/alert_hotlist_mh12.jpg',
      details: 'Plate MH12AB5678 flagged for unauthorized border transit and contraband transport. Automated barrier engaged.',
      actionTaken: 'QRF Intercept Unit Dispatched'
    },
    {
      id: 'alert-7',
      title: 'Gate Access Badge Anomaly',
      location: 'BOP Alpha - Main Gate',
      time: '11:10:30 AM',
      type: 'high',
      severityTag: 'ACCESS VIOLATION',
      thumbnail: '/assets/alerts/alert_gate_unauthorized.jpg',
      details: 'Individual attempted entry through turnstile without valid RFID badge or tactical clearance credentials.',
      actionTaken: 'Turnstile Interlock Activated'
    }
  ],

  analytics: {
    donut: {
      total: '1,844',
      items: [
        { label: 'Intrusion', count: '652', pct: '35%', color: '#EF4444' },
        { label: 'Vehicle', count: '542', pct: '29%', color: '#3B82F6' },
        { label: 'Loitering', count: '362', pct: '20%', color: '#F97316' },
        { label: 'ANPR', count: '128', pct: '7%', color: '#A855F7' },
        { label: 'Other', count: '160', pct: '9%', color: '#06B6D4' }
      ]
    },
    timeline: [
      { time: '00:00', count: 18 },
      { time: '02:00', count: 24 },
      { time: '04:00', count: 58 },
      { time: '06:00', count: 95 },
      { time: '08:00', count: 142 },
      { time: '10:00', count: 125 },
      { time: '12:00', count: 185 },
      { time: '14:00', count: 172 },
      { time: '16:00', count: 130 },
      { time: '18:00', count: 98 },
      { time: '20:00', count: 145 },
      { time: '22:00', count: 75 },
      { time: '24:00', count: 32 }
    ],
    topCameras: [
      { rank: 1, name: 'BOP Alpha - North Gate', count: 512, pct: 100 },
      { rank: 2, name: 'Check Post - Road 32', count: 398, pct: 77 },
      { rank: 3, name: 'Border Road - Sector 7', count: 276, pct: 54 },
      { rank: 4, name: 'BOP Alpha - East Fence', count: 184, pct: 36 },
      { rank: 5, name: 'Check Post - Main Gate', count: 156, pct: 30 }
    ],
    health: {
      score: '98%',
      status: 'Healthy',
      metrics: [
        { name: 'Cameras', val: '98%', status: 'good' },
        { name: 'AI Engine', val: '99%', status: 'good' },
        { name: 'Storage', val: '92%', status: 'good' },
        { name: 'Network', val: '97%', status: 'good' }
      ]
    }
  },

  // Forensic Search & Playback Dataset
  searchRecords: [
    {
      id: 'rec-1',
      timestamp: '2026-09-06 11:28:31',
      camera: 'BOP Alpha - East Fence',
      cameraId: 'cam-3',
      eventType: 'Intrusion',
      confidence: 93,
      details: 'Perimeter fence physical contact detected',
      plate: 'N/A',
      thumbnail: '/assets/alert1.jpg',
      duration: '00:14',
      status: 'Investigated'
    },
    {
      id: 'rec-2',
      timestamp: '2026-09-06 11:26:18',
      camera: 'Check Post - Road 32',
      cameraId: 'cam-2',
      eventType: 'Face Match',
      confidence: 88,
      details: 'Suspect biometric similarity match with Watchlist ID #POI-092',
      plate: 'N/A',
      thumbnail: '/assets/alert2.jpg',
      duration: '00:08',
      status: 'Flagged'
    },
    {
      id: 'rec-3',
      timestamp: '2026-09-06 11:24:02',
      camera: 'Check Post - Road 32',
      cameraId: 'cam-2',
      eventType: 'ANPR',
      confidence: 97,
      details: 'Plate PB10MF1234 flagged for cross-border contraband contraband',
      plate: 'PB10MF1234',
      thumbnail: '/assets/alert3.jpg',
      duration: '00:32',
      status: 'Intercepted'
    },
    {
      id: 'rec-4',
      timestamp: '2026-09-06 11:22:47',
      camera: 'Border Road - Sector 7',
      cameraId: 'cam-4',
      eventType: 'Loitering',
      confidence: 91,
      details: '2 subjects stationary for >180s near culvert bridge',
      plate: 'N/A',
      thumbnail: '/assets/alert4.jpg',
      duration: '03:15',
      status: 'Cleared'
    },
    {
      id: 'rec-5',
      timestamp: '2026-09-06 10:45:12',
      camera: 'BOP Alpha - North Gate',
      cameraId: 'cam-1',
      eventType: 'Person',
      confidence: 95,
      details: 'Authorized border security patrol unit passage',
      plate: 'N/A',
      thumbnail: '/assets/cam1.jpg',
      duration: '01:10',
      status: 'Authorized'
    },
    {
      id: 'rec-6',
      timestamp: '2026-09-06 09:30:22',
      camera: 'Border Road - Sector 7',
      cameraId: 'cam-4',
      eventType: 'Vehicle',
      confidence: 96,
      details: 'Heavy logistics military convoy transiting Sector 7',
      plate: 'DL01AB9876',
      thumbnail: '/assets/cam4.jpg',
      duration: '02:40',
      status: 'Logged'
    }
  ],

  // Watchlist & POI Profiles
  watchlist: {
    pois: [
      {
        id: 'POI-104',
        name: 'Tariq "Shadow" Rahman',
        alias: 'Abu Hamza',
        threat: 'CRITICAL',
        category: 'Infiltration / Smuggling',
        confidenceMatch: '94.2%',
        lastSeen: 'BOP Alpha - East Fence (11:28 AM)',
        status: 'Active Alert',
        photo: '/assets/alert2.jpg',
        notes: 'Subject known for illicit border conduit operations.'
      },
      {
        id: 'POI-088',
        name: 'Gurpreet "Rana" Singh',
        alias: 'Rana Transport',
        threat: 'HIGH',
        category: 'Contraband Carrier',
        confidenceMatch: '88.6%',
        lastSeen: 'Check Post - Road 32 (11:24 AM)',
        status: 'Active Alert',
        photo: '/assets/alert3.jpg',
        notes: 'Associated with stolen transport vehicles PB10MF1234.'
      },
      {
        id: 'POI-052',
        name: 'Vikramjit "Vicky" Kaler',
        alias: 'Hawk-7',
        threat: 'MEDIUM',
        category: 'Unlicensed Drone Operator',
        confidenceMatch: '81.4%',
        lastSeen: 'Sector 7 Patrol Line (Yesterday 19:40)',
        status: 'Monitored',
        photo: '/assets/alert4.jpg',
        notes: 'Under observation for night drone drops.'
      }
    ],
    vehicles: [
      {
        id: 'VEH-01',
        plate: 'PB10MF1234',
        vehicleType: 'Bolero Camper 4x4',
        color: 'Silver Metallic',
        threat: 'CRITICAL',
        reason: 'Intercept Order: Suspected Contraband Shipment',
        matchedLocation: 'Check Post - Road 32',
        lastTimestamp: 'Today 11:24 AM',
        status: 'DETAINED'
      },
      {
        id: 'VEH-02',
        plate: 'JK02BA7741',
        vehicleType: 'Mahindra Scorpio',
        color: 'Dark Olive',
        threat: 'HIGH',
        reason: 'Stolen Vehicle / Fake Registration Plates',
        matchedLocation: 'Border Road - Sector 7',
        lastTimestamp: 'Yesterday 22:15 PM',
        status: 'HOTLIST'
      },
      {
        id: 'VEH-03',
        plate: 'HR26DK4409',
        vehicleType: 'Tata 407 Cargo',
        color: 'White',
        threat: 'MEDIUM',
        reason: 'Restricted Corridor Transit without Permit',
        matchedLocation: 'Check Post - Main Gate',
        lastTimestamp: 'Yesterday 14:02 PM',
        status: 'MONITORED'
      }
    ]
  },

  // Tactical Reports Data
  reports: [
    {
      id: 'REP-2026-0906',
      title: 'Daily Border Situational Report (SITREP)',
      period: '06-Sep-2026 (00:00 - 12:00 IST)',
      generatedBy: 'Inspector R. K. Sharma (Duty Officer)',
      status: 'CONFIRMED',
      summary: '1 Critical breach attempt neutralized at BOP Alpha East Fence. 1 Watchlist ANPR intercept executed at Road 32.',
      breaches: 1,
      vehiclesChecked: 342,
      anprHits: 14,
      downloadUrl: '#'
    },
    {
      id: 'REP-2026-0905',
      title: '24-Hour Automated AI Anomaly Audit',
      period: '05-Sep-2026 (Full Day)',
      generatedBy: 'IBVAP Automated Intelligence Engine',
      status: 'ARCHIVED',
      summary: 'Overall camera uptime 98.4%. False positive suppression rate achieved 94.2%. 12 incidents logged.',
      breaches: 3,
      vehiclesChecked: 680,
      anprHits: 28,
      downloadUrl: '#'
    },
    {
      id: 'REP-2026-0904',
      title: 'Weekly Sector 7 Security Risk Assessment',
      period: '28-Aug-2026 to 04-Sep-2026',
      generatedBy: 'Commandant V. S. Chauhan',
      status: 'CONFIDENTIAL',
      summary: 'Heightened loitering observed between 22:00 and 03:00 along culvert road. Additional floodlights requested.',
      breaches: 7,
      vehiclesChecked: 2410,
      anprHits: 82,
      downloadUrl: '#'
    }
  ],

  // System & Edge AI Health Diagnostics
  systemHealth: {
    edgeServers: [
      { name: 'Edge-AI-Node-01 (BOP Alpha)', status: 'HEALTHY', gpuLoad: '68%', vram: '14.2 / 24 GB', temp: '58°C', fps: 144, uptime: '18d 04h' },
      { name: 'Edge-AI-Node-02 (Check Post 32)', status: 'HEALTHY', gpuLoad: '74%', vram: '16.8 / 24 GB', temp: '63°C', fps: 120, uptime: '12d 18h' },
      { name: 'Edge-AI-Node-03 (Sector 7 Patrol)', status: 'DEGRADED', gpuLoad: '91%', vram: '22.4 / 24 GB', temp: '74°C', fps: 98, uptime: '4d 02h' }
    ],
    storageArray: {
      total: '48 TB',
      used: '36.8 TB (76%)',
      retentionDays: '45 Days Standard (90 Days Evidence Vault)',
      raidStatus: 'RAID 6 HEALTHY'
    },
    networkThroughput: {
      ingestBandwidth: '38.4 Mbps',
      c2SyncLatency: '14 ms',
      packetLoss: '0.02%'
    },
    cameraStreams: [
      { id: 'cam-1', name: 'BOP Alpha - North Gate', ip: '192.168.10.101', latency: '32 ms', loss: '0.0%', codec: 'H.264/RTSP', status: 'Optimal' },
      { id: 'cam-2', name: 'Check Post - Road 32', ip: '192.168.10.102', latency: '28 ms', loss: '0.0%', codec: 'H.264/RTSP', status: 'Optimal' },
      { id: 'cam-3', name: 'BOP Alpha - East Fence', ip: '192.168.10.103', latency: '44 ms', loss: '0.1%', codec: 'H.265/RTSP', status: 'Optimal' },
      { id: 'cam-4', name: 'Border Road - Sector 7', ip: '192.168.10.104', latency: '58 ms', loss: '0.4%', codec: 'H.264/RTSP', status: 'Stable' }
    ]
  },

  // Devices & Existing CCTV Camera Management
  devices: [
    {
      id: 'cam-1',
      name: 'BOP Alpha - North Gate',
      ip: '192.168.10.101',
      port: 554,
      rtspUrl: 'rtsp://admin:****@192.168.10.101:554/live/ch0',
      brand: 'Hikvision DS-2CD2T87G2-L (Legacy CCTV)',
      fov: '108° Wide Optical',
      location: 'North Perimeter Gate Sector 2',
      models: ['YOLOv10x-Border', 'DeepSORT-v2'],
      status: 'ONLINE'
    },
    {
      id: 'cam-2',
      name: 'Check Post - Road 32',
      ip: '192.168.10.102',
      port: 554,
      rtspUrl: 'rtsp://admin:****@192.168.10.102:554/stream1',
      brand: 'Dahua IPC-HFW5842E-Z4E (Standard CCTV)',
      fov: 'Motorized Varifocal 4x',
      location: 'Highway Checkpost Sector 4',
      models: ['VehicleClassNet-v3', 'LPRNet-India', 'FaceNet-v2'],
      status: 'ONLINE'
    },
    {
      id: 'cam-3',
      name: 'BOP Alpha - East Fence',
      ip: '192.168.10.103',
      port: 554,
      rtspUrl: 'rtsp://admin:****@192.168.10.103:554/onvif1',
      brand: 'CP PLUS CP-UNC-TD41ZL5 (Conventional IP)',
      fov: 'Zero Line Perimeter Fence',
      location: 'East Perimeter Smart Fence Line',
      models: ['VirtualFence-Intrusion-v2', 'Loitering-v1'],
      status: 'ONLINE'
    },
    {
      id: 'cam-4',
      name: 'Border Road - Sector 7',
      ip: '192.168.10.104',
      port: 554,
      rtspUrl: 'rtsp://admin:****@192.168.10.104:554/h264Preview_01_main',
      brand: 'Uniview IPC2324EBR-DPZ28 (Existing CCTV)',
      fov: 'Long Range Corridor 60m',
      location: 'Sector 7 Patrol Corridor',
      models: ['HeavyVehicleClassifier-v1', 'NightVisionIR-v2'],
      status: 'ONLINE'
    }
  ],

  // System AI & Sensor Settings
  settings: {
    personConfidence: 80,
    vehicleConfidence: 85,
    intrusionConfidence: 75,
    anprConfidence: 90,
    loiteringDwellTime: 120,
    irNightEnhancement: true,
    autoDispatchQrf: false,
    soundAlerts: true,
    c2WebhookUrl: 'https://c2.bsf.gov.in/api/v1/ibvap/telemetry',
    auditLogging: true
  },

  // Role-Based Access Control (Users & Roles)
  users: [
    {
      id: 'USR-001',
      name: 'V. S. Chauhan',
      rank: 'Commandant (CO)',
      role: 'Command & Control Chief',
      clearance: 'Level 5 (Top Secret)',
      status: 'ACTIVE',
      lastActive: 'Active Now'
    },
    {
      id: 'USR-002',
      name: 'R. K. Sharma',
      rank: 'Inspector / Duty Officer',
      role: 'Tactical Operator',
      clearance: 'Level 4 (Secret)',
      status: 'ACTIVE',
      lastActive: 'Active Now'
    },
    {
      id: 'USR-003',
      name: 'Pooja Verma',
      rank: 'Sub-Inspector',
      role: 'Video Analyst',
      clearance: 'Level 3 (Confidential)',
      status: 'ACTIVE',
      lastActive: '24 mins ago'
    },
    {
      id: 'USR-004',
      name: 'Amitabh Sen',
      rank: 'Systems Specialist',
      role: 'System / Edge AI Admin',
      clearance: 'Level 5 (Technical)',
      status: 'ACTIVE',
      lastActive: '1 hr ago'
    }
  ],

  // Forensic Audit Logs (Immutable SHA-256 Tokens)
  auditLogs: [
    {
      id: 'AUD-9941',
      timestamp: '2026-09-06 11:32:05',
      operator: 'Inspector R. K. Sharma (BSF-9201)',
      action: 'QRF Patrol Unit 3 Dispatched',
      target: 'BOP Alpha - East Fence (Virtual Fence Breach)',
      ip: '10.14.2.18',
      hash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    },
    {
      id: 'AUD-9940',
      timestamp: '2026-09-06 11:29:10',
      operator: 'Inspector R. K. Sharma (BSF-9201)',
      action: 'Alert Acknowledged & Escalated',
      target: 'Incident #alert-1 (Virtual Fence Breach)',
      ip: '10.14.2.18',
      hash: 'sha256:bf234e9e46a7be7c030d9396e9526e0e64c5ec7da86e8897b79a55257ef59b8a'
    },
    {
      id: 'AUD-9939',
      timestamp: '2026-09-06 11:25:40',
      operator: 'Commandant V. S. Chauhan (BSF-0012)',
      action: 'Checkpost Barrier Lock Engaged',
      target: 'Check Post Road 32 (Plate PB10MF1234 Intercept)',
      ip: '10.14.1.04',
      hash: 'sha256:127e6fbfe24a750e72930722ec88f13b1fb1307619c0e83e42f6d9abb32e18b2'
    },
    {
      id: 'AUD-9938',
      timestamp: '2026-09-06 11:18:22',
      operator: 'Sub-Inspector Pooja Verma (BSF-9415)',
      action: 'Forensic Video Clip Exported (1080p MP4)',
      target: 'Camera cam-3 (Sector 2 East Fence 10:45-11:15)',
      ip: '10.14.2.22',
      hash: 'sha256:8a505b22591629dd002d242cfa169f44ffc202028646b9a8960fa0a2fc862145'
    },
    {
      id: 'AUD-9937',
      timestamp: '2026-09-06 10:50:11',
      operator: 'Amitabh Sen (IT-SYS-01)',
      action: 'AI Model Inference Threshold Updated',
      target: 'YOLOv10x Intrusion Sensitivity updated to 75%',
      ip: '10.14.0.12',
      hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }
  ]
};
