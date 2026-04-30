# Product Requirements Document (PRD)

## LASG Audit Automation Platform

|             |                                                                  |
| ----------- | ---------------------------------------------------------------- |
| **Product** | LASG Audit Automation Platform                                   |
| **Owner**   | Office of the Auditor-General for Local Governments, Lagos State |
| **Version** | 1.0                                                              |
| **Status**  | Active Development                                               |
| **Date**    | April 2026                                                       |

---

## 1. Executive Summary

The LASG Audit Automation Platform is a web-based audit management system for the **Office of the Auditor-General for Local Governments, Lagos State**. It digitises and orchestrates the complete audit lifecycle — from mandate issuance through fieldwork execution to the generation of a consolidated 500-page audited financial report — covering all **57 Local Government Areas (LGAs) and Local Council Development Areas (LCDAs)** across the five geographic zones of Lagos State.

The platform replaces paper-based and fragmented processes with a single, role-aware system that enforces sequential approval gates, maintains an immutable audit trail, and produces ISA/ISSAI/IPSAS-compliant outputs.

---

## 2. Problem Statement

The Office of the Auditor-General currently faces:

- **Manual, paper-driven workflows** that make cross-LGA audit coordination slow and error-prone.
- **No centralised tracking** of audit status across 57 councils in real time.
- **Inconsistent application** of ISA/IPSAS standards across audit teams.
- **Document sprawl** — working papers, evidence, and management responses stored in disparate locations.
- **Delayed reporting** — producing a consolidated state-level report takes months due to manual compilation.
- **Limited oversight** — supervisors and the Auditor-General lack real-time visibility into fieldwork progress, exceptions, and fraud flags.

---

## 3. Objectives

| #   | Objective                                                                                           |
| --- | --------------------------------------------------------------------------------------------------- |
| O1  | Digitise the end-to-end audit lifecycle for all 57 LGAs/LCDAs across 5 zones.                       |
| O2  | Enforce ISA 315, ISA 330, ISA 500, ISA 520, IPSAS, and ISSAI compliance in every audit phase.       |
| O3  | Enable real-time tracking of audit progress, exceptions, and fraud flags by supervisors and the AG. |
| O4  | Automate consolidation and generation of the annual 500-page audited financial report.              |
| O5  | Provide role-based access so that each user sees only what is relevant to their authority level.    |
| O6  | Maintain a complete, immutable audit trail of all actions performed on the platform.                |

---

## 4. Users & Roles

### 4.1 Role Definitions

| Role                                | Description                            | Key Authorities                                                                               |
| ----------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| **System Administrator**            | Platform management, user provisioning | Create/edit users, view audit trail, configure platform settings                              |
| **State Auditor-General (AG)**      | Highest audit authority                | Publish mandates, approve outcomes, sign reports, lock materiality, generate consolidated PDF |
| **Audit Supervisor**                | Zone-level oversight (1 per zone)      | Assign leads, review stage approvals, approve fieldwork, sign procedures                      |
| **Audit Lead**                      | Engagement manager per LGA audit       | Plan audit, execute procedures, prepare reports, submit for supervisor review                 |
| **Team Auditor**                    | Execution-level staff                  | Execute assigned procedures, document evidence, upload working papers                         |
| **Head of Local Government (HoLG)** | External LGA stakeholder               | Accept mandates, submit documents, complete questionnaires, acknowledge fieldwork completion  |

### 4.2 Role-to-Feature Matrix

| Feature                  | Sys Admin | AG  | Supervisor | Lead | Team | HoLG |
| ------------------------ | --------- | --- | ---------- | ---- | ---- | ---- |
| User Management          | ✓         | —   | —          | —    | —    | —    |
| Publish Mandates         | —         | ✓   | —          | —    | —    | —    |
| Accept Mandates          | —         | —   | —          | —    | —    | ✓    |
| Manage Zones             | —         | ✓   | —          | —    | —    | —    |
| Pre-Audit                | —         | —   | ✓          | ✓    | —    | —    |
| Audit Planning           | —         | —   | ✓          | ✓    | —    | —    |
| Fieldwork Execution      | —         | —   | ✓          | ✓    | ✓    | —    |
| Document Portal          | —         | —   | —          | —    | —    | ✓    |
| Reports                  | —         | ✓   | ✓          | ✓    | —    | —    |
| Audit Outcomes           | —         | ✓   | ✓          | ✓    | —    | —    |
| AI Assistant             | ✓         | ✓   | ✓          | ✓    | ✓    | ✓    |
| Audit Procedures Library | ✓         | ✓   | ✓          | ✓    | ✓    | ✓    |
| Regulations Library      | ✓         | ✓   | ✓          | ✓    | ✓    | ✓    |

