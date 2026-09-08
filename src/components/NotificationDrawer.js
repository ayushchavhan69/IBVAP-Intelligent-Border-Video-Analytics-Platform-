export function renderNotificationDrawer(alerts) {
  return `
    <div class="notification-drawer" id="notification-drawer">
      <div class="notification-drawer-header">
        <div class="notif-header-title-row">
          <div class="notif-title-badge">
            <span class="pulse-dot red"></span>
            <span>Operational Warnings & Alerts</span>
          </div>
          <span class="badge badge-alert" id="notif-count-badge">${alerts.length} ACTIVE</span>
        </div>

        <!-- Filter Tabs -->
        <div class="notif-tabs-bar">
          <button class="notif-tab-btn active" data-tab="all">All (${alerts.length})</button>
          <button class="notif-tab-btn" data-tab="warnings">Warnings (4)</button>
          <button class="notif-tab-btn" data-tab="intel">ANPR & Intel (3)</button>
        </div>
      </div>

      <div class="notification-drawer-list" id="notif-drawer-list">
        ${alerts.map(alert => `
          <div 
            class="notification-drawer-item ${alert.type}" 
            data-notif-id="${alert.id}"
            data-category="${alert.type === 'intel' ? 'intel' : 'warnings'}"
          >
            <!-- Real Evidence Thumbnail Preview -->
            <div class="notif-thumb-wrapper">
              <img 
                src="${alert.thumbnail}" 
                alt="${alert.title}" 
                class="notif-thumb-img" 
                onerror="this.onerror=null;this.src='/assets/alert1.jpg'"
              />
              <span class="notif-tag-overlay ${alert.type}">
                ${alert.severityTag || alert.type.toUpperCase()}
              </span>
            </div>

            <!-- Warning Information Block -->
            <div class="notif-info-block">
              <div class="notif-row-top">
                <span class="notif-item-title">${alert.title}</span>
                <span class="notif-item-time">${alert.time}</span>
              </div>
              
              <div class="notif-location-row">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${alert.location}</span>
              </div>

              <p class="notif-details-text">${alert.details || 'Surveillance anomaly recorded by automated sensor network.'}</p>

              <div class="notif-action-status">
                <span class="notif-status-dot"></span>
                <span>Action: ${alert.actionTaken || 'Pending Operator Review'}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="notification-drawer-footer" id="drawer-view-all-link">
        <span>Open Full Incident Triage Center →</span>
      </div>
    </div>
  `;
}

