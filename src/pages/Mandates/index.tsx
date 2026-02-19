import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import type { AuditType, MandateStatus } from "../../types";
import StatusBadge from "../../components/UI/StatusBadge";
import { MOCK_USERS } from "../../mock/data";
import {
  Plus,
  FileText,
  Send,
  Eye,
  ChevronLeft,
  Calendar,
  Target,
  Clock,
  Shield,
  CheckCircle,
  Mail,
  Users,
} from "lucide-react";
import s from "../../styles/pages.module.css";

type View = "list" | "create" | "detail";
type DetailTab = "overview" | "assignments" | "letters";

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
  const openModal = useAuditStore((s) => s.openModal);
  const addToast = useAuditStore((s) => s.addToast);

  // New Store Actions for Assignments & Letters
  const lgas = useAuditStore((s) => s.lgas);
  const letters = useAuditStore((s) => s.letters);
  const zones = useAuditStore((s) => s.zones);
  const assignLead = useAuditStore((s) => s.assignLead);
  const generateLetters = useAuditStore((s) => s.generateLetters);
  const sendLetter = useAuditStore((s) => s.sendLetter);
  const sendAllLetters = useAuditStore((s) => s.sendAllLetters);

  const [view, setView] = useState<View>("list");
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<MandateStatus | "All">("All");

  // Assignment State
  const [assigningLgaId, setAssigningLgaId] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState("");

  const [formTitle, setFormTitle] = useState("");
  const [formYear, setFormYear] = useState(new Date().getFullYear());
  const [formScope, setFormScope] = useState("");
  const [formObjectives, setFormObjectives] = useState("");
  const [formTimelines, setFormTimelines] = useState("");
  const [formTypes, setFormTypes] = useState<AuditType[]>([]);

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
    setFormTypes([]);
  };

  const handleCreate = () => {
    if (!formTitle.trim() || !formScope.trim() || !user) return;
    createMandate({
      title: formTitle.trim(),
      auditYear: formYear,
      scope: formScope.trim(),
      objectives: formObjectives.trim(),
      timelines: formTimelines.trim(),
      auditTypes: formTypes.length > 0 ? formTypes : ["Financial"],
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
        "By accepting this mandate, you acknowledge the terms and commence the audit process for your LGA. The status will change to Active.",
      confirmText: "Accept & Commence",
      variant: "info",
      onConfirm: () => {
        updateMandateStatus(id, "Active");
        addToast({
          type: "success",
          title: "Mandate Accepted",
          message: "You have successfully acknowledged the mandate.",
        });
      },
    });
  };

  const toggleType = (t: AuditType) => {
    setFormTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const leads = useMemo(
    () => MOCK_USERS.filter((u) => u.role === "AUDIT_LEAD"),
    [],
  );

  const mandateLetters = useMemo(() => {
    if (!selectedId) return [];
    return letters.filter((l) => l.mandateId === selectedId);
  }, [letters, selectedId]);

  const handleGenerateLetters = () => {
    if (!selectedId) return;
    openModal({
      title: "Generate Notification Letters",
      message:
        "This will generate draft notification letters for all LGAs in this mandate. You can review them before sending.",
      confirmText: "Generate Drafts",
      variant: "info",
      onConfirm: () => generateLetters(selectedId),
    });
  };

  const handleSendLetters = () => {
    if (!selectedId) return;
    openModal({
      title: "Dispatch Letters",
      message:
        "Are you sure you want to send all draft letters? This will notify the LGA contacts.",
      confirmText: "Dispatch All",
      variant: "info",
      onConfirm: () => sendAllLetters(selectedId),
    });
  };

  const handleAssign = (lgaId: string) => {
    if (!selectedId || !selectedLeadId) return;
    // We need a dummy audit ID since the store expects one, or we update the store to strictly link Lga->Lead
    // For now, we'll try to find an existing audit or pass a placeholder if the store allows
    // The store `assignLead` updates `lgas` and `audits`.
    // We'll pass the mandate ID as audit ID temporarily if an audit doesn't exist yet,
    // but ideally, we should find the audit for this mandate/LGA.
    // In this demo flow, let's assume one audit per LGA per Mandate.

    // Simplification: We just update the LGA lead for now.
    // Note: Store `assignLead` expects (lgaId, leadId, auditId, mandateId)
    // We'll pass a generated audit ID or existing one.
    assignLead(lgaId, selectedLeadId, `audit-${lgaId}`, selectedId);
    setAssigningLgaId(null);
    setSelectedLeadId("");

    // If supervisor, navigate to Team Management to view the new assignment
    if (user?.role === "AUDIT_SUPERVISOR") {
      navigate("/team");
    }
  };

  if (view === "detail" && selected) {
    const isAG =
      user?.role === "STATE_AUDITOR_GENERAL" ||
      user?.role === "AUDITOR_GENERAL_FEDERATION";
    const isSupervisor = user?.role === "AUDIT_SUPERVISOR";

    // Filter LGAs for Supervisor
    const relevantLgas = isSupervisor
      ? lgas.filter((l) => l.zoneId === user.zoneId)
      : lgas;

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
            {user?.role === "HEAD_OF_LOCAL_GOVERNMENT" &&
              selected.status === "Published" && (
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
            {selected.status === "Draft" && isAG && (
              <button
                className={s.btnPrimary}
                onClick={() => handlePublish(selected.id)}
              >
                <Send size={14} /> Publish
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        {(isAG || isSupervisor) && (
          <div className={s.tabsHeader}>
            <button
              className={`${s.tabBtn} ${activeTab === "overview" ? s.active : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <FileText size={16} /> Overview
            </button>
            <button
              className={`${s.tabBtn} ${activeTab === "assignments" ? s.active : ""}`}
              onClick={() => setActiveTab("assignments")}
            >
              <Users size={16} /> Team & Assignments
            </button>
            {isAG && (
              <button
                className={`${s.tabBtn} ${activeTab === "letters" ? s.active : ""}`}
                onClick={() => setActiveTab("letters")}
              >
                <Mail size={16} /> Notifications
              </button>
            )}
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

        {/* Tab Content: Assignments */}
        {activeTab === "assignments" && (
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Lead Auditor Assignments</h3>
            </div>
            <div className={s.cardBody}>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>LGA Name</th>
                      <th>Zone</th>
                      <th>Assigned Lead</th>
                      {(isSupervisor || user?.role === "SYSTEM_ADMIN") && (
                        <th>Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {relevantLgas.map((lga) => {
                      const lead = leads.find((u) => u.id === lga.auditLeadId);
                      const zone = zones.find((z) => z.id === lga.zoneId);

                      return (
                        <tr key={lga.id}>
                          <td style={{ fontWeight: 600 }}>{lga.name}</td>
                          <td style={{ color: "var(--text-2)" }}>
                            {zone?.name}
                          </td>
                          <td>
                            {lead ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <div
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "50%",
                                    background: "#e0f2fe",
                                    color: "#0369a1",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  {lead.name.charAt(0)}
                                </div>
                                {lead.name}
                              </div>
                            ) : (
                              <span
                                style={{
                                  color: "#94a3b8",
                                  fontStyle: "italic",
                                }}
                              >
                                Unassigned
                              </span>
                            )}
                          </td>
                          {(isSupervisor || user?.role === "SYSTEM_ADMIN") && (
                            <td>
                              <button
                                className={s.btnSecondary}
                                style={{
                                  padding: "0.4rem 0.8rem",
                                  fontSize: "0.8rem",
                                }}
                                onClick={() => {
                                  setAssigningLgaId(lga.id);
                                  setSelectedLeadId(lga.auditLeadId || "");
                                }}
                              >
                                {lead ? "Reassign" : "Assign Lead"}
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Letters */}
        {activeTab === "letters" && (
          <div className={s.card}>
            <div className={s.cardHeader}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <h3 className={s.cardTitle}>Engagement Letters</h3>
                <div style={{ display: "flex", gap: "1rem" }}>
                  {mandateLetters.length === 0 ? (
                    <button
                      className={s.btnPrimary}
                      onClick={handleGenerateLetters}
                    >
                      <FileText size={16} /> Generate Drafts
                    </button>
                  ) : (
                    <button
                      className={s.btnPrimary}
                      onClick={handleSendLetters}
                      disabled={mandateLetters.every(
                        (l) => l.status !== "Draft",
                      )}
                    >
                      <Send size={16} /> Dispatch All
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className={s.cardBody}>
              {mandateLetters.length === 0 ? (
                <div className={s.emptyState}>
                  <Mail size={40} className={s.emptyIcon} />
                  <div className={s.emptyTitle}>No letters generated</div>
                  <div className={s.emptyDesc}>
                    Generate standard engagement letters for all LGA contacts.
                  </div>
                </div>
              ) : (
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>LGA</th>
                        <th>Recipient</th>
                        <th>Status</th>
                        <th>Last Updated</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mandateLetters.map((letter) => {
                        const lga = lgas.find((l) => l.id === letter.lgaId);
                        return (
                          <tr key={letter.id}>
                            <td style={{ fontWeight: 600 }}>{lga?.name}</td>
                            <td>{lga?.contactName}</td>
                            <td>
                              <StatusBadge label={letter.status} />
                            </td>
                            <td
                              style={{
                                fontSize: "0.85rem",
                                color: "var(--text-3)",
                              }}
                            >
                              {new Date().toLocaleDateString()}
                            </td>
                            <td>
                              <button
                                className={s.btnSecondary}
                                style={{
                                  padding: "0.4rem 0.8rem",
                                  fontSize: "0.8rem",
                                }}
                                disabled={letter.status !== "Draft"}
                                onClick={() => {
                                  if (letter.status === "Draft") {
                                    sendLetter(letter.id);
                                    addToast({
                                      type: "success",
                                      title: "Letter Sent",
                                      message: `Notification dispatched to ${lga?.name}`,
                                    });
                                  }
                                }}
                              >
                                {letter.status === "Sent" ? "Sent" : "Dispatch"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {assigningLgaId && (
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
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                width: "90%",
                maxWidth: "500px",
                padding: "1.5rem",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: "1rem",
                  color: "var(--text)",
                }}
              >
                Assign Audit Lead
              </h3>

              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-2)",
                    marginBottom: "1rem",
                    lineHeight: 1.5,
                  }}
                >
                  Assignment for{" "}
                  <strong>
                    {lgas.find((l) => l.id === assigningLgaId)?.name} LGA
                  </strong>
                  . <br />
                  This will designate the selected auditor as the Lead for this
                  engagement.
                </p>

                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "var(--text-2)",
                  }}
                >
                  Select Audit Lead
                </label>
                <select
                  className={s.formInput}
                  autoFocus
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <option value="">Select Auditor...</option>
                  {leads.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.experience?.length}yrs exp)
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
                  disabled={!selectedLeadId}
                  onClick={() => handleAssign(assigningLgaId)}
                >
                  Confirm Assignment
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
                  Timelines
                </label>
                <input
                  id="m-timelines"
                  className={s.formInput}
                  value={formTimelines}
                  onChange={(e) => setFormTimelines(e.target.value)}
                  placeholder="e.g., March 2026 – September 2026"
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
                        {m.status === "Draft" && (
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
