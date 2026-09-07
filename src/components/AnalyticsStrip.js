export function renderAnalyticsStrip(analytics) {
  return `
    <div class="bottom-analytics-grid">
      <!-- 1. Events by Type (Today) -->
      <div class="analytics-panel">
        <span class="analytics-panel-title">Events by Type (Today)</span>
        <div class="donut-container">
          <div class="donut-svg-wrapper">
            <svg viewBox="0 0 42 42" class="donut-svg" width="90" height="90">
              <!-- Background Ring -->
              <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#F1F5F9" stroke-width="6"></circle>
              
              <!-- Human 45% (offset 0) -->
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#2563EB" stroke-width="6" stroke-dasharray="45 55" stroke-dashoffset="25"></circle>

              <!-- Vehicle 25% (offset 45) -->
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#16A34A" stroke-width="6" stroke-dasharray="25 75" stroke-dashoffset="80"></circle>

              <!-- Intrusion 16% (offset 70) -->
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#DC2626" stroke-width="6" stroke-dasharray="16 84" stroke-dashoffset="55"></circle>

              <!-- ANPR 14% (offset 86) -->
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#7C3AED" stroke-width="6" stroke-dasharray="14 86" stroke-dashoffset="39"></circle>
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
            <div style="display: flex; flex-direction: column; justify-content: space-between; height: 85px; font-size: 9.5px; font-family: var(--font-mono); color: var(--text-tertiary); text-align: right; padding-right: 4px;">
              <span>250</span>
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>

            <div class="chart-svg-container" style="flex: 1;">
              <svg viewBox="0 0 500 120" preserveAspectRatio="none" style="width: 100%; height: 85px; overflow: visible;">
                <defs>
                  <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#2563EB" stop-opacity="0.25" />
                    <stop offset="100%" stop-color="#2563EB" stop-opacity="0.01" />
                  </linearGradient>
                </defs>

                <!-- Grid Guide lines -->
                <line x1="0" y1="20" x2="500" y2="20" stroke="#F1F5F9" stroke-width="1" />
                <line x1="0" y1="45" x2="500" y2="45" stroke="#F1F5F9" stroke-width="1" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="#F1F5F9" stroke-width="1" />
                <line x1="0" y1="95" x2="500" y2="95" stroke="#F1F5F9" stroke-width="1" />
                <line x1="0" y1="115" x2="500" y2="115" stroke="#E2E8F0" stroke-width="1" />

                <!-- Filled Area -->
                <path 
                  d="M0,115 L0,95 Q40,88 80,70 T160,45 T240,32 T270,14 T310,22 T350,55 T400,60 T450,85 T500,105 L500,115 Z" 
                  fill="url(#area-grad)" 
                />

                <!-- Stroke Line -->
                <path 
                  d="M0,95 Q40,88 80,70 T160,45 T240,32 T270,14 T310,22 T350,55 T400,60 T450,85 T500,105" 
                  fill="none" 
                  stroke="#2563EB" 
                  stroke-width="2.2"
                />

                <!-- Peak indicator point -->
                <circle cx="270" cy="14" r="3" fill="#2563EB" stroke="#FFFFFF" stroke-width="1.5" />
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
          <svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 12 11 14 15 10"></polyline>
          </svg>
          <span class="health-status-text">All Systems Operational</span>
        </div>

        <div class="health-metrics-grid">
          <!-- Cameras -->
          <div class="health-metric-box">
            <svg class="health-metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="12" x="2" y="6" rx="2"></rect>
              <polygon points="22 8 16 12 22 16 22 8"></polygon>
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
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <line x1="7" y1="12" x2="17" y2="12"></line>
              <line x1="7" y1="8" x2="17" y2="8"></line>
              <line x1="7" y1="16" x2="17" y2="16"></line>
            </svg>
            <span class="health-metric-name">Storage</span>
            <span class="health-metric-pct">92%</span>
          </div>

          <!-- Network -->
          <div class="health-metric-box">
            <svg class="health-metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span class="health-metric-name">Network</span>
            <span class="health-metric-pct">97%</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
