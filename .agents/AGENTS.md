# Antigravity Rules

## Always-Active Operating Modes & Execution Protocols
This project automatically operates under the following combined execution modes for **every prompt and new chat session**:

1. **`/speckit` & `/speckit-auto` (Default Spec-Driven Development Suite)**:
   - Automatically apply the Spec Kit workflow (`speckit-specify` -> `speckit-plan` -> `speckit-tasks` -> `speckit-implement`) and automatically auto-run combined suite: `/autopilot` + `/launch` + `/ultragoal` + `/ultrawork` for all development tasks.

2. **`/ultragoal` (Autonomous Multi-Goal Loop)**:
   - Automatically structure multi-step tasks into sequential, checkpointed goals and execute them continuously until fully complete.

3. **`/ultrawork` (High-Throughput Execution)**:
   - Deliver high-throughput batch updates and multi-file changes with periodic verification.

4. **`/autopilot` (Staged Autonomous Delivery)**:
   - Execute staged autonomous loops until all acceptance criteria pass or an explicit blocker is hit.

5. **`/launch` (Lifecycle Workflow Engine)**:
   - Maintain persistent workflow lifecycle management and structured execution stages.

6. **`/team` (Dynamic Multi-Agent Team Assembly)**:
   - Automatically assemble and delegate specialized tasks to appropriate subagent roles (e.g. debugging, research, architecture, verification) when beneficial.

7. **`/loop` (Strict Verify & Fix Loop)**:
   - Enforce execution -> verification -> fix loops continuously until empirical runtime tests pass.

8. **`/billawal` (High-Discipline Hyper-Orchestration Suite)**:
   - Automatically trigger and execute the hyper-orchestrated deterministic suite directly on the Main Agent, fully incorporating **`/teamwork-preview`** (structured prompt drafting & acceptance criteria), **`/learn`** (root cause analysis & persistent rule capture), and **`/goal`** (autonomous long-running goal loop with empirical verification until `<!-- GOAL_COMPLETE -->`). **MANDATORY PRE-FLIGHT DIRECT MAIN AGENT DIRECTIVE**: When `/billawal` is invoked by the user, (1) the Main Agent MUST FIRST execute `view_file` calls to read required dependency sub-skills (`using-git-worktrees` and `using-superpowers`). (2) IMMEDIATELY after reading the required sub-skills, the Main Agent MUST directly execute the engineering task end-to-end with maximum rigor, deep codebase research, high-precision changes, and strict empirical verification without delegating to subagents. **NON-DESTRUCTIVE DATA MANDATE**: Main Agent is strictly prohibited from deleting/replacing existing data metrics, UI elements, or chart series when adding new features, enforcing non-destructive append/overlay behavior unless explicit deletion is requested.


## Settings Management & API Integration
- **Settings Endpoint**: Any updates to global configuration settings must use the `/api/settings` endpoint.
- **HTTP Method**: Setting updates MUST use the `PUT` method. The `POST` method on `/api/settings` is not supported and will result in a 404/method not found error.
- **Database Schema**: The `settings` table is structured as a simple key-value store (`key TEXT PRIMARY KEY`, `value TEXT`). 
- **Default Registration**: When introducing a new setting, ensure it is registered on server initialization in `server.py` using `INSERT OR IGNORE INTO settings (key, value) VALUES ('your_key', 'default_value')` to avoid empty settings states.

## Mobile PDF Rendering
- **Inline PDF Previews on Mobile**: Avoid using raw `<object>`, `<embed>`, or `<iframe>` elements to display inline PDFs, because mobile browsers do not support native inline PDF viewing and will display fallback text or fail to load.
- **Canvas-based Rendering**: Use a library like `PDF.js` to render the PDF pages onto a `<canvas>` dynamically, ensuring cross-platform support. Always provide a fallback link/button to "Open in New Tab" or "Download" for compatibility.

## Mobile CSS & Layout Specificity Overrides
- **Avoiding Overridden Media Queries**: When customizing elements like `.control-bar` or other layout containers for mobile/tablet screens inside `@media` queries, always check if specific selectors (e.g., `#tab-general-ejo .control-bar`, `#tab-drawing .control-bar`) at the root level use `!important` or high-specificity rules that override the media query rules.
- **Specific Overrides**: Ensure that the mobile/tablet media query block explicitly overrides these specific selectors using `!important` to force correct flex/grid stacking on small screens.
- **Touch Targets**: Mobile filters (dropdown selects) and buttons in the control-bar should have touch-friendly heights (minimum `40px`) and stack vertically on widths `<= 768px` to prevent layout overlaps and narrow inputs.
- **Mobile Modal Layouts**: Modals on mobile viewports must always be capped (e.g., `max-height: 90vh`) and scrollable (`overflow-y: auto`) to avoid vertical content cutoff. Action and settings buttons inside mobile modals should stack vertically to prevent horizontal squishing and layout overlapping.
- **Mobile Header Session Details**: Critical session info (e.g., active user name/role) should be visible on mobile headers instead of hidden. Always constrain the text elements (e.g., `max-width: 90px`) and use text truncation (`text-overflow: ellipsis`) to prevent horizontal layout overlaps.
- **Mobile Brand Text Optimization**: To maximize header space for user details and actions on mobile viewports, secondary brand text (e.g., subtitles/slogans) should be hidden (`display: none !important`) rather than squished.

## UNIQUE Constraints & Rapid DB Inserts
- **Unique Database IDs**: When creating helper-inserted records in SQLite (such as notifications), never generate IDs using solely millisecond-based timestamps if multiple records can be created in the same request. Always append a unique suffix (e.g. `uuid.uuid4().hex[:6]`) to prevent SQLite UNIQUE constraint failures.

## Engineer Assignment & UI Fallbacks
- **Technical Role Fallbacks**: When presenting selection lists (such as engineers) strictly filtered by dynamic job categories, always include a fallback to broader technical roles (e.g. `DRAFTER_ROLES`) if the specific category filter yields zero users. This prevents UI blockers where foreman/admins cannot assign work due to a lack of exact matching accounts in the database.
- **Discipline-Specific Filtering & Fallbacks**: When filtering selection lists of engineers by specific disciplines (e.g., "Sipil", "Elektrik"), always filter strictly by that category first. If no engineers exist in that specific discipline, fallback first to a generic role (e.g. "Drafter") before falling back to all broader technical roles to avoid confusing mixtures (e.g. showing a Sipil engineer for an Elektrik EJO).
- **Closing Overlapping Detail Modals**: When launching a secondary action modal (such as an approval, rejection, or completion modal) from a Kanban card or context where a detail modal (like `#ejo-modal`) is active, always close the details modal to prevent mismatched background data layout overlaps.
- **Active EJO Workload Aggregation**: Workload counters for engineers and drafters (`getActiveEjoCountForUser(fullname)`) MUST aggregate active tickets across all three subsystems: standard EJOs (`state.ejos`), general EJOs (`state.generalEjos`), and drawing tickets (`state.drawings`). Inactive tickets (`Completed`, `Cancelled`, `Archived`, `Rejected`, `Done`, `is_archived: 1`) must be excluded, and ticket IDs must be deduplicated across arrays.