---

## 5. Audit Lifecycle & Phases

The platform manages a sequential 8-phase audit lifecycle. Each phase has defined entry/exit criteria and approval gates.

```
MANDATE
  └─ AG publishes annual mandate → LGA heads accept

PRE-AUDIT
  └─ Engagement letters issued → Entry meetings → Team assigned
     → Independence declarations → Lead/Supervisor approval

PLANNING
  └─ Entity understanding → Analytical review (ISA 315)
     → Risk matrices → Materiality set (ISA 320)
     → Audit programme created (ISA 300)

FIELDWORK
  └─ Document requisitions issued → Procedures executed (ISA 330/500/520)
     → Evidence collected → Exceptions raised & classified
     → Fraud flags → Working papers compiled
     → Supervisor review & approval

REPORTING
  └─ Draft report prepared → Findings documented → Management response
     → Supervisor review → AG sign-off

POST-AUDIT
  └─ Follow-ups tracked → Exit conference → Lessons learned
     → Quality review (1–5)

AUDIT OUTCOMES (per-LGA + Consolidated State)
  └─ Trial balance → Materiality locked → Statement of responsibility signed
     → Audit report finalized → Accounting policies → Financial statements
     → 500-page PDF generated
```

### 5.1 Audit Status States

`Pending → Pre-Audit → Planning → Fieldwork → Review → Reporting → Post-Audit → Completed`

---

## 6. Feature Requirements

### 6.1 Mandate Management

| ID   | Requirement                                                                    |
| ---- | ------------------------------------------------------------------------------ |
| M-01 | AG can create, edit, and publish annual audit mandates.                        |
| M-02 | Each mandate defines: scope, objectives, audit types, timelines per phase.     |
| M-03 | LGA heads receive a notification and can accept/acknowledge mandates.          |
| M-04 | Mandate acceptance unlocks the Document Portal and Questionnaire for that LGA. |
| M-05 | Mandates can target individual councils or all 57 at once.                     |

### 6.2 Pre-Audit

| ID    | Requirement                                                                                       |
| ----- | ------------------------------------------------------------------------------------------------- |
| PA-01 | System generates and tracks engagement letters per LGA.                                           |
| PA-02 | Entry meetings are recorded with date, agenda items, and attendees.                               |
| PA-03 | Team composition (Lead + Team Auditors) is assigned to each audit.                                |
| PA-04 | Independence declarations must be completed by each assigned team member before fieldwork begins. |
| PA-05 | Supervisors approve the pre-audit stage to unlock Planning.                                       |

### 6.3 Audit Planning

| ID    | Requirement                                                                                                          |
| ----- | -------------------------------------------------------------------------------------------------------------------- |
| PL-01 | Three-step planning workflow: Entity Understanding → Analytical Review → Risk Assessment.                            |
| PL-02 | Entity understanding captures governance structure, key personnel, and financial profile.                            |
| PL-03 | Analytical review imports or accepts trial balance data for variance and trend analysis (ISA 315/520).               |
| PL-04 | Risk matrices record inherent, control, and detection risk per audit area (Low/Medium/High/Critical).                |
| PL-05 | Materiality is calculated as: Overall = 5% × PBT; Performance = 70% × Overall; Trivial = 5% × Performance (ISA 320). |
| PL-06 | Audit programme is created from ISA-compliant templates (Financial, Compliance, Performance).                        |
| PL-07 | Each programme procedure can be assigned to a specific team member with due date.                                    |
| PL-08 | Lead submits programme for supervisor approval; supervisor can approve or request revision.                          |

### 6.4 Fieldwork

