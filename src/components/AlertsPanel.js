export function renderAlertsPanel(alerts) {
  return `
    <div class="alerts-card">
      <div class="alerts-header">
        <span class="alerts-title">Recent Alerts</span>
        <a class="alerts-view-all" id="btn-view-all-alerts">View All</a>
      </div>

      <div class="alerts-list">
        ${alerts.map(alert => `
          <div class="alert-item ${alert.type}" data-alert-id="${alert.id}" title="Click to view alert details">
            <div class="alert-item-left">
              <div class="alert-icon-box ${
                alert.type === 'critical' ? 'red' : 
                alert.type === 'high' ? 'orange' : 
                alert.type === 'intel' ? 'purple' : 'amber'
              }">
                ${getAlertIcon(alert.type)}
              </div>
              <div class="alert-text-block">
                <span class="alert-item-title">${alert.title}</span>
                <span class="alert-item-sub">${alert.location}</span>
                <span class="alert-item-time">${alert.time}</span>
              </div>
            </div>

            <img src="${alert.thumbnail}" alt="${alert.title}" class="alert-thumb" />
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function getAlertIcon(type) {
  if (type === 'critical') {
    return `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
    `;
  }
  if (type === 'high') {
    return `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
        <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
        <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
        <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;
  }
  if (type === 'intel') {
    return `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="20" height="12" x="2" y="6" rx="2"></rect>
        <path d="M7 12h2"></path>
        <path d="M13 10h4"></path>
      </svg>
    `;
  }
  // Medium / Loitering
  return `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  `;
}
