import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import StatusBadge from "../../components/UI/StatusBadge";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  FileText,
  FlaskConical,
  FolderOpen,
  BarChart3,
  Target,
} from "lucide-react";
import s from "../../styles/pages.module.css";

// Import existing page components to embed
import QuestionnairePage from "../Questionnaire";
import AuditPlanningPage from "../AuditPlanning";
import FieldworkPage from "../Fieldwork";
import PostAuditPage from "../PostAudit";
import ScopeAgreementPage from "../ScopeAgreement";
import DocumentPortalPage from "../DocumentPortal";
import ReportsPage from "../Reports";
import PreAuditPage from "../PreAudit";

const AuditDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const audits = useAuditStore((st) => st.audits);
  const lgas = useAuditStore((st) => st.lgas);

  const audit = audits.find((a) => a.id === id);
  const lga = lgas.find((l) => l.id === audit?.lgaId);

  const [activeTab, setActiveTab] = useState("overview");

  if (!audit || !user) {
    return (
      <div className={s.container}>
        <div className={s.pageHeader}>
          <button className={s.backButton} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1>Audit Not Found</h1>
        </div>
      </div>
    );
  }

  const isAG =
    user.role === "STATE_AUDITOR_GENERAL" ||
    user.role === "AUDITOR_GENERAL_FEDERATION";

  // Tab Definitions
  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "pre-audit", label: "Pre-Audit", icon: BookOpen },
    { id: "planning", label: "Planning", icon: Calendar },
    { id: "fieldwork", label: "Fieldwork", icon: FlaskConical },
    { id: "reporting", label: "Reporting", icon: BarChart3 },
    { id: "post-audit", label: "Post-Audit", icon: Target },
    { id: "documents", label: "Documents", icon: FolderOpen },
  ];

  // Specific Logic for Sub-Tabs or Content within tabs
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Audit Overview</h3>
            </div>
            <div className={s.cardBody}>
              <div className={s.gridTwoCols}>
                <div>
                  <div className={s.label}>Local Government Area</div>
                  <div className={s.value}>{lga?.name || audit.lgaId}</div>
                </div>
                <div>
                  <div className={s.label}>Audit Type</div>
                  <div className={s.value}>{audit.type} Audit</div>
                </div>
                <div>
                  <div className={s.label}>Audit Year</div>
                  <div className={s.value}>{audit.year}</div>
                </div>
                <div>
                  <div className={s.label}>Current Status</div>
                  <div style={{ marginTop: "0.5rem" }}>
                    <StatusBadge label={audit.status} />
                  </div>
                </div>
                <div>
                  <div className={s.label}>Start Date</div>
                  <div className={s.value}>{audit.startDate}</div>
                </div>
                <div>
                  <div className={s.label}>End Date</div>
                  <div className={s.value}>{audit.endDate}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "pre-audit":
        return (
          <div className={s.tabContent}>
            {/* AG is blocked from Questionnaire */}
            {!isAG && (
              <div className={s.sectionBlock}>
                <h3 className={s.sectionTitle}>Questionnaire</h3>
                <QuestionnairePage auditId={audit.id} embedded />
              </div>
            )}
            <div className={s.sectionBlock}>
              <h3 className={s.sectionTitle}>
                Engagement Letter & Pre-Audit Tasks
              </h3>
              {/* Reuse logic from PreAuditPage if possible, otherwise render generic placeholder or adapted component */}
              <PreAuditPage auditId={audit.id} embedded />
            </div>
          </div>
        );

      case "planning":
        return (
          <div className={s.tabContent}>
            <div className={s.sectionBlock}>
              <h3 className={s.sectionTitle}>Scope Agreement</h3>
              <ScopeAgreementPage auditId={audit.id} embedded />
            </div>
            <div className={s.sectionBlock} style={{ marginTop: "2rem" }}>
              <h3 className={s.sectionTitle}>Audit Plan & Strategy</h3>
              <AuditPlanningPage auditId={audit.id} embedded />
            </div>
          </div>
        );

      case "fieldwork":
        return <FieldworkPage auditId={audit.id} embedded />;

      case "reporting":
        return <ReportsPage auditId={audit.id} embedded />;

      case "post-audit":
        return <PostAuditPage auditId={audit.id} embedded />;

      case "documents":
        return <DocumentPortalPage auditId={audit.id} embedded />;

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className={s.container}>
      <div className={s.pageHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            className={s.btnSecondary}
            onClick={() => navigate("/audit")}
            style={{ padding: "0.5rem" }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className={s.pageTitle}>
              {audit.type} Audit - {lga?.name} ({audit.year})
            </h1>
            <p className={s.pageSubtitle}>
              {audit.status} Stage • Lead: {audit.leadId || "Unassigned"}
            </p>
          </div>
        </div>
        <StatusBadge label={audit.status} />
      </div>

      <div className={s.tabsHeader}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${s.tabBtn} ${activeTab === tab.id ? s.active : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className={s.tabContainer}>{renderContent()}</div>
    </div>
  );
};

export default AuditDetail;
