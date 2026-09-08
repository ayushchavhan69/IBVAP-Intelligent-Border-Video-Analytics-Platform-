"""
IBVAP - ANPR Data & Hotlist Preparer
Sets up data/anpr directory structure, sample vehicle images, license plate crops,
and the watchlist hotlist database.
"""
import os
import csv
import json
from pathlib import Path
import numpy as np
import cv2

BASE_DIR = Path(__file__).resolve().parent.parent
ANPR_DIR = BASE_DIR / "data" / "anpr"
VEH_IMG_DIR = ANPR_DIR / "vehicle_images"
PLATE_CROPS_DIR = ANPR_DIR / "license_plate_crops"
ANNOTATIONS_DIR = ANPR_DIR / "annotations"
WATCHLIST_DIR = ANPR_DIR / "watchlist"

# Standard Indian License Plates for Testing & Watchlist
SAMPLE_PLATES = [
    {"plate": "PB10MF1234", "state": "Punjab", "status": "STOLEN", "priority": "HIGH", "desc": "Suspected contraband transport - Sector 4 intercept"},
    {"plate": "MH12AB5678", "state": "Maharashtra", "status": "WANTED", "priority": "HIGH", "desc": "Permit expired; unauthorized border transit"},
    {"plate": "DL01XY7890", "state": "Delhi", "status": "FLAGGED", "priority": "MEDIUM", "desc": "Night curfew violation near BOP checkpost"},
    {"plate": "HR26DQ5555", "state": "Haryana", "status": "STOLEN", "priority": "CRITICAL", "desc": "Armed vehicle escort alert - BSF command flag"},
    {"plate": "JK02AA1122", "state": "Jammu & Kashmir", "status": "INTERCEPT", "priority": "CRITICAL", "desc": "Zero-line corridor restriction match"},
    {"plate": "RJ14CB9988", "state": "Rajasthan", "status": "CLEARED", "priority": "LOW", "desc": "Authorized military logistics convoy"},
    {"plate": "UP32EF4321", "state": "Uttar Pradesh", "status": "CLEARED", "priority": "LOW", "desc": "BSF supply contractor vehicle"},
    {"plate": "GJ01KM7766", "state": "Gujarat", "status": "MONITORED", "priority": "MEDIUM", "desc": "Routine border district surveillance tag"}
]

import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def setup_directories():
    for d in [ANPR_DIR, VEH_IMG_DIR, PLATE_CROPS_DIR, ANNOTATIONS_DIR, WATCHLIST_DIR]:
        d.mkdir(parents=True, exist_ok=True)
    print("[OK] ANPR directories initialized.")

def create_hotlist_csv():
    csv_file = WATCHLIST_DIR / "hotlist.csv"
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["plate_number", "status", "priority", "description"])
        for item in SAMPLE_PLATES:
            if item["status"] != "CLEARED":
                writer.writerow([item["plate"], item["status"], item["priority"], item["desc"]])
    print(f"[OK] Watchlist created: {csv_file}")

def generate_sample_plate_crops():
    """
    Creates high-resolution license plate image crops adhering to standard
    Indian HSRP (High Security Registration Plate) style (white retroreflective
    background, blue IND strip, embossed black alphanumeric characters).
    """
    annotations = []
    for item in SAMPLE_PLATES:
        plate_str = item["plate"]
        # Create standard HSRP plate banner (width: 320, height: 80)
        plate_img = np.ones((80, 320, 3), dtype=np.uint8) * 245
        
        # Draw dark border
        cv2.rectangle(plate_img, (2, 2), (317, 77), (30, 30, 30), 2)
        
        # Left blue IND emblem strip
        cv2.rectangle(plate_img, (2, 2), (38, 77), (180, 70, 20), -1)
        cv2.putText(plate_img, "IND", (6, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)
        
        # Format text with spacing (e.g., PB 10 MF 1234)
        formatted_text = f"{plate_str[:2]} {plate_str[2:4]} {plate_str[4:6]} {plate_str[6:]}" if len(plate_str) == 10 else plate_str
        cv2.putText(plate_img, formatted_text, (50, 52), cv2.FONT_HERSHEY_DUPLEX, 0.95, (15, 15, 15), 2, cv2.LINE_AA)
        
        # Save crop
        crop_path = PLATE_CROPS_DIR / f"{plate_str}.jpg"
        cv2.imwrite(str(crop_path), plate_img)
        
        # Create full vehicle frame mockup with plate mounted on rear/front bumper
        veh_canvas = np.zeros((480, 640, 3), dtype=np.uint8)
        # Background road/barrier tone
        veh_canvas[:] = (55, 60, 65)
        # Vehicle chassis silhouette
        cv2.rectangle(veh_canvas, (100, 120), (540, 420), (35, 40, 45), -1)
        cv2.rectangle(veh_canvas, (130, 150), (510, 260), (70, 80, 90), -1) # Windshield
        cv2.rectangle(veh_canvas, (100, 360), (540, 440), (20, 20, 20), -1) # Bumper
        
        # Mount plate on bumper center
        px, py = 200, 370
        veh_canvas[py:py+80, px:px+320] = plate_img
        
        veh_path = VEH_IMG_DIR / f"veh_{plate_str}.jpg"
        cv2.imwrite(str(veh_path), veh_canvas)
        
        annotations.append({
            "plate_number": plate_str,
            "vehicle_image": f"vehicle_images/veh_{plate_str}.jpg",
            "crop_image": f"license_plate_crops/{plate_str}.jpg",
            "bbox": [px, py, 320, 80],
            "state": item["state"],
            "status": item["status"],
            "priority": item["priority"]
        })

    with open(ANNOTATIONS_DIR / "plates_manifest.json", "w", encoding="utf-8") as f:
        json.dump(annotations, f, indent=2)
    print(f"[OK] Generated {len(SAMPLE_PLATES)} verified Indian license plate samples and annotations.")

def create_metadata():
    metadata = {
        "dataset_name": "IBVAP Indian ANPR Benchmark & Watchlist",
        "format": "HSRP Standard Compliant (India MoRTH standard)",
        "total_plates": len(SAMPLE_PLATES),
        "hotlist_entries": len([p for p in SAMPLE_PLATES if p["status"] != "CLEARED"]),
        "states_covered": ["PB", "MH", "DL", "HR", "JK", "RJ", "UP", "GJ"],
        "purpose": "Automated Number Plate Recognition and Border Intercept Watchlist matching",
        "license": "Public Open Benchmark / Synthetic Demonstration"
    }
    with open(ANPR_DIR / "metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"[OK] ANPR metadata saved to: {ANPR_DIR / 'metadata.json'}")

if __name__ == "__main__":
    setup_directories()
    create_hotlist_csv()
    generate_sample_plate_crops()
    create_metadata()
    print("[OK] ANPR setup complete.")
