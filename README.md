# IBVAP – Intelligent Border Video Analytics Platform

> **SIH Problem Statement**: SIH26187 – AI-Based Intelligent Video Analytics Platform for Border Surveillance using Existing CCTV Infrastructure  
> **Organization**: Ministry of Home Affairs, Government of India (Border Security Force - BSF)  
> **Track**: Software / Smart Automation  

---

## 🎯 Overview

**IBVAP (Intelligent Border Video Analytics Platform)** transforms conventional IP-based CCTV infrastructure into an intelligent, software-defined surveillance network capable of real-time multi-stream video analysis, automated anomaly triage, and military-grade situational awareness.

Operating in a dark-first **Tactical Glassmorphism** mission-control interface, IBVAP reduces operator fatigue and automates threat detection across Border Outposts (BOPs), check posts, smart perimeter fence lines, and remote patrol corridors.

---

## ⚡ Key Features

- **Live Surveillance Matrix (2x2 & Focus Modes)**:
  - Ingests multiple RTSP camera streams simultaneously.
  - Synchronized real-time digital hardware clocks.
  - Real-time AI bounding box overlays:
    - `Person 95%` (BOP Alpha - North Gate)
    - `Vehicle 97%` (Check Post - Road 32)
    - `Intrusion 93%` (BOP Alpha - East Fence) with pulsating critical threat halo
    - `Truck 96%` (Border Road - Sector 7)
- **Real-Time Alert Triage & Evidence Investigation**:
  - Severity-graded incident stream: *Critical*, *High*, *Medium*, and *ANPR Intelligence*.
  - Evidence preview cards with forensic timestamps.
  - Interactive Incident Modal with one-click actions: *Acknowledge Alert*, *Dispatch QRF Patrol Unit*, *Dismiss False Alarm*, and *Export Evidence*.
- **Tactical Telemetry Strip**:
  - Total Persons Detected (`1,246`, +12%)
  - Total Vehicles Detected (`342`, +8%)
  - Known Faces Matched (`18`, +5%)
  - ANPR Detections (`128`, +15%)
  - Active Alerts (`7`)
- **GIS Tactical Minimap**:
  - Live spatial situational awareness with coordinate beacon pins for outposts, patrol lines, and active breach zones.
- **Analytics & Health Strip**:
  - **Events by Type**: SVG Donut Chart (*Human 45%*, *Vehicle 25%*, *Intrusion 16%*, *ANPR 14%*).
  - **Events Over Time**: 24-hour glowing area curve tracking incident frequency peaks.
  - **Top Cameras by Activity**: Real-time activity progress bars for top outposts.
  - **System Health Gauges**: Live hardware diagnostics (*Cameras 98%*, *AI Engine 99%*, *Storage 92%*, *Network 97%*).
- **Tactical Audio Synthesizer**:
  - Low-latency synthesized radar blips and threat warning chimes built via Web Audio API (zero external audio dependencies).

---

## 🛠️ Technology Stack

- **Core**: HTML5, Modern Modular JavaScript (ES6 Modules)
- **Styling**: Vanilla CSS Design System with CSS Custom Properties / Tokens (`tokens.css`, `main.css`, `dashboard.css`, `modals.css`)
- **Build Tool**: Vite (Lightning-fast HMR and bundle compilation)
- **Typography**: Google Fonts Inter & JetBrains Mono

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/ayushchavhan69/IBVAP-Intelligent-Border-Video-Analytics-Platform-.git
cd IBVAP-Intelligent-Border-Video-Analytics-Platform-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📄 License

Developed for Smart India Hackathon (SIH26187). All rights reserved.
