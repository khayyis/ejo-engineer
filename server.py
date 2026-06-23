# ponytail: Built using only the Python standard library (http.server and sqlite3) to avoid external framework dependencies (like Flask or FastAPI).
# ponytail: SQLite database used as it requires no configuration or external server setup.

import http.server
import socketserver
import json
import sqlite3
import os
import re
import urllib.parse
import uuid

# ponytail: auto-timeout decorator for all connections to prevent database lock conflicts
sqlite3.connect_orig = sqlite3.connect
sqlite3.connect = lambda database, *args, **kwargs: sqlite3.connect_orig(database, *args, timeout=30.0, **kwargs)

PORT = 8000
DB_FILE = "ejo_database.db"
UPLOAD_DIR = "uploads"  # ponytail: simple folder for avatar files


# ==========================================
# Database Initializations
# ==========================================
def init_db():
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
            requester TEXT
        )
    """)
    
    # ponytail: Add requester column if table already exists without it
    try:
        cursor.execute("ALTER TABLE ejos ADD COLUMN requester TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass  # Column already exists
    
    
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
            phase INTEGER
        )
    """)

    # Create Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password TEXT NOT NULL,
            fullname TEXT,
            role TEXT,
            avatar TEXT
        )
    """)
    
    conn.commit()
    
    # Populate default EJOs if empty
    cursor.execute("SELECT COUNT(*) FROM ejos")
    if cursor.fetchone()[0] == 0:
        default_ejos = [
            ("EJO-2026-001", "Perbaikan Kebocoran Hidrolik Press Machine #3", "Production", "Mekanik", "Emergency", "Press Area - Line 1", "2026-06-25", "In Progress", "Ahmad Dani", 5000000, 4500000, "Terjadi kebocoran oli hidrolik pada cylinder clamping Press Machine #3 yang mengakibatkan penurunan tekanan kerja. Kebutuhan spare part: Seal Kit Cylinder Clamping & Oli Hidrolik ISO VG 46.", json.dumps([
                {"date": "2026-06-22 08:30", "message": "Job Order diajukan oleh Dept Production."},
                {"date": "2026-06-22 09:15", "message": "Disetujui oleh Ahmad Dani (Lead Engineer)."},
                {"date": "2026-06-22 10:00", "message": "Status diubah menjadi In Progress. Penugasan kepada Ahmad Dani."}
            ]), "Khayyis Billawal Rozikin"),
            ("EJO-2026-002", "Instalasi Sensor Proximity Otomatis Conveyor Belt B", "Production", "Program", "Medium", "Packaging Area", "2026-06-30", "Requested", "Budi Utomo", 12000000, 0, "Penambahan sensor proximity photoelectric untuk mendeteksi bottle jamming secara otomatis pada conveyor line packaging. PLC Omron CP1E perlu diprogram ulang.", json.dumps([
                {"date": "2026-06-23 07:45", "message": "Job Order diajukan oleh Dept Production."}
            ]), "Khayyis Billawal Rozikin"),
            ("EJO-2026-003", "Re-wiring Control Panel Chiller Unit 02", "Maintenance", "Elektrik", "High", "Utility Room 1", "2026-06-20", "Completed", "Budi Utomo", 8000000, 8200000, "Kabel internal control panel chiller 02 mengalami korosi dan overloading. Telah dilakukan rewiring kabel power dan control serta penggantian MCB 3 Phase Schneider.", json.dumps([
                {"date": "2026-06-18 13:00", "message": "Job Order diajukan oleh Dept Maintenance."},
                {"date": "2026-06-18 14:00", "message": "Disetujui oleh Ahmad Dani."},
                {"date": "2026-06-19 08:00", "message": "Pekerjaan dimulai oleh Budi Utomo."},
                {"date": "2026-06-20 16:30", "message": "Pekerjaan selesai dilakukan. Pengujian chiller normal."}
            ]), "Ahmad Dani"),
            ("EJO-2026-004", "Penguatan Struktur Warehouse Platform Area Rak B", "HSE", "Sipil", "Low", "Main Warehouse B1", "2026-07-15", "Approved", "Charlie Santoso", 25000000, 0, "Pekerjaan perkuatan tiang baja platform mezzanine rak B guna mengantisipasi beban overload penyimpanan spare part berat. Menggunakan H-Beam 150 & pengelasan structural.", json.dumps([
                {"date": "2026-06-21 10:00", "message": "Job Order diajukan oleh Dept HSE."},
                {"date": "2026-06-22 14:30", "message": "Disetujui oleh Ahmad Dani (Lead Engineer)."}
            ]), "Khayyis Billawal Rozikin"),
            ("EJO-2026-005", "Kalibrasi Temperature Controller Oven 4", "Quality Control", "Kalibrasi", "Medium", "QC Lab & Baking Room", "2026-06-28", "In Progress", "Deddy Corbuzier", 3500000, 1200000, "Penyimpangan pembacaan temperatur oven 4 sebesar +5°C. Diperlukan re-kalibrasi thermo-controller Autonics menggunakan dry-block calibrator standar lab.", json.dumps([
                {"date": "2026-06-22 15:00", "message": "Job Order diajukan oleh Dept Quality Control."},
                {"date": "2026-06-23 08:30", "message": "Pekerjaan dimulai oleh Deddy Corbuzier."}
            ]), "Ahmad Dani")
        ]
        cursor.executemany("INSERT INTO ejos VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", default_ejos)
        conn.commit()

    # Populate default projects if empty
    cursor.execute("SELECT COUNT(*) FROM projects")
    if cursor.fetchone()[0] == 0:
        default_projects = [
            ("PRJ-2026-001", "Pemasangan Sistem SCADA Boiler House", "Utility", 150000000, "2026-08-30", "Budi Utomo", "Integrasi pembacaan temperatur, steam pressure, dan flow rate boiler unit 1 & 2 ke sistem monitoring control room utama pabrik.", 2),
            ("PRJ-2026-002", "Renovasi Area Penyimpanan Bahan Baku Cair", "HSE", 80000000, "2026-09-15", "Charlie Santoso", "Pengecoran lantai epoxy, pembuatan tanggul pengaman tumpahan bahan kimia cair, dan pemasangan grounding tank pengaman petir.", 1),
            ("PRJ-2026-003", "Upgrade Line Sensor Detection Mesin Filling 250ml", "Production", 45000000, "2026-07-10", "Deddy Corbuzier", "Penggantian limit switch lama dengan photoelectric proximity sensor berkecepatan tinggi merk Autonics. Semua barang telah siap di gudang.", 3)
        ]
        cursor.executemany("INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?)", default_projects)
        conn.commit()

    # Populate default users if empty
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        default_users = [
            ("dani", "dani123", "Ahmad Dani", "Lead Engineer", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=80"),
            ("budi", "budi123", "Budi Utomo", "Senior Technician", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80"),
            ("charlie", "charlie123", "Charlie Santoso", "Structural Engineer", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80"),
            ("deddy", "deddy123", "Deddy Corbuzier", "Calibration Engineer", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80")
        ]
        cursor.executemany("INSERT INTO users VALUES (?, ?, ?, ?, ?)", default_users)
        conn.commit()

    conn.close()

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
        # 1. REST API GET Routes
        if self.path == "/api/ejos":
            self.get_ejos()
        elif self.path == "/api/projects":
            self.get_projects()
        elif self.path == "/api/users":
            self.get_users()
            
        # 2. Static Files Handling
        else:
            self.serve_static()

    def do_POST(self):
        if self.path == "/api/ejos":
            self.create_ejo()
        elif self.path == "/api/projects":
            self.create_project()
        elif self.path == "/api/login":
            self.login_user()
        elif self.path == "/api/users":
            self.create_user()
        elif self.path == "/api/upload-avatar":
            self.upload_avatar()
        else:
            self.send_error(404, "API endpoint not found")

    def do_PUT(self):
        if self.path.startswith("/api/ejos/"):
            ejo_id = self.path.split("/")[-1]
            self.update_ejo(ejo_id)
        elif self.path.startswith("/api/projects/"):
            proj_id = self.path.split("/")[-1]
            self.update_project(proj_id)
        elif self.path.startswith("/api/users/"):
            username = self.path.split("/")[-1]
            self.update_user(username)
        else:
            self.send_error(404, "API endpoint not found")

    def do_DELETE(self):
        if self.path.startswith("/api/ejos/"):
            ejo_id = self.path.split("/")[-1]
            self.delete_ejo(ejo_id)
        elif self.path.startswith("/api/projects/"):
            proj_id = self.path.split("/")[-1]
            self.delete_project(proj_id)
        elif self.path.startswith("/api/users/"):
            username = self.path.split("/")[-1]
            self.delete_user(username)
        else:
            self.send_error(404, "API endpoint not found")

    # ==========================================
    # API Controller Functions
    # ==========================================
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
        
        projects = [dict(r) for r in rows]
        conn.close()
        
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(projects).encode("utf-8"))

    def login_user(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        username = data.get('username')
        password = data.get('password')
        
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT username, fullname, role, avatar FROM users WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()
        conn.close()
        
        if user:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(dict(user)).encode("utf-8"))
        else:
            self.send_response(401)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": "Username atau password salah"}).encode("utf-8"))

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

            cursor.execute("""
                INSERT INTO ejos VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                ejo_id, data['title'], data['dept'], data['category'],
                data['priority'], data['location'], data['targetDate'],
                data['status'], data['engineer'], data['estCost'],
                data['actCost'], data['description'], json.dumps(data.get('logs', [])),
                data.get('requester', '')
            ))
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
            cursor.execute("""
                INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                data['id'], data['title'], data['dept'], data['budget'],
                data['targetDate'], data['pic'], data['desc'], data['phase']
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

    def update_ejo(self, ejo_id):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        try:
            # First fetch current logs, append new ones if any
            cursor.execute("SELECT logs FROM ejos WHERE id = ?", (ejo_id,))
            row = cursor.fetchone()
            current_logs = json.loads(row[0]) if (row and row[0]) else []
            
            if 'logs' in data:
                # Merge logic
                # Only add logs that are not already present
                existing_messages = {log['message'] for log in current_logs}
                for log in data['logs']:
                    if log['message'] not in existing_messages:
                        current_logs.append(log)

            # ponytail: Support updating description (containing attachments)
            if 'description' in data:
                cursor.execute("""
                    UPDATE ejos 
                    SET status = ?, engineer = ?, estCost = ?, actCost = ?, description = ?, logs = ?
                    WHERE id = ?
                """, (
                    data['status'], data['engineer'], data['estCost'],
                    data['actCost'], data['description'], json.dumps(current_logs), ejo_id
                ))
            else:
                cursor.execute("""
                    UPDATE ejos 
                    SET status = ?, engineer = ?, estCost = ?, actCost = ?, logs = ?
                    WHERE id = ?
                """, (
                    data['status'], data['engineer'], data['estCost'],
                    data['actCost'], json.dumps(current_logs), ejo_id
                ))
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
            cursor.execute("""
                UPDATE projects 
                SET phase = ?
                WHERE id = ?
            """, (data['phase'], proj_id))
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
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
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
        path = self.path
        if path == "/" or path == "":
            file_name = "index.html"
        else:
            file_name = path.lstrip("/")
            
        # Parse query params out of static paths if any
        file_name = file_name.split("?")[0]
        
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
        cursor.execute("SELECT username, fullname, role, avatar, password FROM users")
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
            cursor.execute("""
                INSERT INTO users VALUES (?, ?, ?, ?, ?)
            """, (
                data['username'], data['password'], data['fullname'],
                data['role'], data.get('avatar', '')
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
            cursor.execute("""
                UPDATE users 
                SET password = ?, fullname = ?, role = ?, avatar = ?
                WHERE username = ?
            """, (
                data['password'], data['fullname'], data['role'],
                data.get('avatar', ''), username
            ))
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

    def delete_user(self, username):
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
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

# ==========================================
# Run Server
# ==========================================
if __name__ == "__main__":
    init_db()
    
    # ponytail: ThreadingTCPServer agar POST login nggak ke-block oleh request lain
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", PORT), EJORestHandler) as httpd:
        print(f"[PT. BAS] EJO Database REST Server listening at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
