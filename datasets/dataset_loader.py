import json
import os
import math

def load_sample_keypoints(filepath: str = "datasets/sample_keypoints.json") -> dict:
    if not os.path.exists(filepath):
        # Fallback path if run from backend directory
        filepath = os.path.join("..", filepath)
    
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

def calculate_joint_angle(p1: dict, p2: dict, p3: dict) -> float:
    """Calculates angle (in degrees) formed by three keypoint nodes (p1-p2-p3) at vertex p2."""
    v1 = (p1["x"] - p2["x"], p1["y"] - p2["y"])
    v2 = (p3["x"] - p2["x"], p3["y"] - p2["y"])
    
    dot_product = v1[0]*v2[0] + v1[1]*v2[1]
    mag1 = math.sqrt(v1[0]**2 + v1[1]**2)
    mag2 = math.sqrt(v2[0]**2 + v2[1]**2)
    
    if mag1 == 0 or mag2 == 0:
        return 0.0
    
    cosine = max(-1.0, min(1.0, dot_product / (mag1 * mag2)))
    angle_rad = math.acos(cosine)
    return math.degrees(angle_rad)

if __name__ == "__main__":
    keypoint_data = load_sample_keypoints()
    print(f"Loaded {keypoint_data['keypoint_count']} keypoints for '{keypoint_data['dataset_name']}'")
    kps = {kp["id"]: kp for kp in keypoint_data["keypoints"]}
    left_knee_angle = calculate_joint_angle(kps[11], kps[13], kps[15]) # Hip - Knee - Ankle
    print(f"Sample Left Knee Joint Angle: {left_knee_angle:.2f} degrees")