## Browser Caching & Previews
- **Cache Busting for Dynamic Previews**: When loading local assets (like uploaded PDFs or drawings) that are modified dynamically by the server (e.g. stamping signatures, drawing tags) but keep the same filename/URL, always append a timestamp-based query parameter (e.g. `?t=1719230600`) to the preview load URL in the frontend. Ensure that any file extension check or splitting logic strips the query parameter before checking extension suffixes.

## Responsive Form Fields & JavaScript Toggles
- **Preserving Flexbox Styles in JavaScript**: When toggling the visibility of form containers or fields using JavaScript `.style.display`, avoid setting them to `'block'` if they are designed to use flexbox (e.g. `.form-field` or containing a custom flex layout). Use `'flex'` (or `''` to inherit stylesheet styling) to preserve flex properties (like `flex-direction` and `gap`) when visible.
- **Input-Action Groups on Mobile**: Inputs paired inline with action buttons (e.g., ID Drawing input + "Generate" button) must use a structured class (such as `.input-group-row`) instead of hardcoded inline styles. Under mobile viewports (`<= 768px`), this row must stack vertically (`flex-direction: column !important; align-items: stretch !important;`) and buttons must be full width (`width: 100% !important; height: 40px !important;`) to prevent layout squeezing and overlap.
- **Form Field Width Constraints**: To prevent form inputs, select dropdowns, and textareas from overflowing their parent grid columns or form containers on medium-to-small viewports (like tablets), always ensure they are styled with `width: 100%; box-sizing: border-box;` in the stylesheet.

## Chart.js Doughnut/Pie Data Display
- **Legend Labels with Values**: When rendering doughnut or pie charts with Chart.js, always include the formatted nominal value directly in the legend label text (e.g. `Gudang B (Rp 75.000)` instead of just `Gudang B`). This makes the data readable at a glance without requiring hover.
- **Tooltip Formatting**: Always configure custom `tooltip.callbacks.label` formatters on financial charts to display currency-formatted values (e.g. `Total Hemat: Rp 75.000`).

## Repair Parts Schema Extension Checklist
When adding a new column to the `repair_parts` table, propagate across ALL of these layers:
1. **Schema**: Add to `CREATE TABLE` and `ALTER TABLE` migration in `server.py`.
2. **API**: Update the `INSERT` query in `create_repair_part()` and ensure `SELECT *` returns the column.
3. **Form**: Add the input field in `index.html` inside `#part-form`.
4. **Payload**: Extract the value in `createNewRepairPart()` in `app.js` and include it in the POST body.
5. **Charts**: If the column is numeric/financial, update `renderPartlistCharts()` in `app.js` to visualize it.
6. **Modal**: Add a `meta-field` element in the `#part-detail-modal` in `index.html` and populate it in `openRepairPartDetails()` in `app.js`.

## EJO Repair Part Cost Analysis Schema & Formula Checklist
When extending or updating EJO Repair Part (General EJO category 'Repair Part') cost calculations, adhere to these layers and formulas:

1. **Formulas**:
   - `Total Biaya Perbaikan` = `repair_duration * repair_cost_per_day`
   - `Cost Saving (Hemat)` = `part_price_new - Total Biaya Perbaikan`
   - Always perform calculations using float-precision in Python and JavaScript before formatting as IDR currency (`Rp 1.000.000`).

2. **Schema & API (`server.py`)**:
   - Store fields in the `general_ejos` table:
     - `part_price_new` (REAL / Float)
     - `repair_duration` (INTEGER)
     - `repair_cost_per_day` (REAL / Float)
   - Ensure migrations support default values (`0.0` or `0`).
   - Propagate values in `create_general_ejo` and `update_general_ejo` SQL query handlers.

3. **Frontend Forms (`index.html`)**:
   - EJO Repair Part form fields: `#part-ejo-price-new`, `#part-ejo-duration`, and `#part-ejo-cost-per-day`.

4. **Visual Charts (`app.js`)**:
   - **Partlist trend & rolling date synchronization ("Sebelum Senin")**:
     - Trend chart (`#partlistTrendChart`) and Doughnut cost chart (`#partlistLocationChart`) MUST use the exact same rolling window date calculation helper functions as Overview Trend Chart (`getPreviousCompletedWeekRange`, `getPreviousCompletedMonthRange`, `getPreviousCompletedYearRange`).
     - Dates MUST be parsed via `getOverviewCreatedDate` and `getItemCompletionDateString` using `parseDateToYYYYMMDD` to avoid timezone and format parsing issues.
     - Outstanding (OS) series MUST use running cumulative math (`runningOS = Math.max(0, runningOS + inFlow - outFlow)`) matching Overview Trend Chart.
     - Volume Trend Chart MUST include top total numbers (`partlistTopTotalsPlugin`), crosshair vertical line (`partlistTrendCrosshairPlugin`), and hover synchronization with TradingView tracker bar (`#partlist-tv-tracker`) and period subtitle (`#partlist-tv-val-period`).
   - **Cost comparison doughnut chart**: Display `Harga by SAP`, `Biaya Perbaikan (Orang)`, and `Total Penghematan` with center percentage and dynamic period subtitle (`#partlist-cost-val-period`).

## Fallback Assets & Missing Local Files
- **Default Avatar Fallbacks**: Avoid referencing local files that do not exist in the workspace root (e.g., `avatar-default.png`) for default/fallback images. Instead, use a reliable external placeholder URL (such as the standard Unsplash placeholder `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80`).
- **Fully Qualified URLs**: When storing or using URLs for external resources (like Unsplash avatars), verify they are fully qualified to prevent frontend path-resolution logic from treating them as local relative file paths and throwing 404 errors.

