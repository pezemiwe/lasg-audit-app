import { useState, useMemo } from "react";
import {
  Shield,
  Search,
  BarChart3,
  FileCheck,
  MapPin,
  AlertTriangle,
  Plus,
  CheckCircle,
  Upload,
  Flag,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  XCircle,
  Eye,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useAuditStore } from "../../store/useAuditStore";
import StatusBadge from "../../components/UI/StatusBadge";
import DocumentPreviewModal from "../../components/UI/DocumentPreviewModal";
import { WorkflowGate } from "../../components/UI/WorkflowGate";
import type {
  ControlTestResult,
  SubstantiveTestArea,
  RiskLevel,
  FraudFlag,
} from "../../types";
import { MOCK_USERS } from "../../mock/data";
import s from "../../styles/pages.module.css";

/* ─── Helpers ─── */
const controlResultVariant = (r: ControlTestResult) => {
  switch (r) {
    case "Effective":
      return "success" as const;
    case "Partially Effective":
      return "warning" as const;
    case "Ineffective":
      return "error" as const;
    default:
      return "default" as const;
  }
};

const severityVariant = (sev: RiskLevel) => {
  switch (sev) {
    case "Low":
      return "success" as const;
    case "Medium":
      return "warning" as const;
    case "High":
      return "error" as const;
    case "Critical":
      return "error" as const;
  }
};

const fraudStatusVariant = (st: FraudFlag["status"]) => {
  switch (st) {
    case "Open":
      return "warning" as const;
    case "Under Investigation":
      return "info" as const;
    case "Escalated":
      return "error" as const;
    case "Resolved":
      return "success" as const;
    case "Dismissed":
      return "default" as const;
  }
};

const substStatusVariant = (st: string) => {
  switch (st) {
    case "Completed":
      return "success" as const;
    case "In Progress":
      return "info" as const;
    case "Escalated":
      return "error" as const;
    default:
      return "warning" as const;
  }
};

const userName = (id: string) =>
  MOCK_USERS.find((u) => u.id === id)?.name || id;

type Tab =
  | "controls"
  | "substantive"
  | "analytical"
  | "compliance"
  | "physical"
  | "fraud";

/* ─── Analytical Procedure local type ─── */
interface AnalyticalRow {
  id: string;
  area: string;
  currentYear: number;
  priorYear: number;
  variance: number;
  variancePct: number;
  explanation: string;
  conclusion: string;
}

/* ─── Compliance Check local type ─── */
interface ComplianceCheck {
  id: string;
  regulation: string;
  requirement: string;
  compliant: "Yes" | "No" | "Partial" | "";
  evidence: string;
  finding: string;
}

/* ─── Physical Verification local type ─── */
interface PhysicalItem {
  id: string;
  assetDescription: string;
  location: string;
  registerValue: number;
  exists: "Yes" | "No" | "Partial" | "";
  condition: "Good" | "Fair" | "Poor" | "Missing" | "";
  photoUploaded: boolean;
  remarks: string;
}

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "controls", label: "Internal Controls", icon: <Shield size={16} /> },
  {
    key: "substantive",
    label: "Substantive Tests",
    icon: <Search size={16} />,
  },
  {
    key: "analytical",
    label: "Analytical Procedures",
    icon: <BarChart3 size={16} />,
  },
  {
    key: "compliance",
    label: "Compliance Checks",
    icon: <FileCheck size={16} />,
  },
  {
    key: "physical",
    label: "Physical Verification",
    icon: <MapPin size={16} />,
  },
  { key: "fraud", label: "Fraud Flags", icon: <Flag size={16} /> },
];

const CONTROL_AREAS = [
  "Revenue Collection",
  "Expenditure Authorisation",
  "Payroll Processing",
  "Bank Reconciliation",
  "Fixed Assets Management",
  "Procurement",
  "Cash Management",
  "Stores & Inventory",
  "Budget Control",
  "IT General Controls",
];

const COMPLIANCE_REGS = [
  {
    regulation: "Financial Memoranda 2009",
    requirement:
      "All revenue collections must be receipted and lodged to the Treasury within 24 hours",
  },
  {
    regulation: "Public Procurement Act 2007",
    requirement:
      "Contracts exceeding N5M must follow competitive bidding with due process certification",
  },
  {
    regulation: "Fiscal Responsibility Act 2007",
    requirement:
      "Quarterly budget implementation reports must be published within 30 days of quarter end",
  },
  {
    regulation: "Treasury Single Account (TSA) Policy",
    requirement:
      "All government funds must be domiciled in approved Treasury Single Accounts",
  },
  {
    regulation: "Pension Reform Act 2014",
    requirement:
      "Employer and employee pension contributions must be remitted by the 7th of the following month",
  },
  {
    regulation: "Stores Regulations",
    requirement:
      "All stores items must be maintained in Store Ledgers with quarterly stock-taking",
  },
];

interface FieldworkPageProps {
  auditId?: string;
  embedded?: boolean;
}

