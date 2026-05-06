# Backend Endpoints Roadmap

Base URL: `/api/v1`

This roadmap is ordered by the sequence the backend should be created. The goal is to establish the platform foundation first, then layer each audit workflow on top of the preceding phase.

## Role Legend

```txt
SYSTEM_ADMIN              Platform administrator
STATE_AUDITOR_GENERAL    Auditor-General / AG
AUDIT_SUPERVISOR         Zone-level supervisor
AUDIT_LEAD               Engagement lead
TEAM_AUDITOR             Execution staff
HEAD_OF_LOCAL_GOVERNMENT HoLG / external council stakeholder
PUBLIC                   Unauthenticated user
AUTHENTICATED            Any signed-in platform user
SYSTEM                   Server-side workflow action
```

Role checks should be enforced server-side on every protected endpoint, even when the frontend already hides the route or action.

## Phase 1: Backend Foundation, Auth, Users, and Geography

Build this phase first. These endpoints support authentication, role checks, master data, and the first server-backed UI integration.

### Auth

Role access: `PUBLIC` for login and password reset request. `AUTHENTICATED` for `/auth/me`, password change, and session actions.

```txt
POST   /auth/login
GET    /auth/me
POST  /auth/reset-password
POST /auth/new-password
```

### Users and Roles

Role access: `SYSTEM_ADMIN`. `STATE_AUDITOR_GENERAL` may read users for reporting/signature context. Password self-service is handled under Auth.

```txt
GET    /users
POST   /users
GET    /users/:id
PUT    /users/:id
PATCH  /users/:id/status
PATCH  /users/:id/password
DELETE /users/:id

GET    /roles
```

### Zones and Councils

Role access: `STATE_AUDITOR_GENERAL` and `SYSTEM_ADMIN` for writes. `AUDIT_SUPERVISOR`, `AUDIT_LEAD`, and `TEAM_AUDITOR` can read scoped zones/councils. `HEAD_OF_LOCAL_GOVERNMENT` can read own council context.

```txt
GET    /zones
GET    /zones/:id
GET    /zones/:id/councils
PATCH  /zones/:id/supervisors

GET    /councils
GET    /councils/:id
PUT    /councils/:id
```

### Activity

Role access: `SYSTEM_ADMIN` and `STATE_AUDITOR_GENERAL`.

```txt
GET    /activity
GET    /activity/:id
```

## Phase 2: Mandates and Audit Lifecycle

Create the core audit workflow backbone after users, roles, zones, and councils are available.

### Mandates

Role access: `STATE_AUDITOR_GENERAL` creates, edits, publishes, and monitors mandates. `HEAD_OF_LOCAL_GOVERNMENT` accepts mandates for own council. `AUDIT_SUPERVISOR` and `AUDIT_LEAD` can read relevant mandates. `SYSTEM_ADMIN` may read for support/activity context.

```txt
GET    /mandates
POST   /mandates
GET    /mandates/:id
PUT    /mandates/:id
DELETE /mandates/:id

PATCH  /mandates/:id/publish
PATCH  /mandates/:id/accept
GET    /mandates/:id/councils
GET    /mandates/:id/compliance
```

### Audits

Role access: `STATE_AUDITOR_GENERAL`, `AUDIT_SUPERVISOR`, and `AUDIT_LEAD` manage audits within authority. `TEAM_AUDITOR` reads assigned audits. `HEAD_OF_LOCAL_GOVERNMENT` reads own council audit status. `SYSTEM_ADMIN` reads for support/activity context.

```txt
GET    /audits
POST   /audits
GET    /audits/:id
PUT    /audits/:id
DELETE /audits/:id

PATCH  /audits/:id/status
PATCH  /audits/:id/progress
PUT    /audits/:id/timelines
POST   /audits/:id/timelines/propose
PATCH  /audits/:id/timelines/approve
```

### Stage Approvals

Role access: `AUDIT_LEAD` submits stage approvals. `AUDIT_SUPERVISOR` reviews pre-audit, planning, fieldwork, reporting, and post-audit stages. `STATE_AUDITOR_GENERAL` reviews final/reporting/outcome gates where required. `TEAM_AUDITOR` can read assigned audit approval state.

```txt
GET    /audits/:auditId/stage-approvals
POST   /audits/:auditId/stage-approvals
PATCH  /stage-approvals/:id/review
```

