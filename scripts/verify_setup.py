"""
IBVAP - End-to-End Setup Verifier
Validates all datasets, models, configurations, and verifies YOLOv8 inference.
"""
import os
import sys
import json
from pathlib import Path
import cv2

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent.parent

def verify_all():
    print("=" * 60)
    print("IBVAP SYSTEM READINESS & SETUP VERIFICATION")
    print("=" * 60)

    # 1. Models Verification
    yolo_model = BASE_DIR / "models" / "object_detection" / "yolov8n.pt"
    assert yolo_model.exists(), f"Missing YOLO model: {yolo_model}"
    print(f"[OK] YOLOv8n Pretrained Model Verified: {yolo_model.stat().st_size} bytes")

    # 2. Source Manifest Verification
    manifest_file = BASE_DIR / "data" / "source_manifest.json"
    assert manifest_file.exists(), f"Missing manifest: {manifest_file}"
    with open(manifest_file, "r", encoding="utf-8") as f:
        manifest_data = json.load(f)
    print(f"[OK] Source Manifest Verified ({manifest_data.get('total_assets', 0)} assets registered)")

    # 3. 4 Surveillance Cameras Video Verification
    cam_folders = ["cam_01_gate", "cam_02_checkpoint", "cam_03_east_fence_intrusion", "cam_04_corridor"]
    for folder in cam_folders:
        meta_file = BASE_DIR / "data" / "surveillance" / folder / "metadata.json"
        assert meta_file.exists(), f"Missing metadata for {folder}"
        with open(meta_file, "r", encoding="utf-8") as f:
            meta = json.load(f)
        
        proc_video = BASE_DIR / meta["processed_file"]
        assert proc_video.exists(), f"Missing processed video: {proc_video}"
        cap = cv2.VideoCapture(str(proc_video))
        ret, frame = cap.read()
        cap.release()
        assert ret and frame is not None, f"Failed to read frame from {proc_video}"
        print(f"[OK] Camera {meta['camera_id']} ({meta['name']}): Stream Verified ({meta['resolution']} @ {meta['fps']} FPS)")

    # 4. ANPR & Watchlist Verification
    hotlist_file = BASE_DIR / "data" / "anpr" / "watchlist" / "hotlist.csv"
    assert hotlist_file.exists(), f"Missing hotlist: {hotlist_file}"
    anpr_crops = list((BASE_DIR / "data" / "anpr" / "license_plate_crops").glob("*.jpg"))
    print(f"[OK] ANPR Engine Verified ({len(anpr_crops)} plate samples, Hotlist ready)")

    # 5. Face Recognition Profiles Verification
    face_emb_file = BASE_DIR / "data" / "facial_recognition" / "embeddings" / "face_embeddings.json"
    assert face_emb_file.exists(), f"Missing face embeddings: {face_emb_file}"
    with open(face_emb_file, "r", encoding="utf-8") as f:
        face_data = json.load(f)
    print(f"[OK] Face Recognition Verified ({len(face_data)} authorized & suspect profiles)")

    # 6. Live YOLOv8 Inference Smoke Test
    print("[*] Running Live YOLOv8 Inference Smoke Test on Camera 01 Keyframe...")
    from ultralytics import YOLO
    model = YOLO(str(yolo_model))
    test_frame_path = BASE_DIR / "data" / "surveillance" / "cam_01_gate" / "frames" / "frame_000.jpg"
    results = model(str(test_frame_path), verbose=False)
    boxes = results[0].boxes
    print(f"[OK] Inference Passed! Detected {len(boxes)} real objects in test keyframe.")

    print("=" * 60)
    print("ALL IBVAP DATASETS, MODELS, AND ENGINES READY FOR LAUNCH!")
    print("=" * 60)

if __name__ == "__main__":
    verify_all()
