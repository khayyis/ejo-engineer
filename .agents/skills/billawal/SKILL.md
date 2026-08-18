---
name: billawal
description: Use when starting any complex feature, multi-step engineering task, or when explicitly triggered with /billawal to execute the high-discipline hyper-orchestration suite directly on the Main Agent. Fully incorporates /teamwork-preview, /learn, and /goal as an all-in-one comprehensive development suite.
---

# PROTOKOL UTAMA & INVARIAN (NON-NEGOTIABLE)

> **ATURAN BESI (MANDATORY & NON-NEGOTIABLE):**
> 1. **MANDATORY PRE-FLIGHT SUB-SKILLS READ & DIRECT MAIN AGENT EXECUTION (WAJIB UTAMA):** SETIAP KALI PROMPT/TRIGGER USER MEMANGGIL ATAU MENGGUNAKAN `/billawal`, MAIN AGENT UTAMA **HARUS TERLEBIH DAHULU MEMBACA (`view_file`) SUB-SKILL UTAMA** (`using-git-worktrees`, `using-superpowers`). SETELAH SUB-SKILL TERSEBUT DIBACA, MAIN AGENT **WAJIB SEGERA MENJALANKAN EKSEKUSI TUGAS ANCHORED SECARA DIRECT, HIGH-THROUGHPUT, DAN FULLY DEDICATED TANPA MEMERLUKAN DELEGASI SUBAGEN**. MAIN AGENT MEMEGANG KONTROL PENUH SECARA DIRECT ATAS DEKOMPOSISI, IMPLEMENTASI, CODE REVIEW, DAN VERIFIKASI EMPIRIS.
> 2. **ALL-IN-ONE HYPER-SUITE INTEGRATION (/teamwork-preview + /learn + /goal):** SUITE `/billawal` SECARA OTOMATIS MENGGABUNGKAN DAN MENJALANKAN ALUR KERJA:
>    - **`/teamwork-preview`**: PENYUSUNAN SPESIFIKASI TASK TERSTRUKTUR (`prompt_draft.md`), BATASAN REQUIREMENTS (R1, R2...), ACCEPTANCE CRITERIA BERDASARKAN METRIK OBJEKTIF, SERTA MODUL INTEGRITAS DATA.
>    - **`/goal`**: AUTONOMOUS LONG-RUNNING EXECUTION LOOP YANG BERJALAN TERUS MENERUS DENGAN VERIFIKASI BERBALAS DARI HASIL EMPIRIS HINGGA TERPENUHI LENGKAP BUKTI TERMINAL SEBELUM EMIT `<!-- GOAL_COMPLETE -->`.
>    - **`/learn`**: CONTINUOUS LEARNING RETENTION MANDATE UNTUK MENANGKAP AKAR MASALAH, PERBAIKAN PATTERN, SERTA MENGUPDATE `learning_proposal.md` DAN `.agents/AGENTS.md` PROAKTIF AGAR SISTEM MEMILIKI INGATAN JANGKA PANJANG TERHADAP RULE RENDER & INTERAKSI KODE.
> 3. **NON-DESTRUCTIVE DATA PRESERVATION (PRINSIP ANTI-HAPUS DATA):** MAIN AGENT DILARANG KERAS MENGHAPUS, MENGGANTI, ATAU MENGILANGKAN METRIK/SERIES/KOLOM DATA/SLICE GRAFIK/PROPERTI EKSISTING SAAT MENAMBAHKAN FITUR BARU, KECUALI ADA PERINTAH EKSPLISIT (`DELETE` / `REPLACE`) DARI USER. KATA "TAMBAHKAN" ATAU "ADD" WAJIB DIARTIKAN SEBAGAI *APPEND/OVERLAY* DENGAN MENJAGA METRIK LAMA TETAP UTUH.
> 4. **ZERO-RATIONALE POLICY:** JANGAN PERNAH berasumsi atau menebak isi berkas, status sistem, atau hasil pengujian tanpa verifikasi empiris langsung (perintah terminal/pembacaan berkas).
> 5. **NO-BYPASS VERIFICATION GATES:** JANGAN PERNAH melewati gerbang verifikasi (verification gates) demi kecepatan.
> 6. **EMPIRICAL PROOF MANDATE:** SETIAP tindakan yang mengubah status (*state-changing action*) HARUS memiliki langkah pembuktian (*proof step*) berupa log eksekusi terminal dengan exit code 0.

---

## 1. PRE-FLIGHT CHECK (GERBANG EKSEKUSI WAJIB)

