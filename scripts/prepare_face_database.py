"""
IBVAP - Facial Recognition Database Preparer
Configures authorized personnel vs suspect profiles and generates feature embeddings.
"""
import os
import sys
import json
from pathlib import Path
import numpy as np
import cv2

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent.parent
FACE_DIR = BASE_DIR / "data" / "facial_recognition"
AUTH_DIR = FACE_DIR / "authorized"
SUSPECT_DIR = FACE_DIR / "suspects"
EMBEDDINGS_DIR = FACE_DIR / "embeddings"

# Structured Operational Person Profiles
PERSONNEL = [
    {
        "id": "person_001",
        "name": "Inspector R. K. Sharma",
        "rank": "BSF Duty Officer",
        "category": "authorized",
        "badge_id": "BSF-9201",
        "clearance": "Level 4 (Tactical Command)"
    },
    {
        "id": "person_002",
        "name": "Sub-Inspector Pooja Verma",
        "rank": "Surveillance Analyst",
        "category": "authorized",
        "badge_id": "BSF-9415",
        "clearance": "Level 3 (Operational)"
    },
    {
        "id": "person_003",
        "name": "Constable Harpreet Singh",
        "rank": "Border Outpost Security",
        "category": "authorized",
        "badge_id": "BSF-7823",
        "clearance": "Level 2 (Gate Security)"
    },
    {
        "id": "suspect_001",
        "name": "Target Alpha - Unknown Infiltrator",
        "rank": "Watchlist Suspect",
        "category": "suspects",
        "badge_id": "WLIST-SUS-991",
        "clearance": "FLAGGED - Immediate Intercept"
    },
    {
        "id": "suspect_002",
        "name": "Target Bravo - Cross-Border Transgressor",
        "rank": "Watchlist Suspect",
        "category": "suspects",
        "badge_id": "WLIST-SUS-992",
        "clearance": "FLAGGED - Red Alert"
    }
]

def setup_directories():
    for d in [FACE_DIR, AUTH_DIR, SUSPECT_DIR, EMBEDDINGS_DIR]:
        d.mkdir(parents=True, exist_ok=True)
    for p in PERSONNEL:
        target_dir = (AUTH_DIR if p["category"] == "authorized" else SUSPECT_DIR) / p["id"]
        target_dir.mkdir(parents=True, exist_ok=True)
    print("[OK] Facial recognition directories initialized.")

def generate_profile_portraits():
    """
    Creates normalized biometric facial signature portraits for operational profiles.
    """
    embeddings = {}
    for p in PERSONNEL:
        p_dir = (AUTH_DIR if p["category"] == "authorized" else SUSPECT_DIR) / p["id"]
        portrait_path = p_dir / "profile.jpg"
        
        # Create standard 256x256 facial biometric portrait canvas
        img = np.zeros((256, 256, 3), dtype=np.uint8)
        # Tactical ID badge backdrop
        bg_color = (40, 50, 60) if p["category"] == "authorized" else (40, 30, 60)
        img[:] = bg_color
        
        # Draw head / facial oval structure
        center = (128, 110)
        axes = (55, 70)
        face_skin = (175, 195, 220) if p["category"] == "authorized" else (160, 175, 205)
        cv2.ellipse(img, center, axes, 0, 0, 360, face_skin, -1)
        
        # Torso / Uniform shoulders
        uniform_color = (30, 80, 50) if p["category"] == "authorized" else (70, 70, 70)
        cv2.ellipse(img, (128, 250), (95, 80), 0, 0, 360, uniform_color, -1)
        
        # Eyes
        cv2.circle(img, (105, 100), 7, (40, 40, 40), -1)
        cv2.circle(img, (151, 100), 7, (40, 40, 40), -1)
        # Eyebrows
        cv2.line(img, (95, 88), (115, 88), (25, 25, 25), 2)
        cv2.line(img, (141, 88), (161, 88), (25, 25, 25), 2)
        # Nose
        cv2.line(img, (128, 105), (125, 122), (130, 150, 175), 2)
        cv2.line(img, (125, 122), (131, 122), (130, 150, 175), 2)
        # Mouth
        cv2.line(img, (115, 142), (141, 142), (100, 115, 140), 2)
        
        # Watermark profile ID badge at bottom
        cv2.rectangle(img, (0, 226), (256, 256), (15, 20, 25), -1)
        tag_text = f"{p['name'][:18]}"
        cv2.putText(img, tag_text, (8, 246), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (220, 220, 220), 1, cv2.LINE_AA)
        
        cv2.imwrite(str(portrait_path), img)
        
        # Compute normalized 128-d biometric feature vector
        # Using spatial color moments + gradient histogram as reproducible embedding
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        resized = cv2.resize(gray, (64, 64))
        # 128-dimensional deterministic normalized vector
        h_vec = np.mean(resized.reshape(16, 4, 16, 4), axis=(1, 3)).flatten()
        norm_embedding = (h_vec / (np.linalg.norm(h_vec) + 1e-7)).tolist()
        
        embeddings[p["id"]] = {
            "name": p["name"],
            "rank": p["rank"],
            "category": p["category"],
            "badge_id": p["badge_id"],
            "clearance": p["clearance"],
            "image_path": str(portrait_path.relative_to(BASE_DIR)).replace("\\", "/"),
            "embedding": norm_embedding
        }

    emb_file = EMBEDDINGS_DIR / "face_embeddings.json"
    with open(emb_file, "w", encoding="utf-8") as f:
        json.dump(embeddings, f, indent=2)
    print(f"[OK] Biometric face embeddings saved to: {emb_file}")

def create_metadata():
    metadata = {
        "dataset_name": "IBVAP Operational Biometric Identification Profiles",
        "profiles_count": len(PERSONNEL),
        "authorized_count": len([p for p in PERSONNEL if p["category"] == "authorized"]),
        "suspects_count": len([p for p in PERSONNEL if p["category"] == "suspects"]),
        "embedding_dimensions": 256,
        "matching_algorithm": "Cosine Similarity / L2 Euclidean Distance",
        "threshold": 0.72,
        "purpose": "Border gate face match and watchlist intercept alerting",
        "license": "Operational Demo / Synthetic Biometric Profiles"
    }
    with open(FACE_DIR / "metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"[OK] Face metadata saved to: {FACE_DIR / 'metadata.json'}")

if __name__ == "__main__":
    setup_directories()
    generate_profile_portraits()
    create_metadata()
    print("[OK] Facial recognition database setup complete.")
