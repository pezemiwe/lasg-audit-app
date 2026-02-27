import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import type { AuditType, MandateStatus } from "../../types";
import StatusBadge from "../../components/UI/StatusBadge";
import {
  Plus,
  FileText,
  Eye,
  ChevronLeft,
  Calendar,
  Target,
  Clock,
  Shield,
  CheckCircle,
  X,
  Upload,
  Send,
} from "lucide-react";
import s from "../../styles/pages.module.css";
import MandateLetter from "../../components/Content/MandateLetter";
import DocumentPreviewModal from "../../components/UI/DocumentPreviewModal";

type View = "list" | "create" | "detail";
type DetailTab = "overview" | "compliance";

const statusVariant = (st: MandateStatus) => {
  switch (st) {
    case "Draft":
      return "default" as const;
    case "Published":
      return "info" as const;
    case "Active":
      return "success" as const;
    case "Completed":
      return "gold" as const;
  }
};

const MandatesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const mandates = useAuditStore((s) => s.mandates);
  const createMandate = useAuditStore((s) => s.createMandate);
  const publishMandate = useAuditStore((s) => s.publishMandate);
  const updateMandateStatus = useAuditStore((s) => s.updateMandateStatus);
  const acceptMandate = useAuditStore((s) => s.acceptMandate);
  const openModal = useAuditStore((s) => s.openModal);
  const documentUploads = useAuditStore((s) => s.documentUploads);

  // New Store Actions for Assignments & Letters
  const lgas = useAuditStore((s) => s.lgas);
  const zones = useAuditStore((s) => s.zones);

  const [view, setView] = useState<View>("list");
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [selectedComplianceLgaId, setSelectedComplianceLgaId] = useState<
    string | null
  >(null);
  const [previewDoc, setPreviewDoc] = useState<
    (typeof documentUploads)[number] | null
  >(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<MandateStatus | "All">("All");

  const [showEngagementLetter, setShowEngagementLetter] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formYear, setFormYear] = useState(new Date().getFullYear());
  const [formScope, setFormScope] = useState("");
  const [formObjectives, setFormObjectives] = useState("");
  const [formTimelines, setFormTimelines] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formTypes, setFormTypes] = useState<AuditType[]>([]);
  const [formSignature, setFormSignature] = useState<string>("");

  const filtered = useMemo(() => {
    if (filter === "All") return mandates;
    return mandates.filter((m) => m.status === filter);
  }, [mandates, filter]);

  const selected = useMemo(
    () => mandates.find((m) => m.id === selectedId),
    [mandates, selectedId],
  );

  const resetForm = () => {
    setFormTitle("");
    setFormYear(new Date().getFullYear());
    setFormScope("");
    setFormObjectives("");
    setFormTimelines("");
    setFormStartDate("");
    setFormEndDate("");
    setFormTypes([]);
    setFormSignature("");
  };

  const handleCreate = () => {
    if (!formTitle.trim() || !formScope.trim() || !user) return;
    createMandate({
      title: formTitle.trim(),
      auditYear: formYear,
      scope: formScope.trim(),
      objectives: formObjectives.trim(),
      timelines: formTimelines.trim(),
      startDate: formStartDate,
      endDate: formEndDate,
      auditTypes: formTypes.length > 0 ? formTypes : ["Financial"],
      auditorGeneralSignature: formSignature,
      createdBy: user.id,
    });
    resetForm();
    setView("list");
  };

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
        "By accepting this mandate, you acknowledge the terms and commence the audit process for your LGA.",
      confirmText: "Accept & Commence",
      variant: "info",
      onConfirm: () => {
        if (user?.lgaId) {
          acceptMandate(id, user.lgaId);
        } else {
          // Fallback if no LGA ID (shouldn't happen for valid HoLGA)
          updateMandateStatus(id, "Active");
        }
      },
    });
  };

  const toggleType = (t: AuditType) => {
    setFormTypes((prev) => {
      // If clicking "Combined"
      if (t === "Combined") {
        const isCombinedAlready = prev.includes("Combined");
        if (isCombinedAlready) {
          // Deselect ALL
          return [];
        } else {
          // Select ALL
          return ["Financial", "Performance", "Compliance", "Combined"];
        }
      }

      // If clicking individual types (Financial, Performance, Compliance)
      const isSelected = prev.includes(t);
      let nextState: AuditType[] = [];

      if (isSelected) {
        // Removing one of the basic ones
        nextState = prev.filter((x) => x !== t);
        // If we remove one, then "Combined" is definitely no longer true
        nextState = nextState.filter((x) => x !== "Combined");
      } else {
        // Adding one
        nextState = [...prev, t];
        // Check if we now have all 3 basic types
        const hasFinancial = nextState.includes("Financial");
        const hasPerformance = nextState.includes("Performance");
        const hasCompliance = nextState.includes("Compliance");

        if (hasFinancial && hasPerformance && hasCompliance) {
          if (!nextState.includes("Combined")) {
            nextState.push("Combined");
          }
        }
      }

      return nextState;
    });
  };

  if (view === "detail" && selected) {
    const isAG =
      user?.role === "STATE_AUDITOR_GENERAL" ||
      user?.role === "AUDITOR_GENERAL_FEDERATION";
    const isSupervisor = user?.role === "AUDIT_SUPERVISOR";

    return (
      <div>
        <button
          className={s.btnSecondary}
          style={{ marginBottom: "1.5rem" }}
          onClick={() => {
            setView("list");
            setActiveTab("overview");
          }}
        >
          <ChevronLeft size={16} /> Back to Mandates
        </button>
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>{selected.title}</h1>
            <p className={s.pageSubtitle}>
              FY {selected.auditYear} — Created{" "}
              {new Date(selected.createdAt).toLocaleDateString("en-NG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <StatusBadge
              label={selected.status}
              variant={statusVariant(selected.status)}
              size="md"
            />
            {(isAG || user?.role === "SYSTEM_ADMIN") &&
              selected.status !== "Draft" && (
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
                  title="Number of LGAs that have accepted this mandate"
                >
                  <CheckCircle size={14} />
                  <span>
                    Accepted: {selected.acceptedByLgas?.length || 0} /{" "}
                    {lgas.length}
                  </span>
                </div>
              )}
            {user?.role === "HEAD_OF_LOCAL_GOVERNMENT" &&
              selected.status === "Published" &&
              (!user.lgaId ||
                !selected.acceptedByLgas?.includes(user.lgaId)) && (
                <button
                  className={s.btnPrimary}
                  onClick={() => handleAccept(selected.id)}
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
              selected.acceptedByLgas?.includes(user.lgaId) && (
                <button
                  className={s.btnPrimary}
                  onClick={() => navigate("/document-portal")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "#10b981", // Green color for action
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
            {selected.status === "Draft" &&
              (isAG || user?.role === "SYSTEM_ADMIN") && (
                <button
                  className={s.btnPrimary}
                  onClick={() => handlePublish(selected.id)}
                >
                  <Send size={14} /> Publish
                </button>
              )}
          </div>
        </div>

        {showEngagementLetter && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setShowEngagementLetter(false)}
          >
            <div
              className={s.card}
              style={{
                width: "100%",
                maxWidth: "850px",
                maxHeight: "90vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: "0",
                backgroundColor: "#fff",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={s.cardHeader}
                style={{
                  justifyContent: "space-between",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "1rem 1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <h3 className={s.cardTitle}>Letter of Engagement</h3>
                </div>
                <button
                  onClick={() => setShowEngagementLetter(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748b",
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <div style={{ overflowY: "auto", padding: "1.5rem" }}>
                <MandateLetter mandateId={selected.id} />
              </div>
              <div
                style={{
                  padding: "1rem 1.5rem",
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  backgroundColor: "#f8fafc",
                }}
              >
                <button
                  className={s.btnSecondary}
                  onClick={() => setShowEngagementLetter(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        {/* Tabs */}
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
              <CheckCircle size={16} /> LGA Compliance
            </button>
          </div>
        )}

        {/* Tab Content: Overview */}
        {activeTab === "overview" && (
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Mandate Details</h3>
            </div>
            <div className={s.cardBody}>
              <div className={s.detailRow}>
                <div className={s.detailLabel}>Scope</div>
                <div className={s.detailValue}>{selected.scope}</div>
              </div>
              <div className={s.detailRow}>
                <div className={s.detailLabel}>Objectives</div>
                <div className={s.detailValue}>{selected.objectives}</div>
              </div>
              <div className={s.detailRow}>
                <div className={s.detailLabel}>Timelines</div>
                <div className={s.detailValue}>{selected.timelines}</div>
              </div>
              <div className={s.detailRow}>
                <div className={s.detailLabel}>Audit Types</div>
                <div className={s.detailValue}>
                  <div
                    style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}
                  >
                    {selected.auditTypes.map((t) => (
                      <StatusBadge key={t} label={t} variant="info" />
                    ))}
                  </div>
                </div>
              </div>
              {selected.publishedAt && (
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Published</div>
                  <div className={s.detailValue}>
                    {new Date(selected.publishedAt).toLocaleDateString(
                      "en-NG",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Compliance */}
        {activeTab === "compliance" && (
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>LGA Compliance Tracker</h3>
              <div style={{ display: "flex", gap: "1rem" }}>
                <StatusBadge
                  label={`Accepted: ${
                    selected.acceptedByLgas?.length || 0
                  } of ${lgas.length}`}
                  variant="info"
                />
              </div>
            </div>
            <div className={s.cardBody}>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    {user?.role === "STATE_AUDITOR_GENERAL" ||
                    user?.role === "AUDITOR_GENERAL_FEDERATION" ? (
                      <tr>
                        <th>LGA Name</th>
                        <th>Zone</th>
                        <th>Mandate Status</th>
                        <th>Action</th>
                      </tr>
                    ) : (
                      <tr>
                        <th>LGA Name</th>
                        <th>Zone</th>
                        <th>Mandate Status</th>
                        <th>Documents Uploaded</th>
                        <th>Progress</th>
                        <th>Last Activity</th>
                        <th>Action</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {lgas.map((lga) => {
                      const isAccepted = selected.acceptedByLgas?.includes(
                        lga.id,
                      );
                      const zone = zones.find((z) => z.id === lga.zoneId);

                      // Get documents for this LGA for this mandate
                      const lgaDocs = documentUploads.filter(
                        (d) =>
                          d.mandateId === selected.id && d.lgaId === lga.id,
                      );

                      // Count uploaded
                      const uploadedCount = lgaDocs.filter(
                        (d) =>
                          d.status === "Uploaded" || d.status === "Approved",
                      ).length;

                      // Filtering Logic based on User Role
                      let isVisible = false;

                      if (
                        user?.role === "STATE_AUDITOR_GENERAL" ||
                        user?.role === "AUDITOR_GENERAL_FEDERATION"
                      ) {
                        // AG sees all LGAs to monitor compliance status (Accepted vs Pending)
                        isVisible = true;
                      } else if (user?.role === "SYSTEM_ADMIN") {
                        // Admin sees accepted + uploaded
                        if (isAccepted && uploadedCount > 0) isVisible = true;
                      } else if (user?.role === "AUDIT_SUPERVISOR") {
                        // Supervisor: "list of zones who have accepted and lGAs that have upoaded their documents"
                        if (isAccepted || uploadedCount > 0) isVisible = true;
                      } else if (
                        user?.role === "AUDIT_LEAD" ||
                        user?.role === "TEAM_AUDITOR"
                      ) {
                        // Lead/Auditor: Only see LGAs that have uploaded documents
                        if (uploadedCount > 0) isVisible = true;
                      } else {
                        // Others: Show accepted mandates
                        if (isAccepted) isVisible = true;
                      }

                      // Override for LGA user to see themselves
                      if (
                        user?.role === "HEAD_OF_LOCAL_GOVERNMENT" &&
                        user.lgaId === lga.id
                      ) {
                        isVisible = true;
                      }

                      if (!isVisible) return null;

                      const totalDocs =
                        lgaDocs.length > 0 ? lgaDocs.length : 10; // Default to 10 if none generated yet
                      const percentage = Math.round(
                        (uploadedCount / totalDocs) * 100,
                      );

                      const lastUpload = lgaDocs
                        .filter((d) => d.uploadedAt)
                        .sort(
                          (a, b) =>
                            new Date(b.uploadedAt!).getTime() -
                            new Date(a.uploadedAt!).getTime(),
                        )[0];

                      const isAG =
                        user?.role === "STATE_AUDITOR_GENERAL" ||
                        user?.role === "AUDITOR_GENERAL_FEDERATION";

                      return (
                        <tr key={lga.id}>
                          <td style={{ fontWeight: 600 }}>{lga.name}</td>
                          <td style={{ color: "var(--text-2)" }}>
                            {zone?.name}
                          </td>
                          <td>
                            {isAccepted ? (
                              <StatusBadge label="Accepted" variant="success" />
                            ) : (
                              <StatusBadge label="Pending" variant="warning" />
                            )}
                          </td>
                          {/* Columns Hhidden for AG */}
                          {!isAG && (
                            <>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  <span>
                                    {uploadedCount} / {totalDocs}
                                  </span>
                                </div>
                              </td>
                              <td style={{ width: "20%" }}>
                                <div
                                  style={{
                                    width: "100%",
                                    height: "6px",
                                    background: "#e2e8f0",
                                    borderRadius: "3px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${percentage}%`,
                                      height: "100%",
                                      background:
                                        percentage === 100
                                          ? "#10b981"
                                          : percentage > 50
                                            ? "#3b82f6"
                                            : "#cbd5e1",
                                    }}
                                  />
                                </div>
                                <div
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "var(--text-3)",
                                    marginTop: "0.25rem",
                                    textAlign: "right",
                                  }}
                                >
                                  {percentage}%
                                </div>
                              </td>
                              <td
                                style={{
                                  fontSize: "0.85rem",
                                  color: "var(--text-2)",
                                }}
                              >
                                {lastUpload?.uploadedAt
                                  ? new Date(
                                      lastUpload.uploadedAt,
                                    ).toLocaleDateString()
                                  : "-"}
                              </td>
                            </>
                          )}
                          <td>
                            <button
                              className={s.btnSecondary}
                              style={{
                                padding: "0.4rem 0.8rem",
                                fontSize: "0.75rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                              onClick={() => setSelectedComplianceLgaId(lga.id)}
                            >
                              <Eye size={14} /> View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Detailed LGA Compliance Checklist Modal/Drawer */}
        {selectedComplianceLgaId && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setSelectedComplianceLgaId(null)}
          >
            <div
              className={s.card}
              style={{
                width: "90%",
                maxWidth: "800px",
                maxHeight: "85vh",
                overflow: "hidden",
                margin: "0",
                display: "flex",
                flexDirection: "column",
                animation: "scaleIn 0.2s ease-out",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={s.cardHeader}
                style={{
                  justifyContent: "space-between",
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <div>
                  <h3 className={s.cardTitle}>
                    {lgas.find((l) => l.id === selectedComplianceLgaId)?.name}{" "}
                    LGA
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-3)",
                      margin: 0,
                      marginTop: "0.25rem",
                    }}
                  >
                    Compliance Checklist • {selected.title}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedComplianceLgaId(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748b",
                    padding: "0.5rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className={s.iconBtn}
                >
                  <X size={20} />
                </button>
              </div>

              <div
                className={s.cardBody}
                style={{
                  padding: "0",
                  overflowY: "auto",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className={s.tableWrap} style={{ flex: 1 }}>
                  <table className={s.table}>
                    <thead
                      style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#f8fafc",
                        zIndex: 10,
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <tr>
                        <th style={{ width: "35%" }}>Required Document</th>
                        <th>Format</th>
                        <th>Status</th>
                        <th>File Information</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const lgaDocs = documentUploads.filter(
                          (d) =>
                            d.mandateId === selected.id &&
                            d.lgaId === selectedComplianceLgaId,
                        );

                        if (lgaDocs.length === 0) {
                          return (
                            <tr>
                              <td
                                colSpan={5}
                                style={{
                                  textAlign: "center",
                                  padding: "3rem",
                                  color: "var(--text-3)",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "1rem",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "48px",
                                      height: "48px",
                                      borderRadius: "50%",
                                      backgroundColor: "#f1f5f9",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#94a3b8",
                                    }}
                                  >
                                    <FileText size={24} />
                                  </div>
                                  <div>
                                    <p style={{ fontWeight: 500, margin: 0 }}>
                                      No checklist available yet
                                    </p>
                                    <p
                                      style={{
                                        fontSize: "0.85rem",
                                        marginTop: "0.25rem",
                                      }}
                                    >
                                      The LGA has not accepted this mandate so
                                      the document checklist has not been
                                      generated.
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return lgaDocs.map((doc) => (
                          <tr key={doc.id}>
                            <td>
                              <div
                                style={{
                                  fontWeight: 500,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.75rem",
                                }}
                              >
                                <div
                                  style={{
                                    padding: "0.4rem",
                                    borderRadius: "6px",
                                    backgroundColor:
                                      doc.status === "Approved"
                                        ? "#dcfce7"
                                        : doc.status === "Uploaded"
                                          ? "#e0f2fe"
                                          : "#f1f5f9",
                                    color:
                                      doc.status === "Approved"
                                        ? "#166534"
                                        : doc.status === "Uploaded"
                                          ? "#0369a1"
                                          : "#64748b",
                                  }}
                                >
                                  <FileText size={16} />
                                </div>
                                {doc.documentName}
                              </div>
                            </td>
                            <td
                              style={{
                                fontSize: "0.8rem",
                                color: "var(--text-2)",
                                fontFamily: "monospace",
                                background: "#f8fafc",
                                padding: "0.2rem 0.4rem",
                                borderRadius: "4px",
                                width: "fit-content",
                              }}
                            >
                              {doc.requiredFormat}
                            </td>
                            <td>
                              <StatusBadge
                                label={doc.status}
                                variant={
                                  doc.status === "Approved"
                                    ? "success"
                                    : doc.status === "Uploaded"
                                      ? "info"
                                      : doc.status === "Rejected"
                                        ? "error"
                                        : "default"
                                }
                                size="sm"
                              />
                            </td>
                            <td>
                              {doc.status === "Uploaded" ||
                              doc.status === "Approved" ? (
                                <div
                                  style={{
                                    fontSize: "0.8rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.1rem",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontWeight: 500,
                                      color: "var(--primary)",
                                    }}
                                  >
                                    Version {doc.version}
                                  </div>
                                  <div
                                    style={{
                                      color: "var(--text-3)",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.25rem",
                                    }}
                                  >
                                    <Clock size={10} />
                                    {new Date(
                                      doc.uploadedAt!,
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                              ) : (
                                <span
                                  style={{
                                    fontSize: "0.8rem",
                                    color: "var(--text-3)",
                                    fontStyle: "italic",
                                  }}
                                >
                                  Pending Upload
                                </span>
                              )}
                            </td>
                            <td>
                              {(doc.status === "Uploaded" ||
                                doc.status === "Approved") && (
                                <button
                                  className={s.btnSecondary}
                                  style={{
                                    padding: "0.3rem 0.6rem",
                                    fontSize: "0.75rem",
                                  }}
                                  onClick={() => setPreviewDoc(doc)}
                                >
                                  <Eye
                                    size={12}
                                    style={{ marginRight: "4px" }}
                                  />{" "}
                                  Open
                                </button>
                              )}
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                  {previewDoc && (
                    <DocumentPreviewModal
                      document={{
                        name: previewDoc.documentName,
                        type: previewDoc.requiredFormat,
                        uploadedBy: previewDoc.uploadedBy || "",
                        uploadedAt: previewDoc.uploadedAt || "",
                        size: previewDoc.fileSize,
                        url: previewDoc.fileName || "",
                      }}
                      onClose={() => setPreviewDoc(null)}
                    />
                  )}
                </div>
              </div>

              <div
                className={s.cardFooter}
                style={{
                  padding: "1rem 1.5rem",
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "flex-end",
                  backgroundColor: "#f8fafc",
                  gap: "0.75rem",
                }}
              >
                <button
                  className={s.btnSecondary}
                  onClick={() => setSelectedComplianceLgaId(null)}
                >
                  Close Checklist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === "create") {
    return (
      <div>
        <button
          className={s.btnSecondary}
          style={{ marginBottom: "1.5rem" }}
          onClick={() => {
            resetForm();
            setView("list");
          }}
        >
          <ChevronLeft size={16} /> Back to Mandates
        </button>
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Create Audit Mandate</h1>
            <p className={s.pageSubtitle}>
              Define the scope, objectives, and parameters for the new audit
              cycle
            </p>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Mandate Information</h3>
          </div>
          <div className={s.cardBody}>
            <div className={s.formGrid}>
              <div className={s.formGroupFull}>
                <label className={s.formLabel} htmlFor="m-title">
                  Mandate Title
                </label>
                <input
                  id="m-title"
                  className={s.formInput}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Annual Audit of Local Government Accounts — FY 2026"
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="m-year">
                  Audit Year
                </label>
                <input
                  id="m-year"
                  type="number"
                  className={s.formInput}
                  value={formYear}
                  onChange={(e) => setFormYear(Number(e.target.value))}
                  min={2020}
                  max={2040}
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="m-timelines">
                  Timeline Description
                </label>
                <input
                  id="m-timelines"
                  className={s.formInput}
                  value={formTimelines}
                  onChange={(e) => setFormTimelines(e.target.value)}
                  placeholder="e.g., Q1 - Q3"
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="m-startDate">
                  Start Date
                </label>
                <input
                  id="m-startDate"
                  type="date"
                  className={s.formInput}
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="m-endDate">
                  End Date
                </label>
                <input
                  id="m-endDate"
                  type="date"
                  className={s.formInput}
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                />
              </div>
              <div className={s.formGroupFull}>
                <label className={s.formLabel} htmlFor="m-scope">
                  Scope
                </label>
                <textarea
                  id="m-scope"
                  className={s.formTextarea}
                  value={formScope}
                  onChange={(e) => setFormScope(e.target.value)}
                  placeholder="Describe the scope of the audit..."
                  rows={3}
                />
              </div>
              <div className={s.formGroupFull}>
                <label className={s.formLabel} htmlFor="m-objectives">
                  Objectives
                </label>
                <textarea
                  id="m-objectives"
                  className={s.formTextarea}
                  value={formObjectives}
                  onChange={(e) => setFormObjectives(e.target.value)}
                  placeholder="State the objectives of the audit mandate..."
                  rows={3}
                />
              </div>
              <div className={s.formGroupFull}>
                <label className={s.formLabel}>Audit Types</label>
                <div className={s.formCheckGroup}>
                  {(
                    [
                      "Financial",
                      "Performance",
                      "Compliance",
                      "Combined",
                    ] as AuditType[]
                  ).map((t) => (
                    <label key={t} className={s.formCheck}>
                      <input
                        type="checkbox"
                        checked={formTypes.includes(t)}
                        onChange={() => toggleType(t)}
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div className={s.formGroupFull}>
                <label className={s.formLabel}>Auditor General Signature</label>
                <div
                  style={{
                    border: "2px dashed #e2e8f0",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <label
                    htmlFor="signature-upload"
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      id="signature-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormSignature(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {formSignature ? (
                      <div>
                        <img
                          src={formSignature}
                          alt="Signature Preview"
                          style={{
                            maxHeight: "80px",
                            marginBottom: "0.5rem",
                            border: "1px solid #ccc",
                          }}
                        />
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "#64748b",
                            margin: 0,
                          }}
                        >
                          Click to change signature
                        </p>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Plus
                          size={24}
                          style={{ color: "#94a3b8", marginBottom: "0.5rem" }}
                        />
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "#64748b",
                            margin: 0,
                          }}
                        >
                          Click to upload signature
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
            <div className={s.formActions}>
              <button
                className={s.btnSecondary}
                onClick={() => {
                  resetForm();
                  setView("list");
                }}
              >
                Cancel
              </button>
              <button
                className={s.btnPrimary}
                onClick={handleCreate}
                disabled={!formTitle.trim() || !formScope.trim()}
              >
                <FileText size={14} /> Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Audit Mandates</h1>
          <p className={s.pageSubtitle}>
            {user?.role === "HEAD_OF_LOCAL_GOVERNMENT"
              ? "View and acknowledge audit mandates for your LGA"
              : "Create and manage audit mandates for Lagos State LGA audits"}
          </p>
        </div>
        {(user?.role === "STATE_AUDITOR_GENERAL" ||
          user?.role === "AUDITOR_GENERAL_FEDERATION") && (
          <button className={s.btnPrimary} onClick={() => setView("create")}>
            <Plus size={16} /> New Mandate
          </button>
        )}
      </div>

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <FileText size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Total Mandates</div>
            <div className={s.kpiValue}>{mandates.length}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Clock size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Drafts</div>
            <div className={s.kpiValue}>
              {mandates.filter((m) => m.status === "Draft").length}
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <Target size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Published</div>
            <div className={s.kpiValue}>
              {
                mandates.filter(
                  (m) => m.status === "Published" || m.status === "Active",
                ).length
              }
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <Shield size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Completed</div>
            <div className={s.kpiValue}>
              {mandates.filter((m) => m.status === "Completed").length}
            </div>
          </div>
        </div>
      </div>

      <div className={s.filterBar} style={{ marginBottom: "1.5rem" }}>
        {(["All", "Draft", "Published", "Active", "Completed"] as const).map(
          (f) => (
            <button
              key={f}
              className={filter === f ? s.filterChipActive : s.filterChip}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ),
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <FileText size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No mandates found</div>
              <div className={s.emptyDesc}>
                Create a new audit mandate to begin the audit cycle.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={s.card}>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Types</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600, maxWidth: "300px" }}>
                      {m.title}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <Calendar size={14} style={{ color: "#64748b" }} /> FY{" "}
                        {m.auditYear}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.3rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {m.auditTypes.map((t) => (
                          <StatusBadge key={t} label={t} variant="info" />
                        ))}
                      </div>
                    </td>
                    <td>
                      <StatusBadge
                        label={m.status}
                        variant={statusVariant(m.status)}
                      />
                    </td>
                    <td style={{ fontSize: "0.82rem", color: "#64748b" }}>
                      {new Date(m.createdAt).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <div className={s.tableActions}>
                        <button
                          className={s.btnIcon}
                          aria-label="View mandate"
                          onClick={() => {
                            setSelectedId(m.id);
                            setView("detail");
                          }}
                        >
                          <Eye size={14} />
                        </button>
                        {m.status === "Draft" &&
                          (user?.role === "SYSTEM_ADMIN" ||
                            user?.role === "STATE_AUDITOR_GENERAL" ||
                            user?.role === "AUDITOR_GENERAL_FEDERATION") && (
                            <button
                              className={`${s.btnPrimary} ${s.btnSmall}`}
                              onClick={() => handlePublish(m.id)}
                            >
                              <Send size={12} /> Publish
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MandatesPage;
