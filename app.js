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
        destroy() {}
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
            { date: "2026-06-22 09:15", message: "Disetujui oleh Ahmad Dani (Lead Engineer)." },
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
            { date: "2026-06-22 14:30", message: "Disetujui oleh Ahmad Dani (Lead Engineer)." }
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

// Mock notification list
let notifications = [
    { id: 1, time: "09:12 WIB", text: "EJO-2026-005 ditugaskan ke Deddy Corbuzier" },
    { id: 2, time: "08:30 WIB", text: "Pekerjaan perbaikan hidrolik (EJO-2026-001) dimulai" }
];

// State Manager
let state = {
    ejos: [],
    projects: [],
    activeTab: 'overview',
    viewMode: 'grid', // grid or table
    selectedEJO: null,
    charts: {} // Store instances of ChartJS objects to destroy/update them
};

// ==========================================
// Initialization
// ==========================================
// ponytail: Theme toggle — default light, localStorage override
(function() {
    const saved = localStorage.getItem('PTBAS_THEME') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    initClock();
    initEventListeners();

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
            localStorage.setItem('PTBAS_THEME', next);
            updateThemeIcon();
        });
    }

    // ponytail: avatar upload — one listener, FormData, done
    const avatarInput = document.getElementById('avatar-file-input');
    if (avatarInput) {
        avatarInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file || !state.currentUser) return;

            const fd = new FormData();
            fd.append('avatar', file);
            fd.append('username', state.currentUser.username);

            try {
                const res = await fetch('/api/upload-avatar', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.status === 'success') {
                    state.currentUser.avatar = data.avatar;
                    sessionStorage.setItem('PTBAS_USER', JSON.stringify(state.currentUser));
                    document.getElementById('sidebar-avatar').src = data.avatar;
                    showToast('Foto profil berhasil diubah!', 'success');
                } else {
                    showToast(data.message || 'Gagal upload foto', 'error');
                }
            } catch (err) {
                showToast('Gagal upload foto: ' + err.message, 'error');
            }
            avatarInput.value = ''; // reset agar bisa upload file yang sama lagi
        });
    }

    lucide.createIcons();
});

function checkAuth() {
    const user = sessionStorage.getItem("PTBAS_USER");
    const loginContainer = document.getElementById("login-container");
    const appContainer = document.querySelector(".app-container");

    if (user) {
        state.currentUser = JSON.parse(user);
        if (loginContainer) loginContainer.style.display = 'none';
        if (appContainer) appContainer.style.display = 'flex';
        
        // Populate profile sidebar
        document.getElementById("sidebar-avatar").src = state.currentUser.avatar;
        document.getElementById("sidebar-fullname").textContent = state.currentUser.fullname;
        document.getElementById("sidebar-role").textContent = state.currentUser.role;
        
        // Show/hide admin panel button based on role
        const adminBtn = document.getElementById("nav-admin-btn");
        if (adminBtn) {
            if (state.currentUser.role === 'Lead Engineer' || state.currentUser.role === 'Admin') {
                adminBtn.style.display = 'flex';
            } else {
                adminBtn.style.display = 'none';
                // Security check: if non-admin logs in, force activeTab back to overview
                if (state.activeTab === 'admin') {
                    state.activeTab = 'overview';
                }
                // Explicitly deactivate admin tab pane and nav button to avoid leakage
                const adminPane = document.getElementById("tab-admin");
                if (adminPane) adminPane.classList.remove("active");
                adminBtn.classList.remove("active");
            }
        }
        
        initData();
    } else {
        if (loginContainer) loginContainer.style.display = 'flex';
        if (appContainer) appContainer.style.display = 'none';
    }
}