## API Authorization Parameters & Active Ticket Filtering
- **Authorization Query Parameters on DELETE**: When calling delete endpoints (e.g., `/api/general-ejos/` or similar) via fetch, always ensure the `?requester=${encodeURIComponent(state.currentUser.username)}` query parameter is appended to match backend role-level checks. This prevents security bypasses or missing requester authorization errors.
- **Active Ticket Filtering**: Active ticket tables (like the active EJO Repair Parts list) must explicitly filter out records with status `Cancelled`, `Completed`, or `Archived` (or `is_archived === 1`) to ensure deleted or closed tickets immediately disappear from the active view.
- **Active Ticket Visibility**: In the Dashboard Part tab, both the active EJO Repair Parts table (`Daftar EJO Repair Part (Ticket)`) and its associated charts/summary metrics must show all repair part tickets to all users (bypassing user-specific requester/assignee filtering) so that the summary metrics and parts listings are visible to everyone.

## Premium File Upload Pattern for Forms
- **No Raw File Inputs**: Never use a bare `<input type="file">` visible to the user in any form. Instead, hide it with `display: none` and create a styled dashed-border trigger `<div>` that calls `.click()` on the hidden input.
- **Trigger Layout**: Use a horizontal flex layout (icon + text side-by-side) for full-width triggers, or a vertical column layout (icon above text) for half-width triggers. Always use a Lucide icon and a `<span>` for the filename placeholder.
- **Image Preview**: For image-accepting inputs, render a preview thumbnail below the trigger using a `FileReader.readAsDataURL()` callback. Cap preview height (e.g., `max-height: 120px`) and use `object-fit: contain`.
- **Reset Synchronization**: Every location that calls `.reset()` on the parent form MUST also reset the trigger's filename text and hide the preview container. Extract a named helper function (e.g., `resetPartImagePreview()`) and call it from all reset sites (toggle open, cancel button, post-submit success).
- **Consistent Placeholder Text**: The trigger's default placeholder text, the reset helper, and the `onchange` fallback branch must all use the exact same string.
- **Reference Pattern**: See the drawing upload trigger in `index.html` (`#drawing-file-trigger`) and its JS wiring in `app.js` for the canonical implementation.

## Table Column Changes & Colspan Synchronization
- **Colspan Synchronization**: Whenever you add, remove, or modify columns in a table's `<thead>`, you must locate any dynamic fallback message rows (such as "No data found" or search result helpers) in the javascript rendering logic and update their `colspan` attribute to match the new total column count exactly. This prevents layout cutoffs on empty states.

## Excel Imports & Routing
- **Subsystem Classification**: When extending Excel import utilities, always inspect classifying columns (e.g., `Tim` or category columns) to identify the target subsystem (such as technical drawings vs general EJOs) and avoid cross-routing errors.
- **REST Endpoints for JSON Import**: Ensure backend endpoints that primarily handle file-upload multipart data are extended to support `application/json` payloads so they can easily be invoked by client-side batch parsing loops.
- **Duplicate Prevention**: Skip existing records by querying and matching the ticket ID against the correct state list (e.g., `state.drawings` vs `state.generalEjos`) depending on classification.
- **Category Autodetection**: If spreadsheet category tags do not match database-predefined values (e.g., `BECT` or custom Excel-specific tags vs `Sipil`/`Elektrik`/`Mekanik`), use a keyword-based heuristic on the item's title and description to map them accurately.
- **Excel Category Mapping**: When importing EJO spreadsheets, never skip rows with category/team tags that do not strictly match standard database categories (such as `AC` or `MEC&ELC`). Instead, map them to standard categories (e.g., mapping `AC` and `MEC&ELC` to `Mekanik`) to ensure 100% of data is imported without miss-imports.
- **Contextual Notifications & Navigation**: Display combined or targeted success toasts detailing exactly how many of each item type were imported, and navigate the user to the tab containing the most relevant imported data.

## Mobile Navigation & Multi-Directory Asset Synchronization
- **Multi-Directory Asset Synchronization (Root vs Laravel Subsystem)**: When updating frontend assets (`style.css`, `app.js`, `index.html`), always check whether the codebase maintains duplicate public assets in secondary framework subdirectories (e.g. `laravel/public/style.css`, `laravel/public/app.js`, `laravel/resources/views/welcome.blade.php`). Synchronize asset changes across ALL target directories simultaneously and update cache-buster query parameters (`?v=3.5`, `?v=8.5`) in view templates to ensure 100% immediate client-side application.
- **Mobile Viewport 2-Row Header Architecture**: Never attempt to squeeze branding/logo, user session details (avatar, name, logout button), and a horizontal navigation scroll container into a single horizontal row under mobile viewports (`<= 768px`). Always split into 2 dedicated rows:
  - **Row 1 (Header Bar)**: Reserved exclusively for Logo and User Profile Session Details (height ~52px).
  - **Row 2 (Navigation Bar)**: Reserved 100% for the horizontal scroll container `.sidebar-nav` and scroll indicator arrows `<` `>` (height ~48px).
- **Visual Inspection & 1-Prompt Root Cause Diagnosis**: Before modifying JavaScript gesture handlers or touch event listeners for UI interaction bugs, perform an immediate visual layout inspection at narrow viewports (e.g. 390px) to verify whether element container collision or insufficient scrollable distance (`scrollWidth` vs `clientWidth`) is the true root cause.

## Gallery Dropdown & Import Form Data Routing
- **Submenu Category Sync**: When switching tabs using nested gallery submenus (`drawing-gallery`), automatically map `data-gallery-category` values (`sipil`, `mekanik`, `Repair Part`, `all`) to the corresponding select option in `#drawing-filter-category` and route the active tab pane to `#tab-drawing`.
- **Repair Part Import Integration**: Drawings imported with category `Repair Part` must be integrated into `renderPartGallery()` alongside spare parts so that repair part drawings with file attachments render seamlessly inside Galeri Spare Part.
- **Drawing Gallery Department Filtering**: The control bar in Galeri Drawing Teknik (`#tab-drawing-gallery`) includes `#filter-drawing-gallery-dept` alongside category and search filters. Filtering in `renderDrawingGallery()` evaluates `item.dept` normalized via `normalizeDepartmentCode` and falls back to looking up the uploader or requester department in `state.users` if `item.dept` is empty, supporting full synchronization with `state.activeGalleryDept`.

