export function renderNotificationDrawer(alerts) {
  return `
    <div class="notification-drawer" id="notification-drawer">
      <div class="notification-drawer-header">
        <span>Active Alerts (12)</span>
        <span class="badge badge-alert">7 UNACKNOWLEDGED</span>
      </div>

      <div class="notification-drawer-list">
        ${alerts.map(alert => `
          <div class="notification-drawer-item" data-notif-id="${alert.id}">
            <div class="alert-icon-box ${alert.type === 'critical' ? 'red' : alert.type === 'high' ? 'orange' : alert.type === 'intel' ? 'purple' : 'amber'}" style="width: 24px; height: 24px;">
              ${getIcon(alert.type)}
            </div>
            <div style="flex: 1; display: flex; flex-direction: column;">
              <span style="font-weight: 600; color: var(--text-primary);">${alert.title}</span>
              <span style="font-size: 11px; color: var(--text-secondary);">${alert.location}</span>
              <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-tertiary);">${alert.time}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="notification-drawer-footer" id="drawer-view-all-link">
        Open Full Incident Triage Center →
      </div>
    </div>
  `;
}

function getIcon(type) {
  if (type === 'critical') {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`;
  }
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
}