| ID    | Requirement                                                                                                                                              |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FW-01 | Leads/supervisors can issue document requisitions to LGAs per procedure.                                                                                 |
| FW-02 | Each audit procedure has a workspace supporting: work performed narrative, conclusion, conclusion notes, evidence upload.                                |
| FW-03 | Procedure workspaces support 6 test natures: Control (ISA 330), Substantive (ISA 330), Analytical (ISA 520), Inquiry, Observation, Inspection (ISA 500). |
| FW-04 | Each nature type has an auto-generate "Work Performed" engine that produces narrative from structured inputs.                                            |
| FW-05 | Exceptions are raised with severity (Low/Medium/High/Critical), classification, and investigation status.                                                |
| FW-06 | Fraud flags are tracked independently with escalation path to AG.                                                                                        |
| FW-07 | Working papers are generated from submitted/cleared procedure executions.                                                                                |
| FW-08 | Bank account confirmations, contract flags, vouching checklists, and site verifications are supported.                                                   |
| FW-09 | When a procedure is assigned to an auditor: a task is created in their task list and a notification is sent.                                             |
| FW-10 | The assigning user dropdown shows existing platform users (team members preferred; all audit-role users as fallback).                                    |
| FW-11 | Lead submits fieldwork completion memo; supervisor approves; HoLG acknowledges.                                                                          |

### 6.5 Document Portal

| ID    | Requirement                                                                            |
| ----- | -------------------------------------------------------------------------------------- |
| DP-01 | LGA heads submit documents against a predefined list of required items.                |
| DP-02 | Document status transitions: Not Uploaded → Uploaded → Reviewed → Approved / Rejected. |
| DP-03 | Rejected documents must include a reason; LGA head is notified and can resubmit.       |
| DP-04 | Pending document count is shown as a badge in the HoLG sidebar.                        |

### 6.6 Reporting

| ID   | Requirement                                                                                    |
| ---- | ---------------------------------------------------------------------------------------------- |
| R-01 | Four report types: Preliminary, Draft, Final, Consolidated.                                    |
| R-02 | Each report contains: findings with severity/recommendation, management response, and opinion. |
| R-03 | Report status lifecycle: Draft → Submitted → Under Review → Approved / Revision Required.      |
| R-04 | Findings escalate to the Audit Report Document in Audit Outcomes.                              |

### 6.7 Post-Audit

| ID    | Requirement                                                                                           |
| ----- | ----------------------------------------------------------------------------------------------------- |
| PO-01 | Five-tab closure workflow: Summary → Follow-Ups → Exit Conference → Lessons Learned → Quality Review. |
| PO-02 | Follow-up items track management response status per finding.                                         |
| PO-03 | Exit conference records attendees, date, and agreed action points.                                    |
| PO-04 | Lessons learned are categorised: Process / Risk / Control / Compliance / People.                      |
| PO-05 | Quality reviews assign a 1–5 rating to the engagement.                                                |

### 6.8 Audit Outcomes (Consolidated Report)

| ID    | Requirement                                                                                                                                                                                    |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AO-01 | Seven-tab compilation workspace: Trial Balance, Materiality, Responsibility, Audit Report, Accounting Policies, Financial Statements, Compile.                                                 |
| AO-02 | Trial balance supports upload (CSV/XLSX) with NCOA-code parsing, current/prior-year variance analysis, and approval workflow.                                                                  |
| AO-03 | Materiality calc is locked by the AG; once locked it cannot be altered.                                                                                                                        |
| AO-04 | Statement of Responsibility requires dual signature capture (Treasurer + Audit Lead) on canvas.                                                                                                |
| AO-05 | Audit Report Document supports: opinion type (Unqualified/Qualified/Adverse/Disclaimer), basis of opinion, editable narrative sections, 3-tier sequential signatures (Lead → Supervisor → AG). |
| AO-06 | AG name is pre-filled in the signature block from the users list.                                                                                                                              |
| AO-07 | Auditor-General signature card appears on its own row below Lead and Supervisor.                                                                                                               |
| AO-08 | Financial Statements include: Statement of Financial Position, Statement of Financial Performance, Cash Flow Statement, Notes to the Accounts.                                                 |
| AO-09 | Two output modes: State Consolidated and per-LGA.                                                                                                                                              |
| AO-10 | Compile tab generates a single PDF combining state-level report + all included LGA packages.                                                                                                   |
| AO-11 | All seven sections must be complete before PDF generation is unlocked.                                                                                                                         |