## Overview Chart Drawing Data Synchronization
- **Overview EJO Data Aggregation**: `getVisibleOverviewEjos()` already aggregates deduplicated items from `getVisibleDrawings()`. Overview chart render functions (`renderTrendChart()`, `renderStatusChart()`, `renderDeptChart()`, `renderCategoryChart()`) MUST consume `getVisibleOverviewEjos()` directly without appending `.concat(getVisibleDrawings())` to prevent duplicate drawing counts.
- **Chart Engineer & Drafter Fallback**: Chart rendering handlers (such as `renderCategoryChart()`) must evaluate `(e.engineer || e.drafter)` to account for Drafters assigned to Drawing tickets.
- **Drawing Drafter Field Precedence**: On Drawing EJO tickets, the Drafter assigned to the drawing (`drafter` or drawing assignee) specifies the primary personnel handling the drawing. When aggregating personnel workload or categorizing items across Overview charts (`renderCategoryChart`, `filterOverviewItemsByCategory`), always evaluate `(isDrawing ? (item.drafter || item.engineer || item.uploader) : (item.engineer || item.drafter || item.uploader))` to ensure Drafters (e.g. Diki Firmansyah) take precedence over base EJO Engineer fields when processing Drawing tickets.
- **Unassigned Placeholder Filtering**: Engineer workload aggregation in `renderCategoryChart()` MUST filter out placeholder keywords (`unassigned`, `unsigned`, `belum ditentukan`, `belum ada`, `-`, `n/a`, `none`) so unassigned tickets are excluded from engineer workload stacked bars.
- **Drawing Category Bar Aggregation**: Drawing EJO tickets (where `isDrawing` is true) MUST be aggregated under the `Drawing` category column in `renderCategoryChart()`. The assigned Drafter(s) (e.g., Diki Firmansyah, Rifan) MUST be credited as dataset entries for the `Drawing` bar column, ensuring the `Drawing` column displays non-zero bar heights and accurate drafter job counts on the Overview Dashboard.
- **Overview Date Parsing & Synchronization**: Date extraction helpers (`getOverviewCreatedDate`, `getItemCompletionDateString`) MUST use `parseDateToYYYYMMDD` to handle all date formats (ISO, DD-MM-YYYY, DD/MM/YYYY, Indonesian/English textual month names) so no drawing or general EJO items are omitted from period/trend aggregations. Also, department load calculations (`renderDeptChart`) MUST fallback to looking up uploader/requester user department from `state.users` if `e.dept` is empty.

## Department Option Propagation & Role Resolution
- **Department Option Checklist**: When adding or modifying department codes (e.g., `TMB` for Timbangan), propagate across all 3 view templates (`index.html`, `laravel/public/index.html`, `laravel/resources/views/welcome.blade.php`), JS `DEPARTMENT_OPTIONS`, and `server.py` (`ROLE_LEVELS`, `normalize_dept_code`, seed data). Ensure non-ENG departments dynamically populate `user_DEPT`, `Supervisor DEPT`, and `Manager DEPT` options.

## Chart Filter Dropdown & Card Header Architecture
- **Compact Card Header Filters**: When filtering visual charts by categories or time ranges, prefer clean `<select class="chart-time-filter">` dropdown elements placed inside `.card-actions` within `.card-header` rather than full-width pill button rows. This keeps card headers concise, modern, and mobile-friendly.
- **Filter Element State Synchronization**: Render functions for charts (such as `renderTrendChart()`) must inspect and sync dropdown `.value` properties (e.g. `catSelectEl.value = catFilter`) alongside state updates to maintain UI state consistency.
- **Backwards-Compatible Control Wiring**: Event listener initialization must use optional chaining (`document.getElementById("trend-category-filter")?.addEventListener(...)`) and check for element existence before querying child elements to prevent null reference exceptions.
- **Overview Dashboard Category Synchronization**: Category filter `#trend-category-filter` inside `#card-trend-chart` acts as the single primary category control for the entire Overview Dashboard. Changing `#trend-category-filter` updates `state.trendCategoryFilter` and triggers a global re-render of summary scorecards (`#overview-card-gejo`, `#overview-card-drawing`), status proportions (`#statusChart`), department load (`#deptChart`), category load (`#categoryChart`), and trend charts (`#trendChart`). Extra category dropdowns on bottom grid cards (`#card-dept-chart`, `#card-category-chart`) are omitted to keep card headers clean and clutter-free.

## Chart.js Dataset Order & Tooltip Sequence Synchronization
- **Exact Tooltip & Legend Sequence**: When configuring mixed Chart.js bar/line charts (such as `trendChart`), always align dataset `order` properties sequentially (`Masuk` `order: 1`, `Selesai` `order: 2`, `Dibatalkan` `order: 3`, `OS` `order: 4`) matching the dataset array indices.
- **Tooltip itemSort Callback**: Include `itemSort: function(a, b) { return a.datasetIndex - b.datasetIndex; }` inside `options.plugins.tooltip` to guarantee tooltips render items top-to-bottom in exact sequence.
## Job Category Dropdown Invariants & Department Entity Separation
- **Drawing Subsystem Exclusion**: Drawing EJO is an independent ticket subsystem accessed from its dedicated sidebar navigation tab ("Drawing EJO") with phases (Schedule, On Progress, Done). Never list "Drawing" as an option inside job category selection or filter dropdowns (`#gejo-form-category`, `#gejo-filter-category`, `#drawing-form-category`, `#drawing-filter-category`, `#filter-drawing-gallery-cat`). Forms and category filters must strictly list technical discipline categories (Sipil, Elektrik, Kalibrasi, Mekanik, Program, Repair Part).
- **Timbangan as Requester Department (TMB)**: Timbangan (`TMB`) is strictly a requester department (Departemen Pemohon), NOT a job category. It MUST appear only in Department filters and dropdowns (`#filter-dept`, `#form-dept`, `#gejo-filter-dept`, `#gejo-form-dept`, `#drawing-filter-dept`, `#drawing-form-dept`, `#admin-user-dept`). It is strictly prohibited from appearing in any Job Category selects or filters.
- **Excel & Keyword Routing for Timbangan**: In Excel export/import mappings and automatic keyword parsing (`autoDetectDrawingCategory`), text mentioning timbangan, tmb, scale, or timbang must route to the technical discipline `Kalibrasi` (or `Mekanik`), while the department is mapped to `TMB` via `mapDeptToExcel` / `mapExcelToDept`.
- **Drawing EJO 4 Work Categories Constraint**: Dropdowns specifically belonging to Drawing EJO (`#drawing-form-category`, `#drawing-filter-category`, `#filter-drawing-gallery-cat`) are strictly scoped to exactly 4 work categories: `Elektrik`, `Mekanik`, `Repair Part`, and `Sipil`. General EJO category dropdowns (`#gejo-form-category`, `#gejo-filter-category`) and overview trend category filters remain unrestricted and preserve their full set of general job categories.

