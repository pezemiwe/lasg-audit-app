import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAuditStore } from "../../store/useAuditStore";
import { useSimulatedLoading } from "../../hooks/useSimulatedLoading";
import PageSkeleton from "../../components/UI/PageSkeleton";
import StateAGDashboard from "../../features/dashboard/components/StateAGDashboard";
import SupervisorDashboard from "../../features/dashboard/components/SupervisorDashboard";
import LeadDashboard from "../../features/dashboard/components/LeadDashboard";
import TeamAuditorDashboard from "../../features/dashboard/components/TeamAuditorDashboard";
import SystemAdminDashboard from "../../features/dashboard/components/SystemAdminDashboard";
import HLGDashboard from "../../features/dashboard/components/HLGDashboard";
import DefaultDashboard from "../../features/dashboard/components/DefaultDashboard";

const Dashboard: React.FC = () => {
  const isLoading = useSimulatedLoading(500);
  const { user } = useAuth();
  const navigate = useNavigate();
  const activityLog = useAuditStore((state) => state.activityLog);
  const audits = useAuditStore((state) => state.audits);
  const mandates = useAuditStore((state) => state.mandates);
  const letters = useAuditStore((state) => state.letters);
  const documentUploads = useAuditStore((state) => state.documentUploads);
  const reports = useAuditStore((state) => state.reports);

  const stageApprovals = useAuditStore((state) => state.stageApprovals);
  const controlTests = useAuditStore((state) => state.controlTests);
  const substantiveTests = useAuditStore((state) => state.substantiveTests);
  const fraudFlags = useAuditStore((state) => state.fraudFlags);
  const tasks = useAuditStore((state) => state.tasks);
  const programmes = useAuditStore((state) => state.programmes);
  const assignLeadFn = useAuditStore((state) => state.assignLead);
  const addToast = useAuditStore((state) => state.addToast);
  const [assigningLgaId, setAssigningLgaId] = React.useState<string | null>(
    null,
  );
  const [selectedLeadId, setSelectedLeadId] = React.useState<string>("");

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!user) return null;

  switch (user.role) {
    case "SYSTEM_ADMIN":
      return <SystemAdminDashboard activityLog={activityLog} />;
    case "STATE_AUDITOR_GENERAL":
      return (
        <StateAGDashboard
          audits={audits}
          fraudFlags={fraudFlags}
          navigate={navigate}
        />
      );
    case "AUDIT_SUPERVISOR":
      return (
        <SupervisorDashboard
          user={user}
          audits={audits}
          stageApprovals={stageApprovals}
          reports={reports}
          fraudFlags={fraudFlags}
          assigningLgaId={assigningLgaId}
          setAssigningLgaId={setAssigningLgaId}
          selectedLeadId={selectedLeadId}
          setSelectedLeadId={setSelectedLeadId}
          assignLeadFn={assignLeadFn}
          addToast={addToast}
        />
      );
    case "AUDIT_LEAD":
      return (
        <LeadDashboard
          user={user}
          audits={audits}
          tasks={tasks}
          controlTests={controlTests}
          substantiveTests={substantiveTests}
          fraudFlags={fraudFlags}
          reports={reports}
          programmes={programmes}
          stageApprovals={stageApprovals}
          mandates={mandates}
          navigate={navigate}
        />
      );
    case "TEAM_AUDITOR":
      return <TeamAuditorDashboard user={user} />;
    case "HEAD_OF_LOCAL_GOVERNMENT":
      return (
        <HLGDashboard
          user={user}
          documentUploads={documentUploads}
          letters={letters}
          mandates={mandates}
          audits={audits}
        />
      );
    default:
      return <DefaultDashboard user={user} />;
  }
};

export default Dashboard;
