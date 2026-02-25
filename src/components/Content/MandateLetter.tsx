import React from "react";
import { useAuditStore } from "../../store/useAuditStore";
import type { Notification } from "../../types";

interface MandateLetterProps {
  notification?: Notification;
  mandateId?: string;
}

const MandateLetter: React.FC<MandateLetterProps> = ({
  notification,
  mandateId: propMandateId,
}) => {
  const mandates = useAuditStore((state) => state.mandates);
  const mandateId = propMandateId || notification?.relatedEntityId;
  const mandate = mandates.find((m) => m.id === mandateId);

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const auditYear = mandate?.auditYear || new Date().getFullYear() - 1;
  const auditPeriod = `1 January – 31 December ${auditYear}`;

  // Ideally, we would fetch the specific LGA for the logged-in user or from the notification context
  // For this global mandate notification, we'll use a placeholder or generic term
  const recipientName = "[Insert Name]";
  const lgaName = "[Insert LGA Name]";

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "'Times New Roman', Times, serif",
        color: "#000",
        lineHeight: "1.6",
        backgroundColor: "#fff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        maxHeight: "600px",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2
          style={{
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: "1.2rem",
            marginBottom: "0.5rem",
          }}
        >
          LETTER OF ENGAGEMENT
        </h2>
        <h3
          style={{
            fontWeight: "bold",
            fontSize: "1.1rem",
            marginBottom: "0.5rem",
          }}
        >
          Audit of Local Government Areas in Lagos State
        </h3>
        <h4 style={{ fontWeight: "bold", fontSize: "1rem" }}>
          Office of the Auditor General for Local Governments
        </h4>
      </div>

      {/* Meta Info */}
      <div style={{ marginBottom: "2rem" }}>
        <p>
          <strong>To:</strong> The Chairman / Council of {lgaName} Local
          Government Area
        </p>
        <p>
          <strong>Reference No.:</strong> LASG/AUD/{auditYear}/001
        </p>
        <p>
          <strong>Date:</strong> {currentDate}
        </p>
        <p>
          <strong>Audit Period:</strong> {auditPeriod}
        </p>
      </div>

      {/* Salutation */}
      <p style={{ marginBottom: "1rem" }}>Dear {recipientName},</p>

      {/* Body Content */}
      <div style={{ fontSize: "0.95rem" }}>
        <h4 style={{ fontWeight: "bold", marginTop: "1.5rem" }}>
          1. Introduction
        </h4>
        <p>
          1. The Office of the Auditor General for Local Governments, Lagos
          State (the 'Office') is pleased to confirm its appointment as the
          statutory auditor for {lgaName} Local Government Area (the 'Local
          Government' or 'LGA') for the financial year ending 31st December{" "}
          {auditYear}. This letter sets out the terms and objectives of the
          audit engagement in accordance with applicable laws and professional
          standards.
        </p>
        <p>
          2. The purpose of this letter, together with any attached terms and
          conditions, is to define clearly the scope of the audit, the
          responsibilities of both parties, and the basis on which the Office
          will carry out its statutory functions.
        </p>
        <p>
          3. The Office is mandated under Section 7(6)(c) of the Constitution of
          the Federal Republic of Nigeria 1999 (as amended), the Lagos State
          Local Government Law (Cap L82, Laws of Lagos State), and all other
          applicable legislation to audit the accounts and financial operations
          of Local Government Areas in Lagos State. In discharging this mandate,
          the Office is bound by the ethical guidelines of the Institute of
          Chartered Accountants of Nigeria (ICAN) and the requirements of
          International Standards of Supreme Audit Institutions (ISSAIs) as
          adopted by the Office.
        </p>

        <h4 style={{ fontWeight: "bold", marginTop: "1.5rem" }}>
          2. Period of Engagement
        </h4>
        <p>
          4. This letter is effective from {currentDate} and covers the audit of
          accounts and financial statements for the financial year ending 31st
          December {auditYear}.
        </p>
        <p>
          5. Matters arising in respect of periods prior to the above date will
          be dealt with as appropriate, in line with the Office's existing
          records and prior audit files. The Office will not be responsible for
          audit conclusions relating to periods not covered by this engagement,
          unless otherwise agreed in writing.
        </p>

        <h4 style={{ fontWeight: "bold", marginTop: "1.5rem" }}>
          3. Scope of Audit Services
        </h4>
        <p>
          6. The audit will be conducted with the primary objective of
          expressing an independent opinion on whether the annual financial
          statements of the Local Government present a true and fair view of its
          financial position, performance, and cash flows, and comply with
          applicable accounting standards, statutes, and regulations.
        </p>
        <p>
          7. The scope of the audit shall include, but is not limited to:
          <br />
          (a) Examination and verification of the LGA's statutory financial
          statements, including the Statement of Financial Position, Statement
          of Comprehensive Income, and the Notes thereto;
          <br />
          (b) Evaluation of the adequacy of internal controls, financial
          management systems, and safeguarding of public funds and assets;
          <br />
          (c) Verification of revenue receipts, including statutory allocations
          from the Federation Account, State Joint Local Government Account
          (SJLGA), and internally generated revenue (IGR);
          <br />
          (d) Examination of expenditure records, procurement processes, and
          compliance with the Public Procurement Act, Lagos State Public Finance
          Management Law, and applicable guidelines;
          <br />
          (e) Review of payroll records, emoluments, pension contributions, and
          staff-related expenditures for accuracy and regularity;
          <br />
          (f) Assessment of compliance with relevant laws, regulations,
          financial instructions, and circulars issued by the State Ministry of
          Local Government and Community Affairs and other relevant authorities;
          <br />
          (g) Verification of capital projects, including examination of
          contract awards, payments, completion status, and value for money
          considerations;
          <br />
          (h) Reporting on significant weaknesses in accounting and internal
          control systems identified during the course of the audit.
        </p>

        <h4 style={{ fontWeight: "bold", marginTop: "1.5rem" }}>
          4. Responsibilities of the Office of the Auditor General
        </h4>
        <p>
          8. The Office will conduct the audit in accordance with the
          International Standards on Auditing (ISAs) as adopted in Nigeria, the
          ISSAIs, and applicable provisions of the Lagos State Local Government
          Law. Those standards require that the Office plans and performs the
          audit to obtain reasonable assurance that the financial statements are
          free of material misstatement, whether due to fraud or error.
        </p>
        <p>
          9. The Office will:
          <br />
          (a) Issue an independent audit report expressing an opinion on the
          annual financial statements of the Local Government;
          <br />
          (b) Communicate significant matters, including material weaknesses in
          internal controls, instances of non-compliance, and matters requiring
          management attention, through a formal Management Letter;
          <br />
          (c) Conduct audit fieldwork in a manner that minimises disruption to
          the normal operations of the LGA;
          <br />
          (d) Maintain the confidentiality of all information obtained during
          the course of the audit, except where disclosure is required by law or
          as part of reporting obligations to the Lagos State House of Assembly
          or other authorised bodies.
        </p>
        <p>
          10. An audit conducted in accordance with the relevant auditing
          standards involves examining, on a test basis, evidence supporting the
          amounts and disclosures in the financial statements, assessing the
          accounting principles applied, and evaluating the overall presentation
          of the financial statements. Because of the test nature and other
          inherent limitations of an audit, there is an unavoidable risk that
          some material misstatements may remain undiscovered.
        </p>
        <p>
          11. The Office will also perform value-for-money and compliance
          reviews as may be required by the terms of the relevant Lagos State
          legislation and the Office's annual audit plan. Any such findings will
          be communicated to the LGA management and the appropriate oversight
          authorities.
        </p>
        <p>
          12. The intended users of the audit report are the Lagos State House
          of Assembly, the State Government, the LGA Council, and the general
          public, consistent with the constitutional mandate of the Auditor
          General.
        </p>

        <h4 style={{ fontWeight: "bold", marginTop: "1.5rem" }}>
          5. Responsibilities of the Local Government
        </h4>
        <p>
          13. The Chairman and the management of the Local Government are
          responsible for:
          <br />
          (a) Maintaining proper books of account and financial records in
          accordance with the Lagos State Public Finance Management Law and
          applicable Financial Regulations;
          <br />
          (b) Preparing annual financial statements that give a true and fair
          view of the LGA's financial position and operations, in compliance
          with International Public Sector Accounting Standards (IPSAS) or such
          other standards as may be prescribed;
          <br />
          (c) Selecting and consistently applying appropriate accounting
          policies;
          <br />
          (d) Making reasonable and prudent judgements and estimates in the
          preparation of financial statements;
          <br />
          (e) Establishing and maintaining an effective system of internal
          controls to safeguard public assets and prevent and detect fraud,
          errors, and irregularities;
          <br />
          (f) Ensuring compliance with all applicable laws, financial
          instructions, and regulations governing the administration of public
          funds at the local government level.
        </p>
        <p>
          14. The management of the Local Government shall make available to the
          Office, as and when required, all accounting records, supporting
          documents, contracts, minutes of Council and committee meetings, bank
          statements, revenue receipts, payroll records, and all other
          information and explanations considered necessary by the Office for
          the performance of its statutory duties. The Office is entitled to
          require from the LGA's officers such information and explanations as
          it considers necessary, without restriction.
        </p>
        <p>
          15. The Local Government is responsible for ensuring that records held
          by third parties — including banks, contractors, agents, or any other
          external party — are made available to the Office upon request.
        </p>
        <p>
          16. As part of the audit process, the Office may request from
          management written representations confirming certain information and
          explanations provided during the audit. The provision of false,
          misleading, or incomplete information to the Office constitutes a
          serious breach of the law and may be subject to criminal sanction.
        </p>

        <h4 style={{ fontWeight: "bold", marginTop: "1.5rem" }}>
          6. Local Government Audit — Specific Requirements
        </h4>
        <p>
          17. In expressing the audit opinion, the Office is required to
          consider the following matters and to report on any in respect of
          which it is not satisfied:
          <br />
          (a) Whether the Local Government has maintained proper accounting
          records and that adequate financial returns have been received and
          verified from all departments, units, and project sites;
          <br />
          (b) Whether the financial statements are in agreement with the
          underlying accounting records and returns;
          <br />
          (c) Whether all information and explanations considered necessary for
          the purpose of the audit have been obtained and are satisfactory;
          <br />
          (d) Whether statutory deductions, including pension contributions (to
          the appropriate Pension Fund Administrator under the Contributory
          Pension Scheme), Pay-As-You-Earn (PAYE) taxes, and other statutory
          remittances, have been correctly computed and duly remitted to the
          relevant authorities;
          <br />
          (e) Whether revenue allocations received from the Federation Account
          and the State Joint Local Government Account have been properly
          accounted for and applied in accordance with the approved budget and
          relevant guidelines;
          <br />
          (f) Whether the information contained in the Chairman's report and any
          accompanying statements is consistent with the audited financial
          statements;
          <br />
          (g) Whether procurement of goods, works, and services has been
          conducted in compliance with the Public Procurement Act 2007 and Lagos
          State Public Procurement Agency guidelines.
        </p>
        <p>
          18. There are other matters that, depending on the circumstances, may
          need to be reported upon, including instances of significant fraud,
          theft, misappropriation of funds, abandonment of capital projects,
          breach of financial regulations, and failure to recover revenue due to
          the LGA.
        </p>
        <p>
          19. The Office has a professional and statutory duty to report if the
          financial statements do not comply, in any material respect, with
          applicable accounting standards or statutory requirements, unless in
          the Office's opinion the non-compliance is justified in the
          circumstances. Where such non-compliance is identified, the nature of
          the non-compliance and whether it is justified will be assessed
          accordingly.
        </p>

        <h4 style={{ fontWeight: "bold", marginTop: "1.5rem" }}>
          7. Form of the Audit Report
        </h4>
        <p>
          20. The audit report shall be prepared and submitted in accordance
          with the requirements of the Lagos State Local Government Law and the
          Office's reporting procedures. Specifically:
          <br />
          (a) The audit report is prepared for the statutory purpose of
          reporting to the Lagos State House of Assembly on the financial
          stewardship of the Local Government and is addressed to the
          appropriate legislative and executive authorities as required by law;
          <br />
          (b) The report may be tabled before the Lagos State House of Assembly
          and the LGA Council, and may be made available to the public in
          accordance with the provisions of the Freedom of Information Act and
          applicable Lagos State laws;
          <br />
          (c) Neither the Local Government management nor the Council may rely
          on any oral or draft report provided by the Office. The Office accepts
          responsibility only for the final signed audit report;
          <br />
          (d) The Management Letter arising from the audit shall be addressed to
          the Chairman and the Treasurer of the Local Government and shall set
          out significant findings, recommendations, and management responses
          thereto;
          <br />
          (e) Except as provided by law or as required by a court of competent
          jurisdiction, audit working papers, draft reports, and confidential
          communications shall not be made available to third parties without
          the prior written authorisation of the Auditor General.
        </p>

        <h4 style={{ fontWeight: "bold", marginTop: "1.5rem" }}>
          8. Applicable Standards and Legal Framework
        </h4>
        <p>
          21. This engagement is governed by and shall be interpreted in
          accordance with Nigerian law, including but not limited to:
          <br />
          (a) The Constitution of the Federal Republic of Nigeria 1999 (as
          amended), particularly Section 7(6)(c);
          <br />
          (b) The Lagos State Local Government Law (Cap L82, Laws of Lagos
          State) and any amendments thereto;
          <br />
          (c) The Lagos State Public Finance Management Law;
          <br />
          (d) The Financial Memoranda for Local Government Councils in Lagos
          State;
          <br />
          (e) The Public Procurement Act 2007 and Lagos State Public Procurement
          Agency guidelines;
          <br />
          (f) The Pension Reform Act 2014 and the Lagos State Pension Commission
          (LASPEC) guidelines;
          <br />
          (g) International Standards of Supreme Audit Institutions (ISSAIs) as
          issued by INTOSAI;
          <br />
          (h) International Standards on Auditing (ISAs) as applicable in
          Nigeria;
          <br />
          (i) International Public Sector Accounting Standards (IPSAS) as
          adopted or prescribed for Nigerian public sector entities.
        </p>
        <p>
          22. The Lagos State courts shall have jurisdiction to settle any
          dispute which may arise in connection with the validity,
          interpretation, or performance of this engagement.
        </p>

        <h4 style={{ fontWeight: "bold", marginTop: "1.5rem" }}>
          9. Alteration to Terms
        </h4>
        <p>
          23. All additions, amendments, and variations to these terms of
          engagement shall be binding only if agreed to in writing and duly
          authorised by the Auditor General for Local Governments (or an
          authorised officer) and the appropriate representative of the Local
          Government.
        </p>
        <p>
          24. These terms supersede any previous agreements or representations
          between the parties in respect of the scope of this audit engagement
          and represent the entire understanding between the parties with
          respect to the matters herein.
        </p>
        <p>
          25. Because laws, regulations, and financial reporting requirements
          frequently change, the Local Government is advised to seek
          clarification from the Office if circumstances arise that may affect
          the scope or conclusions of the audit.
        </p>

        <h4 style={{ fontWeight: "bold", marginTop: "1.5rem" }}>
          10. Other Audit-Related Services
        </h4>
        <p>
          26. The Office may, from time to time, be required to undertake
          additional audit reviews, special investigations, or compliance
          reviews at the request of the Lagos State Government, the State House
          of Assembly, or other authorised bodies. Any such additional work will
          be covered by a separate engagement authorisation.
        </p>
        <p>
          27. This letter covers only the statutory audit of the annual
          financial statements and related compliance reviews. Forensic
          investigations or special audits arising from specific allegations or
          referrals will be the subject of separate terms.
        </p>

        <h4 style={{ fontWeight: "bold", marginTop: "1.5rem" }}>
          11. Agreement of Terms
        </h4>
        <p>
          28. This letter is effective from the date of signature and will
          remain in force for the duration of the audit of the financial year
          specified herein. A new letter of engagement will be issued for
          subsequent financial years as appropriate.
        </p>
        <p>
          29. We would be grateful if you could confirm the Local Government's
          agreement to the terms of this letter by signing the enclosed copy and
          returning it to the Office within fourteen (14) days of receipt.
        </p>
        <p>
          30. If this letter is not in accordance with your understanding of the
          scope of the engagement or your circumstances have changed, please
          notify the Office in writing as soon as possible.
        </p>

        <div style={{ marginTop: "3rem" }}>
          <p>Yours faithfully,</p>
          <br />
          {mandate?.auditorGeneralSignature ? (
            <div style={{ margin: "1rem 0" }}>
              <img
                src={mandate.auditorGeneralSignature}
                alt="Auditor General Signature"
                style={{ maxHeight: "80px", maxWidth: "250px" }}
              />
            </div>
          ) : (
            <React.Fragment>
              <br />
              <p>_________________________________</p>
            </React.Fragment>
          )}
          <p style={{ fontWeight: "bold" }}>
            Auditor General for Local Governments
          </p>
          <p>Office of the Auditor General for Local Governments</p>
          <p>Lagos State</p>
          <br />
          <p>Date: {currentDate}</p>
        </div>

        <div
          style={{
            marginTop: "3rem",
            borderTop: "1px dashed #000",
            paddingTop: "2rem",
          }}
        >
          <h4 style={{ fontWeight: "bold", textTransform: "uppercase" }}>
            Confirmation of Agreement by Local Government
          </h4>
          <p>
            I/We, the undersigned, confirm that I/we have read and understood
            the contents of this Letter of Engagement and agree that it
            accurately reflects the basis on which the Office of the Auditor
            General for Local Governments, Lagos State, will carry out the audit
            of the accounts and financial statements of {lgaName} Local
            Government Area for the financial year ending 31st December{" "}
            {auditYear}.
          </p>
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "2rem",
            }}
          >
            <div>
              <p>Signed: _________________________________</p>
              <br />
              <p>Name: __________________________________</p>
              <br />
              <p>Designation: ____________________________</p>
              <p>(Chairman / Treasurer / Authorised Officer)</p>
            </div>
            <div>
              <p>Date: ___________________</p>
            </div>
          </div>
          <br />
          <p>For and on behalf of:</p>
          <p>{lgaName} Local Government Area, Lagos State</p>
          <br />
          <br />
          <div
            style={{
              width: "150px",
              height: "150px",
              border: "1px dashed #000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#666" }}>Official Stamp</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandateLetter;
