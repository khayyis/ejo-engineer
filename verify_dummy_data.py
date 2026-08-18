import sqlite3
import json

DB_FILE = "ejo_database.db"

def verify():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    print("==================================================")
    print("VERIFICATION OF EXTENSIVE RANDOMIZED DUMMY DATA")
    print("==================================================")

    # 1. Total counts check
    cursor.execute("SELECT COUNT(*) FROM general_ejos")
    gejo_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM drawings")
    drw_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM projects")
    prj_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM repair_parts")
    part_count = cursor.fetchone()[0]

    print(f"\n[1] Row Counts:")
    print(f"  - General EJOs : {gejo_count} (Expected >= 45)")
    print(f"  - Drawing EJOs : {drw_count} (Expected >= 25)")
    print(f"  - Projects     : {prj_count} (Expected >= 14)")
    print(f"  - Repair Parts : {part_count} (Expected >= 8)")

    assert gejo_count >= 45, f"Too few General EJOs: {gejo_count}"
    assert drw_count >= 25, f"Too few Drawings: {drw_count}"
    assert prj_count >= 14, f"Too few Projects: {prj_count}"
    assert part_count >= 8, f"Too few Repair Parts: {part_count}"

    # 2. Strict Drafter Isolation in Drawings
    non_drafters = ['Thorik', 'Tedy', 'Rahmad', 'Yuli', 'Dadang', 'Aden', 'Chandra', 'Reksa', 'Eman', 'Rifky', 'Hadi', 'Kresna', 'Charlie']
    for nd in non_drafters:
        cursor.execute("SELECT COUNT(*) FROM drawings WHERE engineer LIKE ?", (f"%{nd}%",))
        count = cursor.fetchone()[0]
        assert count == 0, f"Error: Non-drafter {nd} found in drawings! Count: {count}"

    cursor.execute("SELECT DISTINCT engineer FROM drawings WHERE engineer != 'Unassigned' AND engineer IS NOT NULL AND engineer != ''")
    drafter_set = {r['engineer'] for r in cursor.fetchall()}
    print(f"\n[2] Drafters in Drawings: {sorted(list(drafter_set))}")
    assert drafter_set.issubset({'Diki Firmansyah', 'Rifan Nur'}), f"Unexpected engineers in drawings: {drafter_set}"

    # 3. Thorik Assignment Check (Must be exclusively in Elektrik General EJO)
    cursor.execute("SELECT id, title, dept, category, status, engineer FROM general_ejos WHERE engineer = 'Thorik'")
    thorik_jobs = cursor.fetchall()
    print(f"\n[3] Thorik Assigned General EJOs ({len(thorik_jobs)}):")
    for tj in thorik_jobs:
        print(f"  - ID: {tj['id']} | Dept: {tj['dept']} | Cat: {tj['category']} | Status: {tj['status']}")
        assert tj['category'] == 'Elektrik', f"Thorik job is not Elektrik: {tj['category']}"

    assert len(thorik_jobs) > 0, "Thorik must have assigned General EJO Elektrik!"

    # 4. Multi-month Date Distribution Check
    cursor.execute("SELECT DISTINCT SUBSTR(createdDate, 1, 7) FROM general_ejos WHERE createdDate IS NOT NULL")
    gejo_months = {r[0] for r in cursor.fetchall() if r[0]}
    cursor.execute("SELECT DISTINCT SUBSTR(uploaded_at, 1, 7) FROM drawings WHERE uploaded_at IS NOT NULL")
    drw_months = {r[0] for r in cursor.fetchall() if r[0]}
    cursor.execute("SELECT DISTINCT SUBSTR(targetDate, 1, 7) FROM projects WHERE targetDate IS NOT NULL")
    prj_months = {r[0] for r in cursor.fetchall() if r[0]}

    all_months = gejo_months.union(drw_months).union(prj_months)
    print(f"\n[4] Multi-Month Date Distribution: {sorted(list(all_months))}")
    assert len(all_months) >= 5, f"Date distribution should span at least 5 months, got {len(all_months)}"

    # 5. Phase Distribution Check
    # General EJO Phases:
    cursor.execute("SELECT status, COUNT(*) FROM general_ejos GROUP BY status")
    gejo_statuses = {r[0]: r[1] for r in cursor.fetchall()}
    print(f"\n[5] General EJO Status Breakdown: {gejo_statuses}")
    assert any(s in gejo_statuses for s in ['Requested', 'Pending Foreman Approval', 'Pending Dept Approval']), "Missing Schedule Phase"
    assert any(s in gejo_statuses for s in ['In Progress', 'On Progress']), "Missing On Progress Phase"
    assert any(s in gejo_statuses for s in ['Done', 'Pending User Approval', 'Completed']), "Missing Done Phase"
    assert any(s in gejo_statuses for s in ['Completed', 'Archived']), "Missing History Phase"

    # Drawing EJO Phases:
    cursor.execute("SELECT status, COUNT(*) FROM drawings GROUP BY status")
    drw_statuses = {r[0]: r[1] for r in cursor.fetchall()}
    print(f"\n[6] Drawing EJO Status Breakdown: {drw_statuses}")
    assert 'Pending Foreman Approval' in drw_statuses, "Missing Schedule/Approval Phase"
    assert 'On Progress' in drw_statuses, "Missing On Progress Phase"
    assert 'Completed' in drw_statuses, "Missing Completed Phase"

    # Projects Phases:
    cursor.execute("SELECT phase, COUNT(*) FROM projects GROUP BY phase")
    prj_phases = {r[0]: r[1] for r in cursor.fetchall()}
    print(f"\n[7] Project Phase Breakdown: {prj_phases}")
    assert all(p in prj_phases for p in [1, 2, 3, 4]), "Missing Project Phases (1 to 4)"

    # History EJO Aggregation Count:
    cursor.execute("SELECT COUNT(*) FROM general_ejos WHERE is_archived = 1 OR status = 'Completed'")
    hist_gejo = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM drawings WHERE status IN ('Completed', 'Archived', 'Done')")
    hist_drw = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM projects WHERE phase >= 4")
    hist_prj = cursor.fetchone()[0]
    total_history = hist_gejo + hist_drw + hist_prj

    print(f"\n[8] History EJO Dataset Pool:")
    print(f"  - Archived / Completed General EJOs: {hist_gejo}")
    print(f"  - Completed / Archived Drawings    : {hist_drw}")
    print(f"  - Completed / Commissioned Projects: {hist_prj}")
    print(f"  - Total Historical Records Pool    : {total_history}")
    assert total_history >= 20, f"History dataset pool too small: {total_history}"

    # 6. JSON Integrity
    cursor.execute("SELECT logs, approvals FROM general_ejos")
    for r in cursor.fetchall():
        if r['logs']: json.loads(r['logs'])
        if r['approvals']: json.loads(r['approvals'])

    cursor.execute("SELECT logs, approvals FROM drawings")
    for r in cursor.fetchall():
        if r['logs']: json.loads(r['logs'])
        if r['approvals']: json.loads(r['approvals'])

    cursor.execute("SELECT approvals, docs, execution_docs, handover_docs, handover_approvals, timeline FROM projects")
    for r in cursor.fetchall():
        if r['approvals']: json.loads(r['approvals'])
        if r['docs']: json.loads(r['docs'])
        if r['execution_docs']: json.loads(r['execution_docs'])
        if r['handover_docs']: json.loads(r['handover_docs'])
        if r['handover_approvals']: json.loads(r['handover_approvals'])
        if r['timeline']: json.loads(r['timeline'])

    print("\n[9] All JSON payloads valid!")

    print("\n==================================================")
    print("ALL TESTS PASSED WITH 100% EMPIRICAL INTEGRITY!")
    print("==================================================")
    conn.close()

if __name__ == "__main__":
    verify()
