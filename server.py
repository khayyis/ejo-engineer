# ponytail: Built using only the Python standard library (http.server and sqlite3) to avoid external framework dependencies (like Flask or FastAPI).
# ponytail: SQLite database used as it requires no configuration or external server setup.

import http.server
import socket
import socketserver
import json
import sqlite3
import os
import re
import urllib.parse
import uuid
import sys
import time
import threading

# ponytail: auto-timeout decorator for all connections to prevent database lock conflicts
sqlite3.connect_orig = sqlite3.connect
sqlite3.connect = lambda database, *args, **kwargs: sqlite3.connect_orig(database, *args, timeout=30.0, **kwargs)

PORT = 8000
DB_FILE = "ejo_database.db"
UPLOAD_DIR = "uploads"  # ponytail: simple folder for avatar files

# ponytail: store active sessions in-memory and use a lock to ensure thread safety
ACTIVE_SESSIONS = {}
ACTIVE_SESSIONS_LOCK = threading.Lock()

# ponytail: PyMuPDF import and PDF signature helper for drawing etiket
try:
    import fitz
    import base64
except ImportError:
    fitz = None

def apply_pdf_signature(file_url, role, signature_base64, signer_name):
    if not fitz:
        print("Warning: PyMuPDF (fitz) is not installed. PDF signing skipped.")
        return
    if not file_url:
        return
        
    local_path = file_url.lstrip('/')
    if not os.path.exists(local_path) or not local_path.lower().endswith('.pdf'):
        print(f"Warning: PDF file not found or invalid format: {local_path}")
        return
        
    try:
        # Decode base64 image
        if ',' in signature_base64:
            header, base64_str = signature_base64.split(",", 1)
        else:
            base64_str = signature_base64
        img_bytes = base64.b64decode(base64_str)
        
        doc = fitz.open(local_path)
        page = doc[0]
        
        # Batas koordinat etiket A3
        y_start = 445
        y_end = 490
        
        rect = None
        if role == 'foreman':      # DI BUAT
            rect = fitz.Rect(451.51 + 5, y_start, 533.90 - 5, y_end)
            page.insert_text(fitz.Point(451.51 + 5, 498), f"Approved by {signer_name}", fontsize=4.5, color=(0.1, 0.1, 0.1))
        elif role == 'supervisor': # DI PERIKSA (right half of column 2)
            rect = fitz.Rect(575.10 + 3, y_start, 616.30 - 3, y_end)
            page.insert_text(fitz.Point(575.10 + 3, 498), f"Approved by {signer_name}", fontsize=4.5, color=(0.1, 0.1, 0.1))
        elif role == 'manager':    # DI PERIKSA (left half of column 2)
            rect = fitz.Rect(533.90 + 3, y_start, 575.10 - 3, y_end)
            page.insert_text(fitz.Point(533.90 + 3, 498), f"Approved by {signer_name}", fontsize=4.5, color=(0.1, 0.1, 0.1))
        elif role == 'requester':  # DI PERIKSA 2 (column 3)
            rect = fitz.Rect(616.30 + 5, y_start, 704.76 - 5, y_end)
            page.insert_text(fitz.Point(616.30 + 5, 498), f"Approved by {signer_name}", fontsize=4.5, color=(0.1, 0.1, 0.1))
            
        if rect:
            page.insert_image(rect, stream=img_bytes)
            
        # Save changes to a temporary file then replace to prevent corruption
        temp_path = local_path + ".tmp"
        doc.save(temp_path)
        doc.close()
        
        # Replace the original file
        if os.path.exists(temp_path):
            os.replace(temp_path, local_path)
            print(f"Successfully stamped signature for role '{role}' ({signer_name}) on {local_path}")
    except Exception as e:
        print(f"Error applying PDF signature: {e}")




