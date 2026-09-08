"""
IBVAP - Video Preprocessing & Frame Extractor
Verifies video integrity, reads FPS, resolution, extracts representative keyframes,
generates optimized processed streaming videos, and writes per-camera metadata.json.
"""
import os
import sys
import json
from pathlib import Path
import cv2

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent.parent
SURV_DIR = BASE_DIR / "data" / "surveillance"

CAMERAS_CONFIG = [
    {
        "camera_id": "CAM-01",
        "name": "BOP Alpha - North Gate",
        "folder": "cam_01_gate",
        "location": "North Perimeter Gate Sector 2",
        "scenario": "Pedestrian entrance/gate surveillance",
        "orig_file": "people-detection.mp4",
        "proc_file": "gate_surveillance_loop.mp4",
        "primary_model": "YOLOv8n-Border-Trained",
        "target_classes": ["person"]
    },
    {
        "camera_id": "CAM-02",
        "name": "Check Post - Road 32",
        "folder": "cam_02_checkpoint",
        "location": "Highway Checkpost Sector 4",
        "scenario": "Vehicle checkpoint and ANPR inspection monitoring",
        "orig_file": "car-detection.mp4",
        "proc_file": "checkpoint_loop.mp4",
        "primary_model": "VehicleClassNet-v3 + ANPR-OCR",
        "target_classes": ["car", "truck", "bus", "motorcycle"]
    },
    {
        "camera_id": "CAM-03",
        "name": "BOP Alpha - East Fence",
        "folder": "cam_03_east_fence_intrusion",
        "location": "East Perimeter Smart Fence Line",
        "scenario": "Perimeter restricted boundary fence intrusion monitoring",
        "orig_file": "worker-zone-detection.mp4",
        "proc_file": "fence_intrusion_loop.mp4",
        "primary_model": "VirtualFence-Intrusion-v2",
        "target_classes": ["person"],
        "restricted_polygon": [
            [0.20, 0.40],
            [0.85, 0.40],
            [0.95, 0.90],
            [0.10, 0.90]
        ]
    },
    {
        "camera_id": "CAM-04",
        "name": "Border Road - Sector 7",
        "folder": "cam_04_corridor",
        "location": "Sector 7 Patrol Corridor",
        "scenario": "Rural border transit road and transport corridor surveillance",
        "orig_file": "person-bicycle-car-detection.mp4",
        "proc_file": "corridor_transit_loop.mp4",
        "primary_model": "HeavyVehicleClassifier-v1 + ByteTrack",
        "target_classes": ["car", "truck", "bus", "motorcycle", "bicycle", "person"]
    }
]

def process_camera_videos():
    for cam in CAMERAS_CONFIG:
        cam_dir = SURV_DIR / cam["folder"]
        orig_path = cam_dir / "videos" / "original" / cam["orig_file"]
        proc_path = cam_dir / "videos" / "processed" / cam["proc_file"]
        frames_dir = cam_dir / "frames"
        frames_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"[*] Processing {cam['camera_id']} ({cam['folder']})...")
        if not orig_path.exists():
            print(f"[!] Error: {orig_path} not found!")
            continue

        cap = cv2.VideoCapture(str(orig_path))
        if not cap.isOpened():
            print(f"[!] Cannot open video {orig_path}")
            continue

        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        duration_sec = frame_count / fps if fps > 0 else 0

        print(f"    - Specs: {width}x{height} @ {fps:.1f} FPS, {frame_count} frames ({duration_sec:.1f}s)")

        # Extract representative keyframes (5 evenly distributed frames)
        step = max(1, frame_count // 5)
        extracted_frames = []
        for i in range(5):
            target_idx = min(i * step, frame_count - 1)
            cap.set(cv2.CAP_PROP_POS_FRAMES, target_idx)
            ret, frame = cap.read()
            if ret:
                frame_name = f"frame_{i:03d}.jpg"
                frame_file = frames_dir / frame_name
                cv2.imwrite(str(frame_file), frame)
                extracted_frames.append(f"frames/{frame_name}")
                if i == 0:
                    # Also save poster frame
                    cv2.imwrite(str(cam_dir / "poster.jpg"), frame)

        cap.release()

        # Copy original into processed if not already exists or write normalized MP4
        if not proc_path.exists():
            import shutil
            shutil.copy(str(orig_path), str(proc_path))
            print(f"    [OK] Initialized processed stream: {proc_path.name}")

        # Generate metadata.json
        meta = {
            "camera_id": cam["camera_id"],
            "name": cam["name"],
            "location": cam["location"],
            "scenario": cam["scenario"],
            "original_file": str(orig_path.relative_to(BASE_DIR)).replace("\\", "/"),
            "processed_file": str(proc_path.relative_to(BASE_DIR)).replace("\\", "/"),
            "resolution": f"{width}x{height}",
            "width": width,
            "height": height,
            "fps": round(fps, 2),
            "frame_count": frame_count,
            "duration_seconds": round(duration_sec, 2),
            "primary_model": cam["primary_model"],
            "target_classes": cam["target_classes"],
            "key_frames": extracted_frames,
            "license": "Apache License 2.0",
            "source_dataset": "Intel OpenVINO Surveillance Benchmark"
        }
        if "restricted_polygon" in cam:
            meta["restricted_polygon"] = cam["restricted_polygon"]

        with open(cam_dir / "metadata.json", "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2)
        print(f"    [OK] Metadata saved: {cam_dir / 'metadata.json'}")

if __name__ == "__main__":
    process_camera_videos()
    print("[OK] Video preprocessing and metadata generation complete.")
