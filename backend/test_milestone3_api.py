from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_weighted_injury_risk_assessment():
    print("Testing Weighted Injury Risk Assessment API...")
    resp = client.post("/risk/assess/1")
    assert resp.status_code == 201
    data = resp.json()
    
    assert "overall_risk_score" in data
    assert "risk_category" in data
    assert data["risk_category"] in ["Low Risk", "Moderate Risk", "High Risk", "Critical Risk"]
    
    # Verify 6 Injury Category Probabilities
    assert data["acl_risk_percent"] > 0
    assert data["hamstring_risk_percent"] > 0
    assert data["ankle_risk_percent"] > 0
    assert data["shoulder_risk_percent"] > 0
    assert data["lower_back_risk_percent"] > 0
    assert data["overuse_risk_percent"] > 0
    
    # Verify Corrective Recommendations
    assert len(data["recommendations"]) > 0
    print(f" -> Assessment Passed: Athlete 1 Risk Score = {data['overall_risk_score']} ({data['risk_category']})")

def test_team_risk_overview():
    print("Testing Team Risk Overview & Heatmap Endpoint...")
    resp = client.get("/risk/team-overview")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_athletes"] >= 5
    assert "risk_distribution" in data
    assert "Low Risk" in data["risk_distribution"]
    print(f" -> Team Overview Passed ({data['total_athletes']} Athletes Processed)")

def test_athlete_recommendations():
    print("Testing Corrective Recommendations Endpoint...")
    resp = client.get("/risk/recommendations/1")
    assert resp.status_code == 200
    recs = resp.json()
    assert len(recs) > 0
    print(f" -> Recommendations Endpoint Passed ({len(recs)} Corrective Protocols)")

if __name__ == "__main__":
    print("Starting Milestone 3 Verification Tests...")
    test_weighted_injury_risk_assessment()
    test_team_risk_overview()
    test_athlete_recommendations()
    print("All Milestone 3 Predictive & Scoring Engine Tests Passed Cleanly!")
