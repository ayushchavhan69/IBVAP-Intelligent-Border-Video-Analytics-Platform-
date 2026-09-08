"""
IBVAP - YOLOv8 Object Detection & ByteTrack Engine
Provides real-time multi-class object detection and persistent tracking.
"""
from pathlib import Path
from ultralytics import YOLO
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "models" / "object_detection" / "yolov8n.pt"

# Relevant COCO classes for border surveillance
SURVEILLANCE_CLASSES = {
    0: "person",
    1: "bicycle",
    2: "car",
    3: "motorcycle",
    5: "bus",
    7: "truck"
}

CLASS_COLORS = {
    "person": "#10B981",    # Emerald Green
    "car": "#3B82F6",       # Tactical Blue
    "truck": "#A855F7",     # Amber / Purple
    "bus": "#F59E0B",       # Golden Amber
    "motorcycle": "#06B6D4",# Cyan
    "bicycle": "#6366F1",   # Indigo
    "intrusion": "#EF4444"  # Critical Crimson
}

class ObjectDetector:
    def __init__(self, conf_threshold=0.30):
        self.conf_threshold = conf_threshold
        print(f"[*] Initializing YOLOv8 Object Detector from {MODEL_PATH.name}...")
        self.model = YOLO(str(MODEL_PATH))
        print("[OK] YOLOv8 Object Detector loaded successfully.")

    def detect_and_track(self, frame: np.ndarray, persist=True):
        """
        Runs inference and ByteTrack tracker on a single BGR frame.
        Returns: list of detections with normalized boxes and track IDs.
        """
        h, w = frame.shape[:2]
        # Run tracking on frame
        try:
            results = self.model.track(
                frame,
                persist=persist,
                conf=self.conf_threshold,
                classes=list(SURVEILLANCE_CLASSES.keys()),
                tracker="bytetrack.yaml",
                verbose=False
            )
        except Exception:
            # Fallback to standard detect if track fails
            results = self.model(
                frame,
                conf=self.conf_threshold,
                classes=list(SURVEILLANCE_CLASSES.keys()),
                verbose=False
            )

        detections = []
        if not results or len(results) == 0:
            return detections

        boxes = results[0].boxes
        if boxes is None or len(boxes) == 0:
            return detections

        for i, box in enumerate(boxes):
            cls_id = int(box.cls[0].item())
            cls_name = SURVEILLANCE_CLASSES.get(cls_id, "unknown")
            conf = float(box.conf[0].item())
            
            # Coordinates
            xyxy = box.xyxy[0].tolist()
            x1, y1, x2, y2 = xyxy
            bw = x2 - x1
            bh = y2 - y1

            # Tracking ID if available
            track_id = int(box.id[0].item()) if (box.id is not None and len(box.id) > 0) else (i + 1)

            # Normalized percentages for frontend CSS overlay
            top_pct = f"{(y1 / h) * 100:.1f}%"
            left_pct = f"{(x1 / w) * 100:.1f}%"
            width_pct = f"{(bw / w) * 100:.1f}%"
            height_pct = f"{(bh / h) * 100:.1f}%"

            detections.append({
                "label": f"{cls_name.capitalize()} {int(conf * 100)}%",
                "type": cls_name,
                "confidence": round(conf, 2),
                "track_id": track_id,
                "color": CLASS_COLORS.get(cls_name, "#10B981"),
                "box_pixels": [int(x1), int(y1), int(bw), int(bh)],
                "box": {
                    "top": top_pct,
                    "left": left_pct,
                    "width": width_pct,
                    "height": height_pct
                }
            })

        return detections