## Phase 3: Notifications, Assignments, and Tasks

Build notifications early because later workflow actions depend on them.

### Notifications

Role access: `AUTHENTICATED` for own notifications. `SYSTEM` creates workflow notifications internally.

```txt
GET    /notifications
GET    /notifications/unread-count
PATCH  /notifications/:id/read
PATCH  /notifications/read-all
DELETE /notifications/:id
```

### Assignments

Role access: `AUDIT_SUPERVISOR` assigns leads and audit staff at zone level. `AUDIT_LEAD` assigns team auditors within own audit. `TEAM_AUDITOR` accepts/declines own invitations. `STATE_AUDITOR_GENERAL` can read assignment coverage.

```txt
GET    /assignments
POST   /assignments
GET    /assignments/:id
PATCH  /assignments/:id/accept
PATCH  /assignments/:id/decline
DELETE /assignments/:id
```

### Tasks

Role access: `AUDIT_SUPERVISOR` and `AUDIT_LEAD` create/assign tasks. `TEAM_AUDITOR` updates own task status. `STATE_AUDITOR_GENERAL` can read task progress. `HEAD_OF_LOCAL_GOVERNMENT` does not manage internal audit tasks.

```txt
GET    /tasks
POST   /tasks
GET    /tasks/:id
PUT    /tasks/:id
PATCH  /tasks/:id/status
PATCH  /tasks/:id/assign
DELETE /tasks/:id
```

## Phase 4: Pre-Audit

This phase covers engagement setup, meetings, briefings, team readiness, and independence declarations.

### Pre-Audit Overview

Role access: `AUDIT_SUPERVISOR` and `AUDIT_LEAD`. `TEAM_AUDITOR` can read assigned pre-audit readiness where relevant. `STATE_AUDITOR_GENERAL` can read oversight status.

```txt
GET    /audits/:auditId/pre-audit
PUT    /audits/:auditId/pre-audit
```

### Engagement Letters

Role access: `AUDIT_SUPERVISOR` and `AUDIT_LEAD` create/send letters. `HEAD_OF_LOCAL_GOVERNMENT` acknowledges letters for own council. `STATE_AUDITOR_GENERAL` can read status.

```txt
POST   /audits/:auditId/engagement-letters
GET    /audits/:auditId/engagement-letters
PATCH  /engagement-letters/:id/send
PATCH  /engagement-letters/:id/acknowledge
```

### Entry Meetings and Briefings

Role access: `AUDIT_SUPERVISOR` and `AUDIT_LEAD` create/update records. `TEAM_AUDITOR` can read assigned audit records. `HEAD_OF_LOCAL_GOVERNMENT` can read/participate where the meeting concerns own council.

```txt
POST   /audits/:auditId/entry-meetings
GET    /audits/:auditId/entry-meetings
PUT    /entry-meetings/:id
DELETE /entry-meetings/:id

POST   /audits/:auditId/briefings
GET    /audits/:auditId/briefings
```

### Independence Declarations

Role access: `AUDIT_SUPERVISOR`, `AUDIT_LEAD`, and `TEAM_AUDITOR` submit own declarations. `AUDIT_SUPERVISOR` and `AUDIT_LEAD` can read declaration completion for assigned audits.

```txt
POST   /audits/:auditId/independence-declarations
GET    /audits/:auditId/independence-declarations
PATCH  /independence-declarations/:id/submit
```

## Phase 5: Document Portal and Questionnaire

Implement document submission before deep planning and fieldwork because later requisitions and evidence depend on document storage.

### Documents

Role access: `HEAD_OF_LOCAL_GOVERNMENT` uploads/resubmits own council documents. `AUDIT_LEAD` and `AUDIT_SUPERVISOR` review/approve/reject documents. `STATE_AUDITOR_GENERAL` can read document compliance state. `TEAM_AUDITOR` can read documents linked to assigned procedures.

```txt
GET    /documents
POST   /documents/upload
GET    /documents/:id
GET    /documents/:id/download
DELETE /documents/:id

GET    /councils/:councilId/documents
GET    /mandates/:mandateId/documents
PATCH  /documents/:id/review
PATCH  /documents/:id/reject
POST   /documents/:id/resubmit
```

### Questionnaire

