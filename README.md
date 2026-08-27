# ⚡ EJO ENGINEER MANAGEMENT SYSTEM

Sistem manajemen dan pelacakan tiket **Engineering Job Order (EJO)** terintegrasi untuk PT. BAS. Dirancang dengan tampilan modern bertema dark/glassmorphism berkinerja tinggi untuk memonitor, mengelola tiket General EJO, Drawing EJO, log aktivitas harian teknisi/drafter, analitik beban kerja, dan integrasi sinkronisasi SAP.

---

## 🚀 Fitur Utama

- 📊 **Overview & Analitik Real-Time:** 
  - Visualisasi grafik status tiket, timeline penyelesaian, dan distribusi beban kerja personel.
  - Rolling window analytics (mingguan, bulanan, tahunan).
- 📋 **General EJO & Drawing EJO Tracking:**
  - Manajemen status tiket: *Requested*, *In Progress*, hingga *Completed*.
  - Detail item material, tracking PIC engineer, lampiran gambar teknik, dan feedback.
- 📝 **Log Aktivitas Harian Personel (WhatsApp Recap Style):**
  - Rekap otomatis & manual aktivitas harian teknisi dan drafter.
  - Pengelompokan tugas berbasis aktivitas unik (`byTask`) dengan format tabel rapat.
  - Multi-select checklist engineer lengkap dengan badge counter beban kerja aktif.
  - Penarikan tiket aktif secara interaktif via card selection.
  - Highlight status absensi khusus (*CUTI, OFF, NPL, IZIN, SAKIT*).
  - Navigasi cepat: klik nama atau deskripsi tiket langsung memfilter data pada tab terkait.
- 🔄 **Sinkronisasi Otomatis & Manual:**
  - Konektivitas sinkronisasi data SAP EJO melalui background worker.

---

## 🛠️ Stack Teknologi

- **Backend:** Laravel (PHP 8.x), RESTful API Controller, SQLite Database.
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3 Glassmorphism, Chart.js, Lucide Icons, SheetJS.
- **Architecture:** Local Hybrid Mirroring (`root` template & `laravel/resources/` + `laravel/public/`).

---

## 📂 Struktur Direktori Penting

```
├── app.js                          # Core frontend logic & state management
├── index.html                      # Root HTML dashboard UI
├── style.css                       # Root styling & theme definitions
├── laravel/
│   ├── app/Http/Controllers/Api/   # API controllers (EjoController, dll)
│   ├── database/                   # SQLite database & migrations
│   ├── public/                     # Public assets mirror (app.js, style.css, index.html)
│   ├── resources/views/            # Blade template mirror (welcome.blade.php)
│   └── routes/api.php              # RESTful API routing endpoints
└── README.md                       # Dokumentasi project
```

---

## ⚡ Panduan Instalasi & Menjalankan

### 1. Prasyarat
- PHP >= 8.1
- Composer
- Node.js (untuk validasi sintaks & development tools)

### 2. Setup Backend Laravel
Masuk ke direktori `laravel`:
```bash
cd laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### 3. Menjalankan Server
Jalankan server pengembangan Laravel:
```bash
php artisan serve --host=0.0.0.0 --port=8000
```
Akses dashboard melalui browser: `http://localhost:8000`

---

## 🛡️ Aturan Pengembangan (Development Rules)

1. **Multi-Directory Mirroring:** Perubahan pada frontend JS/CSS wajib disinkronkan secara konsisten di 3 target:
   - Root: `/app.js`, `/style.css`, `/index.html`
   - Laravel Public: `/laravel/public/app.js`, `/laravel/public/style.css`, `/laravel/public/index.html`
   - Laravel Resources: `/laravel/resources/js/app.js`, `/laravel/resources/views/welcome.blade.php`
2. **Cache Busting:** Selalu lakukan *version bump* pada query string asset (`app.js?v=XX.0` dan `style.css?v=XX.0`).
3. **Syntax Integrity:** Jalankan validasi sintaks sebelum commit:
   ```bash
   node --check app.js
   ```