# ==========================================
# Database Initializations
# ==========================================
def init_db(seed_defaults=None):
    db_exists = os.path.exists(DB_FILE)
    if seed_defaults is None:
        seed_defaults = not db_exists
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Create EJOs table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ejos (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            dept TEXT,
            category TEXT,
            priority TEXT,
            location TEXT,
            targetDate TEXT,
            status TEXT,
            engineer TEXT,
            estCost INTEGER,
            actCost INTEGER,
            description TEXT,
            logs TEXT,
            requester TEXT,
            createdDate TEXT
        )
    """)
    
    # ponytail: Add requester column if table already exists without it
    try:
        cursor.execute("ALTER TABLE ejos ADD COLUMN requester TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass  # Column already exists
        
    # ponytail: Add createdDate column if table already exists without it
    try:
        cursor.execute("ALTER TABLE ejos ADD COLUMN createdDate TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass
    
    
    # Create Projects table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            dept TEXT,
            budget INTEGER,
            targetDate TEXT,
            pic TEXT,
            desc TEXT,
            phase INTEGER,
            approvals TEXT,
            docs TEXT
        )
    """)
    
    # ponytail: Add approvals column to projects if table already exists without it
    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN approvals TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # ponytail: Add docs column to projects if table already exists without it
    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN docs TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # ponytail: Add execution_docs column to projects if table already exists without it
    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN execution_docs TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # Create Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password TEXT NOT NULL,
            fullname TEXT,
            role TEXT,
            avatar TEXT,
            signature TEXT,
            show_status_prop INTEGER DEFAULT 1
        )
    """)

    # ponytail: Add signature column if users table already exists without it
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN signature TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass  # Column already exists

    # ponytail: Add show_status_prop column if users table already exists without it
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN show_status_prop INTEGER DEFAULT 1")
        conn.commit()
    except sqlite3.OperationalError:
        pass  # Column already exists

    # ponytail: Create Settings table for global application config
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    """)
    # Set default values if empty (default to hidden '0' as requested)
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('show_status_prop', '0')")
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('maintenance_mode', '0')")
    conn.commit()

    # ponytail: notifications table — server-side, per-user (target by username)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            target_username TEXT,
            ejo_id TEXT,
            message TEXT,
            timestamp TEXT,
            is_read INTEGER DEFAULT 0
        )
    """)

    # ponytail: general_ejos — pekerjaan langsung (pasang lampu, ganti kran, dll), DB terpisah
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS general_ejos (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            dept TEXT,
            category TEXT,
            priority TEXT,
            location TEXT,
            targetDate TEXT,
            estDate TEXT,
            status TEXT,
            engineer TEXT,
            estCost INTEGER,
            actCost INTEGER,
            description TEXT,
            logs TEXT,
            requester TEXT,
            is_archived INTEGER DEFAULT 0,
            approvals TEXT,
            createdDate TEXT
        )
    """)
    
    # ponytail: Add is_archived column if general_ejos table already exists without it
    try:
        cursor.execute("ALTER TABLE general_ejos ADD COLUMN is_archived INTEGER DEFAULT 0")
        conn.commit()
    except sqlite3.OperationalError:
        pass  # Column already exists

    # ponytail: Add approvals column to general_ejos if not exists
    try:
        cursor.execute("ALTER TABLE general_ejos ADD COLUMN approvals TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # ponytail: Add estDate column to general_ejos if not exists
    try:
        cursor.execute("ALTER TABLE general_ejos ADD COLUMN estDate TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # ponytail: Add createdDate column to general_ejos if not exists
    try:
        cursor.execute("ALTER TABLE general_ejos ADD COLUMN createdDate TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # ponytail: Migrate old Archived general EJOs to Completed with is_archived = 1
    try:
        cursor.execute("UPDATE general_ejos SET status = 'Completed', is_archived = 1 WHERE status = 'Archived'")
        conn.commit()
    except Exception:
        pass

    # ponytail: drawings — request drawing system, disamakan dengan General EJO
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS drawings (
            id TEXT PRIMARY KEY,
            ejo_id TEXT,
            title TEXT,
            file_path TEXT,
            uploader TEXT,
            uploaded_at TEXT,
            status TEXT DEFAULT 'Pending Foreman Approval',
            approvals TEXT,
            logs TEXT,
            dept TEXT,
            category TEXT,
            priority TEXT DEFAULT 'Low',
            location TEXT,
            targetDate TEXT,
            description TEXT,
            requester TEXT,
            engineer TEXT,
            estDate TEXT,
            drawing_type TEXT DEFAULT 'request',
            sub_status TEXT
        )
    """)

    # ponytail: migration for drawings table columns
    for col_sql in [
        "ALTER TABLE drawings ADD COLUMN status TEXT DEFAULT 'Pending Foreman Approval'",
        "ALTER TABLE drawings ADD COLUMN approvals TEXT",
        "ALTER TABLE drawings ADD COLUMN logs TEXT",
        "ALTER TABLE drawings ADD COLUMN dept TEXT",
        "ALTER TABLE drawings ADD COLUMN category TEXT",
        "ALTER TABLE drawings ADD COLUMN priority TEXT DEFAULT 'Low'",
        "ALTER TABLE drawings ADD COLUMN location TEXT",
        "ALTER TABLE drawings ADD COLUMN targetDate TEXT",
        "ALTER TABLE drawings ADD COLUMN description TEXT",
        "ALTER TABLE drawings ADD COLUMN requester TEXT",
        "ALTER TABLE drawings ADD COLUMN engineer TEXT",
        "ALTER TABLE drawings ADD COLUMN estDate TEXT",
        "ALTER TABLE drawings ADD COLUMN drawing_type TEXT DEFAULT 'request'",
        "ALTER TABLE drawings ADD COLUMN sub_status TEXT"
    ]:
        try:
            cursor.execute(col_sql)
        except Exception:
            pass

    # ponytail: Create repair_parts table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS repair_parts (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            code TEXT,
            stock INTEGER DEFAULT 0,
            location TEXT,
            ejo_id TEXT,
            description TEXT,
            image TEXT
        )
    """)
    conn.commit()

    # ponytail: Add image column to repair_parts table if not exists (for backward compatibility)
    try:
        cursor.execute("ALTER TABLE repair_parts ADD COLUMN image TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass # Column already exists

    # Populate default repair parts if empty
    if seed_defaults:
        cursor.execute("SELECT COUNT(*) FROM repair_parts")
        if cursor.fetchone()[0] == 0:
            default_parts = [
                ("PART-001", "Seal Kit Cylinder Clamping", "SK-CYL-3", 15, "Gudang Sparepart A - Rak B2", "EJO-2026-001", "Digunakan untuk mengatasi kebocoran hidrolik press machine #3"),
                ("PART-002", "MCB 3 Phase Schneider 16A", "MCB-3P-SCH-16", 8, "Gudang Elektrik - Loker C", "EJO-2026-003", "Penggantian MCB chiller panel unit 2"),
                ("PART-003", "Sensor Proximity E2E-X5ME1 Omron", "PROX-OMR-E2E", 5, "Gudang Elektrik - Rak A1", "EJO-2026-002", "Sensor proximity conveyor belt packaging"),
                ("PART-004", "Oli Hidrolik Shell Tellus S2 M 46", "OIL-HYD-VG46", 4, "Area Penyimpanan Oli - Drum 2", "EJO-2026-001", "Pengisian ulang tangki oli Press Machine #3"),
                ("PART-005", "Baut Structural Hex M16 x 50", "BOLT-M16-50", 120, "Gudang Sipil/Struktur - Loker D", "", "Kebutuhan perkuatan tiang baja platform mezzanine")
            ]
            cursor.executemany("INSERT INTO repair_parts (id, name, code, stock, location, ejo_id, description) VALUES (?, ?, ?, ?, ?, ?, ?)", default_parts)
            conn.commit()
    
    # ponytail: ejos seeding removed because the feature is deleted

    # Populate default projects if empty
    if seed_defaults:
        cursor.execute("SELECT COUNT(*) FROM projects")
        if cursor.fetchone()[0] == 0:
            default_projects = [
                ("PRJ-2026-001", "Pemasangan Sistem SCADA Boiler House", "Utility", 150000000, "2026-08-30", "Budi Utomo", "Integrasi pembacaan temperatur, steam pressure, dan flow rate boiler unit 1 & 2 ke sistem monitoring control room utama pabrik.", 2),
                ("PRJ-2026-002", "Renovasi Area Penyimpanan Bahan Baku Cair", "HSE", 80000000, "2026-09-15", "Charlie Santoso", "Pengecoran lantai epoxy, pembuatan tanggul pengaman tumpahan bahan kimia cair, dan pemasangan grounding tank pengaman petir.", 1),
                ("PRJ-2026-003", "Upgrade Line Sensor Detection Mesin Filling 250ml", "Production", 45000000, "2026-07-10", "Deddy Corbuzier", "Penggantian limit switch lama dengan photoelectric proximity sensor berkecepatan tinggi merk Autonics. Semua barang telah siap di gudang.", 3)
            ]
            cursor.executemany("INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?)", default_projects)
            conn.commit()

    # ponytail: migration script for roles: rename Lead Engineer -> Foreman
    cursor.execute("UPDATE users SET role = 'Foreman' WHERE role = 'Lead Engineer'")
    # cursor.execute("UPDATE users SET role = 'Drafter' WHERE role = 'Manager'") -- Disabled, Manager is now a valid role.
    cursor.execute("UPDATE users SET role = 'User' WHERE role NOT IN ('Foreman', 'Admin', 'Drafter', 'User', 'Manager', 'Plant Manager', 'Supervisor', 'Server', 'Sipil', 'Mekanik', 'Elektrik', 'Program', 'Kalibrasi', 'Otomotif')")
    conn.commit()

    # Populate default users if empty
    if seed_defaults:
        cursor.execute("SELECT COUNT(*) FROM users")
        if cursor.fetchone()[0] == 0:
            default_users = [
                ("dani", "dani123", "Ahmad Dani", "Foreman", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=80"),
                ("budi", "budi123", "Budi Utomo", "Foreman", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80"),
                ("charlie", "charlie123", "Charlie Santoso", "Drafter", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80"),
                ("deddy", "deddy123", "Deddy Corbuzier", "User", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80"),
                ("server", "server123", "System Server Admin", "Server", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80")
            ]
            cursor.executemany("INSERT INTO users (username, password, fullname, role, avatar) VALUES (?, ?, ?, ?, ?)", default_users)
            conn.commit()

    # Ensure server user exists even if database already had other users
    cursor.execute("SELECT COUNT(*) FROM users WHERE username = 'server'")
    if cursor.fetchone()[0] == 0:
        cursor.execute(
            "INSERT INTO users (username, password, fullname, role, avatar) VALUES (?, ?, ?, ?, ?)",
            ("server", "server123", "System Server Admin", "Server", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80")
        )
        conn.commit()
    else:
        # ponytail: make sure existing server user has the Server role (fix demotion issue)
        cursor.execute("UPDATE users SET role = 'Server' WHERE username = 'server'")
        conn.commit()

    conn.close()

# ponytail: Role levels for hierarchical authorization
ROLE_LEVELS = {
    'Server': 100,
    'Manager': 80,
    'Plant Manager': 80,
    'Supervisor': 60,
    'Foreman': 40,
    'Admin': 40,
    'Drafter': 20,
    'Sipil': 20,
    'Mekanik': 20,
    'Elektrik': 20,
    'Program': 20,
    'Kalibrasi': 20,
    'Otomotif': 20,
    'User': 10
}

def get_role_level(role):
    return ROLE_LEVELS.get(role, 0)

# ==========================================
# Request Handler Class
# ==========================================
class EJORestHandler(http.server.BaseHTTPRequestHandler):
    
    def end_headers(self):
        # Allow client CORS if running on different origin during testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
        
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # ponytail: parse out query parameters to handle routes with parameters cleanly
        clean_path = self.path.split("?")[0]
        # 1. REST API GET Routes
        if clean_path == "/api/ejos":
            self.get_ejos()
        elif clean_path == "/api/general-ejos":
            self.get_general_ejos()
        elif clean_path == "/api/drawings":
            self.get_drawings()
        elif clean_path == "/api/projects":
            self.get_projects()
        elif clean_path == "/api/repair-parts":
            self.get_repair_parts()
        elif clean_path == "/api/users":
            self.get_users()
        elif clean_path == "/api/settings":
            self.get_settings()
        elif clean_path.startswith("/api/notifications"):
            self.get_notifications()

        # 2. Static Files Handling
        else:
            self.serve_static()

    def do_POST(self):
        # ponytail: parse out query parameters
        clean_path = self.path.split("?")[0]
        if clean_path == "/api/ejos":
            self.create_ejo()
        elif clean_path == "/api/general-ejos":
            self.create_general_ejo()
        elif clean_path == "/api/drawings":
            self.upload_drawing()
        elif clean_path == "/api/projects":
            self.create_project()
        elif clean_path == "/api/repair-parts":
            self.create_repair_part()
        elif clean_path == "/api/login":
            self.login_user()
        elif clean_path == "/api/heartbeat":
            self.handle_heartbeat()
        elif clean_path == "/api/logout":
            self.handle_logout()
        elif clean_path == "/api/users":
            self.create_user()
        elif clean_path == "/api/upload-avatar":
            self.upload_avatar()
        elif clean_path == "/api/projects/upload-doc":
            self.upload_project_doc()
        elif clean_path == "/api/upload":
            self.upload_file()
        elif clean_path == "/api/nuclear":
            self.nuclear_database()
        else:
            self.send_error(404, "API endpoint not found")

    def do_PUT(self):
        # ponytail: parse out query parameters
        clean_path = self.path.split("?")[0]
        if clean_path.startswith("/api/ejos/"):
            ejo_id = clean_path.split("/")[-1]
            self.update_ejo(ejo_id)
        elif clean_path.startswith("/api/general-ejos/"):
            ejo_id = clean_path.split("/")[-1]
            self.update_general_ejo(ejo_id)
        elif clean_path.startswith("/api/projects/"):
            proj_id = clean_path.split("/")[-1]
            self.update_project(proj_id)
        elif clean_path.startswith("/api/users/"):
            if clean_path.endswith("/layout-settings"):
                username = clean_path.split("/")[-2]
                self.update_user_layout_settings(username)
            else:
                username = clean_path.split("/")[-1]
                self.update_user(username)
        elif clean_path.startswith("/api/notifications/read-all"):
            self.mark_all_notifications_read()
        elif clean_path.startswith("/api/drawings/"):
            drawing_id = clean_path.split("/")[-1]
            self.update_drawing(drawing_id)
        elif clean_path == "/api/settings":
            self.update_settings()
        else:
            self.send_error(404, "API endpoint not found")

    def do_DELETE(self):
        # ponytail: parse out query parameters
        clean_path = self.path.split("?")[0]
        if clean_path.startswith("/api/ejos/"):
            ejo_id = clean_path.split("/")[-1]
            self.delete_ejo(ejo_id)
        elif clean_path.startswith("/api/general-ejos/"):
            ejo_id = clean_path.split("/")[-1]
            self.delete_general_ejo(ejo_id)
        elif clean_path.startswith("/api/drawings/"):
            drawing_id = clean_path.split("/")[-1]
            self.delete_drawing(drawing_id)
        elif clean_path.startswith("/api/projects/"):
            proj_id = clean_path.split("/")[-1]
            self.delete_project(proj_id)
        elif clean_path.startswith("/api/repair-parts/"):
            part_id = clean_path.split("/")[-1]
            self.delete_repair_part(part_id)
        elif clean_path.startswith("/api/users/"):
            username = clean_path.split("/")[-1]
            self.delete_user(username)
        elif clean_path.startswith("/api/notifications"):
            self.delete_notifications()
        else:
            self.send_error(404, "API endpoint not found")

    # ==========================================
    # API Controller Functions
    # ==========================================

    # ponytail: helper — resolve fullname → username via users table (notif ditarget per username)
    def _resolve_username(self, conn, fullname):
        if not fullname or fullname == "Unassigned":
            return None
        cursor = conn.cursor()
        cursor.execute("SELECT username FROM users WHERE fullname = ?", (fullname,))
        row = cursor.fetchone()
        return row[0] if row else None

    # ponytail: helper — insert satu notifikasi ke tabel notifications
    def _insert_notification(self, conn, target_username, ejo_id, message):
        if not target_username:
            return  # tidak ada target → skip (mis. engineer Unassigned)
        notif_id = f"NTF-{int(__import__('time').time() * 1000)}-{target_username}"
        now = __import__('datetime').datetime.now()
        timestamp = now.strftime("%Y-%m-%d %H:%M")
        conn.cursor().execute(
            "INSERT INTO notifications (id, target_username, ejo_id, message, timestamp, is_read) VALUES (?, ?, ?, ?, ?, 0)",
            (notif_id, target_username, ejo_id, message, timestamp)
        )

    # ponytail: GET /api/notifications?username=xxx — semua notif untuk user itu (terbaru dulu)
    def get_notifications(self):
        from urllib.parse import urlparse, parse_qs
        query = parse_qs(urlparse(self.path).query)
        username = query.get("username", [None])[0]
        if not username:
            self.send_error(400, "username parameter required")
            return

        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM notifications WHERE target_username = ? ORDER BY id DESC",
            (username,)
        )
        rows = [dict(r) for r in cursor.fetchall()]
        conn.close()

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(rows).encode("utf-8"))

    # ponytail: PUT /api/notifications/read-all?username=xxx — tandai semua dibaca
    def mark_all_notifications_read(self):
        from urllib.parse import urlparse, parse_qs
        query = parse_qs(urlparse(self.path).query)
        username = query.get("username", [None])[0]
        if not username:
            self.send_error(400, "username parameter required")
            return

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE notifications SET is_read = 1 WHERE target_username = ?",
            (username,)
        )
        conn.commit()
        conn.close()

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "success"}).encode("utf-8"))

    # ponytail: DELETE /api/notifications?username=xxx atau ?id=xxx — hapus semua/satu notif
    def delete_notifications(self):
        from urllib.parse import urlparse, parse_qs
        query = parse_qs(urlparse(self.path).query)
        username = query.get("username", [None])[0]
        notif_id = query.get("id", [None])[0]
        if not username and not notif_id:
            self.send_error(400, "username or id parameter required")
            return

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        if notif_id:
            cursor.execute(
                "DELETE FROM notifications WHERE id = ?",
                (notif_id,)
            )
        else:
            cursor.execute(
                "DELETE FROM notifications WHERE target_username = ?",
                (username,)
            )
        conn.commit()
        conn.close()

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "success"}).encode("utf-8"))

    def get_ejos(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM ejos")
        rows = cursor.fetchall()
        
        ejos = []
        for r in rows:
            ejo = dict(r)
            # Parse JSON string logs back to Python list
            ejo['logs'] = json.loads(ejo['logs']) if ejo['logs'] else []
            ejos.append(ejo)
            
        conn.close()
        
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(ejos).encode("utf-8"))

    def get_projects(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM projects")
        rows = cursor.fetchall()
        
        projects = []
        for r in rows:
            p = dict(r)
            try:
                p['approvals'] = json.loads(p['approvals']) if p.get('approvals') else {}
            except Exception:
                p['approvals'] = {}
            try:
                p['docs'] = json.loads(p['docs']) if p.get('docs') else []
            except Exception:
                p['docs'] = []
            try:
                p['execution_docs'] = json.loads(p['execution_docs']) if p.get('execution_docs') else []
            except Exception:
                p['execution_docs'] = []
            projects.append(p)
        conn.close()
        
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(projects).encode("utf-8"))

    # ponytail: repair parts DB query helpers
    def get_repair_parts(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM repair_parts")
        rows = cursor.fetchall()
        parts = [dict(r) for r in rows]
        conn.close()
        
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(parts).encode("utf-8"))

    def create_repair_part(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            cursor.execute("""
                INSERT INTO repair_parts (id, name, code, stock, location, ejo_id, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                data['id'], data['name'], data['code'], data['stock'],
                data['location'], data['ejo_id'], data['description'], data.get('image', None)
            ))
            conn.commit()
            
            self.send_response(201)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "id": data['id']}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    def delete_repair_part(self, part_id):
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            cursor.execute("DELETE FROM repair_parts WHERE id = ?", (part_id,))
            conn.commit()
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "id": part_id}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()


    def login_user(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        username = data.get('username')
        password = data.get('password')
        device_id = data.get('device_id')
        
        # ponytail: username and device_id are required to enforce single-device login
        if not username or not device_id:
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": "Username dan Device ID diperlukan untuk login."}).encode("utf-8"))
            return
        
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Check maintenance mode status
        maintenance = False
        try:
            cursor.execute("SELECT value FROM settings WHERE key = 'maintenance_mode'")
            m_row = cursor.fetchone()
            if m_row and m_row[0] == '1':
                maintenance = True
        except Exception:
            pass

        cursor.execute("SELECT username, fullname, role, avatar, signature, show_status_prop FROM users WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()
        conn.close()
        
        if user:
            # ponytail: enforce single device per login limit
            now = time.time()
            username_key = username.lower()
            with ACTIVE_SESSIONS_LOCK:
                if username_key in ACTIVE_SESSIONS:
                    session = ACTIVE_SESSIONS[username_key]
                    # If device_id differs and session is active within 30 seconds
                    if session["device_id"] != device_id and (now - session["last_active"]) < 30:
                        self.send_response(403)
                        self.send_header("Content-Type", "application/json")
                        self.end_headers()
                        self.wfile.write(json.dumps({
                            "status": "error", 
                            "message": "Akun ini sedang aktif di perangkat lain. Silakan keluar dari perangkat tersebut terlebih dahulu."
                        }).encode("utf-8"))
                        return
                
                # Store/update the session
                ACTIVE_SESSIONS[username_key] = {"device_id": device_id, "last_active": now}

            # Block login during maintenance mode for non-Server users
            is_server = user['role'] == 'Server' or user['username'] == 'server' or user['role'].lower() == 'server'
            if maintenance and not is_server:
                self.send_response(503)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Server sedang dalam pemeliharaan (maintenance) / perbaikan. Akses ditutup sementara."}).encode("utf-8"))
                return

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(dict(user)).encode("utf-8"))
        else:
            self.send_response(401)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": "Username atau password salah"}).encode("utf-8"))

    # ponytail: handle periodic client heartbeats to track and enforce single-device logins
    def handle_heartbeat(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        username = data.get('username')
        device_id = data.get('device_id')
        
        if not username or not device_id:
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": "Missing username or device_id"}).encode("utf-8"))
            return
            
        username_key = username.lower()
        now = time.time()
        
        with ACTIVE_SESSIONS_LOCK:
            if username_key in ACTIVE_SESSIONS:
                session = ACTIVE_SESSIONS[username_key]
                if session["device_id"] != device_id:
                    # If the active device has sent a heartbeat recently, this device is superseded
                    if (now - session["last_active"]) < 30:
                        self.send_response(403)
                        self.send_header("Content-Type", "application/json")
                        self.end_headers()
                        self.wfile.write(json.dumps({
                            "status": "superseded",
                            "message": "Akun Anda telah masuk di perangkat lain."
                        }).encode("utf-8"))
                        return
            
            # Establish/Update heartbeat timestamp
            ACTIVE_SESSIONS[username_key] = {"device_id": device_id, "last_active": now}
            
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "success"}).encode("utf-8"))

    # ponytail: handle explicit user logouts to release active device lock instantly
    def handle_logout(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        username = data.get('username')
        device_id = data.get('device_id')
        
        if username and device_id:
            username_key = username.lower()
            with ACTIVE_SESSIONS_LOCK:
                if username_key in ACTIVE_SESSIONS:
                    session = ACTIVE_SESSIONS[username_key]
                    if session["device_id"] == device_id:
                        del ACTIVE_SESSIONS[username_key]
                        
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "success"}).encode("utf-8"))


    def create_ejo(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        try:
            # ponytail: Auto-increment sequence if standard EJO ID already exists to prevent duplicate keys
            ejo_id = data['id']
            match = re.match(r"^EJO-2026-(\d+)$", ejo_id)
            if match:
                cursor.execute("SELECT id FROM ejos WHERE id = ?", (ejo_id,))
                if cursor.fetchone():
                    cursor.execute("SELECT id FROM ejos WHERE id LIKE 'EJO-2026-%'")
                    existing_ids = [row[0] for row in cursor.fetchall()]
                    nums = []
                    for x in existing_ids:
                        m = re.match(r"^EJO-2026-(\d+)$", x)
                        if m:
                            nums.append(int(m.group(1)))
                    next_num = max(nums) + 1 if nums else 1
                    ejo_id = f"EJO-2026-{next_num:03d}"

            # ponytail: name columns explicitly to ensure compatibility when schema changes or columns are added
            cursor.execute("""
                INSERT INTO ejos (id, title, dept, category, priority, location, targetDate, status, engineer, estCost, actCost, description, logs, requester, createdDate)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                ejo_id, data['title'], data['dept'], data['category'],
                data['priority'], data['location'], data['targetDate'],
                data['status'], data['engineer'], data['estCost'],
                data['actCost'], data['description'], json.dumps(data.get('logs', [])),
                data.get('requester', ''), data.get('createdDate', '')
            ))

            # ponytail: auto notifikasi — jika engineer langsung ditunjuk saat create (mendukung multi)
            engineer_name = data.get('engineer', 'Unassigned')
            if engineer_name and engineer_name != 'Unassigned':
                for eng in [e.strip() for e in engineer_name.split(",") if e.strip()]:
                    target_username = self._resolve_username(conn, eng)
                    if target_username:
                        self._insert_notification(
                            conn, target_username, ejo_id,
                            f"EJO Baru {ejo_id} ditugaskan kepada Anda: {data['title']}"
                        )

            conn.commit()
            
            self.send_response(201)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "id": ejo_id}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    def create_project(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        try:
            # ponytail: calculate the maximum project number suffix in DB dynamically to avoid duplicate IDs
            cursor.execute("SELECT id FROM projects")
            rows = cursor.fetchall()
            max_num = 3  # default start
            for row in rows:
                if row[0]:
                    parts = row[0].split("-")
                    if len(parts) >= 3:
                        try:
                            num = int(parts[2])
                            if num > max_num:
                                max_num = num
                        except Exception:
                            pass
            next_id = f"PRJ-2026-{max_num + 1:03d}"

            cursor.execute("""
                INSERT INTO projects (id, title, dept, budget, targetDate, pic, desc, phase, approvals) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                next_id, data['title'], data['dept'], data['budget'],
                data['targetDate'], data['pic'], data['desc'], data['phase'],
                json.dumps(data.get('approvals', {}))
            ))
            conn.commit()
            
            self.send_response(201)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "id": next_id}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    def update_ejo(self, ejo_id):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        try:
            # First fetch current logs + old engineer/status, append new ones if any
            cursor.execute("SELECT logs, engineer, status, createdDate FROM ejos WHERE id = ?", (ejo_id,))
            row = cursor.fetchone()
            current_logs = json.loads(row[0]) if (row and row[0]) else []
            old_engineer = row[1] if row else 'Unassigned'
            old_status = row[2] if row else None
            old_created_date = row[3] if (row and len(row) > 3) else None

            if 'logs' in data:
                # Merge logic
                # Only add logs that are not already present
                existing_messages = {log['message'] for log in current_logs}
                for log in data['logs']:
                    if log['message'] not in existing_messages:
                        current_logs.append(log)

            # ponytail: preserve/update createdDate if passed by the client
            created_date = data.get('createdDate', old_created_date)

            # ponytail: Support updating description (containing attachments)
            if 'description' in data:
                cursor.execute("""
                    UPDATE ejos 
                    SET status = ?, engineer = ?, estCost = ?, actCost = ?, description = ?, logs = ?, createdDate = ?
                    WHERE id = ?
                """, (
                    data['status'], data['engineer'], data['estCost'],
                    data['actCost'], data['description'], json.dumps(current_logs), created_date, ejo_id
                ))
            else:
                cursor.execute("""
                    UPDATE ejos 
                    SET status = ?, engineer = ?, estCost = ?, actCost = ?, logs = ?, createdDate = ?
                    WHERE id = ?
                """, (
                    data['status'], data['engineer'], data['estCost'],
                    data['actCost'], json.dumps(current_logs), created_date, ejo_id
                ))

            # ponytail: auto notifikasi saat assignment/status berubah — mendukung beberapa engineer sekaligus
            new_engineer = data.get('engineer', old_engineer)
            new_status = data.get('status', old_status)
            
            # Parsing list of engineers from comma separated string
            new_engineers = [e.strip() for e in new_engineer.split(",") if e.strip() and e.strip() != 'Unassigned']
            old_engineers = [e.strip() for e in old_engineer.split(",") if e.strip() and e.strip() != 'Unassigned']
            
            # Send notifications to newly assigned engineers
            for eng in new_engineers:
                if eng not in old_engineers:
                    target_username = self._resolve_username(conn, eng)
                    if target_username:
                        self._insert_notification(
                            conn, target_username, ejo_id,
                            f"EJO {ejo_id} ditugaskan kepada Anda"
                        )
            
            # If status changed and there are assigned engineers, notify all of them
            if new_status != old_status and new_engineers:
                for eng in new_engineers:
                    target_username = self._resolve_username(conn, eng)
                    if target_username:
                        self._insert_notification(
                            conn, target_username, ejo_id,
                            f"Status EJO {ejo_id} berubah menjadi {new_status}"
                        )

            # ponytail: notify Lead/Admin if status changed to 'Pending Approval' for EJO (including user note)
            if new_status == 'Pending Approval' and new_status != old_status:
                note = ""
                for log in data.get('logs', []):
                    msg = log.get('message', '')
                    if "Laporan Revisi:" in msg:
                        note = msg.split("Laporan Revisi:")[-1].strip()
                        break
                    elif not msg.startswith("Status dirubah") and not msg.startswith("Engineer ditunjuk"):
                        note = msg.strip()
                        break
                notif_msg = f"EJO {ejo_id} selesai, butuh persetujuan Anda"
                if note:
                    notif_msg += f" (Catatan: {note})"
                cursor.execute("SELECT username FROM users WHERE role IN ('Foreman', 'Admin', 'Manager', 'Supervisor', 'Plant Manager')")
                for r in cursor.fetchall():
                    self._insert_notification(conn, r[0], ejo_id, notif_msg)

            # ponytail: notify Lead/Admin if status changed to 'Pending Revision' for EJO
            if new_status == 'Pending Revision' and new_status != old_status:
                cursor.execute("SELECT username FROM users WHERE role IN ('Foreman', 'Admin', 'Manager', 'Supervisor', 'Plant Manager')")
                for r in cursor.fetchall():
                    self._insert_notification(
                        conn, r[0], ejo_id,
                        f"EJO {ejo_id} mengajukan REVISI, butuh persetujuan Anda"
                    )

            conn.commit()
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "id": ejo_id}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    def update_project(self, proj_id):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        try:
            # ponytail: dynamically support update phase and approvals fields
            update_fields = []
            params = []
            if 'phase' in data:
                update_fields.append("phase = ?")
                params.append(data['phase'])
            if 'approvals' in data:
                update_fields.append("approvals = ?")
                params.append(json.dumps(data['approvals']) if isinstance(data['approvals'], (dict, list)) else data['approvals'])
            if 'docs' in data:
                update_fields.append("docs = ?")
                params.append(json.dumps(data['docs']) if isinstance(data['docs'], (dict, list)) else data['docs'])
            if 'execution_docs' in data:
                update_fields.append("execution_docs = ?")
                params.append(json.dumps(data['execution_docs']) if isinstance(data['execution_docs'], (dict, list)) else data['execution_docs'])
                
            params.append(proj_id)
            cursor.execute(f"""
                UPDATE projects 
                SET {', '.join(update_fields)}
                WHERE id = ?
            """, tuple(params))
            conn.commit()
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "id": proj_id}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    def delete_ejo(self, ejo_id):
        # ponytail: check authorization (Foreman cannot delete)
        query_params = urllib.parse.parse_qs(urllib.parse.urlsplit(self.path).query)
        requester = query_params.get('requester', [''])[0]

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT role FROM users WHERE username = ?", (requester,))
            requester_row = cursor.fetchone()
            requester_role = requester_row[0] if requester_row else ''
            
            # ponytail: include Admin as restricted role
            if requester_role in ['Foreman', 'Supervisor', 'Manager', 'Plant Manager', 'Admin']:
                self.send_response(403)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Jabatan Anda tidak berhak menghapus EJO!"}).encode("utf-8"))
                conn.close()
                return

            cursor.execute("DELETE FROM ejos WHERE id = ?", (ejo_id,))
            conn.commit()

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "id": ejo_id}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    # ==========================================
    # ponytail: General EJO CRUD — pekerjaan langsung (pasang lampu, ganti kran, dll)
    # ==========================================
    def get_general_ejos(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM general_ejos")
        rows = cursor.fetchall()
        gejos = []
        for r in rows:
            gejo = dict(r)
            gejo['logs'] = json.loads(gejo['logs']) if gejo['logs'] else []
            # ponytail: parse approvals JSON
            gejo['approvals'] = json.loads(gejo['approvals']) if ('approvals' in gejo and gejo['approvals']) else {}
            gejos.append(gejo)
        conn.close()

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(gejos).encode("utf-8"))

    def create_general_ejo(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        try:
            # ponytail: reject if creator is a Drafter
            requester = data.get('requester', '')
            if requester:
                cursor.execute("SELECT role FROM users WHERE username = ? OR fullname = ?", (requester, requester))
                user_row = cursor.fetchone()
                if user_row and user_row[0] in ('Drafter', 'Sipil', 'Mekanik', 'Elektrik', 'Program', 'Kalibrasi'):
                    self.send_error(403, f"{user_row[0]} tidak diperbolehkan membuat General EJO.")
                    return

                # ponytail: enforce limit of 2 active general EJOs per user (excluding completed/cancelled and pending revision) for User role only
                if user_row and user_row[0] == 'User':
                    cursor.execute("""
                        SELECT COUNT(*) FROM general_ejos 
                        WHERE (requester = ? OR requester IN (SELECT fullname FROM users WHERE username = ?)) 
                          AND is_archived = 0 
                          AND status != 'Completed' AND status != 'Cancelled' AND status != 'Pending Revision'
                    """, (requester, requester))
                    count = cursor.fetchone()[0]
                    if count >= 2:
                        self.send_response(400)
                        self.send_header("Content-Type", "application/json")
                        self.end_headers()
                        self.wfile.write(json.dumps({"status": "error", "message": "Batas pembuatan General EJO tercapai! Anda hanya dapat membuat maksimal 2 General EJO aktif."}).encode("utf-8"))
                        conn.close()
                        return

            cursor.execute("SELECT COUNT(*) FROM general_ejos")
            ejo_id = data.get('id', '')

            if not ejo_id:
                cursor.execute("SELECT id FROM general_ejos WHERE id LIKE 'GEJO-%'")
                existing_ids = [row[0] for row in cursor.fetchall()]
                nums = []
                for x in existing_ids:
                    m = re.match(r"^GEJO-(\d+)$", x)
                    if m:
                        nums.append(int(m.group(1)))
                next_num = max(nums) + 1 if nums else 1
                ejo_id = f"GEJO-{next_num:03d}"

            # ponytail: store the creation date along with the general EJO record
            cursor.execute("""
                INSERT INTO general_ejos (id, title, dept, category, priority, location, targetDate, status, engineer, estCost, actCost, description, logs, requester, is_archived, createdDate)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
            """, (
                ejo_id, data['title'], data['dept'], data['category'],
                data['priority'], data['location'], data['targetDate'],
                data['status'], data['engineer'], data['estCost'],
                data['actCost'], data['description'], json.dumps(data.get('logs', [])),
                data.get('requester', ''), data.get('createdDate', '')
            ))

            # ponytail: auto notifikasi jika engineer ditunjuk saat create
            engineer_name = data.get('engineer', 'Unassigned')
            if engineer_name and engineer_name != 'Unassigned':
                target_username = self._resolve_username(conn, engineer_name)
                if target_username:
                    self._insert_notification(
                        conn, target_username, ejo_id,
                        f"General EJO {ejo_id} ditugaskan kepada Anda: {data['title']}"
                    )

            conn.commit()

            self.send_response(201)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "id": ejo_id}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    def update_general_ejo(self, ejo_id):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        try:
            # ponytail: select createdDate to preserve it during updates
            cursor.execute("SELECT logs, engineer, status, is_archived, approvals, targetDate, estDate, title, dept, category, priority, location, createdDate FROM general_ejos WHERE id = ?", (ejo_id,))
            row = cursor.fetchone()
            current_logs = json.loads(row[0]) if (row and row[0]) else []
            old_engineer = row[1] if row else 'Unassigned'
            old_status = row[2] if row else None
            old_is_archived = row[3] if (row and len(row) > 3) else 0
            old_approvals = row[4] if (row and len(row) > 4 and row[4] is not None) else '{}'
            old_target_date = row[5] if (row and len(row) > 5) else None
            old_est_date = row[6] if (row and len(row) > 6) else None
            old_title = row[7] if (row and len(row) > 7) else ""
            old_dept = row[8] if (row and len(row) > 8) else ""
            old_category = row[9] if (row and len(row) > 9) else ""
            old_priority = row[10] if (row and len(row) > 10) else "Low"
            old_location = row[11] if (row and len(row) > 11) else ""
            old_created_date = row[12] if (row and len(row) > 12) else None

            if 'logs' in data:
                existing_messages = {log['message'] for log in current_logs}
                for log in data['logs']:
                    if log['message'] not in existing_messages:
                        current_logs.append(log)

            is_archived = data.get('is_archived', old_is_archived)
            target_date = data.get('targetDate', old_target_date)
            est_date = data.get('estDate', old_est_date)
            title = data.get('title', old_title)
            dept = data.get('dept', old_dept)
            category = data.get('category', old_category)
            priority = data.get('priority', old_priority)
            location = data.get('location', old_location)
            created_date = data.get('createdDate', old_created_date)
            
            # ponytail: extract approvals and serialize if dictionary
            approvals = data.get('approvals', old_approvals)
            if isinstance(approvals, (dict, list)):
                approvals = json.dumps(approvals)

            if 'description' in data:
                cursor.execute("""
                    UPDATE general_ejos
                    SET status = ?, engineer = ?, estCost = ?, actCost = ?, description = ?, logs = ?, is_archived = ?, approvals = ?, targetDate = ?, estDate = ?, title = ?, dept = ?, category = ?, priority = ?, location = ?, createdDate = ?
                    WHERE id = ?
                """, (data['status'], data['engineer'], data['estCost'],
                      data['actCost'], data['description'], json.dumps(current_logs), is_archived, approvals, target_date, est_date, title, dept, category, priority, location, created_date, ejo_id))
            else:
                cursor.execute("""
                    UPDATE general_ejos
                    SET status = ?, engineer = ?, estCost = ?, actCost = ?, logs = ?, is_archived = ?, approvals = ?, targetDate = ?, estDate = ?, title = ?, dept = ?, category = ?, priority = ?, location = ?, createdDate = ?
                    WHERE id = ?
                """, (data['status'], data['engineer'], data['estCost'],
                      data['actCost'], json.dumps(current_logs), is_archived, approvals, target_date, est_date, title, dept, category, priority, location, created_date, ejo_id))

            # ponytail: auto notifikasi saat assignment/status berubah
            new_engineer = data.get('engineer', old_engineer)
            new_status = data.get('status', old_status)
            if new_engineer != old_engineer and new_engineer != 'Unassigned':
                target_username = self._resolve_username(conn, new_engineer)
                if target_username:
                    self._insert_notification(
                        conn, target_username, ejo_id,
                        f"General EJO {ejo_id} ditugaskan kepada Anda"
                    )
            elif new_status != old_status and new_engineer != 'Unassigned':
                target_username = self._resolve_username(conn, new_engineer)
                if target_username:
                    self._insert_notification(
                        conn, target_username, ejo_id,
                        f"Status General EJO {ejo_id} berubah menjadi {new_status}"
                    )

            # ponytail: notify appropriate approvers based on the pending status stage (User -> Foreman -> Supervisor -> Manager)
            if new_status != old_status and new_status.startswith('Pending') and new_status != 'Pending Revision':
                note = ""
                for log in data.get('logs', []):
                    msg = log.get('message', '')
                    if "Laporan Revisi:" in msg:
                        note = msg.split("Laporan Revisi:")[-1].strip()
                        break
                    elif not msg.startswith("Status dirubah") and not msg.startswith("Engineer ditunjuk"):
                        note = msg.strip()
                        break
                
                notif_msg = f"General EJO {ejo_id} butuh persetujuan Anda"
                if note:
                    notif_msg += f" (Catatan: {note})"

                if new_status == 'Pending User Approval':
                    cursor.execute("SELECT requester FROM general_ejos WHERE id = ?", (ejo_id,))
                    row_req = cursor.fetchone()
                    if row_req and row_req[0]:
                        self._insert_notification(conn, row_req[0], ejo_id, f"General EJO {ejo_id} butuh approval User Anda")
                elif new_status == 'Pending Foreman Approval':
                    cursor.execute("SELECT username FROM users WHERE role IN ('Foreman', 'Admin')")
                    for r in cursor.fetchall():
                        self._insert_notification(conn, r[0], ejo_id, f"General EJO {ejo_id} butuh approval Foreman Anda")
                elif new_status == 'Pending Supervisor Approval':
                    cursor.execute("SELECT username FROM users WHERE role IN ('Supervisor')")
                    for r in cursor.fetchall():
                        self._insert_notification(conn, r[0], ejo_id, f"General EJO {ejo_id} butuh approval Supervisor Anda")
                elif new_status == 'Pending Manager Approval':
                    cursor.execute("SELECT username FROM users WHERE role IN ('Manager', 'Plant Manager')")
                    for r in cursor.fetchall():
                        self._insert_notification(conn, r[0], ejo_id, f"General EJO {ejo_id} butuh approval Manager Anda")

            # ponytail: notify Lead/Admin if status changed to 'Pending Revision' for General EJO
            if new_status == 'Pending Revision' and new_status != old_status:
                cursor.execute("SELECT username FROM users WHERE role IN ('Foreman', 'Admin', 'Manager', 'Supervisor', 'Plant Manager')")
                for r in cursor.fetchall():
                    self._insert_notification(
                        conn, r[0], ejo_id,
                        f"General EJO {ejo_id} mengajukan REVISI, butuh persetujuan Anda"
                    )

            # ponytail: delete any associated drawings if status is changed back to Requested or Cancelled
            if new_status in ('Requested', 'Cancelled'):
                cursor.execute("SELECT file_path FROM drawings WHERE ejo_id = ?", (ejo_id,))
                for row_draw in cursor.fetchall():
                    if row_draw[0]:
                        disk_path = row_draw[0].lstrip('/')
                        if os.path.exists(disk_path):
                            try:
                                os.remove(disk_path)
                            except Exception:
                                pass
                cursor.execute("DELETE FROM drawings WHERE ejo_id = ?", (ejo_id,))

            conn.commit()

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "id": ejo_id}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    def delete_general_ejo(self, ejo_id):
        # ponytail: check authorization (Foreman cannot delete)
        query_params = urllib.parse.parse_qs(urllib.parse.urlsplit(self.path).query)
        requester = query_params.get('requester', [''])[0]

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT role FROM users WHERE username = ?", (requester,))
            requester_row = cursor.fetchone()
            requester_role = requester_row[0] if requester_row else ''
            
            # ponytail: include Admin as restricted role
            if requester_role in ['Foreman', 'Supervisor', 'Manager', 'Plant Manager', 'Admin']:
                self.send_response(403)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Jabatan Anda tidak berhak menghapus General EJO!"}).encode("utf-8"))
                conn.close()
                return

            # ponytail: delete any associated drawings from db and disk when deleting General EJO
            cursor.execute("SELECT file_path FROM drawings WHERE ejo_id = ?", (ejo_id,))
            for row_draw in cursor.fetchall():
                if row_draw[0]:
                    disk_path = row_draw[0].lstrip('/')
                    if os.path.exists(disk_path):
                        try:
                            os.remove(disk_path)
                        except Exception:
                            pass
            cursor.execute("DELETE FROM drawings WHERE ejo_id = ?", (ejo_id,))

            cursor.execute("DELETE FROM general_ejos WHERE id = ?", (ejo_id,))
            conn.commit()

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "id": ejo_id}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    def delete_project(self, proj_id):
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            cursor.execute("DELETE FROM projects WHERE id = ?", (proj_id,))
            conn.commit()
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "id": proj_id}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    # ==========================================
    # Static File Server Helper
    # ==========================================
    def serve_static(self):
        # Normalize and map paths
        # ponytail: extract clean path to safely serve index.html when query params are present (e.g. from default form GET submits)
        clean_path = self.path.split("?")[0]
        if clean_path == "/" or clean_path == "":
            file_name = "index.html"
        else:
            file_name = clean_path.lstrip("/")
        
        # Prevent Directory Traversal vulnerability
        file_path = os.path.abspath(file_name)
        cwd = os.path.abspath(os.getcwd())
        
        if not file_path.startswith(cwd):
            self.send_error(403, "Access denied")
            return
            
        if not os.path.exists(file_path) or not os.path.isfile(file_path):
            self.send_error(404, f"File {file_name} not found")
            return

        # Map MIME Types
        mime_type = "text/plain"
        if file_name.endswith(".html"):
            mime_type = "text/html"
        elif file_name.endswith(".css"):
            mime_type = "text/css"
        elif file_name.endswith(".js"):
            mime_type = "application/javascript"
        elif file_name.endswith(".png"):
            mime_type = "image/png"
        elif file_name.endswith(".jpg") or file_name.endswith(".jpeg"):
            mime_type = "image/jpeg"
        elif file_name.endswith(".svg"):
            mime_type = "image/svg+xml"
        elif file_name.endswith(".webp"):
            mime_type = "image/webp"
        elif file_name.endswith(".pdf"):
            mime_type = "application/pdf"
        elif file_name.endswith(".dwg"):
            mime_type = "image/vnd.dwg"

        # Serve static file
        try:
            with open(file_path, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", mime_type)
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, f"Internal server error serving static file: {str(e)}")

    def get_users(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT username, fullname, role, avatar, password, signature, show_status_prop FROM users")
        rows = cursor.fetchall()
        users = [dict(r) for r in rows]
        conn.close()
        
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(users).encode("utf-8"))

    def create_user(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            # Security check: creator must have higher role level than target role
            creator = data.get('creator_username', '')
            cursor.execute("SELECT role FROM users WHERE username = ?", (creator,))
            creator_row = cursor.fetchone()
            creator_role = creator_row[0] if creator_row else ''
            
            creator_level = get_role_level(creator_role)
            target_level = get_role_level(data.get('role'))
            
            is_valid = False
            if creator_role == 'Server' or creator == 'server' or creator_role.lower() == 'server':
                is_valid = True
            elif creator_level > target_level:
                is_valid = True
                
            if not is_valid:
                self.send_response(403)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Otoritas Anda tidak mencukupi untuk membuat user dengan jabatan tersebut!"}).encode("utf-8"))
                conn.close()
                return

            cursor.execute("""
                INSERT INTO users (username, password, fullname, role, avatar, signature) VALUES (?, ?, ?, ?, ?, ?)
            """, (
                data['username'], data['password'], data['fullname'],
                data['role'], data.get('avatar', ''), data.get('signature', '')
            ))
            conn.commit()
            
            self.send_response(201)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "username": data['username']}).encode("utf-8"))
        except sqlite3.IntegrityError:
            conn.rollback()
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": "Username sudah digunakan oleh user lain!"}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    def update_user(self, username):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            # Security check: creator must have higher role level than target's old role and target's new role
            cursor.execute("SELECT role, password FROM users WHERE username = ?", (username,))
            target_row = cursor.fetchone()
            target_old_role = target_row[0] if target_row else ''
            target_old_password = target_row[1] if target_row else ''
            
            creator = data.get('creator_username', '')
            cursor.execute("SELECT role FROM users WHERE username = ?", (creator,))
            creator_row = cursor.fetchone()
            creator_role = creator_row[0] if creator_row else ''
            
            creator_level = get_role_level(creator_role)
            old_level = get_role_level(target_old_role)
            new_level = get_role_level(data.get('role'))
            
            is_self_update = (creator == username)
            
            if is_self_update:
                old_password = data.get('old_password', '')
                if old_password != target_old_password:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": "Password lama yang Anda masukkan salah!"}).encode("utf-8"))
                    conn.close()
                    return
            
            if is_self_update and data.get('role') != target_old_role:
                self.send_response(403)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Anda tidak diperbolehkan mengubah jabatan Anda sendiri!"}).encode("utf-8"))
                conn.close()
                return

            is_valid = False
            if creator_role == 'Server' or creator == 'server' or creator_role.lower() == 'server':
                is_valid = True
            elif is_self_update:
                is_valid = True
            elif creator_level > old_level and creator_level > new_level:
                is_valid = True
                
            if not is_valid:
                self.send_response(403)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Otoritas Anda tidak mencukupi untuk mengubah user dengan jabatan tersebut!"}).encode("utf-8"))
                conn.close()
                return

            cursor.execute("""
                UPDATE users 
                SET password = ?, fullname = ?, role = ?, avatar = ?, signature = ?
                WHERE username = ?
            """, (
                data.get('password', target_old_password), data.get('fullname', ''), data.get('role', ''),
                data.get('avatar', ''), data.get('signature', ''), username
            ))
            conn.commit()
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "username": username}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
    def update_user_layout_settings(self, username):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            show_status_prop = 1 if data.get('show_status_prop') else 0
            cursor.execute("""
                UPDATE users 
                SET show_status_prop = ?
                WHERE username = ?
            """, (show_status_prop, username))
            conn.commit()
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "username": username}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
    def get_settings(self):
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT key, value FROM settings")
        rows = cursor.fetchall()
        settings = {r[0]: r[1] for r in rows}
        conn.close()
        
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(settings).encode("utf-8"))

    def update_settings(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            for k, v in data.items():
                cursor.execute("""
                    INSERT INTO settings (key, value) VALUES (?, ?)
                    ON CONFLICT(key) DO UPDATE SET value = excluded.value
                """, (k, str(v)))
            conn.commit()
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success"}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    def delete_user(self, username):
        # ponytail: parse query parameters to check authorization level
        query_params = urllib.parse.parse_qs(urllib.parse.urlsplit(self.path).query)
        requester = query_params.get('requester', [''])[0]

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            # Check target's role
            cursor.execute("SELECT role FROM users WHERE username = ?", (username,))
            user_row = cursor.fetchone()
            if not user_row:
                self.send_response(404)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "User tidak ditemukan!"}).encode("utf-8"))
                conn.close()
                return
            
            target_role = user_row[0]
            
            # Check requester's role
            cursor.execute("SELECT role FROM users WHERE username = ?", (requester,))
            requester_row = cursor.fetchone()
            requester_role = requester_row[0] if requester_row else ''
            
            # Enforce hierarchy
            creator_level = get_role_level(requester_role)
            target_level = get_role_level(target_role)
            
            is_valid = False
            if requester_role == 'Server' or requester == 'server' or requester_role.lower() == 'server':
                is_valid = True
            elif creator_level > target_level:
                is_valid = True
                
            if not is_valid:
                self.send_response(403)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Otoritas Anda tidak mencukupi untuk menghapus user dengan jabatan tersebut!"}).encode("utf-8"))
                conn.close()
                return

            cursor.execute("DELETE FROM users WHERE username = ?", (username,))
            conn.commit()
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "username": username}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    # ponytail: manual multipart parsing — cgi module removed in Python 3.13+
    def upload_avatar(self):
        try:
            content_type = self.headers['Content-Type']
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)

            # Extract boundary from Content-Type
            boundary = None
            for part in content_type.split(';'):
                part = part.strip()
                if part.startswith('boundary='):
                    boundary = part.split('=', 1)[1].strip('"')
            if not boundary:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "No boundary found"}).encode("utf-8"))
                return

            # Split body by boundary
            boundary_bytes = ('--' + boundary).encode()
            parts = body.split(boundary_bytes)

            username = ''
            file_data = None
            file_ext = '.png'

            for part in parts:
                if not part or part == b'--\r\n' or part == b'--':
                    continue
                # Split headers from body
                if b'\r\n\r\n' not in part:
                    continue
                header_section, part_body = part.split(b'\r\n\r\n', 1)
                # Remove trailing \r\n
                if part_body.endswith(b'\r\n'):
                    part_body = part_body[:-2]
                header_text = header_section.decode('utf-8', errors='replace')

                if 'name="username"' in header_text:
                    username = part_body.decode('utf-8').strip()
                elif 'name="avatar"' in header_text:
                    file_data = part_body
                    # Extract filename for extension
                    fn_match = re.search(r'filename="([^"]+)"', header_text)
                    if fn_match:
                        ext = os.path.splitext(fn_match.group(1))[1].lower()
                        if ext in ('.jpg', '.jpeg', '.png', '.webp'):
                            file_ext = ext

            if not file_data or not username:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "File atau username tidak valid"}).encode("utf-8"))
                return

            os.makedirs(UPLOAD_DIR, exist_ok=True)
            filename = f"{username}_{uuid.uuid4().hex[:8]}{file_ext}"
            filepath = os.path.join(UPLOAD_DIR, filename)

            with open(filepath, 'wb') as f:
                f.write(file_data)

            avatar_url = f"/{UPLOAD_DIR}/{filename}"

            # Update DB
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("UPDATE users SET avatar = ? WHERE username = ?", (avatar_url, username))
            conn.commit()
            conn.close()

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "avatar": avatar_url}).encode("utf-8"))
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))

    def upload_file(self):
        try:
            content_type = self.headers.get('Content-Type', '')
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)

            # Extract boundary from Content-Type
            boundary = None
            for part in content_type.split(';'):
                part = part.strip()
                if part.startswith('boundary='):
                    boundary = part.split('=', 1)[1].strip('"')
            if not boundary:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "No boundary found"}).encode("utf-8"))
                return

            # Split body by boundary
            boundary_bytes = ('--' + boundary).encode()
            parts = body.split(boundary_bytes)

            file_data = None
            file_ext = '.png'

            for part in parts:
                if not part or part == b'--\r\n' or part == b'--':
                    continue
                if b'\r\n\r\n' not in part:
                    continue
                header_section, part_body = part.split(b'\r\n\r\n', 1)
                if part_body.endswith(b'\r\n'):
                    part_body = part_body[:-2]
                header_text = header_section.decode('utf-8', errors='replace')

                if 'name="file"' in header_text:
                    file_data = part_body
                    fn_match = re.search(r'filename="([^"]+)"', header_text)
                    if fn_match:
                        ext = os.path.splitext(fn_match.group(1))[1].lower()
                        if ext in ('.jpg', '.jpeg', '.png', '.webp', '.pdf', '.xlsx', '.xls', '.csv', '.docx', '.doc'):
                            file_ext = ext
                        else:
                            self.send_response(400)
                            self.send_header("Content-Type", "application/json")
                            self.end_headers()
                            self.wfile.write(json.dumps({"status": "error", "message": "Format file tidak didukung"}).encode("utf-8"))
                            return

            if not file_data:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "File tidak valid"}).encode("utf-8"))
                return

            os.makedirs(UPLOAD_DIR, exist_ok=True)
            filename = f"rev_{uuid.uuid4().hex[:8]}{file_ext}"
            filepath = os.path.join(UPLOAD_DIR, filename)

            with open(filepath, 'wb') as f:
                f.write(file_data)

            file_url = f"/{UPLOAD_DIR}/{filename}"

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "file_url": file_url}).encode("utf-8"))
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))

    def upload_project_doc(self):
        try:
            content_type = self.headers['Content-Type']
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)

            # Extract boundary from Content-Type
            boundary = None
            for part in content_type.split(';'):
                part = part.strip()
                if part.startswith('boundary='):
                    boundary = part.split('=', 1)[1].strip('"')
            if not boundary:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "No boundary found"}).encode("utf-8"))
                return

            # Split body by boundary
            boundary_bytes = ('--' + boundary).encode()
            parts = body.split(boundary_bytes)

            proj_id = ''
            file_data = None
            file_ext = '.png'
            doc_type = 'boq'

            for part in parts:
                if not part or part == b'--\r\n' or part == b'--':
                    continue
                if b'\r\n\r\n' not in part:
                    continue
                header_section, part_body = part.split(b'\r\n\r\n', 1)
                if part_body.endswith(b'\r\n'):
                    part_body = part_body[:-2]
                header_text = header_section.decode('utf-8', errors='replace')

                if 'name="project_id"' in header_text:
                    proj_id = part_body.decode('utf-8').strip()
                elif 'name="doc_type"' in header_text:
                    doc_type = part_body.decode('utf-8').strip()
                elif 'name="file"' in header_text:
                    file_data = part_body
                    fn_match = re.search(r'filename="([^"]+)"', header_text)
                    if fn_match:
                        ext = os.path.splitext(fn_match.group(1))[1].lower()
                        if ext in ('.jpg', '.jpeg', '.png', '.webp', '.pdf', '.xlsx', '.xls', '.csv'):
                            file_ext = ext
                        else:
                            # Reject invalid file extension
                            self.send_response(400)
                            self.send_header("Content-Type", "application/json")
                            self.end_headers()
                            self.wfile.write(json.dumps({"status": "error", "message": "Format file tidak didukung. Hanya diperbolehkan foto, PDF, Excel, atau CSV."}).encode("utf-8"))
                            return

            if not file_data or not proj_id:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "File atau ID project tidak valid"}).encode("utf-8"))
                return

            os.makedirs(UPLOAD_DIR, exist_ok=True)
            filename = f"proj_{proj_id.lower()}_{uuid.uuid4().hex[:8]}{file_ext}"
            filepath = os.path.join(UPLOAD_DIR, filename)

            with open(filepath, 'wb') as f:
                f.write(file_data)

            doc_url = f"/{UPLOAD_DIR}/{filename}"

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            col_name = "execution_docs" if doc_type == "execution" else "docs"
            cursor.execute(f"SELECT {col_name} FROM projects WHERE id = ?", (proj_id,))
            row = cursor.fetchone()
            current_docs = []
            if row and row[0]:
                try:
                    current_docs = json.loads(row[0])
                except:
                    current_docs = []
            
            current_docs.append(doc_url)
            
            cursor.execute(f"UPDATE projects SET {col_name} = ? WHERE id = ?", (json.dumps(current_docs), proj_id))
            conn.commit()
            conn.close()

            response_data = {
                "status": "success",
                "url": doc_url
            }
            if col_name == "docs":
                response_data["docs"] = current_docs
            else:
                response_data["execution_docs"] = current_docs

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode("utf-8"))
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))

    # ==========================================
    # ponytail: Drawing gallery — galeri gambar teknik terkait EJO
    # ==========================================
    def get_drawings(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, ejo_id, title, file_path, uploader, uploaded_at, status, approvals, logs,
                   dept, category, priority, location, targetDate, description, requester, engineer, estDate, drawing_type
            FROM drawings
            ORDER BY uploaded_at DESC, id DESC
        """)
        rows = []
        for r in cursor.fetchall():
            d = dict(r)
            d['approvals'] = json.loads(d['approvals']) if d['approvals'] else {}
            d['logs'] = json.loads(d['logs']) if d['logs'] else []
            rows.append(d)
        conn.close()

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(rows).encode("utf-8"))

    def upload_drawing(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)

        try:
            content_type = self.headers.get('Content-Type', '')
            boundary = None
            for part in content_type.split(';'):
                part = part.strip()
                if part.startswith('boundary='):
                    boundary = part.split('=', 1)[1].strip('"')
            if not boundary:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "No boundary"}).encode("utf-8"))
                return

            boundary_bytes = ('--' + boundary).encode()
            parts = body.split(boundary_bytes)

            drawing_id_input = ''
            ejo_id = ''
            title = ''
            uploader = ''
            file_data = None
            file_ext = ''
            # ponytail: field baru disamakan dengan general EJO
            dept = ''
            category = ''
            priority = 'Low'
            location = ''
            targetDate = ''
            description = ''
            requester = ''
            drawing_type = 'request'

            for part in parts:
                if not part or part == b'--\r\n' or part == b'--':
                    continue
                if b'\r\n\r\n' not in part:
                    continue
                header_section, part_body = part.split(b'\r\n\r\n', 1)
                if part_body.endswith(b'\r\n'):
                    part_body = part_body[:-2]
                header_text = header_section.decode('utf-8', errors='replace')

                if 'name="drawing_id"' in header_text:
                    drawing_id_input = part_body.decode('utf-8').strip()
                elif 'name="ejo_id"' in header_text:
                    ejo_id = part_body.decode('utf-8').strip()
                elif 'name="title"' in header_text:
                    title = part_body.decode('utf-8').strip()
                elif 'name="uploader"' in header_text:
                    uploader = part_body.decode('utf-8').strip()
                elif 'name="dept"' in header_text:
                    dept = part_body.decode('utf-8').strip()
                elif 'name="category"' in header_text:
                    category = part_body.decode('utf-8').strip()
                elif 'name="priority"' in header_text:
                    priority = part_body.decode('utf-8').strip() or 'Low'
                elif 'name="location"' in header_text:
                    location = part_body.decode('utf-8').strip()
                elif 'name="targetDate"' in header_text:
                    targetDate = part_body.decode('utf-8').strip()
                elif 'name="description"' in header_text:
                    description = part_body.decode('utf-8').strip()
                elif 'name="requester"' in header_text:
                    requester = part_body.decode('utf-8').strip()
                elif 'name="drawing_type"' in header_text:
                    drawing_type = part_body.decode('utf-8').strip() or 'request'
                elif 'name="file"' in header_text:
                    file_data = part_body
                    fn_match = re.search(r'filename="([^"]+)"', header_text)
                    if fn_match:
                        ext = os.path.splitext(fn_match.group(1))[1].lower()
                        if ext in ('.jpg', '.jpeg', '.png', '.webp', '.pdf', '.dwg'):
                            file_ext = ext

            if not title:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Judul drawing wajib diisi"}).encode("utf-8"))
                return
            if file_data and file_ext not in ('.jpg', '.jpeg', '.png', '.webp', '.pdf', '.dwg'):
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Format file harus jpg/jpeg/png/webp/pdf/dwg"}).encode("utf-8"))
                return

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()

            # ponytail: delete any existing drawing associated with this ejo_id to avoid compounding/duplicates
            if ejo_id:
                cursor.execute("SELECT file_path FROM drawings WHERE ejo_id = ?", (ejo_id,))
                for row_draw in cursor.fetchall():
                    if row_draw[0]:
                        disk_path = row_draw[0].lstrip('/')
                        if os.path.exists(disk_path):
                            try:
                                os.remove(disk_path)
                            except Exception:
                                pass
                cursor.execute("DELETE FROM drawings WHERE ejo_id = ?", (ejo_id,))

            # ponytail: reject if creator is a Drafter (matching General EJO)
            if requester or uploader:
                creator = requester or uploader
                cursor.execute("SELECT role FROM users WHERE username = ? OR fullname = ?", (creator, creator))
                user_row = cursor.fetchone()
                if user_row and user_row[0] in ('Drafter', 'Sipil', 'Mekanik', 'Elektrik', 'Program', 'Kalibrasi'):
                    self.send_response(403)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": f"{user_row[0]} tidak diperbolehkan membuat Request Drawing."}).encode("utf-8"))
                    conn.close()
                    return

                # ponytail: enforce limit of 2 active drawings per user (excluding Completed/Cancelled/Archived and Rejected) for User role only
                if user_row and user_row[0] == 'User':
                    cursor.execute("""
                        SELECT COUNT(*) FROM drawings 
                        WHERE (uploader = ? OR uploader IN (SELECT fullname FROM users WHERE username = ?)) 
                          AND status != 'Completed' AND status != 'Cancelled' AND status != 'Archived' AND status != 'Rejected'
                    """, (creator, creator))
                    count = cursor.fetchone()[0]
                    if count >= 2:
                        self.send_response(400)
                        self.send_header("Content-Type", "application/json")
                        self.end_headers()
                        self.wfile.write(json.dumps({"status": "error", "message": "Batas pembuatan Drawing tercapai! Anda hanya dapat membuat maksimal 2 Drawing aktif."}).encode("utf-8"))
                        conn.close()
                        return

            if drawing_id_input:
                cursor.execute("SELECT id FROM drawings WHERE id = ?", (drawing_id_input,))
                if cursor.fetchone():
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": "ID Drawing sudah terpakai"}).encode("utf-8"))
                    conn.close()
                    return
                drawing_id = drawing_id_input
            else:
                cursor.execute("SELECT id FROM drawings WHERE id LIKE 'DRW-%'")
                existing = [row[0] for row in cursor.fetchall()]
                nums = []
                for x in existing:
                    m = re.match(r"^DRW-(\d+)$", x)
                    if m:
                        nums.append(int(m.group(1)))
                next_num = max(nums) + 1 if nums else 1
                drawing_id = f"DRW-{next_num:03d}"

            file_url = ""
            if file_data and file_ext:
                os.makedirs(UPLOAD_DIR, exist_ok=True)
                file_uuid = uuid.uuid4().hex[:8]
                filename = f"{drawing_id.lower()}_{file_uuid}{file_ext}"
                filepath = os.path.join(UPLOAD_DIR, filename)
                with open(filepath, 'wb') as f:
                    f.write(file_data)
                file_url = f"/{UPLOAD_DIR}/{filename}"

            now = __import__('datetime').datetime.now().strftime("%Y-%m-%d %H:%M")
            drawing_type_label = "Import" if drawing_type == "import" else "Request"
            initial_logs = [{
                "date": now,
                "message": f"{drawing_type_label} drawing dibuat oleh {uploader or requester} dengan status Pending Foreman Approval."
            }]
            cursor.execute(
                "INSERT INTO drawings (id, ejo_id, title, file_path, uploader, uploaded_at, status, approvals, logs, dept, category, priority, location, targetDate, description, requester, drawing_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (drawing_id, ejo_id or None, title, file_url, uploader, now, 'Pending Foreman Approval', '{}', json.dumps(initial_logs), dept, category, priority, location, targetDate, description, requester, drawing_type)
            )
            conn.commit()
            conn.close()

            self.send_response(201)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "id": drawing_id, "file_path": file_url}).encode("utf-8"))
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))

    def update_drawing(self, drawing_id):
        # ponytail: update status, approvals, and logs of a technical drawing
        content_type = self.headers.get('Content-Type', '')
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        try:
            cursor.execute("SELECT status, approvals, logs, engineer, ejo_id, file_path, targetDate, estDate, title, dept, category, priority, location, description, sub_status FROM drawings WHERE id = ?", (drawing_id,))
            row = cursor.fetchone()
            if not row:
                self.send_response(404)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Drawing not found"}).encode("utf-8"))
                conn.close()
                return

            old_status = row[0]
            old_approvals = row[1] if row[1] is not None else '{}'
            current_logs = json.loads(row[2]) if row[2] else []
            old_engineer = row[3]
            ejo_id = row[4]
            old_file_path = row[5]
            old_targetDate = row[6]
            old_estDate = row[7]
            old_title = row[8] if row[8] is not None else ""
            old_dept = row[9] if row[9] is not None else ""
            old_category = row[10] if row[10] is not None else ""
            old_priority = row[11] if row[11] is not None else "Low"
            old_location = row[12] if row[12] is not None else ""
            old_description = row[13] if row[13] is not None else ""
            old_sub_status = row[14] if len(row) > 14 and row[14] is not None else ""

            status = old_status
            approvals = old_approvals
            engineer = old_engineer
            file_url = old_file_path
            targetDate = old_targetDate
            estDate = old_estDate
            title = old_title
            dept = old_dept
            category = old_category
            priority = old_priority
            location = old_location
            description = old_description
            sub_status = old_sub_status

            if 'multipart/form-data' in content_type:
                # Parse multipart
                boundary = None
                for part in content_type.split(';'):
                    part = part.strip()
                    if part.startswith('boundary='):
                        boundary = part.split('=', 1)[1].strip('"')
                if not boundary:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": "No boundary"}).encode("utf-8"))
                    conn.close()
                    return

                boundary_bytes = ('--' + boundary).encode()
                parts = post_data.split(boundary_bytes)

                uploader = ''
                file_data = None
                file_ext = ''

                for part in parts:
                    if not part or part == b'--\r\n' or part == b'--':
                        continue
                    if b'\r\n\r\n' not in part:
                        continue
                    header_section, part_body = part.split(b'\r\n\r\n', 1)
                    if part_body.endswith(b'\r\n'):
                        part_body = part_body[:-2]
                    header_text = header_section.decode('utf-8', errors='replace')

                    if 'name="uploader"' in header_text:
                        uploader = part_body.decode('utf-8').strip()
                    elif 'name="title"' in header_text:
                        title = part_body.decode('utf-8').strip()
                    elif 'name="dept"' in header_text:
                        dept = part_body.decode('utf-8').strip()
                    elif 'name="category"' in header_text:
                        category = part_body.decode('utf-8').strip()
                    elif 'name="priority"' in header_text:
                        priority = part_body.decode('utf-8').strip()
                    elif 'name="targetDate"' in header_text:
                        targetDate = part_body.decode('utf-8').strip()
                    elif 'name="location"' in header_text:
                        location = part_body.decode('utf-8').strip()
                    elif 'name="description"' in header_text:
                        description = part_body.decode('utf-8').strip()
                    elif 'name="ejo_id"' in header_text:
                        val = part_body.decode('utf-8').strip()
                        ejo_id = val if val else None
                    elif 'name="file"' in header_text:
                        file_data = part_body
                        fn_match = re.search(r'filename="([^"]+)"', header_text)
                        if fn_match:
                            ext = os.path.splitext(fn_match.group(1))[1].lower()
                            if ext in ('.jpg', '.jpeg', '.png', '.webp', '.pdf'):
                                file_ext = ext

                if file_data and file_ext:
                    # Delete old file if exists
                    if old_file_path:
                        old_disk_path = old_file_path.lstrip('/')
                        if os.path.exists(old_disk_path):
                            try:
                                os.remove(old_disk_path)
                            except:
                                pass

                    os.makedirs(UPLOAD_DIR, exist_ok=True)
                    file_uuid = uuid.uuid4().hex[:8]
                    filename = f"{drawing_id.lower()}_{file_uuid}{file_ext}"
                    filepath = os.path.join(UPLOAD_DIR, filename)
                    with open(filepath, 'wb') as f:
                        f.write(file_data)
                    file_url = f"/{UPLOAD_DIR}/{filename}"

                    now = __import__('datetime').datetime.now().strftime("%Y-%m-%d %H:%M")
                    current_logs.append({
                        "date": now,
                        "message": f"File drawing berhasil diunggah oleh {uploader}."
                    })
                elif not file_data:
                    pass
                else:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": "Format file tidak valid atau data file kosong."}).encode("utf-8"))
                    conn.close()
                    return
            else:
                # Handle JSON payload
                data = json.loads(post_data.decode("utf-8"))
                if 'logs' in data:
                    existing_messages = {log['message'] for log in current_logs}
                    for log in data['logs']:
                        if log['message'] not in existing_messages:
                            current_logs.append(log)

                status = data.get('status', old_status)
                approvals = data.get('approvals', old_approvals)
                if isinstance(approvals, (dict, list)):
                    approvals = json.dumps(approvals)
                engineer = data.get('engineer', old_engineer)
                targetDate = data.get('targetDate', old_targetDate)
                estDate = data.get('estDate', old_estDate)
                title = data.get('title', old_title)
                dept = data.get('dept', old_dept)
                category = data.get('category', old_category)
                priority = data.get('priority', old_priority)
                location = data.get('location', old_location)
                description = data.get('description', old_description)
                ejo_id = data.get('ejo_id', ejo_id)
                sub_status = data.get('sub_status', old_sub_status)

                # ponytail: block approval if no drafter/engineer is assigned to the drawing request
                if status in ('Checking', 'On Progress') and old_status == 'Pending Foreman Approval':
                    # Check EJO engineer if not assigned on drawing
                    ejo_eng = None
                    if ejo_id:
                        cursor.execute("SELECT engineer FROM ejos WHERE id = ?", (ejo_id,))
                        e_row = cursor.fetchone()
                        if e_row:
                            ejo_eng = e_row[0]
                        else:
                            cursor.execute("SELECT engineer FROM general_ejos WHERE id = ?", (ejo_id,))
                            g_row = cursor.fetchone()
                            if g_row:
                                ejo_eng = g_row[0]

                    has_assignee = False
                    if engineer and engineer not in ('', 'Unassigned'):
                        has_assignee = True
                    elif ejo_eng and ejo_eng not in ('', 'Unassigned'):
                        has_assignee = True

                    if not has_assignee:
                        self.send_response(400)
                        self.send_header("Content-Type", "application/json")
                        self.end_headers()
                        self.wfile.write(json.dumps({"status": "error", "message": "Penugasan drafter/engineer belum ditentukan! Silakan pilih penugasan terlebih dahulu."}).encode("utf-8"))
                        conn.close()
                        return

            # ponytail: auto-sign PDF on approval state transitions
            try:
                old_apps = json.loads(old_approvals) if old_approvals else {}
                new_apps = json.loads(approvals) if approvals else {}
                for role_key in ['foreman', 'supervisor', 'manager', 'requester']:
                    new_app = new_apps.get(role_key)
                    if new_app and new_app.get('signature'):
                        old_app = old_apps.get(role_key)
                        if not old_app or old_app.get('signature') != new_app.get('signature'):
                            apply_pdf_signature(file_url, role_key, new_app['signature'], new_app.get('signer', ''))
            except Exception as sig_err:
                print(f"Error processing PDF signature injection: {sig_err}")

            cursor.execute("""
                UPDATE drawings
                SET status = ?, approvals = ?, logs = ?, engineer = ?, file_path = ?, targetDate = ?, estDate = ?,
                    title = ?, dept = ?, category = ?, priority = ?, location = ?, description = ?, ejo_id = ?, sub_status = ?
                WHERE id = ?
            """, (status, approvals, json.dumps(current_logs), engineer, file_url, targetDate, estDate,
                  title, dept, category, priority, location, description, ejo_id, sub_status, drawing_id))
            conn.commit()
            conn.close()

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "id": drawing_id, "file_path": file_url}).encode("utf-8"))
        except Exception as e:
            try:
                conn.rollback()
                conn.close()
            except:
                pass
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))

    def delete_drawing(self, drawing_id):
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            # ponytail: hapus file di disk juga
            cursor.execute("SELECT file_path FROM drawings WHERE id = ?", (drawing_id,))
            row = cursor.fetchone()
            if row and row[0]:
                disk_path = row[0].lstrip('/')
                if os.path.exists(disk_path):
                    os.remove(disk_path)
            cursor.execute("DELETE FROM drawings WHERE id = ?", (drawing_id,))
            conn.commit()

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "id": drawing_id}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    def nuclear_database(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        username = data.get('username')
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        try:
            # Verify that the requester has the 'Server' role
            cursor.execute("SELECT role FROM users WHERE username = ?", (username,))
            row = cursor.fetchone()
            role = row[0] if row else ''
            is_server = role == 'Server' or username == 'server' or role.lower() == 'server'
            if not is_server:
                self.send_response(403)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Otoritas tidak cukup"}).encode("utf-8"))
                conn.close()
                return

            # Drop all tables
            tables = ['ejos', 'projects', 'users', 'settings', 'notifications', 'general_ejos', 'drawings', 'repair_parts']
            for table in tables:
                cursor.execute(f"DROP TABLE IF EXISTS {table}")
            conn.commit()
            conn.close()

            # Re-initialize database without seeding default data
            init_db(seed_defaults=False)

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "message": "Database berhasil dinuclear!"}).encode("utf-8"))
        except Exception as e:
            if conn:
                conn.close()
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))