Role access: `HEAD_OF_LOCAL_GOVERNMENT` submits responses for own council. `AUDIT_LEAD` and `AUDIT_SUPERVISOR` read/review responses. `SYSTEM_ADMIN` manages question templates. `STATE_AUDITOR_GENERAL` can read oversight status.

```txt
GET    /questionnaire/questions
POST   /questionnaire/questions
PUT    /questionnaire/questions/:id
DELETE /questionnaire/questions/:id

GET    /audits/:auditId/questionnaire/responses
POST   /audits/:auditId/questionnaire/responses
PUT    /questionnaire/responses/:id
DELETE /questionnaire/responses/:id
```

## Phase 6: Audit Planning

This phase covers entity understanding, preliminary analytics, risk assessment, materiality, and audit programmes.

### Entity Profile

Role access: `AUDIT_LEAD` creates/updates. `AUDIT_SUPERVISOR` reviews. `TEAM_AUDITOR` can read assigned audit context. `STATE_AUDITOR_GENERAL` can read oversight context.

```txt
GET    /audits/:auditId/entity-profile
PUT    /audits/:auditId/entity-profile
```

### Preliminary Analytics

Role access: `AUDIT_LEAD` creates/updates analytics. `AUDIT_SUPERVISOR` reviews. `TEAM_AUDITOR` can read or contribute if assigned. `STATE_AUDITOR_GENERAL` can read oversight context.

```txt
GET    /audits/:auditId/preliminary-analytics
POST   /audits/:auditId/preliminary-analytics
PUT    /preliminary-analytics/:id
DELETE /preliminary-analytics/:id
```

### Risk Matrices

Role access: `AUDIT_LEAD` creates/updates. `AUDIT_SUPERVISOR` reviews and approves. `STATE_AUDITOR_GENERAL` can read risk oversight. `TEAM_AUDITOR` can read assigned audit risks.

```txt
GET    /audits/:auditId/risk-matrices
POST   /audits/:auditId/risk-matrices
PUT    /risk-matrices/:id
DELETE /risk-matrices/:id
```

### Materiality

Role access: `AUDIT_LEAD` prepares. `AUDIT_SUPERVISOR` reviews/approves planning materiality. `STATE_AUDITOR_GENERAL` can approve/lock final outcome materiality where required. `TEAM_AUDITOR` read-only when assigned.

```txt
GET    /audits/:auditId/materiality
POST   /audits/:auditId/materiality
PUT    /materiality/:id
PATCH  /materiality/:id/approve
PATCH  /materiality/:id/lock
```

### Programme Templates

Role access: `SYSTEM_ADMIN`, `STATE_AUDITOR_GENERAL`, `AUDIT_SUPERVISOR`, and `AUDIT_LEAD` can read. Template writes should be limited to `SYSTEM_ADMIN`, `STATE_AUDITOR_GENERAL`, and designated audit standards owners.

```txt
GET    /programme-templates
POST   /programme-templates
GET    /programme-templates/:id
PUT    /programme-templates/:id
DELETE /programme-templates/:id
```

### Audit Programmes

Role access: `AUDIT_LEAD` creates/submits programmes. `AUDIT_SUPERVISOR` approves or requests revision. `TEAM_AUDITOR` reads assigned procedures. `STATE_AUDITOR_GENERAL` can read programme status.

```txt
GET    /audits/:auditId/programmes
POST   /audits/:auditId/programmes
GET    /programmes/:id
PUT    /programmes/:id
DELETE /programmes/:id

PATCH  /programmes/:id/submit
PATCH  /programmes/:id/approve
PATCH  /programmes/:id/request-revision
```

### Programme Procedures

Role access: `AUDIT_LEAD` creates/assigns/updates procedures. `AUDIT_SUPERVISOR` reviews. `TEAM_AUDITOR` updates own assigned procedure status where allowed.

```txt
POST   /programmes/:id/procedures
PUT    /programme-procedures/:id
PATCH  /programme-procedures/:id/assign
PATCH  /programme-procedures/:id/status
DELETE /programme-procedures/:id
```

## Phase 7: Fieldwork

Create fieldwork in slices. Start with requisitions and procedure execution, then add exceptions, fraud flags, special modules, and workpapers.

### Requisitions

Role access: `AUDIT_LEAD` and `AUDIT_SUPERVISOR` issue/waive requisitions. `HEAD_OF_LOCAL_GOVERNMENT` receives/responds for own council. `TEAM_AUDITOR` reads requisitions linked to assigned procedures.

