# Design Spec: EJO Ticket Visibility for Technical Engineering Roles

## Context & Problem
Currently, `isGlobalLeadUser()` returns `true` for all users belonging to `userDept === 'ENG'`. Consequently, technical engineers such as `Sipil`, `Elektrik`, `Mekanik`, `Kalibrasi`, `Program`, and `Otomotif` are treated as Global Leads and can see all unassigned tickets in status `Requested` (Phase 1 / Schedule).

Per requirement, non-Drafter technical engineers should not see unassigned or `Requested` tickets in their `Schedule` board. They should only see tickets when the ticket status is `In Progress` and has been assigned to them by a Foreman (or if they created/requested the ticket themselves).

## Target User Roles & Visibility Rules

1. **Management & Foreman Leads** (`Server`, `Plant Manager`, `Factory Manager`, `Manager Eng`, `Supervisor Eng`, `Foreman Eng`, `Admin Eng`):
   - Classified as Global Lead Users.
   - Retain full visibility of all tickets (including `Requested` unassigned tickets in `Schedule`) to manage, assign engineers, and initiate work (`Mulai Kerja`).

2. **Drafter** (`Drafter` / `Drafter Eng`):
   - Retain Drafter visibility (`isRequester || isAssigned`).

3. **Technical Non-Drafter Engineers** (`isTechNonDrafter`: `Sipil`, `Elektrik`, `Mekanik`, `Kalibrasi`, `Program`, `Otomotif`):
   - **Requester**: Visible if the current user requested the ticket (`isRequester`).
   - **Assignee**: Visible if assigned to the ticket (`isAssigned`) AND the ticket has been selected/started by Foreman (`status` is `In Progress` or beyond, i.e., NOT in unassigned/`Requested`/`Schedule` phase).
   - **Unassigned / Requested Tickets**: Hidden completely from their board and counts.

## Key Changes in `app.js`

1. **`isGlobalLeadUser()`**:
   Refine check to ensure that for `userDept === 'ENG'`, only leadership roles (`isLeadRole(role)`) qualify as Global Lead Users:
   ```javascript
   function isGlobalLeadUser() {
       if (!state.currentUser) return false;
       const role = state.currentUser.role || '';
       const userDept = getUserDepartmentCode();
       const isServer = role === 'Server' || state.currentUser.username === 'server';
       return isServer || role === 'Plant Manager' || role === 'Factory Manager' || (userDept === 'ENG' && isLeadRole(role));
   }
   ```

2. **`getVisibleGeneralEjos()`**:
   Add `isTechNonDrafter` filtering logic so assigned technical engineers only see items in `In Progress` or later:
   ```javascript
   const isTechNonDrafter = state.currentUser && isDrafterRole(role) && role !== 'Drafter';
   if (isTechNonDrafter) {
       return allowedGejos.filter(e => {
           const isRequester = checkIsRequester(e.requester);
           const engineers = (e.engineer || '').split(',').map(name => name.trim().toLowerCase());
           const isAssigned = engineers.includes(userFull) || (userName && engineers.includes(userName));
           
           if (isRequester) return true;
           if (isAssigned) {
               const isSchedulePhase = e.status === 'Requested' || e.status === 'Approved' || (e.status || '').startsWith('Checking') || e.status === 'Waiting Dept Approval';
               return !isSchedulePhase;
           }
           return false;
       });
   }
   ```

3. **`getVisibleStandardEjos()`**:
   Apply matching `isTechNonDrafter` filtering rule for consistency.

## Verification Plan
1. Log in as `sipil` / `elektrik` / `kalibrasi`:
   - Verify unassigned `Requested` tickets in `Schedule` column are no longer displayed.
   - Verify assigned tickets in `In Progress` status appear under `On Progress`.
2. Log in as `foreman` / `admin`:
   - Verify unassigned `Requested` tickets remain visible in `Schedule`.
   - Assign `sipil` and click "Mulai Kerja" -> verify status moves to `In Progress`.
   - Log back in as `sipil` -> verify ticket now appears in `sipil`'s `On Progress` board.
