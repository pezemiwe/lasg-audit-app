# LASG Audit Automation Platform Demo Guide & Workflow

This guide walks you through the **Audit-Centric Workflow** implemented in the LASG Audit Platform. The system has been restructured to provide a "Single Pane of Glass" for each audit engagement, allowing users to navigate through the entire audit lifecycle from a single view.

---

## Quick Start

1.  **Install Dependencies:** `npm install`
2.  **Start Development Server:** `npm run dev`
3.  **Open Browser:** `http://localhost:5173`
4.  **Login:** Use the pre-filled credentials on the login screen.

---

## Key Roles for Demo

| Role                      | Email                       | Password      | Perspective                                                                   |
| :------------------------ | :-------------------------- | :------------ | :---------------------------------------------------------------------------- |
| **Audit Lead**            | `lead.ogunjobi@lasg.gov.ng` | `password123` | **Doer:** Plans audit, executes fieldwork, drafts reports. Sees everything.   |
| **State Auditor General** | `ag@lasg.gov.ng`            | `password123` | **Oversight:** Reviews high-level progress. **Cannot see Questionnaire tab.** |
| **Supervisor**            | `sup.ikeja@lasg.gov.ng`     | `password123` | **Reviewer:** Approves planning, fieldwork, and reports.                      |
| **Head of LGA**           | `hlga.ikeja@lasg.gov.ng`    | `password123` | **Auditee:** Uploads documents, responds to queries/reports.                  |

---

## End-to-End Demo Walkthrough

### Phase 0: Mandate Initiation (State Auditor General & HLGA)

**Goal:** Establish the audit authority and kick off the cycle.

1.  **Login as State Auditor General** (`ag@lasg.gov.ng`).
2.  **Navigate to "Mandates"** in the sidebar.
3.  **Click "New Mandate"**:
    - Create a new mandate (e.g., "Ikeja LGA 2025 Statutory Audit").
    - Set type to "Financial" and "Compliance".
4.  **Publish Mandate**:
    - Locate the draft in the list.
    - Click the **Publish** button (paper airplane icon).
    - Confirm in the modal.
5.  **Logout and Login as Head of LGA** (`hlga.ikeja@lasg.gov.ng`).
6.  **Navigate to "Mandates"**:
    - Locate the newly published mandate.
    - Click **View Details** (eye icon).
    - Click the **"Accept Mandate"** button in the header.
    - **Action:** Confirm the modal to acknowledge the audit and set status to "Active".

### Phase 1: The "Single Pane of Glass" Concept (Audit Lead)

**Goal:** Show how an auditor manages an entire engagement from one place.

1.  **Login as Audit Lead** (`lead.ogunjobi@lasg.gov.ng`).
2.  **Navigate to "My Audits"** in the sidebar.
3.  **Click on an Audit** (e.g., "Ikeja LGA 2024 Statutory Audit").
    - _Observation:_ You land on the **Audit Detail View**.
    - _Observation:_ Notice the tabs at the top: **Overview**, **Questionnaire**, **Pre-Audit**, **Planning**, **Fieldwork**, **Reporting**, **Post-Audit**, **Documents**.
4.  **Explore the "Overview" Tab**:
    - See high-level info: Audit Type, Year, Current Status, Key Dates.

### Phase 2: Pre-Audit & Planning (Audit Lead)

1.  **Click "Questionnaire" Tab**:
    - Show the Internal Control Questionnaire (ICQ).
    - Fill out a few responses to calculate the risk score.
    - _Note:_ This tab is separate for Auditors but visible here for convenience.
2.  **Click "Pre-Audit" Tab**:
    - View Key Dates and Engagement Letter status.
    - Show the "Pre-Audit Checklist" (Meeting with HLGA, Logistics setup).
3.  **Click "Planning" Tab**:
    - **Scope Agreement**: Show the agreed audit scope.
    - **Risk Assessment**: Click "Add Risk Matrix" to document a high-level risk.
    - **Work Programme**: Show the list of audit steps to be performed.

### Phase 3: Execution & Fieldwork (Audit Lead)

1.  **Click "Fieldwork" Tab**:
    - **Internal Controls**: Test a control (e.g., "Payment Voucher Approval"). Mark it as "Ineffective" to trigger a finding.
    - **Substantive Testing**: Add a sample test.
    - **Fraud Flags**: Show how to raise a "Red Flag" during fieldwork.
2.  **Submit Fieldwork**:
    - Click "Submit Fieldwork" button (top right of the tab content).

### Phase 4: Reporting & Review (Supervisor & AG)

1.  **Logout and Login as Supervisor** (`sup.ikeja@lasg.gov.ng`).
2.  **Navigate to "Zone Audits"** -> Click the **Same Audit**.
3.  **Click "Fieldwork" Tab**:
    - Review the work done by the Audit Lead.
    - Click "Approve" or "Request Changes".
4.  **Click "Reporting" Tab**:
    - View the **Draft Report** generated from findings.
    - Show the workflow: Draft -> Submitted -> Approved -> Management Response -> Final.

### Phase 5: The "Auditorial" View (State Auditor General)

**Goal:** Demonstrate the specialized view for the AG.

1.  **Logout and Login as State Auditor General** (`ag@lasg.gov.ng`).
2.  **Navigate to "All Engagements"**.
3.  **Select an Audit**.
4.  **Check Tabs**:
    - _Observation:_ **The "Questionnaire" tab is MISSING.**
    - _Why?_ The AG focuses on high-level results (Planning, Fieldwork results, Reports), not the granular ICQ inputs.
    - Navigate to **Reporting** to see final reports waiting for approval.

### Phase 6: Auditee Interaction (Head of LGA)

1.  **Logout and Login as Head of LGA** (`hlga.ikeja@lasg.gov.ng`).
2.  **Navigate to "Audits"** -> Select the Audit.
3.  **Click "Documents" Tab**:
    - Upload a requested document (e.g., "Bank Statement").
4.  **Click "Reporting" Tab**:
    - View "Approved Reports" waiting for management response.
    - Respond to a finding (e.g., "We have corrected this issue...").

---

## Feature Checklist for Testing

| Feature                        | Tab Location             | User(s)    | Status |
| :----------------------------- | :----------------------- | :--------- | :----- |
| **View Audit Overview**        | Overview                 | All        | Ready  |
| **Fill ICQ / Risk Assessment** | Questionnaire / Planning | Lead, Team | Ready  |
| **Hide Questionnaire for AG**  | _(System Logic)_         | AG         | Ready  |
| **Upload Documents**           | Documents                | HLGA, Lead | Ready  |
| **Execute Fieldwork/Tests**    | Fieldwork                | Lead, Team | Ready  |
| **Approve Fieldwork**          | Fieldwork                | Supervisor | Ready  |
| **Draft Report**               | Reporting                | Lead       | Ready  |
| **Management Response**        | Reporting                | HLGA       | Ready  |
| **Post-Audit Follow-up**       | Post-Audit               | Lead, HLGA | Ready  |

## Troubleshooting

- **"Audit Not Found"**: Ensure you clicked an audit from the list. Direct URL access might fail if the ID doesn't exist in the mock data.
- **"Access Denied"**: Check your role. Only Leads/Team can edit Fieldwork. Only Supervisors/AG can approve.
- **Tab Missing?**: Remember, `Questionnaire` is hidden for `AG` and `AGF`.

---

_Generated for LASG Audit Platform Demo - Feb 2026_
