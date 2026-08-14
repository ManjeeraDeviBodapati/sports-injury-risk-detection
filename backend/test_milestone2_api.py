from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

ACTIVITIES = ["Squatting", "Landing", "Sprinting", "Jumping", "Cutting", "Running", "Throwing"]

def test_pose_estimation_and_biomechanics():
    print("Testing Pose Estimation & Biomechanics for all 7 Activities...")
    
    for act in ACTIVITIES:
        response = client.post("/pose/analyze", json={
            "athlete_id": 1,
            "activity_type": act,
            "frame_count": 30
        })
        assert response.status_code == 201
        data = response.json()
        assert data["activity_type"] == act
        assert data["frame_count"] == 30
        assert data["movement_quality_score"] > 0
        assert len(data["trajectory_json"]) == 30
        print(f" -> Pose Analysis for '{act}' passed (Quality Score: {data['movement_quality_score']})")

def test_biomechanics_breakdown():
    # Analyze a session
    resp = client.post("/pose/analyze", json={
        "athlete_id": 1,
        "activity_type": "Landing",
        "frame_count": 30
    })
    analysis_id = resp.json()["id"]

    # Test breakdown route
    bio_resp = client.get(f"/biomechanics/analysis/{analysis_id}")
    assert bio_resp.status_code == 200
    bio_data = bio_resp.json()
    assert "biomechanics_summary" in bio_data
    summary = bio_data["biomechanics_summary"]
    assert "movement_quality_score" in summary
    assert "symmetry_index_percent" in summary
    print(f" -> Biomechanics Breakdown Passed (Symmetry: {summary['symmetry_index_percent']}%)")

def test_reports_generation():
    # Analyze session
    resp = client.post("/pose/analyze", json={
        "athlete_id": 1,
        "activity_type": "Squatting",
        "frame_count": 30
    })
    analysis_id = resp.json()["id"]

    # Test JSON report
    json_report_resp = client.get(f"/reports/biomechanics/{analysis_id}")
    assert json_report_resp.status_code == 200
    report_data = json_report_resp.json()
    assert report_data["athlete_name"] == "Marcus Rashford"
    assert report_data["report_id"].startswith("REP-BIO-")

    # Test HTML export
    html_export_resp = client.get(f"/reports/biomechanics/{analysis_id}/export")
    assert html_export_resp.status_code == 200
    assert "text/html" in html_export_resp.headers["content-type"]
    assert "Sports Injury Intelligence Platform" in html_export_resp.text
    print(" -> Biomechanics Report Generation & HTML Export Passed!")

if __name__ == "__main__":
    print("Starting Milestone 2 Verification Tests...")
    test_pose_estimation_and_biomechanics()
    test_biomechanics_breakdown()
    test_reports_generation()
    print("All Milestone 2 API & Engine Tests Passed Cleanly!")
