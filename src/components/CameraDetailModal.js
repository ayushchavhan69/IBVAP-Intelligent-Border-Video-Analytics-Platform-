export function renderCameraDetailModal() {
  return `
    <div class="modal-overlay" id="camera-modal-overlay">
      <div class="modal-container" style="max-width: 960px;">
        <div class="modal-header">
          <div class="modal-title-group">
            <span class="badge badge-live">
              <span class="live-dot"></span>
              LIVE RTSP FEED
            </span>
            <span class="modal-title" id="cam-modal-title">BOP Alpha - North Gate</span>
          </div>
          <button class="modal-close-btn" id="cam-modal-close-btn">&times;</button>
        </div>

        <div class="modal-body">
          <div class="modal-evidence-preview" style="height: 380px; position: relative;">
            <img src="/assets/cam1.jpg" alt="Camera Feed" class="modal-evidence-img" id="cam-modal-feed-img" />
            
            <div style="position: absolute; bottom: 12px; left: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 10px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; color: #38BDF8; display: flex; gap: 14px;">
              <span>RTSP: 1080p@30fps</span>
              <span>BITRATE: 4.6 Mbps</span>
              <span>AI INFERENCE: 18ms</span>
              <span>CODEC: H.265</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-card-elevated); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-tactical);">
            <!-- PTZ Controls -->
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-secondary); text-transform: uppercase;">PTZ Gimbal:</span>
              <div style="display: flex; gap: 4px;">
                <button class="btn-tactical btn-icon" id="ptz-left" title="Pan Left">◀</button>
                <button class="btn-tactical btn-icon" id="ptz-up" title="Tilt Up">▲</button>
                <button class="btn-tactical btn-icon" id="ptz-down" title="Tilt Down">▼</button>
                <button class="btn-tactical btn-icon" id="ptz-right" title="Pan Right">▶</button>
              </div>
              <div style="display: flex; gap: 4px; margin-left: 8px;">
                <button class="btn-tactical" id="ptz-zoom-in">Zoom +</button>
                <button class="btn-tactical" id="ptz-zoom-out">Zoom -</button>
              </div>
            </div>

            <!-- Visual Enhancements -->
            <div style="display: flex; gap: 8px;">
              <button class="btn-tactical" id="btn-thermal-toggle">Toggle Thermal / IR</button>
              <button class="btn-tactical" id="btn-modal-snapshot">Capture High-Res Frame</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
