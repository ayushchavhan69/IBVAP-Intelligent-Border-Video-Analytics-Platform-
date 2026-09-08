# IBVAP – Intelligent Border Video Analytics Platform

[![Smart India Hackathon 2024](https://img.shields.io/badge/SIH-2024-orange.svg)](https://www.sih.gov.in/)
[![Problem Statement](https://img.shields.io/badge/Problem%20ID-SIH26187-blue.svg)](https://www.sih.gov.in/)
[![Organization](https://img.shields.io/badge/Ministry-Home%20Affairs%20%7C%20BSF-green.svg)](https://bsf.gov.in/)
[![Security](https://img.shields.io/badge/Security-AES--256--GCM-teal.svg)](#-cryptographic-security-architecture)
[![Vite](https://img.shields.io/badge/Build-Vite%206-purple.svg)](https://vitejs.dev/)

> **SIH Problem Statement**: SIH26187 – AI-Based Intelligent Video Analytics Platform for Border Surveillance using Existing CCTV Infrastructure  
> **Organization**: Ministry of Home Affairs, Government of India (Border Security Force - BSF)  
> **Track**: Software / Smart Automation  

---

## 🎯 Overview

**IBVAP (Intelligent Border Video Analytics Platform)** transforms conventional IP-based CCTV infrastructure into an intelligent, software-defined surveillance network capable of real-time multi-stream video analysis, automated anomaly triage, and military-grade situational awareness.

Operating in a dark-first **Tactical Glassmorphism** mission-control interface, IBVAP reduces operator fatigue and automates threat detection across Border Outposts (BOPs), check posts, smart perimeter fence lines, and remote patrol corridors.

---

## ⚡ Key System Modules

### 1. 🖥️ Tactical Surveillance Command Center (`index.html`)
- **Live Surveillance Matrix (2x2 & Focus Modes)**:
  - Ingests multiple video streams simultaneously with real-time digital hardware clocks.
  - Real-time AI bounding box overlays:
    - `Person 95%` (BOP Alpha - North Gate)
    - `Vehicle 97%` (Check Post - Road 32)
    - `Intrusion 93%` (BOP Alpha - East Fence) with pulsating critical threat halo
    - `Truck 96%` (Border Road - Sector 7)
- **Real-Time Alert Triage & Evidence Investigation**:
  - Severity-graded incident stream: *Critical Intrusion*, *High Warning*, *Caution*, and *ANPR Intelligence*.
  - Forensic evidence preview cards with timestamps.
  - Interactive **Incident Investigation Modal** with one-click tactical actions: *Acknowledge Alert*, *Dispatch QRF Patrol Unit*, *Dismiss False Alarm*, and *Export Evidence*.
- **Tactical Telemetry Strip**:
  - Total Persons Detected (`1,246`, +12%)
  - Total Vehicles Detected (`342`, +8%)
  - Known Faces Matched (`18`, +5%)
  - ANPR Detections (`128`, +15%)
  - Active Alerts (`7`)
- **GIS Tactical Minimap**:
  - Spatial situational awareness with glowing radar beacon coordinates for outposts, patrol routes, and perimeter breach zones.
- **Analytics & Health Diagnostics Strip**:
  - **Events by Type**: Precision SVG Donut Chart (*Human 45%*, *Vehicle 25%*, *Intrusion 16%*, *ANPR 14%*).
  - **Events Over Time**: 24-hour luminous area curve chart tracking threat peak timelines.
  - **Top Cameras by Activity**: Real-time activity progress telemetry for high-traffic sectors.
  - **System Health Diagnostics**: Live operational gauges (*Cameras 98%*, *AI Engine 99%*, *Storage 92%*, *Network 97%*).
- **Tactical Audio Synthesizer**:
  - Low-latency synthesized radar blips and threat warning chimes via Web Audio API (zero external audio dependencies).

---

### 2. 🔐 Defense-Grade Authentication Portal (`signin.html`)
- **Encrypted Sign-In Surface**:
  - Clean tactical login cards with embedded field iconography and precision hairline borders.
  - Anti-autofill protection ensuring inputs default to completely clean, empty states on every page load.
- **Direct Administrator Access Gateway**:
  - Connects prospective operators directly to the System Administrator (`ayushchavhan79@gmail.com`).
  - Automatically formats an official access credential request email and copies the address to the clipboard.

---

### 3. 🛡️ 4-Stage Account Recovery & Encrypted Vault Update
- **Stage 1 (Identify)**: Validates authorized Gmail addresses against the decrypted in-memory operator registry.
- **Stage 2 (Email-Only OTP Verification)**:
  - Dispatches a 6-digit cryptographic security code directly to the operator's authorized email via backend mailer and gateway relay.
  - **Zero Frontend Leakage**: The OTP is never displayed on the website UI.
  - Includes a 60-second live expiration timer with a pulsating radar dot and resend controls.
- **Stage 3 (Credential Reset)**:
  - Interactive **Password Strength Meter** (`Weak` → `Fair` → `Good` → `Strong`).
  - Hashes new passwords with salted SHA-256 and re-encrypts the entire credentials vault with AES-256-GCM.
- **Stage 4 (Clearance Confirmation)**:
  - Displays military clearance confirmation (`CLEARANCE VERIFIED • AES-256 RE-ENCRYPTED`) and returns the operator to the sign-in form.

---

## 🔒 Cryptographic Security Architecture

- **Zero Plaintext Storage**: Credentials, operator profiles, and sensitive metadata are never stored in plaintext.
- **AES-256-GCM Vault**: Encrypted in the browser via Web Crypto API with authenticated tags to prevent tampering.
- **PBKDF2 Key Derivation**: High-iteration key derivation from device-bound cryptographic salts.
- **Salted SHA-256 Password Hashes**: One-way cryptographic hashing for all stored credentials.

---

## 🌐 Multilingual Support (i18n)

IBVAP features instantaneous locale switching across **6 official languages**:
- **English** (en)
- **हिंदी** (Hindi)
- **मराठी** (Marathi)
- **اردو** (Urdu)
- **বাংলা** (Bengali)
- **ਪੰਜਾਬੀ** (Punjabi)

All interface titles, telemetry labels, alert dialogs, recovery steps, and toast notifications update seamlessly with 100% dictionary completeness.

---

## 📂 Project Structure

```
SIH/
├── index.html                  # Tactical Surveillance Command Center
├── signin.html                 # Defense-Grade Authentication & Recovery Portal
├── vite.config.js              # Multi-page build config & server OTP mailer middleware
├── package.json                # Project dependencies and build scripts
├── start_dashboard.bat         # 1-click Windows desktop launch script
│
├── src/
│   ├── main.js                 # Command Center initialization and state management
│   ├── signin.js               # Encrypted vault logic, OTP verification & i18n
│   │
│   ├── components/             # Reusable UI Modules
│   │   ├── AlertsPanel.js      # Alert triage and recent incidents feed
│   │   ├── AnalyticsStrip.js   # SVG Donut chart, area timeline curve & health meters
│   │   ├── CameraDetailModal.js# Camera feed focus and telemetry inspector
│   │   ├── Header.js           # Command header with search, filters and clock
│   │   ├── IncidentModal.js    # Investigation modal with QRF dispatch actions
│   │   ├── Minimap.js          # Tactical GIS spatial radar minimap
│   │   ├── NotificationDrawer.js# Global alerts notification drawer
│   │   ├── Sidebar.js          # 13 military navigation tabs & collapsing rail
│   │   ├── StatCards.js        # Top 5 detection and threat telemetry counters
│   │   ├── SurveillanceGrid.js # 2x2 multi-stream video matrix with threat halos
│   │   └── ViewTemplates.js    # Dedicated views (Live, Events, Analytics, Devices, etc.)
│   │
│   ├── data/
│   │   └── surveillanceData.js # Tactical camera streams, bounding boxes & mock data
│   │
│   ├── styles/
│   │   ├── tokens.css          # Design system tokens (Midnight navy surfaces, threat tiers)
│   │   ├── main.css            # Base typography, layout and core reset
│   │   ├── dashboard.css       # Command center grid, widgets and telemetry cards
│   │   ├── modals.css          # Investigation modal, focus inspect & alerts drawer
│   │   └── signin.css          # Authentication and 4-step recovery modal styles
│   │
│   └── utils/
│       └── audio.js            # Low-latency Web Audio API tactical radar synthesizer
│
└── public/
    └── assets/                 # Camera feeds, alert evidence crops & official emblems
```

---

## 🛠️ Technology Stack

- **Core Frontend**: HTML5, Modern Modular JavaScript (ES6 Modules)
- **Styling Architecture**: Vanilla CSS Design System with CSS Custom Properties / Design Tokens
- **Cryptographic Security**: Web Crypto API (SubtleCrypto: AES-256-GCM, PBKDF2, SHA-256)
- **Build Tool**: Vite 6 (Lightning-fast HMR, multi-page production bundling)
- **Backend Email Relay**: Nodemailer SMTP + FormSubmit Gateway API
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
Open **[http://localhost:5173/](http://localhost:5173/)** for the Surveillance Command Center or **[http://localhost:5173/signin.html](http://localhost:5173/signin.html)** for the Authentication Portal.

### 4. Build for Production
```bash
npm run build
```
Generates a fully optimized, static production bundle in `dist/` containing both `index.html` and `signin.html`.

---

## 👥 Authorized Personnel & Contact

- **System Administrator**: Ayush Chavhan
- **Email**: [ayushchavhan79@gmail.com](mailto:ayushchavhan79@gmail.com)
- **Organization**: Border Security Force (BSF) / Ministry of Home Affairs

---

## 📄 License

Developed for Smart India Hackathon (SIH26187). All rights reserved.
