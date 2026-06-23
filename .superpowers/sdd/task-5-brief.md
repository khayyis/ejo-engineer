### Task 5: Add console self-test run check

**Files:**
- Modify: `C:\billawal\PT. BAS\EJO ENGINEER\app.js`

- [ ] **Step 1: Write and trigger self-test function**
  Add a console-assertion check running automatically on dashboard startup to prevent conversion regressions.
  Add code inside `app.js`:
  ```javascript
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
  ```
  Call `runExcelSelfTest()` at the very end of `initData()` in `app.js`.
- [ ] **Step 2: Verify self-test passes**
  Check the browser console logs on load to ensure "Excel Self Test: OK" is printed.
- [ ] **Step 3: Commit**
  ```bash
  git add app.js
  git commit -m "test: add console self-test for Excel mappings"
  ```
