# n8n Visual Workflow Canvas for Approval Flowchart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the EJO Approval Flowchart editor into an authentic, interactive n8n-style visual node canvas with SVG bezier curve connections and real-time server synchronization.

**Architecture:** Render a node-based visual workflow graph (Start Node ➔ Step Approval Nodes ➔ End Node) with dynamic SVG bezier path rendering, inline popover/modal node edits, and dual-mode toggle (Visual Canvas ⇄ Form List) synchronized to SQLite via `PUT /api/settings`.

**Tech Stack:** HTML5, Vanilla JavaScript, CSS Grid/Flexbox with dot-grid canvas, SVG Bezier Path rendering, Lucide icons, Python SQLite test suite.

## Global Constraints
- **Theme Support**: Seamless dark (`#121519`) and light mode styling for canvas & node cards.
- **REST Method**: Updates to settings MUST use `PUT /api/settings`.
- **Zero Loss**: All changes in node canvas must sync bi-directionally with form list view.

---

### Task 1: CSS Design System for n8n Canvas & Node Cards

**Files:**
- Modify: `style.css:5200-5300`

**Interfaces:**
- Produces: CSS classes `.n8n-canvas-wrapper`, `.n8n-dot-grid`, `.n8n-node-card`, `.n8n-node-header`, `.n8n-node-port`, `.n8n-svg-layer`, `.n8n-toolbar`

- [ ] **Step 1: Write CSS rules for n8n canvas & dot-grid background**

Add canvas grid background and wrapper styles in `style.css`:
```css
/* n8n Visual Node Canvas Styling */
.n8n-canvas-wrapper {
    position: relative;
    width: 100%;
    min-height: 480px;
    background-color: #121519;
    background-image: radial-gradient(#2a2e37 1.5px, transparent 1.5px);
    background-size: 24px 24px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow: x-auto;
    padding: 2.5rem 2rem;
    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.6);
}

[data-theme="light"] .n8n-canvas-wrapper {
    background-color: #f8fafc;
    background-image: radial-gradient(#cbd5e1 1.5px, transparent 1.5px);
    border-color: rgba(0, 0, 0, 0.08);
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.03);
}

.n8n-svg-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

.n8n-nodes-row {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 60px;
    min-width: max-content;
    padding: 20px 10px;
}

.n8n-node-card {
    position: relative;
    width: 220px;
    background: #1e222b;
    border: 1.5px solid rgba(255, 255, 255, 0.12);
    border-radius: 14px;
    padding: 1rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="light"] .n8n-node-card {
    background: #ffffff;
    border-color: rgba(0, 0, 0, 0.12);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.n8n-node-card:hover {
    border-color: var(--color-cyan);
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(6, 182, 212, 0.25);
}

.n8n-port {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--color-cyan);
    border: 2px solid #121519;
    box-shadow: 0 0 8px var(--color-cyan);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

.n8n-port-left { left: -6px; }
.n8n-port-right { right: -6px; }
```

- [ ] **Step 2: Verify CSS builds cleanly without syntax errors**

Inspect `style.css` for valid brackets.

- [ ] **Step 3: Commit CSS styles**

```bash
git add style.css
git commit -m "feat(ui): add n8n node canvas and card layout CSS styles"
```

---

### Task 2: JavaScript n8n Node Canvas Renderer & SVG Bezier Connections

**Files:**
- Modify: `app.js:16700-16850`

**Interfaces:**
- Consumes: `state.activeFlowchartSteps`, `state.settings`
- Produces: `renderN8nFlowchartCanvas(mode)`, `drawN8nBezierConnections()`, `renderFlowchartEditor(mode)`

- [ ] **Step 1: Build `renderN8nFlowchartCanvas(mode)` & SVG Bezier Path calculation**

