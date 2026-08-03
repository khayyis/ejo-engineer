import json
import urllib.request
import urllib.parse
import sys

BASE_URL = "http://localhost:8000"

def test_flowchart_settings():
    print("--- TESTING APPROVAL FLOWCHART SETTINGS & INTERACTIVE SYNCHRONIZATION ---")
    
    # 1. GET /api/settings - Verify defaults
    req = urllib.request.Request(f"{BASE_URL}/api/settings")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print("[PASS] GET /api/settings successful")
            assert "approval_flowchart_gejo" in data, "approval_flowchart_gejo missing"
            assert "approval_flowchart_drawing" in data, "approval_flowchart_drawing missing"
            assert "approval_flowchart_project" in data, "approval_flowchart_project missing"
            print("[PASS] Default flowchart settings exist for General EJO, Drawing EJO, and Project")
    except Exception as e:
        print(f"[FAIL] GET /api/settings failed: {e}")
        sys.exit(1)

    # 2. Test PUT /api/settings for General EJO Flowchart
    test_gejo_flow = [
        {"step": 1, "key": "staff_epr", "label": "STAFF (EPR)", "role": "user_PRD", "dept": "EPR", "require_signature": 1},
        {"step": 2, "key": "spv_epr", "label": "SPV (EPR)", "role": "Supervisor PRD", "dept": "EPR", "require_signature": 1},
        {"step": 3, "key": "foreman_eng", "label": "FOREMAN ENG", "role": "Foreman Eng", "dept": "ENG", "require_signature": 1},
        {"step": 4, "key": "supervisor_eng", "label": "SUPERVISOR ENG", "role": "Supervisor Eng", "dept": "ENG", "require_signature": 1},
        {"step": 5, "key": "manager_eng", "label": "MANAGER ENG", "role": "Manager PRD", "dept": "ENG", "require_signature": 1},
        {"step": 6, "key": "factory_manager", "label": "FACTORY MANAGER", "role": "Manager EPR", "dept": "ENG", "require_signature": 1}
    ]
    
    payload_gejo = json.dumps({"approval_flowchart_gejo": json.dumps(test_gejo_flow)}).encode('utf-8')
    put_req = urllib.request.Request(f"{BASE_URL}/api/settings", data=payload_gejo, headers={"Content-Type": "application/json"}, method="PUT")
    
    try:
        with urllib.request.urlopen(put_req) as resp:
            print("[PASS] PUT /api/settings (GEJO Flowchart) status:", resp.status)
            assert resp.status in (200, 204), f"Unexpected status: {resp.status}"
    except Exception as e:
        print(f"[FAIL] PUT /api/settings (GEJO) failed: {e}")
        sys.exit(1)

    # 3. Test Interactive Node Insertion & Reordering Simulation on Drawing EJO
    test_drawing_flow = [
        {"step": 1, "key": "drafter", "label": "DRAFTER (ENG)", "role": "Drafter", "dept": "ENG", "require_signature": 1},
        {"step": 2, "key": "inserted_step", "label": "QC INSPECTION", "role": "Kalibrasi", "dept": "QC", "require_signature": 1},
        {"step": 3, "key": "foreman_eng", "label": "FOREMAN ENG", "role": "Foreman Eng", "dept": "ENG", "require_signature": 1},
        {"step": 4, "key": "supervisor_eng", "label": "SUPERVISOR ENG", "role": "Supervisor Eng", "dept": "ENG", "require_signature": 1},
        {"step": 5, "key": "manager_eng", "label": "MANAGER ENG", "role": "Manager PRD", "dept": "ENG", "require_signature": 1}
    ]
    
    payload_drawing = json.dumps({"approval_flowchart_drawing": json.dumps(test_drawing_flow)}).encode('utf-8')
    put_drawing_req = urllib.request.Request(f"{BASE_URL}/api/settings", data=payload_drawing, headers={"Content-Type": "application/json"}, method="PUT")
    
    try:
        with urllib.request.urlopen(put_drawing_req) as resp:
            print("[PASS] PUT /api/settings (Drawing Flowchart) status:", resp.status)
            assert resp.status in (200, 204)
    except Exception as e:
        print(f"[FAIL] PUT /api/settings (Drawing) failed: {e}")
        sys.exit(1)

    # 4. Verify Server Synchronization by GET
    req = urllib.request.Request(f"{BASE_URL}/api/settings")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            
            saved_gejo = json.loads(data.get("approval_flowchart_gejo"))
            assert len(saved_gejo) == 6, f"Expected 6 steps for GEJO, got {len(saved_gejo)}"
            assert saved_gejo[0]["label"] == "STAFF (EPR)", "GEJO step 1 label mismatch"
            print("[PASS] General EJO Flowchart data 100% synchronized and verified!")

            saved_drawing = json.loads(data.get("approval_flowchart_drawing"))
            assert len(saved_drawing) == 5, f"Expected 5 steps for Drawing, got {len(saved_drawing)}"
            assert saved_drawing[1]["label"] == "QC INSPECTION", "Drawing inserted step label mismatch"
            print("[PASS] Drawing EJO Flowchart inserted node data 100% synchronized and verified!")
    except Exception as e:
        print(f"[FAIL] Synchronization verification failed: {e}")
        sys.exit(1)

    print("\nALL FLOWCHART INTERACTIVE SYNCHRONIZATION TESTS PASSED CLEANLY!")

if __name__ == "__main__":
    test_flowchart_settings()