## Galeri Drawing Submenu Role-Based Visibility Invariants
- **Drawing Category Submenu Hiding**: The `Drawing Sipil` and `Drawing Mekanik` category buttons inside `#drawing-gallery-submenu` are permanently hidden (`display: none !important`) for all roles, as drawing category and department filtering is unified directly in the `#tab-drawing-gallery` control bar (`#filter-drawing-gallery-cat` & `#filter-drawing-gallery-dept`).
- **Galeri Spare Part Submenu Access**: `Galeri Spare Part` (`#btn-nav-partlist-gallery`) remains visible and accessible inside `#drawing-gallery-submenu`.
- **Parent Nav Routing**: When non-Engineering department users click `#btn-nav-drawing-gallery`, they are routed smoothly to `partlist-gallery` (Galeri Spare Part). Engineering personnel clicking `#btn-nav-drawing-gallery` are routed directly to `drawing-gallery` with category `all`.
- **Gallery Control Bar Header Cleanliness**: The control-bar headers for Galeri Drawing (`#tab-drawing-gallery`) and Galeri Spare Part (`#tab-partlist-gallery`) must remain clean with only the `<h3>` title and icon, omitting lengthy `<p class="text-secondary text-xs">` subtitle paragraphs to maximize vertical usable space and keep the layout modern and uncluttered.

## Overview Category Workload Chart Engineer Aggregation Invariants
- **Strict Assigned Engineer Extraction**: In `renderCategoryChart()`, datasets and workload counts must strictly represent assigned Engineering personnel (`Sipil`, `Elektrik`, `Kalibrasi`, `Mekanik`, `Program`, `Repair Part`, `Drafter`, `Staff ENG`) assigned to tickets during approval/assignment (`e.engineer` or `e.drafter`).
- **No Requester/Uploader Fallback**: Unassigned tickets (where `engineer` is empty, `Unassigned`, or in `Requested` status awaiting assignment) must NEVER fall back to attributing the ticket to the department requester/uploader (`user_GA`, `user_QC`, `user_PRD`, `user_WRH`, `user_EPR`). Unassigned tickets are excluded from engineer workload stacked bars until formally assigned to an engineer.
- **Drafter Precedence for Drawings**: For Drawing EJO tickets, assigned drafters (`e.drafter` / `e.engineer`) are attributed to the `Drawing` bar column.

## Overview Department & Category Chart Outstanding Data Sourcing
- **Outstanding-Only Data Sourcing**: `renderDeptChart()` (EJO Departemen) and `renderCategoryChart()` (EJO Kategori Kerja) must strictly aggregate items where `isItemOutstanding(e)` is true (Phase 1 Schedule and Phase 2 On Progress across both General EJO and Drawing subsystems). Tickets in Phase 3 (Done / Completed / Pending Approval) and Phase 4 (Archived / Cancelled / Rejected) must be excluded from department and category workload totals to accurately reflect live outstanding work distribution.

## Drafter & Engineer Work Visibility & Action Permissions
- **Global Lead Authority Restriction**: `isGlobalLeadUser()` must strictly restrict ENG department access to leadership roles (`isLeadRole(role)`, e.g., Foreman Eng, Admin Eng, Supervisor Eng, Manager Eng, Plant Manager, Factory Manager, Server). Standard Drafters (`Drafter`, `Drafter Eng`), technical engineers (`Sipil`, `Mekanik`, `Elektrik`, `Program`, `Kalibrasi`, `Repair Part`), and standard department users must return `false` so they are not treated as Global Leads.
- **Drawing EJO Visibility for Drafters**: In `getVisibleDrawings()`, Drafters and technical roles must strictly only see drawings where they are the requester/uploader or where they are formally assigned (`checkIsAssigned(d.drafter, currentUser) || checkIsAssigned(d.engineer, currentUser)`). They must NEVER see other drafters' assigned tickets across departments or within the ENG department.
- **Completion & Upload Action Restriction**: In `getDrawingCardActions()` and `openDrawingDetails()`, action buttons to complete work (`Selesaikan →`), upload drawing files, or move status (`moveDrawingStatus`) in the `On Progress` phase must strictly be restricted to the assigned Drafter (`isAssigned`), Foreman, Admin, or Server. Unassigned drafters must NEVER see action buttons or be able to submit someone else's drawing.

## PDF Etiket Signature Plotting & Page Rotation Invariants
- **Page Rotation Coordinate Mapping**: When stamping signatures or inserting text boxes onto drawing PDFs using PyMuPDF (`fitz`), never assume `page.rotation == 0`. CAD-exported landscape PDFs often carry `/Rotate 270` or `90` with an unrotated portrait `MediaBox` (e.g. 595x842). Always transform visual coordinates to unrotated raw page coordinates via `map_visual_rect_to_page(page, vis_rect)` and pass the corresponding rotation angles to `page.insert_image` (`rot_img = (360 - page.rotation) % 360`) and `page.insert_textbox` (`rot_txt = page.rotation % 360`) so both signatures and text appear upright and aligned with the title block.
- **CAD Table Grid Border Preservation**: When modifying or swapping printed CAD labels on title blocks, never use opaque `draw_rect` fills that overlap borders. Use strictly bounded sub-cell redaction (`add_redact_annot`) and re-stroke table grid lines with width `0.72` to guarantee crisp, unbroken borders.
- **4-Etiket Template Calibration**: Maintain verified coordinate slot mappings across all 4 title block configurations:
  - `diki_landscape` (Sipil Landscape, A3 1190.55 x 841.89, 4 approval boxes left-to-right: Kolom 1 DRAWN By [Drafter: x 802~854, Foreman: x 858~910, y: 628~708], Kolom 2 CHECKED By [Requester: x 915~967, SPV Dept: x 971~1023, y: 628~708], Kolom 3 APPROVED By [SPV ENG: x 1028~1080, Manager ENG: x 1083~1135, y: 628~708], Kolom 4 APPROVED By [Factory Manager: x 1028~1135, y: 526~607 stacked above Kolom 3])
  - `diki_portrait` (Sipil Portrait, A3 841.89 x 1190.55, 4 columns left-to-right: Kolom 1 DRAWN By [Drafter/Foreman], Kolom 2 CHECKED By [Requester/SPV Dept], Kolom 3 APPROVED By [SPV ENG/Manager ENG], Kolom 4 APPROVED By [Factory Manager])
  - `rifan_landscape` (Mekanik / Part Landscape, A4 842.0 x 595.0, 4 columns right-to-left: Drawn [Drafter/Foreman], Request [Requester/SPV Dept], Checked [SPV ENG], Approved [Manager ENG])
  - `rifan_portrait` (Mekanik / Part Portrait, A4 595.0 x 842.0, 4 columns right-to-left: Drawn [Drafter/Foreman], Request [Requester/SPV Dept], Checked [SPV ENG], Approved [Manager ENG] under PT BUMI ALAM SEGAR at y: 672.20..718.16 for signatures/names and y: 718.16..731.84 for label headers)

