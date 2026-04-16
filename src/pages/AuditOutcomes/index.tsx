/* ==================================================================
   Audit Outcomes — Main Page
   Tabs:
     1. Trial Balance
     2. Materiality
     3. Statement of Responsibility
     4. Audit Report (State & LG)
     5. Accounting Policies
     6. Financial Statements
     7. Compile & Generate (PDF)
   ================================================================== */

import React, { useEffect, useMemo, useState } from "react";
import {
  FileSpreadsheet,
  Calculator,
  ShieldCheck,
  FileText,
  BookOpen,
  LineChart,
  Package,
  Download,
  FileCheck,
  Loader2,
  ChevronRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import s from "../../styles/pages.module.css";
import SignaturePad from "../../components/AuditOutcomes/SignaturePad";
import SectionBuilder, {
  type EditableSection,
} from "../../components/AuditOutcomes/SectionBuilder";
import TrialBalanceUpload from "../../components/AuditOutcomes/TrialBalanceUpload";
import MaterialityCalculator from "../../components/AuditOutcomes/MaterialityCalculator";
import {
  generateAuditOutcomePdf,
  imageUrlToDataUrl,
} from "../../utils/pdfGenerator";
import type {
  AuditOutcome,
  AuditReportDocument,
  FinancialStatement,
  ReportType,
  LgaAuditPackage,
  FinancialStatementRow,
  FinancialStatementKind,
} from "../../types/auditOutcomes";

type TabKey =
  | "trial-balance"
  | "materiality"
  | "responsibility"
  | "report"
  | "policies"
  | "statements"
  | "compile";

const TABS: Array<{ key: TabKey; label: string; icon: React.ReactNode }> = [
  {
    key: "trial-balance",
    label: "Trial Balance",
    icon: <FileSpreadsheet size={15} />,
  },
  { key: "materiality", label: "Materiality", icon: <Calculator size={15} /> },
  {
    key: "responsibility",
    label: "Responsibility",
    icon: <ShieldCheck size={15} />,
  },
  { key: "report", label: "Audit Report", icon: <FileText size={15} /> },
  {
    key: "policies",
    label: "Accounting Policies",
    icon: <BookOpen size={15} />,
  },
  {
    key: "statements",
    label: "Financial Statements",
    icon: <LineChart size={15} />,
  },
  { key: "compile", label: "Compile & Generate", icon: <Package size={15} /> },
];

const AuditOutcomesPage: React.FC = () => {
  const { user } = useAuth();
  const store = useAuditStore();

  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string>(
    store.auditOutcomes?.[0]?.id ?? "",
  );
  const [activeTab, setActiveTab] = useState<TabKey>("trial-balance");

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1180);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1180);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const outcome = useMemo(
    () => store.auditOutcomes?.find((o) => o.id === selectedOutcomeId),
    [store.auditOutcomes, selectedOutcomeId],
  );

  // Role-based edit permissions
  const role = user?.role;
  const canEditResponsibility =
    role === "AUDIT_LEAD" || role === "SYSTEM_ADMIN";
  const canEditReport =
    role === "AUDIT_LEAD" ||
    role === "AUDIT_SUPERVISOR" ||
    role === "STATE_AUDITOR_GENERAL" ||
    role === "SYSTEM_ADMIN";
  const canEditPolicies =
    role === "AUDIT_SUPERVISOR" || role === "SYSTEM_ADMIN";
  const canApproveMateriality =
    role === "AUDIT_SUPERVISOR" ||
    role === "STATE_AUDITOR_GENERAL" ||
    role === "SYSTEM_ADMIN";

  if (!outcome || !user) {
    return (
      <div style={{ padding: "2rem" }}>
        <div className={s.pageTitle}>Audit Outcomes</div>
        <div className={s.pageSubtitle}>
          No audit outcome available. Complete an audit to Reporting stage to
          begin compilation.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.25rem 1.5rem" }}>
      {/* Page header */}
      <div className={s.pageHeader}>
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 700,
              color: "#064e3b",
              background: "#d1fae5",
              padding: "0.2rem 0.5rem",
              borderRadius: 3,
              marginBottom: 8,
            }}
          >
            <FileCheck size={12} /> Audit Outcomes
          </div>
          <div className={s.pageTitle}>{outcome.title}</div>
          <div className={s.pageSubtitle}>
            Year of Audit: {outcome.auditYear} · Status:{" "}
            <strong>{outcome.status}</strong>
          </div>
        </div>
      </div>

      {/* Layout: left rail + content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isSmallScreen
            ? "1fr"
            : "minmax(0, 220px) minmax(0, 1fr)",
          gap: 16,
        }}
      >
        {/* Left rail — audit selector + progress */}
        <aside
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            background: "#ffffff",
            padding: isSmallScreen ? "0.75rem 1rem" : "1rem",
            display: isSmallScreen ? "flex" : "block",
            flexWrap: isSmallScreen ? "wrap" : "nowrap",
            gap: isSmallScreen ? 12 : undefined,
            alignItems: isSmallScreen ? "center" : undefined,
            height: "fit-content",
            position: "sticky",
            top: 20,
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: isSmallScreen ? 0 : 10,
              marginRight: isSmallScreen ? 8 : 0,
            }}
          >
            {isSmallScreen ? "Outcome" : "Active Outcome"}
          </div>
          <select
            value={selectedOutcomeId}
            onChange={(e) => setSelectedOutcomeId(e.target.value)}
            style={{
              width: isSmallScreen ? "auto" : "100%",
              flex: isSmallScreen ? "0 0 auto" : undefined,
              padding: "0.5rem 0.6rem",
              border: "1px solid #cbd5e1",
              borderRadius: 4,
              fontSize: "0.85rem",
              marginBottom: isSmallScreen ? 0 : 16,
            }}
          >
            {store.auditOutcomes?.map((o) => (
              <option key={o.id} value={o.id}>
                {o.auditYear} — {o.title.slice(0, 40)}
              </option>
            ))}
          </select>

          {isSmallScreen && (
            <div
              style={{
                width: "1px",
                height: 24,
                background: "#e2e8f0",
                margin: "0 8px",
              }}
            />
          )}

          {!isSmallScreen && (
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#64748b",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Sections
            </div>
          )}
          <nav
            style={{
              display: "flex",
              flexDirection: isSmallScreen ? "row" : "column",
              gap: isSmallScreen ? 8 : 2,
              flex: isSmallScreen ? 1 : undefined,
              overflowX: isSmallScreen ? "auto" : "visible",
              paddingBottom: isSmallScreen ? 4 : 0,
              WebkitOverflowScrolling: "touch",
            }}
          >
            {TABS.map((t) => {
              const done = isTabComplete(t.key, outcome, store);
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0.55rem 0.7rem",
                    border: "none",
                    borderRadius: 4,
                    background:
                      activeTab === t.key
                        ? "#f0fdf4"
                        : isSmallScreen
                          ? "#f8fafc"
                          : "transparent",
                    color: activeTab === t.key ? "#064e3b" : "#475569",
                    fontSize: "0.82rem",
                    fontWeight: activeTab === t.key ? 600 : 500,
                    textAlign: "left",
                    cursor: "pointer",
                    whiteSpace: isSmallScreen ? "nowrap" : "normal",
                    flexShrink: isSmallScreen ? 0 : undefined,
                  }}
                >
                  {t.icon}
                  <span style={{ flex: isSmallScreen ? "none" : 1 }}>
                    {t.label}
                  </span>
                  {done ? (
                    <Check size={14} color="#16a34a" />
                  ) : (
                    <ChevronRight size={12} color="#94a3b8" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content area */}
        <div style={{ minWidth: 0 }}>
          <section>
            {activeTab === "trial-balance" && (
              <TrialBalanceTab outcome={outcome} userId={user.id} />
            )}
            {activeTab === "materiality" && (
              <MaterialityTab
                outcome={outcome}
                userId={user.id}
                canApprove={canApproveMateriality}
              />
            )}
            {activeTab === "responsibility" && (
              <ResponsibilityTab
                outcome={outcome}
                canEdit={canEditResponsibility}
              />
            )}
            {activeTab === "report" && (
              <AuditReportTab outcome={outcome} canEdit={canEditReport} />
            )}
            {activeTab === "policies" && (
              <PoliciesTab outcome={outcome} canEdit={canEditPolicies} />
            )}
            {activeTab === "statements" && (
              <FinancialStatementsTab
                outcome={outcome}
                canEdit={canEditReport}
              />
            )}
            {activeTab === "compile" && <CompileTab outcome={outcome} />}
          </section>
        </div>
      </div>
    </div>
  );
};

