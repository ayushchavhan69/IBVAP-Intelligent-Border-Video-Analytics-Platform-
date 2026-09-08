import './styles/tokens.css';
import './styles/main.css';
import './styles/dashboard.css';
import './styles/modals.css';

import { initialSurveillanceData } from './data/surveillanceData.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderHeader, getActiveOperator } from './components/Header.js';
import { renderStatCards } from './components/StatCards.js';
import { renderSurveillanceGrid } from './components/SurveillanceGrid.js';
import { renderAlertsPanel } from './components/AlertsPanel.js';
import { renderMinimap } from './components/Minimap.js';
import { renderAnalyticsStrip } from './components/AnalyticsStrip.js';
import { renderIncidentModal } from './components/IncidentModal.js';
import { renderCameraDetailModal } from './components/CameraDetailModal.js';
import { renderNotificationDrawer } from './components/NotificationDrawer.js';
import { renderLiveViewScreen, renderEventsScreen, renderFullMapScreen } from './components/ViewTemplates.js';
import { playRadarBeep, playAlertTone, toggleSound, isSoundEnabled } from './utils/audio.js';

// Application State
const state = {
  activeView: 'Dashboard',
  sidebarCollapsed: false,
  gridMode: '2x2', // '2x2' or 'focus'
  selectedCameraId: 'cam-1',
  activeAlertId: 'alert-1',
  notifDrawerOpen: false,
  thermalMode: false,
  data: initialSurveillanceData,
  filteredCameras: [...initialSurveillanceData.cameras]
};

// Real-time clock formatter
function getFormattedTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const formattedHours = String(hours).padStart(2, '0');
  return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

// Initial Render
function initApp() {
  const app = document.getElementById('app');
  if (!app) return;

  renderFullUI();
  setupGlobalClock();
  attachEventListeners();
  connectTelemetryWebSocket();
}

// Real-Time WebSocket Telemetry Receiver
function connectTelemetryWebSocket() {
  const wsUrl = `ws://${window.location.hostname || 'localhost'}:8000/ws/telemetry`;
  let ws;

  try {
    ws = new WebSocket(wsUrl);
  } catch (err) {
    console.warn('[IBVAP] WebSocket connection failed:', err);
    return;
  }

  ws.onopen = () => {
    console.log('[IBVAP] Connected to Live AI Telemetry Engine over WebSocket.');
    showToast('AI Telemetry Stream', 'Connected to YOLOv8 Edge Inference Hub');
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.stats) {
        state.data.stats = msg.stats;
        // Dynamically update stat cards without re-rendering the whole page
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 5) {
          const vals = [msg.stats.persons?.count, msg.stats.vehicles?.count, msg.stats.faces?.count, msg.stats.anpr?.count, msg.stats.alerts?.count];
          statCards.forEach((card, idx) => {
            const numEl = card.querySelector('.stat-value');
            if (numEl && vals[idx]) numEl.textContent = vals[idx];
          });
        }
      }

      // Check if any camera is in critical breach status
      if (msg.cameras) {
        msg.cameras.forEach(cam => {
          const card = document.querySelector(`.camera-feed-card[data-camera-id="${cam.id}"]`);
          if (card) {
            if (cam.is_breached) {
              if (!card.classList.contains('breach-alert')) {
                card.classList.add('breach-alert');
                playAlertTone();
              }
            } else {
              card.classList.remove('breach-alert');
            }
          }
        });
      }
    } catch (e) {
      // Ignored non-json packet
    }
  };

  ws.onclose = () => {
    console.log('[IBVAP] Telemetry WebSocket disconnected. Reconnecting in 3s...');
    setTimeout(connectTelemetryWebSocket, 3000);
  };
}

function renderFullUI() {
  const app = document.getElementById('app');
  const currentTime = getFormattedTime();

  app.innerHTML = `
    ${renderSidebar(state.activeView)}

    <div class="main-wrapper">
      ${renderHeader(state.activeView, state.data.cameras.length)}
      ${renderNotificationDrawer(state.data.alerts)}

      <main id="main-content-area">
        ${renderCurrentViewContent(currentTime)}
      </main>

      <footer class="footer">
        © 2025 IB<span style="color: #22C55E; font-weight: 700;">V</span>AP - Intelligent Border Video Analytics Platform. All rights reserved.
      </footer>
    </div>

    <!-- Modals Container -->
    ${renderIncidentModal()}
    ${renderCameraDetailModal()}
    <div class="toast-container" id="toast-container"></div>
  `;

  if (state.sidebarCollapsed) {
    const sidebar = document.getElementById('main-sidebar');
    if (sidebar) sidebar.classList.add('collapsed');
  }
}