## Drawing EJO Multi-Tier Approval Flow Invariants (Mekanik/Part vs Sipil)
- **Mekanik / Part 5-Tier Flow**: For drawings with etiket category `Mekanik / Part` (or anything not `Sipil`), the multi-tier approval stops at **Manager ENG**. Approval by Manager ENG (`Pending Manager Approval`) directly transitions the drawing to `Completed`. The 6th signature card (`#card-sig-factory_manager`) in `#ejo-drawing-modal` MUST be hidden (`display: none !important`).
- **Sipil 6-Tier Full Flow**: For drawings with etiket category `Sipil`, the approval flow preserves all 6 tiers: Requester (Staff Dept) -> Atasan Dept (SPV Dept) -> Foreman ENG -> SPV ENG -> Manager ENG -> Factory Manager (Sutopo Sejati). Approval by Manager ENG transitions status to `Pending Factory Manager Approval`, and only Factory Manager approval transitions status to `Completed`. All 6 signature cards (`#card-sig-factory_manager` included) MUST be displayed (`display: flex`).
- **Approved Drawings Selection Sync**: In `populateApprovedDrawingsSelect()`, completed drawings of both `Mekanik / Part` (approved up to Manager Eng) and `Sipil` (approved up to Factory Manager) must be available for linking to projects.

## Mobile Navbar Parent Wrapper Hiding & Submenu Isolation
- **Direct Child Selector on Wrapper Hiding**: When hiding parent navigation wrappers (`.nav-item-wrapper`) on mobile (`<= 768px`) based on button visibility styles, NEVER use broad descendant `:has(.nav-btn[style*="display: none"])`. Always use strict direct parent selectors: `.nav-item-wrapper:has(> .nav-btn:not(.sub-btn)[style*="display: none"])`. This prevents sub-menu buttons (like `Drawing Sipil` or `Project Monitoring`) that are hidden for specific roles from accidentally collapsing their entire visible parent navigation wrapper.

## Admin Panel Access Control & Role Restrictions
- **Admin Panel Visibility**: Access to the Admin Panel (`#nav-admin-btn` and `tab-admin`) is strictly reserved for `Server`, `Foreman Eng`, and `Admin Eng` roles.
- **Supervisor & Manager ENG Exclusion**: Roles matching Supervisor Eng (`Supervisor Eng`, `SPV Eng`, `SPV ENG`, `Supervisor Engineering`) and Manager Eng (`Manager Eng`, `Manager ENG`, `Manager Engineering`), as well as non-ENG Supervisors and Managers, MUST return `false` from `canAccessAdminPanel()` and have `#nav-admin-btn` hidden with `display: none !important`.


## Mobile Control Bar & Date Range Grid Invariants
- **2-Column Equal Grid on Mobile Viewports**: On mobile screens ($\le 768\text{px}$ and $\le 480\text{px}$), filter dropdown containers (`.filters-wrapper`) MUST use a 2-column grid (`display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) !important;`) to keep standard filter pairs (Status & Prioritas, Dept & Kategori) neatly paired side-by-side without inflating card height.
- **Full-Width Date Range Span**: The date range filter group (`.filter-group-date-range`) MUST span across all grid columns (`grid-column: 1 / -1 !important; width: 100% !important;`). Date range inputs (`.date-range-input`) MUST use flexible sizing (`flex: 1 1 0 !important; min-width: 0 !important; width: 100% !important; height: 40px !important;`) to prevent horizontal clipping, overflow, or squishing of native datepicker fields on small devices.
- **No Direct Inline `gridTemplateColumns` Injection**: In JavaScript role management and limit indicators, avoid setting hardcoded inline strings like `controlBarEl.style.gridTemplateColumns = '1.5fr 2fr auto'`. Reset to `controlBarEl.style.gridTemplateColumns = ''` so responsive CSS stylesheets cleanly control layout across all viewport breakpoints.

## Repository Hygiene & Core Asset Protection Invariants
- **Protected Core Media Assets**: `202607301136.mp4` is the active background video for the login screen (`#login-bg-video` in `index.html` and `welcome.blade.php`). It must NEVER be deleted during repository sanitization.
- **Titleblock Templates**: The 8 templates in `etiket/` (`pak diki etiket landscape/potrait.pdf/png`, `pak rifan etiket landscape/potrait.pdf/png`) are active assets required for CAD titleblock stamp rendering and zoom modals.
- **Protected Brand Logo**: `Logo-BAS.png` is the sole required brand logo and must be preserved across root and `laravel/public/`.
- **Database Single Source**: `ejo_database.db` is the only active SQLite database. Keep temporary scratch scripts out of root.

## Technical Drawing Import & Upload Role-Based Access Control
- **Import Drawing Authorized Roles**: Only Drafter discipline roles (`DRAFTER_ROLES` = `['Drafter', 'Sipil', 'Mekanik', 'Elektrik', 'Program', 'Kalibrasi', 'Repair Part']`), Foreman roles (`Foreman Eng`, `Foreman`), and Admin roles (`Admin Eng`, `Server`) are authorized to view and use `#btn-toggle-import-drawing` ("Import Drawing") and upload drawings via the import workflow.
- **Import Drawing Excluded Roles**: Regular department users (`User`, `Staff *`, `user_*`), Department Supervisors (`Supervisor *` across all departments), Department Managers (`Manager *` across all departments), and Factory / Plant Manager (`Plant Manager`, `Factory Manager`) MUST NOT have access to `#btn-toggle-import-drawing` (enforce `display: none !important` via `updateUIForRole` and `renderDrawings`).
- **Backend Role Check Enforcement**: In `server.py` (`upload_drawing`), incoming requests with `drawing_type == 'import'` must strictly verify that the creator's role is in the authorized Engineering roles (`Drafter` roles, `Foreman Eng`, `Foreman`, `Admin Eng`, `Server`), rejecting unauthorized requests with HTTP 403. Conversely, standard drawing creation (`drawing_type == 'request'`) maintains the rule that Drafters cannot create drawing requests.