Sebelum menjalankan fase eksekusi apa pun, selesaikan seluruh kriteria wajib berikut secara sekuensial:

- [ ] **1.1 Registrasi Dependency Sub-Skill (MANDATORY `view_file` CALLS):**
  Panggil `view_file` secara eksplisit pada berkas sub-skill berikut sebelum mengambil tindakan apa pun:
  1. `using-git-worktrees`: `C:\Users\user\.gemini\config\plugins\superpowers\skills\using-git-worktrees\SKILL.md`
  2. `using-superpowers`: `C:\Users\user\.gemini\config\plugins\superpowers\skills\using-superpowers\SKILL.md`

- [ ] **1.2 Pemeriksaan Lingkungan Git & Worktree:**
  Jalankan `git branch --show-current` dan `git rev-parse --git-dir` vs `git rev-parse --git-common-dir`.
  Verifikasi apakah saat ini berada dalam linked worktree terisolasi atau git branch fitur dedicated.

- [ ] **1.3 Aktivasi Integrated Capability Engines:**
  Konfirmasi aktivasi alur kerja all-in-one:
  - Drafting `prompt_draft.md` (`/teamwork-preview`)
  - Long-running goal execution loop (`/goal`)
  - Permanent learning capture & retention (`/learn`)

---

## 2. PETA ALUR KERJA TERSTRUKTUR (STATE MACHINE ALL-IN-ONE)

```
[FASE 0: ISOLASI & PRE-FLIGHT]
         │
         ▼
[FASE 1: SPESIFIKASI & DRAFTING TEAMWORK (/teamwork-preview)] 
         │ (Menyusun prompt_draft.md, R1/R2, Acceptance Criteria, Integrity Mode)
         ▼
[FASE 2: ANALISIS MENDALAM & DEKOMPOSISI TUGAS]
         │
         ▼
[FASE 3: EKSEKUSI HIGH-DISCIPLINE & AUTONOMOUS GOAL LOOP (/goal)]
         │ (Iterasi berkesinambungan hingga kriteria penerimaan terbukti empiris)
         ▼
[FASE 4: SELF-REVIEW & REKONSILIASI KODE (requesting-code-review)]
         │
         ▼
[FASE 5: VERIFIKASI EMPIRIS & CONTINUOUS LEARNING RETENTION (/learn)]
         │ (Uji terminal exit code 0, buat learning_proposal.md, update AGENTS.md)
         ▼
[FASE 6: SANITASI AKHIR & EMIT GOAL COMPLETE]
```

---

## 3. PROTOKOL EKSEKUSI PER FASE

### FASE 0: Isolasi Lingkungan & Baseline Assessment (`using-git-worktrees`)
1. Verifikasi isolasi workspace. Jika berada di main branch tanpa worktree terisolasi, gunakan native worktree tool atau `git worktree add` untuk membuat ruang kerja terisolasi.
2. Jalankan perintah *clean baseline check* (misal: test suite atau build script) untuk memastikan sistem awal bebas dari error sebelum perubahan kode dimulai.
3. Catat commit hash baseline (`BASE = git rev-parse HEAD`).

### FASE 1: Spesifikasi & Drafting Teamwork (`/teamwork-preview`)
1. Susun atau perbarui berkas artefak **`prompt_draft.md`** dengan struktur terstandar:
   - **Goal & Project Description**: Ringkasan fitur/tujuan.
   - **Requirements (R1, R2, ...)**: Spesifikasi *what* (apa yang dibangun), bukan *how* (cara membangun), untuk mempertahankan ruang solusi terbaik.
   - **Acceptance Criteria**: Kriteria penerimaan terukur yang dapat diuji secara independen.
   - **Integrity Mode**: Mode integritas (`development`, `demo`, `benchmark`).
2. Pastikan seluruh kriteria dapat diuji secara objektif tanpa interpretasi subjektif.

### FASE 2: Analisis Mendalam & Dekomposisi Tugas Main Agent
Pecah rancangan pelaksanaan menjadi langkah-langkah eksekusi atomis terstruktur. Main Agent menyusun **Kontrak Eksekusi Direct**:
- **Scope & Targets:** Berkas spesifik yang akan diubah.
- **Constraints:** Berkas/komponen/API yang DILARANG disentuh atau diubah signature-nya.
- **Preservation Check:** Wajib mendaftarkan metrik, kolom DB, variabel, dan elemen UI eksisting yang DILARANG DIHAPUS (Aturan Anti-Hapus Data).
- **Deliverables:** Hasil fungsional yang memiliki kriteria uji terukur (*testable output*).