function renderCurrentViewContent(currentTime) {
  if (state.activeView === 'Live View') {
    return renderLiveViewScreen(state.data.cameras);
  }
  if (state.activeView === 'Events & Alerts') {
    return renderEventsScreen(state.data.alerts);
  }
  if (state.activeView === 'Map View') {
    return renderFullMapScreen();
  }

  // Default Dashboard View
  return `
    <div class="dashboard-content">
      <!-- 1. Top Stat Cards -->
      ${renderStatCards(state.data.stats)}

      <!-- 2. Middle Row: Live Feeds & Right Rail -->
      <div class="middle-grid">
        <div id="surveillance-section">
          ${renderSurveillanceGrid(state.filteredCameras, currentTime)}
        </div>

        <div class="right-panel-column">
          ${renderAlertsPanel(state.data.alerts)}
          ${renderMinimap()}
        </div>
      </div>

      <!-- 3. Bottom Row: Analytics Strip -->
      ${renderAnalyticsStrip(state.data.analytics)}
    </div>
  `;
}

// Global Hardware Clock Sync
function setupGlobalClock() {
  setInterval(() => {
    const timeStr = getFormattedTime();
    const clockElements = document.querySelectorAll('.live-clock-tick');
    clockElements.forEach(el => {
      el.textContent = timeStr;
    });
  }, 1000);
}

// Show Tactical Toast Notification
function showToast(title, message, isCritical = false) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${isCritical ? 'critical' : ''}`;
  toast.innerHTML = `
    <div style="color: ${isCritical ? '#EF4444' : '#3B82F6'};">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    </div>
    <div style="display: flex; flex-direction: column;">
      <span style="font-weight: 600; font-size: 12px; color: var(--text-primary);">${title}</span>
      <span style="font-size: 11px; color: var(--text-secondary);">${message}</span>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Event Listeners Binding
function attachEventListeners() {
  // Navigation tabs
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const label = item.querySelector('.nav-item-label')?.textContent || item.getAttribute('data-view');
      state.activeView = label;
      playRadarBeep();
      renderFullUI();
      attachEventListeners();
    });
  });

  // Sidebar Collapse Toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      const sidebar = document.getElementById('main-sidebar');
      if (sidebar) {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
      }
    });
  }

  // Camera Filter Select
  const camFilter = document.getElementById('camera-filter-select');
  if (camFilter) {
    camFilter.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (selected === 'all') {
        state.filteredCameras = [...state.data.cameras];
      } else {
        state.filteredCameras = state.data.cameras.filter(c => c.id === selected);
      }
      playRadarBeep();
      const survSection = document.getElementById('surveillance-section');
      if (survSection) {
        survSection.innerHTML = renderSurveillanceGrid(state.filteredCameras, getFormattedTime());
        bindCameraInteractions();
      }
    });
  }

  // Global Search Input
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      if (!query) {
        state.filteredCameras = [...state.data.cameras];
      } else {
        state.filteredCameras = state.data.cameras.filter(c => 
          c.name.toLowerCase().includes(query) || 
          c.location.toLowerCase().includes(query)
        );
      }
      const survSection = document.getElementById('surveillance-section');
      if (survSection) {
        survSection.innerHTML = renderSurveillanceGrid(state.filteredCameras, getFormattedTime());
        bindCameraInteractions();
      }
    });
  }

  // Notification Bell Toggle
  const notifBtn = document.getElementById('header-notif-btn');
  const drawer = document.getElementById('notification-drawer');
  if (notifBtn && drawer) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.notifDrawerOpen = !state.notifDrawerOpen;
      drawer.classList.toggle('active', state.notifDrawerOpen);
      if (state.notifDrawerOpen) playRadarBeep();
    });
  }

  document.addEventListener('click', (e) => {
    if (drawer && state.notifDrawerOpen && !drawer.contains(e.target) && e.target !== notifBtn) {
      state.notifDrawerOpen = false;
      drawer.classList.remove('active');
    }
  });

  // Operator Profile Pill Dropdown Toggle
  const operatorPill = document.getElementById('operator-profile-pill');
  const operatorDropdown = document.getElementById('operator-dropdown-menu');
  if (operatorPill && operatorDropdown) {
    operatorPill.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = operatorDropdown.classList.toggle('active');
      operatorPill.classList.toggle('active', isOpen);
      operatorPill.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) playRadarBeep();
    });

    document.addEventListener('click', (e) => {
      if (operatorDropdown.classList.contains('active') && !operatorPill.contains(e.target)) {
        operatorDropdown.classList.remove('active');
        operatorPill.classList.remove('active');
        operatorPill.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && operatorDropdown.classList.contains('active')) {
        operatorDropdown.classList.remove('active');
        operatorPill.classList.remove('active');
        operatorPill.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Operator Sign Out / Switch Session
  const signoutBtn = document.getElementById('operator-signout-btn');
  if (signoutBtn) {
    signoutBtn.addEventListener('click', () => {
      try {
        localStorage.removeItem('ibvap_session');
        localStorage.removeItem('ibvap_active_operator');
      } catch (e) { }
    });
  }

  // Audio Mute/Unmute Toggle
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isEnabled = toggleSound();
      showToast('Audio Telemetry', isEnabled ? 'Alert chimes ENABLED' : 'Alert chimes MUTED');
      if (isEnabled) playRadarBeep();
    });
  }

  // View All Alerts Links
  const viewAlertsLink = document.getElementById('btn-view-all-alerts');
  const viewActiveAlerts = document.getElementById('view-active-alerts-link');
  const statViewAlerts = document.getElementById('stat-view-alerts');
  [viewAlertsLink, viewActiveAlerts, statViewAlerts].forEach(el => {
    if (el) {
      el.addEventListener('click', () => {
        state.activeView = 'Events & Alerts';
        playRadarBeep();
        renderFullUI();
        attachEventListeners();
      });
    }
  });

  // Emergency Button Handler
  const emergencyBtn = document.getElementById('btn-emergency-action');
  if (emergencyBtn) {
    emergencyBtn.addEventListener('click', () => {
      playAlertTone();
      showToast('PERIMETER LOCKDOWN INITIATED', 'Code Red triggered. Sector barriers engaging.', true);
    });
  }

  // Header Fullscreen Button
  const fsBtn = document.getElementById('header-fullscreen-btn');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        showToast('Display Mode', 'Entered Fullscreen Mode');
      } else {
        document.exitFullscreen().catch(() => {});
        showToast('Display Mode', 'Exited Fullscreen Mode');
      }
    });
  }

  // View Full Map Links & Minimap Controls
  const viewMapLink = document.getElementById('btn-view-full-map');
  const minimapViewport = document.getElementById('minimap-viewport');
  if (viewMapLink) {
    viewMapLink.addEventListener('click', () => {
      state.activeView = 'Map View';
      playRadarBeep();
      renderFullUI();
      attachEventListeners();
    });
  }

  const zoomIn = document.getElementById('map-zoom-in');
  const zoomOut = document.getElementById('map-zoom-out');
  const recenter = document.getElementById('map-recenter');
  if (zoomIn) zoomIn.addEventListener('click', (e) => { e.stopPropagation(); showToast('GIS Map', 'Zoom Level: 14x'); });
  if (zoomOut) zoomOut.addEventListener('click', (e) => { e.stopPropagation(); showToast('GIS Map', 'Zoom Level: 10x'); });
  if (recenter) recenter.addEventListener('click', (e) => { e.stopPropagation(); showToast('GIS Map', 'Centered on BOP Alpha'); });

  // Incident Modal Handlers
  bindAlertInteractions();

  // Camera Interactions
  bindCameraInteractions();
}

