### Task 1: Add SheetJS CDN Script to index.html

**Files:**
- Modify: `C:\billawal\PT. BAS\EJO ENGINEER\index.html`

**Interfaces:**
- Produces: `window.XLSX` global object.

- [ ] **Step 1: Add script tag to index.html**
  Insert the following script tag right before `app.js` tag in the `<head>` of [index.html](file:///C:/billawal/PT.%20BAS/EJO%20ENGINEER/index.html):
  ```html
  <!-- SheetJS Excel Library -->
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
  ```
- [ ] **Step 2: Verify script loading**
  Check that the file is updated. We can run the python server and access `window.XLSX` in console to verify it is defined.
- [ ] **Step 3: Commit**
  ```bash
  git add index.html
  git commit -m "feat: add SheetJS CDN to index.html"
  ```

---