### FASE 3: Eksekusi High-Discipline & Autonomous Goal Loop (`/goal`)
1. **Direct Deep Research & Inspection:** Main Agent memeriksa kode, melakukan `view_file` dan `grep_search` secara langsung tanpa perantara subagen.
2. **High-Precision Implementation:** Main Agent melakukan pengubahan kode secara presisi dan aman (`replace_file_content` / `multi_replace_file_content` / `write_to_file`).
3. **Autonomous Goal Loop Engine:** Berjalan secara persisten dan mandiri hingga seluruh item acceptance criteria dalam `prompt_draft.md` terpenuhi sepenuhnya. Jangan berhenti di tengah jalan sebelum verifikasi bersih didapatkan.

### FASE 4: Self-Review & Rekonsiliasi Kode (`requesting-code-review`)
Sebelum melangkah ke verifikasi final:
1. Periksa diff perubahan secara mandiri (`git diff BASE HEAD`) untuk memastikan kepatuhan spesifikasi, tidak ada anti-pattern, dan tidak ada regresi.
2. Pastikan seluruh batas arsitektur dan kontrak API tetap utuh dan konsisten.
3. Lakukan perbaikan langsung (*self-fix loop*) jika ditemukan kelemahan atau kejanggalan dalam diff.

### FASE 5: Loop Verifikasi Empiris & Continuous Learning Retention (`/learn`)
1. **Verifikasi Empiris Terminal**:
   - Jalankan test suite, linter, type-checker, dan build verification command secara utuh.
   - Tangkap log terminal dan verifikasi exit code = 0 (0 error, 0 failure).
2. **Protokol Continuous Learning (`/learn`)**:
   - Analisis interaksi, bug fix, atau penyesuaian yang telah dilakukan untuk menemukan pola reusable/guardrail baru.
   - Buat/perbarui berkas `learning_proposal.md` yang memuat klasifikasi (Rule vs Skill), rasional, dan diff aturan baru.
   - Propagasi aturan baru secara proaktif ke berkas aturan proyek **`.agents/AGENTS.md`**.

---

## 4. MATRIKS PENANGANAN KEGAGALAN & RECOVERY

| Jenis Kegagalan | Tindakan Korektif | Batas Toleransi |
| :--- | :--- | :--- |
| **Gagal Type Check / Lint** | Periksa log error terminal, perbaiki langsung di kode. | Maksimal 3x iterasi fix loop. |
| **Konflik File / Merge Overlap** | Batalkan perubahan bermasalah (`git checkout/reset`), isolasi ulang berkas. | Segera saat terdeteksi. |
| **Test Case Gagal** | Jalankan `systematic-debugging`, perbaiki root cause. DILARANG mengubah test assertion kecuali spesifikasi berubah. | Maksimal 2x perbaikan. Jika tetap gagal, STOP & laporkan BLOCKED. |
| **Execution Stuck / Retry Loop** | Lakukan re-analisis mendalam terhadap dependensi dan arsitektur sebelum mencoba perbaikan ulang. | Maksimal 3 ronde total per kendala. |

---

## 5. BENDERA MERAH (RED FLAGS) - HENTIKAN EKSEKUSI SEGERA

**EKSEKUSI HARUS SEGERA DIHENTIKAN JIKA TERJADI INDIKASI BERIKUT:**

1. **Rasionalisasi Tanpa Bukti:** Mengklaim "kode sudah sukses" atau "pasti berjalan" tanpa menyertakan log perintah terminal aktual.
2. **Side Effects Unsanctioned:** Mengubah berkas atau konfigurasi di luar scope Kontrak Tugas tanpa persetujuan eksplisit.
3. **Penyelesaian Prematur:** Menandai tugas selesai ketika masih terdapat warning kritis, test failure, atau lint error.
4. **Mass Unscoped Edits:** Melakukan perombakan massal pada banyak berkas tak berhubungan dalam satu langkah tunggal tanpa dekomposisi sub-tugas.

---

## 6. SANITASI AKHIR & LAPORAN PENYELESAIAN ALL-IN-ONE

Setelah seluruh alur kerja selesai dan verifikasi empiris lulus 100%, sajikan laporan penyelesaian terstruktur:

