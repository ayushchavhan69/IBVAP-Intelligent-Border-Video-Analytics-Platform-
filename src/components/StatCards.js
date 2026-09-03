export function renderStatCards(stats) {
  return `
    <div class="stats-strip">
      <!-- Persons Detected -->
      <div class="stat-card">
        <div class="stat-icon-wrapper blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
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
            ${stats.persons.change} vs yesterday
          </span>
        </div>
      </div>

      <!-- Vehicles Detected -->
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
            ${stats.vehicles.change} vs yesterday
          </span>
        </div>
      </div>

      <!-- Known Faces Matched -->
      <div class="stat-card">
        <div class="stat-icon-wrapper amber">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
            <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
            <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
            <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M9 9h.01"></path>
            <path d="M15 9h.01"></path>
          </svg>
        </div>
        <div class="stat-details">
          <span class="stat-label">${stats.faces.label}</span>
          <span class="stat-value">${stats.faces.count}</span>
          <span class="stat-trend positive">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
            ${stats.faces.change} vs yesterday
          </span>
        </div>
      </div>

      <!-- ANPR Detections -->
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
            ${stats.anpr.change} vs yesterday
          </span>
        </div>
      </div>

      <!-- Active Alerts -->
      <div class="stat-card">
        <div class="stat-icon-wrapper red">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        </div>
        <div class="stat-details">
          <span class="stat-label">${stats.alerts.label}</span>
          <span class="stat-value">${stats.alerts.count}</span>
          <a class="stat-trend alert-link" id="view-active-alerts-link">
            ${stats.alerts.linkText}
          </a>
        </div>
      </div>
    </div>
  `;
}