/* ─── Completeness checker for sidebar ticks ─── */
type StoreT = ReturnType<typeof useAuditStore.getState>;
function isTabComplete(
  tab: TabKey,
  outcome: AuditOutcome,
  store: StoreT,
): boolean {
  switch (tab) {
    case "trial-balance":
      return outcome.trialBalanceIds.length > 0;
    case "materiality":
      return !!outcome.materialityCalcId;
    case "responsibility": {
      const sor = store.statementsOfResponsibility?.find(
        (x) => x.id === outcome.statementOfResponsibilityId,
      );
      return (
        !!sor?.treasurerSignature?.signedAt &&
        !!sor?.auditLeadSignature?.signedAt
      );
    }
    case "report": {
      const rpt = store.auditReportDocuments?.find((x) =>
        outcome.auditReportIds.includes(x.id),
      );
      return !!rpt?.auditorGeneralSignature?.signedAt;
    }
    case "policies": {
      const ap = store.accountingPolicies?.find(
        (x) => x.id === outcome.accountingPoliciesId,
      );
      return !!ap?.supervisorSignature?.signedAt;
    }
    case "statements":
      return (
        !!outcome.consolidatedSofpId &&
        !!outcome.consolidatedSofPerfId &&
        !!outcome.consolidatedCashFlowId &&
        !!outcome.consolidatedNotesId
      );
    case "compile":
      return !!outcome.compiledPdfGeneratedAt;
    default:
      return false;
  }
}

