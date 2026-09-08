export function renderAnalyticsStrip(analytics) {
  const donutData = analytics.donut || {
    total: '1,844',
    items: [
      { label: 'Intrusion', count: '652', pct: '35%', color: '#EF4444' },
      { label: 'Vehicle', count: '542', pct: '29%', color: '#3B82F6' },
      { label: 'Loitering', count: '362', pct: '20%', color: '#F97316' },
      { label: 'ANPR', count: '128', pct: '7%', color: '#A855F7' },
      { label: 'Other', count: '160', pct: '9%', color: '#06B6D4' }
    ]
  };

  const donutItems = Array.isArray(donutData) ? donutData : donutData.items;
  const donutTotal = donutData.total || '1,844';

  return `
    <div class="bottom-analytics-grid">
      <!-- 1. Events by Type (Today) -->
      <div class="analytics-panel">
        <span class="analytics-panel-title">Events by Type <span class="title-sub">(Today)</span></span>
        <div class="donut-container">
          <div class="donut-svg-wrapper">
            <svg viewBox="0 0 42 42" class="donut-svg" width="94" height="94">
              <!-- Background Ring -->
              <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#131d31" stroke-width="5.5"></circle>
              
              <!-- Intrusion 35% (starts at top, dashoffset 25) -->
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#EF4444" stroke-width="5.5" stroke-dasharray="35 65" stroke-dashoffset="25"></circle>

              <!-- Vehicle 29% (offset 25 - 35 = -10 = 90) -->
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#3B82F6" stroke-width="5.5" stroke-dasharray="29 71" stroke-dashoffset="90"></circle>

              <!-- Loitering 20% (offset 90 - 29 = 61) -->
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#F97316" stroke-width="5.5" stroke-dasharray="20 80" stroke-dashoffset="61"></circle>

              <!-- ANPR 7% (offset 61 - 20 = 41) -->
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#A855F7" stroke-width="5.5" stroke-dasharray="7 93" stroke-dashoffset="41"></circle>

              <!-- Other 9% (offset 41 - 7 = 34) -->
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#06B6D4" stroke-width="5.5" stroke-dasharray="9 91" stroke-dashoffset="34"></circle>
            </svg>
            <div class="donut-center-info">
              <span class="donut-total-val">${donutTotal}</span>
              <span class="donut-total-lbl">Total</span>
            </div>
          </div>

          <div class="donut-legend">
            ${donutItems.map(item => `
              <div class="legend-item">
                <span class="legend-color-dot" style="background: ${item.color};"></span>
                <span class="legend-name">${item.label}</span>
                <span class="legend-bold">${item.count} (${item.pct})</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 2. Events Over Time (Today) -->
      <div class="analytics-panel">
        <span class="analytics-panel-title">Events Over Time <span class="title-sub">(Today)</span></span>
        <div class="area-chart-container">
          <div style="display: flex; gap: 8px; flex: 1; align-items: flex-end; position: relative;">
            <div style="display: flex; flex-direction: column; justify-content: space-between; height: 75px; font-size: 9px; font-family: var(--font-mono); color: var(--text-tertiary); text-align: right; padding-right: 4px; line-height: 1;">
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>

            <div class="chart-svg-container" style="flex: 1; position: relative;">
              <!-- Peak Callout Badge -->
              <div class="chart-peak-badge" style="position: absolute; top: -12px; left: 56%; transform: translateX(-50%); background: #111C30; border: 1px solid #06B6D4; color: #22D3EE; font-size: 9.5px; font-weight: 700; font-family: var(--font-mono); padding: 1px 6px; border-radius: 4px; box-shadow: 0 0 8px rgba(6, 182, 212, 0.4); z-index: 5;">
                158
              </div>

              <svg viewBox="0 0 500 120" preserveAspectRatio="none" style="width: 100%; height: 75px; overflow: visible;">
                <defs>
                  <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.38" />
                    <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.0" />
                  </linearGradient>
                </defs>

                <!-- Grid Guide lines -->
                <line x1="0" y1="20" x2="500" y2="20" stroke="#1E293B" stroke-width="0.8" stroke-dasharray="3 3"/>
                <line x1="0" y1="50" x2="500" y2="50" stroke="#1E293B" stroke-width="0.8" stroke-dasharray="3 3"/>
                <line x1="0" y1="80" x2="500" y2="80" stroke="#1E293B" stroke-width="0.8" stroke-dasharray="3 3"/>
                <line x1="0" y1="110" x2="500" y2="110" stroke="#1E293B" stroke-width="0.8" />

                <!-- Filled Area -->
                <path 
                  d="M0,110 L0,95 Q40,90 70,72 T140,58 T210,48 T280,16 T340,32 T400,60 T450,78 T500,98 L500,110 Z" 
                  fill="url(#area-grad)" 
                />

                <!-- Stroke Line -->
                <path 
                  d="M0,95 Q40,90 70,72 T140,58 T210,48 T280,16 T340,32 T400,60 T450,78 T500,98" 
                  fill="none" 
                  stroke="#22D3EE" 
                  stroke-width="2.2"
                  filter="drop-shadow(0 0 6px rgba(6, 182, 212, 0.6))"
                />

                <!-- Peak dot -->
                <circle cx="280" cy="16" r="3.5" fill="#22D3EE" stroke="#FFFFFF" stroke-width="1.5" />
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

      <!-- 3. Top Cameras by Activity (Today) -->
      <div class="analytics-panel">
        <span class="analytics-panel-title">Top Cameras by Activity <span class="title-sub">(Today)</span></span>
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
        
        <div class="health-overview-layout">
          <!-- Circular Health Gauge Ring -->
          <div class="health-gauge-ring-container">
            <svg viewBox="0 0 100 100" class="health-ring-svg">
              <!-- Background Ring -->
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#131d31" stroke-width="7" />
              <!-- Green Progress Arc (98%) -->
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="transparent" 
                stroke="#10B981" 
                stroke-width="7" 
                stroke-dasharray="251.2" 
                stroke-dashoffset="5" 
                stroke-linecap="round"
                transform="rotate(-90 50 50)"
                style="filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.4));"
              />
            </svg>
            <div class="health-gauge-center">
              <span class="health-gauge-percent">98%</span>
              <span class="health-gauge-label">Healthy</span>
            </div>
          </div>

          <!-- Subsystems List -->
          <div class="health-subsystems-list">
            <div class="health-subsystem-item">
              <div class="health-subsystem-left">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="health-sub-icon">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect width="14" height="12" x="1" y="6" rx="2"></rect>
                </svg>
                <span class="health-sub-name">Cameras</span>
              </div>
              <span class="health-sub-val">98%</span>
            </div>

            <div class="health-subsystem-item">
              <div class="health-subsystem-left">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="health-sub-icon">
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M9 9h6v6H9z"></path>
                </svg>
                <span class="health-sub-name">AI Engine</span>
              </div>
              <span class="health-sub-val">99%</span>
            </div>

            <div class="health-subsystem-item">
              <div class="health-subsystem-left">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="health-sub-icon">
                  <path d="M4 6h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path>
                  <path d="M4 14h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"></path>
                </svg>
                <span class="health-sub-name">Storage</span>
              </div>
              <span class="health-sub-val">92%</span>
            </div>

            <div class="health-subsystem-item">
              <div class="health-subsystem-left">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="health-sub-icon">
                  <path d="M12 20h.01"></path>
                  <path d="M8.5 16.429a5 5 0 0 1 7 0"></path>
                  <path d="M5 12.859a10 10 0 0 1 14 0"></path>
                </svg>
                <span class="health-sub-name">Network</span>
              </div>
              <span class="health-sub-val">97%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
