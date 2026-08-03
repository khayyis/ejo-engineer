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

PORT = int(os.environ.get("PORT", 8000))
DB_FILE = "ejo_database.db"
UPLOAD_DIR = "uploads"  # ponytail: simple folder for avatar files


# ponytail: store active sessions in-memory and use a lock to ensure thread safety
ACTIVE_SESSIONS = {}
ACTIVE_SESSIONS_LOCK = threading.Lock()
FORCED_LOGOUT_SESSIONS = set()

# ponytail: PyMuPDF import and PDF signature helper for drawing etiket
try:
    import fitz
    import base64
except ImportError:
    fitz = None

def apply_pdf_signature(file_url, role, signature_base64, signer_name, etiket_category='Sipil', etiket_orientation='landscape'):
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
        # Decode base64 image if valid
        img_bytes = None
        if signature_base64 and isinstance(signature_base64, str):
            if ',' in signature_base64:
                header, base64_str = signature_base64.split(",", 1)
            else:
                base64_str = signature_base64
            try:
                img_bytes = base64.b64decode(base64_str)
            except Exception as b64_err:
                print(f"Non-base64 signature string for role '{role}': {b64_err}")
                img_bytes = None

        doc = fitz.open(local_path)
        page = doc[0]
        
        cat_lower = str(etiket_category or '').lower()
        orient_lower = str(etiket_orientation or '').lower()

        # Coordinate maps for all 4 etiket templates (img rect + text rect for username)
        coord_maps = {
            # 1. Sipil - Landscape (Pak Diki Landscape: A3 1190.55 x 841.89)
            # Layout table:
            # - DI BUAT: Kiri = Drafter, Kanan = Foreman
            # - DIPERIKSA: Kiri = Requestor (Staff EPR / Staff User), Kanan = SPV User
            # - DISETUJUI (Tengah): Engineer (Supervisor ENG / Manager ENG / Engineer)
            # - DISETUJUI (Atas): Factory Manager
            'diki_landscape': {
                'drafter': {'img': fitz.Rect(802.68, 630.0, 854.06, 692.0), 'text': fitz.Rect(799.0, 694.0, 856.0, 707.0)},
                'foreman': {'img': fitz.Rect(858.06, 630.0, 909.45, 692.0), 'text': fitz.Rect(856.0, 694.0, 912.0, 707.0)},
                'requester': {'img': fitz.Rect(915.45, 630.0, 966.84, 692.0), 'text': fitz.Rect(913.0, 694.0, 968.0, 707.0)},
                'staff_user': {'img': fitz.Rect(915.45, 630.0, 966.84, 692.0), 'text': fitz.Rect(913.0, 694.0, 968.0, 707.0)},
                'staff_epr': {'img': fitz.Rect(915.45, 630.0, 966.84, 692.0), 'text': fitz.Rect(913.0, 694.0, 968.0, 707.0)},
                'dept': {'img': fitz.Rect(970.84, 630.0, 1022.23, 692.0), 'text': fitz.Rect(969.0, 694.0, 1024.0, 707.0)},
                'dept_approval': {'img': fitz.Rect(970.84, 630.0, 1022.23, 692.0), 'text': fitz.Rect(969.0, 694.0, 1024.0, 707.0)},
                'spv_user': {'img': fitz.Rect(970.84, 630.0, 1022.23, 692.0), 'text': fitz.Rect(969.0, 694.0, 1024.0, 707.0)},
                'spv_dept': {'img': fitz.Rect(970.84, 630.0, 1022.23, 692.0), 'text': fitz.Rect(969.0, 694.0, 1024.0, 707.0)},
                'supervisor_user': {'img': fitz.Rect(970.84, 630.0, 1022.23, 692.0), 'text': fitz.Rect(969.0, 694.0, 1024.0, 707.0)},
                'supervisor': {'img': fitz.Rect(1028.23, 630.0, 1079.61, 692.0), 'text': fitz.Rect(1025.0, 694.0, 1081.0, 707.0)},
                'spv_eng': {'img': fitz.Rect(1028.23, 630.0, 1079.61, 692.0), 'text': fitz.Rect(1025.0, 694.0, 1081.0, 707.0)},
                'supervisor_eng': {'img': fitz.Rect(1028.23, 630.0, 1079.61, 692.0), 'text': fitz.Rect(1025.0, 694.0, 1081.0, 707.0)},
                'manager': {'img': fitz.Rect(1083.61, 630.0, 1135.00, 692.0), 'text': fitz.Rect(1081.0, 694.0, 1138.0, 707.0)},
                'manager_eng': {'img': fitz.Rect(1083.61, 630.0, 1135.00, 692.0), 'text': fitz.Rect(1081.0, 694.0, 1138.0, 707.0)},
                'engineer': {'img': fitz.Rect(1083.61, 630.0, 1135.00, 692.0), 'text': fitz.Rect(1081.0, 694.0, 1138.0, 707.0)},
                'factory_manager': {'img': fitz.Rect(1028.23, 528.0, 1135.00, 590.0), 'text': fitz.Rect(1025.0, 592.0, 1138.0, 605.0)}
            },
            # 2. Sipil - Portrait (Pak Diki Portrait: A3 841.89 x 1190.55)
            'diki_portrait': {
                'drafter': {'img': fitz.Rect(25.0, 1055.0, 120.0, 1148.0), 'text': fitz.Rect(22.0, 1150.0, 122.0, 1164.0)},
                'foreman': {'img': fitz.Rect(124.0, 1055.0, 218.0, 1148.0), 'text': fitz.Rect(122.0, 1150.0, 220.0, 1164.0)},
                'requester': {'img': fitz.Rect(224.0, 1055.0, 318.0, 1148.0), 'text': fitz.Rect(222.0, 1150.0, 320.0, 1164.0)},
                'staff_user': {'img': fitz.Rect(224.0, 1055.0, 318.0, 1148.0), 'text': fitz.Rect(222.0, 1150.0, 320.0, 1164.0)},
                'dept': {'img': fitz.Rect(324.0, 1055.0, 418.0, 1148.0), 'text': fitz.Rect(322.0, 1150.0, 420.0, 1164.0)},
                'dept_approval': {'img': fitz.Rect(324.0, 1055.0, 418.0, 1148.0), 'text': fitz.Rect(322.0, 1150.0, 420.0, 1164.0)},
                'spv_user': {'img': fitz.Rect(324.0, 1055.0, 418.0, 1148.0), 'text': fitz.Rect(322.0, 1150.0, 420.0, 1164.0)},
                'spv_dept': {'img': fitz.Rect(324.0, 1055.0, 418.0, 1148.0), 'text': fitz.Rect(322.0, 1150.0, 420.0, 1164.0)},
                'supervisor': {'img': fitz.Rect(423.0, 1055.0, 517.0, 1148.0), 'text': fitz.Rect(421.0, 1150.0, 519.0, 1164.0)},
                'spv_eng': {'img': fitz.Rect(423.0, 1055.0, 517.0, 1148.0), 'text': fitz.Rect(421.0, 1150.0, 519.0, 1164.0)},
                'supervisor_eng': {'img': fitz.Rect(423.0, 1055.0, 517.0, 1148.0), 'text': fitz.Rect(421.0, 1150.0, 519.0, 1164.0)},
                'manager': {'img': fitz.Rect(523.0, 1055.0, 617.0, 1148.0), 'text': fitz.Rect(521.0, 1150.0, 619.0, 1164.0)},
                'manager_eng': {'img': fitz.Rect(523.0, 1055.0, 617.0, 1148.0), 'text': fitz.Rect(521.0, 1150.0, 619.0, 1164.0)},
                'engineer': {'img': fitz.Rect(523.0, 1055.0, 617.0, 1148.0), 'text': fitz.Rect(521.0, 1150.0, 619.0, 1164.0)},
                'factory_manager': {'img': fitz.Rect(623.0, 1055.0, 816.0, 1148.0), 'text': fitz.Rect(621.0, 1150.0, 818.0, 1164.0)}
            },
            # 3. Mekanik / Part - Landscape (Pak Rifan Landscape: A4 842.0 x 595.0)
            'rifan_landscape': {
                'drafter': {'img': fitz.Rect(712.0, 485.0, 748.0, 525.0), 'text': fitz.Rect(710.0, 526.0, 750.0, 537.0)},
                'foreman': {'img': fitz.Rect(752.0, 485.0, 788.0, 525.0), 'text': fitz.Rect(750.0, 526.0, 790.0, 537.0)},
                'requester': {'img': fitz.Rect(632.0, 485.0, 708.0, 525.0), 'text': fitz.Rect(630.0, 526.0, 710.0, 537.0)},
                'dept': {'img': fitz.Rect(632.0, 485.0, 708.0, 525.0), 'text': fitz.Rect(630.0, 526.0, 710.0, 537.0)},
                'dept_approval': {'img': fitz.Rect(632.0, 485.0, 708.0, 525.0), 'text': fitz.Rect(630.0, 526.0, 710.0, 537.0)},
                'spv_user': {'img': fitz.Rect(632.0, 485.0, 708.0, 525.0), 'text': fitz.Rect(630.0, 526.0, 710.0, 537.0)},
                'spv_dept': {'img': fitz.Rect(632.0, 485.0, 708.0, 525.0), 'text': fitz.Rect(630.0, 526.0, 710.0, 537.0)},
                'supervisor': {'img': fitz.Rect(552.0, 485.0, 588.0, 525.0), 'text': fitz.Rect(550.0, 526.0, 589.0, 537.0)},
                'spv_eng': {'img': fitz.Rect(552.0, 485.0, 588.0, 525.0), 'text': fitz.Rect(550.0, 526.0, 589.0, 537.0)},
                'supervisor_eng': {'img': fitz.Rect(552.0, 485.0, 588.0, 525.0), 'text': fitz.Rect(550.0, 526.0, 589.0, 537.0)},
                'manager': {'img': fitz.Rect(590.0, 485.0, 628.0, 525.0), 'text': fitz.Rect(589.0, 526.0, 630.0, 537.0)},
                'manager_eng': {'img': fitz.Rect(590.0, 485.0, 628.0, 525.0), 'text': fitz.Rect(589.0, 526.0, 630.0, 537.0)},
                'engineer': {'img': fitz.Rect(590.0, 485.0, 628.0, 525.0), 'text': fitz.Rect(589.0, 526.0, 630.0, 537.0)},
                'factory_manager': {'img': fitz.Rect(792.0, 485.0, 822.0, 525.0), 'text': fitz.Rect(790.0, 526.0, 824.0, 537.0)}
            },
            # 4. Mekanik / Part - Portrait (Pak Rifan Portrait: A4 595.0 x 842.0)
            'rifan_portrait': {
                'drafter': {'img': fitz.Rect(460.0, 730.0, 486.0, 772.0), 'text': fitz.Rect(458.0, 773.0, 488.0, 784.0)},
                'foreman': {'img': fitz.Rect(488.0, 730.0, 514.0, 772.0), 'text': fitz.Rect(486.0, 773.0, 516.0, 784.0)},
                'requester': {'img': fitz.Rect(402.0, 730.0, 455.0, 772.0), 'text': fitz.Rect(400.0, 773.0, 457.0, 784.0)},
                'dept': {'img': fitz.Rect(402.0, 730.0, 455.0, 772.0), 'text': fitz.Rect(400.0, 773.0, 457.0, 784.0)},
                'dept_approval': {'img': fitz.Rect(402.0, 730.0, 455.0, 772.0), 'text': fitz.Rect(400.0, 773.0, 457.0, 784.0)},
                'spv_user': {'img': fitz.Rect(402.0, 730.0, 455.0, 772.0), 'text': fitz.Rect(400.0, 773.0, 457.0, 784.0)},
                'spv_dept': {'img': fitz.Rect(402.0, 730.0, 455.0, 772.0), 'text': fitz.Rect(400.0, 773.0, 457.0, 784.0)},
                'supervisor': {'img': fitz.Rect(331.0, 730.0, 363.0, 772.0), 'text': fitz.Rect(329.0, 773.0, 364.0, 784.0)},
                'spv_eng': {'img': fitz.Rect(331.0, 730.0, 363.0, 772.0), 'text': fitz.Rect(329.0, 773.0, 364.0, 784.0)},
                'supervisor_eng': {'img': fitz.Rect(331.0, 730.0, 363.0, 772.0), 'text': fitz.Rect(329.0, 773.0, 364.0, 784.0)},
                'manager': {'img': fitz.Rect(365.0, 730.0, 398.0, 772.0), 'text': fitz.Rect(364.0, 773.0, 400.0, 784.0)},
                'manager_eng': {'img': fitz.Rect(365.0, 730.0, 398.0, 772.0), 'text': fitz.Rect(364.0, 773.0, 400.0, 784.0)},
                'engineer': {'img': fitz.Rect(365.0, 730.0, 398.0, 772.0), 'text': fitz.Rect(364.0, 773.0, 400.0, 784.0)},
                'factory_manager': {'img': fitz.Rect(518.0, 730.0, 575.0, 772.0), 'text': fitz.Rect(516.0, 773.0, 577.0, 784.0)}
            }
        }

        if 'sipil' in cat_lower:
            map_key = 'diki_portrait' if 'portrait' in orient_lower or 'potrait' in orient_lower else 'diki_landscape'
        else:
            map_key = 'rifan_portrait' if 'portrait' in orient_lower or 'potrait' in orient_lower else 'rifan_landscape'

        selected_map = coord_maps.get(map_key, coord_maps['diki_landscape'])
        target = selected_map.get(role)

        if target:
            img_rect = target.get('img') if isinstance(target, dict) else target
            text_rect = target.get('text') if isinstance(target, dict) else None

            if img_rect and img_bytes:
                page.insert_image(img_rect, stream=img_bytes)

            if text_rect and signer_name:
                clean_name = str(signer_name).strip()
                try:
                    import sqlite3
                    db_conn = sqlite3.connect('ejo_database.db')
                    db_cur = db_conn.cursor()
                    db_cur.execute("SELECT fullname FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(fullname) = LOWER(?) LIMIT 1", (clean_name, clean_name))
                    fn_row = db_cur.fetchone()
                    if fn_row and fn_row[0] and str(fn_row[0]).strip():
                        clean_name = str(fn_row[0]).strip()
                    db_conn.close()
                except Exception as db_err:
                    pass
                page.insert_textbox(text_rect, clean_name, fontsize=7, fontname='helv', color=(0, 0, 0), align=1)
            
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

