export function renderSidebar(activeNav = 'Dashboard') {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>` 
    },
    { 
      id: 'live-view', 
      label: 'Live View', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/></svg>` 
    },
    { 
      id: 'events-alerts', 
      label: 'Events & Alerts', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>` 
    },
    { 
      id: 'search-playback', 
      label: 'Search & Playback', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7.5"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>` 
    },
    { 
      id: 'anpr-search', 
      label: 'ANPR Search', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10.5" r="2"/><path d="M14 9h3"/><path d="M14 13h3"/><path d="M6.5 15.5h11"/></svg>` 
    },
    { 
      id: 'watchlist', 
      label: 'Watchlist', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M6.5 17.5a5.5 5.5 0 0 1 11 0"/></svg>` 
    },
    { 
      id: 'map-view', 
      label: 'Map View', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>` 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="12" width="3.5" height="9" rx="1.5"/><rect x="10.25" y="4" width="3.5" height="17" rx="1.5"/><rect x="16.5" y="8" width="3.5" height="13" rx="1.5"/></svg>` 
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>` 
    },
    { 
      id: 'devices', 
      label: 'Devices', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="12" y1="17" x2="12" y2="20"/></svg>` 
    },
    { 
      id: 'system-health', 
      label: 'System Health', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y1="11"/></svg>` 
    },
    { 
      id: 'users-roles', 
      label: 'Users & Roles', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>` 
    },
    { 
      id: 'audit-logs', 
      label: 'Audit Logs', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="13" y2="15"/></svg>` 
    }
  ];

  return `
    <aside class="sidebar" id="main-sidebar">
      <div class="sidebar-top">
        <div class="sidebar-brand">
          <img src="/assets/ibvap_logo.png" alt="IBVAP Shield" class="sidebar-brand-logo" />
          <div class="sidebar-brand-info">
            <span class="brand-title">IBVAP</span>
            <span class="brand-subtitle">Intelligent Border<br/>Video Analytics Platform</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          ${navItems.map(item => `
            <a class="nav-item ${item.label === activeNav ? 'active' : ''}" data-view="${item.id}" id="nav-${item.id}">
              <span class="nav-item-icon">${item.icon}</span>
              <span class="nav-item-label">${item.label}</span>
            </a>
          `).join('')}
        </nav>
      </div>

      <div class="sidebar-bottom">
        <!-- Emergency Tactical Alert Button with Flashing Siren Beacon -->
        <button class="emergency-sidebar-btn" id="btn-emergency-action" title="Trigger Perimeter Lockdown Emergency">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="emergency-siren-svg">
            <!-- Light Radiation Beams -->
            <line x1="12" y1="2" x2="12" y2="4"/>
            <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/>
            <line x1="19.07" y1="4.93" x2="17.66" y2="6.34"/>
            <!-- Siren Dome -->
            <path d="M7 16a5 5 0 0 1 10 0" fill="rgba(239, 68, 68, 0.4)"/>
            <!-- Siren Base -->
            <rect x="5" y="16" width="14" height="4" rx="1.5" fill="currentColor"/>
          </svg>
          <span class="emergency-text">Emergency</span>
        </button>

        <div class="sidebar-footer">
          <div class="bsf-badge">
            <img src="/assets/bsf_crest_silver.png" alt="Border Security Force" class="bsf-crest" />
            <div class="bsf-info">
              <span class="bsf-title">Border Security Force</span>
              <span class="bsf-motto">Securing Our Borders</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  `;
}