```txt
GET    /audits/:auditId/requisitions
POST   /audits/:auditId/requisitions
GET    /requisitions/:id
PUT    /requisitions/:id
PATCH  /requisitions/:id/issue
PATCH  /requisitions/:id/receive
PATCH  /requisitions/:id/waive
DELETE /requisitions/:id
```

### Procedure Execution

Role access: `TEAM_AUDITOR` and assigned `AUDIT_LEAD` execute assigned procedures. `AUDIT_LEAD` submits/reviews team work where applicable. `AUDIT_SUPERVISOR` reviews/clears. Evidence access is limited to assigned audit users.

```txt
GET    /audits/:auditId/procedure-executions
POST   /audits/:auditId/procedure-executions
GET    /procedure-executions/:id
PUT    /procedure-executions/:id
DELETE /procedure-executions/:id

PATCH  /procedure-executions/:id/start
PATCH  /procedure-executions/:id/submit
PATCH  /procedure-executions/:id/review
PATCH  /procedure-executions/:id/clear
PATCH  /procedure-executions/:id/conclusion

POST   /procedure-executions/:id/evidence
DELETE /procedure-evidence/:id

POST   /procedure-executions/:id/work-performed/generate
```

### Exceptions

Role access: `TEAM_AUDITOR` and `AUDIT_LEAD` raise exceptions. `AUDIT_LEAD` classifies initial handling. `AUDIT_SUPERVISOR` reviews/classifies/escalates. `STATE_AUDITOR_GENERAL` reads/escalates critical exceptions.

```txt
GET    /audits/:auditId/exceptions
POST   /audits/:auditId/exceptions
GET    /exceptions/:id
PUT    /exceptions/:id
PATCH  /exceptions/:id/classify
PATCH  /exceptions/:id/escalate
PATCH  /exceptions/:id/resolve
DELETE /exceptions/:id
```

### Fraud Flags

Role access: `TEAM_AUDITOR`, `AUDIT_LEAD`, and `AUDIT_SUPERVISOR` raise flags. `AUDIT_SUPERVISOR` escalates. `STATE_AUDITOR_GENERAL` owns critical fraud oversight and resolution approval.

```txt
GET    /audits/:auditId/fraud-flags
POST   /audits/:auditId/fraud-flags
GET    /fraud-flags/:id
PUT    /fraud-flags/:id
PATCH  /fraud-flags/:id/escalate
PATCH  /fraud-flags/:id/resolve
DELETE /fraud-flags/:id
```

### Special Fieldwork Modules

Role access: `TEAM_AUDITOR` and `AUDIT_LEAD` create/update assigned fieldwork records. `AUDIT_SUPERVISOR` reviews. `STATE_AUDITOR_GENERAL` can read oversight metrics and escalated issues.

```txt
GET    /audits/:auditId/bank-accounts
POST   /audits/:auditId/bank-accounts
PUT    /bank-accounts/:id
DELETE /bank-accounts/:id

GET    /audits/:auditId/contract-flags
POST   /audits/:auditId/contract-flags
PUT    /contract-flags/:id
DELETE /contract-flags/:id

GET    /audits/:auditId/vouching-checklists
POST   /audits/:auditId/vouching-checklists
PUT    /vouching-checklists/:id
DELETE /vouching-checklists/:id

GET    /audits/:auditId/site-verifications
POST   /audits/:auditId/site-verifications
PUT    /site-verifications/:id
DELETE /site-verifications/:id
```

### Fieldwork Completion

Role access: `AUDIT_LEAD` submits fieldwork memo. `AUDIT_SUPERVISOR` approves. `HEAD_OF_LOCAL_GOVERNMENT` acknowledges completion for own council. `STATE_AUDITOR_GENERAL` can read completion status.

```txt
GET    /audits/:auditId/fieldwork-memo
POST   /audits/:auditId/fieldwork-memo
PUT    /fieldwork-memos/:id
PATCH  /fieldwork-memos/:id/submit
PATCH  /fieldwork-memos/:id/approve
PATCH  /fieldwork-memos/:id/acknowledge
```

### Workpapers

Role access: `TEAM_AUDITOR` and `AUDIT_LEAD` create/submit workpapers for assigned audits. `AUDIT_SUPERVISOR` reviews/signs. `STATE_AUDITOR_GENERAL` can read approved workpapers.

