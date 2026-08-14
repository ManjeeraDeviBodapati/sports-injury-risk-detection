from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["milestone"] == "Milestone 1 Completed"

def test_auth_login():
    # Login with seeded admin user
    response = client.post("/auth/login", json={
        "email": "admin@sportsinjury.org",
        "password": "admin123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "Administrator"
    assert data["user"]["email"] == "admin@sportsinjury.org"

def test_auth_me():
    # First login to get token
    login_resp = client.post("/auth/login", json={
        "email": "coach@sportsinjury.org",
        "password": "coach123"
    })
    token = login_resp.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    me_resp = client.get("/auth/me", headers=headers)
    assert me_resp.status_code == 200
    user_data = me_resp.json()
    assert user_data["role"] == "Coach"

def test_register_new_user():
    response = client.post("/auth/register", json={
        "full_name": "Test Physiotherapist",
        "email": "test_physio_2026@sportsinjury.org",
        "password": "securepass123",
        "role": "Physiotherapist"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["role"] == "Physiotherapist"
    assert "access_token" in data

def test_get_athletes():
    response = client.get("/athletes/")
    assert response.status_code == 200
    athletes = response.json()
    assert len(athletes) >= 5
    codes = [a["athlete_code"] for a in athletes]
    assert "ATH-1001" in codes

def test_get_athlete_detail():
    response = client.get("/athletes/1")
    assert response.status_code == 200
    athlete = response.json()
    assert athlete["full_name"] == "Marcus Rashford"
    assert len(athlete["injury_history"]) >= 1
    assert len(athlete["assessments"]) >= 1

def test_create_athlete():
    response = client.post("/athletes/", json={
        "full_name": "Erling Haaland",
        "sport_type": "Football",
        "position": "Striker",
        "age": 24,
        "height": 194.0,
        "weight": 88.0,
        "training_load": "Very High"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "Erling Haaland"
    assert data["athlete_code"].startswith("ATH-")

def test_datasets_endpoint():
    response = client.get("/datasets/")
    assert response.status_code == 200
    datasets = response.json()
    assert len(datasets) >= 5
    names = [d["name"] for d in datasets]
    assert "Human3.6M" in names
    assert "COCO Keypoints" in names
    assert "SportsPose" in names

if __name__ == "__main__":
    print("Running Milestone 1 API Tests...")
    test_root_endpoint()
    test_auth_login()
    test_auth_me()
    test_register_new_user()
    test_get_athletes()
    test_get_athlete_detail()
    test_create_athlete()
    test_datasets_endpoint()
    print("All Milestone 1 API Tests Passed Cleanly!")
