export function renderMinimap() {
  return `
    <div class="map-card">
      <div class="alerts-header">
        <span class="alerts-title">Live Map Overview</span>
        <a class="alerts-view-all" id="btn-view-full-map">View Full Map</a>
      </div>

      <div class="map-viewport" id="minimap-viewport" title="Click to view full tactical map">
        <img src="/assets/map_overview.jpg" alt="Border Map" class="map-bg-img" />

        <!-- Camera Alpha Marker -->
        <div 
          class="map-pulse-point" 
          style="top: 55%; left: 16%; color: #10B981; background: #10B981;"
          title="BOP Alpha - North Gate (Operational)"
        ></div>

        <!-- East Fence Critical Breach Marker -->
        <div 
          class="map-pulse-point" 
          style="top: 68%; left: 42%; color: #EF4444; background: #EF4444;"
          title="ALERT: Virtual Fence Breach at East Perimeter"
        ></div>

        <!-- Road 32 Checkpoint Marker -->
        <div 
          class="map-pulse-point" 
          style="top: 80%; left: 60%; color: #F59E0B; background: #F59E0B;"
          title="Check Post Road 32"
        ></div>

        <!-- Sector 7 Camera Marker -->
        <div 
          class="map-pulse-point" 
          style="top: 42%; left: 62%; color: #10B981; background: #10B981;"
          title="Border Road Sector 7"
        ></div>

        <!-- Patrol Post East Marker -->
        <div 
          class="map-pulse-point" 
          style="top: 60%; left: 83%; color: #10B981; background: #10B981;"
          title="Forward Patrol Post East"
        ></div>
      </div>
    </div>
  `;
}