```txt
GET    /workpapers
POST   /workpapers
GET    /workpapers/:id
PUT    /workpapers/:id
PATCH  /workpapers/:id/submit
PATCH  /workpapers/:id/review
PATCH  /workpapers/:id/sign
DELETE /workpapers/:id
```

## Phase 8: Reports and Post-Audit

Build reporting before audit outcomes because findings and approved reports feed the final compilation workspace.

### Reports

Role access: `AUDIT_LEAD` prepares/submits reports. `AUDIT_SUPERVISOR` reviews/approves or requests revision. `STATE_AUDITOR_GENERAL` signs final/consolidated reports and can generate/export. `HEAD_OF_LOCAL_GOVERNMENT` may provide management responses through controlled report/finding workflows.

```txt
GET    /reports
POST   /reports
GET    /reports/:id
PUT    /reports/:id
DELETE /reports/:id

PATCH  /reports/:id/submit
PATCH  /reports/:id/review
PATCH  /reports/:id/approve
PATCH  /reports/:id/request-revision

POST   /reports/:id/findings
PUT    /findings/:id
PATCH  /findings/:id/escalate-to-outcomes
DELETE /findings/:id

POST   /reports/generate
GET    /reports/:id/export
```

### Post-Audit Overview

Role access: `AUDIT_LEAD` prepares closure records. `AUDIT_SUPERVISOR` reviews. `STATE_AUDITOR_GENERAL` can read closure status. `HEAD_OF_LOCAL_GOVERNMENT` participates in follow-up and exit-conference items for own council.

```txt
GET    /audits/:auditId/post-audit
PUT    /audits/:auditId/post-audit
```

### Follow-Ups

Role access: `AUDIT_LEAD` creates follow-ups from findings. `HEAD_OF_LOCAL_GOVERNMENT` updates management response/implementation status for own council. `AUDIT_SUPERVISOR` verifies. `STATE_AUDITOR_GENERAL` reads overdue/unresolved follow-ups.

```txt
GET    /audits/:auditId/follow-ups
POST   /audits/:auditId/follow-ups
PUT    /follow-ups/:id
PATCH  /follow-ups/:id/verify
DELETE /follow-ups/:id
```

### Exit Conferences

Role access: `AUDIT_LEAD` records. `AUDIT_SUPERVISOR` reviews. `HEAD_OF_LOCAL_GOVERNMENT` participates/acknowledges own council conference records.

```txt
GET    /audits/:auditId/exit-conferences
POST   /audits/:auditId/exit-conferences
PUT    /exit-conferences/:id
DELETE /exit-conferences/:id
```

### Lessons Learned

Role access: `AUDIT_LEAD` and `AUDIT_SUPERVISOR` create/update. `TEAM_AUDITOR` may contribute assigned-audit lessons. `STATE_AUDITOR_GENERAL` can read aggregated lessons.

```txt
GET    /audits/:auditId/lessons-learned
POST   /audits/:auditId/lessons-learned
PUT    /lessons-learned/:id
DELETE /lessons-learned/:id
```

### Quality Reviews

Role access: `AUDIT_SUPERVISOR` creates quality review. `STATE_AUDITOR_GENERAL` can read and override/finalize where policy requires. `AUDIT_LEAD` read-only after review.

```txt
GET    /audits/:auditId/quality-reviews
POST   /audits/:auditId/quality-reviews
PUT    /quality-reviews/:id
DELETE /quality-reviews/:id
```

## Phase 9: Audit Outcomes and Compilation

This should come after reporting and post-audit foundations are stable. It depends on audits, users, documents, reports, findings, trial balances, signatures, and PDF generation.

### Audit Outcomes

Role access: `STATE_AUDITOR_GENERAL`, `AUDIT_SUPERVISOR`, and `AUDIT_LEAD`. Writes are scoped by stage: `AUDIT_LEAD` prepares, `AUDIT_SUPERVISOR` reviews/signs, `STATE_AUDITOR_GENERAL` approves/finalizes.

```txt
GET    /audit-outcomes
POST   /audit-outcomes
GET    /audit-outcomes/:id
PUT    /audit-outcomes/:id
DELETE /audit-outcomes/:id
```

### Trial Balances

