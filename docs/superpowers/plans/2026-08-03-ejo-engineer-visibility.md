# EJO Engineer Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide unassigned `Requested` / `Schedule` phase EJO tickets from non-Drafter technical engineering accounts (`Sipil`, `Elektrik`, `Mekanik`, `Kalibrasi`, `Program`, `Otomotif`), showing tickets only when they are requested by the user or assigned and moved to `In Progress` by a Foreman.

**Architecture:** Refine `isGlobalLeadUser()` in `app.js` to exclude non-lead ENG technicians from global lead status, and update `getVisibleGeneralEjos()` and `getVisibleStandardEjos()` to filter out `Schedule`/`Requested` phase tickets for `isTechNonDrafter` users.

**Tech Stack:** JavaScript (ES6+), HTML5, Node.js / Python test runner.

## Global Constraints
- Preserve existing access for Management/Lead roles (`Server`, `Plant Manager`, `Factory Manager`, `Manager Eng`, `Supervisor Eng`, `Foreman Eng`, `Admin Eng`).
- Preserve existing access for `Drafter` role.
- All code modifications must be in `app.js`.

---

### Task 1: Refine `isGlobalLeadUser()` Authority Scope

**Files:**
- Modify: `app.js:4925-4932`

**Interfaces:**
- Consumes: `state.currentUser`, `getUserDepartmentCode()`, `isLeadRole(role)`
- Produces: `isGlobalLeadUser()` -> returns `boolean`

- [ ] **Step 1: Inspect current `isGlobalLeadUser()` definition**

Verify lines 4926-4932 in `app.js`:
```javascript
function isGlobalLeadUser() {
    if (!state.currentUser) return false;
    const role = state.currentUser.role || '';
    const userDept = getUserDepartmentCode();
    const isServer = role === 'Server' || state.currentUser.username === 'server';
    return isServer || role === 'Plant Manager' || role === 'Factory Manager' || userDept === 'ENG';
}
```

- [ ] **Step 2: Update `isGlobalLeadUser()` implementation**

Replace `userDept === 'ENG'` with `(userDept === 'ENG' && isLeadRole(role))` so that non-lead technical staff (with role level < 40) are not treated as Global Leads.

```javascript
function isGlobalLeadUser() {
    if (!state.currentUser) return false;
    const role = state.currentUser.role || '';
    const userDept = getUserDepartmentCode();
    const isServer = role === 'Server' || state.currentUser.username === 'server';
    return isServer || role === 'Plant Manager' || role === 'Factory Manager' || (userDept === 'ENG' && isLeadRole(role));
}
```

- [ ] **Step 3: Commit Task 1**

```bash
git add app.js
git commit -m "fix(auth): restrict isGlobalLeadUser in ENG department to lead roles"
```

---

### Task 2: Implement Technical Non-Drafter Ticket Filtering in EJO Visibility Functions

**Files:**
- Modify: `app.js:5000-5070`

**Interfaces:**
- Consumes: `getVisibleGeneralEjos()`, `getVisibleStandardEjos()`, `isDrafterRole(role)`
- Produces: Filtered array of visible EJO objects for the current user

- [ ] **Step 1: Update `getVisibleGeneralEjos()` filtering logic**

Add `isTechNonDrafter` handling inside `getVisibleGeneralEjos()`:

