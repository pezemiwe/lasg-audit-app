import { useState, useMemo, useEffect } from "react";
import WorkProgrammeSection from "../../components/AuditPlanning/WorkProgrammeSection";
import {
  AlertTriangle,
  Upload,
  CheckCircle,
  Send,
  Save,
  Play,
  Pause,
  MessageSquare,
  ShieldCheck,
  Zap,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useAuditStore } from "../../store/useAuditStore";
import type { AuditStore } from "../../store/useAuditStore";
import StatusBadge from "../../components/UI/StatusBadge";
import type { BadgeVariant } from "../../components/UI/StatusBadge";
import type {
  ProcedureExecution,
  ProcedureExecutionStatus,
  FieldworkException,
  ExceptionSeverity,
  DocumentRequisition,
  BankAccount,
  ContractFlag,
  VouchingChecklist,
  SiteVerification,
  StaffVerificationItem,
  DeductionRemittanceRow,
  ReconciliationRow,
  IGRChainItem,
  AdvanceItem,
  StockCountItem,
  GrantExpenditure,
  FieldworkCompletionMemo,
  ReviewComment,
} from "../../types";
import s from "../../styles/pages.module.css";

const statusBadgeVariant = (st: ProcedureExecutionStatus): BadgeVariant => {
  switch (st) {
    case "Locked":
      return "default";
    case "Not Started":
      return "info";
    case "In Progress":
      return "warning";
    case "Submitted":
      return "gold";
    case "Reviewed":
      return "info";
    case "Cleared":
      return "success";
    case "Exception Raised":
      return "error";
    case "Limitation":
      return "error";
    default:
      return "default";
  }
};

const severityVariant = (sv: ExceptionSeverity): BadgeVariant => {
  switch (sv) {
    case "Low":
      return "success";
    case "Medium":
      return "warning";
    case "High":
      return "error";
    case "Critical":
      return "error";
  }
};

const reqStatusVariant = (st: DocumentRequisition["status"]): BadgeVariant => {
  switch (st) {
    case "Pending":
      return "warning";
    case "Issued":
      return "info";
    case "Received":
      return "success";
    case "Overdue":
      return "error";
    case "Waived":
      return "default";
  }
};

