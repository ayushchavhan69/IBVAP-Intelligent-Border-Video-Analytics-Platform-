export const initialSurveillanceData = {
  stats: {
    persons: { count: '1,246', change: '+12%', label: 'Total Persons Detected', color: 'blue' },
    vehicles: { count: '342', change: '+8%', label: 'Total Vehicles Detected', color: 'green' },
    faces: { count: '18', change: '+5%', label: 'Known Faces Matched', color: 'amber' },
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
      image: '/assets/cam1.jpg',
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
      image: '/assets/cam2.jpg',
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
      image: '/assets/cam3.jpg',
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
      image: '/assets/cam4.jpg',
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
      thumbnail: '/assets/alert1.jpg',
      details: 'Automated tripwire breach detected. Unidentified male individual approached security perimeter fence from zero line. Track duration: 14s.',
      actionTaken: 'Pending Operator Triage'
    },
    {
      id: 'alert-2',
      title: 'Unknown Face Detected',
      location: 'Check Post - Road 32',
      time: '11:26:18 AM',
      type: 'high',
      thumbnail: '/assets/alert2.jpg',
      details: 'Facial recognition model captured biometric signature with zero match in local resident or authorized personnel database.',
      actionTaken: 'Flagged for Gate Inspection'
    },
    {
      id: 'alert-3',
      title: 'ANPR Hit - Watchlist',
      location: 'PB10MF1234',
      time: '11:24:02 AM',
      type: 'intel',
      thumbnail: '/assets/alert3.jpg',
      details: 'Vehicle Registration PB10MF1234 matched National Border Intercept Watchlist for suspected cross-border contraband logistics.',
      actionTaken: 'Checkpost barrier lock engaged'
    },
    {
      id: 'alert-4',
      title: 'Loitering Detected',
      location: 'Border Road - Sector 7',
      time: '11:22:47 AM',
      type: 'medium',
      thumbnail: '/assets/alert4.jpg',
      details: 'Two subjects observed stationary within 15 meters of military supply lane for over 180 seconds without assigned permit.',
      actionTaken: 'Auditory warning broadcast'
    }
  ],

  analytics: {
    donut: [
      { label: 'Human Detected', count: '1,246', pct: '45%', color: '#3B82F6' },
      { label: 'Vehicle Detected', count: '342', pct: '25%', color: '#10B981' },
      { label: 'Intrusion', count: '128', pct: '16%', color: '#EF4444' },
      { label: 'ANPR', count: '128', pct: '14%', color: '#A855F7' }
    ],
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
      status: 'All Systems Operational',
      metrics: [
        { name: 'Cameras', val: '98%', status: 'good' },
        { name: 'AI Engine', val: '99%', status: 'good' },
        { name: 'Storage', val: '92%', status: 'good' },
        { name: 'Network', val: '97%', status: 'good' }
      ]
    }
  }
};
