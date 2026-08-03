import json
import urllib.request
import urllib.parse
import sys

BASE_URL = "http://localhost:8000"

def test_flowchart_settings():
    print("--- TESTING APPROVAL FLOWCHART SETTINGS ENDPOINTS ---")
    
    # 1. GET /api/settings
    req = urllib.request.Request(f"{BASE_URL}/api/settings")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print("[PASS] GET /api/settings successful")
            assert "approval_flowchart_gejo" in data, "approval_flowchart_gejo missing"
            assert "approval_flowchart_drawing" in data, "approval_flowchart_drawing missing"
            assert "approval_flowchart_project" in data, "approval_flowchart_project missing"
            print("[PASS] Default flowchart settings exist in response")
    except Exception as e:
        print(f"[FAIL] GET /api/settings failed: {e}")
        sys.exit(1)

    # 2. PUT /api/settings (Update flowchart for Drawing EJO)
    test_drawing_flow = json.dumps([
        {"step": 1, "key": "drafter", "label": "DRAFTER TEST (ENG)", "role": "Drafter", "dept": "ENG", "require_signature": 1},
        {"step": 2, "key": "foreman_eng", "label": "FOREMAN TEST ENG", "role": "Foreman Eng", "dept": "ENG", "require_signature": 1},
        {"step": 3, "key": "spv_test", "label": "SPV TEST APPROVAL", "role": "Supervisor Eng", "dept": "ENG", "require_signature": 1}
    ])
    
    payload = json.dumps({"approval_flowchart_drawing": test_drawing_flow}).encode('utf-8')
    put_req = urllib.request.Request(f"{BASE_URL}/api/settings", data=payload, headers={"Content-Type": "application/json"}, method="PUT")
    
    try:
        with urllib.request.urlopen(put_req) as resp:
            print("[PASS] PUT /api/settings status:", resp.status)
            assert resp.status in (200, 204), f"Unexpected status: {resp.status}"
    except Exception as e:
        print(f"[FAIL] PUT /api/settings failed: {e}")
        sys.exit(1)

    # 3. GET /api/settings to verify update persisted
    req = urllib.request.Request(f"{BASE_URL}/api/settings")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            saved_flow = data.get("approval_flowchart_drawing")
            assert saved_flow == test_drawing_flow, "Saved flowchart data does not match updated payload"
            print("[PASS] PUT update successfully persisted and verified!")
    except Exception as e:
        print(f"[FAIL] Verification failed: {e}")
        sys.exit(1)

    print("\nALL TESTS PASSED CLEANLY!")

if __name__ == "__main__":
    test_flowchart_settings()