## Drafter Personnel & Discipline Separation Invariants
- **Authorized Drafters Only**: The only official users with role `Drafter` in the system are **Diki Firmansyah** (username: `diki`) and **Rifan Nur** (username: `rifan`).
- **Strict Field Engineer Isolation**: Field discipline engineers (**Thorik**, **Rifky**, **Hadi**, **Kresna** for Elektrik; **Tedy**, **Dadang** for Sipil; **Yuli**, **Reksa**, **Eman** for Mekanik; **Aden** for Kalibrasi; **Chandra** for Program; **Rahmad** for Repair Part) must NEVER be assigned to Drawing EJO tickets (`drawings` table). They execute field maintenance in General EJO only.
- **Drawing Lifecycle Phase Rules**:
  - **Sesi 1 (Schedule / Phase 1)**: Newly submitted drawing requests awaiting Foreman scheduling/assignment. Must have `status: 'Pending Foreman Approval'` (without file), `engineer: 'Unassigned'`, `file_path: ''`, and empty signatures.
  - **Sesi 2 (On Progress / Phase 2)**: Tickets assigned strictly to Drafters (`Diki Firmansyah`, `Rifan Nur`) actively in drafting. Must have `status: 'On Progress'` (or `'In Progress'`), `file_path: ''`.
  - **Sesi 3 (Done / Phase 3)**: Finished drawings with uploaded files (`file_path != ''`) going through multi-tier approval (`Pending Foreman/Supervisor/Manager/Factory Manager Approval`) or `Completed`.
- **Overview Category Chart Alignment**: In `#categoryChart`, ensure the `Drawing` bar strictly reflects workloads for `Diki Firmansyah` and `Rifan Nur`, while `Thorik` strictly appears under the `Elektrik` category bar.

## Resilient Project Document Parsing & String Operations
- **Unified Document Extraction**: Never invoke string operations (`.replace()`, `.split()`, regex matching) directly on elements of `p.execution_docs`, `p.handover_docs`, or `p.docs` without first normalizing the element using `getDocUrl(docItem)` and `getDocFilename(docItem)`.
- **Dual-Type Support (String URLs & Object Dictionaries)**: All document arrays across projects and EJOs must gracefully support both string URL paths (`"/uploads/..."`) and dictionary objects (`{"name": "...", "path": "...", "url": "..."}`).
- **Safe Filtering on Deletion**: In both JavaScript and Python (`server.py`), document deletion and context-matching filters must extract and compare the basename using `getDocUrl()` rather than exact string equality (`d != doc_url`) to avoid silent deletion failures or runtime type errors when objects are present.

## Overview KPI Scorecard Deduplication Invariants
- **Single-Source Overview Aggregation**: The top KPI summary cards (`renderKPIs()`) must consume the unified dataset from `getVisibleOverviewEjos()` directly without adding `allDrawings` a second time. `getVisibleOverviewEjos()` already combines standard EJOs, general EJOs, and drawings; adding `allDrawings` results in double counting of technical drawings across `Total EJO` and `Pending` scorecards.

## Drawing Kanban Cross-Phase Project Transfer Action Invariants
- **Universal Project Transfer Button Availability**: The action button "Alihkan ke Project" (`openTransferDrawingToProjectModal(d.id)`) on Drawing Kanban cards (`getDrawingCardActions(d)`) MUST NOT be restricted solely to Phase 1 (`Schedule`). It must be available across all active Kanban columns (`Schedule`, `On Progress`, `Done`) for authorized Foreman and Admin Eng roles whenever a drawing ticket has not yet been linked to an active project.
- **Linked State Precedence**: If a Drawing EJO is already linked to a project (`p.drawing_id === d.id`), the card action button dynamically renders "Di Project (PRJ-XXX)" linking to `flexToProjectTab(d.id)` across all phases.

## Kanban Column 3-Card Preview Limit & YouTube-Style Inline Expand/Collapse
- **Subsystem-Wide 3-Card Cap**: When displaying full Kanban boards across all three subsystems (General EJO where `state.activeGeneralEjoPhase === null`, Drawing EJO where `state.activeDrawingPhase === null`, and Project Monitoring where `state.activeProjectPhase === null`) and the Overview urgent list (`#critical-ejo-list`), each column/container displays a default preview of 3 cards (`previewLimit = 3`).
- **YouTube-Style Inline Expand/Collapse Button**: Instead of navigating away or filtering out other columns when clicking "Lihat X Lainnya", extra cards (4+) are rendered inside a collapsible container (`#${type}-extra-${phase}` with class `.kanban-extra-container`) directly within the column/card list.
- **Pill Button Aesthetics & State Preservation**:
  - The toggle button uses YouTube replies pill styling (`.yt-replies-btn`) with smooth micro-animations (`@keyframes ytRepliesExpand`), rounded pill border (`border-radius: 9999px`), cyan glow on hover, and an icon (`chevron-down` when collapsed, `chevron-up` when expanded).
  - Label text dynamically alternates between `Lihat X Lainnya` and `Sembunyikan`.
  - Column expanded states are tracked in `state.expandedKanbanColumns['${type}_${phase}']` (e.g. `'gejo_1'`, `'drawing_2'`, `'projects_3'`, `'critical_overview'`) to preserve user open/closed preferences across re-renders (such as search input or live status updates).
- **Single-Phase Uncapped View**: When the user explicitly filters into a single-phase view (`state.activeGeneralEjoPhase`, `state.activeDrawingPhase`, or `state.activeProjectPhase` is not null), `shouldLimitPreviewCards` evaluates to `false`, displaying 100% of cards in that phase without truncation or toggle buttons.

## Global Event Capture Listener Safety Invariants
- **Strict Navigation Element Exclusion**: Global click listeners or capture-phase document interceptors (e.g., fallback handlers for modal triggers or action buttons) MUST explicitly check and ignore navigation elements (`.nav-btn`, `.sub-btn`, `[data-tab]`, `[data-phase]`, `.sidebar`, `.sidebar-nav`, `.control-bar`, `.modal-backdrop`).
- **Contextual Card Scoping**: Action button interceptors must verify that the target button is contained inside a relevant card container (`.project-card`) and matched against explicit action intents (`onclick` attribute with `moveProjectPhase`) rather than broad keyword text matching (such as `btnText.includes("Fase 3")`) to prevent hijacking unrelated submenu navigation clicks and spamming console warnings.

