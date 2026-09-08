export function getActiveOperator() {
  try {
    const raw = localStorage.getItem('ibvap_active_operator');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name) {
        return {
          name: parsed.name,
          role: parsed.role || 'Command Officer',
          unit: parsed.unit || 'BOP Alpha',
          email: parsed.email || 'ayushchavhan79@gmail.com',
          initials: getInitials(parsed.name)
        };
      }
    }
  } catch (e) { }

  // Default fallback to Ayush Chavhan
  return {
    name: 'Ayush Chavhan',
    role: 'Command Officer',
    unit: 'BOP Alpha',
    email: 'ayushchavhan79@gmail.com',
    initials: 'AC'
  };
}

function getInitials(name) {
  if (!name) return 'AC';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function renderHeader(activeView = 'Dashboard', cameraCount = 4) {
  const operator = getActiveOperator();

  return `
    <header class="header">
      <div class="header-left">
        <h1 class="header-title">${activeView}</h1>
        <span class="header-subtitle">Welcome back, <span class="operator-cyan">${operator.name}</span></span>
      </div>

      <div class="header-right">
        <!-- Search Pill -->
        <div class="header-search">
          <input 
            type="text" 
            class="header-search-input" 
            id="global-search-input"
            placeholder="Search camera, location, event..." 
          />
          <svg class="header-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>

        <!-- Fullscreen Toggle -->
        <button class="header-icon-btn" id="header-fullscreen-btn" title="Toggle Fullscreen">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </button>

        <!-- Notification Bell -->
        <button class="header-icon-btn" id="header-notif-btn" title="12 Active Alerts">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
          <span class="notification-count" id="notif-count-badge">12</span>
        </button>

        <!-- Settings Button -->
        <button class="header-icon-btn" id="header-settings-btn" title="System Settings">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>

        <!-- Operator Profile Pill with Interactive Dropdown -->
        <div class="header-operator-pill-wrapper">
          <div class="header-operator-pill" id="operator-profile-pill" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false" title="Operator Profile: ${operator.name}">
            <div class="operator-avatar-badge">
              <span class="avatar-initials">${operator.initials}</span>
              <span class="operator-status-dot" title="Active Duty"></span>
            </div>
            <div class="operator-details">
              <span class="operator-name">${operator.name}</span>
              <span class="operator-role">${operator.unit}</span>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="chevron-down">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <!-- Operator Profile Dropdown Card -->
          <div class="operator-dropdown-menu" id="operator-dropdown-menu">
            <div class="operator-dropdown-header">
              <div class="dropdown-avatar-large">
                <span>${operator.initials}</span>
                <span class="dropdown-status-dot"></span>
              </div>
              <div class="dropdown-user-info">
                <div class="dropdown-name">${operator.name}</div>
                <div class="dropdown-email">${operator.email}</div>
                <div class="dropdown-badge"><span class="badge-dot"></span> ${operator.role}</div>
              </div>
            </div>
            <div class="operator-dropdown-divider"></div>
            <div class="operator-dropdown-meta">
              <div class="meta-row">
                <span class="meta-label">Station Post</span>
                <span class="meta-value">${operator.unit}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Security Clearance</span>
                <span class="meta-value level-top">LEVEL-4 (COMMAND)</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Operator ID</span>
                <span class="meta-value session-code">OP-9482-AC</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Duty Status</span>
                <span class="meta-value status-active">● ACTIVE ON DUTY</span>
              </div>
            </div>
            <div class="operator-dropdown-divider"></div>
            <div class="operator-dropdown-actions">
              <a href="/signin.html" class="dropdown-action-btn logout" id="operator-signout-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Switch / Sign Out</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  `;
}
