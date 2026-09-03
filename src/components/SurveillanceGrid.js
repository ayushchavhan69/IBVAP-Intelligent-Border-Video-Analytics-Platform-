export function renderSurveillanceGrid(cameras, currentTimeStr = '11:30:45 AM') {
  return `
    <div class="surveillance-panel">
      <div class="panel-header">
        <div class="panel-header-left">
          <span class="panel-title">Live Surveillance</span>
          <span class="badge badge-live">
            <span class="live-dot"></span>
            LIVE
          </span>
        </div>

        <div class="panel-header-controls">
          <button class="btn-icon active" id="grid-mode-2x2" title="2x2 Grid View">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="7" height="7" x="3" y="3" rx="1"></rect>
              <rect width="7" height="7" x="14" y="3" rx="1"></rect>
              <rect width="7" height="7" x="14" y="14" rx="1"></rect>
              <rect width="7" height="7" x="3" y="14" rx="1"></rect>
            </svg>
          </button>
          <button class="btn-icon" id="grid-mode-focus" title="Focus Single Camera View">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
          <button class="btn-tactical" id="btn-fullscreen-matrix" title="Full Screen Matrix">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        ${cameras.map(cam => `
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

            <!-- Top Overlay Hardware Info -->
            <div class="feed-overlay-top">
              <div class="camera-title-pill">
                <span class="dot"></span>
                <span>${cam.name}</span>
              </div>
              <div class="camera-time-pill live-clock-tick">
                ${currentTimeStr}
              </div>
            </div>

            <!-- Hover Quick Action Buttons -->
            <div class="camera-feed-actions">
              <button class="camera-action-btn action-expand-cam" data-cam-id="${cam.id}" title="Expand / PTZ controls">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </button>
              <button class="camera-action-btn action-snapshot-cam" data-cam-id="${cam.id}" title="Capture Frame Snapshot">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
