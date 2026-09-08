"""
IBVAP - Model Downloader
Downloads official pretrained model weights into models/ directory.
"""
import os
import sys
import shutil
from pathlib import Path
from ultralytics import YOLO

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
OBJ_DET_DIR = MODELS_DIR / "object_detection"
FACE_DIR = MODELS_DIR / "face"
OCR_DIR = MODELS_DIR / "ocr"

def setup_directories():
    for d in [OBJ_DET_DIR, FACE_DIR, OCR_DIR]:
        d.mkdir(parents=True, exist_ok=True)
    print("[✓] Model directories initialized.")

import urllib.request
import ssl

def download_file(url, target_path):
    print(f"[*] Downloading {url} -> {target_path}", flush=True)
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    opener = urllib.request.build_opener(urllib.request.HTTPSHandler(context=ctx))
    opener.addheaders = [('User-Agent', 'Mozilla/5.0')]
    with opener.open(url) as response, open(target_path, 'wb') as out_file:
        data = response.read()
        out_file.write(data)
    print(f"[✓] Downloaded {target_path.name}: {target_path.stat().st_size} bytes", flush=True)

def download_object_detection_models():
    target_n = OBJ_DET_DIR / "yolov8n.pt"
    if not target_n.exists():
        url = "https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov8n.pt"
        try:
            download_file(url, target_n)
        except Exception as e:
            print(f"[!] Direct download failed: {e}. Falling back to YOLO API...", flush=True)
            from ultralytics import YOLO
            model = YOLO("yolov8n.pt")
            shutil.copy("yolov8n.pt", target_n)
    else:
        print(f"[✓] YOLOv8n already exists at: {target_n}", flush=True)

if __name__ == "__main__":
    setup_directories()
    download_object_detection_models()
    print("[✓] Pretrained models check complete.")