async function initData() {
    if (!state.currentUser) return; // Block API calls if not logged in
    try {
        const resEjos = await fetch("/api/ejos");
        state.ejos = await resEjos.json();
        
        const resProj = await fetch("/api/projects");
        state.projects = await resProj.json();

        // ponytail: Fetch dynamic users from SQLite database
        const resUsers = await fetch("/api/users");
        state.users = await resUsers.json();

        // ponytail: Keep engineersList synced with database users dynamically
        engineersList = state.users.map(u => ({
            name: u.fullname,
            role: u.role,
            avatar: u.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80'
        }));
        populateEngineerDropdowns();
        
        // Safety check: if the active tab is admin but the user is not authorized, reset to overview
        if (state.activeTab === 'admin' && state.currentUser.role !== 'Lead Engineer' && state.currentUser.role !== 'Admin') {
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
        { id: "modal-assignee", hasUnassigned: true, unassignedText: "Unassigned (Belum ditunjuk)" },
        { id: "proj-pic", hasUnassigned: false }
    ];
    
    dropdowns.forEach(dd => {
        const el = document.getElementById(dd.id);
        if (!el) return;
        
        // Store current value to re-select it after rebuilding options
        const val = el.value;
        
        let html = "";
        if (dd.hasUnassigned) {
            html += `<option value="Unassigned">${dd.unassignedText}</option>`;
        }
        
        html += engineersList.map(eng => {
            return `<option value="${eng.name}">${eng.name} (${eng.role})</option>`;
        }).join('');
        
        el.innerHTML = html;
        
        // Re-select value if it still exists
        if (val) el.value = val;
    });
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
    // Sidebar Tabs Navigation
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const targetTab = btn.getAttribute("data-tab");
            switchTab(targetTab);
        });
    });

    // Notify popover trigger
    const notifyTrigger = document.getElementById("notify-trigger");
    const notifyPanel = document.getElementById("notify-panel");
    notifyTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        notifyPanel.style.display = notifyPanel.style.display === 'none' ? 'flex' : 'none';
    });
    
    document.addEventListener("click", () => {
        notifyPanel.style.display = 'none';
    });
    
    notifyPanel.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    document.getElementById("clear-notifications").addEventListener("click", () => {
        notifications = [];
        renderNotifications();
        showToast("Notifikasi dihapus", "info");
    });

    // View Mode toggling
    document.getElementById("view-grid-btn").addEventListener("click", () => {
        state.viewMode = 'grid';
        document.getElementById("view-grid-btn").classList.add("active");
        document.getElementById("view-table-btn").classList.remove("active");
        document.getElementById("job-orders-container").classList.add("active");
        document.getElementById("job-orders-container").style.display = 'grid';
        document.getElementById("job-orders-table-wrapper").style.display = 'none';
    });

    document.getElementById("view-table-btn").addEventListener("click", () => {
        state.viewMode = 'table';
        document.getElementById("view-table-btn").classList.add("active");
        document.getElementById("view-grid-btn").classList.remove("active");
        document.getElementById("job-orders-container").classList.remove("active");
        document.getElementById("job-orders-container").style.display = 'none';
        document.getElementById("job-orders-table-wrapper").style.display = 'block';
    });

    // Create Quick button
    document.getElementById("btn-quick-new").addEventListener("click", () => {
        switchTab("create-order");
    });

    // Cancel create EJO
    document.getElementById("btn-cancel-create").addEventListener("click", () => {
        document.getElementById("ejo-form").reset();
        switchTab("job-orders");
    });

    // Form Submission
    document.getElementById("ejo-form").addEventListener("submit", (e) => {
        e.preventDefault();
        createNewEJO();
    });

    // Filter controls
    document.getElementById("search-input").addEventListener("input", filterAndRenderJobOrders);
    document.getElementById("filter-status").addEventListener("change", filterAndRenderJobOrders);
    document.getElementById("filter-priority").addEventListener("change", filterAndRenderJobOrders);
    document.getElementById("filter-dept").addEventListener("change", filterAndRenderJobOrders);

    // Modal close
    document.getElementById("modal-close-btn").addEventListener("click", closeModal);
    document.getElementById("ejo-modal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("ejo-modal")) closeModal();
    });

    // Modal change assignee and status
    document.querySelectorAll(".btn-status-change").forEach(btn => {
        btn.addEventListener("click", () => {
            const nextStatus = btn.getAttribute("data-status");
            updateModalStatusHighlight(nextStatus);
        });
    });

    // Save modal action
    document.getElementById("btn-save-modal").addEventListener("click", saveModalChanges);
    
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
                    body: JSON.stringify({ username: usernameInput, password: passwordInput })
                });

                if (res.status === 200) {
                    const userData = await res.json();
                    sessionStorage.setItem("PTBAS_USER", JSON.stringify(userData));
                    
                    // Reset login form inputs
                    loginForm.reset();
                    
                    // Authenticate and load app
                    checkAuth();
                    showToast(`Selamat datang kembali, ${userData.fullname}!`, "success");
                } else {
                    if (errorMsg) errorMsg.style.display = 'flex';
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
        btnLogout.addEventListener("click", () => {
            const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari sistem EJO?");
            if (!confirmLogout) return;
            
            sessionStorage.removeItem("PTBAS_USER");
            state.currentUser = null;
            state.activeTab = 'overview'; // Reset tab state to default overview
            
            // Clear DOM active classes to prevent leftover tabs display on next logins
            document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
            document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
            
            const overviewPane = document.getElementById("tab-overview");
            if (overviewPane) overviewPane.classList.add("active");
            
            const overviewBtn = document.querySelector('.nav-btn[data-tab="overview"]');
            if (overviewBtn) overviewBtn.classList.add("active");
            
            // Toggle view visibility
            document.getElementById("login-container").style.display = 'flex';
            document.querySelector(".app-container").style.display = 'none';
            
            showToast("Anda telah keluar dari sistem", "warning");
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
}

function switchTab(tabId) {
    if (tabId === 'admin' && (!state.currentUser || (state.currentUser.role !== 'Lead Engineer' && state.currentUser.role !== 'Admin'))) {
        tabId = 'overview';
    }
    state.activeTab = tabId;
    
    // Set titles
    const titleEl = document.getElementById("page-title");
    const subEl = document.getElementById("page-subtitle");
    
    if (tabId === 'overview') {
        titleEl.textContent = "Dashboard Overview";
        subEl.textContent = "Monitoring status, kinerja, dan anggaran order lapangan.";
    } else if (tabId === 'job-orders') {
        titleEl.textContent = "Job Orders Board";
        subEl.textContent = "Kelola, cari, dan tinjau semua Engineering Job Orders.";
    } else if (tabId === 'create-order') {
        titleEl.textContent = "Buat Permintaan Baru";
        subEl.textContent = "Ajukan Job Order EJO teknis baru untuk unit pabrik.";
        // Set default target date to today + 5 days
        const targetInput = document.getElementById("form-target-date");
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 5);
        targetInput.value = defaultDate.toISOString().split('T')[0];
    } else if (tabId === 'engineers') {
        titleEl.textContent = "Tim & Utilisasi Engineer";
        subEl.textContent = "Daftar engineer aktif dan analisis pembebanan pengerjaan.";
    } else if (tabId === 'projects') {
        titleEl.textContent = "Project Monitoring Board";
        subEl.textContent = "Pantau siklus inisialisasi ide baru hingga kesiapan eksekusi proyek.";
        const targetProjInput = document.getElementById("proj-target");
        if (targetProjInput) {
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 60);
            targetProjInput.value = defaultDate.toISOString().split('T')[0];
        }
    } else if (tabId === 'history') {
        titleEl.textContent = "History EJO";
        subEl.textContent = "Riwayat Engineering Job Order yang sudah selesai atau dibatalkan.";
    } else if (tabId === 'admin') {
        titleEl.textContent = "Admin Panel - Database User";
        subEl.textContent = "Kelola akun, password, dan otoritas tim teknisi PT. BAS.";
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
        if (b.getAttribute("data-tab") === tabId) {
            b.classList.add("active");
        }
    });

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
    } else if (state.activeTab === 'job-orders') {
        filterAndRenderJobOrders();
    } else if (state.activeTab === 'engineers') {
        renderEngineersView();
    } else if (state.activeTab === 'projects') {
        renderProjects();
    } else if (state.activeTab === 'history') {
        renderHistory();
    } else if (state.activeTab === 'admin') {
        renderUsers();
    }
    
    lucide.createIcons();
}

