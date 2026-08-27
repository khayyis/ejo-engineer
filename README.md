# EJO Engineer Management System

Production-grade Engineering Job Order (EJO) tracking, drawing revision lifecycle, and daily technical personnel activity logging system for PT. BAS.

---

## Architectural Overview

```
[ Web Browser Client ]
        │
        ▼ (Vanilla ES6+ SPA / Chart.js / Reactive State)
[ Nginx / Web Server ]
        │
        ├──► Static Assets Mirror (Root / Public Web Root)
        └──► Laravel REST API Backend (PHP 8.x)
                    │
                    ├──► SQLite Database (WAL Mode)
                    └──► Internal SAP Synchronization Worker
```

### Core Architecture Highlights

- **Zero-Build Dependency Frontend:** Built with high-performance Vanilla ES6+ without bundling overhead, leveraging browser-native DOM APIs and CSS variable design tokens.
- **Atomic State Synchronization:** Single source of truth for application state with reactive filtering across Kanban pipelines and tabular views.
- **Triple-Target File Mirroring:** Ensures consistency across local development, Blade templates, and production public assets.

---

## Key Modules

### 1. General & Drawing EJO Lifecycle
- Multi-stage status pipeline: `Requested` &rarr; `In Progress` &rarr; `Completed`.
- Material request tracking, engineering drawing versioning, and technician PIC assignment.
- Bi-directional task linking between tickets and personnel log entries.

### 2. Daily Activity & WhatsApp Broadcast Engine
- Automated & manual logging for Engineering (`TIM_EJO`) and Drafting (`TIM_DRAFTER`) teams.
- **Task-Grouped Rendering (`byTask`):** Merges multi-personnel activities into clean, consolidated table rows.
- **Reactive Ticket Filter:** Interactively queries and attaches active on-progress EJO tickets to selected technicians.
- **Attendance Status Parser:** Automatic styling and classification for non-working states (`CUTI`, `OFF`, `NPL`, `IZIN`, `SAKIT`).
- **Direct Cross-Navigation:** Clickable badge identifiers that automatically open and filter the target ticket in General or Drawing EJO tabs.

### 3. Workload Analytics & Rolling Metrics
- Workload distribution and completion performance analytics.
- Standardized rolling window calculations:
  - **Weekly:** Previous completed Monday-to-Sunday cycle.
  - **Monthly:** 28 full calendar days preceding current cycle.
  - **Yearly:** 365 calendar days rolling window.

---

## API Reference (Selected Endpoints)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/login` | Session authentication & device binding |
| `GET` | `/api/general-ejos` | Fetch all general job orders |
| `POST` | `/api/general-ejos` | Create new general job order |
| `PUT` | `/api/general-ejos/{id}` | Update ticket attributes & status |
| `DELETE`| `/api/general-ejos/{id}` | Remove ticket record |
| `GET` | `/api/drawing-ejos` | Fetch technical drawing tickets |
| `GET` | `/api/daily-activity-logs` | Fetch daily activity logs by date |
| `POST` | `/api/daily-activity-logs` | Create single or batch daily logs |
| `PUT` | `/api/daily-activity-logs/{id}` | Update existing activity log |
| `DELETE`| `/api/daily-activity-logs/{id}` | Delete activity log entry |

---

## Repository Structure

```
├── app.js                          # Core client-side business logic & routing
├── index.html                      # Root single-page application entrypoint
├── style.css                       # Design token specifications & layout stylesheets
├── laravel/
│   ├── app/Http/Controllers/Api/   # API Resource Controllers (EjoController)
│   ├── database/                   # Schema migrations & SQLite database file
│   ├── public/                     # Public webroot asset mirror
│   ├── resources/
│   │   ├── js/app.js               # Development JS source mirror
│   │   └── views/welcome.blade.php # Production Blade entrypoint
│   └── routes/
│       └── api.php                 # HTTP route definitions
└── README.md                       # Project documentation
```

---

## Getting Started

### Prerequisites
- PHP >= 8.1
- Composer
- SQLite 3
- Node.js (for static syntax inspection)

### Installation

1. **Clone repository & enter project directory:**
   ```bash
   git clone https://github.com/khayyis/ejo-engineer.git
   cd ejo-engineer/laravel
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Initialize database schema:**
   ```bash
   touch database/database.sqlite
   php artisan migrate --force
   ```

5. **Start development server:**
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

---

## Engineering Guidelines

### Asset Mirroring & Cache Protocol
Any modification to client-side logic or stylesheets must be synchronized across all three file targets:

```
Root File               Public Mirror                     Blade Template Mirror
app.js          ───►    laravel/public/app.js       ───►  laravel/resources/js/app.js
style.css       ───►    laravel/public/style.css    ───►  (linked in welcome.blade.php)
index.html      ───►    laravel/public/index.html   ───►  laravel/resources/views/welcome.blade.php
```

After updating assets, increment the query string cache parameter in HTML/Blade:
- `app.js?v=XX.0`
- `style.css?v=XX.0`

### Static Syntax Check
Verify JavaScript files before committing:
```bash
node --check app.js
node --check laravel/public/app.js
node --check laravel/resources/js/app.js
```
