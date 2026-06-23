### Task 4: Implement Excel Importer in app.js

**Files:**
- Modify: `C:\billawal\PT. BAS\EJO ENGINEER\app.js`

**Interfaces:**
- Consumes: `/api/ejos` POST/PUT endpoints.
- Produces: `importFromExcel(event)` function.

- [ ] **Step 1: Write Excel parsing and SQLite upload logic**
  Append import helper mapping functions and `importFromExcel` to the bottom of [app.js](file:///C:/billawal/PT.%20BAS/EJO%20ENGINEER/app.js):
  ```javascript
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
                      logs: existing ? existing.logs : []
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
  ```
- [ ] **Step 2: Bind Import event listeners**
  Add click and change event bindings inside `initEventListeners()`:
  ```javascript
  document.getElementById("btn-excel-import").addEventListener("click", () => {
      document.getElementById("excel-import-input").click();
  });
  document.getElementById("excel-import-input").addEventListener("change", importFromExcel);
  ```
- [ ] **Step 3: Commit**
  ```bash
  git add app.js
  git commit -m "feat: implement Excel importing parser and backend integration"
  ```

---

