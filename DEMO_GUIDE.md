# Comprehensive Feature Testing & Demo Guide

This guide provides a complete walkthrough of the LASG Audit Automation Platform, designed to test every feature, workflow, and automation available. Follow the steps sequentially to simulate a full audit lifecycle.

---

##  Test Accounts & Credentials

Use `password123` for all accounts.

| Role | Email | Name | Context |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@lasg.gov.ng` | System Admin | Platform configuration, user management. |
| **Auditor General** | `ag@lasg.gov.ng` | State Auditor General | Strategic oversight, final mandate approval. |
| **Audit Supervisor** | `sup.ikeja@lasg.gov.ng` | Sarah Connor | Zone manager, review & approval. |
| **Audit Lead** | `lead.ogunjobi@lasg.gov.ng` | Tunde Ogunjobi | Engagement manager, planning & reporting. |
| **Team Auditor** | `auditor.adebayo@lasg.gov.ng` | Bolu Adebayo | Fieldwork execution, detailed testing. |
| **Head of LGA** | `hlga.ikeja@lasg.gov.ng` | Hon. Chairman | Auditee interface, document provision. |

---

##  End-to-End Workflow: Statutory Audit Cycle

### Phase 1: Mandate & Strategy (System Admin & Auditor General)

**Actor:** `admin@lasg.gov.ng`
1.  **Platform Configuration**:
    *   Go to **Platform Settings** > Verify **Audit Year** is set to "2025".
    *   Go to **User Management** > Click **Add User** > Create a new "Team Auditor" named "Test User" (`test.user@lasg.gov.ng`).

**Actor:** `ag@lasg.gov.ng`
2.  **Create Mandate**:
    *   Go to **Mandates** > **New Mandate**.
    *   **Title:** "2025 Statutory Audit of Ikeja LGA".
    *   **Type:** Statutory.
    *   **Start Date:** Today's date.
    *   **End Date:** 3 months from now.
    *   **Description:** "Annual statutory audit of financial statements."
    *   **Save Draft**.
3.  **Publish Mandate**:
    *   Locate the draft mandate.
    *   Click **Publish** (Paper Airplane icon).
    *   **Automation Check:** A notification should be sent to the Head of LGA (Ikeja).

---

### Phase 2: Engagement Setup & Planning (Audit Supervisor & Lead)

**Actor:** `sup.ikeja@lasg.gov.ng`
1.  **Assign Lead**:
    *   Go to **Mandates** > Find "2025 Statutory Audit of Ikeja LGA" > Click **Assign Lead**.
    *   Select `Tunde Ogunjobi`.
    *   **Automation Check:** Auditor `lead.ogunjobi` receives an assignment notification.

**Actor:** `lead.ogunjobi@lasg.gov.ng`
1.  **Accept Assignment**:
    *   Dashboard > **Assignments** > Click **Accept** on the new mandate.
2.  **Form Team**:
    *   Go to **Build Team** (Sidebar) or **Audit Detail > Overview > Audit Team**.
    *   Add `Bolu Adebayo` (`auditor.adebayo`) as a Team Member.
    *   **Messaging System Test:** Open the Messaging Widget (Bubble icon, bottom right). Select `Bolu Adebayo` and send: "Welcome to the Ikeja Audit team."

---

### Phase 3: Pre-Audit & Risk Assessment (Audit Lead)

**Actor:** `lead.ogunjobi@lasg.gov.ng`
1.  **Questionnaire (New Feature Test)**:
    *   Go to **My Audits** > Select Audit > **Questionnaire** Tab.
    *   **Test Textarea Width:** Observe that textareas assume full width.
    *   **Test Input:** Answer Question 1 ("Organizational Structure"). Type > 100 words (use lorem ipsum).
    *   **Test Validation:** Note the word count indicator changing color (Red -> Green).
    *   **Test Save:** Click **Save Response**.
    *   **Visual Check:** The textarea should disappear and be replaced by a green "Saved" panel with the text.
    *   **Test Edit:** Click **Edit** on the saved panel. Modify text. Click **Save Response** again.
    *   **Test Delete:** Click **Delete**. Confirm the response is removed and textarea reappears.
    *   **Bulk Save:** Answer 3 questions > Click **Save All Responses** at the top.

2.  **Risk Assessment**:
    *   Go to **Planning** Tab > **Risk Assessment**.
    *   **Add Risk Matrix**:
        *   **Risk:** "Payroll Fraud".
        *   **Impact:** High (5).
        *   **Likelihood:** Medium (3).
        *   **Control:** "Biometric verification".
    *   **Automation Check:** Risk Score is calculated (15 - High).

3.  **Scope Agreement**:
    *   Go to **Planning** Tab > **Scope Agreement**.
    *   Add a scope item: "Review of 2024 Project files".
    *   Click **Sign Off Scope** > Sign as Auditor.

---

### Phase 4: Fieldwork Execution (Team Auditor)

**Actor:** `auditor.adebayo@lasg.gov.ng`
1.  **Execute Procedures**:
    *   Go to **My Tasks** > Select Audit > **Fieldwork** Tab.
    *   **Work Programme**: Check off "Review Cash Book" status to "In Progress".
2.  **Testing**:
    *   **Control Tests**: Click **Add Test**.
        *   **Control:** "Payment Vouchers signed by Chairman".
        *   **Sample Size:** 25.
        *   **Exceptions:** 2.
        *   **Conclusion:** "Effective".
    *   **Substantive Tests**: Click **Add Test**.
        *   **Procedure:** "Physical verification of generator".
        *   **Result:** "Asset located but currently faulty".
3.  **Raise Finding**:
    *   Go to **Audit Trail** / **Findings**.
    *   Log a Finding: "Faulty Generator purchased in 2024".
    *   **Severity:** Medium.

---

### Phase 5: Reporting & Review (Supervisor & AG)

**Actor:** `lead.ogunjobi@lasg.gov.ng`
1.  **Draft Report**:
    *   Go to **Reporting** Tab.
    *   Click **Generate Draft Report**.
    *   Edit Executive Summary.
    *   **Submit for Review**.

**Actor:** `sup.ikeja@lasg.gov.ng`
1.  **Review Report**:
    *   Go to **Zone Audits** > Select Audit > **Reporting** Tab.
    *   Examine Draft.
    *   **Action:** Click **Approve Report**.

**Actor:** `ag@lasg.gov.ng`
1.  **Final Approval**:
    *   Go to **All Engagements** > Select Audit.
    *   **Dashboard Overview**: Check the "Audit Progress" chart.
    *   Go to **Reporting** Tab > **Sign Off Audit**.
    *   **Automation Check:** Status changes to "Completed".

---

##  Specific Feature Tests

### 1. Messaging Widget
*   **Role:** Any.
*   **Action:** Open widget (Shift+M or click icon).
*   **Test:**
    *   Search for a user.
    *   Send a message.
    *   Check **Unread Counter** on the recipient's dashboard (requires logging in as recipient).

### 2. Notifications System
*   **Trigger:** Deadline approaching (simulated via `timelineLogic`).
*   **Action:**
    *   Log in as Audit Lead.
    *   Check **Bell Icon** (Top Right).
    *   Click a notification to navigate to the relevant context.
    *   Click **Mark all as read**.

### 3. Professional Textarea (UI Component)
*   **Location:** Questionnaire, Reporting, Findings.
*   **Tests:**
    *   **Focus State:** Click textarea -> Green accent bar appears at top.
    *   **Typing:** "Typing..." dot pulses green in bottom status bar.
    *   **Limits:** Type below `minWords` -> Word count is Red. Type above -> Word count is Green.
    *   **Resize:** Drag handle -> Component resizes smoothly.

### 4. Document Management
*   **Role:** Head of LGA.
*   **Action:**
    *   Go to **Audits** > **Documents** Tab.
    *   **Upload:** "2024 Cash Book.xlsx".
*   **Role:** Audit Lead.
*   **Action:**
    *   Go to **Documents** Tab.
    *   **Preview:** Click the eye icon.
    *   **Review:** Click checkmark to "Accept" the document as valid evidence.

---

##  Troubleshooting & Reset
To reset the demo data:
1.  Clear Local Storage: `F12` > Application > Local Storage > Clear All.
2.  Refresh the page. The app will re-seed from `src/mock/data.ts`.

