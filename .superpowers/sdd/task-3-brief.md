### Task 3: Implement Excel Exporter & Translation Maps in app.js

**Files:**
- Modify: `C:\billawal\PT. BAS\EJO ENGINEER\app.js`

**Interfaces:**
- Consumes: `state.ejos` data.
- Produces: `exportToExcel()` function.

- [ ] **Step 1: Write mapping helpers and Exporter logic**
  Append translation mapping functions and `exportToExcel` to the bottom of [app.js](file:///C:/billawal/PT.%20BAS/EJO%20ENGINEER/app.js):
  ```javascript
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
      const parsed = Array.isArray(logs) ? logs : JSON.parse(logs);
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
  ```
- [ ] **Step 2: Bind Export click event listener**
  Add click listener registration in `initEventListeners()`:
  ```javascript
  document.getElementById("btn-excel-export").addEventListener("click", exportToExcel);
  ```
- [ ] **Step 3: Commit**
  ```bash
  git add app.js
  git commit -m "feat: implement Excel exporting logic with styled headers"
  ```

---