```javascript
function getVisibleGeneralEjos() {
    if (!state.generalEjos) return [];
    if (!state.currentUser) return [];

    const allowedGejos = state.generalEjos;
    const role = state.currentUser.role || '';
    const userDept = getUserDepartmentCode();

    // Global cross-department roles (Server, Plant Manager, Factory Manager, ENG team leads) see all General EJOs
    if (isGlobalLeadUser()) {
        return allowedGejos;
    }

    const userFull = (state.currentUser.fullname || '').toLowerCase().trim();
    const userName = (state.currentUser.username || '').toLowerCase().trim();
    const isDeptLeader = role.includes('Supervisor') || role.includes('Manager') || isDepartmentApprover(state.currentUser, userDept);
    const isTechNonDrafter = isDrafterRole(role) && role !== 'Drafter';

    return allowedGejos.filter(e => {
        const isRequester = checkIsRequester(e.requester);
        const engineers = (e.engineer || '').split(',').map(name => name.trim().toLowerCase());
        const isAssigned = engineers.includes(userFull) || (userName && engineers.includes(userName));
        
        if (isTechNonDrafter) {
            if (isRequester) return true;
            if (isAssigned) {
                const isSchedulePhase = e.status === 'Requested' || e.status === 'Approved' || (e.status || '').startsWith('Checking') || e.status === 'Waiting Dept Approval';
                return !isSchedulePhase;
            }
            return false;
        }

        // Supervisor & Manager of specific department ONLY see items in their department
        if (isDeptLeader) {
            const reqUser = (state.users || []).find(u => u.username === e.requester || u.fullname === e.requester);
            const isReqSameDept = reqUser && normalizeDepartmentCode(reqUser.dept) === userDept;
            const isSameDept = userDept && (normalizeDepartmentCode(e.dept) === userDept || isReqSameDept);
            return isRequester || isAssigned || isSameDept;
        }

        // Ordinary Staff/User: ONLY see their OWN requested or assigned items
        return isRequester || isAssigned;
    });
}
```

- [ ] **Step 2: Update `getVisibleStandardEjos()` filtering logic**

Add `isTechNonDrafter` handling inside `getVisibleStandardEjos()`:

```javascript
function getVisibleStandardEjos() {
    if (!state.ejos) return [];
    if (!state.currentUser) return [];

    const role = state.currentUser.role || '';
    const userDept = getUserDepartmentCode();

    const allowedEjos = state.ejos.filter(e => {
        if (e.status === 'Waiting Dept Approval') {
            const isRequester = checkIsRequester(e.requester);
            const isDeptApprover = isDepartmentApprover(state.currentUser, e.dept);
            return isRequester || isDeptApprover;
        }
        return true;
    });

    if (isGlobalLeadUser()) return allowedEjos;

    const userFull = (state.currentUser.fullname || '').toLowerCase().trim();
    const userName = (state.currentUser.username || '').toLowerCase().trim();
    const isDeptLeader = role.includes('Supervisor') || role.includes('Manager') || isDepartmentApprover(state.currentUser, userDept);
    const isTechNonDrafter = isDrafterRole(role) && role !== 'Drafter';

    return allowedEjos.filter(e => {
        const isRequester = checkIsRequester(e.requester);
        const engineers = (e.engineer || '').split(',').map(name => name.trim().toLowerCase());
        const isAssigned = engineers.includes(userFull) || (userName && engineers.includes(userName));
        const isDeptApprover = isDepartmentApprover(state.currentUser, e.dept);

        if (isTechNonDrafter) {
            if (isRequester) return true;
            if (isAssigned) {
                const isSchedulePhase = e.status === 'Requested' || e.status === 'Approved' || (e.status || '').startsWith('Checking') || e.status === 'Waiting Dept Approval';
                return !isSchedulePhase;
            }
            return false;
        }

        if (isDeptLeader) {
            const isSameDept = userDept && normalizeDepartmentCode(e.dept) === userDept;
            return isRequester || isAssigned || isSameDept || isDeptApprover;
        }

        return isRequester || isAssigned || isDeptApprover;
    });
}
```

- [ ] **Step 3: Commit Task 2**

```bash
git add app.js
git commit -m "feat(visibility): hide Schedule/Requested phase tickets for non-Drafter technical engineers"
```

---

### Task 3: Verification & Validation

- [ ] **Step 1: Check syntax and run static code checks**

Run syntax verification on `app.js` using node or python syntax parser.

- [ ] **Step 2: Empirical test scenarios**

Verify the following scenarios:
1. Non-Drafter Engineer (e.g. `sipil`, `elektrik`):
   - Unassigned tickets in `Requested` / `Schedule` phase are NOT visible.
   - Assigned tickets in `In Progress` phase are visible in `On Progress`.
2. Foreman Eng / Admin Eng / Server:
   - Unassigned tickets in `Requested` / `Schedule` phase are visible.
   - Assigning a ticket to `sipil` and setting status to `In Progress` makes it appear for `sipil`.
3. Drafter:
   - Drafter visibility remains functional.
