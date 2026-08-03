# Approval Flowchart Management & Synchronization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan submenu "Flowchart Tanda Tangan" (General EJO, Drawing EJO, Project) di bawah "Manajemen Akses Akun", dengan Flowchart Editor visual, serta tersinkronisasi terpusat ke database server dan kartu Persetujuan Bertingkat.

**Architecture:** Backend mendaftarkan default JSON flowchart di tabel `settings` SQLite dan melayani update via `/api/settings` (`PUT`). Frontend `index.html` dan `app.js` memperbarui sidebar navigasi dengan submenu bertingkat, merender editor alur persetujuan per modul, serta merender kartu Persetujuan Bertingkat secara dinamis.

**Tech Stack:** JavaScript (ES6+ Vanilla), HTML5, CSS3, Python (http.server / SQLite3), PyMuPDF.

## Global Constraints
- Settings updates MUST use `PUT` on `/api/settings`.
- Table `settings` is key-value (`key TEXT PRIMARY KEY`, `value TEXT`).
- No raw file inputs or hardcoded broken paths.

---

### Task 1: Server Settings Defaults & Flowchart Handlers in `server.py`

**Files:**
- Modify: `server.py:555-570`, `server.py:2935-2965`

**Interfaces:**
- Consumes: SQLite `settings` table.
- Produces: Default keys `approval_flowchart_gejo`, `approval_flowchart_drawing`, `approval_flowchart_project` in `/api/settings`.

- [ ] **Step 1: Check existing `settings` default insertions in `server.py`**
- [ ] **Step 2: Add default JSON string registrations for `approval_flowchart_gejo`, `approval_flowchart_drawing`, `approval_flowchart_project` in `server.py`**
- [ ] **Step 3: Test server start and verify default settings endpoint output via curl / python test script**
- [ ] **Step 4: Commit**

```bash
git add server.py
git commit -m "feat(server): add default approval flowchart settings for gejo, drawing, and project"
```

---

### Task 2: Sidebar Submenu HTML & Flowchart Editor Container in `index.html`

**Files:**
- Modify: `index.html:235-249`, `index.html:1786-1870`

**Interfaces:**
- Consumes: Sidebar navigation structure & `tab-server-access`.
- Produces: Submenu structure for `Flowchart Tanda Tangan` (`General EJO`, `Drawing EJO`, `Project`) and `#server-access-flowchart-view`.

- [ ] **Step 1: Update `server-access-submenu` in `index.html` to add `Flowchart Tanda Tangan` group and sub-buttons (`flow-gejo`, `flow-drawing`, `flow-project`)**
- [ ] **Step 2: Add `#server-access-flowchart-view` inside `#tab-server-access` for rendering flowchart configuration editor**
- [ ] **Step 3: Verify HTML layout structure**
- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(ui): add flowchart submenus under Manajemen Akses Akun and editor container"
```

---

### Task 3: Flowchart View Switching & Editor Logic in `app.js`

**Files:**
- Modify: `app.js:2018-2029`, `app.js:16554-16620`

**Interfaces:**
- Consumes: `/api/settings` GET response.
- Produces: `renderFlowchartEditor(moduleType)`, `saveFlowchartConfig(moduleType)`, and updated `switchServerAccessViewMode(mode)`.

- [ ] **Step 1: Extend `switchServerAccessViewMode(mode)` to support `flow-gejo`, `flow-drawing`, `flow-project`**
- [ ] **Step 2: Implement `renderFlowchartEditor(moduleType)` to build interactive step list (add, delete, reorder, edit labels & roles)**
- [ ] **Step 3: Wire save button to send `PUT` payload to `/api/settings` and trigger toast notification**
- [ ] **Step 4: Commit**

```bash
git add app.js
git commit -m "feat(js): implement flowchart editor rendering and settings persistence"
```

---

### Task 4: Dynamic Synchronization for Persetujuan Bertingkat Modal Cards

**Files:**
- Modify: `app.js: (EJO & Drawing & Project approval card rendering functions)`

**Interfaces:**
- Consumes: `state.settings.approval_flowchart_*`.
- Produces: Dynamic steps in detail modal cards for General EJO, Drawing EJO, and Project.

- [ ] **Step 1: Update General EJO detail modal rendering to parse `approval_flowchart_gejo` and build dynamic Persetujuan Bertingkat cards**
- [ ] **Step 2: Update Drawing EJO detail modal rendering to parse `approval_flowchart_drawing` and build dynamic Persetujuan Bertingkat cards**
- [ ] **Step 3: Update Project detail modal rendering to parse `approval_flowchart_project` and build dynamic Persetujuan Bertingkat cards**
- [ ] **Step 4: Test modal rendering across all 3 modules**
- [ ] **Step 5: Commit**

```bash
git add app.js
git commit -m "feat(sync): dynamic persetujuan bertingkat rendering based on active flowchart settings"
```

---

### Task 5: End-to-End Verification & Automated Test Script

**Files:**
- Create: `test_flowchart_sync.py`

- [ ] **Step 1: Write python test script `test_flowchart_sync.py` to test GET/PUT `/api/settings` and verify flowchart persistence**
- [ ] **Step 2: Run test script and verify all assertions pass**
- [ ] **Step 3: Verify sidebar menu and modal rendering in live app**
- [ ] **Step 4: Commit**

```bash
git add test_flowchart_sync.py
git commit -m "test: add automated end-to-end test script for approval flowchart sync"
```
