import React, { useEffect, useMemo, useState } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import StatusBadge from "../UI/StatusBadge";
import type { ProgrammeProcedure } from "../../types";
import { getSuggestedProcedures } from "../../utils/auditLogic";
import {
  BookOpen,
  Plus,
  CheckCircle2,
  Clock,
  Play,
  Send,
  Shield,
  Sparkles,
  FileText,
  Layers,
} from "lucide-react";
import s from "../../styles/pages.module.css";

const procStatusVariant = (status: string) => {
  switch (status) {
    case "Completed":
      return "success" as const;
    case "In Progress":
      return "info" as const;
    default:
      return "default" as const;
  }
};

const progStatusVariant = (status: string) => {
  switch (status) {
    case "Approved":
      return "success" as const;
    case "Submitted":
    case "Under Review":
      return "info" as const;
    case "Revision Required":
      return "error" as const;
    default:
      return "default" as const;
  }
};

interface WorkProgrammeSectionProps {
  auditId?: string;
  embedded?: boolean;
}

const WorkProgrammeSection: React.FC<WorkProgrammeSectionProps> = ({
  auditId,
  embedded = false,
}) => {
  const { user } = useAuth();
  const audits = useAuditStore((st) => st.audits);
  const lgas = useAuditStore((st) => st.lgas);
  const riskMatrices = useAuditStore((st) => st.riskMatrices);
  const programmes = useAuditStore((st) => st.programmes);
  const programmeTemplates = useAuditStore((st) => st.programmeTemplates);
  const createProgramme = useAuditStore((st) => st.createProgramme);
  const createProgrammeFromTemplate = useAuditStore(
    (st) => st.createProgrammeFromTemplate,
  );
  const submitProgramme = useAuditStore((st) => st.submitProgramme);
  const approveProgramme = useAuditStore((st) => st.approveProgramme);
  const requestProgrammeRevision = useAuditStore(
    (st) => st.requestProgrammeRevision,
  );
  const updateProgrammeProcedure = useAuditStore(
    (st) => st.updateProgrammeProcedure,
  );
  const updateAuditStatus = useAuditStore((st) => st.updateAuditStatus);
  const addToast = useAuditStore((st) => st.addToast);

  const [selectedAuditId, setSelectedAuditId] = useState<string>(
    auditId || audits[0]?.id || "",
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddProc, setShowAddProc] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [createForm, setCreateForm] = useState({
    objectives: "",
    scope: "",
    riskAreas: "",
  });
  const [newProc, setNewProc] = useState({
    area: "",
    procedure: "",
    assignedTo: "",
  });

  useEffect(() => {
    if (auditId && auditId !== selectedAuditId) {
      setSelectedAuditId(auditId);
      setShowCreateForm(false);
      setShowAddProc(false);
      setSelectedTemplateId("");
    }
  }, [auditId, selectedAuditId]);

  const currentProgramme = useMemo(
    () => programmes.find((p) => p.auditId === selectedAuditId),
    [programmes, selectedAuditId],
  );

  const selectedAudit = audits.find((a) => a.id === selectedAuditId);
  const lgaName = selectedAudit
    ? lgas.find((l) => l.id === selectedAudit.lgaId)?.name ||
      selectedAudit.lgaId
    : "";

  const highRisks = useMemo(
    () =>
      riskMatrices.filter(
        (r) =>
          r.auditId === selectedAuditId &&
          (r.overallRisk === "High" || r.overallRisk === "Critical"),
      ),
    [riskMatrices, selectedAuditId],
  );

  const isSupervisor =
    user?.role === "AUDIT_SUPERVISOR" || user?.role === "STATE_AUDITOR_GENERAL";
  const isLead = user?.role === "AUDIT_LEAD";

  const procedureStats = useMemo(() => {
    if (!currentProgramme) {
      return { total: 0, completed: 0, inProgress: 0, notStarted: 0 };
    }
    const procs = currentProgramme.procedures;
    return {
      total: procs.length,
      completed: procs.filter((p) => p.status === "Completed").length,
      inProgress: procs.filter((p) => p.status === "In Progress").length,
      notStarted: procs.filter((p) => p.status === "Not Started").length,
    };
  }, [currentProgramme]);

  const handleCreate = () => {
    if (!selectedAuditId) {
      addToast({
        type: "error",
        title: "Validation Error",
        message: "Select an audit before creating a work programme",
      });
      return;
    }

    if (!createForm.objectives || !createForm.scope) {
      addToast({
        type: "error",
        title: "Validation Error",
        message: "Objectives and scope are required",
      });
      return;
    }

    if (selectedTemplateId) {
      createProgrammeFromTemplate(
        selectedTemplateId,
        selectedAuditId,
        user?.name || "",
        createForm.objectives,
        createForm.scope,
      );
    } else {
      createProgramme({
        auditId: selectedAuditId,
        objectives: createForm.objectives,
        scope: createForm.scope,
        riskAreas: createForm.riskAreas
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        procedures: [],
        status: "Draft",
        preparedBy: user?.name || "",
      });
    }

    setCreateForm({ objectives: "", scope: "", riskAreas: "" });
    setSelectedTemplateId("");
    setShowCreateForm(false);
  };

  const handleAddProcedure = () => {
    if (!currentProgramme || !newProc.area || !newProc.procedure) {
      addToast({
        type: "error",
        title: "Validation Error",
        message: "Area and procedure are required",
      });
      return;
    }

    const proc: ProgrammeProcedure = {
      id: `proc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      area: newProc.area,
      procedure: newProc.procedure,
      assignedTo: newProc.assignedTo || undefined,
      status: "Not Started",
      evidenceUploaded: false,
    };

    const store = useAuditStore.getState();
    const updated = store.programmes.map((p) =>
      p.id === currentProgramme.id
        ? { ...p, procedures: [...p.procedures, proc] }
        : p,
    );

    useAuditStore.setState({ programmes: updated });
    setNewProc({ area: "", procedure: "", assignedTo: "" });
    setShowAddProc(false);
    addToast({ type: "success", title: "Procedure Added" });
  };

  const handleUpdateProcStatus = (
    procId: string,
    status: ProgrammeProcedure["status"],
  ) => {
    if (!currentProgramme) return;
    updateProgrammeProcedure(currentProgramme.id, procId, { status });
  };

  return (
    <div>
      {!embedded && (
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Audit Work Programme</h1>
            <p className={s.pageSubtitle}>
              Standardised work programmes aligned to ISA, ISSAI &amp; IPSAS
              frameworks — with template generation and procedure tracking
            </p>
          </div>
          <span className={s.pageBadge}>
            <BookOpen size={12} /> Work Programme
          </span>
        </div>
      )}

      {!auditId && (
        <div className={s.filterBar} style={{ marginBottom: "1.5rem" }}>
          <select
            className={s.formSelect}
            value={selectedAuditId}
            onChange={(e) => setSelectedAuditId(e.target.value)}
            style={{ width: 320 }}
          >
            {audits.map((a) => {
              const lga = lgas.find((l) => l.id === a.lgaId);
              const councilLabel = lga?.councilType === "LCDA" ? " (LCDA)" : "";
              return (
                <option key={a.id} value={a.id}>
                  {lga?.name || a.lgaId}
                  {councilLabel} — {a.type} Audit ({a.year})
                </option>
              );
            })}
          </select>
          {!currentProgramme && (
            <button
              className={s.btnPrimary}
              onClick={() => setShowCreateForm(true)}
            >
              <Plus size={14} /> Create Work Programme
            </button>
          )}
        </div>
      )}

      {embedded && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-3)",
                marginBottom: "0.2rem",
              }}
            >
              Planning Deliverable
            </div>
            <div
              style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              Work Programme for {lgaName}
            </div>
          </div>
          {!currentProgramme && (
            <button
              className={s.btnPrimary}
              onClick={() => setShowCreateForm(true)}
            >
              <Plus size={14} /> Create Work Programme
            </button>
          )}
        </div>
      )}

      {currentProgramme && (
        <div className={s.kpiRow}>
          <div className={s.kpiCard}>
            <div className={s.kpiIconBlue}>
              <BookOpen size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Programme Status</div>
              <div className={s.kpiValue} style={{ fontSize: "1rem" }}>
                <StatusBadge
                  label={currentProgramme.status}
                  variant={progStatusVariant(currentProgramme.status)}
                />
              </div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconGreen}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Completed</div>
              <div className={s.kpiValue}>
                {procedureStats.completed}/{procedureStats.total}
              </div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconAmber}>
              <Play size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>In Progress</div>
              <div className={s.kpiValue}>{procedureStats.inProgress}</div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconPurple}>
              <Clock size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Not Started</div>
              <div className={s.kpiValue}>{procedureStats.notStarted}</div>
            </div>
          </div>
        </div>
      )}

      {showCreateForm && !currentProgramme && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>
              New Work Programme — {lgaName} ({selectedAudit?.type} Audit)
            </h3>
          </div>
          <div className={s.cardBody}>
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                background: "#f0f9ff",
                border: "1px solid #bae6fd",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                  color: "#0369a1",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <Layers size={14} />
                Generate from Standardised Template
              </div>
              <div
                style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
              >
                <select
                  className={s.formSelect}
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  style={{ flex: "1 1 300px" }}
                >
                  <option value="">— Select a template (optional) —</option>
                  {programmeTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.sections.length} sections,{" "}
                      {t.sections.reduce(
                        (sum, sec) => sum + sec.procedures.length,
                        0,
                      )}{" "}
                      procedures
                    </option>
                  ))}
                </select>
              </div>
              {selectedTemplateId &&
                (() => {
                  const tpl = programmeTemplates.find(
                    (t) => t.id === selectedTemplateId,
                  );
                  if (!tpl) return null;
                  return (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        fontSize: "0.82rem",
                        color: "#334155",
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                        {tpl.name}
                      </div>
                      <div style={{ color: "#64748b", marginBottom: "0.5rem" }}>
                        {tpl.description}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.35rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {tpl.sections.map((sec) => (
                          <span
                            key={sec.title}
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              padding: "0.15rem 0.5rem",
                              borderRadius: "3px",
                              background: "#dbeafe",
                              color: "#1e40af",
                              border: "1px solid #bfdbfe",
                            }}
                          >
                            {sec.title} ({sec.procedures.length})
                          </span>
                        ))}
                      </div>
                      <div
                        style={{
                          marginTop: "0.5rem",
                          fontSize: "0.72rem",
                          color: "#64748b",
                        }}
                      >
                        <strong>Methodology:</strong> {tpl.methodology}
                      </div>
                    </div>
                  );
                })()}
            </div>

            <div className={s.formGrid}>
              <div className={s.formGroupFull}>
                <label className={s.formLabel}>Objectives</label>
                <textarea
                  className={s.formTextarea}
                  value={createForm.objectives}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, objectives: e.target.value })
                  }
                  placeholder="Define the objectives of the audit programme"
                />
              </div>
              <div className={s.formGroupFull}>
                <label className={s.formLabel}>Scope</label>
                <textarea
                  className={s.formTextarea}
                  value={createForm.scope}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, scope: e.target.value })
                  }
                  placeholder="Define the scope boundaries"
                />
              </div>
              {!selectedTemplateId && (
                <div className={s.formGroupFull}>
                  <label className={s.formLabel}>
                    Risk Areas (comma-separated)
                  </label>
                  <input
                    className={s.formInput}
                    value={createForm.riskAreas}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        riskAreas: e.target.value,
                      })
                    }
                    placeholder="e.g. Revenue, Procurement, Payroll, Assets"
                  />
                </div>
              )}
            </div>
            <div className={s.formActions}>
              <button
                className={s.btnSecondary}
                onClick={() => {
                  setShowCreateForm(false);
                  setSelectedTemplateId("");
                }}
              >
                Cancel
              </button>
              <button className={s.btnPrimary} onClick={handleCreate}>
                <FileText size={14} />{" "}
                {selectedTemplateId
                  ? "Generate from Template"
                  : "Create Programme"}
              </button>
            </div>
          </div>
        </div>
      )}

      {currentProgramme && (
        <>
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Programme Overview</h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {isLead && currentProgramme.status === "Draft" && (
                  <button
                    className={s.btnPrimary}
                    onClick={() => {
                      if (currentProgramme.procedures.length === 0) {
                        addToast({
                          type: "error",
                          title: "Validation Error",
                          message:
                            "Add at least one procedure before submitting.",
                        });
                        return;
                      }
                      submitProgramme(currentProgramme.id);
                      addToast({
                        type: "success",
                        title: "Programme Submitted for Review",
                        message: "Supervisor notified for approval.",
                      });
                    }}
                  >
                    <Send size={14} /> Submit for Review
                  </button>
                )}
                {isSupervisor && currentProgramme.status === "Submitted" && (
                  <>
                    <button
                      className={s.btnPrimary}
                      onClick={() => {
                        approveProgramme(currentProgramme.id, user?.id || "");
                        updateAuditStatus(
                          currentProgramme.auditId,
                          "Fieldwork",
                        );
                        addToast({
                          type: "success",
                          title: "Programme Approved",
                          message: "Audit phase advanced to Fieldwork.",
                        });
                      }}
                    >
                      <Shield size={14} /> Approve
                    </button>
                    <button
                      className={s.btnDanger}
                      onClick={() => {
                        requestProgrammeRevision(currentProgramme.id);
                        addToast({
                          type: "warning",
                          title: "Revision Requested",
                        });
                      }}
                    >
                      Request Revision
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className={s.cardBody}>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Objectives</span>
                <span className={s.detailValue}>
                  {currentProgramme.objectives}
                </span>
              </div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Scope</span>
                <span className={s.detailValue}>{currentProgramme.scope}</span>
              </div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Risk Areas</span>
                <span className={s.detailValue}>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.35rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {currentProgramme.riskAreas.map((area) => (
                      <span
                        key={area}
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "3px",
                          background: "#fef3c7",
                          color: "#92400e",
                          border: "1px solid #fde68a",
                        }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </span>
              </div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Prepared By</span>
                <span className={s.detailValue}>
                  {currentProgramme.preparedBy}
                </span>
              </div>
              {currentProgramme.methodology && (
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Methodology</span>
                  <span className={s.detailValue}>
                    {currentProgramme.methodology}
                  </span>
                </div>
              )}
              {currentProgramme.templateId && (
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Template</span>
                  <span className={s.detailValue}>
                    {programmeTemplates.find(
                      (t) => t.id === currentProgramme.templateId,
                    )?.name || currentProgramme.templateId}
                  </span>
                </div>
              )}
              {currentProgramme.reviewedBy && (
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Reviewed By</span>
                  <span className={s.detailValue}>
                    {currentProgramme.reviewedBy}
                  </span>
                </div>
              )}
              {currentProgramme.approvedBy && (
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Approved By</span>
                  <span className={s.detailValue}>
                    {currentProgramme.approvedBy}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>
                Procedures ({currentProgramme.procedures.length})
              </h3>
              {(isLead || isSupervisor) &&
                (currentProgramme.status === "Draft" ||
                  currentProgramme.status === "Revision Required") && (
                  <button
                    className={s.btnOutline}
                    onClick={() => setShowAddProc(true)}
                  >
                    <Plus size={14} /> Add Procedure
                  </button>
                )}
            </div>

            {showAddProc && (
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  background: "#f8fafc",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {highRisks.length > 0 && (
                  <div
                    style={{
                      marginBottom: "1.25rem",
                      padding: "1rem",
                      background: "#f0fdf4",
                      border: "1px dashed #16a34a",
                      borderRadius: "6px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.75rem",
                        color: "#15803d",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      <Sparkles size={14} />
                      AI Suggested Procedures
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {highRisks.slice(0, 5).map((risk) => (
                        <button
                          key={risk.id}
                          onClick={() => {
                            const [sug] = getSuggestedProcedures(risk.area);
                            setNewProc({
                              area: risk.area,
                              procedure: sug,
                              assignedTo: "",
                            });
                          }}
                          title={`Click to add procedure for: ${risk.area}`}
                          style={{
                            background: "white",
                            border: "1px solid #bbf7d0",
                            padding: "0.35rem 0.75rem",
                            borderRadius: "100px",
                            fontSize: "0.75rem",
                            color: "#166534",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#dcfce7")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "white")
                          }
                        >
                          <Plus size={10} />
                          {risk.area} ({risk.overallRisk})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={s.formGrid}>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Area</label>
                    <input
                      className={s.formInput}
                      value={newProc.area}
                      onChange={(e) =>
                        setNewProc({ ...newProc, area: e.target.value })
                      }
                      placeholder="e.g. Revenue"
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Assigned To</label>
                    <input
                      className={s.formInput}
                      value={newProc.assignedTo}
                      onChange={(e) =>
                        setNewProc({ ...newProc, assignedTo: e.target.value })
                      }
                      placeholder="Auditor name"
                    />
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>Procedure</label>
                    <textarea
                      className={s.formTextarea}
                      value={newProc.procedure}
                      onChange={(e) =>
                        setNewProc({ ...newProc, procedure: e.target.value })
                      }
                      placeholder="Describe the audit procedure"
                    />
                  </div>
                </div>
                <div className={s.formActions}>
                  <button
                    className={s.btnSecondary}
                    onClick={() => setShowAddProc(false)}
                  >
                    Cancel
                  </button>
                  <button className={s.btnPrimary} onClick={handleAddProcedure}>
                    Add Procedure
                  </button>
                </div>
              </div>
            )}

            <div className={s.cardBody} style={{ padding: 0 }}>
              {currentProgramme.procedures.length === 0 ? (
                <div className={s.emptyState}>
                  <BookOpen size={40} className={s.emptyIcon} />
                  <div className={s.emptyTitle}>No Procedures Defined</div>
                  <div className={s.emptyDesc}>
                    Add audit procedures to build the work programme.
                  </div>
                </div>
              ) : (
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Area</th>
                        <th>Procedure</th>
                        <th>Assertion</th>
                        <th>Nature of Test</th>
                        <th>Sample Size</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>W/P Ref</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProgramme.procedures.map((proc, idx) => (
                        <tr key={proc.id}>
                          <td
                            style={{ fontWeight: 600, color: "var(--text-3)" }}
                          >
                            {String(idx + 1).padStart(2, "0")}
                          </td>
                          <td style={{ fontWeight: 600 }}>{proc.area}</td>
                          <td style={{ maxWidth: "240px", lineHeight: 1.5 }}>
                            {proc.procedure}
                            {proc.expectedEvidence && (
                              <div
                                style={{
                                  fontSize: "0.7rem",
                                  color: "#64748b",
                                  marginTop: "0.25rem",
                                }}
                              >
                                <em>Evidence: {proc.expectedEvidence}</em>
                              </div>
                            )}
                          </td>
                          <td>
                            {proc.assertion ? (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  padding: "0.1rem 0.4rem",
                                  borderRadius: "3px",
                                  background: "#f0fdf4",
                                  color: "#166534",
                                  border: "1px solid #bbf7d0",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {proc.assertion}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td>
                            {proc.natureOfTest ? (
                              <span style={{ fontSize: "0.78rem" }}>
                                {proc.natureOfTest}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td style={{ fontSize: "0.78rem" }}>
                            {proc.sampleSize || "—"}
                          </td>
                          <td>{proc.assignedTo || "—"}</td>
                          <td>
                            <StatusBadge
                              label={proc.status}
                              variant={procStatusVariant(proc.status)}
                            />
                          </td>
                          <td
                            style={{
                              fontSize: "0.78rem",
                              fontFamily: "monospace",
                            }}
                          >
                            {proc.workpaperRef || "—"}
                          </td>
                          <td>
                            <div className={s.tableActions}>
                              {proc.status === "Not Started" && (
                                <button
                                  className={`${s.btnPrimary} ${s.btnSmall}`}
                                  onClick={() =>
                                    handleUpdateProcStatus(
                                      proc.id,
                                      "In Progress",
                                    )
                                  }
                                >
                                  <Play size={12} /> Start
                                </button>
                              )}
                              {proc.status === "In Progress" && (
                                <button
                                  className={`${s.btnPrimary} ${s.btnSmall}`}
                                  onClick={() =>
                                    handleUpdateProcStatus(proc.id, "Completed")
                                  }
                                >
                                  <CheckCircle2 size={12} /> Complete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {currentProgramme.procedures.length > 0 && (
              <div className={s.cardFooter}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <span>
                    Progress: {procedureStats.completed}/{procedureStats.total}{" "}
                    completed
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "6px",
                      background: "var(--border)",
                      borderRadius: "3px",
                      overflow: "hidden",
                      maxWidth: "200px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${procedureStats.total > 0 ? (procedureStats.completed / procedureStats.total) * 100 : 0}%`,
                        background: "#064e3b",
                        borderRadius: "3px",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {!currentProgramme && !showCreateForm && (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <BookOpen size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No Work Programme</div>
              <div className={s.emptyDesc}>
                Create a work programme to define audit procedures and
                assignments for this engagement.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkProgrammeSection;