1. **Ringkasan Perubahan Berkas:** Daftar berkas yang ditambah, diubah, atau dihapus (lengkap dengan markdown link `file:///...`).
2. **Bukti Verifikasi Empiris:** Kutipan log perintah terminal yang membuktikan exit code 0 dan 0 failure.
3. **Dokumentasi Artefak Suite:** Link ke `prompt_draft.md` (`/teamwork-preview`), `walkthrough.md` (`/billawal`), dan `learning_proposal.md` (`/learn`).
4. **Pembelajaran Tersimpan (`/learn`)**: Aturan baru yang telah ditambahkan ke `.agents/AGENTS.md`.
5. **Sinyal Penyelesaian Goal (`/goal`)**: Sertakan tag `<!-- GOAL_COMPLETE -->` di akhir laporan sebagai penanda tugas telah selesai secara tuntas.

---

## 7. AUDIT & LESSONS LEARNED (ATURAN PEMBELAJARAN SESI)

### 7.1 Multi-Directory Asset Synchronization (Root vs Laravel Subsystem)
- **Problem**: Mengubah berkas publik hanya di root (`style.css`, `app.js`) tanpa memperbarui folder publik subsistem (`laravel/public/style.css`, `laravel/public/app.js`, `laravel/resources/views/welcome.blade.php`) menyebabkan browser menyajikan file cache lama saat diakses dari server Laravel.
- **Mandate**: Setiap kali ada perubahan aset frontend, Main Agent **wajib mempropagasi dan menyinkronkan perubahan ke seluruh folder publik terkait dalam 1 langkah sekuensial**, serta menaikkan versi *cache-buster query string* (`?v=3.5`, `?v=8.5`) di berkas template HTML/Blade.

### 7.2 Mobile Viewport 2-Row Header Architecture
- **Problem**: Memaksakan Logo, Profil User (Avatar, Nama, Logout), dan Navbar Horizontal ke dalam 1 baris pada layar HP ($\le 768\text{px}$) menyebabkan tabrakan elemen UI, menyisakan area scroll yang terlalu pendek (<80px), dan memicu efek membal (*rubber-band bounce*).
- **Mandate**: Pada tampilan mobile, susun tata letak header menjadi **2 baris terpisah secara mutlak**:
  - **Baris 1 (Header Bar, ~52px)**: Logo Perusahaan (Kiri) & Detail Profil User/Logout (Kanan).
  - **Baris 2 (Navbar Container, ~48px)**: Menggunakan 100% lebar layar mobile khusus untuk tombol tab navigasi & panah scroll `<` `>`.

### 7.3 Visual Inspection & 1-Prompt Root Cause Diagnosis
- **Problem**: Memperbaiki masalah gestur UI dengan mencoba-coba script JS (`touchstart`, `scrollLeft`) tanpa melihat tampilan visual di viewport 390px terlebih dahulu membuang waktu secara tidak efektif.
- **Mandate**: Sebelum mengubah kode event listener JS pada bug antarmuka pengguna, Main Agent **wajib melakukan visual inspection tata letak di viewport sempit (390px)** untuk mengidentifikasi apakah akar masalah sebenarnya berasal dari bentrokan kontainer (*container collision*) atau batasan fisik layar.

### 7.4 Gallery Dropdown & Dedicated Gallery Grid Routing
- **Problem**: Mengarahkan navigasi submenu galeri secara langsung ke halaman Kanban EJO menyebabkan duplikasi tampilan dan kehilangan fungsionalitas visual galeri.
- **Mandate**: Sediakan section galeri visual dedicated (`#tab-drawing-gallery`) dengan grid thumbnail (gambar, PDF, CAD), filter kategori dropdown, dan fungsi pencarian independen. Integrasikan pula gambar bermerek `Repair Part` ke dalam Galeri Spare Part (`#tab-partlist-gallery`).

### 7.5 Mobile Navbar `:has()` Parent Selector Guardrail
- **Problem**: Menggunakan broad descendant selector `.nav-item-wrapper:has(.nav-btn[style*="display: none"])` pada mobile viewport menyebabkan seluruh parent wrapper (seperti Galeri Drawing atau History EJO) disembunyikan saat sub-tombol di dalam submenunya (seperti Drawing Sipil atau Project Monitoring) disembunyikan untuk role tertentu.
- **Mandate**: Selalu gunakan strict direct parent selector `.nav-item-wrapper:has(> .nav-btn:not(.sub-btn)[style*="display: none"])` agar penyembunyian sub-menu spesifik role tidak menyembunyikan parent navigation wrapper utamanya.

