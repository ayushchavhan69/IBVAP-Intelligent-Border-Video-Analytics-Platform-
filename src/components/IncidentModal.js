export function renderIncidentModal() {
  return `
    <div class="modal-overlay" id="incident-modal-overlay">
      <div class="modal-container" id="incident-modal-container">
        <div class="modal-header">
          <div class="modal-title-group">
            <span class="badge badge-alert" id="incident-badge">
              <span class="live-dot"></span>
              CRITICAL ALERT
            </span>
            <span class="modal-title" id="incident-modal-title">Virtual Fence Breach</span>
          </div>
          <button class="modal-close-btn" id="modal-close-btn">&times;</button>
        </div>

        <div class="modal-body">
          <div class="modal-evidence-preview">
            <img src="/assets/alert1.jpg" alt="Incident Evidence" class="modal-evidence-img" id="incident-evidence-img" />
          </div>

          <div class="modal-grid-2col">
            <div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td>Alert Type</td>
                    <td id="incident-type-cell">Virtual Fence Breach</td>
                  </tr>
                  <tr>
                    <td>Location</td>
                    <td id="incident-location-cell">BOP Alpha - East Fence</td>
                  </tr>
                  <tr>
                    <td>RTSP Hardware Time</td>
                    <td id="incident-time-cell">11:28:31 AM IST</td>
                  </tr>
                  <tr>
                    <td>AI Model Confidence</td>
                    <td id="incident-confidence-cell" style="color: #EF4444;">93% (High Confidence)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td>Target Category</td>
                    <td id="incident-category-cell">Human / Intruder</td>
                  </tr>
                  <tr>
                    <td>Assigned Camera</td>
                    <td id="incident-camera-cell">CAM-03 (BOP-E-01)</td>
                  </tr>
                  <tr>
                    <td>Surveillance Zone</td>
                    <td id="incident-zone-cell">Zone 4 (Zero Line Buffer)</td>
                  </tr>
                  <tr>
                    <td>Current Status</td>
                    <td id="incident-status-cell" style="color: #F59E0B;">Pending Verification</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style="background: var(--bg-canvas); padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="font-size: 11px; color: var(--text-tertiary); margin-bottom: 4px; font-family: var(--font-mono); text-transform: uppercase;">
              AI Incident Telemetry Log
            </div>
            <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.4;" id="incident-description-p">
              Automated tripwire breach detected. Unidentified male individual approached security perimeter fence from zero line. Track duration: 14s.
            </p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-tactical" id="btn-dismiss-alert">Dismiss False Alarm</button>
          <button class="btn-tactical" id="btn-export-evidence">Export Video Evidence</button>
          <button class="btn-tactical btn-primary" id="btn-ack-alert">Acknowledge Alert</button>
          <button class="btn-tactical btn-danger" id="btn-dispatch-qrf">Dispatch QRF Patrol Unit</button>
        </div>
      </div>
    </div>
  `;
}