## Previous Completed Week Rolling Window for Weekly Trend Filter ("Minggu Ini")
- **Weekly Filter Range**: When filtering by "Minggu Ini" (`period === 'week'`) on the Trend Chart, Overview KPI scorecards, summary cards, and Partlist charts, the date window MUST pull data from the **previous completed week** (Senin s/d Minggu minggu lalu: `[currentMonday - 7 days, currentMonday - 1 day]`).
- **Weekly Rollover Trigger**: On any day from Monday through Sunday (e.g. August 10 to August 16), the date window remains locked to the previous week (August 3 to August 9). As soon as the new week begins on Monday (e.g. August 17), the date window automatically rolls over to the newly completed week (August 10 to August 16).
- **Reusable Helper**: Always use `getPreviousCompletedWeekRange(referenceDate = new Date())` to generate the 7 dates (`YYYY-MM-DD`), start/end boundaries, and Indonesian day/date labels (`Senin, 03 Agu` ... `Minggu, 09 Agu`) to guarantee zero timezone or cross-month rollover regressions.

## Previous Completed 28 Days (4 Weeks) Rolling Window for Monthly Filter ("Bulan Ini")
- **Monthly Filter Range**: When filtering by "Bulan Ini" (`period === 'month'`) on the Trend Chart, Overview KPI scorecards, summary cards, and Partlist charts, the date window MUST pull data from the **previous completed 28 days (4 full completed weeks)** before the current week's Monday (`[currentMonday - 28 days, currentMonday - 1 day]`).
- **Weekly Rollover Trigger**: On any day from Monday through Sunday (including Wednesday, Friday, Sunday), the date window remains locked to the 28 days before the current Monday (e.g., when today is Aug 10-16, the range spans July 13 to Aug 9). As soon as the new week begins on Monday (e.g., Aug 17), the date window automatically rolls over to July 20 to Aug 16.
- **4-Column Weekly Aggregation**: The 4 bars in the Monthly Trend Chart represent the 4 sequential 7-day completed weeks:
  - `Minggu 1` (Oldest): `[currentMonday - 28 days, currentMonday - 22 days]`
  - `Minggu 2`: `[currentMonday - 21 days, currentMonday - 15 days]`
  - `Minggu 3`: `[currentMonday - 14 days, currentMonday - 8 days]`
  - `Minggu 4` (Most Recent): `[currentMonday - 7 days, currentMonday - 1 day]`
- **Standardized Helper**: Always use `getPreviousCompletedMonthRange(referenceDate = new Date())` across all analytics modules to ensure consistent date boundaries and tooltip labels without cross-month or leap-year regressions.

## Previous Completed 365 Days (12 Months) Rolling Window for Yearly Filter ("Tahun Ini")
- **Yearly Filter Range**: When filtering by "Tahun Ini" (`period === 'year'`) on the Trend Chart, Overview KPI scorecards, summary cards, and Partlist charts, the date window MUST pull data from the **previous completed 365 days (12 rolling months)** before the current week's Monday (`[currentMonday - 365 days, currentMonday - 1 day]`).
- **Weekly Rollover Trigger**: On any day from Monday through Sunday (including Wednesday, Friday, Sunday), the date window remains locked to the 365 days before the current Monday (e.g., when today is Aug 10-16, 2026, the range spans Aug 10, 2025 to Aug 9, 2026). As soon as the new week begins on Monday (e.g., Aug 17, 2026), the date window automatically rolls over to Aug 17, 2025 to Aug 16, 2026.
- **12-Column Rolling Monthly Aggregation**: The 12 bars in the Yearly Trend Chart represent the 12 rolling months ending at the current cycle (`Sep '25`, `Okt '25`, ..., `Agu '26`).
- **Standardized Helper**: Always use `getPreviousCompletedYearRange(referenceDate = new Date())` across all analytics modules to ensure consistent date boundaries and tooltip labels without cross-year or leap-year regressions.

## Chart.js Pure TradingView Real-Time Tracker Bar & Crosshair Architecture
- **Zero-Obstruction Canvas Principle**: On interactive analytics charts with data labels on bars and dense date axes (`#trendChart`), disable in-canvas popup tooltips (`options.plugins.tooltip.enabled = false`) to prevent floating boxes from overlapping bars, bar values, and X-axis date labels.
- **Header Tracker Bar Synchronization**: Use an interactive real-time tracker bar (`.trend-tv-tracker` / `#trend-tv-tracker`) positioned directly above the canvas to display the active period and metrics (`Masuk`, `Selesai`, `Dibatalkan`, `OS`) on hover, resetting to total period summaries on `mouseleave`.
- **Glowing Crosshair & OS Anchor Indicator**: Implement a lightweight canvas crosshair plugin (`trendCrosshairPlugin`) that renders a vertical dashed guideline (`rgba(56, 189, 248, 0.6)`) and glowing pulse circle on the active OS line point matching the hovered column index.

## General EJO vs Technical Drawing Multi-Tier Approval Hierarchy Separation
- **General EJO Strict Approval Hierarchy**: General EJOs (`general_ejos` table) are dedicated to direct technical maintenance/repair work and follow a strict, direct approval lifecycle:
  1. `Requested` / `Waiting Dept Approval` (Phase 1 / Schedule - User submission / Dept endorsement)
  2. `Checking` (Phase 1 / Schedule - Foreman review and engineer assignment)
  3. `In Progress` (Phase 2 / On Progress - Field execution by assigned technician)
  4. `Pending User Approval` (Phase 3 / Done - Requester/User verification of field completion)
  5. `Completed` (Phase 3 / Done & Phase 4 / Archive - User approved, ready for archiving)
- **Prohibition of SPV/Manager ENG on General EJO**: `Supervisor Eng` and `Manager Eng` approval stages (`Pending Supervisor Approval`, `Pending Manager Approval`, `Pending Factory Manager Approval`) are EXCLUSIVELY reserved for Technical Drawings (`drawings` table) and Project EJO proposals (`projects` table). They MUST NEVER be assigned, seeded in dummy datasets, or rendered in status banners for General EJO tickets.
- **Frontend Fallback & Status Text Guardrails**: In `getFriendlyStatusText(status, ejo)` and `isApprovalPendingForCurrentUser(e)`, General EJO tickets in `Done` or legacy pending states MUST resolve to `'Waiting for User approval'` targeting the department requester, preventing any false display of Supervisor Eng approvals on General EJO modal views.