### 7.6 Previous Completed Week Rolling Window for Weekly Trend Filter ("Minggu Ini")
- **Problem**: Mengambil rentang tanggal minggu berjalan (Senin s/d Minggu saat ini) pada filter "Minggu Ini" menyebabkan data grafik tampak kosong/sedikit di awal pekan kerja (Senin-Kamis), padahal user membutuhkan evaluasi minggu penuh yang telah selesai.
- **Mandate**: Filter mingguan ("Minggu Ini") pada Grafik Tren EJO dan Analitik Overview wajib mengambil siklus **1 minggu penuh sebelumnya yang telah selesai (Senin s/d Minggu minggu lalu)**. Data terkunci pada minggu lalu selama hari Senin s/d Minggu berjalan (misal: tanggal 10-16 Agustus menampilkan data 3-9 Agustus), dan otomatis bergeser maju ke siklus baru saat memasuki hari Senin minggu berikutnya (tanggal 17 Agustus bergeser menampilkan 10-16 Agustus). Gunakan helper terstandar `getPreviousCompletedWeekRange(now)` di semua modul analitik.

### 7.7 Previous Completed 28 Days (4 Weeks) Rolling Window for Monthly Filter ("Bulan Ini")
- **Problem**: Mengambil rentang tanggal kalender bulan berjalan (tanggal 1 s/d akhir bulan) pada filter "Bulan Ini" menyebabkan data di awal bulan menjadi kosong atau tidak seragam intervalnya.
- **Mandate**: Filter bulanan ("Bulan Ini") pada Grafik Tren EJO dan Analitik Overview wajib mengambil siklus **28 hari penuh sebelumnya sebelum hari Senin minggu berjalan (4 minggu penuh yang telah selesai: `[currentMonday - 28 days, currentMonday - 1 day]`)**. Data terkunci selama hari Senin s/d Minggu berjalan (misal: hari Rabu tanggal 12 Agustus tetap mengambil 28 hari sebelum Senin 10 Agustus, yaitu 13 Juli s/d 9 Agustus). Tanggal otomatis bergeser maju (*roll over*) saat memasuki hari Senin minggu berikutnya (tanggal 17 Agustus bergeser ke 20 Juli s/d 16 Agustus). Gunakan helper terstandar `getPreviousCompletedMonthRange(now)` di seluruh modul analitik.

### 7.8 Previous Completed 365 Days (12 Months) Rolling Window for Yearly Filter ("Tahun Ini")
- **Problem**: Mengambil rentang tanggal kalender tahun berjalan (1 Januari s/d 31 Desember) pada filter "Tahun Ini" menyebabkan data di awal tahun menjadi kosong atau tidak mencerminkan evaluasi tahunan penuh (*trailing 12 months*).
- **Mandate**: Filter tahunan ("Tahun Ini") pada Grafik Tren EJO dan Analitik Overview wajib mengambil siklus **365 hari penuh sebelumnya sebelum hari Senin minggu berjalan (`[currentMonday - 365 days, currentMonday - 1 day]`)**. Data terkunci selama hari Senin s/d Minggu berjalan (misal: hari Rabu tanggal 12 Agustus 2026 tetap mengambil 365 hari sebelum Senin 10 Agustus 2026, yaitu 10 Agustus 2025 s/d 9 Agustus 2026). Tanggal otomatis bergeser maju (*roll over*) saat memasuki hari Senin minggu berikutnya (tanggal 17 Agustus 2026 bergeser ke 17 Agustus 2025 s/d 16 Agustus 2026). Gunakan helper terstandar `getPreviousCompletedYearRange(now)` di seluruh modul analitik dengan 12 kolom bulan bergulir (*rolling months*).

### 7.9 Chart.js Pure TradingView Real-Time Tracker Bar & Crosshair Architecture
- **Problem**: Kotak popup tooltip yang melayang di dalam kanvas grafik sering kali menumpuk dan menutupi batang data, angka total di atas batang (*topTotalsPlugin*), maupun label tanggal pada sumbu X di bagian bawah saat pengguna melakukan hover.
- **Mandate**: Nonaktifkan popup tooltip di dalam kanvas (`options.plugins.tooltip.enabled = false`) dan gunakan **Header TradingView Tracker Bar** (`#trend-tv-tracker`) di atas kanvas grafik bersama dengan garis vertikal glowing (*crosshair guideline* `trendCrosshairPlugin`). Seluruh metrik (`Periode`, `Masuk`, `Selesai`, `Dibatalkan`, `OS`) diperbarui secara *real-time* di tracker bar atas saat kolom di-hover dan kembali ke total ringkasan saat kursor keluar (*mouseleave*). Tata letak ini menjamin seluruh kanvas grafik, batang data, angka total, dan label tanggal sumbu X tetap 100% bersih, luas, dan bebas hambatan.