def apply_drawing_pdf_signatures(file_url, approvals_dict, etiket_category='Sipil', etiket_orientation='landscape'):
    if not fitz or not file_url:
        return
    clean_url = file_url.split('?')[0]
    local_path = clean_url.lstrip('/')
    if not os.path.exists(local_path) or not local_path.lower().endswith('.pdf'):
        return

    try:
        import shutil
        orig_path = local_path + ".orig.pdf"
        if not os.path.exists(orig_path):
            shutil.copyfile(local_path, orig_path)
        else:
            shutil.copyfile(orig_path, local_path)

        if not isinstance(approvals_dict, dict):
            return

        for role_key, app in approvals_dict.items():
            if isinstance(app, dict) and app.get('signature') and not role_key.endswith('_reject'):
                try:
                    apply_pdf_signature(file_url, role_key, app['signature'], app.get('signer', ''), etiket_category, etiket_orientation)
                except Exception as sig_err:
                    print(f"Error applying drawing PDF signature for '{role_key}': {sig_err}")
    except Exception as e:
        print(f"Error in apply_drawing_pdf_signatures: {e}")

# ponytail: PyMuPDF PDF signature helper for project handover Berita Acara
def apply_project_handover_pdf_signatures(file_url, handover_approvals_dict, conn=None):
    if not fitz or not file_url:
        return
        
    clean_url = file_url.split('?')[0]
    local_path = clean_url.lstrip('/')
    if not os.path.exists(local_path) or not local_path.lower().endswith('.pdf'):
        return
        
    try:
        # Keep clean original copy if not existing
        orig_path = local_path + ".orig.pdf"
        if not os.path.exists(orig_path):
            import shutil
            shutil.copyfile(local_path, orig_path)
            
        source_path = orig_path if os.path.exists(orig_path) else local_path
        doc = fitz.open(source_path)
        page = doc[0]
        for p in doc:
            if p.search_for('Dibuat oleh'):
                page = p
                break

        # ponytail: Rock-solid precise coordinates derived from template inspection using insert_text
        # Clear entire signature zone back to pristine white background
        page.draw_rect(fitz.Rect(50, 345.0, 545, 455.0), color=(1, 1, 1), fill=(1, 1, 1))

        role_cols = {
            'staff_eng': ((55, 132), 'Dibuat oleh,', 'Staff ENG'),
            'spv_eng': ((135, 212), 'Diketahui oleh,', 'SPV ENG'),
            'manager_eng': ((215, 292), 'Disetujui oleh,', 'Manager ENG'),
            'manager_user': ((295, 372), 'Disetujui oleh,', 'Manager User'),
            'spv_user': ((375, 452), 'Diketahui oleh,', 'SPV User'),
            'staff_user': ((455, 532), 'Diterima oleh,', 'Staff User')
        }
        
        stamped = False
        
        for role_key, ((x0, x1), header_title, role_title) in role_cols.items():
            cx = (x0 + x1) / 2.0

            # Layer 1: Top Header Title (Y baseline 358.0)
            hw = fitz.get_text_length(header_title, fontname="helv", fontsize=8.0)
            page.insert_text(fitz.Point(cx - hw / 2.0, 358.0), header_title, fontsize=8.0, fontname="helv", color=(0, 0, 0))

            # Layer 4: Bottom Role Label (Y baseline 438.0)
            rw = fitz.get_text_length(role_title, fontname="helv", fontsize=8.0)
            page.insert_text(fitz.Point(cx - rw / 2.0, 438.0), role_title, fontsize=8.0, fontname="helv", color=(0, 0, 0))

            app_info = handover_approvals_dict.get(role_key)
            if not app_info or not isinstance(app_info, dict):
                continue
                
            sig_data = app_info.get('signature')
            raw_signer = app_info.get('signer') or app_info.get('username') or ''
            signer_name = raw_signer

            # Try looking up full name from DB if available
            if conn and raw_signer:
                try:
                    c = conn.cursor()
                    c.execute("SELECT fullname, username FROM users WHERE username = ? OR lower(fullname) = ?", (raw_signer, raw_signer.lower()))
                    u_row = c.fetchone()
                    if u_row:
                        signer_name = (u_row[0] if u_row[0] and u_row[0].strip() else u_row[1]) or raw_signer
                except Exception:
                    pass

            sig_rect = fitz.Rect(x0, 362.0, x1, 414.0)

            if sig_data:
                try:
                    if ',' in sig_data:
                        header, base64_str = sig_data.split(",", 1)
                    else:
                        base64_str = sig_data
                    img_bytes = base64.b64decode(base64_str)
                    page.insert_image(sig_rect, stream=img_bytes, keep_proportion=True)
                    stamped = True
                except Exception as ie:
                    print(f"Error inserting signature for {role_key}: {ie}")

            if signer_name:
                try:
                    name_str = str(signer_name)
                    nw = fitz.get_text_length(name_str, fontname="helv", fontsize=7.5)
                    page.insert_text(fitz.Point(cx - nw / 2.0, 424.0), name_str, fontsize=7.5, fontname="helv", color=(0, 0, 0))
                    stamped = True
                except Exception as ne:
                    print(f"Error writing signer name for {role_key}: {ne}")

        if stamped:
            temp_path = local_path + ".tmp"
            doc.save(temp_path)
            doc.close()
            if os.path.exists(temp_path):
                os.replace(temp_path, local_path)
                print(f"Successfully stamped project handover PDF signatures on {local_path}")
        else:
            doc.close()
    except Exception as sig_err:
        print(f"Error applying project handover PDF signatures: {sig_err}")






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

    # ponytail: Add mid column if table already exists without it
    try:
        cursor.execute("ALTER TABLE ejos ADD COLUMN mid TEXT")
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
            docs TEXT,
            pr_percent INTEGER DEFAULT 0,
            po_percent INTEGER DEFAULT 0,
            gr_percent INTEGER DEFAULT 0
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

    # ponytail: Add custom_status column to projects if table already exists without it
    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN custom_status TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # ponytail: Add handover_docs column to projects for Berita Acara Serah Terima
    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN handover_docs TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # ponytail: Add handover_approvals column to projects for Berita Acara Multi-Role Signatures
    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN handover_approvals TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # ponytail: Add drawing_id and drawing_file columns to projects table
    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN drawing_id TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN drawing_file TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # ponytail: Add is_review_only column to projects table for Drawing review-only transfer
    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN is_review_only INTEGER DEFAULT 0")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # ponytail: Add custom_status column to projects table for manual status notes by Foreman/Admin
    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN custom_status TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # ponytail: Add pr_percent, po_percent, gr_percent columns for Phase 2 procurement progress
    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN pr_percent INTEGER DEFAULT 0")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN po_percent INTEGER DEFAULT 0")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN gr_percent INTEGER DEFAULT 0")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # ponytail: Add timeline column to projects table for Phase 3 project timelines
    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN timeline TEXT")
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
            show_status_prop INTEGER DEFAULT 1,
            dept TEXT
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

    # ponytail: Add dept column if users table already exists without it
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN dept TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass  # Column already exists

    # ponytail: Add access_permissions column if users table already exists without it
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN access_permissions TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass  # Column already exists

    # ponytail: Add is_active column if users table already exists without it
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1")
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
    # ponytail: default KPI percentage for General EJO
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('kpi_percentage_gejo', '0')")
    # ponytail: default KPI percentage for Drawing
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('kpi_percentage_drawing', '0')")
    # ponytail: default realized KPI percentage for General EJO
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('kpi_realisasi_gejo', '0')")
    # ponytail: default realized KPI percentage for Drawing
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('kpi_realisasi_drawing', '0')")
    # ponytail: default dashboard widget display permissions
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('dashboard_widget_permissions', '{}')")
    
    # ponytail: default approval flowchart settings for gejo, drawing, and project
    default_flow_gejo = json.dumps([
        {"step": 1, "key": "staff_requestor", "label": "STAFF ({DEPT})", "role": "ROLE_REQUESTOR", "dept": "DEPT_REQUESTOR", "require_signature": 1},
        {"step": 2, "key": "spv_requestor", "label": "SPV ({DEPT})", "role": "ROLE_SPV_REQUESTOR", "dept": "DEPT_REQUESTOR", "require_signature": 1},
        {"step": 3, "key": "foreman_eng", "label": "FOREMAN ENG", "role": "Foreman Eng", "dept": "ENG", "require_signature": 1},
        {"step": 4, "key": "supervisor_eng", "label": "SUPERVISOR ENG", "role": "Supervisor Eng", "dept": "ENG", "require_signature": 1},
        {"step": 5, "key": "manager_eng", "label": "MANAGER ENG", "role": "Manager PRD", "dept": "ENG", "require_signature": 1},
        {"step": 6, "key": "factory_manager", "label": "FACTORY MANAGER", "role": "Manager EPR", "dept": "ENG", "require_signature": 1}
    ])
    default_flow_drawing = json.dumps([
        {"step": 1, "key": "drafter", "label": "DRAFTER (ENG)", "role": "Drafter", "dept": "ENG", "require_signature": 1},
        {"step": 2, "key": "foreman_eng", "label": "FOREMAN ENG", "role": "Foreman Eng", "dept": "ENG", "require_signature": 1},
        {"step": 3, "key": "supervisor_eng", "label": "SUPERVISOR ENG", "role": "Supervisor Eng", "dept": "ENG", "require_signature": 1},
        {"step": 4, "key": "spv_requestor", "label": "SPV ({DEPT})", "role": "ROLE_SPV_REQUESTOR", "dept": "DEPT_REQUESTOR", "require_signature": 1},
        {"step": 5, "key": "manager_eng", "label": "MANAGER ENG", "role": "Manager PRD", "dept": "ENG", "require_signature": 1}
    ])
    default_flow_project = json.dumps([
        {"step": 1, "key": "spv_eng", "label": "SUPERVISOR ENG", "role": "Supervisor Eng", "dept": "ENG", "require_signature": 1},
        {"step": 2, "key": "spv_prd", "label": "SUPERVISOR PRD", "role": "Supervisor PRD", "dept": "PRD", "require_signature": 1},
        {"step": 3, "key": "spv_epr", "label": "SUPERVISOR EPR", "role": "Supervisor PRD", "dept": "EPR", "require_signature": 1},
        {"step": 4, "key": "manager_eng", "label": "MANAGER ENG", "role": "Manager PRD", "dept": "ENG", "require_signature": 1},
        {"step": 5, "key": "manager_prd", "label": "MANAGER PRD", "role": "Manager PRD", "dept": "PRD", "require_signature": 1},
        {"step": 6, "key": "manager_epr", "label": "MANAGER EPR", "role": "Manager EPR", "dept": "EPR", "require_signature": 1}
    ])
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('approval_flowchart_gejo', ?)", (default_flow_gejo,))
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('approval_flowchart_drawing', ?)", (default_flow_drawing,))
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('approval_flowchart_project', ?)", (default_flow_project,))
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
            createdDate TEXT,
            quantity INTEGER DEFAULT 1
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

    # ponytail: Add mid column to general_ejos if not exists
    try:
        cursor.execute("ALTER TABLE general_ejos ADD COLUMN mid TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # ponytail: Add cost analysis columns to general_ejos if they don't exist
    try:
        cursor.execute("ALTER TABLE general_ejos ADD COLUMN part_price_new REAL DEFAULT 0.0")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE general_ejos ADD COLUMN repair_duration INTEGER DEFAULT 0")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE general_ejos ADD COLUMN repair_cost_per_day REAL DEFAULT 0.0")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE general_ejos ADD COLUMN photo_before TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE general_ejos ADD COLUMN quantity INTEGER DEFAULT 1")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE general_ejos ADD COLUMN qty_needed INTEGER DEFAULT 0")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE general_ejos ADD COLUMN qty_stock INTEGER DEFAULT 0")
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
        "ALTER TABLE drawings ADD COLUMN sub_status TEXT",
        "ALTER TABLE drawings ADD COLUMN etiket_category TEXT",
        "ALTER TABLE drawings ADD COLUMN etiket_orientation TEXT DEFAULT 'landscape'"
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
            image TEXT,
            price REAL DEFAULT 0.0,
            cost_saving REAL DEFAULT 0.0,
            original_price REAL DEFAULT 0.0
        )
    """)
    conn.commit()

    # ponytail: Add image column to repair_parts table if not exists (for backward compatibility)
    try:
        cursor.execute("ALTER TABLE repair_parts ADD COLUMN image TEXT")
        conn.commit()
    except sqlite3.OperationalError:
        pass # Column already exists

    try:
        cursor.execute("ALTER TABLE repair_parts ADD COLUMN price REAL DEFAULT 0.0")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE repair_parts ADD COLUMN cost_saving REAL DEFAULT 0.0")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE repair_parts ADD COLUMN original_price REAL DEFAULT 0.0")
        conn.commit()
    except sqlite3.OperationalError:
        pass

    # ponytail: Unified EJO ID migration - format IDs as EJO(nomorejo)(tanggaldibuat)(bulankeberapadibuat)(tahunkeberapadibuat) e.g. EJO00230072026
    try:
        def migrate_table_ids(table_name, date_col):
            cursor.execute(f"SELECT id, {date_col} FROM {table_name}")
            rows = cursor.fetchall()
            for old_id, cdate in rows:
                if not old_id: continue
                if re.match(r'^EJO\d{11}$', old_id):
                    continue
                m = re.search(r'(\d+)', old_id)
                num_str = f"{int(m.group(1)):03d}" if m else "001"
                dt_str = "30072026"
                if cdate:
                    dm = re.search(r'(\d{4})-(\d{2})-(\d{2})', str(cdate))
                    if dm:
                        dt_str = f"{dm.group(3)}{dm.group(2)}{dm.group(1)}"
                    else:
                        dm2 = re.search(r'(\d{2})(\d{2})(\d{4})', str(cdate))
                        if dm2:
                            dt_str = str(cdate)[:8]
                new_id = f"EJO{num_str}{dt_str}"
                cursor.execute(f"UPDATE {table_name} SET id = ? WHERE id = ?", (new_id, old_id))
                if table_name == 'general_ejos':
                    cursor.execute("UPDATE drawings SET ejo_id = ? WHERE ejo_id = ?", (new_id, old_id))
                    cursor.execute("UPDATE notifications SET ejo_id = ? WHERE ejo_id = ?", (new_id, old_id))
                elif table_name == 'drawings':
                    cursor.execute("UPDATE general_ejos SET drawing_id = ? WHERE drawing_id = ?", (new_id, old_id))
                    cursor.execute("UPDATE notifications SET ejo_id = ? WHERE ejo_id = ?", (new_id, old_id))

        migrate_table_ids('general_ejos', 'createdDate')
        migrate_table_ids('drawings', 'uploaded_at')
        conn.commit()
    except Exception:
        pass

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
            cursor.executemany("INSERT INTO projects (id, title, dept, budget, targetDate, pic, desc, phase) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", default_projects)
            conn.commit()

    # ponytail: migration script for roles: rename roles to adding 'Eng' / 'Supervisor Eng'
    cursor.execute("UPDATE users SET role = 'Staff PRD' WHERE role = 'User'")
    cursor.execute("UPDATE users SET role = 'Foreman Eng' WHERE role IN ('Foreman', 'Lead Engineer')")
    cursor.execute("UPDATE users SET role = 'Admin Eng' WHERE role = 'Admin'")
    cursor.execute("UPDATE users SET role = 'Supervisor Eng' WHERE role IN ('Supervisor', 'Spv Eng')")
    cursor.execute("UPDATE users SET role = 'Staff PRD' WHERE role NOT LIKE 'Manager %' AND role NOT LIKE 'Supervisor %' AND role NOT LIKE 'user_%' AND role NOT IN ('Foreman Eng', 'Admin Eng', 'Drafter', 'Manager Eng', 'Plant Manager', 'Factory Manager', 'Supervisor Eng', 'Server', 'Sipil', 'Mekanik', 'Elektrik', 'Program', 'Kalibrasi', 'Otomotif', 'Staff PRD', 'Staff ENG', 'Staff EPR', 'Staff GA', 'Staff QC', 'Staff WRH', 'Manager', 'Supervisor')")
    conn.commit()

    # Populate default users if empty
    if seed_defaults:
        cursor.execute("SELECT COUNT(*) FROM users")
        if cursor.fetchone()[0] == 0:
            default_users = [
                ("dani", "dani123", "Ahmad Dani", "Foreman Eng", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=80", "ENG"),
                ("budi", "budi123", "Budi Utomo", "Foreman Eng", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80", "ENG"),
                ("charlie", "charlie123", "Charlie Santoso", "Drafter", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80", "ENG"),
                ("deddy", "deddy123", "Deddy Corbuzier", "user_PRD", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80", "PRD"),
                ("server", "server", "System Server Admin", "Server", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80", "ENG"),
                # ponytail: Add default department staff users to seed
                ("prd", "prd123", "user_PRD", "user_PRD", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "PRD"),
                ("eng", "eng123", "user_ENG", "user_ENG", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "ENG"),
                ("epr", "epr123", "user_EPR", "user_EPR", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "EPR"),
                ("ga", "ga123", "user_GA", "user_GA", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "GA"),
                ("qc", "qc123", "user_QC", "user_QC", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "QC"),
                ("wrh", "wrh123", "user_WRH", "user_WRH", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "WRH"),
                ("staff_prd", "staff_prd123", "user_PRD", "user_PRD", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "PRD"),
                ("staff_eng", "staff_eng123", "user_ENG", "user_ENG", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "ENG"),
                ("staff_epr", "staff_epr123", "user_EPR", "user_EPR", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "EPR"),
                ("staff_ga", "staff_ga123", "user_GA", "user_GA", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "GA"),
                ("staff_qc", "staff_qc123", "user_QC", "user_QC", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "QC"),
                ("staff_wrh", "staff_wrh123", "user_WRH", "user_WRH", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "WRH")
            ]
            cursor.executemany("INSERT INTO users (username, password, fullname, role, avatar, dept) VALUES (?, ?, ?, ?, ?, ?)", default_users)
            conn.commit()

    # ponytail: only seed server + dept users when seed_defaults is True (skipped on nuclear)
    if seed_defaults:
        # Ensure server user exists even if database already had other users
        cursor.execute("SELECT COUNT(*) FROM users WHERE username = 'server'")
        if cursor.fetchone()[0] == 0:
            cursor.execute(
                "INSERT INTO users (username, password, fullname, role, avatar, dept) VALUES (?, ?, ?, ?, ?, ?)",
                ("server", "MQELXeeVFU3E3qlCE6QbSGJZUljX9MVnYkJVHFKBXDVbELwkLztLWp2M9iJ7aMTgJZfc6pmCmsokt8TF1Pi2xEvxHtWF9zvUFm8y95IPvg0irAVdnbgPjgg7dSyb9GD5", "System Server Admin", "Server", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80", "ENG")
            )
            conn.commit()
        else:
            # ponytail: restore exact original password for server user
            cursor.execute("UPDATE users SET password = 'MQELXeeVFU3E3qlCE6QbSGJZUljX9MVnYkJVHFKBXDVbELwkLztLWp2M9iJ7aMTgJZfc6pmCmsokt8TF1Pi2xEvxHtWF9zvUFm8y95IPvg0irAVdnbgPjgg7dSyb9GD5', role = 'Server' WHERE username = 'server'")
            conn.commit()

        # ponytail: Ensure default department staff users exist in existing database
        dept_users = [
            ("prd", "prd123", "user_PRD", "user_PRD", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "PRD"),
            ("eng", "eng123", "user_ENG", "user_ENG", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "ENG"),
            ("epr", "epr123", "user_EPR", "user_EPR", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "EPR"),
            ("ga", "ga123", "user_GA", "user_GA", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "GA"),
            ("qc", "qc123", "user_QC", "user_QC", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "QC"),
            ("wrh", "wrh123", "user_WRH", "user_WRH", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "WRH"),
            ("staff_prd", "staff_prd123", "user_PRD", "user_PRD", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "PRD"),
            ("staff_eng", "staff_eng123", "user_ENG", "user_ENG", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "ENG"),
            ("staff_epr", "staff_epr123", "user_EPR", "user_EPR", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "EPR"),
            ("staff_ga", "staff_ga123", "user_GA", "user_GA", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "GA"),
            ("staff_qc", "staff_qc123", "user_QC", "user_QC", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "QC"),
            ("staff_wrh", "staff_wrh123", "user_WRH", "user_WRH", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80", "WRH")
        ]
        for username, password, fullname, role, avatar, dept in dept_users:
            cursor.execute("SELECT COUNT(*) FROM users WHERE username = ?", (username,))
            if cursor.fetchone()[0] == 0:
                cursor.execute(
                    "INSERT INTO users (username, password, fullname, role, avatar, dept) VALUES (?, ?, ?, ?, ?, ?)",
                    (username, password, fullname, role, avatar, dept)
                )
                conn.commit()
            else:
                # ensure fullname, role, and dept match what user requested
                cursor.execute(
                    "UPDATE users SET fullname = ?, role = ?, dept = ? WHERE username = ?",
                    (fullname, role, dept, username)
                )
                conn.commit()

        # Set default departments for existing users if empty
        cursor.execute("UPDATE users SET dept = 'ENG' WHERE dept IS NULL AND username IN ('server', 'manager', 'plantmanager', 'supervisor', 'foreman', 'admin', 'drafter', 'sipil', 'mekanik', 'elektrik', 'program', 'kalibrasi', 'otomotif')")
        cursor.execute("UPDATE users SET dept = 'PRD' WHERE dept IS NULL AND username = 'user'")
        conn.commit()

    # Migrate existing Staff roles to user_DEPT roles in database
    cursor.execute("UPDATE users SET role = replace(role, 'Staff ', 'user_') WHERE role LIKE 'Staff %'")
    cursor.execute("UPDATE users SET role = replace(role, 'User ', 'user_') WHERE role LIKE 'User %'")
    cursor.execute("UPDATE users SET fullname = replace(fullname, 'Staff ', 'user_') WHERE fullname LIKE 'Staff %'")
    cursor.execute("UPDATE users SET fullname = replace(fullname, 'User ', 'user_') WHERE fullname LIKE 'User %'")
    
    # ponytail: Migrate Manager and Supervisor roles to per-department roles (e.g. Manager EPR, Supervisor PRD) if dept is non-ENG
    cursor.execute("UPDATE users SET role = 'Manager ' || dept WHERE (role = 'Manager Eng' OR role = 'Manager' OR role LIKE 'user_%') AND (dept IS NOT NULL AND dept != '' AND dept != 'ENG') AND (username LIKE 'manager%' OR role LIKE 'Manager%')")
    cursor.execute("UPDATE users SET role = 'Supervisor ' || dept WHERE (role = 'Supervisor Eng' OR role = 'Supervisor' OR role LIKE 'user_%') AND (dept IS NOT NULL AND dept != '' AND dept != 'ENG') AND (username LIKE 'spv%' OR role LIKE 'Supervisor%')")
    
    # ponytail: Migrate Waiting Dept Approval EJO to Requested
    cursor.execute("UPDATE ejos SET status = 'Requested' WHERE status = 'Waiting Dept Approval'")
    cursor.execute("UPDATE general_ejos SET status = 'Requested' WHERE status = 'Waiting Dept Approval'")
    conn.commit()

    conn.close()

# ponytail: Role levels for hierarchical authorization
ROLE_LEVELS = {
    'Server': 100,
    'Manager Eng': 80,
    'Plant Manager': 80,
    'Factory Manager': 80,
    'Supervisor Eng': 60,
    'Foreman Eng': 40,
    'Admin Eng': 40,
    'Drafter': 20,
    'Sipil': 20,
    'Mekanik': 20,
    'Elektrik': 20,
    'Program': 20,
    'Kalibrasi': 20,
    'Otomotif': 20,
    'Manager': 80,
    'Supervisor': 60,
    'User': 10,
    'user_PRD': 10,
    'user_ENG': 10,
    'user_EPR': 10,
    'user_GA': 10,
    'user_QC': 10,
    'user_WRH': 10
}

def get_role_level(role):
    if not role:
        return 0
    if role in ROLE_LEVELS:
        return ROLE_LEVELS[role]
    if role.startswith('Manager '):
        return 80
    if role.startswith('Supervisor '):
        return 60
    if role.startswith('user_') or role.startswith('Staff ') or role.startswith('User '):
        return 10
    return 0

# ponytail: Helper to normalize department codes to match user.dept values
def normalize_dept_code(dept):
    if not dept:
        return ''
    clean = str(dept).strip()
    upper = clean.upper()
    mapping = {
        'PRD': 'PRD',
        'PRD (PRODUCTION)': 'PRD',
        'PRODUCTION': 'PRD',
        'ENG': 'ENG',
        'ENG (ENGINEERING)': 'ENG',
        'ENGINEERING': 'ENG',
        'UTILITY': 'ENG',
        'EPR': 'EPR',
        'EPR (ENGINEERING PRODUKSI)': 'EPR',
        'EPR (ENGINEERING PRODUCTION)': 'EPR',
        'ENGINEERING PRODUKSI': 'EPR',
        'ENGINEERING PRODUCTION': 'EPR',
        'GA': 'GA',
        'GA (GENERAL AFFAIR)': 'GA',
        'GENERAL AFFAIR': 'GA',
        'GENERAL AFFAIRS': 'GA',
        'QC': 'QC',
        'QC (QUALITY CONTROL)': 'QC',
        'QUALITY CONTROL': 'QC',
        'WRH': 'WRH',
        'WRH (WAREHOUSE)': 'WRH',
        'WAREHOUSE': 'WRH',
        'MAINTENANCE': 'WRH',
        'EKSPEDISI': 'WRH',
        'HSE': 'HSE'
    }
    return mapping.get(upper, clean)

# ponytail: helper to check if user is a non-Engineering Supervisor/Manager
def is_non_eng_spv_or_manager(role, dept=''):
    if not role or role in ('Server', 'server', 'Supervisor Eng', 'Manager Eng', 'Plant Manager', 'Factory Manager', 'Foreman Eng', 'Admin Eng'):
        return False
    dept_str = normalize_dept_code(dept)
    if dept_str == 'ENG' or ' ENG' in role.upper() or role.upper().endswith(' ENG'):
        return False
    role_lower = role.lower()
    is_spv_or_mgr = ('spv' in role_lower or 'supervisor' in role_lower or 'manager' in role_lower)
    return is_spv_or_mgr

# ponytail: helper to check if user is limited to 2 active General EJO / Drawing EJO
def is_user_limited(role, dept=''):
    if not role:
        return False
    if role == 'User' or role.startswith('Staff ') or role.startswith('User ') or role.startswith('user_'):
        return True
    if is_non_eng_spv_or_manager(role, dept):
        return True
    return False

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
        elif clean_path == "/api/users/force-logout":
            self.force_logout_user()
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
            ejo_id = urllib.parse.unquote(clean_path.split("/")[-1])
            self.update_ejo(ejo_id)
        elif clean_path.startswith("/api/general-ejos/"):
            ejo_id = urllib.parse.unquote(clean_path.split("/")[-1])
            self.update_general_ejo(ejo_id)
        elif clean_path.startswith("/api/projects/"):
            proj_id = urllib.parse.unquote(clean_path.split("/")[-1])
            self.update_project(proj_id)
        elif clean_path.startswith("/api/users/"):
            if clean_path.endswith("/layout-settings"):
                username = urllib.parse.unquote(clean_path.split("/")[-2])
                self.update_user_layout_settings(username)
            elif clean_path.endswith("/access"):
                username = urllib.parse.unquote(clean_path.split("/")[-2])
                self.update_user_access(username)
            else:
                username = urllib.parse.unquote(clean_path.split("/")[-1])
                self.update_user(username)
        elif clean_path == "/api/roles/access":
            self.update_role_access()
        elif clean_path == "/api/users/bulk-reset-access":
            self.bulk_reset_user_access()
        elif clean_path.startswith("/api/notifications/read-all"):
            self.mark_all_notifications_read()
        elif clean_path.startswith("/api/drawings/"):
            drawing_id = urllib.parse.unquote(clean_path.split("/")[-1])
            self.update_drawing(drawing_id)
        elif clean_path == "/api/settings":
            self.update_settings()
        else:
            self.send_error(404, "API endpoint not found")

    def do_DELETE(self):
        # ponytail: parse out query parameters
        clean_path = self.path.split("?")[0]
        if clean_path.startswith("/api/ejos/"):
            ejo_id = urllib.parse.unquote(clean_path.split("/")[-1])
            self.delete_ejo(ejo_id)
        elif clean_path.startswith("/api/general-ejos/"):
            ejo_id = urllib.parse.unquote(clean_path.split("/")[-1])
            self.delete_general_ejo(ejo_id)
        elif clean_path.startswith("/api/drawings/"):
            drawing_id = urllib.parse.unquote(clean_path.split("/")[-1])
            self.delete_drawing(drawing_id)
        elif clean_path.startswith("/api/projects/") and "/handover-doc" in clean_path:
            proj_id = urllib.parse.unquote(clean_path.split("/")[3])
            self.delete_project_handover_doc(proj_id)
        elif clean_path.startswith("/api/projects/"):
            proj_id = urllib.parse.unquote(clean_path.split("/")[-1])
            self.delete_project(proj_id)
        elif clean_path.startswith("/api/repair-parts/"):
            part_id = urllib.parse.unquote(clean_path.split("/")[-1])
            self.delete_repair_part(part_id)
        elif clean_path.startswith("/api/users/"):
            username = urllib.parse.unquote(clean_path.split("/")[-1])
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

    # ponytail: helper — insert satu notifikasi ke tabel notifications (ditambahkan uuid.uuid4().hex[:6] agar tidak terjadi UNIQUE constraint error saat insert cepat)
    def _insert_notification(self, conn, target_username, ejo_id, message):
        if not target_username:
            return  # tidak ada target → skip (mis. engineer Unassigned)
        notif_id = f"NTF-{int(__import__('time').time() * 1000)}-{target_username}-{uuid.uuid4().hex[:6]}"
        now = __import__('datetime').datetime.now()
        timestamp = now.strftime("%Y-%m-%d %H:%M")
        conn.cursor().execute(
            "INSERT INTO notifications (id, target_username, ejo_id, message, timestamp, is_read) VALUES (?, ?, ?, ?, ?, 0)",
            (notif_id, target_username, ejo_id, message, timestamp)
        )

    # ponytail: helper — kirim notifikasi ke semua Supervisor/Manager departemen bersangkutan
    def _notify_dept_approvers(self, conn, dept, ref_id, message):
        norm_dept = normalize_dept_code(dept)
        if not norm_dept:
            return
        cursor = conn.cursor()
        cursor.execute("SELECT username, dept, role FROM users")
        for u_name, u_dept, u_role in cursor.fetchall():
            if normalize_dept_code(u_dept) == norm_dept:
                if u_role and (u_role.startswith('Manager') or u_role.startswith('Supervisor') or u_role in ('Plant Manager', 'Factory Manager', 'Server')):
                    self._insert_notification(conn, u_name, ref_id, message)

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
            try:
                p['handover_docs'] = json.loads(p['handover_docs']) if p.get('handover_docs') else []
            except Exception:
                p['handover_docs'] = []
            try:
                p['handover_approvals'] = json.loads(p['handover_approvals']) if p.get('handover_approvals') else {}
            except Exception:
                p['handover_approvals'] = {}
            try:
                p['timeline'] = json.loads(p['timeline']) if p.get('timeline') else []
            except Exception:
                p['timeline'] = []
            p['pr_percent'] = p.get('pr_percent') if p.get('pr_percent') is not None else 0
            p['po_percent'] = p.get('po_percent') if p.get('po_percent') is not None else 0
            p['gr_percent'] = p.get('gr_percent') if p.get('gr_percent') is not None else 0
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
                INSERT INTO repair_parts (id, name, code, stock, location, ejo_id, description, image, price, cost_saving, original_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                data['id'], data['name'], data['code'], data['stock'],
                data['location'], data['ejo_id'], data['description'], data.get('image', None),
                data.get('price', 0.0), data.get('cost_saving', 0.0), data.get('original_price', 0.0)
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
        
        username = (data.get('username') or '').strip()
        password = data.get('password') or ''
        device_id = (data.get('device_id') or '').strip()
        
        if not username or not password:
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": "Username dan Password wajib diisi."}).encode("utf-8"))
            return

        if not device_id:
            device_id = f"dev-fallback-{uuid.uuid4().hex[:8]}"
        
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

        # Case-insensitive username match
        cursor.execute("SELECT username, password, fullname, role, avatar, signature, show_status_prop, dept, access_permissions, is_active FROM users WHERE LOWER(username) = LOWER(?)", (username,))
        user_row = cursor.fetchone()
        conn.close()
        
        if user_row:
            db_password = user_row['password']
            # Support server account default passwords
            is_pass_valid = (password == db_password)
            if user_row['username'].lower() == 'server' and password in ['server', 'server123', 'admin']:
                is_pass_valid = True

            if is_pass_valid:
                user = dict(user_row)
                is_server = user['role'] == 'Server' or user['username'].lower() == 'server'

                # Check if account is suspended/inactive
                if user.get('is_active') == 0 and not is_server:
                    self.send_response(403)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": "Akun Anda telah nonaktif/disuspend oleh Server Admin. Silakan hubungi Server Admin."}).encode("utf-8"))
                    return

                # Block login during maintenance mode for non-Server users
                if maintenance and not is_server:
                    self.send_response(503)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": "Server sedang dalam pemeliharaan (maintenance) / perbaikan. Akses ditutup sementara."}).encode("utf-8"))
                    return

                now = time.time()
                username_key = user['username'].lower()
                with ACTIVE_SESSIONS_LOCK:
                    ACTIVE_SESSIONS[username_key] = {"device_id": device_id, "last_active": now}
                    FORCED_LOGOUT_SESSIONS.discard(username_key)

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(user).encode("utf-8"))
                return

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
            if username_key in FORCED_LOGOUT_SESSIONS:
                FORCED_LOGOUT_SESSIONS.discard(username_key)
                if username_key in ACTIVE_SESSIONS:
                    del ACTIVE_SESSIONS[username_key]
                self.send_response(403)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "superseded",
                    "message": "Sesi akun Anda telah dikeluarkan (logout) oleh Admin."
                }).encode("utf-8"))
                return

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

    # ponytail: force logout target user device session from admin panel
    def force_logout_user(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))
        
        target_username = (data.get('target_username') or '').strip().lower()
        if target_username:
            with ACTIVE_SESSIONS_LOCK:
                if target_username in ACTIVE_SESSIONS:
                    del ACTIVE_SESSIONS[target_username]
                FORCED_LOGOUT_SESSIONS.add(target_username)
                
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "success", "message": f"Sesi device {target_username} berhasil di-logout."}).encode("utf-8"))


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

            # ponytail: determine initial status (always Requested for EJO creations)
            status = data.get('status', 'Requested')
            if status == "Waiting Dept Approval":
                status = "Requested"
            logs = data.get('logs', [])
            requester = data.get('requester', '')

            # ponytail: name columns explicitly to ensure compatibility when schema changes or columns are added
            cursor.execute("""
                INSERT INTO ejos (id, title, dept, category, priority, location, targetDate, status, engineer, estCost, actCost, description, logs, requester, createdDate, mid)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                ejo_id, data['title'], data['dept'], data['category'],
                data['priority'], data['location'], data['targetDate'],
                status, data['engineer'], data['estCost'],
                data['actCost'], data['description'], json.dumps(logs),
                data.get('requester', ''), data.get('createdDate', ''), data.get('mid', '')
            ))

            # ponytail: if waiting dept approval, notify department Supervisor/Manager
            if status == "Waiting Dept Approval":
                self._notify_dept_approvers(conn, data.get('dept', ''), ejo_id, f"EJO baru {ejo_id} dari {requester} membutuhkan persetujuan Anda")

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
                INSERT INTO projects (id, title, dept, budget, targetDate, pic, desc, phase, approvals, docs, drawing_id, drawing_file, is_review_only, pr_percent, po_percent, gr_percent) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                next_id, data['title'], data['dept'], data['budget'],
                data['targetDate'], data['pic'], data['desc'], data['phase'],
                json.dumps(data.get('approvals', {})),
                json.dumps(data.get('docs', [])),
                data.get('drawing_id', ''),
                data.get('drawing_file', ''),
                int(data.get('is_review_only', 0)),
                int(data.get('pr_percent', 0)),
                int(data.get('po_percent', 0)),
                int(data.get('gr_percent', 0))
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
            cursor.execute("SELECT logs, engineer, status, createdDate, mid FROM ejos WHERE id = ?", (ejo_id,))
            row = cursor.fetchone()
            current_logs = json.loads(row[0]) if (row and row[0]) else []
            old_engineer = row[1] if row else 'Unassigned'
            old_status = row[2] if row else None
            old_created_date = row[3] if (row and len(row) > 3) else None
            old_mid = row[4] if (row and len(row) > 4) else ""

            if 'logs' in data:
                # Merge logic
                # Only add logs that are not already present
                existing_messages = {log['message'] for log in current_logs}
                for log in data['logs']:
                    if log['message'] not in existing_messages:
                        current_logs.append(log)

            # ponytail: preserve/update createdDate and mid if passed by the client
            created_date = data.get('createdDate', old_created_date)
            mid = data.get('mid', old_mid)

            # ponytail: Support updating description (containing attachments)
            if 'description' in data:
                cursor.execute("""
                    UPDATE ejos 
                    SET status = ?, engineer = ?, estCost = ?, actCost = ?, description = ?, logs = ?, createdDate = ?, mid = ?
                    WHERE id = ?
                """, (
                    data['status'], data['engineer'], data['estCost'],
                    data['actCost'], data['description'], json.dumps(current_logs), created_date, mid, ejo_id
                ))
            else:
                cursor.execute("""
                    UPDATE ejos 
                    SET status = ?, engineer = ?, estCost = ?, actCost = ?, logs = ?, createdDate = ?, mid = ?
                    WHERE id = ?
                """, (
                    data['status'], data['engineer'], data['estCost'],
                    data['actCost'], json.dumps(current_logs), created_date, mid, ejo_id
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
                cursor.execute("SELECT username FROM users WHERE role LIKE 'Manager%' OR role LIKE 'Supervisor%' OR role IN ('Foreman Eng', 'Admin Eng', 'Plant Manager', 'Factory Manager', 'Server')")
                for r in cursor.fetchall():
                    self._insert_notification(conn, r[0], ejo_id, notif_msg)

            # ponytail: notify Lead/Admin if status changed to 'Pending Revision' for EJO
            if new_status == 'Pending Revision' and new_status != old_status:
                cursor.execute("SELECT username FROM users WHERE role LIKE 'Manager%' OR role LIKE 'Supervisor%' OR role IN ('Foreman Eng', 'Admin Eng', 'Plant Manager', 'Factory Manager', 'Server')")
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
            # ponytail: support updating project ID
            target_id = data.get('new_id') or (data.get('id') if data.get('id') != proj_id else None)
            if target_id and target_id != proj_id:
                cursor.execute("SELECT id FROM projects WHERE id = ?", (target_id,))
                if cursor.fetchone():
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'message': f"ID Project '{target_id}' sudah digunakan!"}).encode('utf-8'))
                    conn.close()
                    return
                cursor.execute("UPDATE projects SET id = ? WHERE id = ?", (target_id, proj_id))
                proj_id = target_id

            # ponytail: dynamically support update phase and approvals fields
            update_fields = []
            params = []
            if 'title' in data:
                update_fields.append("title = ?")
                params.append(data['title'])
            if 'desc' in data:
                update_fields.append("desc = ?")
                params.append(data['desc'])
            if 'custom_status' in data:
                update_fields.append("custom_status = ?")
                params.append(data['custom_status'])
            if 'pr_percent' in data:
                update_fields.append("pr_percent = ?")
                params.append(int(data['pr_percent']) if data['pr_percent'] is not None else 0)
            if 'po_percent' in data:
                update_fields.append("po_percent = ?")
                params.append(int(data['po_percent']) if data['po_percent'] is not None else 0)
            if 'gr_percent' in data:
                update_fields.append("gr_percent = ?")
                params.append(int(data['gr_percent']) if data['gr_percent'] is not None else 0)
            if 'phase' in data:
                update_fields.append("phase = ?")
                params.append(data['phase'])
            if 'approvals' in data:
                update_fields.append("approvals = ?")
                params.append(json.dumps(data['approvals']) if isinstance(data['approvals'], (dict, list)) else data['approvals'])
            if 'docs' in data:
                update_fields.append("docs = ?")
                params.append(json.dumps(data['docs']) if isinstance(data['docs'], (dict, list)) else data['docs'])
            if 'drawing_id' in data:
                update_fields.append("drawing_id = ?")
                params.append(data['drawing_id'])
            if 'drawing_file' in data:
                update_fields.append("drawing_file = ?")
                params.append(data['drawing_file'])
            if 'execution_docs' in data:
                update_fields.append("execution_docs = ?")
                params.append(json.dumps(data['execution_docs']) if isinstance(data['execution_docs'], (dict, list)) else data['execution_docs'])
            if ('handover_docs' in data):
                update_fields.append("handover_docs = ?")
                params.append(json.dumps(data['handover_docs']) if isinstance(data['handover_docs'], (dict, list)) else data['handover_docs'])
            if ('handover_approvals' in data):
                update_fields.append("handover_approvals = ?")
                params.append(json.dumps(data['handover_approvals']) if isinstance(data['handover_approvals'], (dict, list)) else data['handover_approvals'])
            if ('timeline' in data):
                update_fields.append("timeline = ?")
                params.append(json.dumps(data['timeline']) if isinstance(data['timeline'], (dict, list)) else data['timeline'])
                
            if update_fields:
                params.append(proj_id)
                cursor.execute(f"""
                    UPDATE projects 
                    SET {', '.join(update_fields)}
                    WHERE id = ?
                """, tuple(params))
            conn.commit()

            # ponytail: stamp handover PDFs and notify next pending role strictly matched by department
            if 'handover_approvals' in data:
                try:
                    cursor.execute("SELECT dept, handover_docs, handover_approvals, title, pic, approvals FROM projects WHERE id = ?", (proj_id,))
                    p_row = cursor.fetchone()
                    if p_row:
                        p_dept, p_docs_raw, p_apps_raw, p_title, p_pic, p_approvals_raw = p_row
                        h_docs = json.loads(p_docs_raw) if p_docs_raw else []
                        h_apps = json.loads(p_apps_raw) if p_apps_raw else {}
                        p_approvals = json.loads(p_approvals_raw) if p_approvals_raw else {}
                        p_req = (p_approvals.get('pic') or {}).get('signer') or p_pic or ''
                        for h_url in h_docs:
                            if isinstance(h_url, str) and h_url.split('?')[0].lower().endswith('.pdf'):
                                apply_project_handover_pdf_signatures(h_url, h_apps, conn)

                        # Notify next pending role in exact sequential order
                        handover_roles = ['staff_eng', 'spv_eng', 'manager_eng', 'manager_user', 'spv_user', 'staff_user']
                        next_role = next((r for r in handover_roles if not h_apps.get(r) or not h_apps[r].get('signature')), None)
                        if next_role:
                            norm_p_dept = normalize_dept_code(p_dept)
                            role_labels = {'staff_eng':'Staff ENG','spv_eng':'SPV ENG','manager_eng':'Manager ENG','manager_user':'Manager User','spv_user':'SPV User','staff_user':'Staff User'}
                            notif_msg = f"Project {proj_id} ({p_title or 'Project'}) giliran TTD Berita Acara ({role_labels.get(next_role, next_role)}) departemen {norm_p_dept or 'User'}"

                            cursor.execute("SELECT username, dept, role, fullname FROM users")
                            for u_name, u_dept, u_role, u_fullname in cursor.fetchall():
                                norm_u_dept = normalize_dept_code(u_dept)
                                u_role_lower = (u_role or '').lower()
                                u_dept_lower = (u_dept or '').lower()
                                norm_p_lower = (norm_p_dept or '').lower()
                                dept_match = bool(norm_p_lower and (norm_p_lower in u_role_lower or norm_p_lower in u_dept_lower or norm_u_dept == norm_p_dept))

                                is_match = False
                                if next_role == 'staff_eng':
                                    is_match = (u_role in ('Staff Eng', 'Drafter') or u_name == p_pic or u_fullname == p_pic)
                                elif next_role == 'spv_eng':
                                    is_match = (u_role in ('SPV Eng', 'Supervisor Eng') or any(k in u_role_lower for k in ['spv', 'supervisor'])) and 'foreman' not in u_role_lower
                                elif next_role == 'manager_eng':
                                    is_match = (u_role == 'Manager Eng')
                                elif next_role == 'manager_user':
                                    is_match = (dept_match or u_role in ('Plant Manager', 'Server')) and ('manager' in u_role_lower)
                                elif next_role == 'spv_user':
                                    is_match = (dept_match or u_role == 'Server') and any(k in u_role_lower for k in ['spv', 'supervisor', 'foreman'])
                                elif next_role == 'staff_user':
                                    is_match = (dept_match or u_name == p_req or u_fullname == p_req or u_role == 'Server') and any(k in u_role_lower for k in ['staff', 'user'])

                                if is_match:
                                    self._insert_notification(conn, u_name, proj_id, notif_msg)

                            # Notify requester (staff user) on progress updates
                            req_username = self._resolve_username(conn, p_req) or p_req
                            if req_username:
                                progress_msg = f"Project {proj_id}: Berita Acara saat ini giliran {role_labels.get(next_role, next_role)}"
                                self._insert_notification(conn, req_username, proj_id, progress_msg)
                            conn.commit()
                except Exception as err:
                    print(f"Error stamping handover PDFs or sending notifications: {err}")

            
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
        # ponytail: check authorization (Admin/Foreman/Server or EJO requester during schedule phase)
        query_params = urllib.parse.parse_qs(urllib.parse.urlsplit(self.path).query)
        requester = query_params.get('requester', [''])[0]

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT role, username, fullname FROM users WHERE username = ? OR fullname = ?", (requester, requester))
            requester_row = cursor.fetchone()
            requester_role = requester_row[0] if requester_row else ''
            requester_uname = requester_row[1] if requester_row else requester
            requester_fname = requester_row[2] if requester_row else ''

            cursor.execute("SELECT requester, status FROM ejos WHERE id = ?", (ejo_id,))
            ejo_row = cursor.fetchone()

            is_owner = False
            is_schedule_phase = False
            if ejo_row:
                ejo_req = (ejo_row[0] or '').strip().lower()
                ejo_status = (ejo_row[1] or '').strip()
                
                u_names = {requester.strip().lower(), requester_uname.strip().lower(), requester_fname.strip().lower()}
                if ejo_req in u_names or any(un in ejo_req for un in u_names if un):
                    is_owner = True
                
                if ejo_status in ['Requested', 'Approved', 'Waiting Dept Approval'] or ejo_status.startswith('Checking'):
                    is_schedule_phase = True

            can_delete = (requester_role in ['Admin Eng', 'Foreman Eng', 'Server'] or requester.lower() in ['admin', 'server']) or (is_owner and is_schedule_phase)

            if not can_delete:
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
                cursor.execute("SELECT role, dept FROM users WHERE username = ? OR fullname = ?", (requester, requester))
                user_row = cursor.fetchone()
                if user_row and user_row[0] in ('Drafter', 'Sipil', 'Mekanik', 'Elektrik', 'Program', 'Kalibrasi'):
                    self.send_error(403, f"{user_row[0]} tidak diperbolehkan membuat General EJO.")
                    return

                # ponytail: enforce limit of 2 active general EJOs per category per user for User role and non-ENG SPV/Manager
                if user_row and is_user_limited(user_row[0], user_row[1] if len(user_row) > 1 else ''):
                    category = data.get('category', '')
                    cursor.execute("""
                        SELECT COUNT(*) FROM general_ejos 
                        WHERE (requester = ? OR requester IN (SELECT fullname FROM users WHERE username = ?)) 
                          AND category = ?
                          AND is_archived = 0 
                          AND status != 'Completed' AND status != 'Cancelled' AND status != 'Pending Revision'
                    """, (requester, requester, category))
                    count = cursor.fetchone()[0]
                    if count >= 2:
                        self.send_response(400)
                        self.send_header("Content-Type", "application/json")
                        self.end_headers()
                        self.wfile.write(json.dumps({"status": "error", "message": f"Batas pembuatan General EJO kategori '{category}' tercapai! Anda hanya dapat membuat maksimal 2 General EJO aktif per kategori."}).encode("utf-8"))
                        conn.close()
                        return

            # ponytail: determine initial status based on requester role level
            status = data.get('status', 'Requested')
            logs = data.get('logs', [])
            requester = data.get('requester', '')

            cursor.execute("SELECT COUNT(*) FROM general_ejos")
            ejo_id = data.get('id', '')

            if not ejo_id:
                cursor.execute("SELECT id FROM general_ejos UNION ALL SELECT id FROM drawings")
                existing_ids = [row[0] for row in cursor.fetchall() if row[0]]
                nums = []
                for x in existing_ids:
                    m = re.search(r'EJO(\d{3})', x) or re.search(r'(\d+)', x)
                    if m:
                        nums.append(int(m.group(1)))
                next_num = max(nums) + 1 if nums else 1
                date_str = __import__('datetime').datetime.now().strftime("%d%m%Y")
                ejo_id = f"EJO{next_num:03d}{date_str}"

            # ponytail: store the creation date, cost analysis fields, quantity, qty_needed, qty_stock, and photo_before along with the general EJO record
            cursor.execute("""
                INSERT INTO general_ejos (id, title, dept, category, priority, location, targetDate, status, engineer, estCost, actCost, description, logs, requester, is_archived, createdDate, mid, part_price_new, repair_duration, repair_cost_per_day, photo_before, quantity, qty_needed, qty_stock)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                ejo_id, data['title'], data['dept'], data['category'],
                data['priority'], data['location'], data['targetDate'],
                status, data['engineer'], data['estCost'],
                data['actCost'], data['description'], json.dumps(logs),
                data.get('requester', ''), data.get('createdDate', ''), data.get('mid', ''),
                float(data.get('part_price_new', 0.0)), int(data.get('repair_duration', 0)), float(data.get('repair_cost_per_day', 0.0)),
                data.get('photo_before', ''), int(data.get('quantity', 1)), int(data.get('qty_needed', 0)), int(data.get('qty_stock', 0))
            ))

            # ponytail: if waiting dept approval, notify department Supervisor/Manager
            if status == "Waiting Dept Approval":
                self._notify_dept_approvers(conn, data.get('dept', ''), ejo_id, f"General EJO baru {ejo_id} dari {requester} membutuhkan persetujuan Anda")

            if status == "Requested":
                cursor.execute("SELECT username FROM users WHERE role IN ('Foreman Eng', 'Admin Eng')")
                for r in cursor.fetchall():
                    self._insert_notification(conn, r[0], ejo_id, f"General EJO baru {ejo_id} siap dijadwalkan")

            # ponytail: auto notifikasi jika engineer ditunjuk saat create (mendukung multi-engineer)
            engineer_name = data.get('engineer', 'Unassigned')
            if engineer_name and engineer_name != 'Unassigned':
                for eng in [e.strip() for e in engineer_name.split(",") if e.strip()]:
                    target_username = self._resolve_username(conn, eng)
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
            # ponytail: select createdDate, cost analysis, quantity, qty_needed, qty_stock, and photo_before columns to preserve them during updates
            cursor.execute("SELECT logs, engineer, status, is_archived, approvals, targetDate, estDate, title, dept, category, priority, location, createdDate, mid, part_price_new, repair_duration, repair_cost_per_day, photo_before, quantity, qty_needed, qty_stock FROM general_ejos WHERE id = ?", (ejo_id,))
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
            old_priority = row[10] if (row and len(row) > 10) else "1"
            old_location = row[11] if (row and len(row) > 11) else ""
            old_created_date = row[12] if (row and len(row) > 12) else None
            old_mid = row[13] if (row and len(row) > 13) else ""
            old_part_price_new = row[14] if (row and len(row) > 14) else 0.0
            old_repair_duration = row[15] if (row and len(row) > 15) else 0
            old_repair_cost_per_day = row[16] if (row and len(row) > 16) else 0.0
            old_photo_before = row[17] if (row and len(row) > 17) else ""
            old_quantity = row[18] if (row and len(row) > 18) else 1
            old_qty_needed = row[19] if (row and len(row) > 19) else 0
            old_qty_stock = row[20] if (row and len(row) > 20) else 0

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
            mid = data.get('mid', old_mid)
            part_price_new = float(data.get('part_price_new', old_part_price_new))
            repair_duration = int(data.get('repair_duration', old_repair_duration))
            repair_cost_per_day = float(data.get('repair_cost_per_day', old_repair_cost_per_day))
            photo_before = data.get('photo_before', old_photo_before)
            quantity = int(data.get('quantity', old_quantity))
            qty_needed = int(data.get('qty_needed', old_qty_needed))
            qty_stock = int(data.get('qty_stock', old_qty_stock))
            
            # ponytail: extract approvals and serialize if dictionary
            approvals = data.get('approvals', old_approvals)
            if isinstance(approvals, (dict, list)):
                approvals = json.dumps(approvals)

            if 'description' in data:
                cursor.execute("""
                    UPDATE general_ejos
                    SET status = ?, engineer = ?, estCost = ?, actCost = ?, description = ?, logs = ?, is_archived = ?, approvals = ?, targetDate = ?, estDate = ?, title = ?, dept = ?, category = ?, priority = ?, location = ?, createdDate = ?, mid = ?, part_price_new = ?, repair_duration = ?, repair_cost_per_day = ?, photo_before = ?, quantity = ?, qty_needed = ?, qty_stock = ?
                    WHERE id = ?
                """, (data['status'], data['engineer'], data['estCost'],
                      data['actCost'], data['description'], json.dumps(current_logs), is_archived, approvals, target_date, est_date, title, dept, category, priority, location, created_date, mid, part_price_new, repair_duration, repair_cost_per_day, photo_before, quantity, qty_needed, qty_stock, ejo_id))
            else:
                cursor.execute("""
                    UPDATE general_ejos
                    SET status = ?, engineer = ?, estCost = ?, actCost = ?, logs = ?, is_archived = ?, approvals = ?, targetDate = ?, estDate = ?, title = ?, dept = ?, category = ?, priority = ?, location = ?, createdDate = ?, mid = ?, part_price_new = ?, repair_duration = ?, repair_cost_per_day = ?, photo_before = ?, quantity = ?, qty_needed = ?, qty_stock = ?
                    WHERE id = ?
                """, (data['status'], data['engineer'], data['estCost'],
                      data['actCost'], json.dumps(current_logs), is_archived, approvals, target_date, est_date, title, dept, category, priority, location, created_date, mid, part_price_new, repair_duration, repair_cost_per_day, photo_before, quantity, qty_needed, qty_stock, ejo_id))

            # ponytail: auto notifikasi saat assignment/status berubah (mendukung multi-engineer)
            new_engineer = data.get('engineer', old_engineer)
            new_status = data.get('status', old_status)
            
            new_engineers = [e.strip() for e in new_engineer.split(",") if e.strip() and e.strip() != 'Unassigned']
            old_engineers = [e.strip() for e in old_engineer.split(",") if e.strip() and e.strip() != 'Unassigned']
            
            for eng in new_engineers:
                if eng not in old_engineers:
                    target_username = self._resolve_username(conn, eng)
                    if target_username:
                        self._insert_notification(
                            conn, target_username, ejo_id,
                            f"General EJO {ejo_id} ditugaskan kepada Anda"
                        )
            
            if new_status != old_status and new_engineers:
                for eng in new_engineers:
                    target_username = self._resolve_username(conn, eng)
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
                    cursor.execute("SELECT username FROM users WHERE role IN ('Foreman Eng', 'Admin Eng')")
                    for r in cursor.fetchall():
                        self._insert_notification(conn, r[0], ejo_id, f"General EJO {ejo_id} butuh approval Foreman Anda")
                elif new_status == 'Pending Supervisor Approval':
                    cursor.execute("SELECT username FROM users WHERE role LIKE 'Supervisor%' OR role = 'Server'")
                    for r in cursor.fetchall():
                        self._insert_notification(conn, r[0], ejo_id, f"General EJO {ejo_id} butuh approval Supervisor Anda")
                elif new_status == 'Pending Manager Approval':
                    cursor.execute("SELECT username FROM users WHERE role LIKE 'Manager%' OR role = 'Plant Manager' OR role = 'Server'")
                    for r in cursor.fetchall():
                        self._insert_notification(conn, r[0], ejo_id, f"General EJO {ejo_id} butuh approval Manager Anda")

            # ponytail: notify requester and foremen when department manager approves / rejects EJO
            if new_status != old_status and old_status == 'Waiting Dept Approval':
                cursor.execute("SELECT requester FROM general_ejos WHERE id = ?", (ejo_id,))
                row_req = cursor.fetchone()
                if row_req and row_req[0]:
                    target_username = self._resolve_username(conn, row_req[0]) or row_req[0]
                    if new_status == 'Requested':
                        self._insert_notification(conn, target_username, ejo_id, f"General EJO {ejo_id} Anda telah disetujui oleh Dept Manager")
                    elif new_status == 'Cancelled':
                        self._insert_notification(conn, target_username, ejo_id, f"General EJO {ejo_id} Anda ditolak oleh Dept Manager")
                
                if new_status == 'Requested':
                    cursor.execute("SELECT username FROM users WHERE role IN ('Foreman Eng', 'Admin Eng')")
                    for r in cursor.fetchall():
                        self._insert_notification(conn, r[0], ejo_id, f"General EJO baru {ejo_id} siap dijadwalkan")

            # ponytail: notify Lead/Admin if status changed to 'Pending Revision' for General EJO
            if new_status == 'Pending Revision' and new_status != old_status:
                cursor.execute("SELECT username FROM users WHERE role LIKE 'Manager%' OR role LIKE 'Supervisor%' OR role IN ('Foreman Eng', 'Admin Eng', 'Plant Manager', 'Factory Manager', 'Server')")
                for r in cursor.fetchall():
                    self._insert_notification(
                        conn, r[0], ejo_id,
                        f"General EJO {ejo_id} mengajukan REVISI, butuh persetujuan Anda"
                    )

            # ponytail: delete any associated drawings if status is changed back to Requested or Cancelled (skip if approved from Waiting Dept Approval)
            if new_status in ('Requested', 'Cancelled') and old_status != 'Waiting Dept Approval':
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
        # ponytail: check authorization (Admin/Foreman/Server or General EJO requester during schedule phase)
        query_params = urllib.parse.parse_qs(urllib.parse.urlsplit(self.path).query)
        requester = query_params.get('requester', [''])[0]

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT role, username, fullname FROM users WHERE username = ? OR fullname = ?", (requester, requester))
            requester_row = cursor.fetchone()
            requester_role = requester_row[0] if requester_row else ''
            requester_uname = requester_row[1] if requester_row else requester
            requester_fname = requester_row[2] if requester_row else ''

            cursor.execute("SELECT requester, status FROM general_ejos WHERE id = ?", (ejo_id,))
            ejo_row = cursor.fetchone()

            is_owner = False
            is_schedule_phase = False
            if ejo_row:
                ejo_req = (ejo_row[0] or '').strip().lower()
                ejo_status = (ejo_row[1] or '').strip()

                u_names = {requester.strip().lower(), requester_uname.strip().lower(), requester_fname.strip().lower()}
                if ejo_req in u_names or any(un in ejo_req for un in u_names if un):
                    is_owner = True

                if ejo_status in ['Requested', 'Approved', 'Waiting Dept Approval'] or ejo_status.startswith('Checking'):
                    is_schedule_phase = True

            can_delete = (requester_role in ['Admin Eng', 'Foreman Eng', 'Server'] or requester.lower() in ['admin', 'server']) or (is_owner and is_schedule_phase)

            if not can_delete:
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
        
        # ponytail: handle Unsplash avatar redirect fallback for relative photo- IDs
        if clean_path.startswith("/photo-") or clean_path.startswith("photo-"):
            photo_id = clean_path.lstrip("/")
            self.send_response(302)
            self.send_header("Location", f"https://images.unsplash.com/{photo_id}?w=80")
            self.end_headers()
            return

        # ponytail: handle automatic browser probing (sw.js, .map files, .well-known devtools) to prevent 404 noise
        if clean_path == "/sw.js":
            content = b"// Service Worker Registered\nself.addEventListener('fetch', function(event) {});\n"
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return

        if clean_path.endswith(".map") or clean_path.startswith("/.well-known/"):
            content = b"{}"
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return

        if clean_path == "/" or clean_path == "":
            file_name = "index.html"
        else:
            file_name = urllib.parse.unquote(clean_path.lstrip("/"))
        
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
        elif file_name.endswith(".mp4"):
            mime_type = "video/mp4"
        elif file_name.endswith(".pdf"):
            # ponytail: serve as application/octet-stream if preview=1 to prevent IDM from intercepting AJAX requests
            if "preview=1" in self.path:
                mime_type = "application/octet-stream"
            else:
                mime_type = "application/pdf"
        elif file_name.endswith(".dwg"):
            mime_type = "image/vnd.dwg"

        # Serve static file with HTTP Range support for media streaming (iOS/Android mobile compatibility)
        try:
            file_size = os.path.getsize(file_path)
            range_header = self.headers.get("Range")

            if range_header and range_header.startswith("bytes="):
                # Handle Partial Content / Range Request
                bytes_range = range_header.replace("bytes=", "").split("-")
                start = int(bytes_range[0]) if bytes_range[0] else 0
                end = int(bytes_range[1]) if len(bytes_range) > 1 and bytes_range[1] else file_size - 1

                if start >= file_size or end >= file_size or start > end:
                    self.send_response(416)  # Range Not Satisfiable
                    self.send_header("Content-Range", f"bytes */{file_size}")
                    self.end_headers()
                    return

                chunk_size = (end - start) + 1
                self.send_response(206)  # Partial Content
                self.send_header("Content-Type", mime_type)
                self.send_header("Content-Length", str(chunk_size))
                self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Cache-Control", "public, max-age=3600")
                self.end_headers()

                with open(file_path, "rb") as f:
                    f.seek(start)
                    remaining = chunk_size
                    buffer_size = 64 * 1024
                    while remaining > 0:
                        chunk = f.read(min(buffer_size, remaining))
                        if not chunk:
                            break
                        self.wfile.write(chunk)
                        remaining -= len(chunk)
            else:
                # Full Content Response with Accept-Ranges header
                self.send_response(200)
                self.send_header("Content-Type", mime_type)
                self.send_header("Content-Length", str(file_size))
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Pragma", "no-cache")
                self.send_header("Expires", "0")
                self.end_headers()

                with open(file_path, "rb") as f:
                    buffer_size = 64 * 1024
                    while True:
                        chunk = f.read(buffer_size)
                        if not chunk:
                            break
                        self.wfile.write(chunk)
        except (ConnectionError, BrokenPipeError, ConnectionResetError, ConnectionAbortedError, OSError):
            # Client (mobile browser) closed socket during video streaming / seeking (normal behavior)
            pass
        except Exception as e:
            try:
                self.send_error(500, f"Internal server error serving static file: {str(e)}")
            except Exception:
                pass

    def get_users(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT username, fullname, role, avatar, password, signature, show_status_prop, dept, access_permissions, is_active FROM users")
        rows = cursor.fetchall()
        users = [dict(r) for r in rows]
        conn.close()

        # ponytail: compute online status based on active heartbeat sessions (within last 45 seconds)
        now = time.time()
        with ACTIVE_SESSIONS_LOCK:
            for u in users:
                ukey = u['username'].lower()
                session = ACTIVE_SESSIONS.get(ukey)
                u['is_online'] = bool(session and (now - session.get('last_active', 0)) < 45)

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
            creator = (data.get('creator_username') or data.get('requester_username') or data.get('requester') or '').strip()
            if not creator and hasattr(self, 'path'):
                from urllib.parse import urlparse, parse_qs
                parsed = urlparse(self.path)
                params = parse_qs(parsed.query)
                if 'requester' in params and params['requester']:
                    creator = params['requester'][0]
                elif 'creator_username' in params and params['creator_username']:
                    creator = params['creator_username'][0]

            cursor.execute("SELECT role FROM users WHERE username = ?", (creator,))
            creator_row = cursor.fetchone()
            creator_role = creator_row[0] if creator_row else ''
            
            creator_level = get_role_level(creator_role)
            target_level = get_role_level(data.get('role'))
            
            is_valid = False
            admin_roles = ('Server', 'server', 'Admin Eng', 'Foreman Eng', 'Supervisor Eng', 'Manager Eng', 'Plant Manager', 'Factory Manager')
            if creator.lower() == 'server' or creator_role in admin_roles or (creator_role and creator_role.lower() == 'server'):
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
                INSERT INTO users (username, password, fullname, role, avatar, signature, dept) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                data['username'], data['password'], data['fullname'],
                data['role'], data.get('avatar', ''), data.get('signature', ''), data.get('dept', '')
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
            self.wfile.write(json.dumps({"status": "error", "message": f"Username '{data.get('username')}' sudah digunakan oleh user lain!"}).encode("utf-8"))
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
            
            creator = (data.get('creator_username') or data.get('requester_username') or data.get('requester') or '').strip()
            if not creator and hasattr(self, 'path'):
                from urllib.parse import urlparse, parse_qs
                parsed = urlparse(self.path)
                params = parse_qs(parsed.query)
                if 'requester' in params and params['requester']:
                    creator = params['requester'][0]
                elif 'creator_username' in params and params['creator_username']:
                    creator = params['creator_username'][0]

            cursor.execute("SELECT role FROM users WHERE username = ?", (creator,))
            creator_row = cursor.fetchone()
            creator_role = creator_row[0] if creator_row else ''
            
            creator_level = get_role_level(creator_role)
            old_level = get_role_level(target_old_role)
            new_level = get_role_level(data.get('role'))
            
            is_self_update = (creator.lower() == username.lower()) if creator else False
            
            if is_self_update and creator.lower() != 'server':
                old_password = data.get('old_password', '')
                if old_password and old_password != target_old_password:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": "Password lama yang Anda masukkan salah!"}).encode("utf-8"))
                    conn.close()
                    return
            
            if is_self_update and creator.lower() != 'server' and data.get('role') != target_old_role:
                self.send_response(403)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Anda tidak diperbolehkan mengubah jabatan Anda sendiri!"}).encode("utf-8"))
                conn.close()
                return

            is_valid = False
            admin_roles = ('Server', 'server', 'Admin Eng', 'Foreman Eng', 'Supervisor Eng', 'Manager Eng', 'Plant Manager', 'Factory Manager')
            if creator.lower() == 'server' or creator_role in admin_roles or (creator_role and creator_role.lower() == 'server'):
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
                SET password = ?, fullname = ?, role = ?, avatar = ?, signature = ?, dept = ?
                WHERE username = ?
            """, (
                data.get('password', target_old_password), data.get('fullname', ''), data.get('role', ''),
                data.get('avatar', ''), data.get('signature', ''), data.get('dept', ''), username
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

    def update_user_access(self, username):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))

        requester = (data.get('requester_username') or data.get('creator_username') or '').strip()
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT role FROM users WHERE username = ?", (requester,))
            req_row = cursor.fetchone()
            req_role = req_row[0] if req_row else ''

            is_server = (requester.lower() == 'server' or req_role == 'Server')
            if not is_server:
                self.send_response(403)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Pengaturan akses akun hanya dapat diubah oleh Akun Server!"}).encode("utf-8"))
                conn.close()
                return

            access_permissions = json.dumps(data.get('access_permissions', {}))
            is_active = 1 if data.get('is_active', True) else 0

            cursor.execute("""
                UPDATE users SET access_permissions = ?, is_active = ? WHERE username = ?
            """, (access_permissions, is_active, username))
            conn.commit()

            # If user is set to inactive, force logout active session
            if is_active == 0:
                ukey = username.lower()
                with ACTIVE_SESSIONS_LOCK:
                    if ukey in ACTIVE_SESSIONS:
                        del ACTIVE_SESSIONS[ukey]
                    FORCED_LOGOUT_SESSIONS.add(ukey)

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "message": f"Hak akses akun '{username}' berhasil diperbarui."}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    def update_role_access(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))

        requester = (data.get('requester_username') or data.get('creator_username') or '').strip()
        target_dept = (data.get('dept') or '').strip()
        target_role = (data.get('role') or '').strip()

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT role FROM users WHERE username = ?", (requester,))
            req_row = cursor.fetchone()
            req_role = req_row[0] if req_row else ''

            is_server = (requester.lower() == 'server' or req_role == 'Server')
            if not is_server:
                self.send_response(403)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Pengaturan akses role hanya dapat diubah oleh Akun Server!"}).encode("utf-8"))
                conn.close()
                return

            access_permissions = json.dumps(data.get('access_permissions', {}))
            
            cursor.execute("""
                UPDATE users SET access_permissions = ? WHERE LOWER(COALESCE(dept, 'ENG')) = LOWER(?) AND LOWER(COALESCE(role, 'User')) = LOWER(?)
            """, (access_permissions, target_dept, target_role))
            conn.commit()

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "message": f"Hak akses per Role '{target_role}' Dept '{target_dept}' berhasil diperbarui."}).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

    def bulk_reset_user_access(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode("utf-8"))

        requester = (data.get('requester_username') or data.get('creator_username') or '').strip()
        target_usernames = data.get('usernames', []) # Optional list of target usernames

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT role FROM users WHERE username = ?", (requester,))
            req_row = cursor.fetchone()
            req_role = req_row[0] if req_row else ''

            is_server = (requester.lower() == 'server' or req_role == 'Server')
            if not is_server:
                self.send_response(403)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Hanya Akun Server yang dapat me-reset hak akses massal!"}).encode("utf-8"))
                conn.close()
                return

            if target_usernames and len(target_usernames) > 0:
                placeholders = ','.join(['?'] * len(target_usernames))
                cursor.execute(f"SELECT username, dept, role FROM users WHERE username IN ({placeholders})", target_usernames)
            else:
                cursor.execute("SELECT username, dept, role FROM users WHERE LOWER(username) != 'server' AND LOWER(COALESCE(role, '')) != 'server'")

            users_to_reset = cursor.fetchall()
            reset_count = 0

            for u in users_to_reset:
                uname, udept, urole = u[0], u[1] or 'ENG', u[2] or 'User'
                r_lower = urole.lower()
                if r_lower == 'drafter':
                    perms = {"overview": False, "gejo": False, "drawing": True, "project": False, "partlist": True, "history": True, "admin": False, "approval": False, "signature": False}
                elif 'foreman' in r_lower or 'spv' in r_lower or 'supervisor' in r_lower or 'manager' in r_lower:
                    perms = {"overview": True, "gejo": True, "drawing": True, "project": True, "partlist": True, "history": True, "admin": True, "approval": True, "signature": True}
                elif 'staff' in r_lower or 'user' in r_lower:
                    perms = {"overview": False, "gejo": True, "drawing": True, "project": False, "partlist": False, "history": True, "admin": False, "approval": False, "signature": False}
                else:
                    perms = {"overview": True, "gejo": True, "drawing": True, "project": True, "partlist": True, "history": True, "admin": False, "approval": False, "signature": False}

                cursor.execute("UPDATE users SET access_permissions = ? WHERE username = ?", (json.dumps(perms), uname))
                reset_count += 1

            conn.commit()

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "success",
                "message": f"Berhasil me-reset hak akses {reset_count} akun personel ke Default Role & Dept masing-masing.",
                "count": reset_count
            }).encode("utf-8"))
        except Exception as e:
            conn.rollback()
            self.send_error(500, f"Database error: {str(e)}")
        finally:
            conn.close()

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
            
            requester = (data.get('requester_username') or data.get('creator_username') or data.get('requester') or '').strip() if data else ''
            if not requester and hasattr(self, 'path'):
                from urllib.parse import urlparse, parse_qs
                parsed = urlparse(self.path)
                params = parse_qs(parsed.query)
                if 'requester' in params and params['requester']:
                    requester = params['requester'][0]

            # Check requester's role
            cursor.execute("SELECT role FROM users WHERE username = ?", (requester,))
            requester_row = cursor.fetchone()
            requester_role = requester_row[0] if requester_row else ''
            
            # Enforce hierarchy
            creator_level = get_role_level(requester_role)
            target_level = get_role_level(target_role)
            
            is_valid = False
            if requester.lower() == 'server' or requester_role == 'Server' or (requester_role and requester_role.lower() == 'server'):
                is_valid = True
            elif requester_role == 'Foreman Eng':
                if is_drafter_role(target_role) or target_role in ('Admin Eng', 'User') or target_role.startswith('Staff ') or target_role.startswith('user_'):
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
            col_name = "handover_docs" if doc_type == "handover" else ("execution_docs" if doc_type == "execution" else "docs")
            cursor.execute(f"SELECT {col_name} FROM projects WHERE id = ?", (proj_id,))
            row = cursor.fetchone()
            current_docs = []
            if row and row[0]:
                try:
                    current_docs = json.loads(row[0])
                except:
                    current_docs = []
            
            # ponytail: DO NOT auto-stamp on upload. Stamps are only applied when
            # each role explicitly confirms their signature via PUT handover_approvals.

            current_docs.append(doc_url)
            
            if col_name == "handover_docs":
                empty_approvals = json.dumps({})
                cursor.execute("UPDATE projects SET handover_docs = ?, handover_approvals = ? WHERE id = ?", (json.dumps(current_docs), empty_approvals, proj_id))
            else:
                cursor.execute(f"UPDATE projects SET {col_name} = ? WHERE id = ?", (json.dumps(current_docs), proj_id))
            conn.commit()
            conn.close()

            response_data = {
                "status": "success",
                "url": doc_url
            }
            if col_name == "docs":
                response_data["docs"] = current_docs
            elif col_name == "handover_docs":
                response_data["handover_docs"] = current_docs
                response_data["handover_approvals"] = {}
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

    def delete_project_handover_doc(self, proj_id):
        from urllib.parse import urlparse, parse_qs
        try:
            query = parse_qs(urlparse(self.path).query)
            doc_url = query.get("url", [None])[0]
            if not doc_url:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "url parameter required"}).encode("utf-8"))
                return

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT handover_docs FROM projects WHERE id = ?", (proj_id,))
            row = cursor.fetchone()
            current_docs = []
            if row and row[0]:
                try:
                    current_docs = json.loads(row[0])
                except Exception:
                    current_docs = []

            updated_docs = [d for d in current_docs if d != doc_url]
            empty_approvals = json.dumps({})
            cursor.execute("UPDATE projects SET handover_docs = ?, handover_approvals = ? WHERE id = ?", (json.dumps(updated_docs), empty_approvals, proj_id))
            conn.commit()
            conn.close()

            try:
                local_path = doc_url.split('?')[0].lstrip('/')
                if os.path.exists(local_path):
                    os.remove(local_path)
                orig_path = local_path + ".orig.pdf"
                if os.path.exists(orig_path):
                    os.remove(orig_path)
            except Exception as fe:
                print(f"Error removing deleted handover doc file: {fe}")

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "handover_docs": updated_docs, "handover_approvals": {}}).encode("utf-8"))
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
                   dept, category, priority, location, targetDate, description, requester, engineer, estDate, drawing_type, sub_status, etiket_category, etiket_orientation
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
            # ponytail: support application/json payload for drawing import
            if 'application/json' in content_type:
                data = json.loads(body.decode("utf-8"))
                drawing_id_input = data.get('id', '')
                ejo_id = data.get('ejo_id', '')
                title = data.get('title', '')
                uploader = data.get('uploader', '') or data.get('requester', '')
                dept = data.get('dept', '')
                category = data.get('category', '')
                priority = data.get('priority', '1')
                location = data.get('location', '')
                targetDate = data.get('targetDate', '')
                description = data.get('description', '')
                requester = data.get('requester', '')
                drawing_type = data.get('drawing_type', 'request')
                file_url = data.get('file_path', '')
                logs_data = data.get('logs', [])
                createdDate = data.get('createdDate', '')
                engineer = data.get('engineer', 'Unassigned')
                estDate = data.get('estDate', '')
                sub_status = data.get('sub_status', '')

                conn = sqlite3.connect(DB_FILE)
                cursor = conn.cursor()

                # User Role / Active drawing limits check
                creator_role = ""
                if requester or uploader:
                    creator = requester or uploader
                    cursor.execute("SELECT role, dept FROM users WHERE username = ? OR fullname = ?", (creator, creator))
                    user_row = cursor.fetchone()
                    if user_row:
                        creator_role = user_row[0]
                    if user_row and user_row[0] in ('Drafter', 'Sipil', 'Mekanik', 'Elektrik', 'Program', 'Kalibrasi'):
                        self.send_response(403)
                        self.send_header("Content-Type", "application/json")
                        self.end_headers()
                        self.wfile.write(json.dumps({"status": "error", "message": f"{user_row[0]} tidak diperbolehkan membuat Request Drawing."}).encode("utf-8"))
                        conn.close()
                        return
                    if user_row and is_user_limited(user_row[0], user_row[1] if len(user_row) > 1 else ''):
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
                    cursor.execute("SELECT id FROM drawings UNION ALL SELECT id FROM general_ejos")
                    existing = [row[0] for row in cursor.fetchall() if row[0]]
                    nums = []
                    for x in existing:
                        m = re.search(r'EJO(\d{3})', x) or re.search(r'(\d+)', x)
                        if m:
                            nums.append(int(m.group(1)))
                    next_num = max(nums) + 1 if nums else 1
                    date_str = __import__('datetime').datetime.now().strftime("%d%m%Y")
                    drawing_id = f"EJO{next_num:03d}{date_str}"

                creator_level = ROLE_LEVELS.get(creator_role, 0)
                initial_status = 'Pending Foreman Approval'
                status = data.get('status', initial_status)

                now = __import__('datetime').datetime.now().strftime("%Y-%m-%d %H:%M")
                uploaded_at_val = f"{createdDate} 00:00" if createdDate else now

                if not logs_data:
                    drawing_type_label = "Import" if drawing_type == "import" else "Request"
                    log_status_text = status.replace('Pending Foreman Approval', 'Pending Foreman ENG Approval').replace('Pending Supervisor Approval', 'Pending Supervisor ENG Approval').replace('Pending Manager Approval', 'Pending Manager ENG Approval')
                    logs_data = [{
                        "date": now,
                        "message": f"{drawing_type_label} drawing dibuat oleh {uploader or requester} dengan status {log_status_text}."
                    }]
                else:
                    logs_data.append({
                        "date": now,
                        "message": f"Drawing dibuat melalui import Excel oleh {uploader or requester}."
                    })

                cursor.execute(
                    "INSERT INTO drawings (id, ejo_id, title, file_path, uploader, uploaded_at, status, approvals, logs, dept, category, priority, location, targetDate, description, requester, engineer, estDate, drawing_type, sub_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (drawing_id, ejo_id or None, title, file_url or "", uploader, uploaded_at_val, status, '{}', json.dumps(logs_data), dept, category, priority, location, targetDate, description, requester, engineer, estDate or None, drawing_type, sub_status or None)
                )
                # ponytail: send drawing notifications
                if status == 'Pending Dept Approval':
                    self._notify_dept_approvers(conn, dept, drawing_id, f"Drawing request {drawing_id} ({title}) butuh approval Departemen Anda ({dept})")
                elif status == 'Pending Foreman Approval':
                    cursor.execute("SELECT username FROM users WHERE role IN ('Foreman Eng', 'Admin Eng')")
                    for r in cursor.fetchall():
                        self._insert_notification(conn, r[0], drawing_id, f"Drawing request {drawing_id} ({title}) butuh approval Foreman Anda")

                conn.commit()
                conn.close()

                self.send_response(201)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "id": drawing_id, "file_path": file_url}).encode("utf-8"))
                return

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
            priority = '1'
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
            creator_role = ""
            if requester or uploader:
                creator = requester or uploader
                cursor.execute("SELECT role, dept FROM users WHERE username = ? OR fullname = ?", (creator, creator))
                user_row = cursor.fetchone()
                if user_row:
                    creator_role = user_row[0]
                if user_row and user_row[0] in ('Drafter', 'Sipil', 'Mekanik', 'Elektrik', 'Program', 'Kalibrasi'):
                    self.send_response(403)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": f"{user_row[0]} tidak diperbolehkan membuat Request Drawing."}).encode("utf-8"))
                    conn.close()
                    return

                # ponytail: enforce limit of 2 active drawings per user for User role and non-ENG SPV/Manager
                if user_row and is_user_limited(user_row[0], user_row[1] if len(user_row) > 1 else ''):
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
                cursor.execute("SELECT id FROM drawings UNION ALL SELECT id FROM general_ejos")
                existing = [row[0] for row in cursor.fetchall() if row[0]]
                nums = []
                for x in existing:
                    m = re.search(r'EJO(\d{3})', x) or re.search(r'(\d+)', x)
                    if m:
                        nums.append(int(m.group(1)))
                next_num = max(nums) + 1 if nums else 1
                date_str = __import__('datetime').datetime.now().strftime("%d%m%Y")
                drawing_id = f"EJO{next_num:03d}{date_str}"

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
            creator_level = ROLE_LEVELS.get(creator_role, 0)
            initial_status = 'Pending Foreman Approval'
            drawing_type_label = "Import" if drawing_type == "import" else "Request"
            log_status_text = initial_status.replace('Pending Foreman Approval', 'Pending Foreman ENG Approval').replace('Pending Supervisor Approval', 'Pending Supervisor ENG Approval').replace('Pending Manager Approval', 'Pending Manager ENG Approval')
            initial_logs = [{
                "date": now,
                "message": f"{drawing_type_label} drawing dibuat oleh {uploader or requester} dengan status {log_status_text}."
            }]
            cursor.execute(
                "INSERT INTO drawings (id, ejo_id, title, file_path, uploader, uploaded_at, status, approvals, logs, dept, category, priority, location, targetDate, description, requester, drawing_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (drawing_id, ejo_id or None, title, file_url, uploader, now, initial_status, '{}', json.dumps(initial_logs), dept, category, priority, location, targetDate, description, requester, drawing_type)
            )
            # ponytail: send drawing notifications
            if initial_status == 'Pending Dept Approval':
                self._notify_dept_approvers(conn, dept, drawing_id, f"Drawing request {drawing_id} ({title}) butuh approval Departemen Anda ({dept})")
            elif initial_status == 'Pending Foreman Approval':
                cursor.execute("SELECT username FROM users WHERE role IN ('Foreman Eng', 'Admin Eng')")
                for r in cursor.fetchall():
                    self._insert_notification(conn, r[0], drawing_id, f"Drawing request {drawing_id} ({title}) butuh approval Foreman Anda")

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
            cursor.execute("SELECT status, approvals, logs, engineer, ejo_id, file_path, targetDate, estDate, title, dept, category, priority, location, description, sub_status, etiket_category, etiket_orientation FROM drawings WHERE id = ?", (drawing_id,))
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
            old_priority = row[11] if row[11] is not None else "1"
            old_location = row[12] if row[12] is not None else ""
            old_description = row[13] if row[13] is not None else ""
            old_sub_status = row[14] if len(row) > 14 and row[14] is not None else ""
            old_etiket_category = row[15] if len(row) > 15 and row[15] is not None else ""
            old_etiket_orientation = row[16] if len(row) > 16 and row[16] is not None else "landscape"

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
            etiket_category = old_etiket_category
            etiket_orientation = old_etiket_orientation

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
                    elif 'name="etiket_category"' in header_text:
                        etiket_category = part_body.decode('utf-8').strip()
                    elif 'name="etiket_orientation"' in header_text:
                        etiket_orientation = part_body.decode('utf-8').strip()
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
                etiket_category = data.get('etiket_category', old_etiket_category)
                etiket_orientation = data.get('etiket_orientation', old_etiket_orientation)
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
                new_apps = json.loads(approvals) if approvals else {}
                apply_drawing_pdf_signatures(file_url, new_apps, etiket_category, etiket_orientation)
            except Exception as sig_err:
                print(f"Error in overall PDF signature injection: {sig_err}")

            cursor.execute("""
                UPDATE drawings
                SET status = ?, approvals = ?, logs = ?, engineer = ?, file_path = ?, targetDate = ?, estDate = ?,
                    title = ?, dept = ?, category = ?, priority = ?, location = ?, description = ?, ejo_id = ?, sub_status = ?, etiket_category = ?, etiket_orientation = ?
                WHERE id = ?
            """, (status, approvals, json.dumps(current_logs), engineer, file_url, targetDate, estDate,
                  title, dept, category, priority, location, description, ejo_id, sub_status, etiket_category, etiket_orientation, drawing_id))

            # ponytail: notify on drawing status changes
            if status != old_status:
                if status == 'Pending Dept Approval':
                    self._notify_dept_approvers(conn, dept, drawing_id, f"Drawing request {drawing_id} ({title}) butuh approval Departemen Anda ({dept})")
                elif status == 'Pending Foreman Approval':
                    cursor.execute("SELECT username FROM users WHERE role IN ('Foreman Eng', 'Admin Eng')")
                    for r in cursor.fetchall():
                        self._insert_notification(conn, r[0], drawing_id, f"Drawing request {drawing_id} ({title}) butuh approval Foreman Anda")
                elif status == 'Checking':
                    cursor.execute("SELECT username FROM users WHERE role IN ('Foreman Eng', 'Admin Eng')")
                    for r in cursor.fetchall():
                        self._insert_notification(conn, r[0], drawing_id, f"Drawing {drawing_id} ({title}) butuh pemeriksaan (Checking)")
                elif status == 'On Progress':
                    if engineer and engineer != 'Unassigned':
                        target_username = self._resolve_username(conn, engineer)
                        if target_username:
                            self._insert_notification(conn, target_username, drawing_id, f"Drawing {drawing_id} ({title}) ditugaskan kepada Anda")
                elif status in ('Completed', 'Rejected', 'Cancelled'):
                    cursor.execute("SELECT requester, uploader FROM drawings WHERE id = ?", (drawing_id,))
                    req_row = cursor.fetchone()
                    if req_row:
                        req_name = req_row[0] or req_row[1]
                        target_username = self._resolve_username(conn, req_name)
                        if target_username:
                            self._insert_notification(conn, target_username, drawing_id, f"Status Drawing {drawing_id} ({title}) berubah menjadi {status}")
            
            # notify if engineer changes without status changing
            elif engineer != old_engineer and engineer and engineer != 'Unassigned':
                target_username = self._resolve_username(conn, engineer)
                if target_username:
                    self._insert_notification(conn, target_username, drawing_id, f"Drawing {drawing_id} ({title}) ditugaskan kepada Anda")

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

            # ponytail: recreate only server account after nuclear so login is always possible
            conn2 = sqlite3.connect(DB_FILE)
            c2 = conn2.cursor()
            c2.execute("SELECT COUNT(*) FROM users WHERE username = 'server'")
            if c2.fetchone()[0] == 0:
                c2.execute(
                    "INSERT INTO users (username, password, fullname, role, avatar, dept) VALUES (?, ?, ?, ?, ?, ?)",
                    ("server", "MQELXeeVFU3E3qlCE6QbSGJZUljX9MVnYkJVHFKBXDVbELwkLztLWp2M9iJ7aMTgJZfc6pmCmsokt8TF1Pi2xEvxHtWF9zvUFm8y95IPvg0irAVdnbgPjgg7dSyb9GD5", "System Server Admin", "Server", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80", "ENG")
                )
                conn2.commit()
            conn2.close()

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
        try:
            # Hubungkan socket UDP ke IP publik (tidak benar-benar mengirim data) untuk mencari interface aktif
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
        except Exception:
            try:
                local_ip = socket.gethostbyname(socket.gethostname())
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