### 6.9 Audit Procedures Library

| ID    | Requirement                                                                                                                                                                                                            |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AP-01 | ISA-compliant procedures organised across 8 NCOA categories: Revenue, Recurrent Expenditure, Capital Expenditure, Current Assets, Non-Current Assets, Current Liabilities, Non-Current Liabilities, Equity/Net Assets. |
| AP-02 | Category filter cards display icon + label in a horizontal row layout.                                                                                                                                                 |
| AP-03 | Cards are clickable to filter the procedure list; active card highlights.                                                                                                                                              |
| AP-04 | Each procedure card shows: code, description, assertions, nature of test, risk level.                                                                                                                                  |
| AP-05 | Library is accessible publicly (unauthenticated) and within the authenticated platform.                                                                                                                                |

### 6.10 Regulations Library

| ID    | Requirement                                                                                        |
| ----- | -------------------------------------------------------------------------------------------------- |
| RL-01 | Regulations are classified as: Federal Laws, Lagos State Laws, Frameworks.                         |
| RL-02 | Summary stats displayed: Total Regulations, Federal Laws count, State Laws count, Framework types. |
| RL-03 | Publicly accessible without login.                                                                 |

### 6.11 User Management (System Admin)

| ID    | Requirement                                                                                                             |
| ----- | ----------------------------------------------------------------------------------------------------------------------- |
| UM-01 | System Admin can add new users via a modal form with: Full Name, Email, Phone, Role.                                    |
| UM-02 | Role-contextual fields: Zone (for Supervisor/Lead/Team Auditor), Council (for HoLG), Specialisations (for audit staff). |
| UM-03 | Newly created users appear immediately in the live user list (sourced from store, not static mock).                     |
| UM-04 | Role stats grid shows headcount per role with filter toggle.                                                            |
| UM-05 | State Auditor-General does not have access to the Team page.                                                            |

### 6.12 Notifications

| ID   | Requirement                                                                                                                                              |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| N-01 | All system events generate in-app notifications routed to the relevant user's ID.                                                                        |
| N-02 | 20+ notification types including: audit assignment, document deadlines, procedure assignment, approval requests, exception flags, report status changes. |
| N-03 | Unread count badge appears on the Notifications sidebar link.                                                                                            |
| N-04 | Notifications are marked read individually or all at once.                                                                                               |
| N-05 | When a procedure is assigned in Fieldwork, the assignee receives a notification immediately.                                                             |

### 6.13 AI Assistant

| ID    | Requirement                                                                             |
| ----- | --------------------------------------------------------------------------------------- |
| AI-01 | AI-powered guidance on audit standards, IPSAS, ISA, ISSAI, and Lagos State regulations. |
| AI-02 | Accessible publicly at `/ai-assistant` and within the authenticated platform.           |

### 6.14 Dashboard

| ID    | Requirement                                                                        |
| ----- | ---------------------------------------------------------------------------------- |
| DB-01 | Each role receives a customised dashboard: role-specific KPIs, tasks, quick links. |
| DB-02 | AG dashboard: state-level fraud view, consolidated progress metrics.               |
| DB-03 | Supervisor dashboard: zone-level team view, pending approvals.                     |
| DB-04 | Lead dashboard: active audits progress, assigned tasks.                            |
| DB-05 | HoLG dashboard: document submission status, mandate acceptance state.              |

---

## 7. Non-Functional Requirements

### 7.1 Security

| ID   | Requirement                                                                           |
| ---- | ------------------------------------------------------------------------------------- |
| S-01 | Authentication via JWT; tokens attached to all API requests via interceptor.          |
| S-02 | Passwords hashed with bcryptjs.                                                       |
| S-03 | Helmet middleware enforces security headers (CSP, HSTS, etc.).                        |
| S-04 | Role-based route guards on both client (`ProtectedRoute`) and server.                 |
| S-05 | State Auditor-General cannot access `/team`; enforced via route-level `allowedRoles`. |
| S-06 | Express-validator used for all input validation at API boundaries.                    |

### 7.2 Performance