/* ======================================================================
   TAB: Trial Balance
   ====================================================================== */
const TrialBalanceTab: React.FC<{ outcome: AuditOutcome; userId: string }> = ({
  outcome,
  userId,
}) => {
  const store = useAuditStore();
  const existing = store.trialBalances?.find((tb) =>
    outcome.trialBalanceIds.includes(tb.id),
  );

  return (
    <Card
      title="Trial Balance — Current & Prior Year"
      subtitle={`Upload unaudited trial balance for Year ${outcome.auditYear} with ${outcome.auditYear - 1} comparatives. The engine parses NCOA-coded account lines, classifies them, and derives PBT for materiality.`}
    >
      <TrialBalanceUpload
        auditOutcomeId={outcome.id}
        auditId={outcome.auditId}
        userId={userId}
        currentYear={outcome.auditYear}
        priorYear={outcome.auditYear - 1}
        existing={existing}
        onUploaded={(tb) => store.uploadTrialBalance(tb)}
        onReset={() => {
          if (existing) store.removeTrialBalance(existing.id);
        }}
      />
    </Card>
  );
};

/* ======================================================================
   TAB: Materiality
   ====================================================================== */
const MaterialityTab: React.FC<{
  outcome: AuditOutcome;
  userId: string;
  canApprove: boolean;
}> = ({ outcome, userId, canApprove }) => {
  const store = useAuditStore();
  const tb = store.trialBalances?.find((x) =>
    outcome.trialBalanceIds.includes(x.id),
  );
  const existing = store.materialityCalcs?.find(
    (x) => x.id === outcome.materialityCalcId,
  );

  if (!tb) {
    return (
      <EmptyState
        icon={<AlertCircle size={28} />}
        title="Upload a Trial Balance first"
        message="Materiality derives from Profit Before Tax computed from the trial balance."
      />
    );
  }

  return (
    <MaterialityCalculator
      auditOutcomeId={outcome.id}
      auditId={outcome.auditId}
      userId={userId}
      profitBeforeTax={tb.profitBeforeTax}
      existing={existing}
      canApprove={canApprove}
      onSave={(calc) => store.setMaterialityCalc(calc)}
      onApprove={() =>
        existing && store.approveMateriality(existing.id, userId)
      }
    />
  );
};

/* ======================================================================
   TAB: Statement of Responsibility
   ====================================================================== */
const ResponsibilityTab: React.FC<{
  outcome: AuditOutcome;
  canEdit: boolean;
}> = ({ outcome, canEdit }) => {
  const store = useAuditStore();
  const sor = store.statementsOfResponsibility?.find(
    (x) => x.id === outcome.statementOfResponsibilityId,
  );
  const [preamble, setPreamble] = useState(sor?.preamble || "");
  const [body, setBody] = useState(sor?.responsibilityText || "");

  useEffect(() => {
    setPreamble(sor?.preamble || "");
    setBody(sor?.responsibilityText || "");
  }, [sor?.id]);

  if (!sor) return <EmptyState title="Statement of Responsibility not found" />;

  const handleSave = () => {
    store.saveStatementOfResponsibility({
      ...sor,
      preamble,
      responsibilityText: body,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <Card
      title="Statement of Financial Responsibility"
      subtitle="Treasurer and Audit Lead jointly acknowledge responsibility for preparation and fair presentation of the financial statements."
      actions={
        canEdit && (
          <button type="button" onClick={handleSave} style={primaryBtn}>
            Save
          </button>
        )
      }
    >
      <LabeledTextarea
        label="Preamble"
        value={preamble}
        onChange={setPreamble}
        rows={3}
        disabled={!canEdit}
      />
      <LabeledTextarea
        label="Responsibility Statement"
        value={body}
        onChange={setBody}
        rows={8}
        disabled={!canEdit}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginTop: 16,
        }}
      >
        <SignaturePad
          label="Treasurer"
          role="TREASURER"
          defaultTitle="Treasurer, Local Government Council"
          value={sor.treasurerSignature}
          disabled={!canEdit}
          onChange={(sig) =>
            store.saveStatementOfResponsibility({
              ...sor,
              treasurerSignature: sig,
              updatedAt: new Date().toISOString(),
            })
          }
        />
        <SignaturePad
          label="Audit Lead"
          role="AUDIT_LEAD"
          defaultTitle="Audit Lead"
          value={sor.auditLeadSignature}
          disabled={!canEdit}
          onChange={(sig) =>
            store.saveStatementOfResponsibility({
              ...sor,
              auditLeadSignature: sig,
              updatedAt: new Date().toISOString(),
            })
          }
        />
      </div>
    </Card>
  );
};

/* ======================================================================
   TAB: Audit Report (State + Local Government)
   ====================================================================== */
