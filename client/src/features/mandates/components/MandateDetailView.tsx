import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ChevronLeft, FileText, Send, Upload } from "lucide-react";
import s from "../../../styles/pages.module.css";
import StatusBadge from "../../../components/UI/StatusBadge";
import { useAuditStore } from "../../../store/useAuditStore";
import { useAuth } from "../../../hooks/useAuth";
import type { Mandate } from "../../../types";
import { statusVariant } from "../utils/statusVariant";
import EngagementLetterModal from "./EngagementLetterModal";
import ComplianceLgaModal from "./ComplianceLgaModal";
import MandateOverviewTab from "./MandateOverviewTab";
import MandateComplianceTab from "./MandateComplianceTab";

type DetailTab = "overview" | "compliance";

const MandateDetailView: React.FC<{
  mandate: Mandate;
  onBack: () => void;
}> = ({ mandate, onBack }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const lgas = useAuditStore((st) => st.lgas);
  const publishMandate = useAuditStore((st) => st.publishMandate);
  const acceptMandate = useAuditStore((st) => st.acceptMandate);
  const openModal = useAuditStore((st) => st.openModal);

  const [searchParamsM, setSearchParamsM] = useSearchParams();
  const activeTab = (searchParamsM.get("tab") as DetailTab) || "overview";
  const setActiveTab = (tab: DetailTab) =>
    setSearchParamsM(
      (prev) => {
        prev.set("tab", tab);
        return prev;
      },
      { replace: true },
    );

  const [selectedComplianceLgaId, setSelectedComplianceLgaId] = useState<
    string | null
  >(null);
  const [showEngagementLetter, setShowEngagementLetter] = useState(false);

  const isAG = user?.role === "STATE_AUDITOR_GENERAL";
  const isSupervisor = user?.role === "AUDIT_SUPERVISOR";

  const handlePublish = (id: string) => {
    openModal({
      title: "Publish Audit Mandate",
      message:
        "Publishing this mandate will make it visible to all assigned supervisors and initiate the audit cycle. This action cannot be undone.",
      confirmText: "Publish Mandate",
      variant: "info",
      onConfirm: () => publishMandate(id),
    });
  };

  const handleAccept = (id: string) => {
    openModal({
      title: "Accept Audit Mandate",
      message:
        "By accepting this mandate, you acknowledge the terms and commence the audit process for your council.",
      confirmText: "Accept & Commence",
      variant: "info",
      onConfirm: () => {
        if (user?.lgaId) {
          acceptMandate(id, user.lgaId);
        }
      },
    });
  };

  return (
    <div>
      <button
        className={s.btnSecondary}
        style={{ marginBottom: "1.5rem" }}
        onClick={() => {
          onBack();
          setActiveTab("overview");
        }}
      >
        <ChevronLeft size={16} /> Back to Mandates
      </button>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>{mandate.title}</h1>
          <p className={s.pageSubtitle}>
            FY {mandate.auditYear} · Created{" "}
            {new Date(mandate.createdAt).toLocaleDateString("en-NG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <StatusBadge
            label={mandate.status}
            variant={statusVariant(mandate.status)}
            size="md"
          />
          {(isAG || user?.role === "SYSTEM_ADMIN") &&
            mandate.status !== "Draft" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  background: "#f0f9ff",
                  color: "#0369a1",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "99px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  border: "1px solid #bae6fd",
                }}
                title="Number of councils that have accepted this mandate"
              >
                <CheckCircle size={14} />
                <span>
                  Accepted: {mandate.acceptedByLgas?.length || 0} /{" "}
                  {lgas.length}
                </span>
              </div>
            )}
          {user?.role === "HEAD_OF_LOCAL_GOVERNMENT" &&
            user.lgaId &&
            !mandate.acceptedByLgas?.includes(user.lgaId) &&
            (mandate.status === "Published" || mandate.status === "Active") && (
              <button
                className={s.btnPrimary}
                onClick={() => handleAccept(mandate.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <CheckCircle size={16} /> Accept Mandate
              </button>
            )}
          {user?.role === "HEAD_OF_LOCAL_GOVERNMENT" &&
            user.lgaId &&
            mandate.acceptedByLgas?.includes(user.lgaId) && (
              <button
                className={s.btnPrimary}
                onClick={() => navigate("/document-portal")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "#10b981",
                  borderColor: "#10b981",
                }}
              >
                <Upload size={16} /> Upload Documents
              </button>
            )}
          <button
            className={s.btnSecondary}
            onClick={() => setShowEngagementLetter(true)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <FileText size={16} /> Engagement Letter
          </button>
          {mandate.status === "Draft" &&
            (isAG || user?.role === "SYSTEM_ADMIN") && (
              <button
                className={s.btnPrimary}
                onClick={() => handlePublish(mandate.id)}
              >
                <Send size={14} /> Publish
              </button>
            )}
        </div>
      </div>

      {showEngagementLetter && (
        <EngagementLetterModal
          mandateId={mandate.id}
          onClose={() => setShowEngagementLetter(false)}
        />
      )}

      {(isAG || isSupervisor || user?.role === "SYSTEM_ADMIN") && (
        <div className={s.tabsHeader}>
          <button
            className={`${s.tabBtn} ${activeTab === "overview" ? s.active : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <FileText size={16} /> Overview
          </button>
          <button
            className={`${s.tabBtn} ${activeTab === "compliance" ? s.active : ""}`}
            onClick={() => setActiveTab("compliance")}
          >
            <CheckCircle size={16} /> Council Compliance
          </button>
        </div>
      )}

      {activeTab === "overview" && <MandateOverviewTab mandate={mandate} />}

      {activeTab === "compliance" && (
        <MandateComplianceTab
          mandate={mandate}
          onSelectLga={setSelectedComplianceLgaId}
        />
      )}

      {selectedComplianceLgaId && (
        <ComplianceLgaModal
          mandate={mandate}
          lgaId={selectedComplianceLgaId}
          onClose={() => setSelectedComplianceLgaId(null)}
        />
      )}
    </div>
  );
};

export default MandateDetailView;
