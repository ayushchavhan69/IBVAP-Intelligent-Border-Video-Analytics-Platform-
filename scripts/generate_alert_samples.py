"""
IBVAP - Alert Evidence Snapshot Generator
Extracts real CCTV keyframes from surveillance videos, draws forensic AI HUD bounding boxes,
and produces real-life alert preview images in public/assets/alerts/.
"""
import os
import sys
from pathlib import Path
import cv2
import numpy as np

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent.parent
SURV_DIR = BASE_DIR / "data" / "surveillance"
ALERTS_DIR = BASE_DIR / "public" / "assets" / "alerts"
ALERTS_DIR.mkdir(parents=True, exist_ok=True)

def generate_samples():
    print("[*] Generating real-life forensic alert snapshots...")

    # 1. East Fence Intrusion Alert
    cam3_video = SURV_DIR / "cam_03_east_fence_intrusion" / "videos" / "processed" / "fence_intrusion_loop.mp4"
    if cam3_video.exists():
        cap = cv2.VideoCapture(str(cam3_video))
        cap.set(cv2.CAP_PROP_POS_FRAMES, 150)
        ret, frame = cap.read()
        cap.release()
        if ret:
            h, w = frame.shape[:2]
            # Draw crimson restricted polygon
            poly = np.array([[int(0.15*w), int(0.40*h)], [int(0.85*w), int(0.40*h)], [int(0.95*w), int(0.90*h)], [int(0.10*w), int(0.90*h)]], np.int32)
            cv2.polylines(frame, [poly], True, (0, 0, 240), 3)
            # Intruder bounding box
            bx, by, bw, bh = int(0.42*w), int(0.50*h), int(0.12*w), int(0.35*h)
            cv2.rectangle(frame, (bx, by), (bx+bw, by+bh), (0, 0, 240), 3)
            cv2.putText(frame, "INTRUSION: SUBJECT #14 (94%)", (bx, by - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 0, 255), 2)
            # HUD stamp
            cv2.putText(frame, "BOP ALPHA - EAST FENCE | CRITICAL BREACH | 11:28:31 AM", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 128), 2)
            cv2.imwrite(str(ALERTS_DIR / "alert_fence_breach.jpg"), frame)
            print("  [OK] alert_fence_breach.jpg created.")

    # 2. Checkpoint ANPR Watchlist Intercept
    cam2_video = SURV_DIR / "cam_02_checkpoint" / "videos" / "processed" / "checkpoint_loop.mp4"
    if cam2_video.exists():
        cap = cv2.VideoCapture(str(cam2_video))
        cap.set(cv2.CAP_PROP_POS_FRAMES, 80)
        ret, frame = cap.read()
        cap.release()
        if ret:
            h, w = frame.shape[:2]
            # Vehicle box
            vx, vy, vw, vh = int(0.30*w), int(0.20*h), int(0.40*w), int(0.55*h)
            cv2.rectangle(frame, (vx, vy), (vx+vw, vy+vh), (180, 0, 240), 2)
            # Mount actual plate crop on snapshot
            plate_crop_file = BASE_DIR / "data" / "anpr" / "license_plate_crops" / "PB10MF1234.jpg"
            if plate_crop_file.exists():
                plate_img = cv2.imread(str(plate_crop_file))
                plate_resized = cv2.resize(plate_img, (220, 55))
                frame[20:75, w - 240:w - 20] = plate_resized
                cv2.rectangle(frame, (w - 242, 18), (w - 18, 77), (0, 0, 255), 2)
            cv2.putText(frame, "ANPR HIT: PB10MF1234 [STOLEN - HIGH PRIORITY]", (vx, vy - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (180, 0, 255), 2)
            cv2.putText(frame, "ROAD 32 CHECKPOST | BARRIER INTERCEPT LOCK", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 255, 128), 2)
            cv2.imwrite(str(ALERTS_DIR / "alert_anpr_intercept.jpg"), frame)
            print("  [OK] alert_anpr_intercept.jpg created.")

    # 3. Facial Recognition Watchlist Hit
    suspect_portrait = BASE_DIR / "data" / "facial_recognition" / "suspects" / "suspect_001" / "profile.jpg"
    if suspect_portrait.exists():
        s_img = cv2.imread(str(suspect_portrait))
        s_h, s_w = s_img.shape[:2]
        # Draw biometric scan HUD
        cv2.rectangle(s_img, (30, 30), (s_w - 30, s_h - 40), (0, 0, 255), 2)
        cv2.putText(s_img, "WATCHLIST MATCH: 94%", (15, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
        cv2.putText(s_img, "WLIST-SUS-991 [CRITICAL]", (15, s_h - 15), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1)
        cv2.imwrite(str(ALERTS_DIR / "alert_face_suspect.jpg"), s_img)
        print("  [OK] alert_face_suspect.jpg created.")

    # 4. Corridor Heavy Vehicle / Loitering Warning
    cam4_video = SURV_DIR / "cam_04_corridor" / "videos" / "processed" / "corridor_transit_loop.mp4"
    if cam4_video.exists():
        cap = cv2.VideoCapture(str(cam4_video))
        cap.set(cv2.CAP_PROP_POS_FRAMES, 200)
        ret, frame = cap.read()
        cap.release()
        if ret:
            h, w = frame.shape[:2]
            # Vehicle / loitering box
            cv2.rectangle(frame, (int(0.2*w), int(0.3*h)), (int(0.6*w), int(0.7*h)), (0, 165, 255), 2)
            cv2.putText(frame, "LOITERING ALERT: DWELL TIME > 180s", (int(0.2*w), int(0.3*h) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 165, 255), 2)
            cv2.putText(frame, "SECTOR 7 PATROL ROAD | PROHIBITED CORRIDOR", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 255, 128), 2)
            cv2.imwrite(str(ALERTS_DIR / "alert_corridor_loitering.jpg"), frame)
            print("  [OK] alert_corridor_loitering.jpg created.")

    # 5. Gate Unauthorized Access
    cam1_video = SURV_DIR / "cam_01_gate" / "videos" / "processed" / "gate_surveillance_loop.mp4"
    if cam1_video.exists():
        cap = cv2.VideoCapture(str(cam1_video))
        cap.set(cv2.CAP_PROP_POS_FRAMES, 100)
        ret, frame = cap.read()
        cap.release()
        if ret:
            h, w = frame.shape[:2]
            cv2.rectangle(frame, (int(0.25*w), int(0.25*h)), (int(0.55*w), int(0.85*h)), (0, 165, 255), 2)
            cv2.putText(frame, "UNAUTHORIZED ACCESS: NO BADGE", (int(0.25*w), int(0.25*h) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 165, 255), 2)
            cv2.putText(frame, "BOP ALPHA - MAIN GATE | ACCESS ANOMALY", (20, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 255, 128), 2)
            cv2.imwrite(str(ALERTS_DIR / "alert_gate_unauthorized.jpg"), frame)
            print("  [OK] alert_gate_unauthorized.jpg created.")

    # 6. Thermal Perimeter Night Vision Breach
    if cam3_video.exists():
        cap = cv2.VideoCapture(str(cam3_video))
        cap.set(cv2.CAP_PROP_POS_FRAMES, 300)
        ret, frame = cap.read()
        cap.release()
        if ret:
            # Apply thermal colormap
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            thermal = cv2.applyColorMap(gray, cv2.COLORMAP_INFERNO)
            h, w = thermal.shape[:2]
            cv2.rectangle(thermal, (int(0.4*w), int(0.45*h)), (int(0.6*w), int(0.85*h)), (0, 255, 255), 2)
            cv2.putText(thermal, "THERMAL IR ANOMALY: HEAT SIGNATURE DETECTED", (int(0.2*w), int(0.45*h) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
            cv2.putText(thermal, "ZERO LINE CORRIDOR | NIGHT IR SENSOR", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)
            cv2.imwrite(str(ALERTS_DIR / "alert_thermal_breach.jpg"), thermal)
            print("  [OK] alert_thermal_breach.jpg created.")

    # 7. Hotlist Wanted Vehicle Intercept
    plate_mh = BASE_DIR / "data" / "anpr" / "license_plate_crops" / "MH12AB5678.jpg"
    if plate_mh.exists():
        p_img = cv2.imread(str(plate_mh))
        canvas = np.zeros((240, 360, 3), dtype=np.uint8)
        canvas[:] = (35, 40, 45)
        # paste plate in center
        p_resized = cv2.resize(p_img, (300, 75))
        canvas[90:165, 30:330] = p_resized
        cv2.rectangle(canvas, (28, 88), (332, 167), (0, 0, 255), 2)
        cv2.putText(canvas, "HOTLIST HIT: MH12AB5678", (20, 45), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 0, 255), 2)
        cv2.putText(canvas, "STATUS: WANTED (CONTRABAND TRANSIT)", (20, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 200, 255), 1)
        cv2.putText(canvas, "CHECK POST 32 | AUTOMATED BARRIER ENGAGED", (15, 210), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 128), 1)
        cv2.imwrite(str(ALERTS_DIR / "alert_hotlist_mh12.jpg"), canvas)
        print("  [OK] alert_hotlist_mh12.jpg created.")

if __name__ == "__main__":
    generate_samples()
    print("[OK] All forensic alert samples generated in public/assets/alerts/.")
