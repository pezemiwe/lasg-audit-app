import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuditStore } from "../../store/useAuditStore";
import {
  FileText,
  Upload,
  ClipboardList,
  Handshake,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import StatusBadge from "../../components/UI/StatusBadge";
import s from "../../styles/pages.module.css";

const STEPS = [
  { id: "mandates", label: "Signed Mandate", icon: <FileText size={18} /> },
  { id: "docs", label: "Required Docs", icon: <Upload size={18} /> },
  {
    id: "questionnaire",
    label: "Entity Questionnaire",
    icon: <ClipboardList size={18} />,
  },
  { id: "scope", label: "Scope Agreement", icon: <Handshake size={18} /> },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export default function DocumentSubmission() {
  const { user } = useAuth();
  const activeAudit = useAuditStore((st) =>
    st.audits.find((a) => a.lgaId === user?.lgaId && a.status === "Pre-Audit"),
  );

  const [activeTab, setActiveTab] = useState<StepId>("mandates");

  if (!user || user.role !== "HEAD_OF_LOCAL_GOVERNMENT") {
    return (
      <div className={s.emptyState}>
        <ShieldAlert size={48} color="#94a3b8" />
        <h3 className={s.emptyTitle}>Access Denied</h3>
        <p className={s.emptySubtitle}>
          You do not have permission to view the Engagement Workspace.
        </p>
      </div>
    );
  }

  if (!activeAudit) {
    return (
      <div className={s.emptyState}>
        <ClipboardList
          size={48}
          color="#94a3b8"
          style={{ marginBottom: "1rem" }}
        />
        <h3 className={s.emptyTitle}>No Active Engagement</h3>
        <p className={s.emptySubtitle}>
          There is no active pre-audit engagement for your council.
        </p>
      </div>
    );
  }

  return (
    <div className={s.pageWrapper}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Engagement Readiness</h1>
          <p className={s.pageSubtitle}>
            Complete these steps to proceed to audit fieldwork.
          </p>
        </div>
        <StatusBadge label="Pre-Audit" variant="info" />
      </div>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {/* Left rail: Steps */}
        <aside
          style={{
            flex: "0 0 240px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {STEPS.map((step) => {
            const isActive = activeTab === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.8rem 1rem",
                  border: "1px solid",
                  borderColor: isActive ? "var(--primary)" : "transparent",
                  backgroundColor: isActive
                    ? "var(--primary-light)"
                    : "transparent",
                  color: isActive ? "var(--primary-dark)" : "var(--text)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontWeight: isActive ? 600 : 500,
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {step.icon}
                  {step.label}
                </div>
                {isActive && <ChevronRight size={16} />}
              </button>
            );
          })}
        </aside>

        {/* Content area */}
        <div
          style={{
            flex: 1,
            minWidth: "300px",
            minHeight: "400px",
            padding: "1.5rem",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            backgroundColor: "#fff",
          }}
        >
          {activeTab === "mandates" && (
            <div>
              <h3>Review Mandate Letter</h3>
              <p style={{ color: "var(--text-2)", marginBottom: "1.5rem" }}>
                Acknowledge and sign the official mandate letter before
                proceeding.
              </p>
              {/* Replace with actual Mandate component later if needed */}
              <div className={s.emptyState} style={{ padding: "3rem" }}>
                <FileText
                  size={40}
                  color="#cbd5e1"
                  style={{ marginBottom: 16 }}
                />
                <h4 className={s.emptyTitle}>Mandate Letter Pending</h4>
              </div>
            </div>
          )}

          {activeTab === "docs" && (
            <div>
              <h3>Required Documents</h3>
              <p style={{ color: "var(--text-2)", marginBottom: "1.5rem" }}>
                Upload the documents requested by the audit team.
              </p>
              <div className={s.emptyState} style={{ padding: "3rem" }}>
                <Upload
                  size={40}
                  color="#cbd5e1"
                  style={{ marginBottom: 16 }}
                />
                <h4 className={s.emptyTitle}>Document Upload Portal</h4>
              </div>
            </div>
          )}

          {activeTab === "questionnaire" && (
            <div>
              <h3>Entity Questionnaire</h3>
              <p style={{ color: "var(--text-2)", marginBottom: "1.5rem" }}>
                Complete the engagement readiness questionnaire.
              </p>
              <div className={s.emptyState} style={{ padding: "3rem" }}>
                <ClipboardList
                  size={40}
                  color="#cbd5e1"
                  style={{ marginBottom: 16 }}
                />
                <h4 className={s.emptyTitle}>Questionnaire Viewer</h4>
              </div>
            </div>
          )}

          {activeTab === "scope" && (
            <div>
              <h3>Scope Agreement</h3>
              <p style={{ color: "var(--text-2)", marginBottom: "1.5rem" }}>
                Sign off on the audit scope agreement.
              </p>
              <div className={s.emptyState} style={{ padding: "3rem" }}>
                <Handshake
                  size={40}
                  color="#cbd5e1"
                  style={{ marginBottom: 16 }}
                />
                <h4 className={s.emptyTitle}>Scope Agreement Contract</h4>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
