export function renderStatCards(stats) {
  return `
    <div class="stats-strip">
      <!-- 1. Total Cameras -->
      <div class="stat-card">
        <div class="stat-icon-wrapper cyan">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
        </div>
        <div class="stat-details">
          <span class="stat-label">${stats.cameras ? stats.cameras.label : 'Total Cameras'}</span>
          <span class="stat-value">${stats.cameras ? stats.cameras.count : '48'}</span>
          <span class="stat-trend positive" style="color: #10B981;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10B981; margin-right: 4px;"></span>
            ${stats.cameras ? stats.cameras.sub : '42 Online'}
          </span>
        </div>
      </div>

      <!-- 2. Total Persons Detected -->
      <div class="stat-card">
        <div class="stat-icon-wrapper teal">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div class="stat-details">
          <span class="stat-label">${stats.persons.label}</span>
          <span class="stat-value">${stats.persons.count}</span>
          <span class="stat-trend positive">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
            ${stats.persons.change.replace('+', '')} vs yesterday
          </span>
        </div>
      </div>

      <!-- 3. Total Vehicles Detected -->
      <div class="stat-card">
        <div class="stat-icon-wrapper green">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
            <circle cx="7.5" cy="14.5" r="1.5"/>
            <circle cx="16.5" cy="14.5" r="1.5"/>
          </svg>
        </div>
        <div class="stat-details">
          <span class="stat-label">${stats.vehicles.label}</span>
          <span class="stat-value">${stats.vehicles.count}</span>
          <span class="stat-trend positive">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
            ${stats.vehicles.change.replace('+', '')} vs yesterday
          </span>
        </div>
      </div>

      <!-- 4. ANPR Detections -->
      <div class="stat-card">
        <div class="stat-icon-wrapper purple">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="12" x="2" y="6" rx="2"></rect>
            <path d="M7 12h2"></path>
            <path d="M13 10h4"></path>
            <path d="M13 14h2"></path>
          </svg>
        </div>
        <div class="stat-details">
          <span class="stat-label">${stats.anpr.label}</span>
          <span class="stat-value">${stats.anpr.count}</span>
          <span class="stat-trend positive">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
            ${stats.anpr.change.replace('+', '')} vs yesterday
          </span>
        </div>
      </div>

      <!-- 5. Active Alerts -->
      <div class="stat-card">
        <div class="stat-icon-wrapper red">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        </div>
        <div class="stat-details">
          <span class="stat-label">${stats.alerts.label}</span>
          <span class="stat-value">${stats.alerts.count}</span>
          <a class="stat-trend negative" id="stat-view-alerts" style="color: #F87171; text-decoration: none; cursor: pointer;">
            ${stats.alerts.linkText}
          </a>
        </div>
      </div>
    </div>
  `;
}
