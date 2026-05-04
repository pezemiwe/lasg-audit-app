import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, Send, X } from "lucide-react";
import WorkProgrammeSection from "../../components/AuditPlanning/WorkProgrammeSection";
import StatusBadge from "../../components/UI/StatusBadge";
import { useFieldworkAudit } from "../../features/fieldwork/hooks/useFieldworkAudit";
import { useFieldworkStats } from "../../features/fieldwork/hooks/useFieldworkStats";
import RequisitionPanel from "../../features/fieldwork/components/RequisitionPanel";
import ProcedureWorkspace from "../../features/fieldwork/components/ProcedureWorkspace";
import FieldworkCompletionModal from "../../features/fieldwork/components/FieldworkCompletionModal";
import s from "../../styles/pages.module.css";

interface FieldworkPageProps {
  auditId?: string;
  embedded?: boolean;
}

const FieldworkPage: React.FC<FieldworkPageProps> = ({
  auditId: propAuditId,
  embedded,
}) => {
  const {
    user,
    store,
    auditId,
    lgaName,
    isLead,
    isSupervisor,
    isHlg,
    isWriter,
  } = useFieldworkAudit(propAuditId);

  const [activePanel, setActivePanel] = useState<string>("tracker");
  void setActivePanel; // kept for compatibility with sub-components
  const [openProcedure, setOpenProcedure] = useState<string | null>(null);
  const [showRequisition, setShowRequisition] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

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

  const { stats, excStats } = useFieldworkStats(
    executions,
    exceptions,
    materiality,
  );

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
            <h1 className={s.pageTitle}>Fieldwork: {lgaName}</h1>
            <p className={s.pageSubtitle}>
              Execute audit procedures, document evidence, and log findings
            </p>
            {fieldworkApproval && (
              <StatusBadge
                label={
                  fieldworkApproval.status === "Pending"
                    ? "Submitted: Awaiting Supervisor Review"
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
                      message: `${lgaName} fieldwork acknowledged; proceeding to Audit Queries`,
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