function renderKPIs() {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const total = state.ejos.length;
    const pending = state.ejos.filter(e => e.status === 'Requested').length;
    const progress = state.ejos.filter(e => e.status === 'In Progress' || e.status === 'Approved').length;

    // ponytail: Completed THIS MONTH only (by targetDate or last log date)
    const completedThisMonth = state.ejos.filter(e => {
        if (e.status !== 'Completed') return false;
        // Use last log date if available, else targetDate
        const logs = e.logs || [];
        const dateStr = logs.length > 0 ? logs[logs.length - 1].date : e.targetDate;
        if (!dateStr) return false;
        const d = new Date(dateStr);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    // Month-over-month % change for Total EJO
    const ejosThisMonth = state.ejos.filter(e => {
        const d = e.targetDate ? new Date(e.targetDate) : null;
        return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;
    const ejosLastMonth = state.ejos.filter(e => {
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
    const allCompleted = state.ejos.filter(e => e.status === 'Completed').length;
    const allCancelled = state.ejos.filter(e => e.status === 'Cancelled').length;
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
}

function renderNotifications() {
    const badge = document.querySelector(".notification-btn .badge");
    const container = document.getElementById("notify-list-items");
    
    if (notifications.length === 0) {
        badge.style.display = 'none';
        container.innerHTML = '<div class="text-secondary text-xs text-center" style="padding: 1rem;">Tidak ada notifikasi baru</div>';
        return;
    }
    
    badge.style.display = 'flex';
    badge.textContent = notifications.length;
    
    container.innerHTML = notifications.map(n => `
        <div class="notify-item">
            <span class="notify-time">${n.time}</span>
            <span>${n.text}</span>
        </div>
    `).join('');
}

// Critical Priority List
function renderCriticalList() {
    const container = document.getElementById("critical-ejo-list");
    const criticalEjos = state.ejos.filter(e => 
        (e.priority === 'Emergency' || e.priority === 'High') && e.status !== 'Completed' && e.status !== 'Cancelled'
    );

    if (criticalEjos.length === 0) {
        container.innerHTML = `
            <div class="text-center text-secondary text-xs py-4">
                <i data-lucide="shield-check" style="width: 24px; height: 24px; color: var(--color-green); margin: 0 auto 6px;"></i>
                Aman! Tidak ada antrean order darurat yang kritis.
            </div>
        `;
        lucide.createIcons();
        return;
    }

    container.innerHTML = criticalEjos.map(e => `
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
                <span class="badge-status status-${getStatusClass(e.status)}">${e.status}</span>
                <span class="text-xs text-rose" style="font-weight: 600;">${e.priority}</span>
            </div>
        </div>
    `).join('');
}

// Job Orders Table / Grid views
function filterAndRenderJobOrders() {
    const searchVal = document.getElementById("search-input").value.toLowerCase();
    const statusVal = document.getElementById("filter-status").value;
    const priorityVal = document.getElementById("filter-priority").value;
    const deptVal = document.getElementById("filter-dept").value;

    // ponytail: Completed/Cancelled EJOs go to History tab, not here
    const filtered = state.ejos.filter(e => {
        if (e.status === 'Completed' || e.status === 'Cancelled') return false;

        const matchesSearch = e.id.toLowerCase().includes(searchVal) || 
                              e.title.toLowerCase().includes(searchVal) || 
                              e.location.toLowerCase().includes(searchVal) || 
                              e.engineer.toLowerCase().includes(searchVal);
        
        const matchesStatus = statusVal === 'all' || e.status === statusVal;
        const matchesPriority = priorityVal === 'all' || e.priority === priorityVal;
        const matchesDept = deptVal === 'all' || e.dept === deptVal;
        
        return matchesSearch && matchesStatus && matchesPriority && matchesDept;
    });

    document.getElementById("results-count").textContent = `Ditemukan ${filtered.length} Job Order`;

    // Render Grid View
    const gridContainer = document.getElementById("job-orders-container");
    gridContainer.innerHTML = filtered.map(e => {
        const engObj = engineersList.find(eng => eng.name === e.engineer) || { avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80', skill: 'Admin' };
        
        return `
            <div class="job-card card-glass glow-${e.priority === 'Emergency' ? 'rose' : (e.priority === 'High' ? 'yellow' : 'blue')}">
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
                    <div class="job-card-meta">
                        <div><i data-lucide="building"></i> <span>${e.dept}</span></div>
                        <div><i data-lucide="calendar"></i> <span>${formatDisplayDate(e.targetDate)}</span></div>
                    </div>
                </div>

                <div class="job-card-bottom">
                    <div class="engineer-badge">
                        <img src="${engObj.avatar}" alt="${e.engineer}">
                        <span>${e.engineer}</span>
                    </div>
                    <span class="badge-status status-${getStatusClass(e.status)}">${e.status}</span>
                </div>
            </div>
        `;
    }).join('');

    // Render Table View
    const tableBody = document.getElementById("job-orders-table-body");
    tableBody.innerHTML = filtered.map(e => `
        <tr>
            <td><span class="ejo-id-badge">${e.id}</span></td>
            <td>
                <div class="table-title" onclick="openEJODetails('${e.id}')">${e.title}</div>
                <div class="text-muted text-xs"><i data-lucide="map-pin" style="width: 10px; height: 10px; display:inline;"></i> ${e.location}</div>
            </td>
            <td>${e.dept}</td>
            <td><span class="text-xs" style="font-weight:700; color: ${getPriorityColor(e.priority)};">${e.priority}</span></td>
            <td>${e.engineer}</td>
            <td>${formatDisplayDate(e.targetDate)}</td>
            <td><span class="badge-status status-${getStatusClass(e.status)}">${e.status}</span></td>
            <td style="text-align: right;">
                <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="openEJODetails('${e.id}')">
                    <i data-lucide="external-link" style="width: 12px; height:12px;"></i> Detail
                </button>
            </td>
        </tr>
    `).join('');

    if (filtered.length === 0) {
        gridContainer.innerHTML = `
            <div class="full-width text-center text-secondary py-12 card-glass" style="grid-column: 1 / -1;">
                <i data-lucide="clipboard-x" style="width: 48px; height: 48px; color: var(--text-muted); margin: 0 auto 12px;"></i>
                <h4>Tidak ada Job Order yang sesuai filter</h4>
                <p class="text-muted text-xs">Coba cari dengan filter atau kata kunci lain.</p>
            </div>
        `;
    }

    lucide.createIcons();
}

// ponytail: History tab — show completed/cancelled EJOs
function renderHistory() {
    const tbody = document.getElementById('history-table-body');
    const historyEjos = state.ejos.filter(e => e.status === 'Completed' || e.status === 'Cancelled');

    // ponytail: Show/hide action header and render delete button if user is Lead Engineer or Admin
    const isLead = state.currentUser && (state.currentUser.role === 'Lead Engineer' || state.currentUser.role === 'Admin');
    const actionHeader = document.getElementById('history-header-action');
    if (actionHeader) {
        actionHeader.style.display = isLead ? 'table-cell' : 'none';
    }

    if (historyEjos.length === 0) {
        const cols = isLead ? 7 : 6;
        tbody.innerHTML = `<tr><td colspan="${cols}" style="text-align:center; padding:2rem; color:var(--text-muted);">Belum ada EJO yang selesai.</td></tr>`;
        return;
    }

    tbody.innerHTML = historyEjos.map(e => {
        // Get last log date as completion date
        const logs = e.logs || [];
        const lastLog = logs.length > 0 ? logs[logs.length - 1].date : '-';
        const actionCell = isLead 
            ? `<td style="text-align: right;"><button class="btn btn-danger-outline btn-xs" onclick="deleteHistoryEJO('${e.id}')"><i data-lucide="trash-2" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:2px;"></i> Hapus</button></td>` 
            : '';
        return `
            <tr>
                <td><span class="ejo-id-badge">${e.id}</span></td>
                <td><div class="table-title" style="cursor:pointer;" onclick="openEJODetails('${e.id}')">${e.title}</div></td>
                <td>${e.dept}</td>
                <td>${e.engineer}</td>
                <td><span class="badge-status status-${getStatusClass(e.status)}">${e.status}</span></td>
                <td>${lastLog}</td>
                ${actionCell}
            </tr>
        `;
    }).join('');

    if (isLead) {
        lucide.createIcons();
    }
}

function renderEngineersView() {
    const container = document.getElementById("engineers-container");
    
    container.innerHTML = engineersList.map(eng => {
        // Calculate assigned active jobs (In Progress or Approved)
        const assignedJobs = state.ejos.filter(e => e.engineer === eng.name && e.status !== 'Completed' && e.status !== 'Cancelled');
        const completedJobs = state.ejos.filter(e => e.engineer === eng.name && e.status === 'Completed');
        
        // Calculate load % (Max load capacity = 5 active tasks)
        const loadCount = assignedJobs.length;
        const loadPercent = Math.min((loadCount / 5) * 100, 100);
        
        let gaugeColor = 'gauge-green';
        let loadText = 'Normal';
        if (loadCount >= 4) {
            gaugeColor = 'gauge-red';
            loadText = 'Overload';
        } else if (loadCount >= 2) {
            gaugeColor = 'gauge-yellow';
            loadText = 'Medium';
        }

        return `
            <div class="engineer-card card-glass">
                <img src="${eng.avatar}" alt="${eng.name}" class="eng-avatar-large">
                <h4>${eng.name}</h4>
                <span class="eng-role">${eng.role}</span>
                
                <div class="full-width text-left" style="margin-top: 1rem;">
                    <div class="flex justify-between text-xs text-secondary" style="display:flex; justify-content:space-between; margin-bottom: 4px;">
                        <span>Kapasitas Kerja</span>
                        <span class="${loadCount >= 4 ? 'text-rose' : (loadCount >= 2 ? 'text-yellow' : 'text-green')}" style="font-weight:700;">${loadCount} Task (${loadText})</span>
                    </div>
                    <div class="workload-gauge-wrapper">
                        <div class="workload-gauge ${gaugeColor}" style="width: ${loadPercent}%;"></div>
                    </div>
                </div>

                <div class="eng-stats-summary">
                    <div class="eng-stat-item">
                        <span class="eng-stat-num text-cyan">${loadCount}</span>
                        <span class="eng-stat-lbl">Aktif</span>
                    </div>
                    <div class="eng-stat-item">
                        <span class="eng-stat-num text-green">${completedJobs.length}</span>
                        <span class="eng-stat-lbl">Selesai</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    renderCostChart();
}

// ==========================================
// Chart JS Configurations
// ==========================================
function renderOverviewCharts() {
    // 1. Line Chart: Monthly Trend — ponytail: aggregate real EJO data by targetDate month
    const ctxTrend = document.getElementById('trendChart').getContext('2d');
    if (state.charts.trend) state.charts.trend.destroy();
    
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const masukPerMonth = new Array(12).fill(0);
    const selesaiPerMonth = new Array(12).fill(0);
    state.ejos.forEach(e => {
        const m = e.targetDate ? parseInt(e.targetDate.split('-')[1]) - 1 : -1;
        if (m >= 0 && m < 12) {
            masukPerMonth[m]++;
            if (e.status === 'Completed') selesaiPerMonth[m]++;
        }
    });
    // ponytail: only show months that have data, plus one before/after for context
    const firstMonth = Math.max(0, masukPerMonth.findIndex(v => v > 0) - 1);
    const lastMonth = Math.min(11, masukPerMonth.lastIndexOf(masukPerMonth.find((_, i, a) => a[11 - i] > 0) || 0) + 1);
    const endIdx = Math.max(lastMonth, Math.min(11, masukPerMonth.reduce((last, v, i) => v > 0 ? i : last, 0) + 1));
    const sliceLabels = monthLabels.slice(firstMonth, endIdx + 1);
    const sliceMasuk = masukPerMonth.slice(firstMonth, endIdx + 1);
    const sliceSelesai = selesaiPerMonth.slice(firstMonth, endIdx + 1);

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
    
    const requested = state.ejos.filter(e => e.status === 'Requested').length;
    const approved = state.ejos.filter(e => e.status === 'Approved').length;
    const progress = state.ejos.filter(e => e.status === 'In Progress').length;
    const completed = state.ejos.filter(e => e.status === 'Completed').length;
    const cancelled = state.ejos.filter(e => e.status === 'Cancelled').length;

    state.charts.status = new Chart(ctxStatus, {
        type: 'doughnut',
        data: {
            labels: ['Requested', 'Approved', 'In Progress', 'Completed', 'Cancelled'],
            datasets: [{
                data: [requested, approved, progress, completed, cancelled],
                backgroundColor: [
                    '#64748b', // requested - slate
                    '#38bdf8', // approved - blue
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

    const depts = ['Production', 'Maintenance', 'Quality Control', 'HSE', 'Utility'];
    const deptData = depts.map(dept => state.ejos.filter(e => e.dept === dept || (dept === 'Quality Control' && e.dept === 'QC')).length);

    state.charts.dept = new Chart(ctxDept, {
        type: 'bar',
        data: {
            labels: ['Production', 'Maintenance', 'QC', 'HSE', 'Utility'],
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

function renderCostChart() {
    // 4. Bar Chart Double: Estimasi vs Aktual Biaya (Department load)
    const ctxCost = document.getElementById('costChart').getContext('2d');
    if (state.charts.cost) state.charts.cost.destroy();

    const depts = ['Production', 'Maintenance', 'Quality Control', 'HSE', 'Utility'];
    const estCosts = depts.map(dept => {
        return state.ejos
            .filter(e => e.dept === dept || (dept === 'Quality Control' && e.dept === 'QC'))
            .reduce((acc, curr) => acc + (curr.estCost || 0), 0);
    });
    const actCosts = depts.map(dept => {
        return state.ejos
            .filter(e => e.dept === dept || (dept === 'Quality Control' && e.dept === 'QC'))
            .reduce((acc, curr) => acc + (curr.actCost || 0), 0);
    });

    state.charts.cost = new Chart(ctxCost, {
        type: 'bar',
        data: {
            labels: depts,
            datasets: [
                {
                    label: 'Estimasi Biaya',
                    data: estCosts,
                    backgroundColor: 'rgba(6, 182, 212, 0.5)',
                    borderColor: '#06b6d4',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Aktual Biaya',
                    data: actCosts,
                    backgroundColor: 'rgba(16, 185, 129, 0.5)',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: window.innerWidth < 768 ? 'bottom' : 'top',
                    labels: { color: '#94a3b8', font: { family: 'Outfit', size: window.innerWidth < 768 ? 10 : 12 } } 
                }
            },
            scales: {
                x: { 
                    grid: { display: false }, 
                    ticks: { 
                        color: '#94a3b8',
                        font: { family: 'Outfit', size: 11 }
                    } 
                },
                y: { 
                    grid: { color: 'rgba(255,255,255,0.05)' }, 
                    min: 0,
                    suggestedMax: 10000000, // ponytail: default max 10M if all data is zero to get clean round numbers on ticks
                    ticks: { 
                        color: '#94a3b8',
                        font: { family: 'Outfit', size: 11 },
                        callback: function(value) {
                            if (value === 0) return 'Rp 0';
                            if (value >= 1000000) {
                                return 'Rp ' + (value / 1000000).toFixed(1).replace(/\.0$/, '') + ' Jt';
                            }
                            if (value >= 1000) {
                                return 'Rp ' + (value / 1000).toFixed(1).replace(/\.0$/, '') + ' Rb';
                            }
                            return 'Rp ' + value;
                        }
                    } 
                }
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
function openEJODetails(id) {
    const ejo = state.ejos.find(e => e.id === id);
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
    document.getElementById("modal-ejo-dept").textContent = ejo.dept;
    document.getElementById("modal-ejo-requester").textContent = ejo.requester || "System Seeder";
    document.getElementById("modal-ejo-category").textContent = ejo.category;
    document.getElementById("modal-ejo-target-date").textContent = formatDisplayDate(ejo.targetDate);
    
    const statusBadge = document.getElementById("modal-ejo-status");
    statusBadge.className = `badge badge-status status-${getStatusClass(ejo.status)}`;
    statusBadge.textContent = ejo.status;

    const descParts = (ejo.description || "").split("||attachment||");
    const descText = descParts[0];
    const attachmentsJoined = descParts[1] || "";
    const attachmentSrcs = attachmentsJoined ? attachmentsJoined.split("||image-split||") : [];
    
    document.getElementById("modal-ejo-desc").textContent = descText;

    // ponytail: Populate attachment state for editing in details modal
    state.currentModalAttachments = attachmentSrcs.filter(src => src.trim() !== "");

    // Assignee and Costs
    document.getElementById("modal-assignee").value = ejo.engineer || 'Unassigned';
    document.getElementById("modal-est-cost").value = ejo.estCost || 0;
    document.getElementById("modal-act-cost").value = ejo.actCost || 0;

    // ponytail: reset template fields on modal open
    const templateSelect = document.getElementById("modal-log-template");
    if (templateSelect) templateSelect.value = "";
    const newLogTextarea = document.getElementById("modal-new-log");
    if (newLogTextarea) newLogTextarea.value = "";

    // Role-based restrictions inside the EJO Details modal
    const isLead = state.currentUser && (state.currentUser.role === 'Lead Engineer' || state.currentUser.role === 'Admin');
    const isAssignedEngineer = state.currentUser && state.currentUser.fullname === ejo.engineer;
    const canChangeStatus = isLead || isAssignedEngineer;

    document.getElementById("modal-assignee").disabled = !isLead;
    document.getElementById("modal-est-cost").disabled = !isLead;
    
    // ponytail: actual cost can only be modified by Lead or the assigned engineer
    document.getElementById("modal-act-cost").disabled = !canChangeStatus;

    // ponytail: template and new log textarea disabled if they can't change status/report progress
    if (document.getElementById("modal-log-template")) {
        document.getElementById("modal-log-template").disabled = !canChangeStatus;
    }
    if (document.getElementById("modal-new-log")) {
        document.getElementById("modal-new-log").disabled = !canChangeStatus;
    }

    const deleteBtn = document.getElementById("btn-delete-ejo");
    if (deleteBtn) {
        deleteBtn.style.display = isLead ? 'block' : 'none';
    }

    // Status button group restrictions
    document.querySelectorAll(".btn-status-change").forEach(btn => {
        const btnStatus = btn.getAttribute("data-status");
        if (!canChangeStatus) {
            // Disabled completely for unauthorized users
            btn.disabled = true;
            btn.style.opacity = '0.4';
            btn.style.pointerEvents = 'none';
        } else if (isLead) {
            // Lead can do anything
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        } else {
            // Assigned engineer can only transition to 'In Progress' or 'Completed'
            if (btnStatus === 'In Progress' || btnStatus === 'Completed') {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            } else {
                btn.disabled = true;
                btn.style.opacity = '0.4';
                btn.style.pointerEvents = 'none';
            }
        }
    });

    // Disable Save button if they cannot edit anything
    const saveBtn = document.getElementById("btn-save-modal");
    if (saveBtn) {
        saveBtn.disabled = !canChangeStatus;
        saveBtn.style.opacity = canChangeStatus ? '1' : '0.5';
        saveBtn.style.pointerEvents = canChangeStatus ? 'auto' : 'none';
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

        if (currentSrcs.length > 0) {
            let galleryHtml = `<h5 style="margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">Lampiran Gambar Lapangan (${currentSrcs.length}):</h5>`;
            galleryHtml += `<div style="display: flex; flex-wrap: wrap; gap: 10px;">`;
            currentSrcs.forEach((src, idx) => {
                galleryHtml += `
                    <div style="position: relative; width: 100px; height: 100px;">
                        <a href="${src}" target="_blank" title="Buka gambar ${idx + 1} di tab baru">
                            <img src="${src}" style="width: 100%; height: 100%; border-radius: var(--border-radius-sm); border: 1px solid var(--card-border); cursor: pointer; transition: opacity 0.2s; object-fit: cover;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">
                        </a>
                        ${canChangeStatus ? `
                        <button type="button" class="btn-delete-img" data-idx="${idx}" style="position: absolute; top: 4px; right: 4px; background: rgba(239, 68, 68, 0.85); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 11px; display: flex; align-items: center; justify-content: center; cursor: pointer; line-height: 1;" title="Hapus gambar">&times;</button>
                        ` : ''}
                    </div>
                `;
            });
            galleryHtml += `</div>`;
            previewContainer.innerHTML = galleryHtml;

            // Add event listeners to delete buttons
            previewContainer.querySelectorAll(".btn-delete-img").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute("data-idx"));
                    state.currentModalAttachments.splice(idx, 1);
                    renderModalGallery();
                });
            });
        } else {
            previewContainer.innerHTML = "";
        }
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
        modalUploadMock.style.opacity = canChangeStatus ? "1" : "0.5";
        modalUploadMock.style.pointerEvents = canChangeStatus ? "auto" : "none";

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
                showToast("Memproses gambar tambahan...", "info");
                for (let i = 0; i < newFileInput.files.length; i++) {
                    const base64 = await resizeImageBase64(newFileInput.files[i]);
                    if (base64) {
                        state.currentModalAttachments.push(base64);
                    }
                }
                renderModalGallery();
                showToast(`${newFileInput.files.length} Gambar ditambahkan`, "success");
            }
            newFileInput.value = ""; // clear to allow same file re-selection
        });
    }

    // Set active status highlight in action bar
    updateModalStatusHighlight(ejo.status);

    // Re-render Timeline logs
    renderTimelineLogs(ejo);

    // Show modal
    document.getElementById("ejo-modal").classList.add("active");
    lucide.createIcons();
}

function updateModalStatusHighlight(status) {
    // Save current status change internally in temporary selection object
    if (state.selectedEJO) {
        state.selectedEJO._tempStatus = status;
    }

    document.querySelectorAll(".status-btn-group button").forEach(btn => {
        btn.classList.remove("active");
        btn.style.backgroundColor = 'transparent';
        btn.style.color = 'var(--text-secondary)';
        
        if (btn.getAttribute("data-status") === status) {
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
    if (!ejo.logs || ejo.logs.length === 0) {
        logsContainer.innerHTML = '<p class="text-secondary text-xs">Belum ada riwayat aktivitas.</p>';
        return;
    }
    
    logsContainer.innerHTML = ejo.logs.map((log, index) => {
        const isActive = index === ejo.logs.length - 1;
        return `
            <div class="timeline-item ${isActive ? 'active' : ''}">
                <div class="timeline-date">${log.date}</div>
                <div class="timeline-content">${log.message}</div>
            </div>
        `;
    }).join('');
}

async function saveModalChanges() {
    if (!state.selectedEJO) return;
    
    const ejo = state.ejos.find(e => e.id === state.selectedEJO.id);
    if (!ejo) return;

    // ponytail: double-check permission on save
    const isLead = state.currentUser && (state.currentUser.role === 'Lead Engineer' || state.currentUser.role === 'Admin');
    const isAssigned = state.currentUser && state.currentUser.fullname === ejo.engineer;
    if (!isLead && !isAssigned) {
        showToast("Anda tidak memiliki akses untuk mengubah EJO ini!", "error");
        return;
    }

    const oldStatus = ejo.status;
    const oldAssignee = ejo.engineer;
    
    const nextStatus = state.selectedEJO._tempStatus || oldStatus;
    const nextAssignee = document.getElementById("modal-assignee").value;
    const nextEst = parseInt(document.getElementById("modal-est-cost").value) || 0;
    const nextAct = parseInt(document.getElementById("modal-act-cost").value) || 0;

    // Generate logs on change
    const now = new Date();
    const timestamp = now.getFullYear() + "-" + 
                      String(now.getMonth()+1).padStart(2, '0') + "-" + 
                      String(now.getDate()).padStart(2, '0') + " " + 
                      String(now.getHours()).padStart(2, '0') + ":" + 
                      String(now.getMinutes()).padStart(2, '0');

    // ponytail: Reconstruct description with updated attachments list
    const originalDescText = (ejo.description || "").split("||attachment||")[0];
    const updatedAttachmentsJoined = (state.currentModalAttachments || []).join("||image-split||");
    const nextDescription = originalDescText + (updatedAttachmentsJoined ? `||attachment||${updatedAttachmentsJoined}` : "");

    const updatedFields = {
        status: nextStatus,
        engineer: nextAssignee,
        estCost: nextEst,
        actCost: nextAct,
        description: nextDescription, // ponytail: update attachment images in DB
        logs: []
    };

    // ponytail: capture custom completion log or work report message
    const nextLogMessage = document.getElementById("modal-new-log") ? document.getElementById("modal-new-log").value.trim() : "";
    if (nextLogMessage !== "") {
        updatedFields.logs.push({
            date: timestamp,
            message: nextLogMessage
        });
    }

    if (oldStatus !== nextStatus) {
        updatedFields.logs.push({
            date: timestamp,
            message: `Status dirubah dari ${oldStatus} menjadi ${nextStatus}.`
        });
        
        notifications.unshift({
            id: Date.now(),
            time: timestamp.split(' ')[1] + " WIB",
            text: `Status ${ejo.id} diubah menjadi ${nextStatus}`
        });
    }

    if (oldAssignee !== nextAssignee) {
        updatedFields.logs.push({
            date: timestamp,
            message: `Engineer ditunjuk: ${nextAssignee === 'Unassigned' ? 'Belum ditentukan' : nextAssignee}.`
        });
        
        notifications.unshift({
            id: Date.now(),
            time: timestamp.split(' ')[1] + " WIB",
            text: `${ejo.id} ditugaskan kepada ${nextAssignee}`
        });
    }

    const saveBtn = document.getElementById("btn-save-modal");
    let originalHtml = "";
    if (saveBtn) {
        originalHtml = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.textContent = "Menyimpan...";
    }

    try {
        const res = await fetch(`/api/ejos/${ejo.id}`, {
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
    
    const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus Job Order ${state.selectedEJO.id}?`);
    if (!confirmDelete) return;
    
    try {
        const res = await fetch(`/api/ejos/${state.selectedEJO.id}`, {
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

// ==========================================
// Create EJO Form Action
// ==========================================
async function createNewEJO() {
    const title = document.getElementById("form-title").value;
    const dept = document.getElementById("form-dept").value;
    const category = document.getElementById("form-category").value;
    const priority = document.getElementById("form-priority").value;
    const targetDate = document.getElementById("form-target-date").value;
    const location = document.getElementById("form-location").value;
    const budget = parseInt(document.getElementById("form-budget").value) || 0;
    const descriptionText = document.getElementById("form-description").value;
    const engineer = document.getElementById("form-engineer").value;

    // ponytail: Get already resized & uploaded images from state
    const attachmentDataJoined = (state.createFormAttachments || []).join("||image-split||");
    const finalDescription = descriptionText + (attachmentDataJoined ? `||attachment||${attachmentDataJoined}` : "");

    // Generate EJO Code
    // ponytail: Generating sequentially by prefixing the highest numeric order found in existing items.
    const lastIdNum = state.ejos.reduce((max, item) => {
        const parts = item.id.split('-');
        const num = parseInt(parts[2]);
        return num > max ? num : max;
    }, 5); // Default start of max id is 5 based on mock data length
    
    const nextIdNum = lastIdNum + 1;
    const nextId = `EJO-2026-${String(nextIdNum).padStart(3, '0')}`;

    // ponytail: Allow custom EJO ID for admins
    let finalId = nextId;
    if (state.currentUser && (state.currentUser.role === 'Lead Engineer' || state.currentUser.role === 'Admin')) {
        const customId = prompt("Masukkan ID EJO Kustom (atau biarkan default):", nextId);
        if (customId === null) return; // cancel creation
        if (customId.trim() !== "") {
            finalId = customId.trim();
        }
    }

    const exists = state.ejos.some(e => e.id === finalId);
    if (exists) {
        showToast(`ID EJO "${finalId}" sudah terdaftar!`, "error");
        return;
    }

    const now = new Date();
    const timestamp = now.getFullYear() + "-" + 
                      String(now.getMonth()+1).padStart(2, '0') + "-" + 
                      String(now.getDate()).padStart(2, '0') + " " + 
                      String(now.getHours()).padStart(2, '0') + ":" + 
                      String(now.getMinutes()).padStart(2, '0');

    const newEjo = {
        id: finalId,
        title,
        dept,
        category,
        priority,
        location,
        targetDate,
        status: "Requested",
        engineer: engineer === "Unassigned" ? "Unassigned" : engineer,
        estCost: budget,
        actCost: 0,
        description: finalDescription,
        requester: state.currentUser ? state.currentUser.fullname : "System User",
        logs: [
            { date: timestamp, message: `Permintaan Job Order dibuat oleh unit ${dept}.` }
        ]
    };

    if (engineer !== "Unassigned") {
        newEjo.status = "Approved"; // If assigned upon creation, skip requested state to Approved
        newEjo.logs.push({ date: timestamp, message: `Job Order disetujui otomatis dan didelegasikan kepada ${engineer}.` });
    }

    const submitBtn = document.querySelector('#ejo-form button[type="submit"]');
    let originalHtml = "";
    if (submitBtn) {
        originalHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.textContent = "Mengirim...";
    }

    try {
        const res = await fetch("/api/ejos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEjo)
        });
        if (!res.ok) throw new Error("Gagal menyimpan EJO ke server");
        const resData = await res.json();
        // ponytail: use actual saved ID returned from server (handles auto-increment de-duplication)
        const savedId = resData.id || finalId;

        await initData();

        // Push notification
        notifications.unshift({
            id: Date.now(),
            time: timestamp.split(' ')[1] + " WIB",
            text: `Job Order Baru ${savedId} berhasil dibuat`
        });

        // Reset Form
        document.getElementById("ejo-form").reset();
        
        // ponytail: Reset mock attachment text and file input in UI
        state.createFormAttachments = [];
        renderCreateFormAttachments();
        const fileInputEl = document.getElementById("form-attachment");
        if (fileInputEl) fileInputEl.value = "";
        const span = document.querySelector(".file-upload-mock span");
        if (span) span.textContent = "Klik atau seret gambar ke sini";
        
        // Switch to Job Orders List Tab
        switchTab("job-orders");
        showToast(`Order ${savedId} berhasil dibuat & dikirim`, "success");
    } catch (err) {
        console.error(err);
        showToast("Gagal menyimpan EJO ke database server!", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHtml;
            lucide.createIcons();
        }
    }
}

// ==========================================
// Utility Helper Functions
// ==========================================
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
function getStatusClass(status) {
    switch (status) {
        case 'Requested': return 'requested';
        case 'Approved': return 'approved';
        case 'In Progress': return 'progress';
        case 'Completed': return 'completed';
        case 'Cancelled': return 'cancelled';
        default: return 'requested';
    }
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
function renderProjects() {
    const container1 = document.getElementById("container-fase1");
    const container2 = document.getElementById("container-fase2");
    const container3 = document.getElementById("container-fase3");
    
    if (!container1 || !container2 || !container3) return;

    // Reset container contents
    container1.innerHTML = "";
    container2.innerHTML = "";
    container3.innerHTML = "";

    // Counters
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;

    // Render cards
    state.projects.forEach(p => {
        const cardHtml = `
            <div class="project-card">
                <div class="project-card-header">
                    <span class="project-card-id">${p.id}</span>
                    <span class="badge badge-accent" style="font-size:0.65rem;">${p.dept}</span>
                </div>
                <h5 class="project-card-title">${p.title}</h5>
                <p class="project-card-desc">${p.desc}</p>
                
                <div class="project-card-meta">
                    <div class="project-meta-item">
                        <i data-lucide="user"></i>
                        <span>PIC: ${p.pic}</span>
                    </div>
                    <div class="project-meta-item">
                        <i data-lucide="wallet"></i>
                        <span>CapEx: Rp ${formatRupiah(p.budget)}</span>
                    </div>
                    <div class="project-meta-item">
                        <i data-lucide="calendar"></i>
                        <span>Target: ${formatDisplayDate(p.targetDate)}</span>
                    </div>
                </div>

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
        }
    });

    // Update headers counts
    document.getElementById("count-fase1").textContent = count1;
    document.getElementById("count-fase2").textContent = count2;
    document.getElementById("count-fase3").textContent = count3;

    lucide.createIcons();
}

function getProjectCardActions(p) {
    const isLead = state.currentUser && (state.currentUser.role === 'Lead Engineer' || state.currentUser.role === 'Admin');
    if (!isLead) {
        return `<span class="text-muted text-xs" style="font-style: italic;">Hanya Lead Engineer / Admin yang dapat memproses</span>`;
    }

    if (p.phase === 1) {
        return `
            <button class="btn btn-danger-outline btn-xs" onclick="deleteProject('${p.id}')">Hapus</button>
            <button class="btn btn-primary btn-xs" onclick="moveProjectPhase('${p.id}', 1)">Setujui &rarr;</button>
        `;
    } else if (p.phase === 2) {
        return `
            <button class="btn btn-outline btn-xs" onclick="moveProjectPhase('${p.id}', -1)">&larr; Balikkan</button>
            <button class="btn btn-primary btn-xs" onclick="moveProjectPhase('${p.id}', 1)">Barang Ready &rarr;</button>
        `;
    } else if (p.phase === 3) {
        return `
            <button class="btn btn-outline btn-xs" onclick="moveProjectPhase('${p.id}', -1)">&larr; Pengadaan</button>
            <button class="btn btn-primary btn-xs glow-button" onclick="convertProjectToEJO('${p.id}')">Mulai EJO <i data-lucide="zap" style="width:10px;height:10px;display:inline;"></i></button>
        `;
    }
    return '';
}

async function createNewProject() {
    const title = document.getElementById("proj-title").value;
    const dept = document.getElementById("proj-dept").value;
    const budget = parseInt(document.getElementById("proj-budget").value) || 0;
    const targetDate = document.getElementById("proj-target").value;
    const pic = document.getElementById("proj-pic").value;
    const desc = document.getElementById("proj-desc").value;

    // Generate project code sequential
    const lastIdNum = state.projects.reduce((max, item) => {
        const parts = item.id.split('-');
        const num = parseInt(parts[2]);
        return num > max ? num : max;
    }, 3); // Starts from 3 based on mock dataset length
    
    const nextIdNum = lastIdNum + 1;
    const nextId = `PRJ-2026-${String(nextIdNum).padStart(3, '0')}`;

    const newProject = {
        id: nextId,
        title,
        dept,
        budget,
        targetDate,
        pic,
        desc,
        phase: 1 // Default to Phase 1: Inisialisasi Ide
    };

    try {
        const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProject)
        });
        if (!res.ok) throw new Error("Gagal membuat project");

        await initData();

        // Log Notification
        const now = new Date();
        const timeStr = String(now.getHours()).padStart(2, '0') + ":" + String(now.getMinutes()).padStart(2, '0') + " WIB";
        notifications.unshift({
            id: Date.now(),
            time: timeStr,
            text: `Project Baru ${nextId} berhasil diusulkan ke atasan`
        });

        // Reset Form
        document.getElementById("project-form").reset();
        document.getElementById("project-form-container").style.display = 'none';
        document.getElementById("btn-toggle-new-project").innerHTML = '<i data-lucide="plus-circle"></i> Project Baru';
        
        showToast(`Gagasan Project ${nextId} berhasil diajukan`, "success");
    } catch (err) {
        console.error(err);
        showToast("Gagal menyimpan project ke database server!", "error");
    }
}

async function moveProjectPhase(projId, direction) {
    const proj = state.projects.find(p => p.id === projId);
    if (!proj) return;

    const oldPhase = proj.phase;
    const newPhase = oldPhase + direction;

    if (newPhase >= 1 && newPhase <= 3) {
        try {
            const res = await fetch(`/api/projects/${projId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phase: newPhase })
            });
            if (!res.ok) throw new Error("Gagal mengubah fase");

            await initData();
            
            // Log notification
            const now = new Date();
            const timeStr = String(now.getHours()).padStart(2, '0') + ":" + String(now.getMinutes()).padStart(2, '0') + " WIB";
            notifications.unshift({
                id: Date.now(),
                time: timeStr,
                text: `Project ${proj.id} dipindahkan ke Fase ${newPhase}`
            });

            showToast(`Project ${proj.id} dipindahkan ke Fase ${newPhase}`, "info");
        } catch (err) {
            console.error(err);
            showToast("Gagal memindahkan fase di database server!", "error");
        }
    }
}

async function deleteProject(projId) {
    const confirmDel = confirm(`Apakah Anda yakin ingin membatalkan project ${projId}?`);
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

async function convertProjectToEJO(projId) {
    if (state._isConverting) return;
    const proj = state.projects.find(p => p.id === projId);
    if (!proj) return;
    
    state._isConverting = true;

    // Auto map PIC to a default EJO category
    // Ahmad Dani -> Mekanik, Budi Utomo -> Program, Charlie -> Sipil, Deddy -> Kalibrasi
    let ejoCategory = "Program";
    if (proj.pic === "Ahmad Dani") ejoCategory = "Mekanik";
    else if (proj.pic === "Charlie Santoso") ejoCategory = "Sipil";
    else if (proj.pic === "Deddy Corbuzier") ejoCategory = "Kalibrasi";

    // Generate EJO Code
    const lastIdNum = state.ejos.reduce((max, item) => {
        const parts = item.id.split('-');
        const num = parseInt(parts[2]);
        return num > max ? num : max;
    }, 5);
    
    const nextIdNum = lastIdNum + 1;
    const nextId = `EJO-2026-${String(nextIdNum).padStart(3, '0')}`;

    // ponytail: Allow custom EJO ID for project approval/conversion
    let finalId = nextId;
    const customId = prompt("Masukkan ID EJO Kustom untuk Project ini (atau biarkan default):", nextId);
    if (customId === null) return; // cancel conversion
    if (customId.trim() !== "") {
        finalId = customId.trim();
    }

    const exists = state.ejos.some(e => e.id === finalId);
    if (exists) {
        showToast(`ID EJO "${finalId}" sudah terdaftar!`, "error");
        return;
    }

    const now = new Date();
    const timestamp = now.getFullYear() + "-" + 
                      String(now.getMonth()+1).padStart(2, '0') + "-" + 
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
        status: "Approved", // Approved immediately since the CapEx project itself is fully authorized
        engineer: proj.pic,
        estCost: proj.budget,
        actCost: 0,
        description: `Project Capex ${proj.id} yang telah disetujui. Detail PIC: ${proj.pic}. Deskripsi Rencana Kerja: ${proj.desc}`,
        requester: state.currentUser ? state.currentUser.fullname : (proj.pic || "System User"),
        logs: [
            { date: timestamp, message: `EJO dibuat otomatis dari Papan Project Monitoring (${proj.id}).` }
        ]
    };

    try {
        // Create new EJO
        const resEjo = await fetch("/api/ejos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEjo)
        });
        if (!resEjo.ok) throw new Error("Gagal menyimpan EJO baru");

        // Delete from projects list
        const resProj = await fetch(`/api/projects/${projId}`, {
            method: "DELETE"
        });
        if (!resProj.ok) throw new Error("Gagal menghapus project asal");

        await initData();

        // Log notification
        notifications.unshift({
            id: Date.now(),
            time: timestamp.split(' ')[1] + " WIB",
            text: `EJO Baru ${finalId} rilis dari Project ${projId}`
        });

        showToast(`Project ${projId} dipromosikan menjadi EJO ${finalId}!`, "success");
        
        // Switch to Job Orders view
        switchTab("job-orders");
    } catch (err) {
        console.error(err);
        showToast("Gagal mempromosikan project ke EJO di database server!", "error");
    } finally {
        state._isConverting = false;
    }
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
        
        // ponytail: Keep engineersList and state synced with database users dynamically
        state.users = users;
        engineersList = users.map(u => ({
            name: u.fullname,
            role: u.role,
            avatar: u.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80'
        }));
        populateEngineerDropdowns();
        renderEngineersView();
        
        const tbody = document.getElementById("user-table-body");
        if (!tbody) return;
        
        tbody.innerHTML = users.map(u => {
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
                            <span class="password-text" data-password="${u.password}">••••••</span>
                            <button type="button" class="btn-pw-toggle" onclick="toggleUserPasswordVisibility(this)" title="Tampilkan Password">
                                <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
                            </button>
                        </div>
                    </td>
                    <td>
                        <div class="user-actions-cell">
                            <button class="btn-user-edit" onclick="editUser('${u.username}', '${u.fullname}', '${u.role}', '${u.avatar || ''}', '${u.password}')">
                                <i data-lucide="edit-3" style="width: 12px; height: 12px;"></i> Edit
                            </button>
                            <button class="btn-user-delete" onclick="deleteUser('${u.username}')">
                                <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i> Hapus
                            </button>
                        </div>
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
    
    const modeInput = document.getElementById("user-form-mode");
    if (modeInput) modeInput.value = "add";
    
    const titleEl = document.getElementById("user-form-title");
    if (titleEl) titleEl.textContent = "Daftarkan User Baru";
    
    const submitBtn = document.getElementById("btn-save-user-submit");
    if (submitBtn) submitBtn.innerHTML = '<i data-lucide="save"></i> Simpan User';
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
    
    const userData = { username, password, fullname, role, avatar };
    
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

// Global functions for table actions
window.editUser = function(username, fullname, role, avatar, password) {
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
    
    document.getElementById("usr-password").value = password;
    document.getElementById("usr-password").setAttribute("required", "required");
    document.getElementById("usr-fullname").value = fullname;
    document.getElementById("usr-role").value = role;
    document.getElementById("usr-avatar").value = avatar;
};

window.deleteUser = async function(username) {
    if (state.currentUser && state.currentUser.username === username) {
        showToast("Anda tidak bisa menghapus akun Anda sendiri yang sedang aktif!", "error");
        return;
    }
    
    const confirmDel = confirm(`Apakah Anda yakin ingin menghapus user "${username}"?`);
    if (!confirmDel) return;
    
    try {
        const res = await fetch(`/api/users/${username}`, {
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

window.toggleUserPasswordVisibility = function(button) {
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

// ponytail: Handle direct deletion of EJO history records
window.deleteHistoryEJO = async function(id) {
    const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus Riwayat Job Order ${id}?`);
    if (!confirmDelete) return;
    
    try {
        const res = await fetch(`/api/ejos/${id}`, {
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
window.addEventListener('error', function(e) {
    console.error("Global Error Caught:", e.error);
    showToast("System Error: " + e.message + " (at " + (e.filename ? e.filename.split('/').pop() : 'script') + ":" + e.lineno + ")", "error");
});

// ponytail: helper mapping functions for Excel Export/Import
function mapDeptToExcel(dept) {
    const mapping = {
        'Production': 'PRD',
        'Maintenance': 'ENG',
        'Quality Control': 'QC',
        'HSE': 'HSE',
        'Utility': 'UTL'
    };
    return mapping[dept] || dept || '';
}

function mapCategoryToExcel(cat) {
    const mapping = {
        'Sipil': 'CIV',
        'Mekanik': 'MEC',
        'Elektrik': 'ELC',
        'Kalibrasi': 'CAL',
        'Otomotif': 'AUT',
        'Program': 'PRG'
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
    return mapping[status] || status || '';
}

function getCompletedDateFromLogs(logs) {
    if (!logs) return '';
    let parsed = [];
    try {
        // ponytail: wrap JSON.parse in try-catch to avoid crashing if logs format is not valid JSON
        parsed = Array.isArray(logs) ? logs : JSON.parse(logs);
    } catch (e) {
        console.error("Gagal parse logs:", e);
    }
    if (!Array.isArray(parsed)) return '';
    const compLog = parsed.find(log => log.message.includes('selesai') || log.message.includes('Completed') || log.message.includes('selesai dilakukan'));
    return compLog ? compLog.date.split(' ')[0] : '';
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
        const matchesDept = deptVal === 'all' || ejo.dept === deptVal;

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
          <td>${getCompletedDateFromLogs(e.logs)}</td>
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
    if (!val) return 'Production';
    const clean = val.toUpperCase().trim();
    if (clean === 'PRD') return 'Production';
    if (clean === 'ENG') return 'Maintenance';
    if (clean === 'QC') return 'Quality Control';
    if (clean === 'HSE') return 'HSE';
    if (clean === 'UTL') return 'Utility';
    
    const depts = ['Production', 'Maintenance', 'Quality Control', 'HSE', 'Utility'];
    const found = depts.find(d => d.toUpperCase() === clean);
    return found || val;
}

function mapExcelToCategory(val) {
    if (!val) return 'Mekanik';
    const clean = val.toUpperCase().trim();
    if (clean === 'CIV') return 'Sipil';
    if (clean === 'MEC') return 'Mekanik';
    if (clean === 'ELC') return 'Elektrik';
    if (clean === 'CAL') return 'Kalibrasi';
    if (clean === 'AUT') return 'Otomotif';
    if (clean === 'PRG') return 'Program';
    
    const cats = ['Sipil', 'Elektrik', 'Kalibrasi', 'Mekanik', 'Otomotif', 'Program'];
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

async function importFromExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet);

            if (rows.length === 0) {
                showToast("File Excel kosong!", "warning");
                return;
            }

            let importCount = 0;
            const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

            for (const row of rows) {
                const ticketId = row['Ticket ID'] ? String(row['Ticket ID']).trim() : null;
                if (!ticketId) continue;

                const title = row['Subject'] ? String(row['Subject']).trim() : 'Imported EJO';
                const dept = mapExcelToDept(row['Dep']);
                const category = mapExcelToCategory(row['Tin']);
                const rawDate = row['Date'] ? String(row['Date']).trim() : '';
                const dateMatch = rawDate.match(/^(\d{4}-\d{2}-\d{2})/);
                const targetDate = dateMatch ? dateMatch[1] : new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
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

                const existing = state.ejos.find(item => item.id.toLowerCase() === ticketId.toLowerCase());

                // ponytail: safely clone/parse existing logs or initialize to an empty array
                let logsList = [];
                if (existing && existing.logs) {
                    try {
                        logsList = Array.isArray(existing.logs) ? [...existing.logs] : JSON.parse(existing.logs);
                    } catch (err) {
                        logsList = [];
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
                    logs: logsList
                };

                if (existing) {
                    ejoData.logs.push({
                        date: timestamp,
                        message: `EJO diperbarui melalui import Excel oleh ${state.currentUser ? state.currentUser.fullname : 'System'}.`
                    });
                    const res = await fetch(`/api/ejos/${existing.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(ejoData)
                    });
                    if (!res.ok) console.error("Gagal mengupdate EJO: " + ticketId);
                } else {
                    ejoData.logs.push({
                        date: timestamp,
                        message: `EJO dibuat melalui import Excel oleh ${state.currentUser ? state.currentUser.fullname : 'System'}.`
                    });
                    const res = await fetch("/api/ejos", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(ejoData)
                    });
                    if (!res.ok) console.error("Gagal membuat EJO: " + ticketId);
                }
                importCount++;
            }

            showToast(`${importCount} Job Orders berhasil diproses!`, "success");
            await initData();
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
function runExcelSelfTest() {
    try {
        console.assert(mapDeptToExcel('Production') === 'PRD', 'Dept translation failed');
        console.assert(mapExcelToDept('PRD') === 'Production', 'Excel to Dept translation failed');
        console.assert(mapCategoryToExcel('Sipil') === 'CIV', 'Category translation failed');
        console.assert(mapExcelToCategory('CIV') === 'Sipil', 'Excel to Category translation failed');
        console.assert(mapStatusToExcel('Requested') === 'Unprocessed Ticket', 'Status translation failed');
        console.assert(mapExcelToStatus('Unprocessed Ticket') === 'Requested', 'Excel to Status translation failed');
        console.log("Excel Self Test: OK");
    } catch (e) {
        console.error("Excel Self Test: FAILED", e);
    }
}

