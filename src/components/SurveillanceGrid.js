export function renderSurveillanceGrid(cameras, currentTimeStr = '11:30:45 AM') {
  return `
    <div class="surveillance-panel">
      <div class="panel-header">
        <div class="panel-header-left">
          <span class="panel-title">Live Surveillance</span>
        </div>

        <div class="panel-header-controls">
          <button class="feed-header-btn" id="btn-grid-view" title="Toggle Grid View">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="7" height="7" x="3" y="3" rx="1"></rect>
              <rect width="7" height="7" x="14" y="3" rx="1"></rect>
              <rect width="7" height="7" x="14" y="14" rx="1"></rect>
              <rect width="7" height="7" x="3" y="14" rx="1"></rect>
            </svg>
            Grid View
          </button>

          <button class="feed-header-btn" id="btn-fullscreen-matrix" title="Full Screen Matrix">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
            Full Screen
          </button>
        </div>
      </div>

      <div class="camera-matrix" id="camera-matrix-container">
        ${cameras.map((cam, idx) => {
          const detectionText = idx === 0 ? '2 detections' : '1 detection';
          return `
            <div 
              class="camera-feed-card ${cam.alertLevel === 'critical' ? 'breach-alert' : ''}" 
              data-camera-id="${cam.id}" 
              title="Click to expand ${cam.name}"
            >
              <img 
                src="${cam.image}" 
                alt="${cam.name}" 
                class="camera-feed-img" 
                loading="eager" 
              />

              <!-- Top Overlay: Live Tag & Time -->
              <div class="feed-overlay-top">
                <div class="camera-title-badge">
                  <span class="dot-live"></span>
                  <span>LIVE</span>
                  <span style="margin-left: 4px; font-weight: 500;">${cam.name}</span>
                </div>
                <div class="camera-time-badge live-clock-tick">
                  <span class="red-dot"></span>
                  ${currentTimeStr}
                </div>
              </div>

              <!-- Bottom Overlay: Detection Count & Dropdown Chevron -->
              <div class="feed-overlay-bottom">
                <div class="camera-detection-pill">
                  <span class="det-dot"></span>
                  <span>${detectionText}</span>
                </div>
                <button class="camera-dropdown-btn" data-cam-id="${cam.id}" title="Camera Options">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>

              <!-- Hover Quick Action Buttons -->
              <div class="camera-feed-actions">
                <button class="camera-action-btn action-expand-cam" data-cam-id="${cam.id}" title="Expand / PTZ controls">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                </button>
                <button class="camera-action-btn action-snapshot-cam" data-cam-id="${cam.id}" title="Capture Frame Snapshot">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
