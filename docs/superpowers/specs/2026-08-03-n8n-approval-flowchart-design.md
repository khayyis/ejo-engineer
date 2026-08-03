# Technical Specification: n8n Node-Based Workflow Canvas for Approval Flowchart

## 1. Context & Overview
Supercharging the **Manajemen Akses Akun** module in EJO Engineer with an authentic **n8n-style visual node workflow canvas** for managing approval flowcharts across:
1. **General EJO** (`approval_flowchart_gejo`)
2. **Drawing EJO** (`approval_flowchart_drawing`)
3. **Project Monitoring** (`approval_flowchart_project`)

Admin users can visually structure, add, edit, reorder, and remove multi-step approval workflows using visual node cards, SVG connecting bezier paths, port handles, and instant server synchronization via `/api/settings` (`PUT`).

---

## 2. Design Architecture & Visual Aesthetics

### **Canvas Layout & Aesthetics**
- **Dot-Grid Background Canvas**: Dark background `#121519` with a subtle radial dot-grid pattern (`#2a2e37` dots every 20px).
- **Floating Control Header Bar**:
  - Module Title & Badge (e.g. `General EJO`, `Drawing EJO`, `Project`).
  - View Mode Toggle Switch: **Visual Canvas Node (n8n)** ⇄ **Form Table List**.
  - Action Controls: **+ Tambah Step Node**, **Reset Default**, **Simpan Flowchart**.
  - Server Sync Indicator Badge (`Synced Server Config`).

### **Node Card Components**
1. **Start Node (Trigger Node)**:
   - Fixed left-aligned node.
   - Title: `Trigger: EJO Dibuat`
   - Subtitle: `Inisiator Pembuat Ticket`
   - Icon: Green clock/zap icon inside glowing circle.
   - Output Port (Right): Glowing circle handle connecting to Step 1.
2. **Approval Step Nodes (Middle Chain)**:
   - Dynamic step node cards.
   - Header: Step number badge (`STEP 1`, `STEP 2`, etc.) + Step Label (e.g. `FOREMAN ENG`).
   - Input Port (Left) & Output Port (Right).
   - Card Body:
     - Target Role Badge & Select Dropdown (e.g. `Foreman Eng`).
     - Dept Badge & Select Dropdown (e.g. `ENG`).
     - `Wajib TTD` checkbox toggle.
   - Card Controls:
     - Left/Right Reorder arrows.
     - Quick Edit modal/popover button.
     - Trash/Delete step button.
3. **End Node (Completion Node)**:
   - Fixed right-aligned node.
   - Title: `Status: Complete`
   - Subtitle: `Persetujuan Final & Stempel PDF`
   - Icon: Glowing green check-circle.
   - Input Port (Left): Connected from final approval step.

### **Connecting Bezier SVG Paths**
- Dynamic SVG canvas layer overlaying the workflow nodes.
- Smooth cubic bezier curves (`M x1 y1 C x1+offset y1, x2-offset y2, x2 y2`) connecting Output Ports to Input Ports.
- Styled with glowing cyan gradients (`#06b6d4` stroke with gaussian glow filter) and directional arrow markers.

---

## 3. Server Synchronization & Data Flow
- **Data Persistence**: Configured steps array `[ { step: 1, key: '...', label: '...', role: '...', dept: '...', require_signature: 1 }, ... ]` is saved directly to SQLite `settings` table via `PUT /api/settings` JSON payload.
- **Bi-directional Sync**:
  - Modifying any node (label, role, dept, require_signature, reorder, delete, add) updates `state.activeFlowchartSteps` in real time.
  - Re-rendering updates both the **Visual Canvas Node Graph** and **Form Table List** simultaneously.
  - Clicking "Simpan Flowchart" sends updated payload to `/api/settings` and triggers a success toast notification.

---

## 4. Verification & Testing Strategy
- Automated Python test suite (`test_flowchart_sync.py`) verifying:
  1. `GET /api/settings` returns valid default flowchart arrays for `approval_flowchart_gejo`, `approval_flowchart_drawing`, `approval_flowchart_project`.
  2. `PUT /api/settings` successfully updates and persists custom step modifications.
  3. Real-time array parsing and validation logic.