const AuditReportTab: React.FC<{ outcome: AuditOutcome; canEdit: boolean }> = ({
  outcome,
  canEdit,
}) => {
  const store = useAuditStore();
  const [reportType, setReportType] =
    useState<ReportType>("State Consolidated");
  const [selectedLgaId, setSelectedLgaId] = useState<string>("");

  // Find the matching report. State consolidated is just one; LG reports are per-LGA.
  const stateReport = store.auditReportDocuments?.find(
    (r) =>
      outcome.auditReportIds.includes(r.id) && r.type === "State Consolidated",
  );

  const lgaPackages = store.lgaAuditPackages?.filter(
    (p) => p.auditOutcomeId === outcome.id,
  );

  const activeReport: AuditReportDocument | undefined =
    reportType === "State Consolidated"
      ? stateReport
      : lgaPackages?.find((p) => p.lgaId === selectedLgaId)?.report;

  const [sections, setSections] = useState<EditableSection[]>(
    activeReport?.sections || [],
  );
  const [addressee, setAddressee] = useState(activeReport?.addressee || "");
  const [title, setTitle] = useState(activeReport?.title || "");
  const [basisText, setBasisText] = useState(
    activeReport?.basisOfOpinion || "",
  );
  const [opinion, setOpinion] = useState<AuditReportDocument["opinion"]>(
    activeReport?.opinion || "Unqualified",
  );

  // Sync when selection changes
  useEffect(() => {
    setSections(activeReport?.sections || []);
    setAddressee(activeReport?.addressee || "");
    setTitle(activeReport?.title || "");
    setBasisText(activeReport?.basisOfOpinion || "");
    setOpinion(activeReport?.opinion || "Unqualified");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeReport?.id]);

  const handleSave = () => {
    if (!activeReport) return;
    store.saveAuditReportDocument({
      ...activeReport,
      sections: sections.map((s, i) => ({
        id: s.id,
        order: i + 1,
        header: s.header,
        description: s.description,
        bullets: s.bullets,
        table: s.table,
        recommendation: s.recommendation,
      })),
      addressee,
      title,
      basisOfOpinion: basisText,
      opinion,
      updatedAt: new Date().toISOString(),
    });
  };

  const lgas = store.lgas ?? [];

  return (
    <Card
      title="Auditor-General's Report"
      subtitle="Draft the report sections with headers, descriptions, and recommendations. Tables and bullet points are optional per section. Two report types: State Consolidated and Local Government (per LGA)."
      actions={
        canEdit && (
          <button type="button" onClick={handleSave} style={primaryBtn}>
            Save Report
          </button>
        )
      }
    >
      {/* Type toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <SegmentedBtn
          active={reportType === "State Consolidated"}
          onClick={() => setReportType("State Consolidated")}
        >
          State Consolidated
        </SegmentedBtn>
        <SegmentedBtn
          active={reportType === "Local Government"}
          onClick={() => setReportType("Local Government")}
        >
          Local Government
        </SegmentedBtn>
        {reportType === "Local Government" && (
          <select
            value={selectedLgaId}
            onChange={(e) => setSelectedLgaId(e.target.value)}
            style={{
              padding: "0.5rem 0.7rem",
              border: "1px solid #cbd5e1",
              borderRadius: 4,
              fontSize: "0.85rem",
              marginLeft: 8,
              minWidth: 200,
            }}
          >
            <option value="">Select LGA / LCDA…</option>
            {lgas.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} {l.councilType === "LCDA" ? "(LCDA)" : ""}
              </option>
            ))}
          </select>
        )}
      </div>

      {!activeReport && reportType === "Local Government" && (
        <EmptyState
          title="Select an LGA / LCDA"
          message="Local Government reports are per-council. Select one above to edit."
        />
      )}

      {activeReport && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <LabeledInput
              label="Report Title"
              value={title}
              onChange={setTitle}
              disabled={!canEdit}
            />
            <LabeledInput
              label="Addressee"
              value={addressee}
              onChange={setAddressee}
              disabled={!canEdit}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 1fr",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <LabeledTextarea
              label="Basis of Opinion"
              value={basisText}
              onChange={setBasisText}
              rows={4}
              disabled={!canEdit}
            />
            <div>
              <label style={labelCss}>Opinion</label>
              <select
                value={opinion}
                onChange={(e) =>
                  setOpinion(e.target.value as AuditReportDocument["opinion"])
                }
                disabled={!canEdit}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.6rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: 4,
                  fontSize: "0.85rem",
                  background: "#ffffff",
                }}
              >
                <option>Unqualified</option>
                <option>Qualified</option>
                <option>Adverse</option>
                <option>Disclaimer</option>
              </select>
            </div>
          </div>

          <SectionBuilder
            sections={sections}
            onChange={setSections}
            showRecommendation
            headerLabel="Section Header"
            descriptionLabel="Observation / Description"
            readOnly={!canEdit}
          />

          {/* Approval chain signatures */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <h4
              style={{
                fontSize: "0.85rem",
                color: "#0f172a",
                fontWeight: 700,
                margin: "0 0 10px",
              }}
            >
              Approval Chain
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 12,
              }}
            >
              <SignaturePad
                label="1. Audit Lead"
                role="AUDIT_LEAD"
                defaultTitle="Audit Lead"
                value={activeReport.auditLeadSignature}
                disabled={!canEdit}
                onChange={(sig) =>
                  store.saveAuditReportDocument({
                    ...activeReport,
                    auditLeadSignature: sig,
                    updatedAt: new Date().toISOString(),
                  })
                }
              />
              <SignaturePad
                label="2. Audit Supervisor"
                role="AUDIT_SUPERVISOR"
                defaultTitle="Audit Supervisor"
                value={activeReport.auditSupervisorSignature}
                disabled={
                  !canEdit || !activeReport.auditLeadSignature?.signedAt
                }
                onChange={(sig) =>
                  store.saveAuditReportDocument({
                    ...activeReport,
                    auditSupervisorSignature: sig,
                    updatedAt: new Date().toISOString(),
                  })
                }
              />
              <SignaturePad
                label="3. Auditor-General"
                role="AUDITOR_GENERAL"
                defaultTitle="Auditor-General for Local Governments"
                value={activeReport.auditorGeneralSignature}
                disabled={
                  !canEdit || !activeReport.auditSupervisorSignature?.signedAt
                }
                onChange={(sig) =>
                  store.saveAuditReportDocument({
                    ...activeReport,
                    auditorGeneralSignature: sig,
                    status: "Approved",
                    approvedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  })
                }
              />
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                marginTop: 8,
              }}
            >
              Signatures are sequential — each level unlocks the next.
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

