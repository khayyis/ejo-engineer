// ponytail: Client-side storage (localStorage) is used for persistence to simplify setup and eliminate a complex database backend.
// ponytail: Chart.js is integrated directly via script tag rather than NPM bundling to keep dependencies and build tooling minimal.

// ponytail: Robust defensive checks to prevent script crashes in offline environments
window.addEventListener('error', (event) => {
    const errDiv = document.createElement('div');
    errDiv.className = 'runtime-error-toast';
    errDiv.style.position = 'fixed';
    errDiv.style.bottom = '15px';
    errDiv.style.left = '15px';
    errDiv.style.backgroundColor = '#f43f5e';
    errDiv.style.color = '#ffffff';
    errDiv.style.padding = '12px 18px';
    errDiv.style.borderRadius = '8px';
    errDiv.style.zIndex = '99999';
    errDiv.style.fontFamily = 'monospace';
    errDiv.style.fontSize = '11px';
    errDiv.style.lineHeight = '1.4';
    errDiv.style.maxWidth = '90vw';
    errDiv.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    errDiv.style.border = '1px solid rgba(255,255,255,0.2)';
    errDiv.textContent = `[JS Error] ${event.message} (${event.filename.split('/').pop()}:${event.lineno})`;
    document.body.appendChild(errDiv);
});

function showVisualError(err) {
    const errDiv = document.createElement('div');
    errDiv.className = 'runtime-error-toast';
    errDiv.style.position = 'fixed';
    errDiv.style.bottom = '15px';
    errDiv.style.left = '15px';
    errDiv.style.backgroundColor = '#f43f5e';
    errDiv.style.color = '#ffffff';
    errDiv.style.padding = '12px 18px';
    errDiv.style.borderRadius = '8px';
    errDiv.style.zIndex = '99999';
    errDiv.style.fontFamily = 'monospace';
    errDiv.style.fontSize = '11px';
    errDiv.style.lineHeight = '1.4';
    errDiv.style.maxWidth = '90vw';
    errDiv.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    errDiv.style.border = '1px solid rgba(255,255,255,0.2)';
    errDiv.style.whiteSpace = 'pre-wrap';
    errDiv.textContent = `[Caught Error] ${err.name}: ${err.message}\n${err.stack || ''}`;
    document.body.appendChild(errDiv);
}

if (typeof lucide === 'undefined') {
    window.lucide = {
        createIcons: () => console.warn("Lucide icons library not loaded.")
    };
}
if (typeof Chart === 'undefined') {
    window.Chart = class DummyChart {
        constructor(ctx) {
            console.warn("Chart.js library is not loaded. Skipping chart rendering.");
            let canvas = null;
            if (ctx && ctx.canvas) canvas = ctx.canvas;
            else if (ctx instanceof HTMLCanvasElement) canvas = ctx;
            else if (typeof ctx === 'string') canvas = document.getElementById(ctx);

            if (canvas && canvas.parentElement) {
                canvas.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:0.8rem;color:var(--text-muted);text-align:center;padding:1rem;">Grafik tidak dapat dimuat (Koneksi Offline)</div>';
            }
        }
        destroy() { }
    };
}

// Default EJO Dataset
const defaultEJOs = [
    {
        id: "EJO-2026-001",
        title: "Perbaikan Kebocoran Hidrolik Press Machine #3",
        dept: "Production",
        category: "Mekanik",
        priority: "Emergency",
        location: "Press Area - Line 1",
        targetDate: "2026-06-25",
        status: "In Progress",
        engineer: "Ahmad Dani",
        estCost: 5000000,
        actCost: 4500000,
        description: "Terjadi kebocoran oli hidrolik pada cylinder clamping Press Machine #3 yang mengakibatkan penurunan tekanan kerja. Kebutuhan spare part: Seal Kit Cylinder Clamping & Oli Hidrolik ISO VG 46.",
        logs: [
            { date: "2026-06-22 08:30", message: "Job Order diajukan oleh Dept Production." },
            // ponytail: rename Lead Engineer -> Foreman
            { date: "2026-06-22 09:15", message: "Disetujui oleh Ahmad Dani (Foreman)." },
            { date: "2026-06-22 10:00", message: "Status diubah menjadi In Progress. Penugasan kepada Ahmad Dani." }
        ]
    },
    {
        id: "EJO-2026-002",
        title: "Instalasi Sensor Proximity Otomatis Conveyor Belt B",
        dept: "Production",
        category: "Program",
        priority: "Medium",
        location: "Packaging Area",
        targetDate: "2026-06-30",
        status: "Requested",
        engineer: "Budi Utomo",
        estCost: 12000000,
        actCost: 0,
        description: "Penambahan sensor proximity photoelectric untuk mendeteksi bottle jamming secara otomatis pada conveyor line packaging. PLC Omron CP1E perlu diprogram ulang.",
        logs: [
            { date: "2026-06-23 07:45", message: "Job Order diajukan oleh Dept Production." }
        ]
    },
    {
        id: "EJO-2026-003",
        title: "Re-wiring Control Panel Chiller Unit 02",
        dept: "Maintenance",
        category: "Elektrik",
        priority: "High",
        location: "Utility Room 1",
        targetDate: "2026-06-20",
        status: "Completed",
        engineer: "Budi Utomo",
        estCost: 8000000,
        actCost: 8200000,
        description: "Kabel internal control panel chiller 02 mengalami korosi dan overloading. Telah dilakukan rewiring kabel power dan control serta penggantian MCB 3 Phase Schneider.",
        logs: [
            { date: "2026-06-18 13:00", message: "Job Order diajukan oleh Dept Maintenance." },
            { date: "2026-06-18 14:00", message: "Disetujui oleh Ahmad Dani." },
            { date: "2026-06-19 08:00", message: "Pekerjaan dimulai oleh Budi Utomo." },
            { date: "2026-06-20 16:30", message: "Pekerjaan selesai dilakukan. Pengujian chiller normal." }
        ]
    },
    {
        id: "EJO-2026-004",
        title: "Penguatan Struktur Warehouse Platform Area Rak B",
        dept: "HSE",
        category: "Sipil",
        priority: "Low",
        location: "Main Warehouse B1",
        targetDate: "2026-07-15",
        status: "Approved",
        engineer: "Charlie Santoso",
        estCost: 25000000,
        actCost: 0,
        description: "Pekerjaan perkuatan tiang baja platform mezzanine rak B guna mengantisipasi beban overload penyimpanan spare part berat. Menggunakan H-Beam 150 & pengelasan structural.",
        logs: [
            { date: "2026-06-21 10:00", message: "Job Order diajukan oleh Dept HSE." },
            // ponytail: rename Lead Engineer -> Foreman
            { date: "2026-06-22 14:30", message: "Disetujui oleh Ahmad Dani (Foreman)." }
        ]
    },
    {
        id: "EJO-2026-005",
        title: "Kalibrasi Temperature Controller Oven 4",
        dept: "Quality Control",
        category: "Kalibrasi",
        priority: "Medium",
        location: "QC Lab & Baking Room",
        targetDate: "2026-06-28",
        status: "In Progress",
        engineer: "Deddy Corbuzier",
        estCost: 3500000,
        actCost: 1200000,
        description: "Penyimpangan pembacaan temperatur oven 4 sebesar +5°C. Diperlukan re-kalibrasi thermo-controller Autonics menggunakan dry-block calibrator standar lab.",
        logs: [
            { date: "2026-06-22 15:00", message: "Job Order diajukan oleh Dept Quality Control." },
            { date: "2026-06-23 08:30", message: "Pekerjaan dimulai oleh Deddy Corbuzier." }
        ]
    }
];

// Default Project Dataset (3 phases)
const defaultProjects = [
    {
        id: "PRJ-2026-001",
        title: "Pemasangan Sistem SCADA Boiler House",
        dept: "Utility",
        budget: 150000000,
        targetDate: "2026-08-30",
        pic: "Budi Utomo",
        desc: "Integrasi pembacaan temperatur, steam pressure, dan flow rate boiler unit 1 & 2 ke sistem monitoring control room utama pabrik.",
        phase: 2 // Fase 2: Ide disetujui & Pengadaan
    },
    {
        id: "PRJ-2026-002",
        title: "Renovasi Area Penyimpanan Bahan Baku Cair",
        dept: "HSE",
        budget: 80000000,
        targetDate: "2026-09-15",
        pic: "Charlie Santoso",
        desc: "Pengecoran lantai epoxy, pembuatan tanggul pengaman tumpahan bahan kimia cair, dan pemasangan grounding tank pengaman petir.",
        phase: 1 // Fase 1: Inisialisasi Ide (Bos)
    },
    {
        id: "PRJ-2026-003",
        title: "Upgrade Line Sensor Detection Mesin Filling 250ml",
        dept: "Production",
        budget: 45000000,
        targetDate: "2026-07-10",
        pic: "Deddy Corbuzier",
        desc: "Penggantian limit switch lama dengan photoelectric proximity sensor berkecepatan tinggi merk Autonics. Semua barang telah siap di gudang.",
        phase: 3 // Fase 3: Tinggal Eksekusi (Barang tersedia)
    }
];

// Engineers dynamic list synced with database users
let engineersList = [
    { name: "Ahmad Dani", role: "Lead Mechanical & Hydraulics", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=80", skill: "Mekanik" },
    { name: "Budi Utomo", role: "Senior Electrical & Automation", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80", skill: "Elektrik/Program" },
    { name: "Charlie Santoso", role: "Structural Engineer & HSE Officer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80", skill: "Sipil" },
    { name: "Deddy Corbuzier", role: "Calibration & Instrumentation", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80", skill: "Kalibrasi" }
];

// ponytail: notifikasi sekarang server-side per-user, lihat state.notifications

// State Manager
let state = {
    ejos: [],
    generalEjos: [], // ponytail: DB terpisah, pekerjaan langsung
    drawings: [], // ponytail: galeri file drawing terpisah dari detail EJO
    drawingFormMode: 'request', // ponytail: 'request' or 'import'
    projects: [],
    repairParts: [], // ponytail: spare parts inventory from database
    activeTab: 'overview',
    activeProjectPhase: null, // ponytail: tracks currently filtered project phase in board (1, 2, 3 or null for all)
    activeGeneralEjoPhase: null, // ponytail: tracks currently filtered general EJO phase (1, 2, 3 or null for all)
    activeDrawingPhase: null, // ponytail: tracks currently filtered drawing phase (1, 2, 3 or null for all)
    viewMode: 'grid', // grid or table
    selectedEJO: null,
    editingGejoId: null,
    editingDrawingId: null,
    notifications: [], // ponytail: dari server, per-user
    charts: {}, // Store instances of ChartJS objects to destroy/update them
    trendPeriod: 'year', // ponytail: time range filter for trend chart (week, month, year)
    settings: {} // ponytail: global visual and display configurations from server
};

// ponytail: helper to check if a user role has Lead/Admin/Manager/Supervisor/Server authority based on hierarchy
const ROLE_LEVELS = {
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
};

const DRAFTER_ROLES = ['Drafter', 'Sipil', 'Mekanik', 'Elektrik', 'Program', 'Kalibrasi', 'Otomotif'];

const DEPARTMENT_OPTIONS = [
    { value: 'PRD', label: 'PRD (Production)' },
    { value: 'ENG', label: 'ENG (Engineering)' },
    { value: 'EPR', label: 'EPR (Engineering Produksi)' },
    { value: 'GA', label: 'GA (General Affair)' },
    { value: 'QC', label: 'QC (Quality Control)' },
    { value: 'WRH', label: 'WRH (Warehouse)' }
];

function normalizeDepartmentCode(dept) {
    if (!dept) return '';
    const clean = String(dept).trim();
    const upper = clean.toUpperCase();
    const mapping = {
        'PRD': 'PRD',
        'PRODUCTION': 'PRD',
        'ENG': 'ENG',
        'ENGINEERING': 'ENG',
        'UTILITY': 'ENG',
        'EPR': 'EPR',
        'ENGINEERING PRODUKSI': 'EPR',
        'ENGINEERING PRODUCTION': 'EPR',
        'GA': 'GA',
        'GENERAL AFFAIR': 'GA',
        'GENERAL AFFAIRS': 'GA',
        'QC': 'QC',
        'QUALITY CONTROL': 'QC',
        'WRH': 'WRH',
        'WAREHOUSE': 'WRH',
        'MAINTENANCE': 'WRH',
        'EKSPEDISI': 'WRH',
        'HSE': 'HSE'
    };
    return mapping[upper] || clean;
}

function getDepartmentDisplayLabel(dept) {
    const code = normalizeDepartmentCode(dept);
    const option = DEPARTMENT_OPTIONS.find(item => item.value === code);
    return option ? option.label : (code || dept || '-');
}

function departmentMatchesFilter(dept, filterVal) {
    return filterVal === 'all' || normalizeDepartmentCode(dept) === filterVal;
}

function getRoleLevel(role) {
    return ROLE_LEVELS[role] || 0;
}

function isLeadRole(role) {
    return getRoleLevel(role) >= 40;
}

function isForemanAdminRole(role) {
    return role === 'Foreman' || role === 'Admin' || role === 'Server';
}

function isDrafterRole(role) {
    return DRAFTER_ROLES.includes(role);
}

// ponytail: helper to apply sidebar layout & display rules based on user role
function applySidebarRoleRestrictions() {
    if (!state.currentUser) return;

    const role = state.currentUser.role;
    const isTechNonDrafter = isDrafterRole(role) && role !== 'Drafter';

    // 1. Hide overview button for Drafter roles
    const overviewBtn = document.querySelector('.nav-btn[data-tab="overview"]');
    if (overviewBtn) {
        overviewBtn.style.display = isDrafterRole(role) ? 'none' : 'flex';
    }

    // 2. Hide/show EJO limit & actions container based on role
    const limitContainerEl = document.getElementById("gejo-limit-container");
    const controlBarEl = document.querySelector("#tab-general-ejo .control-bar");
    if (isDrafterRole(role)) {
        if (limitContainerEl) limitContainerEl.style.display = 'none';
        if (controlBarEl) controlBarEl.style.gridTemplateColumns = '1.5fr 2fr';
    } else {
        if (limitContainerEl) limitContainerEl.style.display = 'flex';
        if (controlBarEl) controlBarEl.style.gridTemplateColumns = '1.5fr 2fr auto';
        const gejoCreateBtn = document.getElementById("gejo-btn-quick-new");
        if (gejoCreateBtn) {
            gejoCreateBtn.style.display = checkGeneralEjoLimit() ? 'none' : 'flex';
        }
    }

    // 3. Hide/show admin panel button based on role
    const adminBtn = document.getElementById("nav-admin-btn");
    if (adminBtn) {
        adminBtn.style.display = isLeadRole(role) ? 'flex' : 'none';
    }

    // 4. Handle EJO dropdown hierarchy and submenu based on roles
    const ejoChevronBtn = document.querySelector("#btn-nav-job-orders .dropdown-chevron-btn");
    const ejoSubmenu = document.getElementById("job-orders-submenu");
    const btnNavGeneralEjo = document.getElementById("btn-nav-general-ejo");
    const generalEjoSubmenu = document.getElementById("general-ejo-submenu");
    const drawingDropdown = document.getElementById("drawing-dropdown-container");
    const btnNavDrawing = document.getElementById("btn-nav-drawing");
    const drawingSubmenu = document.getElementById("drawing-submenu");
    const repairPartsBtn = document.querySelector('#job-orders-submenu .nav-btn[data-tab="repair-parts"]');
    const projectsDropdown = document.getElementById("projects-dropdown-container");

    if (role === 'Drafter') {
        // ponytail: drafter role only sees the drawing submenu under EJO, and EJO chevron button is visible to allow toggling it
        if (ejoChevronBtn) ejoChevronBtn.style.display = 'inline-flex';

        if (btnNavGeneralEjo) btnNavGeneralEjo.style.display = 'none';
        if (generalEjoSubmenu) generalEjoSubmenu.style.display = 'none';

        if (drawingDropdown) drawingDropdown.style.display = 'flex';
        if (btnNavDrawing) btnNavDrawing.style.display = 'none'; // hide the intermediate "Drawing" button
        if (drawingSubmenu) {
            drawingSubmenu.style.display = 'flex'; // directly display drawing sub-phases
            drawingSubmenu.style.paddingLeft = '0px'; // align nicely under EJO
            drawingSubmenu.style.marginTop = '0px';
        }

        if (repairPartsBtn) repairPartsBtn.style.display = 'none';
        if (projectsDropdown) projectsDropdown.style.display = 'none';
    } else if (isTechNonDrafter) {
        // Show EJO chevron (allowing it to toggle)
        if (ejoChevronBtn) ejoChevronBtn.style.display = 'inline-flex';

        // Hide General EJO parent button and force General EJO submenu to be visible directly inside the EJO dropdown container
        if (btnNavGeneralEjo) btnNavGeneralEjo.style.display = 'none';
        if (generalEjoSubmenu) {
            generalEjoSubmenu.style.display = 'flex';
            generalEjoSubmenu.style.paddingLeft = '0px'; // align submenu buttons nicely under EJO
            generalEjoSubmenu.style.marginTop = '0px';
        }

        // Hide drawing, repair parts, and projects
        if (drawingDropdown) drawingDropdown.style.display = 'none';
        if (repairPartsBtn) repairPartsBtn.style.display = 'none';
        if (projectsDropdown) projectsDropdown.style.display = 'none';
    } else {
        // Restore standard behavior/layout
        if (ejoChevronBtn) ejoChevronBtn.style.display = 'inline-flex';

        if (btnNavGeneralEjo) btnNavGeneralEjo.style.display = 'flex';
        if (generalEjoSubmenu) {
            generalEjoSubmenu.style.paddingLeft = '20px';
            generalEjoSubmenu.style.marginTop = '4px';
        }

        if (drawingDropdown) drawingDropdown.style.display = 'flex';
        if (btnNavDrawing) btnNavDrawing.style.display = 'flex';
        if (drawingSubmenu) {
            drawingSubmenu.style.paddingLeft = '20px';
            drawingSubmenu.style.marginTop = '4px';
        }
        if (repairPartsBtn) repairPartsBtn.style.display = 'flex';
        if (projectsDropdown) projectsDropdown.style.display = 'flex';
    }
}

// ponytail: helper to get allowed assignee roles based on logged-in user role
function getAllowedAssigneeRoles(currentUserRole) {
    if (currentUserRole === 'Foreman') {
        return [...DRAFTER_ROLES, 'Admin'];
    } else if (currentUserRole === 'Supervisor') {
        return ['Foreman', ...DRAFTER_ROLES, 'Admin'];
    } else if (currentUserRole === 'Manager' || currentUserRole === 'Plant Manager') {
        return ['Supervisor', 'Foreman', ...DRAFTER_ROLES, 'Admin'];
    } else {
        // Admin or Server can assign to anyone (except Server which is filtered globally)
        return ['Manager', 'Plant Manager', 'Supervisor', 'Foreman', ...DRAFTER_ROLES, 'Admin'];
    }
}

// ponytail: batalkan drawing — set status ke Cancelled (hanya untuk Schedule phase)
async function cancelDrawing(drawingId) {
    if (!await showCustomConfirm(`Batalkan request drawing ${drawingId}?`)) return;

    const drawing = (state.drawings || []).find(d => d.id === drawingId);
    if (!drawing) return;

    const now = new Date().toLocaleString('id-ID', { hour12: false }).replace(/\//g, '-');
    const userName = state.currentUser ? state.currentUser.fullname : 'user';

    const payload = {
        status: 'Cancelled',
        approvals: drawing.approvals || {},
        logs: [{
            date: now,
            message: `Request drawing dibatalkan oleh ${userName}.`
        }]
    };

    try {
        const res = await fetch(`/api/drawings/${drawingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Gagal membatalkan drawing");
        await initData();
        closeDrawingModal();
        renderDrawings();
        showToast(`Request Drawing ${drawingId} berhasil dibatalkan`, "warning");
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal membatalkan drawing", "error");
    }
}

// Initialization
// ==========================================
// ponytail: safe localStorage & sessionStorage wrappers to prevent crashes in private browsing or sandboxed environments
const safeStorage = {
    getItem(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    setItem(key, val) {
        try { localStorage.setItem(key, val); } catch (e) {}
    }
};
const safeSessionStorage = {
    getItem(key) {
        try { return sessionStorage.getItem(key); } catch (e) { return null; }
    },
    setItem(key, val) {
        try { sessionStorage.setItem(key, val); } catch (e) {}
    },
    removeItem(key) {
        try { sessionStorage.removeItem(key); } catch (e) {}
    }
};

// ponytail: Theme toggle — default light, safeStorage override
(function () {
    const saved = safeStorage.getItem('PTBAS_THEME') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

// ponytail: Generate or retrieve persistent unique device ID for single-device login restriction
let deviceId = safeStorage.getItem("PTBAS_DEVICE_ID");
if (!deviceId) {
    deviceId = 'device-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);
    safeStorage.setItem("PTBAS_DEVICE_ID", deviceId);
}

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    initClock();
    initEventListeners();
    applyDashboardSettings(); // ponytail: initialize dashboard visual settings

    // ponytail: check maintenance mode status on load
    fetch("/api/settings")
        .then(res => res.json())
        .then(settings => {
            state.settings = settings;
            applyDashboardSettings();
            applyMaintenanceSettings();

            // Check if maintenance mode is active and user is not Server
            if (settings.maintenance_mode === "1") {
                const user = safeSessionStorage.getItem("PTBAS_USER");
                const currentUser = user ? JSON.parse(user) : null;
                const isServer = currentUser && (
                    currentUser.role === 'Server' ||
                    currentUser.username === 'server' ||
                    (currentUser.role && currentUser.role.toLowerCase() === 'server')
                );
                if (!currentUser || !isServer) {
                    // Force log out if logged in
                    if (currentUser) {
                        safeSessionStorage.removeItem("PTBAS_USER");
                        state.currentUser = null;

                        // Stop any polling
                        if (window._notifPoll) { clearInterval(window._notifPoll); window._notifPoll = null; }
                        if (window._dataPoll) { clearInterval(window._dataPoll); window._dataPoll = null; }

                        // Hide dashboard, show login
                        const appContainer = document.querySelector(".app-container");
                        const loginContainer = document.getElementById("login-container");
                        if (appContainer) appContainer.style.display = 'none';
                        if (loginContainer) loginContainer.style.display = 'flex';
                    }

                    // Show maintenance warning on login screen
                    const errorMsg = document.getElementById("login-error-msg");
                    if (errorMsg) {
                        const span = errorMsg.querySelector("span");
                        if (span) span.textContent = "Server sedang dalam pemeliharaan (maintenance) / perbaikan. Akses ditutup sementara.";
                        errorMsg.style.color = "#f59e0b"; // amber warning color
                        errorMsg.style.display = 'flex';
                    }
                }
            }
        })
        .catch(err => console.error("Gagal memuat settings pada load:", err));

    // Theme toggle
    const btnTheme = document.getElementById('btn-theme-toggle');
    if (btnTheme) {
        function updateThemeIcon() {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            document.getElementById('theme-icon')?.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
            lucide.createIcons();
        }
        updateThemeIcon();
        btnTheme.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            safeStorage.setItem('PTBAS_THEME', next);
            updateThemeIcon();
        });
    }

    // ponytail: Sidebar collapse toggle
    const btnSidebar = document.getElementById('btn-sidebar-toggle');
    if (btnSidebar) {
        btnSidebar.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.toggle('hidden');
            }
        });
    }

    // ponytail: Fullscreen toggle
    const btnFullscreen = document.getElementById('btn-fullscreen-toggle');
    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', () => {
            const icon = document.getElementById('fullscreen-icon');
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().then(() => {
                    icon?.setAttribute('data-lucide', 'minimize');
                    lucide.createIcons();
                }).catch(err => {
                    console.error("Error attempting to enable fullscreen:", err);
                });
            } else {
                document.exitFullscreen().then(() => {
                    icon?.setAttribute('data-lucide', 'maximize');
                    lucide.createIcons();
                }).catch(err => {
                    console.error("Error attempting to exit fullscreen:", err);
                });
            }
        });

        document.addEventListener('fullscreenchange', () => {
            const icon = document.getElementById('fullscreen-icon');
            if (document.fullscreenElement) {
                icon?.setAttribute('data-lucide', 'minimize');
            } else {
                icon?.setAttribute('data-lucide', 'maximize');
            }
            lucide.createIcons();
        });
    }



    lucide.createIcons();
});

// ponytail: helper to log out user and clean up active session and state
async function logoutUser() {
    const user = state.currentUser;
    safeSessionStorage.removeItem("PTBAS_USER");
    state.currentUser = null;
    state.activeTab = 'overview';

    if (window._notifPoll) {
        clearInterval(window._notifPoll);
        window._notifPoll = null;
    }
    if (window._dataPoll) {
        clearInterval(window._dataPoll);
        window._dataPoll = null;
    }
    if (window._heartbeatPoll) {
        clearInterval(window._heartbeatPoll);
        window._heartbeatPoll = null;
    }

    if (user) {
        try {
            await fetch("/api/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username, device_id: deviceId })
            });
        } catch (err) {
            console.error("Gagal logout di server:", err);
        }
    }

    document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));

    const overviewPane = document.getElementById("tab-overview");
    if (overviewPane) overviewPane.classList.add("active");

    const overviewBtn = document.querySelector('.nav-btn[data-tab="overview"]');
    if (overviewBtn) {
        overviewBtn.style.display = 'flex'; // ponytail: reset overview button visibility on logout
        overviewBtn.classList.add("active");
    }

    const ejoChevron = document.querySelector("#btn-nav-job-orders .dropdown-chevron-btn");
    if (ejoChevron) {
        ejoChevron.style.display = 'inline-flex'; // ponytail: reset EJO chevron visibility on logout
    }

    const limitContainerEl = document.getElementById("gejo-limit-container");
    const controlBarEl = document.querySelector("#tab-general-ejo .control-bar");
    if (limitContainerEl) limitContainerEl.style.display = 'flex';
    if (controlBarEl) controlBarEl.style.gridTemplateColumns = '1.5fr 2fr auto';

    document.getElementById("login-container").style.display = 'flex';
    document.querySelector(".app-container").style.display = 'none';

    showToast("Anda telah keluar dari sistem", "warning");
}

// ponytail: send periodic heartbeat to server to maintain device session and check if superseded
async function sendHeartbeat() {
    if (!state.currentUser) return;
    try {
        const res = await fetch("/api/heartbeat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: state.currentUser.username, device_id: deviceId })
        });
        if (res.status === 403) {
            const data = await res.json();
            // Force logout immediately because this session has been taken over/superseded
            logoutUser();
            showToast(data.message || "Akun Anda telah masuk di perangkat lain.", "error");
        }
    } catch (err) {
        console.error("Gagal mengirim heartbeat:", err);
    }
}

function checkAuth() {
    const user = safeSessionStorage.getItem("PTBAS_USER");
    const loginContainer = document.getElementById("login-container");
    const appContainer = document.querySelector(".app-container");

    if (user) {
        state.currentUser = JSON.parse(user);
        if (loginContainer) loginContainer.style.display = 'none';
        if (appContainer) appContainer.style.display = 'flex';

        // Populate profile sidebar
        document.getElementById("sidebar-avatar").src = state.currentUser.avatar || "avatar-default.png";
        document.getElementById("sidebar-fullname").textContent = state.currentUser.fullname || "";
        document.getElementById("sidebar-role").textContent = state.currentUser.role || "";

        // ponytail: Fetch latest user details from server to sync role/permissions dynamically
        fetch("/api/users")
            .then(res => {
                if (res.ok) return res.json();
            })
            .then(users => {
                // ponytail: sync all user details including role, fullname, avatar, and signature dynamically
                if (users && state.currentUser) {
                    const freshUser = users.find(u => u.username === state.currentUser.username);
                    if (freshUser) {
                        let hasChanges = false;
                        if (state.currentUser.role !== freshUser.role) {
                            state.currentUser.role = freshUser.role;
                            hasChanges = true;
                        }
                        if (state.currentUser.fullname !== freshUser.fullname) {
                            state.currentUser.fullname = freshUser.fullname;
                            hasChanges = true;
                        }
                        if (state.currentUser.avatar !== freshUser.avatar) {
                            state.currentUser.avatar = freshUser.avatar;
                            hasChanges = true;
                        }
                        if (state.currentUser.signature !== freshUser.signature) {
                            state.currentUser.signature = freshUser.signature;
                            hasChanges = true;
                        }

                        if (hasChanges) {
                            safeSessionStorage.setItem("PTBAS_USER", JSON.stringify(state.currentUser));

                            // Update UI elements instantly
                            document.getElementById("sidebar-avatar").src = state.currentUser.avatar || "avatar-default.png";
                            document.getElementById("sidebar-fullname").textContent = state.currentUser.fullname;
                            document.getElementById("sidebar-role").textContent = state.currentUser.role;
                            if (state.currentUser.role === 'Drafter') {
                                // ponytail: redirect Drafter to drawing tab since it is their only accessible menu
                                if (state.activeTab === 'overview' || state.activeTab === 'admin' || state.activeTab === 'general-ejo') {
                                    state.activeTab = 'drawing';
                                }
                            } else if (isDrafterRole(state.currentUser.role) && state.activeTab === 'overview') {
                                state.activeTab = 'general-ejo';
                            }
                            if (!isLeadRole(state.currentUser.role) && state.activeTab === 'admin') {
                                state.activeTab = (state.currentUser.role === 'Drafter') ? 'drawing' : (isDrafterRole(state.currentUser.role) ? 'general-ejo' : 'overview');
                            }
                            applySidebarRoleRestrictions();

                            // ponytail: force active tab sync if role changed
                            switchTab(state.activeTab || 'overview');
                        }
                    }
                }
            })
            .catch(err => console.error("Failed to sync user role from server:", err));

        // ponytail: Show/hide server database management block & Server role option
        const isServerUser = state.currentUser && (
            state.currentUser.role === 'Server' ||
            state.currentUser.username === 'server' ||
            (state.currentUser.role && state.currentUser.role.toLowerCase() === 'server')
        );
        const serverDbControl = document.getElementById("server-db-control-bar");
        if (serverDbControl) {
            serverDbControl.style.display = isServerUser ? 'grid' : 'none';
        }
        const serverMaintenanceControl = document.getElementById("server-maintenance-control-bar");
        if (serverMaintenanceControl) {
            serverMaintenanceControl.style.display = isServerUser ? 'grid' : 'none';
        }
        const serverRoleOption = document.getElementById("role-option-server");
        if (serverRoleOption) {
            serverRoleOption.style.display = isServerUser ? 'block' : 'none';
        }

        if (state.currentUser && state.currentUser.role === 'Drafter') {
            // ponytail: redirect Drafter to drawing tab since it is their only accessible menu
            if (state.activeTab === 'overview' || state.activeTab === 'admin' || state.activeTab === 'general-ejo') {
                state.activeTab = 'drawing';
            }
        } else if (state.currentUser && isDrafterRole(state.currentUser.role) && state.activeTab === 'overview') {
            state.activeTab = 'general-ejo';
        }
        if (state.currentUser && !isLeadRole(state.currentUser.role) && state.activeTab === 'admin') {
            state.activeTab = (state.currentUser.role === 'Drafter') ? 'drawing' : (isDrafterRole(state.currentUser.role) ? 'general-ejo' : 'overview');
            const adminPane = document.getElementById("tab-admin");
            if (adminPane) adminPane.classList.remove("active");
            const adminBtn = document.getElementById("nav-admin-btn");
            if (adminBtn) adminBtn.classList.remove("active");
        }
        applySidebarRoleRestrictions();
        initData();
        // ponytail: start polling notifikasi live tiap 10 detik
        fetchNotifications();
        if (window._notifPoll) clearInterval(window._notifPoll);
        window._notifPoll = setInterval(fetchNotifications, 10000);
        // ponytail: start polling background data refresh every 4 seconds
        if (window._dataPoll) clearInterval(window._dataPoll);
        window._dataPoll = setInterval(refreshDataBackground, 4000);
        // ponytail: start heartbeat polling to enforce single-device login
        sendHeartbeat();
        if (window._heartbeatPoll) clearInterval(window._heartbeatPoll);
        window._heartbeatPoll = setInterval(sendHeartbeat, 10000);
    } else {
        if (window._notifPoll) {
            clearInterval(window._notifPoll);
            window._notifPoll = null;
        }
        if (window._dataPoll) {
            clearInterval(window._dataPoll);
            window._dataPoll = null;
        }
        if (window._heartbeatPoll) {
            clearInterval(window._heartbeatPoll);
            window._heartbeatPoll = null;
        }
        if (loginContainer) loginContainer.style.display = 'flex';
        if (appContainer) appContainer.style.display = 'none';
    }
}

async function initData() {
    if (!state.currentUser) return; // Block API calls if not logged in
    try {
        // ponytail: fetch settings safely
        try {
            const resSettings = await fetch("/api/settings");
            if (resSettings.ok) {
                state.settings = await resSettings.json();
            } else {
                state.settings = { show_status_prop: "0", maintenance_mode: "0" };
            }
        } catch (err) {
            state.settings = { show_status_prop: "0", maintenance_mode: "0" };
            console.warn("Gagal memuat settings:", err);
        }
        applyDashboardSettings();
        applyMaintenanceSettings();

        // ponytail: enforce maintenance mode check
        if (state.settings && state.settings.maintenance_mode === "1") {
            const isServer = state.currentUser && (
                state.currentUser.role === 'Server' ||
                state.currentUser.username === 'server' ||
                (state.currentUser.role && state.currentUser.role.toLowerCase() === 'server')
            );
            if (state.currentUser && !isServer) {
                safeSessionStorage.removeItem("PTBAS_USER");
                state.currentUser = null;

                if (window._notifPoll) { clearInterval(window._notifPoll); window._notifPoll = null; }
                if (window._dataPoll) { clearInterval(window._dataPoll); window._dataPoll = null; }

                const appContainer = document.querySelector(".app-container");
                const loginContainer = document.getElementById("login-container");
                if (appContainer) appContainer.style.display = 'none';
                if (loginContainer) loginContainer.style.display = 'flex';

                const errorMsg = document.getElementById("login-error-msg");
                if (errorMsg) {
                    const span = errorMsg.querySelector("span");
                    if (span) span.textContent = "Server sedang dalam pemeliharaan (maintenance) / perbaikan. Akses ditutup sementara.";
                    errorMsg.style.color = "#f59e0b"; // amber color
                    errorMsg.style.display = 'flex';
                }
                showToast("Server sedang dalam pemeliharaan (maintenance).", "warning");
                return;
            }
        }

        // ponytail: EJO reguler dinonaktifkan, set state.ejos = []
        state.ejos = [];

        // ponytail: load general EJOs (DB terpisah) safely
        try {
            const resGejos = await fetch("/api/general-ejos");
            if (resGejos.ok) {
                state.generalEjos = await resGejos.json();
            } else {
                state.generalEjos = [];
            }
        } catch (err) {
            state.generalEjos = [];
            console.warn("Gagal memuat general-ejos:", err);
        }

        // ponytail: jangan biarkan endpoint drawing yang belum aktif merusak seluruh initData
        try {
            const resDrawings = await fetch("/api/drawings");
            if (resDrawings.ok) {
                state.drawings = await resDrawings.json();
            } else {
                state.drawings = [];
            }
        } catch (err) {
            state.drawings = [];
            console.warn("Gagal memuat drawings:", err);
        }

        // ponytail: load projects safely
        try {
            const resProj = await fetch("/api/projects");
            if (resProj.ok) {
                state.projects = await resProj.json();
            } else {
                state.projects = [];
            }
        } catch (err) {
            state.projects = [];
            console.warn("Gagal memuat projects:", err);
        }

        // ponytail: Load repair parts from server safely
        try {
            const resParts = await fetch("/api/repair-parts");
            if (resParts.ok) {
                state.repairParts = await resParts.json();
            } else {
                state.repairParts = [];
            }
        } catch (err) {
            state.repairParts = [];
            console.warn("Gagal memuat repair-parts:", err);
        }

        // ponytail: Fetch dynamic users from SQLite database safely
        let allUsers = [];
        try {
            const resUsers = await fetch("/api/users");
            if (resUsers.ok) {
                allUsers = await resUsers.json();
            }
        } catch (err) {
            console.warn("Gagal memuat users:", err);
        }
        // ponytail: hide Server user from all frontend roles and assignees
        state.users = allUsers.filter(u => u.role !== 'Server' && u.username !== 'server');

        // ponytail: Keep engineersList synced with database users dynamically
        engineersList = state.users.map(u => ({
            name: u.fullname,
            role: u.role,
            avatar: u.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80'
        }));
        populateEngineerDropdowns();

        // Safety check: if the active tab is admin but the user is not authorized, reset to overview
        // ponytail: rename Lead Engineer -> Foreman
        if (state.activeTab === 'admin' && !isLeadRole(state.currentUser.role)) {
            state.activeTab = 'overview';
        }

        // Always force switchTab to synchronize HTML DOM classes with activeTab state
        switchTab(state.activeTab || 'overview');
        runExcelSelfTest();
    } catch (err) {
        console.error("Gagal mengambil data dari database server:", err);
        showToast("Koneksi ke database server gagal!", "error");
        showVisualError(err);
    }
}

// ponytail: Rebuild select dropdown elements with dynamic users fetched from database
function populateEngineerDropdowns() {
    const dropdowns = [
        { id: "form-engineer", hasUnassigned: true, unassignedText: "Belum Ditentukan (Antrean Admin)" },
        { id: "proj-pic", hasUnassigned: false }
    ];

    const allowedRoles = getAllowedAssigneeRoles(state.currentUser ? state.currentUser.role : "");

    dropdowns.forEach(dd => {
        const el = document.getElementById(dd.id);
        if (!el) return;

        // Store current value to re-select it after rebuilding options
        const val = el.value;

        let html = "";
        if (dd.hasUnassigned) {
            html += `<option value="Unassigned">${dd.unassignedText}</option>`;
        }

        // ponytail: filter EJO assignees by role restrictions, projects PIC is only hierarchy roles (excluding Admin & User)
        const filteredEngs = dd.id === "form-engineer"
            ? engineersList.filter(eng => allowedRoles.includes(eng.role))
            : engineersList.filter(eng => [...DRAFTER_ROLES, 'Foreman', 'Supervisor', 'Manager', 'Plant Manager'].includes(eng.role));

        html += filteredEngs.map(eng => {
            return `<option value="${eng.name}">${eng.name} (${eng.role})</option>`;
        }).join('');

        el.innerHTML = html;

        // Re-select value if it still exists
        if (val) el.value = val;
    });

    // ponytail: populate checkbox container for EJO details modal assignee
    const container = document.getElementById("modal-assignee-container");
    if (container) {
        let html = `
            <label style="display: flex; align-items: center; gap: 8px; font-weight: normal; cursor: pointer; font-size: 0.8rem; margin: 0;">
                <input type="checkbox" id="assignee-unassigned" value="Unassigned" checked> Unassigned (Belum ditunjuk)
            </label>
        `;

        // ponytail: filter assignees by role restrictions
        const filteredEngs = engineersList.filter(eng => allowedRoles.includes(eng.role));

        html += filteredEngs.map(eng => {
            return `
                <label style="display: flex; align-items: center; gap: 8px; font-weight: normal; cursor: pointer; font-size: 0.8rem; margin: 0;">
                    <input type="checkbox" class="assignee-check" value="${eng.name}"> ${eng.name} (${eng.role})
                </label>
            `;
        }).join('');

        container.innerHTML = html;

        const unassignedCheck = document.getElementById("assignee-unassigned");
        if (unassignedCheck) {
            unassignedCheck.addEventListener("change", () => {
                if (unassignedCheck.checked) {
                    document.querySelectorAll(".assignee-check").forEach(cb => cb.checked = false);
                }
            });
        }

        document.querySelectorAll(".assignee-check").forEach(cb => {
            cb.addEventListener("change", () => {
                if (cb.checked && unassignedCheck) {
                    unassignedCheck.checked = false;
                }
                const checkedCount = document.querySelectorAll(".assignee-check:checked").length;
                if (checkedCount === 0 && unassignedCheck) {
                    unassignedCheck.checked = true;
                }
            });
        });
    }
}

function saveToLocalStorage() {
    // Deprecated: State synced directly to SQLite backend
}

function renderCreateFormAttachments() {
    const container = document.getElementById("create-attachment-previews");
    if (!container) return;
    container.innerHTML = "";
    if (!state.createFormAttachments) state.createFormAttachments = [];

    state.createFormAttachments.forEach((src, idx) => {
        const div = document.createElement("div");
        div.style.position = "relative";
        div.style.width = "60px";
        div.style.height = "60px";
        div.style.borderRadius = "var(--border-radius-sm)";
        div.style.border = "1px solid var(--card-border)";
        div.style.overflow = "hidden";

        const img = document.createElement("img");
        img.src = src;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        div.appendChild(img);

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.innerHTML = "&times;";
        removeBtn.style.position = "absolute";
        removeBtn.style.top = "2px";
        removeBtn.style.right = "2px";
        removeBtn.style.background = "rgba(0,0,0,0.6)";
        removeBtn.style.color = "#fff";
        removeBtn.style.border = "none";
        removeBtn.style.borderRadius = "50%";
        removeBtn.style.width = "16px";
        removeBtn.style.height = "16px";
        removeBtn.style.fontSize = "10px";
        removeBtn.style.display = "flex";
        removeBtn.style.alignItems = "center";
        removeBtn.style.justifyContent = "center";
        removeBtn.style.cursor = "pointer";
        removeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            state.createFormAttachments.splice(idx, 1);
            renderCreateFormAttachments();

            const span = document.querySelector(".file-upload-mock span");
            if (span) {
                if (state.createFormAttachments.length > 0) {
                    span.textContent = `${state.createFormAttachments.length} Gambar Terpilih`;
                } else {
                    span.textContent = "Klik atau seret gambar ke sini";
                }
            }
        });
        div.appendChild(removeBtn);
        container.appendChild(div);
    });
}

// Clock updates
function initClock() {
    const clockEl = document.getElementById("live-clock");
    const updateTime = () => {
        const now = new Date();
        const options = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        clockEl.textContent = now.toLocaleDateString('id-ID', options) + " WIB";
    };
    updateTime();
    setInterval(updateTime, 1000);
}

// ==========================================
// Event Handlers
// ==========================================
function initEventListeners() {
    // ponytail: EJO dropdown chevron toggle click listener
    const chevronToggle = document.querySelector("#btn-nav-job-orders .dropdown-chevron-btn");
    if (chevronToggle) {
        chevronToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            const submenu = document.getElementById("job-orders-submenu");
            const chevron = chevronToggle.querySelector(".dropdown-chevron");
            if (submenu) {
                const isVisible = submenu.style.display === "flex";
                submenu.style.display = isVisible ? "none" : "flex";
                if (chevron) {
                    chevron.classList.toggle("rotated", !isVisible);
                }
            }
        });
    }

    // ponytail: General EJO nested dropdown chevron toggle click listener
    const gejoChevronToggle = document.querySelector("#btn-nav-general-ejo .gejo-chevron-toggle");
    if (gejoChevronToggle) {
        gejoChevronToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            const submenu = document.getElementById("general-ejo-submenu");
            const chevron = gejoChevronToggle.querySelector(".gejo-chevron");
            if (submenu) {
                const isVisible = submenu.style.display === "flex";
                submenu.style.display = isVisible ? "none" : "flex";
                if (chevron) {
                    chevron.classList.toggle("rotated", !isVisible);
                }
            }
        });
    }

    // ponytail: Drawing nested dropdown chevron toggle click listener
    const drawingChevronToggle = document.querySelector("#btn-nav-drawing .drawing-chevron-toggle");
    if (drawingChevronToggle) {
        drawingChevronToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            const submenu = document.getElementById("drawing-submenu");
            const chevron = drawingChevronToggle.querySelector(".drawing-chevron");
            if (submenu) {
                const isVisible = submenu.style.display === "flex";
                submenu.style.display = isVisible ? "none" : "flex";
                if (chevron) {
                    chevron.classList.toggle("rotated", !isVisible);
                }
            }
        });
    }

    // ponytail: Projects nested dropdown chevron toggle click listener
    const projectsChevronToggle = document.querySelector("#btn-nav-projects .projects-chevron-toggle");
    if (projectsChevronToggle) {
        projectsChevronToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            const submenu = document.getElementById("projects-submenu");
            const chevron = projectsChevronToggle.querySelector(".nested-chevron");
            if (submenu) {
                const isVisible = submenu.style.display === "flex";
                submenu.style.display = isVisible ? "none" : "flex";
                if (chevron) {
                    chevron.classList.toggle("rotated", !isVisible);
                }
            }
        });
    }

    // Sidebar Tabs Navigation
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {

            // ponytail: handle toggle for nested general-ejo button click
            if (btn.id === "btn-nav-general-ejo") {
                const submenu = document.getElementById("general-ejo-submenu");
                const chevron = btn.querySelector(".gejo-chevron");
                if (submenu) {
                    const isVisible = submenu.style.display === "flex";
                    submenu.style.display = isVisible ? "none" : "flex";
                    if (chevron) {
                        chevron.classList.toggle("rotated", !isVisible);
                    }
                    state.activeGeneralEjoPhase = null;
                    switchTab("general-ejo");
                    e.preventDefault();
                    return;
                }
            }

            // ponytail: handle toggle for nested projects button click
            if (btn.id === "btn-nav-projects") {
                const submenu = document.getElementById("projects-submenu");
                const chevron = btn.querySelector(".nested-chevron");
                if (submenu) {
                    const isVisible = submenu.style.display === "flex";
                    submenu.style.display = isVisible ? "none" : "flex";
                    if (chevron) {
                        chevron.classList.toggle("rotated", !isVisible);
                    }
                    state.activeProjectPhase = null;
                    switchTab("projects");
                    e.preventDefault();
                    return;
                }
            }

            // ponytail: handle toggle for nested drawing button click
            if (btn.id === "btn-nav-drawing") {
                const submenu = document.getElementById("drawing-submenu");
                const chevron = btn.querySelector(".drawing-chevron");
                if (submenu) {
                    const isVisible = submenu.style.display === "flex";
                    submenu.style.display = isVisible ? "none" : "flex";
                    if (chevron) {
                        chevron.classList.toggle("rotated", !isVisible);
                    }
                    state.activeDrawingPhase = null;
                    switchTab("drawing");
                    e.preventDefault();
                    return;
                }
            }

            // ponytail: capture phase attribute for projects submenus including archive
            const phaseAttr = btn.getAttribute("data-phase");
            if (phaseAttr) {
                state.activeProjectPhase = (phaseAttr === 'archive') ? phaseAttr : parseInt(phaseAttr);
            } else if (btn.getAttribute("data-tab") === 'projects' || btn.id === "btn-nav-projects") {
                state.activeProjectPhase = null;
            }

            // ponytail: capture phase attribute for general-ejo submenus
            const gejoPhaseAttr = btn.getAttribute("data-gejo-phase");
            if (gejoPhaseAttr) {
                state.activeGeneralEjoPhase = parseInt(gejoPhaseAttr);
            } else if (btn.getAttribute("data-tab") === 'general-ejo' || btn.id === "btn-nav-general-ejo") {
                state.activeGeneralEjoPhase = null;
            }

            // ponytail: capture phase attribute for drawing submenus
            const drawingPhaseAttr = btn.getAttribute("data-drawing-phase");
            if (drawingPhaseAttr) {
                state.activeDrawingPhase = parseInt(drawingPhaseAttr);
            } else if (btn.id === "btn-nav-drawing-all") {
                state.activeDrawingPhase = 'history';
            } else if (btn.getAttribute("data-tab") === 'drawing' || btn.id === "btn-nav-drawing") {
                state.activeDrawingPhase = null;
            }

            document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const targetTab = btn.getAttribute("data-tab");
            switchTab(targetTab);
        });
    });

    // ponytail: KPI scorecards click redirecting to general-ejo tab with relevant filters
    document.getElementById("kpi-card-total")?.addEventListener("click", () => {
        state.activeGeneralEjoPhase = null;
        switchTab("general-ejo");
        resetGeneralEJOFilters();
    });

    document.getElementById("kpi-card-pending")?.addEventListener("click", () => {
        state.activeGeneralEjoPhase = null;
        switchTab("general-ejo");
        resetGeneralEJOFilters();
        const statusFilter = document.getElementById("gejo-filter-status");
        if (statusFilter) {
            statusFilter.value = "Pending My Approval";
            renderGeneralEJO();
        }
    });

    document.getElementById("kpi-card-progress")?.addEventListener("click", () => {
        state.activeGeneralEjoPhase = null;
        switchTab("general-ejo");
        resetGeneralEJOFilters();
        const statusFilter = document.getElementById("gejo-filter-status");
        if (statusFilter) {
            statusFilter.value = "In Progress";
            renderGeneralEJO();
        }
    });

    document.getElementById("kpi-card-completed")?.addEventListener("click", () => {
        state.activeGeneralEjoPhase = null;
        switchTab("general-ejo");
        resetGeneralEJOFilters();
        const statusFilter = document.getElementById("gejo-filter-status");
        if (statusFilter) {
            statusFilter.value = "Completed";
            renderGeneralEJO();
        }
    });

    // ponytail: trend chart time range filter change listener
    document.getElementById("trend-time-filter")?.addEventListener("change", (e) => {
        state.trendPeriod = e.target.value;
        renderOverviewCharts();
    });

    // ponytail: dashboard visual settings toggle change listener
    document.getElementById("toggle-status-prop")?.addEventListener("change", async (e) => {
        const isChecked = e.target.checked;
        if (!state.currentUser) return;

        // ponytail: update visual setting locally in memory
        if (!state.settings) state.settings = {};
        state.settings.show_status_prop = isChecked ? "1" : "0";

        // Update layout immediately for snappy UX
        applyDashboardSettings();

        // Send global setting update to SQLite server
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ show_status_prop: isChecked ? 1 : 0 })
            });
            if (!res.ok) {
                console.error("Gagal menyimpan visual setting ke database.");
            }
        } catch (err) {
            console.error("Koneksi gagal saat menyimpan visual setting:", err);
        }
    });

    // ponytail: server maintenance mode toggle change listener
    document.getElementById("toggle-maintenance-mode")?.addEventListener("change", async (e) => {
        const isChecked = e.target.checked;
        const isServer = state.currentUser && (
            state.currentUser.role === 'Server' ||
            state.currentUser.username === 'server' ||
            (state.currentUser.role && state.currentUser.role.toLowerCase() === 'server')
        );
        if (!state.currentUser || !isServer) return;

        // update setting locally
        if (!state.settings) state.settings = {};
        state.settings.maintenance_mode = isChecked ? "1" : "0";

        // update status text
        const statusText = document.getElementById("maintenance-mode-status-text");
        if (statusText) {
            statusText.textContent = isChecked ? "Aktif" : "Nonaktif";
            statusText.style.color = isChecked ? "#f59e0b" : "var(--text-primary)";
        }

        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ maintenance_mode: isChecked ? 1 : 0 })
            });
            if (res.ok) {
                showToast(`Mode Pemeliharaan (Maintenance Mode) berhasil ${isChecked ? 'diaktifkan' : 'dinonaktifkan'}.`, "success");
            } else {
                console.error("Gagal menyimpan maintenance mode ke database.");
                showToast("Gagal mengubah mode pemeliharaan.", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Gagal menghubungi server untuk mengubah mode pemeliharaan.", "error");
        }
    });

    // Notify popover trigger
    const notifyTrigger = document.getElementById("notify-trigger");
    const notifyPanel = document.getElementById("notify-panel");
    notifyTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        notifyPanel.style.display = notifyPanel.style.display === 'none' ? 'flex' : 'none';
        // ponytail: tandai dibaca di server saat user buka panel notif
        if (notifyPanel.style.display === 'flex') {
            markNotificationsRead();
        }
    });

    document.addEventListener("click", () => {
        notifyPanel.style.display = 'none';
    });

    notifyPanel.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    document.getElementById("clear-notifications").addEventListener("click", async () => {
        if (!state.currentUser) return;
        try {
            const res = await fetch(`/api/notifications?username=${encodeURIComponent(state.currentUser.username)}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Gagal menghapus notifikasi");
            state.notifications = [];
            renderNotifications();
            showToast("Semua notifikasi berhasil dihapus", "success");
        } catch (err) {
            console.error("Gagal menghapus notifikasi:", err);
            showToast("Gagal menghapus notifikasi di server", "error");
        }
    });



    // ponytail: General EJO — filter/search & view toggle controls
    document.getElementById("gejo-search-input").addEventListener("input", renderGeneralEJO);
    document.getElementById("gejo-filter-status").addEventListener("change", renderGeneralEJO);
    document.getElementById("gejo-filter-priority").addEventListener("change", renderGeneralEJO);
    document.getElementById("gejo-filter-dept").addEventListener("change", renderGeneralEJO);
    document.getElementById("gejo-filter-category").addEventListener("change", renderGeneralEJO); // ponytail: listener kategori
    document.getElementById("gejo-view-grid-btn").addEventListener("click", () => {
        state.viewMode = 'grid';
        document.getElementById("gejo-view-grid-btn").classList.add("active");
        document.getElementById("gejo-view-table-btn").classList.remove("active");
        renderGeneralEJO();
    });
    document.getElementById("gejo-view-table-btn").addEventListener("click", () => {
        state.viewMode = 'table';
        document.getElementById("gejo-view-table-btn").classList.add("active");
        document.getElementById("gejo-view-grid-btn").classList.remove("active");
        renderGeneralEJO();
    });
    document.getElementById("gejo-btn-quick-new").addEventListener("click", () => {
        // ponytail: check General EJO limit
        if (checkGeneralEjoLimit()) {
            showToast("Batas pembuatan General EJO tercapai! Anda hanya dapat membuat maksimal 2 General EJO aktif.", "warning");
            return;
        }
        // ponytail: toggle form General EJO (DB terpisah), bukan switchTab
        const form = document.getElementById("gejo-form-container");
        if (form) {
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        }
    });

    // ponytail: cancel button General EJO form
    document.getElementById("gejo-btn-cancel-form").addEventListener("click", () => {
        const formEl = document.getElementById("gejo-form");
        if (formEl) formEl.reset();
        document.getElementById("gejo-form-container").style.display = 'none';
    });

    // ponytail: submit form General EJO
    document.getElementById("gejo-form").addEventListener("submit", (e) => {
        e.preventDefault();
        createNewGeneralEJO();
    });

    // ponytail: galeri drawing cukup toggle form + submit multipart + delete
    // ponytail: populate EJO options dynamically for drawing form select
    function populateDrawingEjoSelect() {
        const select = document.getElementById("drawing-form-ejo-id");
        if (!select) return;
        select.innerHTML = '<option value="">-- Pilih EJO (Opsional) --</option>';
        const activeEjos = (state.ejos || []).concat(state.generalEjos || [])
            .filter(e => e.status !== 'Completed' && e.status !== 'Cancelled');
        activeEjos.forEach(e => {
            const option = document.createElement("option");
            option.value = e.id;
            option.textContent = `${e.id} - ${e.title}`;
            select.appendChild(option);
        });
    }

    // ponytail: open drawing form with mode ('request' or 'import')
    window.openDrawingForm = function (mode) {
        if (checkDrawingLimit()) {
            showToast("Batas pembuatan Drawing tercapai! Anda hanya dapat membuat maksimal 2 Drawing aktif.", "warning");
            return;
        }
        const formContainer = document.getElementById("drawing-form-container");
        const titleText = document.getElementById("drawing-form-title-text");
        const fileContainer = document.getElementById("drawing-file-container");
        const requiredStar = document.getElementById("drawing-file-required-star");
        const submitBtn = document.querySelector('#drawing-form button[type="submit"]');

        if (!formContainer) return;

        const isCurrentMode = state.drawingFormMode === mode;
        const isOpen = formContainer.style.display === 'block';

        if (isOpen && isCurrentMode && !state.editingDrawingId) {
            formContainer.style.display = 'none';
        } else {
            state.drawingFormMode = mode;
            state.editingDrawingId = null;
            formContainer.style.display = 'block';

            if (titleText) {
                titleText.textContent = mode === 'import' ? 'Import Drawing Baru' : 'Request Drawing Baru';
            }
            if (fileContainer) {
                fileContainer.style.display = mode === 'import' ? 'block' : 'none';
            }
            if (requiredStar) {
                requiredStar.style.display = 'inline';
            }
            if (submitBtn) {
                submitBtn.innerHTML = mode === 'import'
                    ? `<i data-lucide="upload" style="width: 16px; height: 16px;"></i><span>Import Drawing</span>`
                    : `<i data-lucide="send" style="width: 16px; height: 16px;"></i><span>Kirim Request Drawing</span>`;
            }

            // reset form fields
            const formEl = document.getElementById("drawing-form");
            if (formEl) formEl.reset();

            // ponytail: reset filename and preview
            const drawingFilename = document.getElementById("drawing-file-filename");
            const drawingPreview = document.getElementById("drawing-file-preview");
            const drawingPreviewImg = document.getElementById("drawing-file-preview-img");
            if (drawingFilename) drawingFilename.textContent = "Pilih file Lampiran (PDF/Gambar)";
            if (drawingPreview) drawingPreview.style.display = "none";
            if (drawingPreviewImg) drawingPreviewImg.src = "";

            generateDrawingId();
            populateDrawingEjoSelect();
            lucide.createIcons();
        }
    };

    document.getElementById("btn-toggle-drawing-form").addEventListener("click", () => {
        openDrawingForm('request');
    });

    document.getElementById("btn-toggle-import-drawing").addEventListener("click", () => {
        openDrawingForm('import');
    });
    const btnGenDrawingId = document.getElementById("btn-generate-drawing-id");
    if (btnGenDrawingId) {
        btnGenDrawingId.addEventListener("click", generateDrawingId);
    }
    const btnNavDrawingAll = document.getElementById("btn-nav-drawing-all");
    if (btnNavDrawingAll) {
        btnNavDrawingAll.addEventListener("click", () => {
            state.activeDrawingPhase = 'history';
            switchTab("drawing");
        });
    }
    const drawingSearch = document.getElementById("drawing-history-search");
    if (drawingSearch) {
        drawingSearch.addEventListener("input", renderDrawings);
    }
    const drawingFilterUploader = document.getElementById("drawing-history-filter-uploader");
    if (drawingFilterUploader) {
        drawingFilterUploader.addEventListener("change", renderDrawings);
    }
    const btnDrawingHistoryReset = document.getElementById("btn-drawing-history-reset");
    if (btnDrawingHistoryReset) {
        btnDrawingHistoryReset.addEventListener("click", () => {
            if (drawingSearch) drawingSearch.value = "";
            if (drawingFilterUploader) drawingFilterUploader.value = "all";
            renderDrawings();
        });
    }
    // ponytail: additional drawing filter listeners
    document.getElementById("drawing-filter-category")?.addEventListener("change", renderDrawings);
    document.getElementById("drawing-filter-priority")?.addEventListener("change", renderDrawings);
    document.getElementById("drawing-filter-dept")?.addEventListener("change", renderDrawings);
    document.getElementById("drawing-filter-status")?.addEventListener("change", renderDrawings);
    const modalDrawingCloseBtn = document.getElementById("modal-drawing-close-btn");
    if (modalDrawingCloseBtn) {
        modalDrawingCloseBtn.addEventListener("click", closeDrawingModal);
    }
    const drawingDetailModal = document.getElementById("drawing-detail-modal");
    if (drawingDetailModal) {
        drawingDetailModal.addEventListener("click", (e) => {
            if (e.target === drawingDetailModal) closeDrawingModal();
        });
    }
    document.getElementById("btn-cancel-drawing-form").addEventListener("click", () => {
        const formEl = document.getElementById("drawing-form");
        if (formEl) formEl.reset();
        document.getElementById("drawing-form-container").style.display = 'none';

        // ponytail: reset filename and preview
        const drawingFilename = document.getElementById("drawing-file-filename");
        const drawingPreview = document.getElementById("drawing-file-preview");
        const drawingPreviewImg = document.getElementById("drawing-file-preview-img");
        if (drawingFilename) drawingFilename.textContent = "Pilih file Lampiran (PDF/Gambar)";
        if (drawingPreview) drawingPreview.style.display = "none";
        if (drawingPreviewImg) drawingPreviewImg.src = "";
    });

    // ponytail: premium upload trigger listener for request/import drawing form
    const drawingFileTrigger = document.getElementById("drawing-file-trigger");
    const drawingFileInput = document.getElementById("drawing-file");
    const drawingFilename = document.getElementById("drawing-file-filename");
    const drawingPreview = document.getElementById("drawing-file-preview");
    const drawingPreviewImg = document.getElementById("drawing-file-preview-img");

    if (drawingFileTrigger && drawingFileInput) {
        drawingFileTrigger.onclick = () => {
            drawingFileInput.click();
        };

        drawingFileInput.onchange = () => {
            const file = drawingFileInput.files[0];
            if (file) {
                if (drawingFilename) drawingFilename.textContent = file.name;
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (drawingPreviewImg) {
                            drawingPreviewImg.src = e.target.result;
                            if (drawingPreview) drawingPreview.style.display = "flex";
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    if (drawingPreview) drawingPreview.style.display = "none";
                }
            } else {
                if (drawingFilename) drawingFilename.textContent = "Pilih file Lampiran (PDF/Gambar)";
                if (drawingPreview) drawingPreview.style.display = "none";
            }
        };
    }

    document.getElementById("drawing-form").addEventListener("submit", (e) => {
        e.preventDefault();
        uploadDrawing();
    });

    // Modal close
    document.getElementById("modal-close-btn").addEventListener("click", closeModal);
    document.getElementById("ejo-modal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("ejo-modal")) closeModal();
    });

    // ponytail: Repair Part Detail Modal Close listeners
    document.getElementById("modal-part-close-btn").addEventListener("click", closePartModal);
    document.getElementById("part-detail-modal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("part-detail-modal")) closePartModal();
    });

    // ponytail: Project Detail Modal Close listeners
    const modalProjectCloseBtn = document.getElementById("modal-project-close-btn");
    const projectDetailModal = document.getElementById("project-detail-modal");
    if (modalProjectCloseBtn && projectDetailModal) {
        modalProjectCloseBtn.addEventListener("click", () => {
            projectDetailModal.style.display = "none";
        });
        projectDetailModal.addEventListener("click", (e) => {
            if (e.target === projectDetailModal) {
                projectDetailModal.style.display = "none";
            }
        });
    }

    // ponytail: Project Documentation Upload listeners
    const projDocUploadMock = document.getElementById("proj-doc-upload-mock");
    const projDocFileInput = document.getElementById("proj-doc-file-input");
    if (projDocUploadMock && projDocFileInput) {
        projDocUploadMock.addEventListener("click", () => {
            projDocFileInput.click();
        });
        projDocFileInput.addEventListener("change", async () => {
            const files = projDocFileInput.files;
            if (!files || files.length === 0) return;
            if (!state.currentDetailProjectId) return;

            const userRole = state.currentUser ? state.currentUser.role : "";
            const isAuthorized = userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server';
            if (!isAuthorized) {
                showToast("Hanya Foreman atau Admin yang diperbolehkan mengunggah foto dokumentasi!", "error");
                projDocFileInput.value = "";
                return;
            }

            const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
            let uploadedCount = 0;

            projDocUploadMock.style.pointerEvents = "none";
            projDocUploadMock.querySelector("span").textContent = "Mengunggah...";

            try {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const ext = '.' + file.name.split('.').pop().toLowerCase();
                    if (!allowed.includes(ext)) {
                        showToast(`Format file "${file.name}" tidak didukung! Hanya gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan.`, "error");
                        continue;
                    }

                    const fd = new FormData();
                    fd.append("file", file);
                    fd.append("project_id", state.currentDetailProjectId);
                    fd.append("doc_type", "execution");

                    const res = await fetch("/api/projects/upload-doc", {
                        method: "POST",
                        body: fd
                    });
                    const data = await res.json();
                    if (!res.ok || data.status === "error") {
                        throw new Error(data.message || "Gagal mengunggah foto");
                    }

                    const proj = state.projects.find(p => p.id === state.currentDetailProjectId);
                    if (proj) {
                        proj.execution_docs = data.execution_docs;
                    }
                    uploadedCount++;
                }

                if (uploadedCount > 0) {
                    showToast(`${uploadedCount} Foto dokumentasi berhasil ditambahkan!`, "success");
                }

                const proj = state.projects.find(p => p.id === state.currentDetailProjectId);
                if (proj) {
                    const gallery = document.getElementById("project-docs-gallery");
                    if (gallery) {
                        gallery.innerHTML = "";
                        (proj.execution_docs || []).forEach(docUrl => {
                            gallery.insertAdjacentHTML('beforeend', `
                                <div style="position: relative; width: 110px; height: 80px; background: rgba(0,0,0,0.2); border-radius: var(--border-radius-sm); overflow: hidden; border: 1px solid var(--card-border);">
                                    <img src="${docUrl}" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" onclick="window.open('${docUrl}', '_blank')" />
                                </div>
                            `);
                        });
                    }
                }
            } catch (err) {
                console.error(err);
                showToast(err.message || "Gagal mengunggah foto dokumentasi", "error");
            } finally {
                projDocUploadMock.style.pointerEvents = "auto";
                projDocUploadMock.querySelector("span").textContent = "Unggah Foto Dokumentasi";
                projDocFileInput.value = "";
                renderProjects();
            }
        });
    }

    // ponytail: Project Supporting Document/BOQ Upload listeners
    const projAttachUploadMock = document.getElementById("proj-attachment-upload-mock");
    const projAttachFileInput = document.getElementById("proj-attachment-file-input");
    if (projAttachUploadMock && projAttachFileInput) {
        projAttachUploadMock.addEventListener("click", () => {
            projAttachFileInput.click();
        });
        projAttachFileInput.addEventListener("change", async () => {
            const file = projAttachFileInput.files[0];
            if (!file) return;
            if (!state.currentDetailProjectId) return;

            // ponytail: only Foreman, Admin, and Server can upload BOQ files
            const userRole = state.currentUser ? state.currentUser.role : "";
            const isAuthorized = userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server';
            if (!isAuthorized) {
                showToast("Hanya Foreman atau Admin yang diperbolehkan mengunggah file BOQ!", "error");
                projAttachFileInput.value = "";
                return;
            }

            const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.xlsx', '.xls', '.csv'];
            const ext = '.' + file.name.split('.').pop().toLowerCase();
            if (!allowed.includes(ext)) {
                showToast("Format file tidak didukung! Hanya diperbolehkan foto, PDF, Excel, atau CSV.", "error");
                projAttachFileInput.value = "";
                return;
            }

            const fd = new FormData();
            fd.append("file", file);
            fd.append("project_id", state.currentDetailProjectId);
            fd.append("doc_type", "boq");

            projAttachUploadMock.style.pointerEvents = "none";
            projAttachUploadMock.querySelector("span").textContent = "Mengunggah...";

            try {
                const res = await fetch("/api/projects/upload-doc", {
                    method: "POST",
                    body: fd
                });
                const data = await res.json();
                if (!res.ok || data.status === "error") {
                    throw new Error(data.message || "Gagal mengunggah file");
                }

                showToast("File BOQ/Pendukung berhasil diunggah!", "success");

                const proj = state.projects.find(p => p.id === state.currentDetailProjectId);
                if (proj) {
                    proj.docs = data.docs;
                }

                // Re-render project details modal to refresh files list
                openProjectDetails(null, state.currentDetailProjectId);
            } catch (err) {
                console.error(err);
                showToast(err.message || "Gagal mengunggah file", "error");
            } finally {
                projAttachUploadMock.style.pointerEvents = "auto";
                projAttachUploadMock.querySelector("span").textContent = "Unggah File BOQ / Pendukung (Excel / PDF / Gambar)";
                projAttachFileInput.value = "";
            }
        });
    }

    // Modal change assignee and status
    document.querySelectorAll(".btn-status-change").forEach(btn => {
        btn.addEventListener("click", () => {
            const nextStatus = btn.getAttribute("data-status");
            updateModalStatusHighlight(nextStatus);
        });
    });

    // ponytail: listener for checking sub-status checkboxes
    document.querySelectorAll('input[name="checking-sub-type"]').forEach(cb => {
        cb.addEventListener('change', () => {
            if (state.selectedEJO && (state.selectedEJO._tempStatus === 'Approved' || state.selectedEJO._tempStatus.startsWith('Checking'))) {
                const checkedCbs = document.querySelectorAll('input[name="checking-sub-type"]:checked');
                const vals = Array.from(checkedCbs).map(c => c.value);
                if (vals.length === 0) {
                    cb.checked = true; // prevent unchecking all
                    showToast("Silakan pilih minimal satu sub-status Checking!", "warning");
                    return;
                }
                state.selectedEJO._tempStatus = `Checking (${vals.join(' & ')})`;
            }
        });
    });

    // Save modal action
    document.getElementById("btn-save-modal").addEventListener("click", saveModalChanges);

    // Complete EJO action in modal
    document.getElementById("btn-complete-ejo")?.addEventListener("click", completeEJODetails);

    // Delete modal action
    document.getElementById("btn-delete-ejo").addEventListener("click", deleteSelectedEJO);

    // File input mock handler
    const fileInput = document.getElementById("form-attachment");
    const fileUploadMock = document.querySelector(".file-upload-mock");
    if (fileUploadMock && fileInput) {
        fileUploadMock.addEventListener("click", (e) => {
            if (e.target !== fileInput) {
                fileInput.click();
            }
        });

        fileInput.addEventListener("change", async () => {
            if (!state.createFormAttachments) state.createFormAttachments = [];
            if (fileInput.files && fileInput.files.length > 0) {
                showToast("Memproses gambar...", "info");
                for (let i = 0; i < fileInput.files.length; i++) {
                    const base64 = await resizeImageBase64(fileInput.files[i]);
                    if (base64) {
                        state.createFormAttachments.push(base64);
                    }
                }
                renderCreateFormAttachments();

                const count = state.createFormAttachments.length;
                const span = fileUploadMock.querySelector("span");
                if (span) span.textContent = `${count} Gambar Terpilih`;
                showToast(`${fileInput.files.length} Gambar berhasil ditambahkan`, "success");
            }
            fileInput.value = ""; // ponytail: clear input to allow same file re-selection
        });
    }

    // Project Form Toggles
    const btnToggleProj = document.getElementById("btn-toggle-new-project");
    const projFormContainer = document.getElementById("project-form-container");
    if (btnToggleProj) {
        btnToggleProj.addEventListener("click", () => {
            const isHidden = projFormContainer.style.display === 'none';
            projFormContainer.style.display = isHidden ? 'block' : 'none';
            btnToggleProj.innerHTML = isHidden ? '<i data-lucide="minus-circle"></i> Sembunyikan Form' : '<i data-lucide="plus-circle"></i> Project Baru';
            lucide.createIcons();
        });
    }

    const btnCancelProj = document.getElementById("btn-cancel-project");
    if (btnCancelProj) {
        btnCancelProj.addEventListener("click", () => {
            document.getElementById("project-form").reset();
            projFormContainer.style.display = 'none';
            btnToggleProj.innerHTML = '<i data-lucide="plus-circle"></i> Project Baru';
            lucide.createIcons();
        });
    }

    const projForm = document.getElementById("project-form");
    if (projForm) {
        projForm.addEventListener("submit", (e) => {
            e.preventDefault();
            createNewProject();
        });
    }

    // ponytail: register input/change listeners for projects search and filters to refresh matching data instantly
    const projSearchInput = document.getElementById("proj-search-input");
    if (projSearchInput) {
        projSearchInput.addEventListener("input", renderProjects);
    }
    const projFilterDept = document.getElementById("proj-filter-dept");
    if (projFilterDept) {
        projFilterDept.addEventListener("change", renderProjects);
    }
    const projFilterPic = document.getElementById("proj-filter-pic");
    if (projFilterPic) {
        projFilterPic.addEventListener("change", renderProjects);
    }

    // ponytail: Repair Parts Form Toggles
    const btnTogglePart = document.getElementById("btn-toggle-new-part");
    const partFormContainer = document.getElementById("part-form-container");
    if (btnTogglePart) {
        btnTogglePart.addEventListener("click", () => {
            const isHidden = partFormContainer.style.display === 'none';
            partFormContainer.style.display = isHidden ? 'block' : 'none';
            btnTogglePart.innerHTML = isHidden ? '<i data-lucide="minus-circle"></i> Sembunyikan Form' : '<i data-lucide="plus-circle"></i> Tambah Part';
            lucide.createIcons();
        });
    }

    const btnCancelPart = document.getElementById("btn-cancel-part");
    if (btnCancelPart) {
        btnCancelPart.addEventListener("click", () => {
            document.getElementById("part-form").reset();
            partFormContainer.style.display = 'none';
            btnTogglePart.innerHTML = '<i data-lucide="plus-circle"></i> Tambah Part';
            lucide.createIcons();
        });
    }

    const partForm = document.getElementById("part-form");
    if (partForm) {
        partForm.addEventListener("submit", (e) => {
            e.preventDefault();
            createNewRepairPart();
        });
    }

    // ponytail: Repair Parts Search Input Handler
    const searchPartInput = document.getElementById("search-repair-parts");
    if (searchPartInput) {
        searchPartInput.addEventListener("input", () => {
            renderRepairParts();
        });
    }

    // Login Form Submit Handler
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById("login-username").value.trim().toLowerCase();
            const passwordInput = document.getElementById("login-password").value;
            const errorMsg = document.getElementById("login-error-msg");

            if (errorMsg) errorMsg.style.display = 'none';

            try {
                const res = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: usernameInput, password: passwordInput, device_id: deviceId })
                });

                if (res.status === 200) {
                    const userData = await res.json();
                    safeSessionStorage.setItem("PTBAS_USER", JSON.stringify(userData));

                    // Reset login form inputs
                    loginForm.reset();

                    // Authenticate and load app
                    checkAuth();
                    showToast(`Selamat datang kembali, ${userData.fullname}!`, "success");
                } else if (res.status === 403) {
                    const errData = await res.json();
                    if (errorMsg) {
                        const span = errorMsg.querySelector("span");
                        if (span) span.textContent = errData.message || "Akun ini sedang aktif di perangkat lain.";
                        errorMsg.style.color = "var(--color-rose)";
                        errorMsg.style.display = 'flex';
                    }
                    showToast(errData.message || "Akun ini sedang aktif di perangkat lain.", "error");
                } else if (res.status === 503) {
                    const errData = await res.json();
                    if (errorMsg) {
                        const span = errorMsg.querySelector("span");
                        if (span) span.textContent = errData.message || "Server sedang dalam pemeliharaan (maintenance).";
                        errorMsg.style.color = "#f59e0b"; // amber for maintenance
                        errorMsg.style.display = 'flex';
                    }
                    showToast(errData.message || "Server sedang dalam pemeliharaan (maintenance).", "warning");
                } else {
                    if (errorMsg) {
                        const span = errorMsg.querySelector("span");
                        if (span) span.textContent = "Username atau password salah!";
                        errorMsg.style.color = "var(--color-rose)"; // reset to standard rose color
                        errorMsg.style.display = 'flex';
                    }
                }
            } catch (err) {
                console.error(err);
                showToast("Gagal terhubung ke server login", "error");
            }
        });
    }

    // Toggle Password Visibility Eye Handler
    const btnTogglePass = document.getElementById("btn-toggle-pass");
    if (btnTogglePass) {
        btnTogglePass.addEventListener("click", () => {
            const passwordInput = document.getElementById("login-password");
            const eyeIcon = document.getElementById("pass-eye-icon");
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                eyeIcon.setAttribute("data-lucide", "eye-off");
                btnTogglePass.setAttribute("title", "Sembunyikan Password");
            } else {
                passwordInput.type = "password";
                eyeIcon.setAttribute("data-lucide", "eye");
                btnTogglePass.setAttribute("title", "Tampilkan Password");
            }
            lucide.createIcons();
        });
    }

    // Toggle User Form Password Visibility
    const btnToggleUsrPass = document.getElementById("btn-toggle-usr-pass");
    if (btnToggleUsrPass) {
        btnToggleUsrPass.addEventListener("click", () => {
            const passwordInput = document.getElementById("usr-password");
            const eyeIcon = document.getElementById("usr-pass-eye-icon");
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                eyeIcon.setAttribute("data-lucide", "eye-off");
                btnToggleUsrPass.setAttribute("title", "Sembunyikan Password");
            } else {
                passwordInput.type = "password";
                eyeIcon.setAttribute("data-lucide", "eye");
                btnToggleUsrPass.setAttribute("title", "Tampilkan Password");
            }
            lucide.createIcons();
        });
    }

    // Logout Button Handler
    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", async () => {
            const confirmLogout = await showCustomConfirm("Apakah Anda yakin ingin keluar dari sistem EJO?");
            if (!confirmLogout) return;
            logoutUser();
        });
    }

    // ponytail: User Profile settings modal toggle and event listeners
    const profileTrigger = document.getElementById("sidebar-user-profile-trigger");
    if (profileTrigger) {
        profileTrigger.addEventListener("click", () => {
            if (!state.currentUser) return;

            document.getElementById("profile-modal-username").value = state.currentUser.username || "";
            document.getElementById("profile-modal-role").value = state.currentUser.role || "";
            document.getElementById("profile-modal-fullname").value = state.currentUser.fullname || "";
            document.getElementById("profile-modal-password").value = "";

            const modalAvatar = document.getElementById("profile-modal-avatar");
            if (modalAvatar) {
                modalAvatar.src = state.currentUser.avatar || "avatar-default.png";
            }

            const modalAvatarInput = document.getElementById("profile-modal-avatar-input");
            if (modalAvatarInput) modalAvatarInput.value = "";

            const modalSignature = document.getElementById("profile-modal-signature");
            const signaturePlaceholder = document.getElementById("profile-modal-signature-placeholder");
            if (modalSignature && signaturePlaceholder) {
                if (state.currentUser.signature) {
                    modalSignature.src = state.currentUser.signature;
                    modalSignature.style.display = "block";
                    signaturePlaceholder.style.display = "none";
                } else {
                    modalSignature.src = "";
                    modalSignature.style.display = "none";
                    signaturePlaceholder.style.display = "block";
                }
            }

            document.getElementById("user-profile-modal").style.display = "flex";
        });
    }

    const btnProfileChangeAvatar = document.getElementById("btn-profile-change-avatar");
    const profileModalAvatarInput = document.getElementById("profile-modal-avatar-input");
    if (btnProfileChangeAvatar && profileModalAvatarInput) {
        btnProfileChangeAvatar.addEventListener("click", () => {
            profileModalAvatarInput.click();
        });

        profileModalAvatarInput.addEventListener("change", async (e) => {
            const file = e.target.files[0];
            if (!file || !state.currentUser) return;

            const fd = new FormData();
            fd.append('avatar', file);
            fd.append('username', state.currentUser.username);

            try {
                const res = await fetch('/api/upload-avatar', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.status === 'success') {
                    const modalAvatar = document.getElementById("profile-modal-avatar");
                    if (modalAvatar) {
                        modalAvatar.src = data.avatar;
                    }
                    showToast('Foto profil berhasil diunggah!', 'success');
                } else {
                    showToast(data.message || 'Gagal unggah foto', 'error');
                }
            } catch (err) {
                showToast('Gagal unggah foto: ' + err.message, 'error');
            }
            profileModalAvatarInput.value = '';
        });
    }

    const btnProfileUploadSignature = document.getElementById("btn-profile-upload-signature");
    const profileSignatureInput = document.getElementById("profile-modal-signature-input");
    if (btnProfileUploadSignature && profileSignatureInput) {
        btnProfileUploadSignature.addEventListener("click", () => {
            profileSignatureInput.click();
        });
        profileSignatureInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith("image/")) {
                showToast("File harus berupa gambar!", "error");
                return;
            }
            const reader = new FileReader();
            reader.onload = function (evt) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    let w = img.width;
                    let h = img.height;
                    const maxDim = 400;
                    if (w > maxDim || h > maxDim) {
                        if (w > h) {
                            h = Math.round((h * maxDim) / w);
                            w = maxDim;
                        } else {
                            w = Math.round((w * maxDim) / h);
                            h = maxDim;
                        }
                    }
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, w, h);
                    const compressedBase64 = canvas.toDataURL("image/png");

                    const previewImg = document.getElementById("profile-modal-signature");
                    const placeholder = document.getElementById("profile-modal-signature-placeholder");
                    if (previewImg && placeholder) {
                        previewImg.src = compressedBase64;
                        previewImg.style.display = "block";
                        placeholder.style.display = "none";
                    }
                };
                img.src = evt.target.result;
            };
            reader.readAsDataURL(file);
            profileSignatureInput.value = "";
        });
    }

    const btnProfileDrawSignature = document.getElementById("btn-profile-draw-signature");
    if (btnProfileDrawSignature) {
        btnProfileDrawSignature.addEventListener("click", async () => {
            // ponytail: Pass hideUpload = false so user can upload/choose signature for profile settings
            const sig = await showSignatureModal("Gambar/Tulis Tanda Tangan", "Unggah gambar tanda tangan Anda atau gunakan file yang ada.", false);
            if (sig) {
                const previewImg = document.getElementById("profile-modal-signature");
                const placeholder = document.getElementById("profile-modal-signature-placeholder");
                if (previewImg && placeholder) {
                    previewImg.src = sig;
                    previewImg.style.display = "block";
                    placeholder.style.display = "none";
                }
            }
        });
    }

    const btnProfileClearSignature = document.getElementById("btn-profile-clear-signature");
    if (btnProfileClearSignature) {
        btnProfileClearSignature.addEventListener("click", () => {
            const previewImg = document.getElementById("profile-modal-signature");
            const placeholder = document.getElementById("profile-modal-signature-placeholder");
            if (previewImg && placeholder) {
                previewImg.src = "";
                previewImg.style.display = "none";
                placeholder.style.display = "block";
            }
        });
    }

    const btnProfileModalCancel = document.getElementById("btn-profile-modal-cancel");
    if (btnProfileModalCancel) {
        btnProfileModalCancel.addEventListener("click", () => {
            document.getElementById("user-profile-modal").style.display = "none";
        });
    }

    const btnProfileModalSave = document.getElementById("btn-profile-modal-save");
    if (btnProfileModalSave) {
        btnProfileModalSave.addEventListener("click", async () => {
            const fullname = document.getElementById("profile-modal-fullname").value.trim();
            const passwordInput = document.getElementById("profile-modal-password").value.trim();

            if (!fullname) {
                showToast("Nama lengkap harus diisi!", "error");
                return;
            }

            // ponytail: Show password confirmation popup instead of inline field
            const oldPassword = await new Promise((resolve) => {
                const overlay = document.createElement("div");
                overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);display:flex;justify-content:center;align-items:center;z-index:13000;";
                overlay.innerHTML = `
                    <div class="card-glass animate-in" style="width:90%;max-width:360px;padding:1.5rem;display:flex;flex-direction:column;gap:1rem;align-items:center;text-align:center;box-shadow:var(--shadow-lg);">
                        <div style="background:var(--color-blue-glow);color:var(--color-blue);width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;">
                            <i data-lucide="shield-check" style="width:22px;height:22px;"></i>
                        </div>
                        <h4 style="margin:0;font-size:1rem;font-weight:700;color:var(--text-primary);">Konfirmasi Password</h4>
                        <p style="margin:0;font-size:0.85rem;color:var(--text-secondary);line-height:1.4;">Masukkan password lama Anda untuk menyimpan perubahan profil.</p>
                        <input type="password" id="popup-confirm-password" placeholder="Password lama..." style="width:100%;padding:0.65rem;border-radius:var(--border-radius-md);border:1px solid var(--card-border);background:var(--bg-main);color:var(--text-primary);box-sizing:border-box;font-size:0.9rem;" autofocus>
                        <div style="display:flex;gap:0.75rem;width:100%;margin-top:0.25rem;">
                            <button class="btn btn-outline full-width" id="popup-confirm-cancel" style="padding:0.6rem;">Batal</button>
                            <button class="btn btn-primary full-width" id="popup-confirm-ok" style="padding:0.6rem;font-weight:600;">Konfirmasi</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(overlay);
                if (window.lucide) lucide.createIcons({ nodes: [overlay] });
                const pwdInput = overlay.querySelector("#popup-confirm-password");
                setTimeout(() => pwdInput.focus(), 100);
                const cleanup = (val) => { overlay.remove(); resolve(val); };
                overlay.querySelector("#popup-confirm-cancel").addEventListener("click", () => cleanup(null));
                overlay.querySelector("#popup-confirm-ok").addEventListener("click", () => cleanup(pwdInput.value.trim()));
                pwdInput.addEventListener("keydown", (e) => { if (e.key === "Enter") cleanup(pwdInput.value.trim()); });
                overlay.addEventListener("click", (e) => { if (e.target === overlay) cleanup(null); });
            });

            if (!oldPassword) return; // User cancelled or left empty

            const modalAvatar = document.getElementById("profile-modal-avatar");
            const avatarUrl = modalAvatar ? modalAvatar.src : "";

            let relativeAvatarUrl = avatarUrl;
            try {
                const urlObj = new URL(avatarUrl);
                relativeAvatarUrl = urlObj.pathname;
            } catch (e) { }


            const modalSig = document.getElementById("profile-modal-signature");
            const signatureUrl = modalSig && modalSig.style.display !== "none" ? modalSig.src : "";

            const payload = {
                creator_username: state.currentUser.username,
                fullname: fullname,
                role: state.currentUser.role,
                avatar: relativeAvatarUrl,
                old_password: oldPassword,
                signature: signatureUrl
            };
            // ponytail: only send password if user wants to change it
            if (passwordInput) payload.password = passwordInput;

            try {
                const res = await fetch(`/api/users/${state.currentUser.username}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "Gagal mengubah profil");
                }

                // Update local session storage and state.currentUser
                state.currentUser.fullname = fullname;
                state.currentUser.avatar = relativeAvatarUrl;
                state.currentUser.signature = signatureUrl;

                safeSessionStorage.setItem('PTBAS_USER', JSON.stringify(state.currentUser));

                // Update sidebar details
                document.getElementById("sidebar-avatar").src = relativeAvatarUrl || "avatar-default.png";
                document.getElementById("sidebar-fullname").textContent = fullname;

                document.getElementById("user-profile-modal").style.display = "none";
                showToast("Profil berhasil diperbarui!", "success");
            } catch (err) {
                showToast(err.message || "Terjadi kesalahan saat menyimpan profil", "error");
            }
        });
    }

    // Admin User Database Controls
    const btnToggleUser = document.getElementById("btn-toggle-new-user");
    const userFormContainer = document.getElementById("user-form-container");
    if (btnToggleUser && userFormContainer) {
        btnToggleUser.addEventListener("click", () => {
            const isHidden = userFormContainer.style.display === 'none';
            userFormContainer.style.display = isHidden ? 'block' : 'none';
            if (isHidden) {
                resetUserForm();
                filterUserRoleOptions();
            }
            btnToggleUser.innerHTML = isHidden ? '<i data-lucide="minus-circle"></i> Sembunyikan Form' : '<i data-lucide="plus-circle"></i> Daftarkan User';
            lucide.createIcons();
        });
    }

    const btnCancelUser = document.getElementById("btn-cancel-user-form");
    if (btnCancelUser && userFormContainer) {
        btnCancelUser.addEventListener("click", () => {
            resetUserForm();
            userFormContainer.style.display = 'none';
            if (btnToggleUser) {
                btnToggleUser.innerHTML = '<i data-lucide="plus-circle"></i> Daftarkan User';
                lucide.createIcons();
            }
        });
    }

    const userForm = document.getElementById("user-admin-form");
    if (userForm) {
        userForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await saveUserData();
        });
    }

    // ponytail: handle template selection change to populate log textarea
    const templateSelect = document.getElementById("modal-log-template");
    if (templateSelect) {
        templateSelect.addEventListener("change", () => {
            const val = templateSelect.value;
            const textarea = document.getElementById("modal-new-log");
            if (!textarea) return;

            if (val === "selesai_normal") {
                textarea.value = "Pekerjaan telah diselesaikan sepenuhnya. Uji coba fungsi (running test) berhasil tanpa kendala. Unit siap dioperasikan kembali.";
            } else if (val === "selesai_part") {
                textarea.value = "Pekerjaan selesai. Telah dilakukan penggantian spare part: [Nama Spare Part]. Pengujian akhir menunjukkan hasil normal.";
            } else if (val === "selesai_catatan") {
                textarea.value = "Pekerjaan selesai dilakukan, namun terdapat catatan observasi: [Tulis Catatan]. Disarankan pemantauan berkala pada unit.";
            } else if (val === "progress_log") {
                textarea.value = "Perkembangan pengerjaan: [Tulis Progress]. Kendala di lapangan: [Tulis Kendala/Status].";
            } else {
                textarea.value = "";
            }
        });
    }

    document.getElementById("btn-excel-export").addEventListener("click", exportToExcel);

    // ponytail: bind Excel import buttons
    document.getElementById("btn-excel-import").addEventListener("click", () => {
        document.getElementById("excel-import-input").click();
    });
    document.getElementById("excel-import-input").addEventListener("change", importFromExcel);

    // ponytail: Server Database Nuclear event listener
    const btnNuclear = document.getElementById("btn-db-nuclear");
    if (btnNuclear) {
        btnNuclear.addEventListener("click", async () => {
            const confirmed = await showCustomConfirm(
                "PERINGATAN KRITIS: Ini akan MENGHAPUS seluruh database (EJO, Projects, Users, Drawings, Parts) dan menyetel ulang sistem ke setelan pabrik! Apakah Anda yakin?",
                "NUCLEAR DATABASE"
            );
            if (!confirmed) return;

            const reconfirm = await showCustomPrompt(
                "Ketik 'NUCLEAR' (semua huruf besar) untuk mengonfirmasi tindakan destruktif ini:",
                ""
            );
            if (reconfirm !== "NUCLEAR") {
                showToast("Tindakan dibatalkan. Konfirmasi tidak cocok.", "warning");
                return;
            }

            try {
                const res = await fetch("/api/nuclear", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: state.currentUser.username })
                });

                if (res.ok) {
                    showToast("Database berhasil dinuclear! Halaman akan dimuat ulang...", "success");
                    setTimeout(() => {
                        logoutUser();
                    }, 2000);
                } else {
                    const data = await res.json();
                    throw new Error(data.message || "Gagal melakukan nuclear database");
                }
            } catch (err) {
                showToast(err.message || "Gagal melakukan nuclear database", "error");
            }
        });
    }
}

function switchTab(tabId) {
    // ponytail: redirect overview, admin, and general-ejo tabs to drawing if user is a Drafter (since Drawing is their only visible menu)
    if (state.currentUser) {
        const isDrafterOnly = state.currentUser.role === 'Drafter';
        const isTechNonDrafter = isDrafterRole(state.currentUser.role) && !isDrafterOnly;
        if (isDrafterOnly) {
            if (tabId === 'overview' || tabId === 'admin' || tabId === 'general-ejo') {
                tabId = 'drawing';
            }
        } else if (isTechNonDrafter) {
            if (tabId === 'overview' || tabId === 'admin') {
                tabId = 'general-ejo';
            }
        }
    }
    // ponytail: rename Lead Engineer -> Foreman
    if (tabId === 'admin' && (!state.currentUser || (!isLeadRole(state.currentUser.role)))) {
        tabId = 'overview';
    }
    state.activeTab = tabId;

    // ponytail: reset activeProjectPhase if switching away from projects
    if (tabId !== 'projects') {
        state.activeProjectPhase = null;
    }
    // ponytail: reset activeGeneralEjoPhase if switching away from general-ejo
    if (tabId !== 'general-ejo') {
        state.activeGeneralEjoPhase = null;
    }
    // ponytail: reset activeDrawingPhase if switching away from drawing
    if (tabId !== 'drawing') {
        state.activeDrawingPhase = null;
    }

    // Set titles
    const titleEl = document.getElementById("page-title");
    const subEl = document.getElementById("page-subtitle");

    if (tabId === 'overview') {
        titleEl.textContent = "Dashboard Overview";
        subEl.textContent = "Monitoring status, kinerja, dan anggaran order lapangan.";
    } else if (tabId === 'general-ejo') {
        titleEl.textContent = "General EJO";
        if (state.activeGeneralEjoPhase === 1) {
            // ponytail: update subtitle texts to match new header names
            subEl.textContent = "Schedule — Daftar EJO langsung yang menunggu atau disetujui.";
        } else if (state.activeGeneralEjoPhase === 2) {
            // ponytail: update subtitle texts to match new header names
            subEl.textContent = "On Progress — Daftar EJO langsung yang sedang berjalan di lapangan.";
        } else if (state.activeGeneralEjoPhase === 3) {
            // ponytail: update subtitle texts to match new header names
            subEl.textContent = "Done — Daftar EJO langsung yang sudah selesai atau dibatalkan.";
        } else {
            subEl.textContent = "Daftar lengkap seluruh Engineering Job Order (semua status).";
        }
    } else if (tabId === 'drawing') {
        titleEl.textContent = "Galeri Drawing";
        if (state.activeDrawingPhase === 1) {
            subEl.textContent = "Schedule — File drawing terkait EJO yang dalam status Schedule.";
        } else if (state.activeDrawingPhase === 2) {
            subEl.textContent = "On Progress — File drawing terkait EJO yang sedang berjalan di lapangan.";
        } else if (state.activeDrawingPhase === 3) {
            subEl.textContent = "Done — File drawing terkait EJO yang sudah selesai atau dibatalkan.";
        } else {
            subEl.textContent = "Kumpulan file gambar teknik dan PDF yang terhubung ke EJO.";
        }
    } else if (tabId === 'projects') {
        titleEl.textContent = "Project Monitoring Board";
        if (state.activeProjectPhase === 1) {
            subEl.textContent = "Fase 1: Inisialisasi Ide — Gagasan dituangkan ke atasan/bos.";
        } else if (state.activeProjectPhase === 2) {
            subEl.textContent = "Fase 2: Ide Disetujui & Pengadaan — Persetujuan & penyediaan barang/jasa.";
        } else if (state.activeProjectPhase === 3) {
            subEl.textContent = "Fase 3: Tinggal Eksekusi — Seluruh barang tersedia & siap pengerjaan.";
        } else if (state.activeProjectPhase === 'archive') {
            subEl.textContent = "Arsip Project — Daftar project yang sudah selesai atau diarsipkan.";
        } else {
            subEl.textContent = "Pantau siklus inisialisasi ide baru hingga kesiapan eksekusi proyek.";
        }
    } else if (tabId === 'repair-parts') {
        titleEl.textContent = "Daftar Repair Part (Spare Parts)";
        subEl.textContent = "Kelola inventori spare part yang dialokasikan untuk pekerjaan perbaikan EJO.";
    } else if (tabId === 'history') {
        titleEl.textContent = "History EJO";
        subEl.textContent = "Riwayat Engineering Job Order yang sudah selesai atau dibatalkan.";
    } else if (tabId === 'admin') {
        titleEl.textContent = "Admin Panel & Utilities";
        subEl.textContent = "Kelola akun, password, otoritas tim teknisi, dan utilitas data Excel PT. BAS.";
    }

    // Toggle tab panes
    document.querySelectorAll(".tab-pane").forEach(pane => {
        pane.classList.remove("active");
    });

    const targetPane = document.getElementById(`tab-${tabId}`);
    if (targetPane) {
        targetPane.classList.add("active");
    }

    // Sync sidebar state
    document.querySelectorAll(".nav-btn").forEach(b => {
        b.classList.remove("active");

        const bTab = b.getAttribute("data-tab");
        const bPhase = b.getAttribute("data-phase");
        const bGejoPhase = b.getAttribute("data-gejo-phase");
        const bDrawingPhase = b.getAttribute("data-drawing-phase");

        if (bTab === tabId) {
            if (tabId === 'projects') {
                if (bPhase) {
                    const isMatch = (bPhase === 'archive' && state.activeProjectPhase === 'archive') ||
                        (state.activeProjectPhase && parseInt(bPhase) === state.activeProjectPhase);
                    if (isMatch) {
                        b.classList.add("active");
                    }
                } else {
                    b.classList.add("active");
                }
            } else if (tabId === 'general-ejo') {
                if (bGejoPhase) {
                    if (state.activeGeneralEjoPhase && parseInt(bGejoPhase) === state.activeGeneralEjoPhase) {
                        b.classList.add("active");
                    }
                } else {
                    b.classList.add("active");
                }
            } else if (tabId === 'drawing') {
                if (b.id === 'btn-nav-drawing-all') {
                    if (state.activeDrawingPhase === 'history') {
                        b.classList.add("active");
                    }
                } else if (bDrawingPhase) {
                    if (state.activeDrawingPhase && parseInt(bDrawingPhase) === state.activeDrawingPhase) {
                        b.classList.add("active");
                    }
                } else if (b.id === 'btn-nav-drawing') {
                    b.classList.add("active");
                }
            } else {
                b.classList.add("active");
            }
        }
    });

    // ponytail: highlight parent EJO button if active tab is a child of the EJO dropdown
    const ejoChildTabs = ['general-ejo', 'drawing', 'repair-parts', 'projects'];
    const parentJobOrdersBtn = document.getElementById("btn-nav-job-orders");
    if (parentJobOrdersBtn) {
        if (ejoChildTabs.includes(tabId)) {
            parentJobOrdersBtn.classList.add("active");
        }
    }

    // ponytail: handle dropdown toggle matching active tab state (excluding general-ejo to keep it collapsed by default, except for tech roles)
    const isTechNonDrafter = state.currentUser && isDrafterRole(state.currentUser.role) && state.currentUser.role !== 'Drafter';
    const isDrafterOnly = state.currentUser && state.currentUser.role === 'Drafter';
    const ejoSubmenuTabs = isTechNonDrafter ? ['general-ejo'] : ['drawing', 'repair-parts', 'projects'];
    const jobOrdersSubmenu = document.getElementById("job-orders-submenu");
    const chevron = document.querySelector("#btn-nav-job-orders .dropdown-chevron");
    if (jobOrdersSubmenu && chevron) {
        if (isDrafterOnly) {
            // ponytail: do not force flex here to allow toggling by EJO button click; only collapse if navigating completely away
            if (!ejoChildTabs.includes(tabId)) {
                jobOrdersSubmenu.style.display = "none";
            }
        } else if (ejoSubmenuTabs.includes(tabId)) {
            jobOrdersSubmenu.style.display = "flex";
            chevron.classList.add("rotated");
        } else if (!ejoChildTabs.includes(tabId)) {
            // Only collapse if we navigate completely outside EJO child tabs (e.g. to Dashboard or Admin)
            jobOrdersSubmenu.style.display = "none";
            chevron.classList.remove("rotated");
        }
    }

    // ponytail: handle nested projects submenu toggle matching active tab state (keep collapsed by default on projects tab load, only collapse when switching away)
    const projectsSubmenu = document.getElementById("projects-submenu");
    const nestedChevron = document.querySelector("#btn-nav-projects .nested-chevron");
    if (projectsSubmenu && nestedChevron) {
        if (tabId !== 'projects') {
            projectsSubmenu.style.display = "none";
            nestedChevron.classList.remove("rotated");
        }
    }

    // ponytail: handle nested general-ejo submenu toggle matching active tab state (keep collapsed by default on general-ejo tab load)
    const generalEjoSubmenu = document.getElementById("general-ejo-submenu");
    const gejoChevron = document.querySelector("#btn-nav-general-ejo .gejo-chevron");
    if (generalEjoSubmenu && gejoChevron) {
        if (tabId !== 'general-ejo') {
            generalEjoSubmenu.style.display = "none";
            gejoChevron.classList.remove("rotated");
        }
    }

    // ponytail: handle nested drawing submenu toggle matching active tab state (keep collapsed by default on drawing tab load, only collapse when switching away)
    const drawingSubmenu = document.getElementById("drawing-submenu");
    const drawingChevron = document.querySelector("#btn-nav-drawing .drawing-chevron");
    if (drawingSubmenu) {
        if (isDrafterOnly) {
            // ponytail: always show drawing submenu for Drafter since it's the only one they have
            drawingSubmenu.style.display = "flex";
        } else if (drawingChevron) {
            if (tabId !== 'drawing') {
                drawingSubmenu.style.display = "none";
                drawingChevron.classList.remove("rotated");
            }
        }
    }

    applySidebarRoleRestrictions();
    renderAll();
}

// ==========================================
// Rendering Logics
// ==========================================
function renderAll() {
    renderKPIs();
    renderNotifications();

    if (state.activeTab === 'overview') {
        renderOverviewCharts();
        renderCriticalList();
    } else if (state.activeTab === 'general-ejo') {
        renderGeneralEJO();
    } else if (state.activeTab === 'drawing') {
        renderDrawings();
    } else if (state.activeTab === 'projects') {
        renderProjects();
    } else if (state.activeTab === 'repair-parts') {
        renderRepairParts();
    } else if (state.activeTab === 'history') {
        renderHistory();
    } else if (state.activeTab === 'admin') {
        renderUsers();
    }

    lucide.createIcons();
}

// ponytail: helper to check if an EJO is waiting for approval by the current logged-in user
function isApprovalPendingForCurrentUser(e) {
    if (!state.currentUser) return false;

    const role = state.currentUser.role;
    const isLead = isLeadRole(role);
    const isRequester = checkIsRequester(e.requester);

    if (e.status === 'Requested') {
        return isLead;
    }
    if (e.status === 'Pending Approval') {
        return isLead;
    }
    if (e.status === 'Pending Requester Approval' || e.status === 'Pending User Approval') {
        return isRequester;
    }
    if (e.status === 'Pending Revision') {
        return isLead;
    }
    if (e.status === 'Pending Foreman Approval') {
        return role === 'Foreman' || role === 'Admin' || role === 'Server';
    }
    if (e.status === 'Pending Supervisor Approval') {
        return role === 'Supervisor' || role === 'Manager' || role === 'Plant Manager' || role === 'Server';
    }
    if (e.status === 'Pending Manager Approval') {
        return role === 'Manager' || role === 'Plant Manager' || role === 'Server';
    }

    return false;
}

function renderKPIs() {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const allEjos = (state.ejos || []).concat(getVisibleGeneralEjos());

    const total = allEjos.length;
    const pending = allEjos.filter(isApprovalPendingForCurrentUser).length;
    // ponytail: align progress KPI count to represent Phase 2 (On Progress) statuses only (exclude Phase 1 Schedule/Checking)
    const progress = allEjos.filter(e => e.status.startsWith('In Progress') || (e.status.startsWith('Pending') && e.status !== 'Pending Revision') || e.status.startsWith('Waiting')).length;

    // ponytail: Completed THIS MONTH only (by targetDate or last log date)
    const completedThisMonth = allEjos.filter(e => {
        if (e.status !== 'Completed') return false;
        // Use last log date if available, else targetDate
        const logs = parseLogs(e.logs);
        const dateStr = logs.length > 0 ? logs[logs.length - 1].date : e.targetDate;
        if (!dateStr) return false;
        const d = new Date(dateStr);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    // Month-over-month % change for Total EJO
    const ejosThisMonth = allEjos.filter(e => {
        const d = e.targetDate ? new Date(e.targetDate) : null;
        return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;
    const ejosLastMonth = allEjos.filter(e => {
        const d = e.targetDate ? new Date(e.targetDate) : null;
        return d && d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    }).length;

    // ponytail: MoM % = ((this - last) / last) * 100
    let momPct = 0;
    if (ejosLastMonth > 0) {
        momPct = Math.round(((ejosThisMonth - ejosLastMonth) / ejosLastMonth) * 100);
    } else if (ejosThisMonth > 0) {
        momPct = 100; // all new this month
    }

    // ponytail: Success Rate = Completed / (Completed + Cancelled) * 100
    const allCompleted = allEjos.filter(e => e.status === 'Completed').length;
    const allCancelled = allEjos.filter(e => e.status === 'Cancelled').length;
    const successRate = (allCompleted + allCancelled) > 0
        ? ((allCompleted / (allCompleted + allCancelled)) * 100).toFixed(1)
        : '0.0';

    // Set values
    document.getElementById("kpi-total").textContent = total;
    document.getElementById("kpi-pending").textContent = pending;
    document.getElementById("kpi-progress").textContent = progress;
    document.getElementById("kpi-completed").textContent = completedThisMonth;

    // Set dynamic sub-texts
    const totalSub = document.getElementById("kpi-total-sub");
    if (momPct >= 0) {
        totalSub.innerHTML = `<i data-lucide="trending-up" style="width:12px;height:12px;"></i> +${momPct}% dari bulan lalu`;
    } else {
        totalSub.innerHTML = `<i data-lucide="trending-down" style="width:12px;height:12px;"></i> ${momPct}% dari bulan lalu`;
    }

    const pendingSub = document.getElementById("kpi-pending-sub");
    if (pending > 0) {
        pendingSub.innerHTML = `<span class="text-yellow font-bold">${pending} Butuh Tindakan</span>`;
    } else {
        pendingSub.textContent = "Semua disetujui";
    }

    const progressSub = document.getElementById("kpi-progress-sub");
    progressSub.textContent = progress > 0 ? `${progress} sedang berjalan` : 'Tidak ada pekerjaan aktif';

    const completedSub = document.getElementById("kpi-completed-sub");
    completedSub.innerHTML = `<i data-lucide="trending-up" style="width:12px;height:12px;"></i> ${successRate}% Success Rate`;

    // ponytail: Populate General EJO Summary Card on Dashboard
    const visibleGejos = getVisibleGeneralEjos();
    const totalGejos = visibleGejos.length;

    let gejoLimitHtml = "";
    if (state.currentUser) {
        const isLimited = state.currentUser.role === 'User';
        if (!isLimited) {
            gejoLimitHtml = `<i data-lucide="shield" style="width:12px; height:12px; color: var(--color-green);"></i> <span style="color: var(--color-green);">Limit: Unlimited</span>`;
        } else {
            const myGejosCount = (state.generalEjos || []).filter(e => {
                const isOwner = e.requester === state.currentUser.fullname || e.requester === state.currentUser.username;
                if (!isOwner) return false;
                if (e.is_archived) return false;
                const status = e.status || '';
                if (status === 'Completed' || status === 'Cancelled' || status === 'Pending Revision') return false;
                return true;
            }).length;
            const sisa = Math.max(0, 2 - myGejosCount);
            if (sisa === 0) {
                gejoLimitHtml = `<i data-lucide="shield-alert" style="width:12px; height:12px; color: var(--color-red);"></i> <span style="color: var(--color-red);">Limit: ${myGejosCount}/2 (Penuh)</span>`;
            } else {
                gejoLimitHtml = `<i data-lucide="shield-alert" style="width:12px; height:12px; color: var(--color-cyan);"></i> <span style="color: var(--color-cyan);">Limit: ${myGejosCount}/2 (Sisa ${sisa})</span>`;
            }
        }
    }

    const gejoSchedule = visibleGejos.filter(e => e.status === 'Requested' || e.status === 'Approved' || (e.status || '').startsWith('Checking') || e.status === 'Pending Revision' || ((e.status || '').startsWith('In Progress') && (e.status || '').includes('(Revisi'))).length;
    const gejoProgress = visibleGejos.filter(e => ((e.status || '').startsWith('In Progress') && !(e.status || '').includes('(Revisi')) || ((e.status || '').startsWith('Pending') && e.status !== 'Pending Revision')).length;
    const gejoDone = visibleGejos.filter(e => e.status === 'Completed' && e.is_archived !== 1 && e.is_archived !== '1').length;
    const gejoArchive = visibleGejos.filter(e => e.status === 'Cancelled' || e.is_archived === 1 || e.is_archived === '1' || e.status === 'Archived').length;

    const gejoBreakdownHtml = `
        <span class="badge" style="background: rgba(234, 179, 8, 0.08); color: var(--color-yellow); border: 1px solid rgba(234, 179, 8, 0.2); font-size: 0.8rem; padding: 6px 12px; font-weight: 600; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--color-yellow);"></span>
            Schedule: <strong style="font-size: 0.9rem; margin-left: 2px; color: var(--text-primary); font-weight: 700;">${gejoSchedule}</strong>
        </span>
        <span class="badge" style="background: rgba(6, 182, 212, 0.08); color: var(--color-cyan); border: 1px solid rgba(6, 182, 212, 0.2); font-size: 0.8rem; padding: 6px 12px; font-weight: 600; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--color-cyan);"></span>
            On Progress: <strong style="font-size: 0.9rem; margin-left: 2px; color: var(--text-primary); font-weight: 700;">${gejoProgress}</strong>
        </span>
        <span class="badge" style="background: rgba(16, 185, 129, 0.08); color: var(--color-green); border: 1px solid rgba(16, 185, 129, 0.2); font-size: 0.8rem; padding: 6px 12px; font-weight: 600; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--color-green);"></span>
            Done: <strong style="font-size: 0.9rem; margin-left: 2px; color: var(--text-primary); font-weight: 700;">${gejoDone}</strong>
        </span>
        <span class="badge" style="background: rgba(148, 163, 184, 0.08); color: var(--text-secondary); border: 1px solid rgba(148, 163, 184, 0.2); font-size: 0.8rem; padding: 6px 12px; font-weight: 600; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #94a3b8;"></span>
            Arsip: <strong style="font-size: 0.9rem; margin-left: 2px; color: var(--text-primary); font-weight: 700;">${gejoArchive}</strong>
        </span>
    `;

    const ovGejoActive = document.getElementById("overview-gejo-active");
    const ovGejoLimit = document.getElementById("overview-gejo-limit");
    const ovGejoBreakdown = document.getElementById("overview-gejo-breakdown");
    if (ovGejoActive) ovGejoActive.textContent = totalGejos;
    if (ovGejoLimit) ovGejoLimit.innerHTML = gejoLimitHtml;
    if (ovGejoBreakdown) ovGejoBreakdown.innerHTML = gejoBreakdownHtml;

    // ponytail: Populate Drawing Summary Card on Dashboard
    const visibleDrawings = getVisibleDrawings();
    const totalDrawings = visibleDrawings.length;

    let drawingLimitHtml = "";
    if (state.currentUser) {
        const isLimited = state.currentUser.role === 'User';
        if (!isLimited) {
            drawingLimitHtml = `<i data-lucide="shield" style="width:12px; height:12px; color: var(--color-green);"></i> <span style="color: var(--color-green);">Limit: Unlimited</span>`;
        } else {
            const myDrawingsCount = (state.drawings || []).filter(d => {
                const isOwner = d.uploader === state.currentUser.fullname || d.uploader === state.currentUser.username ||
                    d.requester === state.currentUser.fullname || d.requester === state.currentUser.username;
                if (!isOwner) return false;
                if (d.is_archived) return false;
                const status = d.status || '';
                if (status === 'Completed' || status === 'Cancelled' || status === 'Archived' || status === 'Rejected') return false;
                return true;
            }).length;
            const sisa = Math.max(0, 2 - myDrawingsCount);
            if (sisa === 0) {
                drawingLimitHtml = `<i data-lucide="shield-alert" style="width:12px; height:12px; color: var(--color-red);"></i> <span style="color: var(--color-red);">Limit: ${myDrawingsCount}/2 (Penuh)</span>`;
            } else {
                drawingLimitHtml = `<i data-lucide="shield-alert" style="width:12px; height:12px; color: var(--color-cyan);"></i> <span style="color: var(--color-cyan);">Limit: ${myDrawingsCount}/2 (Sisa ${sisa})</span>`;
            }
        }
    }

    // ponytail: align overview card counts with getDrawingPhase where pending approvals stay in On Progress
    const drawingSchedule = visibleDrawings.filter(d => {
        const status = d.status || 'Pending Foreman Approval';
        const hasFile = !!d.file_path;
        return status === 'Checking' || (status === 'Pending Foreman Approval' && !hasFile);
    }).length;

    const drawingProgress = visibleDrawings.filter(d => {
        const status = d.status || 'Pending Foreman Approval';
        const hasFile = !!d.file_path;
        return status === 'On Progress' || status === 'Pending Supervisor Approval' || status === 'Pending Manager Approval' || status === 'Pending Requester Approval' || (status === 'Pending Foreman Approval' && hasFile);
    }).length;

    const drawingDone = visibleDrawings.filter(d => {
        const status = d.status || 'Pending Foreman Approval';
        return status === 'Completed';
    }).length;

    const drawingArchive = visibleDrawings.filter(d => {
        const status = d.status || 'Pending Foreman Approval';
        return status === 'Cancelled' || status === 'Archived' || status === 'Rejected';
    }).length;

    const drawingBreakdownHtml = `
        <span class="badge" style="background: rgba(234, 179, 8, 0.08); color: var(--color-yellow); border: 1px solid rgba(234, 179, 8, 0.2); font-size: 0.8rem; padding: 6px 12px; font-weight: 600; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--color-yellow);"></span>
            Schedule: <strong style="font-size: 0.9rem; margin-left: 2px; color: var(--text-primary); font-weight: 700;">${drawingSchedule}</strong>
        </span>
        <span class="badge" style="background: rgba(6, 182, 212, 0.08); color: var(--color-cyan); border: 1px solid rgba(6, 182, 212, 0.2); font-size: 0.8rem; padding: 6px 12px; font-weight: 600; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--color-cyan);"></span>
            On Progress: <strong style="font-size: 0.9rem; margin-left: 2px; color: var(--text-primary); font-weight: 700;">${drawingProgress}</strong>
        </span>
        <span class="badge" style="background: rgba(16, 185, 129, 0.08); color: var(--color-green); border: 1px solid rgba(16, 185, 129, 0.2); font-size: 0.8rem; padding: 6px 12px; font-weight: 600; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--color-green);"></span>
            Done: <strong style="font-size: 0.9rem; margin-left: 2px; color: var(--text-primary); font-weight: 700;">${drawingDone}</strong>
        </span>
        <span class="badge" style="background: rgba(148, 163, 184, 0.08); color: var(--text-secondary); border: 1px solid rgba(148, 163, 184, 0.2); font-size: 0.8rem; padding: 6px 12px; font-weight: 600; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #94a3b8;"></span>
            Arsip: <strong style="font-size: 0.9rem; margin-left: 2px; color: var(--text-primary); font-weight: 700;">${drawingArchive}</strong>
        </span>
    `;

    const ovDrawingActive = document.getElementById("overview-drawing-active");
    const ovDrawingLimit = document.getElementById("overview-drawing-limit");
    const ovDrawingBreakdown = document.getElementById("overview-drawing-breakdown");
    if (ovDrawingActive) ovDrawingActive.textContent = totalDrawings;
    if (ovDrawingLimit) ovDrawingLimit.innerHTML = drawingLimitHtml;
    if (ovDrawingBreakdown) ovDrawingBreakdown.innerHTML = drawingBreakdownHtml;

    lucide.createIcons({
        attrs: {
            "stroke-width": 2
        },
        nameAttr: "data-lucide"
    });
}

function renderNotifications() {
    const badge = document.querySelector(".notification-btn .badge");
    const container = document.getElementById("notify-list-items");
    const list = state.notifications || [];

    // ponytail: badge = jumlah yang belum dibaca (is_read === 0)
    const unread = list.filter(n => !n.is_read);

    if (list.length === 0) {
        badge.style.display = 'none';
        container.innerHTML = '<div class="text-secondary text-xs text-center" style="padding: 1rem;">Tidak ada notifikasi</div>';
        return;
    }

    badge.style.display = unread.length > 0 ? 'flex' : 'none';
    badge.textContent = unread.length;

    // ponytail: field dari server: message, timestamp, is_read, ejo_id
    container.innerHTML = list.map(n => {
        const time = n.timestamp ? n.timestamp.split(' ')[1] + " WIB" : '';
        const readClass = n.is_read ? ' notify-read' : '';
        const clickableClass = n.ejo_id ? ' clickable' : '';
        const clickAttr = n.ejo_id ? ` onclick="openEjoFromNotification('${n.ejo_id}', '${n.id}')"` : '';
        return `
            <div class="notify-item${readClass}${clickableClass}"${clickAttr}>
                <span class="notify-time">${time}</span>
                <span>${n.message}</span>
            </div>
        `;
    }).join('');
}

// ponytail: Buka detail EJO dari klik notifikasi, hapus notifikasi di server dan local state agar hilang, dan tutup panel
async function openEjoFromNotification(ejoId, notifId) {
    const notifyPanel = document.getElementById("notify-panel");
    if (notifyPanel) {
        notifyPanel.style.display = 'none';
    }
    openEJODetails(ejoId);

    if (notifId) {
        try {
            await fetch(`/api/notifications?id=${notifId}`, { method: "DELETE" });
            if (state.notifications) {
                state.notifications = state.notifications.filter(n => n.id !== notifId);
                renderNotifications();
            }
        } catch (err) {
            console.error("Gagal menghapus notifikasi:", err);
        }
    }
}

// ponytail: Auto-refresh data in background dynamically every 4 seconds
async function refreshDataBackground() {
    if (!state.currentUser) return;
    try {
        state.ejos = [];
        const resGejos = await fetch("/api/general-ejos");
        if (resGejos.ok) {
            const newGejos = await resGejos.json();
            const hasChanged = JSON.stringify(newGejos) !== JSON.stringify(state.generalEjos);

            if (hasChanged) {
                state.generalEjos = newGejos;
                // ponytail: only re-render if active tab needs general-ejos to avoid breaking inspect / focus
                if (state.activeTab === 'general-ejo' || state.activeTab === 'overview') {
                    renderAll();
                }
            }

            // ponytail: If an EJO modal is active, update the displayed details in realtime
            if (state.selectedEJO) {
                let updatedEjo = newGejos.find(e => e.id === state.selectedEJO.id);
                if (updatedEjo) {
                    state.selectedEJO = { ...state.selectedEJO, ...updatedEjo };

                    const statusBadge = document.getElementById("modal-ejo-status");
                    if (statusBadge) {
                        statusBadge.className = `badge badge-status status-${getStatusClass(state.selectedEJO.status)}`;
                        statusBadge.textContent = getFriendlyStatusText(state.selectedEJO.status, state.selectedEJO);
                    }

                    renderTimelineLogs(state.selectedEJO);
                }
            }
        }
        // ponytail: refresh drawings data in background every 4 seconds
        try {
            const resDrawings = await fetch("/api/drawings");
            if (resDrawings.ok) {
                const newDrawings = await resDrawings.json();
                const hasDrawingsChanged = JSON.stringify(newDrawings) !== JSON.stringify(state.drawings);

                if (hasDrawingsChanged) {
                    state.drawings = newDrawings;
                    if (state.activeTab === 'drawing') {
                        renderDrawings();
                    }
                }

                // If drawing modal is active, update displayed details in realtime
                if (state.selectedDrawing) {
                    const updatedDrawing = newDrawings.find(d => d.id === state.selectedDrawing.id);
                    if (updatedDrawing) {
                        const hasDrawingDetailsChanged = JSON.stringify(updatedDrawing) !== JSON.stringify(state.selectedDrawing);
                        if (hasDrawingDetailsChanged) {
                            // Save references to old values to detect what changed
                            const oldStatus = state.selectedDrawing.status;
                            const oldFilePath = state.selectedDrawing.file_path;
                            const oldEngineer = state.selectedDrawing.engineer;
                            const oldLogs = JSON.stringify(state.selectedDrawing.logs);

                            state.selectedDrawing = { ...state.selectedDrawing, ...updatedDrawing };

                            // 1. Update text metadata
                            const targetDateEl = document.getElementById("modal-drawing-target-date");
                            if (targetDateEl) targetDateEl.textContent = updatedDrawing.targetDate ? formatDisplayDate(updatedDrawing.targetDate) : '-';
                            
                            const estDateWrapper = document.getElementById("modal-drawing-est-date-wrapper");
                            const estDateEl = document.getElementById("modal-drawing-est-date");
                            if (estDateWrapper && estDateEl) {
                                if (updatedDrawing.estDate) {
                                    estDateWrapper.style.display = "inline";
                                    estDateEl.textContent = formatDisplayDate(updatedDrawing.estDate);
                                } else {
                                    estDateWrapper.style.display = "none";
                                }
                            }

                            // 2. Update status badge
                            if (updatedDrawing.status !== oldStatus) {
                                const statusBadge = document.getElementById("modal-drawing-status-badge");
                                if (statusBadge) {
                                    statusBadge.textContent = updatedDrawing.status;
                                    statusBadge.className = "badge";
                                    if (updatedDrawing.status === 'Completed') {
                                        statusBadge.classList.add("status-completed");
                                    } else if (updatedDrawing.status === 'Rejected' || updatedDrawing.status === 'Cancelled') {
                                        statusBadge.classList.add("status-cancelled");
                                    } else {
                                        statusBadge.classList.add("status-approved");
                                    }
                                }
                            }

                            // 3. Update preview if status or file_path changed
                            if (updatedDrawing.file_path !== oldFilePath || updatedDrawing.status !== oldStatus) {
                                const previewContainer = document.getElementById("modal-drawing-preview-container");
                                if (previewContainer) {
                                    if (!updatedDrawing.file_path) {
                                        previewContainer.innerHTML = `
                                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 2.5rem 1.5rem; text-align: center; width: 100%; height: 100%; min-height: 400px; background: rgba(0,0,0,0.1); border-radius: 8px; box-sizing: border-box;">
                                                <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--card-border); display: flex; align-items: center; justify-content: center;">
                                                    <i data-lucide="image-off" style="width: 28px; height: 28px; color: var(--text-muted);"></i>
                                                </div>
                                                <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary); letter-spacing: 0.5px; margin-top: 4px;">Belum ada File Drawing</div>
                                                <div style="font-size: 0.85rem; color: var(--text-secondary); max-width: 280px; line-height: 1.4;">
                                                    File gambar teknik (.DWG/PDF/Image) belum diunggah oleh Drafter.
                                                </div>
                                            </div>
                                        `;
                                    } else {
                                        const isPdf = (updatedDrawing.file_path || '').toLowerCase().endsWith('.pdf');
                                        const isDwg = (updatedDrawing.file_path || '').toLowerCase().endsWith('.dwg');
                                        if (isPdf) {
                                            previewContainer.innerHTML = `
                                                <object data="${updatedDrawing.file_path}" type="application/pdf" style="width: 100%; height: 100%; min-height: 400px; border-radius: 8px;">
                                                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 2rem; text-align: center; width: 100%;">
                                                        <i data-lucide="file-text" style="width: 48px; height: 48px; color: var(--color-cyan);"></i>
                                                        <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">Dokumen PDF: ${updatedDrawing.title}</div>
                                                        <div style="font-size: 0.75rem; color: var(--text-secondary); max-width: 250px;">Pratinjau PDF tidak didukung oleh browser Anda secara langsung.</div>
                                                        <a href="${updatedDrawing.file_path}" target="_blank" class="btn btn-primary" style="margin-top: 8px; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; padding: 6px 16px; font-size: 0.8rem;">
                                                            <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                                                            Buka di Tab Baru
                                                        </a>
                                                    </div>
                                                </object>
                                            `;
                                        } else if (isDwg) {
                                            previewContainer.innerHTML = `
                                                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 2.5rem 1.5rem; text-align: center; width: 100%; height: 100%; min-height: 400px; background: radial-gradient(circle, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 100%); border-radius: 8px; border: 2px dashed rgba(2, 132, 199, 0.3); box-sizing: border-box;">
                                                    <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(2, 132, 199, 0.1); border: 1px solid rgba(2, 132, 199, 0.2); display: flex; align-items: center; justify-content: center;">
                                                        <i data-lucide="pen-tool" style="width: 28px; height: 28px; color: var(--color-blue);"></i>
                                                    </div>
                                                    <div style="font-size: 1rem; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; margin-top: 4px;">File AutoCAD CAD (.DWG)</div>
                                                    <div style="font-size: 0.8rem; color: #94a3b8; font-weight: 500; word-break: break-all; max-width: 320px;">${updatedDrawing.title}</div>
                                                    <div style="font-size: 0.75rem; color: #64748b; max-width: 280px; line-height: 1.4; margin-top: 2px;">
                                                        File format DWG tidak dapat dirender secara langsung di dalam browser web tanpa perangkat lunak CAD.
                                                    </div>
                                                    <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px; width: 100%; max-width: 220px; align-items: center;">
                                                        <a href="${updatedDrawing.file_path}" download class="btn btn-primary" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; text-decoration: none; padding: 8px 16px; font-size: 0.8rem; font-weight: 600; width: 100%; box-sizing: border-box;">
                                                            <i data-lucide="download" style="width: 14px; height: 14px;"></i>
                                                            Unduh File CAD
                                                        </a>
                                                        <a href="https://viewer.autodesk.com/" target="_blank" class="btn btn-outline" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; text-decoration: none; padding: 8px 16px; font-size: 0.8rem; color: #ffffff; border-color: rgba(255, 255, 255, 0.3); background: rgba(255, 255, 255, 0.05); width: 100%; box-sizing: border-box; transition: background 0.2s;" onmouseover="this.style.background='rgba(255, 255, 255, 0.15)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'">
                                                            <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                                                            Autodesk Viewer Online
                                                        </a>
                                                    </div>
                                                </div>
                                            `;
                                        } else {
                                            previewContainer.innerHTML = `<img src="${updatedDrawing.file_path}" style="max-width: 100%; max-height: 400px; object-fit: contain; cursor: zoom-in; border-radius: 8px;" onclick="window.open('${updatedDrawing.file_path}', '_blank')">`;
                                        }
                                    }
                                    lucide.createIcons();
                                }
                            }

                            // 4. Update download link
                            const downloadLink = document.getElementById("modal-drawing-download-link");
                            if (downloadLink) {
                                downloadLink.href = updatedDrawing.file_path || '#';
                                downloadLink.style.display = updatedDrawing.file_path ? 'flex' : 'none';
                            }

                            // 5. Update assignee name & checked radio if changed
                            const assigneeName = document.getElementById("drawing-assignee-name");
                            if (assigneeName) {
                                assigneeName.textContent = updatedDrawing.engineer ? updatedDrawing.engineer : 'Belum ditugaskan';
                            }

                            if (updatedDrawing.engineer !== oldEngineer) {
                                const radio = document.querySelector(`.drawing-assignee-radio[value="${updatedDrawing.engineer || 'Unassigned'}"]`);
                                if (radio) {
                                    radio.checked = true;
                                    const row = radio.closest('.engineer-select-row');
                                    if (row) {
                                        const container = row.closest('#modal-drawing-assignee-container');
                                        if (container) {
                                            container.querySelectorAll('.engineer-select-row').forEach(r => r.classList.remove('selected'));
                                        }
                                        row.classList.add('selected');
                                    }
                                }
                            }

                            // 6. Update logs timeline if changed
                            if (JSON.stringify(updatedDrawing.logs) !== oldLogs) {
                                const logsContainer = document.getElementById("modal-drawing-logs");
                                if (logsContainer) {
                                    logsContainer.innerHTML = "";
                                    const logs = updatedDrawing.logs || [];
                                    logs.forEach(log => {
                                        const item = document.createElement("div");
                                        item.className = "timeline-item";
                                        item.style.position = "relative";
                                        item.style.paddingLeft = "20px";
                                        item.style.marginBottom = "0.75rem";
                                        item.innerHTML = `
                                            <div style="position: absolute; left: 0; top: 4px; width: 8px; height: 8px; border-radius: 50%; background: var(--color-cyan); box-shadow: 0 0 8px var(--color-cyan);"></div>
                                            <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">${log.date}</div>
                                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px; line-height: 1.3;">${log.message}</div>
                                        `;
                                        logsContainer.appendChild(item);
                                    });
                                }
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.warn("Gagal refresh drawings data background:", err);
        }
    } catch (err) {
        console.error("Gagal refresh data background:", err);
    }
}

// ponytail: fetch notifikasi user dari server + polling 10 detik (live)
async function fetchNotifications() {
    if (!state.currentUser) return;
    try {
        const res = await fetch(`/api/notifications?username=${encodeURIComponent(state.currentUser.username)}`);
        if (!res.ok) return;
        const data = await res.json();

        // ponytail: detect ada notif baru (id belum ada di state) → toast alert
        const oldIds = new Set((state.notifications || []).map(n => n.id));
        const fresh = data.filter(n => !oldIds.has(n.id));
        if (fresh.length > 0 && (state.notifications || []).length >= 0) {
            // hanya toast kalau bukan first load (state sudah pernah di-populate)
            if (state.notifications && state.notifications.length > 0) {
                fresh.forEach(n => showToast(n.message, "info"));
            }
        }
        state.notifications = data;
        renderNotifications();
    } catch (err) {
        console.error("Gagal fetch notifikasi:", err);
    }
}

// ponytail: tandai semua notif user sebagai dibaca di server
async function markNotificationsRead() {
    if (!state.currentUser) return;
    try {
        await fetch(`/api/notifications/read-all?username=${encodeURIComponent(state.currentUser.username)}`, { method: "PUT" });
        // update lokal biar badge langsung hilang
        if (state.notifications) {
            state.notifications = state.notifications.map(n => ({ ...n, is_read: 1 }));
            renderNotifications();
        }
    } catch (err) {
        console.error("Gagal mark read:", err);
    }
}

// Critical Priority List
function openGeneralEjoPhaseFromOverview(phase) {
    const normalizedPhase = parseInt(phase, 10);
    if (![1, 2, 3].includes(normalizedPhase)) return;

    const phaseBtn = document.querySelector(`#general-ejo-submenu [data-tab="general-ejo"][data-gejo-phase="${normalizedPhase}"]`);
    if (phaseBtn) {
        phaseBtn.click();
        return;
    }

    state.activeGeneralEjoPhase = normalizedPhase;
    switchTab('general-ejo');
    renderGeneralEJO();
}

function openGeneralEjoScheduleFromOverview() {
    openGeneralEjoPhaseFromOverview(1);
}

function renderCriticalList() {
    const container = document.getElementById("critical-ejo-list");
    const allItems = (state.ejos || []).concat(getVisibleGeneralEjos());
    const criticalEjos = allItems.filter(e =>
        (e.priority === 'Emergency' || e.priority === 'High') && e.status !== 'Completed' && e.status !== 'Cancelled'
    );
    const previewCriticalEjos = criticalEjos.slice(0, 3);
    const hiddenCount = Math.max(0, criticalEjos.length - previewCriticalEjos.length);

    if (criticalEjos.length === 0) {
        container.innerHTML = `
            <div class="text-center text-secondary text-xs py-4">
                <i data-lucide="shield-check" style="width: 24px; height: 24px; color: var(--color-green); margin: 0 auto 6px;"></i>
                Aman! Tidak ada EJO urgent.
            </div>
        `;
        lucide.createIcons();
        return;
    }

    container.innerHTML = previewCriticalEjos.map(e => `
        <div class="recent-item cursor-pointer" onclick="openEJODetails('${e.id}')">
            <div class="recent-item-left">
                <div class="priority-bar pbar-${e.priority.toLowerCase()}"></div>
                <div class="item-info">
                    <div class="item-title-wrapper">
                        <span class="ejo-id-badge">${e.id}</span>
                        <span class="recent-item-title">${e.title}</span>
                    </div>
                    <span class="recent-item-meta">${e.dept} &bull; Target: ${formatDisplayDate(e.targetDate)}</span>
                </div>
            </div>
            <div class="recent-item-right">
                <span class="badge-status status-${getStatusClass(e.status)}">${getFriendlyStatusText(e.status, e)}</span>
                <span class="text-xs text-rose" style="font-weight: 600;">${e.priority}</span>
            </div>
        </div>
    `).join('') + (hiddenCount > 0 ? `
        <button
            class="btn btn-outline btn-xs"
            style="width: 100%; margin-top: 0.75rem; justify-content: center;"
            onclick="openGeneralEjoScheduleFromOverview()"
        >
            Lihat ${hiddenCount} Lainnya
        </button>
    ` : '');

    lucide.createIcons();
}



// ponytail: helper to check if the current user matches the EJO requester (compares fullname, username, and resolves username/fullname mismatches securely using users directory)
function checkIsRequester(requester) {
    if (!state.currentUser || !requester) return false;
    const reqLower = requester.toLowerCase().trim();
    const userFull = state.currentUser.fullname || '';
    const userFullLower = userFull.toLowerCase().trim();
    const userNick = state.currentUser.username || '';
    const userNickLower = userNick.toLowerCase().trim();

    if (reqLower === userFullLower || reqLower === userNickLower) {
        return true;
    }

    // ponytail: exact user lookup to map username <-> fullname without substring collisions
    if (state.users) {
        const foundUser = state.users.find(u => {
            const uFull = (u.fullname || '').toLowerCase().trim();
            const uName = (u.username || '').toLowerCase().trim();
            return reqLower === uFull || reqLower === uName;
        });
        if (foundUser) {
            return foundUser.username.toLowerCase().trim() === userNickLower;
        }
    }

    // ponytail: specific tokenized substring check as fallback (matching exact words)
    if (userNickLower && reqLower.split(/\s+/).includes(userNickLower)) return true;
    if (userFullLower && reqLower.split(/\s+/).includes(userFullLower)) return true;

    return false;
}

// ponytail: helper to get General EJOs visible to the current user (only own requested or assigned tickets for ordinary users/drafters, all for Lead/Admin)
function getVisibleDrawings() {
    if (!state.drawings) return [];
    if (!state.currentUser) return [];
    if (isDrafterRole(state.currentUser.role)) {
        const userFullname = state.currentUser.fullname;
        return state.drawings.filter(d => {
            if (d.engineer) {
                return d.engineer === userFullname;
            }
            if (d.ejo_id) {
                const ejo = (state.ejos || []).find(e => e.id === d.ejo_id) || (state.generalEjos || []).find(g => g.id === d.ejo_id);
                if (ejo && ejo.engineer) {
                    return ejo.engineer.split(',').map(e => e.trim()).includes(userFullname);
                }
            }
            return false;
        });
    }
    return state.drawings;
}

function getVisibleGeneralEjos() {
    if (!state.generalEjos) return [];
    if (!state.currentUser) return [];
    const isLead = isLeadRole(state.currentUser.role);
    if (isLead) return state.generalEjos;

    const userFull = (state.currentUser.fullname || '').toLowerCase().trim();
    return state.generalEjos.filter(e => {
        const isRequester = checkIsRequester(e.requester);
        const isAssigned = e.engineer && e.engineer.split(',').map(name => name.trim().toLowerCase()).includes(userFull);
        return isRequester || isAssigned;
    });
}

// filterAndRenderJobOrders yang exclude Completed/Cancelled. Pola grid/table
// di-reuse dari filterAndRenderJobOrders.
function renderGeneralEJO() {
    // ponytail: update limit badge dynamically
    if (state.currentUser) {
        const myGejosCount = (state.generalEjos || []).filter(e => {
            const isOwner = e.requester === state.currentUser.fullname || e.requester === state.currentUser.username;
            if (!isOwner) return false;
            if (e.is_archived) return false;
            const status = e.status || '';
            if (status === 'Completed' || status === 'Cancelled' || status === 'Pending Revision') return false;
            return true;
        }).length;
        const limitInfoEl = document.getElementById("gejo-limit-info");
        const limitContainerEl = document.getElementById("gejo-limit-container");
        const controlBarEl = document.querySelector("#tab-general-ejo .control-bar");

        if (isDrafterRole(state.currentUser.role)) {
            // ponytail: hide the entire EJO limit & new EJO actions block for drafter roles
            if (limitContainerEl) limitContainerEl.style.display = 'none';
            if (controlBarEl) controlBarEl.style.gridTemplateColumns = '1.5fr 2fr';
        } else {
            if (limitContainerEl) limitContainerEl.style.display = 'flex';
            if (controlBarEl) controlBarEl.style.gridTemplateColumns = '1.5fr 2fr auto';

            if (limitInfoEl) {
                const isLimited = state.currentUser.role === 'User';
                if (!isLimited) {
                    limitInfoEl.innerHTML = `<i data-lucide="shield-alert" style="width:13px; height:13px;"></i> Limit EJO: Unlimited`;
                    limitInfoEl.style.background = "rgba(6, 182, 212, 0.15)";
                    limitInfoEl.style.borderColor = "rgba(6, 182, 212, 0.3)";
                    limitInfoEl.style.color = "#22d3ee";
                    limitInfoEl.style.padding = "6px 12px";
                    limitInfoEl.style.borderRadius = "99px";
                    limitInfoEl.style.fontSize = "0.75rem";
                    limitInfoEl.style.height = "auto";
                    limitInfoEl.style.display = "inline-flex";
                    const btn = document.getElementById("gejo-btn-quick-new");
                    if (btn) btn.style.display = 'flex';
                } else {
                    const sisa = Math.max(0, 2 - myGejosCount);
                    limitInfoEl.innerHTML = `<i data-lucide="shield-alert" style="width:13px; height:13px;"></i> Limit EJO: ${myGejosCount}/2 (Sisa ${sisa})`;
                    if (sisa === 0) {
                        limitInfoEl.style.background = "rgba(244, 63, 94, 0.15)";
                        limitInfoEl.style.borderColor = "rgba(244, 63, 94, 0.3)";
                        limitInfoEl.style.color = "#f43f5e";
                        limitInfoEl.style.padding = "8px 16px";
                        limitInfoEl.style.borderRadius = "8px";
                        limitInfoEl.style.fontSize = "0.8rem";
                        limitInfoEl.style.height = "38px";
                        limitInfoEl.style.display = "inline-flex";
                        limitInfoEl.style.alignItems = "center";
                        limitInfoEl.style.justifyContent = "center";
                        const btn = document.getElementById("gejo-btn-quick-new");
                        if (btn) btn.style.display = 'none';
                    } else {
                        limitInfoEl.style.background = "rgba(6, 182, 212, 0.15)";
                        limitInfoEl.style.borderColor = "rgba(6, 182, 212, 0.3)";
                        limitInfoEl.style.color = "#22d3ee";
                        limitInfoEl.style.padding = "6px 12px";
                        limitInfoEl.style.borderRadius = "99px";
                        limitInfoEl.style.fontSize = "0.75rem";
                        limitInfoEl.style.height = "auto";
                        limitInfoEl.style.display = "inline-flex";
                        const btn = document.getElementById("gejo-btn-quick-new");
                        if (btn) btn.style.display = 'flex';
                    }
                }
            }
        }
    }
    const searchVal = document.getElementById("gejo-search-input").value.toLowerCase();
    const statusVal = document.getElementById("gejo-filter-status").value;
    const priorityVal = document.getElementById("gejo-filter-priority").value;
    const deptVal = document.getElementById("gejo-filter-dept").value;
    const categoryVal = document.getElementById("gejo-filter-category").value; // ponytail: filter kategori teknik

    // ponytail: General EJO pakai DB terpisah (state.generalEjos) filtered by user role visibility
    const filtered = getVisibleGeneralEjos().filter(e => {
        // ponytail: exclude archived from active board unless we are explicitly in the Archive phase/submenu
        const isArchived = e.is_archived === 1 || e.is_archived === '1';
        if (isArchived && state.activeGeneralEjoPhase !== 4) return false;

        const matchesSearch = (e.id || '').toLowerCase().includes(searchVal) ||
            (e.title || '').toLowerCase().includes(searchVal) ||
            (e.location || '').toLowerCase().includes(searchVal) ||
            (e.engineer || '').toLowerCase().includes(searchVal);

        // ponytail: filter by phase (Fase 1: Schedule, Fase 2: On Progress, Fase 3: Done, Fase 4: Archive)
        let matchesPhase = true;
        if (state.activeGeneralEjoPhase === 1) {
            matchesPhase = e.status === 'Requested' || e.status === 'Approved' || e.status.startsWith('Checking') || e.status === 'Pending Revision' || (e.status.startsWith('In Progress') && e.status.includes('(Revisi'));
        } else if (state.activeGeneralEjoPhase === 2) {
            matchesPhase = (e.status.startsWith('In Progress') && !e.status.includes('(Revisi')) || (e.status.startsWith('Pending') && e.status !== 'Pending Revision');
        } else if (state.activeGeneralEjoPhase === 3) {
            matchesPhase = (e.status === 'Completed' && e.is_archived !== 1 && e.is_archived !== '1');
        } else if (state.activeGeneralEjoPhase === 4) {
            matchesPhase = e.status === 'Cancelled' || e.is_archived === 1 || e.is_archived === '1';
        }

        const matchesStatus = statusVal === 'all' ||
            (statusVal === 'Pending My Approval' && isApprovalPendingForCurrentUser(e)) ||
            e.status === statusVal ||
            (statusVal === 'In Progress' && (e.status.startsWith('In Progress') || (e.status.startsWith('Pending') && e.status !== 'Pending Revision') || e.status.startsWith('Waiting'))) ||
            (statusVal === 'Checking' && (e.status === 'Approved' || e.status.startsWith('Checking'))) ||
            (statusVal === 'Pending Approval' && e.status.startsWith('Pending') && e.status !== 'Pending Revision');
        const matchesPriority = priorityVal === 'all' || e.priority === priorityVal;
        const matchesDept = departmentMatchesFilter(e.dept, deptVal);
        const matchesCategory = categoryVal === 'all' || e.category === categoryVal; // ponytail: filter kategori

        return matchesSearch && matchesPhase && matchesStatus && matchesPriority && matchesDept && matchesCategory;
    });

    // ponytail: sort general EJOs by the latest activity date in logs (or createdDate fallback) in descending order (newest first)
    filtered.sort((a, b) => {
        const getLatestTime = (item) => {
            let latest = item.createdDate || "";
            if (item.logs && Array.isArray(item.logs)) {
                for (const log of item.logs) {
                    if (log.date && log.date > latest) {
                        latest = log.date;
                    }
                }
            }
            return latest;
        };
        const timeA = getLatestTime(a);
        const timeB = getLatestTime(b);
        if (timeA < timeB) return 1;
        if (timeA > timeB) return -1;
        return b.id.localeCompare(a.id); // fallback to ID descending
    });

    document.getElementById("gejo-results-count").textContent = `Ditemukan ${filtered.length} Job Order`;

    // ponytail: show view toggles always on General EJO for all roles
    const gejoToggles = document.querySelector("#tab-general-ejo .view-toggles");
    if (gejoToggles) {
        gejoToggles.style.display = 'flex';
    }

    const gridContainer = document.getElementById("gejo-kanban-board");
    const tableWrapper = document.getElementById("gejo-table-wrapper");
    const emptyState = document.getElementById("gejo-empty-state");

    if (filtered.length === 0) {
        if (gridContainer) gridContainer.style.display = 'none';
        tableWrapper.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        const gridBtn = document.getElementById("gejo-view-grid-btn");
        const tableBtn = document.getElementById("gejo-view-table-btn");
        if (state.viewMode === 'table') {
            if (gridContainer) gridContainer.style.display = 'none';
            tableWrapper.style.display = 'block';
            if (gridBtn) gridBtn.classList.remove("active");
            if (tableBtn) tableBtn.classList.add("active");
        } else {
            if (gridContainer) gridContainer.style.display = 'grid';
            tableWrapper.style.display = 'none';
            if (gridBtn) gridBtn.classList.add("active");
            if (tableBtn) tableBtn.classList.remove("active");
        }

        // ponytail: render Kanban board view
        const container1 = document.getElementById("gejo-container-fase1");
        const container2 = document.getElementById("gejo-container-fase2");
        const container3 = document.getElementById("gejo-container-fase3");
        const container4 = document.getElementById("gejo-container-fase4");
        if (container1) container1.innerHTML = "";
        if (container2) container2.innerHTML = "";
        if (container3) container3.innerHTML = "";
        if (container4) container4.innerHTML = "";

        let count1 = 0, count2 = 0, count3 = 0, count4 = 0;
        const shouldLimitPreviewCards = state.activeGeneralEjoPhase === null;
        const previewLimit = 3;
        let hiddenScheduleCount = 0;
        let hiddenProgressCount = 0;
        let hiddenDoneCount = 0;

        filtered.forEach(e => {
            const engObj = engineersList.find(eng => eng.name === e.engineer) || { avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80', skill: 'Admin' };

            const cardHtml = `
                <div class="job-card card-glass glow-${e.priority === 'Emergency' ? 'rose' : (e.priority === 'High' ? 'yellow' : 'blue')}" style="margin: 0; width: 100%; box-sizing: border-box;">
                    <div>
                        <div class="job-card-top">
                            <span class="ejo-id-badge">${e.id}</span>
                            <div class="priority-dot">
                                <span class="p-dot p-dot-${e.priority.toLowerCase()}"></span>
                                <span class="text-xs" style="color: ${getPriorityColor(e.priority)};">${e.priority}</span>
                            </div>
                        </div>
                        <h4 class="job-card-title" onclick="openEJODetails('${e.id}')">${e.title}</h4>
                        <p class="text-muted text-xs" style="margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><i data-lucide="map-pin" style="width:10px;height:10px;display:inline;"></i> ${e.location}</p>
                    </div>

                    <div class="job-card-mid">
                        <div class="job-card-meta" style="grid-template-columns: 1fr; gap: 4px;">
                            <div><i data-lucide="building"></i> <span>Departemen: ${e.dept}</span></div>
                            <div><i data-lucide="calendar"></i> <span>Target Selesai: ${formatDisplayDate(e.targetDate)}</span></div>
                            ${e.estDate ? `<div><i data-lucide="calendar-check" style="color: var(--color-green);"></i> <span style="color: var(--color-green); font-weight: 500;">Est. Selesai: ${formatDisplayDate(e.estDate)}</span></div>` : ''}
                        </div>
                    </div>

                    <div class="job-card-bottom" style="margin-bottom: 12px; display: flex; flex-direction: column; align-items: stretch; gap: 8px;">
                        <div class="engineer-badge">
                            <img src="${engObj.avatar}" alt="${e.engineer}">
                            <span>${e.engineer}</span>
                        </div>
                        <div style="display: flex; justify-content: flex-end; width: 100%;">
                            <span class="badge-status status-${getStatusClass(e.status)}" style="text-align: right;">${getFriendlyStatusText(e.status, e)}</span>
                        </div>
                    </div>

                    <div class="project-card-actions">
                        ${getGeneralEjoCardActions(e)}
                    </div>
                </div>
            `;

            const isArchived = e.is_archived === 1 || e.is_archived === '1';
            if (e.status === 'Cancelled' || isArchived) {
                if (container4) container4.insertAdjacentHTML('beforeend', cardHtml);
                count4++;
            } else if (e.status === 'Requested' || e.status === 'Approved' || e.status.startsWith('Checking') || e.status === 'Pending Revision' || (e.status.startsWith('In Progress') && e.status.includes('(Revisi'))) {
                if (container1 && (!shouldLimitPreviewCards || count1 < previewLimit)) {
                    container1.insertAdjacentHTML('beforeend', cardHtml);
                } else if (shouldLimitPreviewCards) {
                    hiddenScheduleCount++;
                }
                count1++;
            } else if ((e.status.startsWith('In Progress') && !e.status.includes('(Revisi')) || (e.status.startsWith('Pending') && e.status !== 'Pending Revision')) {
                if (container2 && (!shouldLimitPreviewCards || count2 < previewLimit)) {
                    container2.insertAdjacentHTML('beforeend', cardHtml);
                } else if (shouldLimitPreviewCards) {
                    hiddenProgressCount++;
                }
                count2++;
            } else if (e.status === 'Completed') {
                if (container3 && (!shouldLimitPreviewCards || count3 < previewLimit)) {
                    container3.insertAdjacentHTML('beforeend', cardHtml);
                } else if (shouldLimitPreviewCards) {
                    hiddenDoneCount++;
                }
                count3++;
            }
        });

        if (document.getElementById("gejo-count-fase1")) document.getElementById("gejo-count-fase1").textContent = count1;
        if (document.getElementById("gejo-count-fase2")) document.getElementById("gejo-count-fase2").textContent = count2;
        if (document.getElementById("gejo-outstanding-total")) document.getElementById("gejo-outstanding-total").textContent = count1 + count2;
        if (document.getElementById("gejo-count-fase3")) document.getElementById("gejo-count-fase3").textContent = count3;
        if (document.getElementById("gejo-count-fase4")) document.getElementById("gejo-count-fase4").textContent = count4;

        if (container1 && shouldLimitPreviewCards && hiddenScheduleCount > 0) {
            container1.insertAdjacentHTML('beforeend', `
                <button
                    class="btn btn-outline btn-xs"
                    style="width: 100%; justify-content: center; margin-top: 0.75rem;"
                    onclick="openGeneralEjoScheduleFromOverview()"
                >
                    Lihat ${hiddenScheduleCount} Lainnya
                </button>
            `);
        }

        if (container2 && shouldLimitPreviewCards && hiddenProgressCount > 0) {
            container2.insertAdjacentHTML('beforeend', `
                <button
                    class="btn btn-outline btn-xs"
                    style="width: 100%; justify-content: center; margin-top: 0.75rem;"
                    onclick="openGeneralEjoPhaseFromOverview(2)"
                >
                    Lihat ${hiddenProgressCount} Lainnya
                </button>
            `);
        }

        if (container3 && shouldLimitPreviewCards && hiddenDoneCount > 0) {
            container3.insertAdjacentHTML('beforeend', `
                <button
                    class="btn btn-outline btn-xs"
                    style="width: 100%; justify-content: center; margin-top: 0.75rem;"
                    onclick="openGeneralEjoPhaseFromOverview(3)"
                >
                    Lihat ${hiddenDoneCount} Lainnya
                </button>
            `);
        }

        // ponytail: apply General EJO phase column visibility
        filterGeneralEjosByPhase();

        // ponytail: table view — reuse baris yang sama dengan job-orders
        const tableBody = document.getElementById("gejo-table-body");
        tableBody.innerHTML = filtered.map(e => `
            <tr>
                <td data-label="ID EJO"><span class="ejo-id-badge">${e.id}</span></td>
                <td data-label="Deskripsi">
                    <div class="table-title" onclick="openEJODetails('${e.id}')">${e.title}</div>
                    <div class="text-muted text-xs"><i data-lucide="map-pin" style="width: 10px; height: 10px; display:inline;"></i> ${e.location}</div>
                </td>
                <td data-label="Departemen">${e.dept}</td>
                <td data-label="Prioritas"><span class="text-xs" style="font-weight:700; color: ${getPriorityColor(e.priority)};">${e.priority}</span></td>
                <td data-label="Engineer">${e.engineer}</td>
                <td data-label="Target">${formatDisplayDate(e.targetDate)}</td>
                <td data-label="Status"><span class="badge-status status-${getStatusClass(e.status)}">${getFriendlyStatusText(e.status, e)}</span></td>
                <td data-label="Aksi" style="text-align: right;">
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="openEJODetails('${e.id}')">
                        <i data-lucide="external-link" style="width: 12px; height:12px;"></i> Detail
                    </button>
                </td>
            </tr>
        `).join('');
    }

    lucide.createIcons();
}

// ponytail: shows only the columns/cards for the selected general EJO phase, or all if null
function filterGeneralEjosByPhase() {
    const col1 = document.getElementById("gejo-col-fase1");
    const col2 = document.getElementById("gejo-col-fase2");
    const col3 = document.getElementById("gejo-col-fase3");
    const col4 = document.getElementById("gejo-col-fase4");
    const board = document.getElementById("gejo-kanban-board");
    const outstandingGroup = document.getElementById("gejo-outstanding-group");

    if (!col1 || !col2 || !col3 || !col4 || !board) return;

    if (state.activeGeneralEjoPhase === 1) {
        col1.style.display = "flex";
        col2.style.display = "none";
        col3.style.display = "none";
        col4.style.display = "none";
        board.classList.add("single-phase");
        if (outstandingGroup) {
            outstandingGroup.style.display = "flex";
            outstandingGroup.classList.add("single-column");
        }
    } else if (state.activeGeneralEjoPhase === 2) {
        col1.style.display = "none";
        col2.style.display = "flex";
        col3.style.display = "none";
        col4.style.display = "none";
        board.classList.add("single-phase");
        if (outstandingGroup) {
            outstandingGroup.style.display = "flex";
            outstandingGroup.classList.add("single-column");
        }
    } else if (state.activeGeneralEjoPhase === 3) {
        col1.style.display = "none";
        col2.style.display = "none";
        col3.style.display = "flex";
        col4.style.display = "none";
        board.classList.add("single-phase");
        if (outstandingGroup) {
            outstandingGroup.style.display = "none";
        }
    } else if (state.activeGeneralEjoPhase === 4) {
        col1.style.display = "none";
        col2.style.display = "none";
        col3.style.display = "none";
        col4.style.display = "flex";
        board.classList.add("single-phase");
        if (outstandingGroup) {
            outstandingGroup.style.display = "none";
        }
    } else {
        col1.style.display = "flex";
        col2.style.display = "flex";
        col3.style.display = "flex";
        col4.style.display = "none";
        board.classList.remove("single-phase");
        if (outstandingGroup) {
            outstandingGroup.style.display = "flex";
            outstandingGroup.classList.remove("single-column");
        }
    }
}

// ponytail: drawing gallery rendering using Kanban Board style columns (Schedule, On Progress, Done) synced with associated EJO phase
function renderDrawings() {
    // ponytail: update limit badge dynamically
    if (state.currentUser) {
        const myDrawingsCount = (state.drawings || []).filter(d => {
            const isOwner = d.uploader === state.currentUser.fullname || d.uploader === state.currentUser.username ||
                d.requester === state.currentUser.fullname || d.requester === state.currentUser.username;
            if (!isOwner) return false;
            if (d.is_archived) return false;
            const status = d.status || '';
            if (status === 'Completed' || status === 'Cancelled' || status === 'Archived' || status === 'Rejected') return false;
            return true;
        }).length;
        // ponytail: hide drawing limits and forms for drafters (who cannot request drawings) and adjust control bar grid columns dynamically
        const limitInfoEl = document.getElementById("drawing-limit-info");
        const actionsContainerEl = document.getElementById("drawing-actions-container");
        const controlBarEl = document.getElementById("drawing-control-bar");

        const btnRequest = document.getElementById("btn-toggle-drawing-form");
        const btnImport = document.getElementById("btn-toggle-import-drawing");

        if (isDrafterRole(state.currentUser.role)) {
            if (limitInfoEl) limitInfoEl.style.display = 'none';
            if (btnRequest) btnRequest.style.display = 'none';
            if (btnImport) btnImport.style.display = 'none';
            if (actionsContainerEl) actionsContainerEl.style.display = 'none';
            if (controlBarEl) controlBarEl.style.gridTemplateColumns = '1fr 2fr';
        } else {
            if (actionsContainerEl) actionsContainerEl.style.display = 'flex';
            if (controlBarEl) controlBarEl.style.gridTemplateColumns = '1.5fr 2fr auto';

            if (limitInfoEl) {
                const isLimited = state.currentUser.role === 'User';
                if (!isLimited) {
                    limitInfoEl.innerHTML = `<i data-lucide="shield-alert" style="width:13px; height:13px;"></i> Limit Drawing: Unlimited`;
                    limitInfoEl.style.background = "rgba(6, 182, 212, 0.15)";
                    limitInfoEl.style.borderColor = "rgba(6, 182, 212, 0.3)";
                    limitInfoEl.style.color = "#22d3ee";
                    limitInfoEl.style.padding = "6px 12px";
                    limitInfoEl.style.borderRadius = "99px";
                    limitInfoEl.style.fontSize = "0.75rem";
                    limitInfoEl.style.height = "auto";
                    limitInfoEl.style.display = "inline-flex";
                    if (btnRequest) btnRequest.style.display = 'inline-flex';
                    if (btnImport) btnImport.style.display = 'inline-flex';
                } else {
                    const sisa = Math.max(0, 2 - myDrawingsCount);
                    limitInfoEl.innerHTML = `<i data-lucide="shield-alert" style="width:13px; height:13px;"></i> Limit Drawing: ${myDrawingsCount}/2 (Sisa ${sisa})`;
                    if (sisa === 0) {
                        limitInfoEl.style.background = "rgba(244, 63, 94, 0.15)";
                        limitInfoEl.style.borderColor = "rgba(244, 63, 94, 0.3)";
                        limitInfoEl.style.color = "#f43f5e";
                        limitInfoEl.style.padding = "8px 16px";
                        limitInfoEl.style.borderRadius = "8px";
                        limitInfoEl.style.fontSize = "0.8rem";
                        limitInfoEl.style.height = "38px";
                        limitInfoEl.style.display = "inline-flex";
                        limitInfoEl.style.alignItems = "center";
                        limitInfoEl.style.justifyContent = "center";
                        if (btnRequest) btnRequest.style.display = 'none';
                        if (btnImport) btnImport.style.display = 'none';
                    } else {
                        limitInfoEl.style.background = "rgba(6, 182, 212, 0.15)";
                        limitInfoEl.style.borderColor = "rgba(6, 182, 212, 0.3)";
                        limitInfoEl.style.color = "#22d3ee";
                        limitInfoEl.style.padding = "6px 12px";
                        limitInfoEl.style.borderRadius = "99px";
                        limitInfoEl.style.fontSize = "0.75rem";
                        limitInfoEl.style.height = "auto";
                        limitInfoEl.style.display = "inline-flex";
                        if (btnRequest) btnRequest.style.display = 'inline-flex';
                        if (btnImport) btnImport.style.display = 'inline-flex';
                    }
                }
            }
        }
    }
    const board = document.getElementById("drawing-kanban-board");
    const emptyState = document.getElementById("drawing-empty-state");
    const historyTableContainer = document.getElementById("drawing-history-table-container");
    const uploadBtn = document.getElementById("btn-toggle-drawing-form");
    const importBtn = document.getElementById("btn-toggle-import-drawing");

    // ponytail: use getVisibleDrawings() so that drafter users only see drawings assigned to them
    let drawings = getVisibleDrawings();

    // ponytail: both imported drawings (hasFile = true) and requested drawings (hasFile = false) with Pending Foreman Approval go to Schedule (Phase 1)
    const getDrawingPhase = (d) => {
        const status = d.status || 'Pending Foreman Approval';
        const hasFile = !!d.file_path;
        if (status === 'Archived' || status === 'Cancelled' || status === 'Rejected') {
            return 4;
        } else if (status === 'Completed') {
            return 3;
        } else if (status === 'On Progress' || status === 'Pending Supervisor Approval' || status === 'Pending Manager Approval' || status === 'Pending Requester Approval') {
            return 2;
        } else if (status === 'Checking') {
            return 1;
        } else if (status === 'Pending Foreman Approval') {
            return hasFile ? 2 : 1;
        }
        return 1;
    };

    // ponytail: show history table if activeDrawingPhase is 'history'
    if (state.activeDrawingPhase === 'history') {
        if (board) board.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
        if (uploadBtn) uploadBtn.style.display = 'none';
        if (importBtn) importBtn.style.display = 'none';
        const formContainer = document.getElementById("drawing-form-container");
        if (formContainer) formContainer.style.display = 'none';

        if (historyTableContainer) historyTableContainer.style.display = 'block';

        let completedDrawings = drawings.filter(d => d.status === 'Completed');

        // Populate uploader select options dynamically based on completed drawings
        const uploaderSelect = document.getElementById("drawing-history-filter-uploader");
        if (uploaderSelect) {
            const uploaders = [...new Set(completedDrawings.map(d => d.uploader).filter(Boolean))];
            if (uploaderSelect.options.length !== uploaders.length + 1) {
                const currentValue = uploaderSelect.value;
                uploaderSelect.innerHTML = `<option value="all">Semua Uploader</option>` +
                    uploaders.map(u => `<option value="${u}">${u}</option>`).join('');
                if (uploaders.includes(currentValue)) {
                    uploaderSelect.value = currentValue;
                } else {
                    uploaderSelect.value = 'all';
                }
            }
        }

        // Apply search query filter
        const searchInput = document.getElementById("drawing-history-search");
        const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";
        if (searchQuery) {
            completedDrawings = completedDrawings.filter(d =>
                (d.id && d.id.toLowerCase().includes(searchQuery)) ||
                (d.title && d.title.toLowerCase().includes(searchQuery)) ||
                (d.uploader && d.uploader.toLowerCase().includes(searchQuery)) ||
                (d.ejo_id && d.ejo_id.toLowerCase().includes(searchQuery))
            );
        }

        // Apply uploader filter
        const selectedUploader = uploaderSelect ? uploaderSelect.value : "all";
        if (selectedUploader !== "all") {
            completedDrawings = completedDrawings.filter(d => d.uploader === selectedUploader);
        }

        const tbody = document.getElementById("drawing-history-table-body");
        if (tbody) {
            if (completedDrawings.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 2rem; color: var(--text-secondary);">Tidak ada drawing yang sesuai filter.</td></tr>`;
            } else {
                tbody.innerHTML = completedDrawings.map(d => `
                    <tr>
                        <td><span class="ejo-id-badge" style="cursor: pointer;" onclick="openDrawingDetails('${d.id}')">${d.id}</span></td>
                        <td style="font-weight: 600; color: var(--text-primary); cursor: pointer;" onclick="openDrawingDetails('${d.id}')">${d.title}</td>
                        <td>${d.uploader || '-'}</td>
                        <td>${d.uploaded_at || '-'}</td>
                        <td><span class="badge-status status-completed">${d.status}</span></td>
                        <td style="text-align: right;">
                            <button class="btn btn-outline btn-xs" onclick="openDrawingDetails('${d.id}')" style="padding: 4px 8px; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px;">
                                <i data-lucide="eye" style="width: 12px; height: 12px;"></i> Detail
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        }
        lucide.createIcons();
        return;
    }

    // Standard Kanban Board View
    if (historyTableContainer) historyTableContainer.style.display = 'none';
    if (uploadBtn) {
        if (state.currentUser && isDrafterRole(state.currentUser.role)) {
            uploadBtn.style.display = 'none';
        } else {
            uploadBtn.style.display = checkDrawingLimit() ? 'none' : 'inline-flex';
        }
    }
    if (importBtn) {
        if (state.currentUser && isDrafterRole(state.currentUser.role)) {
            importBtn.style.display = 'none';
        } else {
            importBtn.style.display = checkDrawingLimit() ? 'none' : 'inline-flex';
        }
    }

    if (state.activeDrawingPhase) {
        drawings = drawings.filter(d => getDrawingPhase(d) === state.activeDrawingPhase);
    }

    // ponytail: apply filter dropdowns to drawing Kanban view
    const categoryVal = document.getElementById("drawing-filter-category")?.value || 'all';
    const priorityVal = document.getElementById("drawing-filter-priority")?.value || 'all';
    const deptVal = document.getElementById("drawing-filter-dept")?.value || 'all';
    const statusVal = document.getElementById("drawing-filter-status")?.value || 'all';
    if (categoryVal !== 'all') drawings = drawings.filter(d => d.category === categoryVal);
    if (priorityVal !== 'all') drawings = drawings.filter(d => d.priority === priorityVal);
    if (deptVal !== 'all') drawings = drawings.filter(d => departmentMatchesFilter(d.dept, deptVal));
    if (statusVal !== 'all') drawings = drawings.filter(d => d.status === statusVal);

    // ponytail: update results count
    const resultsCount = document.getElementById("drawing-results-count");
    if (resultsCount) resultsCount.textContent = `Ditemukan ${drawings.length} Drawing`;

    if (!drawings.length) {
        if (board) board.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
        lucide.createIcons();
        return;
    }

    if (board) board.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    const container1 = document.getElementById("drawing-container-phase1");
    const container2 = document.getElementById("drawing-container-phase2");
    const container3 = document.getElementById("drawing-container-phase3");
    const container4 = document.getElementById("drawing-container-phase4");

    if (container1) container1.innerHTML = "";
    if (container2) container2.innerHTML = "";
    if (container3) container3.innerHTML = "";
    if (container4) container4.innerHTML = "";

    let count1 = 0, count2 = 0, count3 = 0, count4 = 0;

    drawings.forEach(d => {
        const isPdf = (d.file_path || '').toLowerCase().endsWith('.pdf');
        const isDwg = (d.file_path || '').toLowerCase().endsWith('.dwg');
        let previewHtml = '';
        if (!d.file_path) {
            previewHtml = `
                <div style="height: 140px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px dashed var(--card-border); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
                    <i data-lucide="image-off" style="width: 32px; height: 32px; color: var(--text-muted);"></i>
                    <span class="text-muted text-xs" style="font-style: italic;">Belum ada file drawing</span>
                </div>
            `;
        } else if (isPdf) {
            previewHtml = `
                <div style="height: 140px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid var(--card-border); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
                    <i data-lucide="file-text" style="width: 36px; height: 36px; color: var(--color-cyan);"></i>
                    <span class="text-secondary text-xs">Preview PDF</span>
                </div>
            `;
        } else if (isDwg) {
            previewHtml = `
                <div style="height: 140px; border-radius: 10px; background: rgba(2, 132, 199, 0.05); border: 1px solid var(--card-border); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
                    <i data-lucide="pen-tool" style="width: 36px; height: 36px; color: var(--color-blue);"></i>
                    <span class="text-secondary text-xs" style="color: var(--color-blue);">CAD Drawing (DWG)</span>
                </div>
            `;
        } else {
            previewHtml = `
                <img src="${d.file_path}" alt="${d.title}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 10px; border: 1px solid var(--card-border);">
            `;
        }

        const statusClass = `status-${getStatusClass(d.status)}`;

        const cardHtml = `
            <div class="job-card card-glass" onclick="openDrawingDetails('${d.id}')" style="margin: 0; width: 100%; box-sizing: border-box; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; cursor: pointer;">
                <div>
                    ${previewHtml}
                </div>
                <div class="job-card-top" style="margin-top: 0.25rem; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                    <span class="ejo-id-badge">${d.id}</span>
                    <span class="badge-status ${statusClass}" style="font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 150px;" title="Status Drawing">${d.status}</span>
                </div>
                <div class="job-card-title" style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary); margin: 0; line-height: 1.3;">
                    ${d.title}
                </div>
                <div class="job-card-mid" style="font-size: 0.75rem; display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; align-items: center; gap: 6px; color: var(--text-secondary);">
                        <i data-lucide="user" style="width: 12px; height: 12px;"></i>
                        <span>Uploader: ${d.uploader || '-'}</span>
                    </div>
                    ${d.engineer && d.engineer !== 'Unassigned' ? `
                    <div style="display: flex; align-items: center; gap: 6px; color: var(--text-secondary);">
                        <i data-lucide="user-check" style="width: 12px; height: 12px; color: var(--color-cyan);"></i>
                        <span>Drafter: <strong>${d.engineer}</strong></span>
                    </div>
                    ` : ''}
                    <div style="display: flex; align-items: center; gap: 6px; color: var(--text-secondary);">
                        <i data-lucide="clock-3" style="width: 12px; height: 12px;"></i>
                        <span>Upload: ${d.uploaded_at || '-'}</span>
                    </div>
                    ${d.targetDate ? `<div style="display: flex; align-items: center; gap: 6px; color: var(--color-cyan); font-weight: 500;"><i data-lucide="calendar" style="width: 12px; height: 12px;"></i><span>Target: ${formatDisplayDate(d.targetDate)}</span></div>` : ''}
                    <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                        <i data-lucide="info" style="width: 12px; height: 12px; color: var(--color-yellow);"></i>
                        <span style="color: var(--text-secondary);">Status: <span class="badge-status ${statusClass}" style="padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; display: inline-block;">${getFriendlyStatusText(d.status)}</span></span>
                    </div>
                </div>
                <div class="project-card-actions" style="margin-top: 0.25rem; display: flex; justify-content: flex-end; gap: 6px;">
                    ${getDrawingCardActions(d)}
                </div>
            </div>
        `;

        const phase = getDrawingPhase(d);
        if (phase === 1) {
            if (container1) container1.innerHTML += cardHtml;
            count1++;
        } else if (phase === 2) {
            if (container2) container2.innerHTML += cardHtml;
            count2++;
        } else if (phase === 3) {
            if (container3) container3.innerHTML += cardHtml;
            count3++;
        } else if (phase === 4) {
            if (container4) container4.innerHTML += cardHtml;
            count4++;
        }
    });

    const countEl1 = document.getElementById("drawing-count-phase1");
    const countEl2 = document.getElementById("drawing-count-phase2");
    const countEl3 = document.getElementById("drawing-count-phase3");
    const countEl4 = document.getElementById("drawing-count-phase4");

    if (countEl1) countEl1.textContent = count1;
    if (countEl2) countEl2.textContent = count2;
    if (countEl3) countEl3.textContent = count3;
    if (countEl4) countEl4.textContent = count4;

    const col1 = document.getElementById("drawing-col-phase1");
    const col2 = document.getElementById("drawing-col-phase2");
    const col3 = document.getElementById("drawing-col-phase3");
    const col4 = document.getElementById("drawing-col-phase4");

    if (col1 && col2 && col3 && col4) {
        if (state.activeDrawingPhase === 1) {
            col1.style.display = "flex";
            col2.style.display = "none";
            col3.style.display = "none";
            col4.style.display = "none";
            board.classList.add("single-phase");
        } else if (state.activeDrawingPhase === 2) {
            col1.style.display = "none";
            col2.style.display = "flex";
            col3.style.display = "none";
            col4.style.display = "none";
            board.classList.add("single-phase");
        } else if (state.activeDrawingPhase === 3) {
            col1.style.display = "none";
            col2.style.display = "none";
            col3.style.display = "flex";
            col4.style.display = "none";
            board.classList.add("single-phase");
        } else if (state.activeDrawingPhase === 4) {
            col1.style.display = "none";
            col2.style.display = "none";
            col3.style.display = "none";
            col4.style.display = "flex";
            board.classList.add("single-phase");
        } else {
            col1.style.display = "flex";
            col2.style.display = "flex";
            col3.style.display = "flex";
            col4.style.display = "none";
            board.classList.remove("single-phase");
        }
    }

    lucide.createIcons();
}

// ponytail: reset filter General EJO (dipanggil dari tombol empty state)
function resetGeneralEJOFilters() {
    document.getElementById("gejo-search-input").value = '';
    document.getElementById("gejo-filter-status").value = 'all';
    document.getElementById("gejo-filter-priority").value = 'all';
    document.getElementById("gejo-filter-dept").value = 'all';
    document.getElementById("gejo-filter-category").value = 'all'; // ponytail: reset kategori juga
    renderGeneralEJO();
}

function renderHistory() {
    const tbody = document.getElementById('history-table-body');
    const historyEjos = (state.ejos || []).filter(e => e.status === 'Completed' || e.status === 'Cancelled')
        .concat(getVisibleGeneralEjos().filter(e => e.is_archived === 1 || e.is_archived === '1' || e.status === 'Archived'))
        .concat(getVisibleDrawings().filter(d => d.status === 'Archived' || d.status === 'Cancelled' || d.status === 'Rejected'))
        .concat((state.projects || []).filter(p => p.phase === 4 || p.phase === 'archive'));

    // ponytail: Show/hide action header and render delete button if user is Lead and NOT restricted
    const isLead = state.currentUser && (isLeadRole(state.currentUser.role));
    const isRestrictedRole = state.currentUser && ['Foreman', 'Supervisor', 'Manager', 'Plant Manager'].includes(state.currentUser.role);
    const showDeleteAction = isLead && !isRestrictedRole;
    const actionHeader = document.getElementById('history-header-action');
    if (actionHeader) {
        actionHeader.style.display = showDeleteAction ? 'table-cell' : 'none';
    }

    if (historyEjos.length === 0) {
        const cols = showDeleteAction ? 7 : 6;
        tbody.innerHTML = `<tr><td colspan="${cols}" style="text-align:center; padding:2rem; color:var(--text-muted);">Belum ada EJO yang selesai.</td></tr>`;
        return;
    }

    tbody.innerHTML = historyEjos.map(e => {
        // Get last log date as completion date
        const logs = parseLogs(e.logs);
        const lastLog = logs.length > 0 ? logs[logs.length - 1].date : (e.targetDate || '-');
        const actionCell = showDeleteAction
            ? `<td data-label="Aksi" style="text-align: right;"><button class="btn btn-danger-outline btn-xs" onclick="deleteHistoryEJO('${e.id}')"><i data-lucide="trash-2" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:2px;"></i> Hapus</button></td>`
            : '';
        const clickAction = e.id.startsWith('DRW') ? `openDrawingDetails('${e.id}')` : (e.id.startsWith('PRJ') ? `openProjectDetails(null, '${e.id}')` : `openEJODetails('${e.id}')`);
        const statusText = e.status || (e.phase === 4 ? 'Archived' : 'Active');
        return `
            <tr>
                <td data-label="ID"><span class="ejo-id-badge">${e.id}</span></td>
                <td data-label="Judul Pekerjaan"><div class="table-title" style="cursor:pointer;" onclick="${clickAction}">${e.title}</div></td>
                <td data-label="Departemen">${e.dept}</td>
                <td data-label="Engineer">${e.engineer || e.pic || '-'}</td>
                <td data-label="Status"><span class="badge-status status-${getStatusClass(statusText)}">${getFriendlyStatusText(statusText, e)}</span></td>
                <td data-label="Tanggal Selesai">${lastLog}</td>
                ${actionCell}
            </tr>
        `;
    }).join('');

    if (isLead) {
        lucide.createIcons();
    }
}

// ponytail: removed renderEngineersView as part of YAGNI for the removed engineers tab feature

// ==========================================
// Chart JS Configurations
// ==========================================
function renderOverviewCharts() {
    // 1. Line Chart: Monthly Trend — ponytail: aggregate real EJO data by targetDate month
    const ctxTrend = document.getElementById('trendChart').getContext('2d');
    if (state.charts.trend) state.charts.trend.destroy();

    const allEjos = (state.ejos || []).concat(getVisibleGeneralEjos());
    const period = state.trendPeriod || 'year';
    const filterEl = document.getElementById("trend-time-filter");
    if (filterEl) {
        filterEl.value = period;
    }
    const now = new Date();
    let sliceLabels = [];
    let sliceMasuk = [];
    let sliceSelesai = [];

    if (period === 'week') {
        // ponytail: get dates for current week (Monday to Sunday)
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            weekDates.push(`${yyyy}-${mm}-${dd}`);
        }

        const masukPerDay = new Array(7).fill(0);
        const selesaiPerDay = new Array(7).fill(0);
        allEjos.forEach(e => {
            if (e.targetDate) {
                const idx = weekDates.indexOf(e.targetDate);
                if (idx !== -1) {
                    masukPerDay[idx]++;
                    if (e.status === 'Completed') selesaiPerDay[idx]++;
                }
            }
        });
        sliceLabels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        sliceMasuk = masukPerDay;
        sliceSelesai = selesaiPerDay;
    } else if (period === 'month') {
        // ponytail: get daily trend of the current month
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        sliceLabels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
        const masukPerDay = new Array(daysInMonth).fill(0);
        const selesaiPerDay = new Array(daysInMonth).fill(0);
        allEjos.forEach(e => {
            if (e.targetDate) {
                const parts = e.targetDate.split('-');
                const y = parseInt(parts[0]);
                const m = parseInt(parts[1]) - 1;
                const d = parseInt(parts[2]);
                if (y === currentYear && m === currentMonth && d >= 1 && d <= daysInMonth) {
                    masukPerDay[d - 1]++;
                    if (e.status === 'Completed') selesaiPerDay[d - 1]++;
                }
            }
        });
        sliceMasuk = masukPerDay;
        sliceSelesai = selesaiPerDay;
    } else {
        // ponytail: default 'year' trend (monthly aggregation)
        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const masukPerMonth = new Array(12).fill(0);
        const selesaiPerMonth = new Array(12).fill(0);
        allEjos.forEach(e => {
            const m = e.targetDate ? parseInt(e.targetDate.split('-')[1]) - 1 : -1;
            if (m >= 0 && m < 12) {
                masukPerMonth[m]++;
                if (e.status === 'Completed') selesaiPerMonth[m]++;
            }
        });
        const firstMonth = Math.max(0, masukPerMonth.findIndex(v => v > 0) - 1);
        const lastMonth = Math.min(11, masukPerMonth.lastIndexOf(masukPerMonth.find((_, i, a) => a[11 - i] > 0) || 0) + 1);
        const endIdx = Math.max(lastMonth, Math.min(11, masukPerMonth.reduce((last, v, i) => v > 0 ? i : last, 0) + 1));
        sliceLabels = monthLabels.slice(firstMonth, endIdx + 1);
        sliceMasuk = masukPerMonth.slice(firstMonth, endIdx + 1);
        sliceSelesai = selesaiPerMonth.slice(firstMonth, endIdx + 1);
    }

    state.charts.trend = new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: sliceLabels,
            datasets: [
                {
                    label: 'EJO Masuk',
                    data: sliceMasuk,
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.05)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'EJO Selesai',
                    data: sliceSelesai,
                    borderColor: '#10b981',
                    backgroundColor: 'transparent',
                    tension: 0.4
                }
            ]
        },
        options: getChartBaseOptions()
    });

    // 2. Doughnut Chart: Proporsi Status EJO
    const ctxStatus = document.getElementById('statusChart').getContext('2d');
    if (state.charts.status) state.charts.status.destroy();

    const requested = allEjos.filter(e => e.status === 'Requested' || e.status === 'Approved' || e.status.startsWith('Checking')).length;
    const progress = allEjos.filter(e => e.status.startsWith('In Progress') || (e.status.startsWith('Pending') && e.status !== 'Pending Revision') || e.status.startsWith('Waiting')).length;
    const completed = allEjos.filter(e => e.status === 'Completed').length;
    const cancelled = allEjos.filter(e => e.status === 'Cancelled').length;

    state.charts.status = new Chart(ctxStatus, {
        type: 'doughnut',
        data: {
            labels: ['Schedule (Checking)', 'In Progress (Active)', 'Completed (Selesai)', 'Cancelled (Batal)'],
            datasets: [{
                data: [requested, progress, completed, cancelled],
                backgroundColor: [
                    '#38bdf8', // schedule/checking - blue/sky
                    '#06b6d4', // progress - cyan
                    '#10b981', // completed - green
                    '#f43f5e'  // cancelled - rose
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: window.innerWidth < 768 ? 'bottom' : 'right',
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'Outfit', size: 11 }
                    }
                }
            },
            cutout: '70%'
        }
    });

    // 3. Bar Chart: EJO per Departemen Pemohon
    const ctxDept = document.getElementById('deptChart').getContext('2d');
    if (state.charts.dept) state.charts.dept.destroy();

    const depts = DEPARTMENT_OPTIONS.map(opt => opt.value);
    const deptData = depts.map(dept => allEjos.filter(e => normalizeDepartmentCode(e.dept) === dept).length);

    state.charts.dept = new Chart(ctxDept, {
        type: 'bar',
        data: {
            labels: depts,
            datasets: [{
                label: 'Jumlah Permintaan',
                data: deptData,
                backgroundColor: 'rgba(56, 189, 248, 0.45)',
                borderColor: '#38bdf8',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            ...getChartBaseOptions(),
            scales: {
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', stepSize: 1 } }
            }
        }
    });
}

function getChartBaseOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255,255,255,0.03)'
                },
                ticks: {
                    color: '#94a3b8',
                    font: { family: 'Outfit' }
                }
            },
            y: {
                grid: {
                    color: 'rgba(255,255,255,0.05)'
                },
                ticks: {
                    color: '#94a3b8',
                    font: { family: 'Outfit' }
                }
            }
        }
    };
}

// ==========================================
// EJO Modal Detail Interactions
// ==========================================
function parseEjoDescription(description) {
    const parts = (description || "").split("||attachment||");
    const mainPart = parts[0] || "";
    const attachmentsJoined = parts[1] || "";
    const attachments = attachmentsJoined ? attachmentsJoined.split("||image-split||").filter(src => src.trim() !== "") : [];

    const mainParts = mainPart.split("||completion||");
    const descText = mainParts[0] || "";
    const completionReportText = mainParts[1] || "";

    return {
        descText: descText.trim(),
        completionReportText: completionReportText.trim(),
        attachments: attachments
    };
}

function buildEjoDescription(descText, completionReportText, attachments) {
    let mainPart = (descText || "").trim();
    if (completionReportText && completionReportText.trim() !== "") {
        mainPart += "||completion||" + completionReportText.trim();
    }
    const attachmentsJoined = (attachments || []).join("||image-split||");
    return mainPart + (attachmentsJoined ? "||attachment||" + attachmentsJoined : "");
}

function openEJODetails(id) {
    // ponytail: support finding EJO in both regular and general lists
    let ejo = state.ejos.find(e => e.id === id);
    if (!ejo) {
        ejo = getVisibleGeneralEjos().find(e => e.id === id);
    }
    if (!ejo) return;

    state.selectedEJO = ejo;

    // Load data fields
    document.getElementById("modal-ejo-id").textContent = ejo.id;

    const priorityBadge = document.getElementById("modal-ejo-priority");
    priorityBadge.className = 'badge';
    priorityBadge.style.backgroundColor = getPriorityColor(ejo.priority);
    priorityBadge.style.color = '#ffffff';
    priorityBadge.textContent = ejo.priority;

    document.getElementById("modal-ejo-title").textContent = ejo.title;
    document.getElementById("modal-ejo-location").textContent = ejo.location;
    document.getElementById("modal-ejo-dept").textContent = getDepartmentDisplayLabel(ejo.dept);
    document.getElementById("modal-ejo-requester").textContent = ejo.requester || "System Seeder";
    document.getElementById("modal-ejo-category").textContent = ejo.category;
    // ponytail: fallback to first log entry's date if createdDate is not present in the DB
    let createdDateVal = ejo.createdDate;
    if (!createdDateVal && ejo.logs && ejo.logs.length > 0) {
        const firstLog = ejo.logs[0];
        if (firstLog && firstLog.date) {
            createdDateVal = firstLog.date.split(' ')[0];
        }
    }
    document.getElementById("modal-ejo-created-date").textContent = formatDisplayDate(createdDateVal);
    document.getElementById("modal-ejo-target-date").textContent = formatDisplayDate(ejo.targetDate);

    const estDateField = document.getElementById("modal-ejo-est-date-field");
    const estDateVal = document.getElementById("modal-ejo-est-date");
    if (estDateField && estDateVal) {
        if (ejo.estDate) {
            estDateField.style.display = "block";
            estDateVal.textContent = formatDisplayDate(ejo.estDate);
        } else {
            estDateField.style.display = "none";
        }
    }

    // ponytail: populate and show assigned engineer in meta-fields
    const engField = document.getElementById("modal-ejo-engineer-field");
    const engVal = document.getElementById("modal-ejo-engineer");
    if (engField && engVal) {
        if (ejo.engineer && ejo.engineer.toLowerCase() !== 'unassigned') {
            engField.style.display = "flex";
            const labelEl = engField.querySelector(".meta-label");
            if (labelEl) {
                labelEl.innerHTML = `<i data-lucide="wrench" style="color: var(--color-green);"></i> Engineer (${ejo.category || "General"})`;
            }
            engVal.textContent = ejo.engineer;
        } else {
            engField.style.display = "none";
        }
    }

    const statusBadge = document.getElementById("modal-ejo-status");
    statusBadge.className = `badge badge-status status-${getStatusClass(ejo.status)}`;
    statusBadge.textContent = getFriendlyStatusText(ejo.status, ejo);

    const parsed = parseEjoDescription(ejo.description);
    document.getElementById("modal-ejo-desc").textContent = parsed.descText;

    // Show/hide completion report section in details modal
    let completionReport = parsed.completionReportText || "";

    // Fallback: if description doesn't have a completion report, scan timeline logs (for backward compatibility)
    let logsList = parseLogs(ejo);
    if (!completionReport && logsList.length > 0) {
        for (const log of logsList) {
            if (log && log.message && typeof log.message === 'string') {
                const msgText = log.cleanMessage || log.message;
                const matchCompletion = msgText.match(/Laporan Penyelesaian:\s*(.*)/);
                const matchRevision = msgText.match(/Laporan Revisi:\s*(.*)/);
                if (matchCompletion && matchCompletion[1]) {
                    completionReport = "Laporan Penyelesaian: " + matchCompletion[1].trim();
                    break;
                } else if (matchRevision && matchRevision[1]) {
                    completionReport = "Laporan Revisi: " + matchRevision[1].trim();
                    break;
                }
            }
        }
    }

    const completionReportSection = document.getElementById("modal-ejo-completion-report-section");
    const completionReportBox = document.getElementById("modal-ejo-completion-report");
    if (completionReportSection && completionReportBox) {
        if (completionReport.trim() !== "") {
            completionReportSection.style.display = "block";
            completionReportBox.textContent = completionReport;
        } else {
            completionReportSection.style.display = "none";
            completionReportBox.textContent = "";
        }
    }

    // ponytail: populate and show latest revision instruction if any
    let revisionInstruction = "";
    let revisionRoleText = "";
    if (logsList.length > 0) {
        for (let i = logsList.length - 1; i >= 0; i--) {
            const log = logsList[i];
            if (log.message) {
                const msgText = log.cleanMessage || log.message;
                // Check for "Instruksi revisi:"
                const matchInst = msgText.match(/Instruksi revisi:\s*(.*)/i);
                if (matchInst && matchInst[1]) {
                    revisionInstruction = matchInst[1].trim();
                    let matchRole = msgText.match(/Revisi DIAJUKAN oleh\s+(.*?)\.\s+Status kembali menjadi/i);
                    if (!matchRole) {
                        matchRole = msgText.match(/Revisi DIAJUKAN oleh\s+([^.]+)/i);
                    }
                    const rawRole = (matchRole && matchRole[1]) ? matchRole[1].trim() : "Lead/Admin";
                    const cleanName = rawRole.replace(/^Lead\/Admin\s*-\s*/, '').replace(/^User\/Engineer\s*-\s*/, '').trim();
                    revisionRoleText = "Revisi diajukan oleh: " + cleanName;
                    break;
                }
                // Check for "Alasan revisi:"
                const matchAlasan = msgText.match(/Alasan revisi:\s*(.*)/i);
                if (matchAlasan && matchAlasan[1]) {
                    revisionInstruction = matchAlasan[1].trim();
                    let matchRole = msgText.match(/Pengajuan REVISI diajukan oleh\s+(.*?)\.\s+Alasan/i);
                    if (!matchRole) {
                        matchRole = msgText.match(/Pengajuan REVISI diajukan oleh\s+([^.]+)/i);
                    }
                    const rawRole = (matchRole && matchRole[1]) ? matchRole[1].trim() : "User/Engineer";
                    const cleanName = rawRole.replace(/^Lead\/Admin\s*-\s*/, '').replace(/^User\/Engineer\s*-\s*/, '').trim();
                    revisionRoleText = "Revisi diajukan oleh: " + cleanName;
                    break;
                }
                // Check for "Alasan Penolakan:"
                const matchPenolakan = msgText.match(/Alasan Penolakan:\s*(.*)/i);
                if (matchPenolakan && matchPenolakan[1]) {
                    revisionInstruction = matchPenolakan[1].trim();
                    let matchRole = msgText.match(/oleh\s+(.*?)\.\s+Alasan Penolakan/i);
                    if (!matchRole) {
                        matchRole = msgText.match(/oleh\s+([^.]+)/i);
                    }
                    const rawRole = (matchRole && matchRole[1]) ? matchRole[1].trim() : "Lead/Admin";
                    const cleanName = rawRole.replace(/^Lead\/Admin\s*-\s*/, '').replace(/^User\/Engineer\s*-\s*/, '').trim();
                    revisionRoleText = "Ditolak oleh: " + cleanName;
                    break;
                }
            }
        }
    }

    const revisionSection = document.getElementById("modal-ejo-revision-instruction-section");
    const revisionBox = document.getElementById("modal-ejo-revision-instruction");
    const revisionRoleSpan = document.getElementById("modal-ejo-revision-role");
    if (revisionSection && revisionBox) {
        if (revisionInstruction.trim() !== "") {
            revisionSection.style.display = "block";
            
            // ponytail: Extract attachment from revision instruction if present
            const matchAttachment = revisionInstruction.match(/(.*)\[Attachment:\s*([^\]]+)\]/i);
            let displayText = revisionInstruction;
            let attachmentHtml = "";
            if (matchAttachment) {
                displayText = matchAttachment[1].trim();
                const attachmentUrl = matchAttachment[2].trim();
                const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(attachmentUrl);
                if (isImage) {
                    attachmentHtml = `
                        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-rose); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 4px;">
                                <i data-lucide="image" style="width: 12px; height: 12px;"></i> Lampiran Foto
                            </span>
                            <a href="${attachmentUrl}" target="_blank" style="display: block; overflow: hidden; border-radius: var(--border-radius-md); border: 1px solid rgba(244, 63, 94, 0.2); box-shadow: var(--shadow-sm); transition: all 0.2s ease-in-out;" onmouseover="this.style.transform='scale(1.02)'; this.style.borderColor='var(--color-rose)';" onmouseout="this.style.transform='scale(1)'; this.style.borderColor='rgba(244, 63, 94, 0.2)';">
                                <img src="${attachmentUrl}" style="display: block; max-width: 100%; max-height: 220px; object-fit: contain; cursor: pointer;" alt="Revision Photo"/>
                            </a>
                        </div>
                    `;
                } else {
                    attachmentHtml = `
                        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-cyan); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 4px;">
                                <i data-lucide="paperclip" style="width: 12px; height: 12px;"></i> Lampiran File
                            </span>
                            <a href="${attachmentUrl}" target="_blank" style="display: flex; align-items: center; gap: 8px; padding: 0.6rem 1rem; border-radius: var(--border-radius-sm); border: 1px solid rgba(6, 182, 212, 0.2); background: rgba(6, 182, 212, 0.05); color: var(--color-cyan); text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: all 0.2s ease-in-out;" onmouseover="this.style.background='rgba(6, 182, 212, 0.1)'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='rgba(6, 182, 212, 0.05)'; this.style.transform='translateY(0)';">
                                <i data-lucide="download" style="width: 14px; height: 14px;"></i> Download Lampiran
                            </a>
                        </div>
                    `;
                }
            }
            
            const cleanDisplayText = displayText.replace(/<img\s+/gi, '<img decoding="async" ');
            const formattedText = `<div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-primary); font-weight: 500; word-break: break-word;"><strong>Instruksi/Alasan:</strong> ${cleanDisplayText}</div>`;
            revisionBox.innerHTML = `${formattedText}${attachmentHtml}`;
            if (revisionRoleSpan) {
                revisionRoleSpan.textContent = revisionRoleText;
            }
        } else {
            revisionSection.style.display = "none";
            revisionBox.innerHTML = "";
        }
    }

    // ponytail: Populate attachment state for editing in details modal
    state.currentModalAttachments = parsed.attachments;

    // ponytail: populate dynamic assignee checkboxes
    const engineers = (ejo.engineer || 'Unassigned').split(',').map(e => e.trim());
    const isUnassigned = engineers.includes('Unassigned') || engineers.length === 0 || (engineers.length === 1 && !engineers[0]);

    const unassignedCheck = document.getElementById("assignee-unassigned");
    if (unassignedCheck) {
        unassignedCheck.checked = isUnassigned;
    }
    document.querySelectorAll(".assignee-check").forEach(cb => {
        cb.checked = !isUnassigned && engineers.includes(cb.value);
    });

    document.getElementById("modal-est-cost").value = ejo.estCost || 0;
    document.getElementById("modal-act-cost").value = ejo.actCost || 0;

    // ponytail: reset template fields on modal open
    const templateSelect = document.getElementById("modal-log-template");
    if (templateSelect) templateSelect.value = "";
    const newLogTextarea = document.getElementById("modal-new-log");
    if (newLogTextarea) newLogTextarea.value = "";

    // ponytail: Check if this is a General EJO
    const isGeneral = state.generalEjos && state.generalEjos.some(ge => ge.id === id);

    // ponytail: Hide assignment/finance and work report logs for ordinary user role and restricted roles
    const isUserRole = state.currentUser && state.currentUser.role === 'User';
    const isDrafter = state.currentUser && isDrafterRole(state.currentUser.role);
    const isLead = state.currentUser && (isLeadRole(state.currentUser.role));
    const isRestrictedRole = state.currentUser && ['Foreman', 'Supervisor', 'Manager', 'Plant Manager'].includes(state.currentUser.role);
    const isAssignedEngineer = state.currentUser && (ejo.engineer || '').split(',').map(e => e.trim()).includes(state.currentUser.fullname);
    const isRequester = checkIsRequester(ejo.requester);
    // ponytail: hide assignment, reports, and status forms for Admin role per user request
    const isAdmin = state.currentUser && state.currentUser.role === 'Admin';

    const cardAssign = document.getElementById("card-assignment-finance");
    if (cardAssign) {
        // Only Leads (Admin/Server) can see the assignment/finance card for standard EJOs, hidden for GEJOs. Hidden for Admin now.
        cardAssign.style.display = (isGeneral || isAdmin) ? 'none' : ((isLead && !isRestrictedRole) ? 'block' : 'none');
    }
    const cardReports = document.getElementById("card-work-reports");
    if (cardReports) {
        if (isGeneral || isAdmin) {
            cardReports.style.display = 'none';
        } else {
            // Hides for ordinary User (requester) role and restricted roles
            // For Drafter: hide if status is Pending Approval, Pending Requester Approval, Completed, Cancelled
            const isPendingOrDone = ejo.status === 'Pending Approval' || ejo.status === 'Pending Requester Approval' || ejo.status === 'Completed' || ejo.status === 'Cancelled';

            if (isUserRole || isRestrictedRole) {
                cardReports.style.display = 'none';
            } else if (isDrafter && isPendingOrDone) {
                cardReports.style.display = 'none';
            } else {
                cardReports.style.display = (isLead || isAssignedEngineer) ? 'block' : 'none';
            }
        }
    }

    // ponytail: Hide status update card for non-lead roles (Drafter and User) completely, and restrict restricted roles. Hidden for Admin now.
    const cardStatusUpdate = document.getElementById("card-status-update");
    if (cardStatusUpdate) {
        cardStatusUpdate.style.display = (isGeneral || isAdmin) ? 'none' : ((isLead && !isRestrictedRole) ? 'block' : 'none');
    }
    const isCheckingStatus = ejo.status === 'Approved' || ejo.status.startsWith('Checking');
    const canChangeStatus = isLead || (isAssignedEngineer && !(isDrafter && isCheckingStatus)) || (isRequester && (ejo.status === 'Pending Approval' || ejo.status === 'Pending Requester Approval'));

    const modalUnassigned = document.getElementById("assignee-unassigned");
    if (modalUnassigned) modalUnassigned.disabled = !isLead;
    document.querySelectorAll(".assignee-check").forEach(cb => {
        cb.disabled = !isLead;
    });
    document.getElementById("modal-est-cost").disabled = !isLead;

    // ponytail: actual cost can only be modified by Lead
    document.getElementById("modal-act-cost").disabled = !isLead;

    // ponytail: template and new log textarea disabled if they can't change status/report progress
    if (document.getElementById("modal-log-template")) {
        document.getElementById("modal-log-template").disabled = !canChangeStatus;
    }
    if (document.getElementById("modal-new-log")) {
        document.getElementById("modal-new-log").disabled = !canChangeStatus;
    }

    // ponytail: hide delete button for Admin role per user request
    const deleteBtn = document.getElementById("btn-delete-ejo");
    if (deleteBtn) {
        deleteBtn.style.display = (isGeneral || isAdmin) ? 'none' : ((isLead && !isRestrictedRole) ? 'block' : 'none');
    }

    // Status button group restrictions
    // ponytail: check if the EJO was completed/assigned to a Lead (Admin/Foreman)
    const assignedEngineers = (ejo.engineer || '').split(',').map(e => e.trim());
    const hasLeadEngineer = assignedEngineers.some(name => {
        const u = (state.users || []).find(user => user.fullname.toLowerCase() === name.toLowerCase());
        return u && (isLeadRole(u.role));
    }) || assignedEngineers.length === 0 || ejo.engineer === 'Unassigned';

    document.querySelectorAll(".btn-status-change").forEach(btn => {
        const btnStatus = btn.getAttribute("data-status");

        // Default disabled
        btn.disabled = true;
        btn.style.opacity = '0.4';
        btn.style.pointerEvents = 'none';

        if (!canChangeStatus) return;

        // If current status is In Progress, nobody can directly select Completed
        if (ejo.status.startsWith('In Progress') && btnStatus === 'Completed') {
            return;
        }

        // If status is Pending Approval:
        if (ejo.status === 'Pending Approval') {
            if (btnStatus === 'Completed') {
                if (hasLeadEngineer) {
                    // Must be confirmed by User (requester)
                    if (isRequester) {
                        btn.disabled = false;
                        btn.style.opacity = '1';
                        btn.style.pointerEvents = 'auto';
                    }
                } else {
                    // Normal EJO (done by ordinary engineer), approved by Foreman/Admin (Lead)
                    if (isLead) {
                        btn.disabled = false;
                        btn.style.opacity = '1';
                        btn.style.pointerEvents = 'auto';
                    }
                }
            } else if (btnStatus === 'In Progress') {
                // Anyone with status change permission can send it back to In Progress
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }
            return;
        }

        // If status is Pending Requester Approval:
        if (ejo.status === 'Pending Requester Approval') {
            if (btnStatus === 'Completed' || btnStatus === 'In Progress') {
                if (isRequester) {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                }
            }
            return;
        }

        // Standard transitions for other statuses
        if (isLead) {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        } else if (isAssignedEngineer) {
            // Assigned engineer can only transition to 'In Progress' or 'Pending Approval'
            if (btnStatus === 'In Progress' || btnStatus === 'Pending Approval') {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }
        }
    });

    // ponytail: Hide or disable Save button based on role & permissions. Hidden for Admin per user request.
    const saveBtn = document.getElementById("btn-save-modal");
    if (saveBtn) {
        if (isGeneral || isAdmin) {
            saveBtn.style.display = 'none';
        } else {
            const isUserRole = state.currentUser && state.currentUser.role === 'User';
            const isDrafter = state.currentUser && isDrafterRole(state.currentUser.role);
            if (isUserRole || isDrafter || isRestrictedRole) {
                saveBtn.style.display = 'none';
            } else {
                saveBtn.style.display = 'block';
                saveBtn.disabled = !canChangeStatus;
                saveBtn.style.opacity = canChangeStatus ? '1' : '0.5';
                saveBtn.style.pointerEvents = canChangeStatus ? 'auto' : 'none';
            }
        }
    }

    // ponytail: Show complete EJO button if EJO is In Progress and user is assignee or Lead. For General EJO, Foreman is allowed to complete too. Hidden for Admin.
    const completeBtn = document.getElementById("btn-complete-ejo");
    if (completeBtn) {
        if (isGeneral || isAdmin) {
            completeBtn.style.display = 'none';
        } else {
            const isInProgress = ejo.status.startsWith('In Progress');
            const isForeman = state.currentUser && state.currentUser.role === 'Foreman';
            const canComplete = isInProgress && (isLead || isAssignedEngineer) && (!isForeman || isGeneral);
            completeBtn.style.display = canComplete ? 'block' : 'none';
        }
    }

    // ponytail: handle EJO Revision UI states
    const revisionWrapper = document.getElementById("modal-revision-wrapper");
    const statusBtnGroup = document.getElementById("modal-status-btn-group");

    if (revisionWrapper && statusBtnGroup) {
        if (ejo.status === 'Completed' || ejo.status === 'Cancelled') {
            statusBtnGroup.style.display = 'none';
            revisionWrapper.style.display = 'flex';
            if (saveBtn) saveBtn.style.display = 'none'; // Lock saving
            if (completeBtn) completeBtn.style.display = 'none'; // Lock complete button

            const revBtn = document.getElementById("btn-request-revision");
            const revSpan = revisionWrapper.querySelector("span");

            if (ejo.status === 'Completed') {
                // ponytail: restrict General EJO revisions to max 1x
                const isGeneral = state.generalEjos && state.generalEjos.some(ge => ge.id === ejo.id);
                if (isGeneral && getCurrentRevisionCount(ejo) >= 1) {
                    revBtn.style.display = 'none';
                    revSpan.textContent = "Pekerjaan ini telah selesai. Batas maksimal revisi (1x) telah tercapai.";
                } else {
                    revBtn.style.display = 'block';
                    revBtn.onclick = () => requestEJORevision(ejo.id);
                    revSpan.textContent = "Pekerjaan ini telah selesai. Ajukan revisi jika masih diperlukan pengerjaan ulang.";
                }
            } else {
                revBtn.style.display = 'none';
                revSpan.textContent = "Pekerjaan ini telah dibatalkan.";
            }
        } else if (ejo.status === 'Pending Revision') {
            statusBtnGroup.style.display = 'none';
            revisionWrapper.style.display = 'flex';
            if (saveBtn) saveBtn.style.display = 'none'; // Lock saving
            if (completeBtn) completeBtn.style.display = 'none';

            const revBtn = document.getElementById("btn-request-revision");
            const revSpan = revisionWrapper.querySelector("span");
            revBtn.style.display = 'none';

            if (isLead) {
                revSpan.innerHTML = `
                    <div style="display: flex; gap: 8px; width: 100%;">
                        <button class="btn btn-outline full-width btn-xs" style="padding: 0.6rem; font-size: 0.8rem;" onclick="approveEJORevision('${ejo.id}', false)">Tolak Revisi</button>
                        <button class="btn btn-primary full-width btn-xs" style="padding: 0.6rem; font-size: 0.8rem;" onclick="approveEJORevision('${ejo.id}', true)">Setujui Revisi &rarr;</button>
                    </div>
                `;
            } else {
                // ponytail: rename Lead Engineer -> Foreman
                revSpan.textContent = "Menunggu verifikasi pengajuan revisi oleh Foreman / Admin / Manager / Supervisor.";
            }
        } else {
            statusBtnGroup.style.display = 'flex';
            revisionWrapper.style.display = 'none';
            if (saveBtn) {
                // ponytail: hide save button for Admin role per user request
                saveBtn.style.display = (isGeneral || isUserRole || isDrafter || isRestrictedRole || isAdmin) ? 'none' : 'block'; // ponytail: preserve hidden state for non-leads
            }
        }
    }

    // ponytail: Render attachments inside the EJO detail modal gallery
    function renderModalGallery() {
        let previewContainer = document.getElementById("modal-attachment-preview-container");
        if (!previewContainer) {
            const descBox = document.getElementById("modal-ejo-desc");
            if (descBox) {
                previewContainer = document.createElement("div");
                previewContainer.id = "modal-attachment-preview-container";
                previewContainer.style.marginTop = "1rem";
                descBox.parentNode.appendChild(previewContainer);
            }
        }
        if (!previewContainer) return;

        const currentSrcs = state.currentModalAttachments || [];
        const ejoDrawings = (state.drawings || []).filter(d => d.ejo_id === ejo.id && d.file_path);
        const userRole = (state.currentUser && state.currentUser.role) ? state.currentUser.role.toLowerCase().trim() : '';
        const cannotDeleteAttachments = ['supervisor', 'manager', 'plant manager', 'user', 'foreman'].includes(userRole);

        let htmlContent = "";

        // ponytail: Render associated technical drawings first
        if (ejoDrawings.length > 0) {
            htmlContent += `<h5 style="margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--color-cyan); display: flex; align-items: center; gap: 6px;"><i data-lucide="pen-tool" style="width: 14px; height: 14px;"></i> File Drawing Teknik (${ejoDrawings.length}):</h5>`;
            htmlContent += `<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 1rem;">`;
            ejoDrawings.forEach((drawing) => {
                htmlContent += `
                    <div style="position: relative; width: 100px; height: 100px;" onclick="openDrawingDetails('${drawing.id}')">
                        ${getDrawingThumbnailHtml(drawing)}
                    </div>
                `;
            });
            htmlContent += `</div>`;
        }

        // Render standard attachments
        if (currentSrcs.length > 0) {
            htmlContent += `<h5 style="margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;"><i data-lucide="paperclip" style="width: 14px; height: 14px;"></i> Lampiran File & Gambar (${currentSrcs.length}):</h5>`;
            htmlContent += `<div style="display: flex; flex-wrap: wrap; gap: 10px;">`;
            currentSrcs.forEach((src, idx) => {
                htmlContent += `
                    <div style="position: relative; width: 100px; height: 100px;">
                        <a href="javascript:void(0)" onclick="downloadAttachmentFile('modal', ${idx})" style="text-decoration: none; display: block; width: 100%; height: 100%;">
                            ${getAttachmentThumbnailHtml(src, idx)}
                        </a>
                        ${(canChangeStatus && !cannotDeleteAttachments) ? `
                        <button type="button" class="btn-delete-img" data-idx="${idx}" style="position: absolute; top: 4px; right: 4px; background: rgba(239, 68, 68, 0.85); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 11px; display: flex; align-items: center; justify-content: center; cursor: pointer; line-height: 1;" title="Hapus lampiran">&times;</button>
                        ` : ''}
                    </div>
                `;
            });
            htmlContent += `</div>`;
        }

        previewContainer.innerHTML = htmlContent;

        if (currentSrcs.length > 0) {
            // Add event listeners to delete buttons
            previewContainer.querySelectorAll(".btn-delete-img").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute("data-idx"));
                    state.currentModalAttachments.splice(idx, 1);
                    renderModalGallery();
                });
            });
        }

        lucide.createIcons();
    }

    // Render current attachments in modal
    renderModalGallery();

    // ponytail: Setup file input for EJO details modal and handle changes
    const modalFileInput = document.getElementById("modal-attachment");
    const modalUploadMock = document.getElementById("modal-upload-mock");
    const modalUploadSpan = document.getElementById("modal-upload-span");

    if (modalUploadSpan) modalUploadSpan.textContent = "Klik untuk tambah gambar";
    if (modalFileInput) modalFileInput.value = "";

    if (modalUploadMock && modalFileInput) {
        // Disable/enable upload based on permissions
        const userRole = (state.currentUser && state.currentUser.role) ? state.currentUser.role.toLowerCase().trim() : '';
        const cannotUpload = ['supervisor', 'manager', 'plant manager', 'user', 'foreman'].includes(userRole);
        const canUpload = canChangeStatus && !cannotUpload;

        modalUploadMock.style.opacity = canUpload ? "1" : "0.5";
        modalUploadMock.style.pointerEvents = canUpload ? "auto" : "none";

        // Hide the entire form-field if they cannot upload/delete attachments
        const parentField = modalUploadMock.closest('.form-field');
        if (parentField) {
            parentField.style.display = canUpload ? "block" : "none";
        }

        // Remove old event listeners by cloning
        const newMock = modalUploadMock.cloneNode(true);
        modalUploadMock.parentNode.replaceChild(newMock, modalUploadMock);

        const newFileInput = newMock.querySelector("#modal-attachment");

        newMock.addEventListener("click", (e) => {
            if (e.target !== newFileInput) {
                newFileInput.click();
            }
        });

        newFileInput.addEventListener("change", async () => {
            if (newFileInput.files && newFileInput.files.length > 0) {
                showToast("Memproses lampiran...", "info");
                for (let i = 0; i < newFileInput.files.length; i++) {
                    const file = newFileInput.files[i];
                    if (file.type.startsWith("image/")) {
                        const base64 = await resizeImageBase64(file);
                        if (base64) {
                            state.currentModalAttachments.push(`${file.name}||file-data-split||${base64}`);
                        }
                    } else {
                        const base64 = await readFileAsBase64(file);
                        if (base64) {
                            state.currentModalAttachments.push(`${file.name}||file-data-split||${base64}`);
                        }
                    }
                }
                renderModalGallery();
                showToast(`${newFileInput.files.length} Lampiran ditambahkan`, "success");
            }
            newFileInput.value = ""; // clear to allow same file re-selection
        });
    }

    // Set active status highlight in action bar
    updateModalStatusHighlight(ejo.status);

    // Re-render Timeline logs
    renderTimelineLogs(ejo);

    // ponytail: Render General EJO approvals signature list if this is a General EJO
    const sigSection = document.getElementById("general-ejo-signatures-section");
    const sigContainer = document.getElementById("general-ejo-signatures-container");
    if (sigSection && sigContainer) {
        if (isGeneral) {
            sigSection.style.display = "block";
            const app = ejo.approvals || {};
            const roles = [
                { key: 'user', label: 'User (Requester)' },
                { key: 'foreman', label: 'Foreman / Admin' }
            ];

            let html = roles.map(role => {
                const approval = app[role.key];
                if (approval && approval.signature) {
                    return `
                        <div class="signature-card signature-approved">
                            <span class="signature-role">${role.label}</span>
                            <div class="signature-placeholder" style="border: 2px dashed rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.05); display: flex; align-items: center; justify-content: center; height: 60px; border-radius: var(--border-radius-md);">
                                <span style="color: var(--color-green); font-weight: 800; font-size: 1.15rem; letter-spacing: 1px;">APPROVE</span>
                            </div>
                            <span class="signature-name">${approval.name || approval.username}</span>
                            <span class="signature-date">${approval.date || ''}</span>
                        </div>
                    `;
                } else {
                    return `
                        <div class="signature-card signature-pending">
                            <span class="signature-role">${role.label}</span>
                            <div class="signature-placeholder">
                                <i data-lucide="clock" class="signature-pending-icon"></i>
                                <span class="signature-empty">Belum ada approval</span>
                            </div>
                        </div>
                    `;
                }
            }).join('');

            sigContainer.innerHTML = html;
        } else {
            sigSection.style.display = "none";
        }
    }

    // Show modal
    document.getElementById("ejo-modal").classList.add("active");
    lucide.createIcons();

    // ponytail: Auto hide sidebar and expand main content if no sidebar actions are visible
    const sidebar = document.querySelector(".modal-action-sidebar");
    const modalBody = document.querySelector(".modal-body");
    const modalCard = document.querySelector("#ejo-modal .modal-card");
    if (sidebar && modalBody) {
        const isRevisionVisible = revisionWrapper && revisionWrapper.style.display !== 'none' && cardStatusUpdate && cardStatusUpdate.style.display !== 'none';

        const isSidebarEmpty = (!cardAssign || cardAssign.style.display === 'none') &&
            (!cardReports || cardReports.style.display === 'none') &&
            (!cardStatusUpdate || cardStatusUpdate.style.display === 'none') &&
            (!saveBtn || saveBtn.style.display === 'none') &&
            (!completeBtn || completeBtn.style.display === 'none') &&
            (!deleteBtn || deleteBtn.style.display === 'none') &&
            !isRevisionVisible;

        if (isSidebarEmpty) {
            sidebar.style.display = 'none';
            modalBody.style.gridTemplateColumns = '1fr';
            if (modalCard) {
                modalCard.style.maxWidth = '720px'; // ponytail: compact size when sidebar is hidden
            }
        } else {
            sidebar.style.display = 'block';
            modalBody.style.gridTemplateColumns = '1.8fr 1fr';
            if (modalCard) {
                modalCard.style.maxWidth = '950px'; // ponytail: restore standard size
            }
        }
    }
}

function updateModalStatusHighlight(status) {
    // ponytail: handle Checking status checkboxes mapping
    if (status === 'Checking') {
        const checkedCbs = document.querySelectorAll('input[name="checking-sub-type"]:checked');
        const vals = Array.from(checkedCbs).map(c => c.value);
        const subVal = vals.length > 0 ? vals.join(' & ') : "Drawing Ready";
        status = `Checking (${subVal})`;
    }

    // Save current status change internally in temporary selection object
    if (state.selectedEJO) {
        state.selectedEJO._tempStatus = status;
    }

    // ponytail: show/hide sub-options for Checking
    const subContainer = document.getElementById("checking-sub-options");
    const isChecking = status === 'Approved' || status.startsWith('Checking');
    if (subContainer) {
        if (isChecking) {
            subContainer.style.display = 'flex';
            const cbDrawing = document.querySelector('input[name="checking-sub-type"][value="Drawing Ready"]');
            const cbMaterial = document.querySelector('input[name="checking-sub-type"][value="Material"]');
            if (cbDrawing) cbDrawing.checked = status.includes("Drawing Ready") || !status.includes("Material");
            if (cbMaterial) cbMaterial.checked = status.includes("Material");
        } else {
            subContainer.style.display = 'none';
        }
    }

    document.querySelectorAll(".status-btn-group button").forEach(btn => {
        btn.classList.remove("active");
        btn.style.backgroundColor = 'transparent';
        btn.style.color = 'var(--text-secondary)';

        const btnStatus = btn.getAttribute("data-status");
        const isMatch = btnStatus === status ||
            (btnStatus === 'In Progress' && status.startsWith('In Progress')) ||
            (btnStatus === 'Checking' && (status === 'Approved' || status.startsWith('Checking')));
        if (isMatch) {
            btn.classList.add("active");
            if (status === 'Cancelled') {
                btn.style.backgroundColor = 'rgba(244, 63, 94, 0.2)';
                btn.style.color = 'var(--color-rose)';
            } else {
                btn.style.backgroundColor = 'rgba(6, 182, 212, 0.2)';
                btn.style.color = 'var(--color-cyan)';
            }
        }
    });
}

function renderTimelineLogs(ejo) {
    const logsContainer = document.getElementById("modal-ejo-logs");
    let logsList = parseLogs(ejo);
    if (logsList.length === 0) {
        logsContainer.innerHTML = '<p class="text-secondary text-xs">Belum ada riwayat aktivitas.</p>';
        return;
    }

    logsContainer.innerHTML = logsList.map((log, index) => {
        const isActive = index === logsList.length - 1;
        let cleanMessage = log.cleanMessage || log.message || "";
        cleanMessage = cleanMessage.replace(/\s*Laporan Penyelesaian:\s*.*$/, "");
        cleanMessage = cleanMessage.replace(/\s*Laporan Revisi:\s*.*$/, "");
        // ponytail: clean revision instruction from timeline item to avoid duplicate texts
        cleanMessage = cleanMessage.replace(/\s*Instruksi revisi:\s*.*$/, "");
        cleanMessage = cleanMessage.replace(/\s*Alasan revisi:\s*.*$/, "");
        cleanMessage = cleanMessage.replace(/\s*Alasan Penolakan:\s*.*$/, "");

        return `
            <div class="timeline-item ${isActive ? 'active' : ''}">
                <div class="timeline-date">${log.date}</div>
                <div class="timeline-content">${cleanMessage}</div>
            </div>
        `;
    }).join('');
}

async function saveModalChanges() {
    if (!state.selectedEJO) return;

    // ponytail: restrict save for restricted roles and Admin per user request
    const isRestrictedRole = state.currentUser && ['Foreman', 'Supervisor', 'Manager', 'Plant Manager', 'Admin'].includes(state.currentUser.role);
    if (isRestrictedRole) {
        showToast("Jabatan Anda tidak berhak menyimpan perubahan!", "error");
        return;
    }

    let isGeneral = false;
    let ejo = state.ejos.find(e => e.id === state.selectedEJO.id);
    if (!ejo) {
        ejo = getVisibleGeneralEjos().find(e => e.id === state.selectedEJO.id);
        if (ejo) isGeneral = true;
    }
    if (!ejo) return;

    // ponytail: double-check permission on save, rename Lead Engineer -> Foreman
    const isLead = state.currentUser && (isLeadRole(state.currentUser.role));
    const isAssigned = state.currentUser && (ejo.engineer || '').split(',').map(e => e.trim()).includes(state.currentUser.fullname);
    const isRequester = checkIsRequester(ejo.requester);

    const oldStatus = ejo.status;
    const oldAssignee = ejo.engineer;

    let nextStatus = state.selectedEJO._tempStatus || oldStatus;

    // ponytail: preserve revision status when rejecting approval back to In Progress
    let rejectionReason = "";
    if ((oldStatus === 'Pending Approval' || oldStatus === 'Pending Requester Approval') && nextStatus === 'In Progress') {
        nextStatus = getPreviousInProgressStatus(ejo);
        const reason = await showCustomPrompt(
            "Masukkan alasan penolakan approval pekerjaan ini:",
            "",
            "Alasan Penolakan Approval"
        );
        if (reason === null) return; // User cancelled
        if (reason.trim() === "") {
            showToast("Alasan penolakan wajib diisi!", "warning");
            return;
        }
        rejectionReason = reason.trim();
    }

    // ponytail: 2-step approval for General EJO (Pending Approval -> Pending Requester Approval -> Completed)
    if (isGeneral && oldStatus === 'Pending Approval' && nextStatus === 'Completed') {
        nextStatus = 'Pending Requester Approval';
    }

    // ponytail: if Foreman/Admin completes the work, it goes directly to Pending Requester Approval
    if (isGeneral && oldStatus.startsWith('In Progress') && (nextStatus === 'Completed' || nextStatus === 'Pending Approval') && isLead) {
        nextStatus = 'Pending Requester Approval';
    }

    const isDrafter = state.currentUser && isDrafterRole(state.currentUser.role);
    const isChecking = oldStatus === 'Approved' || oldStatus.startsWith('Checking');

    let canChange = false;
    if (oldStatus === 'Pending Approval' && (nextStatus === 'Completed' || nextStatus === 'Pending Requester Approval' || nextStatus === 'In Progress')) {
        canChange = isLead;
    } else if (oldStatus === 'Pending Requester Approval' && (nextStatus === 'Completed' || nextStatus === 'In Progress')) {
        canChange = isRequester;
    } else {
        canChange = isLead || (isAssigned && !(isDrafter && isChecking)) || (isRequester && (oldStatus === 'Pending Approval' || oldStatus === 'Pending Requester Approval'));
    }

    if (!canChange) {
        if (oldStatus === 'Pending Approval' && !isLead) {
            showToast("Hanya Foreman / Admin / Manager / Supervisor yang dapat memverifikasi pekerjaan ini secara teknis!", "error");
        } else if (oldStatus === 'Pending Requester Approval' && !isRequester) {
            showToast("Hanya User (Requester) yang membuat EJO yang dapat mengonfirmasi penyelesaian ini!", "error");
        } else {
            showToast("Anda tidak memiliki akses untuk mengubah EJO ini!", "error");
        }
        return;
    }

    // ponytail: read selected engineers from checkboxes if Lead, else preserve original
    let nextAssignee = ejo.engineer || 'Unassigned';
    if (isLead) {
        nextAssignee = 'Unassigned';
        const unassignedCheck = document.getElementById("assignee-unassigned");
        if (!unassignedCheck || !unassignedCheck.checked) {
            const checkedList = [];
            document.querySelectorAll(".assignee-check").forEach(cb => {
                if (cb.checked) checkedList.push(cb.value);
            });
            if (checkedList.length > 0) {
                nextAssignee = checkedList.join(', ');
            }
        }
    }

    // ponytail: reject approval without assigned engineer
    if ((nextStatus === 'Approved' || nextStatus.startsWith('Checking')) && (nextAssignee === 'Unassigned' || nextAssignee === '')) {
        showToast("Pekerjaan tidak dapat disetujui tanpa penugasan engineer!", "warning");
        return;
    }

    const nextEst = isLead ? (parseInt(document.getElementById("modal-est-cost").value) || 0) : (ejo.estCost || 0);
    const nextAct = isLead ? (parseInt(document.getElementById("modal-act-cost").value) || 0) : (ejo.actCost || 0);

    // Generate logs on change
    const now = new Date();
    const timestamp = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, '0') + "-" +
        String(now.getDate()).padStart(2, '0') + " " +
        String(now.getHours()).padStart(2, '0') + ":" +
        String(now.getMinutes()).padStart(2, '0');

    // ponytail: Reconstruct description with updated attachments list and completion report
    const parsed = parseEjoDescription(ejo.description);
    let nextCompletionReport = parsed.completionReportText;

    // Clear completion report on rejection back to In Progress
    if (nextStatus.startsWith('In Progress')) {
        nextCompletionReport = "";
    }

    // ponytail: capture custom completion log or work report message
    const nextLogMessage = document.getElementById("modal-new-log") ? document.getElementById("modal-new-log").value.trim() : "";

    // ponytail: validate that explanation is filled when completing a revised job
    if (oldStatus.startsWith("In Progress (Revisi ") && nextStatus === "Pending Approval") {
        if (nextLogMessage === "") {
            showToast("Wajib mengisi catatan Laporan Kerja untuk menjelaskan bagian apa saja yang direvisi!", "warning");
            if (document.getElementById("modal-new-log")) {
                document.getElementById("modal-new-log").focus();
            }
            return;
        }
        nextCompletionReport = "Laporan Revisi: " + nextLogMessage;
    }

    const nextDescription = buildEjoDescription(parsed.descText, nextCompletionReport, state.currentModalAttachments);

    const updatedFields = {
        status: nextStatus,
        engineer: nextAssignee,
        estCost: nextEst,
        actCost: nextAct,
        description: nextDescription, // ponytail: update attachment images in DB
        estDate: ejo.estDate || "",
        logs: []
    };

    if (nextLogMessage !== "") {
        const isSavedInDesc = oldStatus.startsWith("In Progress (Revisi ") && nextStatus === "Pending Approval";
        if (!isSavedInDesc) {
            updatedFields.logs.push({
                date: timestamp,
                message: nextLogMessage
            });
        }
    }

    if (oldStatus !== nextStatus) {
        updatedFields.logs.push({
            date: timestamp,
            message: `Status dirubah dari ${oldStatus} menjadi ${nextStatus} oleh ${state.currentUser ? state.currentUser.fullname : 'User'}.${rejectionReason ? ' Alasan Penolakan: ' + rejectionReason : ''}`
        });
        // ponytail: notifikasi status sekarang di-generate server-side (update_ejo)
    }

    if (oldAssignee !== nextAssignee) {
        updatedFields.logs.push({
            date: timestamp,
            message: `Engineer ditunjuk: ${nextAssignee === 'Unassigned' ? 'Belum ditentukan' : nextAssignee}.`
        });
        // ponytail: notifikasi assignment sekarang di-generate server-side (update_ejo)
    }

    const saveBtn = document.getElementById("btn-save-modal");
    let originalHtml = "";
    if (saveBtn) {
        originalHtml = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.textContent = "Menyimpan...";
    }

    try {
        const apiUrl = isGeneral ? `/api/general-ejos/${ejo.id}` : `/api/ejos/${ejo.id}`;
        const res = await fetch(apiUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFields)
        });
        if (!res.ok) throw new Error("Gagal memperbarui data EJO");

        await initData();
        closeModal();
        showToast(`Perubahan ${ejo.id} berhasil disimpan`, "success");
    } catch (err) {
        console.error(err);
        showToast("Gagal menyimpan perubahan ke database server!", "error");
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalHtml;
            lucide.createIcons();
        }
    }
}

async function deleteSelectedEJO() {
    if (!state.selectedEJO) return;

    // ponytail: restrict delete for restricted roles and Admin per user request
    const isRestrictedRole = state.currentUser && ['Foreman', 'Supervisor', 'Manager', 'Plant Manager', 'Admin'].includes(state.currentUser.role);
    if (isRestrictedRole) {
        showToast("Jabatan Anda tidak berhak menghapus EJO!", "error");
        return;
    }

    const isGeneral = state.generalEjos && state.generalEjos.some(ge => ge.id === state.selectedEJO.id);
    const confirmDelete = await showCustomConfirm(`Apakah Anda yakin ingin menghapus Job Order ${state.selectedEJO.id}?`);
    if (!confirmDelete) return;

    try {
        const queryParam = `?requester=${encodeURIComponent(state.currentUser.username)}`;
        const apiUrl = isGeneral ? `/api/general-ejos/${state.selectedEJO.id}${queryParam}` : `/api/ejos/${state.selectedEJO.id}${queryParam}`;
        const res = await fetch(apiUrl, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error("Gagal menghapus EJO");

        await initData();
        closeModal();
        showToast(`Job Order ${state.selectedEJO.id} telah dihapus`, "warning");
    } catch (err) {
        console.error(err);
        showToast("Gagal menghapus EJO dari database server!", "error");
    }
}

function closeModal() {
    document.getElementById("ejo-modal").classList.remove("active");
    state.selectedEJO = null;
}

// ponytail: Close Repair Part Detail Modal
function closePartModal() {
    document.getElementById("part-detail-modal").classList.remove("active");
}

// ponytail: Open Repair Part Detail Modal with populated data
function openRepairPartDetails(partId) {
    const part = state.repairParts.find(p => p.id === partId);
    if (!part) return;

    document.getElementById("modal-part-id").textContent = part.id;
    document.getElementById("modal-part-name").textContent = part.name;
    document.getElementById("modal-part-code").textContent = part.code || '--';
    document.getElementById("modal-part-stock").textContent = part.stock;
    document.getElementById("modal-part-stock-badge").textContent = `Stok: ${part.stock}`;
    document.getElementById("modal-part-location").textContent = part.location || '--';
    document.getElementById("modal-part-desc").textContent = part.description || 'Tidak ada keterangan.';

    // Image preview
    const imgContainer = document.getElementById("modal-part-image-container");
    const imgPreview = document.getElementById("modal-part-image-preview");
    if (part.image) {
        imgPreview.src = part.image;
        imgContainer.style.display = "block";
    } else {
        imgPreview.src = "";
        imgContainer.style.display = "none";
    }

    // EJO Link setup
    const ejoLink = document.getElementById("modal-part-ejo-link");
    if (part.ejo_id) {
        ejoLink.textContent = part.ejo_id;
        ejoLink.style.display = "inline";
        ejoLink.style.cursor = "pointer";
        ejoLink.style.color = "var(--text-link)";
        ejoLink.onclick = () => {
            closePartModal();
            openEJODetails(part.ejo_id);
        };
    } else {
        ejoLink.textContent = '-';
        ejoLink.onclick = null;
        ejoLink.style.cursor = "default";
        ejoLink.style.color = "var(--text-secondary)";
    }

    document.getElementById("part-detail-modal").classList.add("active");
    lucide.createIcons();
}



// ponytail: helper to check General EJO limit of 2 active per user (excluding Completed/Cancelled and Pending Revision)
function checkGeneralEjoLimit() {
    if (!state.currentUser) return false;
    // ponytail: only User role has limitation
    if (state.currentUser.role !== 'User') return false;
    const myGejos = (state.generalEjos || []).filter(e => {
        const isOwner = e.requester === state.currentUser.fullname || e.requester === state.currentUser.username;
        if (!isOwner) return false;
        if (e.is_archived) return false;
        const status = e.status || '';
        // Exclude Completed/Cancelled (Phase 3) and Pending Revision (Rejected EJO)
        if (status === 'Completed' || status === 'Cancelled' || status === 'Pending Revision') return false;
        return true;
    });
    return myGejos.length >= 2;
}

// ponytail: helper to check Drawing limit of 2 active per user (excluding Completed/Cancelled/Archived and Rejected drawings)
function checkDrawingLimit() {
    if (!state.currentUser) return false;
    // ponytail: only User role has limitation
    if (state.currentUser.role !== 'User') return false;
    const myDrawings = (state.drawings || []).filter(d => {
        const isOwner = d.uploader === state.currentUser.fullname || d.uploader === state.currentUser.username ||
            d.requester === state.currentUser.fullname || d.requester === state.currentUser.username;
        if (!isOwner) return false;
        if (d.is_archived) return false;
        const status = d.status || '';
        // Exclude Completed/Cancelled/Archived (Done) and Rejected drawings (Schedule)
        if (status === 'Completed' || status === 'Cancelled' || status === 'Archived' || status === 'Rejected') return false;
        return true;
    });
    return myDrawings.length >= 2;
}

// ponytail: General EJO — pekerjaan langsung (pasang lampu, ganti kran). DB terpisah, reuse pola createNewEJO.
async function createNewGeneralEJO() {
    const title = document.getElementById("gejo-form-title").value;
    const dept = document.getElementById("gejo-form-dept").value;
    const category = document.getElementById("gejo-form-category").value;
    const priority = document.getElementById("gejo-form-priority").value;
    const targetDate = document.getElementById("gejo-form-target-date").value;
    const location = document.getElementById("gejo-form-location").value;
    const description = document.getElementById("gejo-form-description").value;

    const submitBtn = document.querySelector('#gejo-form button[type="submit"]');
    let originalHtml = "";
    if (submitBtn) {
        originalHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.textContent = "Mengirim...";
    }

    if (state.editingGejoId) {
        const ejo = getVisibleGeneralEjos().find(item => item.id === state.editingGejoId);
        if (!ejo) return;

        const updatedFields = {
            status: ejo.status,
            engineer: ejo.engineer || 'Unassigned',
            estCost: ejo.estCost || 0,
            actCost: ejo.actCost || 0,
            approvals: ejo.approvals || {},
            is_archived: ejo.is_archived || 0,
            estDate: ejo.estDate || "",
            // ponytail: preserve the original creation date when editing
            createdDate: ejo.createdDate || "",
            title, dept, category, priority, location, targetDate, description
        };

        try {
            const res = await fetch(`/api/general-ejos/${state.editingGejoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedFields)
            });
            if (!res.ok) throw new Error("Gagal mengupdate General EJO");

            await initData();
            document.getElementById("gejo-form").reset();
            document.getElementById("gejo-form-container").style.display = 'none';
            state.editingGejoId = null;

            if (submitBtn) {
                submitBtn.innerHTML = `<i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i><span>Buat General EJO</span>`;
            }
            renderGeneralEJO();
            showToast("General EJO berhasil diperbarui", "success");
        } catch (err) {
            console.error(err);
            showToast("Gagal menyimpan perubahan General EJO!", "error");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                lucide.createIcons();
            }
        }
        return;
    }

    if (checkGeneralEjoLimit()) {
        showToast("Batas pembuatan General EJO tercapai! Anda hanya dapat membuat maksimal 2 General EJO aktif.", "warning");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHtml;
            lucide.createIcons();
        }
        return;
    }

    const now = new Date();
    const timestamp = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, '0') + "-" +
        String(now.getDate()).padStart(2, '0') + " " +
        String(now.getHours()).padStart(2, '0') + ":" +
        String(now.getMinutes()).padStart(2, '0');

    const newGejo = {
        title, dept, category, priority, location, targetDate,
        status: "Requested",
        engineer: "Unassigned",
        estCost: 0,
        actCost: 0,
        description,
        requester: state.currentUser ? state.currentUser.fullname : "System User",
        logs: [
            { date: timestamp, message: `General EJO dibuat oleh ${state.currentUser ? state.currentUser.fullname : 'user'}.` }
        ],
        // ponytail: set the creation date based on client system local time
        createdDate: now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, '0') + "-" + String(now.getDate()).padStart(2, '0')
    };

    try {
        const res = await fetch("/api/general-ejos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newGejo)
        });
        if (!res.ok) throw new Error("Gagal menyimpan General EJO");
        const resData = await res.json();
        const savedId = resData.id;

        await initData();
        document.getElementById("gejo-form").reset();
        document.getElementById("gejo-form-container").style.display = 'none';
        renderGeneralEJO();
        showToast(`General EJO ${savedId} berhasil dibuat`, "success");
    } catch (err) {
        console.error(err);
        showToast("Gagal menyimpan General EJO ke server!", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHtml;
            lucide.createIcons();
        }
    }
}

window.editGeneralEjoByUser = function (ejoId) {
    const ejo = getVisibleGeneralEjos().find(item => item.id === ejoId);
    if (!ejo) return;

    state.editingGejoId = ejoId;

    document.getElementById("gejo-form-title").value = ejo.title || "";
    document.getElementById("gejo-form-dept").value = normalizeDepartmentCode(ejo.dept) || "";
    document.getElementById("gejo-form-category").value = ejo.category || "";
    document.getElementById("gejo-form-priority").value = ejo.priority || "Low";
    document.getElementById("gejo-form-target-date").value = ejo.targetDate || "";
    document.getElementById("gejo-form-location").value = ejo.location || "";
    document.getElementById("gejo-form-description").value = parseEjoDescription(ejo.description).descText || "";

    const submitBtn = document.querySelector('#gejo-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = `<i data-lucide="save" style="width: 16px; height: 16px;"></i><span>Simpan Perubahan EJO</span>`;
    }

    document.getElementById("gejo-form-container").style.display = 'block';
    document.getElementById("gejo-form-container").scrollIntoView({ behavior: 'smooth' });
    lucide.createIcons();
};

// ponytail: drawing upload pakai FormData agar file tetap di disk, bukan masuk DB
async function uploadDrawing() {
    const fileInput = document.getElementById("drawing-file");
    const customIdInput = document.getElementById("drawing-custom-id");
    const customId = customIdInput ? customIdInput.value.trim() : "";
    const title = document.getElementById("drawing-title").value.trim();
    const file = fileInput ? fileInput.files[0] : null; // ponytail: safe check to prevent crash if input not loaded

    if (!title) {
        showToast("Judul drawing wajib diisi", "warning");
        return;
    }

    if (state.drawingFormMode === 'import' && !file && !state.editingDrawingId) {
        showToast("File drawing wajib diisi", "warning");
        return;
    }

    const dept = document.getElementById("drawing-form-dept")?.value || '';
    const category = document.getElementById("drawing-form-category")?.value || '';
    const priority = document.getElementById("drawing-form-priority")?.value || 'Low';
    const targetDate = document.getElementById("drawing-form-target-date")?.value || '';
    const location = document.getElementById("drawing-form-location")?.value?.trim() || '';
    const description = document.getElementById("drawing-form-description")?.value?.trim() || '';
    const ejoId = document.getElementById("drawing-form-ejo-id")?.value || '';

    const submitBtn = document.querySelector('#drawing-form button[type="submit"]');
    let originalHtml = "";
    if (submitBtn) {
        originalHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.textContent = "Mengirim...";
    }

    if (state.editingDrawingId) {
        try {
            let res;
            if (file) {
                const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                if (!allowedExtensions.includes(fileExtension)) {
                    showToast("Format file tidak didukung! Hanya file PDF atau gambar yang diperbolehkan.", "error");
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalHtml;
                    }
                    return;
                }

                const fd = new FormData();
                fd.append("file", file);
                fd.append("title", title);
                fd.append("uploader", state.currentUser ? state.currentUser.fullname : "");
                fd.append("dept", dept);
                fd.append("category", category);
                fd.append("priority", priority);
                fd.append("targetDate", targetDate);
                fd.append("location", location);
                fd.append("description", description);
                fd.append("ejo_id", ejoId);

                res = await fetch(`/api/drawings/${state.editingDrawingId}`, {
                    method: "PUT",
                    body: fd
                });
            } else {
                res = await fetch(`/api/drawings/${state.editingDrawingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title, dept, category, priority, targetDate, location, description, ejo_id: ejoId
                    })
                });
            }

            const contentType = res.headers.get("content-type") || "";
            const data = contentType.includes("application/json") ? await res.json() : null;
            if (!res.ok || (data && data.status === "error")) {
                throw new Error((data && data.message) || "Gagal menyimpan perubahan drawing");
            }

            await initData();
            document.getElementById("drawing-form").reset();
            document.getElementById("drawing-form-container").style.display = 'none';
            state.editingDrawingId = null;

            // ponytail: reset filename and preview
            const drawingFilename = document.getElementById("drawing-file-filename");
            const drawingPreview = document.getElementById("drawing-file-preview");
            const drawingPreviewImg = document.getElementById("drawing-file-preview-img");
            if (drawingFilename) drawingFilename.textContent = "Pilih file Lampiran (PDF/Gambar)";
            if (drawingPreview) drawingPreview.style.display = "none";
            if (drawingPreviewImg) drawingPreviewImg.src = "";

            if (submitBtn) {
                submitBtn.innerHTML = `<i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i><span>Kirim Request Drawing</span>`;
            }
            showToast("Drawing berhasil diperbarui", "success");
            renderDrawings();
        } catch (err) {
            console.error(err);
            showToast(err.message || "Gagal menyimpan perubahan drawing", "error");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                lucide.createIcons();
            }
        }
        return;
    }

    const fd = new FormData();
    if (file) {
        const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            showToast("Format file tidak didukung! Hanya file PDF atau gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan.", "error");
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHtml;
            }
            return;
        }
        fd.append("file", file);
    }
    if (customId) {
        fd.append("drawing_id", customId);
    }
    fd.append("title", title);
    fd.append("uploader", state.currentUser ? state.currentUser.fullname : "");
    fd.append("requester", state.currentUser ? state.currentUser.fullname : "");
    fd.append("dept", dept);
    fd.append("category", category);
    fd.append("priority", priority);
    fd.append("targetDate", targetDate);
    fd.append("location", location);
    fd.append("description", description);
    fd.append("ejo_id", ejoId);
    fd.append("drawing_type", state.drawingFormMode);

    try {
        const res = await fetch("/api/drawings", {
            method: "POST",
            body: fd
        });
        const contentType = res.headers.get("content-type") || "";
        const data = contentType.includes("application/json") ? await res.json() : null;
        if (!res.ok || (data && data.status === "error")) {
            throw new Error((data && data.message) || "Gagal mengirim request drawing");
        }

        await initData();
        document.getElementById("drawing-form").reset();
        document.getElementById("drawing-form-container").style.display = 'none';

        // ponytail: reset filename and preview
        const drawingFilename = document.getElementById("drawing-file-filename");
        const drawingPreview = document.getElementById("drawing-file-preview");
        const drawingPreviewImg = document.getElementById("drawing-file-preview-img");
        if (drawingFilename) drawingFilename.textContent = "Pilih file Lampiran (PDF/Gambar)";
        if (drawingPreview) drawingPreview.style.display = "none";
        if (drawingPreviewImg) drawingPreviewImg.src = "";

        showToast(`Request Drawing ${(data && data.id) || ''} berhasil dikirim`, "success");
        renderDrawings();
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal mengirim request drawing", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHtml;
            lucide.createIcons();
        }
    }
}

window.editDrawingByUser = function (drawingId) {
    const drawing = (state.drawings || []).find(d => d.id === drawingId);
    if (!drawing) return;

    state.editingDrawingId = drawingId;

    document.getElementById("drawing-title").value = drawing.title || "";
    document.getElementById("drawing-form-dept").value = normalizeDepartmentCode(drawing.dept) || "";
    document.getElementById("drawing-form-category").value = drawing.category || "";
    document.getElementById("drawing-form-priority").value = drawing.priority || "Low";
    document.getElementById("drawing-form-target-date").value = drawing.targetDate || "";
    document.getElementById("drawing-form-location").value = drawing.location || "";
    document.getElementById("drawing-form-description").value = drawing.description || "";
    document.getElementById("drawing-form-ejo-id").value = drawing.ejo_id || "";

    const submitBtn = document.querySelector('#drawing-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = `<i data-lucide="save" style="width: 16px; height: 16px;"></i><span>Simpan Perubahan Drawing</span>`;
    }

    const fileContainer = document.getElementById("drawing-file-container");
    const requiredStar = document.getElementById("drawing-file-required-star");
    if (fileContainer) fileContainer.style.display = 'block';
    if (requiredStar) requiredStar.style.display = 'none';

    document.getElementById("drawing-form-container").style.display = 'block';
    document.getElementById("drawing-form-container").scrollIntoView({ behavior: 'smooth' });
    lucide.createIcons();
};

// ponytail: hapus drawing cukup row + file fisik, tidak perlu soft delete
async function deleteDrawing(drawingId) {
    const drawing = (state.drawings || []).find(d => d.id === drawingId);
    if (!drawing) return;

    const userLevel = state.currentUser ? getRoleLevel(state.currentUser.role) : 0;
    const isSchedulePhase = drawing.status === 'Pending Foreman Approval' || drawing.status === 'Rejected' || drawing.status === 'Checking';
    const isUploader = state.currentUser && (drawing.uploader === state.currentUser.fullname || drawing.uploader === state.currentUser.username || drawing.requester === state.currentUser.fullname || drawing.requester === state.currentUser.username);

    let canDelete = false;
    if (isSchedulePhase) {
        canDelete = (userLevel >= 40) || isUploader;
    } else {
        canDelete = (userLevel === 100);
    }

    if (!canDelete) {
        showToast("Anda tidak memiliki wewenang untuk tindakan ini", "error");
        return;
    }
    if (!await showCustomConfirm(`Hapus drawing ${drawingId}?`)) return;

    try {
        const res = await fetch(`/api/drawings/${drawingId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Gagal menghapus drawing");
        await initData();
        showToast(`Drawing ${drawingId} berhasil dihapus`, "warning");
        renderDrawings();
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal menghapus drawing", "error");
    }
}

// ponytail: auto-generate next drawing ID like DRW-005 based on state.drawings
function generateDrawingId() {
    const drawings = state.drawings || [];
    const nums = [];
    drawings.forEach(d => {
        const m = (d.id || '').match(/^DRW-(\d+)$/i);
        if (m) {
            nums.push(parseInt(m[1], 10));
        }
    });
    const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    const padded = String(nextNum).padStart(3, '0');
    const input = document.getElementById("drawing-custom-id");
    if (input) {
        input.value = `DRW-${padded}`;
    }
}

// ponytail: Open Drawing Detail Modal with details, signatures, and timeline logs
function openDrawingDetails(drawingId) {
    const drawing = (state.drawings || []).find(d => d.id === drawingId);
    if (!drawing) return;

    state.selectedDrawing = drawing;

    document.getElementById("modal-drawing-id").textContent = drawing.id;
    document.getElementById("modal-drawing-title").textContent = drawing.title;
    document.getElementById("modal-drawing-uploader").textContent = drawing.uploader || '-';
    document.getElementById("modal-drawing-date").textContent = drawing.uploaded_at || '-';
    const targetDateEl = document.getElementById("modal-drawing-target-date");
    if (targetDateEl) {
        targetDateEl.textContent = drawing.targetDate ? formatDisplayDate(drawing.targetDate) : '-';
    }
    const estDateWrapper = document.getElementById("modal-drawing-est-date-wrapper");
    const estDateEl = document.getElementById("modal-drawing-est-date");
    if (estDateWrapper && estDateEl) {
        if (drawing.estDate) {
            estDateWrapper.style.display = "inline";
            estDateEl.textContent = formatDisplayDate(drawing.estDate);
        } else {
            estDateWrapper.style.display = "none";
        }
    }

    // ponytail: populate drawing type badge (Imported vs Requested)
    const typeBadge = document.getElementById("modal-drawing-type-badge");
    if (typeBadge) {
        const type = drawing.drawing_type || 'request';
        if (type === 'import') {
            typeBadge.textContent = 'Imported Drawing';
            typeBadge.style.background = 'rgba(6, 182, 212, 0.15)';
            typeBadge.style.borderColor = 'rgba(6, 182, 212, 0.3)';
            typeBadge.style.color = '#22d3ee';
            typeBadge.style.display = 'inline-flex';
        } else {
            typeBadge.textContent = 'Requested Drawing';
            typeBadge.style.background = 'rgba(234, 179, 8, 0.15)';
            typeBadge.style.borderColor = 'rgba(234, 179, 8, 0.3)';
            typeBadge.style.color = '#facc15';
            typeBadge.style.display = 'inline-flex';
        }
    }

    const statusBadge = document.getElementById("modal-drawing-status-badge");
    if (statusBadge) {
        statusBadge.textContent = drawing.status;
        statusBadge.className = "badge";
        if (drawing.status === 'Completed') {
            statusBadge.classList.add("status-completed");
        } else if (drawing.status === 'Rejected' || drawing.status === 'Cancelled') {
            statusBadge.classList.add("status-cancelled");
        } else {
            statusBadge.classList.add("status-approved");
        }
    }

    // Populate preview
    const previewContainer = document.getElementById("modal-drawing-preview-container");
    if (previewContainer) {
        if (!drawing.file_path) {
            previewContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 2.5rem 1.5rem; text-align: center; width: 100%; height: 100%; min-height: 400px; background: rgba(0,0,0,0.1); border-radius: 8px; box-sizing: border-box;">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--card-border); display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="image-off" style="width: 28px; height: 28px; color: var(--text-muted);"></i>
                    </div>
                    <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary); letter-spacing: 0.5px; margin-top: 4px;">Belum ada File Drawing</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); max-width: 280px; line-height: 1.4;">
                        File gambar teknik (.DWG/PDF/Image) belum diunggah oleh Drafter.
                    </div>
                </div>
            `;
        } else {
            const isPdf = (drawing.file_path || '').toLowerCase().endsWith('.pdf');
            const isDwg = (drawing.file_path || '').toLowerCase().endsWith('.dwg');
            if (isPdf) {
                previewContainer.innerHTML = `
                    <object data="${drawing.file_path}" type="application/pdf" style="width: 100%; height: 100%; min-height: 400px; border-radius: 8px;">
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 2rem; text-align: center; width: 100%;">
                            <i data-lucide="file-text" style="width: 48px; height: 48px; color: var(--color-cyan);"></i>
                            <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">Dokumen PDF: ${drawing.title}</div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary); max-width: 250px;">Pratinjau PDF tidak didukung oleh browser Anda secara langsung.</div>
                            <a href="${drawing.file_path}" target="_blank" class="btn btn-primary" style="margin-top: 8px; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; padding: 6px 16px; font-size: 0.8rem;">
                                <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                                Buka di Tab Baru
                            </a>
                        </div>
                    </object>
                `;
            } else if (isDwg) {
                previewContainer.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 2.5rem 1.5rem; text-align: center; width: 100%; height: 100%; min-height: 400px; background: radial-gradient(circle, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 100%); border-radius: 8px; border: 2px dashed rgba(2, 132, 199, 0.3); box-sizing: border-box;">
                        <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(2, 132, 199, 0.1); border: 1px solid rgba(2, 132, 199, 0.2); display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="pen-tool" style="width: 28px; height: 28px; color: var(--color-blue);"></i>
                        </div>
                        <div style="font-size: 1rem; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; margin-top: 4px;">File AutoCAD CAD (.DWG)</div>
                        <div style="font-size: 0.8rem; color: #94a3b8; font-weight: 500; word-break: break-all; max-width: 320px;">${drawing.title}</div>
                        <div style="font-size: 0.75rem; color: #64748b; max-width: 280px; line-height: 1.4; margin-top: 2px;">
                            File format DWG tidak dapat dirender secara langsung di dalam browser web tanpa perangkat lunak CAD.
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px; width: 100%; max-width: 220px; align-items: center;">
                            <a href="${drawing.file_path}" download class="btn btn-primary" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; text-decoration: none; padding: 8px 16px; font-size: 0.8rem; font-weight: 600; width: 100%; box-sizing: border-box;">
                                <i data-lucide="download" style="width: 14px; height: 14px;"></i>
                                Unduh File CAD
                            </a>
                            <a href="https://viewer.autodesk.com/" target="_blank" class="btn btn-outline" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; text-decoration: none; padding: 8px 16px; font-size: 0.8rem; color: #ffffff; border-color: rgba(255, 255, 255, 0.3); background: rgba(255, 255, 255, 0.05); width: 100%; box-sizing: border-box; transition: background 0.2s;" onmouseover="this.style.background='rgba(255, 255, 255, 0.15)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'">
                                <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                                Autodesk Viewer Online
                            </a>
                        </div>
                    </div>
                `;
            } else {
                previewContainer.innerHTML = `<img src="${drawing.file_path}" style="max-width: 100%; max-height: 400px; object-fit: contain; cursor: zoom-in; border-radius: 8px;" onclick="window.open('${drawing.file_path}', '_blank')">`;
            }
        }
    }

    const downloadLink = document.getElementById("modal-drawing-download-link");
    if (downloadLink) {
        downloadLink.href = drawing.file_path || '#';
        downloadLink.style.display = drawing.file_path ? 'flex' : 'none';
    }

    const deleteBtn = document.getElementById("modal-drawing-delete-btn");
    if (deleteBtn) {
        const userLevel = state.currentUser ? getRoleLevel(state.currentUser.role) : 0;
        const isSchedulePhase = drawing.status === 'Pending Foreman Approval' || drawing.status === 'Rejected';

        let canDelete = false;
        if (isSchedulePhase) {
            canDelete = (userLevel >= 40);
        } else {
            canDelete = (userLevel === 100); // Only Server account can delete once drawing enters On Progress or Done
        }

        deleteBtn.style.display = canDelete ? 'flex' : 'none';
        deleteBtn.onclick = () => {
            deleteDrawing(drawing.id);
            closeDrawingModal();
        };
    }

    // ponytail: tombol batalkan dihilangkan untuk semua jabatan atas permintaan user
    const cancelBtn = document.getElementById("modal-drawing-cancel-btn");
    if (cancelBtn) {
        cancelBtn.style.display = 'none';
    }

    // ponytail: handle Drafter/Admin/Server file upload section in modal (completely hidden now, upload handled via Kanban card instead)
    const uploadSection = document.getElementById("modal-drawing-upload-section");
    if (uploadSection) {
        uploadSection.style.display = 'none';
    }

    // ponytail: handle drawing assignment section
    const assignView = document.getElementById("drawing-assignment-view");
    const assignEdit = document.getElementById("drawing-assignment-edit");
    const assigneeName = document.getElementById("drawing-assignee-name");
    const assigneeSelect = document.getElementById("modal-drawing-assignee");
    const saveAssigneeBtn = document.getElementById("modal-drawing-save-assignee-btn");
    const cardDrawingAssignment = document.getElementById("card-drawing-assignment");

    // ponytail: Hide assignment card only in Completed or Cancelled phases, allowing it in Schedule and On Progress
    const isClosedPhase = drawing.status === 'Completed' || drawing.status === 'Cancelled';
    if (cardDrawingAssignment) {
        cardDrawingAssignment.style.display = !isClosedPhase ? 'flex' : 'none';
    }

    if (assignView && assignEdit && assigneeName) {
        const userRole = state.currentUser ? state.currentUser.role : '';
        const userFullname = state.currentUser ? state.currentUser.fullname : '';

        const isLead = (userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server');
        const isClosed = drawing.status === 'Completed' || drawing.status === 'Cancelled';
        let canAssign = false; // ponytail: disabled edit mode in sidebar; assignment is handled via popup modal during approval

        assigneeName.textContent = drawing.engineer ? drawing.engineer : 'Belum ditugaskan';

        if (canAssign) {
            assignEdit.style.display = 'flex';

            const assigneeContainer = document.getElementById("modal-drawing-assignee-container");
            if (assigneeContainer) {
                // ponytail: Filter by Drafter only to align with drawing submenu focus and remove the Unassigned option
                const filteredUsers = (state.users || []).filter(u => u.role.toLowerCase() === 'drafter');
                const currentAssignee = drawing.engineer || "";

                let html = "";
                
                let selectedFullName = "";
                if (currentAssignee && filteredUsers.some(u => u.fullname === currentAssignee)) {
                    selectedFullName = currentAssignee;
                } else if (filteredUsers.length > 0) {
                    selectedFullName = filteredUsers[0].fullname;
                }

                filteredUsers.forEach(u => {
                    const isSelected = u.fullname === selectedFullName;
                    const checkedAttr = isSelected ? "checked" : "";
                    const selectedClass = isSelected ? "selected" : "";
                    const avatarUrl = u.avatar ? (u.avatar.startsWith('http') || u.avatar.startsWith('/') ? u.avatar : '/' + u.avatar) : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80';
                    const roleClass = 'role-badge-' + u.role.toLowerCase();

                    html += `
                        <div class="engineer-select-row ${selectedClass}" style="margin-bottom: 0px;" onclick="toggleDrawingAssigneeRowSelection(this)">
                            <div class="eng-info">
                                <img src="${avatarUrl}" class="eng-avatar" alt="${u.fullname}" />
                                <div class="eng-details">
                                    <span class="eng-name">${u.fullname}</span>
                                    <span class="eng-role-badge ${roleClass}">${u.role}</span>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <input type="radio" name="drawing-assignee-radio" class="drawing-assignee-radio" value="${u.fullname}" ${checkedAttr} style="cursor: pointer;" onclick="event.stopPropagation(); syncDrawingAssigneeRowSelection(this)">
                            </div>
                        </div>
                    `;
                });
                assigneeContainer.innerHTML = html;
            }

            if (saveAssigneeBtn) {
                saveAssigneeBtn.onclick = async () => {
                    const selectedRadio = assigneeContainer.querySelector("input[name='drawing-assignee-radio']:checked");
                    const nextAssignee = selectedRadio ? selectedRadio.value : "Unassigned";
                    if (nextAssignee === (drawing.engineer || "Unassigned")) return;

                    const confirmAssign = await showCustomConfirm(`Apakah Anda yakin ingin menugaskan drawing ini kepada ${nextAssignee !== 'Unassigned' ? nextAssignee : 'Unassigned'}?`);
                    if (!confirmAssign) return;

                    saveAssigneeBtn.disabled = true;
                    saveAssigneeBtn.textContent = "Menyimpan...";

                    const now = new Date().toLocaleString('id-ID', { hour12: false }).replace(/\//g, '-');
                    const userName = state.currentUser ? state.currentUser.fullname : 'user';

                    const newLog = {
                        date: now,
                        message: `Drawing ditugaskan kepada ${nextAssignee !== 'Unassigned' ? nextAssignee : 'Belum ditentukan'} oleh ${userName}.`
                    };

                    const payload = {
                        engineer: nextAssignee !== 'Unassigned' ? nextAssignee : null,
                        logs: [newLog]
                    };

                    try {
                        const res = await fetch(`/api/drawings/${drawing.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload)
                        });
                        if (!res.ok) throw new Error("Gagal menyimpan penugasan");

                        showToast("Penugasan berhasil disimpan", "success");
                        await initData();
                        const updated = (state.drawings || []).find(d => d.id === drawing.id);
                        if (updated) {
                            openDrawingDetails(updated.id);
                        }
                    } catch (err) {
                        console.error(err);
                        showToast(err.message || "Gagal menyimpan penugasan", "error");
                    } finally {
                        saveAssigneeBtn.disabled = false;
                        saveAssigneeBtn.innerHTML = `<i data-lucide="save" style="width: 14px; height: 14px;"></i><span>Simpan Penugasan</span>`;
                        lucide.createIcons();
                    }
                };
            }
        } else {
            assignEdit.style.display = 'none';
        }
    }

    // Signatures
    const approvals = drawing.approvals || {};
    const roles = ['drafter', 'requester', 'foreman', 'supervisor', 'manager'];
    roles.forEach(r => {
        const infoEl = document.getElementById(`sig-info-${r}`);
        const imgContainer = document.getElementById(`sig-img-container-${r}`);
        const titleEl = document.getElementById(`sig-title-${r}`);
        const app = approvals[r];
        const rejectApp = approvals[r + "_reject"];

        // Dynamically update role title based on who signed (e.g. Admin or Foreman)
        if (titleEl) {
            if (app && app.role) {
                titleEl.textContent = app.role.toUpperCase();
            } else if (rejectApp && rejectApp.role) {
                titleEl.textContent = rejectApp.role.toUpperCase();
            } else {
                titleEl.textContent = r.toUpperCase();
            }
        }

        if (infoEl && imgContainer) {
            // Only show signature if file is uploaded (On Progress / approval phase) and status is not Checking or On Progress
            const showSig = (drawing.status !== 'Pending Foreman Approval' || !!drawing.file_path) && drawing.status !== 'Checking' && drawing.status !== 'On Progress';
            if (app && app.signature && showSig) {
                infoEl.innerHTML = `Disetujui oleh:<br><strong>${app.signer}</strong><br><span style="font-size:0.7rem; color:var(--text-muted);">${app.date}</span>`;
                imgContainer.innerHTML = `<img src="${app.signature}" style="max-height: 45px; background: #ffffff; padding: 2px; border: 1px solid var(--card-border); border-radius: 4px; object-fit: contain;" />`;
            } else {
                if (rejectApp && showSig) {
                    infoEl.innerHTML = `Ditolak oleh:<br><strong>${rejectApp.signer}</strong><br><span style="font-size:0.7rem; color:var(--text-muted);">${rejectApp.date}</span>`;
                    imgContainer.innerHTML = `<img src="${rejectApp.signature}" style="max-height: 45px; background: #ffffff; padding: 2px; border: 1px solid var(--card-border); border-radius: 4px; object-fit: contain;" />`;
                } else {
                    infoEl.textContent = "Menunggu Persetujuan";
                    imgContainer.innerHTML = `<span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">Belum ditandatangani</span>`;
                }
            }
        }
    });

    // Actions section
    const actionSection = document.getElementById("modal-drawing-action-section");
    const activeRoleLabel = document.getElementById("modal-drawing-active-role");
    const approveBtn = document.getElementById("modal-drawing-approve-btn");
    const rejectBtn = document.getElementById("modal-drawing-reject-btn");

    if (actionSection && activeRoleLabel && approveBtn && rejectBtn) {
        const userRole = state.currentUser ? state.currentUser.role : '';
        const userFullname = state.currentUser ? state.currentUser.fullname : '';
        let showActions = false;
        let roleText = '';

        const isAssigned = drawing.engineer === userFullname;

        // Reset elements to default state
        approveBtn.disabled = false;
        approveBtn.title = "";
        approveBtn.style.opacity = '1';
        approveBtn.style.cursor = 'pointer';
        rejectBtn.style.display = 'flex';
        approveBtn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px;"></i><span>Setujui</span>';
        rejectBtn.innerHTML = '<i data-lucide="x" style="width: 14px; height: 14px;"></i><span>Tolak</span>';

        if (drawing.status === 'Pending Foreman Approval' && (userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server')) {
            showActions = true;
            roleText = 'Foreman';
        } else if (drawing.status === 'Checking' && (userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server')) {
            showActions = true;
            roleText = 'Foreman';
            approveBtn.innerHTML = '<i data-lucide="play" style="width: 14px; height: 14px;"></i><span>Mulai Pengerjaan</span>';
            rejectBtn.style.display = 'none';
        } else if (drawing.status === 'On Progress' && (isAssigned || userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server')) {
            showActions = true;
            roleText = 'Drafter';
            approveBtn.innerHTML = '<i data-lucide="send" style="width: 14px; height: 14px;"></i><span>Kirim untuk Persetujuan</span>';
            rejectBtn.style.display = 'none';
            if (!drawing.file_path) {
                approveBtn.disabled = true;
                approveBtn.title = "Silakan unggah file drawing terlebih dahulu sebelum mengirim";
                approveBtn.style.opacity = '0.5';
                approveBtn.style.cursor = 'not-allowed';
            }
        } else if (drawing.status === 'Pending Supervisor Approval' && (userRole === 'Supervisor' || userRole === 'Server')) {
            showActions = true;
            roleText = 'Supervisor';
        } else if (drawing.status === 'Pending Manager Approval' && (userRole === 'Manager' || userRole === 'Plant Manager' || userRole === 'Server')) {
            showActions = true;
            roleText = 'Manager';
        } else if (drawing.status === 'Pending Requester Approval') {
            const isRequester = (userFullname === drawing.requester || userFullname === drawing.uploader || userRole === 'Admin' || userRole === 'Server');
            if (isRequester) {
                showActions = true;
                roleText = 'Requester';
            }
        }

        // ponytail: tindakan approval/reject dihilangkan dari detail modal atas permintaan user (cukup lewat tombol di kartu Kanban)
        actionSection.style.display = 'none';
    }

    // ponytail: Archive action logic
    const archiveSection = document.getElementById("modal-drawing-archive-section");
    const archiveBtn = document.getElementById("modal-drawing-archive-btn");
    if (archiveSection && archiveBtn) {
        const userRole = state.currentUser ? state.currentUser.role : '';
        const userFullname = state.currentUser ? state.currentUser.fullname : '';
        const isUploader = userFullname === drawing.uploader;
        const isSystemAdmin = (userRole === 'Admin' || userRole === 'Server');
        const canArchive = isUploader || isSystemAdmin;

        if (drawing.status === 'Completed' && canArchive) {
            archiveSection.style.display = 'block';
            archiveBtn.onclick = async () => {
                const confirmArchive = await showCustomConfirm(`Apakah Anda yakin ingin mengarsipkan drawing ${drawing.id}?`);
                if (!confirmArchive) return;

                try {
                    const now = new Date().toLocaleString('id-ID', { hour12: false }).replace(/\//g, '-');
                    const uploaderName = state.currentUser ? state.currentUser.fullname : 'System';
                    const newLog = {
                        date: now,
                        message: `Drawing diarsip oleh ${uploaderName}.`
                    };

                    const res = await fetch(`/api/drawings/${drawing.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            status: 'Archived',
                            logs: [newLog]
                        })
                    });
                    if (!res.ok) throw new Error("Gagal mengarsipkan drawing");

                    showToast("Drawing berhasil diarsipkan!", "success");
                    closeDrawingModal();

                    // refresh
                    const resDrawings = await fetch("/api/drawings");
                    state.drawings = await resDrawings.json();
                    renderDrawings();
                } catch (err) {
                    showToast(err.message || "Gagal mengarsipkan drawing", "error");
                }
            };
        } else {
            archiveSection.style.display = 'none';
        }
    }

    // Logs Timeline
    const logsContainer = document.getElementById("modal-drawing-logs");
    if (logsContainer) {
        logsContainer.innerHTML = "";
        const logs = drawing.logs || [];
        logs.forEach(log => {
            const item = document.createElement("div");
            item.className = "timeline-item";
            item.style.position = "relative";
            item.style.paddingLeft = "20px";
            item.style.marginBottom = "0.75rem";
            item.innerHTML = `
                <div style="position: absolute; left: 0; top: 4px; width: 8px; height: 8px; border-radius: 50%; background: var(--color-cyan); box-shadow: 0 0 8px var(--color-cyan);"></div>
                <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">${log.date}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px; line-height: 1.3;">${log.message}</div>
            `;
            logsContainer.appendChild(item);
        });
    }

    const modal = document.getElementById("drawing-detail-modal");
    if (modal) {
        modal.style.display = "flex";
        lucide.createIcons();
    }
}

// ponytail: Close Drawing Detail Modal
function closeDrawingModal() {
    const modal = document.getElementById("drawing-detail-modal");
    if (modal) modal.style.display = "none";
    state.selectedDrawing = null;
}

// ponytail: Custom popup modal for approving drawing request with engineer and targetDate selection (premium style)
function showDrawingApprovalModal(drawing) {
    return new Promise((resolve) => {
        // Create modal backdrop and container
        const modalId = "drawing-approve-popup-modal";
        let existing = document.getElementById(modalId);
        if (existing) existing.remove();

        const backdrop = document.createElement("div");
        backdrop.id = modalId;
        backdrop.style.position = "fixed";
        backdrop.style.top = "0";
        backdrop.style.left = "0";
        backdrop.style.width = "100%";
        backdrop.style.height = "100%";
        backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
        backdrop.style.backdropFilter = "blur(4px)";
        backdrop.style.display = "flex";
        backdrop.style.alignItems = "center";
        backdrop.style.justifyContent = "center";
        backdrop.style.zIndex = "11000";

        // ponytail: Filter by Drafter only to align with drawing submenu focus and remove the Unassigned option
        const filteredUsers = (state.users || []).filter(u => u.role.toLowerCase() === 'drafter');

        let rowsHtml = "";
        
        let selectedFullName = "";
        if (drawing.engineer && filteredUsers.some(u => u.fullname === drawing.engineer)) {
            selectedFullName = drawing.engineer;
        } else if (filteredUsers.length > 0) {
            selectedFullName = filteredUsers[0].fullname;
        }

        filteredUsers.forEach(u => {
            const isSelected = u.fullname === selectedFullName;
            const checkedAttr = isSelected ? "checked" : "";
            const selectedClass = isSelected ? "selected" : "";
            const avatarUrl = u.avatar ? (u.avatar.startsWith('http') || u.avatar.startsWith('/') ? u.avatar : '/' + u.avatar) : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80';
            const roleClass = 'role-badge-' + u.role.toLowerCase();
            
            rowsHtml += `
                <div class="engineer-select-row ${selectedClass}" style="margin-bottom: 6px;" onclick="
                    const radio = this.querySelector('input[type=&quot;radio&quot;]');
                    if (radio) radio.checked = true;
                    const container = this.closest('#drawing-approve-engineers-list');
                    if (container) {
                        container.querySelectorAll('.engineer-select-row').forEach(r => r.classList.remove('selected'));
                    }
                    this.classList.add('selected');
                ">
                    <div class="eng-info" style="display: flex; align-items: center; gap: 10px;">
                        <img src="${avatarUrl}" class="eng-avatar" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" alt="${u.fullname}" />
                        <div class="eng-details" style="display: flex; flex-direction: column;">
                            <span class="eng-name" style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); text-align: left;">${u.fullname}</span>
                            <span class="eng-role-badge ${roleClass}" style="font-size: 0.65rem; color: var(--text-secondary); text-align: left;">${u.role}</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <input type="radio" name="drawing-approve-eng" value="${u.fullname}" ${checkedAttr} style="cursor: pointer;" onclick="event.stopPropagation();
                            const row = this.closest('.engineer-select-row');
                            const container = this.closest('#drawing-approve-engineers-list');
                            if (container && row) {
                                container.querySelectorAll('.engineer-select-row').forEach(r => r.classList.remove('selected'));
                                row.classList.add('selected');
                            }
                        ">
                    </div>
                </div>
            `;
        });

        const currentTargetDate = drawing.targetDate || '';

        backdrop.innerHTML = `
            <div class="card-glass animate-in" style="width: 90%; max-width: 400px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; align-items: center; text-align: center;">
                <div style="background: rgba(6, 182, 212, 0.1); color: var(--color-cyan); width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="check-square" style="width: 24px; height: 24px;"></i>
                </div>
                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Persetujuan &amp; Penugasan Drawing</h4>
                <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">
                    Request drawing ini akan disetujui. Silakan tentukan drafter/engineer yang ditugaskan beserta estimasi selesai pengerjaan gambar teknik ini.
                </p>
                <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem; text-align: left;">
                    <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Pilih Drafter yang Ditugaskan:</label>
                    <div id="drawing-approve-engineers-list" style="max-height: 180px; overflow-y: auto; display: flex; flex-direction: column; width: 100%; box-sizing: border-box; padding-right: 4px;">
                        ${rowsHtml}
                    </div>
                </div>
                <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem; text-align: left;">
                    <label for="drawing-approve-target-date" style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Estimasi Selesai <span class="required">*</span>:</label>
                    <input type="date" id="drawing-approve-target-date" value="${currentTargetDate}" style="width: 100%; padding: 0.6rem; border-radius: var(--border-radius-md); border: 1px solid var(--card-border); background: var(--bg-main); color: var(--text-primary); box-sizing: border-box;" required />
                </div>
                <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.5rem;">
                    <button class="btn btn-outline full-width" id="drawing-approve-btn-cancel" style="padding: 0.6rem;">Batal</button>
                    <button class="btn btn-primary full-width" id="drawing-approve-btn-ok" style="padding: 0.6rem; font-weight: 600;">Setujui &amp; Tugaskan</button>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);
        lucide.createIcons({
            attrs: {
                "stroke-width": 2
            },
            nameAttr: "data-lucide"
        });

        // Event listeners
        const btnCancel = document.getElementById("drawing-approve-btn-cancel");
        const btnOk = document.getElementById("drawing-approve-btn-ok");

        btnCancel.onclick = () => {
            backdrop.remove();
            resolve(null);
        };

        btnOk.onclick = () => {
            const selectedRadio = backdrop.querySelector("input[name='drawing-approve-eng']:checked");
            if (!selectedRadio) {
                showToast("Silakan pilih drafter/engineer terlebih dahulu!", "warning");
                return;
            }
            const targetDateInput = document.getElementById("drawing-approve-target-date");
            if (!targetDateInput || !targetDateInput.value) {
                showToast("Silakan tentukan estimasi selesai terlebih dahulu!", "warning");
                return;
            }
            const engineer = selectedRadio.value;
            const targetDate = targetDateInput.value;
            backdrop.remove();
            resolve({ engineer: engineer === 'Unassigned' ? null : engineer, targetDate });
        };
    });
}

// ponytail: Handle drawing approval or rejection, requesting signature and logs
async function moveDrawingStatus(drawingId, action) {
    const drawing = (state.drawings || []).find(d => d.id === drawingId);
    if (!drawing) return;

    const userRole = state.currentUser ? state.currentUser.role : '';
    const userFullname = state.currentUser ? state.currentUser.fullname : '';
    const now = new Date().toLocaleString('id-ID', { hour12: false }).replace(/\//g, '-');

    let nextStatus = '';
    let roleKey = '';
    let roleLabel = '';

    if (drawing.status === 'Pending Foreman Approval' && (userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server')) {
        if (!drawing.file_path) {
            roleKey = 'foreman_assign';
            roleLabel = 'Foreman';
            // ponytail: langsung ke 'On Progress' tanpa konfirmasi ulang atau status checking
            nextStatus = action === 'approve' ? 'On Progress' : 'Rejected';
        } else {
            roleKey = 'foreman';
            roleLabel = 'Foreman';
            nextStatus = action === 'approve' ? 'Pending Supervisor Approval' : 'Rejected';
        }
    } else if (drawing.status === 'Checking') {
        if (userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server') {
            roleKey = 'start_work';
            roleLabel = 'Foreman';
            nextStatus = action === 'approve' ? 'On Progress' : 'Pending Foreman Approval';
        }
    } else if (drawing.status === 'On Progress') {
        const isAssigned = drawing.engineer === userFullname;
        if (isAssigned || userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server') {
            roleKey = 'submit_work';
            roleLabel = 'Drafter';
            nextStatus = 'Pending Foreman Approval';
        }
    } else if (drawing.status === 'Pending Supervisor Approval' && (userRole === 'Supervisor' || userRole === 'Server')) {
        roleKey = 'supervisor';
        roleLabel = 'Supervisor';
        nextStatus = action === 'approve' ? 'Pending Manager Approval' : 'Rejected';
    } else if (drawing.status === 'Pending Manager Approval' && (userRole === 'Manager' || userRole === 'Plant Manager' || userRole === 'Server')) {
        roleKey = 'manager';
        roleLabel = 'Manager';
        nextStatus = action === 'approve' ? 'Pending Requester Approval' : 'Rejected';
    } else if (drawing.status === 'Pending Requester Approval') {
        const isRequester = (userFullname === drawing.requester || userFullname === drawing.uploader || userRole === 'Admin' || userRole === 'Server');
        if (isRequester) {
            roleKey = 'requester';
            roleLabel = 'Requester / Pemohon';
            nextStatus = action === 'approve' ? 'Completed' : 'On Progress';
        }
    }

    if (!roleKey) {
        showToast("Anda tidak memiliki wewenang untuk tindakan ini", "error");
        return;
    }

    // ponytail: check if action is returning/sending back drawing instead of rejection
    const isReturn = (action === 'reject' && nextStatus !== 'Rejected');

    // ponytail: always show the custom approval & assignment modal during the initial approval step
    if (drawing.status === 'Pending Foreman Approval' && action === 'approve' && !drawing.file_path) {
        const resModal = await showDrawingApprovalModal(drawing);
        if (!resModal) {
            return;
        }
        drawing._tempAssignee = resModal.engineer;
        drawing._tempTargetDate = resModal.targetDate;
    }

    let reason = "";
    if (action === 'reject') {
        const promptMsg = isReturn ? "Masukkan alasan pengembalian drawing:" : "Masukkan alasan penolakan drawing:";
        const promptTitle = isReturn ? "Alasan Pengembalian" : "Alasan Penolakan";
        reason = await showCustomPrompt(promptMsg, "", promptTitle);
        if (!reason || !reason.trim()) {
            showToast(isReturn ? "Alasan pengembalian wajib diisi!" : "Alasan penolakan wajib diisi!", "warning");
            return;
        }
        reason = reason.trim();
    } else {
        if (roleKey !== 'foreman_assign') {
            let confirmMsg = `Apakah Anda yakin ingin menyetujui drawing ${drawingId}?`;
            if (roleKey === 'start_work') {
                confirmMsg = `Apakah Anda yakin ingin memulai pengerjaan untuk drawing ini?`;
            } else if (roleKey === 'submit_work') {
                confirmMsg = `Apakah Anda yakin ingin mengirimkan file drawing ini untuk persetujuan Foreman?`;
            }
            const confirmApprove = await showCustomConfirm(confirmMsg);
            if (!confirmApprove) return;
        }
    }

    // Prompt signature only for actual approval steps (Foreman, Supervisor, Manager sign-offs) and Drafter submission
    let signature = null;
    const requireSignature = (roleKey !== 'start_work' && roleKey !== 'foreman_assign');
    if (requireSignature) {
        const sigTitle = `Tanda Tangan ${action === 'approve' ? 'Persetujuan' : (isReturn ? 'Pengembalian' : 'Penolakan')} ${roleLabel}`;
        signature = await showSignatureModal(
            sigTitle,
            `Silakan konfirmasi tanda tangan Anda.`
        );

        if (!signature) {
            showToast("Tanda tangan dibatalkan", "warning");
            return;
        }
    }

    const approvals = { ...(drawing.approvals || {}) };
    const logs = [];

    const actualRole = (state.currentUser && state.currentUser.role) ? state.currentUser.role : roleLabel;

    if (roleKey === 'start_work') {
        if (action === 'approve') {
            logs.push({
                date: now,
                message: `Pengerjaan drawing dimulai oleh ${state.currentUser.fullname}. Status berubah ke On Progress.`
            });
        } else {
            logs.push({
                date: now,
                message: `Drawing dikembalikan ke status Pending Foreman Approval oleh ${state.currentUser.fullname} dengan alasan: "${reason}".`
            });
        }
    } else if (roleKey === 'submit_work') {
        approvals['drafter'] = {
            signer: state.currentUser.fullname,
            role: actualRole,
            date: now,
            signature: signature
        };
        logs.push({
            date: now,
            message: `Drawing diselesaikan oleh Drafter (${state.currentUser.fullname}) dan diajukan untuk persetujuan Requester.`
        });
    } else if (roleKey === 'foreman_assign') {
        logs.push({
            date: now,
            message: `Request drawing disetujui oleh ${actualRole} (${state.currentUser.fullname}) dan dilanjutkan ke pengerjaan Drafter.`
        });
    } else if (action === 'approve') {
        approvals[roleKey] = {
            signer: state.currentUser.fullname,
            role: actualRole,
            date: now,
            signature: signature
        };
        logs.push({
            date: now,
            message: `Drawing disetujui oleh ${actualRole} (${state.currentUser.fullname}) dan diteruskan ke status ${nextStatus}.`
        });
    } else {
        approvals[roleKey + "_reject"] = {
            signer: state.currentUser.fullname,
            role: actualRole,
            date: now,
            signature: signature
        };
        // ponytail: adjust log message based on whether drawing is returned or rejected
        const logAction = isReturn ? 'dikembalikan' : 'ditolak';
        logs.push({
            date: now,
            message: `Drawing ${logAction} oleh ${actualRole} (${state.currentUser.fullname}) dengan alasan: "${reason}". Status kembali ke ${nextStatus}.`
        });
    }

    const payload = {
        status: nextStatus,
        approvals: approvals,
        logs: logs
    };

    // ponytail: auto-save assignee and target date selection if present when approving
    if (drawing._tempAssignee) {
        payload.engineer = drawing._tempAssignee;
        payload.logs.push({
            date: now,
            message: `Drawing ditugaskan kepada ${drawing._tempAssignee} oleh ${state.currentUser.fullname}.`
        });
    }
    if (drawing._tempTargetDate) {
        payload.estDate = drawing._tempTargetDate;
        payload.logs.push({
            date: now,
            message: `Estimasi selesai diubah menjadi ${formatDisplayDate(drawing._tempTargetDate)} oleh ${state.currentUser.fullname}.`
        });
    }

    try {
        const res = await fetch(`/api/drawings/${drawingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Gagal mengupdate status drawing");
        await initData();
        closeDrawingModal();
        renderDrawings();
        // ponytail: adjust success toast text depending on approval, return, or rejection
        showToast(`Drawing ${drawingId} berhasil ${action === 'approve' ? 'disetujui' : (isReturn ? 'dikembalikan' : 'ditolak')}`, "success");
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal mengupdate status drawing", "error");
    }
}

// ponytail: batalkan drawing — set status ke Cancelled (hanya untuk Schedule phase)
async function cancelDrawing(drawingId) {
    if (!await showCustomConfirm(`Batalkan request drawing ${drawingId}?`)) return;

    const drawing = (state.drawings || []).find(d => d.id === drawingId);
    if (!drawing) return;

    const now = new Date().toLocaleString('id-ID', { hour12: false }).replace(/\//g, '-');
    const userName = state.currentUser ? state.currentUser.fullname : 'user';

    const payload = {
        status: 'Cancelled',
        approvals: drawing.approvals || {},
        logs: [{
            date: now,
            message: `Request drawing dibatalkan oleh ${userName}.`
        }]
    };

    try {
        const res = await fetch(`/api/drawings/${drawingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Gagal membatalkan drawing");
        await initData();
        closeDrawingModal();
        renderDrawings();
        showToast(`Request Drawing ${drawingId} berhasil dibatalkan`, "warning");
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal membatalkan drawing", "error");
    }
}

// ==========================================
// Utility Helper Functions
// ==========================================
// ponytail: Read arbitrary files as base64 string
function readFileAsBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => resolve("");
    });
}

// ponytail: Helper to get HTML snippet for file/image attachment thumbnails
function getAttachmentThumbnailHtml(src, idx) {
    if (!src || typeof src !== 'string') return "";
    let filename = `File ${idx + 1}`;
    let fileData = src;

    if (src.includes("||file-data-split||")) {
        const parts = src.split("||file-data-split||");
        filename = parts[0];
        fileData = parts[1];
    }

    const isImage = fileData.startsWith("data:image/");
    const isPdf = fileData.startsWith("data:application/pdf");
    const isDwg = filename.toLowerCase().endsWith(".dwg") || fileData.includes("application/acad") || fileData.includes("application/x-dwg");

    if (isImage) {
        return `<img src="${fileData}" style="width: 100%; height: 100%; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); cursor: pointer; transition: opacity 0.2s; object-fit: cover;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1" title="${filename}">`;
    } else {
        let icon = "file-text";
        let bgColor = "var(--bg-card)";
        let textColor = "var(--text-main)";
        if (isPdf) {
            icon = "file-digit";
            bgColor = "#fee2e2";
            textColor = "#ef4444";
        } else if (isDwg) {
            icon = "pen-tool";
            bgColor = "#e0f2fe";
            textColor = "#0284c7";
        }

        return `
            <div style="width: 100%; height: 100%; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); background: ${bgColor}; color: ${textColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5px; box-sizing: border-box; cursor: pointer; text-align: center;" title="${filename}">
                <i data-lucide="${icon}" style="width: 24px; height: 24px; margin-bottom: 2px;"></i>
                <div style="font-size: 8px; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500;">${filename}</div>
            </div>
        `;
    }
}

// ponytail: Helper to get HTML snippet for drawing file thumbnails
function getDrawingThumbnailHtml(drawing) {
    if (!drawing || !drawing.file_path) return "";
    const src = drawing.file_path;
    const filename = drawing.title || drawing.id;
    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(src);
    const isPdf = src.toLowerCase().endsWith('.pdf');
    const isDwg = src.toLowerCase().endsWith('.dwg');

    if (isImage) {
        return `<img src="${src}" style="width: 100%; height: 100%; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); cursor: pointer; transition: opacity 0.2s; object-fit: cover;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1" title="${filename}">`;
    } else {
        let icon = "file-text";
        let bgColor = "var(--bg-card)";
        let textColor = "var(--text-main)";
        if (isPdf) {
            icon = "file-digit";
            bgColor = "#fee2e2";
            textColor = "#ef4444";
        } else if (isDwg) {
            icon = "pen-tool";
            bgColor = "#e0f2fe";
            textColor = "#0284c7";
        }

        return `
            <div style="width: 100%; height: 100%; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); background: ${bgColor}; color: ${textColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5px; box-sizing: border-box; cursor: pointer; text-align: center;" title="${filename}">
                <i data-lucide="${icon}" style="width: 24px; height: 24px; margin-bottom: 2px;"></i>
                <div style="font-size: 8px; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500;">${filename}</div>
            </div>
        `;
    }
}

// ponytail: Handle downloading of attached files
window.downloadAttachmentFile = function (srcsArrayName, idx) {
    let list = [];
    if (srcsArrayName === 'modal') {
        list = state.currentModalAttachments;
    } else if (srcsArrayName === 'complete') {
        list = state._tempAttachments || [];
    }

    const src = list[idx];
    if (!src) return;

    let filename = `File-${idx + 1}`;
    let fileData = src;

    if (src.includes("||file-data-split||")) {
        const parts = src.split("||file-data-split||");
        filename = parts[0];
        fileData = parts[1];
    }

    const link = document.createElement("a");
    link.href = fileData;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// ponytail: Client-side image resize helper to keep DB size small and uploads fast
function resizeImageBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;
                const maxDim = 800;
                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL("image/jpeg", 0.7)); // JPEG with 70% quality compression
            };
            img.onerror = () => resolve("");
        };
        reader.onerror = () => resolve("");
    });
}

// ponytail: Reusable beautiful confirmation modal to replace native browser confirm()
function showCustomConfirm(message, title = "Konfirmasi Tindakan") {
    return new Promise((resolve) => {
        const modal = document.getElementById("custom-confirm-modal");
        const msgEl = document.getElementById("confirm-modal-message");
        const titleEl = document.getElementById("confirm-modal-title");
        const btnOk = document.getElementById("confirm-btn-ok");
        const btnCancel = document.getElementById("confirm-btn-cancel");

        if (!modal || !msgEl || !titleEl || !btnOk || !btnCancel) {
            resolve(confirm(message));
            return;
        }

        titleEl.textContent = title;
        msgEl.textContent = message;
        modal.style.display = 'flex';
        lucide.createIcons();

        const cleanUp = (result) => {
            modal.style.display = 'none';
            btnOk.replaceWith(btnOk.cloneNode(true));
            btnCancel.replaceWith(btnCancel.cloneNode(true));
            resolve(result);
        };

        // Re-get elements after clone replacement logic
        document.getElementById("confirm-btn-ok").addEventListener("click", () => cleanUp(true));
        document.getElementById("confirm-btn-cancel").addEventListener("click", () => cleanUp(false));
    });
}

// ponytail: Reusable beautiful prompt modal to replace native browser prompt()
function showCustomPrompt(message, defaultValue = "", title = "Input Data", showUpload = false) {
    return new Promise((resolve) => {
        const modal = document.getElementById("custom-prompt-modal");
        const msgEl = document.getElementById("prompt-modal-message");
        const titleEl = document.getElementById("prompt-modal-title");
        const inputEl = document.getElementById("prompt-modal-input");
        const btnOk = document.getElementById("prompt-btn-ok");
        const btnCancel = document.getElementById("prompt-btn-cancel");
        const uploadContainer = document.getElementById("prompt-modal-upload-container");
        const fileInput = document.getElementById("prompt-modal-file-input");
        const uploadTrigger = document.getElementById("prompt-modal-upload-trigger");
        const filenameSpan = document.getElementById("prompt-modal-upload-filename");
        const filePreview = document.getElementById("prompt-modal-file-preview");
        const filePreviewImg = document.getElementById("prompt-modal-file-preview-img");

        if (!modal || !msgEl || !titleEl || !inputEl || !btnOk || !btnCancel) {
            resolve(prompt(message, defaultValue));
            return;
        }

        titleEl.textContent = title;
        msgEl.textContent = message;
        inputEl.value = defaultValue;

        if (fileInput) fileInput.value = "";
        if (filePreview) filePreview.style.display = "none";
        if (filePreviewImg) filePreviewImg.src = "";
        if (filenameSpan) {
            filenameSpan.textContent = "Pilih file atau seret ke sini";
            filenameSpan.style.color = "var(--text-secondary)";
        }

        if (showUpload && uploadContainer) {
            uploadContainer.style.display = "flex";
        } else if (uploadContainer) {
            uploadContainer.style.display = "none";
        }

        const handleTriggerClick = () => {
            if (fileInput) fileInput.click();
        };

        if (uploadTrigger) {
            uploadTrigger.removeEventListener("click", handleTriggerClick);
            uploadTrigger.addEventListener("click", handleTriggerClick);
        }

        const handleFileChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                if (filenameSpan) {
                    filenameSpan.textContent = file.name;
                    filenameSpan.style.color = "var(--text-primary)";
                }
                if (file.type.startsWith("image/") && filePreview && filePreviewImg) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        filePreviewImg.src = event.target.result;
                        filePreview.style.display = "flex";
                    };
                    reader.readAsDataURL(file);
                } else if (filePreview) {
                    filePreview.style.display = "none";
                }
            } else {
                if (filenameSpan) {
                    filenameSpan.textContent = "Pilih file atau seret ke sini";
                    filenameSpan.style.color = "var(--text-secondary)";
                }
                if (filePreview) filePreview.style.display = "none";
            }
        };

        if (fileInput) {
            fileInput.removeEventListener("change", handleFileChange);
            fileInput.addEventListener("change", handleFileChange);
        }

        modal.style.display = 'flex';
        lucide.createIcons();

        setTimeout(() => inputEl.focus(), 50);

        const cleanUp = (resultValue) => {
            modal.style.display = 'none';
            if (fileInput) {
                fileInput.removeEventListener("change", handleFileChange);
            }
            if (uploadTrigger) {
                uploadTrigger.removeEventListener("click", handleTriggerClick);
            }
            btnOk.replaceWith(btnOk.cloneNode(true));
            btnCancel.replaceWith(btnCancel.cloneNode(true));
            resolve(resultValue);
        };

        document.getElementById("prompt-btn-ok").addEventListener("click", async () => {
            const textVal = inputEl.value;
            if (showUpload && fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const formData = new FormData();
                formData.append("file", file);

                showToast("Mengunggah file...", "info");
                try {
                    const uploadRes = await fetch("/api/upload", {
                        method: "POST",
                        body: formData
                    });
                    if (!uploadRes.ok) throw new Error("Gagal mengunggah file");
                    const uploadData = await uploadRes.json();
                    if (uploadData.status === "success" && uploadData.file_url) {
                        cleanUp({ text: textVal, fileUrl: uploadData.file_url });
                    } else {
                        showToast("Upload file gagal: " + (uploadData.message || "Unknown error"), "error");
                    }
                } catch (err) {
                    console.error(err);
                    showToast("Gagal mengunggah file revisi!", "error");
                }
            } else if (showUpload) {
                cleanUp({ text: textVal, fileUrl: "" });
            } else {
                cleanUp(textVal);
            }
        });
        document.getElementById("prompt-btn-cancel").addEventListener("click", () => {
            cleanUp(null);
        });
    });
}

// ponytail: Helpers for custom checklist rows selection highlight
window.toggleEngineerRowSelection = function (row) {
    const cb = row.querySelector('.gejo-approve-eng-check');
    if (cb) {
        cb.checked = !cb.checked;
        row.classList.toggle('selected', cb.checked);
    }
};

window.syncEngineerRowSelection = function (checkbox) {
    const row = checkbox.closest('.engineer-select-row');
    if (row) {
        row.classList.toggle('selected', checkbox.checked);
    }
};

window.toggleDrawingAssigneeRowSelection = function (row) {
    const radio = row.querySelector('.drawing-assignee-radio');
    if (radio) {
        radio.checked = true;
        const container = row.closest('#modal-drawing-assignee-container');
        if (container) {
            container.querySelectorAll('.engineer-select-row').forEach(r => {
                r.classList.remove('selected');
            });
        }
        row.classList.add('selected');
    }
};

window.syncDrawingAssigneeRowSelection = function (radio) {
    const row = radio.closest('.engineer-select-row');
    if (row) {
        const container = row.closest('#modal-drawing-assignee-container');
        if (container) {
            container.querySelectorAll('.engineer-select-row').forEach(r => {
                r.classList.remove('selected');
            });
        }
        row.classList.add('selected');
    }
};

// ponytail: Reusable beautiful alert modal to replace native browser alert()
function showCustomAlert(message, title = "Pemberitahuan") {
    return new Promise((resolve) => {
        const modal = document.getElementById("custom-confirm-modal");
        const msgEl = document.getElementById("confirm-modal-message");
        const titleEl = document.getElementById("confirm-modal-title");
        const btnOk = document.getElementById("confirm-btn-ok");
        const btnCancel = document.getElementById("confirm-btn-cancel");

        if (!modal || !msgEl || !titleEl || !btnOk || !btnCancel) {
            alert(message);
            resolve();
            return;
        }

        titleEl.textContent = title;
        msgEl.textContent = message;

        // Hide cancel button and change confirm button label
        btnCancel.style.display = 'none';
        btnOk.textContent = "OK";

        modal.style.display = 'flex';
        if (window.lucide) lucide.createIcons();

        const cleanUp = () => {
            modal.style.display = 'none';
            // Restore original styles and clone elements to remove event listeners
            btnCancel.style.display = '';
            btnOk.textContent = "Ya, Lanjutkan";
            btnOk.replaceWith(btnOk.cloneNode(true));
            btnCancel.replaceWith(btnCancel.cloneNode(true));
            resolve();
        };

        document.getElementById("confirm-btn-ok").addEventListener("click", cleanUp);
    });
}

// ponytail: Modal Helper to upload and compress signature (resized to max 400px width/height)
// ponytail: Added hideUpload parameter (default true) to support auto-generating a signature.
function showSignatureModal(title, subtitle, hideUpload = true) {
    // ponytail: Removed immediate resolve and setting requirement check so signature modal always opens,
    // allowing the user to review/confirm, use saved, or upload/draw a signature.
    return new Promise((resolve) => {
        const modal = document.getElementById("general-ejo-signature-modal");
        const titleEl = document.getElementById("gejo-sig-title");
        const subtitleEl = document.getElementById("gejo-sig-subtitle");
        const fileInput = document.getElementById("gejo-sig-file");
        const dropZone = document.getElementById("gejo-sig-dropzone");
        const previewCanvas = document.getElementById("gejo-sig-preview-canvas");
        const btnConfirm = document.getElementById("gejo-sig-btn-confirm");
        const btnCancel = document.getElementById("gejo-sig-btn-cancel");
        const btnClose = document.getElementById("gejo-sig-btn-close");

        if (!modal || !fileInput || !btnConfirm) {
            resolve(null);
            return;
        }

        titleEl.textContent = title || "Upload Tanda Tangan";
        subtitleEl.textContent = subtitle || "Pilih atau seret file gambar tanda tangan (JPG atau PNG)";

        // Reset state
        fileInput.value = "";
        const ctx = previewCanvas.getContext("2d");
        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewCanvas.style.display = "none";

        let signatureBase64 = null;
        const btnUseSaved = document.getElementById("gejo-sig-btn-use-saved");

        if (hideUpload) {
            // ponytail: Hide manual signature upload elements
            if (dropZone) dropZone.style.display = "none";
            if (btnUseSaved) btnUseSaved.style.display = "none";
            if (previewCanvas) previewCanvas.style.display = "none";

            if (state.currentUser && state.currentUser.signature) {
                signatureBase64 = state.currentUser.signature;
            }
        } else {
            // ponytail: Show manual signature upload elements
            if (dropZone) dropZone.style.display = "flex";
            if (previewCanvas) previewCanvas.style.display = "none";

            // ponytail: auto-load existing signature if available in user profile
            if (state.currentUser && state.currentUser.signature) {
                const img = new Image();
                img.onload = function () {
                    previewCanvas.width = img.width;
                    previewCanvas.height = img.height;
                    ctx.clearRect(0, 0, img.width, img.height);
                    ctx.drawImage(img, 0, 0);
                    previewCanvas.style.display = "block";
                    signatureBase64 = state.currentUser.signature;
                };
                img.src = state.currentUser.signature;
            }

            if (btnUseSaved) {
                if (state.currentUser && state.currentUser.signature) {
                    btnUseSaved.style.display = "flex";
                    btnUseSaved.onclick = () => {
                        const img = new Image();
                        img.onload = function () {
                            previewCanvas.width = img.width;
                            previewCanvas.height = img.height;
                            ctx.clearRect(0, 0, img.width, img.height);
                            ctx.drawImage(img, 0, 0);
                            previewCanvas.style.display = "block";
                            signatureBase64 = state.currentUser.signature;
                        };
                        img.src = state.currentUser.signature;
                    };
                } else {
                    btnUseSaved.style.display = "none";
                }
            }
        }

        function handleFile(file) {
            if (!file || !file.type.startsWith("image/")) {
                showToast("File harus berupa gambar!", "warning");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    // Compress to max 400px
                    let w = img.width;
                    let h = img.height;
                    const maxDim = 400;
                    if (w > maxDim || h > maxDim) {
                        if (w > h) {
                            h = Math.round((h * maxDim) / w);
                            w = maxDim;
                        } else {
                            w = Math.round((w * maxDim) / h);
                            h = maxDim;
                        }
                    }

                    previewCanvas.width = w;
                    previewCanvas.height = h;
                    ctx.clearRect(0, 0, w, h);
                    ctx.drawImage(img, 0, 0, w, h);

                    previewCanvas.style.display = "block";
                    signatureBase64 = previewCanvas.toDataURL("image/jpeg", 0.85);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        // Setup events
        const onFileChange = (e) => {
            if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
            }
        };

        const onDragOver = (e) => {
            e.preventDefault();
            if (dropZone) dropZone.classList.add("drag-over");
        };

        const onDragLeave = () => {
            if (dropZone) dropZone.classList.remove("drag-over");
        };

        const onDrop = (e) => {
            e.preventDefault();
            if (dropZone) dropZone.classList.remove("drag-over");
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
            }
        };

        if (!hideUpload) {
            // Let clicking on dropzone trigger file dialog
            if (dropZone) dropZone.onclick = () => fileInput.click();

            fileInput.addEventListener("change", onFileChange);
            if (dropZone) {
                dropZone.addEventListener("dragover", onDragOver);
                dropZone.addEventListener("dragleave", onDragLeave);
                dropZone.addEventListener("drop", onDrop);
            }
        }

        const cleanup = () => {
            if (!hideUpload) {
                fileInput.removeEventListener("change", onFileChange);
                if (dropZone) {
                    dropZone.removeEventListener("dragover", onDragOver);
                    dropZone.removeEventListener("dragleave", onDragLeave);
                    dropZone.removeEventListener("drop", onDrop);
                }
                if (btnUseSaved) btnUseSaved.onclick = null;
            }
            modal.style.display = "none";
        };

        btnConfirm.onclick = () => {
            // ponytail: Check if hideUpload is true and validate signature presence in user profile
            if (hideUpload) {
                if (state.currentUser && state.currentUser.signature) {
                    cleanup();
                    resolve(state.currentUser.signature);
                } else {
                    showToast("Anda belum mengunggah tanda tangan di profil! Silakan unggah tanda tangan di Pengaturan Profil terlebih dahulu.", "warning");
                }
                return;
            }

            if (!signatureBase64) {
                showToast("Anda harus mengunggah file gambar tanda tangan terlebih dahulu!", "warning");
                return;
            }
            cleanup();
            resolve(signatureBase64);
        };

        btnCancel.onclick = () => {
            cleanup();
            resolve(null);
        };

        if (btnClose) {
            btnClose.onclick = () => {
                cleanup();
                resolve(null);
            };
        }

        modal.style.display = "flex";
    });
}

// ponytail: Modal Helper to show general EJO rejection targets routing and upload media evidence
function showGeneralEjoRejectionModal(options) {
    return new Promise((resolve) => {
        const modal = document.getElementById("general-ejo-rejection-modal");
        const selectTarget = document.getElementById("gejo-reject-target");
        const textareaReason = document.getElementById("gejo-reject-reason");
        const fileInput = document.getElementById("gejo-reject-attachment");
        const uploadMock = document.getElementById("gejo-reject-upload-mock");
        const uploadSpan = document.getElementById("gejo-reject-upload-span");
        const previewContainer = document.getElementById("gejo-reject-preview-container");
        const btnConfirm = document.getElementById("gejo-reject-btn-confirm");
        const btnCancel = document.getElementById("gejo-reject-btn-cancel");

        if (!modal || !selectTarget || !textareaReason || !btnConfirm) {
            resolve(null);
            return;
        }

        // Populate select target options
        selectTarget.innerHTML = options.map(opt => `
            <option value="${opt.value}">${opt.label}</option>
        `).join('');

        // Reset fields
        textareaReason.value = "";
        fileInput.value = "";
        previewContainer.innerHTML = "";
        uploadSpan.textContent = "Klik untuk tambah gambar";
        modal.style.display = "flex";
        lucide.createIcons();

        let compressedRejectImage = null;

        const handleRejectFile = (file) => {
            if (!file || !file.type.startsWith("image/")) {
                showToast("File harus berupa gambar!", "warning");
                return;
            }
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    // Compress to max 600px
                    let w = img.width;
                    let h = img.height;
                    const maxDim = 600;
                    if (w > maxDim || h > maxDim) {
                        if (w > h) {
                            h = Math.round((h * maxDim) / w);
                            w = maxDim;
                        } else {
                            w = Math.round((w * maxDim) / h);
                            h = maxDim;
                        }
                    }
                    const canvas = document.createElement("canvas");
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, w, h);
                    compressedRejectImage = canvas.toDataURL("image/jpeg", 0.85);

                    // Show preview thumbnail
                    previewContainer.innerHTML = `
                        <div style="position: relative; width: 80px; height: 80px; border-radius: 4px; border: 1px solid var(--card-border); overflow: hidden; background: #ffffff; display: flex; align-items: center; justify-content: center;">
                            <img src="${compressedRejectImage}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                            <button type="button" id="btn-remove-reject-img" style="position: absolute; top: 2px; right: 2px; background: rgba(239, 68, 68, 0.8); border: none; border-radius: 50%; color: white; width: 18px; height: 18px; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
                        </div>
                    `;
                    uploadSpan.textContent = "Gambar terpilih";

                    document.getElementById("btn-remove-reject-img").onclick = (ev) => {
                        ev.stopPropagation();
                        compressedRejectImage = null;
                        fileInput.value = "";
                        previewContainer.innerHTML = "";
                        uploadSpan.textContent = "Klik untuk tambah gambar";
                    };
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        };

        uploadMock.onclick = () => fileInput.click();

        const onFileChange = (e) => {
            if (e.target.files && e.target.files[0]) {
                handleRejectFile(e.target.files[0]);
            }
        };

        const onDragOver = (e) => {
            e.preventDefault();
            uploadMock.classList.add("drag-over");
        };

        const onDragLeave = () => {
            uploadMock.classList.remove("drag-over");
        };

        const onDrop = (e) => {
            e.preventDefault();
            uploadMock.classList.remove("drag-over");
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleRejectFile(e.dataTransfer.files[0]);
            }
        };

        fileInput.addEventListener("change", onFileChange);
        uploadMock.addEventListener("dragover", onDragOver);
        uploadMock.addEventListener("dragleave", onDragLeave);
        uploadMock.addEventListener("drop", onDrop);

        const cleanup = () => {
            fileInput.removeEventListener("change", onFileChange);
            uploadMock.removeEventListener("dragover", onDragOver);
            uploadMock.removeEventListener("dragleave", onDragLeave);
            uploadMock.removeEventListener("drop", onDrop);
            modal.style.display = "none";
        };

        btnConfirm.onclick = () => {
            const target = selectTarget.value;
            const reason = textareaReason.value.trim();
            if (!reason) {
                showToast("Alasan penolakan wajib diisi!", "warning");
                return;
            }
            cleanup();
            resolve({ target, reason, image: compressedRejectImage });
        };

        btnCancel.onclick = () => {
            cleanup();
            resolve(null);
        };
    });
}

// ponytail: Custom popup modal for approving general EJO with engineer checkboxes and checking sub-status radios
function showGeneralEjoApprovalModal(ejo) {
    return new Promise((resolve) => {
        const modal = document.getElementById("general-ejo-approve-modal");
        const listContainer = document.getElementById("gejo-approve-engineers");
        const btnOk = document.getElementById("gejo-approve-btn-ok");
        const btnCancel = document.getElementById("gejo-approve-btn-cancel");

        if (!modal || !listContainer || !btnOk || !btnCancel) {
            resolve(null);
            return;
        }

        // Populate engineers checkboxes, filtering based on EJO's technical category
        // ponytail: filter engineers whose role matches the category of the EJO
        const currentEng = ejo.engineer || "";
        const currentNames = currentEng.split(',').map(n => n.trim().toLowerCase());

        const targetCategory = (ejo.category || "").trim().toLowerCase();
        const filteredUsers = (state.users || []).filter(u => u.role.toLowerCase() === targetCategory);

        // ponytail: dynamically update the engineer selection label with the category (no parentheses around category)
        const engineersLabel = document.getElementById("gejo-approve-engineers-label");
        if (engineersLabel) {
            const categoryText = ejo.category || "General";
            engineersLabel.textContent = `Pilih Engineer ${categoryText} (Bisa beberapa):`;
        }

        let html = "";
        filteredUsers.forEach((u) => {
            const isChecked = currentNames.includes(u.fullname.toLowerCase());
            const checkedAttr = isChecked ? "checked" : "";
            const selectedClass = isChecked ? "selected" : "";
            const avatarUrl = u.avatar ? (u.avatar.startsWith('http') || u.avatar.startsWith('/') ? u.avatar : '/' + u.avatar) : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80';
            const roleClass = 'role-badge-' + u.role.toLowerCase();

            html += `
                <div class="engineer-select-row ${selectedClass}" onclick="toggleEngineerRowSelection(this)">
                    <div class="eng-info">
                        <img src="${avatarUrl}" class="eng-avatar" alt="${u.fullname}" />
                        <div class="eng-details">
                            <span class="eng-name">${u.fullname}</span>
                            <span class="eng-role-badge ${roleClass}">${u.role}</span>
                        </div>
                    </div>
                    <div class="custom-checkbox">
                        <input type="checkbox" class="gejo-approve-eng-check" value="${u.fullname}" ${checkedAttr} onclick="event.stopPropagation(); syncEngineerRowSelection(this)">
                        <span class="checkmark"></span>
                    </div>
                </div>
            `;
        });
        listContainer.innerHTML = html;

        // Reset checkboxes to default "Drawing Ready"
        const checkboxes = document.getElementsByName("gejo-approve-sub-status");
        checkboxes.forEach(cb => {
            if (cb.value === "Drawing Ready") cb.checked = true;
            else cb.checked = false;
        });

        // ponytail: show/hide drawing upload section when Drawing Ready is checked/unchecked
        const drawingContainer = document.getElementById("gejo-approve-drawing-container");
        const drawingFileInput = document.getElementById("gejo-approve-drawing-file");
        const drawingFilename = document.getElementById("gejo-approve-drawing-filename");
        const drawingPreview = document.getElementById("gejo-approve-drawing-preview");
        const drawingPreviewImg = document.getElementById("gejo-approve-drawing-preview-img");

        const updateDrawingContainerVisibility = () => {
            const isDrawingReadyChecked = Array.from(checkboxes).some(cb => cb.value === "Drawing Ready" && cb.checked);
            if (drawingContainer) {
                drawingContainer.style.display = isDrawingReadyChecked ? 'flex' : 'none';
            }
        };

        // Reset file inputs and views
        if (drawingFileInput) drawingFileInput.value = "";
        if (drawingFilename) drawingFilename.textContent = "Pilih file Drawing (PDF/Gambar)";
        if (drawingPreview) drawingPreview.style.display = "none";
        if (drawingPreviewImg) drawingPreviewImg.src = "";
        updateDrawingContainerVisibility();

        // Listen for sub-status changes
        checkboxes.forEach(cb => {
            cb.onchange = () => {
                updateDrawingContainerVisibility();
            };
        });

        // Set up trigger upload button/div listener
        const drawingTrigger = document.getElementById("gejo-approve-drawing-trigger");
        if (drawingTrigger && drawingFileInput) {
            drawingTrigger.onclick = () => {
                drawingFileInput.click();
            };

            drawingFileInput.onchange = () => {
                const file = drawingFileInput.files[0];
                if (file) {
                    drawingFilename.textContent = file.name;
                    if (file.type.startsWith("image/")) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            if (drawingPreviewImg) {
                                drawingPreviewImg.src = e.target.result;
                                if (drawingPreview) drawingPreview.style.display = "flex";
                            }
                        };
                        reader.readAsDataURL(file);
                    } else {
                        if (drawingPreview) drawingPreview.style.display = "none";
                    }
                } else {
                    drawingFilename.textContent = "Pilih file Drawing (PDF/Gambar)";
                    if (drawingPreview) drawingPreview.style.display = "none";
                }
            };
        }

        // Set default date input value to the EJO's current targetDate
        const estDateInput = document.getElementById("gejo-approve-est-date");
        if (estDateInput) {
            estDateInput.value = ejo.targetDate || "";
        }

        modal.style.display = 'flex';
        lucide.createIcons();

        const cleanUp = (resultValue) => {
            modal.style.display = 'none';
            btnOk.replaceWith(btnOk.cloneNode(true));
            btnCancel.replaceWith(btnCancel.cloneNode(true));
            resolve(resultValue);
        };

        document.getElementById("gejo-approve-btn-ok").addEventListener("click", () => {
            const selectedChecks = document.querySelectorAll(".gejo-approve-eng-check:checked");
            const selectedEngineers = Array.from(selectedChecks).map(c => c.value);

            const checkedCbs = document.querySelectorAll('input[name="gejo-approve-sub-status"]:checked');
            const subStatusVals = Array.from(checkedCbs).map(cb => cb.value);
            if (subStatusVals.length === 0) {
                showToast("Silakan pilih minimal satu sub-status Checking!", "warning");
                return;
            }
            const subStatus = subStatusVals.join(" & ");

            const estDateVal = estDateInput ? estDateInput.value : "";
            if (!estDateVal) {
                showToast("Silakan pilih tanggal estimasi selesai!", "warning");
                return;
            }

            const hasDrawingReady = subStatusVals.includes("Drawing Ready");
            const drawingFile = drawingFileInput ? drawingFileInput.files[0] : null;

            if (hasDrawingReady && !drawingFile) {
                showToast("Silakan unggah file drawing (PDF / Gambar)!", "warning");
                return;
            }

            cleanUp({ engineers: selectedEngineers, subStatus, estDate: estDateVal, drawingFile });
        });

        document.getElementById("gejo-approve-btn-cancel").addEventListener("click", () => {
            cleanUp(null);
        });
    });
}

// ponytail: helper to upload drawing file during EJO approval
async function uploadDrawingFileDuringApproval(ejo, file) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", "Drawing EJO - " + ejo.id);
    fd.append("uploader", state.currentUser ? state.currentUser.fullname : "Foreman/Admin");
    fd.append("requester", state.currentUser ? state.currentUser.fullname : "Foreman/Admin");
    fd.append("dept", ejo.dept || "");
    fd.append("category", ejo.category || "");
    fd.append("priority", ejo.priority || 'Low');
    fd.append("targetDate", ejo.targetDate || "");
    fd.append("location", ejo.location || "");
    fd.append("description", "Auto-created drawing during approval of General EJO " + ejo.id);
    fd.append("ejo_id", ejo.id);

    try {
        const res = await fetch("/api/drawings", {
            method: "POST",
            body: fd
        });
        const contentType = res.headers.get("content-type") || "";
        const data = contentType.includes("application/json") ? await res.json() : null;
        if (!res.ok || (data && data.status === "error")) {
            throw new Error((data && data.message) || "Gagal mengunggah file drawing");
        }
        showToast(`File drawing berhasil diunggah (${(data && data.id) || ''})`, "success");
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal mengunggah file drawing", "error");
        throw err;
    }
}

// ponytail: Custom popup modal for Drafter job completion report (with logs & media attachments)
function showGeneralEjoCompletionModal(ejo) {
    return new Promise((resolve) => {
        const modal = document.getElementById("gejo-complete-modal");
        const previewContainer = document.getElementById("gejo-complete-preview-container");
        const fileInput = document.getElementById("gejo-complete-attachment");
        const uploadMock = document.getElementById("gejo-complete-upload-mock");
        const uploadSpan = document.getElementById("gejo-complete-upload-span");
        const textarea = document.getElementById("gejo-complete-log");
        const btnOk = document.getElementById("gejo-complete-btn-ok");
        const btnCancel = document.getElementById("gejo-complete-btn-cancel");

        if (!modal || !btnOk || !btnCancel) {
            resolve(null);
            return;
        }

        // ponytail: dynamically update completion modal title based on user role
        const titleEl = document.getElementById("gejo-complete-modal-title");
        if (titleEl) {
            const userRole = (state.currentUser && state.currentUser.role) ? state.currentUser.role : 'Drafter';
            titleEl.textContent = `Laporan Penyelesaian Pekerjaan (${userRole})`;
        }

        // Reset fields
        if (textarea) textarea.value = "";
        if (fileInput) fileInput.value = "";
        if (uploadSpan) uploadSpan.textContent = "Klik untuk tambah file / gambar (maks. 6)";

        // Parse existing attachments from ejo
        const descParts = (ejo.description || "").split("||attachment||");
        const attachmentsJoined = descParts[1] || "";
        let tempAttachments = attachmentsJoined ? attachmentsJoined.split("||image-split||").filter(src => src.trim() !== "") : [];
        state._tempAttachments = tempAttachments;

        function renderCompletionGallery() {
            if (!previewContainer) return;
            if (tempAttachments.length > 0) {
                let html = "";
                tempAttachments.forEach((src, idx) => {
                    html += `
                        <div style="position: relative; width: 80px; height: 80px;">
                            <a href="javascript:void(0)" onclick="downloadAttachmentFile('complete', ${idx})" style="text-decoration: none; display: block; width: 100%; height: 100%;">
                                ${getAttachmentThumbnailHtml(src, idx)}
                            </a>
                            <button type="button" class="btn-delete-complete-img" data-idx="${idx}" style="position: absolute; top: 2px; right: 2px; background: rgba(239, 68, 68, 0.9); color: white; border: none; border-radius: 50%; width: 18px; height: 18px; font-size: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; line-height: 1;" title="Hapus lampiran">&times;</button>
                        </div>
                    `;
                });
                previewContainer.innerHTML = html;
                previewContainer.querySelectorAll(".btn-delete-complete-img").forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        const idx = parseInt(btn.getAttribute("data-idx"));
                        tempAttachments.splice(idx, 1);
                        state._tempAttachments = tempAttachments;
                        renderCompletionGallery();
                    });
                });
                lucide.createIcons();
            } else {
                previewContainer.innerHTML = "";
            }
        }

        renderCompletionGallery();

        if (uploadMock && fileInput) {
            const newMock = uploadMock.cloneNode(true);
            uploadMock.parentNode.replaceChild(newMock, uploadMock);
            const newFileInput = newMock.querySelector("#gejo-complete-attachment");

            newMock.addEventListener("click", (e) => {
                if (e.target !== newFileInput) {
                    newFileInput.click();
                }
            });

            // ponytail: clone and replace separated camera button and input to clean up listeners
            const cameraBtn = document.getElementById("gejo-complete-btn-camera");
            const cameraInput = document.getElementById("gejo-complete-camera");
            let newCameraBtn = null;
            let newCameraInput = null;

            if (cameraBtn && cameraInput) {
                newCameraBtn = cameraBtn.cloneNode(true);
                cameraBtn.parentNode.replaceChild(newCameraBtn, cameraBtn);

                newCameraInput = cameraInput.cloneNode(true);
                cameraInput.parentNode.replaceChild(newCameraInput, cameraInput);
            }

            // ponytail: unified logic to process and add files to attachments list
            const processFiles = async (files, typeLabel = "Lampiran") => {
                if (files && files.length > 0) {
                    if (tempAttachments.length + files.length > 6) {
                        showToast("Maksimal 6 lampiran gambar/file yang diperbolehkan!", "warning");
                        return;
                    }
                    showToast(`Memproses ${typeLabel.toLowerCase()}...`, "info");
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        if (file.type.startsWith("image/")) {
                            const base64 = await resizeImageBase64(file);
                            if (base64) {
                                tempAttachments.push(`${file.name}||file-data-split||${base64}`);
                            }
                        } else {
                            const base64 = await readFileAsBase64(file);
                            if (base64) {
                                tempAttachments.push(`${file.name}||file-data-split||${base64}`);
                            }
                        }
                    }
                    state._tempAttachments = tempAttachments;
                    renderCompletionGallery();
                    showToast(`${files.length} ${typeLabel} ditambahkan`, "success");
                }
            };

            newFileInput.addEventListener("change", async () => {
                await processFiles(newFileInput.files, "Lampiran");
                newFileInput.value = "";
            });

            if (newCameraBtn && newCameraInput) {
                newCameraBtn.addEventListener("click", () => {
                    newCameraInput.click();
                });

                newCameraInput.addEventListener("change", async () => {
                    await processFiles(newCameraInput.files, "Foto");
                    newCameraInput.value = "";
                });
            }
        }

        modal.style.display = 'flex';
        lucide.createIcons();

        const cleanUp = (resultValue) => {
            if (modal) modal.style.display = 'none';
            // Replace with clone to remove listeners
            btnOk.replaceWith(btnOk.cloneNode(true));
            btnCancel.replaceWith(btnCancel.cloneNode(true));
            resolve(resultValue);
        };

        document.getElementById("gejo-complete-btn-ok").addEventListener("click", () => {
            const logVal = textarea ? textarea.value.trim() : "";
            if (logVal === "") {
                showToast("Catatan log / laporan pekerjaan wajib diisi!", "warning");
                return;
            }
            // ponytail: check if documentation/attachments has at least 1 and at most 6 files
            if (tempAttachments.length === 0) {
                showToast("Lampiran gambar/file wajib diisi!", "warning");
                return;
            }
            if (tempAttachments.length > 6) {
                showToast("Maksimal 6 lampiran gambar/file yang diperbolehkan!", "warning");
                return;
            }
            cleanUp({ message: logVal, attachments: tempAttachments });
        });

        document.getElementById("gejo-complete-btn-cancel").addEventListener("click", () => {
            cleanUp(null);
        });
    });
}


// ponytail: Helper to map EJO status value to a descriptive role-based status string
function getFriendlyStatusText(status, ejo) {
    if (!status) return status;
    let friendly = status;
    if (status.startsWith('In Progress') && status.includes('(Revisi')) {
        const match = status.match(/\(Revisi (\d+)\)/);
        const revNum = match ? match[1] : '1';
        friendly = `Schedule (Revisi ${revNum})`;
    } else if (status === 'Pending Approval') {
        friendly = 'Waiting for Lead approval';
    } else if (status === 'Pending Requester Approval') {
        friendly = 'Approved by Lead, waiting for Requester approval';
    } else if (status === 'Pending Revision') {
        friendly = 'Revision requested, waiting for Lead approval';
    } else if (status === 'Pending User Approval') {
        friendly = 'Waiting for User approval';
    } else if (status === 'Pending Foreman Approval') {
        friendly = 'Waiting for Foreman approval';
    } else if (status === 'Pending Supervisor Approval') {
        friendly = 'Waiting for Supervisor approval';
    } else if (status === 'Pending Manager Approval') {
        friendly = 'Waiting for Manager approval';
    }

    if (ejo) {
        const rev = getCurrentRevisionCount(ejo);
        if (rev > 0 && !friendly.includes('(Revisi ')) {
            friendly += ` (Revisi ${rev})`;
        }
    }
    return friendly;
}

function getStatusClass(status) {
    if (!status) return 'requested';
    if (status === 'Approved' || status.startsWith('Checking')) return 'approved';
    if (status.startsWith('Requested')) return 'requested';
    if (status.startsWith('In Progress') && status.includes('(Revisi')) return 'requested';
    if (status.startsWith('In Progress')) return 'progress';
    if (status.startsWith('Pending')) return 'pending';
    if (status.startsWith('Completed')) return 'completed';
    if (status.startsWith('Cancelled')) return 'cancelled';
    if (status.startsWith('Archived')) return 'completed';
    return 'requested';
}

function getPriorityColor(priority) {
    switch (priority) {
        case 'Emergency': return 'var(--color-rose)';
        case 'High': return 'var(--color-yellow)';
        case 'Medium': return 'var(--color-blue)';
        case 'Low': return 'var(--text-muted)';
        default: return 'var(--text-secondary)';
    }
}

function formatDisplayDate(dateStr) {
    if (!dateStr) return '--';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parseInt(parts[2])} ${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
}

// Toast Popup Trigger
function showToast(message, type = 'info') {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let icon = 'info';
    if (type === 'success') icon = 'check-circle';
    else if (type === 'warning') icon = 'alert-triangle';
    else if (type === 'error') icon = 'x-circle';

    toast.innerHTML = `
        <i data-lucide="${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in forwards';
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
}

// Inline inject keyframe for sliding toast out
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;
document.head.appendChild(styleSheet);

// ==========================================
// Project Monitoring Controllers
// ==========================================
// ponytail: filter projects and update count dynamically based on control bar inputs
// ponytail: filter projects and update count dynamically based on control bar inputs
function renderProjects() {
    const container1 = document.getElementById("container-fase1");
    const container2 = document.getElementById("container-fase2");
    const container3 = document.getElementById("container-fase3");
    const container4 = document.getElementById("container-fase4");

    if (!container1 || !container2 || !container3) return;

    // Reset container contents
    container1.innerHTML = "";
    container2.innerHTML = "";
    container3.innerHTML = "";
    if (container4) container4.innerHTML = "";

    // ponytail: get search and filter input values
    const searchVal = (document.getElementById("proj-search-input")?.value || "").toLowerCase();
    const deptVal = document.getElementById("proj-filter-dept")?.value || "all";
    const picVal = document.getElementById("proj-filter-pic")?.value || "all";

    // ponytail: filter projects matching the criteria
    const filtered = (state.projects || []).filter(p => {
        const matchesSearch = (p.id || '').toLowerCase().includes(searchVal) ||
            (p.title || '').toLowerCase().includes(searchVal) ||
            (p.desc || '').toLowerCase().includes(searchVal) ||
            (p.pic || '').toLowerCase().includes(searchVal);
        const matchesDept = departmentMatchesFilter(p.dept, deptVal);
        const matchesPic = picVal === 'all' || p.pic === picVal;
        return matchesSearch && matchesDept && matchesPic;
    });

    const resultsCountEl = document.getElementById("proj-results-count");
    if (resultsCountEl) {
        resultsCountEl.textContent = `Ditemukan ${filtered.length} Project`;
    }

    // Counters
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;

    // Render cards
    filtered.forEach(p => {
        // ponytail: show next signer in project card metadata
        let approvalStatusHtml = "";
        if (p.phase === 1) {
            const approvals = p.approvals || {};
            let nextRole = "Selesai";
            if (!approvals.pic) nextRole = "Pengusul";
            else if (!approvals.foreman) nextRole = "Foreman";
            else if (!approvals.supervisor) nextRole = "Supervisor";
            else if (!approvals.manager) nextRole = "Manager";

            approvalStatusHtml = `
                <div class="project-meta-item" style="color: var(--color-cyan);">
                    <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
                    <span>Menunggu TTD: <strong>${nextRole}</strong></span>
                </div>
            `;
        }

        let docsPreviewHtml = "";
        if (p.phase === 3 || p.phase === 4) {
            const execDocs = p.execution_docs || [];
            if (execDocs.length > 0) {
                docsPreviewHtml = `
                    <div class="project-card-docs-preview" style="margin-top: 10px; display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px;">
                        ${execDocs.map(docUrl => `
                            <img src="${docUrl}" style="width: 38px; height: 38px; object-fit: cover; border-radius: 6px; border: 1px solid var(--card-border); flex-shrink: 0;" onclick="event.stopPropagation(); window.open('${docUrl}', '_blank');" />
                        `).join('')}
                    </div>
                `;
            } else if (p.phase === 3) {
                docsPreviewHtml = `
                    <div style="font-size: 0.75rem; color: var(--text-muted); font-style: italic; margin-top: 10px;">
                        Belum ada foto dokumentasi eksekusi.
                    </div>
                `;
            }
        }

        const cardHtml = `
            <div class="project-card" style="cursor: pointer;" onclick="openProjectDetails(event, '${p.id}')">
                <div class="project-card-header">
                    <span class="project-card-id">${p.id}</span>
                    <span class="badge badge-accent" style="font-size:0.65rem;">${p.dept}</span>
                </div>
                <h5 class="project-card-title">${p.title}</h5>
                <p class="project-card-desc">${p.desc}</p>
                
                <div class="project-card-meta">
                    <div class="project-meta-item">
                        <i data-lucide="user"></i>
                        <span>Requestor: ${p.pic}</span>
                    </div>
                    <div class="project-meta-item">
                        <i data-lucide="wallet"></i>
                        <span>CapEx: Rp ${formatRupiah(p.budget)}</span>
                    </div>
                    ${approvalStatusHtml}
                </div>
                
                ${docsPreviewHtml}

                <div class="project-card-actions">
                    ${getProjectCardActions(p)}
                </div>
            </div>
        `;

        if (p.phase === 1) {
            container1.insertAdjacentHTML('beforeend', cardHtml);
            count1++;
        } else if (p.phase === 2) {
            container2.insertAdjacentHTML('beforeend', cardHtml);
            count2++;
        } else if (p.phase === 3) {
            container3.insertAdjacentHTML('beforeend', cardHtml);
            count3++;
        } else if (p.phase === 4) {
            if (container4) {
                container4.insertAdjacentHTML('beforeend', cardHtml);
                count4++;
            }
        }
    });

    // Update headers counts
    document.getElementById("count-fase1").textContent = count1;
    document.getElementById("count-fase2").textContent = count2;
    document.getElementById("count-fase3").textContent = count3;
    const count4El = document.getElementById("count-fase4");
    if (count4El) count4El.textContent = count4;

    // ponytail: apply selected phase column visibility
    filterProjectsByPhase();

    lucide.createIcons();
}

// ponytail: shows only the columns/cards for the selected phase, or all if null
function filterProjectsByPhase() {
    const col1 = document.getElementById("col-fase1");
    const col2 = document.getElementById("col-fase2");
    const col3 = document.getElementById("col-fase3");
    const col4 = document.getElementById("col-fase4");
    const board = document.querySelector("#tab-projects .project-board");

    if (!col1 || !col2 || !col3 || !board) return;

    if (state.activeProjectPhase === 'archive') {
        col1.style.display = "none";
        col2.style.display = "none";
        col3.style.display = "none";
        if (col4) col4.style.display = "flex";
        board.style.display = "grid";
        board.classList.add("single-phase");
    } else {
        board.style.display = "grid";
        if (col4) col4.style.display = "none";

        if (state.activeProjectPhase === 1) {
            col1.style.display = "flex";
            col2.style.display = "none";
            col3.style.display = "none";
            board.classList.add("single-phase");
        } else if (state.activeProjectPhase === 2) {
            col1.style.display = "none";
            col2.style.display = "flex";
            col3.style.display = "none";
            board.classList.add("single-phase");
        } else if (state.activeProjectPhase === 3) {
            col1.style.display = "none";
            col2.style.display = "none";
            col3.style.display = "flex";
            board.classList.add("single-phase");
        } else {
            col1.style.display = "flex";
            col2.style.display = "flex";
            col3.style.display = "flex";
            board.classList.remove("single-phase");
        }
    }
}

// ponytail: render list of repair parts with search filter
function renderRepairParts() {
    const tbody = document.getElementById("repair-parts-table-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    const searchVal = (document.getElementById("search-repair-parts")?.value || "").toLowerCase().trim();

    // Filter parts
    const filtered = state.repairParts.filter(p => {
        return (p.name || "").toLowerCase().includes(searchVal) ||
            (p.code || "").toLowerCase().includes(searchVal) ||
            (p.location || "").toLowerCase().includes(searchVal) ||
            (p.description || "").toLowerCase().includes(searchVal) ||
            (p.ejo_id || "").toLowerCase().includes(searchVal);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:2rem;">Tidak ada spare part yang cocok.</td></tr>`;
        return;
    }

    // ponytail: rename Lead Engineer -> Foreman
    const isLead = state.currentUser && (isLeadRole(state.currentUser.role));

    filtered.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Kode Part"><strong>${p.code || '--'}</strong></td>
            <td data-label="Nama Spare Part">
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${p.image ? `
                        <a href="${p.image}" target="_blank" title="Klik untuk memperbesar gambar" onclick="event.stopPropagation();">
                            <img src="${p.image}" style="width: 40px; height: 40px; border-radius: var(--border-radius-sm); object-fit: cover; border: 1px solid var(--card-border); cursor: zoom-in;" />
                        </a>
                    ` : ''}
                    <span class="part-name-link" onclick="openRepairPartDetails('${p.id}')">${p.name}</span>
                </div>
            </td>
            <td data-label="Jumlah Stok"><span class="badge badge-accent">${p.stock}</span></td>
            <td data-label="Lokasi Penyimpanan">${p.location || '--'}</td>
            <td data-label="Terhubung ke EJO">${p.ejo_id ? `<span class="badge badge-blue" style="cursor:pointer; font-weight:600;" onclick="openEJODetails('${p.ejo_id}')">${p.ejo_id}</span>` : '<span class="text-muted">-</span>'}</td>
            <td data-label="Keterangan" class="text-secondary text-xs">${p.description || '--'}</td>
            <td data-label="Aksi">
                <div style="display: flex; gap: 6px; align-items: center;">
                    <button class="btn btn-outline btn-xs" onclick="openRepairPartDetails('${p.id}')">
                        <i data-lucide="external-link" style="width:12px; height:12px;"></i> Detail
                    </button>
                    ${isLead ? `
                        <button class="btn btn-danger btn-xs delete-part-btn" data-id="${p.id}">
                            <i data-lucide="trash-2" style="width:12px; height:12px;"></i> Hapus
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Bind delete buttons
    tbody.querySelectorAll(".delete-part-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const partId = btn.getAttribute("data-id");
            if (await showCustomConfirm("Apakah Anda yakin ingin menghapus alokasi spare part ini?")) {
                try {
                    const res = await fetch(`/api/repair-parts/${partId}`, { method: "DELETE" });
                    if (res.ok) {
                        state.repairParts = state.repairParts.filter(p => p.id !== partId);
                        renderRepairParts();
                        showToast("Spare part berhasil dihapus!", "success");
                    } else {
                        showToast("Gagal menghapus spare part!", "error");
                    }
                } catch (err) {
                    console.error(err);
                    showToast("Gagal menghubungi server!", "error");
                }
            }
        });
    });

    lucide.createIcons();
}

// ponytail: save new repair part to server and refresh list
async function createNewRepairPart() {
    const name = document.getElementById("part-name").value.trim();
    const code = document.getElementById("part-code").value.trim() || null;
    const stock = parseInt(document.getElementById("part-stock").value) || 0;
    const location = document.getElementById("part-location").value.trim();
    const ejoId = document.getElementById("part-ejo-id").value.trim() || null;
    const description = document.getElementById("part-desc").value.trim() || null;

    // ponytail: read image input and convert/compress to base64
    const imageInput = document.getElementById("part-image");
    let imageBase64 = null;
    if (imageInput && imageInput.files && imageInput.files[0]) {
        showToast("Memproses gambar spare part...", "info");
        imageBase64 = await resizeImageBase64(imageInput.files[0]);
    }

    if (!name || stock < 0 || !location) {
        showToast("Mohon isi semua field wajib!", "warning");
        return;
    }

    // Check if EJO ID exists if provided
    if (ejoId) {
        const ejoExists = state.ejos.some(e => e.id === ejoId) || state.generalEjos.some(g => g.id === ejoId);
        if (!ejoExists) {
            showToast(`EJO ID "${ejoId}" tidak ditemukan!`, "warning");
            return;
        }
    }

    const partId = `PART-${Date.now()}`;
    const newPart = {
        id: partId,
        name,
        code,
        stock,
        location,
        ejo_id: ejoId,
        description,
        image: imageBase64
    };

    try {
        const res = await fetch("/api/repair-parts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPart)
        });

        if (res.ok) {
            state.repairParts.push(newPart);
            renderRepairParts();

            // Reset form
            document.getElementById("part-form").reset();
            document.getElementById("part-form-container").style.display = 'none';
            document.getElementById("btn-toggle-new-part").innerHTML = '<i data-lucide="plus-circle"></i> Tambah Part';

            showToast("Spare part berhasil ditambahkan!", "success");
        } else {
            showToast("Gagal menyimpan spare part ke database!", "error");
        }
    } catch (err) {
        console.error(err);
        showToast("Terjadi kesalahan jaringan!", "error");
    }
}


function getProjectCardActions(p) {
    const isLead = state.currentUser && (isLeadRole(state.currentUser.role));
    const isOwner = state.currentUser && (p.pic === state.currentUser.fullname || p.pic === state.currentUser.username);

    if (!isLead && !isOwner) {
        return ""; // ponytail: keep card clean for non-owners/non-leads
    }

    if (p.phase === 1) {
        const approvals = p.approvals || {};
        const isFullyApproved = approvals.pic && approvals.foreman && approvals.supervisor && approvals.manager;

        // Only owner/PIC can delete the project in Fase 1
        const deleteButton = isOwner ? `<button class="btn btn-danger-outline btn-xs" onclick="deleteProject('${p.id}')">Hapus</button>` : '';

        if (isFullyApproved) {
            const userRole = state.currentUser ? state.currentUser.role : "";
            const isAuthorized = userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server';
            if (isAuthorized) {
                return `
                    ${deleteButton}
                    <button class="btn btn-primary btn-xs" onclick="moveProjectPhase('${p.id}', 1)">Setujui &rarr;</button>
                `;
            } else {
                return deleteButton;
            }
        } else {
            // ponytail: check who is eligible to sign next and show direct sign button
            const userRole = state.currentUser ? state.currentUser.role : "";
            const userLevel = getRoleLevel(userRole);

            let eligibleSlot = "";
            let userIsEligible = false;
            if (!approvals.pic) {
                eligibleSlot = "pic";
                userIsEligible = isOwner;
            } else if (!approvals.foreman) {
                eligibleSlot = "foreman";
                // ponytail: only Foreman/Admin/Server role can sign the foreman slot
                userIsEligible = userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server';
            } else if (!approvals.supervisor) {
                eligibleSlot = "supervisor";
                // ponytail: only Supervisor/Admin/Server role can sign the supervisor slot
                userIsEligible = userRole === 'Supervisor' || userRole === 'Admin' || userRole === 'Server';
            } else if (!approvals.manager) {
                eligibleSlot = "manager";
                // ponytail: only Manager/Plant Manager/Admin/Server role can sign the manager slot
                userIsEligible = userRole === 'Manager' || userRole === 'Plant Manager' || userRole === 'Admin' || userRole === 'Server';
            }

            if (userIsEligible) {
                return `
                    ${deleteButton}
                    <button class="btn btn-primary btn-xs glow-button" onclick="signProjectRoleDirect(event, '${p.id}', '${eligibleSlot}')">Setujui & Tanda Tangan</button>
                `;
            } else {
                return `
                    ${deleteButton}
                    <button class="btn btn-outline btn-xs" style="border-color: var(--color-cyan); color: var(--color-cyan);" onclick="openProjectDetails(null, '${p.id}')">Detail & Tanda Tangan</button>
                `;
            }
        }
    } else if (p.phase === 2) {
        const userRole = state.currentUser ? state.currentUser.role : "";
        const isAuthorized = userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server';
        if (isAuthorized) {
            return `
                <button class="btn btn-outline btn-xs" onclick="moveProjectPhase('${p.id}', -1)">&larr; Balikkan</button>
                <button class="btn btn-primary btn-xs" onclick="moveProjectPhase('${p.id}', 1)">Barang Ready &rarr;</button>
            `;
        } else {
            return `
                <button class="btn btn-outline btn-xs" style="border-color: var(--color-cyan); color: var(--color-cyan);" onclick="openProjectDetails(null, '${p.id}')">Detail Project</button>
            `;
        }
    } else if (p.phase === 3) {
        const userRole = state.currentUser ? state.currentUser.role : "";
        const isAuthorized = userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server';
        if (isAuthorized) {
            return `
                <button class="btn btn-outline btn-xs" onclick="moveProjectPhase('${p.id}', -1)">&larr; Pengadaan</button>
                <input type="file" id="card-upload-doc-${p.id}" accept="image/*" style="display: none;" multiple onchange="uploadProjectDocFromCard('${p.id}', this)">
                <button class="btn btn-primary btn-xs glow-button" onclick="document.getElementById('card-upload-doc-${p.id}').click();">
                    <i data-lucide="camera" style="width:10px;height:10px;display:inline;"></i> Upload Foto
                </button>
                <button class="btn btn-xs glow-button" style="background: linear-gradient(135deg, #10B981, #059669); color: white; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.25);" onclick="completeProjectFromCard('${p.id}')">Selesaikan EJO <i data-lucide="check" style="width:10px;height:10px;display:inline;"></i></button>
            `;
        } else {
            return `
                <button class="btn btn-outline btn-xs" style="border-color: var(--color-cyan); color: var(--color-cyan);" onclick="openProjectDetails(null, '${p.id}')">Detail Project</button>
            `;
        }
    } else if (p.phase === 4) {
        return `
            <button class="btn btn-outline btn-xs" onclick="moveProjectPhase('${p.id}', -1)">&larr; Balikkan ke Fase 3</button>
            <button class="btn btn-danger-outline btn-xs" onclick="deleteProject('${p.id}')">Hapus</button>
        `;
    }
    return '';
}

// ponytail: Helper to get action transition buttons for General EJO cards on the Kanban board
function getGeneralEjoCardActions(e) {
    // ponytail: rename Lead Engineer -> Foreman
    const isLead = state.currentUser && (isLeadRole(state.currentUser.role));
    const isForemanAdmin = state.currentUser && isForemanAdminRole(state.currentUser.role);
    const isAssigned = state.currentUser && e.engineer && e.engineer.split(',').map(name => name.trim()).includes(state.currentUser.fullname);

    const isRequester = checkIsRequester(e.requester);
    const detailOnlyButton = `<button class="btn btn-outline btn-xs" onclick="openEJODetails('${e.id}')">Detail</button>`;
    if (e.status === 'Requested') {
        if (isRequester) {
            return `
                <button class="btn btn-danger-outline btn-xs" onclick="deleteGeneralEjo('${e.id}')">Batal / Hapus</button>
                <button class="btn btn-outline btn-xs" onclick="editGeneralEjoByUser('${e.id}')">Edit</button>
            `;
        }
        if (!isForemanAdmin) return detailOnlyButton;
        return `
            <button class="btn btn-danger-outline btn-xs" onclick="moveGeneralEjoStatus('${e.id}', 'Cancelled')">Tolak</button>
            <button class="btn btn-primary btn-xs" onclick="moveGeneralEjoStatus('${e.id}', 'Checking')">Setujui &rarr;</button>
        `;
    } else if (e.status === 'Approved' || e.status.startsWith('Checking')) {
        if (isRequester) {
            return `
                <button class="btn btn-danger-outline btn-xs" onclick="deleteGeneralEjo('${e.id}')">Batal / Hapus</button>
                <button class="btn btn-outline btn-xs" onclick="editGeneralEjoByUser('${e.id}')">Edit</button>
            `;
        }
        const isDrafter = state.currentUser && isDrafterRole(state.currentUser.role);
        if (isForemanAdmin || (isDrafter && isAssigned)) {
            return `
                ${isForemanAdmin ? `<button class="btn btn-outline btn-xs" onclick="moveGeneralEjoStatus('${e.id}', 'Requested')">&larr; Balikkan</button>` : ''}
                <button class="btn btn-primary btn-xs" onclick="moveGeneralEjoStatus('${e.id}', 'In Progress')">Mulai Kerja &rarr;</button>
            `;
        }
        return detailOnlyButton;
    } else if (e.status.startsWith('In Progress')) {
        const isDrafter = state.currentUser && isDrafterRole(state.currentUser.role);
        if (isDrafter && isAssigned) {
            return `
                <button class="btn btn-primary btn-xs" onclick="moveGeneralEjoStatus('${e.id}', 'Pending User Approval')">Selesaikan &rarr;</button>
            `;
        }
        if (isLead) {
            return `
                <button class="btn btn-outline btn-xs" onclick="moveGeneralEjoStatus('${e.id}', 'Requested')">&larr; Balikkan</button>
            `;
        }
        return `<span class="text-muted text-xs" style="font-style: italic;">Hanya Engineer yang ditunjuk yang dapat memproses</span>`;
    } else if (e.status === 'Pending User Approval') {
        const isRequester = checkIsRequester(e.requester);
        if (isRequester) {
            return `
                <button class="btn btn-danger-outline btn-xs" onclick="moveGeneralEjoStatus('${e.id}', 'In Progress')">Tolak Approval</button>
                <button class="btn btn-primary btn-xs glow-button" onclick="moveGeneralEjoStatus('${e.id}', 'Pending Foreman Approval')">Approve Selesai (User) &rarr;</button>
            `;
        }
        return `<span class="text-muted text-xs" style="font-style: italic; color: #fbbf24;">Menunggu approval User (Requester)</span>`;
    } else if (e.status === 'Pending Foreman Approval') {
        if (isForemanAdmin) {
            return `
                <button class="btn btn-danger-outline btn-xs" onclick="moveGeneralEjoStatus('${e.id}', 'In Progress')">Tolak Approval</button>
                <button class="btn btn-primary btn-xs glow-button" onclick="moveGeneralEjoStatus('${e.id}', 'Completed')">Approve Selesai (Foreman/Admin) &rarr;</button>
            `;
        }
        return detailOnlyButton;
    } else if (e.status === 'Completed' || e.status === 'Cancelled') {
        let buttons = '';
        const isRequester = checkIsRequester(e.requester);
        if (e.status === 'Completed' && (isLead || isAssigned || isRequester)) {
            // ponytail: restrict General EJO revisions to max 1x
            if (getCurrentRevisionCount(e) < 1) {
                buttons += `<button class="btn btn-warning-outline btn-xs" style="margin-right:4px;" onclick="requestEJORevision('${e.id}')">Ajukan Revisi</button>`;
            }
        }
        if (isRequester || isLead) {
            buttons += `<button class="btn btn-primary btn-xs glow-button" onclick="archiveGeneralEJO('${e.id}')">Konfirmasi Selesai & Arsipkan</button>`;
        }
        return buttons;
    } else if (e.status === 'Pending Revision') {
        if (isForemanAdmin) {
            return `
                <button class="btn btn-outline btn-xs" onclick="approveEJORevision('${e.id}', false)">Tolak Revisi</button>
                <button class="btn btn-primary btn-xs glow-button" onclick="approveEJORevision('${e.id}', true)">Setujui Revisi &rarr;</button>
            `;
        }
        return detailOnlyButton;
    }
    return '';
}

// ponytail: Show modal to upload a drawing and complete the work
async function triggerCardDrawingCompleteUpload(drawingId) {
    return new Promise((resolve) => {
        const modal = document.getElementById("drawing-upload-complete-modal");
        const fileInput = document.getElementById("drawing-upload-complete-file-input");
        const trigger = document.getElementById("drawing-upload-complete-trigger");
        const filenameSpan = document.getElementById("drawing-upload-complete-filename");
        const preview = document.getElementById("drawing-upload-complete-preview");
        const previewImg = document.getElementById("drawing-upload-complete-preview-img");
        const btnOk = document.getElementById("drawing-upload-complete-btn-ok");
        const btnCancel = document.getElementById("drawing-upload-complete-btn-cancel");

        if (!modal || !fileInput || !trigger || !filenameSpan || !btnOk || !btnCancel) {
            // fallback if elements are not found
            triggerCardDrawingUpload(drawingId);
            resolve();
            return;
        }

        // Reset inputs
        fileInput.value = "";
        filenameSpan.textContent = "Pilih file Drawing (PDF/Gambar)";
        filenameSpan.style.color = "var(--text-secondary)";
        if (preview) preview.style.display = "none";
        if (previewImg) previewImg.src = "";

        const handleTriggerClick = () => {
            fileInput.click();
        };

        trigger.removeEventListener("click", handleTriggerClick);
        trigger.addEventListener("click", handleTriggerClick);

        const handleFileChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                if (!allowedExtensions.includes(fileExtension)) {
                    showToast("Format file tidak didukung! Hanya file PDF atau gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan.", "error");
                    fileInput.value = "";
                    filenameSpan.textContent = "Pilih file Drawing (PDF/Gambar)";
                    filenameSpan.style.color = "var(--text-secondary)";
                    if (preview) preview.style.display = "none";
                    if (previewImg) previewImg.src = "";
                    return;
                }

                filenameSpan.textContent = file.name;
                filenameSpan.style.color = "var(--text-primary)";

                if (file.type.startsWith("image/") && preview && previewImg) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        previewImg.src = event.target.result;
                        preview.style.display = "flex";
                    };
                    reader.readAsDataURL(file);
                } else if (preview) {
                    preview.style.display = "none";
                }
            }
        };

        fileInput.removeEventListener("change", handleFileChange);
        fileInput.addEventListener("change", handleFileChange);

        modal.style.display = 'flex';
        lucide.createIcons();

        const cleanUp = () => {
            modal.style.display = 'none';
            fileInput.removeEventListener("change", handleFileChange);
            trigger.removeEventListener("click", handleTriggerClick);
            // Replace buttons with clones to remove previous event listeners
            btnOk.replaceWith(btnOk.cloneNode(true));
            btnCancel.replaceWith(btnCancel.cloneNode(true));
        };

        // Re-get buttons after replacement to add listener
        document.getElementById("drawing-upload-complete-btn-cancel").addEventListener("click", () => {
            cleanUp();
            resolve(false);
        });

        document.getElementById("drawing-upload-complete-btn-ok").addEventListener("click", async () => {
            const file = fileInput.files[0];
            if (!file) {
                showToast("Silakan pilih file drawing terlebih dahulu!", "warning");
                return;
            }

            showToast("Mengunggah file drawing...", "info");
            const fd = new FormData();
            fd.append("file", file);
            fd.append("uploader", state.currentUser ? state.currentUser.fullname : "");

            try {
                const res = await fetch(`/api/drawings/${drawingId}`, {
                    method: "PUT",
                    body: fd
                });
                if (!res.ok) {
                    let errMsg = "Gagal mengunggah file drawing";
                    try {
                        const errData = await res.json();
                        if (errData && errData.message) {
                            errMsg = errData.message;
                        }
                    } catch (e) {}
                    throw new Error(errMsg);
                }

                showToast("File drawing berhasil diunggah!", "success");
                await initData();
                renderDrawings();
                
                cleanUp();
                resolve(true);

                // ponytail: setelah upload sukses, langsung trigger action completion
                setTimeout(() => {
                    moveDrawingStatus(drawingId, 'approve');
                }, 100);

            } catch (err) {
                console.error(err);
                showToast(err.message || "Gagal mengunggah file", "error");
            }
        });
    });
}

// ponytail: Helper to upload a drawing file directly from a Kanban board card
async function triggerCardDrawingUpload(drawingId) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.type = "file";
    fileInput.accept = "image/*,.pdf";

    fileInput.onchange = async () => {
        const file = fileInput.files[0];
        if (!file) return;

        const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            showToast("Format file tidak didukung! Hanya file PDF atau gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan.", "error");
            return;
        }

        showToast("Mengunggah file drawing...", "info");

        const fd = new FormData();
        fd.append("file", file);
        fd.append("uploader", state.currentUser ? state.currentUser.fullname : "");

        try {
            const res = await fetch(`/api/drawings/${drawingId}`, {
                method: "PUT",
                body: fd
            });
            if (!res.ok) throw new Error("Gagal mengunggah file drawing");

            showToast("File drawing berhasil diunggah!", "success");
            await initData();
            renderDrawings();
        } catch (err) {
            console.error(err);
            showToast(err.message || "Gagal mengunggah file", "error");
        }
    };

    fileInput.click();
}

async function archiveDrawingCard(drawingId) {
    const confirmArchive = await showCustomConfirm(`Apakah Anda yakin ingin mengarsipkan drawing ${drawingId}?`);
    if (!confirmArchive) return;

    try {
        const now = new Date().toLocaleString('id-ID', { hour12: false }).replace(/\//g, '-');
        const uploaderName = state.currentUser ? state.currentUser.fullname : 'System';
        const newLog = {
            date: now,
            message: `Drawing diarsip oleh ${uploaderName}.`
        };

        const res = await fetch(`/api/drawings/${drawingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: 'Archived',
                logs: [newLog]
            })
        });
        if (!res.ok) throw new Error("Gagal mengarsipkan drawing");

        showToast("Drawing berhasil diarsipkan!", "success");
        await initData();
        renderDrawings();
    } catch (err) {
        showToast(err.message || "Gagal mengarsipkan drawing", "error");
    }
}

// ponytail: Helper to get action transition buttons for Drawing cards on the board, ensuring click propagation is stopped
function getDrawingCardActions(d) {
    const userRole = state.currentUser ? state.currentUser.role : '';
    const userFullname = state.currentUser ? state.currentUser.fullname : '';
    const isAssigned = d.engineer === userFullname;

    const isForeman = userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server';
    const isSupervisor = userRole === 'Supervisor' || userRole === 'Server';
    const isManager = userRole === 'Manager' || userRole === 'Plant Manager' || userRole === 'Server';

    let buttons = '';

    const isUploader = state.currentUser && (d.uploader === state.currentUser.fullname || d.uploader === state.currentUser.username || d.requester === state.currentUser.fullname || d.requester === state.currentUser.username);

    if (d.status === 'Pending Foreman Approval') {
        if (!d.file_path) {
            if (isUploader) {
                buttons += `
                    <button class="btn btn-danger-outline btn-xs" onclick="event.stopPropagation(); deleteDrawing('${d.id}')">Batal / Hapus</button>
                    <button class="btn btn-outline btn-xs" onclick="event.stopPropagation(); editDrawingByUser('${d.id}')">Edit</button>
                `;
            } else if (isForeman) {
                buttons += `
                    <button class="btn btn-danger-outline btn-xs" onclick="event.stopPropagation(); moveDrawingStatus('${d.id}', 'reject')">Tolak</button>
                    <button class="btn btn-primary btn-xs" onclick="event.stopPropagation(); moveDrawingStatus('${d.id}', 'approve')">Setujui &rarr;</button>
                `;
            }
        } else {
            // Official sign-off step (On Progress column)
            if (isForeman) {
                buttons += `
                    <button class="btn btn-outline btn-xs" onclick="event.stopPropagation(); moveDrawingStatus('${d.id}', 'reject')">&larr; Tolak</button>
                    <button class="btn btn-primary btn-xs" onclick="event.stopPropagation(); moveDrawingStatus('${d.id}', 'approve')">Setujui &rarr;</button>
                `;
            }
        }
    } else if (d.status === 'Checking') {
        if (isUploader) {
            buttons += `
                <button class="btn btn-danger-outline btn-xs" onclick="event.stopPropagation(); deleteDrawing('${d.id}')">Batal / Hapus</button>
                <button class="btn btn-outline btn-xs" onclick="event.stopPropagation(); editDrawingByUser('${d.id}')">Edit</button>
            `;
        } else if (isForeman) {
            buttons += `
                <button class="btn btn-outline btn-xs" onclick="event.stopPropagation(); moveDrawingStatus('${d.id}', 'reject')">&larr; Balikkan</button>
                <button class="btn btn-primary btn-xs" onclick="event.stopPropagation(); moveDrawingStatus('${d.id}', 'approve')">Mulai Kerja &rarr;</button>
            `;
        }
    } else if (d.status === 'On Progress') {
        // ponytail: Foreman/User hanya approve/tolak, bukan selesaikan
        if (isAssigned) {
            if (d.file_path) {
                buttons += `<button class="btn btn-primary btn-xs" onclick="event.stopPropagation(); moveDrawingStatus('${d.id}', 'approve')">Selesaikan &rarr;</button>`;
            } else {
                buttons += `
                    <button class="btn btn-primary btn-xs" onclick="event.stopPropagation(); triggerCardDrawingCompleteUpload('${d.id}')">Selesaikan &rarr;</button>
                `;
            }
        }
    } else if (d.status === 'Pending Supervisor Approval') {
        if (isSupervisor) {
            buttons += `
                <button class="btn btn-danger-outline btn-xs" onclick="event.stopPropagation(); moveDrawingStatus('${d.id}', 'reject')">Tolak</button>
                <button class="btn btn-primary btn-xs" onclick="event.stopPropagation(); moveDrawingStatus('${d.id}', 'approve')">Setujui &rarr;</button>
            `;
        }
    } else if (d.status === 'Pending Manager Approval') {
        if (isManager) {
            buttons += `
                <button class="btn btn-danger-outline btn-xs" onclick="event.stopPropagation(); moveDrawingStatus('${d.id}', 'reject')">Tolak</button>
                <button class="btn btn-primary btn-xs" onclick="event.stopPropagation(); moveDrawingStatus('${d.id}', 'approve')">Setujui &rarr;</button>
            `;
        }
    } else if (d.status === 'Pending Requester Approval') {
        const isRequester = (userFullname === d.requester || userFullname === d.uploader || userRole === 'Admin' || userRole === 'Server');
        if (isRequester) {
            buttons += `
                <button class="btn btn-danger-outline btn-xs" onclick="event.stopPropagation(); moveDrawingStatus('${d.id}', 'reject')">Tolak</button>
                <button class="btn btn-primary btn-xs" onclick="event.stopPropagation(); moveDrawingStatus('${d.id}', 'approve')">Setujui &rarr;</button>
            `;
        }
    } else if (d.status === 'Completed') {
        const isRequester = (userFullname === d.requester || userFullname === d.uploader || userRole === 'Admin' || userRole === 'Server');
        if (isRequester || userRole === 'Foreman') {
            buttons += `
                <button class="btn btn-primary btn-xs glow-button" onclick="event.stopPropagation(); archiveDrawingCard('${d.id}')">Konfirmasi Selesai & Arsipkan</button>
            `;
        }
    }

    if (!buttons) {
        if (d.status === 'Completed') {
            return `<span class="text-xs text-green" style="font-weight: 500;"><i data-lucide="check-circle" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:2px;"></i>Selesai</span>`;
        }
        if (d.status === 'Rejected') {
            return `<span class="text-xs text-red" style="font-weight: 500;">Ditolak</span>`;
        }
        return '';
    }

    return buttons;
}

// ponytail: Update General EJO status directly from Kanban card with a log entry and signature approval flow
async function moveGeneralEjoStatus(ejoId, nextStatus) {
    const ejo = getVisibleGeneralEjos().find(item => item.id === ejoId);
    if (!ejo) return;

    const oldStatus = ejo.status;
    let rejectionReason = "";
    let rejectionImage = null;
    let nextDescription = undefined;
    let rejectionSignature = null;
    let finalEstDate = ejo.estDate || "";

    // ponytail: rename Lead Engineer -> Foreman
    const isLead = state.currentUser && (isLeadRole(state.currentUser.role));
    const isAssigned = state.currentUser && ejo.engineer && ejo.engineer.split(',').map(name => name.trim()).includes(state.currentUser.fullname);
    const isRequester = checkIsRequester(ejo.requester);
    const isForeman = state.currentUser && isForemanAdminRole(state.currentUser.role);

    let canMove = false;
    if (nextStatus === 'In Progress') {
        if (oldStatus === 'Approved' || oldStatus.startsWith('Checking')) {
            canMove = isForeman || isAssigned;
        } else if (oldStatus === 'Pending User Approval') canMove = isRequester;
        else if (oldStatus === 'Pending Foreman Approval') canMove = isForeman;
    } else {
        if (oldStatus === 'Requested') {
            canMove = isForeman;
        } else if (oldStatus === 'Approved' || oldStatus.startsWith('Checking')) {
            canMove = isForeman;
        } else if (oldStatus.startsWith('In Progress') && nextStatus === 'Pending User Approval') {
            canMove = isLead || isAssigned;
        } else if (oldStatus.startsWith('In Progress') && (nextStatus === 'Checking' || nextStatus === 'Requested')) {
            // ponytail: allow foreman/assignee to revert in progress back to checking or requested
            canMove = isForeman || isAssigned;
        } else if (oldStatus === 'Pending User Approval' && nextStatus === 'Pending Foreman Approval') {
            canMove = isRequester;
        } else if (oldStatus === 'Pending Foreman Approval' && nextStatus === 'Completed') {
            canMove = isForeman;
        }
    }

    if (!canMove) {
        if (oldStatus === 'Pending User Approval' && !isRequester) {
            showToast("Hanya User (Requester) pemohon EJO yang dapat memproses status ini!", "error");
        } else if (oldStatus === 'Pending Foreman Approval' && !isForeman) {
            showToast("Hanya Foreman / Admin yang dapat memproses status ini!", "error");
        } else {
            showToast("Anda tidak memiliki akses untuk memproses status ini!", "error");
        }
        return;
    }

    // ponytail: confirm start work or handle rejection routing
    let finalStatus = nextStatus;
    const approvalsObj = { ...(ejo.approvals || {}) };
    const now = new Date();
    const timestamp = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, '0') + "-" +
        String(now.getDate()).padStart(2, '0') + " " +
        String(now.getHours()).padStart(2, '0') + ":" +
        String(now.getMinutes()).padStart(2, '0');

    if (nextStatus === 'In Progress') {
        if (oldStatus === 'Approved' || oldStatus.startsWith('Checking')) {
            const confirmStart = await showCustomConfirm(
                "Apakah Anda sudah benar-benar mengecek pekerjaan ini dan siap untuk mulai bekerja?",
                "Konfirmasi Mulai Kerja"
            );
            if (!confirmStart) return;
        } else if (oldStatus.startsWith('Pending')) {
            // Build target routing options based on who is rejecting
            let options = [];
            if (oldStatus === 'Pending Foreman Approval') {
                options = [
                    { value: 'Pending User Approval', label: 'Kembalikan ke User (Requester)' },
                    { value: 'In Progress', label: 'Kembalikan ke Drafter (In Progress)' }
                ];
            } else if (oldStatus === 'Pending User Approval') {
                options = [
                    { value: 'In Progress', label: 'Kembalikan ke Drafter (In Progress)' }
                ];
            }

            const rejectionResult = await showGeneralEjoRejectionModal(options);
            if (!rejectionResult) return; // Cancelled

            // ponytail: signature prompt disabled for General EJO
            finalStatus = rejectionResult.target;
            rejectionReason = rejectionResult.reason;
            rejectionImage = rejectionResult.image;
            rejectionSignature = null;

            // Handle revision status numbers if target is In Progress
            if (finalStatus === 'In Progress') {
                const revMatch = oldStatus.match(/\(Revisi \d+\)/);
                if (revMatch) {
                    finalStatus = `In Progress ${revMatch[0]}`;
                } else {
                    finalStatus = getPreviousInProgressStatus(ejo);
                }
            }

            // Clear approvals signatures depending on rejection target
            if (finalStatus.startsWith('In Progress') || finalStatus === 'Pending User Approval') {
                // Clear all
                for (let key in approvalsObj) delete approvalsObj[key];
                if (finalStatus.startsWith('In Progress')) {
                    const parsed = parseEjoDescription(ejo.description);
                    nextDescription = buildEjoDescription(parsed.descText, "", parsed.attachments);
                }
            } else if (finalStatus === 'Pending Foreman Approval') {
                delete approvalsObj.foreman;
            }
        }
    } else {
        // Approving: require signature upload
        if (oldStatus === 'Pending User Approval' && nextStatus === 'Pending Foreman Approval') {
            // ponytail: signature prompt disabled for General EJO
            approvalsObj.user = {
                username: state.currentUser.username,
                name: state.currentUser.fullname,
                signature: "approved",
                date: timestamp
            };
        } else if (oldStatus === 'Pending Foreman Approval' && nextStatus === 'Completed') {
            // ponytail: signature prompt disabled for General EJO
            approvalsObj.foreman = {
                username: state.currentUser.username,
                name: state.currentUser.fullname,
                signature: "approved",
                date: timestamp
            };
        }
    }

    // ponytail: custom popup modal for approving general EJO with engineer checkboxes and checking sub-status radios
    let finalEngineer = ejo.engineer || 'Unassigned';
    let finalTargetDate = ejo.targetDate;
    if (finalStatus === 'Approved' || finalStatus === 'Checking') {
        const approvalData = await showGeneralEjoApprovalModal(ejo);
        if (!approvalData) return; // User cancelled

        if (approvalData.engineers.length === 0) {
            showToast("Pekerjaan tidak dapat disetujui tanpa penugasan engineer!", "warning");
            return;
        }

        // ponytail: signature prompt disabled for General EJO
        rejectionSignature = null;

        // ponytail: upload drawing if Drawing Ready is checked
        if (approvalData.drawingFile) {
            try {
                await uploadDrawingFileDuringApproval(ejo, approvalData.drawingFile);
            } catch (err) {
                return; // Stop EJO approval if drawing upload fails
            }
        }

        finalEngineer = approvalData.engineers.join(', ');
        // ponytail: transition directly to In Progress on approval/assignment
        finalStatus = 'In Progress';
        finalEstDate = approvalData.estDate;
    } else if (finalStatus === 'Cancelled') {
        // ponytail: ask for reason on rejection/cancellation
        const reason = await showCustomPrompt(
            "Masukkan alasan penolakan/pembatalan EJO ini:",
            "",
            "Alasan Penolakan"
        );
        if (reason === null) return; // User cancelled
        if (reason.trim() === "") {
            showToast("Alasan penolakan wajib diisi!", "warning");
            return;
        }
        rejectionReason = reason.trim();
        rejectionSignature = null; // ponytail: signature prompt disabled for General EJO
    } else if (finalStatus === 'Requested' && oldStatus.startsWith('In Progress')) {
        // ponytail: signature prompt disabled for General EJO
        rejectionSignature = null;
        finalEngineer = 'Unassigned';
    }

    // ponytail: require explanation when completing a revised EJO or when Drafter/RestrictedCompleter completes EJO
    let completionReason = "";
    let completionSignature = null;
    const isDrafter = state.currentUser && isDrafterRole(state.currentUser.role);
    const isRestrictedCompleter = state.currentUser && ['Foreman', 'Supervisor', 'Manager', 'Plant Manager'].includes(state.currentUser.role);

    if (oldStatus.startsWith("In Progress") && finalStatus === "Pending User Approval") {
        let completeData = null;
        if (oldStatus.includes("(Revisi ")) {
            const explanation = await showCustomPrompt(
                "Pekerjaan revisi ini memerlukan penjelasan penyelesaian. Silakan masukkan keterangan (apa saja yang direvisi & di bagian mana):",
                "",
                "Laporan Penyelesaian Revisi"
            );
            if (explanation === null) return; // User cancelled
            if (explanation.trim() === "") {
                showToast("Keterangan revisi wajib diisi untuk menyelesaikan pekerjaan!", "warning");
                return;
            }
            completeData = { message: explanation.trim(), attachments: (parseEjoDescription(ejo.description).attachments || []) };
        } else {
            if (isDrafter || isRestrictedCompleter) {
                const data = await showGeneralEjoCompletionModal(ejo);
                if (data === null) return; // User cancelled
                completeData = data;
            }
        }

        if (completeData) {
            completionReason = (oldStatus.includes("(Revisi ") ? "Laporan Revisi: " : "Laporan Penyelesaian: ") + completeData.message.trim();
            const parsed = parseEjoDescription(ejo.description);
            nextDescription = buildEjoDescription(parsed.descText, completionReason, completeData.attachments);
        }
    }

    let logMessage = `Status dirubah dari ${oldStatus} menjadi ${finalStatus} oleh ${state.currentUser ? state.currentUser.fullname : 'User'}.${rejectionReason ? ' Alasan Penolakan: ' + rejectionReason : ''}`;
    if (rejectionImage) {
        logMessage += `<br/><img src="${rejectionImage}" onclick="openRejectionImage(this.src)" style="max-width: 100%; max-height: 150px; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); margin-top: 8px; cursor: pointer; display: block; object-fit: contain;" title="Klik untuk memperbesar gambar bukti penolakan" />`;
    }
    if (rejectionSignature) {
        logMessage += `<br/><div style="margin-top: 8px; display: inline-flex; flex-direction: column; align-items: flex-start; gap: 4px;"><span class="text-xs text-secondary" style="font-weight: 500;">Tanda Tangan Penolakan:</span><img src="${rejectionSignature}" style="max-width: 120px; max-height: 60px; background: #ffffff; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); display: block; object-fit: contain; padding: 2px;" /></div>`;
    }
    if (completionSignature) {
        logMessage += `<br/><div style="margin-top: 8px; display: inline-flex; flex-direction: column; align-items: flex-start; gap: 4px;"><span class="text-xs text-secondary" style="font-weight: 500;">Tanda Tangan Penyelesaian (${state.currentUser.role}):</span><img src="${completionSignature}" style="max-width: 120px; max-height: 60px; background: #ffffff; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); display: block; object-fit: contain; padding: 2px;" /></div>`;
    }

    if (finalStatus === 'Requested') {
        finalEstDate = "";
    }

    const updatedFields = {
        status: finalStatus,
        engineer: finalEngineer,
        estCost: ejo.estCost || 0,
        actCost: ejo.actCost || 0,
        approvals: approvalsObj,
        targetDate: finalTargetDate,
        estDate: finalEstDate,
        logs: [{
            date: timestamp,
            message: logMessage
        }]
    };
    if (nextDescription !== undefined) {
        updatedFields.description = nextDescription;
    }

    try {
        const res = await fetch(`/api/general-ejos/${ejoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFields)
        });
        if (!res.ok) throw new Error("Gagal mengubah status General EJO");

        await initData();
        showToast(`General EJO ${ejoId} dipindahkan ke ${finalStatus}`, "success");
    } catch (err) {
        console.error(err);
        showToast("Gagal memindahkan status di database server!", "error");
    }
}

// ponytail: Delete/cancel General EJO directly from Kanban card
async function deleteGeneralEjo(ejoId) {
    const ejo = getVisibleGeneralEjos().find(item => item.id === ejoId);
    if (!ejo) return;

    const isLead = state.currentUser && (isLeadRole(state.currentUser.role));
    const isRestrictedRole = state.currentUser && ['Foreman', 'Supervisor', 'Manager', 'Plant Manager'].includes(state.currentUser.role);
    const isRequester = checkIsRequester(ejo.requester);
    const isSchedulePhase = ejo.status === 'Requested' || ejo.status === 'Approved' || (ejo.status || '').startsWith('Checking');

    let canDelete = (isLead && !isRestrictedRole) || (isRequester && isSchedulePhase);
    if (!canDelete) {
        showToast("Anda tidak memiliki wewenang untuk tindakan ini!", "error");
        return;
    }

    const confirmDel = await showCustomConfirm(`Apakah Anda yakin ingin membatalkan General Job Order ${ejoId}?`);
    if (!confirmDel) return;

    try {
        const queryParam = `?requester=${encodeURIComponent(state.currentUser.username)}`;
        const res = await fetch(`/api/general-ejos/${ejoId}${queryParam}`, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error("Gagal menghapus General EJO");

        await initData();
        showToast(`General Job Order ${ejoId} berhasil dibatalkan`, "warning");
        renderGeneralEJO();
    } catch (err) {
        console.error(err);
        showToast("Gagal membatalkan General EJO di database server!", "error");
    }
}

// ponytail: parseLogs helper to safely parse logs string or array, with caching to prevent lag from large base64 signatures
function parseLogs(ejoOrLogs) {
    let list = [];
    if (!ejoOrLogs) {
        list = [];
    } else if (Array.isArray(ejoOrLogs)) {
        list = ejoOrLogs;
    } else if (typeof ejoOrLogs === 'object') {
        if (ejoOrLogs._parsedLogs) return ejoOrLogs._parsedLogs;
        let logs = ejoOrLogs.logs || [];
        if (Array.isArray(logs)) {
            ejoOrLogs._parsedLogs = logs;
            list = logs;
        } else if (typeof logs === 'string') {
            try {
                const parsed = JSON.parse(logs);
                ejoOrLogs._parsedLogs = parsed;
                list = parsed;
            } catch (e) {
                console.error("Gagal parse logs:", e);
                ejoOrLogs._parsedLogs = [];
                list = [];
            }
        } else {
            ejoOrLogs._parsedLogs = [];
            list = [];
        }
    } else if (typeof ejoOrLogs === 'string') {
        try {
            list = JSON.parse(ejoOrLogs);
        } catch (e) {
            list = [];
        }
    }

    // ponytail: populate cleanMessage to avoid running regexes on huge base64 signature/image strings
    if (Array.isArray(list)) {
        list.forEach(log => {
            if (log && log.message && typeof log.message === 'string' && !log.hasOwnProperty('cleanMessage')) {
                log.cleanMessage = log.message.split(/<br|<div|<img/i)[0].trim();
            }
        });
    }
    return list;
}

// ponytail: Calculate next revision status based on logs
function getNextRevisionStatus(ejo) {
    let maxRev = 0;
    const logs = parseLogs(ejo);
    logs.forEach(log => {
        const msg = log.cleanMessage || (log && typeof log.message === 'string' ? log.message : '');
        const match = msg.match(/In Progress \(Revisi (\d+)\)/);
        if (match) {
            const num = parseInt(match[1]);
            if (num > maxRev) maxRev = num;
        }
    });
    return `In Progress (Revisi ${maxRev + 1})`;
}

// ponytail: Helper to calculate the current revision count from logs
function getCurrentRevisionCount(ejo) {
    let maxRev = 0;
    const logs = parseLogs(ejo);
    logs.forEach(log => {
        const message = log.cleanMessage || (log && typeof log.message === 'string' ? log.message : '');
        const match = message.match(/\(Revisi (\d+)\)/);
        if (match) {
            const num = parseInt(match[1]);
            if (num > maxRev) maxRev = num;
        }
    });
    return maxRev;
}

// ponytail: Get the most recent In Progress status from logs to preserve revision numbers when rejecting approval
function getPreviousInProgressStatus(ejo) {
    const logs = parseLogs(ejo);
    for (let i = logs.length - 1; i >= 0; i--) {
        const msg = logs[i].cleanMessage || (logs[i] && typeof logs[i].message === 'string' ? logs[i].message : "");
        const match = msg.match(/Status dirubah dari (In Progress \(Revisi \d+\)|In Progress) menjadi (Pending Approval|Pending User Approval)/);
        if (match) {
            return match[1];
        }
    }
    let maxRev = 0;
    logs.forEach(log => {
        const msg = log.cleanMessage || (log && typeof log.message === 'string' ? log.message : '');
        const match = msg.match(/In Progress \(Revisi (\d+)\)/);
        if (match) {
            const num = parseInt(match[1]);
            if (num > maxRev) maxRev = num;
        }
    });
    if (maxRev > 0) {
        return `In Progress (Revisi ${maxRev})`;
    }
    return "In Progress";
}

// ponytail: Request EJO revision (changes status to Pending Revision)
async function requestEJORevision(ejoId) {
    let isGeneral = false;
    let ejo = state.ejos.find(e => e.id === ejoId);
    if (!ejo) {
        ejo = getVisibleGeneralEjos().find(e => e.id === ejoId);
        if (ejo) isGeneral = true;
    }
    if (!ejo) return;

    // ponytail: block revision if General EJO has already been revised once
    if (isGeneral && getCurrentRevisionCount(ejo) >= 1) {
        showToast("Batas maksimal revisi untuk General EJO adalah 1x!", "error");
        return;
    }

    // ponytail: rename Lead Engineer -> Foreman
    const isLead = state.currentUser && (isLeadRole(state.currentUser.role));

    let nextStatus = 'Pending Revision';
    let logMessage = '';

    if (isLead) {
        // Leader directly starts the revision with detailed instructions
        const explanationResult = await showCustomPrompt(
            "Masukkan rincian apa saja yang harus direvisi & di bagian mana:",
            "",
            "Instruksi Revisi (Lead/Admin)",
            true
        );
        if (explanationResult === null) return; // User cancelled
        const explanation = explanationResult.text;
        const fileUrl = explanationResult.fileUrl;
        if (explanation.trim() === "") {
            showToast("Instruksi revisi wajib diisi!", "warning");
            return;
        }
        nextStatus = getNextRevisionStatus(ejo);
        let attachmentText = fileUrl ? ` [Attachment: ${fileUrl}]` : '';
        logMessage = `Revisi DIAJUKAN oleh Lead/Admin - ${state.currentUser ? state.currentUser.fullname : 'Admin'}. Status kembali menjadi ${nextStatus}. Instruksi revisi: ${explanation.trim()}${attachmentText}`;
    } else {
        const explanationResult = await showCustomPrompt(
            "Masukkan alasan pengajuan revisi pekerjaan ini (bagian mana yang bermasalah & mengapa):",
            "",
            "Pengajuan Revisi",
            true
        );
        if (explanationResult === null) return; // User cancelled
        const explanation = explanationResult.text;
        const fileUrl = explanationResult.fileUrl;
        if (explanation.trim() === "") {
            showToast("Alasan pengajuan revisi wajib diisi!", "warning");
            return;
        }
        let attachmentText = fileUrl ? ` [Attachment: ${fileUrl}]` : '';
        logMessage = `Pengajuan REVISI diajukan oleh ${state.currentUser ? state.currentUser.fullname : 'User'}. Alasan revisi: ${explanation.trim()}${attachmentText}`;
    }

    const now = new Date();
    const timestamp = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, '0') + "-" +
        String(now.getDate()).padStart(2, '0') + " " +
        String(now.getHours()).padStart(2, '0') + ":" +
        String(now.getMinutes()).padStart(2, '0');

    const updatedFields = {
        status: nextStatus,
        engineer: ejo.engineer || 'Unassigned',
        estCost: ejo.estCost || 0,
        actCost: ejo.actCost || 0,
        logs: [{
            date: timestamp,
            message: logMessage
        }]
    };

    try {
        const apiUrl = isGeneral ? `/api/general-ejos/${ejo.id}` : `/api/ejos/${ejo.id}`;
        const res = await fetch(apiUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFields)
        });
        if (!res.ok) throw new Error("Gagal mengajukan revisi");

        await initData();
        closeModal();
        showToast(isLead ? `Revisi ${ejo.id} berhasil dimulai!` : "Pengajuan revisi berhasil diajukan!", "success");
    } catch (err) {
        console.error(err);
        showToast("Gagal menyimpan pengajuan revisi ke database server!", "error");
    }
}

// ponytail: Approve or Reject EJO revision
async function approveEJORevision(ejoId, isApproved) {
    let isGeneral = false;
    let ejo = state.ejos.find(e => e.id === ejoId);
    if (!ejo) {
        ejo = getVisibleGeneralEjos().find(e => e.id === ejoId);
        if (ejo) isGeneral = true;
    }
    if (!ejo) return;

    // ponytail: skip custom confirm modal for general EJO approval since we show the detailed assignment/upload modal
    if (!isGeneral || !isApproved) {
        const actionText = isApproved ? "menyetujui" : "menolak";
        const confirmApp = await showCustomConfirm(`Apakah Anda yakin ingin ${actionText} pengajuan revisi ini?`);
        if (!confirmApp) return;
    }

    let nextStatus = 'Completed';
    let logMessage = '';

    const now = new Date();
    const timestamp = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, '0') + "-" +
        String(now.getDate()).padStart(2, '0') + " " +
        String(now.getHours()).padStart(2, '0') + ":" +
        String(now.getMinutes()).padStart(2, '0');

    let finalEngineer = ejo.engineer || 'Unassigned';
    let finalTargetDate = ejo.targetDate;
    if (isApproved) {
        // ponytail: prevent approving if General EJO already reached max revision limit
        if (isGeneral && getCurrentRevisionCount(ejo) >= 1) {
            showToast("Batas maksimal revisi untuk General EJO adalah 1x!", "error");
            return;
        }
        if (isGeneral) {
            const approvalData = await showGeneralEjoApprovalModal(ejo);
            if (!approvalData) return; // User cancelled

            if (approvalData.engineers.length === 0) {
                showToast("Pekerjaan tidak dapat disetujui tanpa penugasan engineer!", "warning");
                return;
            }

            // ponytail: upload drawing if Drawing Ready is checked
            if (approvalData.drawingFile) {
                try {
                    await uploadDrawingFileDuringApproval(ejo, approvalData.drawingFile);
                } catch (err) {
                    return; // Stop revision approval if drawing upload fails
                }
            }

            finalEngineer = approvalData.engineers.join(', ');
            const nextRevCount = getCurrentRevisionCount(ejo) + 1;
            const revSuffix = ` (Revisi ${nextRevCount})`;

            nextStatus = `Checking (${approvalData.subStatus})` + revSuffix;
            finalTargetDate = approvalData.estDate;
        } else {
            nextStatus = getNextRevisionStatus(ejo);
        }
        logMessage = `Pengajuan revisi DISETUJUI oleh ${state.currentUser ? state.currentUser.fullname : 'Lead/Admin'}. Status kembali menjadi ${nextStatus}.`;
    } else {
        logMessage = `Pengajuan revisi DITOLAK oleh ${state.currentUser ? state.currentUser.fullname : 'Lead/Admin'}. Status kembali menjadi Completed.`;
    }

    const updatedFields = {
        status: nextStatus,
        engineer: finalEngineer,
        estCost: ejo.estCost || 0,
        actCost: ejo.actCost || 0,
        targetDate: finalTargetDate,
        logs: [{
            date: timestamp,
            message: logMessage
        }]
    };

    try {
        const apiUrl = isGeneral ? `/api/general-ejos/${ejo.id}` : `/api/ejos/${ejo.id}`;
        const res = await fetch(apiUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFields)
        });
        if (!res.ok) throw new Error("Gagal memproses revisi");

        await initData();
        closeModal();
        showToast(`Pengajuan revisi berhasil ${isApproved ? 'disetujui' : 'ditolak'}!`, "success");
    } catch (err) {
        console.error(err);
        showToast("Gagal menyimpan perubahan revisi ke database server!", "error");
    }
}

// ponytail: Archive General EJO (moves it to history and removes from Kanban)
async function archiveGeneralEJO(ejoId) {
    const ejo = getVisibleGeneralEjos().find(item => item.id === ejoId);
    if (!ejo) return;

    const confirmArch = await showCustomConfirm(`Apakah Anda yakin ingin memindahkan General EJO ${ejoId} ke History EJO?`);
    if (!confirmArch) return;

    const now = new Date();
    const timestamp = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, '0') + "-" +
        String(now.getDate()).padStart(2, '0') + " " +
        String(now.getHours()).padStart(2, '0') + ":" +
        String(now.getMinutes()).padStart(2, '0');

    const logMessage = `Pekerjaan selesai sepenuhnya dan diarsipkan ke History oleh ${state.currentUser ? state.currentUser.fullname : 'Lead/Admin'}.`;

    const updatedFields = {
        status: 'Completed',
        engineer: ejo.engineer || 'Unassigned',
        estCost: ejo.estCost || 0,
        actCost: ejo.actCost || 0,
        is_archived: 1,
        logs: [{
            date: timestamp,
            message: logMessage
        }]
    };

    try {
        const res = await fetch(`/api/general-ejos/${ejoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFields)
        });
        if (!res.ok) throw new Error("Gagal mengarsipkan General EJO");

        await initData();
        showToast(`General EJO ${ejoId} dipindahkan ke History`, "success");
    } catch (err) {
        console.error(err);
        showToast("Gagal mengarsipkan EJO ke database server!", "error");
    }
}


async function createNewProject() {
    const title = document.getElementById("proj-title").value;
    const dept = document.getElementById("proj-dept").value;
    const budget = parseInt(document.getElementById("proj-budget").value) || 0;
    const targetDate = "";
    const pic = state.currentUser ? state.currentUser.fullname : "System User";
    const desc = document.getElementById("proj-desc").value;

    // ponytail: validate file attachment extension before submission
    const fileInput = document.getElementById("proj-attachment");
    if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const ext = file.name.split('.').pop().toLowerCase();
        const allowed = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
        if (!allowed.includes(ext)) {
            showToast("Format file tidak didukung! Hanya diperbolehkan file foto (JPG, PNG, WEBP) atau PDF.", "warning");
            return;
        }
    }

    // Generate project code sequential
    const lastIdNum = state.projects.reduce((max, item) => {
        const parts = item.id.split('-');
        const num = parseInt(parts[2]);
        return num > max ? num : max;
    }, 3); // Starts from 3 based on mock dataset length

    const nextIdNum = lastIdNum + 1;
    const nextId = `PRJ-2026-${String(nextIdNum).padStart(3, '0')}`;

    // ponytail: create project directly without signature in Fase 1
    const approvals = {};

    const newProject = {
        id: nextId,
        title,
        dept,
        budget,
        targetDate,
        pic,
        desc,
        phase: 1, // Default to Phase 1: Inisialisasi Ide
        approvals: approvals
    };

    try {
        const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProject)
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || "Server error");
        }

        const resData = await res.json();
        const actualId = resData.id || nextId;

        // ponytail: Check if user uploaded a supporting attachment and upload it
        const fileInput = document.getElementById("proj-attachment");
        if (fileInput && fileInput.files.length > 0) {
            const fd = new FormData();
            fd.append("project_id", actualId);
            fd.append("file", fileInput.files[0]);
            fd.append("doc_type", "boq");

            const resUpload = await fetch("/api/projects/upload-doc", {
                method: "POST",
                body: fd
            });
            if (!resUpload.ok) {
                console.warn("Gagal mengunggah file pendukung, tetapi project berhasil dibuat.");
            }
        }

        await initData();

        // Reset Form
        document.getElementById("project-form").reset();
        document.getElementById("project-form-container").style.display = 'none';
        document.getElementById("btn-toggle-new-project").innerHTML = '<i data-lucide="plus-circle"></i> Project Baru';

        showToast(`Gagasan Project ${actualId} berhasil diajukan`, "success");
    } catch (err) {
        console.error(err);
        showToast(`Gagal menyimpan project ke database server! (${err.message})`, "error");
    }
}

async function moveProjectPhase(projId, direction) {
    const proj = state.projects.find(p => p.id === projId);
    if (!proj) return;

    const oldPhase = proj.phase;
    const newPhase = oldPhase + direction;

    if (newPhase >= 1 && newPhase <= 4) {
        let approvals = { ...(proj.approvals || {}) };

        // ponytail: restrict phase movement from Fase 2 to Foreman/Admin/Server only and require BOQ upload + signature confirmation
        if (oldPhase === 2) {
            const userRole = state.currentUser ? state.currentUser.role : "";
            const isAuthorized = userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server';
            if (!isAuthorized) {
                showToast("Hanya Foreman atau Admin yang berhak memindahkan fase project di Fase 2!", "error");
                return;
            }

            if (direction > 0) {
                // Check if BOQ file is uploaded
                const docs = proj.docs || [];
                const boqFiles = docs.filter(d => {
                    const ext = d.split('.').pop().toLowerCase();
                    return ['xlsx', 'xls', 'csv', 'pdf', 'jpg', 'jpeg', 'png', 'webp'].includes(ext);
                });
                if (boqFiles.length === 0) {
                    showToast("File BOQ belum diunggah! Silakan unggah file BOQ terlebih dahulu di detail project.", "warning");
                    openProjectDetails(null, projId);
                    return;
                }

                // Ask for signature confirmation
                const sig = await showSignatureModal(
                    `Konfirmasi TTD ${userRole}`,
                    "Silakan bubuhkan tanda tangan untuk mengonfirmasi bahwa barang/jasa telah ready.",
                    false
                );
                if (!sig) {
                    showToast("Konfirmasi tanda tangan dibatalkan.", "warning");
                    return;
                }

                // Save signature
                const now = new Date();
                const timestamp = now.getFullYear() + "-" +
                    String(now.getMonth() + 1).padStart(2, '0') + "-" +
                    String(now.getDate()).padStart(2, '0') + " " +
                    String(now.getHours()).padStart(2, '0') + ":" +
                    String(now.getMinutes()).padStart(2, '0');

                approvals.ready = {
                    signer: state.currentUser.fullname,
                    role: userRole,
                    date: timestamp,
                    signature: sig
                };
            } else if (oldPhase === 3) {
                const userRole = state.currentUser ? state.currentUser.role : "";
                const isAuthorized = userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server';
                if (!isAuthorized) {
                    showToast("Hanya Foreman atau Admin yang berhak memindahkan fase project di Fase 3!", "error");
                    return;
                }
            }
        }

        if (direction > 0) {
            // Moving forward: require all 4 signatures in approvals to move to Fase 2!
            if (oldPhase === 1) {
                const userRole = state.currentUser ? state.currentUser.role : "";
                const isAuthorized = userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server';
                if (!isAuthorized) {
                    showToast("Hanya Foreman atau Admin yang berhak menyetujui perpindahan project ke Fase 2!", "error");
                    return;
                }
                if (!approvals.pic || !approvals.foreman || !approvals.supervisor || !approvals.manager) {
                    showToast("Persetujuan bertingkat belum lengkap! Membuka detail proyek untuk ditandatangani...", "warning");
                    openProjectDetails(null, projId);
                    return;
                }
            } else if (oldPhase === 3) {
                // Selesaikan EJO: require at least one photo documentation
                const execDocs = proj.execution_docs || [];
                if (execDocs.length === 0) {
                    showToast("Gagal! Anda wajib mengunggah minimal 1 foto dokumentasi sebelum menyelesaikan EJO.", "warning");
                    return;
                }
            }
        }

        try {
            const res = await fetch(`/api/projects/${projId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phase: newPhase, approvals: approvals })
            });
            if (!res.ok) throw new Error("Gagal mengubah fase");

            await initData();

            if (newPhase === 4) {
                showToast(`Project ${proj.id} berhasil diselesaikan & diarsipkan`, "success");
            } else {
                showToast(`Project ${proj.id} dipindahkan ke Fase ${newPhase}`, "info");
            }
        } catch (err) {
            console.error(err);
            showToast("Gagal memindahkan fase di database server!", "error");
        }
    }
}

async function deleteProject(projId) {
    const confirmDel = await showCustomConfirm(`Apakah Anda yakin ingin membatalkan project ${projId}?`);
    if (!confirmDel) return;

    try {
        const res = await fetch(`/api/projects/${projId}`, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error("Gagal menghapus project");

        await initData();
        showToast(`Project ${projId} berhasil dibatalkan`, "warning");
    } catch (err) {
        console.error(err);
        showToast("Gagal membatalkan project di database server!", "error");
    }
}

// ponytail: upload project doc photos from Kanban card directly
async function uploadProjectDocFromCard(projId, inputEl) {
    const userRole = state.currentUser ? state.currentUser.role : "";
    const isAuthorized = userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server';
    if (!isAuthorized) {
        showToast("Hanya Foreman atau Admin yang diperbolehkan mengunggah foto dokumentasi!", "error");
        inputEl.value = "";
        return;
    }
    const files = inputEl.files;
    if (!files || files.length === 0) return;

    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    let uploadedCount = 0;

    // Upload files sequentially to prevent database locks or concurrent update issues
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowed.includes(ext)) {
            showToast(`Format file "${file.name}" tidak didukung! Hanya gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan.`, "error");
            continue;
        }

        const fd = new FormData();
        fd.append("file", file);
        fd.append("project_id", projId);
        fd.append("doc_type", "execution");

        try {
            const res = await fetch("/api/projects/upload-doc", {
                method: "POST",
                body: fd
            });
            const data = await res.json();
            if (!res.ok || data.status === "error") {
                throw new Error(data.message || "Gagal mengunggah foto");
            }

            const proj = state.projects.find(p => p.id === projId);
            if (proj) {
                proj.execution_docs = data.execution_docs;
            }
            uploadedCount++;
        } catch (err) {
            console.error(err);
            showToast(`Gagal mengunggah foto "${file.name}": ` + err.message, "error");
        }
    }

    if (uploadedCount > 0) {
        showToast(`${uploadedCount} Foto dokumentasi berhasil diunggah!`, "success");
    }
    inputEl.value = "";
    renderProjects();
}

// ponytail: complete EJO project card check & proceed
async function completeProjectFromCard(projId) {
    const userRole = state.currentUser ? state.currentUser.role : "";
    const isAuthorized = userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server';
    if (!isAuthorized) {
        showToast("Hanya Foreman atau Admin yang berhak melakukan tindakan ini di Fase 3!", "error");
        return;
    }

    const proj = state.projects.find(p => p.id === projId);
    if (!proj) return;

    const execDocs = proj.execution_docs || [];
    if (execDocs.length === 0) {
        showToast("Gagal! Anda wajib mengunggah minimal 1 foto dokumentasi sebelum menyelesaikan EJO.", "warning");
        return;
    }

    await moveProjectPhase(projId, 1);
}

async function convertProjectToEJO(projId) {
    if (state._isConverting) return;
    const proj = state.projects.find(p => p.id === projId);
    if (!proj) return;

    // ponytail: check General EJO & Drawing limits before conversion
    if (checkGeneralEjoLimit()) {
        showToast("Batas pembuatan General EJO tercapai! Anda tidak dapat mengkonversi project karena maksimal 2 General EJO aktif.", "warning");
        return;
    }
    if (checkDrawingLimit()) {
        showToast("Batas pembuatan Drawing tercapai! Anda tidak dapat mengkonversi project karena maksimal 2 Drawing aktif.", "warning");
        return;
    }

    state._isConverting = true;

    // Auto map PIC to a default EJO category
    // Ahmad Dani -> Mekanik, Budi Utomo -> Program, Charlie -> Sipil, Deddy -> Kalibrasi
    let ejoCategory = "Program";
    if (proj.pic === "Ahmad Dani") ejoCategory = "Mekanik";
    else if (proj.pic === "Charlie Santoso") ejoCategory = "Sipil";
    else if (proj.pic === "Deddy Corbuzier") ejoCategory = "Kalibrasi";

    // Generate General EJO Code
    const lastIdNum = (state.generalEjos || []).reduce((max, item) => {
        const parts = item.id.split('-');
        const num = parseInt(parts[1]);
        return num > max ? num : max;
    }, 5);

    const nextIdNum = lastIdNum + 1;
    const nextId = `GEJO-${String(nextIdNum).padStart(3, '0')}`;

    // ponytail: Allow custom General EJO ID for project approval/conversion
    const customId = await showCustomPrompt(
        "Masukkan ID General EJO Kustom untuk Project ini (atau biarkan default):",
        nextId,
        "Konversi ke General EJO"
    );
    if (customId === null) {
        state._isConverting = false;
        return; // cancel conversion
    }
    let finalId = nextId;
    if (customId.trim() !== "") {
        finalId = customId.trim();
    }

    const exists = (state.generalEjos || []).some(e => e.id === finalId);
    if (exists) {
        showToast(`ID General EJO "${finalId}" sudah terdaftar!`, "error");
        state._isConverting = false;
        return;
    }

    const now = new Date();
    const timestamp = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, '0') + "-" +
        String(now.getDate()).padStart(2, '0') + " " +
        String(now.getHours()).padStart(2, '0') + ":" +
        String(now.getMinutes()).padStart(2, '0');

    const newEjo = {
        id: finalId,
        title: `[PROJECT EKSEKUSI] ${proj.title}`,
        dept: proj.dept,
        category: ejoCategory,
        priority: "High", // High priority by default for capex execution
        location: "Project Site Lapangan",
        targetDate: proj.targetDate,
        estDate: proj.targetDate,
        status: "Checking (Drawing Ready)", // ponytail: Checking (Drawing Ready) immediately since the CapEx project itself is fully authorized
        engineer: proj.pic,
        estCost: proj.budget,
        actCost: 0,
        description: `Project Capex ${proj.id} yang telah disetujui. Detail PIC: ${proj.pic}. Deskripsi Rencana Kerja: ${proj.desc}`,
        requester: state.currentUser ? state.currentUser.fullname : (proj.pic || "System User"),
        logs: [
            { date: timestamp, message: `General EJO dibuat otomatis dari Papan Project Monitoring (${proj.id}).` }
        ]
    };

    try {
        // Create new General EJO
        const resEjo = await fetch("/api/general-ejos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEjo)
        });
        if (!resEjo.ok) throw new Error("Gagal menyimpan General EJO baru");

        // ponytail: Automatically create a Drawing Request in the Schedule column/phase (status: Pending Foreman Approval) connected to the EJO/Project
        const drawingFd = new FormData();
        drawingFd.append("title", `[PROJECT DRAWING] ${proj.title}`);
        drawingFd.append("ejo_id", finalId);
        drawingFd.append("uploader", state.currentUser ? state.currentUser.fullname : "System User");
        drawingFd.append("requester", state.currentUser ? state.currentUser.fullname : (proj.pic || "System User"));
        drawingFd.append("dept", proj.dept);
        drawingFd.append("category", ejoCategory);
        drawingFd.append("priority", "High");
        drawingFd.append("targetDate", proj.targetDate);
        drawingFd.append("location", "Project Site Lapangan");
        drawingFd.append("description", `Drawing teknis otomatis hasil konversi project capex ${proj.id}: ${proj.title}`);

        const resDrawing = await fetch("/api/drawings", {
            method: "POST",
            body: drawingFd
        });
        if (!resDrawing.ok) throw new Error("Gagal membuat Drawing Request otomatis");

        // Delete from projects list
        const resProj = await fetch(`/api/projects/${projId}`, {
            method: "DELETE"
        });
        if (!resProj.ok) throw new Error("Gagal menghapus project asal");

        await initData();

        showToast(`Project ${projId} dipromosikan menjadi General EJO ${finalId} dan Drawing Request otomatis berhasil dibuat!`, "success");

        // Switch to General EJO view
        switchTab("general-ejo");
    } catch (err) {
        console.error(err);
        showToast("Gagal mempromosikan project ke General EJO di database server!", "error");
    } finally {
        state._isConverting = false;
    }
}

// ponytail: Open project details modal
function openProjectDetails(event, projId) {
    // Prevent opening if clicking on an action button
    if (event && event.target.closest('.project-card-actions')) {
        return;
    }

    const proj = state.projects.find(p => p.id === projId);
    if (!proj) return;

    state.currentDetailProjectId = proj.id;

    document.getElementById("modal-project-id").textContent = proj.id;
    document.getElementById("modal-project-dept").textContent = getDepartmentDisplayLabel(proj.dept);
    document.getElementById("modal-project-title").textContent = proj.title;
    document.getElementById("modal-project-pic").textContent = proj.pic || "Belum ditentukan";

    let phaseText = "Fase 1: Inisialisasi Ide";
    if (proj.phase === 2) phaseText = "Fase 2: Pengadaan";
    else if (proj.phase === 3) phaseText = "Fase 3: Tinggal Eksekusi";
    else if (proj.phase === 4) phaseText = "Selesai & Diarsipkan";
    document.getElementById("modal-project-phase").textContent = phaseText;

    document.getElementById("modal-project-desc").textContent = proj.desc || "Tidak ada deskripsi.";

    // ponytail: Render project approvals signatures (4 roles)
    const approvals = proj.approvals || {};

    // ponytail: Set next signer info in details modal status badge
    const statusBadge = document.getElementById("modal-project-sig-status");
    if (statusBadge) {
        if (proj.phase === 1) {
            let nextRole = "Selesai";
            if (!approvals.pic) nextRole = "Pengusul";
            else if (!approvals.foreman) nextRole = "Foreman";
            else if (!approvals.supervisor) nextRole = "Supervisor";
            else if (!approvals.manager) nextRole = "Manager";
            statusBadge.style.display = "inline-block";
            statusBadge.textContent = `Menunggu TTD: ${nextRole}`;
        } else {
            statusBadge.style.display = "none";
        }
    }

    const roles = ['pic', 'foreman', 'supervisor', 'manager'];
    const userRole = state.currentUser ? state.currentUser.role : "";
    const userLevel = getRoleLevel(userRole);

    roles.forEach(r => {
        const cardEl = document.getElementById(`card-proj-sig-${r}`);
        const infoEl = document.getElementById(`proj-sig-info-${r}`);
        const imgContainer = document.getElementById(`proj-sig-img-container-${r}`);
        const app = approvals[r];

        if (cardEl && infoEl && imgContainer) {
            // Reset card styling
            cardEl.style.border = "1px solid var(--card-border)";
            cardEl.style.boxShadow = "none";

            if (app && app.signature) {
                infoEl.innerHTML = `Disetujui oleh:<br><strong>${app.signer}</strong><br><span style="font-size:0.7rem; color:var(--text-muted);">${app.date}</span>`;
                // ponytail: remove Hapus button from project details signature rendering
                imgContainer.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <img src="${app.signature}" style="max-height: 45px; background: #ffffff; padding: 2px; border: 1px solid var(--card-border); border-radius: 4px; object-fit: contain;" />
                    </div>
                `;
            } else {
                infoEl.textContent = "Menunggu Persetujuan";

                // ponytail: do not display Approve button or highlights in project detail modal
                let statusText = "Belum ditandatangani";
                // If it's blocked by previous sequence
                if (r === 'foreman' && !approvals.pic) statusText = "Menunggu Pengusul";
                else if (r === 'supervisor' && !approvals.foreman) statusText = "Menunggu Foreman";
                else if (r === 'manager' && !approvals.supervisor) statusText = "Menunggu Supervisor";
                else if (proj.phase === 1) {
                    // User role is not high enough
                    if (r === 'foreman') statusText = "Akses Foreman";
                    else if (r === 'supervisor') statusText = "Akses Supervisor";
                    else if (r === 'manager') statusText = "Akses Manager";
                }

                imgContainer.innerHTML = `<span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">${statusText}</span>`;
            }
        }
    });

    // ponytail: Render supporting attachments section for PDF and other files (all phases)
    const attachmentsSec = document.getElementById("project-attachments-section");
    const attachmentsList = document.getElementById("project-attachments-list");
    if (attachmentsSec && attachmentsList) {
        attachmentsList.innerHTML = "";
        // ponytail: Display all supporting BOQ attachments without filtering images
        const supportingDocs = proj.docs || [];

        const uploadMock = document.getElementById("proj-attachment-upload-mock");
        const isAuthorized = userRole === 'Foreman' || userRole === 'Admin' || userRole === 'Server';
        if (uploadMock) {
            uploadMock.style.display = (proj.phase === 2 && isAuthorized) ? "flex" : "none";
        }

        if (supportingDocs.length > 0 || (proj.phase === 2 && isAuthorized)) {
            attachmentsSec.style.display = "block";
            supportingDocs.forEach(docUrl => {
                const filename = docUrl.split('/').pop();
                const ext = docUrl.split('.').pop().toLowerCase();
                const isImg = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);

                let icon = "file-text";
                if (isImg) icon = "image";
                else if (ext === 'pdf') icon = "file-text";
                else if (['xlsx', 'xls', 'csv'].includes(ext)) icon = "file-spreadsheet";

                attachmentsList.insertAdjacentHTML('beforeend', `
                    <a href="${docUrl}" target="_blank" class="card-glass" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; font-size: 0.8rem; color: var(--text-primary); text-decoration: none; border: 1px solid var(--card-border); border-radius: var(--border-radius-sm); transition: background 0.2s; margin-bottom: 4px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="${icon}" style="width:16px; height:16px; color: var(--color-cyan);"></i>
                            <span>${filename}</span>
                        </div>
                        <i data-lucide="external-link" style="width:12px; height:12px; color: var(--text-muted);"></i>
                    </a>
                `);
            });
        } else {
            attachmentsSec.style.display = "none";
        }
    }

    // ponytail: Render project documentation section if in Phase 3 or Phase 4 (read-only in archive)
    const docsSec = document.getElementById("project-documentation-section");
    if (docsSec) {
        if (proj.phase === 3 || proj.phase === 4) {
            docsSec.style.display = "block";
            state.currentDetailProjectId = proj.id;

            // Render specific project docs inside modal
            const gallery = document.getElementById("project-docs-gallery");
            if (gallery) {
                gallery.innerHTML = "";
                const execDocs = proj.execution_docs || [];
                if (execDocs.length === 0) {
                    gallery.innerHTML = `<span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic; padding: 4px;">Belum ada foto dokumentasi.</span>`;
                } else {
                    execDocs.forEach(docUrl => {
                        gallery.insertAdjacentHTML('beforeend', `
                            <div style="position: relative; width: 110px; height: 80px; background: rgba(0,0,0,0.2); border-radius: var(--border-radius-sm); overflow: hidden; border: 1px solid var(--card-border);">
                                <img src="${docUrl}" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" onclick="window.open('${docUrl}', '_blank')" />
                            </div>
                        `);
                    });
                }
            }

            // Hide the upload mock button in Phase 4 (Archive) since it's completed
            const uploadMock = document.getElementById("proj-doc-upload-mock");
            if (uploadMock) {
                uploadMock.style.display = (proj.phase === 3) ? "flex" : "none";
            }
        } else {
            docsSec.style.display = "none";
        }
    }

    const modal = document.getElementById("project-detail-modal");
    if (modal) {
        modal.style.display = "flex";
    }
}

// ponytail: Interactive signing for 4 roles in Fase 1
async function signProjectRole(roleKey) {
    if (!state.currentDetailProjectId) return;
    const proj = state.projects.find(p => p.id === state.currentDetailProjectId);
    if (!proj) return;

    if (proj.phase !== 1) {
        showToast("Persetujuan hanya dapat diubah saat project berada di Fase 1!", "warning");
        return;
    }

    if (!state.currentUser) {
        showToast("Anda harus login terlebih dahulu!", "warning");
        return;
    }

    const approvals = { ...(proj.approvals || {}) };
    const userRole = state.currentUser.role;
    const userLevel = getRoleLevel(userRole);
    const existing = approvals[roleKey];

    // If already signed: allow deleting signature if they are Admin/Server or if they are the signer
    if (existing) {
        const signerLower = existing.signer.toLowerCase().trim();
        const currentFullnameLower = state.currentUser.fullname.toLowerCase().trim();
        const currentUsernameLower = (state.currentUser.username || "").toLowerCase().trim();
        const canDelete = currentFullnameLower === signerLower || currentUsernameLower === signerLower || isLeadRole(userRole);
        if (!canDelete) {
            showToast("Hanya penandatangan asli atau Admin yang dapat menghapus persetujuan ini!", "warning");
            return;
        }

        if (confirm(`Apakah Anda yakin ingin menghapus persetujuan ${roleKey.toUpperCase()}?`)) {
            // Sequential check: if we delete, we must also delete all higher levels that depend on it!
            if (roleKey === 'pic') {
                delete approvals.pic;
                delete approvals.foreman;
                delete approvals.supervisor;
                delete approvals.manager;
            } else if (roleKey === 'foreman') {
                delete approvals.foreman;
                delete approvals.supervisor;
                delete approvals.manager;
            } else if (roleKey === 'supervisor') {
                delete approvals.supervisor;
                delete approvals.manager;
            } else if (roleKey === 'manager') {
                delete approvals.manager;
            }

            await saveProjectApprovals(proj.id, approvals);
            showToast(`Persetujuan ${roleKey.toUpperCase()} berhasil dihapus.`, "info");
        }
        return;
    }

    // Checking sequence (Persetujuan Bertingkat)
    if (roleKey === 'foreman' && !approvals.pic) {
        showToast("Persetujuan bertingkat! Pengusul / Requestor harus menandatangani terlebih dahulu.", "warning");
        return;
    }
    if (roleKey === 'supervisor' && !approvals.foreman) {
        showToast("Persetujuan bertingkat! Foreman harus menandatangani terlebih dahulu.", "warning");
        return;
    }
    if (roleKey === 'manager' && !approvals.supervisor) {
        showToast("Persetujuan bertingkat! Supervisor harus menandatangani terlebih dahulu.", "warning");
        return;
    }

    // Checking authority for signing
    let roleLabel = "";
    if (roleKey === 'pic') {
        const isProjectPic = state.currentUser.fullname === proj.pic || state.currentUser.username === proj.pic || proj.pic === 'Belum ditentukan';
        if (!isProjectPic) {
            showToast("Hanya Pengusul / Requestor asli dari project ini yang dapat menandatangani bagian ini!", "warning");
            return;
        }
        roleLabel = "Tanda Tangan Pengusul / Requestor";
    } else if (roleKey === 'foreman') {
        // ponytail: only Foreman/Admin/Server can sign foreman slot
        if (userRole !== 'Foreman' && userRole !== 'Admin' && userRole !== 'Server') {
            showToast("Hanya Foreman yang dapat menyetujui!", "warning");
            return;
        }
        roleLabel = "Persetujuan Foreman";
    } else if (roleKey === 'supervisor') {
        // ponytail: only Supervisor/Admin/Server can sign supervisor slot
        if (userRole !== 'Supervisor' && userRole !== 'Admin' && userRole !== 'Server') {
            showToast("Hanya Supervisor yang dapat menyetujui!", "warning");
            return;
        }
        roleLabel = "Persetujuan Supervisor";
    } else if (roleKey === 'manager') {
        // ponytail: only Manager/Plant Manager/Admin/Server can sign manager slot
        if (userRole !== 'Manager' && userRole !== 'Plant Manager' && userRole !== 'Admin' && userRole !== 'Server') {
            showToast("Hanya Manager / Plant Manager yang dapat menyetujui!", "warning");
            return;
        }
        roleLabel = "Persetujuan Manager";
    }

    // ponytail: pass false as 3rd parameter to showSignatureModal so users can upload signatures if not saved in profile!
    const sig = await showSignatureModal(roleLabel, "Silakan bubuhkan tanda tangan untuk menyetujui gagasan proyek ini.", false);
    if (!sig) return;

    const now = new Date();
    const timestamp = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, '0') + "-" +
        String(now.getDate()).padStart(2, '0') + " " +
        String(now.getHours()).padStart(2, '0') + ":" +
        String(now.getMinutes()).padStart(2, '0');

    approvals[roleKey] = {
        signer: state.currentUser.fullname,
        role: userRole,
        date: timestamp,
        signature: sig
    };

    await saveProjectApprovals(proj.id, approvals);
    showToast(`Persetujuan ${roleKey.toUpperCase()} berhasil dibubuhkan.`, "success");
}

async function saveProjectApprovals(projId, approvals) {
    try {
        const res = await fetch(`/api/projects/${projId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ approvals: approvals })
        });
        if (!res.ok) throw new Error("Gagal menyimpan persetujuan");
        await initData();
        // Re-open details modal to refresh view
        openProjectDetails(null, projId);
    } catch (err) {
        console.error(err);
        showToast("Gagal menyimpan persetujuan ke database server!", "error");
    }
}

// ponytail: delete project signature from modal
async function deleteProjectSignature(roleKey) {
    if (!state.currentDetailProjectId) return;
    const proj = state.projects.find(p => p.id === state.currentDetailProjectId);
    if (!proj) return;

    if (proj.phase !== 1) {
        showToast("Persetujuan hanya dapat diubah saat project berada di Fase 1!", "warning");
        return;
    }

    const approvals = { ...(proj.approvals || {}) };
    const userRole = state.currentUser ? state.currentUser.role : "";
    const existing = approvals[roleKey];
    if (!existing) return;

    const signerLower = existing.signer.toLowerCase().trim();
    const currentFullnameLower = state.currentUser ? state.currentUser.fullname.toLowerCase().trim() : "";
    const currentUsernameLower = state.currentUser ? (state.currentUser.username || "").toLowerCase().trim() : "";
    const canDelete = state.currentUser && (currentFullnameLower === signerLower || currentUsernameLower === signerLower || isLeadRole(userRole));
    if (!canDelete) {
        showToast("Hanya penandatangan asli atau Admin yang dapat menghapus persetujuan ini!", "warning");
        return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus persetujuan ${roleKey.toUpperCase()}?`)) {
        if (roleKey === 'pic') {
            delete approvals.pic;
            delete approvals.foreman;
            delete approvals.supervisor;
            delete approvals.manager;
        } else if (roleKey === 'foreman') {
            delete approvals.foreman;
            delete approvals.supervisor;
            delete approvals.manager;
        } else if (roleKey === 'supervisor') {
            delete approvals.supervisor;
            delete approvals.manager;
        } else if (roleKey === 'manager') {
            delete approvals.manager;
        }

        await saveProjectApprovals(proj.id, approvals);
        showToast(`Persetujuan ${roleKey.toUpperCase()} berhasil dihapus.`, "info");
    }
}

// ponytail: Direct signing handler from card button
async function signProjectRoleDirect(event, projId, roleKey) {
    if (event) event.stopPropagation();
    state.currentDetailProjectId = projId;
    await signProjectRole(roleKey);
}

// Format Rupiah numbers for Capex display
function formatRupiah(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}

// ==========================================
// Admin Panel: User Database Handlers
// ==========================================
async function renderUsers() {
    try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Gagal mengambil data user");
        const users = await res.json();

        // ponytail: hide Server account and Server role users from all roles/positions
        const filteredUsers = users.filter(u => u.role !== 'Server' && u.username !== 'server');

        // ponytail: Keep engineersList and state synced with database users dynamically
        state.users = filteredUsers;
        engineersList = filteredUsers.map(u => ({
            name: u.fullname,
            role: u.role,
            avatar: u.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80'
        }));
        populateEngineerDropdowns();

        // ponytail: hide new user button and form for Foreman
        const toggleBtn = document.getElementById("btn-toggle-new-user");
        if (toggleBtn) {
            toggleBtn.style.display = (state.currentUser && state.currentUser.role === 'Foreman') ? 'none' : 'inline-flex';
        }
        const formContainer = document.getElementById("user-form-container");
        if (formContainer && state.currentUser && state.currentUser.role === 'Foreman') {
            formContainer.style.display = 'none';
        }

        const tbody = document.getElementById("user-table-body");
        if (!tbody) return;

        // ponytail: Foreman can only see Drafter and Admin accounts in the user list
        let displayUsers = filteredUsers;
        if (state.currentUser && state.currentUser.role === 'Foreman') {
            displayUsers = filteredUsers.filter(u => isDrafterRole(u.role) || u.role === 'Admin');
        }

        tbody.innerHTML = displayUsers.map(u => {
            const userAvatar = u.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80';
            return `
                <tr>
                    <td data-label="Avatar">
                        <img src="${userAvatar}" alt="${u.username}" class="user-table-avatar">
                    </td>
                    <td data-label="Username"><span class="user-username">${u.username}</span></td>
                    <td data-label="Nama Lengkap">${u.fullname}</td>
                    <td data-label="Role / Jabatan"><span class="user-role-badge">${u.role}</span></td>
                    <td data-label="Kredensial">
                        <div class="password-cell-wrapper">
                            ${state.currentUser && state.currentUser.role === 'Foreman' ? `
                                <span class="password-text">••••••</span>
                            ` : `
                                <span class="password-text" data-password="${u.password}">••••••</span>
                                <button type="button" class="btn-pw-toggle" onclick="toggleUserPasswordVisibility(this)" title="Tampilkan Password">
                                    <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
                                </button>
                            `}
                        </div>
                    </td>
                    <td>
                        ${state.currentUser && state.currentUser.role === 'Foreman' ? `
                            <button class="btn btn-outline btn-xs" style="gap:4px;" onclick="contactAdminForUser('${u.username}')">
                                <i data-lucide="message-square" style="width: 12px; height: 12px;"></i> Hubungi Admin
                            </button>
                        ` : `
                            <div class="user-actions-cell">
                                <button class="btn-user-edit" onclick="editUser('${u.username}', '${u.fullname}', '${u.role}', '${u.avatar || ''}', '${u.password}')">
                                    <i data-lucide="edit-3" style="width: 12px; height: 12px;"></i> Edit
                                </button>
                                <button class="btn-user-delete" onclick="deleteUser('${u.username}')">
                                    <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i> Hapus
                                </button>
                            </div>
                        `}
                    </td>
                </tr>
            `;
        }).join('');
        lucide.createIcons();
    } catch (err) {
        console.error("Gagal merender data user:", err);
        showToast("Gagal mengambil data user dari server!", "error");
    }
}

function resetUserForm() {
    const form = document.getElementById("user-admin-form");
    if (form) form.reset();

    const usrInput = document.getElementById("usr-username");
    if (usrInput) usrInput.disabled = false;

    const pwContainer = document.getElementById("user-password-field-container");
    const pwInput = document.getElementById("usr-password");
    if (pwInput) {
        if (state.currentUser && state.currentUser.role === 'Foreman') {
            pwInput.value = "123456"; // Default password for new users created by Foreman
            pwInput.disabled = true;
            pwInput.removeAttribute("required");
            if (pwContainer) pwContainer.style.display = "none";
        } else {
            pwInput.disabled = false;
            pwInput.setAttribute("required", "required");
            if (pwContainer) pwContainer.style.display = "block";
        }
    }

    const modeInput = document.getElementById("user-form-mode");
    if (modeInput) modeInput.value = "add";

    const titleEl = document.getElementById("user-form-title");
    if (titleEl) titleEl.textContent = "Daftarkan User Baru";

    const submitBtn = document.getElementById("btn-save-user-submit");
    if (submitBtn) submitBtn.innerHTML = '<i data-lucide="save"></i> Simpan User';

    if (state.currentUser && state.currentUser.role === 'Foreman') {
        const roleSelect = document.getElementById("usr-role");
        if (roleSelect) roleSelect.value = "Drafter";
    }
}

async function saveUserData() {
    const mode = document.getElementById("user-form-mode").value;
    const username = document.getElementById("usr-username").value.trim().toLowerCase();
    const password = document.getElementById("usr-password").value;
    const fullname = document.getElementById("usr-fullname").value.trim();
    const role = document.getElementById("usr-role").value;
    const avatarInput = document.getElementById("usr-avatar").value.trim();

    // Fallback default avatar if empty
    const avatar = avatarInput || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80';

    const userData = {
        username,
        password,
        fullname,
        role,
        avatar,
        creator_username: state.currentUser ? state.currentUser.username : ""
    };

    try {
        if (mode === "add") {
            // Post new user
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Gagal mendaftarkan user baru");
            }
            showToast(`User "${username}" berhasil didaftarkan`, "success");
        } else {
            // Put existing user
            const res = await fetch(`/api/users/${username}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });
            if (!res.ok) throw new Error("Gagal memperbarui data user");
            showToast(`User "${username}" berhasil diperbarui`, "success");
        }

        resetUserForm();
        document.getElementById("user-form-container").style.display = 'none';
        document.getElementById("btn-toggle-new-user").innerHTML = '<i data-lucide="plus-circle"></i> Daftarkan User';
        lucide.createIcons();

        renderUsers();
    } catch (err) {
        console.error(err);
        showToast(err.message || "Gagal menyimpan data user ke database server!", "error");
    }
}

// ponytail: Filter new user form role select options based on hierarchy level
function filterUserRoleOptions() {
    const select = document.getElementById("usr-role");
    if (!select) return;
    
    // ponytail: fallback to safeSessionStorage if state.currentUser is not yet loaded
    const currentUser = state.currentUser || (safeSessionStorage.getItem("PTBAS_USER") ? JSON.parse(safeSessionStorage.getItem("PTBAS_USER")) : null);
    if (!currentUser) return;
    
    const role = currentUser.role || "";
    const isForeman = role === 'Foreman';
    const currentLevel = getRoleLevel(role);
    const isServer = role === 'Server' || currentUser.username === 'server' || role.toLowerCase() === 'server';

    Array.from(select.options).forEach(opt => {
        if (isForeman) {
            // Foreman can only manage Drafter and Admin users
            if (isDrafterRole(opt.value) || opt.value === 'Admin') {
                opt.style.display = 'block';
            } else {
                opt.style.display = 'none';
            }
        } else {
            const optLevel = getRoleLevel(opt.value);
            if (isServer) {
                opt.style.display = 'block';
            } else if (currentLevel > optLevel) {
                opt.style.display = 'block';
            } else {
                opt.style.display = 'none';
            }
        }
    });
}

// Global functions for table actions
window.editUser = function (username, fullname, role, avatar, password) {
    const formContainer = document.getElementById("user-form-container");
    const toggleBtn = document.getElementById("btn-toggle-new-user");
    const titleEl = document.getElementById("user-form-title");
    const submitBtn = document.getElementById("btn-save-user-submit");

    if (formContainer) formContainer.style.display = 'block';
    if (toggleBtn) {
        toggleBtn.innerHTML = '<i data-lucide="minus-circle"></i> Sembunyikan Form';
        lucide.createIcons();
    }
    if (titleEl) titleEl.textContent = `Edit User: ${username}`;
    if (submitBtn) submitBtn.innerHTML = '<i data-lucide="save"></i> Perbarui User';

    document.getElementById("user-form-mode").value = "edit";

    const usrInput = document.getElementById("usr-username");
    usrInput.value = username;
    usrInput.disabled = true;

    const pwContainer = document.getElementById("user-password-field-container");
    const pwInput = document.getElementById("usr-password");
    if (pwInput) {
        pwInput.value = password;
        if (state.currentUser && state.currentUser.role === 'Foreman') {
            pwInput.disabled = true;
            pwInput.removeAttribute("required");
            if (pwContainer) pwContainer.style.display = "none";
        } else {
            pwInput.disabled = false;
            pwInput.setAttribute("required", "required");
            if (pwContainer) pwContainer.style.display = "block";
        }
    }
    document.getElementById("usr-fullname").value = fullname;
    filterUserRoleOptions();
    document.getElementById("usr-role").value = role;
    document.getElementById("usr-avatar").value = avatar;
};

window.deleteUser = async function (username) {
    if (state.currentUser && state.currentUser.username === username) {
        showToast("Anda tidak bisa menghapus akun Anda sendiri yang sedang aktif!", "error");
        return;
    }

    const confirmDel = await showCustomConfirm(`Apakah Anda yakin ingin menghapus user "${username}"?`);
    if (!confirmDel) return;

    try {
        const res = await fetch(`/api/users/${username}?requester=${state.currentUser.username}`, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error("Gagal menghapus user");

        showToast(`User "${username}" berhasil dihapus`, "warning");
        renderUsers();
    } catch (err) {
        console.error(err);
        showToast("Gagal menghapus user dari database server!", "error");
    }
};

window.contactAdminForUser = function (username) {
    showToast(`Hubungi admin utama (nova) untuk memodifikasi akun "${username}".`, "info");
};

window.toggleUserPasswordVisibility = function (button) {
    const wrapper = button.closest('.password-cell-wrapper');
    const textSpan = wrapper.querySelector('.password-text');

    const actualPassword = textSpan.getAttribute('data-password');
    const isMasked = textSpan.textContent === '••••••';

    if (isMasked) {
        textSpan.textContent = actualPassword;
        textSpan.classList.add('revealed');
        button.setAttribute('title', 'Sembunyikan Password');
        button.innerHTML = '<i data-lucide="eye-off" style="width: 14px; height: 14px;"></i>';
    } else {
        textSpan.textContent = '••••••';
        textSpan.classList.remove('revealed');
        button.setAttribute('title', 'Tampilkan Password');
        button.innerHTML = '<i data-lucide="eye" style="width: 14px; height: 14px;"></i>';
    }
    lucide.createIcons();
};

// ponytail: Handle direct deletion of EJO history records (supporting regular, general EJO, drawing, and project types)
window.deleteHistoryEJO = async function (id) {
    // ponytail: restrict delete for restricted roles
    const isRestrictedRole = state.currentUser && ['Foreman', 'Supervisor', 'Manager', 'Plant Manager'].includes(state.currentUser.role);
    if (isRestrictedRole) {
        showToast("Jabatan Anda tidak berhak menghapus Riwayat EJO!", "error");
        return;
    }

    const confirmDelete = await showCustomConfirm(`Apakah Anda yakin ingin menghapus Riwayat Job Order ${id}?`);
    if (!confirmDelete) return;

    const isProject = id.startsWith('PRJ');
    const isDrawing = id.startsWith('DRW');
    const isGeneral = state.generalEjos && state.generalEjos.some(ge => ge.id === id);
    const queryParam = `?requester=${encodeURIComponent(state.currentUser.username)}`;
    let apiUrl;
    if (isProject) {
        apiUrl = `/api/projects/${id}${queryParam}`;
    } else if (isDrawing) {
        apiUrl = `/api/drawings/${id}${queryParam}`;
    } else if (isGeneral) {
        apiUrl = `/api/general-ejos/${id}${queryParam}`;
    } else {
        apiUrl = `/api/ejos/${id}${queryParam}`;
    }

    try {
        const res = await fetch(apiUrl, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error("Gagal menghapus EJO");

        await initData();
        showToast(`Riwayat Job Order ${id} telah dihapus`, "warning");
    } catch (err) {
        console.error(err);
        showToast("Gagal menghapus EJO dari database server!", "error");
    }
};

// ponytail: Global error visualizer to help debug runtime errors in UI
window.addEventListener('error', function (e) {
    console.error("Global Error Caught:", e.error);
    showToast("System Error: " + e.message + " (at " + (e.filename ? e.filename.split('/').pop() : 'script') + ":" + e.lineno + ")", "error");
});

// ponytail: helper mapping functions for Excel Export/Import
function mapDeptToExcel(dept) {
    return normalizeDepartmentCode(dept);
}

function mapCategoryToExcel(cat) {
    const mapping = {
        'Sipil': 'CIV',
        'Mekanik': 'MEC',
        'Elektrik': 'ELC',
        'Kalibrasi': 'CAL',
        'Otomotif': 'AUT',
        'Program': 'PRG',
        // ponytail: added Repair Part Excel mapping
        'Repair Part': 'RPP'
    };
    return mapping[cat] || cat || '';
}

function mapStatusToExcel(status) {
    const mapping = {
        'Requested': 'Unprocessed Ticket',
        'Approved': 'Schedule',
        'In Progress': 'Progres',
        'Completed': 'Completed',
        'Cancelled': 'Cancelled'
    };
    if (status && status.startsWith('Checking')) return 'Schedule';
    return mapping[status] || status || '';
}

function getCompletedDateFromLogs(ejoOrLogs) {
    const parsed = parseLogs(ejoOrLogs);
    const compLog = parsed.find(log => {
        // ponytail: handle non-string messages and missing fields safely
        if (!log) return false;
        const msg = log.cleanMessage || log.message;
        if (typeof msg !== 'string') return false;
        return msg.includes('selesai') || msg.includes('Completed') || msg.includes('selesai dilakukan');
    });
    if (compLog && typeof compLog.date === 'string') {
        return compLog.date.split(' ')[0];
    }
    return '';
}

function exportToExcel() {
    const searchVal = document.getElementById("search-input").value.toLowerCase();
    const statusVal = document.getElementById("filter-status").value;
    const priorityVal = document.getElementById("filter-priority").value;
    const deptVal = document.getElementById("filter-dept").value;

    const filtered = state.ejos.filter(ejo => {
        const matchesSearch = !searchVal ||
            ejo.id.toLowerCase().includes(searchVal) ||
            (ejo.title && ejo.title.toLowerCase().includes(searchVal)) ||
            (ejo.description && ejo.description.toLowerCase().includes(searchVal)) ||
            (ejo.location && ejo.location.toLowerCase().includes(searchVal)) ||
            (ejo.engineer && ejo.engineer.toLowerCase().includes(searchVal));

        const matchesStatus = statusVal === 'all' || ejo.status === statusVal;
        const matchesPriority = priorityVal === 'all' || ejo.priority === priorityVal;
        const matchesDept = departmentMatchesFilter(ejo.dept, deptVal);

        return matchesSearch && matchesStatus && matchesPriority && matchesDept;
    });

    if (filtered.length === 0) {
        showToast("Tidak ada data untuk diekspor!", "warning");
        return;
    }

    // Build HTML Table with purple header (#7030a0)
    let html = `
    <html>
    <head>
    <meta charset="utf-8">
    <style>
    table { border-collapse: collapse; font-family: sans-serif; }
    th { background-color: #7030a0; color: #ffffff; font-weight: bold; text-align: center; border: 0.5pt solid #cccccc; padding: 8px; }
    td { border: 0.5pt solid #cccccc; padding: 8px; }
    </style>
    </head>
    <body>
    <table>
      <thead>
        <tr>
          <th>Dep</th>
          <th>Tin</th>
          <th>Ticket ID</th>
          <th>Date</th>
          <th>Subject</th>
          <th>Description</th>
          <th>Requestor</th>
          <th>Status</th>
          <th>Date Done</th>
          <th>PIC ACTION</th>
        </tr>
      </thead>
      <tbody>
    `;

    filtered.forEach(e => {
        const dateVal = e.targetDate ? e.targetDate + " - 00:00:00" : "";
        html += `
        <tr>
          <td>${mapDeptToExcel(e.dept)}</td>
          <td>${mapCategoryToExcel(e.category)}</td>
          <td>${e.id}</td>
          <td>${dateVal}</td>
          <td>${e.title || ""}</td>
          <td>${e.description || ""}</td>
          <td>${e.requester || ""}</td>
          <td>${mapStatusToExcel(e.status)}</td>
          <td>${getCompletedDateFromLogs(e)}</td>
          <td>${(e.engineer || "Unassigned").toUpperCase()}</td>
        </tr>
        `;
    });

    html += `
      </tbody>
    </table>
    </body>
    </html>
    `;

    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    a.href = url;
    a.download = `EJO-Export-${dateStr}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Excel berhasil diekspor!", "success");
}

function mapExcelToDept(val) {
    if (!val) return 'PRD';
    const clean = val.toUpperCase().trim();
    if (clean === 'UTL') return 'ENG';
    return normalizeDepartmentCode(clean);
}

function mapExcelToCategory(val) {
    if (!val) return 'Mekanik';
    const clean = val.toUpperCase().trim();
    if (clean === 'CIV') return 'Sipil';
    if (clean === 'MEC') return 'Mekanik';
    if (clean === 'ELC') return 'Elektrik';
    if (clean === 'CAL' || clean === 'KLB') return 'Kalibrasi';
    if (clean === 'AUT' || clean === 'OTO') return 'Otomotif';
    if (clean === 'PRG') return 'Program';
    // ponytail: added Repair Part clean conversion mapping
    if (clean === 'RPP' || clean === 'REP' || clean === 'RPT') return 'Repair Part';

    const cats = ['Sipil', 'Elektrik', 'Kalibrasi', 'Mekanik', 'Otomotif', 'Program', 'Repair Part'];
    const found = cats.find(c => c.toUpperCase() === clean);
    return found || val;
}

function mapExcelToStatus(val) {
    if (!val) return 'Requested';
    const clean = val.toUpperCase().trim();
    if (clean.includes('UNPROCESSED') || clean.includes('CEK')) return 'Requested';
    if (clean.includes('SCHEDULE') || clean.includes('APPROV')) return 'Approved';
    if (clean.includes('PROGRES') || clean.includes('PLAY')) return 'In Progress';
    if (clean.includes('COMPLET') || clean.includes('DONE')) return 'Completed';
    if (clean.includes('CANCEL')) return 'Cancelled';
    return 'Requested';
}

// ponytail: robust Excel date parsing with serial conversion and format fallback
function parseExcelDate(val) {
    if (val === null || val === undefined) return null;
    if (val instanceof Date) {
        if (!isNaN(val.getTime())) {
            const yyyy = val.getFullYear();
            const mm = String(val.getMonth() + 1).padStart(2, '0');
            const dd = String(val.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
    }
    const str = String(val).trim();
    if (!str) return null;

    // YYYY-MM-DD or YYYY/MM/DD
    const matchYMD = str.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
    if (matchYMD) {
        return `${matchYMD[1]}-${matchYMD[2]}-${matchYMD[3]}`;
    }

    // Excel serial number
    const num = Number(str);
    if (!isNaN(num) && isFinite(num) && num > 0) {
        const date = new Date((num - 25569) * 86400 * 1000);
        if (!isNaN(date.getTime())) {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
    }

    // Parse other formats
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
        const yyyy = parsed.getFullYear();
        const mm = String(parsed.getMonth() + 1).padStart(2, '0');
        const dd = String(parsed.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    return null;
}

async function importFromExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function (e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            let sheetName = workbook.SheetNames[0];
            if (workbook.SheetNames.length > 1) {
                sheetName = await new Promise((resolve) => {
                    const modal = document.getElementById("excel-sheet-modal");
                    const select = document.getElementById("excel-sheet-select");
                    const list = document.getElementById("excel-sheet-list");
                    const selectedInfo = document.getElementById("excel-sheet-selected");
                    const confirmBtn = document.getElementById("excel-sheet-btn-confirm");
                    const cancelBtn = document.getElementById("excel-sheet-btn-cancel");
                    const closeBtn = document.getElementById("excel-sheet-close-btn");
                    let selectedSheet = workbook.SheetNames[workbook.SheetNames.length - 1];

                    const updateSelectedSheet = (name) => {
                        selectedSheet = name;
                        select.value = name;
                        selectedInfo.textContent = `Sheet terpilih: ${name}`;
                        Array.from(list.querySelectorAll(".excel-sheet-option")).forEach((button) => {
                            const isActive = button.dataset.sheetName === name;
                            button.classList.toggle("active", isActive);
                            button.setAttribute("aria-selected", String(isActive));
                        });
                    };

                    // Clear options and fill them
                    select.innerHTML = '';
                    list.innerHTML = '';
                    workbook.SheetNames.forEach(name => {
                        const opt = document.createElement("option");
                        opt.value = name;
                        opt.textContent = name;
                        select.appendChild(opt);

                        const button = document.createElement("button");
                        button.type = "button";
                        button.className = "excel-sheet-option";
                        button.dataset.sheetName = name;
                        button.setAttribute("role", "option");
                        const title = document.createElement("span");
                        title.className = "excel-sheet-option-title";
                        title.textContent = name;

                        const meta = document.createElement("span");
                        meta.className = "excel-sheet-option-meta";
                        meta.textContent = "Klik untuk memilih sheet ini";

                        button.appendChild(title);
                        button.appendChild(meta);
                        button.addEventListener("click", () => updateSelectedSheet(name));
                        button.addEventListener("dblclick", () => {
                            updateSelectedSheet(name);
                            cleanup();
                            resolve(selectedSheet);
                        });
                        list.appendChild(button);
                    });

                    const handleBackdropClick = (event) => {
                        if (event.target === modal) {
                            cleanup();
                            resolve(null);
                        }
                    };

                    function cleanup() {
                        modal.removeEventListener("click", handleBackdropClick);
                        confirmBtn.replaceWith(confirmBtn.cloneNode(true));
                        cancelBtn.replaceWith(cancelBtn.cloneNode(true));
                        closeBtn.replaceWith(closeBtn.cloneNode(true));
                        modal.classList.remove("active");
                    }

                    updateSelectedSheet(selectedSheet);
                    modal.classList.add("active");
                    modal.addEventListener("click", handleBackdropClick);

                    document.getElementById("excel-sheet-btn-confirm").addEventListener("click", () => {
                        cleanup();
                        resolve(selectedSheet);
                    });

                    document.getElementById("excel-sheet-btn-cancel").addEventListener("click", () => {
                        cleanup();
                        resolve(null);
                    });

                    document.getElementById("excel-sheet-close-btn").addEventListener("click", () => {
                        cleanup();
                        resolve(null);
                    });
                });

                if (!sheetName) return; // Cancelled
            }

            const worksheet = workbook.Sheets[sheetName];

            // ponytail: auto-detect header row index by searching for 'Ticket ID'
            let headerRowIndex = 0;
            const ref = worksheet['!ref'];
            if (ref) {
                const range = XLSX.utils.decode_range(ref);
                for (let r = range.s.r; r <= range.e.r; r++) {
                    const rowValues = [];
                    for (let c = range.s.c; c <= range.e.c; c++) {
                        const cell = worksheet[XLSX.utils.encode_cell({ r, c })];
                        if (cell && cell.v !== undefined && cell.v !== null) {
                            rowValues.push(String(cell.v).trim().toLowerCase());
                        }
                    }
                    if (rowValues.includes('ticket id')) {
                        headerRowIndex = r;
                        break;
                    }
                }
            }

            const rows = XLSX.utils.sheet_to_json(worksheet, { range: headerRowIndex });

            if (rows.length === 0) {
                showToast("File Excel kosong atau tidak menemukan kolom 'Ticket ID'!", "warning");
                return;
            }

            let importCount = 0;
            const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

            for (const row of rows) {
                const ticketId = row['Ticket ID'] ? String(row['Ticket ID']).trim() : null;
                if (!ticketId) continue;

                const title = row['Subject'] ? String(row['Subject']).trim() : 'Imported EJO';

                // Primary 'Dept.', fallback to 'Dep'
                const deptVal = row['Dept.'] || row['Dep'];
                const dept = mapExcelToDept(deptVal);

                // Primary 'Tim' or 'Category', fallback to 'Tin'
                const categoryVal = row['Tim'] || row['Category'] || row['Tin'];

                // Skip rows where the category is 'AC' or 'MEC&ELC'
                if (categoryVal) {
                    const cleanCat = String(categoryVal).toUpperCase().trim();
                    if (cleanCat === 'AC' || cleanCat === 'MEC&ELC') {
                        continue;
                    }
                }

                const category = mapExcelToCategory(categoryVal);

                // ponytail: extract creation date (Date) and target date (Schedule) from spreadsheet
                const parsedDate = parseExcelDate(row['Date']);
                const parsedSchedule = parseExcelDate(row['Schedule']);
                const createdDate = parsedDate || new Date().toISOString().split('T')[0];
                const targetDate = parsedSchedule || parsedDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
                const description = row['Description'] ? String(row['Description']).trim() : 'Diimpor dari file Excel.';
                const requester = row['Requestor'] ? String(row['Requestor']).trim() : (state.currentUser ? state.currentUser.fullname : 'System Import');
                const status = mapExcelToStatus(row['Status']);
                const pic = row['PIC ACTION'] ? String(row['PIC ACTION']).trim() : 'Unassigned';

                let matchedEngineer = 'Unassigned';
                if (pic !== 'Unassigned') {
                    const cleanPic = pic.toUpperCase();
                    const found = engineersList.find(eng => eng.name.toUpperCase().includes(cleanPic) || cleanPic.includes(eng.name.toUpperCase()));
                    if (found) {
                        matchedEngineer = found.name;
                    } else {
                        matchedEngineer = pic;
                    }
                }

                const existing = (state.generalEjos || []).find(item => item.id.toLowerCase() === ticketId.toLowerCase());

                // ponytail: safely clone/parse existing logs or initialize to an empty array
                let logsList = [];
                if (existing && existing.logs) {
                    try {
                        logsList = Array.isArray(existing.logs) ? [...existing.logs] : JSON.parse(existing.logs);
                    } catch (err) {
                        logsList = [];
                    }
                }

                // Parse completion date if status is Completed
                let completionDate = null;
                if (row['Date Done']) {
                    completionDate = parseExcelDate(row['Date Done']);
                }

                if (status === 'Completed') {
                    const hasCompletionLog = logsList.some(log => {
                        if (!log) return false;
                        const msgText = log.cleanMessage || log.message;
                        return typeof msgText === 'string' &&
                            (msgText.includes('selesai') || msgText.includes('Completed') || msgText.includes('selesai dilakukan'));
                    });
                    if (!hasCompletionLog) {
                        const logDate = completionDate ? completionDate + " 00:00" : timestamp;
                        logsList.push({
                            date: logDate,
                            message: "EJO selesai dilakukan."
                        });
                    }
                }

                const ejoData = {
                    id: ticketId,
                    title: title,
                    dept: dept,
                    category: category,
                    priority: 'Medium',
                    location: 'Pabrik PT. BAS',
                    targetDate: targetDate,
                    status: status,
                    engineer: matchedEngineer,
                    estCost: existing ? existing.estCost : 0,
                    actCost: existing ? existing.actCost : 0,
                    description: description,
                    requester: requester,
                    logs: logsList,
                    // ponytail: import the parsed creation date from Excel
                    createdDate: createdDate
                };

                if (existing) {
                    ejoData.logs.push({
                        date: timestamp,
                        message: `EJO diperbarui melalui import Excel oleh ${state.currentUser ? state.currentUser.fullname : 'System'}.`
                    });
                    const res = await fetch(`/api/general-ejos/${existing.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(ejoData)
                    });
                    if (!res.ok) {
                        console.error("Gagal mengupdate EJO: " + ticketId);
                    } else {
                        // ponytail: only increment count if response is ok
                        importCount++;
                    }
                } else {
                    ejoData.logs.push({
                        date: timestamp,
                        message: `EJO dibuat melalui import Excel oleh ${state.currentUser ? state.currentUser.fullname : 'System'}.`
                    });
                    const res = await fetch("/api/general-ejos", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(ejoData)
                    });
                    if (!res.ok) {
                        console.error("Gagal membuat EJO: " + ticketId);
                    } else {
                        // ponytail: only increment count if response is ok
                        importCount++;
                    }
                }
            }

            showToast(`${importCount} EJO berhasil diproses!`, "success");
            await initData();
            switchTab("general-ejo");
        } catch (err) {
            console.error(err);
            showToast("Gagal membaca atau memproses file Excel!", "error");
        } finally {
            event.target.value = '';
        }
    };
    reader.readAsArrayBuffer(file);
}

// ponytail: self check suite for Excel mappings
// ponytail: self check suite for Excel mappings using custom assert to throw actual errors
function runExcelSelfTest() {
    function assert(condition, message) {
        if (!condition) throw new Error(message);
    }
    try {
        assert(mapDeptToExcel('Production') === 'PRD', 'Dept translation failed');
        assert(mapExcelToDept('PRD') === 'PRD', 'Excel to Dept translation failed');
        assert(mapExcelToDept('Maintenance') === 'WRH', 'Legacy maintenance alias failed');
        assert(mapExcelToDept('Utility') === 'ENG', 'Legacy utility alias failed');
        assert(mapCategoryToExcel('Sipil') === 'CIV', 'Category translation failed');
        assert(mapExcelToCategory('CIV') === 'Sipil', 'Excel to Category translation failed');
        // ponytail: added Repair Part self tests
        assert(mapCategoryToExcel('Repair Part') === 'RPP', 'Repair Part category translation failed');
        assert(mapExcelToCategory('RPP') === 'Repair Part', 'Excel to Repair Part category translation failed');
        assert(mapExcelToCategory('REP') === 'Repair Part', 'Excel REP alias to Repair Part category translation failed');
        assert(mapStatusToExcel('Requested') === 'Unprocessed Ticket', 'Status translation failed');
        assert(mapExcelToStatus('Unprocessed Ticket') === 'Requested', 'Excel to Status translation failed');
        console.log("Excel Self Test: OK");
    } catch (e) {
        console.error("Excel Self Test: FAILED", e);
    }
}

// ponytail: Apply overview chart grid layout based on status prop show/hide setting
window.applyDashboardSettings = function () {
    let showProp = true;
    if (state.settings && state.settings.show_status_prop !== undefined) {
        showProp = state.settings.show_status_prop !== "0" && state.settings.show_status_prop !== 0;
    }
    const grid = document.getElementById("overview-charts-grid");
    const toggleInput = document.getElementById("toggle-status-prop");

    if (grid) {
        grid.classList.toggle("hide-status-prop", !showProp);
    }
    if (toggleInput) {
        toggleInput.checked = showProp;
    }

    // ponytail: resize trend chart to adapt to the new full width
    if (state.charts.trend) {
        state.charts.trend.resize();
    }
};

// ponytail: Apply Maintenance Mode status to toggle inputs in UI
window.applyMaintenanceSettings = function () {
    const toggleMaintenance = document.getElementById("toggle-maintenance-mode");
    const maintenanceStatusText = document.getElementById("maintenance-mode-status-text");
    if (toggleMaintenance && state.settings && state.settings.maintenance_mode !== undefined) {
        const isMaintenance = state.settings.maintenance_mode === "1" || state.settings.maintenance_mode === 1;
        toggleMaintenance.checked = isMaintenance;
        if (maintenanceStatusText) {
            maintenanceStatusText.textContent = isMaintenance ? "Aktif" : "Nonaktif";
            maintenanceStatusText.style.color = isMaintenance ? "#f59e0b" : "var(--text-primary)";
        }
    }
};

// ponytail: dedicated function to complete EJO from details modal with validations and confirmation
async function completeEJODetails() {
    if (!state.selectedEJO) return;

    let isGeneral = false;
    let ejo = state.ejos.find(e => e.id === state.selectedEJO.id);
    if (!ejo) {
        ejo = getVisibleGeneralEjos().find(e => e.id === state.selectedEJO.id);
        if (ejo) isGeneral = true;
    }
    if (!ejo) return;

    // ponytail: restrict for Foreman and Admin per user request
    if (state.currentUser && state.currentUser.role === 'Admin') {
        showToast("Admin tidak berhak menyelesaikan pekerjaan!", "error");
        return;
    }
    if (!isGeneral && state.currentUser && state.currentUser.role === 'Foreman') {
        showToast("Foreman tidak berhak menyelesaikan pekerjaan!", "error");
        return;
    }

    // 1. Validate log is filled
    const logTextarea = document.getElementById("modal-new-log");
    const logMessage = logTextarea ? logTextarea.value.trim() : "";
    if (logMessage === "") {
        showToast("Catatan Laporan Kerja wajib diisi untuk menjelaskan penyelesaian pekerjaan!", "warning");
        if (logTextarea) logTextarea.focus();
        return;
    }

    // 2. Confirmation
    const confirmComplete = await showCustomConfirm(
        "Apakah Anda yakin ingin menyelesaikan pekerjaan ini?",
        "Selesaikan Pekerjaan"
    );
    if (!confirmComplete) return;

    // 3. Determine target status
    const isLead = state.currentUser && (isLeadRole(state.currentUser.role));
    let nextStatus = isLead ? 'Pending Requester Approval' : 'Pending Approval';
    if (isGeneral) {
        // ponytail: first stage is always User/Requester approval for general EJOs
        nextStatus = 'Pending User Approval';
    }
    const oldStatus = ejo.status;

    let logMessageFormatted = `Status dirubah dari ${oldStatus} menjadi ${nextStatus}.`;

    // ponytail: require signature disabled for General EJO as requested by user

    // 4. Send updates
    const now = new Date();
    const timestamp = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, '0') + "-" +
        String(now.getDate()).padStart(2, '0') + " " +
        String(now.getHours()).padStart(2, '0') + ":" +
        String(now.getMinutes()).padStart(2, '0');

    const parsed = parseEjoDescription(ejo.description);
    const nextDescription = buildEjoDescription(parsed.descText, "Laporan Penyelesaian: " + logMessage, state.currentModalAttachments);

    const updatedFields = {
        status: nextStatus,
        engineer: ejo.engineer || 'Unassigned',
        estCost: ejo.estCost || 0,
        actCost: ejo.actCost || 0,
        description: nextDescription,
        estDate: ejo.estDate || "",
        logs: [
            {
                date: timestamp,
                message: logMessageFormatted
            }
        ]
    };

    const completeBtn = document.getElementById("btn-complete-ejo");
    let originalHtml = "";
    if (completeBtn) {
        originalHtml = completeBtn.innerHTML;
        completeBtn.disabled = true;
        completeBtn.textContent = "Menyimpan...";
    }

    try {
        const apiUrl = isGeneral ? `/api/general-ejos/${ejo.id}` : `/api/ejos/${ejo.id}`;
        const res = await fetch(apiUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFields)
        });
        if (!res.ok) throw new Error("Gagal menyelesaikan EJO");

        await initData();
        closeModal();
        showToast(`Job Order ${ejo.id} berhasil diselesaikan!`, "success");
    } catch (err) {
        console.error(err);
        showToast("Gagal menyimpan penyelesaian ke database server!", "error");
    } finally {
        if (completeBtn) {
            completeBtn.disabled = false;
            completeBtn.innerHTML = originalHtml;
            lucide.createIcons();
        }
    }
}

// ponytail: helper to safely open base64 data URI in a new window/tab bypassing browser data URI navigation blockings
window.openRejectionImage = function (base64) {
    const win = window.open();
    if (win) {
        win.document.write(`<title>Bukti Penolakan</title><body style="margin:0;display:flex;align-items:center;justify-content:center;background:#111;"><img src="${base64}" style="max-width:100%;max-height:100vh;object-fit:contain;"/></body>`);
        win.document.close();
    } else {
        showToast("Gagal membuka gambar, popup diblokir browser!", "warning");
    }
};
