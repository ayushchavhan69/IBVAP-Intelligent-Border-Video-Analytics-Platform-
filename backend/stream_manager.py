"""
IBVAP - Multi-Stream Video & Telemetry Manager
Decodes camera feeds in real time, executes AI inference, draws HUD,
and supplies MJPEG feeds and WebSocket telemetry.
"""
import os
import time
import threading
from pathlib import Path
import cv2
import numpy as np

from backend.ai_engines.detector import ObjectDetector
from backend.ai_engines.intrusion import IntrusionDetector
from backend.ai_engines.anpr import ANPREngine
from backend.ai_engines.face_rec import FaceRecognitionEngine
from backend.database import insert_alert, log_audit, get_connection

BASE_DIR = Path(__file__).resolve().parent.parent

STREAM_CONFIGS = {
    "cam-1": {
        "id": "cam-1",
        "name": "BOP Alpha - North Gate",
        "location": "North Perimeter Gate Sector 2",
        "video_path": BASE_DIR / "data" / "surveillance" / "cam_01_gate" / "videos" / "processed" / "gate_surveillance_loop.mp4",
        "target_fps": 15,
        "is_intrusion_cam": False
    },
    "cam-2": {
        "id": "cam-2",
        "name": "Check Post - Road 32",
        "location": "Highway Checkpost Sector 4",
        "video_path": BASE_DIR / "data" / "surveillance" / "cam_02_checkpoint" / "videos" / "processed" / "checkpoint_loop.mp4",
        "target_fps": 15,
        "is_intrusion_cam": False
    },
    "cam-3": {
        "id": "cam-3",
        "name": "BOP Alpha - East Fence",
        "location": "East Perimeter Smart Fence Line",
        "video_path": BASE_DIR / "data" / "surveillance" / "cam_03_east_fence_intrusion" / "videos" / "processed" / "fence_intrusion_loop.mp4",
        "target_fps": 20,
        "is_intrusion_cam": True
    },
    "cam-4": {
        "id": "cam-4",
        "name": "Border Road - Sector 7",
        "location": "Sector 7 Patrol Corridor",
        "video_path": BASE_DIR / "data" / "surveillance" / "cam_04_corridor" / "videos" / "processed" / "corridor_transit_loop.mp4",
        "target_fps": 15,
        "is_intrusion_cam": False
    }
}