| ID   | Requirement                                                                         |
| ---- | ----------------------------------------------------------------------------------- |
| P-01 | All routes are lazy-loaded (React.lazy + Suspense) to minimise initial bundle size. |
| P-02 | Zustand state persisted to localStorage with versioned migration.                   |
| P-03 | Pagination/filtering applied to user tables and audit lists.                        |

### 7.3 Accessibility & UX

| ID    | Requirement                                                                 |
| ----- | --------------------------------------------------------------------------- |
| UX-01 | Sidebar collapses to icon-only mode with hover-expand.                      |
| UX-02 | Signature capture is canvas-based, hi-DPI aware (devicePixelRatio scaling). |
| UX-03 | All destructive/sequential actions show toast confirmations.                |
| UX-04 | Route-level unauthorized access redirects to `/unauthorized`.               |
| UX-05 | 404 routes redirect to `/not-found`.                                        |

### 7.4 Compliance

| ID   | Requirement                                                                                  |
| ---- | -------------------------------------------------------------------------------------------- |
| C-01 | All audit procedures align with **ISA 300, 315, 320, 330, 500, 520, 540**.                   |
| C-02 | Financial statements produced in **IPSAS Accrual** framework.                                |
| C-03 | Reporting standards follow **ISSAI** guidelines.                                             |
| C-04 | Lagos State legal references include: **LASG Audit Law**, **FAAC Act**, **LGA Law Cap. 54**. |

---

## 8. Integrations

| Integration                      | Purpose                                                | Status |
| -------------------------------- | ------------------------------------------------------ | ------ |
| **jsPDF**                        | Generate 500-page consolidated audit report PDF        | Active |
| **Mammoth**                      | Parse Word document uploads                            | Active |
| **XLSX / SheetJS**               | Parse trial balance CSV/XLSX uploads                   | Active |
| **Axios + React Query**          | Server API data fetching with caching                  | Active |
| **Backend REST API** (`/api/v1`) | Auth, users, audits, reports, documents, notifications | Active |

---

## 9. Geographic Coverage

| Zone                  | Capital | LGAs   | LCDAs  | Total  |
| --------------------- | ------- | ------ | ------ | ------ |
| Zone 1 — Ikeja        | Ikeja   | 8      | 15     | 23     |
| Zone 2 — Lagos Island | Lagos   | 5      | 7      | 12     |
| Zone 3 — Ikorodu      | Ikorodu | 1      | 5      | 6      |
| Zone 4 — Badagry      | Badagry | 4      | 6      | 10     |
| Zone 5 — Epe          | Epe     | 2      | 4      | 6      |
| **Total**             |         | **20** | **37** | **57** |

---

## 10. Tech Stack

| Layer      | Technology                                            |
| ---------- | ----------------------------------------------------- |
| Frontend   | React 19 (TypeScript), Vite, Zustand, React Router v7 |
| Styling    | TailwindCSS 4.1, CSS Modules                          |
| Icons      | Lucide React                                          |
| Animations | Framer Motion                                         |
| Documents  | jsPDF, Mammoth, SheetJS (XLSX)                        |
| Backend    | Express.js 5.2 (TypeScript), Node.js                  |
| Auth       | JWT + bcryptjs                                        |
| Security   | Helmet, Express-validator, Morgan                     |
| Deployment | Vercel (frontend), configurable server                |

---

## 11. Out of Scope (v1.0)

- Real-time collaboration (multi-user simultaneous editing of the same procedure)
- Mobile native application
- Biometric authentication
- External system integrations (IPPIS, GIFMIS, FAAC portal)
- Automated email delivery of engagement letters (currently in-platform only)
- AI-generated audit procedures (AI Assistant is advisory only)

---

## 12. Success Metrics

| Metric                                       | Target                    |
| -------------------------------------------- | ------------------------- |
| Audit cycle time reduction                   | ≥ 30% vs. manual process  |
| All 57 LGAs covered per audit year           | 100%                      |
| Time to produce consolidated 500-page report | < 1 week post-AG sign-off |
| Procedure completion rate per engagement     | ≥ 95%                     |
| Unresolved exceptions at report stage        | 0                         |
| User adoption across all 6 roles             | 100% of designated staff  |

---

_Document prepared based on platform codebase as of April 2026. This PRD reflects the implemented feature set and serves as a baseline for future release planning._