Implement canvas markup and SVG bezier curve connection logic:
```javascript
function renderN8nFlowchartCanvas(mode) {
    const container = document.getElementById("server-access-flowchart-container");
    if (!container) return;

    let moduleTitle = "General EJO";
    let settingKey = "approval_flowchart_gejo";
    let moduleIcon = "file-text";

    if (mode === "flow-drawing") {
        moduleTitle = "Drawing EJO";
        settingKey = "approval_flowchart_drawing";
        moduleIcon = "image";
    } else if (mode === "flow-project") {
        moduleTitle = "Project Monitoring";
        settingKey = "approval_flowchart_project";
        moduleIcon = "folder-kanban";
    }

    const steps = state.activeFlowchartSteps || [];
    const viewMode = state.flowchartViewMode || 'visual'; // 'visual' or 'form'

    let html = `
        <div class="card-glass" style="padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; border-left: 4px solid var(--color-cyan); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                    <i data-lucide="${moduleIcon}" style="color: var(--color-cyan); width: 22px; height: 22px;"></i>
                    <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">Flowchart Approval: ${moduleTitle}</h3>
                    <span class="badge" style="background: rgba(6, 182, 212, 0.15); color: var(--color-cyan); border: 1px solid rgba(6, 182, 212, 0.3); font-size: 0.72rem; font-weight: 700; border-radius: 6px; padding: 3px 10px;">Synced Server Config</span>
                </div>
                <p class="text-secondary text-xs">Visualisasi alur persetujuan bertingkat n8n-style canvas node. Klik node untuk edit role & dept.</p>
            </div>
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <div style="background: var(--bg-surface); padding: 4px; border-radius: 10px; border: 1px solid var(--card-border); display: flex; gap: 4px;">
                    <button type="button" class="btn btn-xs ${viewMode === 'visual' ? 'btn-primary' : 'btn-outline'}" onclick="toggleFlowchartEditorView('visual', '${mode}')" style="gap: 4px; font-weight: 600;">
                        <i data-lucide="git-graph" style="width: 14px; height: 14px;"></i> Visual Canvas
                    </button>
                    <button type="button" class="btn btn-xs ${viewMode === 'form' ? 'btn-primary' : 'btn-outline'}" onclick="toggleFlowchartEditorView('form', '${mode}')" style="gap: 4px; font-weight: 600;">
                        <i data-lucide="list" style="width: 14px; height: 14px;"></i> Form List
                    </button>
                </div>
                <button type="button" class="btn btn-outline" onclick="addFlowchartStep('${settingKey}')" style="gap: 6px; font-size: 0.85rem;">
                    <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i> Tambah Step Node
                </button>
                <button type="button" class="btn btn-primary" onclick="saveFlowchartConfig('${settingKey}')" style="gap: 6px; font-size: 0.85rem; background: var(--color-cyan); color: #000; font-weight: 700;">
                    <i data-lucide="save" style="width: 16px; height: 16px;"></i> Simpan Flowchart
                </button>
            </div>
        </div>
    `;

    if (viewMode === 'form') {
        // Render detailed Form List view
        html += renderFlowchartFormListView(steps, settingKey);
    } else {
        // Render n8n Visual Canvas view
        html += renderN8nCanvasNodesView(steps, settingKey);
    }

    container.innerHTML = html;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (viewMode === 'visual') setTimeout(drawN8nBezierConnections, 50);
}
```

- [ ] **Step 2: Add SVG Bezier path computation helper `drawN8nBezierConnections()`**

```javascript
function drawN8nBezierConnections() {
    const svg = document.getElementById("n8n-svg-connections");
    const container = document.getElementById("n8n-nodes-row");
    if (!svg || !container) return;

    const ports = container.querySelectorAll(".n8n-port");
    const containerRect = container.getBoundingClientRect();
    
    let pathD = "";
    // Draw cubic bezier curves between consecutive right ports and left ports
    const rightPorts = container.querySelectorAll(".n8n-port-right");
    const leftPorts = container.querySelectorAll(".n8n-port-left");

    for (let i = 0; i < rightPorts.length; i++) {
        if (leftPorts[i + 1]) {
            const rRect = rightPorts[i].getBoundingClientRect();
            const lRect = leftPorts[i + 1].getBoundingClientRect();

            const x1 = rRect.left + rRect.width / 2 - containerRect.left;
            const y1 = rRect.top + rRect.height / 2 - containerRect.top;
            const x2 = lRect.left + lRect.width / 2 - containerRect.left;
            const y2 = lRect.top + lRect.height / 2 - containerRect.top;

            const dx = Math.abs(x2 - x1) * 0.5;
            pathD += `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2} `;
        }
    }

    svg.innerHTML = `
        <path d="${pathD}" stroke="var(--color-cyan)" stroke-width="3" fill="none" stroke-dasharray="6 3" opacity="0.85" filter="drop-shadow(0 0 6px var(--color-cyan))" />
    `;
}
```

- [ ] **Step 3: Test rendering via python script**

Run: `python test_flowchart_sync.py`
Expected: PASS

- [ ] **Step 4: Commit node canvas logic**

```bash
git add app.js
git commit -m "feat(ui): implement n8n visual node canvas renderer and SVG bezier curves"
```

---

### Task 3: Dual-Mode Toggle & Real-time Server Sync Integration

**Files:**
- Modify: `app.js`

**Interfaces:**
- Consumes: `saveFlowchartConfig(settingKey)`
- Produces: `toggleFlowchartEditorView(modeType, currentMode)`

- [ ] **Step 1: Implement `toggleFlowchartEditorView` & instant re-render**

```javascript
function toggleFlowchartEditorView(viewType, mode) {
    state.flowchartViewMode = viewType;
    renderFlowchartEditor(mode);
}
```

- [ ] **Step 2: Run verification script**

Run: `python test_flowchart_sync.py`
Expected: PASS

- [ ] **Step 3: Commit synchronization logic**

```bash
git add app.js
git commit -m "feat(ui): integrate dual-mode toggle and real-time n8n canvas server sync"
```

---

### Task 4: End-to-End Automated Verification Test

**Files:**
- Modify/Execute: `test_flowchart_sync.py`

- [ ] **Step 1: Execute Python automated test suite**

Run: `python test_flowchart_sync.py`
Expected output: `ALL TESTS PASSED CLEANLY!`

- [ ] **Step 2: Final git commit**

```bash
git commit --allow-empty -m "test: verify n8n approval flowchart visual node canvas and server sync"
```