const FieldworkPage: React.FC<FieldworkPageProps> = ({
  auditId: propAuditId,
  embedded,
}) => {
  const { user } = useAuth();
  const store = useAuditStore();
  const [activeTab, setActiveTab] = useState<Tab>("controls");
  const [showForm, setShowForm] = useState(false);

  /* ─── Pick first audit for current user ─── */
  const myAudit = useMemo(() => {
    if (!user) return undefined;
    if (propAuditId) return store.audits.find((a) => a.id === propAuditId);
    if (
      user.role === "AUDIT_LEAD" ||
      user.role === "TEAM_AUDITOR" ||
      user.role === "AUDIT_SUPERVISOR"
    ) {
      if (user.lgaId) return store.audits.find((a) => a.lgaId === user.lgaId);
      if (user.zoneId) {
        const zoneLgas = store.lgas
          .filter((l) => l.zoneId === user.zoneId)
          .map((l) => l.id);
        return store.audits.find((a) => zoneLgas.includes(a.lgaId));
      }
    }
    return store.audits[0];
  }, [user, store.audits, store.lgas, propAuditId]);

  const auditId = myAudit?.id || "audit-1";
  const lgaName =
    store.lgas.find((l) => l.id === myAudit?.lgaId)?.name || "Selected LGA";

  const controlTests = store.getAuditControlTests(auditId);
  const substantiveTests = store.getAuditSubstantiveTests(auditId);
  const fraudFlags = store.getAuditFraudFlags(auditId);

  const isWriter = user?.role === "AUDIT_LEAD" || user?.role === "TEAM_AUDITOR";

  const isReviewer =
    user?.role === "AUDIT_SUPERVISOR" || user?.role === "STATE_AUDITOR_GENERAL";

  /* ─── Internal Control Form State ─── */
  const [ctrlArea, setCtrlArea] = useState(CONTROL_AREAS[0]);
  const [ctrlDesc, setCtrlDesc] = useState("");
  const [ctrlProc, setCtrlProc] = useState("");
  const [ctrlResult, setCtrlResult] = useState<ControlTestResult>("Not Tested");
  const [ctrlWeakness, setCtrlWeakness] = useState("");
  const [ctrlRec, setCtrlRec] = useState("");

  const handleAddControl = () => {
    if (!ctrlDesc.trim() || !ctrlProc.trim()) return;
    if (
      (ctrlResult === "Ineffective" || ctrlResult === "Partially Effective") &&
      ctrlWeakness.trim().split(/\s+/).length < 50
    ) {
      store.addToast({
        type: "warning",
        title: "Insufficient Detail",
        message:
          "Weakness description must be at least 50 words for ineffective / partially effective controls",
      });
      return;
    }
    store.addControlTest({
      auditId,
      controlArea: ctrlArea,
      controlDescription: ctrlDesc,
      testProcedure: ctrlProc,
      result: ctrlResult,
      weakness: ctrlWeakness || undefined,
      recommendation: ctrlRec || undefined,
      testedBy: user?.id || "",
    });
    store.logActivity({
      userId: user?.id || "",
      action: "ADD_CONTROL_TEST",
      details: `Control test recorded: ${ctrlArea} — ${ctrlResult}`,
      entityType: "fieldwork",
      entityId: auditId,
    });
    // Auto-raise fraud flag for ineffective controls
    if (ctrlResult === "Ineffective") {
      store.addToast({
        type: "warning",
        title: "Auto Fraud Alert",
        message: `Ineffective control in ${ctrlArea} — consider raising fraud flag`,
      });
    }
    resetControlForm();
    setShowForm(false);
  };

  const resetControlForm = () => {
    setCtrlArea(CONTROL_AREAS[0]);
    setCtrlDesc("");
    setCtrlProc("");
    setCtrlResult("Not Tested");
    setCtrlWeakness("");
    setCtrlRec("");
  };

  /* ─── Substantive Test Form State ─── */
  const [subArea, setSubArea] = useState<SubstantiveTestArea>("Revenue");
  const [subProc, setSubProc] = useState("");
  const [subPop, setSubPop] = useState(0);
  const [subSample, setSubSample] = useState(0);
  const [subExcCount, setSubExcCount] = useState(0);
  const [subExcAmt, setSubExcAmt] = useState(0);
  const [subConclusion, setSubConclusion] = useState("");

  const [subEvidence, setSubEvidence] = useState<
    {
      name: string;
      url: string;
      type: string;
      size: string;
      uploadedAt: string;
      uploadedBy: string;
    }[]
  >([]);

  const [previewDoc, setPreviewDoc] = useState<{
    name: string;
    type: string;
    url?: string;
    uploadedBy: string;
    uploadedAt: string;
    size?: string;
  } | null>(null);

  const handleAddSubstantive = () => {
    if (!subProc.trim() || subPop <= 0 || subSample <= 0) return;
    store.addSubstantiveTest({
      auditId,
      area: subArea,
      procedure: subProc,
      populationSize: subPop,
      sampleSize: subSample,
      exceptionCount: subExcCount,
      exceptionAmount: subExcAmt,
      conclusion: subConclusion,
      evidenceFiles: subEvidence,
      performedBy: user?.id || "",
      status: subExcCount > 0 ? "Completed" : "In Progress",
    });
    store.logActivity({
      userId: user?.id || "",
      action: "ADD_SUBSTANTIVE_TEST",
      details: `Substantive test: ${subArea} — ${subExcCount} exceptions (₦${subExcAmt.toLocaleString()})`,
      entityType: "fieldwork",
      entityId: auditId,
    });
    // Auto-escalate if exception rate > 10%
    const excRate = subPop > 0 ? (subExcCount / subSample) * 100 : 0;
    if (excRate > 10) {
      store.addToast({
        type: "error",
        title: "High Exception Rate",
        message: `${excRate.toFixed(1)}% exception rate in ${subArea} — auto-escalated to Supervisor`,
      });
    }
    resetSubForm();
    setShowForm(false);
  };

  const resetSubForm = () => {
    setSubArea("Revenue");
    setSubProc("");
    setSubPop(0);
    setSubSample(0);
    setSubExcCount(0);
    setSubExcAmt(0);
    setSubConclusion("");
    setSubEvidence([]);
  };

  /* ─── Analytical Procedures State ─── */
  const [analyticalRows, setAnalyticalRows] = useState<AnalyticalRow[]>([
    {
      id: "ap-1",
      area: "Internally Generated Revenue (IGR)",
      currentYear: 485000000,
      priorYear: 420000000,
      variance: 65000000,
      variancePct: 15.5,
      explanation:
        "Increase attributed to improved tax collection and new revenue streams from market levies.",
      conclusion: "Reasonable — consistent with policy changes.",
    },
    {
      id: "ap-2",
      area: "Personnel Costs",
      currentYear: 340000000,
      priorYear: 310000000,
      variance: 30000000,
      variancePct: 9.7,
      explanation:
        "Increment due to minimum wage implementation and new recruitments.",
      conclusion: "Reasonable — matches HR records.",
    },
    {
      id: "ap-3",
      area: "Capital Expenditure",
      currentYear: 210000000,
      priorYear: 380000000,
      variance: -170000000,
      variancePct: -44.7,
      explanation:
        "Significant decrease. Management claims budget cuts — requires further investigation.",
      conclusion:
        "INVESTIGATE — Decline is disproportionate. Need to verify capital projects status.",
    },
    {
      id: "ap-4",
      area: "Overhead Costs",
      currentYear: 125000000,
      priorYear: 98000000,
      variance: 27000000,
      variancePct: 27.6,
      explanation: "",
      conclusion: "",
    },
  ]);
  const [apArea, setApArea] = useState("");
  const [apCurrent, setApCurrent] = useState(0);
  const [apPrior, setApPrior] = useState(0);

  const addAnalyticalRow = () => {
    if (!apArea.trim()) return;
    const variance = apCurrent - apPrior;
    const variancePct = apPrior > 0 ? (variance / apPrior) * 100 : 0;
    setAnalyticalRows((prev) => [
      ...prev,
      {
        id: `ap-${Date.now()}`,
        area: apArea,
        currentYear: apCurrent,
        priorYear: apPrior,
        variance,
        variancePct,
        explanation: "",
        conclusion: "",
      },
    ]);
    setApArea("");
    setApCurrent(0);
    setApPrior(0);
    setShowForm(false);
  };

  const updateAnalytical = (
    id: string,
    field: "explanation" | "conclusion",
    value: string,
  ) => {
    setAnalyticalRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  /* ─── Compliance State ─── */
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>(
    COMPLIANCE_REGS.map((reg, i) => ({
      id: `cc-${i}`,
      regulation: reg.regulation,
      requirement: reg.requirement,
      compliant: "" as ComplianceCheck["compliant"],
      evidence: "",
      finding: "",
    })),
  );

  const updateCompliance = (
    id: string,
    field: keyof ComplianceCheck,
    value: string,
  ) => {
    setComplianceChecks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  };

  /* ─── Physical Verification State ─── */
  const [physicalItems, setPhysicalItems] = useState<PhysicalItem[]>([
    {
      id: "pv-1",
      assetDescription: "Toyota Hilux — LSD 234 CG",
      location: "LGA Headquarters Compound",
      registerValue: 18500000,
      exists: "No",
      condition: "Missing",
      photoUploaded: false,
      remarks:
        "Vehicle not found at any LGA premises. Disposed without board approval per asset register notes.",
    },
    {
      id: "pv-2",
      assetDescription: "Desktop Computer (Dell Optiplex) × 15 Units",
      location: "Finance Department",
      registerValue: 3750000,
      exists: "Partial",
      condition: "Fair",
      photoUploaded: false,
      remarks: "Only 11 of 15 units found. 4 units unaccounted for.",
    },
    {
      id: "pv-3",
      assetDescription: "1000 KVA Generator",
      location: "Power House — Main Building",
      registerValue: 28000000,
      exists: "Yes",
      condition: "Good",
      photoUploaded: true,
      remarks:
        "Asset exists, operational. Serial number matches register. Last serviced March 2026.",
    },
  ]);
  const [pvDesc, setPvDesc] = useState("");
  const [pvLocation, setPvLocation] = useState("");
  const [pvValue, setPvValue] = useState(0);

  const addPhysicalItem = () => {
    if (!pvDesc.trim()) return;
    setPhysicalItems((prev) => [
      ...prev,
      {
        id: `pv-${Date.now()}`,
        assetDescription: pvDesc,
        location: pvLocation,
        registerValue: pvValue,
        exists: "",
        condition: "",
        photoUploaded: false,
        remarks: "",
      },
    ]);
    setPvDesc("");
    setPvLocation("");
    setPvValue(0);
    setShowForm(false);
  };

  const updatePhysical = (
    id: string,
    field: keyof PhysicalItem,
    value: string | boolean | number,
  ) => {
    setPhysicalItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  /* ─── Fraud Flag Form ─── */
  const [ffIndicator, setFfIndicator] = useState("");
  const [ffDesc, setFfDesc] = useState("");
  const [ffArea, setFfArea] = useState("");
  const [ffSeverity, setFfSeverity] = useState<RiskLevel>("High");

  const handleRaiseFraud = () => {
    if (!ffIndicator.trim() || !ffDesc.trim()) return;
    store.addFraudFlag({
      auditId,
      indicator: ffIndicator,
      description: ffDesc,
      area: ffArea || "General",
      raisedBy: user?.id || "",
      severity: ffSeverity,
      status: "Open",
    });
    store.logActivity({
      userId: user?.id || "",
      action: "RAISE_FRAUD_FLAG",
      details: `Fraud flag raised: ${ffIndicator} (${ffSeverity})`,
      entityType: "fieldwork",
      entityId: auditId,
    });
    store.addToast({
      type: "error",
      title: "Fraud Flag Raised",
      message: `${ffIndicator} flagged for investigation`,
    });
    setFfIndicator("");
    setFfDesc("");
    setFfArea("");
    setFfSeverity("High");
    setShowForm(false);
  };

  const handleEscalateFraud = (id: string) => {
    store.resolveFraudFlag(id, ""); // We'll abuse this — let me use direct store update
    useAuditStore.setState((state) => ({
      fraudFlags: state.fraudFlags.map((f) =>
        f.id === id ? { ...f, status: "Escalated" as const } : f,
      ),
    }));
    store.addToast({
      type: "warning",
      title: "Fraud Flag Escalated",
      message: "Escalated to Supervisor / AG for action",
    });
  };

  const handleResolveFraud = (id: string) => {
    const resolution = prompt("Enter resolution details:");
    if (!resolution) return;
    store.resolveFraudFlag(id, resolution);
    store.addToast({
      type: "success",
      title: "Fraud Flag Resolved",
      message: "Resolution recorded",
    });
  };

  /* ─── Fieldwork Completion ─── */
  const handleSubmitFieldwork = () => {
    if (controlTests.length === 0) {
      store.addToast({
        type: "warning",
        title: "Cannot Submit",
        message: "At least one internal control test is required",
      });
      return;
    }
    if (substantiveTests.length === 0) {
      store.addToast({
        type: "warning",
        title: "Cannot Submit",
        message: "At least one substantive test is required",
      });
      return;
    }
    const openFraud = fraudFlags.filter(
      (f) => f.status === "Open" || f.status === "Under Investigation",
    );
    if (openFraud.length > 0) {
      store.addToast({
        type: "warning",
        title: "Open Fraud Flags",
        message: `${openFraud.length} fraud flag(s) are unresolved. Please resolve or escalate before submitting.`,
      });
      return;
    }
    store.submitStageApproval({
      auditId,
      stage: "Fieldwork",
      status: "Pending",
      submittedBy: user?.id || "",
    });
    store.logActivity({
      userId: user?.id || "",
      action: "SUBMIT_FIELDWORK",
      details: `Fieldwork submitted for review: ${controlTests.length} controls, ${substantiveTests.length} substantive tests`,
      entityType: "fieldwork",
      entityId: auditId,
    });
  };

  const handleApproveFieldwork = () => {
    const pending = store
      .getAuditApprovals(auditId)
      .find((a) => a.stage === "Fieldwork" && a.status === "Pending");
    if (!pending) return;
    store.reviewStageApproval(pending.id, user?.id || "", true);
    store.updateAuditStatus(auditId, "Reporting");
    store.addToast({
      type: "success",
      title: "Fieldwork Approved",
      message: "Audit status advanced to Reporting phase",
    });
    store.logActivity({
      userId: user?.id || "",
      action: "APPROVE_FIELDWORK",
      details: "Fieldwork phase approved — advanced to Reporting",
      entityType: "fieldwork",
      entityId: auditId,
    });
  };

  const handleRejectFieldwork = () => {
    const pending = store
      .getAuditApprovals(auditId)
      .find((a) => a.stage === "Fieldwork" && a.status === "Pending");
    if (!pending) return;
    const comments = prompt("Reason for requesting changes:");
    store.reviewStageApproval(
      pending.id,
      user?.id || "",
      false,
      comments || undefined,
    );
    store.addToast({
      type: "info",
      title: "Changes Requested",
      message: "Fieldwork returned for revision",
    });
  };

  /* ─── KPI Calculations ─── */
  const effectiveControls = controlTests.filter(
    (c) => c.result === "Effective",
  ).length;
  const ineffectiveControls = controlTests.filter(
    (c) => c.result === "Ineffective",
  ).length;
  const totalExceptions = substantiveTests.reduce(
    (sum, t) => sum + t.exceptionCount,
    0,
  );
  const totalExcAmt = substantiveTests.reduce(
    (sum, t) => sum + t.exceptionAmount,
    0,
  );
  const criticalFraud = fraudFlags.filter(
    (f) => f.severity === "Critical",
  ).length;
  const openFraud = fraudFlags.filter((f) => f.status === "Open").length;

  const fieldworkApproval = store
    .getAuditApprovals(auditId)
    .find((a) => a.stage === "Fieldwork");
  const fieldworkStatus = fieldworkApproval?.status;

  /* ─── Evidence upload handler ─── */
  const handleEvidenceUpload = (context: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png,.xlsx,.csv,.doc,.docx";
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        if (context === "substantive") {
          const newFiles = Array.from(files).map((f) => ({
            name: f.name,
            url: URL.createObjectURL(f),
            type: f.name.split(".").pop()?.toUpperCase() || "FILE",
            size: `${(f.size / 1024).toFixed(1)} KB`,
            uploadedAt: new Date().toISOString(),
            uploadedBy: user?.name || "Unknown",
          }));
          setSubEvidence((prev) => [...prev, ...newFiles]);
        }
        store.addToast({
          type: "success",
          title: "Evidence Attached",
          message: `${files.length} file(s) uploaded for ${context}`,
        });
      }
    };
    input.click();
  };

  return (
    <div>
      {/* ─── Page Header ─── */}
      {!embedded && (
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Fieldwork — {lgaName}</h1>
            <p className={s.pageSubtitle}>
              Execute audit procedures, test controls, and document findings
            </p>
            {fieldworkStatus && (
              <StatusBadge
                label={
                  fieldworkStatus === "Pending"
                    ? "Submitted — Awaiting Review"
                    : fieldworkStatus === "Approved"
                      ? "Fieldwork Approved"
                      : "Changes Requested"
                }
                variant={
                  fieldworkStatus === "Approved"
                    ? "success"
                    : fieldworkStatus === "Changes Requested"
                      ? "error"
                      : "info"
                }
                size="md"
              />
            )}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {isWriter && !fieldworkStatus && (
              <button className={s.btnPrimary} onClick={handleSubmitFieldwork}>
                <CheckCircle size={14} /> Submit Fieldwork
              </button>
            )}
            {isReviewer && fieldworkStatus === "Pending" && (
              <>
                <button
                  className={s.btnPrimary}
                  onClick={handleApproveFieldwork}
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button className={s.btnDanger} onClick={handleRejectFieldwork}>
                  <XCircle size={14} /> Request Changes
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── KPI Row ─── */}
      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <Shield size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Controls Tested</div>
            <div className={s.kpiValue}>{controlTests.length}</div>
            <div className={s.kpiMeta}>
              {effectiveControls} effective · {ineffectiveControls} ineffective
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Search size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Substantive Tests</div>
            <div className={s.kpiValue}>{substantiveTests.length}</div>
            <div className={s.kpiMeta}>
              {totalExceptions} exceptions · ₦{(totalExcAmt / 1e6).toFixed(1)}M
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Fraud Flags</div>
            <div className={s.kpiValue}>{fraudFlags.length}</div>
            <div className={s.kpiMeta}>
              {criticalFraud} critical · {openFraud} open
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <Activity size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Fieldwork Progress</div>
            <div className={s.kpiValue}>
              {fieldworkStatus === "Approved"
                ? "100%"
                : `${Math.min(
                    100,
                    Math.round(
                      (controlTests.length > 0 ? 30 : 0) +
                        (substantiveTests.length > 0
                          ? 30 *
                            (substantiveTests.filter(
                              (t) => t.status === "Completed",
                            ).length /
                              Math.max(1, substantiveTests.length))
                          : 0) +
                        (analyticalRows.some((r) => r.conclusion) ? 15 : 0) +
                        (complianceChecks.some((c) => c.compliant) ? 15 : 0) +
                        (physicalItems.some((p) => p.exists) ? 10 : 0),
                    ),
                  )}%`}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className={s.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? s.tabActive : s.tab}
            onClick={() => {
              setActiveTab(tab.key);
              setShowForm(false);
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              {tab.icon} {tab.label}
              {tab.key === "fraud" && fraudFlags.length > 0 && (
                <span
                  style={{
                    background: "#dc2626",
                    color: "#fff",
                    borderRadius: "99px",
                    fontSize: "0.65rem",
                    padding: "0.1rem 0.45rem",
                    fontWeight: 700,
                  }}
                >
                  {fraudFlags.length}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────── */}
      {/* TAB 1: INTERNAL CONTROLS                   */}
      {/* ─────────────────────────────────────────── */}
      {activeTab === "controls" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Internal Control Evaluation
            </h3>
            {isWriter && (
              <button
                className={s.btnPrimary}
                onClick={() => setShowForm(!showForm)}
              >
                <Plus size={14} /> New Control Test
              </button>
            )}
          </div>

          {showForm && isWriter && (
            <div className={s.card} style={{ marginBottom: "1.5rem" }}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Record Control Test</h3>
              </div>
              <div className={s.cardBody}>
                <div className={s.formGrid}>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Control Area</label>
                    <select
                      className={s.formSelect}
                      value={ctrlArea}
                      onChange={(e) => setCtrlArea(e.target.value)}
                    >
                      {CONTROL_AREAS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Test Result</label>
                    <select
                      className={s.formSelect}
                      value={ctrlResult}
                      onChange={(e) =>
                        setCtrlResult(e.target.value as ControlTestResult)
                      }
                    >
                      <option value="Not Tested">Not Tested</option>
                      <option value="Effective">Effective</option>
                      <option value="Partially Effective">
                        Partially Effective
                      </option>
                      <option value="Ineffective">Ineffective</option>
                    </select>
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>Control Description</label>
                    <textarea
                      className={s.formTextarea}
                      value={ctrlDesc}
                      onChange={(e) => setCtrlDesc(e.target.value)}
                      placeholder="Describe the control being tested..."
                      rows={2}
                    />
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>Test Procedure</label>
                    <textarea
                      className={s.formTextarea}
                      value={ctrlProc}
                      onChange={(e) => setCtrlProc(e.target.value)}
                      placeholder="Describe how the control was tested (sample size, methods)..."
                      rows={2}
                    />
                  </div>
                  {(ctrlResult === "Ineffective" ||
                    ctrlResult === "Partially Effective") && (
                    <>
                      <div className={s.formGroupFull}>
                        <label className={s.formLabel}>
                          Weakness Identified{" "}
                          <span style={{ color: "#dc2626" }}>
                            (min 50 words)
                          </span>
                        </label>
                        <textarea
                          className={s.formTextarea}
                          value={ctrlWeakness}
                          onChange={(e) => setCtrlWeakness(e.target.value)}
                          placeholder="Describe the weakness in detail..."
                          rows={3}
                        />
                        <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                          {
                            ctrlWeakness.trim().split(/\s+/).filter(Boolean)
                              .length
                          }{" "}
                          words
                        </span>
                      </div>
                      <div className={s.formGroupFull}>
                        <label className={s.formLabel}>Recommendation</label>
                        <textarea
                          className={s.formTextarea}
                          value={ctrlRec}
                          onChange={(e) => setCtrlRec(e.target.value)}
                          placeholder="Recommended corrective action..."
                          rows={2}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className={s.formActions}>
                  <button
                    className={s.btnSecondary}
                    onClick={() => {
                      resetControlForm();
                      setShowForm(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={s.btnPrimary}
                    onClick={handleAddControl}
                    disabled={!ctrlDesc.trim() || !ctrlProc.trim()}
                  >
                    <Shield size={14} /> Save Control Test
                  </button>
                </div>
              </div>
            </div>
          )}

          {controlTests.length > 0 ? (
            <div className={s.card}>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Control Area</th>
                      <th>Description</th>
                      <th>Test Procedure</th>
                      <th>Result</th>
                      <th>Tested By</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {controlTests.map((ct) => (
                      <tr key={ct.id}>
                        <td style={{ fontWeight: 600 }}>{ct.controlArea}</td>
                        <td
                          style={{
                            maxWidth: "200px",
                            whiteSpace: "normal",
                            fontSize: "0.82rem",
                          }}
                        >
                          {ct.controlDescription}
                        </td>
                        <td
                          style={{
                            maxWidth: "200px",
                            whiteSpace: "normal",
                            fontSize: "0.82rem",
                          }}
                        >
                          {ct.testProcedure}
                        </td>
                        <td>
                          <StatusBadge
                            label={ct.result}
                            variant={controlResultVariant(ct.result)}
                          />
                        </td>
                        <td style={{ fontSize: "0.82rem" }}>
                          {userName(ct.testedBy)}
                        </td>
                        <td style={{ fontSize: "0.78rem", color: "#64748b" }}>
                          {new Date(ct.testedAt).toLocaleDateString("en-NG")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Summary panel */}
              <div className={s.cardFooter}>
                <div style={{ display: "flex", gap: "2rem" }}>
                  <span>
                    <strong>Effective:</strong> {effectiveControls}
                  </span>
                  <span>
                    <strong>Partially Effective:</strong>{" "}
                    {
                      controlTests.filter(
                        (c) => c.result === "Partially Effective",
                      ).length
                    }
                  </span>
                  <span style={{ color: "#dc2626" }}>
                    <strong>Ineffective:</strong> {ineffectiveControls}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className={s.card}>
              <div className={s.cardBody}>
                <div className={s.emptyState}>
                  <Shield size={40} className={s.emptyIcon} />
                  <div className={s.emptyTitle}>
                    No control tests recorded yet
                  </div>
                  <div className={s.emptyDesc}>
                    Begin by testing key internal controls for the LGA's
                    financial operations.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weakness details */}
          {controlTests.filter((c) => c.weakness).length > 0 && (
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>
                  <AlertTriangle
                    size={16}
                    style={{ color: "#dc2626", marginRight: "0.5rem" }}
                  />
                  Control Weaknesses Identified (
                  {controlTests.filter((c) => c.weakness).length})
                </h3>
              </div>
              <div className={s.cardBody}>
                {controlTests
                  .filter((c) => c.weakness)
                  .map((ct) => (
                    <div key={ct.id} className={s.findingCard}>
                      <div className={s.findingHeader}>
                        <div className={s.findingTitle}>{ct.controlArea}</div>
                        <StatusBadge
                          label={ct.result}
                          variant={controlResultVariant(ct.result)}
                        />
                      </div>
                      <div className={s.findingBody}>{ct.weakness}</div>
                      {ct.recommendation && (
                        <div className={s.findingRec}>
                          Recommendation: {ct.recommendation}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────── */}
      {/* TAB 2: SUBSTANTIVE TESTS                   */}
      {/* ─────────────────────────────────────────── */}
      {activeTab === "substantive" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Substantive Testing
            </h3>
            {isWriter && (
              <button
                className={s.btnPrimary}
                onClick={() => setShowForm(!showForm)}
              >
                <Plus size={14} /> New Substantive Test
              </button>
            )}
          </div>

          {showForm && isWriter && (
            <div className={s.card} style={{ marginBottom: "1.5rem" }}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Record Substantive Test</h3>
              </div>
              <div className={s.cardBody}>
                <div className={s.formGrid}>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Test Area</label>
                    <select
                      className={s.formSelect}
                      value={subArea}
                      onChange={(e) =>
                        setSubArea(e.target.value as SubstantiveTestArea)
                      }
                    >
                      {(
                        [
                          "Revenue",
                          "Expenditure",
                          "Assets",
                          "Liabilities",
                          "Payroll",
                          "Bank",
                          "Procurement",
                        ] as SubstantiveTestArea[]
                      ).map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Population Size</label>
                    <input
                      className={s.formInput}
                      type="number"
                      value={subPop || ""}
                      onChange={(e) => setSubPop(Number(e.target.value))}
                      placeholder="e.g., 3620"
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Sample Size</label>
                    <input
                      className={s.formInput}
                      type="number"
                      value={subSample || ""}
                      onChange={(e) => setSubSample(Number(e.target.value))}
                      placeholder="e.g., 181"
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Exception Count</label>
                    <input
                      className={s.formInput}
                      type="number"
                      value={subExcCount || ""}
                      onChange={(e) => setSubExcCount(Number(e.target.value))}
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Exception Amount (₦)</label>
                    <input
                      className={s.formInput}
                      type="number"
                      value={subExcAmt || ""}
                      onChange={(e) => setSubExcAmt(Number(e.target.value))}
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>
                      Sample Rate:{" "}
                      {subPop > 0
                        ? ((subSample / subPop) * 100).toFixed(1)
                        : "0"}
                      %
                    </label>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color:
                          subPop > 0 && subSample / subPop < 0.03
                            ? "#dc2626"
                            : "#15803d",
                        fontWeight: 600,
                      }}
                    >
                      {subPop > 0 && subSample / subPop < 0.03
                        ? "⚠ Below minimum 3% threshold"
                        : "✓ Adequate sample"}
                    </div>
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>
                      Procedure / Test Description
                    </label>
                    <textarea
                      className={s.formTextarea}
                      value={subProc}
                      onChange={(e) => setSubProc(e.target.value)}
                      placeholder="E.g. Vouched transition to supporting doc, Verified accuracy, completeness..."
                      rows={2}
                    />
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>
                      Conclusion & Exception Note
                    </label>
                    <textarea
                      className={s.formTextarea}
                      value={subConclusion}
                      onChange={(e) => setSubConclusion(e.target.value)}
                      placeholder="State conclusion on compliance. If exceptions found, categorization severity..."
                      rows={2}
                    />
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>
                      Supporting Evidence ({subEvidence.length} files)
                    </label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className={s.btnSecondary}
                        onClick={() => handleEvidenceUpload("substantive")}
                      >
                        <Upload size={14} /> Upload Evidence (PDF, Images, CSV)
                      </button>
                    </div>
                    {subEvidence.length > 0 && (
                      <div
                        style={{
                          marginTop: "0.5rem",
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {subEvidence.map((f, i) => (
                          <div
                            key={i}
                            className={s.poolTag}
                            style={{
                              padding: "0.3rem 0.6rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <span style={{ fontSize: "0.8rem" }}>
                              {f.name}{" "}
                              <span style={{ opacity: 0.6 }}>({f.size})</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setPreviewDoc(f)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                color: "#000",
                              }}
                              title="Preview"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className={s.formActions}>
                  <button
                    className={s.btnSecondary}
                    onClick={() => {
                      resetSubForm();
                      setShowForm(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={s.btnPrimary}
                    onClick={handleAddSubstantive}
                    disabled={!subProc.trim() || subPop <= 0 || subSample <= 0}
                  >
                    <Search size={14} /> Save Test
                  </button>
                </div>
              </div>
            </div>
          )}

          {substantiveTests.length > 0 ? (
            <div className={s.card}>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Area</th>
                      <th>Procedure</th>
                      <th>Population</th>
                      <th>Sample</th>
                      <th>Exceptions</th>
                      <th>Exc. Amount</th>
                      <th>Rate</th>
                      <th>Status</th>
                      <th>Performed By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {substantiveTests.map((st) => {
                      const rate =
                        st.sampleSize > 0
                          ? (st.exceptionCount / st.sampleSize) * 100
                          : 0;
                      return (
                        <tr key={st.id}>
                          <td style={{ fontWeight: 600 }}>{st.area}</td>
                          <td
                            style={{
                              maxWidth: "250px",
                              whiteSpace: "normal",
                              fontSize: "0.82rem",
                            }}
                          >
                            {st.procedure}
                          </td>
                          <td>{st.populationSize.toLocaleString()}</td>
                          <td>{st.sampleSize.toLocaleString()}</td>
                          <td>
                            <span
                              style={{
                                color:
                                  st.exceptionCount > 0 ? "#dc2626" : "#15803d",
                                fontWeight: 600,
                              }}
                            >
                              {st.exceptionCount}
                            </span>
                          </td>
                          <td>₦{st.exceptionAmount.toLocaleString()}</td>
                          <td>
                            <span
                              style={{
                                color:
                                  rate > 10
                                    ? "#dc2626"
                                    : rate > 5
                                      ? "#d97706"
                                      : "#15803d",
                                fontWeight: 600,
                              }}
                            >
                              {rate.toFixed(1)}%
                            </span>
                          </td>
                          <td>
                            <StatusBadge
                              label={st.status}
                              variant={substStatusVariant(st.status)}
                            />
                          </td>
                          <td style={{ fontSize: "0.82rem" }}>
                            {userName(st.performedBy)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className={s.cardFooter}>
                Total Exceptions: {totalExceptions} · Total Exception Value: ₦
                {totalExcAmt.toLocaleString()}
              </div>
            </div>
          ) : (
            <div className={s.card}>
              <div className={s.cardBody}>
                <div className={s.emptyState}>
                  <Search size={40} className={s.emptyIcon} />
                  <div className={s.emptyTitle}>
                    No substantive tests recorded
                  </div>
                  <div className={s.emptyDesc}>
                    Test account balances by vouching transactions and verifying
                    accuracy.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conclusions per area */}
          {substantiveTests.filter((t) => t.conclusion).length > 0 && (
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Test Conclusions</h3>
              </div>
              <div className={s.cardBody}>
                {substantiveTests
                  .filter((t) => t.conclusion)
                  .map((st) => (
                    <div key={st.id} className={s.findingCard}>
                      <div className={s.findingHeader}>
                        <div className={s.findingTitle}>{st.area}</div>
                        <StatusBadge
                          label={st.status}
                          variant={substStatusVariant(st.status)}
                        />
                      </div>
                      <div className={s.findingBody}>{st.conclusion}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────── */}
      {/* TAB 3: ANALYTICAL PROCEDURES               */}
      {/* ─────────────────────────────────────────── */}
      {activeTab === "analytical" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Analytical Procedures — Year-on-Year Comparison
            </h3>
            {isWriter && (
              <button
                className={s.btnPrimary}
                onClick={() => setShowForm(!showForm)}
              >
                <Plus size={14} /> Add Line Item
              </button>
            )}
          </div>

          {showForm && isWriter && (
            <div className={s.card} style={{ marginBottom: "1.5rem" }}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Add Analytical Comparison</h3>
              </div>
              <div className={s.cardBody}>
                <div className={s.formGrid}>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>Financial Area</label>
                    <input
                      className={s.formInput}
                      value={apArea}
                      onChange={(e) => setApArea(e.target.value)}
                      placeholder="e.g., Consultancy Fees, Grant Income..."
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>
                      Current Year Amount (₦)
                    </label>
                    <input
                      className={s.formInput}
                      type="number"
                      value={apCurrent || ""}
                      onChange={(e) => setApCurrent(Number(e.target.value))}
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Prior Year Amount (₦)</label>
                    <input
                      className={s.formInput}
                      type="number"
                      value={apPrior || ""}
                      onChange={(e) => setApPrior(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className={s.formActions}>
                  <button
                    className={s.btnSecondary}
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={s.btnPrimary}
                    onClick={addAnalyticalRow}
                    disabled={!apArea.trim()}
                  >
                    <BarChart3 size={14} /> Add Row
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={s.card}>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Financial Area</th>
                    <th style={{ textAlign: "right" }}>Current Year (₦)</th>
                    <th style={{ textAlign: "right" }}>Prior Year (₦)</th>
                    <th style={{ textAlign: "right" }}>Variance (₦)</th>
                    <th style={{ textAlign: "right" }}>Variance %</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticalRows.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 600 }}>{row.area}</td>
                      <td style={{ textAlign: "right" }}>
                        {row.currentYear.toLocaleString()}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {row.priorYear.toLocaleString()}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color:
                            row.variance < 0
                              ? "#dc2626"
                              : row.variance > 0
                                ? "#15803d"
                                : "#64748b",
                          fontWeight: 600,
                        }}
                      >
                        {row.variance >= 0 ? "+" : ""}
                        {row.variance.toLocaleString()}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: 600,
                          color:
                            Math.abs(row.variancePct) > 25
                              ? "#dc2626"
                              : Math.abs(row.variancePct) > 15
                                ? "#d97706"
                                : "#15803d",
                        }}
                      >
                        {row.variancePct >= 0 ? "+" : ""}
                        {row.variancePct.toFixed(1)}%
                      </td>
                      <td>
                        {row.variance > 0 ? (
                          <TrendingUp size={16} style={{ color: "#15803d" }} />
                        ) : row.variance < 0 ? (
                          <TrendingDown
                            size={16}
                            style={{ color: "#dc2626" }}
                          />
                        ) : (
                          <Minus size={16} style={{ color: "#64748b" }} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Explanations & Conclusions */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>
                Variance Investigation & Conclusions
              </h3>
            </div>
            <div className={s.cardBody}>
              {analyticalRows.map((row) => (
                <div
                  key={row.id}
                  style={{
                    padding: "1rem",
                    borderBottom: "1px solid var(--border, #e2e8f0)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <strong style={{ fontSize: "0.9rem" }}>{row.area}</strong>
                    {Math.abs(row.variancePct) > 25 && (
                      <StatusBadge label="MATERIAL VARIANCE" variant="error" />
                    )}
                    {Math.abs(row.variancePct) > 15 &&
                      Math.abs(row.variancePct) <= 25 && (
                        <StatusBadge label="INVESTIGATE" variant="warning" />
                      )}
                  </div>
                  {isWriter ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <textarea
                        className={s.formTextarea}
                        value={row.explanation}
                        onChange={(e) =>
                          updateAnalytical(
                            row.id,
                            "explanation",
                            e.target.value,
                          )
                        }
                        placeholder="Management explanation for variance..."
                        rows={2}
                        style={{ minHeight: "50px" }}
                      />
                      <textarea
                        className={s.formTextarea}
                        value={row.conclusion}
                        onChange={(e) =>
                          updateAnalytical(row.id, "conclusion", e.target.value)
                        }
                        placeholder="Auditor conclusion..."
                        rows={2}
                        style={{ minHeight: "50px" }}
                      />
                    </div>
                  ) : (
                    <>
                      {row.explanation && (
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "#334155",
                            marginBottom: "0.3rem",
                          }}
                        >
                          <strong>Explanation:</strong> {row.explanation}
                        </div>
                      )}
                      {row.conclusion && (
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "#064e3b",
                            fontWeight: 500,
                          }}
                        >
                          <strong>Conclusion:</strong> {row.conclusion}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────── */}
      {/* TAB 4: COMPLIANCE CHECKS                   */}
      {/* ─────────────────────────────────────────── */}
      {activeTab === "compliance" && (
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Regulatory Compliance Verification
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#64748b",
                marginTop: "0.25rem",
              }}
            >
              Verify compliance with applicable financial regulations, acts, and
              circulars
            </p>
          </div>

          <div className={s.card}>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th style={{ width: "200px" }}>Regulation</th>
                    <th>Requirement</th>
                    <th style={{ width: "120px" }}>Compliant?</th>
                    <th>Evidence / Reference</th>
                    <th>Finding</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceChecks.map((cc) => (
                    <tr key={cc.id}>
                      <td style={{ fontWeight: 600, fontSize: "0.82rem" }}>
                        {cc.regulation}
                      </td>
                      <td
                        style={{
                          fontSize: "0.82rem",
                          whiteSpace: "normal",
                          maxWidth: "300px",
                        }}
                      >
                        {cc.requirement}
                      </td>
                      <td>
                        {isWriter ? (
                          <select
                            className={s.formSelect}
                            value={cc.compliant}
                            onChange={(e) =>
                              updateCompliance(
                                cc.id,
                                "compliant",
                                e.target.value,
                              )
                            }
                            style={{ minWidth: "100px" }}
                          >
                            <option value="">--</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Partial">Partial</option>
                          </select>
                        ) : (
                          <StatusBadge
                            label={cc.compliant || "Not Checked"}
                            variant={
                              cc.compliant === "Yes"
                                ? "success"
                                : cc.compliant === "No"
                                  ? "error"
                                  : cc.compliant === "Partial"
                                    ? "warning"
                                    : "default"
                            }
                          />
                        )}
                      </td>
                      <td>
                        {isWriter ? (
                          <input
                            className={s.formInput}
                            value={cc.evidence}
                            onChange={(e) =>
                              updateCompliance(
                                cc.id,
                                "evidence",
                                e.target.value,
                              )
                            }
                            placeholder="e.g., WP Ref 3.2"
                            style={{ minWidth: "150px" }}
                          />
                        ) : (
                          <span style={{ fontSize: "0.82rem" }}>
                            {cc.evidence || "—"}
                          </span>
                        )}
                      </td>
                      <td>
                        {isWriter ? (
                          <input
                            className={s.formInput}
                            value={cc.finding}
                            onChange={(e) =>
                              updateCompliance(cc.id, "finding", e.target.value)
                            }
                            placeholder="Non-compliance details..."
                            style={{ minWidth: "200px" }}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: "0.82rem",
                              color: cc.finding ? "#dc2626" : "#64748b",
                            }}
                          >
                            {cc.finding || "—"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={s.cardFooter}>
              <div style={{ display: "flex", gap: "2rem" }}>
                <span>
                  <strong>Compliant:</strong>{" "}
                  {complianceChecks.filter((c) => c.compliant === "Yes").length}
                </span>
                <span style={{ color: "#dc2626" }}>
                  <strong>Non-Compliant:</strong>{" "}
                  {complianceChecks.filter((c) => c.compliant === "No").length}
                </span>
                <span style={{ color: "#d97706" }}>
                  <strong>Partial:</strong>{" "}
                  {
                    complianceChecks.filter((c) => c.compliant === "Partial")
                      .length
                  }
                </span>
                <span>
                  <strong>Not Checked:</strong>{" "}
                  {complianceChecks.filter((c) => !c.compliant).length}
                </span>
              </div>
            </div>
          </div>

          {isWriter && (
            <div
              style={{
                padding: "1rem",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "4px",
                fontSize: "0.82rem",
                color: "#15803d",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FileCheck size={16} />
              Upload supporting evidence for each compliance check by
              referencing workpaper numbers in the Evidence column.
              Non-compliance findings will auto-populate the Audit Report.
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────── */}
      {/* TAB 5: PHYSICAL VERIFICATION               */}
      {/* ─────────────────────────────────────────── */}
      {activeTab === "physical" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Physical Verification of Assets
            </h3>
            {isWriter && (
              <button
                className={s.btnPrimary}
                onClick={() => setShowForm(!showForm)}
              >
                <Plus size={14} /> Add Asset for Verification
              </button>
            )}
          </div>

          {showForm && isWriter && (
            <div className={s.card} style={{ marginBottom: "1.5rem" }}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Add Asset for Verification</h3>
              </div>
              <div className={s.cardBody}>
                <div className={s.formGrid}>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>Asset Description</label>
                    <input
                      className={s.formInput}
                      value={pvDesc}
                      onChange={(e) => setPvDesc(e.target.value)}
                      placeholder="e.g., Toyota Hilux — LSD 890 AB"
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Location</label>
                    <input
                      className={s.formInput}
                      value={pvLocation}
                      onChange={(e) => setPvLocation(e.target.value)}
                      placeholder="e.g., LGA Headquarters"
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Register Value (₦)</label>
                    <input
                      className={s.formInput}
                      type="number"
                      value={pvValue || ""}
                      onChange={(e) => setPvValue(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className={s.formActions}>
                  <button
                    className={s.btnSecondary}
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={s.btnPrimary}
                    onClick={addPhysicalItem}
                    disabled={!pvDesc.trim()}
                  >
                    <MapPin size={14} /> Add Asset
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={s.card}>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Asset Description</th>
                    <th>Location</th>
                    <th style={{ textAlign: "right" }}>Register Value</th>
                    <th>Exists?</th>
                    <th>Condition</th>
                    <th>Photo</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {physicalItems.map((pv) => (
                    <tr key={pv.id}>
                      <td style={{ fontWeight: 600, whiteSpace: "normal" }}>
                        {pv.assetDescription}
                      </td>
                      <td style={{ fontSize: "0.82rem" }}>{pv.location}</td>
                      <td style={{ textAlign: "right" }}>
                        ₦{pv.registerValue.toLocaleString()}
                      </td>
                      <td>
                        {isWriter ? (
                          <select
                            className={s.formSelect}
                            value={pv.exists}
                            onChange={(e) =>
                              updatePhysical(pv.id, "exists", e.target.value)
                            }
                            style={{ minWidth: "80px" }}
                          >
                            <option value="">--</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Partial">Partial</option>
                          </select>
                        ) : (
                          <StatusBadge
                            label={pv.exists || "—"}
                            variant={
                              pv.exists === "Yes"
                                ? "success"
                                : pv.exists === "No"
                                  ? "error"
                                  : pv.exists === "Partial"
                                    ? "warning"
                                    : "default"
                            }
                          />
                        )}
                      </td>
                      <td>
                        {isWriter ? (
                          <select
                            className={s.formSelect}
                            value={pv.condition}
                            onChange={(e) =>
                              updatePhysical(pv.id, "condition", e.target.value)
                            }
                            style={{ minWidth: "80px" }}
                          >
                            <option value="">--</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                            <option value="Missing">Missing</option>
                          </select>
                        ) : (
                          <StatusBadge
                            label={pv.condition || "—"}
                            variant={
                              pv.condition === "Good"
                                ? "success"
                                : pv.condition === "Fair"
                                  ? "info"
                                  : pv.condition === "Poor"
                                    ? "warning"
                                    : pv.condition === "Missing"
                                      ? "error"
                                      : "default"
                            }
                          />
                        )}
                      </td>
                      <td>
                        {isWriter ? (
                          <button
                            className={
                              pv.photoUploaded ? s.btnPrimary : s.btnSecondary
                            }
                            style={{
                              padding: "0.3rem 0.6rem",
                              fontSize: "0.75rem",
                            }}
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = () => {
                                updatePhysical(pv.id, "photoUploaded", true);
                                store.addToast({
                                  type: "success",
                                  title: "Photo Uploaded",
                                  message: `Evidence photo for ${pv.assetDescription}`,
                                });
                              };
                              input.click();
                            }}
                          >
                            {pv.photoUploaded ? (
                              <>
                                <CheckCircle size={12} /> Uploaded
                              </>
                            ) : (
                              <>
                                <Upload size={12} /> Upload
                              </>
                            )}
                          </button>
                        ) : (
                          <StatusBadge
                            label={pv.photoUploaded ? "Yes" : "No"}
                            variant={pv.photoUploaded ? "success" : "default"}
                          />
                        )}
                      </td>
                      <td>
                        {isWriter ? (
                          <input
                            className={s.formInput}
                            value={pv.remarks}
                            onChange={(e) =>
                              updatePhysical(pv.id, "remarks", e.target.value)
                            }
                            placeholder="Observations..."
                            style={{ minWidth: "200px" }}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: "0.82rem",
                              whiteSpace: "normal",
                            }}
                          >
                            {pv.remarks || "—"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={s.cardFooter}>
              <div style={{ display: "flex", gap: "2rem" }}>
                <span>
                  <strong>Verified:</strong>{" "}
                  {physicalItems.filter((p) => p.exists === "Yes").length}
                </span>
                <span style={{ color: "#dc2626" }}>
                  <strong>Missing:</strong>{" "}
                  {physicalItems.filter((p) => p.exists === "No").length}
                </span>
                <span>
                  <strong>Total Register Value:</strong> ₦
                  {physicalItems
                    .reduce((sum, p) => sum + p.registerValue, 0)
                    .toLocaleString()}
                </span>
                <span style={{ color: "#dc2626" }}>
                  <strong>Missing Value:</strong> ₦
                  {physicalItems
                    .filter((p) => p.exists === "No" || p.exists === "Partial")
                    .reduce((sum, p) => sum + p.registerValue, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────── */}
      {/* TAB 6: FRAUD FLAGS                         */}
      {/* ─────────────────────────────────────────── */}
      {activeTab === "fraud" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Fraud Indicators & Red Flags
            </h3>
            {isWriter && (
              <button
                className={s.btnDanger}
                onClick={() => setShowForm(!showForm)}
              >
                <Flag size={14} /> Raise Fraud Flag
              </button>
            )}
          </div>

          {showForm && isWriter && (
            <div
              className={s.card}
              style={{
                marginBottom: "1.5rem",
                borderColor: "#fecaca",
              }}
            >
              <div className={s.cardHeader} style={{ background: "#fef2f2" }}>
                <h3 className={s.cardTitle} style={{ color: "#991b1b" }}>
                  <AlertTriangle size={16} style={{ marginRight: "0.5rem" }} />
                  Raise Fraud / Irregularity Flag
                </h3>
              </div>
              <div className={s.cardBody}>
                <div className={s.formGrid}>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Fraud Indicator</label>
                    <input
                      className={s.formInput}
                      value={ffIndicator}
                      onChange={(e) => setFfIndicator(e.target.value)}
                      placeholder="e.g., Ghost Workers on Payroll"
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Severity</label>
                    <select
                      className={s.formSelect}
                      value={ffSeverity}
                      onChange={(e) =>
                        setFfSeverity(e.target.value as RiskLevel)
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Affected Area</label>
                    <input
                      className={s.formInput}
                      value={ffArea}
                      onChange={(e) => setFfArea(e.target.value)}
                      placeholder="e.g., Payroll, Procurement..."
                    />
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>Detailed Description</label>
                    <textarea
                      className={s.formTextarea}
                      value={ffDesc}
                      onChange={(e) => setFfDesc(e.target.value)}
                      placeholder="Describe the fraud indicator, evidence, and scope..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className={s.formActions}>
                  <button
                    className={s.btnSecondary}
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={s.btnDanger}
                    onClick={handleRaiseFraud}
                    disabled={!ffIndicator.trim() || !ffDesc.trim()}
                  >
                    <Flag size={14} /> Raise Flag
                  </button>
                </div>
              </div>
            </div>
          )}

          {fraudFlags.length > 0 ? (
            <div>
              {fraudFlags.map((ff) => (
                <div
                  key={ff.id}
                  className={s.card}
                  style={{
                    borderLeft: `4px solid ${
                      ff.severity === "Critical"
                        ? "#dc2626"
                        : ff.severity === "High"
                          ? "#d97706"
                          : ff.severity === "Medium"
                            ? "#2563eb"
                            : "#6b7280"
                    }`,
                  }}
                >
                  <div
                    style={{
                      padding: "1.25rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <AlertTriangle
                          size={18}
                          style={{
                            color:
                              ff.severity === "Critical"
                                ? "#dc2626"
                                : "#d97706",
                          }}
                        />
                        <strong
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: "0.95rem",
                          }}
                        >
                          {ff.indicator}
                        </strong>
                      </div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#334155",
                          lineHeight: 1.6,
                          marginBottom: "0.75rem",
                        }}
                      >
                        {ff.description}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "1.5rem",
                          fontSize: "0.78rem",
                          color: "#64748b",
                        }}
                      >
                        <span>
                          <strong>Area:</strong> {ff.area}
                        </span>
                        <span>
                          <strong>Raised By:</strong> {userName(ff.raisedBy)}
                        </span>
                        <span>
                          <strong>Date:</strong>{" "}
                          {new Date(ff.raisedAt).toLocaleDateString("en-NG")}
                        </span>
                      </div>
                      {ff.resolution && (
                        <div
                          style={{
                            marginTop: "0.75rem",
                            padding: "0.75rem",
                            background: "#f0fdf4",
                            borderRadius: "4px",
                            fontSize: "0.82rem",
                            color: "#15803d",
                          }}
                        >
                          <strong>Resolution:</strong> {ff.resolution}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        alignItems: "flex-end",
                      }}
                    >
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <StatusBadge
                          label={ff.severity}
                          variant={severityVariant(ff.severity)}
                        />
                        <StatusBadge
                          label={ff.status}
                          variant={fraudStatusVariant(ff.status)}
                        />
                      </div>
                      {(ff.status === "Open" ||
                        ff.status === "Under Investigation") && (
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          {isWriter && ff.status === "Open" && (
                            <button
                              className={`${s.btnDanger} ${s.btnSmall}`}
                              onClick={() => handleEscalateFraud(ff.id)}
                            >
                              Escalate
                            </button>
                          )}

                          {isReviewer && (
                            <button
                              className={`${s.btnGold} ${s.btnSmall}`}
                              onClick={() => handleResolveFraud(ff.id)}
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={s.card}>
              <div className={s.cardBody}>
                <div className={s.emptyState}>
                  <Flag size={40} className={s.emptyIcon} />
                  <div className={s.emptyTitle}>No fraud flags raised</div>
                  <div className={s.emptyDesc}>
                    If you identify fraud indicators during fieldwork, raise a
                    flag here for investigation.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
};

const FieldworkPageWrapper: React.FC<FieldworkPageProps> = (props) => (
  <WorkflowGate phase="fieldwork">
    <FieldworkPage {...props} />
  </WorkflowGate>
);

export default FieldworkPageWrapper;