/* ======================================================================
   TAB: Accounting Policies (Supervisor-signed)
   ====================================================================== */
const PoliciesTab: React.FC<{ outcome: AuditOutcome; canEdit: boolean }> = ({
  outcome,
  canEdit,
}) => {
  const store = useAuditStore();
  const ap = store.accountingPolicies?.find(
    (x) => x.id === outcome.accountingPoliciesId,
  );
  const [sections, setSections] = useState<EditableSection[]>(
    ap?.policies.map((p) => ({
      id: p.id,
      order: p.order,
      header: p.title,
      description: p.body,
      bullets: p.bullets,
      table: p.table,
    })) || [],
  );

  useEffect(() => {
    setSections(
      ap?.policies.map((p) => ({
        id: p.id,
        order: p.order,
        header: p.title,
        description: p.body,
        bullets: p.bullets,
        table: p.table,
      })) || [],
    );
  }, [ap?.id]);

  if (!ap) return <EmptyState title="Accounting Policies not found" />;

  const handleSave = () => {
    store.saveAccountingPolicies({
      ...ap,
      policies: sections.map((s, i) => ({
        id: s.id,
        order: i + 1,
        title: s.header,
        body: s.description,
        bullets: s.bullets,
        table: s.table,
      })),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <Card
      title="Accounting Policies — IPSAS Accrual"
      subtitle="The Audit Supervisor drafts, reviews and signs off the accounting policies applied in preparing the consolidated financial statements."
      actions={
        canEdit && (
          <button type="button" onClick={handleSave} style={primaryBtn}>
            Save Policies
          </button>
        )
      }
    >
      <SectionBuilder
        sections={sections}
        onChange={setSections}
        showRecommendation={false}
        headerLabel="Policy Title"
        descriptionLabel="Policy Body"
        readOnly={!canEdit}
      />

      <div style={{ marginTop: 18 }}>
        <SignaturePad
          label="Audit Supervisor Sign-off"
          role="AUDIT_SUPERVISOR"
          defaultTitle="Audit Supervisor"
          value={ap.supervisorSignature}
          disabled={!canEdit}
          onChange={(sig) =>
            store.saveAccountingPolicies({
              ...ap,
              supervisorSignature: sig,
              status: "Approved",
              updatedAt: new Date().toISOString(),
            })
          }
        />
      </div>
    </Card>
  );
};

/* ======================================================================
   TAB: Financial Statements (SoFP, SoFPerf, CashFlow, Notes)
   ====================================================================== */
const FS_SUBTABS: Array<{ key: FinancialStatementKind; label: string }> = [
  { key: "StatementOfFinancialPosition", label: "SoFP" },
  { key: "StatementOfFinancialPerformance", label: "SoF Perf" },
  { key: "CashFlowStatement", label: "Cash Flow" },
  { key: "NotesToTheAccounts", label: "Notes" },
];

const FinancialStatementsTab: React.FC<{
  outcome: AuditOutcome;
  canEdit: boolean;
}> = ({ outcome, canEdit }) => {
  const store = useAuditStore();
  const [subtab, setSubtab] = useState<FinancialStatementKind>(
    "StatementOfFinancialPosition",
  );

  const kindToId: Record<FinancialStatementKind, string | undefined> = {
    StatementOfFinancialPosition: outcome.consolidatedSofpId,
    StatementOfFinancialPerformance: outcome.consolidatedSofPerfId,
    CashFlowStatement: outcome.consolidatedCashFlowId,
    NotesToTheAccounts: outcome.consolidatedNotesId,
  };

  const fs = store.auditedFinancialStatements?.find(
    (f) => f.id === kindToId[subtab],
  );

  return (
    <Card
      title="Audited Financial Statements (Consolidated)"
      subtitle="The four pillars of the audited accounts. Values are pre-populated from the trial balance — adjust as required for audit adjustments."
    >
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {FS_SUBTABS.map((t) => (
          <SegmentedBtn
            key={t.key}
            active={subtab === t.key}
            onClick={() => setSubtab(t.key)}
          >
            {t.label}
          </SegmentedBtn>
        ))}
      </div>
      {fs ? (
        <FinancialStatementEditor
          fs={fs}
          canEdit={canEdit}
          onSave={(next) => store.saveFinancialStatement(next)}
        />
      ) : (
        <EmptyState title="Statement not yet generated" />
      )}
    </Card>
  );
};

const FinancialStatementEditor: React.FC<{
  fs: FinancialStatement;
  canEdit: boolean;
  onSave: (fs: FinancialStatement) => void;
}> = ({ fs, canEdit, onSave }) => {
  const [rows, setRows] = useState<FinancialStatementRow[]>(fs.rows);
  useEffect(() => setRows(fs.rows), [fs.id]);

  const handleCell = (
    id: string,
    field: keyof FinancialStatementRow,
    v: unknown,
  ) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: v } : r)));
  };

  const handleSave = () => onSave({ ...fs, rows });

  if (fs.kind === "NotesToTheAccounts") {
    return (
      <div>
        <p style={{ fontSize: "0.85rem", color: "#475569" }}>
          Notes are generated automatically from the trial balance schedules
          (Notes 1–8). Narrative overrides can be provided per-note below.
        </p>
        {(fs.noteRefs || []).map((n) => (
          <div
            key={n.noteNumber}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              padding: "0.9rem 1rem",
              marginBottom: 10,
              background: "#ffffff",
            }}
          >
            <strong
              style={{
                fontSize: "0.85rem",
                color: "#0f172a",
                display: "block",
                marginBottom: 4,
              }}
            >
              Note {n.noteNumber}: {n.title}
            </strong>
            {n.body && (
              <div style={{ fontSize: "0.78rem", color: "#475569" }}>
                {n.body}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 6,
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "600px",
            borderCollapse: "collapse",
            fontSize: "0.82rem",
          }}
        >
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              <th style={th}>Description</th>
              <th style={th}>Note</th>
              <th style={{ ...th, textAlign: "right" }}>
                {fs.currentYear} (₦)
              </th>
              <th style={{ ...th, textAlign: "right" }}>{fs.priorYear} (₦)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                style={{
                  background: r.isHeader
                    ? "#f8fafc"
                    : r.isSubtotal
                      ? "#fafaf9"
                      : "transparent",
                  fontWeight: r.isHeader || r.isSubtotal ? 700 : 400,
                  color: r.isHeader ? "#0f172a" : "#334155",
                }}
              >
                <td
                  style={{
                    ...td,
                    paddingLeft: `${0.6 + (r.indent ?? 0) * 0.8}rem`,
                    textAlign: "left",
                  }}
                >
                  {canEdit && !r.isHeader ? (
                    <input
                      value={r.description}
                      onChange={(e) =>
                        handleCell(r.id, "description", e.target.value)
                      }
                      style={cellInput}
                    />
                  ) : (
                    r.description
                  )}
                </td>
                <td style={td}>{r.note || ""}</td>
                <td style={{ ...td, textAlign: "right" }}>
                  {r.isHeader ? (
                    ""
                  ) : canEdit ? (
                    <input
                      type="number"
                      value={r.currentYear ?? 0}
                      onChange={(e) =>
                        handleCell(r.id, "currentYear", Number(e.target.value))
                      }
                      style={{ ...cellInput, textAlign: "right" }}
                    />
                  ) : (
                    (r.currentYear ?? 0).toLocaleString("en-NG")
                  )}
                </td>
                <td style={{ ...td, textAlign: "right" }}>
                  {r.isHeader ? (
                    ""
                  ) : canEdit ? (
                    <input
                      type="number"
                      value={r.priorYear ?? 0}
                      onChange={(e) =>
                        handleCell(r.id, "priorYear", Number(e.target.value))
                      }
                      style={{ ...cellInput, textAlign: "right" }}
                    />
                  ) : (
                    (r.priorYear ?? 0).toLocaleString("en-NG")
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {canEdit && (
        <button
          type="button"
          onClick={handleSave}
          style={{ ...primaryBtn, marginTop: 14 }}
        >
          Save Statement
        </button>
      )}
    </div>
  );
};

/* ======================================================================
   TAB: Compile & Generate PDF
   ====================================================================== */
const CompileTab: React.FC<{ outcome: AuditOutcome }> = ({ outcome }) => {
  const store = useAuditStore();
  const lgas = store.lgas ?? [];

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string>("");
  const [lastBlob, setLastBlob] = useState<Blob | null>(null);

  const stateReport = store.auditReportDocuments?.find(
    (r) =>
      r.type === "State Consolidated" && outcome.auditReportIds.includes(r.id),
  );
  const sor = store.statementsOfResponsibility?.find(
    (x) => x.id === outcome.statementOfResponsibilityId,
  );
  const ap = store.accountingPolicies?.find(
    (x) => x.id === outcome.accountingPoliciesId,
  );
  const sofp = store.auditedFinancialStatements?.find(
    (f) => f.id === outcome.consolidatedSofpId,
  );
  const sofPerf = store.auditedFinancialStatements?.find(
    (f) => f.id === outcome.consolidatedSofPerfId,
  );
  const cashFlow = store.auditedFinancialStatements?.find(
    (f) => f.id === outcome.consolidatedCashFlowId,
  );
  const notes = store.auditedFinancialStatements?.find(
    (f) => f.id === outcome.consolidatedNotesId,
  );

  const packages =
    store.lgaAuditPackages?.filter((p) => p.auditOutcomeId === outcome.id) ??
    [];

  const [includedLgaIds, setIncludedLgaIds] = useState<Set<string>>(
    new Set(packages.filter((p) => p.included).map((p) => p.lgaId)),
  );

  const toggleLga = (lgaId: string) => {
    setIncludedLgaIds((curr) => {
      const next = new Set(curr);
      if (next.has(lgaId)) next.delete(lgaId);
      else next.add(lgaId);
      return next;
    });
  };

  const selectAll = () => setIncludedLgaIds(new Set(lgas.map((l) => l.id)));
  const selectNone = () => setIncludedLgaIds(new Set());

  const readiness = useMemo(() => {
    const checks = [
      {
        ok: !!stateReport?.auditorGeneralSignature?.signedAt,
        label: "Audit Report signed by Auditor-General",
      },
      {
        ok:
          !!sor?.treasurerSignature?.signedAt &&
          !!sor?.auditLeadSignature?.signedAt,
        label: "Statement of Responsibility signed",
      },
      {
        ok: !!ap?.supervisorSignature?.signedAt,
        label: "Accounting Policies signed by Supervisor",
      },
      {
        ok: !!sofp && !!sofPerf && !!cashFlow && !!notes,
        label: "All four financial statements present",
      },
      {
        ok: includedLgaIds.size > 0,
        label: "At least one LGA selected for inclusion",
      },
    ];
    return checks;
  }, [stateReport, sor, ap, sofp, sofPerf, cashFlow, notes, includedLgaIds]);

  const canGenerate = readiness.every((c) => c.ok);

  const handleGenerate = async () => {
    if (!stateReport || !sor || !ap || !sofp || !sofPerf || !cashFlow || !notes)
      return;
    setError("");
    setGenerating(true);
    try {
      let sealDataUrl: string | undefined;
      try {
        sealDataUrl = await imageUrlToDataUrl("/seal_lagos.png");
      } catch {
        // seal optional
      }
      const lgasById: Record<string, (typeof lgas)[0]> = Object.fromEntries(
        lgas.map((l) => [l.id, l]),
      );
      // Ensure included flag reflects user selection
      const pkgs: LgaAuditPackage[] = packages.map((p) => ({
        ...p,
        included: includedLgaIds.has(p.lgaId),
      }));

      const blob = await generateAuditOutcomePdf({
        outcome,
        consolidated: {
          auditReport: stateReport,
          statementOfResponsibility: sor,
          accountingPolicies: ap,
          sofp,
          sofPerf,
          cashFlow,
          notes,
        },
        lgaPackages: pkgs,
        lgasById,
        sealImageDataUrl: sealDataUrl,
      });

      setLastBlob(blob);

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `LASG-AG-Report-${outcome.auditYear}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // Mark outcome as compiled
      store.markCompilationComplete(outcome.id, 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card
      title="Compile & Generate Consolidated Report"
      subtitle="Assemble the complete audited financial statement document including the consolidated report and each selected Local Government Council's audit package."
    >
      {/* Readiness checklist */}
      <div
        style={{
          background: canGenerate ? "#f0fdf4" : "#fffbeb",
          border: `1px solid ${canGenerate ? "#bbf7d0" : "#fde68a"}`,
          borderRadius: 6,
          padding: "0.9rem 1rem",
          marginBottom: 18,
        }}
      >
        <strong
          style={{
            fontSize: "0.78rem",
            color: canGenerate ? "#14532d" : "#92400e",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Pre-flight Checklist
        </strong>
        <ul
          style={{ margin: "0.5rem 0 0 0.5rem", padding: 0, listStyle: "none" }}
        >
          {readiness.map((c, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                fontSize: "0.82rem",
                color: "#0f172a",
                padding: "3px 0",
              }}
            >
              {c.ok ? (
                <Check size={14} color="#16a34a" />
              ) : (
                <AlertCircle size={14} color="#ca8a04" />
              )}
              {c.label}
            </li>
          ))}
        </ul>
      </div>

      {/* LGA selector */}
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <strong style={{ fontSize: "0.85rem", color: "#0f172a" }}>
            Include Local Government Councils ({includedLgaIds.size} of{" "}
            {lgas.length})
          </strong>
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" onClick={selectAll} style={smallGhostBtn}>
              Select all
            </button>
            <button type="button" onClick={selectNone} style={smallGhostBtn}>
              Select none
            </button>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 6,
            maxHeight: 340,
            overflowY: "auto",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            padding: 10,
          }}
        >
          {lgas.map((l) => (
            <label
              key={l.id}
              style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                fontSize: "0.78rem",
                padding: "0.35rem 0.5rem",
                background: includedLgaIds.has(l.id) ? "#f0fdf4" : "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={includedLgaIds.has(l.id)}
                onChange={() => toggleLga(l.id)}
              />
              <span style={{ flex: 1 }}>{l.name}</span>
              {l.councilType === "LCDA" && (
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "#64748b",
                    background: "#f1f5f9",
                    padding: "1px 4px",
                    borderRadius: 2,
                    fontWeight: 700,
                  }}
                >
                  LCDA
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "0.7rem 0.85rem",
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#991b1b",
            borderRadius: 6,
            fontSize: "0.8rem",
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={!canGenerate || generating}
        style={{
          ...primaryBtn,
          padding: "0.75rem 1.5rem",
          fontSize: "0.92rem",
          background: !canGenerate || generating ? "#94a3b8" : "#064e3b",
          cursor: !canGenerate || generating ? "not-allowed" : "pointer",
        }}
      >
        {generating ? (
          <>
            <Loader2
              size={16}
              className="spin"
              style={{ animation: "spin 1s linear infinite" }}
            />
            Generating PDF…
          </>
        ) : (
          <>
            <Download size={16} /> Generate Consolidated PDF
          </>
        )}
      </button>

      {lastBlob && !generating && (
        <div
          style={{
            marginTop: 10,
            fontSize: "0.78rem",
            color: "#16a34a",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Check size={14} /> Last generated {new Date().toLocaleTimeString()} —{" "}
          {(lastBlob.size / 1024 / 1024).toFixed(2)} MB
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Card>
  );
};

/* ─── Shared UI primitives ─── */

const Card: React.FC<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, actions, children }) => (
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 8,
      padding: "1.5rem",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: subtitle ? 6 : 12,
        gap: 14,
      }}
    >
      <div>
        <h3
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <div
            style={{
              fontSize: "0.82rem",
              color: "#64748b",
              marginTop: 4,
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      <div>{actions}</div>
    </div>
    <div style={{ marginTop: 14 }}>{children}</div>
  </div>
);

const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  message?: string;
}> = ({ icon, title, message }) => (
  <div
    style={{
      padding: "2rem",
      textAlign: "center",
      color: "#64748b",
      border: "1px dashed #cbd5e1",
      borderRadius: 8,
      background: "#f8fafc",
    }}
  >
    {icon && <div style={{ color: "#94a3b8", marginBottom: 8 }}>{icon}</div>}
    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#334155" }}>
      {title}
    </div>
    {message && (
      <div style={{ fontSize: "0.82rem", marginTop: 4 }}>{message}</div>
    )}
  </div>
);

const SegmentedBtn: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: "0.5rem 0.85rem",
      fontSize: "0.8rem",
      fontWeight: active ? 700 : 500,
      background: active ? "#064e3b" : "#ffffff",
      color: active ? "#ffffff" : "#475569",
      border: active ? "1px solid #064e3b" : "1px solid #cbd5e1",
      borderRadius: 4,
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);

const LabeledInput: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}> = ({ label, value, onChange, disabled }) => (
  <div>
    <label style={labelCss}>{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "0.5rem 0.7rem",
        border: "1px solid #cbd5e1",
        borderRadius: 4,
        fontSize: "0.85rem",
        background: disabled ? "#f8fafc" : "#ffffff",
      }}
    />
  </div>
);

const LabeledTextarea: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  rows?: number;
}> = ({ label, value, onChange, disabled, rows = 4 }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={labelCss}>{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      rows={rows}
      style={{
        width: "100%",
        padding: "0.55rem 0.75rem",
        border: "1px solid #cbd5e1",
        borderRadius: 4,
        fontSize: "0.85rem",
        resize: "vertical",
        fontFamily: "inherit",
        background: disabled ? "#f8fafc" : "#ffffff",
        lineHeight: 1.55,
      }}
    />
  </div>
);

const labelCss: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 700,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: 4,
};

const cellInput: React.CSSProperties = {
  width: "100%",
  padding: "0.3rem 0.5rem",
  border: "1px solid transparent",
  background: "transparent",
  fontSize: "0.82rem",
  color: "inherit",
  fontFamily: "inherit",
};

const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "0.55rem 1rem",
  background: "#064e3b",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  fontSize: "0.82rem",
  fontWeight: 600,
  cursor: "pointer",
};

const smallGhostBtn: React.CSSProperties = {
  padding: "0.35rem 0.65rem",
  fontSize: "0.72rem",
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  borderRadius: 4,
  color: "#475569",
  cursor: "pointer",
};

const th: React.CSSProperties = {
  padding: "0.5rem 0.6rem",
  textAlign: "left",
  fontSize: "0.72rem",
  fontWeight: 600,
  color: "#334155",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "0.45rem 0.6rem",
  fontSize: "0.8rem",
  borderBottom: "1px solid #f1f5f9",
};

export default AuditOutcomesPage;
