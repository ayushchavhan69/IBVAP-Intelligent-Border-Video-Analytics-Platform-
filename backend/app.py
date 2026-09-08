"""
IBVAP - Intelligent Border Video Analytics Platform
FastAPI Backend Server with Real-Time Video Streaming, REST APIs, and WebSockets.
"""
import os
import sys
import json
import asyncio
import time
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse, Response
from fastapi.middleware.cors import CORSMiddleware
import psutil

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from backend.database import init_db, get_stats, get_all_alerts, get_all_audit_logs, log_audit, insert_alert, get_connection
from backend.stream_manager import get_stream_manager, STREAM_CONFIGS

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[*] Starting IBVAP Backend System...")
    init_db()
    # Initialize streams and AI models
    get_stream_manager()
    log_audit("Commandant V. S. Chauhan", "IBVAP System Initialized", "All Border Outposts Online")
    yield
    print("[*] Shutting down IBVAP Backend...")

app = FastAPI(title="IBVAP Border Video Analytics API", version="1.0.0", lifespan=lifespan)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active WebSocket connections
connected_websockets = set()

@app.get("/")
def root():
    return {
        "platform": "IBVAP - Intelligent Border Video Analytics Platform",
        "status": "ONLINE",
        "agency": "Border Security Force (BSF), Ministry of Home Affairs",
        "version": "1.0.0"
    }

# -------------------------------------------------------------
# Video Streaming Endpoints
# -------------------------------------------------------------
@app.get("/video_feed/{camera_id}")
def video_feed(camera_id: str):
    """
    Supplies high-performance multipart MJPEG stream for the requested camera feed.
    """
    sm = get_stream_manager()
    if camera_id not in sm.workers:
        raise HTTPException(status_code=404, detail="Camera feed not found")

    return StreamingResponse(
        sm.generate_mjpeg(camera_id),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.get("/api/cameras/{camera_id}/snapshot")
def camera_snapshot(camera_id: str):
    sm = get_stream_manager()
    frame_bytes = sm.get_frame(camera_id)
    if frame_bytes is None:
        raise HTTPException(status_code=404, detail="Snapshot unavailable")
    return Response(content=frame_bytes, media_type="image/jpeg")

# -------------------------------------------------------------
# REST Endpoints
# -------------------------------------------------------------
@app.get("/api/cameras")
def get_cameras():
    sm = get_stream_manager()
    return sm.get_all_camera_states()

@app.get("/api/stats")
def get_statistics():
    return get_stats()

@app.get("/api/alerts")
def get_alerts():
    return get_all_alerts(limit=20)

@app.post("/api/alerts/{alert_id}/action")
async def take_alert_action(alert_id: str, payload: dict):
    action = payload.get("action", "ACKNOWLEDGE")
    operator = payload.get("operator", "Inspector R. K. Sharma (BSF-9201)")
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE alerts SET action_taken = ? WHERE id = ?", (action, alert_id))
    conn.commit()
    conn.close()

    audit_id = log_audit(operator, f"Incident Action: {action}", f"Alert ID: {alert_id}")
    return {"status": "SUCCESS", "alert_id": alert_id, "action": action, "audit_id": audit_id}

@app.get("/api/audit-logs")
def get_audit_logs():
    return get_all_audit_logs(limit=25)

@app.get("/api/anpr/watchlist")
def get_anpr_watchlist():
    sm = get_stream_manager()
    return sm.anpr_engine.hotlist

@app.get("/api/anpr/scan")
def scan_license_plate(plate: str = None):
    sm = get_stream_manager()
    res = sm.anpr_engine.scan_vehicle_crop(plate_hint=plate)
    if res["is_watchlist_match"]:
        alert_id = f"alert-anpr-{int(time.time()) % 10000}"
        insert_alert(
            alert_id=alert_id,
            camera_id="cam-2",
            alert_type="intel",
            severity="HIGH",
            title=f"ANPR Hit - {res['plate_number']}",
            details=f"Watchlist intercept: {res['description']} ({res['status']})",
            confidence=res["confidence"],
            snapshot_url="/api/cameras/cam-2/snapshot"
        )
        log_audit("ANPR Automated Scanner", f"Watchlist Plate Intercept: {res['plate_number']}", "Check Post - Road 32")
    return res

@app.get("/api/face/profiles")
def get_face_profiles():
    sm = get_stream_manager()
    return sm.face_engine.profiles

@app.get("/api/system/health")
def get_system_health():
    cpu_percent = psutil.cpu_percent(interval=None)
    mem = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    return {
        "status": "HEALTHY",
        "cpu_usage": f"{cpu_percent}%",
        "memory_used": f"{mem.percent}% ({round(mem.used / (1024**3), 1)} / {round(mem.total / (1024**3), 1)} GB)",
        "disk_used": f"{disk.percent}% ({round(disk.used / (1024**3), 1)} GB)",
        "active_streams": len(STREAM_CONFIGS),
        "ai_engine": "YOLOv8n Active (PyTorch)",
        "network_latency": "14 ms",
        "c2_sync": "CONNECTED"
    }

# -------------------------------------------------------------
# WebSocket Telemetry Broadcast
# -------------------------------------------------------------
@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    connected_websockets.add(websocket)
    sm = get_stream_manager()

    try:
        while True:
            # Broadcast live detections and telemetry every 150ms (~7 Hz updates)
            states = sm.get_all_camera_states()
            stats = get_stats()
            payload = {
                "timestamp": time.time(),
                "time_str": time.strftime("%H:%M:%S IST"),
                "cameras": states,
                "stats": stats
            }
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(0.15)
    except WebSocketDisconnect:
        connected_websockets.remove(websocket)
    except Exception:
        if websocket in connected_websockets:
            connected_websockets.remove(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=False)
