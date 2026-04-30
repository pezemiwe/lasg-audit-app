import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import ReportsListView from "../../features/reports/components/ReportsListView";
import ReportCreateView from "../../features/reports/components/ReportCreateView";
import ReportDetailView from "../../features/reports/components/ReportDetailView";

const ReportsPage: React.FC<{ auditId?: string; embedded?: boolean }> = ({
  auditId: propAuditId,
  embedded,
}) => {
  const { user } = useAuth();
  const reports = useAuditStore((st) => st.reports);
  const audits = useAuditStore((st) => st.audits);
  const lgas = useAuditStore((st) => st.lgas);
  const submitReport = useAuditStore((st) => st.submitReport);
  const reviewReport = useAuditStore((st) => st.reviewReport);
  const openModal = useAuditStore((st) => st.openModal);
  const addToast = useAuditStore((st) => st.addToast);
  const logActivity = useAuditStore((st) => st.logActivity);

  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const myAudit = useMemo(() => {
    if (!user) return null;
    if (propAuditId) return audits.find((a) => a.id === propAuditId) || null;
    const myLga = lgas.find(
      (l) => l.auditLeadId === user.id || l.id === user.lgaId,
    );
    return audits.find((a) => a.lgaId === myLga?.id) || audits[0];
  }, [user, audits, lgas, propAuditId]);

  const myReports = useMemo(() => {
    if (propAuditId) return reports.filter((r) => r.auditId === propAuditId);
    if (
      user?.role === "AUDIT_SUPERVISOR" ||
      user?.role === "STATE_AUDITOR_GENERAL"
    )
      return reports;
    if (user?.role === "HEAD_OF_LOCAL_GOVERNMENT") {
      return reports.filter(
        (r) =>
          r.status === "Approved" ||
          r.status === "Under Review" ||
          r.status === "Final",
      );
    }
    if (!myAudit) return reports;
    return reports.filter((r) => r.auditId === myAudit.id);
  }, [reports, myAudit, user, propAuditId]);

  const selectedReport = useMemo(
    () => reports.find((r) => r.id === selectedId),
    [reports, selectedId],
  );

  const getLgaForAudit = (auditId: string) => {
    const audit = audits.find((a) => a.id === auditId);
    return lgas.find((l) => l.id === audit?.lgaId)?.name || "—";
  };

  const handleSubmit = (reportId: string) => {
    openModal({
      title: "Submit Report",
      message:
        "Submit this audit report for supervisory review? The assigned supervisor will be notified.",
      confirmText: "Submit Report",
      variant: "info",
      onConfirm: () => {
        submitReport(reportId);
        addToast({ type: "success", title: "Report Submitted" });
      },
    });
  };

  const handleReview = (reportId: string, approved: boolean) => {
    if (!user) return;
    openModal({
      title: approved ? "Approve Report" : "Request Revision",
      message: approved
        ? "Approve this draft report? It will be sent to the Council Head for Management Response."
        : "Request revisions on this report? The audit lead will be notified to make corrections.",
      confirmText: approved ? "Approve" : "Request Revision",
      variant: approved ? "info" : "warning",
      onConfirm: () => {
        reviewReport(reportId, user.id, approved);
        if (approved) {
          addToast({
            type: "success",
            title: "Report Approved: Awaiting Management Response",
            message: "The HLGA will now respond to each finding",
          });
          logActivity({
            userId: user.id,
            action: "APPROVE_DRAFT_REPORT",
            details: "Draft report approved, sent for management response",
            entityType: "report",
            entityId: reportId,
          });
        } else {
          addToast({
            type: "warning",
            title: "Revision Requested",
          });
        }
      },
    });
  };

  if (view === "detail" && selectedReport) {
    return (
      <ReportDetailView
        report={selectedReport}
        onBack={() => setView("list")}
        getLgaForAudit={getLgaForAudit}
        onSubmit={handleSubmit}
        onReview={handleReview}
      />
    );
  }

  if (view === "create") {
    return (
      <ReportCreateView
        onBack={() => setView("list")}
        getLgaForAudit={getLgaForAudit}
      />
    );
  }

  return (
    <ReportsListView
      embedded={embedded}
      myReports={myReports}
      getLgaForAudit={getLgaForAudit}
      onCreate={() => setView("create")}
      onView={(id) => {
        setSelectedId(id);
        setView("detail");
      }}
      onSubmit={handleSubmit}
      onReview={handleReview}
      onRespond={(id) => {
        setSelectedId(id);
        setView("detail");
      }}
    />
  );
};

const ReportsPageWrapper: React.FC<{
  auditId?: string;
  embedded?: boolean;
}> = (props) => <ReportsPage {...props} />;

export default ReportsPageWrapper;
