import React from "react";
import { MapPin, Users, CheckCircle, AlertTriangle } from "lucide-react";
import { ZONES, LGAS, MOCK_USERS } from "../../../mock/data";
import type {
  User,
  Audit,
  StageApproval,
  AuditReport,
  FraudFlag,
} from "../../../types";
import s from "../../../styles/pages.module.css";

interface SupervisorDashboardProps {
  user: User;
  audits: Audit[];
  stageApprovals: StageApproval[];
  reports: AuditReport[];
  fraudFlags: FraudFlag[];
  assigningLgaId: string | null;
  setAssigningLgaId: (id: string | null) => void;
  selectedLeadId: string;
  setSelectedLeadId: (id: string) => void;
  assignLeadFn: (
    lgaId: string,
    leadId: string,
    auditId: string,
    mandateId: string,
  ) => void;
  addToast: (toast: {
    type: "success" | "error" | "info" | "warning";
    title: string;
    message?: string;
  }) => void;
}

const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  user,
  audits,
  stageApprovals,
  reports,
  fraudFlags,
  assigningLgaId,
  setAssigningLgaId,
  selectedLeadId,
  setSelectedLeadId,
  assignLeadFn,
  addToast,
}) => {
  const leads = MOCK_USERS.filter((u) => u.role === "AUDIT_LEAD");
  const myZone = ZONES.find((z) => z.id === user.zoneId);
  const myLGAs = LGAS.filter((l) => myZone?.lgas.includes(l.id));
  const zoneLgaIds = myLGAs.map((l) => l.id);
  const zoneAudits = audits.filter((a) => zoneLgaIds.includes(a.lgaId));
  const pendingApprovals = stageApprovals.filter(
    (sa) =>
      sa.status === "Pending" && zoneAudits.some((a) => a.id === sa.auditId),
  );
  const pendingReports = reports.filter(
    (r) =>
      (r.status === "Submitted" || r.status === "Under Review") &&
      zoneAudits.some((a) => a.id === r.auditId),
  );
  const zoneFraudFlags = fraudFlags.filter(
    (f) =>
      (f.status === "Open" || f.status === "Escalated") &&
      zoneAudits.some((a) => a.id === f.auditId),
  );

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Zone: {myZone?.name || "Unassigned"}</h1>
          <p className={s.pageSubtitle}>
            Supervising {myLGAs.length} Council{myLGAs.length > 1 ? "s" : ""} (
            {
              myLGAs.filter((l) => !l.councilType || l.councilType === "LGA")
                .length
            }{" "}
            LGAs, {myLGAs.filter((l) => l.councilType === "LCDA").length} LCDAs)
            ) for audit oversight and team allocation
          </p>
        </div>
        <span className={s.pageBadge}>
          <Users size={12} /> Supervisor
        </span>
      </div>

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <MapPin size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Zone Audits</div>
            <div className={s.kpiValue}>{zoneAudits.length}</div>
            <div className={s.kpiMeta}>
              {zoneAudits.filter((a) => a.status !== "Completed").length} active
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Leads Assigned</div>
            <div className={s.kpiValue}>
              {myLGAs.filter((l) => l.auditLeadId).length}
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Pending Approvals</div>
            <div className={s.kpiValue}>
              {pendingApprovals.length + pendingReports.length}
            </div>
            <div className={s.kpiMeta}>
              {pendingApprovals.length} stages, {pendingReports.length} reports
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Fraud Flags</div>
            <div className={s.kpiValue}>{zoneFraudFlags.length}</div>
            <div className={s.kpiMeta}>
              {zoneFraudFlags.filter((f) => f.severity === "Critical").length}{" "}
              critical
            </div>
          </div>
        </div>
      </div>

      <div className={s.gridTwoCols}>
        {/* Council List */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Council Audit Status</h3>
          </div>
          <div className={s.listTable}>
            {myLGAs.map((lga) => (
              <div key={lga.id} className={s.listRow}>
                <div>
                  <div className={s.listRowName}>{lga.name}</div>
                  <div className={s.listRowSub}>
                    Lead: {lga.auditLeadId ? "Assigned" : "Unassigned"}
                  </div>
                </div>
                {lga.auditLeadId ? (
                  <span className={`${s.lgaStatus} ${s.statusActive}`}>
                    Active
                  </span>
                ) : (
                  <button
                    className={s.assignBtn}
                    onClick={() => setAssigningLgaId(lga.id)}
                  >
                    Assign Lead
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Pending Approvals</h3>
          </div>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <CheckCircle size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>All caught up</div>
              <div className={s.emptyDesc}>
                No pending approvals at this time.
              </div>
            </div>
          </div>
        </div>
      </div>

      {assigningLgaId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "2rem 1rem",
            overflowY: "auto",
          }}
          className="backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "600px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              overflow: "hidden",
              marginBottom: "2rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
                padding: "1.5rem 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  color: "white",
                  margin: 0,
                  fontSize: "1.25rem",
                  fontWeight: 700,
                }}
              >
                Assign Audit Lead
              </h2>
            </div>
            <div style={{ padding: "1.5rem 2rem" }}>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-2)",
                  marginBottom: "1rem",
                  lineHeight: 1.5,
                }}
              >
                Select an Audit Lead for{" "}
                <strong>
                  {myLGAs.find((l) => l.id === assigningLgaId)?.name}
                </strong>
                .
              </p>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "var(--text-2)",
                  }}
                >
                  Select Lead Auditor
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                  }}
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                >
                  <option value="">Select Auditor...</option>
                  {leads.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                }}
              >
                <button
                  className={s.btnSecondary}
                  onClick={() => {
                    setAssigningLgaId(null);
                    setSelectedLeadId("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className={s.btnPrimary}
                  onClick={() => {
                    if (!selectedLeadId) {
                      addToast({
                        type: "error",
                        title: "Please select a lead",
                      });
                      return;
                    }
                    const lga = myLGAs.find((l) => l.id === assigningLgaId);
                    if (!lga) return;
                    const lgaAudit = audits.find((a) => a.lgaId === lga.id);
                    if (!lgaAudit) {
                      // If no audit exists (shouldn't happen if initialized properly), maybe create one?
                      // For now, assume generic audit ID if missing
                      assignLeadFn(
                        lga.id,
                        selectedLeadId,
                        `audit-${lga.id}`,
                        "mandate-default",
                      );
                    } else {
                      assignLeadFn(
                        lga.id,
                        selectedLeadId,
                        lgaAudit.id,
                        lgaAudit.mandateId,
                      );
                    }
                    setAssigningLgaId(null);
                    setSelectedLeadId("");
                  }}
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorDashboard;