# ponytail: auto-reload server when files modify to eliminate manual restarts
def start_reloader():
    def watch_files():
        watched_extensions = ('.py', '.js', '.html', '.css')
        mtimes = {}
        ignored_dirs = {'node_modules', '.git', 'uploads', '.superpowers', '.kimchi', '.agents', '_pm', 'scratch', '__pycache__'}
        
        for root, dirs, files in os.walk('.'):
            # ponytail: filter out ignored directories in-place to avoid deep traversing and unnecessary restarts
            dirs[:] = [d for d in dirs if d not in ignored_dirs]
            for file in files:
                if file.endswith(watched_extensions):
                    path = os.path.join(root, file)
                    try:
                        mtimes[path] = os.path.getmtime(path)
                    except OSError:
                        pass
        
        while True:
            time.sleep(1)
            changed = False
            for root, dirs, files in os.walk('.'):
                dirs[:] = [d for d in dirs if d not in ignored_dirs]
                for file in files:
                    if file.endswith(watched_extensions):
                        path = os.path.join(root, file)
                        try:
                            mtime = os.path.getmtime(path)
                            if path not in mtimes:
                                mtimes[path] = mtime
                                changed = True
                            elif mtimes[path] != mtime:
                                mtimes[path] = mtime
                                changed = True
                        except OSError:
                            pass
            
            if changed:
                print("\n[PT. BAS] Perubahan kode terdeteksi! Memulai ulang server...")
                os.execv(sys.executable, [sys.executable] + sys.argv)
                
    watcher = threading.Thread(target=watch_files, daemon=True)
    watcher.start()

# ==========================================
# Run Server
# ==========================================
if __name__ == "__main__":
    start_reloader()
    init_db()

    # ponytail: ThreadingTCPServer agar POST login nggak ke-block oleh request lain
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", PORT), EJORestHandler) as httpd:

        # ponytail: tampilkan semua alamat akses supaya user tau IP untuk buka dari HP
        hostname = socket.gethostname()
        try:
            local_ip = socket.gethostbyname(hostname)
        except Exception:
            local_ip = "0.0.0.0"
        print(f"[PT. BAS] EJO Database REST Server")
        print(f"  Lokal:     http://localhost:{PORT}")
        print(f"  Jaringan:  http://{local_ip}:{PORT}")
        print(f"  (Pastikan HP & komputer di WiFi yang sama)")
        print()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