Role access: `AUDIT_LEAD` uploads/prepares. `AUDIT_SUPERVISOR` reviews/approves. `STATE_AUDITOR_GENERAL` can read final trial balance status.

```txt
POST   /audit-outcomes/:id/trial-balances/upload
GET    /audit-outcomes/:id/trial-balances
PATCH  /trial-balances/:id/approve
DELETE /trial-balances/:id
```

### Outcome Materiality

Role access: `AUDIT_LEAD` prepares. `AUDIT_SUPERVISOR` reviews. `STATE_AUDITOR_GENERAL` locks final materiality. Locked materiality must not be editable by any role.

```txt
GET    /audit-outcomes/:id/materiality
PUT    /audit-outcomes/:id/materiality
PATCH  /audit-outcomes/:id/materiality/lock
```

### Statement of Responsibility

Role access: `HEAD_OF_LOCAL_GOVERNMENT` or council treasurer signs external responsibility where applicable. `AUDIT_LEAD` signs audit lead block. `AUDIT_SUPERVISOR` and `STATE_AUDITOR_GENERAL` can read.

```txt
GET    /audit-outcomes/:id/responsibility
PUT    /audit-outcomes/:id/responsibility
PATCH  /audit-outcomes/:id/responsibility/sign
```

### Audit Report Document

Role access: `AUDIT_LEAD` prepares/signs first. `AUDIT_SUPERVISOR` reviews/signs second. `STATE_AUDITOR_GENERAL` signs/finalizes third. Signature order must be enforced server-side.

```txt
GET    /audit-outcomes/:id/audit-report-document
PUT    /audit-outcomes/:id/audit-report-document
PATCH  /audit-report-documents/:id/sign
```

### Accounting Policies

Role access: `AUDIT_LEAD` prepares. `AUDIT_SUPERVISOR` approves. `STATE_AUDITOR_GENERAL` reads/finalizes as part of compilation.

```txt
GET    /audit-outcomes/:id/accounting-policies
PUT    /audit-outcomes/:id/accounting-policies
PATCH  /accounting-policies/:id/approve
```

### Financial Statements and LGA Packages

Role access: `AUDIT_LEAD` prepares per-LGA and consolidated statements. `AUDIT_SUPERVISOR` reviews. `STATE_AUDITOR_GENERAL` approves package inclusion/final output.

```txt
GET    /audit-outcomes/:id/financial-statements
PUT    /audit-outcomes/:id/financial-statements

GET    /audit-outcomes/:id/lga-packages
PUT    /audit-outcomes/:id/lga-packages/:packageId
```

### Compilation

Role access: `STATE_AUDITOR_GENERAL` generates and downloads final consolidated output. `AUDIT_SUPERVISOR` and `AUDIT_LEAD` can preview/status-check where authorized.

```txt
POST   /audit-outcomes/:id/compile
GET    /audit-outcomes/:id/compile/status
GET    /audit-outcomes/:id/compile/download
```

## Phase 10: Reference Libraries and Dashboard Read Models

These can be built after the write-heavy workflows. They are mostly public/read-heavy surfaces plus dashboard aggregation endpoints.

### Audit Procedures Library

Role access: `PUBLIC` and `AUTHENTICATED` can read. Writes limited to `SYSTEM_ADMIN`, `STATE_AUDITOR_GENERAL`, and designated audit standards owners.

```txt
GET    /audit-procedures
GET    /audit-procedures/:id
POST   /audit-procedures
PUT    /audit-procedures/:id
DELETE /audit-procedures/:id
```

### Regulations Library

Role access: `PUBLIC` and `AUTHENTICATED` can read. Writes limited to `SYSTEM_ADMIN`, `STATE_AUDITOR_GENERAL`, and designated compliance/legal content owners.

```txt
GET    /regulations
GET    /regulations/:id
POST   /regulations
PUT    /regulations/:id
DELETE /regulations/:id
```

### Dashboards

Role access: each role can access its own dashboard endpoint. `STATE_AUDITOR_GENERAL` can access AG oversight. `SYSTEM_ADMIN` can access system admin operational dashboard.

```txt
GET    /dashboard
GET    /dashboard/ag
GET    /dashboard/supervisor
GET    /dashboard/lead
GET    /dashboard/team-auditor
GET    /dashboard/holg
GET    /dashboard/system-admin
```
