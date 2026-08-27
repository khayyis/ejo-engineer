<!DOCTYPE html>
<html lang="id" data-theme="light">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
        content="PT. BAS - Engineering Job Order (EJO) Web Dashboard. Track, manage, and analyze engineering maintenance and project EJO.">
    <title>PT. BAS | Dashboard</title>
    <!-- Google Fonts: Outfit -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet">
    <!-- Lucide Icons -->
    <script src="lucide.min.js"></script>
    <!-- Chart.js -->
    <script src="chart.js"></script>
    <!-- Stylesheet -->
    <link rel="stylesheet" href="style.css?v=24.3">
</head>

<body>
    <!-- Login Screen Container -->
    <div class="login-wrapper" id="login-container">
        <!-- Background Video -->
        <video id="login-bg-video" autoplay loop muted="muted" playsinline webkit-playsinline defaultMuted
            class="login-bg-video" src="202607301136.mp4">
            <source src="202607301136.mp4" type="video/mp4">
        </video>
        <div class="login-bg-overlay"></div>

        <div class="login-box card-glass animate-in">
            <div class="login-logo">
                <div class="login-logo-subtitle" style="margin-top: 0.5rem;">
                    <span class="sub-line-top">ENGINEERING JOB ORDER</span>
                    <span class="sub-line-bottom">PORTAL SYSTEM</span>
                </div>
            </div>

            <form id="login-form" class="login-form">
                <div class="form-field">
                    <label for="login-username">Username <span class="required">*</span></label>
                    <input type="text" id="login-username" placeholder="Masukkan Username" required>
                </div>

                <div class="form-field">
                    <label for="login-password">Password <span class="required">*</span></label>
                    <div class="password-input-wrapper">
                        <input type="password" id="login-password" placeholder="Masukkan Password" required>
                        <button type="button" class="btn-toggle-password" id="btn-toggle-pass"
                            title="Tampilkan Password">
                            <i data-lucide="eye" id="pass-eye-icon" style="width: 16px; height: 16px;"></i>
                        </button>
                    </div>
                </div>

                <div class="form-field" id="login-totp-field" style="display: none;">
                    <label for="login-totp-code" style="color: var(--color-cyan, #06b6d4); font-weight: 600;">Kode 2FA Authenticator (6-Digit) <span class="required">*</span></label>
                    <input type="text" id="login-totp-code" placeholder="123456" maxlength="6" pattern="[0-9]{6}" autocomplete="one-time-code" style="letter-spacing: 4px; font-size: 1.1rem; text-align: center; font-weight: bold;">
                </div>

                <div id="login-error-msg" class="login-error-msg"
                    style="display: none; color: var(--color-rose); font-size: 0.8rem; margin-top: 0.5rem; text-align: left;">
                    <i data-lucide="alert-circle"
                        style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>
                    <span>Username atau password salah!</span>
                </div>

                <button type="submit" id="btn-login-submit" class="btn btn-primary glow-button full-width"
                    style="margin-top: 1.5rem;">
                    <i data-lucide="log-in"></i> Masuk Ke Dashboard
                </button>
            </form>
        </div>
    </div>

    <!-- Fullscreen Welcome Greeting Overlay (Layar Sambutan Putih/Bersih) -->
    <div id="welcome-greeting-screen" class="welcome-fullscreen-overlay" style="display: none;">
        <div class="welcome-fullscreen-card">
            <h1 class="welcome-fullscreen-title">WELCOME, <span id="welcome-user-name">Pengguna</span>!</h1>
            <p class="welcome-fullscreen-subtitle">Selamat Datang di Portal Web ENGINEERING JOB ORDER</p>
            <div class="welcome-fullscreen-scroll-hint">
                <span>Geser ke bawah untuk masuk ke Dashboard</span>
                <div class="bounce-circle">
                    <i data-lucide="chevron-down"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- App Container -->
    <div class="app-container" style="display: none;">

        <!-- Sidebar Navigation -->
        <aside class="sidebar">
            <div class="sidebar-brand">
                <div class="logo-icon" onclick="switchTab('overview')" style="cursor: pointer;"
                    title="Buka EJO Dashboard">
                    <img src="Logo-BAS.png" alt="Logo PT. Bumi Alam Segar">
                </div>
            </div>

            <div class="sidebar-nav-container">
                <button class="nav-scroll-arrow left" id="nav-scroll-left" aria-label="Scroll Left"
                    style="display: none;">
                    <i data-lucide="chevron-left"></i>
                </button>
                <nav class="sidebar-nav">
                    <button class="nav-btn active" data-tab="overview" style="display: none;">
                        <i data-lucide="layout-dashboard"></i>
                        <span>Dashboard</span>
                    </button>

                    <!-- General EJO Menu & Submenu -->
                    <div class="nav-item-wrapper">
                        <button class="nav-btn" data-tab="general-ejo" id="btn-nav-general-ejo">
                            <i data-lucide="layers"></i>
                            <span>General EJO</span>
                            <span class="gejo-chevron-toggle"
                                style="margin-left: auto; display: flex; align-items: center; padding: 2px;">
                                <i data-lucide="chevron-down" class="gejo-chevron"
                                    style="width: 16px; height: 16px; transition: transform 0.2s;"></i>
                            </span>
                        </button>
                        <div class="sidebar-submenu submenu" id="general-ejo-submenu">
                            <button class="nav-btn sub-btn" data-tab="general-ejo" data-gejo-phase="1">
                                <i data-lucide="calendar"></i>
                                <span>Schedule</span>
                            </button>
                            <button class="nav-btn sub-btn" data-tab="general-ejo" data-gejo-phase="2">
                                <i data-lucide="play-circle"></i>
                                <span>On Progress</span>
                            </button>
                            <button class="nav-btn sub-btn" data-tab="general-ejo" data-gejo-phase="3">
                                <i data-lucide="check-circle-2"></i>
                                <span>Done</span>
                            </button>
                        </div>
                    </div>

                    <!-- Drawing Menu & Submenu -->
                    <div class="nav-item-wrapper">
                        <button class="nav-btn" data-tab="drawing" id="btn-nav-drawing">
                            <i data-lucide="image"></i>
                            <span>Drawing EJO</span>
                            <span class="drawing-chevron-toggle"
                                style="margin-left: auto; display: flex; align-items: center; padding: 2px;">
                                <i data-lucide="chevron-down" class="drawing-chevron"
                                    style="width: 16px; height: 16px; transition: transform 0.2s;"></i>
                            </span>
                        </button>
                        <div class="sidebar-submenu submenu" id="drawing-submenu">
                            <button class="nav-btn sub-btn" data-tab="drawing" data-drawing-phase="1">
                                <i data-lucide="calendar"></i>
                                <span>Schedule</span>
                            </button>
                            <button class="nav-btn sub-btn" data-tab="drawing" data-drawing-phase="2">
                                <i data-lucide="play-circle"></i>
                                <span>On Progress</span>
                            </button>
                            <button class="nav-btn sub-btn" data-tab="drawing" data-drawing-phase="3">
                                <i data-lucide="check-circle-2"></i>
                                <span>Done</span>
                            </button>
                        </div>
                    </div>

                    <!-- Project Menu & Submenu -->
                    <div class="nav-item-wrapper">
                        <button class="nav-btn" data-tab="projects" id="btn-nav-projects">
                            <i data-lucide="milestone"></i>
                            <span>Project</span>
                            <span class="projects-chevron-toggle"
                                style="margin-left: auto; display: flex; align-items: center; padding: 2px;">
                                <i data-lucide="chevron-down" class="nested-chevron"
                                    style="width: 16px; height: 16px; transition: transform 0.2s;"></i>
                            </span>
                        </button>
                        <div class="sidebar-submenu submenu" id="projects-submenu">
                            <button class="nav-btn sub-btn" data-tab="projects" data-phase="1">
                                <i data-lucide="lightbulb"></i>
                                <span>Fase 1: Inisialisasi</span>
                            </button>
                            <button class="nav-btn sub-btn" data-tab="projects" data-phase="2">
                                <i data-lucide="shopping-cart"></i>
                                <span>Fase 2: Pengadaan</span>
                            </button>
                            <button class="nav-btn sub-btn" data-tab="projects" data-phase="3">
                                <i data-lucide="play"></i>
                                <span>Fase 3: Eksekusi</span>
                            </button>
                            <button class="nav-btn sub-btn" data-tab="projects" data-phase="4">
                                <i data-lucide="check-square"></i>
                                <span>Fase 4: Commissioning & Serah Terima</span>
                            </button>
                        </div>
                    </div>

                    <!-- Galeri Drawing Menu -->
                    <div class="nav-item-wrapper">
                        <button class="nav-btn" data-tab="drawing-gallery" id="btn-nav-drawing-gallery">
                            <i data-lucide="gallery-thumbnails"></i>
                            <span>Galeri Drawing</span>
                        </button>
                        <div class="sidebar-submenu submenu" id="drawing-gallery-submenu" style="display: none !important;">
                            <button class="nav-btn sub-btn" data-tab="drawing-gallery" data-gallery-category="sipil" style="display: none !important;">
                                <i data-lucide="building-2"></i>
                                <span>Drawing Sipil</span>
                            </button>
                            <button class="nav-btn sub-btn" data-tab="drawing-gallery" data-gallery-category="mekanik" style="display: none !important;">
                                <i data-lucide="wrench"></i>
                                <span>Drawing Mekanik</span>
                            </button>
                            <button class="nav-btn sub-btn" data-tab="partlist-gallery" id="btn-nav-partlist-gallery" style="display: none !important;">
                                <i data-lucide="images"></i>
                                <span>Galeri Spare Part</span>
                            </button>
                        </div>
                    </div>

                    <!-- ponytail: menu for Dashboard Part -->
                    <button class="nav-btn" data-tab="partlist" style="display: none;">
                        <i data-lucide="wrench"></i>
                        <span>Dashboard Part</span>
                    </button>
                    <!-- History EJO Menu & Submenu -->
                    <div class="nav-item-wrapper">
                        <button class="nav-btn" data-tab="history" id="btn-nav-history">
                            <i data-lucide="archive"></i>
                            <span>History EJO</span>
                            <span class="history-chevron-toggle"
                                style="margin-left: auto; display: flex; align-items: center; padding: 2px;">
                                <i data-lucide="chevron-down" class="history-chevron"
                                    style="width: 16px; height: 16px; transition: transform 0.2s;"></i>
                            </span>
                        </button>
                        <div class="sidebar-submenu submenu" id="history-submenu">
                            <button class="nav-btn sub-btn" data-tab="history" data-history-type="general-ejo">
                                <i data-lucide="file-text"></i>
                                <span>General EJO</span>
                            </button>
                            <button class="nav-btn sub-btn" data-tab="history" data-history-type="repair-part">
                                <i data-lucide="wrench"></i>
                                <span>History Repair Part</span>
                            </button>
                            <button class="nav-btn sub-btn" data-tab="history" data-history-type="drawing">
                                <i data-lucide="image"></i>
                                <span>Drawing EJO</span>
                            </button>
                            <button class="nav-btn sub-btn" data-tab="history" data-history-type="project">
                                <i data-lucide="folder-kanban"></i>
                                <span>Project Monitoring</span>
                            </button>
                        </div>
                    </div>

                    <button class="nav-btn" data-tab="admin" id="nav-admin-btn" style="display: none;">
                        <i data-lucide="shield-alert"></i>
                        <span>Admin Panel</span>
                    </button>
                    <!-- Server Access Management Menu & Submenu -->
                    <div class="nav-item-wrapper" id="nav-server-access-wrapper" style="display: none;">
                        <button class="nav-btn" data-tab="server-access" id="btn-nav-server-access">
                            <i data-lucide="user-cog"></i>
                            <span>Manajemen Akses Akun</span>
                            <span class="server-access-chevron-toggle"
                                style="margin-left: auto; display: flex; align-items: center; padding: 2px;">
                                <i data-lucide="chevron-down" class="server-access-chevron"
                                    style="width: 16px; height: 16px; transition: transform 0.2s;"></i>
                            </span>
                        </button>
                        <div class="sidebar-submenu submenu" id="server-access-submenu">
                            <button class="nav-btn sub-btn" data-tab="server-dashboard-access">
                                <i data-lucide="layout-dashboard"></i>
                                <span>Dashboard</span>
                            </button>
                            <button class="nav-btn sub-btn" data-tab="server-access" data-server-view="role">
                                <i data-lucide="shield"></i>
                                <span>Matriks Role & Dept</span>
                            </button>
                            <button class="nav-btn sub-btn" data-tab="server-access" data-server-view="user">
                                <i data-lucide="users"></i>
                                <span>Per Akun Personel</span>
                            </button>

                            <!-- Nested Dropdown Submenu: Flowchart Tanda Tangan -->
                            <div class="nav-item-wrapper" style="margin-top: 4px;">
                                <button class="nav-btn sub-btn" id="btn-nav-flowchart"
                                    style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <i data-lucide="git-merge"></i>
                                        <span>Flowchart Tanda Tangan</span>
                                    </div>
                                    <span class="flowchart-chevron-toggle"
                                        style="display: flex; align-items: center; padding: 2px;">
                                        <i data-lucide="chevron-down" class="flowchart-chevron"
                                            style="width: 14px; height: 14px; transition: transform 0.2s;"></i>
                                    </span>
                                </button>
                                <div class="sidebar-submenu submenu" id="flowchart-submenu">
                                    <button class="nav-btn sub-btn" data-tab="server-access"
                                        data-server-view="flow-gejo" style="padding-left: 24px;">
                                        <i data-lucide="file-text"></i>
                                        <span>General EJO</span>
                                    </button>
                                    <button class="nav-btn sub-btn" data-tab="server-access"
                                        data-server-view="flow-drawing" style="padding-left: 24px;">
                                        <i data-lucide="image"></i>
                                        <span>Drawing EJO</span>
                                    </button>
                                    <button class="nav-btn sub-btn" data-tab="server-access"
                                        data-server-view="flow-project" style="padding-left: 24px;">
                                        <i data-lucide="folder-kanban"></i>
                                        <span>Project</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <button class="nav-scroll-arrow right" id="nav-scroll-right" aria-label="Scroll Right"
                    style="display: none;">
                    <i data-lucide="chevron-right"></i>
                </button>
            </div>

            <div class="sidebar-footer">
                <div class="user-profile"
                    style="position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;"
                        id="sidebar-user-profile-trigger" title="Buka Pengaturan Profil">
                        <div class="avatar-wrapper"
                            style="position: relative; width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 1px solid var(--card-border);">
                            <img src="" alt="Avatar" class="avatar" id="sidebar-avatar"
                                style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="user-info">
                            <h4 id="sidebar-fullname">Nama User</h4>
                            <span id="sidebar-role" style="font-size:0.7rem; color:var(--text-secondary);">Role</span>
                        </div>
                    </div>
                    <button class="btn-logout" id="btn-logout" title="Keluar dari Akun"
                        style="background: none; border: none; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: var(--border-radius-sm); transition: var(--transition-smooth);">
                        <i data-lucide="log-out" style="width: 18px; height: 18px;"></i>
                    </button>
                </div>
            </div>
        </aside>

        <!-- Main Workspace -->
        <main class="main-content">

            <!-- Top Navigation / Header -->
            <header class="app-header">
                <div class="header-left" style="display: flex; align-items: center; gap: 15px;">
                    <button class="notification-btn cursor-pointer" id="btn-sidebar-toggle"
                        title="Sembunyikan/Tampilkan Sidebar">
                        <i data-lucide="menu"></i>
                    </button>
                    <div>
                        <h2 id="page-title" style="margin: 0;">Dashboard</h2>
                    </div>
                </div>
                <div class="header-right">
                    <div class="time-widget card-glass">
                        <i data-lucide="clock"></i>
                        <span id="live-clock">23 Jun 2026, 09:30 WIB</span>
                    </div>
                    <button class="notification-btn cursor-pointer" id="btn-fullscreen-toggle" title="Layar Penuh">
                        <i data-lucide="maximize" id="fullscreen-icon"></i>
                    </button>
                    <button class="notification-btn cursor-pointer" id="btn-theme-toggle" title="Ganti Tema">
                        <i data-lucide="moon" id="theme-icon"></i>
                    </button>
                    <div class="notification-btn cursor-pointer" id="notify-trigger" title="Notifikasi">
                        <i data-lucide="bell"></i>
                        <span class="badge badge-pulse">2</span>
                    </div>
                </div>
            </header>

            <!-- Content Workspace Dynamic Tabs -->
            <div class="workspace-body">

                <!-- TAB 1: OVERVIEW -->
                <section id="tab-overview" class="tab-pane active">
                    <!-- KPI Scorecards Grid -->
                    <div class="kpi-grid">
                        <div class="kpi-card card-glass glow-blue" id="kpi-card-total">
                            <div class="kpi-icon icon-blue">
                                <i data-lucide="file-text"></i>
                            </div>
                            <div class="kpi-data">
                                <span class="kpi-label">Total EJO</span>
                                <h3 class="kpi-value" id="kpi-total">--</h3>
                                <span class="kpi-trend text-blue" id="kpi-total-sub"><i data-lucide="trending-up"></i>
                                    +12% bulan ini</span> <!-- ponytail: added id -->
                            </div>
                        </div>
                        <div class="kpi-card card-glass glow-yellow" id="kpi-card-pending">
                            <div class="kpi-icon icon-yellow">
                                <i data-lucide="clock-alert"></i>
                            </div>
                            <div class="kpi-data">
                                <span class="kpi-label">Pending</span>
                                <h3 class="kpi-value" id="kpi-pending">--</h3>
                                <span class="kpi-trend text-yellow" id="kpi-pending-sub">Butuh Approval</span>
                            </div>
                        </div>
                        <div class="kpi-card card-glass glow-cyan" id="kpi-card-progress">
                            <div class="kpi-icon icon-cyan">
                                <i data-lucide="loader"></i>
                            </div>
                            <div class="kpi-data">
                                <span class="kpi-label">On Progress</span>
                                <h3 class="kpi-value" id="kpi-progress">--</h3>
                                <span class="kpi-trend text-cyan" id="kpi-progress-sub">In Progress</span>
                                <!-- ponytail: added id -->
                            </div>
                        </div>
                        <div class="kpi-card card-glass glow-green" id="kpi-card-completed">
                            <div class="kpi-icon icon-green">
                                <i data-lucide="check-circle2"></i>
                            </div>
                            <div class="kpi-data">
                                <span class="kpi-label">Selesai Bulan Ini</span>
                                <h3 class="kpi-value" id="kpi-completed">--</h3>
                                <span class="kpi-trend text-green" id="kpi-completed-sub"><i
                                        data-lucide="trending-up"></i> 94.2% Success Rate</span>
                                <!-- ponytail: added id -->
                            </div>
                        </div>
                    </div>

                    <!-- Overview Main Area Split (Left: Charts & KPI Cards, Right: Vertical Activity Log for ENG Dept) -->
                    <div class="overview-split-layout" id="overview-split-layout">
                        <div class="overview-main-col">
                            <!-- Chart Area 1: Status & Trend (Moved above dashboard-summary-grid) -->
                            <div class="chart-card card-glass" id="card-trend-chart" style="margin-bottom: 1.5rem;">
                                <div class="card-header">
                                    <div class="card-header-left">
                                        <div class="card-icon-wrap card-icon-cyan">
                                            <i data-lucide="bar-chart-3"></i>
                                        </div>
                                        <div>
                                            <h3>Tren EJO <span id="tv-val-period" class="tv-period-inline">- Tahun Ini (Semua Kategori)</span></h3>
                                        </div>
                                    </div>
                                    <div class="card-actions">
                                        <!-- ponytail: Filter Kategori Kerja & Drawing trend chart -->
                                        <select id="trend-category-filter" class="chart-time-filter" title="Filter Kategori">
                                            <option value="all">Semua Kategori</option>
                                            <option value="Sipil">Sipil</option>
                                            <option value="Elektrik">Elektrik</option>
                                            <option value="Kalibrasi">Kalibrasi</option>
                                            <option value="Mekanik">Mekanik</option>
                                            <option value="Program">Program</option>
                                            <option value="Repair Part">Repair Part</option>
                                            <option value="Drawing">Drawing</option>
                                        </select>
                                        <!-- ponytail: Filter rentang waktu trend chart -->
                                        <select id="trend-time-filter" class="chart-time-filter">
                                            <option value="week">Minggu Ini</option>
                                            <option value="month" selected>Bulan Ini</option>
                                            <option value="year">Tahun Ini</option>
                                        </select>
                                        <span class="badge badge-accent badge-live">Live Chart</span>
                                    </div>
                                </div>
                                <!-- ponytail: TradingView-style interactive real-time data tracker -->
                                <div class="trend-tv-tracker" id="trend-tv-tracker">
                                    <div class="tv-item tv-masuk">
                                        <span class="tv-dot tv-dot-red"></span>
                                        <span>Masuk:</span>
                                        <strong id="tv-val-masuk">--</strong>
                                    </div>
                                    <div class="tv-item tv-selesai">
                                        <span class="tv-dot tv-dot-green"></span>
                                        <span>Selesai:</span>
                                        <strong id="tv-val-selesai">--</strong>
                                    </div>
                                    <div class="tv-item tv-batal">
                                        <span class="tv-dot tv-dot-darkgreen"></span>
                                        <span>Dibatalkan:</span>
                                        <strong id="tv-val-batal">--</strong>
                                    </div>
                                    <div class="tv-item tv-os">
                                        <span class="tv-dot tv-dot-orange"></span>
                                        <span>OS:</span>
                                        <strong id="tv-val-os">--</strong>
                                    </div>
                                </div>
                                <div class="card-body chart-container">
                                    <canvas id="trendChart"></canvas>
                                </div>
                            </div>

                            <!-- Second row of KPI scorecards (General EJO & Drawing summaries) -->
                            <div class="dashboard-summary-grid">
                                <!-- General EJO Summary Card -->
                                <div class="kpi-card card-glass glow-cyan dashboard-summary-card" id="overview-card-gejo"
                                    onclick="switchTab('general-ejo')">
                                    <div class="summary-card-header">
                                        <div style="display: flex; align-items: center; gap: 12px;">
                                            <div class="kpi-icon icon-cyan">
                                                <i data-lucide="layers"></i>
                                            </div>
                                            <div>
                                                <h4
                                                    style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">
                                                    GENERAL EJO</h4>
                                            </div>
                                        </div>
                                        <span class="kpi-trend text-cyan" id="overview-gejo-limit">
                                            <i data-lucide="shield-alert"></i> Limit: -
                                        </span>
                                    </div>
                                    <div class="summary-card-body">
                                        <div
                                            style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%;">
                                            <!-- Left Column: Total EJO -->
                                            <div
                                                style="display: flex; flex-direction: column; align-items: flex-start; gap: 4px;">
                                                <span class="total-label"
                                                    style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.75px; color: var(--text-secondary);">Total
                                                    EJO</span>
                                                <span id="overview-gejo-active" class="kpi-value"
                                                    style="margin: 0; line-height: 1; font-size: 2rem; font-weight: 850; color: var(--text-primary);">--</span>
                                            </div>
                                            <!-- Right Column: KPI Target & Terealisasi (Stacked) -->
                                            <div id="overview-gejo-kpi-container"
                                                style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
                                                <!-- KPI Target -->
                                                <div
                                                    style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                                                    <span class="total-label"
                                                        style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.75px; color: var(--text-secondary);">
                                                        KPI Target
                                                        <button class="btn" id="overview-gejo-kpi-edit-btn"
                                                            style="display: none; background: none; border: none; color: var(--color-cyan); cursor: pointer; padding: 0; display: inline-flex; align-items: center;"
                                                            onclick="event.stopPropagation(); openKpiEditModal('gejo', 'target');">
                                                            <i data-lucide="edit-2" style="width: 10px; height: 10px;"></i>
                                                        </button>
                                                    </span>
                                                    <span id="overview-gejo-kpi-val" class="kpi-value"
                                                        style="color: var(--color-cyan); margin: 0; line-height: 1; font-size: 1.4rem; font-weight: 850;">0%</span>
                                                </div>
                                                <!-- KPI Terealisasi -->
                                                <div
                                                    style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                                                    <span class="total-label"
                                                        style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.75px; color: var(--text-secondary);">
                                                        KPI Terealisasi
                                                        <button class="btn" id="overview-gejo-kpi-realisasi-edit-btn"
                                                            style="display: none; background: none; border: none; color: var(--color-cyan); cursor: pointer; padding: 0; display: inline-flex; align-items: center;"
                                                            onclick="event.stopPropagation(); openKpiEditModal('gejo', 'realisasi');">
                                                            <i data-lucide="edit-2" style="width: 10px; height: 10px;"></i>
                                                        </button>
                                                    </span>
                                                    <span id="overview-gejo-kpi-realisasi-val" class="kpi-value"
                                                        style="color: var(--color-cyan); margin: 0; line-height: 1; font-size: 1.4rem; font-weight: 850;">0%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="summary-card-footer" id="overview-gejo-breakdown">
                                        <!-- populated dynamically -->
                                    </div>
                                </div>

                                <!-- Drawing Summary Card -->
                                <div class="kpi-card card-glass glow-blue dashboard-summary-card" id="overview-card-drawing"
                                    onclick="switchTab('drawing')">
                                    <div class="summary-card-header">
                                        <div style="display: flex; align-items: center; gap: 12px;">
                                            <div class="kpi-icon icon-blue">
                                                <i data-lucide="image"></i>
                                            </div>
                                            <div>
                                                <h4
                                                    style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">
                                                    DRAWING EJO</h4>
                                            </div>
                                        </div>
                                        <span class="kpi-trend text-blue" id="overview-drawing-limit">
                                            <i data-lucide="shield-alert"></i> Limit: -
                                        </span>
                                    </div>
                                    <div class="summary-card-body">
                                        <div
                                            style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%;">
                                            <!-- Left Column: Total Drawing -->
                                            <div
                                                style="display: flex; flex-direction: column; align-items: flex-start; gap: 4px;">
                                                <span class="total-label"
                                                    style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.75px; color: var(--text-secondary);">Total
                                                    Drawing</span>
                                                <span id="overview-drawing-active" class="kpi-value"
                                                    style="margin: 0; line-height: 1; font-size: 2rem; font-weight: 850; color: var(--text-primary);">--</span>
                                            </div>
                                            <!-- Right Column: KPI Target & Terealisasi (Stacked) -->
                                            <div id="overview-drawing-kpi-container"
                                                style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
                                                <!-- KPI Target -->
                                                <div
                                                    style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                                                    <span class="total-label"
                                                        style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.75px; color: var(--text-secondary);">
                                                        KPI Target
                                                        <button class="btn" id="overview-drawing-kpi-edit-btn"
                                                            style="display: none; background: none; border: none; color: var(--color-blue); cursor: pointer; padding: 0; display: inline-flex; align-items: center;"
                                                            onclick="event.stopPropagation(); openKpiEditModal('drawing', 'target');">
                                                            <i data-lucide="edit-2" style="width: 10px; height: 10px;"></i>
                                                        </button>
                                                    </span>
                                                    <span id="overview-drawing-kpi-val" class="kpi-value"
                                                        style="color: var(--color-blue); margin: 0; line-height: 1; font-size: 1.4rem; font-weight: 850;">0%</span>
                                                </div>
                                                <!-- KPI Terealisasi -->
                                                <div
                                                    style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                                                    <span class="total-label"
                                                        style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.75px; color: var(--text-secondary);">
                                                        KPI Terealisasi
                                                        <button class="btn" id="overview-drawing-kpi-realisasi-edit-btn"
                                                            style="display: none; background: none; border: none; color: var(--color-blue); cursor: pointer; padding: 0; display: inline-flex; align-items: center;"
                                                            onclick="event.stopPropagation(); openKpiEditModal('drawing', 'realisasi');">
                                                            <i data-lucide="edit-2" style="width: 10px; height: 10px;"></i>
                                                        </button>
                                                    </span>
                                                    <span id="overview-drawing-kpi-realisasi-val" class="kpi-value"
                                                        style="color: var(--color-blue); margin: 0; line-height: 1; font-size: 1.4rem; font-weight: 850;">0%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="summary-card-footer" id="overview-drawing-breakdown">
                                        <!-- populated dynamically -->
                                    </div>
                                </div>
                            </div>

                            <!-- Layout: Analytics & Alerts Grid (Status Proportion) -->
                            <div class="analytics-layout-grid" id="overview-charts-grid" style="grid-template-columns: 1fr; margin-bottom: 0;">
                                <!-- Chart Area 2: Status Distribution -->
                                <div class="chart-card card-glass" id="card-status-prop">
                                    <div class="card-header">
                                        <div class="card-header-left">
                                            <div class="card-icon-wrap card-icon-purple">
                                                <i data-lucide="pie-chart"></i>
                                            </div>
                                            <div>
                                                <h3>Proporsi Status EJO</h3>
                                                <p class="text-secondary text-xs">Distribusi penanganan order saat ini.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body chart-container doughnut-wrap">
                                        <canvas id="statusChart"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Dedicated Vertical Activity Log for ENG Dept -->
                        <div class="overview-activity-col" id="overview-eng-activity-panel">
                            <div class="list-card card-glass eng-activity-card">
                                <div class="card-header" style="margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--card-border);">
                                    <div class="card-header-left" style="gap: 10px;">
                                        <div class="card-icon-wrap card-icon-cyan" style="width: 34px; height: 34px; border-radius: 8px;">
                                            <i data-lucide="activity" style="width: 18px; height: 18px;"></i>
                                        </div>
                                        <div>
                                            <h3 style="font-size: 0.98rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
                                                Log Aktivitas Engineer
                                                <span class="badge badge-accent badge-live" style="font-size: 0.65rem; padding: 2px 6px;">Live</span>
                                            </h3>
                                            <p class="text-secondary text-xs" style="margin: 2px 0 0 0; font-size: 0.72rem;">Rekap interaksi & pembaruan teknisi realtime</p>
                                        </div>
                                    </div>
                                    <div class="card-actions">
                                        <span class="badge" id="eng-activity-total-badge" style="background: rgba(6, 182, 212, 0.12); color: var(--color-cyan); font-size: 0.72rem; font-weight: 600; padding: 3px 8px; border-radius: 12px; border: 1px solid rgba(6, 182, 212, 0.25);">0 Log</span>
                                    </div>
                                </div>
                                <div class="card-body eng-activity-scroll-body" id="overview-eng-activity-list">
                                    <!-- Dynamic chat-like feed of engineer activities -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Section: Department Load & Category Load -->
                    <div class="analytics-layout-grid grid-main-bottom" id="overview-bottom-grid"
                        style="margin-top: 1.5rem;">
                        <!-- Department Load Chart -->
                        <div class="chart-card card-glass" id="card-dept-chart">
                            <div class="card-header">
                                <div class="card-header-left">
                                    <div class="card-icon-wrap card-icon-blue">
                                        <i data-lucide="building-2"></i>
                                    </div>
                                    <div>
                                        <h3>EJO Departemen</h3>
                                    </div>
                                </div>
                                <div class="card-actions">
                                    <span class="badge badge-accent badge-live">Live Chart</span>
                                </div>
                            </div>
                            <div class="card-body chart-container">
                                <canvas id="deptChart"></canvas>
                            </div>
                        </div>

                        <!-- Category Load Chart -->
                        <div class="chart-card card-glass" id="card-category-chart">
                            <div class="card-header">
                                <div class="card-header-left">
                                    <div class="card-icon-wrap card-icon-purple">
                                        <i data-lucide="layers"></i>
                                    </div>
                                    <div>
                                        <h3>EJO Kategori Kerja</h3>
                                    </div>
                                </div>
                                <div class="card-actions">
                                    <span class="badge badge-accent badge-live">Live Chart</span>
                                </div>
                            </div>
                            <div class="card-body chart-container">
                                <canvas id="categoryChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- EJO URGENT! Standalone Full-Width Card -->
                    <div class="list-card card-glass urgent-card" style="margin-top: 1.5rem; width: 100%;">
                        <div class="card-header">
                            <div class="urgent-header-left">
                                <div class="urgent-icon-wrap">
                                    <i data-lucide="alert-triangle"></i>
                                </div>
                                <div>
                                    <h3 class="urgent-title">EJO URGENT! <span class="urgent-pulse-dot"
                                            id="urgent-pulse-dot"></span></h3>
                                </div>
                            </div>
                            <span class="badge urgent-count-badge" id="urgent-count-badge"
                                style="display:none;">0</span>
                        </div>
                        <div class="card-body text-scroll">
                            <div class="recent-list" id="critical-ejo-list">
                                <!-- Dynamic list of critical EJOs -->
                            </div>
                        </div>
                    </div>
                </section>



                <!-- TAB: GENERAL EJO (ALL STATUS) -->
                <section id="tab-general-ejo" class="tab-pane">
                    <!-- Control Bar (Filter, Search, Sort) -->
                    <div class="control-bar card-glass">
                        <div class="search-wrapper">
                            <i data-lucide="search"></i>
                            <input type="text" id="gejo-search-input"
                                placeholder="Cari Kode EJO, Judul, Mesin atau Engineer...">
                        </div>

                        <div class="filters-wrapper">
                            <div class="filter-group" style="display: none;">
                                <label for="gejo-filter-status">Status</label>
                                <select id="gejo-filter-status">
                                    <option value="all">Semua Status</option>
                                    <option value="Waiting Dept Approval">Waiting Dept Approval (Persetujuan Dept)
                                    </option>
                                    <option value="Requested">Requested (Menunggu)</option>
                                    <option value="Checking">Checking</option>
                                    <option value="In Progress">In Progress (Berjalan)</option>
                                    <option value="Pending Approval">Pending Approval (Menunggu Verifikasi)</option>
                                    <option value="Pending My Approval">Menunggu Persetujuan Saya</option>
                                    <option value="Completed">Completed (Selesai)</option>
                                    <option value="Cancelled">Cancelled (Batal)</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label for="gejo-filter-priority">Prioritas</label>
                                <select id="gejo-filter-priority">
                                    <option value="all">Semua Prioritas</option>
                                    <option value="1">1 - High (Urgent / Emergency)</option>
                                    <option value="2">2 - Medium (Normal)</option>
                                    <option value="3">3 - Rutin (Tidak Mendesak)</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label for="gejo-filter-dept">Departemen</label>
                                <select id="gejo-filter-dept">
                                    <option value="all">Semua Dept</option>
                                    <option value="PRD">PRD (Production)</option>
                                    <option value="ENG">ENG (Engineering)</option>
                                    <option value="EPR">EPR (Engineering Produksi)</option>
                                    <option value="GA">GA (General Affair)</option>
                                    <option value="QC">QC (Quality Control)</option>
                                    <option value="WRH">WRH (Warehouse)</option>
                                    <option value="TMB">TMB (Timbangan)</option>
                                    <option value="EUT">EUT (Engineer Utility)</option>
                                </select>
                            </div>

                            <!-- ponytail: filter kategori teknik baru (paralel dengan tab job-orders) -->
                            <div class="filter-group">
                                <label for="gejo-filter-category">Kategori</label>
                                <select id="gejo-filter-category">
                                    <option value="all">Semua Kategori</option>
                                    <option value="Sipil">Sipil</option>
                                    <option value="Elektrik">Elektrik</option>
                                    <option value="Kalibrasi">Kalibrasi</option>
                                    <option value="Mekanik">Mekanik</option>
                                    <option value="Program">Program</option>
                                    <!-- ponytail: added repair part option -->
                                    <option value="Repair Part">Repair Part</option>
                                </select>
                            </div>

                            <!-- ponytail: filter rentang tanggal (dari & sampai tanggal) dengan ikon calendar -->
                            <div class="filter-group filter-group-date-range">
                                <label for="gejo-filter-start-date"
                                    style="display: inline-flex; align-items: center; gap: 5px; font-weight: 500;">
                                    <i data-lucide="calendar"
                                        style="width: 14px; height: 14px; color: var(--color-cyan, #22d3ee);"></i>
                                    Rentang Tanggal
                                </label>
                                <div class="date-range-row" style="display: flex; align-items: center; gap: 6px;">
                                    <input type="date" id="gejo-filter-start-date" class="form-control date-range-input"
                                        title="Dari Tanggal">
                                    <span class="date-separator"
                                        style="color: var(--text-secondary, #94a3b8); font-size: 0.75rem; font-weight: 600; flex-shrink: 0;">s/d</span>
                                    <input type="date" id="gejo-filter-end-date" class="form-control date-range-input"
                                        title="Sampai Tanggal">
                                </div>
                            </div>
                        </div>

                        <div id="gejo-limit-container" style="display: none; align-items: center; gap: 12px;">
                            <span id="gejo-limit-info"
                                style="font-size:0.75rem; font-weight: 500; display:inline-flex; align-items:center; gap:4px; padding: 6px 12px; border-radius: 99px; background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.3); color: #22d3ee;">
                                <i data-lucide="shield-alert" style="width:13px; height:13px;"></i> Limit EJO: 2 /
                                Kategori
                            </span>
                            <button class="btn btn-primary" id="gejo-btn-quick-new">
                                <i data-lucide="plus"></i> EJO Baru
                            </button>
                        </div>
                    </div>

                    <!-- EJO Results Summary -->
                    <div class="results-meta">
                        <span id="gejo-results-count" class="text-secondary">Ditemukan 0 Job Order</span>
                        <div class="view-toggles">
                            <button class="btn-toggle active" id="gejo-view-grid-btn" title="Grid View">
                                <i data-lucide="layout-grid"></i>
                            </button>
                            <button class="btn-toggle" id="gejo-view-table-btn" title="Table View">
                                <i data-lucide="list"></i>
                            </button>
                        </div>
                    </div>

                    <!-- ponytail: Form Buat General EJO (collapsible, pakai form EJO reguler) -->
                    <div id="gejo-form-container" class="card-glass"
                        style="display: none; padding: 1.5rem; margin-bottom: 1.5rem;">
                        <h4
                            style="margin-bottom: 1.25rem; border-bottom: 1px solid var(--card-border); padding-bottom: 8px;">
                            Buat General EJO (Pengerjaan Langsung)</h4>
                        <form id="gejo-form">
                            <div class="form-grid">
                                <div class="form-field full-width">
                                    <label for="gejo-form-title">Judul Pekerjaan <span class="required">*</span></label>
                                    <input type="text" id="gejo-form-title"
                                        placeholder="Contoh: Pemasangan Lampu LED Area Gudang B3" required>
                                </div>
                                <div class="form-field">
                                    <label for="gejo-form-category">Kategori Pekerjaan <span
                                            class="required">*</span></label>
                                    <select id="gejo-form-category" required>
                                        <option value="" disabled selected>Pilih Kategori</option>
                                        <option value="Sipil">Sipil</option>
                                        <option value="Elektrik">Elektrik</option>
                                        <option value="Kalibrasi">Kalibrasi</option>
                                        <option value="Mekanik">Mekanik</option>
                                        <option value="Program">Program</option>
                                        <!-- ponytail: added repair part option -->
                                        <option value="Repair Part">Repair Part</option>
                                    </select>
                                    <div id="gejo-form-category-limit-notice"
                                        style="margin-top: 6px; font-size: 0.78rem; font-weight: 500; display: none;">
                                    </div>
                                </div>
                                <div class="form-field">
                                    <label for="gejo-form-priority">Prioritas <span class="required">*</span></label>
                                    <select id="gejo-form-priority" required>
                                        <option value="1">1 - High (Urgent / Line Stop / Bahaya HSE / PEST)</option>
                                        <option value="2">2 - Medium (Normal Kerja)</option>
                                        <option value="3" selected>3 - Rutin (Rutin / Tidak Mendesak)</option>
                                    </select>
                                </div>
                                <div class="form-field full-width" id="gejo-urgent-reason-display"
                                    style="display: none;">
                                    <label for="gejo-urgent-reason-text"
                                        style="color: var(--color-rose); display: flex; align-items: center; gap: 6px; font-weight: 600;">
                                        <i data-lucide="alert-triangle" style="width: 15px; height: 15px;"></i> Alasan
                                        Urgent <span
                                            style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal; margin-left: auto;">(Read
                                            Only)</span>
                                    </label>
                                    <textarea id="gejo-urgent-reason-text" rows="2" readonly
                                        style="background: rgba(244, 63, 94, 0.05); border-color: rgba(244, 63, 94, 0.3); color: var(--text-primary); cursor: not-allowed; resize: none;"></textarea>
                                </div>
                                <div class="form-field">
                                    <label for="gejo-form-target-date">Target Selesai <span
                                            style="font-size: 0.75rem; color: var(--color-amber, #f59e0b); font-weight: 500;">(Menyesuaikan Jadwal Engineer)</span></label>
                                    <input type="date" id="gejo-form-target-date">
                                </div>
                                <div class="form-field">
                                    <label for="gejo-form-location">Lokasi <span class="required">*</span></label>
                                    <input type="text" id="gejo-form-location"
                                        placeholder="Contoh: Area gudang, Koridor Lt 1" required>
                                </div>
                                <div class="form-field" style="display: none;">
                                    <label for="gejo-form-dept">Departemen Pemohon <span
                                            class="required">*</span></label>
                                    <select id="gejo-form-dept">
                                        <option value="" disabled selected>Pilih Departemen</option>
                                        <option value="PRD">PRD (Production)</option>
                                        <option value="ENG">ENG (Engineering)</option>
                                        <option value="EPR">EPR (Engineering Produksi)</option>
                                        <option value="GA">GA (General Affair)</option>
                                        <option value="QC">QC (Quality Control)</option>
                                        <option value="WRH">WRH (Warehouse)</option>
                                        <option value="TMB">TMB (Timbangan)</option>
                                    <option value="EUT">EUT (Engineer Utility)</option>
                                    </select>
                                </div>

                                <div class="form-field full-width gejo-repair-field" style="display: none;">
                                    <label for="gejo-form-wsp-search">Autodetect WSP Master Material <span
                                            style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">(Cari
                                            Material WSP Master)</span></label>
                                    <input type="text" id="gejo-form-wsp-search" list="gejo-wsp-datalist"
                                        placeholder="Ketik Kode Material atau Deskripsi WSP...">
                                    <datalist id="gejo-wsp-datalist"></datalist>
                                    <span id="gejo-wsp-status-info"
                                        style="font-size: 0.75rem; color: var(--color-cyan); margin-top: 4px; display: block;"></span>
                                </div>
                                <div class="form-field gejo-repair-field" style="display: none;">
                                    <label for="gejo-form-price-new">Harga by SAP <span
                                            class="required">*</span></label>
                                    <input type="number" id="gejo-form-price-new" min="0" placeholder="Contoh: 1000000">
                                </div>
                                <div class="form-field gejo-repair-field" style="display: none;">
                                    <label for="gejo-form-quantity">Jumlah Quantity Barang <span
                                            class="required">*</span></label>
                                    <input type="number" id="gejo-form-quantity" min="0" value="1"
                                        placeholder="Contoh: 1">
                                </div>
                                <div class="form-field gejo-repair-field" style="display: none;">
                                    <label for="gejo-form-qty-needed">Quantity yang Diperlukan Mesin <span
                                            class="required">*</span></label>
                                    <input type="number" id="gejo-form-qty-needed" min="0" value="0" placeholder="0">
                                </div>
                                <div class="form-field gejo-repair-field" style="display: none;">
                                    <label for="gejo-form-qty-stock">Quantity Stok (Hasil Pengurangan / Target
                                        Stok)</label>
                                    <input type="number" id="gejo-form-qty-stock" min="0" value="0" placeholder="0">
                                </div>
                                <div class="form-field" style="display: none;">
                                    <label for="gejo-form-cost-per-day">Biaya Orang / Hari (Rp) <span
                                            class="required">*</span></label>
                                    <input type="number" id="gejo-form-cost-per-day" min="0"
                                        placeholder="Contoh: 100000">
                                </div>
                                <div class="form-field full-width">
                                    <label for="gejo-form-description">Detail Pekerjaan <span
                                            class="required">*</span></label>
                                    <textarea id="gejo-form-description" rows="4"
                                        placeholder="Jelaskan pekerjaan yang akan dilakukan..." required></textarea>
                                </div>
                                <!-- ponytail: file upload untuk foto before kondisi awal (wajib - premium style) -->
                                <div class="form-field full-width" id="gejo-file-before-container">
                                    <label>Foto Before<span class="required">*</span></label>
                                    <div style="width: 100%; position: relative;">
                                        <input type="file" id="gejo-file-before" accept="image/*,.pdf"
                                            style="display: none;" />
                                        <div id="gejo-file-before-trigger"
                                            style="border: 2px dashed rgba(56, 189, 248, 0.3); border-radius: var(--border-radius-sm); padding: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; background: rgba(56, 189, 248, 0.02); transition: all 0.2s ease-in-out; box-sizing: border-box;"
                                            onmouseover="this.style.background='rgba(56, 189, 248, 0.06)'; this.style.borderColor='var(--color-blue)';"
                                            onmouseout="this.style.background='rgba(56, 189, 248, 0.02)'; this.style.borderColor='rgba(56, 189, 248, 0.3)';">
                                            <i data-lucide="camera"
                                                style="width: 24px; height: 24px; color: var(--color-blue);"></i>
                                            <span id="gejo-file-before-filename"
                                                style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; word-break: break-all; font-weight: 500;">Upload/take Foto</span>
                                        </div>
                                    </div>
                                    <div id="gejo-file-before-preview"
                                        style="display: none; width: 100%; max-height: 140px; overflow: hidden; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); margin-top: 4px; box-sizing: border-box; background: rgba(0,0,0,0.1); align-items: center; justify-content: center;">
                                        <img id="gejo-file-before-preview-img"
                                            style="max-width: 100%; max-height: 140px; object-fit: contain;" src="" />
                                    </div>
                                </div>
                            </div>
                            <div class="form-actions border-top" style="margin-top: 1rem; padding-top: 1rem;">
                                <button type="button" class="btn btn-secondary" id="gejo-btn-cancel-form">Batal</button>
                                <button type="submit" class="btn btn-primary glow-button" id="gejo-form-submit-btn">
                                    <i data-lucide="send"></i> Kirim General EJO
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- ponytail: Grid Layout for cards (Kanban Board style) -->
                    <div class="project-board" id="gejo-kanban-board" style="display: none;">

                        <!-- ponytail: grouped OUTSTANDING columns -->
                        <div class="gejo-outstanding-group" id="gejo-outstanding-group">
                            <div class="gejo-outstanding-header">
                                <span class="outstanding-label">
                                    <i data-lucide="activity"></i> Outstanding
                                </span>
                                <span class="outstanding-total-badge" id="gejo-outstanding-total">0</span>
                            </div>
                            <div class="gejo-outstanding-columns">
                                <!-- Column 1: Fase 1 (Schedule) -->
                                <div class="project-column card-glass" id="gejo-col-fase1">
                                    <div class="column-header ch-fase1" onclick="navigateToGeneralEjoPhase(1)" title="Klik untuk Buka Submenu Schedule">
                                        <!-- ponytail: show only Schedule/On Progress/Done names in headers, removing Fase prefix and extra details -->
                                        <h4>Schedule</h4>
                                        <span class="col-count" id="gejo-count-fase1">0</span>
                                    </div>
                                    <div class="project-cards-container" id="gejo-container-fase1">
                                        <!-- Cards injected dynamically -->
                                    </div>
                                </div>

                                <!-- Column 2: Fase 2 (On Progress) -->
                                <div class="project-column card-glass" id="gejo-col-fase2">
                                    <div class="column-header ch-fase2" onclick="navigateToGeneralEjoPhase(2)" title="Klik untuk Buka Submenu On Progress">
                                        <!-- ponytail: show only Schedule/On Progress/Done names in headers, removing Fase prefix and extra details -->
                                        <h4>On Progress</h4>
                                        <span class="col-count" id="gejo-count-fase2">0</span>
                                    </div>
                                    <div class="project-cards-container" id="gejo-container-fase2">
                                        <!-- Cards injected dynamically -->
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Column 3: Fase 3 (Done) -->
                        <div class="project-column card-glass" id="gejo-col-fase3">
                            <div class="column-header ch-fase3" onclick="navigateToGeneralEjoPhase(3)" title="Klik untuk Buka Submenu Done">
                                <!-- ponytail: show only Schedule/On Progress/Done names in headers, removing Fase prefix and extra details -->
                                <h4>Done</h4>
                                <span class="col-count" id="gejo-count-fase3">0</span>
                            </div>
                            <div class="project-cards-container" id="gejo-container-fase3">
                                <!-- Cards injected dynamically -->
                            </div>
                        </div>

                        <!-- Column 4: Archive (Cancelled & Completed) -->
                        <div class="project-column card-glass" id="gejo-col-fase4" style="display: none;">
                            <div class="column-header ch-archive" onclick="navigateToGeneralEjoPhase(4)" title="Klik untuk Buka Submenu Archive">
                                <h4>Archive</h4>
                                <span class="col-count" id="gejo-count-fase4">0</span>
                            </div>
                            <div class="project-cards-container" id="gejo-container-fase4">
                                <!-- Cards injected dynamically -->
                            </div>
                        </div>

                    </div>

                    <!-- Table Layout (Alternative view) -->
                    <div class="job-table-view card-glass" id="gejo-table-wrapper" style="display: none;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID EJO</th>
                                    <th>Deskripsi Pekerjaan</th>
                                    <th>Departemen</th>
                                    <th>Prioritas</th>
                                    <th>Engineer</th>
                                    <th>Tanggal Target</th>
                                    <th>Status</th>
                                    <th style="text-align: right;">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="gejo-table-body">
                                <!-- Dynamic Job Order Rows -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Empty State -->
                    <div class="card-glass text-center" id="gejo-empty-state"
                        style="display: flex; padding: 3.5rem 2rem; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; margin-top: 1rem; text-align: center;">
                        <div class="empty-icon-wrapper"
                            style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--card-border); border-radius: 50%; width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center; margin: 0 auto;">
                            <i data-lucide="clipboard-x"
                                style="width: 40px; height: 40px; color: var(--color-cyan);"></i>
                        </div>
                        <h4
                            style="margin: 0.5rem 0 0; font-size: 1.25rem; font-weight: 600; color: var(--text-primary);">
                            Tidak ada Job Order</h4>
                        <button class="btn btn-outline" onclick="resetGeneralEJOFilters()"
                            style="margin-top: 0.75rem; font-size: 0.8rem; padding: 0.5rem 1rem; display: inline-flex; align-items: center; gap: 8px; margin: 0.75rem auto 0;">
                            <i data-lucide="refresh-cw" style="width: 12px; height: 12px;"></i> Reset Filter
                        </button>
                    </div>
                </section>

                <!-- TAB: DRAWING GALLERY -->
                <section id="tab-drawing" class="tab-pane">
                    <!-- ponytail: control bar Drawing disamakan dengan General EJO (search + filter + tombol Upload) -->
                    <div class="control-bar card-glass" id="drawing-control-bar">
                        <div class="search-wrapper">
                            <i data-lucide="search"></i>
                            <input type="text" id="drawing-search-input"
                                placeholder="Cari ID Drawing, Judul, Uploader atau EJO ID...">
                        </div>

                        <div class="filters-wrapper">
                            <div class="filter-group">
                                <label for="drawing-filter-status">Status</label>
                                <select id="drawing-filter-status">
                                    <option value="all">Semua Status</option>
                                    <option value="Pending Requester Approval">Pending Staff Approval (Review Staff
                                        Dept)</option>
                                    <option value="Pending Dept Approval">Pending Dept Approval (Review Departemen)
                                    </option>
                                    <option value="Pending Foreman Approval">Pending Foreman Approval</option>
                                    <option value="Pending Supervisor Approval">Pending Supervisor Approval</option>
                                    <option value="Pending Manager Approval">Pending Manager Approval</option>
                                    <option value="Completed">Completed (Selesai)</option>
                                    <option value="Cancelled">Cancelled (Dibatalkan)</option>
                                    <option value="Rejected">Rejected (Ditolak)</option>
                                    <option value="Archived">Archived (Diarsipkan)</option>
                                </select>
                            </div>

                            <div class="filter-group" id="drawing-filter-uploader-group">
                                <label for="drawing-filter-uploader">Uploader</label>
                                <select id="drawing-filter-uploader">
                                    <option value="all">Semua Uploader</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label for="drawing-filter-priority">Prioritas</label>
                                <select id="drawing-filter-priority">
                                    <option value="all">Semua Prioritas</option>
                                    <option value="1">1 - High (Urgent / Emergency)</option>
                                    <option value="2">2 - Medium (Normal)</option>
                                    <option value="3">3 - Rutin (Tidak Mendesak)</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label for="drawing-filter-dept">Departemen</label>
                                <select id="drawing-filter-dept">
                                    <option value="all">Semua Dept</option>
                                    <option value="PRD">PRD (Production)</option>
                                    <option value="ENG">ENG (Engineering)</option>
                                    <option value="EPR">EPR (Engineering Produksi)</option>
                                    <option value="GA">GA (General Affair)</option>
                                    <option value="QC">QC (Quality Control)</option>
                                    <option value="WRH">WRH (Warehouse)</option>
                                    <option value="TMB">TMB (Timbangan)</option>
                                    <option value="EUT">EUT (Engineer Utility)</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label for="drawing-filter-category">Kategori</label>
                                <select id="drawing-filter-category">
                                    <option value="all">Semua Kategori</option>
                                    <option value="Elektrik">Elektrik</option>
                                    <option value="Mekanik">Mekanik</option>
                                    <option value="Repair Part">Repair Part</option>
                                    <option value="Sipil">Sipil</option>
                                </select>
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 12px;" id="drawing-actions-container">
                            <span id="drawing-limit-info"
                                style="font-size:0.75rem; font-weight: 500; display:inline-flex; align-items:center; gap:4px; padding: 6px 12px; border-radius: 99px; background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.3); color: #22d3ee;">
                                <i data-lucide="shield-alert" style="width:13px; height:13px;"></i> Limit Drawing: -
                            </span>
                            <button class="btn btn-primary" id="btn-toggle-drawing-form">
                                <i data-lucide="plus"></i> Request Drawing
                            </button>
                            <button class="btn btn-primary" id="btn-toggle-import-drawing"
                                style="background: var(--color-green); border-color: var(--color-green); display: inline-flex; align-items: center; gap: 4px;">
                                <i data-lucide="upload"></i> Import Drawing
                            </button>
                        </div>
                    </div>

                    <!-- ponytail: results summary + view toggle disamakan dengan General EJO -->
                    <div class="results-meta">
                        <span id="drawing-results-count" class="text-secondary">Ditemukan 0 Drawing</span>
                        <div class="view-toggles">
                            <button class="btn-toggle active" id="drawing-view-grid-btn" title="Grid View">
                                <i data-lucide="layout-grid"></i>
                            </button>
                            <button class="btn-toggle" id="drawing-view-table-btn" title="Table View">
                                <i data-lucide="list"></i>
                            </button>
                        </div>
                    </div>

                    <div id="drawing-form-container" class="card-glass"
                        style="display: none; padding: 1.5rem; margin-bottom: 1.5rem;">
                        <h4 id="drawing-form-title-text"
                            style="margin-bottom: 1.25rem; border-bottom: 1px solid var(--card-border); padding-bottom: 8px;">
                            Request Drawing Baru</h4>
                        <form id="drawing-form">
                            <div class="form-grid">
                                <div class="form-field">
                                    <label for="drawing-title">Judul Drawing <span class="required">*</span></label>
                                    <input type="text" id="drawing-title" placeholder="Contoh: Layout panel MCC line 2"
                                        required>
                                </div>
                                <div class="form-field">
                                    <label for="drawing-form-category">Kategori Pekerjaan <span
                                            class="required">*</span></label>
                                    <select id="drawing-form-category" required>
                                        <option value="" disabled selected>Pilih Kategori</option>
                                        <option value="Elektrik">Elektrik</option>
                                        <option value="Mekanik">Mekanik</option>
                                        <option value="Repair Part">Repair Part</option>
                                        <option value="Sipil">Sipil</option>
                                    </select>
                                </div>
                                <div class="form-field">
                                    <label for="drawing-form-priority">Prioritas <span class="required">*</span></label>
                                    <select id="drawing-form-priority" required>
                                        <option value="1">1 - High (Urgent / Line Stop / Bahaya HSE / PEST)</option>
                                        <option value="2">2 - Medium (Normal Kerja)</option>
                                        <option value="3" selected>3 - Rutin (Rutin / Tidak Mendesak)</option>
                                    </select>
                                </div>
                                <div class="form-field">
                                    <label for="drawing-form-target-date">Target Selesai <span
                                            style="font-size: 0.75rem; color: var(--color-amber, #f59e0b); font-weight: 500;">(Menyesuaikan Jadwal Engineer)</span></label>
                                    <input type="date" id="drawing-form-target-date">
                                </div>
                                <div class="form-field full-width" id="drawing-urgent-reason-display"
                                    style="display: none;">
                                    <label for="drawing-urgent-reason-text"
                                        style="color: var(--color-rose); display: flex; align-items: center; gap: 6px; font-weight: 600;">
                                        <i data-lucide="alert-triangle" style="width: 15px; height: 15px;"></i> Alasan
                                        Urgent <span
                                            style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal; margin-left: auto;">(Read
                                            Only)</span>
                                    </label>
                                    <textarea id="drawing-urgent-reason-text" rows="2" readonly
                                        style="background: rgba(244, 63, 94, 0.05); border-color: rgba(244, 63, 94, 0.3); color: var(--text-primary); cursor: not-allowed; resize: none;"></textarea>
                                </div>
                                <div class="form-field full-width">
                                    <label for="drawing-form-location">Lokasi <span class="required">*</span></label>
                                    <input type="text" id="drawing-form-location"
                                        placeholder="Contoh: Area gudang, Panel Lt 1" required>
                                </div>
                                <div class="form-field" style="display: none;">
                                    <label for="drawing-form-dept">Departemen Pemohon <span
                                            class="required">*</span></label>
                                    <select id="drawing-form-dept">
                                        <option value="" disabled selected>Pilih Departemen</option>
                                        <option value="PRD">PRD (Production)</option>
                                        <option value="ENG">ENG (Engineering)</option>
                                        <option value="EPR">EPR (Engineering Produksi)</option>
                                        <option value="GA">GA (General Affair)</option>
                                        <option value="QC">QC (Quality Control)</option>
                                        <option value="WRH">WRH (Warehouse)</option>
                                        <option value="TMB">TMB (Timbangan)</option>
                                    <option value="EUT">EUT (Engineer Utility)</option>
                                    </select>
                                </div>

                                <div class="form-field full-width">
                                    <label for="drawing-form-description">Detail Pekerjaan / Keterangan</label>
                                    <textarea id="drawing-form-description" rows="3"
                                        placeholder="Jelaskan detail drawing yang dibutuhkan..."></textarea>
                                </div>
                                <!-- ponytail: file upload untuk request/import drawing (premium style) -->
                                <div class="form-field full-width" id="drawing-file-container"
                                    style="display: none; flex-direction: column; gap: 0.5rem; box-sizing: border-box;">
                                    <label>File Lampiran / Gambar <span class="required"
                                            id="drawing-file-required-star">*</span></label>
                                    <div style="width: 100%; position: relative;">
                                        <input type="file" id="drawing-file" style="display: none;"
                                            accept=".pdf,.jpg,.jpeg,.png,.webp" />
                                        <div id="drawing-file-trigger"
                                            style="border: 2px dashed rgba(6, 182, 212, 0.3); border-radius: var(--border-radius-sm); padding: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; background: rgba(6, 182, 212, 0.02); transition: all 0.2s ease-in-out; box-sizing: border-box;"
                                            onmouseover="this.style.background='rgba(6, 182, 212, 0.06)'; this.style.borderColor='var(--color-cyan)';"
                                            onmouseout="this.style.background='rgba(6, 182, 212, 0.02)'; this.style.borderColor='rgba(6, 182, 212, 0.3)';">
                                            <i data-lucide="upload-cloud"
                                                style="width: 24px; height: 24px; color: var(--color-cyan);"></i>
                                            <span id="drawing-file-filename"
                                                style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; word-break: break-all; font-weight: 500;">Pilih
                                                file Lampiran (PDF/Gambar)</span>
                                        </div>
                                    </div>
                                    <div id="drawing-file-preview"
                                        style="display: none; width: 100%; max-height: 120px; overflow: hidden; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); margin-top: 4px; box-sizing: border-box; background: rgba(0,0,0,0.1); align-items: center; justify-content: center;">
                                        <img id="drawing-file-preview-img"
                                            style="max-width: 100%; max-height: 120px; object-fit: contain;" src="" />
                                    </div>
                                </div>
                            </div>
                            <div class="form-actions border-top" style="margin-top: 1rem; padding-top: 1rem;">
                                <button type="button" class="btn btn-secondary"
                                    id="btn-cancel-drawing-form">Batal</button>
                                <button type="submit" class="btn btn-primary glow-button">
                                    <i data-lucide="send"></i> Kirim Request Drawing
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- ponytail: Grid Layout for drawing cards (Kanban Board style) -->
                    <div class="project-board" id="drawing-kanban-board">

                        <!-- ponytail: grouped OUTSTANDING columns (sama seperti General EJO) -->
                        <div class="gejo-outstanding-group" id="drawing-outstanding-group">
                            <div class="gejo-outstanding-header">
                                <span class="outstanding-label">
                                    <i data-lucide="activity"></i> Outstanding
                                </span>
                                <span class="outstanding-total-badge" id="drawing-outstanding-total">0</span>
                            </div>
                            <div class="gejo-outstanding-columns">
                                <!-- Column 1: Schedule -->
                                <div class="project-column card-glass" id="drawing-col-phase1">
                                    <div class="column-header ch-fase1" onclick="navigateToDrawingPhase(1)" title="Klik untuk Buka Submenu Schedule">
                                        <h4>Schedule</h4>
                                        <span class="col-count" id="drawing-count-phase1">0</span>
                                    </div>
                                    <div class="project-cards-container" id="drawing-container-phase1">
                                        <!-- Cards injected dynamically -->
                                    </div>
                                </div>

                                <!-- Column 2: On Progress -->
                                <div class="project-column card-glass" id="drawing-col-phase2">
                                    <div class="column-header ch-fase2" onclick="navigateToDrawingPhase(2)" title="Klik untuk Buka Submenu On Progress">
                                        <h4>On Progress</h4>
                                        <span class="col-count" id="drawing-count-phase2">0</span>
                                    </div>
                                    <div class="project-cards-container" id="drawing-container-phase2">
                                        <!-- Cards injected dynamically -->
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Column 3: Done -->
                        <div class="project-column card-glass" id="drawing-col-phase3">
                            <div class="column-header ch-fase3" onclick="navigateToDrawingPhase(3)" title="Klik untuk Buka Submenu Done">
                                <h4>Done</h4>
                                <span class="col-count" id="drawing-count-phase3">0</span>
                            </div>
                            <div class="project-cards-container" id="drawing-container-phase3">
                                <!-- Cards injected dynamically -->
                            </div>
                        </div>

                        <!-- Column 4: Archive (Cancelled, Completed, Archived, Rejected) -->
                        <div class="project-column card-glass" id="drawing-col-phase4" style="display: none;">
                            <div class="column-header ch-archive" onclick="navigateToDrawingPhase(4)" title="Klik untuk Buka Submenu Archive">
                                <h4>Archive</h4>
                                <span class="col-count" id="drawing-count-phase4">0</span>
                            </div>
                            <div class="project-cards-container" id="drawing-container-phase4">
                                <!-- Cards injected dynamically -->
                            </div>
                        </div>

                    </div>

                    <!-- ponytail: Table Layout (Alternative view) disamakan dengan General EJO -->
                    <div class="job-table-view card-glass" id="drawing-table-wrapper" style="display: none;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID Drawing</th>
                                    <th>Judul Drawing</th>
                                    <th>Kategori</th>
                                    <th>Pemohon</th>
                                    <th>Tanggal Upload</th>
                                    <th>Status</th>
                                    <th style="text-align: right;">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="drawing-table-body">
                                <!-- Dynamic Drawing Rows -->
                            </tbody>
                        </table>
                    </div>

                    <div class="card-glass text-center" id="drawing-empty-state"
                        style="display: none; padding: 3.5rem 2rem; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; margin-top: 1rem; text-align: center;">
                        <div class="empty-icon-wrapper"
                            style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--card-border); border-radius: 50%; width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center; margin: 0 auto;">
                            <i data-lucide="image-off" style="width: 40px; height: 40px; color: var(--color-cyan);"></i>
                        </div>
                        <h4
                            style="margin: 0.5rem 0 0; font-size: 1.25rem; font-weight: 600; color: var(--text-primary);">
                            Tidak ada Drawing</h4>
                        <button class="btn btn-outline" onclick="resetDrawingFilters()"
                            style="margin-top: 0.75rem; font-size: 0.8rem; padding: 0.5rem 1rem; display: inline-flex; align-items: center; gap: 8px; margin: 0.75rem auto 0;">
                            <i data-lucide="refresh-cw" style="width: 12px; height: 12px;"></i> Reset Filter
                        </button>
                    </div>
                </section>

                <!-- TAB 5: PROJECT MONITORING -->
                <section id="tab-projects" class="tab-pane">
                    <!-- Control Bar (Filter, Search, Sort) - ponytail: match generalejo control bar -->
                    <div class="control-bar card-glass">
                        <div class="search-wrapper">
                            <i data-lucide="search"></i>
                            <input type="text" id="proj-search-input"
                                placeholder="Cari ID, Judul, Deskripsi, atau PIC...">
                        </div>

                        <div class="filters-wrapper" style="width: auto; grid-column: auto;">
                            <div class="filter-group" style="flex: initial;">
                                <label for="proj-filter-date">Tanggal</label>
                                <input type="date" id="proj-filter-date">
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 12px;">
                            <button class="btn btn-primary" id="btn-toggle-new-project">
                                <i data-lucide="plus-circle"></i> Project Baru
                            </button>
                        </div>
                    </div>

                    <!-- Project Results Summary - ponytail: match generalejo results meta -->
                    <div class="results-meta">
                        <span id="proj-results-count" class="text-secondary">Ditemukan 0 Project</span>
                        <div class="view-toggles">
                            <button class="btn-toggle active" id="proj-view-grid-btn" title="Grid View">
                                <i data-lucide="layout-grid"></i>
                            </button>
                            <button class="btn-toggle" id="proj-view-table-btn" title="Table View">
                                <i data-lucide="list"></i>
                            </button>
                        </div>
                    </div>

                    <!-- New Project Form (Collapsible) -->
                    <div id="project-form-container" class="card-glass"
                        style="display: none; padding: 1.5rem; margin-bottom: 1.5rem;">
                        <h4
                            style="margin-bottom: 1.25rem; border-bottom: 1px solid var(--card-border); padding-bottom: 8px;">
                            Buat Rencana Project Baru</h4>
                        <form id="project-form">
                            <div class="form-grid">
                                <div class="form-field full-width">
                                    <label for="proj-title">Judul / Nama Project <span class="required">*</span></label>
                                    <input type="text" id="proj-title"
                                        placeholder="Contoh: Otomatisasi Sistem CIP (Clean In Place) Line 2" required>
                                </div>
                                <div class="form-field">
                                    <label for="proj-no-io">No IO <span class="required">*</span></label>
                                    <input type="text" id="proj-no-io" placeholder="Contoh: IO-2026-089" required>
                                </div>
                                <div class="form-field">
                                    <label for="proj-no-moc">No MOC <span class="required">*</span></label>
                                    <input type="text" id="proj-no-moc" placeholder="Contoh: MOC-2026-012" required>
                                </div>
                                <div class="form-field full-width">
                                    <label for="proj-dept">Departemen Pemilik <span class="required">*</span></label>
                                    <select id="proj-dept" required>
                                        <option value="PRD">PRD (Production)</option>
                                        <option value="ENG">ENG (Engineering)</option>
                                        <option value="EPR">EPR (Engineering Produksi)</option>
                                        <option value="GA">GA (General Affair)</option>
                                        <option value="QC">QC (Quality Control)</option>
                                        <option value="WRH">WRH (Warehouse)</option>
                                        <option value="TMB">TMB (Timbangan)</option>
                                    <option value="EUT">EUT (Engineer Utility)</option>
                                    </select>
                                </div>
                                <div class="form-field full-width">
                                    <label for="proj-form-drawing-search">Autodetect Galeri Drawing <span
                                            style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">(Cari Drawing Sipil, Mekanik, atau Spare Part dari Galeri)</span></label>
                                    <input type="text" id="proj-form-drawing-search" list="proj-drawing-datalist"
                                        placeholder="Ketik Judul Drawing, ID Drawing, Kategori, atau Nama Part...">
                                    <datalist id="proj-drawing-datalist"></datalist>
                                    <span id="proj-drawing-status-info"
                                        style="font-size: 0.75rem; color: var(--color-cyan); margin-top: 4px; display: none;"></span>
                                </div>
                                <input type="hidden" id="proj-drawing-select" value="">
                                <div class="form-field" style="display: none;">
                                    <label for="proj-budget">Anggaran Rencana (CapEx - Rp) <span
                                            class="required">*</span></label>
                                    <input type="number" id="proj-budget" placeholder="Contoh: 120000000" min="0">
                                </div>
                                <div class="form-field full-width">
                                    <label for="proj-desc">Deskripsi issue & benefit <span
                                            class="required">*</span></label>
                                    <textarea id="proj-desc" rows="4"
                                        placeholder="Tuliskan ide latar belakang masalah, kebutuhan material awal, serta ROI/manfaat untuk produktivitas pabrik..."
                                        required></textarea>
                                </div>

                                <div class="form-field full-width">
                                    <label for="proj-attachment">File Pendukung (PDF / JPG / PNG / Sejenis)</label>
                                    <input type="file" id="proj-attachment" accept=".pdf,image/*"
                                        style="background: rgba(255,255,255,0.02); border: 1px solid var(--card-border); padding: 8px; border-radius: var(--border-radius-sm); font-size: 0.8rem; width: 100%;">
                                </div>
                            </div>
                            <div class="form-actions border-top" style="margin-top: 1rem; padding-top: 1rem;">
                                <button type="button" class="btn btn-secondary" id="btn-cancel-project">Batal</button>
                                <button type="submit" class="btn btn-primary glow-button">
                                    <i data-lucide="save"></i> Daftarkan Gagasan Project
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Kanban Columns Grid -->
                    <div class="project-board">

                        <!-- Column 1: Fase 1 -->
                        <div class="project-column card-glass" id="col-fase1">
                            <div class="column-header ch-fase1" onclick="navigateToProjectPhase(1)" title="Klik untuk Buka Submenu Fase 1: Inisialisasi">
                                <span class="phase-number">Fase 1</span>
                                <h4>Inisialisasi Ide</h4>
                                <span class="col-count" id="count-fase1">0</span>
                            </div>
                            <div class="project-cards-container" id="container-fase1">
                                <!-- Cards injected dynamically -->
                            </div>
                        </div>

                        <!-- Column 2: Fase 2 -->
                        <div class="project-column card-glass" id="col-fase2">
                            <div class="column-header ch-fase2" onclick="navigateToProjectPhase(2)" title="Klik untuk Buka Submenu Fase 2: Pengadaan">
                                <span class="phase-number">Fase 2</span>
                                <h4>Pengadaan Barang</h4>
                                <span class="col-count" id="count-fase2">0</span>
                            </div>
                            <div class="project-cards-container" id="container-fase2">
                                <!-- Cards injected dynamically -->
                            </div>
                        </div>

                        <!-- Column 3: Fase 3 -->
                        <div class="project-column card-glass" id="col-fase3">
                            <div class="column-header ch-fase3" onclick="navigateToProjectPhase(3)" title="Klik untuk Buka Submenu Fase 3: Eksekusi">
                                <span class="phase-number">Fase 3</span>
                                <h4>Eksekusi Project</h4>
                                <span class="col-count" id="count-fase3">0</span>
                            </div>
                            <div class="project-cards-container" id="container-fase3">
                                <!-- Cards injected dynamically -->
                            </div>
                        </div>

                        <!-- Column 4: Fase 4 (Commissioning & Serah Terima) -->
                        <div class="project-column card-glass" id="col-fase4">
                            <div class="column-header ch-fase4" style="border-top-color: #10b981;" onclick="navigateToProjectPhase(4)" title="Klik untuk Buka Submenu Fase 4: Commissioning & Serah Terima">
                                <span class="phase-number"
                                    style="background: rgba(16, 185, 129, 0.15); color: #10b981;">Fase 4</span>
                                <h4>Commissioning & Serah Terima</h4>
                                <span class="col-count" id="count-fase4">0</span>
                            </div>
                            <div class="project-cards-container" id="container-fase4">
                                <!-- Cards injected dynamically -->
                            </div>
                        </div>

                        <!-- Column 5: Arsip Project -->
                        <div class="project-column card-glass" id="col-fase5" style="display: none;">
                            <div class="column-header ch-fase5" style="border-top-color: var(--color-cyan);" onclick="navigateToProjectPhase('archive')" title="Klik untuk Buka Submenu Arsip Project">
                                <span class="phase-number"
                                    style="background: rgba(6, 182, 212, 0.15); color: var(--color-cyan);">Arsip</span>
                                <h4>Arsip Project</h4>
                                <span class="col-count" id="count-fase5">0</span>
                            </div>
                            <div class="project-cards-container" id="container-fase5">
                                <!-- Cards injected dynamically -->
                            </div>
                        </div>

                    </div>

                </section>

                <!-- ponytail: TAB: DASHBOARD PART -->
                <section id="tab-partlist" class="tab-pane">
                    <div class="control-bar card-glass">
                        <div class="search-wrapper">
                            <i data-lucide="search"></i>
                            <input type="text" id="search-partlist" placeholder="Cari spare part atau EJO ticket...">
                        </div>
                        <div></div>
                        <div style="display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap;">
                            <button class="btn btn-primary" id="btn-toggle-new-part">
                                <i data-lucide="plus-circle"></i> Request EJO Repair Part
                            </button>
                            <button class="btn btn-primary" id="btn-toggle-new-sparepart">
                                <i data-lucide="upload"></i> Upload Drawing
                            </button>
                        </div>
                    </div>

                    <!-- Collapsible Add EJO Repair Part Form -->
                    <div id="part-form-container" class="card-glass"
                        style="display: none; padding: 1.5rem; margin-bottom: 1.5rem;">
                        <h4 style="margin-bottom: 1.25rem; border-bottom: 1px solid var(--card-border); padding-bottom: 8px;"
                            id="part-ejo-title">
                            Tambah EJO Repair Part Baru</h4>
                        <form id="part-form">
                            <div class="form-grid">
                                <div class="form-field">
                                    <label for="part-ejo-dept">Departemen Pemohon <span
                                            class="required">*</span></label>
                                    <select id="part-ejo-dept" required>
                                        <option value="" disabled selected>Pilih Departemen</option>
                                        <option value="PRD">PRD (Production)</option>
                                        <option value="ENG">ENG (Engineering)</option>
                                        <option value="EPR">EPR (Engineering Produksi)</option>
                                        <option value="GA">GA (General Affair)</option>
                                        <option value="QC">QC (Quality Control)</option>
                                        <option value="WRH">WRH (Warehouse)</option>
                                        <option value="TMB">TMB (Timbangan)</option>
                                    <option value="EUT">EUT (Engineer Utility)</option>
                                    </select>
                                </div>
                                <div class="form-field">
                                    <label for="part-ejo-mid">Machine ID (MID) <span class="required">*</span></label>
                                    <input type="text" id="part-ejo-mid" placeholder="Contoh: MC-001" required>
                                </div>
                                <div class="form-field">
                                    <label for="part-ejo-priority">Prioritas <span class="required">*</span></label>
                                    <select id="part-ejo-priority" required>
                                        <option value="1">1 - High (Urgent / Line Stop / Bahaya HSE / PEST)</option>
                                        <option value="2">2 - Medium (Normal Kerja)</option>
                                        <option value="3" selected>3 - Rutin (Rutin / Tidak Mendesak)</option>
                                    </select>
                                </div>
                                <div class="form-field full-width" id="part-urgent-reason-display"
                                    style="display: none;">
                                    <label for="part-urgent-reason-text"
                                        style="color: var(--color-rose); display: flex; align-items: center; gap: 6px; font-weight: 600;">
                                        <i data-lucide="alert-triangle" style="width: 15px; height: 15px;"></i> Alasan
                                        Urgent <span
                                            style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal; margin-left: auto;">(Read
                                            Only)</span>
                                    </label>
                                    <textarea id="part-urgent-reason-text" rows="2" readonly
                                        style="background: rgba(244, 63, 94, 0.05); border-color: rgba(244, 63, 94, 0.3); color: var(--text-primary); cursor: not-allowed; resize: none;"></textarea>
                                </div>
                                <div class="form-field">
                                    <label for="part-ejo-price-new">Harga SAP (Rp) <span
                                            class="required">*</span></label>
                                    <input type="number" id="part-ejo-price-new" min="0" placeholder="Contoh: 1000000"
                                        required>
                                </div>
                                <div class="form-field">
                                    <label for="part-ejo-repair-date">Target Selesai Perbaikan <span
                                            style="font-size: 0.75rem; color: var(--color-amber, #f59e0b); font-weight: 500;">(Menyesuaikan Jadwal Engineer)</span></label>
                                    <input type="date" id="part-ejo-repair-date">
                                </div>
                                <div class="form-field">
                                    <label for="part-ejo-cost-per-day">Biaya Orang / Hari (Rp) <span
                                            class="required">*</span></label>
                                    <input type="number" id="part-ejo-cost-per-day" min="0" placeholder="Contoh: 100000"
                                        required>
                                </div>
                                <div class="form-field">
                                    <label for="part-ejo-quantity">Quantity Total / Jumlah Quantity Barang <span
                                            class="required">*</span></label>
                                    <input type="number" id="part-ejo-quantity" min="1" value="1"
                                        placeholder="Contoh: 1" required>
                                </div>
                                <div class="form-field">
                                    <label for="part-ejo-qty-needed">Quantity yang Diperlukan Mesin <span
                                            class="required">*</span></label>
                                    <input type="number" id="part-ejo-qty-needed" min="0" value="0" placeholder="0"
                                        required>
                                </div>
                                <div class="form-field">
                                    <label for="part-ejo-qty-stock">Quantity Stok (Hasil Pengurangan)</label>
                                    <input type="number" id="part-ejo-qty-stock" value="0" placeholder="0" readonly>
                                </div>
                                <div class="form-field">
                                    <label for="part-ejo-usage-type">Peruntukan Quantity <span
                                            class="required">*</span></label>
                                    <select id="part-ejo-usage-type" required>
                                        <option value="Kebutuhan Mesin" selected>🔧 Kebutuhan Mesin</option>
                                        <option value="Stok">📦 Stok (Inventory)</option>
                                    </select>
                                </div>
                                <div class="form-field full-width">
                                    <label for="part-ejo-subject">Subject <span class="required">*</span></label>
                                    <input type="text" id="part-ejo-subject"
                                        placeholder="Contoh: Penggantian Sensor Cylinder Clamping" required>
                                </div>
                                <div class="form-field full-width">
                                    <label for="part-ejo-desc">Description / Detail Pekerjaan <span
                                            class="required">*</span></label>
                                    <textarea id="part-ejo-desc" rows="3"
                                        placeholder="Tuliskan detail pekerjaan perbaikan..." required></textarea>
                                </div>
                            </div>
                            <div class="form-actions border-top" style="margin-top: 1rem; padding-top: 1rem;">
                                <button type="button" class="btn btn-secondary" id="btn-cancel-part">Batal</button>
                                <button type="submit" class="btn btn-primary glow-button">
                                    <i data-lucide="save"></i> Simpan EJO Repair Part
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Collapsible Add Spare Part Form -->
                    <div id="sparepart-form-container" class="card-glass"
                        style="display: none; padding: 1.5rem; margin-bottom: 1.5rem;">
                        <h4 style="margin-bottom: 1.25rem; border-bottom: 1px solid var(--card-border); padding-bottom: 8px;"
                            id="sparepart-form-title">
                            Tambah Alokasi Repair Part Baru</h4>
                        <form id="sparepart-form">
                            <div class="form-grid">
                                <!-- ponytail: WSP Autodetect untuk auto-fill Nama & Kode Spare Part -->
                                <div class="form-field full-width" style="display: flex; flex-direction: column;">
                                    <label for="part-wsp-search">Autodetect WSP Master Material <span
                                            class="required">*</span> <span
                                            style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">(Cari
                                            Material WSP Master)</span></label>
                                    <input type="text" id="part-wsp-search" list="part-wsp-datalist"
                                        placeholder="Ketik Kode Material atau Deskripsi WSP..." required>
                                    <datalist id="part-wsp-datalist"></datalist>
                                    <span id="part-wsp-status-info"
                                        style="font-size: 0.75rem; color: var(--color-cyan); margin-top: 4px; display: none;"></span>
                                </div>
                                <div class="form-field full-width" style="display: none;">
                                    <label>Diupload Oleh</label>
                                    <div
                                        style="padding: 0.875rem 1rem; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: rgba(16, 185, 129, 0.06); color: var(--text-primary); font-weight: 600;">
                                        <span id="sparepart-current-uploader">--</span>
                                    </div>
                                </div>
                                <div class="form-field full-width">
                                    <label>Detail Gambar / Dokumen Spare Part <span class="required">*</span></label>
                                    <div style="width: 100%; position: relative;">
                                        <input type="file" id="part-image" style="display: none;"
                                            accept="image/*,application/pdf" required />
                                        <div id="part-image-trigger"
                                            style="border: 2px dashed rgba(16, 185, 129, 0.3); border-radius: var(--border-radius-sm); padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; background: rgba(16, 185, 129, 0.02); transition: all 0.2s ease-in-out; box-sizing: border-box;"
                                            onmouseover="this.style.background='rgba(16, 185, 129, 0.06)'; this.style.borderColor='var(--color-green)';"
                                            onmouseout="this.style.background='rgba(16, 185, 129, 0.02)'; this.style.borderColor='rgba(16, 185, 129, 0.3)';">
                                            <i data-lucide="image"
                                                style="width: 20px; height: 20px; color: var(--color-green); flex-shrink: 0;"></i>
                                            <span id="part-image-filename"
                                                style="font-size: 0.8rem; color: var(--text-secondary); word-break: break-all; font-weight: 500;">Klik
                                                untuk upload foto atau PDF spare part</span>
                                        </div>
                                    </div>
                                    <div id="part-image-preview"
                                        style="display: none; width: 100%; max-height: 120px; overflow: hidden; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); margin-top: 6px; box-sizing: border-box; background: rgba(0,0,0,0.05); align-items: center; justify-content: center;">
                                        <img id="part-image-preview-img"
                                            style="max-width: 100%; max-height: 120px; object-fit: contain;" src="" />
                                    </div>
                                </div>
                                <div class="form-field full-width">
                                    <label for="part-desc">Keterangan / Penggunaan</label>
                                    <textarea id="part-desc" rows="3"
                                        placeholder="Tuliskan keterangan detail penggunaan spare part..."></textarea>
                                </div>
                            </div>
                            <div class="form-actions border-top" style="margin-top: 1rem; padding-top: 1rem;">
                                <button type="button" class="btn btn-secondary" id="btn-cancel-sparepart">Batal</button>
                                <button type="submit" class="btn btn-primary glow-button">
                                    <i data-lucide="save"></i> Simpan Spare Part
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- ponytail: Cost Saving Charts for Spare Parts -->
                    <div class="analytics-layout-grid" id="partlist-charts-grid"
                        style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
                        <div class="chart-card card-glass">
                            <div class="card-header">
                                <div class="card-header-left">
                                    <div class="card-icon-wrap card-icon-cyan">
                                        <i data-lucide="bar-chart-3"></i>
                                    </div>
                                    <div>
                                        <h3>Volume EJO Repair Part Masuk, Selesai &amp; OS <span id="partlist-tv-val-period" class="tv-period-inline">- Tahun Ini</span></h3>
                                    </div>
                                </div>
                                <div class="card-actions">
                                    <!-- ponytail: Filter rentang waktu partlist trend chart -->
                                    <select id="partlist-trend-time-filter" class="chart-time-filter">
                                        <option value="week">Minggu Ini</option>
                                        <option value="month">Bulan Ini</option>
                                        <option value="year" selected>Tahun Ini</option>
                                    </select>
                                    <span class="badge badge-accent badge-live">Live Chart</span>
                                </div>
                            </div>
                            <!-- ponytail: TradingView-style interactive real-time data tracker for Partlist Trend -->
                            <div class="trend-tv-tracker" id="partlist-tv-tracker">
                                <div class="tv-item tv-masuk">
                                    <span class="tv-dot tv-dot-red"></span>
                                    <span>Masuk:</span>
                                    <strong id="partlist-tv-val-masuk">--</strong>
                                </div>
                                <div class="tv-item tv-selesai">
                                    <span class="tv-dot tv-dot-green"></span>
                                    <span>Selesai:</span>
                                    <strong id="partlist-tv-val-selesai">--</strong>
                                </div>
                                <div class="tv-item tv-batal">
                                    <span class="tv-dot tv-dot-darkgreen"></span>
                                    <span>Dibatalkan:</span>
                                    <strong id="partlist-tv-val-batal">--</strong>
                                </div>
                                <div class="tv-item tv-os">
                                    <span class="tv-dot tv-dot-orange"></span>
                                    <span>OS:</span>
                                    <strong id="partlist-tv-val-os">--</strong>
                                </div>
                            </div>
                            <div class="card-body chart-container">
                                <canvas id="partlistTrendChart"></canvas>
                            </div>
                        </div>
                        <div class="chart-card card-glass">
                            <div class="card-header">
                                <div class="card-header-left">
                                    <div class="card-icon-wrap card-icon-cyan">
                                        <i data-lucide="pie-chart"></i>
                                    </div>
                                    <div>
                                        <h3>Perbandingan Biaya Dan Penghematan <span id="partlist-cost-val-period" class="tv-period-inline">- Tahun Ini</span></h3>
                                    </div>
                                </div>
                                <div class="card-actions">
                                    <!-- ponytail: Filter rentang waktu partlist cost savings doughnut chart -->
                                    <select id="partlist-location-time-filter" class="chart-time-filter">
                                        <option value="week">Minggu Ini</option>
                                        <option value="month">Bulan Ini</option>
                                        <option value="year" selected>Tahun Ini</option>
                                    </select>
                                    <span class="badge badge-accent badge-live">Live Chart</span>
                                </div>
                            </div>
                            <div class="chart-container doughnut-legend-layout">
                                <div class="doughnut-canvas-wrapper">
                                    <canvas id="partlistLocationChart"></canvas>
                                </div>
                                <div id="partlistLocationLegend"></div>
                            </div>
                        </div>
                    </div>

                    <!-- EJO Repair Parts Card -->
                    <div class="job-table-view card-glass" id="partlist-ejo-table-wrapper"
                        style="margin-bottom: 1.5rem; padding: 1.25rem;">
                        <h3
                            style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="clipboard-list"
                                style="width: 18px; height: 18px; color: var(--color-cyan);"></i> Daftar EJO Repair Part
                            (Ticket)
                        </h3>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Departemen</th>
                                    <th>Ticket ID (Nomor EJO)</th>
                                    <th>MID</th>
                                    <th>Subject</th>
                                    <th>Prioritas</th>
                                    <th>Harga Baru</th>
                                    <th>Durasi (Hari)</th>
                                    <th>Biaya/Hari</th>
                                    <th>Cost Man Power</th>
                                    <th>Cost Saving</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="partlist-ejo-table-body">
                                <!-- Data will be loaded dynamically -->
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- ponytail: TAB: GALERI DRAWING TEKNIK -->
                <section id="tab-drawing-gallery" class="tab-pane">
                    <!-- Control bar Galeri Drawing -->
                    <div class="control-bar card-glass"
                        style="grid-template-columns: 1fr auto; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;">
                        <div>
                            <h3
                                style="font-size: 1.15rem; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 8px;">
                                <i data-lucide="gallery-thumbnails"
                                    style="width: 20px; height: 20px; color: var(--color-cyan);"></i>
                                <span id="drawing-gallery-title-text">Galeri Drawing Teknik</span>
                            </h3>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                            <div class="filter-group" style="margin: 0;">
                                <select id="filter-drawing-gallery-cat"
                                    style="height: 38px; padding: 0 12px; font-size: 0.8rem;">
                                    <option value="all">Semua Kategori</option>
                                    <option value="elektrik">Elektrik</option>
                                    <option value="mekanik">Mekanik</option>
                                    <option value="Repair Part">Repair Part</option>
                                    <option value="sipil">Sipil</option>
                                </select>
                            </div>
                            <div class="filter-group" style="margin: 0;">
                                <select id="filter-drawing-gallery-dept"
                                    style="height: 38px; padding: 0 12px; font-size: 0.8rem;">
                                    <option value="all">Semua Dept</option>
                                    <option value="PRD">PRD (Production)</option>
                                    <option value="ENG">ENG (Engineering)</option>
                                    <option value="EPR">EPR (Engineering Produksi)</option>
                                    <option value="GA">GA (General Affair)</option>
                                    <option value="QC">QC (Quality Control)</option>
                                    <option value="WRH">WRH (Warehouse)</option>
                                    <option value="TMB">TMB (Timbangan)</option>
                                    <option value="EUT">EUT (Engineer Utility)</option>
                                </select>
                            </div>
                            <div class="search-wrapper" style="min-width: 260px;">
                                <input type="text" id="search-drawing-gallery"
                                    placeholder="Cari judul, uploader, ID drawing...">
                            </div>
                        </div>
                    </div>

                    <!-- Gallery grid -->
                    <div id="drawing-gallery-grid"
                        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem;">
                        <!-- Diisi oleh renderDrawingGallery() -->
                    </div>
                    <!-- Empty state -->
                    <div id="drawing-gallery-empty"
                        style="display: none; text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
                        <i data-lucide="image-off"
                            style="width: 48px; height: 48px; opacity: 0.3; margin-bottom: 1rem;"></i>
                        <p style="font-size: 0.95rem; font-weight: 500;">Belum ada gambar drawing yang di-upload untuk
                            kategori ini.</p>
                        <p style="font-size: 0.8rem; margin-top: 4px;">Upload drawing melalui menu <strong>Drawing EJO →
                                Import Drawing</strong>.</p>
                    </div>
                </section>

                <!-- ponytail: TAB: GALERI SPARE PART -->
                <section id="tab-partlist-gallery" class="tab-pane">
                    <!-- Control bar -->
                    <div class="control-bar card-glass"
                        style="grid-template-columns: 1fr auto; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;">
                        <div>
                            <h3
                                style="font-size: 1.15rem; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 8px;">
                                <i data-lucide="images"
                                    style="width: 20px; height: 20px; color: var(--color-green);"></i>
                                Galeri Gambar Spare Part
                            </h3>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="search-wrapper"
                                style="min-width: 260px; display: flex; flex-direction: column;">
                                <input type="text" id="search-partlist-gallery" list="gallery-part-datalist"
                                    placeholder="Cari nama / kode spare part...">
                                <datalist id="gallery-part-datalist"></datalist>
                                <span id="gallery-part-search-info"
                                    style="font-size: 0.75rem; color: var(--color-cyan); margin-top: 4px; display: none;"></span>
                            </div>
                        </div>
                    </div>

                    <!-- Gallery grid -->
                    <div id="partlist-gallery-grid"
                        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem;">
                        <!-- Diisi oleh renderPartGallery() -->
                    </div>
                    <!-- Empty state -->
                    <div id="partlist-gallery-empty"
                        style="display: none; text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
                        <i data-lucide="image-off"
                            style="width: 48px; height: 48px; opacity: 0.3; margin-bottom: 1rem;"></i>
                        <p style="font-size: 0.95rem; font-weight: 500;">Belum ada gambar spare part yang diupload.</p>
                        <p style="font-size: 0.8rem; margin-top: 4px;">Upload gambar melalui menu <strong>Dashboard Part
                                → Upload Drawing</strong>.</p>
                    </div>
                </section>

                <!-- TAB: HISTORY EJO (COMPLETED/CANCELLED) -->
                <section id="tab-history" class="tab-pane">
                    <div class="control-bar card-glass"
                        style="display: flex; justify-content: space-between; align-items: center; gap: 1.25rem; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                        <div style="min-width: 240px;">
                            <h3 id="history-card-title"
                                style="font-size: 1.15rem; font-weight:700; margin:0; display: flex; align-items: center; gap: 8px;">
                                <i data-lucide="archive"
                                    style="width: 20px; height: 20px; color: var(--accent-color, #0ea5e9);"></i>
                                <span>Riwayat General EJO Selesai</span>
                            </h3>
                            <p id="history-card-subtitle" class="text-secondary text-xs" style="margin: 4px 0 0 0;">
                                Daftar General EJO yang
                                sudah selesai dikerjakan atau dibatalkan.</p>
                        </div>
                        <!-- ponytail: History Date Range Filter -->
                        <div class="history-filter-pill-box"
                            style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); padding: 8px 14px; border-radius: var(--border-radius-md, 10px); border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));">
                            <div
                                style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary, #94a3b8); margin-right: 4px;">
                                <i data-lucide="calendar"
                                    style="width: 15px; height: 15px; color: var(--accent-color, #0ea5e9);"></i>
                                <span>Tanggal:</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <label for="history-start-date" class="text-xs text-secondary"
                                    style="font-weight: 600; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.5px;">Dari</label>
                                <input type="date" id="history-start-date" class="form-control"
                                    style="padding: 6px 10px; border-radius: 6px; font-size: 0.82rem; background: var(--bg-sidebar, #1e293b); border: 1px solid var(--card-border, #334155); color: var(--text-primary, #f8fafc); outline: none; transition: all 0.2s;">
                            </div>
                            <span
                                style="color: var(--text-muted, #64748b); font-size: 0.8rem; font-weight: 500;">–</span>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <input type="date" id="history-end-date" class="form-control"
                                    style="padding: 6px 10px; border-radius: 6px; font-size: 0.82rem; background: var(--bg-sidebar, #1e293b); border: 1px solid var(--card-border, #334155); color: var(--text-primary, #f8fafc); outline: none; transition: all 0.2s;">
                            </div>
                            <button id="btn-reset-history-date" class="btn btn-secondary btn-sm"
                                style="padding: 6px 12px; font-size: 0.8rem; height: 34px; display: inline-flex; align-items: center; gap: 6px; border-radius: 6px; margin-left: 4px;"
                                title="Reset Filter Tanggal">
                                <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Reset
                            </button>
                        </div>
                    </div>
                    <div class="job-table-view card-glass">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Judul Pekerjaan</th>
                                    <th>Departemen</th>
                                    <th>Engineer</th>
                                    <th>Status</th>
                                    <th>Tanggal Selesai</th>
                                    <th id="history-header-action" style="display: none; text-align: right;">Aksi</th>
                                    <!-- ponytail: conditional column header -->
                                </tr>
                            </thead>
                            <tbody id="history-table-body">
                                <!-- Rendered dynamically -->
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- TAB 6: ADMIN PANEL (USER DATABASE MANAGEMENT) -->
                <section id="tab-admin" class="tab-pane">
                    <!-- Top control bar -->
                    <div class="control-bar card-glass"
                        style="grid-template-columns: 1fr auto; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;">
                        <div>
                            <h3 style="font-size: 1.15rem; font-weight:700;">Database User & Otoritas</h3>
                            <p class="text-secondary text-xs" style="margin-top:2px;">Daftarkan, kelola, dan perbarui
                                kredensial login teknisi serta admin pabrik PT. BAS.</p>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                            <button class="btn btn-outline" id="btn-seed-based-accounts" style="display: none; gap: 8px; color: var(--color-cyan); border-color: rgba(6, 182, 212, 0.4);">
                                <i data-lucide="user-check"></i> Auto-Generate Based Accounts
                            </button>
                            <button class="btn btn-primary" id="btn-toggle-new-user">
                                <i data-lucide="plus-circle"></i> Daftarkan User
                            </button>
                        </div>
                    </div>

                    <!-- ponytail: Server Database Management (Modular Reset & Nuclear Option) -->
                    <div class="card-glass" id="server-db-control-bar"
                        style="display: none; flex-direction: column; gap: 1.25rem; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid rgba(244, 63, 94, 0.25); background: rgba(244, 63, 94, 0.03); border-radius: var(--border-radius-lg);">

                        <!-- Top Header -->
                        <div
                            style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid rgba(244, 63, 94, 0.15); padding-bottom: 1rem;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div
                                    style="width: 42px; height: 42px; border-radius: 12px; background: rgba(244, 63, 94, 0.12); color: #f43f5e; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(244, 63, 94, 0.15); flex-shrink: 0;">
                                    <i data-lucide="database-zap" style="width: 22px; height: 22px;"></i>
                                </div>
                                <div>
                                    <h3
                                        style="font-size: 1.15rem; font-weight: 700; color: #f43f5e; margin: 0; display: flex; align-items: center; gap: 8px;">
                                        Server Database Management
                                        <span
                                            style="font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: rgba(244, 63, 94, 0.18); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.3);">Eksklusif
                                            Server</span>
                                    </h3>
                                    <p class="text-secondary text-xs" style="margin-top: 3px;">Hapus database per modul
                                        menu navbar atau setel ulang seluruh database sistem.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Modular Reset Grid (Per Menu Navbar) -->
                        <div>
                            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 0.75rem;">
                                <i data-lucide="trash-2"
                                    style="width: 15px; height: 15px; color: var(--text-secondary);"></i>
                                <span
                                    style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.5px;">Hapus
                                    Database Per Menu Navbar:</span>
                            </div>

                            <div
                                style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">

                                <!-- 1. General EJO -->
                                <div
                                    style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--card-border); border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; transition: 0.2s;">
                                    <div style="display: flex; align-items: flex-start; gap: 10px;">
                                        <div
                                            style="width: 32px; height: 32px; border-radius: 8px; background: rgba(245, 158, 11, 0.15); color: #f59e0b; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                            <i data-lucide="layers" style="width: 18px; height: 18px;"></i>
                                        </div>
                                        <div>
                                            <h4
                                                style="font-size: 0.9rem; font-weight: 700; margin: 0; color: var(--text-primary);">
                                                General EJO</h4>
                                            <p class="text-secondary text-xs"
                                                style="margin: 2px 0 0 0; line-height: 1.3;">Hapus semua tiket General
                                                EJO (Fase 1-3).</p>
                                        </div>
                                    </div>
                                    <button class="btn btn-outline btn-xs" id="btn-reset-gejo"
                                        style="width: 100%; border-color: rgba(245, 158, 11, 0.4); color: #f59e0b; padding: 6px 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; border-radius: 8px;">
                                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Hapus General
                                        EJO
                                    </button>
                                </div>

                                <!-- 2. Drawing EJO -->
                                <div
                                    style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--card-border); border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; transition: 0.2s;">
                                    <div style="display: flex; align-items: flex-start; gap: 10px;">
                                        <div
                                            style="width: 32px; height: 32px; border-radius: 8px; background: rgba(6, 182, 212, 0.15); color: var(--color-cyan); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                            <i data-lucide="image" style="width: 18px; height: 18px;"></i>
                                        </div>
                                        <div>
                                            <h4
                                                style="font-size: 0.9rem; font-weight: 700; margin: 0; color: var(--text-primary);">
                                                Drawing EJO</h4>
                                            <p class="text-secondary text-xs"
                                                style="margin: 2px 0 0 0; line-height: 1.3;">Hapus seluruh tiket &amp;
                                                file Drawing.</p>
                                        </div>
                                    </div>
                                    <button class="btn btn-outline btn-xs" id="btn-reset-drawing"
                                        style="width: 100%; border-color: rgba(6, 182, 212, 0.4); color: var(--color-cyan); padding: 6px 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; border-radius: 8px;">
                                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Hapus Drawing
                                        EJO
                                    </button>
                                </div>

                                <!-- 3. Project -->
                                <div
                                    style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--card-border); border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; transition: 0.2s;">
                                    <div style="display: flex; align-items: flex-start; gap: 10px;">
                                        <div
                                            style="width: 32px; height: 32px; border-radius: 8px; background: rgba(59, 130, 246, 0.15); color: #3b82f6; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                            <i data-lucide="milestone" style="width: 18px; height: 18px;"></i>
                                        </div>
                                        <div>
                                            <h4
                                                style="font-size: 0.9rem; font-weight: 700; margin: 0; color: var(--text-primary);">
                                                Project Monitoring</h4>
                                            <p class="text-secondary text-xs"
                                                style="margin: 2px 0 0 0; line-height: 1.3;">Hapus seluruh kartu Project
                                                (Fase 1-4).</p>
                                        </div>
                                    </div>
                                    <button class="btn btn-outline btn-xs" id="btn-reset-project"
                                        style="width: 100%; border-color: rgba(59, 130, 246, 0.4); color: #3b82f6; padding: 6px 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; border-radius: 8px;">
                                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Hapus Project
                                    </button>
                                </div>

                                <!-- 4. Dashboard Part & Galeri Spare Part -->
                                <div
                                    style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--card-border); border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; transition: 0.2s;">
                                    <div style="display: flex; align-items: flex-start; gap: 10px;">
                                        <div
                                            style="width: 32px; height: 32px; border-radius: 8px; background: rgba(16, 185, 129, 0.15); color: #10b981; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                            <i data-lucide="wrench" style="width: 18px; height: 18px;"></i>
                                        </div>
                                        <div>
                                            <h4
                                                style="font-size: 0.9rem; font-weight: 700; margin: 0; color: var(--text-primary);">
                                                Dashboard &amp; Spare Part</h4>
                                            <p class="text-secondary text-xs"
                                                style="margin: 2px 0 0 0; line-height: 1.3;">Hapus data Repair Part
                                                &amp; galeri spare part.</p>
                                        </div>
                                    </div>
                                    <button class="btn btn-outline btn-xs" id="btn-reset-partlist"
                                        style="width: 100%; border-color: rgba(16, 185, 129, 0.4); color: #10b981; padding: 6px 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; border-radius: 8px;">
                                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Hapus Data
                                        Spare Part
                                    </button>
                                </div>

                                <!-- 5. History EJO -->
                                <div
                                    style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--card-border); border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; transition: 0.2s;">
                                    <div style="display: flex; align-items: flex-start; gap: 10px;">
                                        <div
                                            style="width: 32px; height: 32px; border-radius: 8px; background: rgba(168, 85, 247, 0.15); color: #a855f7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                            <i data-lucide="archive" style="width: 18px; height: 18px;"></i>
                                        </div>
                                        <div>
                                            <h4
                                                style="font-size: 0.9rem; font-weight: 700; margin: 0; color: var(--text-primary);">
                                                History EJO</h4>
                                            <p class="text-secondary text-xs"
                                                style="margin: 2px 0 0 0; line-height: 1.3;">Hapus riwayat arsip &amp;
                                                tiket selesai.</p>
                                        </div>
                                    </div>
                                    <button class="btn btn-outline btn-xs" id="btn-reset-history"
                                        style="width: 100%; border-color: rgba(168, 85, 247, 0.4); color: #a855f7; padding: 6px 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; border-radius: 8px;">
                                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Hapus History
                                        EJO
                                    </button>
                                </div>

                                <!-- 6. User Accounts -->
                                <div
                                    style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--card-border); border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; transition: 0.2s;">
                                    <div style="display: flex; align-items: flex-start; gap: 10px;">
                                        <div
                                            style="width: 32px; height: 32px; border-radius: 8px; background: rgba(234, 179, 8, 0.15); color: #eab308; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                            <i data-lucide="users" style="width: 18px; height: 18px;"></i>
                                        </div>
                                        <div>
                                            <h4
                                                style="font-size: 0.9rem; font-weight: 700; margin: 0; color: var(--text-primary);">
                                                Akun Personel</h4>
                                            <p class="text-secondary text-xs"
                                                style="margin: 2px 0 0 0; line-height: 1.3;">Reset akun pengguna ke
                                                default pabrik.</p>
                                        </div>
                                    </div>
                                    <button class="btn btn-outline btn-xs" id="btn-reset-users"
                                        style="width: 100%; border-color: rgba(234, 179, 8, 0.4); color: #eab308; padding: 6px 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; border-radius: 8px;">
                                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Reset Akun User
                                    </button>
                                </div>

                            </div>
                        </div>

                        <!-- Reset All Module Data (Keep User Accounts) -->
                        <div
                            style="margin-top: 0.25rem; padding: 1rem 1.25rem; background: rgba(245, 158, 11, 0.08); border: 1px dashed rgba(245, 158, 11, 0.4); border-radius: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div
                                    style="width: 38px; height: 38px; border-radius: 10px; background: #f59e0b; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);">
                                    <i data-lucide="layers" style="width: 20px; height: 20px;"></i>
                                </div>
                                <div>
                                    <h4 style="font-size: 0.95rem; font-weight: 700; color: #f59e0b; margin: 0;">Hapus Seluruh Data Modul (Kecuali Akun Personel)</h4>
                                    <p class="text-secondary text-xs" style="margin: 2px 0 0 0;">Hapus seluruh data tiket General EJO, Drawing, Project, Galeri, Dashboard Spare Part, &amp; History sekaligus tanpa menghapus akun pengguna.</p>
                                </div>
                            </div>
                            <button class="btn" id="btn-reset-all-modules"
                                style="gap: 8px; background: #f59e0b; color: white; display: flex; align-items: center; padding: 0.6rem 1.25rem; font-size: 0.85rem; font-weight: 600; border-radius: 10px; border: none; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);">
                                <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i> Hapus Semua Data (Keep Akun)
                            </button>
                        </div>

                        <!-- Danger Zone: Nuclear Option -->
                        <div
                            style="margin-top: 0.25rem; padding: 1rem 1.25rem; background: rgba(244, 63, 94, 0.08); border: 1px dashed rgba(244, 63, 94, 0.4); border-radius: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div
                                    style="width: 38px; height: 38px; border-radius: 10px; background: #f43f5e; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(244, 63, 94, 0.35);">
                                    <i data-lucide="bomb" style="width: 20px; height: 20px;"></i>
                                </div>
                                <div>
                                    <h4 style="font-size: 0.95rem; font-weight: 700; color: #f43f5e; margin: 0;">Zona
                                        Bahaya: Nuclear Database (Reset Total)</h4>
                                    <p class="text-secondary text-xs" style="margin: 2px 0 0 0;">Hapus seluruh data di
                                        SEMUA modul sekaligus dan kembalikan sistem ke setelan awal.</p>
                                </div>
                            </div>
                            <button class="btn" id="btn-db-nuclear"
                                style="gap: 8px; background: #f43f5e; color: white; display: flex; align-items: center; padding: 0.6rem 1.25rem; font-size: 0.85rem; font-weight: 600; border-radius: 10px; border: none; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 14px rgba(244, 63, 94, 0.3);">
                                <i data-lucide="bomb" style="width: 16px; height: 16px;"></i> Nuclear Database (Reset
                                Total)
                            </button>
                        </div>
                    </div>

                    <!-- ponytail: Excel Data Backup/Restore & Integration Utilities -->
                    <div class="control-bar card-glass"
                        style="grid-template-columns: 1fr auto; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;">
                        <div>
                            <h3 style="font-size: 1.15rem; font-weight:700;">Utilitas Data Excel (EJO)</h3>
                            <p class="text-secondary text-xs" style="margin-top:2px;">Ekspor seluruh riwayat Job Order
                                ke file Excel atau impor dari file template Excel PT. BAS.</p>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                            <!-- ponytail: Temporarily hide Excel export button per user request -->
                            <button class="btn btn-outline" id="btn-excel-export" style="gap: 8px; display: none;">
                                <i data-lucide="download" style="width: 16px; height: 16px;"></i> Export Excel
                            </button>
                            <button class="btn btn-outline" id="btn-excel-import" style="gap: 8px;">
                                <i data-lucide="upload" style="width: 16px; height: 16px;"></i> Import EJO Excel
                            </button>
                            <input type="file" id="excel-import-input" accept=".xlsx, .xls, .csv"
                                onchange="importFromExcel(event)" style="display: none;">
                            <button class="btn btn-outline" id="btn-excel-import-drawing"
                                style="gap: 8px; color: var(--color-purple); border-color: rgba(168, 85, 247, 0.4);">
                                <i data-lucide="file-image" style="width: 16px; height: 16px;"></i> Import Drawing EJO
                            </button>
                            <input type="file" id="excel-import-drawing-input" accept=".xlsx, .xls, .csv"
                                onchange="importDrawingFromExcel(event)" style="display: none;">
                            <button class="btn btn-outline" id="btn-wsp-admin-import"
                                style="gap: 8px; color: var(--color-cyan); border-color: rgba(6, 182, 212, 0.4);">
                                <i data-lucide="file-spreadsheet" style="width: 16px; height: 16px;"></i> Import WSP
                                Material
                            </button>
                            <input type="file" id="wsp-admin-import-input" accept=".xlsx, .xls, .csv"
                                style="display: none;">
                        </div>
                    </div>

                    <!-- ponytail: Dashboard Settings Toggle -->
                    <div class="control-bar card-glass"
                        style="grid-template-columns: 1fr auto; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;">
                        <div>
                            <h3 style="font-size: 1.15rem; font-weight:700;">Pengaturan Tampilan Dashboard</h3>
                            <p class="text-secondary text-xs" style="margin-top:2px;">Tampilkan atau sembunyikan
                                visualisasi tertentu di halaman utama.</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <label class="switch">
                                <input type="checkbox" id="toggle-status-prop" checked>
                                <span class="slider"></span>
                            </label>
                            <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-primary);">Proporsi
                                Status EJO</span>
                        </div>
                    </div>

                    <!-- Add/Edit User Form Panel (Collapsible) -->
                    <div id="user-form-container" class="card-glass"
                        style="display: none; padding: 1.5rem; margin-bottom: 1.5rem;">
                        <h4 id="user-form-title"
                            style="margin-bottom: 1.25rem; border-bottom: 1px solid var(--card-border); padding-bottom: 8px;">
                            Daftarkan User Baru</h4>
                        <form id="user-admin-form">
                            <!-- Hidden input to distinguish Add vs Edit -->
                            <input type="hidden" id="user-form-mode" value="add">

                            <div class="form-grid">
                                <div class="form-field">
                                    <label for="usr-username">Username <span class="required">*</span></label>
                                    <input type="text" id="usr-username" placeholder="Contoh: dani (lowercase, unik)"
                                        required>
                                    <small id="usr-username-duplicate-hint"
                                        style="display: none; color: var(--danger-color, #ef4444); font-size: 0.75rem; margin-top: 4px;">⚠️
                                        Username ini sudah terdaftar oleh user lain. Silakan pilih username lain atau
                                        edit dari tabel.</small>
                                </div>
                                <div class="form-field" id="user-password-field-container">
                                    <label for="usr-password">Password <span class="required">*</span></label>
                                    <div class="password-input-wrapper">
                                        <input type="password" id="usr-password" placeholder="Minimal 6 karakter"
                                            required>
                                        <button type="button" class="btn-toggle-password" id="btn-toggle-usr-pass"
                                            title="Tampilkan Password">
                                            <i data-lucide="eye" id="usr-pass-eye-icon"
                                                style="width: 16px; height: 16px;"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-field">
                                    <label for="usr-fullname">Nama Lengkap Personel <span
                                            class="required">*</span></label>
                                    <input type="text" id="usr-fullname" placeholder="Contoh: Ahmad Dani" required>
                                </div>
                                <div class="form-field">
                                    <label for="usr-section">Bagian / Sub-Divisi</label>
                                    <input type="text" id="usr-section" placeholder="Contoh: PRD Proses, WWTP, Sipil 1, PM Retail">
                                </div>
                                <div class="form-field">
                                    <label for="usr-dept">Departemen Personel <span class="required">*</span></label>
                                    <select id="usr-dept" required>
                                        <option value="" disabled selected>Pilih Departemen</option>
                                        <option value="PRD">PRD (Production)</option>
                                        <option value="ENG">ENG (Engineering)</option>
                                        <option value="EPR">EPR (Engineering Produksi)</option>
                                        <option value="GA">GA (General Affair)</option>
                                        <option value="QC">QC (Quality Control)</option>
                                        <option value="WRH">WRH (Warehouse)</option>
                                        <option value="TMB">TMB (Timbangan)</option>
                                    <option value="EUT">EUT (Engineer Utility)</option>
                                    </select>
                                </div>
                                <div class="form-field">
                                    <label for="usr-role">Jabatan / Level Otoritas <span
                                            class="required">*</span></label>
                                    <select id="usr-role" required disabled>
                                        <option value="" disabled selected id="role-placeholder">Pilih Departemen
                                            Terlebih Dahulu</option>
                                    </select>
                                </div>
                                <div class="form-field full-width">
                                    <label for="usr-avatar">URL Foto Profil / Avatar</label>
                                    <input type="text" id="usr-avatar"
                                        placeholder="https://images.unsplash.com/photo-xxx atau biarkan kosong untuk default">
                                </div>
                            </div>
                            <div class="form-actions border-top" style="margin-top: 1rem; padding-top: 1rem;">
                                <button type="button" class="btn btn-secondary" id="btn-cancel-user-form">Batal</button>
                                <button type="submit" class="btn btn-primary glow-button" id="btn-save-user-submit">
                                    <i data-lucide="save"></i> Simpan User
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- User Table -->
                    <div class="job-table-view card-glass">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Avatar</th>
                                    <th>Username</th>
                                    <th>Nama Lengkap</th>
                                    <th>Bagian / Sub-Divisi</th>
                                    <th>Departemen</th>
                                    <th>Role / Jabatan</th>
                                    <th>Kredensial</th>
                                    <th>Status Device</th>
                                    <th style="text-align: right;">Aksi Tindakan</th>
                                </tr>
                            </thead>
                            <tbody id="user-table-body">
                                <!-- Loaded dynamically via fetch GET /api/users -->
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- TAB: SERVER DASHBOARD ACCESS CONFIGURATION (EKSKLUSIF SERVER) -->
                <section id="tab-server-dashboard-access" class="tab-pane">
                    <!-- Control Bar Header -->
                    <div class="control-bar card-glass"
                        style="grid-template-columns: 1fr auto; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; border-left: 4px solid var(--color-cyan);">
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                <i data-lucide="layout-dashboard"
                                    style="color: var(--color-cyan); width: 20px; height: 20px;"></i>
                                <h3 style="font-size: 1.2rem; font-weight:700;">Perizinan Tampil Modul Dashboard</h3>
                                <span class="badge"
                                    style="background: rgba(6, 182, 212, 0.15); color: var(--color-cyan); border: 1px solid rgba(6, 182, 212, 0.3); font-size: 0.7rem; font-weight: 700; border-radius: 6px; padding: 2px 8px;">Akses
                                    Per Role & Akun</span>
                            </div>
                            <p class="text-secondary text-xs">Atur visibilitas setiap widget, komponen KPI, chart, dan
                                tabel pada Dashboard utama secara terpusat berdasarkan Role / Akun pengguna.</p>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <button class="btn btn-primary" onclick="resetAllDashboardWidgetPermissions()"
                                style="gap: 8px;">
                                <i data-lucide="rotate-ccw"></i> Reset ke Tampil Semua
                            </button>
                        </div>
                    </div>

                    <!-- Dashboard Widgets Permission Management Cards -->
                    <div id="dashboard-access-widgets-container"
                        style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
                        <!-- Rendered dynamically by renderServerDashboardAccessTab() -->
                    </div>
                </section>

                <!-- TAB 7: SERVER ACCESS MANAGEMENT (EKSKLUSIF SERVER) -->
                <section id="tab-server-access" class="tab-pane">
                    <!-- Container for Main User Access Table View -->
                    <div id="server-access-main-container">
                        <!-- Control Bar Header -->
                        <div class="control-bar card-glass"
                            style="grid-template-columns: 1fr auto; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; border-left: 4px solid var(--color-cyan);">
                            <div>
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                    <i data-lucide="shield-check"
                                        style="color: var(--color-cyan); width: 20px; height: 20px;"></i>
                                    <h3 style="font-size: 1.2rem; font-weight:700;">Manajemen Akses & Otoritas Server
                                    </h3>
                                    <span class="badge"
                                        style="background: rgba(6, 182, 212, 0.15); color: var(--color-cyan); border: 1px solid rgba(6, 182, 212, 0.3); font-size: 0.7rem; font-weight: 700; border-radius: 6px; padding: 2px 8px;">Matriks
                                        Role & Dept</span>
                                </div>
                                <p class="text-secondary text-xs">Kelola hak akses modul, status otoritas, dan atribusi
                                    per Role & Departemen secara terpusat.</p>
                            </div>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <button class="btn btn-primary" id="btn-server-access-add-user" style="gap: 8px;">
                                    <i data-lucide="user-plus"></i> Daftarkan User Baru
                                </button>
                            </div>
                        </div>
                        <!-- Summary Stats Grid -->
                        <div class="stats-grid"
                            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                            <div class="card-glass stat-card"
                                style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
                                <div class="stat-icon-wrapper"
                                    style="width: 44px; height: 44px; border-radius: 12px; background: rgba(6, 182, 212, 0.12); color: #06b6d4; display: flex; align-items: center; justify-content: center;">
                                    <i data-lucide="shield" style="width: 22px; height: 22px;"></i>
                                </div>
                                <div>
                                    <span class="text-secondary text-xs" style="font-weight: 500;">Total Role &
                                        Otoritas</span>
                                    <h3 id="stat-server-total-roles"
                                        style="font-size: 1.4rem; font-weight: 700; margin-top: 2px;">0</h3>
                                </div>
                            </div>
                            <div class="card-glass stat-card"
                                style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
                                <div class="stat-icon-wrapper"
                                    style="width: 44px; height: 44px; border-radius: 12px; background: rgba(139, 92, 246, 0.12); color: #8b5cf6; display: flex; align-items: center; justify-content: center;">
                                    <i data-lucide="building" style="width: 22px; height: 22px;"></i>
                                </div>
                                <div>
                                    <span class="text-secondary text-xs" style="font-weight: 500;">Total Dept</span>
                                    <h3 id="stat-server-total-depts"
                                        style="font-size: 1.4rem; font-weight: 700; margin-top: 2px;">0</h3>
                                </div>
                            </div>
                            <div class="card-glass stat-card"
                                style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
                                <div class="stat-icon-wrapper"
                                    style="width: 44px; height: 44px; border-radius: 12px; background: rgba(59, 130, 246, 0.12); color: #3b82f6; display: flex; align-items: center; justify-content: center;">
                                    <i data-lucide="users" style="width: 22px; height: 22px;"></i>
                                </div>
                                <div>
                                    <span class="text-secondary text-xs" style="font-weight: 500;">Total Personel</span>
                                    <h3 id="stat-server-total-users"
                                        style="font-size: 1.4rem; font-weight: 700; margin-top: 2px;">0</h3>
                                </div>
                            </div>
                            <div class="card-glass stat-card"
                                style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
                                <div class="stat-icon-wrapper"
                                    style="width: 44px; height: 44px; border-radius: 12px; background: rgba(16, 185, 129, 0.12); color: #10b981; display: flex; align-items: center; justify-content: center;">
                                    <i data-lucide="wifi" style="width: 22px; height: 22px;"></i>
                                </div>
                                <div>
                                    <span class="text-secondary text-xs" style="font-weight: 500;">User Online</span>
                                    <h3 id="stat-server-online-users"
                                        style="font-size: 1.4rem; font-weight: 700; margin-top: 2px;">0</h3>
                                </div>
                            </div>
                        </div>

                        <!-- Search, Filter & View Mode Controls -->
                        <div class="card-glass"
                            style="padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between;">
                            <div
                                style="display: flex; gap: 0.75rem; align-items: center; flex: 1; min-width: 280px; flex-wrap: wrap;">
                                <div class="search-box" style="position: relative; width: 100%; max-width: 320px;">
                                    <i data-lucide="search"
                                        style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--text-muted);"></i>
                                    <input type="text" id="server-access-search"
                                        placeholder="Cari role, dept, username..."
                                        style="width: 100%; padding: 8px 12px 8px 36px; border-radius: 8px; border: 1px solid var(--card-border); background: var(--bg-surface); color: var(--text-primary); font-size: 0.85rem;">
                                </div>
                                <select id="server-access-filter-dept"
                                    style="padding: 8px 12px; border-radius: 8px; border: 1px solid var(--card-border); background: var(--bg-surface); color: var(--text-primary); font-size: 0.85rem; height: 36px;">
                                    <option value="">Semua Dept</option>
                                    <option value="ENG">ENG</option>
                                    <option value="PRD">PRD</option>
                                    <option value="EPR">EPR</option>
                                    <option value="GA">GA</option>
                                    <option value="QC">QC</option>
                                    <option value="WRH">WRH</option>
                                    <option value="TMB">TMB</option>
                                    <option value="EUT">EUT</option>
                                </select>
                                <select id="server-access-filter-status"
                                    style="padding: 8px 12px; border-radius: 8px; border: 1px solid var(--card-border); background: var(--bg-surface); color: var(--text-primary); font-size: 0.85rem; height: 36px;">
                                    <option value="">Semua Status</option>
                                    <option value="active">Aktif</option>
                                    <option value="suspended">Nonaktif / Suspend</option>
                                    <option value="online">Ada User Online</option>
                                </select>
                            </div>
                            <!-- View Toggle & Bulk Action -->
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                <button id="btn-server-access-bulk-default" type="button" class="btn btn-outline btn-xs"
                                    onclick="bulkResetAllUsersToDefaultRole()"
                                    style="display: none; padding: 6px 12px; border-radius: 8px; font-weight: 600; font-size: 0.78rem; border-color: rgba(6, 182, 212, 0.4); color: var(--color-cyan); gap: 6px; align-items: center; height: 32px;"
                                    title="Reset Hak Akses Seluruh Akun Personel ke Default Role & Dept">
                                    <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Bulk Reset to
                                    Default Role
                                </button>
                                <div
                                    style="display: flex; align-items: center; gap: 4px; background: rgba(255, 255, 255, 0.04); padding: 4px; border-radius: 10px; border: 1px solid var(--card-border);">
                                    <button id="server-access-mode-role" type="button" class="btn btn-xs"
                                        onclick="switchServerAccessViewMode('role')"
                                        style="padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 0.78rem; background: var(--color-cyan); color: #000;">
                                        <i data-lucide="layers" style="width: 14px; height: 14px;"></i> Per Role & Dept
                                    </button>
                                    <button id="server-access-mode-user" type="button" class="btn btn-xs"
                                        onclick="switchServerAccessViewMode('user')"
                                        style="padding: 6px 12px; border-radius: 6px; font-weight: 500; font-size: 0.78rem; background: transparent; color: var(--text-secondary);">
                                        <i data-lucide="user" style="width: 14px; height: 14px;"></i> Per Akun Personel
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- User Access Table Container -->
                        <div class="table-container card-glass">
                            <table class="data-table">
                                <thead id="server-access-table-head">
                                    <tr>
                                        <th>Dept</th>
                                        <th>Role / Otoritas</th>
                                        <th>Jumlah Akun</th>
                                        <th>User Terkait / Member</th>
                                        <th>Hak Akses Modul Role</th>
                                        <th>Status Role</th>
                                        <th style="text-align: right;">Aksi Kontrol</th>
                                    </tr>
                                </thead>
                                <tbody id="server-access-user-table-body">
                                    <!-- Dynamically rendered -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Container for Flowchart Editor View -->
                    <div id="server-access-flowchart-container" style="display: none;">
                        <!-- Dynamically rendered by renderFlowchartEditor() -->
                    </div>
                </section>


            </div>
        </main>
    </div>

    <!-- MODAL ALIHKAN DRAWING KE PROJECT (REVIEW ONLY) -->
    <div class="modal-backdrop" id="transfer-drawing-project-modal" style="display: none;">
        <div class="modal-card card-glass animate-in"
            style="max-width: 520px; width: 92%; padding: 0; overflow: hidden;">
            <!-- Header -->
            <div class="modal-header"
                style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--card-border); display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div
                        style="width: 42px; height: 42px; border-radius: 12px; background: rgba(0, 242, 254, 0.1); border: 1px solid rgba(0, 242, 254, 0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i data-lucide="external-link" style="width: 20px; height: 20px; color: var(--color-cyan);"></i>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <h3
                            style="margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary); line-height: 1.3;">
                            Alihkan ke Project Monitoring</h3>
                        <p style="margin: 0; font-size: 0.78rem; color: var(--text-muted); line-height: 1.3;">Transfer
                            Drawing EJO ke Fase 1 Project Review</p>
                    </div>
                </div>
                <button type="button" class="modal-close" onclick="closeTransferDrawingToProjectModal()"><i
                        data-lucide="x" style="width: 16px; height: 16px;"></i></button>
            </div>

            <!-- Form & Body -->
            <form id="transfer-drawing-project-form" onsubmit="submitTransferDrawingToProject(event)"
                style="margin: 0;">
                <div style="display: flex; flex-direction: column; gap: 1.25rem; padding: 1.25rem 1.5rem;">
                    <input type="hidden" id="transfer-drawing-id" value="" />

                    <!-- Card Info Drawing EJO -->
                    <div
                        style="background: rgba(0, 242, 254, 0.04); border: 1px solid var(--card-border); border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; gap: 8px;">
                        <div
                            style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
                            <span
                                style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; color: var(--text-muted);">Drawing
                                EJO</span>
                            <span id="transfer-drawing-info-id" class="ejo-id-badge"
                                style="font-size: 0.75rem; padding: 3px 10px; border-radius: 6px;">DRW-XXXXXX</span>
                        </div>
                        <div id="transfer-drawing-info-title"
                            style="font-weight: 600; color: var(--text-primary); font-size: 0.95rem; line-height: 1.4;">
                            Judul Drawing</div>
                    </div>

                    <!-- Input Field Deskripsi -->
                    <div class="form-field" style="display: flex; flex-direction: column; gap: 0;">
                        <div
                            style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <label for="transfer-project-desc"
                                style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin: 0;">Deskripsi
                                Project</label>
                            <span
                                style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">Opsional</span>
                        </div>
                        <textarea id="transfer-project-desc" class="form-control" rows="3"
                            placeholder="Masukkan catatan atau deskripsi project tambahan..."
                            style="width: 100%; box-sizing: border-box; resize: vertical; padding: 0.75rem 0.85rem; min-height: 90px; line-height: 1.5; font-size: 0.85rem; border-radius: 10px;"></textarea>
                    </div>

                    <!-- Alert Info Callout -->
                    <div
                        style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 0.85rem 1rem; font-size: 0.8rem; color: var(--text-secondary); display: flex; align-items: flex-start; gap: 12px; line-height: 1.5;">
                        <i data-lucide="info"
                            style="width: 20px; height: 20px; color: #f59e0b; flex-shrink: 0; margin-top: 1px;"></i>
                        <div style="flex: 1;">
                            Drawing EJO ini akan dimasukkan ke <strong style="color: var(--text-primary);">Fase 1
                                Project Monitoring (Review)</strong>.
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div
                    style="padding: 1rem 1.5rem 1.25rem; border-top: 1px solid var(--card-border); display: flex; justify-content: flex-end; align-items: center; gap: 12px;">
                    <button type="button" class="btn btn-outline" onclick="closeTransferDrawingToProjectModal()"
                        style="padding: 8px 18px; font-size: 0.85rem; height: 38px; border-radius: 8px;">Batal</button>
                    <button type="submit" class="btn btn-primary" id="btn-submit-transfer-drawing"
                        style="padding: 8px 20px; font-size: 0.85rem; height: 38px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; font-weight: 600;">
                        <i data-lucide="send" style="width: 14px; height: 14px;"></i> Alihkan ke Project
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODAL DETAIL EJO -->
    <div class="modal-backdrop" id="ejo-modal">
        <div class="modal-card card-glass animate-in">
            <div class="modal-header">
                <div class="ejo-header-badge">
                    <span id="modal-ejo-id" class="badge-ejo-code">EJO-2026-XXX</span>
                    <span id="modal-ejo-priority" class="badge">Priority</span>
                </div>
                <button class="modal-close" id="modal-close-btn"><i data-lucide="x"
                        style="width: 16px; height: 16px;"></i></button>
            </div>

            <div class="modal-body">
                <div class="modal-main-info">
                    <h2 id="modal-ejo-title">Judul Job Order</h2>
                    <p class="text-secondary" style="margin-top: 0.5rem;"><i data-lucide="map-pin"
                            style="width: 14px; height: 14px; display: inline; vertical-align: middle; margin-right: 4px;"></i>
                        Lokasi: <span id="modal-ejo-location">Boiler Room</span></p>

                    <div class="ejo-meta-fields">
                        <div class="meta-field">
                            <span class="meta-label"><i data-lucide="building"></i> Departemen Pemohon</span>
                            <span class="meta-value" id="modal-ejo-dept">PRD (Production)</span>
                        </div>
                        <div class="meta-field" id="modal-ejo-mid-field" style="display: none;">
                            <span class="meta-label"><i data-lucide="cpu"></i> Machine ID (MID)</span>
                            <span class="meta-value" id="modal-ejo-mid">-</span>
                        </div>
                        <div class="meta-field" id="modal-ejo-quantity-field" style="display: none;">
                            <span class="meta-label"><i data-lucide="package"></i> Jumlah Quantity Barang</span>
                            <span class="meta-value" id="modal-ejo-quantity">1</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-label"><i data-lucide="user"></i> Nama Pemohon</span>
                            <span class="meta-value" id="modal-ejo-requester">-</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-label"><i data-lucide="wrench"></i> Kategori Pekerjaan</span>
                            <span class="meta-value" id="modal-ejo-category">Mechanical</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-label"><i data-lucide="calendar"></i> Tanggal Dibuat</span>
                            <span class="meta-value" id="modal-ejo-created-date">-</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-label"><i data-lucide="calendar"></i> Target Selesai (Requester)</span>
                            <span class="meta-value" id="modal-ejo-target-date">28 Jun 2026</span>
                        </div>
                        <div class="meta-field" id="modal-ejo-est-date-field" style="display: none;">
                            <span class="meta-label"><i data-lucide="calendar-check"
                                    style="color: var(--color-green);"></i> Estimasi Selesai (Acceptor)</span>
                            <span class="meta-value" id="modal-ejo-est-date"
                                style="color: var(--color-green); font-weight: bold;">28 Jun 2026</span>
                        </div>
                        <!-- ponytail: dynamic field to show assigned engineer details -->
                        <div class="meta-field" id="modal-ejo-engineer-field" style="display: none;">
                            <span class="meta-label"><i data-lucide="wrench" style="color: var(--color-green);"></i>
                                Engineer (General)</span>
                            <span class="meta-value" id="modal-ejo-engineer"
                                style="color: var(--color-green); font-weight: bold;">-</span>
                        </div>
                        <div class="meta-field">
                            <span class="meta-label"><i data-lucide="activity"></i> Status Sekarang</span>
                            <span class="meta-value badge" id="modal-ejo-status">In Progress</span>
                        </div>

                        <!-- Repair Cost Analysis Card (Full Width) -->
                        <div class="cost-analysis-card" id="modal-ejo-cost-field" style="display: none;">
                            <div class="cost-analysis-header">
                                <i data-lucide="calculator"></i>
                                <span>Analisis Biaya Perbaikan (Repair Cost Analysis)</span>
                            </div>
                            <div class="cost-analysis-grid">
                                <div class="cost-stat-item">
                                    <span class="cost-stat-label">Harga by SAP</span>
                                    <span class="cost-stat-value" id="modal-ejo-price-new">-</span>
                                </div>
                                <div class="cost-stat-item">
                                    <span class="cost-stat-label">Durasi Pengerjaan</span>
                                    <span class="cost-stat-value" id="modal-ejo-duration">-</span>
                                </div>
                                <div class="cost-stat-item">
                                    <span class="cost-stat-label">Total Biaya Perbaikan</span>
                                    <span class="cost-stat-value" id="modal-ejo-cost-total">-</span>
                                </div>
                            </div>
                            <div class="cost-saving-banner">
                                <span class="cost-saving-label">Cost Saving (Penghematan):</span>
                                <span class="cost-saving-value" id="modal-ejo-saving">-</span>
                            </div>
                        </div>

                        <!-- Quantity Analysis Card (Full Width) -->
                        <div class="cost-analysis-card" id="modal-ejo-qty-analysis-field" style="display: none;">
                            <div class="cost-analysis-header">
                                <i data-lucide="boxes"></i>
                                <span>Rincian Kuantitas Barang (Quantity Analysis)</span>
                            </div>
                            <div class="cost-analysis-grid">
                                <div class="cost-stat-item">
                                    <span class="cost-stat-label">Qty Total</span>
                                    <span class="cost-stat-value" id="modal-ejo-qty-analysis-total">-</span>
                                </div>
                                <div class="cost-stat-item">
                                    <span class="cost-stat-label">Kebutuhan Mesin</span>
                                    <span class="cost-stat-value" id="modal-ejo-qty-analysis-needed">-</span>
                                </div>
                                <div class="cost-stat-item">
                                    <span class="cost-stat-label">Stok Gudang</span>
                                    <span class="cost-stat-value" id="modal-ejo-qty-analysis-stock">-</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="details-section">
                        <h4><i data-lucide="align-left" style="color: var(--color-cyan);"></i> Deskripsi Masalah / Ruang
                            Lingkup</h4>
                        <div class="details-desc-box" id="modal-ejo-desc">
                            Deskripsi pekerjaan secara mendetail akan ditampilkan di sini.
                        </div>
                    </div>

                    <!-- Alasan Urgent (Prioritas 1) -->
                    <div class="details-section" id="modal-ejo-urgent-section" style="display: none;">
                        <h4 style="color: var(--color-rose); border-bottom-color: rgba(244, 63, 94, 0.2);"><i
                                data-lucide="alert-triangle" style="color: var(--color-rose);"></i> Alasan Urgent</h4>
                        <div class="details-desc-box urgent-report-box" id="modal-ejo-urgent-reason">
                            Alasan urgent akan ditampilkan di sini.
                        </div>
                    </div>

                    <!-- Foto Before-->
                    <div class="details-section" id="modal-ejo-photo-before-section" style="display: none;">
                        <h4><i data-lucide="camera" style="color: var(--color-blue);"></i> Foto Before (Kondisi Awal)
                        </h4>
                        <div class="photo-before-container">
                            <a id="modal-ejo-photo-before-link" href="#" target="_blank" class="photo-before-wrapper">
                                <img id="modal-ejo-photo-before-img" src="" alt="Foto Before"
                                    class="photo-before-img" />
                                <span class="photo-preview-hint"><i data-lucide="zoom-in"
                                        style="width: 12px; height: 12px;"></i> Klik untuk memperbesar</span>
                            </a>
                        </div>
                    </div>

                    <!-- Foto After (Kondisi Setelah Pekerjaan) - rendered dynamically by renderModalGallery -->
                    <div class="details-section" id="modal-ejo-photo-after-section" style="display: none;">
                        <h4 style="color: var(--color-green); border-bottom-color: rgba(16, 185, 129, 0.15);"><i
                                data-lucide="camera" style="color: var(--color-green);"></i> Foto After (Kondisi Setelah
                            Pekerjaan)</h4>
                        <div id="modal-ejo-photo-after-gallery">
                            <!-- Dynamic Foto After gallery rendered by renderModalGallery() -->
                        </div>
                    </div>

                    <!-- Laporan Hasil Pekerjaan (Drafter/Engineer) -->
                    <div class="details-section" id="modal-ejo-completion-report-section" style="display: none;">
                        <h4 class="completion-section-title"><i data-lucide="check-circle-2"
                                style="color: var(--color-green);"></i> Laporan Hasil Pekerjaan (Drafter/Engineer)</h4>
                        <div class="details-desc-box completion-report-box" id="modal-ejo-completion-report">
                            Laporan penyelesaian pekerjaan akan ditampilkan di sini.
                        </div>
                    </div>

                    <!-- Instruksi/Alasan Revisi -->
                    <div class="details-section" id="modal-ejo-revision-instruction-section" style="display: none;">
                        <h4 class="revision-section-title"><i data-lucide="alert-circle"
                                style="color: var(--color-rose);"></i> Instruksi/Alasan Revisi (<span
                                id="modal-ejo-revision-role">Lead/Admin</span>)</h4>
                        <div class="details-desc-box revision-report-box" id="modal-ejo-revision-instruction">
                            Instruksi revisi akan ditampilkan di sini.
                        </div>
                    </div>

                    <!-- Signature approvals section for General EJOs -->
                    <div class="details-section" id="general-ejo-signatures-section" style="display: none;">
                        <h4><i data-lucide="check-square" style="color: var(--color-cyan);"></i> Tanda Tangan
                            Persetujuan (Approval)</h4>
                        <div id="general-ejo-signatures-container" class="signatures-grid">
                            <!-- Dynamic signatures list -->
                        </div>
                    </div>

                    <!-- Flow/Activity Logs -->
                    <div class="details-section">
                        <h4><i data-lucide="history" style="color: var(--color-cyan);"></i> Update Log Pekerjaan &
                            Progress</h4>
                        <div class="timeline" id="modal-ejo-logs">
                            <!-- Dynamic log milestones -->
                        </div>
                    </div>
                </div>

                <!-- Control sidebar for actions in Modal -->
                <div class="modal-action-sidebar">
                    <div class="action-card" id="card-assignment-finance">
                        <h4>Penugasan & Keuangan</h4>

                        <div class="form-field" style="margin-top: 1rem;">
                            <label>Engineer Lapangan (Bisa beberapa)</label>
                            <div id="modal-assignee-container" class="card-glass"
                                style="max-height: 120px; overflow-y: auto; padding: 0.5rem; display: flex; flex-direction: column; gap: 6px; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm);">
                                <!-- Checkboxes will be populated dynamically from populateEngineerDropdowns() -->
                            </div>
                        </div>

                        <div class="form-grid"
                            style="grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.75rem;">
                            <div class="form-field">
                                <label for="modal-est-cost">Est. Biaya (Rp)</label>
                                <input type="number" id="modal-est-cost" class="input-sm">
                            </div>
                            <div class="form-field">
                                <label for="modal-act-cost">Aktual Biaya (Rp)</label>
                                <input type="number" id="modal-act-cost" class="input-sm">
                            </div>
                        </div>
                    </div>

                    <div class="action-card" id="card-work-reports" style="margin-top: 1rem;">
                        <h4>Laporan & Log Pekerjaan</h4> <!-- ponytail: added template options for completion notes -->
                        <div class="form-field" style="margin-top: 0.75rem;">
                            <label for="modal-log-template">Template Laporan</label>
                            <select id="modal-log-template"
                                style="padding: 6px; font-size: 0.8rem; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); background: var(--bg-card); color: var(--text-main); width: 100%; box-sizing: border-box;">
                                <option value="">-- Pilih Template --</option>
                                <option value="selesai_normal">Pekerjaan Selesai Normal & Testing OK</option>
                                <option value="selesai_part">Selesai & Penggantian Spare Part</option>
                                <option value="selesai_catatan">Selesai dengan Catatan / Observasi</option>
                                <option value="progress_log">Catatan Progress / Kendala Lapangan</option>
                            </select>
                        </div>
                        <div class="form-field" style="margin-top: 0.75rem;">
                            <label for="modal-new-log">Catatan Pekerjaan Tambahan</label>
                            <textarea id="modal-new-log" rows="3"
                                placeholder="Tulis catatan perkembangan atau laporan penyelesaian di sini..."
                                style="width: 100%; padding: 8px; font-size: 0.8rem; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); background: var(--bg-card); color: var(--text-main); font-family: inherit; resize: vertical; box-sizing: border-box;"></textarea>
                        </div>
                        <div class="form-field" style="margin-top: 0.75rem;">
                            <label for="modal-attachment">Upload Foto After / Lampiran</label>
                            <div class="file-upload-mock" id="modal-upload-mock"
                                style="padding: 10px; font-size: 0.8rem; flex-direction: row; gap: 5px;">
                                <i data-lucide="camera" style="width: 16px; height: 16px;"></i>
                                <span id="modal-upload-span">Klik untuk upload foto after</span>
                                <input type="file" id="modal-attachment" style="display: none;" multiple
                                    accept="image/*,.pdf,.dwg,.doc,.docx,.xls,.xlsx,.zip,.rar">
                            </div>
                        </div>
                    </div>

                    <div class="action-card" id="card-status-update" style="margin-top: 1rem;">
                        <h4>Perbarui Status EJO</h4>
                        <div class="status-btn-group" id="modal-status-btn-group">
                            <button class="btn btn-outline btn-status-change" data-status="Requested">
                                <i data-lucide="circle-dot"></i> Requested
                            </button>
                            <button class="btn btn-outline btn-status-change" data-status="Checking">
                                <i data-lucide="thumbs-up"></i> Checking
                            </button>
                            <button class="btn btn-outline btn-status-change" data-status="In Progress">
                                <i data-lucide="play"></i> Start Work
                            </button>
                            <button class="btn btn-outline btn-status-change" data-status="Pending Approval">
                                <i data-lucide="clock"></i> Pending Approval
                            </button>
                            <button class="btn btn-outline btn-status-change" data-status="Completed">
                                <i data-lucide="check"></i> Complete Job
                            </button>
                            <button class="btn btn-outline btn-danger btn-status-change" data-status="Cancelled">
                                <i data-lucide="x-circle"></i> Cancel Job
                            </button>
                        </div>
                        <!-- ponytail: sub-options for Checking status -->
                        <div id="checking-sub-options"
                            style="display: none; margin-top: 0.75rem; padding: 0.75rem; border: 1px dashed var(--border-color); border-radius: var(--border-radius); background: rgba(0,0,0,0.02); gap: 0.5rem; flex-direction: column;">
                            <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Sub-status
                                Checking:</label>
                            <div style="display: flex; gap: 1.5rem; align-items: center;">
                                <label
                                    style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.85rem; cursor: pointer; color: var(--text-primary);">
                                    <input type="checkbox" name="checking-sub-type" value="Drawing Ready" checked>
                                    Drawing Ready
                                </label>
                                <label
                                    style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.85rem; cursor: pointer; color: var(--text-primary);">
                                    <input type="checkbox" name="checking-sub-type" value="Material"> Material
                                </label>
                            </div>
                        </div>
                        <div id="modal-revision-wrapper"
                            style="display: none; margin-top: 1rem; flex-direction: column; gap: 8px; width: 100%;">
                            <button class="btn btn-warning full-width" id="btn-request-revision"
                                style="display: none; font-weight: 600; padding: 0.75rem 1rem;">
                                <i data-lucide="refresh-cw"
                                    style="width: 16px; height: 16px; display: inline; vertical-align: middle; margin-right: 4px;"></i>
                                Ajukan Revisi Pekerjaan
                            </button>
                            <span class="text-secondary text-xs"
                                style="display: block; text-align: center; font-style: italic;"></span>
                        </div>
                    </div>

                    <button class="btn btn-primary glow-button full-width" id="btn-save-modal"
                        style="margin-top: 1.5rem;">
                        <i data-lucide="save"></i> Simpan Perubahan
                    </button>

                    <button class="btn btn-danger-outline full-width" id="btn-delete-ejo" style="margin-top: 0.75rem;">
                        <i data-lucide="trash-2"></i> Hapus EJO
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- ponytail: MODAL DETAIL REPAIR PART -->
    <div class="modal-backdrop" id="part-detail-modal">
        <div class="modal-card card-glass animate-in" style="max-width: 650px;">
            <div class="modal-header">
                <div class="ejo-header-badge">
                    <span id="modal-part-id" class="badge-ejo-code">PART-XXX</span>
                </div>
                <button class="modal-close" id="modal-part-close-btn">&times;</button>
            </div>

            <div class="modal-body" style="grid-template-columns: 1fr; gap: 1.5rem;">
                <div class="modal-main-info" style="border-right: none; padding-right: 0; width: 100%;">
                    <h2 id="modal-part-name">Nama Spare Part</h2>

                    <!-- Part Image / PDF Preview -->
                    <div id="modal-part-image-container" style="margin-top: 1.5rem; text-align: center; display: none;">
                        <img id="modal-part-image-preview" src=""
                            style="max-width: 100%; max-height: 250px; border-radius: var(--border-radius-md); border: 1px solid var(--card-border); object-fit: contain; display: none;" />
                        <iframe id="modal-part-pdf-preview" src=""
                            style="width: 100%; height: 400px; border-radius: var(--border-radius-md); border: 1px solid var(--card-border); display: none;"></iframe>
                    </div>

                    <div class="ejo-meta-fields" style="margin-top: 1.5rem;">
                        <div class="meta-field">
                            <span class="meta-label">Diupload Oleh</span>
                            <span class="meta-value" id="modal-part-uploader">--</span>
                        </div>
                    </div>

                    <h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600;">
                        Keterangan / Penggunaan</h3>
                    <div class="details-desc-box" id="modal-part-desc" style="min-height: 80px;">
                        Keterangan detail penggunaan spare part...
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ponytail: MODAL DETAIL PROJECT -->
    <div class="modal-backdrop" id="project-detail-modal"
        style="display: none; justify-content: center; align-items: center; z-index: 11000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);">
        <div class="modal-card card-glass animate-in"
            style="max-width: 1050px; width: 95%; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <div class="ejo-header-badge" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span id="modal-project-id" class="badge-ejo-code">PRJ-XXX</span>
                    <span id="modal-project-io-badge" style="display: none;"></span>
                    <span id="modal-project-moc-badge" style="display: none;"></span>
                    <span id="modal-project-drawing-badge" style="display: none;"></span>
                </div>
                <button class="modal-close" id="modal-project-close-btn">&times;</button>
            </div>

            <div class="modal-body" style="grid-template-columns: 1fr; gap: 1.5rem;">
                <div class="modal-main-info" style="border-right: none; padding-right: 0; width: 100%;">
                    <h2 id="modal-project-title">Commisioning &amp; Serah Terima Project</h2>
                    <p class="text-secondary" style="margin-top: -0.25rem; font-size: 0.85rem;">
                        <i data-lucide="user"
                            style="width: 14px; height: 14px; display: inline; vertical-align: middle; margin-right: 4px;"></i>
                        Pengusul: <strong id="modal-project-pic" style="color: var(--text-primary);">Foreman</strong> |
                        Dept: <strong id="modal-project-dept" style="color: var(--text-primary);">PRD</strong>
                    </p>
                    <div
                        style="margin-top: 0.5rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                        <span id="modal-project-phase" class="badge badge-accent">Fase 1: Inisialisasi Ide</span>
                        <span id="modal-project-custom-status"></span>
                    </div>
                    <p id="modal-project-desc"
                        style="font-size: 0.88rem; line-height: 1.5; color: var(--text-primary); margin-bottom: 1rem;">
                    </p>

                    <!-- BOQ Section in Project Details Modal -->
                    <div id="project-boq-docs-sec"
                        style="margin-top: 1rem; border-top: 1px solid var(--card-border); padding-top: 1rem;">
                        <h3
                            style="margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; justify-content: space-between; color: var(--color-cyan);">
                            <span style="display: flex; align-items: center; gap: 6px;"><i data-lucide="paperclip"
                                    style="width:16px;height:16px;"></i> Dokumen BOQ (Bill of Quantities)</span>
                            <span id="modal-boq-upload-btn-container"></span>
                        </h3>
                        <div id="project-boq-gallery"
                            style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                            <!-- Injected dynamically -->
                        </div>
                    </div>

                    <!-- ponytail: Procurement PR / PO / GR Section in Project Details Modal (Phase 2 Only) -->
                    <div id="project-procurement-sec"
                        style="margin-top: 1rem; border-top: 1px solid var(--card-border); padding-top: 1rem; display: none;">
                        <h3
                            style="margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; justify-content: space-between; color: var(--color-green);">
                            <span style="display: flex; align-items: center; gap: 6px;"><i data-lucide="shopping-bag"
                                    style="width:16px;height:16px;"></i> Detail Status Procurement (PR / PO / GR)</span>
                            <span id="modal-procurement-edit-btn-container"></span>
                        </h3>
                        <div id="project-procurement-content">
                            <!-- Injected dynamically for Phase 2 -->
                        </div>
                    </div>

                    <!-- ponytail: Timeline Section in Project Details Modal (Phase 3 Only) -->
                    <div id="project-timeline-sec"
                        style="margin-top: 1rem; border-top: 1px solid var(--card-border); padding-top: 1rem; display: none;">
                        <h3
                            style="margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; justify-content: space-between; color: #f59e0b;">
                            <span style="display: flex; align-items: center; gap: 6px;"><i data-lucide="calendar"
                                    style="width:16px;height:16px;"></i> Timeline Eksekusi Proyek</span>
                            <span id="modal-timeline-edit-btn-container"></span>
                        </h3>
                        <div id="project-timeline-content">
                            <!-- Injected dynamically for Phase 3 -->
                        </div>
                    </div>



                    <!-- Berita Acara Handover Section (Moved right under Description) -->
                    <div id="project-handover-docs-sec"
                        style="margin-top: 1.5rem; display: none; border-top: 1px solid var(--card-border); padding-top: 1.25rem;">
                        <h3
                            style="margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                            <i data-lucide="file-check" style="width:16px;height:16px;color: var(--color-green);"></i>
                            Dokumen Form Berita Acara Serah Terima Pekerjaan
                        </h3>
                        <div id="project-handover-gallery"
                            style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                            <!-- Injected dynamically -->
                        </div>

                        <!-- ponytail: Berita Acara Handover Signatures Grid (6 Roles) -->
                        <div id="project-handover-signatures-sec"
                            style="display: flex; flex-direction: column; gap: 10px; width: 100%; margin-top: 1.25rem; padding: 1rem; background: var(--bg-tertiary); border: 1px solid var(--card-border); border-radius: var(--border-radius-md); box-sizing: border-box;">
                            <div
                                style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 10px;">
                                <span
                                    style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;">
                                    <i data-lucide="pen-tool"
                                        style="width: 16px; height: 16px; color: var(--color-cyan);"></i>
                                    Tanda Tangan Berita Acara Serah Terima (6 Pihak)
                                </span>
                                <span id="project-handover-sig-status" class="badge badge-accent"
                                    style="font-size: 0.72rem; padding: 4px 10px; border-radius: 20px; font-weight: 600;">-</span>
                            </div>

                            <!-- 6 Signature Cards Grid -->
                            <div
                                style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; width: 100%; margin-top: 6px;">
                                <!-- Staff ENG -->
                                <div class="card-glass" id="card-proj-handover-sig-staff_eng"
                                    style="padding: 10px; display: flex; flex-direction: column; gap: 6px; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); font-size: 0.75rem; background: var(--bg-secondary);">
                                    <span
                                        style="font-size: 0.65rem; font-weight: 700; color: var(--color-cyan); text-transform: uppercase; letter-spacing: 0.5px;">Dibuat
                                        Oleh:</span>
                                    <span
                                        style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase;">STAFF
                                        ENG</span>
                                    <div id="proj-handover-sig-img-container-staff_eng"
                                        style="min-height: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--bg-primary); border-radius: var(--border-radius-sm); padding: 4px; border: 1px dashed var(--card-border); margin: 2px 0;">
                                        <span
                                            style="font-size: 0.68rem; color: var(--text-muted); font-style: italic;">Belum
                                            TTD</span>
                                    </div>
                                    <div id="proj-handover-sig-info-staff_eng"
                                        style="font-size: 0.68rem; line-height: 1.3; min-height: 28px; display: flex; flex-direction: column; justify-content: center; color: var(--text-secondary);">
                                        Menunggu TTD</div>
                                </div>

                                <!-- SPV ENG -->
                                <div class="card-glass" id="card-proj-handover-sig-spv_eng"
                                    style="padding: 10px; display: flex; flex-direction: column; gap: 6px; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); font-size: 0.75rem; background: var(--bg-secondary);">
                                    <span
                                        style="font-size: 0.65rem; font-weight: 700; color: var(--color-cyan); text-transform: uppercase; letter-spacing: 0.5px;">Diketahui
                                        Oleh:</span>
                                    <span
                                        style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase;">SPV
                                        ENG</span>
                                    <div id="proj-handover-sig-img-container-spv_eng"
                                        style="min-height: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--bg-primary); border-radius: var(--border-radius-sm); padding: 4px; border: 1px dashed var(--card-border); margin: 2px 0;">
                                        <span
                                            style="font-size: 0.68rem; color: var(--text-muted); font-style: italic;">Belum
                                            TTD</span>
                                    </div>
                                    <div id="proj-handover-sig-info-spv_eng"
                                        style="font-size: 0.68rem; line-height: 1.3; min-height: 28px; display: flex; flex-direction: column; justify-content: center; color: var(--text-secondary);">
                                        Menunggu TTD</div>
                                </div>

                                <!-- Manager ENG -->
                                <div class="card-glass" id="card-proj-handover-sig-manager_eng"
                                    style="padding: 10px; display: flex; flex-direction: column; gap: 6px; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); font-size: 0.75rem; background: var(--bg-secondary);">
                                    <span
                                        style="font-size: 0.65rem; font-weight: 700; color: var(--color-cyan); text-transform: uppercase; letter-spacing: 0.5px;">Disetujui
                                        Oleh:</span>
                                    <span
                                        style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase;">MANAGER
                                        ENG</span>
                                    <div id="proj-handover-sig-img-container-manager_eng"
                                        style="min-height: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--bg-primary); border-radius: var(--border-radius-sm); padding: 4px; border: 1px dashed var(--card-border); margin: 2px 0;">
                                        <span
                                            style="font-size: 0.68rem; color: var(--text-muted); font-style: italic;">Belum
                                            TTD</span>
                                    </div>
                                    <div id="proj-handover-sig-info-manager_eng"
                                        style="font-size: 0.68rem; line-height: 1.3; min-height: 28px; display: flex; flex-direction: column; justify-content: center; color: var(--text-secondary);">
                                        Menunggu TTD</div>
                                </div>

                                <!-- Manager User -->
                                <div class="card-glass" id="card-proj-handover-sig-manager_user"
                                    style="padding: 10px; display: flex; flex-direction: column; gap: 6px; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); font-size: 0.75rem; background: var(--bg-secondary);">
                                    <span
                                        style="font-size: 0.65rem; font-weight: 700; color: var(--color-yellow); text-transform: uppercase; letter-spacing: 0.5px;">Disetujui
                                        Oleh:</span>
                                    <span
                                        style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase;">MANAGER
                                        USER</span>
                                    <div id="proj-handover-sig-img-container-manager_user"
                                        style="min-height: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--bg-primary); border-radius: var(--border-radius-sm); padding: 4px; border: 1px dashed var(--card-border); margin: 2px 0;">
                                        <span
                                            style="font-size: 0.68rem; color: var(--text-muted); font-style: italic;">Belum
                                            TTD</span>
                                    </div>
                                    <div id="proj-handover-sig-info-manager_user"
                                        style="font-size: 0.68rem; line-height: 1.3; min-height: 28px; display: flex; flex-direction: column; justify-content: center; color: var(--text-secondary);">
                                        Menunggu TTD</div>
                                </div>

                                <!-- SPV User -->
                                <div class="card-glass" id="card-proj-handover-sig-spv_user"
                                    style="padding: 10px; display: flex; flex-direction: column; gap: 6px; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); font-size: 0.75rem; background: var(--bg-secondary);">
                                    <span
                                        style="font-size: 0.65rem; font-weight: 700; color: var(--color-yellow); text-transform: uppercase; letter-spacing: 0.5px;">Diketahui
                                        Oleh:</span>
                                    <span
                                        style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase;">SPV
                                        USER</span>
                                    <div id="proj-handover-sig-img-container-spv_user"
                                        style="min-height: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--bg-primary); border-radius: var(--border-radius-sm); padding: 4px; border: 1px dashed var(--card-border); margin: 2px 0;">
                                        <span
                                            style="font-size: 0.68rem; color: var(--text-muted); font-style: italic;">Belum
                                            TTD</span>
                                    </div>
                                    <div id="proj-handover-sig-info-spv_user"
                                        style="font-size: 0.68rem; line-height: 1.3; min-height: 28px; display: flex; flex-direction: column; justify-content: center; color: var(--text-secondary);">
                                        Menunggu TTD</div>
                                </div>

                                <!-- Staff User -->
                                <div class="card-glass" id="card-proj-handover-sig-staff_user"
                                    style="padding: 10px; display: flex; flex-direction: column; gap: 6px; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); font-size: 0.75rem; background: var(--bg-secondary);">
                                    <span
                                        style="font-size: 0.65rem; font-weight: 700; color: var(--color-yellow); text-transform: uppercase; letter-spacing: 0.5px;">Diterima
                                        Oleh:</span>
                                    <span
                                        style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase;">STAFF
                                        USER</span>
                                    <div id="proj-handover-sig-img-container-staff_user"
                                        style="min-height: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--bg-primary); border-radius: var(--border-radius-sm); padding: 4px; border: 1px dashed var(--card-border); margin: 2px 0;">
                                        <span
                                            style="font-size: 0.68rem; color: var(--text-muted); font-style: italic;">Belum
                                            TTD</span>
                                    </div>
                                    <div id="proj-handover-sig-info-staff_user"
                                        style="font-size: 0.68rem; line-height: 1.3; min-height: 28px; display: flex; flex-direction: column; justify-content: center; color: var(--text-secondary);">
                                        Menunggu TTD</div>
                                </div>
                            </div>

                            <!-- Action Bar to Sign for Logged-in User -->
                            <div id="proj-handover-sign-action-bar"
                                style="display: none; width: 100%; margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--card-border); justify-content: flex-end;">
                                <button id="proj-handover-btn-sign" type="button" class="btn btn-primary btn-sm"
                                    style="display: inline-flex; align-items: center; gap: 8px; font-weight: 600; padding: 8px 16px; border-radius: var(--border-radius-sm); box-shadow: var(--shadow-sm);">
                                    <i data-lucide="pen-tool" style="width: 15px; height: 15px;"></i>
                                    <span>Tanda Tangani Berita Acara</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Phase 1 Idea Approvals Section -->
                    <div id="project-phase1-signatures-sec">
                        <h3
                            style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; justify-content: space-between;">
                            <span>Persetujuan Bertingkat (Fase 1)</span>
                            <span id="modal-project-sig-status"
                                style="font-size: 0.7rem; font-weight: normal; color: var(--color-cyan); background: rgba(0, 242, 254, 0.1); padding: 2px 8px; border-radius: 12px; border: 1px solid rgba(0, 242, 254, 0.2);"></span>
                        </h3>
                        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 0.5rem;">
                            <!-- PIC Card -->
                            <div class="card-glass" id="card-proj-sig-pic"
                                style="padding: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--card-border); border-radius: var(--border-radius-md);">
                                <div>
                                    <div id="proj-sig-title-pic"
                                        style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary);">
                                        PENGUSUL
                                        / REQUESTOR</div>
                                    <div id="proj-sig-info-pic"
                                        style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Menunggu
                                    </div>
                                </div>
                                <div id="proj-sig-img-container-pic"
                                    style="display: flex; align-items: center; gap: 8px;">
                                </div>
                            </div>

                            <!-- Foreman Card -->
                            <div class="card-glass" id="card-proj-sig-foreman"
                                style="padding: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--card-border); border-radius: var(--border-radius-md);">
                                <div>
                                    <div id="proj-sig-title-foreman"
                                        style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary);">
                                        FOREMAN ENG
                                    </div>
                                    <div id="proj-sig-info-foreman"
                                        style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Menunggu
                                    </div>
                                </div>
                                <div id="proj-sig-img-container-foreman"
                                    style="display: flex; align-items: center; gap: 8px;"></div>
                            </div>

                            <!-- Supervisor Card -->
                            <div class="card-glass" id="card-proj-sig-supervisor"
                                style="padding: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--card-border); border-radius: var(--border-radius-md);">
                                <div>
                                    <div id="proj-sig-title-supervisor"
                                        style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary);">
                                        SUPERVISOR ENG</div>
                                    <div id="proj-sig-info-supervisor"
                                        style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Menunggu
                                    </div>
                                </div>
                                <div id="proj-sig-img-container-supervisor"
                                    style="display: flex; align-items: center; gap: 8px;"></div>
                            </div>

                            <!-- Manager Card -->
                            <div class="card-glass" id="card-proj-sig-manager"
                                style="padding: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--card-border); border-radius: var(--border-radius-md);">
                                <div>
                                    <div id="proj-sig-title-manager"
                                        style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary);">
                                        MANAGER ENG
                                    </div>
                                    <div id="proj-sig-info-manager"
                                        style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Menunggu
                                    </div>
                                </div>
                                <div id="proj-sig-img-container-manager"
                                    style="display: flex; align-items: center; gap: 8px;"></div>
                            </div>
                        </div>
                    </div>



                    <!-- Documentation Photos Section -->
                    <div id="project-documentation-section"
                        style="margin-top: 1.5rem; display: none; border-top: 1px solid var(--card-border); padding-top: 1.25rem;">
                        <h3 style="margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600;">Foto Dokumentasi
                            Eksekusi</h3>
                        <div id="project-docs-gallery"
                            style="display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; margin-bottom: 12px;">
                            <!-- Injected dynamically -->
                        </div>
                        <div class="file-upload-mock" id="proj-doc-upload-mock"
                            style="padding: 12px; font-size: 0.8rem; flex-direction: row; gap: 8px; cursor: pointer; border: 1px dashed var(--card-border); border-radius: var(--border-radius-sm); display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.02); transition: background 0.2s;">
                            <i data-lucide="camera" style="width: 16px; height: 16px;"></i>
                            <span>Unggah Foto Dokumentasi</span>
                        </div>
                        <input type="file" id="proj-doc-file-input" style="display: none;" accept="image/*" multiple>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>

    <!-- ponytail: MODAL DETAIL DRAWING -->
    <div class="modal-backdrop" id="drawing-detail-modal"
        style="display: none; justify-content: center; align-items: center; z-index: 11000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);">
        <div class="modal-card card-glass animate-in" style="max-width: 900px; width: 95%;">
            <div class="modal-header">
                <div class="ejo-header-badge">
                    <span id="modal-drawing-id" class="badge-ejo-code">EJO-XXX</span>
                    <span id="modal-drawing-category-badge" class="badge"
                        style="background: rgba(6, 182, 212, 0.15); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.3); font-size: 0.8rem; font-weight: 600; padding: 3px 10px; border-radius: 4px; display: none;">-</span>
                    <span id="modal-drawing-type-badge" class="badge" style="display: none;">Request</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button class="btn btn-primary btn-xs" id="modal-drawing-locate-btn"
                        style="display: none; padding: 5px 10px; font-size: 0.75rem; align-items: center; gap: 4px; font-weight: 600;"
                        title="Buka &amp; Filter di Kanban Drawing">
                        <i data-lucide="external-link" style="width: 12px; height: 12px;"></i>
                        <span>Detail</span>
                    </button>
                    <button class="modal-close" id="modal-drawing-close-btn">&times;</button>
                </div>
            </div>

            <div class="modal-body modal-drawing-body">
                <!-- Left Panel: Preview & Metadata -->
                <div class="modal-main-info modal-drawing-main-info">
                    <div id="modal-drawing-project-banner" style="display: none;"></div>
                    <div id="modal-drawing-rejection-banner" style="display: none; margin-bottom: 0.85rem;">
                        <div
                            style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 10px; padding: 0.75rem 1rem; width: 100%; box-sizing: border-box; display: flex; flex-direction: column; gap: 6px;">
                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                                <div
                                    style="display: flex; align-items: center; gap: 8px; color: #ef4444; font-weight: 700; font-size: 0.88rem;">
                                    <i data-lucide="alert-triangle"
                                        style="width: 18px; height: 18px; flex-shrink: 0;"></i>
                                    <span id="modal-drawing-rejection-title">Drawing Dikembalikan / Ditolak</span>
                                </div>
                                <span id="modal-drawing-rejection-date"
                                    style="font-size: 0.73rem; color: var(--text-muted); font-weight: 500;">-</span>
                            </div>
                            <div style="font-size: 0.82rem; color: var(--text-primary); line-height: 1.4;">
                                <strong>Dikembalikan oleh:</strong> <span id="modal-drawing-rejection-by"
                                    style="color: #f87171; font-weight: 600;">-</span>
                            </div>
                            <div style="font-size: 0.82rem; color: var(--text-secondary); background: rgba(0,0,0,0.25); border-left: 3px solid #ef4444; padding: 8px 10px; border-radius: 6px; font-style: italic; margin-top: 2px;"
                                id="modal-drawing-rejection-reason">
                                "-"
                            </div>
                        </div>
                    </div>
                    <h2 id="modal-drawing-title">Judul Drawing</h2>
                    <p class="text-secondary" style="margin-top: -0.25rem; font-size: 0.85rem;">
                        <i data-lucide="user"
                            style="width: 14px; height: 14px; display: inline; vertical-align: middle; margin-right: 4px;"></i>
                        Uploaded by: <span id="modal-drawing-uploader">Drafter</span>
                        &bull; <span id="modal-drawing-date">28 Jun 2026</span>
                        <span id="modal-drawing-cat-wrapper" style="display: none;">&bull; Kategori: <strong
                                id="modal-drawing-category" style="color: var(--color-cyan);">-</strong></span>
                        <span id="modal-drawing-loc-wrapper" style="display: none;">&bull; Lokasi: <strong
                                id="modal-drawing-location" style="color: var(--text-primary);">-</strong></span>
                        &bull; Target Selesai: <strong id="modal-drawing-target-date"
                            style="color: var(--text-primary);">-</strong>
                        <span id="modal-drawing-est-date-wrapper" style="display: none;">&bull; Est. Selesai: <strong
                                id="modal-drawing-est-date" style="color: var(--color-green);">-</strong></span>
                    </p>

                    <!-- Drawing File Preview -->
                    <div id="modal-drawing-preview-container" class="card-glass"
                        style="padding: 0.5rem; display: flex; align-items: center; justify-content: center; min-height: 350px; background: rgba(0,0,0,0.2); border-radius: var(--border-radius-md); overflow: hidden; border: 1px solid var(--card-border);">
                        <!-- Will be populated dynamically by JS -->
                    </div>

                    <!-- Action buttons -->
                    <div style="display: flex; gap: 10px; margin-top: 0.5rem; width: 100%;">
                        <a id="modal-drawing-download-link" href="#" target="_blank" class="btn btn-secondary"
                            style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 0.6rem; text-decoration: none;">
                            <i data-lucide="download" style="width: 16px; height: 16px;"></i>
                            <span>Unduh File</span>
                        </a>
                        <!-- ponytail: tombol batalkan drawing (hanya tampil di fase Schedule) -->
                        <button id="modal-drawing-cancel-btn" class="btn btn-outline"
                            style="color: var(--color-yellow); border-color: rgba(234, 179, 8, 0.4); flex: 1; display: none; align-items: center; justify-content: center; gap: 6px; padding: 0.6rem;">
                            <i data-lucide="ban" style="width: 16px; height: 16px;"></i>
                            <span>Batalkan</span>
                        </button>
                    </div>


                </div>

                <!-- Right Panel: Signatures & Logs -->
                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <!-- Penugasan Section -->
                    <div class="card-glass" id="card-drawing-assignment"
                        style="padding: 12px; border: 1px solid var(--card-border); border-radius: var(--border-radius-md); display: flex; flex-direction: column; gap: 8px;">
                        <h3
                            style="margin-bottom: 0.25rem; font-size: 0.95rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.5px;">
                            Penugasan</h3>

                        <!-- View mode (for non-leads or general view) -->
                        <div id="drawing-assignment-view" style="font-size: 0.8rem; color: var(--text-secondary);">
                            Ditugaskan kepada: <strong id="drawing-assignee-name"
                                style="color: var(--text-primary);">Belum ditugaskan</strong>
                        </div>

                        <!-- Edit mode (for Leads) -->
                        <div id="drawing-assignment-edit"
                            style="display: none; flex-direction: column; gap: 8px; width: 100%; box-sizing: border-box;">
                            <div
                                style="font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                                Pilih Drafter yang Ditugaskan:</div>
                            <div id="modal-drawing-assignee-container"
                                style="max-height: 180px; overflow-y: auto; display: flex; flex-direction: column; width: 100%; box-sizing: border-box; padding-right: 4px; gap: 6px; margin-bottom: 6px;">
                                <!-- Will be populated dynamically by JS -->
                            </div>
                            <button id="modal-drawing-save-assignee-btn" class="btn btn-primary"
                                style="padding: 6px 12px; font-size: 0.8rem; width: 100%; display: flex; align-items: center; justify-content: center; gap: 4px;">
                                <i data-lucide="save" style="width: 14px; height: 14px;"></i>
                                <span>Simpan Penugasan</span>
                            </button>
                        </div>
                    </div>

                    <!-- Approval Signatures Block -->
                    <div>
                        <h3
                            style="margin-bottom: 0.75rem; font-size: 0.95rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.5px;">
                            Persetujuan Bertingkat</h3>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <!-- Requester Card -->
                            <div class="card-glass" id="card-sig-requester"
                                style="padding: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--card-border); border-radius: var(--border-radius-md);">
                                <div>
                                    <div id="sig-title-requester"
                                        style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary);">
                                        STAFF (DEPT)</div>
                                    <div id="sig-info-requester"
                                        style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Menunggu
                                    </div>
                                </div>
                                <div id="sig-img-container-requester"
                                    style="display: flex; align-items: center; gap: 8px;">
                                    <!-- Canvas or Image signature -->
                                </div>
                            </div>

                            <!-- Atasan Dept User Card -->
                            <div class="card-glass" id="card-sig-dept"
                                style="padding: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--card-border); border-radius: var(--border-radius-md);">
                                <div>
                                    <div class="sig-title" id="sig-title-dept"
                                        style="font-weight: 700; font-size: 0.82rem; color: var(--text-primary); text-transform: uppercase;">
                                        SPV (DEPT)</div>
                                    <div id="sig-info-dept"
                                        style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Menunggu
                                    </div>
                                </div>
                                <div id="sig-img-container-dept" style="display: flex; align-items: center; gap: 8px;">
                                    <!-- Canvas or Image signature -->
                                </div>
                            </div>

                            <!-- Foreman Card -->
                            <div class="card-glass" id="card-sig-foreman"
                                style="padding: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--card-border); border-radius: var(--border-radius-md);">
                                <div>
                                    <div id="sig-title-foreman"
                                        style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary);">
                                        FOREMAN ENG</div>
                                    <div id="sig-info-foreman"
                                        style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Menunggu
                                    </div>
                                </div>
                                <div id="sig-img-container-foreman"
                                    style="display: flex; align-items: center; gap: 8px;">
                                    <!-- Canvas or Image signature -->
                                </div>
                            </div>

                            <!-- Supervisor Card -->
                            <div class="card-glass" id="card-sig-supervisor"
                                style="padding: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--card-border); border-radius: var(--border-radius-md);">
                                <div>
                                    <div id="sig-title-supervisor"
                                        style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary);">
                                        SUPERVISOR ENG</div>
                                    <div id="sig-info-supervisor"
                                        style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Menunggu
                                    </div>
                                </div>
                                <div id="sig-img-container-supervisor"
                                    style="display: flex; align-items: center; gap: 8px;">
                                    <!-- Canvas or Image signature -->
                                </div>
                            </div>

                            <!-- Manager Card -->
                            <div class="card-glass" id="card-sig-manager"
                                style="padding: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--card-border); border-radius: var(--border-radius-md);">
                                <div>
                                    <div id="sig-title-manager"
                                        style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary);">
                                        MANAGER ENG</div>
                                    <div id="sig-info-manager"
                                        style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Menunggu
                                    </div>
                                </div>
                                <div id="sig-img-container-manager"
                                    style="display: flex; align-items: center; gap: 8px;">
                                    <!-- Canvas or Image signature -->
                                </div>
                            </div>

                            <!-- Factory Manager Card -->
                            <div class="card-glass" id="card-sig-factory_manager"
                                style="padding: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--card-border); border-radius: var(--border-radius-md);">
                                <div>
                                    <div id="sig-title-factory_manager"
                                        style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary);">
                                        FACTORY MANAGER</div>
                                    <div id="sig-info-factory_manager"
                                        style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Menunggu
                                    </div>
                                </div>
                                <div id="sig-img-container-factory_manager"
                                    style="display: flex; align-items: center; gap: 8px;">
                                    <!-- Canvas or Image signature -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions for active role -->
                    <div id="modal-drawing-action-section" class="card-glass"
                        style="display: none !important; padding: 12px; border: 1px solid var(--card-border); background: rgba(6, 182, 212, 0.05); border-radius: var(--border-radius-md);">
                        <div
                            style="font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">
                            Tindakan Anda sebagai <span id="modal-drawing-active-role">Role</span>:</div>
                        <div style="display: flex; gap: 8px; width: 100%;">
                            <button id="modal-drawing-reject-btn" class="btn btn-outline"
                                style="flex: 1; color: var(--color-red); border-color: rgba(239, 68, 68, 0.4); padding: 8px 12px; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 4px;">
                                <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                                <span>Tolak</span>
                            </button>
                            <button id="modal-drawing-approve-btn" class="btn btn-primary"
                                style="flex: 1; padding: 8px 12px; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 4px; font-weight: 600;">
                                <i data-lucide="check" style="width: 14px; height: 14px;"></i>
                                <span>Setujui</span>
                            </button>
                        </div>
                    </div>

                    <!-- ponytail: Archive action section -->
                    <div id="modal-drawing-archive-section" class="card-glass"
                        style="display: none; padding: 12px; border: 1px solid var(--card-border); background: rgba(16, 185, 129, 0.05); border-radius: var(--border-radius-md); margin-top: 10px;">
                        <button id="modal-drawing-archive-btn" class="btn btn-primary animate-pulse"
                            style="width: 100%; padding: 6px 12px; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 4px; background: var(--color-green); border-color: var(--color-green);">
                            <i data-lucide="archive" style="width: 14px; height: 14px;"></i>
                            Arsipkan Drawing (Archive)
                        </button>
                    </div>

                    <!-- Logs Timeline -->
                    <div style="display: flex; flex-direction: column; flex: 1; min-height: 150px;">
                        <h3
                            style="margin-bottom: 0.75rem; font-size: 0.95rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.5px;">
                            Log Aktifitas</h3>
                        <div class="timeline" id="modal-drawing-logs"
                            style="max-height: 200px; overflow-y: auto; padding-right: 4px;">
                            <!-- Logs will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ponytail: Custom Confirm Modal -->
    <div id="custom-confirm-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 11000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);">
        <div class="card-glass animate-in"
            style="width: 90%; max-width: 400px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; align-items: center; text-align: center;">
            <div style="background: rgba(6, 182, 212, 0.1); color: var(--color-cyan); width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center;"
                id="confirm-icon-wrapper">
                <i data-lucide="help-circle" style="width: 24px; height: 24px;"></i>
            </div>
            <h4 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);"
                id="confirm-modal-title">Konfirmasi Tindakan</h4>
            <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;"
                id="confirm-modal-message">Apakah Anda yakin?</p>
            <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.5rem;">
                <button class="btn btn-outline full-width" id="confirm-btn-cancel"
                    style="padding: 0.6rem;">Batal</button>
                <button class="btn btn-primary full-width" id="confirm-btn-ok"
                    style="padding: 0.6rem; font-weight: 600;">Ya, Lanjutkan</button>
            </div>
        </div>
    </div>

    <!-- Modal Justifikasi EJO Urgent (Prioritas 1) -->
    <div id="urgent-reason-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 11500; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);">
        <div class="card-glass animate-in"
            style="width: 90%; max-width: 440px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; align-items: flex-start; text-align: left; box-shadow: var(--shadow-lg);">
            <div style="display: flex; gap: 0.65rem; align-items: center; width: 100%;">
                <div
                    style="background: rgba(244, 63, 94, 0.1); color: var(--color-rose); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i data-lucide="alert-triangle" style="width: 18px; height: 18px;"></i>
                </div>
                <div>
                    <h4 style="margin: 0; font-size: 1rem; font-weight: 700; color: var(--text-primary);">Alasan Urgent
                        (Prioritas 1)</h4>
                </div>
            </div>

            <div style="width: 100%;">
                <label
                    style="font-size: 0.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; display: block;">
                    Alasan Urgent <span class="required">*</span>
                </label>
                <textarea id="urgent-reason-input"
                    placeholder="Contoh: Line Stop pada Line 2, Bahaya K3/HSE/PEST, atau potensi kerusakan berat..."
                    style="width: 100%; padding: 0.65rem 0.75rem; font-size: 0.88rem; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); background: var(--bg-main); color: var(--text-primary); font-family: inherit; resize: vertical; box-sizing: border-box;"
                    rows="3"></textarea>
                <span id="urgent-reason-error"
                    style="color: var(--color-rose); font-size: 0.75rem; display: none; margin-top: 4px; font-weight: 600;">
                    <i data-lucide="alert-circle" style="width: 12px; height: 12px; vertical-align: middle;"></i> Alasan
                    urgent wajib diisi!
                </span>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.5rem; width: 100%; margin-top: 0.25rem;">
                <button type="button" class="btn btn-secondary btn-sm" id="btn-cancel-urgent-reason">Batal</button>
                <button type="button" class="btn btn-primary btn-sm" id="btn-submit-urgent-reason"
                    style="background: var(--color-rose); border-color: var(--color-rose);">
                    Simpan
                </button>
            </div>
        </div>
    </div>

    <!-- ponytail: Custom Prompt Modal -->
    <div id="custom-prompt-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 11000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);">
        <div class="card-glass animate-in"
            style="width: 90%; max-width: 450px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; text-align: left; box-shadow: var(--shadow-lg);">
            <div style="display: flex; gap: 0.75rem; align-items: center; width: 100%;">
                <div
                    style="background: rgba(6, 182, 212, 0.1); color: var(--color-cyan); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="edit-3" style="width: 18px; height: 18px;"></i>
                </div>
                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);"
                    id="prompt-modal-title">Input Data</h4>
            </div>
            <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; white-space: pre-line; width: 100%;"
                id="prompt-modal-message">Silakan isi data berikut:</p>
            <div style="width: 100%;">
                <textarea id="prompt-modal-input"
                    style="width: 100%; padding: 0.75rem; font-size: 0.9rem; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); background: var(--bg-main); color: var(--text-primary); font-family: inherit; resize: vertical; box-sizing: border-box;"
                    rows="3"></textarea>
            </div>
            <!-- ponytail: premium file upload container for revisions -->
            <div id="prompt-modal-upload-container"
                style="width: 100%; display: none; flex-direction: column; gap: 0.5rem; box-sizing: border-box;">
                <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Upload Foto / File
                    Pendukung:</label>
                <div style="width: 100%; position: relative;">
                    <input type="file" id="prompt-modal-file-input" style="display: none;"
                        accept="image/*,.pdf,.xlsx,.xls,.csv,.doc,.docx" />
                    <div id="prompt-modal-upload-trigger"
                        style="border: 2px dashed rgba(6, 182, 212, 0.3); border-radius: var(--border-radius-sm); padding: 1.25rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; background: rgba(6, 182, 212, 0.02); transition: all 0.2s ease-in-out; box-sizing: border-box;"
                        onmouseover="this.style.background='rgba(6, 182, 212, 0.06)'; this.style.borderColor='var(--color-cyan)';"
                        onmouseout="this.style.background='rgba(6, 182, 212, 0.02)'; this.style.borderColor='rgba(6, 182, 212, 0.3)';">
                        <i data-lucide="upload-cloud" style="width: 24px; height: 24px; color: var(--color-cyan);"></i>
                        <span id="prompt-modal-upload-filename"
                            style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; word-break: break-all; font-weight: 500;">Pilih
                            file atau seret ke sini</span>
                    </div>
                </div>
                <div id="prompt-modal-file-preview"
                    style="display: none; width: 100%; max-height: 150px; overflow: hidden; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); margin-top: 4px; box-sizing: border-box; background: rgba(0,0,0,0.1); align-items: center; justify-content: center;">
                    <img id="prompt-modal-file-preview-img"
                        style="max-width: 100%; max-height: 150px; object-fit: contain;" src="" />
                </div>
            </div>
            <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.5rem;">
                <button class="btn btn-outline full-width" id="prompt-btn-cancel"
                    style="padding: 0.6rem;">Batal</button>
                <button class="btn btn-primary full-width" id="prompt-btn-ok"
                    style="padding: 0.6rem; font-weight: 600;">Simpan</button>
            </div>
        </div>
    </div>

    <!-- ponytail: Custom Project Procurement Modal (PR, PO, GR) -->
    <div id="custom-procurement-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 11000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);">
        <div class="card-glass animate-in"
            style="width: 90%; max-width: 440px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; text-align: left; box-shadow: var(--shadow-lg);">
            <div style="display: flex; gap: 0.75rem; align-items: center; width: 100%;">
                <div
                    style="background: rgba(16, 185, 129, 0.1); color: var(--color-green); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i data-lucide="shopping-cart" style="width: 18px; height: 18px;"></i>
                </div>
                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);"
                    id="procurement-modal-title">Input Status Procurement</h4>
            </div>
            <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; width: 100%;">
                Masukkan angka progress (persentase %) untuk tiap grup procurement (PR, PO, GR):
            </p>

            <div style="width: 100%; display: flex; flex-direction: column; gap: 0.85rem;">
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label
                        style="font-size: 0.8rem; font-weight: 600; color: var(--color-cyan); display: flex; align-items: center; gap: 4px;">
                        <i data-lucide="file-text" style="width: 13px; height: 13px;"></i> Angka Progress PR (%):
                    </label>
                    <div style="position: relative; display: flex; align-items: center;">
                        <input type="number" id="procurement-input-pr" min="0" max="100" placeholder="0 - 100"
                            style="width: 100%; padding: 0.6rem 2.2rem 0.6rem 0.75rem; font-size: 0.9rem; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); background: var(--bg-main); color: var(--text-primary); box-sizing: border-box;">
                        <span
                            style="position: absolute; right: 12px; font-weight: 700; color: var(--text-muted); font-size: 0.9rem;">%</span>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label
                        style="font-size: 0.8rem; font-weight: 600; color: #f59e0b; display: flex; align-items: center; gap: 4px;">
                        <i data-lucide="shopping-bag" style="width: 13px; height: 13px;"></i> Angka Progress PO (%):
                    </label>
                    <div style="position: relative; display: flex; align-items: center;">
                        <input type="number" id="procurement-input-po" min="0" max="100" placeholder="0 - 100"
                            style="width: 100%; padding: 0.6rem 2.2rem 0.6rem 0.75rem; font-size: 0.9rem; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); background: var(--bg-main); color: var(--text-primary); box-sizing: border-box;">
                        <span
                            style="position: absolute; right: 12px; font-weight: 700; color: var(--text-muted); font-size: 0.9rem;">%</span>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label
                        style="font-size: 0.8rem; font-weight: 600; color: var(--color-green); display: flex; align-items: center; gap: 4px;">
                        <i data-lucide="package-check" style="width: 13px; height: 13px;"></i> Angka Progress GR (%):
                    </label>
                    <div style="position: relative; display: flex; align-items: center;">
                        <input type="number" id="procurement-input-gr" min="0" max="100" placeholder="0 - 100"
                            style="width: 100%; padding: 0.6rem 2.2rem 0.6rem 0.75rem; font-size: 0.9rem; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); background: var(--bg-main); color: var(--text-primary); box-sizing: border-box;">
                        <span
                            style="position: absolute; right: 12px; font-weight: 700; color: var(--text-muted); font-size: 0.9rem;">%</span>
                    </div>
                </div>
            </div>

            <!-- ponytail: Live Automated Procurement Distribution Summary -->
            <div id="procurement-progress-summary"
                style="width: 100%; padding: 10px 12px; background: var(--bg-primary); border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); box-sizing: border-box;">
                <div
                    style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 0.8rem;">
                    <span style="color: var(--text-secondary); display: flex; align-items: center; gap: 5px;">
                        <i data-lucide="sparkles" style="width: 13px; height: 13px; color: var(--color-cyan);"></i> Total Distribusi:
                    </span>
                    <span id="procurement-total-badge"
                        style="font-weight: 700; color: var(--color-green); font-size: 0.88rem;">100%</span>
                </div>
                <div
                    style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.08); border-radius: 4px; overflow: hidden; display: flex;">
                    <div id="procurement-bar-pr"
                        style="height: 100%; background: var(--color-cyan); width: 0%; transition: width 0.25s ease;"
                        title="PR"></div>
                    <div id="procurement-bar-po"
                        style="height: 100%; background: #f59e0b; width: 0%; transition: width 0.25s ease;"
                        title="PO"></div>
                    <div id="procurement-bar-gr"
                        style="height: 100%; background: var(--color-green); width: 0%; transition: width 0.25s ease;"
                        title="GR"></div>
                </div>
            </div>

            <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.5rem;">
                <button class="btn btn-outline full-width" id="procurement-btn-cancel"
                    style="padding: 0.6rem;">Batal</button>
                <button class="btn btn-primary full-width" id="procurement-btn-ok"
                    style="padding: 0.6rem; font-weight: 600; background: var(--color-green); border-color: var(--color-green);">Simpan
                    Progress</button>
            </div>
        </div>
    </div>

    <!-- ponytail: Custom PR Formula Info Modal -->
    <div id="pr-calculator-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 11500; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.45); backdrop-filter: blur(4px);">
        <div class="card-glass animate-in"
            style="width: 90%; max-width: 440px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; text-align: left; box-shadow: var(--shadow-lg);">
            <div style="display: flex; gap: 0.75rem; align-items: center; width: 100%;">
                <div
                    style="background: rgba(0, 242, 254, 0.12); color: var(--color-cyan); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i data-lucide="info" style="width: 20px; height: 20px;"></i>
                </div>
                <div>
                    <h4 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);"
                        id="pr-calc-modal-title">Rumus Perhitungan Progress PR</h4>
                    <p style="margin: 2px 0 0 0; font-size: 0.75rem; color: var(--text-muted);">
                        Definisi & Formula Standar Pengadaan
                    </p>
                </div>
            </div>

            <!-- Formula display banner -->
            <div
                style="width: 100%; padding: 12px 14px; background: rgba(0, 242, 254, 0.08); border: 1px dashed rgba(0, 242, 254, 0.4); border-radius: var(--border-radius-sm); box-sizing: border-box;">
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-cyan); margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                    <i data-lucide="calculator" style="width: 13px; height: 13px;"></i> Rumus Otomatis Progress PR:
                </div>
                <div style="font-size: 0.92rem; color: var(--text-primary); font-weight: 700; line-height: 1.4;">
                    Progress PR (%) = <span style="color: var(--color-cyan);">(Total PR + Total Ready Stock WS/WSP)</span> ÷ <span style="color: #f59e0b;">Total All Material</span> × 100%
                </div>
            </div>

            <!-- Component description breakdown -->
            <div
                style="width: 100%; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.82rem; color: var(--text-secondary); background: var(--bg-primary); padding: 12px; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); box-sizing: border-box;">
                <div style="display: flex; align-items: flex-start; gap: 6px;">
                    <i data-lucide="check-circle-2"
                        style="width: 14px; height: 14px; color: var(--color-cyan); flex-shrink: 0; margin-top: 2px;"></i>
                    <span><strong style="color: var(--color-cyan);">Total PR</strong>: Jumlah item material yang telah diterbitkan nomor Purchase Requisition.</span>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 6px;">
                    <i data-lucide="check-circle-2"
                        style="width: 14px; height: 14px; color: #38bdf8; flex-shrink: 0; margin-top: 2px;"></i>
                    <span><strong style="color: #38bdf8;">Total Ready Stock WS/WSP</strong>: Jumlah material yang sudah tersedia di Workshop / Gudang WS & WSP.</span>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 6px;">
                    <i data-lucide="check-circle-2"
                        style="width: 14px; height: 14px; color: #f59e0b; flex-shrink: 0; margin-top: 2px;"></i>
                    <span><strong style="color: #f59e0b;">Total All Material</strong>: Keseluruhan total kebutuhan item material pada proyek.</span>
                </div>
            </div>

            <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.25rem;">
                <button class="btn btn-primary full-width" id="pr-calc-btn-cancel"
                    style="padding: 0.65rem; font-weight: 600; background: var(--color-cyan); border-color: var(--color-cyan); color: #000;">
                    Tutup Informasi
                </button>
            </div>
        </div>
    </div>

    <!-- ponytail: Custom Drawing Upload & Completion Modal -->
    <div id="drawing-upload-complete-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 11000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);">
        <div class="card-glass animate-in"
            style="width: 92%; max-width: 720px; max-height: 90vh; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; align-items: flex-start; text-align: left; box-shadow: var(--shadow-lg);">
            <div style="display: flex; gap: 0.75rem; align-items: center; width: 100%;">
                <div
                    style="background: rgba(6, 182, 212, 0.1); color: var(--color-cyan); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i data-lucide="check-circle" style="width: 20px; height: 20px;"></i>
                </div>
                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Selesaikan &amp;
                    Unggah Drawing</h4>
            </div>

            <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">
                Silakan unggah file drawing (PDF atau Gambar) untuk menyelesaikan tugas ini.
            </p>

            <div style="width: 100%; display: flex; flex-direction: column; gap: 0.35rem; box-sizing: border-box;">
                <label for="drawing-upload-complete-etiket-category"
                    style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Kategori Etiket <span
                        style="color: var(--color-danger, #ef4444);">*</span></label>
                <select id="drawing-upload-complete-etiket-category"
                    style="width: 100%; padding: 0.6rem 0.75rem; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); background: var(--bg-surface, rgba(255,255,255,0.05)); color: var(--text-primary); font-size: 0.875rem; box-sizing: border-box; outline: none;">
                    <option value="Mekanik / Part">Mekanik / Part</option>
                    <option value="Sipil">Sipil</option>
                </select>
            </div>

            <!-- ponytail: Sample Etiket Preview Section (Landscape & Portrait Clickable Cards) -->
            <div id="drawing-upload-complete-etiket-samples-wrapper"
                style="width: 100%; border: 1px solid var(--card-border, rgba(255,255,255,0.12)); border-radius: var(--border-radius-sm, 8px); padding: 0.75rem; background: rgba(0,0,0,0.15); box-sizing: border-box; display: flex; flex-direction: column; gap: 0.6rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <span
                        style="font-size: 0.78rem; font-weight: 700; color: var(--color-cyan, #06b6d4); text-transform: uppercase; letter-spacing: 0.4px; display: flex; align-items: center; gap: 5px;">
                        <i data-lucide="eye" style="width: 14px; height: 14px;"></i> Sampel Etiket <span
                            id="etiket-category-badge"
                            style="font-size: 0.7rem; font-weight: 600; text-transform: none; padding: 2px 6px; border-radius: 4px; background: rgba(6,182,212,0.15); color: var(--color-cyan, #06b6d4);">Mekanik
                            / Part</span>
                    </span>
                    <span style="font-size: 0.72rem; color: var(--text-tertiary, #9ca3af);">Klik kartu untuk memilih
                        orientasi</span>
                </div>

                <div
                    style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; width: 100%; box-sizing: border-box;">
                    <div id="etiket-sample-card-landscape"
                        style="cursor: pointer; background: rgba(6,182,212,0.12); border: 2px solid var(--color-cyan, #06b6d4); border-radius: 6px; padding: 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; transition: all 0.2s ease; position: relative;">
                        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                            <div
                                style="font-size: 0.75rem; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 4px;">
                                <i data-lucide="layout-template"
                                    style="width: 13px; height: 13px; color: var(--color-cyan);"></i> Landscape
                            </div>
                            <span id="etiket-landscape-badge"
                                style="font-size: 0.68rem; font-weight: 700; color: #ffffff; background: var(--color-cyan, #06b6d4); padding: 1px 6px; border-radius: 4px;">✓
                                Terpilih</span>
                        </div>
                        <div id="etiket-sample-landscape-preview"
                            style="width: 100%; height: 150px; background: #ffffff; border-radius: 4px; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.25); position: relative;">
                        </div>
                        <button type="button" id="etiket-zoom-landscape-btn"
                            style="width: 100%; padding: 0.4rem 0.5rem; font-size: 0.78rem; font-weight: 600; color: var(--color-cyan, #06b6d4); background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.2s ease;"
                            onclick="event.stopPropagation(); openEtiketZoomModal('landscape');"
                            onmouseover="this.style.background='rgba(6, 182, 212, 0.2)'; this.style.borderColor='var(--color-cyan)';"
                            onmouseout="this.style.background='rgba(6, 182, 212, 0.1)'; this.style.borderColor='rgba(6, 182, 212, 0.3)';">
                            <i data-lucide="eye" style="width: 13px; height: 13px;"></i> Preview
                        </button>
                    </div>

                    <div id="etiket-sample-card-portrait"
                        style="cursor: pointer; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; transition: all 0.2s ease; position: relative;">
                        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                            <div
                                style="font-size: 0.75rem; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 4px;">
                                <i data-lucide="file-text"
                                    style="width: 13px; height: 13px; color: var(--color-cyan);"></i> Portrait
                            </div>
                            <span id="etiket-portrait-badge"
                                style="font-size: 0.68rem; font-weight: 500; color: var(--text-tertiary, #9ca3af); background: rgba(255,255,255,0.05); padding: 1px 6px; border-radius: 4px;">Pilih</span>
                        </div>
                        <div id="etiket-sample-portrait-preview"
                            style="width: 100%; height: 150px; background: #ffffff; border-radius: 4px; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.25); position: relative;">
                        </div>
                        <button type="button" id="etiket-zoom-portrait-btn"
                            style="width: 100%; padding: 0.4rem 0.5rem; font-size: 0.78rem; font-weight: 600; color: var(--color-cyan, #06b6d4); background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.2s ease;"
                            onclick="event.stopPropagation(); openEtiketZoomModal('portrait');"
                            onmouseover="this.style.background='rgba(6, 182, 212, 0.2)'; this.style.borderColor='var(--color-cyan)';"
                            onmouseout="this.style.background='rgba(6, 182, 212, 0.1)'; this.style.borderColor='rgba(6, 182, 212, 0.3)';">
                            <i data-lucide="eye" style="width: 13px; height: 13px;"></i> Preview
                        </button>
                    </div>
                </div>
            </div>

            <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem; box-sizing: border-box;">
                <div style="width: 100%; position: relative;">
                    <input type="file" id="drawing-upload-complete-file-input" style="display: none;"
                        accept="image/*,.pdf" />
                    <div id="drawing-upload-complete-trigger"
                        style="border: 2px dashed rgba(6, 182, 212, 0.3); border-radius: var(--border-radius-sm); padding: 1.25rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; background: rgba(6, 182, 212, 0.02); transition: all 0.2s ease-in-out; box-sizing: border-box;"
                        onmouseover="if (!this.dataset.hasError) { this.style.background='rgba(6, 182, 212, 0.06)'; this.style.borderColor='var(--color-cyan)'; }"
                        onmouseout="if (!this.dataset.hasError) { this.style.background='rgba(6, 182, 212, 0.02)'; this.style.borderColor='rgba(6, 182, 212, 0.3)'; }">
                        <i data-lucide="upload-cloud" style="width: 24px; height: 24px; color: var(--color-cyan);"></i>
                        <span id="drawing-upload-complete-filename"
                            style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; word-break: break-all; font-weight: 500;">Pilih
                            file Drawing (PDF/Gambar)</span>
                    </div>
                </div>
                <div id="drawing-upload-complete-file-error"
                    style="display: none; width: 100%; padding: 0.5rem 0.75rem; border-radius: var(--border-radius-sm, 6px); background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; font-size: 0.8rem; font-weight: 600; align-items: center; gap: 6px; box-sizing: border-box;">
                    <i data-lucide="alert-circle" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                    <span>Silakan pilih/unggah file drawing terlebih dahulu sebelum menyelesaikan tugas!</span>
                </div>
                <div id="drawing-upload-complete-preview"
                    style="display: none; width: 100%; max-height: 150px; overflow: hidden; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); margin-top: 4px; box-sizing: border-box; background: rgba(0,0,0,0.1); align-items: center; justify-content: center;">
                    <img id="drawing-upload-complete-preview-img"
                        style="max-width: 100%; max-height: 150px; object-fit: contain;" src="" />
                </div>
            </div>

            <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.5rem;">
                <button class="btn btn-outline full-width" id="drawing-upload-complete-btn-cancel"
                    style="padding: 0.6rem;">Batal</button>
                <button class="btn btn-primary full-width" id="drawing-upload-complete-btn-ok"
                    style="padding: 0.6rem; font-weight: 600;">Selesaikan</button>
            </div>
        </div>
    </div>

    <!-- ponytail: Zoom / Detail Modal for Etiket Sample Preview -->
    <div id="etiket-zoom-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 12000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(5px);">
        <div class="card-glass animate-in"
            style="width: 98vw; max-width: 98vw; height: 92vh; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; align-items: stretch; text-align: left; box-shadow: var(--shadow-lg);">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="file-check" style="width: 20px; height: 20px; color: var(--color-cyan);"></i>
                    <h4 id="etiket-zoom-title"
                        style="margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">Detail
                        Sampel Etiket</h4>
                </div>
                <button id="etiket-zoom-close" class="btn btn-outline"
                    style="padding: 2px 8px; font-size: 0.85rem; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">✕</button>
            </div>
            <div id="etiket-zoom-body"
                style="width: 100%; flex: 1; min-height: 0; background: #ffffff; border-radius: 6px; padding: 0.75rem; box-sizing: border-box; display: flex; align-items: center; justify-content: center; overflow: auto; box-shadow: inset 0 0 10px rgba(0,0,0,0.12);">
            </div>
            <p id="etiket-zoom-desc"
                style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; background: rgba(255,255,255,0.04); padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid var(--card-border);">
            </p>
        </div>
    </div>

    <!-- ponytail: Custom General EJO Approval & Assignment Modal -->
    <div id="general-ejo-approve-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 11000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);">
        <div class="card-glass animate-in"
            style="width: 90%; max-width: 450px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; align-items: flex-start; text-align: left; box-shadow: var(--shadow-lg);">

            <div style="display: flex; gap: 0.75rem; align-items: center; width: 100%;">
                <div
                    style="background: rgba(16, 185, 129, 0.1); color: var(--color-green); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="check-square" style="width: 18px; height: 18px;"></i>
                </div>
                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Persetujuan
                    &amp; Penugasan EJO</h4>
            </div>

            <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">
                General EJO ini akan disetujui. Silakan tentukan engineer yang ditugaskan untuk pekerjaan ini dan
                sub-status Checking.
            </p>

            <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- ponytail: added id for dynamic engineer label update -->
                <label id="gejo-approve-engineers-label"
                    style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Pilih Engineer (Bisa
                    beberapa):</label>
                <div id="gejo-approve-engineers"
                    style="max-height: 180px; overflow-y: auto; display: flex; flex-direction: column; width: 100%; box-sizing: border-box; padding-right: 4px;">
                    <!-- Checkboxes will be populated dynamically -->
                </div>
            </div>

            <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem;">
                <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Pilih Sub-status
                    Checking:</label>
                <div class="segmented-control">
                    <label class="segment-option">
                        <input type="checkbox" name="gejo-approve-sub-status" value="Drawing Ready" checked>
                        <span class="segment-btn">
                            <i data-lucide="image" style="width: 14px; height: 14px;"></i> Drawing Ready
                        </span>
                    </label>
                    <label class="segment-option">
                        <input type="checkbox" name="gejo-approve-sub-status" value="Material">
                        <span class="segment-btn">
                            <i data-lucide="package" style="width: 14px; height: 14px;"></i> Material
                        </span>
                    </label>
                </div>
            </div>

            <!-- ponytail: premium file upload container for general EJO drawing -->
            <div id="gejo-approve-drawing-container"
                style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem; box-sizing: border-box;">
                <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Unggah Drawing (PDF /
                    Gambar) <span class="required">*</span>:</label>
                <div style="width: 100%; position: relative;">
                    <input type="file" id="gejo-approve-drawing-file" style="display: none;" accept="image/*,.pdf" />
                    <div id="gejo-approve-drawing-trigger"
                        style="border: 2px dashed rgba(6, 182, 212, 0.3); border-radius: var(--border-radius-sm); padding: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; background: rgba(6, 182, 212, 0.02); transition: all 0.2s ease-in-out; box-sizing: border-box;"
                        onmouseover="this.style.background='rgba(6, 182, 212, 0.06)'; this.style.borderColor='var(--color-cyan)';"
                        onmouseout="this.style.background='rgba(6, 182, 212, 0.02)'; this.style.borderColor='rgba(6, 182, 212, 0.3)';">
                        <i data-lucide="upload-cloud" style="width: 24px; height: 24px; color: var(--color-cyan);"></i>
                        <span id="gejo-approve-drawing-filename"
                            style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; word-break: break-all; font-weight: 500;">Pilih
                            file Drawing (PDF/Gambar)</span>
                    </div>
                </div>
                <div id="gejo-approve-drawing-preview"
                    style="display: none; width: 100%; max-height: 120px; overflow: hidden; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); margin-top: 4px; box-sizing: border-box; background: rgba(0,0,0,0.1); align-items: center; justify-content: center;">
                    <img id="gejo-approve-drawing-preview-img"
                        style="max-width: 100%; max-height: 120px; object-fit: contain;" src="" />
                </div>
            </div>

            <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem;">
                <label for="gejo-approve-est-date"
                    style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Estimasi Selesai
                    (Opsional):</label>
                <input type="date" id="gejo-approve-est-date"
                    style="width: 100%; padding: 0.6rem; border-radius: var(--border-radius-md); border: 1px solid var(--card-border); background: var(--bg-main); color: var(--text-primary); box-sizing: border-box;" />
            </div>

            <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.25rem;">
                <button class="btn btn-outline full-width" id="gejo-approve-btn-cancel"
                    style="padding: 0.6rem;">Batal</button>
                <button class="btn btn-primary full-width" id="gejo-approve-btn-ok"
                    style="padding: 0.6rem; font-weight: 600;">Setujui &amp; Tugaskan</button>
            </div>
        </div>
    </div>

    <!-- ponytail: Custom General EJO Completion Modal for Drafter -->
    <div id="gejo-complete-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 11000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);">
        <div class="card-glass animate-in"
            style="width: 90%; max-width: 450px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; align-items: flex-start; text-align: left; box-shadow: var(--shadow-lg);">
            <div style="display: flex; gap: 0.75rem; align-items: center; width: 100%;">
                <div
                    style="background: rgba(6, 182, 212, 0.1); color: var(--color-cyan); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i data-lucide="check-circle" style="width: 20px; height: 20px;"></i>
                </div>
                <h4 id="gejo-complete-modal-title"
                    style="margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Laporan
                    Penyelesaian Pekerjaan (Drafter)</h4>
            </div>


            <div class="form-field" style="width: 100%;">
                <label for="gejo-complete-log" style="font-weight: 600;">Laporan Pekerjaan <span
                        class="required">*</span></label>
                <textarea id="gejo-complete-log" rows="3"
                    placeholder="Tulis rincian log laporan pekerjaan / alasan selesai di sini..."
                    style="width: 100%; font-family: inherit; resize: vertical; box-sizing: border-box;"></textarea>
            </div>

            <div class="form-field" style="width: 100%;">
                <label style="font-weight: 600;">Upload Dokumentasi <span class="required">*</span></label>
                <div class="file-upload-mock" id="gejo-complete-upload-mock"
                    style="padding: 1.25rem; font-size: 0.85rem;">
                    <i data-lucide="upload-cloud" style="width: 28px; height: 28px; color: var(--color-cyan);"></i>
                    <span id="gejo-complete-upload-span">Klik untuk tambah file / gambar (maks. 6)</span>
                    <input type="file" id="gejo-complete-attachment" style="display: none;" multiple
                        accept="image/*,.pdf,.dwg,.doc,.docx,.xls,.xlsx,.zip,.rar">
                </div>
                <!-- ponytail: separated camera button to prevent double-trigger and event bubbling on mobile -->
                <button type="button" class="btn btn-outline" id="gejo-complete-btn-camera"
                    style="width: 100%; margin-top: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border-color: var(--color-cyan); color: var(--color-cyan); background: rgba(6, 182, 212, 0.05); padding: 0.6rem; font-size: 0.85rem;">
                    <i data-lucide="camera" style="width: 18px; height: 18px; color: var(--color-cyan);"></i>
                    Ambil Foto dari Kamera HP
                </button>
                <input type="file" id="gejo-complete-camera" style="display: none;" accept="image/*"
                    capture="environment">
                <!-- Thumbnail preview area -->
                <div id="gejo-complete-preview-container"
                    style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 0.25rem; width: 100%;"></div>
            </div>

            <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.25rem;">
                <button class="btn btn-outline full-width" id="gejo-complete-btn-cancel"
                    style="padding: 0.6rem;">Batal</button>
                <button class="btn btn-primary full-width" id="gejo-complete-btn-ok"
                    style="padding: 0.6rem; font-weight: 600;">Selesaikan Pekerjaan</button>
            </div>
        </div>
    </div>

    <!-- ponytail: Modal Input Biaya Perbaikan (Repair Part Cost Modal) -->
    <div id="gejo-repair-part-cost-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 12000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(6px);">
        <div class="card-glass animate-in"
            style="width: 92%; max-width: 480px; max-height: 90vh; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; align-items: flex-start; text-align: left; box-shadow: var(--shadow-lg); box-sizing: border-box;">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <div
                        style="background: var(--color-green-glow); color: var(--color-green); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i data-lucide="calculator" style="width: 20px; height: 20px;"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Input /
                            Edit Biaya Perbaikan</h4>
                        <span id="repair-part-cost-ejo-id" class="text-xs text-muted" style="font-weight: 600;">EJO ID:
                            -</span>
                    </div>
                </div>
                <button type="button" class="modal-close" onclick="closeRepairPartCostModal()"
                    style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;">
                    <i data-lucide="x" style="width: 18px; height: 18px;"></i>
                </button>
            </div>


            <div class="form-field" style="width: 100%; box-sizing: border-box; margin-bottom: 0.75rem;">
                <div
                    style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 4px;">
                    <label for="repair-part-cost-price-new"
                        style="font-weight: 600; font-size: 0.85rem; margin-bottom: 0;">Harga Baru Part (SAP) (Rp) <span
                            class="required">*</span></label>
                    <span id="repair-part-cost-qty-badge" class="badge badge-blue"
                        style="font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 12px; background: rgba(59, 130, 246, 0.15); color: var(--color-blue); border: 1px solid rgba(59, 130, 246, 0.3);">0/0</span>
                </div>
                <input type="number" id="repair-part-cost-price-new" class="input-sm"
                    placeholder="Otomatis terisi dari Harga by SAP..." readonly
                    style="width: 100%; box-sizing: border-box; height: 40px; background-color: var(--bg-muted, #f3f4f6); cursor: not-allowed; opacity: 0.85;"
                    min="0" step="any">
            </div>

            <div
                style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; width: 100%; box-sizing: border-box;">
                <div class="form-field" style="width: 100%;">
                    <label for="repair-part-cost-quantity" style="font-weight: 600; font-size: 0.85rem;">Qty Total (Pcs)
                        <span class="required">*</span></label>
                    <input type="number" id="repair-part-cost-quantity" class="input-sm" placeholder="Misal: 1" readonly
                        style="width: 100%; box-sizing: border-box; height: 40px; background-color: var(--bg-muted, #f3f4f6); cursor: not-allowed; opacity: 0.85;"
                        min="1" step="1">
                </div>

                <div class="form-field" style="width: 100%;">
                    <label for="repair-part-cost-duration" style="font-weight: 600; font-size: 0.85rem;">Durasi (Hari)
                        <span class="required">*</span></label>
                    <input type="number" id="repair-part-cost-duration" class="input-sm"
                        placeholder="Otomatis dari konfirmasi" readonly
                        style="width: 100%; box-sizing: border-box; height: 40px; background-color: var(--bg-muted, #f3f4f6); cursor: not-allowed; opacity: 0.85;"
                        min="0" step="1">
                </div>

                <div class="form-field" style="width: 100%;">
                    <label for="repair-part-cost-per-day" style="font-weight: 600; font-size: 0.85rem;">Tarif / Hari
                        (Rp) <span class="required">*</span></label>
                    <input type="number" id="repair-part-cost-per-day" class="input-sm" placeholder="Misal: 100000"
                        style="width: 100%; box-sizing: border-box; height: 40px;" min="0" step="any">
                </div>
            </div>

            <!-- Live Cost Analysis Calculation Preview -->
            <div class="cost-analysis-card"
                style="width: 100%; margin: 0; box-sizing: border-box; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 8px; padding: 12px;">
                <div class="cost-analysis-header"
                    style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; color: var(--color-cyan); font-weight: 600; font-size: 0.85rem;">
                    <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i>
                    <span>Kalkulasi Otomatis Biaya &amp; Hemat</span>
                </div>
                <div class="cost-analysis-grid"
                    style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                    <div class="cost-stat-item" style="display: flex; flex-direction: column;">
                        <span class="cost-stat-label" style="font-size: 0.75rem; color: var(--text-muted);">Total Biaya
                            Perbaikan</span>
                        <span class="cost-stat-value" id="repair-part-cost-total-display"
                            style="font-size: 0.95rem; font-weight: 700; color: var(--color-blue);">Rp 0</span>
                    </div>
                    <div class="cost-stat-item" style="display: flex; flex-direction: column;">
                        <span class="cost-stat-label" style="font-size: 0.75rem; color: var(--text-muted);">Cost Saving
                            (Hemat)</span>
                        <span class="cost-stat-value" id="repair-part-cost-saving-display"
                            style="font-size: 0.95rem; font-weight: 700; color: var(--color-green);">Rp 0</span>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.25rem;">
                <button type="button" class="btn btn-outline full-width" onclick="closeRepairPartCostModal()"
                    style="padding: 0.6rem; height: 40px;">Batal</button>
                <button type="button" class="btn btn-primary full-width glow-button" id="repair-part-cost-save-btn"
                    onclick="saveRepairPartCostModal()" style="padding: 0.6rem; font-weight: 600; height: 40px;">Simpan
                    Data Biaya</button>
            </div>
        </div>
    </div>

    <!-- ponytail: Custom User Profile / Account Settings Modal -->
    <div id="user-profile-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 11000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);">
        <div class="card-glass animate-in"
            style="width: 90%; max-width: 420px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; align-items: flex-start; text-align: left; box-shadow: var(--shadow-lg);">
            <div style="display: flex; gap: 0.75rem; align-items: center; width: 100%;">
                <div
                    style="background: rgba(6, 182, 212, 0.1); color: var(--color-cyan); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="user-cog" style="width: 18px; height: 18px;"></i>
                </div>
                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Pengaturan
                    Profil & Akun</h4>
            </div>

            <!-- Avatar Section -->
            <div
                style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin: 0.5rem 0;">
                <div
                    style="position: relative; width: 90px; height: 90px; border-radius: 50%; overflow: hidden; border: 2px solid var(--color-cyan); background: var(--bg-sidebar);">
                    <img id="profile-modal-avatar"
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80"
                        style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <button class="btn btn-outline btn-xs" id="btn-profile-change-avatar"
                    style="padding: 4px 8px; font-size: 0.75rem;">
                    <i data-lucide="camera" style="width: 12px; height: 12px;"></i> Ganti Foto
                </button>
                <input type="file" id="profile-modal-avatar-input" accept="image/*" style="display: none;">
            </div>

            <!-- Signature Section -->
            <div
                style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin: 0.5rem 0; border-top: 1px dashed var(--card-border); padding-top: 0.75rem;">
                <label
                    style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); width: 100%; text-align: left;">Tanda
                    Tangan Digital Resmi</label>
                <div
                    style="position: relative; width: 100%; max-width: 280px; height: 100px; border-radius: var(--border-radius-md); overflow: hidden; border: 1px dashed var(--card-border); background: var(--bg-main); display: flex; align-items: center; justify-content: center; box-sizing: border-box; padding: 0.25rem;">
                    <img id="profile-modal-signature" src=""
                        style="max-width: 100%; max-height: 100%; object-fit: contain; display: none;">
                    <span id="profile-modal-signature-placeholder"
                        style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">Belum Mengunggah Tanda
                        Tangan</span>
                </div>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
                    <button type="button" class="btn btn-outline btn-xs" id="btn-profile-upload-signature"
                        style="padding: 4px 8px; font-size: 0.75rem;">
                        <i data-lucide="upload" style="width: 12px; height: 12px;"></i> Unggah Gambar
                    </button>
                    <button type="button" class="btn btn-outline btn-xs" id="btn-profile-draw-signature"
                        style="padding: 4px 8px; font-size: 0.75rem;">
                        <i data-lucide="signature" style="width: 12px; height: 12px;"></i> Tulis Tanda Tangan
                    </button>
                    <button type="button" class="btn btn-xs" id="btn-profile-clear-signature"
                        style="padding: 4px 8px; font-size: 0.75rem; background: var(--color-rose-glow); color: var(--color-rose); border: 1px solid var(--color-rose-glow);">
                        Hapus
                    </button>
                </div>
                <input type="file" id="profile-modal-signature-input" accept="image/*" style="display: none;">
            </div>

            <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem;">
                <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Username</label>
                <input type="text" id="profile-modal-username"
                    style="width: 100%; padding: 0.6rem; border-radius: var(--border-radius-md); border: 1px solid var(--card-border); background: var(--card-bg); color: var(--text-muted); box-sizing: border-box; cursor: not-allowed;"
                    readonly>
            </div>

            <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem;">
                <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Jabatan /
                    Otoritas</label>
                <input type="text" id="profile-modal-role"
                    style="width: 100%; padding: 0.6rem; border-radius: var(--border-radius-md); border: 1px solid var(--card-border); background: var(--card-bg); color: var(--text-muted); box-sizing: border-box; cursor: not-allowed;"
                    readonly>
            </div>

            <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem;">
                <label for="profile-modal-fullname"
                    style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Nama Lengkap <span
                        style="color: var(--color-red);">*</span></label>
                <input type="text" id="profile-modal-fullname" placeholder="Masukkan nama lengkap Anda..."
                    style="width: 100%; padding: 0.6rem; border-radius: var(--border-radius-md); border: 1px solid var(--card-border); background: var(--bg-main); color: var(--text-primary); box-sizing: border-box;"
                    required>
            </div>


            <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem;">
                <label for="profile-modal-password"
                    style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Password Baru</label>
                <div class="password-input-wrapper">
                    <input type="password" id="profile-modal-password"
                        placeholder="Kosongkan jika tidak ingin mengubah..."
                        style="width: 100%; padding: 0.6rem; padding-right: 3.25rem !important; border-radius: var(--border-radius-md); border: 1px solid var(--card-border); background: var(--bg-main); color: var(--text-primary); box-sizing: border-box;">
                    <button type="button" class="btn-toggle-password" title="Tampilkan Password">
                        <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
            </div>

            <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.5rem;">
                <button class="btn btn-outline full-width" id="btn-profile-modal-cancel"
                    style="padding: 0.6rem;">Batal</button>
                <button class="btn btn-primary full-width" id="btn-profile-modal-save"
                    style="padding: 0.6rem; font-weight: 600;">Simpan</button>
            </div>
        </div>
    </div>

    <!-- ponytail: Modal Tulis Tanda Tangan Canvas (Digital Signature Pad) -->
    <div id="signature-pad-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 12500; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(5px);">
        <div class="card-glass animate-in"
            style="width: 92%; max-width: 480px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; align-items: stretch; text-align: left; box-shadow: var(--shadow-xl); border-radius: var(--border-radius-lg);">

            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <div
                        style="background: rgba(6, 182, 212, 0.12); color: var(--color-cyan); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="pen-tool" style="width: 18px; height: 18px;"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">Tulis
                            Tanda Tangan Digital</h4>
                        <p style="margin: 2px 0 0 0; font-size: 0.75rem; color: var(--text-secondary);">Goreskan tanda
                            tangan Anda pada area canvas di bawah</p>
                    </div>
                </div>
                <button type="button" class="btn-text-xs" id="btn-sigpad-close"
                    style="padding: 4px; border-radius: 50%; color: var(--text-muted); cursor: pointer; background: transparent; border: none;"
                    title="Tutup">
                    <i data-lucide="x" style="width: 18px; height: 18px;"></i>
                </button>
            </div>

            <!-- Canvas Wrapper -->
            <div class="signature-pad-wrapper" id="signature-pad-wrapper"
                style="position: relative; width: 100%; height: 210px; background: #ffffff; border-radius: var(--border-radius-md); border: 2px dashed rgba(6, 182, 212, 0.4); box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06); overflow: hidden; touch-action: none; cursor: crosshair; user-select: none;">
                <canvas id="signature-pad-canvas" class="signature-pad-canvas"
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; touch-action: none; display: block; cursor: crosshair;"></canvas>
                <div class="signature-pad-guide"
                    style="position: absolute; bottom: 35px; left: 25px; right: 25px; border-bottom: 1px dashed rgba(0, 0, 0, 0.25); pointer-events: none; display: flex; justify-content: space-between; align-items: center; padding-bottom: 4px;">
                    <span
                        style="font-size: 0.65rem; color: rgba(0, 0, 0, 0.35); font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">Area
                        Tanda Tangan</span>
                    <span style="font-size: 0.65rem; color: rgba(0, 0, 0, 0.35); font-weight: 500;">PT. BAS EJO</span>
                </div>
            </div>

            <!-- Toolbar (Color, Thickness, Reset) -->
            <div class="signature-pad-tools"
                style="display: flex; align-items: center; justify-content: space-between; width: 100%; flex-wrap: wrap; gap: 0.5rem;">
                <!-- Color Selector -->
                <div class="signature-pad-tool-group" style="display: flex; align-items: center; gap: 0.4rem;">
                    <span style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary);">Warna:</span>
                    <button type="button" class="signature-color-btn active" data-color="#0f172a"
                        style="background: #0f172a;" title="Hitam"></button>
                    <button type="button" class="signature-color-btn" data-color="#1e40af" style="background: #1e40af;"
                        title="Biru Gelap"></button>
                    <button type="button" class="signature-color-btn" data-color="#047857" style="background: #047857;"
                        title="Hijau Gelap"></button>
                </div>

                <!-- Thickness Selector -->
                <div class="signature-pad-tool-group" style="display: flex; align-items: center; gap: 0.4rem;">
                    <span style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary);">Ketebalan:</span>
                    <button type="button" class="signature-width-btn" data-width="1.8">Halus</button>
                    <button type="button" class="signature-width-btn active" data-width="2.8">Standar</button>
                    <button type="button" class="signature-width-btn" data-width="4.2">Tebal</button>
                </div>

                <!-- Clear Canvas Button -->
                <button type="button" class="btn btn-outline btn-xs" id="btn-sigpad-clear"
                    style="padding: 3px 8px; font-size: 0.72rem; gap: 4px; display: inline-flex; align-items: center;">
                    <i data-lucide="rotate-ccw" style="width: 12px; height: 12px;"></i> Bersihkan
                </button>
            </div>

            <!-- Footer Actions -->
            <div class="sigpad-actions" style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.25rem;">
                <button type="button" class="btn btn-outline full-width" id="btn-sigpad-cancel"
                    style="padding: 0.6rem; font-size: 0.85rem;">Batal</button>
                <button type="button" class="btn btn-primary full-width" id="btn-sigpad-save"
                    style="padding: 0.6rem; font-weight: 600; font-size: 0.85rem; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
                    <i data-lucide="check" style="width: 14px; height: 14px;"></i> Gunakan Tanda Tangan
                </button>
            </div>
        </div>
    </div>

    <div class="notification-panel card-glass" id="notify-panel" style="display: none;">
        <div class="notify-header">
            <h4>Notifikasi Sistem EJO</h4>
            <button class="btn-text-xs" id="clear-notifications">Hapus Semua</button>
        </div>
        <div class="notify-list" id="notify-list-items">
            <!-- Dynamic Notifications -->
        </div>
    </div>


    <!-- ponytail: Modal Tolak/Reject Approval General EJO dengan Rute Rejection & Upload Media -->
    <div id="general-ejo-rejection-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 12000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);">
        <div class="card-glass animate-in"
            style="width: 90%; max-width: 450px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; align-items: flex-start; text-align: left; box-shadow: var(--shadow-lg);">
            <div style="display: flex; gap: 0.75rem; align-items: center; width: 100%;">
                <div
                    style="background: rgba(239, 68, 68, 0.1); color: var(--color-red); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="x-circle" style="width: 18px; height: 18px;"></i>
                </div>
                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Tolak Approval &
                    Kembalikan</h4>
            </div>

            <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">
                Silakan berikan alasan mengapa pekerjaan ini ditolak. Pekerjaan akan dikembalikan ke Engineer.
            </p>

            <div style="width: 100%; display: none; flex-direction: column; gap: 0.5rem;">
                <label for="gejo-reject-target"
                    style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Kembalikan Ke <span
                        style="color: var(--color-red);">*</span></label>
                <select id="gejo-reject-target"
                    style="padding: 10px; font-size: 0.9rem; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); background: var(--bg-main); color: var(--text-primary); width: 100%; box-sizing: border-box;">
                    <option value="In Progress">Kembalikan ke Engineer (In Progress)</option>
                </select>
            </div>

            <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem;">
                <label for="gejo-reject-reason"
                    style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Alasan Penolakan <span
                        style="color: var(--color-red);">*</span></label>
                <textarea id="gejo-reject-reason" rows="3"
                    placeholder="Masukkan alasan mengapa pekerjaan ini ditolak..."
                    style="width: 100%; padding: 0.75rem; font-size: 0.9rem; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); background: var(--bg-main); color: var(--text-primary); font-family: inherit; resize: vertical; box-sizing: border-box;"></textarea>
            </div>

            <!-- ponytail: Rejection Media Upload -->
            <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem;">
                <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Lampiran Gambar
                    Penolakan (Opsional)</label>
                <div class="file-upload-mock" id="gejo-reject-upload-mock"
                    style="padding: 10px; font-size: 0.8rem; flex-direction: row; gap: 5px; cursor: pointer; border: 1px dashed var(--card-border); border-radius: var(--border-radius-sm); box-sizing: border-box; width: 100%; align-items: center; justify-content: center;">
                    <i data-lucide="upload-cloud" style="width: 16px; height: 16px;"></i>
                    <span id="gejo-reject-upload-span">Klik untuk tambah gambar</span>
                    <input type="file" id="gejo-reject-attachment" style="display: none;" accept="image/*">
                </div>
                <!-- Preview area for rejection attachment -->
                <div id="gejo-reject-preview-container"
                    style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 0.5rem; width: 100%; justify-content: center;">
                </div>
            </div>

            <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.25rem;">
                <button class="btn btn-outline full-width" id="gejo-reject-btn-cancel"
                    style="padding: 0.6rem;">Batal</button>
                <button class="btn btn-danger full-width" id="gejo-reject-btn-confirm"
                    style="padding: 0.6rem; font-weight: 600;">Tolak Approval</button>
            </div>
        </div>
    </div>

    <!-- MODAL PILIH SHEET EXCEL -->
    <div class="modal-backdrop" id="excel-sheet-modal">
        <div class="modal-card card-glass animate-in excel-sheet-modal-card" style="max-width: 520px;">
            <div class="modal-header excel-sheet-modal-header">
                <div>
                    <h3 class="excel-sheet-modal-title">Pilih Sheet Excel</h3>
                    <p class="excel-sheet-modal-subtitle">File ini memiliki banyak sheet. Pilih satu atau beberapa sheet EJO untuk diimpor sekaligus.</p>
                </div>
                <button class="modal-close" id="excel-sheet-close-btn" type="button"
                    aria-label="Tutup modal">&times;</button>
            </div>
            <div class="modal-body excel-sheet-modal-body">
                <div class="excel-sheet-picker">
                    <div class="excel-sheet-toolbar">
                        <input type="text" id="excel-sheet-search" placeholder="Cari nama sheet..." class="excel-sheet-search-input">
                        <div class="excel-sheet-toolbar-btns">
                            <button type="button" class="excel-sheet-toolbar-btn" id="excel-sheet-btn-select-all">Pilih Semua</button>
                            <button type="button" class="excel-sheet-toolbar-btn" id="excel-sheet-btn-deselect-all">Batal Pilih</button>
                        </div>
                    </div>
                    <div class="excel-sheet-list" id="excel-sheet-list" role="listbox" aria-label="Daftar sheet excel">
                    </div>
                    <select id="excel-sheet-select" class="excel-sheet-select-native" multiple aria-hidden="true" tabindex="-1">
                        <!-- Options will be added dynamically -->
                    </select>
                    <div class="excel-sheet-selected" id="excel-sheet-selected">
                        <span id="excel-sheet-selected-text">0 sheet terpilih</span>
                        <span id="excel-sheet-selected-badge" style="color: var(--color-cyan); font-weight: 700;"></span>
                    </div>
                </div>
            </div>
            <div class="excel-sheet-modal-actions">
                <button class="btn btn-outline full-width" id="excel-sheet-btn-cancel" type="button">Batal</button>
                <button class="btn btn-primary glow-button full-width" id="excel-sheet-btn-confirm" type="button">Mulai Impor</button>
            </div>
        </div>
    </div>

    <!-- ponytail: MODAL EDIT KPI -->
    <div class="modal-backdrop" id="kpi-edit-modal">
        <div class="modal-card card-glass animate-in" style="max-width: 450px;">
            <div class="modal-header">
                <div class="ejo-header-badge">
                    <span class="badge-ejo-code">EDIT KPI</span>
                </div>
                <button class="modal-close" id="modal-kpi-close-btn">&times;</button>
            </div>
            <div class="modal-body" style="grid-template-columns: 1fr; gap: 1.5rem; padding: 1.5rem;">
                <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%;">
                    <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Update Persentase KPI
                    </h3>
                    <p class="text-secondary text-xs">Masukkan persentase pencapaian KPI General EJO saat ini (0-100)
                        untuk diperbarui setiap minggunya.</p>

                    <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                        <label for="input-kpi-percentage"
                            style="font-weight: 600; font-size: 0.85rem; color: var(--text-secondary);">Persentase KPI
                            (%)</label>
                        <input type="number" id="input-kpi-percentage" min="0" max="100" class="input-sm"
                            style="width: 100%;" placeholder="Contoh: 85">
                    </div>

                    <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 1rem;">
                        <button class="btn btn-outline" id="btn-cancel-kpi-modal"
                            style="padding: 0.5rem 1rem;">Batal</button>
                        <button class="btn btn-primary" id="btn-save-kpi-modal"
                            style="padding: 0.5rem 1.25rem;">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- ponytail: MODAL EDIT TIMELINE PROYEK (FASE 3) -->
    <div id="project-timeline-edit-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 12000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);">
        <div class="modal-card card-glass animate-in"
            style="max-width: 620px; width: 92%; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <div class="ejo-header-badge" style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge-ejo-code" style="color: #f59e0b; border-color: rgba(245, 158, 11, 0.4);">TIMELINE
                        PROYEK</span>
                    <span id="proj-timeline-modal-project-id"
                        style="font-size: 0.8rem; font-weight: 700; color: var(--color-cyan);">-</span>
                </div>
                <button class="modal-close" id="proj-timeline-btn-close">&times;</button>
            </div>
            <div class="modal-body" style="grid-template-columns: 1fr; gap: 1.25rem; padding: 1.25rem;">
                <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%;">
                    <h3
                        style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 6px;">
                        <i data-lucide="calendar" style="width: 18px; height: 18px; color: #f59e0b;"></i> Kelola
                        Timeline Proyek
                    </h3>
                    <p class="text-secondary text-xs" style="margin: 0; line-height: 1.4;">
                        Tambah atau perbarui entri timeline proyek. Masukkan tanggal (Tanggal, Bulan, Tahun) dan
                        deskripsi kegiatan.
                    </p>

                    <!-- Existing Timeline List Container -->
                    <div id="timeline-edit-items-container"
                        style="display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto; padding: 6px; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); background: var(--bg-secondary);">
                        <!-- Dynamic item rows inserted here -->
                    </div>

                    <!-- New Entry Form Box -->
                    <div
                        style="background: rgba(245, 158, 11, 0.05); border: 1px dashed rgba(245, 158, 11, 0.3); border-radius: var(--border-radius-sm); padding: 10px; display: flex; flex-direction: column; gap: 8px;">
                        <span
                            style="font-size: 0.8rem; font-weight: 700; color: #f59e0b; display: flex; align-items: center; gap: 4px;">
                            <i data-lucide="plus-circle" style="width: 14px; height: 14px;"></i> Tambah Entri Timeline
                            Baru
                        </span>
                        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; width: 100%;">
                            <div>
                                <label
                                    style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 3px;">Tanggal,
                                    Bulan, Tahun</label>
                                <input type="date" id="input-new-timeline-date" class="input-sm"
                                    style="width: 100%; font-size: 0.82rem; box-sizing: border-box;">
                            </div>
                            <div>
                                <label
                                    style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 3px;">Deskripsi
                                    Timeline</label>
                                <input type="text" id="input-new-timeline-desc" class="input-sm"
                                    style="width: 100%; font-size: 0.82rem; box-sizing: border-box;"
                                    placeholder="Contoh: Pemasangan & Testing Komponen A">
                            </div>
                        </div>
                        <div style="display: flex; justify-content: flex-end; margin-top: 2px;">
                            <button class="btn btn-outline btn-xs" id="btn-add-timeline-item"
                                style="border-color: #f59e0b; color: #f59e0b; padding: 4px 10px; font-size: 0.78rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                <i data-lucide="plus" style="width: 12px; height: 12px;"></i> Tambah Ke Daftar
                            </button>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 0.5rem;">
                        <button class="btn btn-outline" id="btn-cancel-timeline-modal"
                            style="padding: 0.5rem 1rem;">Batal</button>
                        <button class="btn btn-primary" id="btn-save-timeline-modal"
                            style="padding: 0.5rem 1.25rem; background: #f59e0b; border-color: #f59e0b;">Simpan
                            Timeline</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ponytail: MODAL UPLOAD FOTO DOKUMENTASI EKSEKUSI (FASE 3 PROJECT) -->
    <div id="project-execution-doc-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 12000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);">
        <div class="card-glass animate-in"
            style="width: 90%; max-width: 500px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; align-items: flex-start; text-align: left; box-shadow: var(--shadow-lg);">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <div
                        style="background: rgba(14, 165, 233, 0.12); color: var(--color-cyan); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="camera" style="width: 20px; height: 20px;"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Foto
                            Dokumentasi Eksekusi</h4>
                        <span id="proj-exec-modal-project-id"
                            style="font-size: 0.75rem; color: var(--color-cyan); font-weight: 600;">-</span>
                    </div>
                </div>
                <button class="modal-close" id="proj-exec-btn-close"
                    style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary);">&times;</button>
            </div>

            <p style="margin: 0; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.4;">
                Silakan pilih atau seret foto dokumentasi hasil pekerjaan eksekusi untuk melanjutkan proyek ke fase
                Commissioning &amp; Serah Terima.
            </p>

            <!-- Error Alert Box -->
            <div id="proj-exec-error-alert"
                style="display: none; width: 100%; padding: 10px 14px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--border-radius-sm); color: #f87171; font-size: 0.82rem; font-weight: 600; align-items: center; gap: 8px; box-sizing: border-box;">
                <i data-lucide="alert-triangle" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                <span id="proj-exec-error-text">Wajib memilih/mengunggah foto dokumentasi eksekusi terlebih
                    dahulu!</span>
            </div>

            <!-- Existing Uploaded Execution Photos Gallery -->
            <div id="proj-exec-modal-existing-sec"
                style="display: none; width: 100%; flex-direction: column; gap: 6px;">
                <span
                    style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Foto
                    Dokumentasi Terunggah Saat Ini:</span>
                <div id="proj-exec-modal-existing-list" style="display: flex; gap: 8px; flex-wrap: wrap;"></div>
            </div>

            <!-- Drag & Drop Photo Upload Box -->
            <div id="proj-exec-upload-dropzone" class="file-upload-mock"
                style="width: 100%; min-height: 110px; border: 2px dashed var(--card-border); border-radius: var(--border-radius-sm); display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 8px; cursor: pointer; transition: background 0.2s, border-color 0.2s; box-sizing: border-box; padding: 1.25rem;">
                <i data-lucide="camera" style="width: 28px; height: 28px; color: var(--color-cyan);"></i>
                <span id="proj-exec-file-label"
                    style="font-size: 0.88rem; font-weight: 600; color: var(--text-primary); text-align: center;">Klik
                    atau Ambil Foto via Kamera (Galeri / Kamera HP)</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Mendukung Langsung Kamera HP (JPG, PNG,
                    WEBP)</span>
                <input type="file" id="proj-exec-modal-file-input" style="display: none;" accept="image/*"
                    capture="environment">
            </div>

            <!-- Live Image Thumbnail Preview Box -->
            <div id="proj-exec-file-preview-sec"
                style="display: none; width: 100%; justify-content: center; align-items: center; padding: 10px; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); box-sizing: border-box;">
                <img id="proj-exec-file-preview-img"
                    style="max-height: 150px; max-width: 100%; object-fit: contain; border-radius: 6px; box-shadow: var(--shadow-sm);"
                    alt="Preview">
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.5rem;">
                <button class="btn btn-outline full-width" id="proj-exec-btn-cancel" type="button"
                    style="padding: 0.65rem;">Batal</button>
                <button class="btn btn-primary full-width" id="proj-exec-btn-confirm" type="button"
                    style="padding: 0.65rem; font-weight: 600;">Unggah &amp; Lanjutkan</button>
            </div>
        </div>
    </div>

    <!-- ponytail: GLOBAL IMAGE LIGHTBOX PREVIEW POPUP MODAL -->
    <div id="image-preview-modal" class="modal-backdrop"
        style="display: none; justify-content: center; align-items: center; z-index: 15000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);"
        onclick="if(event.target === this) closeImagePreviewModal();">
        <div class="card-glass animate-in"
            style="width: 92vw; max-width: 900px; max-height: 92vh; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; align-items: stretch; text-align: left; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.15);">
            <div
                style="display: flex; justify-content: space-between; align-items: center; width: 100%; border-bottom: 1px solid var(--card-border); padding-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="image" style="width: 20px; height: 20px; color: var(--color-cyan);"></i>
                    <h4 id="image-preview-modal-title"
                        style="margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Pratinjau
                        Foto Dokumentasi</h4>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button id="image-preview-modal-delete-btn" type="button" class="btn btn-danger-outline btn-xs"
                        style="padding: 4px 10px; font-size: 0.75rem; display: none; align-items: center; gap: 4px; border-color: rgba(239, 68, 68, 0.45); color: #f87171;"
                        title="Hapus foto ini">
                        <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i> Hapus Foto
                    </button>
                    <a id="image-preview-modal-external-btn" href="#" target="_blank" class="btn btn-outline btn-xs"
                        style="padding: 4px 10px; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px;"
                        title="Buka gambar di tab baru">
                        <i data-lucide="external-link" style="width: 13px; height: 13px;"></i> Buka Tab Baru
                    </a>
                    <button id="image-preview-modal-close-btn" onclick="closeImagePreviewModal()" class="modal-close"
                        style="background: rgba(255, 255, 255, 0.08); border: 1px solid var(--card-border); font-size: 1.2rem; cursor: pointer; color: var(--text-primary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: 0.2s;"
                        title="Tutup (Esc)">&times;</button>
                </div>
            </div>
            <div class="image-preview-container"
                style="width: 100%; flex: 1; min-height: 0; border-radius: var(--border-radius-md); display: flex; align-items: center; justify-content: center; overflow: auto; padding: 1rem; box-sizing: border-box;">
                <img id="image-preview-modal-img" src="" alt="Pratinjau Foto"
                    style="max-width: 100%; max-height: 75vh; object-fit: contain; border-radius: 6px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); transition: transform 0.2s ease;" />
            </div>
        </div>
    </div>

    <!-- MODAL EDIT AKSES & OTORITAS USER (SERVER EXCLUSIVE) -->
    <div class="modal-backdrop" id="modal-user-access-edit"
        style="display: none; justify-content: center; align-items: center; z-index: 14000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(6px);">
        <div class="modal-card card-glass animate-in"
            style="max-width: 680px; width: 92%; padding: 0; overflow: hidden; border-radius: 16px; border: 1px solid rgba(6, 182, 212, 0.3); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
            <div class="modal-header"
                style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--card-border); display: flex; justify-content: space-between; align-items: center; background: rgba(6, 182, 212, 0.08);">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div
                        style="width: 40px; height: 40px; border-radius: 10px; background: rgba(6, 182, 212, 0.15); color: var(--color-cyan); display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="sliders" style="width: 22px; height: 22px;"></i>
                    </div>
                    <div>
                        <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0; color: var(--text-primary);">
                            Pengaturan Hak Akses Akun</h3>
                        <p class="text-secondary text-xs" style="margin: 3px 0 0 0;" id="modal-user-access-subtitle">
                            Konfigurasi hak akses modul & status akun</p>
                    </div>
                </div>
                <button type="button" class="modal-close-btn" onclick="closeUserAccessModal()"
                    style="background: rgba(255, 255, 255, 0.05); border: 1px solid var(--card-border); color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: 0.2s;"
                    title="Tutup">
                    <i data-lucide="x" style="width: 18px; height: 18px;"></i>
                </button>
            </div>

            <div class="modal-body"
                style="padding: 1.5rem; max-height: 75vh; overflow-y: auto; display: flex; flex-direction: column; gap: 1.25rem;">
                <input type="hidden" id="access-modal-target-username">
                <input type="hidden" id="access-modal-target-dept">
                <input type="hidden" id="access-modal-target-role">

                <!-- Top Row: Account Status Box & Quick Presets Bar side-by-side -->
                <div style="display: grid; grid-template-columns: 1fr 1.1fr; gap: 1rem; align-items: stretch;">
                    <!-- Account Status Box -->
                    <div class="account-status-box" style="margin: 0; height: 100%; box-sizing: border-box;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div
                                style="width: 36px; height: 36px; border-radius: 50%; background: rgba(16, 185, 129, 0.12); color: #10b981; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i data-lucide="user-check" style="width: 18px; height: 18px;"></i>
                            </div>
                            <div>
                                <h4 style="font-size: 0.9rem; font-weight: 700; margin: 0; color: var(--text-primary);">
                                    Status Akun</h4>
                                <p class="text-secondary text-xs" style="margin: 2px 0 0 0;">Toggle status aktif /
                                    suspend user.</p>
                            </div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="access-modal-is-active" checked>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <!-- Quick Presets Bar -->
                    <div
                        style="padding: 0.85rem 1rem; border-radius: 12px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--card-border); display: flex; flex-direction: column; justify-content: center; gap: 6px;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <i data-lucide="zap" style="width: 13px; height: 13px; color: var(--color-cyan);"></i>
                            <label
                                style="font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Preset
                                Akses Cepat</label>
                        </div>
                        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                            <button type="button" class="btn btn-outline text-xs"
                                onclick="applyAccessPreset('default_role')"
                                style="padding: 4px 8px; font-size: 0.72rem; border-radius: 6px; border-color: rgba(6, 182, 212, 0.4); color: var(--color-cyan); font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                <i data-lucide="shield-check" style="width: 12px; height: 12px;"></i> Default Role &
                                Dept
                            </button>
                            <button type="button" class="btn btn-outline text-xs"
                                onclick="applyAccessPreset('all_access')"
                                style="padding: 4px 8px; font-size: 0.72rem; border-radius: 6px;">
                                Full Access
                            </button>
                            <button type="button" class="btn btn-outline text-xs"
                                onclick="applyAccessPreset('engineer')"
                                style="padding: 4px 8px; font-size: 0.72rem; border-radius: 6px;">
                                Engineer
                            </button>
                            <button type="button" class="btn btn-outline text-xs" onclick="applyAccessPreset('staff')"
                                style="padding: 4px 8px; font-size: 0.72rem; border-radius: 6px;">
                                Staff
                            </button>
                            <button type="button" class="btn btn-outline text-xs"
                                onclick="applyAccessPreset('readonly')"
                                style="padding: 4px 8px; font-size: 0.72rem; border-radius: 6px;">
                                Read-Only
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Section 1: Hak Akses Modul Utama -->
                <div>
                    <div
                        style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; border-bottom: 1px solid var(--card-border); padding-bottom: 6px;">
                        <i data-lucide="layout-grid" style="width: 15px; height: 15px; color: var(--color-cyan);"></i>
                        <h4 style="font-size: 0.9rem; font-weight: 700; margin: 0; color: var(--text-primary);">Hak
                            Akses Modul Utama</h4>
                    </div>

                    <div class="perm-matrix-grid">
                        <div class="perm-card">
                            <div class="perm-card-info">
                                <div class="perm-card-icon"
                                    style="background: rgba(6, 182, 212, 0.12); color: #06b6d4;"><i
                                        data-lucide="layout-dashboard" style="width: 16px; height: 16px;"></i></div>
                                <div>
                                    <h5 class="perm-card-title">Dashboard (Overview)</h5>
                                    <p class="perm-card-desc">Ringkasan & KPI</p>
                                </div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="perm-overview" checked>
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div class="perm-card">
                            <div class="perm-card-info">
                                <div class="perm-card-icon"><i data-lucide="file-text"
                                        style="width: 16px; height: 16px;"></i></div>
                                <div>
                                    <h5 class="perm-card-title">General EJO</h5>
                                    <p class="perm-card-desc">Pekerjaan langsung</p>
                                </div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="perm-gejo" checked>
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div class="perm-card">
                            <div class="perm-card-info">
                                <div class="perm-card-icon"
                                    style="background: rgba(59, 130, 246, 0.12); color: #3b82f6;"><i data-lucide="image"
                                        style="width: 16px; height: 16px;"></i></div>
                                <div>
                                    <h5 class="perm-card-title">Drawing EJO</h5>
                                    <p class="perm-card-desc">Gambar & desain</p>
                                </div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="perm-drawing" checked>
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div class="perm-card">
                            <div class="perm-card-info">
                                <div class="perm-card-icon"
                                    style="background: rgba(139, 92, 246, 0.12); color: #8b5cf6;"><i
                                        data-lucide="folder-kanban" style="width: 16px; height: 16px;"></i></div>
                                <div>
                                    <h5 class="perm-card-title">Project Monitoring</h5>
                                    <p class="perm-card-desc">Proyek 4 fase</p>
                                </div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="perm-project" checked>
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div class="perm-card">
                            <div class="perm-card-info">
                                <div class="perm-card-icon"
                                    style="background: rgba(16, 185, 129, 0.12); color: #10b981;"><i
                                        data-lucide="wrench" style="width: 16px; height: 16px;"></i></div>
                                <div>
                                    <h5 class="perm-card-title">Dashboard Part</h5>
                                    <p class="perm-card-desc">Repair part & cost</p>
                                </div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="perm-partlist" checked>
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div class="perm-card">
                            <div class="perm-card-info">
                                <div class="perm-card-icon"
                                    style="background: rgba(245, 158, 11, 0.12); color: #f59e0b;"><i
                                        data-lucide="archive" style="width: 16px; height: 16px;"></i></div>
                                <div>
                                    <h5 class="perm-card-title">History EJO</h5>
                                    <p class="perm-card-desc">Arsip selesai & batal</p>
                                </div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="perm-history" checked>
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div class="perm-card">
                            <div class="perm-card-info">
                                <div class="perm-card-icon"
                                    style="background: rgba(239, 68, 68, 0.12); color: #ef4444;"><i
                                        data-lucide="shield-alert" style="width: 16px; height: 16px;"></i></div>
                                <div>
                                    <h5 class="perm-card-title">Admin Panel</h5>
                                    <p class="perm-card-desc">Kelola database</p>
                                </div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="perm-admin">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Section 2: Hak Otoritas & Tanda Tangan -->
                <div>
                    <div
                        style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; border-bottom: 1px solid var(--card-border); padding-bottom: 6px;">
                        <i data-lucide="check-square" style="width: 15px; height: 15px; color: var(--color-cyan);"></i>
                        <h4 style="font-size: 0.9rem; font-weight: 700; margin: 0; color: var(--text-primary);">Hak
                            Otoritas & Tanda Tangan</h4>
                    </div>

                    <div class="perm-matrix-grid">
                        <div class="perm-card">
                            <div class="perm-card-info">
                                <div class="perm-card-icon"
                                    style="background: rgba(14, 165, 233, 0.12); color: #0ea5e9;"><i
                                        data-lucide="check-square" style="width: 16px; height: 16px;"></i></div>
                                <div>
                                    <h5 class="perm-card-title">Otoritas Approval</h5>
                                    <p class="perm-card-desc">Menyetujui EJO</p>
                                </div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="perm-approval" checked>
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div class="perm-card">
                            <div class="perm-card-info">
                                <div class="perm-card-icon"
                                    style="background: rgba(168, 85, 247, 0.12); color: #a855f7;"><i
                                        data-lucide="pen-tool" style="width: 16px; height: 16px;"></i></div>
                                <div>
                                    <h5 class="perm-card-title">Input Tanda Tangan</h5>
                                    <p class="perm-card-desc">Upload tanda tangan</p>
                                </div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="perm-signature" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer"
                style="padding: 1.1rem 1.5rem; border-top: 1px solid var(--card-border); display: flex; justify-content: flex-end; gap: 12px; background: rgba(0, 0, 0, 0.2);">
                <button type="button" class="btn btn-outline" onclick="closeUserAccessModal()"
                    style="padding: 8px 16px; font-size: 0.85rem;">Batal</button>
                <button type="button" class="btn btn-primary glow-button" onclick="saveUserAccessSettings()"
                    style="padding: 8px 20px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 8px;">
                    <i data-lucide="save" style="width: 16px; height: 16px;"></i> Simpan Hak Akses
                </button>
            </div>
        </div>
    </div>

    <!-- MODAL DASHBOARD WIDGET ACCESS PERMISSION EDIT (EKSKLUSIF SERVER) -->
    <div class="modal-backdrop" id="modal-dashboard-widget-access"
        onclick="if(event.target === this) closeDashboardWidgetAccessModal()"
        style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; align-items: center; justify-content: center; z-index: 15000; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(6px);">
        <div class="modal-card card-glass animate-in"
            style="max-width: 680px; width: 92%; padding: 0; overflow: hidden; border-radius: 16px; border: 1px solid rgba(6, 182, 212, 0.3); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
            <div class="modal-header widget-access-modal-header">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div
                        style="width: 40px; height: 40px; border-radius: 10px; background: rgba(6, 182, 212, 0.15); color: var(--color-cyan); display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="layout-dashboard" style="width: 22px; height: 22px;"></i>
                    </div>
                    <div>
                        <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0; color: var(--text-primary);"
                            id="widget-access-modal-title">Konfigurasi Akses Widget</h3>
                        <p class="text-secondary text-xs" style="margin: 3px 0 0 0;" id="widget-access-modal-subtitle">
                            Tentukan role mana saja yang diizinkan melihat widget ini di Dashboard.</p>
                    </div>
                </div>
                <button type="button" class="modal-close-btn" onclick="closeDashboardWidgetAccessModal()"
                    style="background: rgba(255, 255, 255, 0.05); border: 1px solid var(--card-border); color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: 0.2s;"
                    title="Tutup">
                    <i data-lucide="x" style="width: 18px; height: 18px;"></i>
                </button>
            </div>

            <div class="modal-body"
                style="padding: 1.5rem; max-height: 75vh; overflow-y: auto; display: flex; flex-direction: column; gap: 1.25rem;">
                <input type="hidden" id="widget-access-target-key" value="">

                <!-- Access Mode Selector -->
                <div class="widget-access-mode-box">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <i data-lucide="shield" style="width: 16px; height: 16px; color: var(--color-cyan);"></i>
                        <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin: 0;"
                            id="widget-access-mode-label">Mode Akses Tampil Widget:</label>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <label class="widget-access-mode-tile">
                            <input type="radio" name="widget-access-mode" value="all" checked
                                onchange="toggleWidgetRoleSelector()">
                            <span id="widget-access-label-all"><strong>Tampilkan ke Semua Role & Akun</strong>
                                (Default)</span>
                        </label>
                        <label class="widget-access-mode-tile">
                            <input type="radio" name="widget-access-mode" value="custom"
                                onchange="toggleWidgetRoleSelector()">
                            <span id="widget-access-label-custom"><strong>Batasi Akses Tampil</strong> (Pilih Role
                                tertentu yang BISA melihat)</span>
                        </label>
                        <label class="widget-access-mode-tile">
                            <input type="radio" name="widget-access-mode" value="exclude"
                                onchange="toggleWidgetRoleSelector()">
                            <span id="widget-access-label-exclude"><strong>Tampilkan ke Semua, KECUALI...</strong>
                                (Pilih Role yang DISEMBUNYIKAN / TIDAK BISA melihat)</span>
                        </label>
                    </div>
                </div>

                <!-- Roles Checkboxes Container -->
                <div id="widget-role-selector-container" style="display: none; flex-direction: column; gap: 10px;">
                    <div
                        style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="users" style="width: 16px; height: 16px; color: var(--color-cyan);"></i>
                            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);"
                                id="widget-role-selector-title">Pilih Role Yang Diizinkan Melihat Widget Ini:</span>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button type="button" class="btn btn-outline btn-xs" onclick="selectAllWidgetRoles(true)"
                                style="padding: 3px 10px; font-size: 0.75rem; border-radius: 6px;">Pilih Semua</button>
                            <button type="button" class="btn btn-outline btn-xs" onclick="selectAllWidgetRoles(false)"
                                style="padding: 3px 10px; font-size: 0.75rem; border-radius: 6px;">Hapus Semua</button>
                        </div>
                    </div>
                    <div id="widget-roles-checkbox-grid">
                        <!-- Checkboxes dynamically generated by JS -->
                    </div>
                </div>
            </div>

            <div class="modal-footer widget-access-modal-footer">
                <button type="button" class="btn btn-outline" onclick="closeDashboardWidgetAccessModal()"
                    style="padding: 8px 18px; font-size: 0.85rem; border-radius: 8px;">Batal</button>
                <button type="button" class="btn btn-primary glow-button" onclick="saveDashboardWidgetPermission()"
                    style="padding: 8px 22px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 8px; border-radius: 8px;">
                    <i data-lucide="save" style="width: 16px; height: 16px;"></i> Simpan Hak Akses
                </button>
            </div>
        </div>
    </div>




    <!-- TOAST POPUP FOR ALERTS -->
    <div class="toast-container" id="toast-container"></div>


    <!-- Script -->
    <!-- SheetJS Excel Library -->
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
    <!-- ponytail: App Logic -->
    <script src="app.js?v=36.7"></script>
</body>

</html>