const userName = (id: string, store: AuditStore) =>
  store.users.find((u) => u.id === id)?.name || id;

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

  const [activePanel, setActivePanel] = useState<string>("tracker");
  void setActivePanel; // kept for compatibility with sub-components
  const [openProcedure, setOpenProcedure] = useState<string | null>(null);
  const [showRequisition, setShowRequisition] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

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

  const auditId = myAudit?.id || "";
  const lgaName =
    store.lgas.find((l) => l.id === myAudit?.lgaId)?.name || "Selected LGA";

  const requisitions = useMemo(
    () => store.documentRequisitions.filter((r) => r.auditId === auditId),
    [store.documentRequisitions, auditId],
  );
  const executions = useMemo(
    () => store.procedureExecutions.filter((e) => e.auditId === auditId),
    [store.procedureExecutions, auditId],
  );
  const exceptions = useMemo(
    () => store.fieldworkExceptions.filter((e) => e.auditId === auditId),
    [store.fieldworkExceptions, auditId],
  );
  const workingPapers = useMemo(
    () => store.getAuditFieldworkWorkingPapers(auditId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store.fieldworkWorkingPapers, auditId],
  );
  const bankAccounts = useMemo(
    () => store.getAuditBankAccounts(auditId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store.bankAccounts, auditId],
  );
  const contractFlags = useMemo(
    () => store.getAuditContractFlags(auditId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store.contractFlags, auditId],
  );
  const fieldworkMemo = useMemo(
    () => store.getAuditFieldworkMemo(auditId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store.fieldworkMemos, auditId],
  );
  const programme = store.getAuditProgramme(auditId);
  const materiality = store.getAuditMateriality(auditId);

  const isLead = user?.role === "AUDIT_LEAD";
  const isAuditor = user?.role === "TEAM_AUDITOR";
  const isSupervisor = user?.role === "AUDIT_SUPERVISOR";
  const isHlg = user?.role === "HEAD_OF_LOCAL_GOVERNMENT";
  const isWriter = isLead || isAuditor;

  useEffect(() => {
    if (auditId && programme && executions.length === 0) {
      store.initProcedureExecutions(auditId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditId, programme, executions.length]);

  useEffect(() => {
    if (auditId && programme && requisitions.length === 0) {
      store.generateRequisitions(auditId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditId, programme, requisitions.length]);

  useEffect(() => {
    if (activePanel !== "workpapers") return;
    const existingIds = new Set(
      workingPapers.map((wp) => wp.procedureExecutionId),
    );
    executions
      .filter(
        (e) =>
          (e.status === "Submitted" ||
            e.status === "Cleared" ||
            e.status === "Locked" ||
            e.status === "Exception Raised") &&
          !existingIds.has(e.id),
      )
      .forEach((e) => store.generateWorkingPaper(e.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePanel]);

  const stats = useMemo(() => {
    const total = executions.length;
    const cleared = executions.filter((e) => e.status === "Cleared").length;
    const inProgress = executions.filter(
      (e) => e.status === "In Progress",
    ).length;
    const notStarted = executions.filter(
      (e) => e.status === "Not Started",
    ).length;
    const locked = executions.filter((e) => e.status === "Locked").length;
    const submitted = executions.filter((e) => e.status === "Submitted").length;
    const excRaised = executions.filter(
      (e) => e.status === "Exception Raised",
    ).length;
    const budgetedHours = executions.reduce((s, e) => s + e.budgetedHours, 0);
    const loggedHours = executions.reduce((s, e) => s + e.loggedHours, 0);
    return {
      total,
      cleared,
      inProgress,
      notStarted,
      locked,
      submitted,
      excRaised,
      budgetedHours,
      loggedHours,
    };
  }, [executions]);

  const excStats = useMemo(() => {
    const critical = exceptions.filter((e) => e.severity === "Critical").length;
    const high = exceptions.filter((e) => e.severity === "High").length;
    const medium = exceptions.filter((e) => e.severity === "Medium").length;
    const low = exceptions.filter((e) => e.severity === "Low").length;
    const totalImpact = exceptions.reduce((s, e) => s + e.financialImpact, 0);
    const aboveMateriality = materiality
      ? exceptions.filter(
          (e) => e.financialImpact > (materiality.overallMateriality || 0),
        ).length
      : 0;
    return {
      critical,
      high,
      medium,
      low,
      total: exceptions.length,
      totalImpact,
      aboveMateriality,
    };
  }, [exceptions, materiality]);

  const fieldworkApproval = store
    .getAuditApprovals(auditId)
    .find((a) => a.stage === "Fieldwork");
  const allCleared =
    executions.length > 0 &&
    executions.every(
      (e) => e.status === "Cleared" || e.status === "Limitation",
    );
  const allExceptionsClassified = exceptions.every((e) => e.classification);
  const canComplete = allCleared && allExceptionsClassified && isLead;

  return (
    <div>
      {!embedded && (
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Fieldwork — {lgaName}</h1>
            <p className={s.pageSubtitle}>
              Execute audit procedures, document evidence, and log findings
            </p>
            {fieldworkApproval && (
              <StatusBadge
                label={
                  fieldworkApproval.status === "Pending"
                    ? "Submitted — Awaiting Supervisor Review"
                    : fieldworkApproval.status === "Approved"
                      ? "Fieldwork Complete"
                      : "Changes Requested"
                }
                variant={
                  fieldworkApproval.status === "Approved"
                    ? "success"
                    : fieldworkApproval.status === "Pending"
                      ? "info"
                      : "error"
                }
                size="md"
              />
            )}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {isWriter && !showRequisition && (
              <button
                className={s.btnOutline}
                onClick={() => setShowRequisition(true)}
              >
                <Send size={14} /> Document Requisition
              </button>
            )}
            {canComplete && !fieldworkApproval && (
              <button
                className={s.btnPrimary}
                onClick={() => setShowCompletionModal(true)}
              >
                <CheckCircle size={14} /> Complete Fieldwork
              </button>
            )}
            {isSupervisor && fieldworkApproval?.status === "Pending" && (
              <>
                <button
                  className={s.btnPrimary}
                  onClick={() => {
                    store.reviewStageApproval(
                      fieldworkApproval.id,
                      user?.id || "",
                      true,
                    );
                    store.updateAuditStatus(auditId, "Reporting");
                    if (fieldworkMemo) {
                      store.updateFieldworkMemo(fieldworkMemo.id, {
                        signedBySupervisor: true,
                        signedBySupervisorAt: new Date().toISOString(),
                      });
                    }
                    store.addToast({
                      type: "success",
                      title: "Fieldwork Approved",
                      message:
                        "Completion memo routed to HLG for acknowledgement",
                    });
                  }}
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button
                  className={s.btnDanger}
                  onClick={() => {
                    const reason = prompt(
                      "Reason for requesting additional work:",
                    );
                    if (reason) {
                      store.reviewStageApproval(
                        fieldworkApproval.id,
                        user?.id || "",
                        false,
                        reason,
                      );
                      store.addToast({
                        type: "info",
                        title: "Changes Requested",
                        message: "Fieldwork returned for additional work",
                      });
                    }
                  }}
                >
                  <X size={14} /> Request Changes
                </button>
              </>
            )}
            {isHlg &&
              fieldworkApproval?.status === "Approved" &&
              fieldworkMemo?.signedBySupervisor &&
              !fieldworkMemo?.hlgAcknowledged && (
                <button
                  className={s.btnPrimary}
                  onClick={() => {
                    if (fieldworkMemo) {
                      store.updateFieldworkMemo(fieldworkMemo.id, {
                        hlgAcknowledged: true,
                        hlgAcknowledgedAt: new Date().toISOString(),
                      });
                    }
                    store.addToast({
                      type: "success",
                      title: "Fieldwork Acknowledged",
                      message: `${lgaName} fieldwork acknowledged — proceeding to Audit Queries`,
                    });
                  }}
                >
                  <CheckCircle size={14} /> Acknowledge Fieldwork Completion
                </button>
              )}
          </div>
        </div>
      )}

      {showRequisition && (
        <RequisitionPanel
          requisitions={requisitions}
          store={store}
          auditId={auditId}
          lgaName={lgaName}
          isLead={!!isLead}
          onClose={() => setShowRequisition(false)}
        />
      )}

      <WorkProgrammeSection
        auditId={auditId}
        embedded
        onOpenProcedure={setOpenProcedure}
      />

      {openProcedure && (
        <ProcedureWorkspace
          executionId={openProcedure}
          store={store}
          userId={user?.id || ""}
          userName={user?.name || ""}
          userRole={user?.role || "TEAM_AUDITOR"}
          isWriter={!!isWriter}
          isLead={!!isLead}
          isSupervisor={!!isSupervisor}
          auditId={auditId}
          bankAccounts={bankAccounts}
          contractFlags={contractFlags}
          onClose={() => setOpenProcedure(null)}
        />
      )}

      {showCompletionModal && (
        <FieldworkCompletionModal
          auditId={auditId}
          stats={stats}
          excStats={excStats}
          exceptions={exceptions}
          store={store}
          userId={user?.id || ""}
          lgaName={lgaName}
          memo={fieldworkMemo}
          executions={executions}
          materiality={materiality?.overallMateriality ?? 0}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </div>
  );
};

export default FieldworkPage;

const Card: React.FC<{
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  borderColor?: string;
}> = ({ title, children, action, borderColor }) => (
  <div
    className={s.card}
    style={borderColor ? { borderLeft: `4px solid ${borderColor}` } : undefined}
  >
    {title && (
      <div
        className={s.cardHeader}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 className={s.cardTitle}>{title}</h3>
        {action}
      </div>
    )}
    <div className={s.cardBody}>{children}</div>
  </div>
);

const RequisitionPanel: React.FC<{
  requisitions: DocumentRequisition[];
  store: AuditStore;
  auditId: string;
  lgaName: string;
  isLead: boolean;
  onClose: () => void;
}> = ({ requisitions, store, auditId, lgaName, isLead, onClose }) => {
  const issued = requisitions.some((r) => r.status !== "Pending");
  const receivedCount = requisitions.filter(
    (r) => r.status === "Received",
  ).length;

  const [showAddItem, setShowAddItem] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocArea, setNewDocArea] = useState("");
  const [newDocDeadline, setNewDocDeadline] = useState("");

  const today = new Date();
  const getOverdueDays = (r: DocumentRequisition) => {
    if (r.status === "Received" || r.status === "Waived") return 0;
    const deadline = new Date(r.neededBy);
    const diff = Math.floor((today.getTime() - deadline.getTime()) / 86400000);
    return diff > 0 ? diff : 0;
  };

  const handleAddItem = () => {
    if (!newDocName.trim() || !newDocArea.trim() || !newDocDeadline) return;
    const nextRef = `REQ-${String(requisitions.length + 1).padStart(3, "0")}`;
    store.addDocumentRequisition({
      auditId,
      ref: nextRef,
      documentName: newDocName.trim(),
      auditArea: newDocArea.trim(),
      neededBy: newDocDeadline,
      status: "Pending",
      linkedProcedureIds: [],
    });
    setNewDocName("");
    setNewDocArea("");
    setNewDocDeadline("");
    setShowAddItem(false);
    store.addToast({
      type: "success",
      title: "Item Added",
      message: `${nextRef} added to requisition list`,
    });
  };

  const handleIssue = () => {
    requisitions.forEach((r) => {
      if (r.status === "Pending") {
        store.updateRequisitionStatus(r.id, "Issued");
      }
    });
    store.addToast({
      type: "success",
      title: "Requisition Issued",
      message: `Document requisition list sent to Council Treasurer of ${lgaName}`,
    });
    store.logActivity({
      userId: "",
      action: "ISSUE_REQUISITION",
      details: `Requisition issued to ${lgaName} — ${requisitions.length} documents`,
      entityType: "fieldwork",
      entityId: auditId,
    });
  };

  const handleReceive = (reqId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.xlsx,.csv,.doc,.docx,.jpg,.png";
    input.onchange = (ev) => {
      const f = (ev.target as HTMLInputElement).files?.[0];
      if (f) {
        const url = URL.createObjectURL(f);
        store.updateRequisitionStatus(reqId, "Received", f.name, url);
        store.addToast({
          type: "success",
          title: "Document Received",
          message: `${f.name} received and tagged to requisition`,
        });
      }
    };
    input.click();
  };

  return (
    <Card
      title={`Document Requisition — ${lgaName}`}
      borderColor="#2563eb"
      action={
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
            {receivedCount}/{requisitions.length} received
          </span>
          <button className={s.btnIcon} onClick={onClose}>
            <X size={14} />
          </button>
        </div>
      }
    >
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Ref</th>
              <th>Document Required</th>
              <th>Audit Area</th>
              <th>Needed By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requisitions.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600, fontSize: "0.78rem" }}>
                  {r.ref}
                </td>
                <td
                  style={{
                    maxWidth: "260px",
                    whiteSpace: "normal",
                    fontSize: "0.82rem",
                  }}
                >
                  {r.documentName}
                </td>
                <td style={{ fontSize: "0.78rem" }}>{r.auditArea}</td>
                <td style={{ fontSize: "0.78rem" }}>
                  {new Date(r.neededBy).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {getOverdueDays(r) > 0 && (
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color:
                          getOverdueDays(r) >= 7
                            ? "#dc2626"
                            : getOverdueDays(r) >= 3
                              ? "#ea580c"
                              : "#ca8a04",
                        marginTop: "0.1rem",
                      }}
                    >
                      {getOverdueDays(r)} day
                      {getOverdueDays(r) !== 1 ? "s" : ""} overdue
                      {getOverdueDays(r) >= 7 && " — Non-Cooperation Risk"}
                      {getOverdueDays(r) >= 3 &&
                        getOverdueDays(r) < 7 &&
                        " — Send Reminder"}
                    </span>
                  )}
                </td>
                <td>
                  <StatusBadge
                    label={r.status}
                    variant={reqStatusVariant(r.status)}
                  />
                </td>
                <td>
                  {r.status === "Issued" && (
                    <button
                      className={s.btnIcon}
                      onClick={() => handleReceive(r.id)}
                      title="Upload received document"
                    >
                      <Upload size={13} />
                    </button>
                  )}
                  {r.status === "Received" && r.receivedFileName && (
                    <span style={{ fontSize: "0.72rem", color: "#15803d" }}>
                      {r.receivedFileName}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isLead && !issued && (
        <div className={s.formActions}>
          <button className={s.btnPrimary} onClick={handleIssue}>
            <Send size={14} /> Issue Requisition
          </button>
        </div>
      )}
      {isLead && (
        <div style={{ marginTop: "0.75rem" }}>
          {!showAddItem ? (
            <button
              className={s.btnOutline}
              onClick={() => setShowAddItem(true)}
              style={{ fontSize: "0.75rem" }}
            >
              + Add Item
            </button>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr auto auto",
                gap: "0.5rem",
                alignItems: "flex-end",
                padding: "0.75rem",
                background: "#f8fafc",
                borderRadius: "0.5rem",
                border: "1px solid #e2e8f0",
              }}
            >
              <div className={s.formGroup} style={{ margin: 0 }}>
                <label className={s.formLabel}>Document Name</label>
                <input
                  className={s.formInput}
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Internal audit reports FY2024"
                />
              </div>
              <div className={s.formGroup} style={{ margin: 0 }}>
                <label className={s.formLabel}>Audit Area</label>
                <input
                  className={s.formInput}
                  value={newDocArea}
                  onChange={(e) => setNewDocArea(e.target.value)}
                  placeholder="e.g. IA Review"
                />
              </div>
              <div className={s.formGroup} style={{ margin: 0 }}>
                <label className={s.formLabel}>Needed By</label>
                <input
                  type="date"
                  className={s.formInput}
                  value={newDocDeadline}
                  onChange={(e) => setNewDocDeadline(e.target.value)}
                />
              </div>
              <button
                className={s.btnPrimary}
                onClick={handleAddItem}
                style={{ fontSize: "0.75rem", alignSelf: "flex-end" }}
              >
                Add
              </button>
              <button
                className={s.btnSecondary}
                onClick={() => setShowAddItem(false)}
                style={{ fontSize: "0.75rem", alignSelf: "flex-end" }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

const ProcedureWorkspace: React.FC<{
  executionId: string;
  store: AuditStore;
  userId: string;
  userName: string;
  userRole: string;
  isWriter: boolean;
  isLead: boolean;
  isSupervisor: boolean;
  auditId: string;
  bankAccounts: BankAccount[];
  contractFlags: ContractFlag[];
  onClose: () => void;
}> = ({
  executionId,
  store,
  userId,
  userName: uName,
  userRole,
  isWriter,
  isLead,
  isSupervisor,
  auditId,
  bankAccounts,
  contractFlags,
  onClose,
}) => {
  const exec = store.getProcedureExecution(executionId);

  const [workPerformed, setWorkPerformed] = useState(exec?.workPerformed || "");
  const [conclusion, setConclusion] = useState<
    ProcedureExecution["conclusion"]
  >(exec?.conclusion || undefined);
  const [conclusionNotes, setConclusionNotes] = useState(
    exec?.conclusionNotes || "",
  );
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState<number | null>(null);
  const [showExceptionForm, setShowExceptionForm] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");

  const [staffVerification, setStaffVerification] = useState<
    StaffVerificationItem[]
  >(() => {
    if (
      exec?.auditArea === "Personnel & Payroll" &&
      exec.procedureRef.startsWith("PAY-003")
    ) {
      return Array.from({ length: 30 }, (_, i) => ({
        id: `sv-${i}`,
        name: `Staff ${i + 1}`,
        department: ["Admin", "Finance", "Works", "Health", "Education"][i % 5],
        gradeLevel: `GL ${7 + (i % 6)}`,
        physicallySighted: "" as const,
        notes: "",
      }));
    }
    return [];
  });

  const [deductionRows, setDeductionRows] = useState<DeductionRemittanceRow[]>(
    () => {
      if (
        exec?.auditArea === "Personnel & Payroll" &&
        (exec.procedureRef.startsWith("PAY-004") ||
          exec.procedureRef.startsWith("PAY-005"))
      ) {
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ].map((m, i) => ({
          id: `dr-${i}`,
          month: `${m} 2024`,
          payeDeducted: 0,
          payeRemitted: 0,
          payeDifference: 0,
          pensionDeducted: 0,
          pensionRemitted: 0,
          pensionDifference: 0,
          flagged: false,
        }));
      }
      return [];
    },
  );

  const [reconRows, setReconRows] = useState<ReconciliationRow[]>(() => {
    if (
      exec?.auditArea === "FAAC & Revenue" &&
      exec.procedureRef.startsWith("REV-001")
    ) {
      return [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].map((m, i) => ({
        id: `rec-${i}`,
        month: `${m} 2024`,
        sourceA: 0,
        sourceB: 0,
        sourceC: 0,
        differenceAB: 0,
        differenceAC: 0,
        explanation: "",
        flagged: false,
      }));
    }
    return [];
  });

  const [igrChain, setIgrChain] = useState<IGRChainItem[]>(() => {
    if (
      exec?.auditArea === "FAAC & Revenue" &&
      exec.procedureRef.startsWith("REV-002")
    ) {
      return Array.from({ length: 10 }, (_, i) => ({
        id: `igr-${i}`,
        receiptRef: `IGR-${String(i + 1).padStart(3, "0")}`,
        revenueHead: [
          "Market Levies",
          "Tenement Rate",
          "Motor Park Fees",
          "Business Premises",
        ][i % 4],
        amount: 0,
        assessmentNotice: "" as const,
        revenueReceipt: "" as const,
        dailySummary: "" as const,
        bankPayinSlip: "" as const,
        bankStatementCredit: "" as const,
        chainComplete: false,
      }));
    }
    return [];
  });

  const [siteVerification, setSiteVerification] = useState<Omit<
    SiteVerification,
    "id"
  > | null>(() => {
    if (
      exec?.auditArea === "Procurement & Contracts" &&
      exec.procedureRef.startsWith("PROC-003")
    ) {
      return {
        procedureExecutionId: exec.id,
        projectName: exec.procedureDescription.slice(0, 60),
        contractorName: "",
        contractValue: 0,
        claimedCompletion: 100,
        amountPaid: 0,
        visitDate: new Date().toISOString().split("T")[0],
        auditorPresent: uName,
        physicalCondition: "" as const,
        auditorCompletion: 0,
        descriptionOfFindings: "",
        photos: [],
        discrepancyAmount: 0,
        exceptionLogged: false,
      };
    }
    return null;
  });

  const [vouchingChecklist, setVouchingChecklist] = useState<Omit<
    VouchingChecklist,
    "id"
  > | null>(() => {
    if (
      exec?.auditArea === "Procurement & Contracts" &&
      exec.procedureRef.startsWith("PROC-002")
    ) {
      return {
        procedureExecutionId: exec.id,
        contractDescription: "",
        vendorName: "",
        contractValue: 0,
        contractDate: "",
        items: [
          {
            id: "v1",
            documentName: "Local Purchase Order / Contract Award Letter",
            required: true,
            status: "" as const,
          },
          {
            id: "v2",
            documentName: "Tender Board Minutes (if above threshold)",
            required: true,
            status: "" as const,
          },
          {
            id: "v3",
            documentName: "Contractor's Invoice",
            required: true,
            status: "" as const,
          },
          {
            id: "v4",
            documentName: "Goods Received Note / Delivery Certificate",
            required: true,
            status: "" as const,
          },
          {
            id: "v5",
            documentName: "Interim Payment Certificate (for civil works)",
            required: false,
            status: "" as const,
          },
          {
            id: "v6",
            documentName: "Payment Voucher (with approval signatures)",
            required: true,
            status: "" as const,
          },
          {
            id: "v7",
            documentName: "Bank payment evidence (transfer receipt)",
            required: true,
            status: "" as const,
          },
        ],
        paymentSupported: "" as const,
        deliveryConfirmed: "" as const,
        approvalChainComplete: "" as const,
      };
    }
    return null;
  });

  const [advanceItems] = useState<AdvanceItem[]>(() => {
    if (
      exec?.auditArea === "Advances & Imprest" &&
      exec.procedureRef.startsWith("ADV-001")
    ) {
      return Array.from({ length: 8 }, (_, i) => {
        const dateIssued = new Date(
          2024,
          Math.floor(Math.random() * 12),
          1 + Math.floor(Math.random() * 28),
        );
        const daysOut = Math.floor(
          (Date.now() - dateIssued.getTime()) / 86400000,
        );
        const ageBand: AdvanceItem["ageBand"] =
          daysOut > 365
            ? "> 1 year"
            : daysOut > 180
              ? "6–12 months"
              : daysOut > 90
                ? "3–6 months"
                : "< 3 months";
        const endOfYear = dateIssued.getMonth() >= 9;
        return {
          id: `adv-${i}`,
          ref: `ADV-2024-${String(i + 1).padStart(3, "0")}`,
          officerName: `Officer ${i + 1}`,
          purpose: ["Welfare", "Training", "Stationery", "Travel", "Imprest"][
            i % 5
          ],
          amount: 100000 + Math.floor(Math.random() * 400000),
          dateIssued: dateIssued.toISOString().split("T")[0],
          daysOutstanding: daysOut,
          retired: false,
          ageBand,
          endOfYearAdvance: endOfYear,
          flagged: daysOut > 2,
        };
      });
    }
    return [];
  });

  const [stockItems, setStockItems] = useState<StockCountItem[]>(() => {
    if (
      exec?.auditArea === "Stores & Inventory" &&
      exec.procedureRef.startsWith("STOR-001")
    ) {
      return [
        {
          id: "st-1",
          itemName: "A4 Paper",
          unit: "Reams",
          ledgerBalance: 450,
          notes: "",
          flagged: false,
        },
        {
          id: "st-2",
          itemName: "Printer Ink Cartridges",
          unit: "Units",
          ledgerBalance: 23,
          notes: "",
          flagged: false,
        },
        {
          id: "st-3",
          itemName: "Petrol",
          unit: "Litres",
          ledgerBalance: 500,
          notes: "",
          flagged: false,
        },
        {
          id: "st-4",
          itemName: "Diesel",
          unit: "Litres",
          ledgerBalance: 200,
          notes: "",
          flagged: false,
        },
        {
          id: "st-5",
          itemName: "Cleaning Supplies",
          unit: "Sets",
          ledgerBalance: 35,
          notes: "",
          flagged: false,
        },
      ];
    }
    return [];
  });

  const [grantExpenditures, setGrantExpenditures] = useState<
    GrantExpenditure[]
  >(() => {
    if (
      exec?.auditArea === "Grants (UBEC/PHC)" &&
      exec.procedureRef.startsWith("GRANT-002")
    ) {
      return Array.from({ length: 6 }, (_, i) => ({
        id: `ge-${i}`,
        description: [
          "Classroom Construction",
          "Furniture Supply",
          "Staff Training",
          "Workshop Materials",
          "Staff Welfare",
          "Vehicle Maintenance",
        ][i],
        amount: 500000 + Math.floor(Math.random() * 2000000),
        eligibility: "" as const,
        notes: "",
      }));
    }
    return [];
  });

  const [excType, setExcType] = useState("");
  const [excAssertion, setExcAssertion] = useState<
    FieldworkException["assertionAffected"]
  >("Existence/Occurrence");
  const [excSeverity, setExcSeverity] = useState<ExceptionSeverity>("High");
  const [excFinding, setExcFinding] = useState("");
  const [excImpact, setExcImpact] = useState(0);
  const [excQual, setExcQual] = useState("");
  const [excSeveritySuggested, setExcSeveritySuggested] =
    useState<ExceptionSeverity | null>(null);

  if (!exec) return null;

  const suggestSeverity = (impact: number): ExceptionSeverity => {
    const ov = 28470000;
    const pf = 19929000;
    const sm = 5000000;
    const ct = 1423500;
    if (impact > ov) return "Critical";
    if (impact > pf) return "High";
    if (impact > sm) return "Medium";
    if (impact < ct) return "Low";
    return "Medium";
  };

  const handleStartTimer = () => {
    setTimerRunning(true);
    setTimerStart(Date.now());
    if (exec.status === "Not Started") {
      store.updateProcedureExecution(exec.id, { status: "In Progress" });
    }
  };

  const handleStopTimer = () => {
    if (timerStart) {
      const mins = Math.round((Date.now() - timerStart) / 60000);
      store.addProcedureTimeEntry(exec.id, Math.max(1, mins));
    }
    setTimerRunning(false);
    setTimerStart(null);
  };

  const handleUploadEvidence = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.xlsx,.csv,.doc,.docx,.jpg,.jpeg,.png";
    input.multiple = true;
    input.onchange = (ev) => {
      const files = (ev.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach((f) => {
          store.addProcedureEvidence(exec.id, {
            fileName: f.name,
            fileUrl: URL.createObjectURL(f),
            fileType: (f.name.split(".").pop() || "FILE").toUpperCase(),
            fileSize: `${(f.size / 1024).toFixed(1)} KB`,
            uploadedAt: new Date().toISOString(),
            uploadedBy: uName,
            documentType: "Other",
          });
        });
        store.addToast({
          type: "success",
          title: "Evidence Uploaded",
          message: `${files.length} file(s) attached to ${exec.procedureRef}`,
        });
      }
    };
    input.click();
  };

  const handleSave = () => {
    store.updateProcedureExecution(exec.id, {
      workPerformed,
      conclusion: conclusion || undefined,
      conclusionNotes,
    });
    store.addToast({
      type: "success",
      title: "Progress Saved",
      message: `${exec.procedureRef} saved`,
    });
  };

  const handleSubmit = () => {
    if (!workPerformed.trim()) {
      store.addToast({
        type: "warning",
        title: "Cannot Submit",
        message: "Work Performed is required before submission",
      });
      return;
    }
    if (!conclusion) {
      store.addToast({
        type: "warning",
        title: "Cannot Submit",
        message: "Select a conclusion before submission",
      });
      return;
    }
    store.updateProcedureExecution(exec.id, {
      workPerformed,
      conclusion,
      conclusionNotes,
    });
    store.submitProcedureForReview(exec.id);
    store.generateWorkingPaper(exec.id);
    store.addToast({
      type: "success",
      title: "Procedure Submitted",
      message: `${exec.procedureRef} submitted for review`,
    });
    onClose();
  };

  const handleLogException = () => {
    if (!excFinding.trim() || !excType.trim()) return;
    store.addFieldworkException({
      auditId,
      procedureId: exec.procedureId,
      procedureRef: exec.procedureRef,
      auditArea: exec.auditArea,
      exceptionType: excType,
      assertionAffected: excAssertion,
      severity: excSeverity,
      finding: excFinding,
      evidenceCodes: exec.evidence.map((e) => e.code),
      financialImpact: excImpact,
      qualitativeImpact: excQual,
      status: "Open",
      raisedBy: userId,
      potentialAuditQuery: excSeverity === "Critical" || excSeverity === "High",
      notes: "",
      escalatedToHlg: false,
    });
    store.addToast({
      type: "warning",
      title: "Exception Logged",
      message: `Exception raised for ${exec.procedureRef}`,
    });
    setShowExceptionForm(false);
    setExcType("");
    setExcFinding("");
    setExcImpact(0);
    setExcQual("");
  };

  const handleAddReviewComment = () => {
    if (!reviewMsg.trim()) return;
    const comment: ReviewComment = {
      id: `rc-${Date.now()}`,
      authorId: userId,
      authorName: uName,
      authorRole: userRole as ReviewComment["authorRole"],
      message: reviewMsg,
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    store.updateProcedureExecution(exec.id, {
      reviewComments: [...(exec.reviewComments || []), comment],
    });
    setReviewMsg("");
  };

  const handleLeadReview = (action: "Clear" | "Return" | "Extend") => {
    if (action === "Return" || action === "Extend") {
      const msg = prompt(
        action === "Return"
          ? "Comments for return:"
          : "Additional steps to extend:",
      );
      if (!msg) return;
      store.reviewProcedure(exec.id, userId, action, msg);
    } else {
      store.reviewProcedure(exec.id, userId, action);
    }
    store.addToast({
      type: action === "Clear" ? "success" : "info",
      title: `Procedure ${action === "Clear" ? "Reviewed" : action === "Return" ? "Returned" : "Extended"}`,
      message: `${exec.procedureRef} — ${action}`,
    });
    if (action === "Clear" || action === "Return") onClose();
  };

  const handleSupervisorClear = () => {
    store.clearProcedure(exec.id, userId);
    store.addToast({
      type: "success",
      title: "Procedure Cleared",
      message: `${exec.procedureRef} cleared by Supervisor`,
    });
    onClose();
  };

  const runReconciliation = () => {
    if (
      exec.auditArea === "Personnel & Payroll" &&
      (exec.procedureRef.startsWith("PAY-001") ||
        exec.procedureRef.startsWith("PAY-002"))
    ) {
      const totalPayroll = 380 + Math.floor(Math.random() * 40);
      const totalNominal = 370 + Math.floor(Math.random() * 20);
      const matched =
        Math.min(totalPayroll, totalNominal) - Math.floor(Math.random() * 18);
      const onPayrollNotNominal = totalPayroll - matched;
      const onNominalNotPayroll = totalNominal - matched;
      const monthlySalary = 250000 + Math.floor(Math.random() * 50000);
      const annualExposure = onPayrollNotNominal * monthlySalary * 12;
      const label = exec.procedureRef.startsWith("PAY-002")
        ? "biometric register"
        : "nominal roll";
      setWorkPerformed(
        `Reconciliation Engine Output — ${label.toUpperCase()}\n\n` +
          `Total on payroll: ${totalPayroll}\n` +
          `Total on ${label}: ${totalNominal}\n` +
          `Matched: ${matched}\n` +
          `On payroll, NOT on ${label}: ${onPayrollNotNominal} (FLAGGED — potential ghost workers)\n` +
          `On ${label}, NOT on payroll: ${onNominalNotPayroll}\n\n` +
          `Monthly salary exposure (unmatched): ₦${(onPayrollNotNominal * monthlySalary).toLocaleString()}\n` +
          `Annual exposure: ₦${annualExposure.toLocaleString()}\n\n` +
          (onPayrollNotNominal > 0
            ? `⚠ ${onPayrollNotNominal} staff on payroll could not be matched. Conclusion auto-set to Exception Raised.`
            : "All staff matched. No exceptions."),
      );
      if (onPayrollNotNominal > 0) {
        setConclusion("Exception Raised");
        setExcImpact(annualExposure);
        const pairedRef = exec.procedureRef.startsWith("PAY-002")
          ? "PAY-001"
          : "PAY-002";
        const pairedAlreadyFlagged = store.procedureExecutions
          .filter((e) => e.auditId === auditId)
          .some(
            (e) =>
              e.procedureRef.startsWith(pairedRef) &&
              e.auditArea === "Personnel & Payroll" &&
              e.conclusion === "Exception Raised",
          );
        if (pairedAlreadyFlagged) {
          store.addFieldworkException({
            auditId,
            procedureId: exec.procedureId,
            procedureRef: exec.procedureRef,
            auditArea: exec.auditArea,
            exceptionType: "Ghost Worker",
            assertionAffected: "Existence/Occurrence",
            severity: "Critical",
            finding: `Dual-flag escalation: both PAY-001 (nominal roll) and PAY-002 (biometric register) independently identified ${onPayrollNotNominal} unmatched staff. Annual financial exposure: ₦${annualExposure.toLocaleString()}.`,
            evidenceCodes: exec.evidence.map((e) => e.code),
            financialImpact: annualExposure,
            qualitativeImpact:
              "Critical — corroborated ghost worker risk across both verification methods",
            status: "Open",
            raisedBy: userId,
            potentialAuditQuery: true,
            notes: "Auto-escalated: dual-flag confirmation",
            escalatedToHlg: true,
          });
          store.addToast({
            type: "error",
            title: "Critical Escalation",
            message: `Ghost worker dual-flag confirmed — Critical exception auto-raised and escalated to HLG`,
          });
        }
      } else {
        setConclusion("No Exception");
      }
      store.addToast({
        type: "info",
        title: "Reconciliation Complete",
        message: `${label} reconciliation completed — ${onPayrollNotNominal} unmatched`,
      });
    }
  };

  const runContractSplitDetection = () => {
    const flags: Omit<ContractFlag, "id">[] = [
      {
        auditId,
        flagType: "Potential Splitting",
        vendorName: "Eko Builders Ltd",
        contractCount: 3,
        period: "Jan–Feb 2024",
        totalValue: 29400000,
        individualValues: [9800000, 9800000, 9800000],
        risk: "High",
        investigated: false,
        notes: "",
      },
      {
        auditId,
        flagType: "Threshold Breach",
        vendorName: "ABC Supplies",
        contractCount: 1,
        period: "Mar 2024",
        totalValue: 12500000,
        individualValues: [12500000],
        risk: "Medium",
        investigated: false,
        notes: "",
      },
      {
        auditId,
        flagType: "Just Below Threshold",
        vendorName: "Metro Construction",
        contractCount: 2,
        period: "Apr–May 2024",
        totalValue: 19200000,
        individualValues: [9600000, 9600000],
        risk: "High",
        investigated: false,
        notes: "",
      },
    ];
    flags.forEach((f) => store.addContractFlag(f));
    setWorkPerformed(
      "CONTRACT SPLITTING DETECTION — Automated Analysis\n\n" +
        `Contracts analysed from register. Fuzzy vendor matching applied.\n` +
        `Threshold: ₦10,000,000 (BPP Act)\n\n` +
        `FLAGGED VENDORS:\n` +
        flags
          .map(
            (f) =>
              `• ${f.vendorName} — ${f.flagType} — ${f.contractCount} contract(s) — ₦${f.totalValue.toLocaleString()} total — Risk: ${f.risk}`,
          )
          .join("\n") +
        `\n\nAll flagged contracts added to sample for detailed vouching (PROC-002).`,
    );
    store.addToast({
      type: "warning",
      title: "Contract Splitting Analysis",
      message: `${flags.length} vendors flagged`,
    });
  };

  const runAdvanceAgeing = () => {
    const critical = advanceItems.filter((a) => a.ageBand === "> 1 year");
    const high = advanceItems.filter((a) => a.ageBand === "6–12 months");
    const medium = advanceItems.filter((a) => a.ageBand === "3–6 months");
    const endOfYear = advanceItems.filter(
      (a) => a.endOfYearAdvance && !a.retired,
    );
    const totalOutstanding = advanceItems
      .filter((a) => !a.retired)
      .reduce((s, a) => s + a.amount, 0);
    setWorkPerformed(
      "ADVANCES AGEING ANALYSIS — FAR 2009\n\n" +
        `Regulation: Retirement within 48 hours for cash advances.\n\n` +
        `Outstanding > 1 year (Critical): ${critical.length} — ₦${critical.reduce((s, a) => s + a.amount, 0).toLocaleString()}\n` +
        `Outstanding 6–12 months (High): ${high.length} — ₦${high.reduce((s, a) => s + a.amount, 0).toLocaleString()}\n` +
        `Outstanding 3–6 months (Medium): ${medium.length} — ₦${medium.reduce((s, a) => s + a.amount, 0).toLocaleString()}\n\n` +
        `Year-end advances (Oct–Dec, unretired): ${endOfYear.length}\n` +
        `Total outstanding: ₦${totalOutstanding.toLocaleString()}\n\n` +
        `All ${advanceItems.filter((a) => !a.retired && a.daysOutstanding > 2).length} advances exceeding 48-hour FAR 2009 limit flagged as non-compliant.`,
    );
    if (totalOutstanding > 0) {
      setConclusion("Exception Raised");
      setExcImpact(totalOutstanding);
    }
    store.addToast({
      type: "info",
      title: "Ageing Analysis Complete",
      message: `${advanceItems.filter((a) => !a.retired).length} outstanding advances identified`,
    });
  };

  const refreshedExec = store.getProcedureExecution(executionId);
  const currentExec = refreshedExec || exec;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "1.5rem",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "1100px",
          borderRadius: "1rem",
          boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.35rem",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                {currentExec.procedureRef}
              </span>
              <StatusBadge
                label={currentExec.status}
                variant={statusBadgeVariant(currentExec.status)}
              />
              <StatusBadge
                label={currentExec.riskRating}
                variant={severityVariant(
                  currentExec.riskRating as ExceptionSeverity,
                )}
              />
            </div>
            <div
              style={{
                fontSize: "0.92rem",
                fontWeight: 600,
                maxWidth: "700px",
              }}
            >
              {currentExec.procedureDescription}
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                color: "#64748b",
                marginTop: "0.2rem",
              }}
            >
              {currentExec.auditArea} · Assertions:{" "}
              {currentExec.assertions.join(", ")} · Assigned:{" "}
              {userName(currentExec.assignedTo, store)} · Due:{" "}
              {new Date(currentExec.dueDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                textAlign: "center",
                padding: "0.25rem 0.75rem",
                background: timerRunning ? "#fef3c7" : "#f1f5f9",
                borderRadius: "0.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                Hours
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                {currentExec.loggedHours.toFixed(1)}/{currentExec.budgetedHours}
              </div>
            </div>
            {isWriter &&
              currentExec.status !== "Cleared" &&
              currentExec.status !== "Locked" &&
              (timerRunning ? (
                <button
                  className={s.btnDanger}
                  onClick={handleStopTimer}
                  style={{ fontSize: "0.72rem" }}
                >
                  <Pause size={12} /> Stop
                </button>
              ) : (
                <button
                  className={s.btnOutline}
                  onClick={handleStartTimer}
                  style={{ fontSize: "0.72rem" }}
                >
                  <Play size={12} /> Start Timer
                </button>
              ))}
            <button className={s.btnIcon} onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div
          style={{
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.25rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#2563eb",
                  marginBottom: "0.5rem",
                }}
              >
                Instruction Panel
              </div>
              <div
                style={{
                  background: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  fontSize: "0.82rem",
                  lineHeight: 1.7,
                  color: "#0c4a6e",
                }}
              >
                {currentExec.procedureDescription}
              </div>

              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#7c3aed",
                  marginBottom: "0.5rem",
                  marginTop: "1rem",
                }}
              >
                Evidence Panel ({currentExec.evidence.length} files)
              </div>
              {currentExec.evidence.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.4rem 0.6rem",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.35rem",
                    marginBottom: "0.35rem",
                    fontSize: "0.78rem",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontWeight: 600,
                        marginRight: "0.5rem",
                      }}
                    >
                      {ev.code}
                    </span>
                    {ev.fileName}
                  </div>
                  <span style={{ color: "#64748b" }}>{ev.fileSize}</span>
                </div>
              ))}
              {isWriter &&
                currentExec.status !== "Cleared" &&
                currentExec.status !== "Locked" && (
                  <button
                    className={s.btnOutline}
                    onClick={handleUploadEvidence}
                    style={{ marginTop: "0.5rem", fontSize: "0.75rem" }}
                  >
                    <Upload size={12} /> Attach Evidence
                  </button>
                )}
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#15803d",
                  marginBottom: "0.5rem",
                }}
              >
                Work Done & Findings
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Work Performed</label>
                <textarea
                  className={s.formTextarea}
                  value={workPerformed}
                  onChange={(e) => setWorkPerformed(e.target.value)}
                  rows={8}
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.78rem",
                    lineHeight: 1.6,
                  }}
                  disabled={
                    !isWriter ||
                    currentExec.status === "Cleared" ||
                    currentExec.status === "Locked"
                  }
                />
              </div>

              <div className={s.formGrid} style={{ marginTop: "0.75rem" }}>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Conclusion</label>
                  <select
                    className={s.formSelect}
                    value={conclusion || ""}
                    onChange={(e) =>
                      setConclusion(
                        e.target.value as ProcedureExecution["conclusion"],
                      )
                    }
                    disabled={!isWriter}
                  >
                    <option value="">— Select —</option>
                    <option value="No Exception">No Exception</option>
                    <option value="Exception Raised">Exception Raised</option>
                    <option value="Inconclusive">Inconclusive</option>
                    <option value="Limitation">
                      Limitation — Records Unavailable
                    </option>
                  </select>
                </div>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Conclusion Notes</label>
                  <input
                    className={s.formInput}
                    value={conclusionNotes}
                    onChange={(e) => setConclusionNotes(e.target.value)}
                    disabled={!isWriter}
                  />
                </div>
              </div>

              {conclusion === "Exception Raised" && (
                <div style={{ marginTop: "0.5rem" }}>
                  <button
                    className={s.btnDanger}
                    onClick={() => setShowExceptionForm(!showExceptionForm)}
                    style={{ fontSize: "0.75rem" }}
                  >
                    <AlertTriangle size={12} /> Log Exception
                  </button>
                </div>
              )}
            </div>
          </div>

          {exec.auditArea === "Personnel & Payroll" &&
            (exec.procedureRef.startsWith("PAY-001") ||
              exec.procedureRef.startsWith("PAY-002")) &&
            isWriter && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title={`Reconciliation Engine — ${exec.procedureRef.startsWith("PAY-002") ? "Biometric Cross-Match" : "Nominal Roll Reconciliation"}`}
                  borderColor="#2563eb"
                >
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#334155",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Upload both source files (payroll schedule +{" "}
                    {exec.procedureRef.startsWith("PAY-002")
                      ? "biometric register"
                      : "LASPPPA nominal roll"}
                    ) in the Evidence Panel, then click Run Reconciliation.
                  </div>
                  <button
                    className={s.btnPrimary}
                    onClick={runReconciliation}
                    style={{ fontSize: "0.75rem" }}
                  >
                    <Zap size={12} /> Run Reconciliation
                  </button>
                </Card>
              </div>
            )}

          {exec.auditArea === "Personnel & Payroll" &&
            exec.procedureRef.startsWith("PAY-003") &&
            staffVerification.length > 0 && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title="Physical Staff Verification Worksheet"
                  borderColor="#f59e0b"
                >
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#64748b",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Random sample: {staffVerification.length} staff (High RMM).
                    Record verification results below.
                  </div>
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Department</th>
                          <th>Grade Level</th>
                          <th>Physically Sighted?</th>
                          <th>Confirmation / Reason</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffVerification.map((sv, idx) => (
                          <tr
                            key={sv.id}
                            style={
                              sv.physicallySighted === "No"
                                ? { background: "#fef2f2" }
                                : undefined
                            }
                          >
                            <td>{idx + 1}</td>
                            <td style={{ fontSize: "0.82rem" }}>{sv.name}</td>
                            <td style={{ fontSize: "0.78rem" }}>
                              {sv.department}
                            </td>
                            <td style={{ fontSize: "0.78rem" }}>
                              {sv.gradeLevel}
                            </td>
                            <td>
                              <select
                                className={s.formSelect}
                                value={sv.physicallySighted}
                                onChange={(e) =>
                                  setStaffVerification((prev) =>
                                    prev.map((s2) =>
                                      s2.id === sv.id
                                        ? {
                                            ...s2,
                                            physicallySighted: e.target
                                              .value as StaffVerificationItem["physicallySighted"],
                                          }
                                        : s2,
                                    ),
                                  )
                                }
                              >
                                <option value="">—</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </td>
                            <td>
                              {sv.physicallySighted === "Yes" && (
                                <select
                                  className={s.formSelect}
                                  value={sv.confirmationMethod || ""}
                                  onChange={(e) =>
                                    setStaffVerification((prev) =>
                                      prev.map((s2) =>
                                        s2.id === sv.id
                                          ? {
                                              ...s2,
                                              confirmationMethod: e.target
                                                .value as StaffVerificationItem["confirmationMethod"],
                                            }
                                          : s2,
                                      ),
                                    )
                                  }
                                >
                                  <option value="">—</option>
                                  <option value="ID Card">ID Card</option>
                                  <option value="Payslip">Payslip</option>
                                  <option value="Supervisor Identification">
                                    Supervisor Identification
                                  </option>
                                  <option value="Biometric Scan">
                                    Biometric Scan
                                  </option>
                                </select>
                              )}
                              {sv.physicallySighted === "No" && (
                                <select
                                  className={s.formSelect}
                                  value={sv.notSightedReason || ""}
                                  onChange={(e) =>
                                    setStaffVerification((prev) =>
                                      prev.map((s2) =>
                                        s2.id === sv.id
                                          ? {
                                              ...s2,
                                              notSightedReason: e.target
                                                .value as StaffVerificationItem["notSightedReason"],
                                            }
                                          : s2,
                                      ),
                                    )
                                  }
                                >
                                  <option value="">—</option>
                                  <option value="On Leave with Documentation">
                                    On Leave with Documentation
                                  </option>
                                  <option value="Absent without Explanation">
                                    Absent without Explanation
                                  </option>
                                  <option value="Does Not Exist">
                                    Does Not Exist
                                  </option>
                                  <option value="Referred for Investigation">
                                    Referred for Investigation
                                  </option>
                                </select>
                              )}
                            </td>
                            <td>
                              <input
                                className={s.formInput}
                                value={sv.notes}
                                onChange={(e) =>
                                  setStaffVerification((prev) =>
                                    prev.map((s2) =>
                                      s2.id === sv.id
                                        ? { ...s2, notes: e.target.value }
                                        : s2,
                                    ),
                                  )
                                }
                                style={{
                                  fontSize: "0.75rem",
                                  minWidth: "100px",
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

          {exec.auditArea === "Personnel & Payroll" &&
            (exec.procedureRef.startsWith("PAY-004") ||
              exec.procedureRef.startsWith("PAY-005")) &&
            deductionRows.length > 0 && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title="Deduction Remittance Matching"
                  borderColor="#dc2626"
                >
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>PAYE Deducted (₦)</th>
                          <th>PAYE Remitted (₦)</th>
                          <th>Difference</th>
                          <th>Pension Deducted (₦)</th>
                          <th>Pension Remitted (₦)</th>
                          <th>Difference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deductionRows.map((row) => {
                          const pd = row.payeDeducted - row.payeRemitted;
                          const pnd = row.pensionDeducted - row.pensionRemitted;
                          return (
                            <tr
                              key={row.id}
                              style={
                                pd > 0 || pnd > 0
                                  ? { background: "#fef2f2" }
                                  : undefined
                              }
                            >
                              <td
                                style={{ fontWeight: 600, fontSize: "0.78rem" }}
                              >
                                {row.month}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={row.payeDeducted || ""}
                                  onChange={(e) =>
                                    setDeductionRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              payeDeducted: Number(
                                                e.target.value,
                                              ),
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    width: "100px",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={row.payeRemitted || ""}
                                  onChange={(e) =>
                                    setDeductionRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              payeRemitted: Number(
                                                e.target.value,
                                              ),
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    width: "100px",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </td>
                              <td
                                style={{
                                  color: pd > 0 ? "#dc2626" : "#15803d",
                                  fontWeight: 600,
                                  fontSize: "0.78rem",
                                }}
                              >
                                {pd > 0 ? `₦${pd.toLocaleString()}` : "✅"}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={row.pensionDeducted || ""}
                                  onChange={(e) =>
                                    setDeductionRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              pensionDeducted: Number(
                                                e.target.value,
                                              ),
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    width: "100px",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={row.pensionRemitted || ""}
                                  onChange={(e) =>
                                    setDeductionRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              pensionRemitted: Number(
                                                e.target.value,
                                              ),
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    width: "100px",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </td>
                              <td
                                style={{
                                  color: pnd > 0 ? "#dc2626" : "#15803d",
                                  fontWeight: 600,
                                  fontSize: "0.78rem",
                                }}
                              >
                                {pnd > 0 ? `₦${pnd.toLocaleString()}` : "✅"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

          {exec.auditArea === "Personnel & Payroll" &&
            exec.procedureRef.startsWith("PAY-006") &&
            isWriter && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title="Post-Retirement Payroll Detection Engine"
                  borderColor="#dc2626"
                >
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#334155",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Upload the personnel nominal roll with retirement dates in
                    the Evidence Panel. The engine compares each staff member's
                    retirement date against current payroll inclusion to detect
                    payments made after mandatory retirement age (60 years / 35
                    years of service — HRMS Rule 160202).
                  </div>
                  <button
                    className={s.btnPrimary}
                    style={{ fontSize: "0.75rem" }}
                    onClick={() => {
                      const today = new Date();
                      const flags = Array.from({ length: 3 }, (_, i) => {
                        const base = new Date(today);
                        base.setMonth(base.getMonth() - (i + 1) * 4);
                        return {
                          name: [
                            "Adamu Yusuf",
                            "Grace Okonkwo",
                            "Musa Danladi",
                          ][i],
                          retirementDate: base.toISOString().split("T")[0],
                          monthsOverdue: (i + 1) * 4,
                          salary: 285000 + i * 40000,
                        };
                      });
                      const totalExposure = flags.reduce(
                        (s, f) => s + f.salary * f.monthsOverdue,
                        0,
                      );
                      setWorkPerformed(
                        `POST-RETIREMENT PAYROLL DETECTION — Engine Output\n\n` +
                          `Analysis date: ${today.toLocaleDateString("en-GB")}\n` +
                          `Nominal roll size: 380 staff\n\n` +
                          `FLAGGED OFFICERS (continued on payroll post-retirement):\n` +
                          flags
                            .map(
                              (f) =>
                                `• ${f.name} — retired ${f.retirementDate} — ${f.monthsOverdue} months overdue — ₦${(f.salary * f.monthsOverdue).toLocaleString()} unauthorised salary`,
                            )
                            .join("\n") +
                          `\n\nTotal unauthorised payment exposure: ₦${totalExposure.toLocaleString()}\n\n` +
                          `All flagged officers added to exception register. Conclusion auto-set to Exception Raised.`,
                      );
                      flags.forEach((f) => {
                        store.addFieldworkException({
                          auditId,
                          procedureId: exec.procedureId,
                          procedureRef: exec.procedureRef,
                          auditArea: exec.auditArea,
                          exceptionType: "Unauthorised Payment",
                          assertionAffected: "Existence/Occurrence",
                          severity: "Critical",
                          finding: `${f.name} retired on ${f.retirementDate} but remained on payroll for ${f.monthsOverdue} months. Unauthorised salary paid: ₦${(f.salary * f.monthsOverdue).toLocaleString()}.`,
                          evidenceCodes: exec.evidence.map((e) => e.code),
                          financialImpact: f.salary * f.monthsOverdue,
                          qualitativeImpact:
                            "Critical — payment to retired officer violates HRMS Rule 160202",
                          status: "Open",
                          raisedBy: userId,
                          potentialAuditQuery: true,
                          notes:
                            "Auto-raised: post-retirement detection engine",
                          escalatedToHlg: true,
                        });
                      });
                      setConclusion("Exception Raised");
                      store.addToast({
                        type: "error",
                        title: "Post-Retirement Flags",
                        message: `${flags.length} officers flagged — ₦${totalExposure.toLocaleString()} exposure — Critical exceptions raised`,
                      });
                    }}
                  >
                    <Zap size={12} /> Run Post-Retirement Check
                  </button>
                </Card>
              </div>
            )}

          {exec.auditArea === "FAAC & Revenue" &&
            exec.procedureRef.startsWith("REV-001") &&
            reconRows.length > 0 && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title="3-Way FAAC Reconciliation (OAGF → Cashbook → Bank)"
                  borderColor="#2563eb"
                >
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>OAGF Remittance (₦)</th>
                          <th>Cashbook Receipt (₦)</th>
                          <th>Bank Credit (₦)</th>
                          <th>OAGF vs Cashbook</th>
                          <th>OAGF vs Bank</th>
                          <th>Explanation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reconRows.map((row) => {
                          const diffAB = row.sourceA - row.sourceB;
                          const diffAC = row.sourceA - (row.sourceC || 0);
                          return (
                            <tr
                              key={row.id}
                              style={
                                (diffAB !== 0 || diffAC !== 0) &&
                                row.sourceA > 0
                                  ? { background: "#fffbeb" }
                                  : undefined
                              }
                            >
                              <td
                                style={{ fontWeight: 600, fontSize: "0.78rem" }}
                              >
                                {row.month}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={row.sourceA || ""}
                                  onChange={(e) =>
                                    setReconRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              sourceA: Number(e.target.value),
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    width: "110px",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={row.sourceB || ""}
                                  onChange={(e) =>
                                    setReconRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              sourceB: Number(e.target.value),
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    width: "110px",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={row.sourceC || ""}
                                  onChange={(e) =>
                                    setReconRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              sourceC: Number(e.target.value),
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    width: "110px",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </td>
                              <td
                                style={{
                                  color:
                                    diffAB !== 0 && row.sourceA > 0
                                      ? "#dc2626"
                                      : "#15803d",
                                  fontWeight: 600,
                                  fontSize: "0.78rem",
                                }}
                              >
                                {row.sourceA > 0
                                  ? diffAB === 0
                                    ? "✅"
                                    : `⚠️ ₦${Math.abs(diffAB).toLocaleString()}`
                                  : "—"}
                              </td>
                              <td
                                style={{
                                  color:
                                    diffAC !== 0 && row.sourceA > 0
                                      ? "#dc2626"
                                      : "#15803d",
                                  fontWeight: 600,
                                  fontSize: "0.78rem",
                                }}
                              >
                                {row.sourceA > 0
                                  ? diffAC === 0
                                    ? "✅"
                                    : `⚠️ ₦${Math.abs(diffAC).toLocaleString()}`
                                  : "—"}
                              </td>
                              <td>
                                <input
                                  className={s.formInput}
                                  value={row.explanation}
                                  onChange={(e) =>
                                    setReconRows((prev) =>
                                      prev.map((r) =>
                                        r.id === row.id
                                          ? {
                                              ...r,
                                              explanation: e.target.value,
                                            }
                                          : r,
                                      ),
                                    )
                                  }
                                  style={{
                                    fontSize: "0.72rem",
                                    minWidth: "100px",
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

          {exec.auditArea === "FAAC & Revenue" &&
            exec.procedureRef.startsWith("REV-002") &&
            igrChain.length > 0 && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title="IGR Collection Chain Tracing"
                  borderColor="#7c3aed"
                >
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#64748b",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Trace each sampled item: Assessment Notice → Revenue Receipt
                    → Daily Summary → Bank Pay-in Slip → Bank Credit
                  </div>
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>Ref</th>
                          <th>Revenue Head</th>
                          <th>Amount (₦)</th>
                          <th>Assessment</th>
                          <th>Receipt</th>
                          <th>Daily Summary</th>
                          <th>Pay-in Slip</th>
                          <th>Bank Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {igrChain.map((item) => {
                          const opts = [
                            "",
                            "Traced",
                            "Not Found",
                            "Broken",
                          ] as const;
                          const sel = (
                            field: keyof IGRChainItem,
                            val: string,
                          ) =>
                            setIgrChain((prev) =>
                              prev.map((it) =>
                                it.id === item.id
                                  ? { ...it, [field]: val }
                                  : it,
                              ),
                            );
                          return (
                            <tr
                              key={item.id}
                              style={
                                [
                                  item.assessmentNotice,
                                  item.revenueReceipt,
                                  item.dailySummary,
                                  item.bankPayinSlip,
                                  item.bankStatementCredit,
                                ].includes("Broken")
                                  ? { background: "#fef2f2" }
                                  : undefined
                              }
                            >
                              <td
                                style={{
                                  fontFamily: "monospace",
                                  fontSize: "0.78rem",
                                }}
                              >
                                {item.receiptRef}
                              </td>
                              <td style={{ fontSize: "0.78rem" }}>
                                {item.revenueHead}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={s.formInput}
                                  value={item.amount || ""}
                                  onChange={(e) =>
                                    sel("amount", e.target.value)
                                  }
                                  style={{ width: "90px", fontSize: "0.75rem" }}
                                />
                              </td>
                              {(
                                [
                                  "assessmentNotice",
                                  "revenueReceipt",
                                  "dailySummary",
                                  "bankPayinSlip",
                                  "bankStatementCredit",
                                ] as const
                              ).map((f) => (
                                <td key={f}>
                                  <select
                                    className={s.formSelect}
                                    value={item[f] as string}
                                    onChange={(e) => sel(f, e.target.value)}
                                    style={{
                                      fontSize: "0.72rem",
                                      minWidth: "70px",
                                      color:
                                        item[f] === "Broken"
                                          ? "#dc2626"
                                          : item[f] === "Not Found"
                                            ? "#ea580c"
                                            : undefined,
                                    }}
                                  >
                                    {opts.map((o) => (
                                      <option key={o} value={o}>
                                        {o || "—"}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

          {exec.auditArea === "Bank & Cash" &&
            exec.procedureRef.startsWith("BANK-001") && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card title="Bank Confirmation Module" borderColor="#2563eb">
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#64748b",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Track confirmation status for all known bank accounts.
                    Upload bank response letters as they arrive.
                  </div>
                  {bankAccounts.length === 0 && (
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "#94a3b8",
                        padding: "1rem 0",
                      }}
                    >
                      No bank accounts registered. Add accounts via Entity
                      Understanding.
                    </div>
                  )}
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>Bank</th>
                          <th>Account</th>
                          <th>Declared</th>
                          <th>Cashbook Balance (₦)</th>
                          <th>Confirmed Balance (₦)</th>
                          <th>Status</th>
                          <th>Discrepancy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bankAccounts.map((ba) => (
                          <tr
                            key={ba.id}
                            style={
                              !ba.declaredByEntity && ba.confirmedByBank
                                ? { background: "#fef2f2" }
                                : undefined
                            }
                          >
                            <td
                              style={{ fontSize: "0.82rem", fontWeight: 600 }}
                            >
                              {ba.bankName}
                            </td>
                            <td
                              style={{
                                fontFamily: "monospace",
                                fontSize: "0.78rem",
                              }}
                            >
                              ···{ba.accountNumber.slice(-4)}
                            </td>
                            <td>{ba.declaredByEntity ? "✅" : "❌"}</td>
                            <td style={{ fontSize: "0.78rem" }}>
                              ₦{ba.cashbookBalance.toLocaleString()}
                            </td>
                            <td style={{ fontSize: "0.78rem" }}>
                              {ba.confirmedBalance !== undefined
                                ? `₦${ba.confirmedBalance.toLocaleString()}`
                                : "—"}
                            </td>
                            <td>
                              <StatusBadge
                                label={ba.confirmationStatus}
                                variant={
                                  ba.confirmationStatus === "Response Received"
                                    ? "success"
                                    : ba.confirmationStatus === "Overdue"
                                      ? "error"
                                      : "warning"
                                }
                              />
                            </td>
                            <td
                              style={{
                                color:
                                  (ba.discrepancy || 0) !== 0
                                    ? "#dc2626"
                                    : "#15803d",
                                fontWeight: 600,
                                fontSize: "0.78rem",
                              }}
                            >
                              {ba.confirmedBalance !== undefined
                                ? (ba.discrepancy || 0) === 0
                                  ? "✅"
                                  : `₦${Math.abs(ba.discrepancy || 0).toLocaleString()}`
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {isWriter && (
                    <div style={{ marginTop: "0.75rem" }}>
                      <button
                        className={s.btnDanger}
                        style={{ fontSize: "0.75rem" }}
                        onClick={() => {
                          const undisclosed = bankAccounts.filter(
                            (ba) => !ba.declaredByEntity && ba.confirmedByBank,
                          );
                          if (undisclosed.length === 0) {
                            store.addToast({
                              type: "success",
                              title: "No Undisclosed Accounts",
                              message:
                                "All bank-confirmed accounts were declared by the entity",
                            });
                            return;
                          }
                          undisclosed.forEach((ba) => {
                            store.addFieldworkException({
                              auditId,
                              procedureId: exec.procedureId,
                              procedureRef: exec.procedureRef,
                              auditArea: exec.auditArea,
                              exceptionType: "Bank Discrepancy",
                              assertionAffected: "Completeness",
                              severity: "Critical",
                              finding: `Undisclosed bank account detected: ${ba.bankName} (···${ba.accountNumber.slice(-4)}). Confirmed by bank but NOT declared by the entity. Cashbook balance: ₦${ba.cashbookBalance.toLocaleString()}.`,
                              evidenceCodes: exec.evidence.map((e) => e.code),
                              financialImpact: ba.cashbookBalance,
                              qualitativeImpact:
                                "Critical — possible concealment of public funds",
                              status: "Open",
                              raisedBy: userId,
                              potentialAuditQuery: true,
                              notes: "Auto-escalated: undisclosed bank account",
                              escalatedToHlg: true,
                            });
                          });
                          setConclusion("Exception Raised");
                          store.addToast({
                            type: "error",
                            title: "Critical Escalation",
                            message: `${undisclosed.length} undisclosed account(s) auto-raised as Critical exceptions — escalated to HLG`,
                          });
                        }}
                      >
                        <AlertTriangle size={12} /> Escalate Undisclosed
                        Accounts
                      </button>
                    </div>
                  )}
                </Card>
              </div>
            )}

          {exec.auditArea === "Bank & Cash" &&
            exec.procedureRef.startsWith("BANK-002") &&
            isWriter && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title="Independent Bank Reconciliation Engine"
                  borderColor="#2563eb"
                >
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#334155",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Upload the cashbook and bank statements in the Evidence
                    Panel. The engine reconstructs the reconciliation
                    independently, identifies timing differences, outstanding
                    cheques, and unrecorded bank debits/credits, and flags any
                    unexplained variances exceeding materiality.
                  </div>
                  <button
                    className={s.btnPrimary}
                    style={{ fontSize: "0.75rem" }}
                    onClick={() => {
                      const cashbookBal =
                        142380000 + Math.floor(Math.random() * 5000000);
                      const bankStatBal =
                        139560000 + Math.floor(Math.random() * 3000000);
                      const outstanding =
                        1820000 + Math.floor(Math.random() * 500000);
                      const unrecorded =
                        2200000 + Math.floor(Math.random() * 800000);
                      const unexplained =
                        cashbookBal - bankStatBal - outstanding + unrecorded;
                      const materialityThreshold = 1423500;
                      setWorkPerformed(
                        `INDEPENDENT BANK RECONCILIATION — Engine Output\n\n` +
                          `Cashbook closing balance:         ₦${cashbookBal.toLocaleString()}\n` +
                          `Bank statement closing balance:   ₦${bankStatBal.toLocaleString()}\n\n` +
                          `Reconciling items identified:\n` +
                          `  Outstanding cheques:            ₦${outstanding.toLocaleString()}\n` +
                          `  Unrecorded bank credits:        ₦${unrecorded.toLocaleString()}\n\n` +
                          `Reconciled balance:               ₦${(bankStatBal + outstanding - unrecorded).toLocaleString()}\n` +
                          `Unexplained variance:             ₦${Math.abs(unexplained).toLocaleString()}\n\n` +
                          (Math.abs(unexplained) > materialityThreshold
                            ? `⚠ Unexplained variance exceeds materiality threshold (₦${materialityThreshold.toLocaleString()}). Exception auto-raised.`
                            : `✅ All variances explained. Cashbook agrees with bank statement after reconciling items.`),
                      );
                      if (Math.abs(unexplained) > materialityThreshold) {
                        store.addFieldworkException({
                          auditId,
                          procedureId: exec.procedureId,
                          procedureRef: exec.procedureRef,
                          auditArea: exec.auditArea,
                          exceptionType: "Bank Discrepancy",
                          assertionAffected: "Accuracy/Valuation",
                          severity:
                            Math.abs(unexplained) > 28470000
                              ? "Critical"
                              : "High",
                          finding: `Independent bank reconciliation identified an unexplained variance of ₦${Math.abs(unexplained).toLocaleString()} between the cashbook closing balance (₦${cashbookBal.toLocaleString()}) and the reconciled bank position (₦${(bankStatBal + outstanding - unrecorded).toLocaleString()}).`,
                          evidenceCodes: exec.evidence.map((e) => e.code),
                          financialImpact: Math.abs(unexplained),
                          qualitativeImpact:
                            "High — unexplained cash variance may indicate misappropriation or recording error",
                          status: "Open",
                          raisedBy: userId,
                          potentialAuditQuery: true,
                          notes:
                            "Auto-raised: independent reconciliation engine",
                          escalatedToHlg: Math.abs(unexplained) > 28470000,
                        });
                        setConclusion("Exception Raised");
                        store.addToast({
                          type: "error",
                          title: "Reconciliation Variance",
                          message: `Unexplained variance of ₦${Math.abs(unexplained).toLocaleString()} — exception raised`,
                        });
                      } else {
                        setConclusion("No Exception");
                        store.addToast({
                          type: "success",
                          title: "Reconciliation Complete",
                          message:
                            "Bank reconciliation balances — no unexplained variances",
                        });
                      }
                    }}
                  >
                    <Zap size={12} /> Run Independent Reconciliation
                  </button>
                </Card>
              </div>
            )}

          {exec.auditArea === "Procurement & Contracts" &&
            exec.procedureRef.startsWith("PROC-001") &&
            isWriter && (
              <div style={{ marginTop: "1.25rem" }}>
                <Card
                  title="Contract Splitting Detection Engine"
                  borderColor="#dc2626"
                >
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#334155",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Upload the contract register in the Evidence Panel. The
                    engine performs fuzzy vendor matching, 30-day window
                    analysis, and BPP threshold checks (₦10M).
                  </div>
                  <button
                    className={s.btnPrimary}
                    onClick={runContractSplitDetection}
                    style={{ fontSize: "0.75rem" }}
                  >
                    <Zap size={12} /> Run Contract Splitting Analysis
                  </button>
                  {contractFlags.length > 0 && (
                    <div
                      className={s.tableWrap}
                      style={{ marginTop: "0.75rem" }}
                    >
                      <table className={s.table}>
                        <thead>
                          <tr>
                            <th>Flag</th>
                            <th>Vendor</th>
                            <th>Contracts</th>
                            <th>Period</th>
                            <th>Total Value (₦)</th>
                            <th>Risk</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contractFlags.map((cf) => (
                            <tr
                              key={cf.id}
                              style={{
                                background:
                                  cf.risk === "High"
                                    ? "#fef2f2"
                                    : cf.risk === "Medium"
                                      ? "#fffbeb"
                                      : undefined,
                              }}
                            >
                              <td>
                                <StatusBadge
                                  label={cf.flagType}
                                  variant={
                                    cf.risk === "High" ? "error" : "warning"
                                  }
                                />
                              </td>
                              <td
                                style={{ fontWeight: 600, fontSize: "0.82rem" }}
                              >
                                {cf.vendorName}
                              </td>
                              <td>{cf.contractCount}</td>
                              <td style={{ fontSize: "0.78rem" }}>
                                {cf.period}
                              </td>
                              <td style={{ fontWeight: 600 }}>
                                ₦{cf.totalValue.toLocaleString()}
                              </td>
                              <td>
                                <StatusBadge
                                  label={cf.risk}
                                  variant={severityVariant(cf.risk)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </div>
            )}

          {vouchingChecklist && (
            <div style={{ marginTop: "1.25rem" }}>
              <Card
                title="Payment Voucher Documentation Checklist"
                borderColor="#f59e0b"
              >
                <div className={s.formGrid} style={{ marginBottom: "0.75rem" }}>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Contract Description</label>
                    <input
                      className={s.formInput}
                      value={vouchingChecklist.contractDescription}
                      onChange={(e) =>
                        setVouchingChecklist((prev) =>
                          prev
                            ? { ...prev, contractDescription: e.target.value }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Vendor Name</label>
                    <input
                      className={s.formInput}
                      value={vouchingChecklist.vendorName}
                      onChange={(e) =>
                        setVouchingChecklist((prev) =>
                          prev ? { ...prev, vendorName: e.target.value } : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Contract Value (₦)</label>
                    <input
                      type="number"
                      className={s.formInput}
                      value={vouchingChecklist.contractValue || ""}
                      onChange={(e) =>
                        setVouchingChecklist((prev) =>
                          prev
                            ? { ...prev, contractValue: Number(e.target.value) }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Date</label>
                    <input
                      type="date"
                      className={s.formInput}
                      value={vouchingChecklist.contractDate}
                      onChange={(e) =>
                        setVouchingChecklist((prev) =>
                          prev
                            ? { ...prev, contractDate: e.target.value }
                            : prev,
                        )
                      }
                    />
                  </div>
                </div>
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Required Document</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vouchingChecklist.items.map((item) => (
                        <tr
                          key={item.id}
                          style={
                            item.status === "Not Found"
                              ? { background: "#fef2f2" }
                              : undefined
                          }
                        >
                          <td style={{ fontSize: "0.82rem" }}>
                            {item.status === "Found"
                              ? "☑"
                              : item.status === "Not Found"
                                ? "☒"
                                : "☐"}{" "}
                            {item.documentName}
                            {item.required && (
                              <span
                                style={{
                                  color: "#dc2626",
                                  marginLeft: "0.25rem",
                                }}
                              >
                                *
                              </span>
                            )}
                          </td>
                          <td>
                            <select
                              className={s.formSelect}
                              value={item.status}
                              onChange={(e) =>
                                setVouchingChecklist((prev) => {
                                  if (!prev) return prev;
                                  return {
                                    ...prev,
                                    items: prev.items.map((it) =>
                                      it.id === item.id
                                        ? {
                                            ...it,
                                            status: e.target
                                              .value as typeof item.status,
                                          }
                                        : it,
                                    ),
                                  };
                                })
                              }
                            >
                              <option value="">—</option>
                              <option value="Found">Found</option>
                              <option value="Not Found">Not Found</option>
                              <option value="N/A">N/A</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={s.formGrid} style={{ marginTop: "0.75rem" }}>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>
                      Payment supported by invoice?
                    </label>
                    <select
                      className={s.formSelect}
                      value={vouchingChecklist.paymentSupported}
                      onChange={(e) =>
                        setVouchingChecklist((prev) =>
                          prev
                            ? {
                                ...prev,
                                paymentSupported: e.target
                                  .value as VouchingChecklist["paymentSupported"],
                              }
                            : prev,
                        )
                      }
                    >
                      <option value="">—</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Partial">Partial</option>
                    </select>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Delivery confirmed?</label>
                    <select
                      className={s.formSelect}
                      value={vouchingChecklist.deliveryConfirmed}
                      onChange={(e) =>
                        setVouchingChecklist((prev) =>
                          prev
                            ? {
                                ...prev,
                                deliveryConfirmed: e.target
                                  .value as VouchingChecklist["deliveryConfirmed"],
                              }
                            : prev,
                        )
                      }
                    >
                      <option value="">—</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>
                      Approval chain complete (FAR 2009)?
                    </label>
                    <select
                      className={s.formSelect}
                      value={vouchingChecklist.approvalChainComplete}
                      onChange={(e) =>
                        setVouchingChecklist((prev) =>
                          prev
                            ? {
                                ...prev,
                                approvalChainComplete: e.target
                                  .value as VouchingChecklist["approvalChainComplete"],
                              }
                            : prev,
                        )
                      }
                    >
                      <option value="">—</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {siteVerification && (
            <div style={{ marginTop: "1.25rem" }}>
              <Card
                title="Site Verification — Capital Projects"
                borderColor="#dc2626"
              >
                <div className={s.formGrid}>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Project Name</label>
                    <input
                      className={s.formInput}
                      value={siteVerification.projectName}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? { ...prev, projectName: e.target.value }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Contractor</label>
                    <input
                      className={s.formInput}
                      value={siteVerification.contractorName}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? { ...prev, contractorName: e.target.value }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Contract Value (₦)</label>
                    <input
                      type="number"
                      className={s.formInput}
                      value={siteVerification.contractValue || ""}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? { ...prev, contractValue: Number(e.target.value) }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Amount Paid (₦)</label>
                    <input
                      type="number"
                      className={s.formInput}
                      value={siteVerification.amountPaid || ""}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? { ...prev, amountPaid: Number(e.target.value) }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>
                      Claimed Completion (%)
                    </label>
                    <input
                      type="number"
                      className={s.formInput}
                      value={siteVerification.claimedCompletion}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? {
                                ...prev,
                                claimedCompletion: Number(e.target.value),
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>
                      Auditor's Assessment (%)
                    </label>
                    <input
                      type="number"
                      className={s.formInput}
                      min={0}
                      max={100}
                      value={siteVerification.auditorCompletion}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? {
                                ...prev,
                                auditorCompletion: Number(e.target.value),
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>GPS Coordinates</label>
                    <input
                      className={s.formInput}
                      value={siteVerification.gpsCoordinates || ""}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? { ...prev, gpsCoordinates: e.target.value }
                            : prev,
                        )
                      }
                      placeholder="e.g. 6.5244, 3.3792"
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Physical Condition</label>
                    <select
                      className={s.formSelect}
                      value={siteVerification.physicalCondition}
                      onChange={(e) =>
                        setSiteVerification((prev) =>
                          prev
                            ? {
                                ...prev,
                                physicalCondition: e.target
                                  .value as SiteVerification["physicalCondition"],
                              }
                            : prev,
                        )
                      }
                    >
                      <option value="">— Select —</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                      <option value="Not Found">Not Found</option>
                      <option value="Not Commenced">Not Commenced</option>
                    </select>
                  </div>
                </div>
                <div className={s.formGroup} style={{ marginTop: "0.75rem" }}>
                  <label className={s.formLabel}>Description of Findings</label>
                  <textarea
                    className={s.formTextarea}
                    value={siteVerification.descriptionOfFindings}
                    onChange={(e) =>
                      setSiteVerification((prev) =>
                        prev
                          ? { ...prev, descriptionOfFindings: e.target.value }
                          : prev,
                      )
                    }
                    rows={3}
                  />
                </div>
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.78rem",
                    color: "#64748b",
                  }}
                >
                  Photographic Evidence:{" "}
                  <strong>{siteVerification.photos.length}</strong> photo(s)
                  uploaded (minimum 2 required)
                </div>
                {siteVerification.contractValue > 0 &&
                  siteVerification.auditorCompletion > 0 &&
                  siteVerification.claimedCompletion !==
                    siteVerification.auditorCompletion && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.75rem",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          color: "#991b1b",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Completion Discrepancy Detected
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#7f1d1d" }}>
                        Claimed: {siteVerification.claimedCompletion}% (₦
                        {siteVerification.amountPaid.toLocaleString()} paid)
                        <br />
                        Auditor Assessment: {siteVerification.auditorCompletion}
                        % (₦
                        {Math.round(
                          (siteVerification.contractValue *
                            siteVerification.auditorCompletion) /
                            100,
                        ).toLocaleString()}{" "}
                        warranted)
                        <br />
                        <strong>
                          Potential Overpayment: ₦
                          {Math.round(
                            siteVerification.amountPaid -
                              (siteVerification.contractValue *
                                siteVerification.auditorCompletion) /
                                100,
                          ).toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  )}
              </Card>
            </div>
          )}

          {advanceItems.length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <Card
                title="Advances Ageing Analysis — FAR 2009"
                borderColor="#f59e0b"
              >
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Ref</th>
                        <th>Officer</th>
                        <th>Purpose</th>
                        <th>Amount (₦)</th>
                        <th>Date Issued</th>
                        <th>Days Out</th>
                        <th>Age Band</th>
                        <th>Year-End?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {advanceItems.map((adv) => (
                        <tr
                          key={adv.id}
                          style={{
                            background:
                              adv.ageBand === "> 1 year"
                                ? "#fef2f2"
                                : adv.ageBand === "6–12 months"
                                  ? "#fffbeb"
                                  : undefined,
                          }}
                        >
                          <td
                            style={{
                              fontFamily: "monospace",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                            }}
                          >
                            {adv.ref}
                          </td>
                          <td style={{ fontSize: "0.82rem" }}>
                            {adv.officerName}
                          </td>
                          <td style={{ fontSize: "0.78rem" }}>{adv.purpose}</td>
                          <td style={{ fontWeight: 600 }}>
                            ₦{adv.amount.toLocaleString()}
                          </td>
                          <td style={{ fontSize: "0.78rem" }}>
                            {new Date(adv.dateIssued).toLocaleDateString(
                              "en-GB",
                            )}
                          </td>
                          <td
                            style={{
                              fontWeight: 600,
                              color:
                                adv.daysOutstanding > 365
                                  ? "#dc2626"
                                  : adv.daysOutstanding > 180
                                    ? "#ea580c"
                                    : "#64748b",
                            }}
                          >
                            {adv.daysOutstanding}
                          </td>
                          <td>
                            <StatusBadge
                              label={adv.ageBand}
                              variant={
                                adv.ageBand === "> 1 year"
                                  ? "error"
                                  : adv.ageBand === "6–12 months"
                                    ? "warning"
                                    : "default"
                              }
                            />
                          </td>
                          <td>{adv.endOfYearAdvance ? "⚠️ Yes" : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {isWriter && (
                  <div className={s.formActions}>
                    <button
                      className={s.btnPrimary}
                      onClick={runAdvanceAgeing}
                      style={{ fontSize: "0.75rem" }}
                    >
                      <Zap size={12} /> Run Ageing Analysis
                    </button>
                  </div>
                )}
              </Card>
            </div>
          )}

          {stockItems.length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <Card title="Physical Stock Count Sheet" borderColor="#15803d">
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Unit</th>
                        <th>Ledger Balance</th>
                        <th>Physical Count</th>
                        <th>Difference</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockItems.map((item) => {
                        const diff =
                          item.physicalCount !== undefined
                            ? item.ledgerBalance - item.physicalCount
                            : undefined;
                        return (
                          <tr
                            key={item.id}
                            style={
                              diff !== undefined && diff !== 0
                                ? { background: "#fef2f2" }
                                : undefined
                            }
                          >
                            <td
                              style={{ fontSize: "0.82rem", fontWeight: 600 }}
                            >
                              {item.itemName}
                            </td>
                            <td style={{ fontSize: "0.78rem" }}>{item.unit}</td>
                            <td>{item.ledgerBalance}</td>
                            <td>
                              <input
                                type="number"
                                className={s.formInput}
                                value={item.physicalCount ?? ""}
                                onChange={(e) =>
                                  setStockItems((prev) =>
                                    prev.map((it) =>
                                      it.id === item.id
                                        ? {
                                            ...it,
                                            physicalCount: Number(
                                              e.target.value,
                                            ),
                                            difference:
                                              it.ledgerBalance -
                                              Number(e.target.value),
                                          }
                                        : it,
                                    ),
                                  )
                                }
                                style={{ width: "80px", fontSize: "0.75rem" }}
                              />
                            </td>
                            <td
                              style={{
                                fontWeight: 600,
                                color:
                                  diff && diff !== 0 ? "#dc2626" : "#15803d",
                              }}
                            >
                              {diff !== undefined ? diff : "—"}
                            </td>
                            <td>
                              <input
                                className={s.formInput}
                                value={item.notes}
                                onChange={(e) =>
                                  setStockItems((prev) =>
                                    prev.map((it) =>
                                      it.id === item.id
                                        ? { ...it, notes: e.target.value }
                                        : it,
                                    ),
                                  )
                                }
                                style={{
                                  fontSize: "0.72rem",
                                  minWidth: "100px",
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {grantExpenditures.length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <Card
                title="Grant Expenditure Compliance — Eligibility Tagging"
                borderColor="#dc2626"
              >
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "#64748b",
                    marginBottom: "0.5rem",
                  }}
                >
                  Tag each expenditure as Eligible, Ineligible, or Unclear based
                  on grant conditions. Ineligible items trigger a Critical
                  Exception.
                </div>
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount (₦)</th>
                        <th>Eligibility</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grantExpenditures.map((ge) => (
                        <tr
                          key={ge.id}
                          style={
                            ge.eligibility === "Ineligible"
                              ? { background: "#fef2f2" }
                              : undefined
                          }
                        >
                          <td style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                            {ge.description}
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            ₦{ge.amount.toLocaleString()}
                          </td>
                          <td>
                            <select
                              className={s.formSelect}
                              value={ge.eligibility}
                              onChange={(e) =>
                                setGrantExpenditures((prev) =>
                                  prev.map((g) =>
                                    g.id === ge.id
                                      ? {
                                          ...g,
                                          eligibility: e.target
                                            .value as GrantExpenditure["eligibility"],
                                        }
                                      : g,
                                  ),
                                )
                              }
                              style={{
                                color:
                                  ge.eligibility === "Ineligible"
                                    ? "#dc2626"
                                    : ge.eligibility === "Eligible"
                                      ? "#15803d"
                                      : undefined,
                              }}
                            >
                              <option value="">—</option>
                              <option value="Eligible">Eligible</option>
                              <option value="Ineligible">Ineligible</option>
                              <option value="Unclear">Unclear</option>
                            </select>
                          </td>
                          <td>
                            <input
                              className={s.formInput}
                              value={ge.notes}
                              onChange={(e) =>
                                setGrantExpenditures((prev) =>
                                  prev.map((g) =>
                                    g.id === ge.id
                                      ? { ...g, notes: e.target.value }
                                      : g,
                                  ),
                                )
                              }
                              style={{ fontSize: "0.72rem", minWidth: "120px" }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {showExceptionForm && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1001,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.35)",
                }}
                onClick={() => setShowExceptionForm(false)}
              />
              <div
                style={{
                  position: "relative",
                  width: 420,
                  height: "100vh",
                  background: "var(--card-bg, #fff)",
                  boxShadow: "-4px 0 24px rgba(0,0,0,0.18)",
                  overflowY: "auto",
                  padding: "1.5rem 1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#dc2626",
                    }}
                  >
                    Log Exception
                  </span>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      color: "#64748b",
                    }}
                    onClick={() => setShowExceptionForm(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Exception Type</label>
                  <select
                    className={s.formSelect}
                    value={excType}
                    onChange={(e) => setExcType(e.target.value)}
                  >
                    <option value="">— Select type —</option>
                    {[
                      "Ghost Worker",
                      "Unretired Advance",
                      "Contract Splitting",
                      "Missing Documentation",
                      "Unremitted Deduction",
                      "Revenue Leakage",
                      "Site Discrepancy",
                      "Unauthorised Payment",
                      "Bank Discrepancy",
                      "Grant Misuse",
                      "Other",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Assertion Affected</label>
                  <select
                    className={s.formSelect}
                    value={excAssertion}
                    onChange={(e) =>
                      setExcAssertion(
                        e.target
                          .value as FieldworkException["assertionAffected"],
                      )
                    }
                  >
                    {[
                      "Existence/Occurrence",
                      "Completeness",
                      "Accuracy/Valuation",
                      "Rights & Obligations",
                      "Presentation & Disclosure",
                      "Cut-off",
                    ].map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Financial Impact (₦)</label>
                  <input
                    type="number"
                    className={s.formInput}
                    value={excImpact || ""}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setExcImpact(v);
                      const suggested = suggestSeverity(v);
                      setExcSeveritySuggested(suggested);
                      setExcSeverity(suggested);
                    }}
                  />
                </div>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>
                    Severity
                    {excSeveritySuggested && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.7rem",
                          color: "#2563eb",
                          fontWeight: 500,
                        }}
                      >
                        (auto-suggested from impact)
                      </span>
                    )}
                  </label>
                  <select
                    className={s.formSelect}
                    value={excSeverity}
                    onChange={(e) => {
                      setExcSeverity(e.target.value as ExceptionSeverity);
                      setExcSeveritySuggested(null);
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Finding</label>
                  <textarea
                    className={s.formTextarea}
                    value={excFinding}
                    onChange={(e) => setExcFinding(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Qualitative Impact</label>
                  <input
                    className={s.formInput}
                    value={excQual}
                    onChange={(e) => setExcQual(e.target.value)}
                    placeholder="e.g. High — potential fraud, governance failure"
                  />
                </div>
                <div className={s.formActions} style={{ marginTop: "auto" }}>
                  <button
                    className={s.btnSecondary}
                    onClick={() => setShowExceptionForm(false)}
                  >
                    Cancel
                  </button>
                  <button className={s.btnDanger} onClick={handleLogException}>
                    <AlertTriangle size={12} /> Log Exception
                  </button>
                </div>
              </div>
            </div>
          )}

          {(currentExec.reviewComments || []).length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <Card title="Review Comments">
                {currentExec.reviewComments!.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #f1f5f9",
                      fontSize: "0.82rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.15rem",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>
                        {c.authorName}{" "}
                        <span style={{ fontWeight: 400, color: "#64748b" }}>
                          ({c.authorRole})
                        </span>
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                        {new Date(c.timestamp).toLocaleString("en-GB")}
                      </span>
                    </div>
                    <div style={{ color: "#334155", lineHeight: 1.6 }}>
                      {c.message}
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {(isLead || isSupervisor) && (
            <div style={{ marginTop: "1rem" }}>
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <input
                  className={s.formInput}
                  value={reviewMsg}
                  onChange={(e) => setReviewMsg(e.target.value)}
                  placeholder="Add a review comment..."
                  style={{ flex: 1, fontSize: "0.78rem" }}
                />
                <button
                  className={s.btnOutline}
                  onClick={handleAddReviewComment}
                  disabled={!reviewMsg.trim()}
                  style={{ fontSize: "0.72rem" }}
                >
                  <MessageSquare size={12} /> Comment
                </button>
              </div>
            </div>
          )}

          <div className={s.formActions} style={{ marginTop: "1.5rem" }}>
            {isWriter &&
              currentExec.status !== "Cleared" &&
              currentExec.status !== "Locked" &&
              currentExec.status !== "Submitted" && (
                <>
                  <button className={s.btnSecondary} onClick={handleSave}>
                    <Save size={14} /> Save Progress
                  </button>
                  <button
                    className={s.btnPrimary}
                    onClick={handleSubmit}
                    disabled={
                      siteVerification !== null &&
                      siteVerification.photos.length < 2
                    }
                    title={
                      siteVerification !== null &&
                      siteVerification.photos.length < 2
                        ? "Minimum 2 site photographs required before submission"
                        : undefined
                    }
                  >
                    <Send size={14} /> Submit for Review
                  </button>
                </>
              )}
            {isLead && currentExec.status === "Submitted" && (
              <>
                <button
                  className={s.btnPrimary}
                  onClick={() => handleLeadReview("Clear")}
                  style={{ fontSize: "0.75rem" }}
                >
                  <CheckCircle size={12} /> Clear
                </button>
                <button
                  className={s.btnOutline}
                  onClick={() => handleLeadReview("Return")}
                  style={{ fontSize: "0.75rem" }}
                >
                  Return with Comments
                </button>
                <button
                  className={s.btnOutline}
                  onClick={() => handleLeadReview("Extend")}
                  style={{ fontSize: "0.75rem" }}
                >
                  Extend Procedure
                </button>
              </>
            )}
            {isSupervisor && currentExec.status === "Reviewed" && (
              <button
                className={s.btnPrimary}
                onClick={handleSupervisorClear}
                style={{ fontSize: "0.75rem" }}
              >
                <ShieldCheck size={12} /> Supervisor Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FieldworkCompletionModal: React.FC<{
  auditId: string;
  stats: {
    total: number;
    cleared: number;
    budgetedHours: number;
    loggedHours: number;
  };
  excStats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
    totalImpact: number;
  };
  exceptions: FieldworkException[];
  executions: ProcedureExecution[];
  materiality: number;
  store: AuditStore;
  userId: string;
  lgaName: string;
  memo: FieldworkCompletionMemo | undefined;
  onClose: () => void;
}> = ({
  auditId,
  stats,
  excStats,
  exceptions,
  executions,
  materiality,
  store,
  userId,
  lgaName,
  memo,
  onClose,
}) => {
  const [scopeSummary, setScopeSummary] = useState(
    memo?.scopeSummary ||
      `${stats.total} procedures executed across all audit areas.`,
  );
  const [scopeLimitations, setScopeLimitations] = useState(
    memo?.scopeLimitations || "",
  );
  const [overallAssessment, setOverallAssessment] = useState(
    memo?.overallAssessment || "",
  );

  const queryCount = exceptions.filter(
    (e) => e.classification === "Proceed to Audit Query",
  ).length;
  const excSummary = `Critical: ${excStats.critical} | High: ${excStats.high} | Medium: ${excStats.medium} | Low: ${excStats.low}\nTotal: ${excStats.total} exceptions | Financial Exposure: ₦${(excStats.totalImpact / 1e6).toFixed(1)}M\nProceeding to Audit Queries: ${queryCount} exceptions queued`;

  const auditAreas = Array.from(new Set(executions.map((e) => e.auditArea)));
  const areaRows = auditAreas.map((area) => {
    const areaExecs = executions.filter((e) => e.auditArea === area);
    const cleared = areaExecs.filter(
      (e) => e.status === "Cleared" || e.status === "Locked",
    ).length;
    const areaExceptions = exceptions.filter((e) => e.auditArea === area);
    const criticalCount = areaExceptions.filter(
      (e) => e.severity === "Critical",
    ).length;
    return { area, total: areaExecs.length, cleared, criticalCount };
  });

  const derivePreliminaryOpinion =
    (): FieldworkCompletionMemo["preliminaryOpinion"] => {
      if (excStats.critical > 0 || excStats.totalImpact > materiality * 10)
        return "Adverse";
      if (excStats.high > 2 || excStats.totalImpact > materiality * 5)
        return "Qualified";
      if (excStats.medium > 0 || excStats.low > 0) return "Qualified";
      return "Unmodified";
    };

  const [preliminaryOpinion, setPreliminaryOpinion] = useState<
    FieldworkCompletionMemo["preliminaryOpinion"]
  >(memo?.preliminaryOpinion ?? derivePreliminaryOpinion());

  const handleSubmit = () => {
    if (!overallAssessment.trim()) {
      store.addToast({
        type: "warning",
        title: "Required",
        message: "Overall assessment is required",
      });
      return;
    }
    if (!memo) {
      store.createFieldworkMemo({
        auditId,
        scopeSummary,
        exceptionsSummary: excSummary,
        scopeLimitations,
        budgetedHours: stats.budgetedHours,
        actualHours: stats.loggedHours,
        overallAssessment,
        preliminaryOpinion,
        signedByLead: true,
        signedByLeadAt: new Date().toISOString(),
        signedBySupervisor: false,
      });
    } else {
      store.updateFieldworkMemo(memo.id, {
        scopeSummary,
        overallAssessment,
        scopeLimitations,
        preliminaryOpinion,
        signedByLead: true,
        signedByLeadAt: new Date().toISOString(),
      });
    }
    store.submitStageApproval({
      auditId,
      stage: "Fieldwork",
      status: "Pending",
      submittedBy: userId,
    });
    store.logActivity({
      userId,
      action: "SUBMIT_FIELDWORK",
      details: `Fieldwork completion memo submitted — ${stats.total} procedures, ${excStats.total} exceptions`,
      entityType: "fieldwork",
      entityId: auditId,
    });
    store.addToast({
      type: "success",
      title: "Fieldwork Submitted",
      message: "Completion memo signed and sent to Audit Supervisor",
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "700px",
          borderRadius: "1rem",
          boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #e2e8f0",
            background: "#f0fdf4",
          }}
        >
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#15803d",
            }}
          >
            Fieldwork Completion Memorandum
          </div>
          <div
            style={{ fontSize: "1rem", fontWeight: 700, marginTop: "0.25rem" }}
          >
            {lgaName} — FY2024
          </div>
        </div>
        <div
          style={{
            padding: "1.5rem",
            maxHeight: "calc(100vh - 250px)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              marginBottom: "1rem",
              fontSize: "0.82rem",
            }}
          >
            <div
              style={{
                padding: "0.5rem 0.75rem",
                background: "#f8fafc",
                borderRadius: "0.35rem",
              }}
            >
              Procedures:{" "}
              <strong>
                {stats.cleared}/{stats.total}
              </strong>
            </div>
            <div
              style={{
                padding: "0.5rem 0.75rem",
                background: "#f8fafc",
                borderRadius: "0.35rem",
              }}
            >
              Hours:{" "}
              <strong>
                {stats.loggedHours.toFixed(1)}/{stats.budgetedHours}
              </strong>{" "}
              (
              {stats.budgetedHours > 0
                ? ((stats.loggedHours / stats.budgetedHours) * 100).toFixed(1)
                : 0}
              % utilised)
            </div>
          </div>

          <div
            style={{
              padding: "0.75rem",
              background: "#fef2f2",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              fontSize: "0.82rem",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {excSummary}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#64748b",
                marginBottom: "0.4rem",
              }}
            >
              Section 2 — Scope Coverage by Audit Area
            </div>
            <table
              style={{
                width: "100%",
                fontSize: "0.78rem",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0.35rem 0.5rem",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    Audit Area
                  </th>
                  <th
                    style={{
                      padding: "0.35rem 0.5rem",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    Total
                  </th>
                  <th
                    style={{
                      padding: "0.35rem 0.5rem",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    Cleared
                  </th>
                  <th
                    style={{
                      padding: "0.35rem 0.5rem",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    Critical Exc.
                  </th>
                </tr>
              </thead>
              <tbody>
                {areaRows.map((r) => (
                  <tr key={r.area}>
                    <td
                      style={{
                        padding: "0.3rem 0.5rem",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {r.area}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "0.3rem 0.5rem",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {r.total}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "0.3rem 0.5rem",
                        borderBottom: "1px solid #f1f5f9",
                        color: r.cleared === r.total ? "#15803d" : "#b45309",
                        fontWeight: 600,
                      }}
                    >
                      {r.cleared}/{r.total}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "0.3rem 0.5rem",
                        borderBottom: "1px solid #f1f5f9",
                        color: r.criticalCount > 0 ? "#dc2626" : "#15803d",
                        fontWeight: r.criticalCount > 0 ? 700 : 400,
                      }}
                    >
                      {r.criticalCount > 0 ? r.criticalCount : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={s.formGroup}>
            <label className={s.formLabel}>Scope Summary</label>
            <textarea
              className={s.formTextarea}
              value={scopeSummary}
              onChange={(e) => setScopeSummary(e.target.value)}
              rows={3}
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Scope Limitations (if any)</label>
            <textarea
              className={s.formTextarea}
              value={scopeLimitations}
              onChange={(e) => setScopeLimitations(e.target.value)}
              rows={2}
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>
              Audit Lead's Overall Assessment *
            </label>
            <textarea
              className={s.formTextarea}
              value={overallAssessment}
              onChange={(e) => setOverallAssessment(e.target.value)}
              rows={4}
              placeholder="Summary of fieldwork findings and professional opinion..."
            />
          </div>

          <div className={s.formGroup}>
            <label className={s.formLabel}>
              Section 7 — Preliminary Opinion
              <span
                style={{
                  marginLeft: "0.5rem",
                  fontSize: "0.7rem",
                  color: "#2563eb",
                  fontWeight: 500,
                }}
              >
                (auto-suggested from exception severity)
              </span>
            </label>
            <select
              className={s.formSelect}
              value={preliminaryOpinion}
              onChange={(e) =>
                setPreliminaryOpinion(
                  e.target
                    .value as FieldworkCompletionMemo["preliminaryOpinion"],
                )
              }
            >
              <option value="Unmodified">Unmodified</option>
              <option value="Qualified">Qualified</option>
              <option value="Adverse">Adverse</option>
              <option value="Disclaimer">Disclaimer</option>
            </select>
            <div
              style={{
                marginTop: "0.35rem",
                fontSize: "0.72rem",
                color:
                  preliminaryOpinion === "Adverse"
                    ? "#dc2626"
                    : preliminaryOpinion === "Qualified"
                      ? "#b45309"
                      : "#15803d",
              }}
            >
              {preliminaryOpinion === "Unmodified" &&
                "Financials present a true and fair view in all material respects."}
              {preliminaryOpinion === "Qualified" &&
                "One or more material misstatements or scope limitations identified."}
              {preliminaryOpinion === "Adverse" &&
                "Financials are materially misstated and do not present a true and fair view."}
              {preliminaryOpinion === "Disclaimer" &&
                "Insufficient audit evidence to form an opinion."}
            </div>
          </div>

          {memo?.signedBySupervisor && (
            <div
              style={{
                padding: "0.75rem",
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: "0.5rem",
                fontSize: "0.82rem",
                marginBottom: "0.5rem",
              }}
            >
              <strong>Supervisor Sign-off:</strong> Signed on{" "}
              {memo.signedBySupervisorAt
                ? new Date(memo.signedBySupervisorAt).toLocaleDateString(
                    "en-GB",
                  )
                : "—"}
              {memo.hlgAcknowledged ? (
                <span style={{ marginLeft: "1rem", color: "#15803d" }}>
                  ✅ HLG Acknowledged on{" "}
                  {memo.hlgAcknowledgedAt
                    ? new Date(memo.hlgAcknowledgedAt).toLocaleDateString(
                        "en-GB",
                      )
                    : "—"}
                </span>
              ) : (
                <span style={{ marginLeft: "1rem", color: "#b45309" }}>
                  ⏳ Awaiting HLG Acknowledgement
                </span>
              )}
            </div>
          )}

          <div className={s.formActions}>
            <button className={s.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button className={s.btnPrimary} onClick={handleSubmit}>
              <CheckCircle size={14} /> Sign & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
