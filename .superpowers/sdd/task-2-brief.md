### Task 2: Add Import/Export Buttons to index.html

**Files:**
- Modify: `C:\billawal\PT. BAS\EJO ENGINEER\index.html`

- [ ] **Step 1: Insert HTML buttons**
  Locate `#btn-quick-new` in `index.html` and place the Excel action buttons and hidden file input immediately before it:
  ```html
  <button class="btn btn-outline" id="btn-excel-export" style="gap: 8px;">
      <i data-lucide="download" style="width: 16px; height: 16px;"></i> Export Excel
  </button>
  <button class="btn btn-outline" id="btn-excel-import" style="gap: 8px;">
      <i data-lucide="upload" style="width: 16px; height: 16px;"></i> Import Excel
  </button>
  <input type="file" id="excel-import-input" accept=".xlsx, .xls, .csv" style="display: none;">
  ```
- [ ] **Step 2: Verify buttons placement**
  Verify the layout displays correctly and aligns well with styling.
- [ ] **Step 3: Commit**
  ```bash
  git add index.html
  git commit -m "feat: add Excel action buttons to control bar"
  ```

---

