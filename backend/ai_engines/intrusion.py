"""
IBVAP - Virtual Fence Intrusion & Restricted Zone Engine
Calculates spatial boundary breaches using geometric polygon containment.
"""
import cv2
import numpy as np

class IntrusionDetector:
    def __init__(self, polygon=None):
        # Default polygon coordinates (normalized 0.0 to 1.0)
        # Coordinates covering the perimeter fence line in Camera 03
        self.default_polygon = [
            [0.15, 0.40],
            [0.85, 0.40],
            [0.95, 0.90],
            [0.10, 0.90]
        ] if polygon is None else polygon

    def get_pixel_polygon(self, width: int, height: int):
        pts = [[int(x * width), int(y * height)] for x, y in self.default_polygon]
        return np.array(pts, dtype=np.int32)

    def check_intrusion(self, detections: list, frame_width: int, frame_height: int):
        """
        Evaluates person detections against the restricted perimeter polygon.
        Returns: tuple of (is_breached, list of breach events)
        """
        poly_pts = self.get_pixel_polygon(frame_width, frame_height)
        breaches = []

        for det in detections:
            if det["type"] != "person":
                continue

            # Person ground contact point (bottom-center of bounding box)
            x, y, w, h = det["box_pixels"]
            foot_x = x + (w // 2)
            foot_y = y + h

            # Point-in-polygon test (>= 0 means inside or on contour)
            inside = cv2.pointPolygonTest(poly_pts, (float(foot_x), float(foot_y)), False) >= 0

            if inside:
                # Mark detection as active critical intrusion
                det["type"] = "intrusion"
                det["label"] = f"Intrusion {int(det['confidence'] * 100)}%"
                det["color"] = "#EF4444"
                det["alert_level"] = "critical"
                
                breaches.append({
                    "track_id": det.get("track_id", 1),
                    "confidence": det["confidence"],
                    "location": "BOP Alpha - East Fence",
                    "details": f"Automated virtual fence breach: Subject #{det.get('track_id', 1)} crossed boundary line into restricted sector.",
                    "box": det["box"]
                })

        return len(breaches) > 0, breaches

    def draw_zone_on_frame(self, frame: np.ndarray, is_breached: bool = False):
        """
        Draws tactical glowing HUD boundary overlay on video frame.
        """
        h, w = frame.shape[:2]
        pts = self.get_pixel_polygon(w, h)
        
        # Color: Crimson if breached, glowing Amber/Cyan if active standby
        line_color = (0, 0, 240) if is_breached else (240, 180, 0)
        fill_color = (0, 0, 180) if is_breached else (200, 120, 0)

        # Translucent polygon fill
        overlay = frame.copy()
        cv2.fillPoly(overlay, [pts], fill_color)
        alpha = 0.25 if not is_breached else 0.40
        cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0, frame)

        # Boundary perimeter line
        cv2.polylines(frame, [pts], isClosed=True, color=line_color, thickness=2, lineType=cv2.LINE_AA)

        # Zone Tactical Badge
        center_x = int(pts[:, 0].mean())
        center_y = int(pts[:, 1].min()) - 10
        badge_text = "CRITICAL: ZONE BREACH" if is_breached else "RESTRICTED PERIMETER ZONE"
        cv2.putText(frame, badge_text, (center_x - 110, center_y), cv2.FONT_HERSHEY_SIMPLEX, 0.55, line_color, 2, cv2.LINE_AA)

        return frame
