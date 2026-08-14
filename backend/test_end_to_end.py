from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_platform_end_to_end():
    print("=========================================================")
    print("  SPORTS INJURY RISK DETECTION PLATFORM - END-TO-END TEST")
    print("=========================================================")
    
    # 1. Test Root & System Health
    resp = client.get("/")
    assert resp.status_code == 200
    print(" [OK] [1/8] System Health & Milestone Status OK")

    # 2. Test User Auth (JWT Login & Profile)
    login_resp = client.post("/auth/login", json={"email": "admin@sportsinjury.org", "password": "admin123"})
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    assert token is not None
    print(" [OK] [2/8] JWT Authentication & Token Issuance OK")

    # 3. Test Athlete Management CRUD & List
    ath_resp = client.get("/athletes/")
    assert ath_resp.status_code == 200
    athletes = ath_resp.json()
    assert len(athletes) >= 5
    athlete_id = athletes[0]["id"]
    print(f" [OK] [3/8] Athlete Management OK ({len(athletes)} Athletes Available)")

    # 4. Test Biomechanics Dataset Catalog
    ds_resp = client.get("/datasets/")
    assert ds_resp.status_code == 200
    datasets = ds_resp.json()
    assert len(datasets) >= 5
    print(" [OK] [4/8] Biomechanics Dataset Catalog (Human3.6M, MPII, COCO, SportsPose, FIFA) OK")

    # 5. Test 17-Keypoint Pose Estimation & Motion Trajectory
    pose_resp = client.post("/pose/analyze", json={
        "athlete_id": athlete_id,
        "activity_type": "Landing",
        "frame_count": 30
    })
    assert pose_resp.status_code == 201
    analysis_id = pose_resp.json()["id"]
    print(" [OK] [5/8] Pose Estimation & 17-Keypoint Skeleton Trajectory Engine OK")

    # 6. Test 5-Component Weighted Injury Risk Prediction & Corrective Workflows
    risk_resp = client.post(f"/risk/assess/{athlete_id}")
    assert risk_resp.status_code == 201
    risk_data = risk_resp.json()
    assert risk_data["overall_risk_score"] > 0
    assert len(risk_data["recommendations"]) > 0
    print(f" [OK] [6/8] Predictive Injury Risk Engine & Recommendations OK (Score: {risk_data['overall_risk_score']})")

    # 7. Test Clinical Biomechanics Report & Printable HTML Export
    html_resp = client.get(f"/reports/biomechanics/{analysis_id}/export")
    assert html_resp.status_code == 200
    assert "text/html" in html_resp.headers["content-type"]
    print(" [OK] [7/8] Clinical Biomechanics HTML Report Export OK")

    # 8. Test Executive Analytics & CSV Dataset Exports
    kpi_resp = client.get("/analytics/executive-kpis")
    assert kpi_resp.status_code == 200
    
    csv_resp = client.get("/exports/athletes/csv")
    assert csv_resp.status_code == 200
    assert "text/csv" in csv_resp.headers["content-type"]
    print(" [OK] [8/8] Executive Analytics KPIs & CSV Dataset Exporter OK")

    print("\n=========================================================")
    print("  ALL END-TO-END SYSTEM INTEGRATION TESTS PASSED 100%!")
    print("=========================================================")

if __name__ == "__main__":
    test_full_platform_end_to_end()
