export function renderLiveViewScreen(cameras) {
  return `
    <div class="dashboard-content" style="gap: 20px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary);">Operational Multi-Feed Video Wall</h2>
          <span style="font-size: 12px; color: var(--text-secondary);">Simultaneous RTSP Stream Ingestion • 4 Active Streams • Zero Frame Drops</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn-tactical active">4-Grid Matrix</button>
          <button class="btn-tactical">9-Grid Matrix</button>
          <button class="btn-tactical btn-primary" id="wall-fullscreen">Expand Video Wall</button>
        </div>
      </div>

      <div class="camera-matrix" style="gap: 12px; border: 1px solid var(--border-tactical); padding: 8px; border-radius: var(--radius-lg);">
        ${cameras.map(cam => `
          <div class="camera-feed-card" data-camera-id="${cam.id}" style="aspect-ratio: 16 / 9;">
            <img src="${cam.image}" alt="${cam.name}" class="camera-feed-img" />
            <div class="feed-overlay-top">
              <div class="camera-title-pill">
                <span class="dot"></span>
                <span>${cam.name}</span>
              </div>
              <div class="camera-time-pill live-clock-tick">11:30:45 AM</div>
            </div>
            <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 2px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 10px; color: #10B981;">
              FPS: ${cam.fps} • ${cam.bitrate} • ${cam.resolution}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderEventsScreen(alerts) {
  return `
    <div class="dashboard-content" style="gap: 16px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary);">Security Incident & Triage Log</h2>
          <span style="font-size: 12px; color: var(--text-secondary);">Showing real-time AI security detections, virtual breaches, and ANPR alerts</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <input type="text" class="header-search-input" placeholder="Filter incidents..." style="width: 200px;" />
          <button class="btn-tactical btn-primary">Export Incident Report (PDF)</button>
        </div>
      </div>

      <div class="card" style="overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px;">
          <thead style="background: var(--bg-card-elevated); border-bottom: 1px solid var(--border-tactical); color: var(--text-secondary); font-family: var(--font-mono);">
            <tr>
              <th style="padding: 12px 16px;">SEVERITY</th>
              <th style="padding: 12px 16px;">EVENT TYPE</th>
              <th style="padding: 12px 16px;">CAMERA / LOCATION</th>
              <th style="padding: 12px 16px;">TIMESTAMP</th>
              <th style="padding: 12px 16px;">EVIDENCE</th>
              <th style="padding: 12px 16px;">STATUS</th>
              <th style="padding: 12px 16px; text-align: right;">ACTION</th>
            </tr>
          </thead>
          <tbody>
            ${alerts.map(a => `
              <tr style="border-bottom: 1px solid var(--border-subtle); cursor: pointer;" class="table-row-hover" data-alert-id="${a.id}">
                <td style="padding: 12px 16px;">
                  <span class="badge ${a.type === 'critical' ? 'badge-alert' : 'badge-live'}" style="${a.type === 'high' ? 'background: rgba(249,115,22,0.15); color: #F97316; border-color: rgba(249,115,22,0.3);' : ''}">
                    ${a.type.toUpperCase()}
                  </span>
                </td>
                <td style="padding: 12px 16px; font-weight: 600; color: var(--text-primary);">${a.title}</td>
                <td style="padding: 12px 16px; color: var(--text-secondary);">${a.location}</td>
                <td style="padding: 12px 16px; font-family: var(--font-mono); color: var(--text-tertiary);">${a.time}</td>
                <td style="padding: 12px 16px;">
                  <img src="${a.thumbnail}" style="width: 48px; height: 30px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-subtle);" />
                </td>
                <td style="padding: 12px 16px; color: #F59E0B; font-family: var(--font-mono);">${a.actionTaken}</td>
                <td style="padding: 12px 16px; text-align: right;">
                  <button class="btn-tactical btn-primary" style="height: 26px; padding: 0 8px; font-size: 11px;">Triage</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderFullMapScreen() {
  return `
    <div class="dashboard-content" style="gap: 16px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary);">Tactical GIS Perimeter Surveillance Map</h2>
          <span style="font-size: 12px; color: var(--text-secondary);">Sector Alpha & Bravo • Zero Line Perimeter Fence • Live Sensor Coordinates</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn-tactical active">Satellite / Tactical</button>
          <button class="btn-tactical">Terrain Overlay</button>
          <button class="btn-tactical">Camera FOV Cones</button>
        </div>
      </div>

      <div class="card" style="position: relative; height: 600px; overflow: hidden; border-radius: var(--radius-lg);">
        <img src="/assets/map_overview.jpg" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.85);" />
        
        <!-- Large Interactive Beacons -->
        <div class="map-pulse-point" style="top: 50%; left: 18%; color: #10B981; background: #10B981; width: 14px; height: 14px;">
          <div style="position: absolute; left: 20px; top: -6px; background: rgba(11,15,25,0.9); padding: 4px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; white-space: nowrap; border: 1px solid var(--border-tactical); color: #10B981;">
            BOP Alpha - North Gate (ONLINE)
          </div>
        </div>

        <div class="map-pulse-point" style="top: 65%; left: 45%; color: #EF4444; background: #EF4444; width: 16px; height: 16px;">
          <div style="position: absolute; left: 24px; top: -6px; background: rgba(11,15,25,0.95); padding: 4px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; white-space: nowrap; border: 1px solid #EF4444; color: #EF4444; box-shadow: 0 0 10px rgba(239,68,68,0.4);">
            ⚠ ACTIVE BREACH: BOP Alpha East Fence
          </div>
        </div>

        <div class="map-pulse-point" style="top: 75%; left: 62%; color: #F59E0B; background: #F59E0B; width: 14px; height: 14px;">
          <div style="position: absolute; left: 20px; top: -6px; background: rgba(11,15,25,0.9); padding: 4px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; white-space: nowrap; border: 1px solid var(--border-tactical); color: #F59E0B;">
            Check Post - Road 32 (VEHICLE INSPECTION)
          </div>
        </div>

        <div class="map-pulse-point" style="top: 40%; left: 64%; color: #10B981; background: #10B981; width: 14px; height: 14px;">
          <div style="position: absolute; left: 20px; top: -6px; background: rgba(11,15,25,0.9); padding: 4px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; white-space: nowrap; border: 1px solid var(--border-tactical); color: #10B981;">
            Border Road Sector 7 (PATROL CLEAR)
          </div>
        </div>
      </div>
    </div>
  `;
}