function bindAlertInteractions() {
  const alertItems = document.querySelectorAll('.alert-item, .notification-drawer-item');
  const incidentModal = document.getElementById('incident-modal-overlay');
  const closeBtn = document.getElementById('modal-close-btn');

  alertItems.forEach(item => {
    item.addEventListener('click', () => {
      const alertId = item.getAttribute('data-alert-id') || item.getAttribute('data-notif-id');
      const alertObj = state.data.alerts.find(a => a.id === alertId) || state.data.alerts[0];

      // Populate Modal Fields
      document.getElementById('incident-modal-title').textContent = alertObj.title;
      document.getElementById('incident-type-cell').textContent = alertObj.title;
      document.getElementById('incident-location-cell').textContent = alertObj.location;
      document.getElementById('incident-time-cell').textContent = `${alertObj.time} IST`;
      document.getElementById('incident-description-p').textContent = alertObj.details;
      document.getElementById('incident-evidence-img').src = alertObj.thumbnail;

      const badge = document.getElementById('incident-badge');
      if (badge) {
        badge.className = `badge ${alertObj.type === 'critical' ? 'badge-alert' : 'badge-live'}`;
        badge.innerHTML = `<span class="live-dot"></span> ${alertObj.type.toUpperCase()} ALERT`;
      }

      playAlertTone();
      if (incidentModal) incidentModal.classList.add('active');
    });
  });

  if (closeBtn && incidentModal) {
    closeBtn.addEventListener('click', () => {
      incidentModal.classList.remove('active');
    });
  }

  if (incidentModal) {
    incidentModal.addEventListener('click', (e) => {
      if (e.target === incidentModal) {
        incidentModal.classList.remove('active');
      }
    });
  }

  // Modal Action Buttons (Tied to SQLite Audit Trail)
  const ackBtn = document.getElementById('btn-ack-alert');
  if (ackBtn) {
    ackBtn.addEventListener('click', async () => {
      const op = typeof getActiveOperator === 'function' ? getActiveOperator() : { name: 'Ayush Chavhan', unit: 'BSF 142 Bn' };
      showToast('Incident Acknowledged', `Logged in audit registry by ${op.name} (${op.unit})`);
      playRadarBeep();
      try {
        await fetch(`http://${window.location.hostname || 'localhost'}:8000/api/alerts/${state.activeAlertId || 'alert-1'}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'ACKNOWLEDGED', operator: `${op.name} (${op.unit})` })
        });
      } catch (e) { console.warn(e); }
      if (incidentModal) incidentModal.classList.remove('active');
    });
  }

  const dispatchBtn = document.getElementById('btn-dispatch-qrf');
  if (dispatchBtn) {
    dispatchBtn.addEventListener('click', async () => {
      showToast('QRF Patrol Dispatched', 'Quick Reaction Force Unit 3 dispatched to East Perimeter', true);
      playAlertTone();
      try {
        await fetch(`http://${window.location.hostname || 'localhost'}:8000/api/alerts/${state.activeAlertId || 'alert-1'}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'QRF_PATROL_DISPATCHED', operator: 'Commandant V. S. Chauhan (BSF-0012)' })
        });
      } catch (e) { console.warn(e); }
      if (incidentModal) incidentModal.classList.remove('active');
    });
  }

  const dismissBtn = document.getElementById('btn-dismiss-alert');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', async () => {
      showToast('Alert Dismissed', 'Marked as benign activity in surveillance logs');
      try {
        await fetch(`http://${window.location.hostname || 'localhost'}:8000/api/alerts/${state.activeAlertId || 'alert-1'}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'DISMISSED_FALSE_ALARM', operator: 'Sub-Inspector Pooja Verma' })
        });
      } catch (e) { console.warn(e); }
      if (incidentModal) incidentModal.classList.remove('active');
    });
  }

  const exportBtn = document.getElementById('btn-export-evidence');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      showToast('Evidence Exported', '1080p MP4 clip with forensic hash saved');
    });
  }
}

function bindCameraInteractions() {
  const camCards = document.querySelectorAll('.camera-feed-card, .action-expand-cam');
  const camModal = document.getElementById('camera-modal-overlay');
  const camModalClose = document.getElementById('cam-modal-close-btn');

  camCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const camId = card.getAttribute('data-camera-id') || card.getAttribute('data-cam-id');
      const camObj = state.data.cameras.find(c => c.id === camId) || state.data.cameras[0];

      document.getElementById('cam-modal-title').textContent = `${camObj.name} • ${camObj.location}`;
      document.getElementById('cam-modal-feed-img').src = camObj.image;

      playRadarBeep();
      if (camModal) camModal.classList.add('active');
    });
  });

  if (camModalClose && camModal) {
    camModalClose.addEventListener('click', () => {
      camModal.classList.remove('active');
    });
  }

  if (camModal) {
    camModal.addEventListener('click', (e) => {
      if (e.target === camModal) {
        camModal.classList.remove('active');
      }
    });
  }

  // Full Screen matrix button
  const fullMatrixBtn = document.getElementById('btn-fullscreen-matrix');
  if (fullMatrixBtn) {
    fullMatrixBtn.addEventListener('click', () => {
      const container = document.getElementById('camera-matrix-container');
      if (!document.fullscreenElement && container) {
        container.requestFullscreen().catch(err => {
          showToast('Fullscreen Mode', 'Expanded surveillance mode engaged');
        });
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    });
  }

  // PTZ Buttons
  ['ptz-left', 'ptz-right', 'ptz-up', 'ptz-down', 'ptz-zoom-in', 'ptz-zoom-out'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        playRadarBeep();
        showToast('PTZ Gimbal', `Adjusting axis: ${id.replace('ptz-', '').toUpperCase()}`);
      });
    }
  });

  // Thermal toggle
  const thermalBtn = document.getElementById('btn-thermal-toggle');
  if (thermalBtn) {
    thermalBtn.addEventListener('click', () => {
      state.thermalMode = !state.thermalMode;
      const img = document.getElementById('cam-modal-feed-img');
      if (img) {
        img.style.filter = state.thermalMode 
          ? 'invert(1) hue-rotate(180deg) saturate(2) contrast(1.3)' 
          : 'none';
      }
      showToast('Sensor Mode', state.thermalMode ? 'IR Thermal Spectrum Enabled' : 'Standard Optical Sensor Enabled');
      playRadarBeep();
    });
  }

  // Snapshot
  const snapshotBtn = document.getElementById('btn-modal-snapshot');
  if (snapshotBtn) {
    snapshotBtn.addEventListener('click', () => {
      showToast('Frame Captured', 'High-res RAW frame saved to local forensic buffer');
      playRadarBeep();
    });
  }
}

// Start Application
window.addEventListener('DOMContentLoaded', initApp);
