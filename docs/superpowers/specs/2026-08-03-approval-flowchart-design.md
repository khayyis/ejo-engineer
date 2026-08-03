# Design Specification: Dynamic Approval Flowchart Management & Synchronization

## 1. Overview
Fitur ini menambahkan pengelola **Flowchart Tanda Tangan (Approval Flowchart)** di bawah submenu **Manajemen Akses Akun** untuk 3 modul utama:
1. **General EJO**
2. **Drawing EJO**
3. **Project**

Setiap modul memiliki konfigurasi alur persetujuan bertingkat (*Persetujuan Bertingkat*) yang dapat disesuaikan oleh Admin (urutan role, nama tahapan, status wajib tanda tangan, dan aksi approval). Seluruh data ini tersimpan terpusat pada database server (`settings` table) dan tersinkronisasi secara real-time ke kartu **PERSETUJUAN BERTINGKAT** di modal detail serta proses penempelan stempel TTD pada PDF.

---

## 2. Navigation & UI Structure

### Sidebar Navigation
Di bawah menu **Manajemen Akses Akun**, struktur submenu diperbarui menjadi:
- 📊 **Dashboard** (`server-dashboard-access`)
- 🛡️ **Matriks Role & Dept** (`server-access` view: `role`)
- 👥 **Per Akun Personel** (`server-access` view: `user`)
- 🔀 **Flowchart Tanda Tangan** (Grup Submenu / Dropdown Navigasi):
  - 📄 **General EJO** (`data-server-view="flow-gejo"`)
  - 📐 **Drawing EJO** (`data-server-view="flow-drawing"`)
  - 🏗️ **Project** (`data-server-view="flow-project"`)

### Flowchart Configuration View
Pada tampilan **Flowchart Tanda Tangan**, disediakan editor visual interaktif:
1. **Header & Module Selector**: Tab penanda aktif (General EJO / Drawing EJO / Project).
2. **Visual Flowchart Sequence Builder**:
   - Menampilkan urutan langkah approval bertingkat (Step 1, Step 2, dst.).
   - Tombol **Tambah Langkah (+ Step)** untuk menyisipkan tahapan approval baru.
   - Tombol **Naik / Turun (Reorder)** untuk mengubah urutan persetujuan.
   - Tombol **Hapus Step** untuk menghapus tahapan persetujuan.
3. **Detail Konfigurasi Per Step**:
   - **Nama Tahapan / Label**: Misal `STAFF (EPR)`, `SPV (EPR)`, `FOREMAN ENG`, `SUPERVISOR ENG`, `MANAGER ENG`, `FACTORY MANAGER`.
   - **Target Role / Dept**: Role mana yang berhak menyetujui / TTD di langkah tersebut.
   - **Status Wajib TTD**: Checkbox (*Ya / Tidak*) apakah langkah ini membutuhkan gambar tanda tangan digital.
   - **Status Trigger EJO/Project**: Apakah approval di step ini mengubah status EJO (misal dari `Pending Foreman` menjadi `In Progress` atau `Completed`).
4. **Tombol Simpan Konfigurasi**: Mengirimkan perubahan ke endpoint `/api/settings` menggunakan method `PUT`.

---

## 3. Data Schema & Synchronization

### Server Settings Storage (`settings` Table)
Data alur persetujuan disimpan dalam bentuk JSON String di tabel `settings`:
- Key `approval_flowchart_gejo`: Array JSON berisi urutan langkah approval General EJO.
- Key `approval_flowchart_drawing`: Array JSON berisi urutan langkah approval Drawing EJO.
- Key `approval_flowchart_project`: Array JSON berisi urutan langkah approval Project Handover.

#### Contoh JSON Data Structure:
```json
[
  { "step": 1, "key": "staff_epr", "label": "STAFF (EPR)", "role": "user_PRD", "dept": "EPR", "require_signature": true },
  { "step": 2, "key": "spv_epr", "label": "SPV (EPR)", "role": "Supervisor PRD", "dept": "EPR", "require_signature": true },
  { "step": 3, "key": "foreman_eng", "label": "FOREMAN ENG", "role": "Foreman Eng", "dept": "ENG", "require_signature": true },
  { "step": 4, "key": "supervisor_eng", "label": "SUPERVISOR ENG", "role": "Supervisor Eng", "dept": "ENG", "require_signature": true },
  { "step": 5, "key": "manager_eng", "label": "MANAGER ENG", "role": "Manager PRD", "dept": "ENG", "require_signature": true },
  { "step": 6, "key": "factory_manager", "label": "FACTORY MANAGER", "role": "Manager EPR", "dept": "ENG", "require_signature": true }
]
```

### Server Default Initalization (`server.py`)
Saat server diinisialisasi, `INSERT OR IGNORE INTO settings (key, value)` akan mendaftarkan alur default untuk `approval_flowchart_gejo`, `approval_flowchart_drawing`, dan `approval_flowchart_project` agar sistem tidak pernah kosong.

---

## 4. Frontend & PDF Stamping Synchronization

1. **Kartu PERSETUJUAN BERTINGKAT**:
   - Modal detail EJO (General EJO, Drawing EJO, Project) secara dinamis merender item daftar persetujuan berdasarkan alur flowchart yang aktif untuk modul tersebut.
   - Status persetujuan (*Belum ditandatangani*, *Disetujui oleh [User] pada [Waktu]*, atau *Ditolak*) dan tombol aksi approval dipetakan secara akurat sesuai urutan flowchart.

2. **Penerapan Stempel TTD pada PDF**:
   - Handler backend (`apply_pdf_signature`, `apply_drawing_pdf_signatures`, `apply_project_handover_pdf_signatures`) mengambil alur flowchart dari `settings` untuk menentukan slot dan koordinat penempatan tanda tangan pada etiket PDF.

---

## 5. Verification & Test Plan

1. **Pengujian Submenu Navigasi**:
   - Memastikan submenu baru di bawah *Manajemen Akses Akun* dapat di-expand/collapse dan berpindah antar view (*General EJO*, *Drawing EJO*, *Project*).
2. **Pengujian CRUD Flowchart**:
   - Mengubah nama label step, menukar urutan step, menambah step baru, dan menghapus step.
   - Menyimpan konfigurasi ke `/api/settings` dengan method `PUT` dan me-refresh halaman untuk memastikan persitensi data.
3. **Pengujian Sinkronisasi Kartu Persetujuan**:
   - Membuka modal detail General EJO, Drawing EJO, dan Project.
   - Verifikasi kartu **PERSETUJUAN BERTINGKAT** menampilkan urutan dan nama role persetujuan yang baru diubah.
4. **Pengujian Workflow Approval & TTD PDF**:
   - Melakukan simulasi login user sesuai role pada flowchart dan melakukan approval.
   - Memastikan stempel tanda tangan tercetak secara benar sesuai urutan pada file PDF.
