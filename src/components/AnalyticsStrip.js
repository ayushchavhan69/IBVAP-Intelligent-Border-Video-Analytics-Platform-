export function renderAnalyticsStrip(analytics) {
  return `
    <div class="bottom-analytics-grid">
      <!-- 1. Events by Type (Today) -->
      <div class="analytics-panel">
        <span class="analytics-panel-title">Events by Type (Today)</span>
        <div class="donut-container">
          <div class="donut-svg-wrapper">
            <svg viewBox="0 0 42 42" class="donut-svg" width="86" height="86">
              <!-- Background Ring -->
              <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#172238" stroke-width="6"></circle>
              
              <!-- Human 45% (offset 0) -->
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#3B82F6" stroke-width="6" stroke-dasharray="45 55" stroke-dashoffset="25"></circle>

              <!-- Vehicle 25% (offset 45) -->
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10B981" stroke-width="6" stroke-dasharray="25 75" stroke-dashoffset="80"></circle>

              <!-- Intrusion 16% (offset 70) -->
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#EF4444" stroke-width="6" stroke-dasharray="16 84" stroke-dashoffset="55"></circle>

              <!-- ANPR 14% (offset 86) -->
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#A855F7" stroke-width="6" stroke-dasharray="14 86" stroke-dashoffset="39"></circle>
            </svg>
          </div>

          <div class="donut-legend">
            ${analytics.donut.map(item => `
              <div class="legend-item">
                <span class="legend-color-dot" style="background: ${item.color};"></span>
                <span>${item.label}</span>
                <span class="legend-bold">${item.count} (${item.pct})</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 2. Events Over Time (Today) -->
      <div class="analytics-panel">
        <span class="analytics-panel-title">Events Over Time (Today)</span>
        <div class="area-chart-container">
          <div style="display: flex; gap: 8px; flex: 1; align-items: flex-end;">
            <div style="display: flex; flex-direction: column; justify-content: space-between; height: 75px; font-size: 9px; font-family: var(--font-mono); color: var(--text-tertiary); text-align: right; padding-right: 4px;">
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>

            <div class="chart-svg-container" style="flex: 1;">
              <svg viewBox="0 0 500 120" preserveAspectRatio="none" style="width: 100%; height: 75px; overflow: visible;">
                <defs>
                  <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.45" />
                    <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.0" />
                  </linearGradient>
                </defs>

                <!-- Grid Guide lines -->
                <line x1="0" y1="20" x2="500" y2="20" stroke="#1E293B" stroke-width="0.8" stroke-dasharray="3 3"/>
                <line x1="0" y1="50" x2="500" y2="50" stroke="#1E293B" stroke-width="0.8" stroke-dasharray="3 3"/>
                <line x1="0" y1="80" x2="500" y2="80" stroke="#1E293B" stroke-width="0.8" stroke-dasharray="3 3"/>
                <line x1="0" y1="110" x2="500" y2="110" stroke="#1E293B" stroke-width="0.8" />

                <!-- Filled Area -->
                <path 
                  d="M0,110 L0,100 Q40,95 80,75 T160,50 T240,40 T270,18 T310,25 T350,60 T400,65 T450,90 T500,105 L500,110 Z" 
                  fill="url(#area-grad)" 
                />

                <!-- Stroke Line -->
                <path 
                  d="M0,100 Q40,95 80,75 T160,50 T240,40 T270,18 T310,25 T350,60 T400,65 T450,90 T500,105" 
                  fill="none" 
                  stroke="#38BDF8" 
                  stroke-width="2.5"
                  filter="drop-shadow(0 0 6px #0284c7)"
                />

                <!-- Peak dot -->
                <circle cx="270" cy="18" r="3.5" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.5" />
              </svg>
            </div>
          </div>

          <div class="chart-axis-labels" style="padding-left: 28px;">
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>24:00</span>
          </div>
        </div>
      </div>

      <!-- 3. Top Cameras by Activity -->
      <div class="analytics-panel">
        <span class="analytics-panel-title">Top Cameras by Activity</span>
        <div class="camera-activity-list">
          ${analytics.topCameras.map(cam => `
            <div class="cam-activity-row">
              <span class="cam-activity-name">${cam.rank}. ${cam.name}</span>
              <div class="cam-activity-bar-wrap">
                <div class="cam-activity-bar-fill" style="width: ${cam.pct}%;"></div>
              </div>
              <span class="cam-activity-count">${cam.count}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 4. System Health -->
      <div class="analytics-panel">
        <span class="analytics-panel-title">System Health</span>
        
        <div class="health-status-header">
          <svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 12 11 14 15 10"></polyline>
          </svg>
          <span class="health-status-text">All Systems Operational</span>
        </div>

        <div class="health-metrics-grid">
          <!-- Cameras -->
          <div class="health-metric-box">
            <svg class="health-metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect width="14" height="12" x="1" y="6" rx="2"></rect>
            </svg>
            <span class="health-metric-name">Cameras</span>
            <span class="health-metric-pct">98%</span>
          </div>

          <!-- AI Engine -->
          <div class="health-metric-box">
            <svg class="health-metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <path d="M9 9h6v6H9z"></path>
              <path d="M9 1v2m6-2v2m-6 18v2m6-2v2M1 9h2m-2 6h2m18-6h2m-2 6h2"></path>
            </svg>
            <span class="health-metric-name">AI Engine</span>
            <span class="health-metric-pct">99%</span>
          </div>

          <!-- Storage -->
          <div class="health-metric-box">
            <svg class="health-metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 6h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path>
              <path d="M4 14h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"></path>
              <line x1="6" y1="9" x2="6.01" y2="9"></line>
              <line x1="6" y1="17" x2="6.01" y2="17"></line>
            </svg>
            <span class="health-metric-name">Storage</span>
            <span class="health-metric-pct">92%</span>
          </div>

          <!-- Network -->
          <div class="health-metric-box">
            <svg class="health-metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h.01"></path>
              <path d="M8.5 16.429a5 5 0 0 1 7 0"></path>
              <path d="M5 12.859a10 10 0 0 1 14 0"></path>
              <path d="M1.5 9.288a15 15 0 0 1 21 0"></path>
            </svg>
            <span class="health-metric-name">Network</span>
            <span class="health-metric-pct">97%</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
