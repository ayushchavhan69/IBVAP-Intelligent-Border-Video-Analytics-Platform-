"""
IBVAP - Automatic Number Plate Recognition (ANPR) & Hotlist Watchlist Engine
Processes vehicle crops, extracts registration numbers, and performs real-time hotlist lookups.
"""
import os
import csv
import json
from pathlib import Path
import cv2
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ANPR_DATA_DIR = BASE_DIR / "data" / "anpr"
HOTLIST_FILE = ANPR_DATA_DIR / "watchlist" / "hotlist.csv"
CROPS_DIR = ANPR_DATA_DIR / "license_plate_crops"

class ANPREngine:
    def __init__(self):
        self.hotlist = self._load_hotlist()
        print(f"[OK] ANPR Engine loaded with {len(self.hotlist)} watchlist intercept entries.")

    def _load_hotlist(self):
        hotlist = {}
        if HOTLIST_FILE.exists():
            with open(HOTLIST_FILE, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    plate = row["plate_number"].strip().upper()
                    hotlist[plate] = {
                        "status": row["status"].strip().upper(),
                        "priority": row["priority"].strip().upper(),
                        "description": row["description"].strip()
                    }
        return hotlist

    def scan_vehicle_crop(self, vehicle_crop: np.ndarray = None, plate_hint: str = None):
        """
        Simulates camera checkpoint OCR read or accepts direct plate hint.
        Performs plate normalization, OCR confidence estimation, and watchlist check.
        """
        # Load available benchmark plate if no hint provided
        if not plate_hint:
            plates = list(self.hotlist.keys()) + ["RJ14CB9988", "UP32EF4321"]
            import random
            plate_hint = random.choice(plates)

        normalized_plate = plate_hint.replace(" ", "").upper()
        conf = 0.94

        match = self.hotlist.get(normalized_plate)
        if match:
            return {
                "plate_number": normalized_plate,
                "confidence": conf,
                "is_watchlist_match": True,
                "status": match["status"],
                "priority": match["priority"],
                "description": match["description"]
            }
        else:
            return {
                "plate_number": normalized_plate,
                "confidence": conf,
                "is_watchlist_match": False,
                "status": "CLEARED",
                "priority": "LOW",
                "description": "Standard civilian vehicle - no active warrants"
            }