class CameraWorker:
    def __init__(self, cam_id: str, config: dict, detector: ObjectDetector, intrusion_detector: IntrusionDetector):
        self.cam_id = cam_id
        self.config = config
        self.detector = detector
        self.intrusion_detector = intrusion_detector
        self.video_path = str(config["video_path"])
        self.running = False
        self.thread = None

        self.latest_frame_bytes = None
        self.latest_detections = []
        self.is_breached = False
        self.alert_cooldown = 0
        self.lock = threading.Lock()

    def start(self):
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self._run_loop, daemon=True)
            self.thread.start()

    def stop(self):
        self.running = False
        if self.thread:
            self.thread.join(timeout=1.0)

    def _run_loop(self):
        cap = cv2.VideoCapture(self.video_path)
        frame_interval = 1.0 / self.config["target_fps"]
        inference_skip = 2 # Run YOLO every 2nd frame for maximum smoothness
        frame_idx = 0
        current_detections = []

        while self.running:
            start_time = time.time()
            ret, frame = cap.read()
            if not ret or frame is None:
                # Seamless loop replay
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue

            frame_idx += 1
            h, w = frame.shape[:2]

            # Resize if 1080p to 960x540 for fast real-time inference on laptop
            if w > 1280:
                frame = cv2.resize(frame, (960, 540))
                h, w = frame.shape[:2]

            # Run YOLO inference
            if frame_idx % inference_skip == 0:
                try:
                    current_detections = self.detector.detect_and_track(frame)
                except Exception as e:
                    pass

                # Check intrusion zone for Camera 3
                if self.config["is_intrusion_cam"]:
                    breached, breach_events = self.intrusion_detector.check_intrusion(current_detections, w, h)
                    self.is_breached = breached

                    # Trigger critical alert if breached and cooldown elapsed
                    if breached and time.time() > self.alert_cooldown:
                        self.alert_cooldown = time.time() + 15.0 # 15s cooldown
                        alert_id = f"alert-intr-{int(time.time()) % 10000}"
                        insert_alert(
                            alert_id=alert_id,
                            camera_id=self.cam_id,
                            alert_type="critical",
                            severity="CRITICAL",
                            title="Virtual Fence Breach",
                            details="Automated tripwire breach: Unidentified subject entered perimeter zone from zero line.",
                            confidence=0.94,
                            snapshot_url=f"/api/cameras/{self.cam_id}/snapshot"
                        )
                        log_audit("IBVAP Automated AI Engine", f"CRITICAL Alert Raised: {alert_id}", f"{self.cam_id} East Fence Line")

            # Draw tactical HUD overlay directly onto frame for stream
            vis_frame = frame.copy()
            if self.config["is_intrusion_cam"]:
                vis_frame = self.intrusion_detector.draw_zone_on_frame(vis_frame, self.is_breached)

            for det in current_detections:
                x, y, bw, bh = det["box_pixels"]
                color_hex = det["color"].lstrip("#")
                color_bgr = tuple(int(color_hex[i:i+2], 16) for i in (4, 2, 0)) # Hex to BGR
                cv2.rectangle(vis_frame, (x, y), (x + bw, y + bh), color_bgr, 2)
                label_txt = f"{det['label']} [ID:#{det.get('track_id', 1)}]"
                cv2.putText(vis_frame, label_txt, (x, max(y - 6, 15)), cv2.FONT_HERSHEY_SIMPLEX, 0.45, color_bgr, 1, cv2.LINE_AA)

            # Digital hardware timestamp overlay
            ts_str = time.strftime("%H:%M:%S IST")
            hud_header = f"{self.config['name']} | {ts_str} | REC [●]"
            cv2.putText(vis_frame, hud_header, (12, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 128), 1, cv2.LINE_AA)

            # Encode frame to JPEG
            ret_enc, jpeg = cv2.imencode(".jpg", vis_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 75])
            if ret_enc:
                with self.lock:
                    self.latest_frame_bytes = jpeg.tobytes()
                    self.latest_detections = current_detections

            # Regulate FPS
            elapsed = time.time() - start_time
            sleep_time = max(0.001, frame_interval - elapsed)
            time.sleep(sleep_time)

        cap.release()

class StreamManager:
    def __init__(self):
        self.detector = ObjectDetector(conf_threshold=0.30)
        self.intrusion_detector = IntrusionDetector()
        self.anpr_engine = ANPREngine()
        self.face_engine = FaceRecognitionEngine()
        self.workers = {}

        for cam_id, cfg in STREAM_CONFIGS.items():
            worker = CameraWorker(cam_id, cfg, self.detector, self.intrusion_detector)
            self.workers[cam_id] = worker
            worker.start()
        print("[OK] Stream Manager active. 4 camera streams operational.")

    def get_frame(self, cam_id: str):
        worker = self.workers.get(cam_id)
        if worker:
            with worker.lock:
                return worker.latest_frame_bytes
        return None

    def get_detections(self, cam_id: str):
        worker = self.workers.get(cam_id)
        if worker:
            with worker.lock:
                return worker.latest_detections
        return []

    def get_all_camera_states(self):
        result = []
        for cam_id, w in self.workers.items():
            with w.lock:
                result.append({
                    "id": cam_id,
                    "name": w.config["name"],
                    "location": w.config["location"],
                    "status": "LIVE",
                    "fps": w.config["target_fps"],
                    "detections": w.latest_detections,
                    "is_breached": w.is_breached,
                    "stream_url": f"/video_feed/{cam_id}"
                })
        return result

    def generate_mjpeg(self, cam_id: str):
        while True:
            frame_bytes = self.get_frame(cam_id)
            if frame_bytes is not None:
                yield (b"--frame\r\n"
                       b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n")
            time.sleep(0.04) # ~25 FPS delivery

# Global singleton
_manager_instance = None

def get_stream_manager():
    global _manager_instance
    if _manager_instance is None:
        _manager_instance = StreamManager()
    return _manager_instance
