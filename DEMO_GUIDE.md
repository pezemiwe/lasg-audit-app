# LASG Audit Automation Platform — Comprehensive User Guide

**Lagos State Office of the Auditor-General for Local Governments**

This guide provides a complete overview of the platform's purpose, features, navigation, and role-specific capabilities. It is designed for all users — new and existing — to understand how the system works and what each role can do.

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Getting Started — How to Log In](#2-getting-started--how-to-log-in)
3. [Understanding the Dashboard Layout](#3-understanding-the-dashboard-layout)
4. [The Audit Lifecycle — End-to-End Flow](#4-the-audit-lifecycle--end-to-end-flow)
5. [Role-by-Role Navigation Guide](#5-role-by-role-navigation-guide)
   - [System Administrator](#51-system-administrator)
   - [State Auditor General](#52-state-auditor-general)
   - [Audit Supervisor](#53-audit-supervisor)
   - [Audit Lead](#54-audit-lead)
   - [Team Auditor](#55-team-auditor)
   - [Head of Local Government (HLGA)](#56-head-of-local-government-hlga)
6. [Module Reference Guide](#6-module-reference-guide)
7. [Demo Test Accounts](#7-demo-test-accounts)

---

## 1. Platform Overview

The **Lagos State Audit Automation Platform (LASG-AAP)** is a digital government platform for managing the full statutory audit cycle of all 20 Local Government Areas (LGAs) of Lagos State. It is operated by the **Office of the Auditor-General for Local Governments**.

### What the Platform Does

- Manages **audit mandates** from creation to publication to acceptance
- Coordinates **team assignments** (supervisors → leads → auditors)
- Tracks audit work across 6 phases: Pre-Audit → Planning → Fieldwork → Review → Reporting → Post-Audit
- Provides a **Document Portal** where LGAs submit required financial documents
- Generates **audit reports** with findings and management responses
- Maintains an **audit trail** of all system activity
- Includes an **AI Legal Assistant** for querying audit law and regulations
- Covers all 20 LGAs across 5 administrative zones: Ikeja, Lagos Island, Ikorodu, Badagry, and Epe

### Geographic Structure

| Zone             | LGAs Covered                                                               |
| :--------------- | :------------------------------------------------------------------------- |
| **Ikeja**        | Ikeja, Alimosho, Agege, Mushin, Oshodi-Isolo, Kosofe, Somolu, Ifako-Ijaiye |
| **Lagos Island** | Lagos Island, Lagos Mainland, Apapa, Eti-Osa, Surulere                     |
| **Ikorodu**      | Ikorodu                                                                    |
| **Badagry**      | Badagry, Ojo, Amuwo-Odofin, Ajeromi-Ifelodun                               |
| **Epe**          | Epe, Ibeju-Lekki                                                           |

---

## 2. Getting Started — How to Log In

### Step-by-Step Login

1. Navigate to the platform URL and you will land on the **public landing page**
2. Click **"Sign In"** or go to `/login`
3. On the login screen:
   - Use the **Role Selector** dropdown to pick a role — the email field auto-fills
   - Password is `password123` for all demo accounts
   - Click **"Sign In to Portal"**
4. You are redirected to your personalized **Dashboard**

> **Note:** Each browser tab maintains an independent session, so you can open multiple tabs to simulate different users simultaneously.

### Public Access (No Login Required)

- **Landing Page** (`/`) — Overview of the platform, its features and mandate
- **Public Regulations** (`/public-regulations`) — Browse all audit laws and regulations
- **Public AI Assistant** (`/public-ai-assistant`) — AI legal assistant available to anyone

---

## 3. Understanding the Dashboard Layout

After login, every user sees a consistent two-panel layout:

### Left Sidebar

- **LASG Audit** branding with Lagos State Seal
- **User card** showing your name, role, and initials avatar
- **Navigation menu** grouped into sections:
  - **Main** — Dashboard, Notifications
  - **Management** — Role-specific management tools
  - **Work** — Core audit work modules
  - **Reference** — Regulations
- **Sign Out** button at the bottom
- The sidebar can be **collapsed** by hovering near its right edge and clicking the floating toggle pill that appears

### Top Bar

- Platform title
- **Bell icon** — opens a dropdown of your personal notifications with unread count badge
- **Hamburger menu** — mobile/tablet sidebar toggle

### Main Content Area

- Each page has a **page header** with title, subtitle, and role badge
- Most pages show **KPI cards** at the top for at-a-glance stats
- Actions like creating, submitting, or reviewing are done inline within each page

---

## 4. The Audit Lifecycle — End-to-End Flow

The platform manages a structured, role-gated audit process. Each phase must be completed before the next unlocks.

```
[STATE AUDITOR GENERAL]
         │
         ▼
   1. MANDATE CREATION
      Creates mandate, sets scope, objectives, timelines, audit types
         │
         ▼
   2. MANDATE PUBLICATION
      Mandate published → visible to LGAs & supervisors
         │
         ├────────────────────────────────────────┐
         ▼                                        ▼
[STATE AUDITOR GENERAL]                   [HEAD OF LGA]
   Assigns Supervisors to Zones           Accepts mandate, submits documents
   (Zone Management page)                 (Document Portal)
         │
         ▼
[AUDIT SUPERVISOR]
   3. TEAM ASSIGNMENT
      Assigns Audit Lead to each LGA (Team Management page)
      Lead receives invitation → accepts via Assignments page (COI declaration required)
         │
         ▼
[AUDIT LEAD]
   4. PRE-AUDIT PHASE
      Sends notification letters to LGA
      Schedules entry meeting
      Manages document checklist
         │
         ▼
   5. PLANNING PHASE
      Entity Understanding
      Risk Matrix (identify & rate risks)
      Materiality Thresholds
      Audit Programme (procedures list)
         │
         ▼
[AUDIT LEAD + TEAM AUDITOR]
   6. FIELDWORK PHASE
      Internal Controls Testing
      Substantive Tests (revenue, payroll, procurement, etc.)
      Analytical Procedures (year-on-year comparisons)
      Compliance Checks (regulations checklist)
      Physical Verification (assets on-site)
      Fraud Flag Identification
         │
         ▼
[TEAM AUDITOR]
   Uploads Workpapers for each task
   [AUDIT LEAD] reviews & approves workpapers
         │
         ▼
[AUDIT LEAD]
   7. REPORTING PHASE
      Creates Draft Report with findings
      Submits to Supervisor for review
         │
         ▼
[AUDIT SUPERVISOR]
   Reviews report → Approves or requests revision
         │
         ▼
[HEAD OF LGA]
   Provides management responses to each finding
         │
         ▼
[STATE AUDITOR GENERAL]
   Final approval of report → Report marked FINAL
         │
         ▼
[AUDIT LEAD / SUPERVISOR]
   8. POST-AUDIT PHASE
      Audit debrief & quality review
      Follow-up tracker (recommendations implementation)
      Exit conference documentation
      Lessons learned registry
```

---

## 5. Role-by-Role Navigation Guide

---

### 5.1 System Administrator

**Login:** `sysadmin@lasg.gov.ng` / `password123`
**Name:** Engr. Babatunde Fashola

The System Admin manages platform infrastructure, users, and has full visibility across all modules.

#### Navigation Menu

| Section    | Item              | Purpose                                                  |
| :--------- | :---------------- | :------------------------------------------------------- |
| Main       | Dashboard         | Platform health, system stats, activity overview         |
| Main       | Notifications     | System notifications                                     |
| Management | User Management   | View all users by role                                   |
| Management | Audit Trail       | Full log of every system action                          |
| Management | Platform Settings | Configure platform name, security, notifications, backup |
| Work       | All Mandates      | View every mandate in the system                         |
| Work       | All Engagements   | View every audit engagement                              |
| Reference  | Regulations       | Browse all audit laws                                    |

#### Dashboard View

The System Admin dashboard shows:

- **System Health** indicators (server, database, security, storage)
- **Platform Overview** — total users, mandates, audits
- **Recent Activity Log** — timestamped list of all system events
- Quick-action buttons to navigate to User Management and Audit Trail

#### What You Can Do

- **User Management** (`/user-management`): Browse all registered users, filter by role, view zone/LGA assignments and contact details. Role-count badges at the top let you filter instantly.
- **Audit Trail** (`/audit-trail`): View a comprehensive, searchable, timestamped log of every action performed in the system. Export to CSV. Shows total events, security events, active users, and 7-year retention policy details.
- **Platform Settings** (`/settings`): Configure General Settings (platform name, support email, audit year, timezone), Security & Access (session timeout, 2FA, password policy), Notifications (email alerts, digest frequency), and Backup & Recovery (auto-backup schedule).

---

### 5.2 State Auditor General

**Login:** `ag@lasg.gov.ng` / `password123`
**Name:** Hon. Adebayo Oluwaseun

The highest authority on the platform. Sets the audit mandate, assigns supervisors to zones, oversees all active audits, and gives final report approval.

#### Navigation Menu

| Section    | Item            | Purpose                                                |
| :--------- | :-------------- | :----------------------------------------------------- |
| Main       | Dashboard       | State-wide overview of all audits, risks, and progress |
| Main       | Notifications   | Alerts and reminders                                   |
| Management | Mandates        | Create, publish, and manage audit mandates             |
| Management | Zones           | Assign supervisors to administrative zones             |
| Management | Reports         | Review and give final approval on audit reports        |
| Work       | All Engagements | View every audit across all 20 LGAs                    |
| Reference  | Regulations     | Browse all audit law references                        |

#### Dashboard View

The AG Dashboard provides a **state-wide strategic overview**:

- **KPI Cards**: Total LGA coverage (20 LGAs / 5 zones), Active Audits count, Critical Risks needing attention, Average completion percentage
- **Priority Attention Areas**: A risk scorecard ranking LGAs by number of unresolved critical & high-severity fraud flags
- **Audit Stage Breakdown**: Bar chart showing Planning / Fieldwork / Reporting / Completed proportions
- **Recent Activity**: Latest actions across the platform

#### Key Workflows

**Creating and Publishing a Mandate**

1. Go to **Mandates** → click **+ New Mandate**
2. Fill in: Title, Audit Year, Scope, Objectives, Timelines, Start/End Dates, Audit Types (Financial / Performance / Compliance / Combined)
3. Optionally add an electronic signature
4. **Save as Draft** first
5. Open the mandate detail → click **Publish Mandate** (triggers a confirmation modal)
6. Status changes: Draft → Published → Active (once LGAs accept)

**Assigning Supervisors to Zones**

1. Go to **Zones** (`/zones`)
2. See 5 zone cards — expand any zone to see its LGAs and current supervisors
3. Click **+ Add Supervisor** on a zone → a modal shows all unassigned supervisors
4. Select and assign — the supervisor appears in the zone's supervisor list

**Final Report Approval**

1. Go to **Reports** (`/reports`)
2. Find reports at "Approved" status (reviewed by supervisor, management responded)
3. Open report → review findings and management responses
4. Click **Final Approval** to mark as **Final** — the audit cycle completes

---

### 5.3 Audit Supervisor

**Login:** `sup.ikeja@lasg.gov.ng` / `password123` _(Ikeja Zone)_
Other supervisors: `sup.lagos@lasg.gov.ng`, `sup.ikorodu@lasg.gov.ng`, `sup.badagry@lasg.gov.ng`, `sup.epe@lasg.gov.ng`

Supervisors manage a geographic zone. They assign Audit Leads to LGAs, oversee fieldwork, review workpapers, and approve reports before they go to the AG.

#### Navigation Menu

| Section    | Item          | Purpose                                    |
| :--------- | :------------ | :----------------------------------------- |
| Main       | Dashboard     | Zone overview with LGA progress cards      |
| Main       | Notifications | Zone-level alerts                          |
| Management | Mandates      | View published mandates relevant to zone   |
| Management | Team          | Assign leads to LGAs, invite team auditors |
| Management | Reports       | Review draft reports from Audit Leads      |
| Work       | Zone Audits   | All audit engagements within your zone     |
| Reference  | Regulations   | Regulations browser                        |

#### Dashboard View

The Supervisor Dashboard shows:

- **Zone Summary**: Zone name, number of LGAs assigned, audit leads assigned vs unassigned
- **LGA-level progress table**: Each LGA with its current audit status, progress bar, and assigned lead
- **Pending Invitations**: Outstanding invitations awaiting acceptance
- **Recent Activity** from your zone

#### Key Workflows

**Assigning an Audit Lead to an LGA**

1. Go to **Team** (`/team`)
2. Your zone's LGAs are listed with their assignment status
3. Click **Assign Lead** next to an unassigned LGA
4. A confirmation modal shows — select the Audit Lead from the dropdown and confirm
5. The lead receives an invitation in their **Assignments** page
6. Alternatively, use **+ Create New Lead** button to add a brand-new Audit Lead to the system

**Inviting Team Auditors**

1. On the **Team** page, use the **+ Invite Auditor** action
2. Select an available Team Auditor and assign them to an audit engagement
3. The auditor receives an invitation requiring COI declaration before acceptance

**Reviewing Workpapers**

1. Go to **Workpapers** is accessed via the Audit Detail page → a submitted workpaper shows **Approve / Revision Required** buttons
2. Add review notes if requesting revision

**Reviewing and Approving Reports**

1. Go to **Reports** (`/reports`)
2. Reports submitted by Audit Leads appear at "Submitted" status
3. Open a report → review all findings
4. **Approve** (moves to management response stage) or **Request Revision** (sent back to Audit Lead)
5. Approved reports are visible to the Head of LGA for management response

---

### 5.4 Audit Lead

**Login:** `lead.ogunjobi@lasg.gov.ng` / `password123`
Other leads: `lead.bakare@lasg.gov.ng`, `lead.onyekachi@lasg.gov.ng`, `lead.adeleke@lasg.gov.ng`, `lead.salami@lasg.gov.ng`

The Audit Lead manages one or more LGA engagements end-to-end, from pre-audit preparation through to reporting. They coordinate the team, plan the audit, supervise fieldwork, review workpapers, and produce the audit report.

#### Navigation Menu

| Section    | Item          | Purpose                                                      |
| :--------- | :------------ | :----------------------------------------------------------- |
| Main       | Dashboard     | My audits, tasks, and progress at a glance                   |
| Main       | Notifications | Invitations, deadlines, alerts                               |
| Management | Assignments   | Accept/decline engagement invitations (with COI declaration) |
| Management | Build Team    | Invite Team Auditors, assign tasks                           |
| Management | Reports       | Create draft reports, submit for supervisor review           |
| Work       | My Audits     | All engagement records assigned to you                       |
| Reference  | Regulations   | Full regulations reference                                   |

#### Dashboard View

The Audit Lead Dashboard shows:

- **Active engagement cards** — for each assigned LGA audit, with status, progress, and quick-launch buttons
- **Task Summary** — Pending / In Progress / Completed task counts
- **Pending Invitations** badge (if any assignments awaiting acceptance)
- **Recent activity** on your audits

#### Key Workflows

**Step 1 — Accepting an Assignment**

1. Go to **Assignments** (`/assignments`) — check the badge count on the sidebar
2. Under **Pending**, click **Accept** on an invitation
3. A **Conflict of Interest (COI) Declaration** modal appears with 4 declarations
4. Tick all 4 boxes confirming no conflict → click **Confirm & Accept**
5. Invite shows as **Accepted** and the engagement is now in your My Audits list

**Step 2 — Pre-Audit Preparation**
Access via **My Audits** → click on an audit → select **Pre-Audit** tab (or go to `/pre-audit`)

- **Overview**: Summary of the engagement, LGA contact info, audit phase
- **Engagement Letter**: Draft and preview the official notification letter to the LGA
- **Notification Letters**: Manage letter status — Sent → Acknowledged → Documents Received
- **Entry Meetings**: Schedule and record the entry meeting (date, notes, agenda, attendees, action items)
- **Document Checklist**: Track 11 required documents by category and priority
- **Team**: View the audit team assigned to this engagement

**Step 3 — Audit Planning**
Access via Audit Detail → **Planning** tab (or `/audit-planning`)

- **Entity Understanding**: Document the LGA background, governance structure, financial overview
- **Risk Matrix**: Add risk items — set Inherent Risk, Control Risk, Detection Risk, and the system calculates Overall Risk
- **Materiality**: Set Overall Materiality, Performance Materiality, and Clearly Trivial Threshold with basis and percentage
- **Audit Programme**: Create procedural steps per work area, assign to team members, track completion

**Step 4 — Fieldwork Supervision**
Access via Audit Detail → **Fieldwork** tab (or `/fieldwork`)
Manage 6 testing categories:

- **Internal Controls** — test control effectiveness (Effective / Partially Effective / Ineffective)
- **Substantive Tests** — Revenue, Expenditure, Payroll, Procurement, Bank, Assets, Liabilities
- **Analytical Procedures** — Year-on-year variance analysis with explanations
- **Compliance Checks** — Evaluate LGA compliance against key regulations
- **Physical Verification** — Asset existence and condition checks
- **Fraud Flags** — Raise, escalate, or resolve fraud indicators

**Step 5 — Workpaper Review**

1. Go to **Workpapers** (`/workpapers`)
2. Team Auditors submit workpapers for review
3. As lead, click **Review** on a submitted workpaper
4. **Approve** to accept or **Request Revision** with notes

**Step 6 — Report Creation**

1. Go to **Reports** (`/reports`) → click **+ New Report**
2. Select the audit, set title and report type (Preliminary / Draft / Final / Consolidated)
3. Add findings — each finding has: Title, Description, Severity (Low/Medium/High/Critical), Recommendation
4. Submit the report for **Supervisor Review**

---

### 5.5 Team Auditor

**Login:** `auditor.ige@lasg.gov.ng` / `password123`
Other auditors: `auditor.nwankwo@lasg.gov.ng`, `auditor.mohammed@lasg.gov.ng`, `auditor.eze@lasg.gov.ng`, `auditor.adesanya@lasg.gov.ng`, `auditor.fashola@lasg.gov.ng`, `auditor.adichie@lasg.gov.ng`, `auditor.abdullahi@lasg.gov.ng`, `auditor.obi@lasg.gov.ng`, `auditor.adeyemi@lasg.gov.ng`

Team Auditors are the hands-on fieldworkers. They accept assignments, execute audit procedures, complete questionnaires, and submit workpapers for review.

#### Navigation Menu

| Section    | Item          | Purpose                                     |
| :--------- | :------------ | :------------------------------------------ |
| Main       | Dashboard     | My tasks, workpapers, and assigned audits   |
| Main       | Notifications | Invitations, task updates                   |
| Management | Assignments   | Accept/decline engagement invitations       |
| Work       | My Tasks      | Audit engagements and tasks assigned to you |
| Reference  | Regulations   | Regulations reference                       |

#### Dashboard View

The Team Auditor dashboard shows:

- **Task summary cards** — Pending / In Progress / Review / Completed counts
- **Active audit list** — engagements you are assigned to
- **Workpaper status** — recently uploaded workpapers and their review status
- **Pending invitations badge** at the top

#### Key Workflows

**Accepting an Assignment**

1. Go to **Assignments** (`/assignments`) — you'll see pending invitations
2. Click **Accept** → complete the **Conflict of Interest (COI) Declaration** (tick all 4 declarations)
3. Once accepted, use **Preparation Guide** which expands to show:
   - Pre-engagement checklist, useful regulations, the mandate details, deadlines
   - Use **Decline** if you cannot take the engagement (supervisor is notified)

**Executing Fieldwork**

1. Navigate to **My Tasks** → click an audit → **Fieldwork** tab
2. Work through the assigned testing areas in the 6-tab fieldwork module
3. Document findings, upload evidence files where prompted

**Filling in the Questionnaire**

1. Navigate to an audit → **Questionnaire** tab (or `/questionnaire`)
2. Questions are grouped into sections (e.g., Governance, Financial Controls, Revenue, Procurement)
3. Answer each question (open-ended, multiple choice, document confirmation types)
4. Save individual responses — progress is tracked per section
5. All saved responses are visible to the Audit Lead

**Uploading Workpapers**

1. Go to **Workpapers** (`/workpapers`) → click **+ Upload Workpaper**
2. Enter: Title, link to associated Task, filename
3. Click upload — workpaper appears at **Draft** status
4. Click **Submit for Review** → workpaper goes to Audit Lead
5. If revision is requested by the Lead, update and resubmit
6. Once **Approved**, the workpaper is locked

---

### 5.6 Head of Local Government (HLGA)

**Login:** `hlga.ikeja@lasg.gov.ng` / `password123` _(Ikeja LGA)_
Other HLGA: `hlga.lagos@lasg.gov.ng` _(Lagos Island LGA)_

The HLGA represents the auditee — the Local Government being audited. They view the mandate, accept it, upload required documents, respond to scope agreements, and provide management responses to audit findings.

#### Navigation Menu

| Section   | Item          | Purpose                                                        |
| :-------- | :------------ | :------------------------------------------------------------- |
| Main      | Dashboard     | My LGA's audit status, documents submitted, upcoming deadlines |
| Main      | Notifications | Mandate notifications, document requests, report alerts        |
| Work      | Mandates      | View and formally accept the audit mandate                     |
| Work      | Audits        | View the audit status for your LGA                             |
| Work      | Reports       | View reports and submit management responses to findings       |
| Reference | Regulations   | Browse audit law for context                                   |

#### Dashboard View

The HLGA Dashboard shows:

- **Mandate status** — whether the mandate has been accepted or is pending
- **Document submission progress** — how many of the required documents have been uploaded and approved
- **Active audit details** — current phase, assigned audit lead, deadlines
- **Report status** — whether a report is awaiting management response
- **Notification checklist** — required documents listed with submission status

#### Key Workflows

**Accepting the Audit Mandate**

1. Go to **Mandates** (`/mandates`)
2. The published mandate appears — read the scope, objectives, timelines
3. Click **Accept & Commence** and confirm in the modal
4. The mandate status updates to **Active** for your LGA

**Submitting Required Documents**

1. Go to **Document Portal** (`/document-portal`) — or via Audits → Document Portal tab
2. The system auto-generates a checklist of 12 required documents:
   - Annual Financial Statements, Approved Budget, Bank Statements, Staff/Payroll Records, Revenue Records, Capital Project Files, Procurement Records, Fixed Asset Register, Tenders Board Minutes, Internal Audit Reports, Previous Audit Reports, Cash Books
3. For each document: select it and click **Upload** — status changes from **Pending** to **Uploaded**
4. The Audit Lead reviews and either **Approves** or **Rejects** with a reason
5. Rejected documents must be re-uploaded

**Responding to the Scope Agreement**

1. Go to **Scope Agreement** (`/scope-agreement`) — or via Audits → Scope Agreement tab
2. The Audit Lead has defined scope areas with timelines and expectations
3. Review each row — you can request **Changes** or **Sign Off** on each area
4. Once all rows are signed off by both sides, status becomes **Fully Approved**

**Answering the Pre-Audit Questionnaire**

1. Go to **Questionnaire** → answer questions across multiple sections
2. Covers: Governance & Organization, Financial Management, Revenue, Expenditure & Payroll, Procurement, Assets & Liabilities, Capital Projects, Compliance
3. Save responses section by section

**Responding to Audit Findings in the Report**

1. Go to **Reports** (`/reports`)
2. When a report reaches **Approved** status (Supervisor-approved), it becomes visible to you
3. Open the report → under each finding you will see a **Management Response** text area
4. Write your LGA's formal response to each finding (acknowledge, explain, or dispute)
5. Submit management responses → report moves to final AG approval stage

---

## 6. Module Reference Guide

### Regulations (`/regulations`)

A searchable library of audit laws and regulations organized by category:

- **Financial Audit** (FA) — Constitutional mandates, PFMA, Lagos Audit Law
- **Performance Audit** (PA) — PPA, National Planning Commission, Lagos Performance Standards
- **Compliance Audit** (CA) — Fiscal Responsibility Act, Anti-Corruption Laws, Procurement Laws
  Each regulation shows jurisdiction (Federal / Lagos), effective date, description, and tags. Use the search bar to filter. An AI assistant link is embedded for deeper queries.

### AI Legal Assistant (`/ai-assistant` or `/public-ai-assistant`)

An AI chatbot pre-trained on Nigerian audit law and regulations. Ask questions like:

- _"What does Section 125 of the 1999 Constitution say about LGA audits?"_
- _"When should a compliance audit be triggered?"_
- _"What is the difference between financial and performance audits?"_
  Type your question, press **Enter** or the **Send** button. Available to both logged-in users and the public.

### Notifications (`/notifications`)

Centralised inbox for all platform alerts. Includes:

- Mandate publications
- Assignment invitations
- Deadline warnings (automatically generated when audit phases are overdue)
- Report approvals and revision requests
- Document upload/rejection alerts
  Unread count is shown as a badge on the sidebar item and top bar bell icon. Mark individual or all notifications as read.

### Workpapers (`/workpapers`)

Audit evidence management system:

- **Team Auditors** upload workpapers (Draft → Submitted)
- **Audit Leads** review and approve or request revision (Submitted → Approved / Revision Required)
- **Supervisors** have read access
  Each workpaper links to a specific audit task, records file name, size, uploader, and review notes.

### Audit Detail Page (`/audits/:id`)

Clicking on any audit in the Audit list opens a **tabbed detail page** that embeds all phase modules for that specific engagement:
| Tab | Content |
|:---|:---|
| Overview | Audit metadata, phase timeline editor, LGA contact info |
| Pre-Audit | Notification letters, entry meetings, document checklist |
| Scope Agreement | Scope rows with dual sign-off |
| Questionnaire | LGA questionnaire responses |
| Planning | Risk matrix, materiality, audit programme |
| Fieldwork | All 6 fieldwork testing tabs |
| Document Portal | Document upload and review |
| Reports | Reports for this specific audit |
| Post-Audit | Follow-ups, exit conference, lessons learned, quality review |

### Post-Audit (`/post-audit`)

Captures activities after the audit report is finalized:

- **Audit Review** — Summary of findings by severity, overall assessment
- **Scope & Timeline** — Scope agreement sign-offs review
- **Follow-Up Tracker** — Track each recommendation's implementation status (Open → In Progress → Implemented → Verified)
- **Exit Conference** — Document the formal exit meeting with LGA officials
- **Lessons Learned** — Log institutional knowledge for future audits (categorized: Process Improvement, Risk Management, Resource Allocation, etc.)
- **Quality Review** — Star-based rating of audit quality across dimensions (Planning Quality, Fieldwork Quality, Reporting Quality, Team Performance)

### Scope Agreement (`/scope-agreement`)

A formal table of audit scope areas with:

- Area name and description
- Timeline (in weeks)
- Expectations from LGA
- Dual sign-off (Auditor sign-off + LGA sign-off with timestamps)
- LGA can add comments or request changes before signing
  Status flow: Draft → Pending LGA → Changes Requested → Fully Approved

### Document Portal (`/document-portal`)

Centralized document management:

- Filter by Mandate, LGA, and Status
- Status flow: Pending → Uploaded → Approved / Rejected
- Rejected documents show a rejection reason
- Approved documents can be previewed in-browser via a document preview modal
- LGAs only see their own documents; Leads/Supervisors/AG see across LGAs

---

## 7. Demo Test Accounts

Use `password123` as the password for **all accounts**.

### Primary Accounts (Recommended for Demo)

| Role                  | Email                         | Name                     | Zone/LGA          |
| :-------------------- | :---------------------------- | :----------------------- | :---------------- |
| System Admin          | `sysadmin@lasg.gov.ng`        | Engr. Babatunde Fashola  | Platform-wide     |
| State Auditor General | `ag@lasg.gov.ng`              | Hon. Adebayo Oluwaseun   | State-wide        |
| Audit Supervisor      | `sup.ikeja@lasg.gov.ng`       | Mrs. Folashade Adekunle  | Ikeja Zone        |
| Audit Supervisor      | `sup.lagos@lasg.gov.ng`       | Mr. Chukwuemeka Okafor   | Lagos Island Zone |
| Audit Supervisor      | `sup.badagry@lasg.gov.ng`     | Mrs. Oluwabunmi Akintola | Badagry Zone      |
| Audit Lead            | `lead.ogunjobi@lasg.gov.ng`   | Mr. Adewale Ogunjobi     | Mushin LGA        |
| Audit Lead            | `lead.bakare@lasg.gov.ng`     | Mrs. Adetola Bakare      | Unassigned        |
| Team Auditor          | `auditor.ige@lasg.gov.ng`     | Miss Oluwadamilola Ige   | Mushin LGA        |
| Team Auditor          | `auditor.nwankwo@lasg.gov.ng` | Mr. Emeka Nwankwo        | Agege LGA         |
| Head of LGA           | `hlga.ikeja@lasg.gov.ng`      | Dr. Mojeed Balogun       | Ikeja LGA         |
| Head of LGA           | `hlga.lagos@lasg.gov.ng`      | Hon. Prince Tijani Olusi | Lagos Island LGA  |

### All Supervisors

| Email                     | Zone         |
| :------------------------ | :----------- |
| `sup.ikeja@lasg.gov.ng`   | Ikeja        |
| `sup.lagos@lasg.gov.ng`   | Lagos Island |
| `sup.ikorodu@lasg.gov.ng` | Ikorodu      |
| `sup.badagry@lasg.gov.ng` | Badagry      |
| `sup.epe@lasg.gov.ng`     | Epe          |

### All Audit Leads

| Email                        | Name                   |
| :--------------------------- | :--------------------- |
| `lead.ogunjobi@lasg.gov.ng`  | Mr. Adewale Ogunjobi   |
| `lead.bakare@lasg.gov.ng`    | Mrs. Adetola Bakare    |
| `lead.onyekachi@lasg.gov.ng` | Mr. Chinedu Onyekachi  |
| `lead.adeleke@lasg.gov.ng`   | Mrs. Funmilayo Adeleke |
| `lead.salami@lasg.gov.ng`    | Mr. Babatunde Salami   |

### All Team Auditors

| Email                           | Name                   | LGA            |
| :------------------------------ | :--------------------- | :------------- |
| `auditor.ige@lasg.gov.ng`       | Miss Oluwadamilola Ige | Mushin         |
| `auditor.nwankwo@lasg.gov.ng`   | Mr. Emeka Nwankwo      | Agege/Ikeja    |
| `auditor.mohammed@lasg.gov.ng`  | Mrs. Aisha Mohammed    | Badagry        |
| `auditor.eze@lasg.gov.ng`       | Mr. Tochukwu Eze       | Eti-Osa        |
| `auditor.adesanya@lasg.gov.ng`  | Miss Bukola Adesanya   | Alimosho       |
| `auditor.fashola@lasg.gov.ng`   | Mr. Olumide Fashola    | Kosofe         |
| `auditor.adichie@lasg.gov.ng`   | Mrs. Ngozi Adichie     | Lagos Mainland |
| `auditor.abdullahi@lasg.gov.ng` | Mr. Yusuf Abdullahi    | Ikorodu        |
| `auditor.obi@lasg.gov.ng`       | Miss Chisom Obi        | Surulere       |
| `auditor.adeyemi@lasg.gov.ng`   | Mr. Seun Adeyemi       | Badagry        |

---

## Quick-Reference: Who Can Do What

| Action                      | Sys Admin | AG  | Supervisor | Lead | Auditor | HLGA |
| :-------------------------- | :-------: | :-: | :--------: | :--: | :-----: | :--: |
| Create Mandate              |           | ✅  |            |      |         |      |
| Publish Mandate             |           | ✅  |            |      |         |      |
| Accept Mandate              |           |     |            |      |         |  ✅  |
| Assign Supervisors to Zones |           | ✅  |            |      |         |      |
| Assign Lead to LGA          |           | ✅  |     ✅     |      |         |      |
| Send Assignment Invitation  |           |     |     ✅     |  ✅  |         |      |
| Accept Invitation (COI)     |           |     |            |  ✅  |   ✅    |      |
| Pre-Audit / Letters         |           |     |     ✅     |  ✅  |         |      |
| Risk Matrix & Planning      |           |     |            |  ✅  |         |      |
| Fieldwork Testing           |           |     |            |  ✅  |   ✅    |      |
| Upload Workpapers           |           |     |            |      |   ✅    |      |
| Approve Workpapers          |           |     |     ✅     |  ✅  |         |      |
| Submit LGA Documents        |           |     |            |      |         |  ✅  |
| Approve LGA Documents       |           |     |     ✅     |  ✅  |         |      |
| Create Audit Report         |           |     |            |  ✅  |         |      |
| Review/Approve Report       |           |     |     ✅     |      |         |      |
| Management Response         |           |     |            |      |         |  ✅  |
| Final Report Approval       |           | ✅  |            |      |         |      |
| Post-Audit / Quality Review |           |     |     ✅     |  ✅  |         |      |
| User Management             |    ✅     |     |            |      |         |      |
| Audit Trail                 |    ✅     |     |            |      |         |      |
| Platform Settings           |    ✅     |     |            |      |         |      |
| View Regulations            |    ✅     | ✅  |     ✅     |  ✅  |   ✅    |  ✅  |
| AI Legal Assistant          |    ✅     | ✅  |     ✅     |  ✅  |   ✅    |  ✅  |

---

_Last updated: March 2026 | LASG Office of the Auditor-General for Local Governments_

Use `password123` for all accounts.

| Role                 | Email                         | Name                  | Context                                      |
| :------------------- | :---------------------------- | :-------------------- | :------------------------------------------- |
| **System Admin**     | `admin@lasg.gov.ng`           | System Admin          | Platform configuration, user management.     |
| **Auditor General**  | `ag@lasg.gov.ng`              | State Auditor General | Strategic oversight, final mandate approval. |
| **Audit Supervisor** | `sup.ikeja@lasg.gov.ng`       | Sarah Connor          | Zone manager, review & approval.             |
| **Audit Lead**       | `lead.ogunjobi@lasg.gov.ng`   | Tunde Ogunjobi        | Engagement manager, planning & reporting.    |
| **Team Auditor**     | `auditor.adebayo@lasg.gov.ng` | Bolu Adebayo          | Fieldwork execution, detailed testing.       |
| **Head of LGA**      | `hlga.ikeja@lasg.gov.ng`      | Hon. Chairman         | Auditee interface, document provision.       |

---

## End-to-End Workflow: Statutory Audit Cycle

### Phase 1: Mandate & Strategy (System Admin & Auditor General)

**Actor:** `admin@lasg.gov.ng`

1.  **Platform Configuration**:
    - Go to **Platform Settings** > Verify **Audit Year** is set to "2025".
    - Go to **User Management** > Click **Add User** > Create a new "Team Auditor" named "Test User" (`test.user@lasg.gov.ng`).

**Actor:** `ag@lasg.gov.ng` 2. **Create Mandate**:
_ Go to **Mandates** > **New Mandate**.
_ **Title:** "2025 Statutory Audit of Ikeja LGA".
_ **Type:** Statutory.
_ **Start Date:** Today's date.
_ **End Date:** 3 months from now.
_ **Description:** "Annual statutory audit of financial statements."
_ **Save Draft**. 3. **Publish Mandate**:
_ Locate the draft mandate.
_ Click **Publish** (Paper Airplane icon).
_ **Automation Check:** A notification should be sent to the Head of LGA (Ikeja).

---

### Phase 2: Engagement Setup & Planning (Audit Supervisor & Lead)

**Actor:** `sup.ikeja@lasg.gov.ng`

1.  **Assign Lead**:
    - Go to **Mandates** > Find "2025 Statutory Audit of Ikeja LGA" > Click **Assign Lead**.
    - Select `Tunde Ogunjobi`.
    - **Automation Check:** Auditor `lead.ogunjobi` receives an assignment notification.

**Actor:** `lead.ogunjobi@lasg.gov.ng`

1.  **Accept Assignment**:
    - Dashboard > **Assignments** > Click **Accept** on the new mandate.
2.  **Form Team**:
    - Go to **Build Team** (Sidebar) or **Audit Detail > Overview > Audit Team**.
    - Add `Bolu Adebayo` (`auditor.adebayo`) as a Team Member.
    - **Messaging System Test:** Open the Messaging Widget (Bubble icon, bottom right). Select `Bolu Adebayo` and send: "Welcome to the Ikeja Audit team."

---

### Phase 3: Pre-Audit & Risk Assessment (Audit Lead)

**Actor:** `lead.ogunjobi@lasg.gov.ng`

1.  **Questionnaire (New Feature Test)**:
    - Go to **My Audits** > Select Audit > **Questionnaire** Tab.
    - **Test Textarea Width:** Observe that textareas assume full width.
    - **Test Input:** Answer Question 1 ("Organizational Structure"). Type > 100 words (use lorem ipsum).
    - **Test Validation:** Note the word count indicator changing color (Red -> Green).
    - **Test Save:** Click **Save Response**.
    - **Visual Check:** The textarea should disappear and be replaced by a green "Saved" panel with the text.
    - **Test Edit:** Click **Edit** on the saved panel. Modify text. Click **Save Response** again.
    - **Test Delete:** Click **Delete**. Confirm the response is removed and textarea reappears.
    - **Bulk Save:** Answer 3 questions > Click **Save All Responses** at the top.

2.  **Risk Assessment**:
    - Go to **Planning** Tab > **Risk Assessment**.
    - **Add Risk Matrix**:
      - **Risk:** "Payroll Fraud".
      - **Impact:** High (5).
      - **Likelihood:** Medium (3).
      - **Control:** "Biometric verification".
    - **Automation Check:** Risk Score is calculated (15 - High).

3.  **Scope Agreement**:
    - Go to **Planning** Tab > **Scope Agreement**.
    - Add a scope item: "Review of 2024 Project files".
    - Click **Sign Off Scope** > Sign as Auditor.

---

### Phase 4: Fieldwork Execution (Team Auditor)

**Actor:** `auditor.adebayo@lasg.gov.ng`

1.  **Execute Procedures**:
    - Go to **My Tasks** > Select Audit > **Fieldwork** Tab.
    - **Work Programme**: Check off "Review Cash Book" status to "In Progress".
2.  **Testing**:
    - **Control Tests**: Click **Add Test**.
      - **Control:** "Payment Vouchers signed by Chairman".
      - **Sample Size:** 25.
      - **Exceptions:** 2.
      - **Conclusion:** "Effective".
    - **Substantive Tests**: Click **Add Test**.
      - **Procedure:** "Physical verification of generator".
      - **Result:** "Asset located but currently faulty".
3.  **Raise Finding**:
    - Go to **Audit Trail** / **Findings**.
    - Log a Finding: "Faulty Generator purchased in 2024".
    - **Severity:** Medium.

---

### Phase 5: Reporting & Review (Supervisor & AG)

**Actor:** `lead.ogunjobi@lasg.gov.ng`

1.  **Draft Report**:
    - Go to **Reporting** Tab.
    - Click **Generate Draft Report**.
    - Edit Executive Summary.
    - **Submit for Review**.

**Actor:** `sup.ikeja@lasg.gov.ng`

1.  **Review Report**:
    - Go to **Zone Audits** > Select Audit > **Reporting** Tab.
    - Examine Draft.
    - **Action:** Click **Approve Report**.

**Actor:** `ag@lasg.gov.ng`

1.  **Final Approval**:
    - Go to **All Engagements** > Select Audit.
    - **Dashboard Overview**: Check the "Audit Progress" chart.
    - Go to **Reporting** Tab > **Sign Off Audit**.
    - **Automation Check:** Status changes to "Completed".

---

## Specific Feature Tests

### 1. Messaging Widget

- **Role:** Any.
- **Action:** Open widget (Shift+M or click icon).
- **Test:**
  - Search for a user.
  - Send a message.
  - Check **Unread Counter** on the recipient's dashboard (requires logging in as recipient).

### 2. Notifications System

- **Trigger:** Deadline approaching (simulated via `timelineLogic`).
- **Action:**
  - Log in as Audit Lead.
  - Check **Bell Icon** (Top Right).
  - Click a notification to navigate to the relevant context.
  - Click **Mark all as read**.

### 3. Professional Textarea (UI Component)

- **Location:** Questionnaire, Reporting, Findings.
- **Tests:**
  - **Focus State:** Click textarea -> Green accent bar appears at top.
  - **Typing:** "Typing..." dot pulses green in bottom status bar.
  - **Limits:** Type below `minWords` -> Word count is Red. Type above -> Word count is Green.
  - **Resize:** Drag handle -> Component resizes smoothly.

### 4. Document Management

- **Role:** Head of LGA.
- **Action:**
  - Go to **Audits** > **Documents** Tab.
  - **Upload:** "2024 Cash Book.xlsx".
- **Role:** Audit Lead.
- **Action:**
  - Go to **Documents** Tab.
  - **Preview:** Click the eye icon.
  - **Review:** Click checkmark to "Accept" the document as valid evidence.

---

## Troubleshooting & Reset

To reset the demo data:

1.  Clear Local Storage: `F12` > Application > Local Storage > Clear All.
2.  Refresh the page. The app will re-seed from `src/mock/data.ts`.
