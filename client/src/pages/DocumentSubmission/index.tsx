import { useState, useMemo, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuditStore } from "../../store/useAuditStore";
import { saveFile } from "../../utils/fileStorage";
import {
  FileText,
  Upload,
  ClipboardList,
  Handshake,
  ChevronRight,
  ShieldAlert,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Check,
} from "lucide-react";
import StatusBadge from "../../components/UI/StatusBadge";
import QuestionnairePage from "../Questionnaire";
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

const docStatusIcon = (status: string) => {
  if (status === "Approved") return <CheckCircle size={16} color="#22c55e" />;
  if (status === "Rejected") return <XCircle size={16} color="#ef4444" />;
  if (status === "Uploaded") return <Clock size={16} color="#f59e0b" />;
  return <AlertCircle size={16} color="#94a3b8" />;
};

export default function DocumentSubmission() {
  const { user } = useAuth();
  const mandates = useAuditStore((st) => st.mandates);
  const letters = useAuditStore((st) => st.letters);
  const documentUploads = useAuditStore((st) => st.documentUploads);
  const audits = useAuditStore((st) => st.audits);
  const updateLetterStatus = useAuditStore((st) => st.updateLetterStatus);
  const ensureDocumentsExist = useAuditStore((st) => st.ensureDocumentsExist);
  const signOffDocuments = useAuditStore((st) => st.signOffDocuments);
  const openModal = useAuditStore((st) => st.openModal);
  const addToast = useAuditStore((st) => st.addToast);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [, setUploading] = useState(false);

  const activeAudit = useMemo(
    () =>
      audits.find((a) => a.lgaId === user?.lgaId && a.status === "Pre-Audit"),
    [audits, user],
  );

  const [activeTab, setActiveTab] = useState<StepId>("mandates");

  const activeMandateId = useMemo(() => {
    if (!activeAudit?.mandateId) {
      const pub = mandates.find(
        (m) => m.status === "Published" || m.status === "Active",
      );
      return pub?.id;
    }
    return activeAudit.mandateId;
  }, [activeAudit, mandates]);

  const activeMandate = useMemo(
    () => mandates.find((m) => m.id === activeMandateId),
    [mandates, activeMandateId],
  );

  // Ensure required documents are initialised
  useMemo(() => {
    if (activeMandateId && user?.lgaId) {
      ensureDocumentsExist(activeMandateId, user.lgaId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMandateId, user?.lgaId]);

  const myLetter = useMemo(
    () => letters.find((l) => l.lgaId === user?.lgaId),
    [letters, user],
  );

  const myDocs = useMemo(
    () =>
      documentUploads.filter(
        (d) => d.lgaId === user?.lgaId && d.mandateId === activeMandateId,
      ),
    [documentUploads, user, activeMandateId],
  );

  const docsUploaded = myDocs.filter((d) => d.status !== "Not Uploaded").length;
  const docsApproved = myDocs.filter((d) => d.status === "Approved").length;

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

  if (!activeAudit && !activeMandate) {
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

  const handleAcknowledgeLetter = () => {
    if (!myLetter) return;
    openModal({
      title: "Acknowledge Mandate Letter",
      message:
        "By acknowledging, you confirm receipt of the official audit mandate notification letter.",
      confirmText: "Acknowledge Receipt",
      variant: "info",
      onConfirm: () => {
        updateLetterStatus(myLetter.id, "Acknowledged");
        addToast({ type: "success", title: "Letter Acknowledged" });
      },
    });
  };

  const handleDocUpload = (docId: string) => {
    setUploadingDocId(docId);
    setSelectedFileName("");
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingDocId || !user?.lgaId || !activeMandateId) return;
    setSelectedFileName(file.name);
    const existingDoc = myDocs.find((d) => d.id === uploadingDocId);
    if (!existingDoc) return;
    setUploading(true);
    try {
      // Save the binary to localforage under the doc's stable ID
      await saveFile(existingDoc.id, file);
      // Update the existing record in-place (preserving its deterministic id)
      useAuditStore.setState((s) => ({
        documentUploads: s.documentUploads.map((d) =>
          d.id === existingDoc.id
            ? {
                ...d,
                status: "Uploaded" as const,
                fileName: file.name,
                fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                uploadedBy: user.id,
                uploadedAt: new Date().toISOString(),
                version: (d.version || 1) + 1,
                reviewedBy: undefined,
                reviewedAt: undefined,
                rejectionReason: undefined,
              }
            : d,
        ),
      }));
      addToast({
        type: "success",
        title: "Document Uploaded",
        message: existingDoc.documentName,
      });
    } finally {
      setUploading(false);
      setUploadingDocId(null);
    }
    // Reset input for re-use
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSignOff = () => {
    if (!activeAudit || !user) return;
    openModal({
      title: "Sign Off Scope Agreement",
      message:
        "By signing off, you confirm acceptance of the audit scope, objectives and timeline. This action cannot be undone.",
      confirmText: "Sign Off",
      variant: "info",
      onConfirm: () => {
        signOffDocuments(activeAudit.id, user.id);
        addToast({
          type: "success",
          title: "Scope Agreement Signed",
          message:
            "Your sign-off has been recorded. The audit team has been notified.",
        });
      },
    });
  };

  const stepStatus = {
    mandates: myLetter?.status === "Acknowledged" ? "done" : "pending",
    docs:
      docsApproved === myDocs.length && myDocs.length > 0
        ? "done"
        : docsUploaded > 0
          ? "partial"
          : "pending",
    questionnaire: "pending" as "done" | "partial" | "pending",
    scope: activeAudit?.documentsSignedOff ? "done" : "pending",
  } as Record<StepId, "done" | "partial" | "pending">;

  return (
    <div className={s.pageWrapper}>
      {/* Hidden file input for document uploads */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        accept=".pdf,.xlsx,.xls,.docx,.doc,.csv"
        onChange={handleFileSelected}
      />

      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Engagement Readiness</h1>
          <p className={s.pageSubtitle}>
            Complete these steps to proceed to audit fieldwork.
          </p>
        </div>
        <StatusBadge label="Pre-Audit" variant="info" />
      </div>

      {/* Progress Summary */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {STEPS.map((step) => {
          const st = stepStatus[step.id];
          return (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "20px",
                background:
                  st === "done"
                    ? "#dcfce7"
                    : st === "partial"
                      ? "#fef9c3"
                      : "#f1f5f9",
                color:
                  st === "done"
                    ? "#166534"
                    : st === "partial"
                      ? "#713f12"
                      : "#64748b",
                fontSize: "0.82rem",
                fontWeight: 500,
              }}
            >
              {st === "done" ? <Check size={13} /> : <Clock size={13} />}
              {step.label}
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "flex-start",
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
            const st = stepStatus[step.id];
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
                {st === "done" ? (
                  <CheckCircle size={15} color="#22c55e" />
                ) : (
                  isActive && <ChevronRight size={16} />
                )}
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
          {/* ── MANDATES TAB ── */}
          {activeTab === "mandates" && (
            <div>
              <h3 style={{ marginBottom: "0.5rem" }}>Mandate Letter</h3>
              <p
                style={{
                  color: "var(--text-2)",
                  marginBottom: "1.5rem",
                  fontSize: "0.9rem",
                }}
              >
                Review and acknowledge the official audit notification letter
                sent by the State Auditor-General.
              </p>

              {activeMandate ? (
                <div
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "1.25rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {activeMandate.title}
                      </div>
                      <div
                        style={{ color: "var(--text-2)", fontSize: "0.85rem" }}
                      >
                        Audit Year: {activeMandate.auditYear}
                      </div>
                      {activeMandate.scope && (
                        <div
                          style={{
                            color: "var(--text-2)",
                            fontSize: "0.85rem",
                            marginTop: "0.5rem",
                          }}
                        >
                          {activeMandate.scope}
                        </div>
                      )}
                      {activeMandate.publishedAt && (
                        <div
                          style={{
                            color: "var(--text-2)",
                            fontSize: "0.82rem",
                            marginTop: "0.5rem",
                          }}
                        >
                          Published:{" "}
                          {new Date(
                            activeMandate.publishedAt,
                          ).toLocaleDateString("en-NG")}
                        </div>
                      )}
                    </div>
                    <StatusBadge label={activeMandate.status} variant="info" />
                  </div>
                </div>
              ) : (
                <div className={s.emptyState} style={{ padding: "2rem" }}>
                  <FileText size={36} color="#cbd5e1" />
                  <p style={{ color: "var(--text-2)", marginTop: "0.75rem" }}>
                    No mandate letter found.
                  </p>
                </div>
              )}

              {myLetter ? (
                <div
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "1.25rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>Notification Letter</div>
                    <StatusBadge
                      label={myLetter.status}
                      variant={
                        myLetter.status === "Acknowledged"
                          ? "success"
                          : myLetter.status === "Sent"
                            ? "warning"
                            : "info"
                      }
                    />
                  </div>
                  <div
                    style={{
                      color: "var(--text-2)",
                      fontSize: "0.85rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Sent:{" "}
                    {myLetter.sentAt
                      ? new Date(myLetter.sentAt).toLocaleDateString("en-NG")
                      : "—"}
                  </div>
                  {myLetter.status !== "Acknowledged" ? (
                    <button
                      className={s.btnPrimary}
                      onClick={handleAcknowledgeLetter}
                      style={{ marginTop: "0.75rem" }}
                    >
                      <Check size={15} /> Acknowledge Receipt
                    </button>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "#166534",
                        marginTop: "0.75rem",
                        fontWeight: 600,
                        fontSize: "0.88rem",
                      }}
                    >
                      <CheckCircle size={16} /> Acknowledged
                      {myLetter.acknowledgedAt
                        ? ` on ${new Date(myLetter.acknowledgedAt).toLocaleDateString("en-NG")}`
                        : ""}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    padding: "1rem",
                    background: "#fef9c3",
                    borderRadius: "8px",
                    fontSize: "0.88rem",
                    color: "#713f12",
                  }}
                >
                  <AlertCircle
                    size={15}
                    style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
                  />
                  No notification letter has been sent to your council yet. The
                  audit team will send one shortly.
                </div>
              )}
            </div>
          )}

          {/* ── DOCUMENTS TAB ── */}
          {activeTab === "docs" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.5rem",
                }}
              >
                <h3>Required Documents</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>
                  {docsUploaded} of {myDocs.length} submitted · {docsApproved}{" "}
                  approved
                </span>
              </div>
              <p
                style={{
                  color: "var(--text-2)",
                  marginBottom: "1.5rem",
                  fontSize: "0.9rem",
                }}
              >
                Upload the documents requested by the audit team. Accepted
                formats: PDF, Excel, Word.
              </p>

              {myDocs.length === 0 ? (
                <div className={s.emptyState} style={{ padding: "2rem" }}>
                  <Upload size={36} color="#cbd5e1" />
                  <p style={{ color: "var(--text-2)", marginTop: "0.75rem" }}>
                    No documents required yet. Ensure the mandate is active.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {myDocs.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "1rem 1.25rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "1rem",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{ fontWeight: 600, marginBottom: "0.2rem" }}
                          >
                            {doc.documentName}
                          </div>
                          <div
                            style={{
                              color: "var(--text-2)",
                              fontSize: "0.82rem",
                              marginBottom: "0.4rem",
                            }}
                          >
                            {doc.description}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.78rem",
                                background: "#f1f5f9",
                                padding: "0.15rem 0.5rem",
                                borderRadius: "4px",
                                color: "#64748b",
                              }}
                            >
                              {doc.requiredFormat}
                            </span>
                            {doc.dueDate && (
                              <span
                                style={{
                                  fontSize: "0.78rem",
                                  color: "var(--text-2)",
                                }}
                              >
                                Due:{" "}
                                {new Date(doc.dueDate).toLocaleDateString(
                                  "en-NG",
                                )}
                              </span>
                            )}
                          </div>
                          {doc.fileName && (
                            <div
                              style={{
                                fontSize: "0.8rem",
                                color: "#2563eb",
                                marginTop: "0.4rem",
                              }}
                            >
                              {doc.fileName}
                            </div>
                          )}
                          {doc.rejectionReason && (
                            <div
                              style={{
                                fontSize: "0.82rem",
                                color: "#dc2626",
                                marginTop: "0.4rem",
                              }}
                            >
                              Rejection reason: {doc.rejectionReason}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: "0.5rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem",
                            }}
                          >
                            {docStatusIcon(doc.status)}
                            <span
                              style={{
                                fontSize: "0.82rem",
                                fontWeight: 600,
                                color:
                                  doc.status === "Approved"
                                    ? "#166534"
                                    : doc.status === "Rejected"
                                      ? "#dc2626"
                                      : doc.status === "Uploaded"
                                        ? "#92400e"
                                        : "#64748b",
                              }}
                            >
                              {doc.status}
                            </span>
                          </div>
                          {doc.status !== "Approved" && (
                            <button
                              className={s.btnOutline}
                              style={{
                                fontSize: "0.8rem",
                                padding: "0.35rem 0.8rem",
                              }}
                              onClick={() => handleDocUpload(doc.id)}
                            >
                              <Upload size={13} />{" "}
                              {doc.status === "Not Uploaded"
                                ? "Upload"
                                : "Re-upload"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {selectedFileName && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem",
                    background: "#dcfce7",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    color: "#166534",
                  }}
                >
                  <CheckCircle
                    size={14}
                    style={{ verticalAlign: "middle", marginRight: "0.4rem" }}
                  />
                  Uploaded: {selectedFileName}
                </div>
              )}
            </div>
          )}

          {/* ── QUESTIONNAIRE TAB ── */}
          {activeTab === "questionnaire" && (
            <div>
              <h3 style={{ marginBottom: "0.25rem" }}>Entity Questionnaire</h3>
              <p
                style={{
                  color: "var(--text-2)",
                  marginBottom: "1.5rem",
                  fontSize: "0.9rem",
                }}
              >
                Complete the engagement readiness questionnaire. Your responses
                will be reviewed by the audit team.
              </p>
              <QuestionnairePage auditId={activeAudit?.id} embedded />
            </div>
          )}

          {/* ── SCOPE TAB ── */}
          {activeTab === "scope" && (
            <div>
              <h3 style={{ marginBottom: "0.5rem" }}>Scope Agreement</h3>
              <p
                style={{
                  color: "var(--text-2)",
                  marginBottom: "1.5rem",
                  fontSize: "0.9rem",
                }}
              >
                Review the audit scope and formally sign off to confirm your
                acceptance.
              </p>

              {activeAudit ? (
                <>
                  <div
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "1.25rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        marginBottom: "1rem",
                        color: "var(--text)",
                      }}
                    >
                      Audit Scope Details
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.75rem",
                      }}
                    >
                      {[
                        {
                          label: "Audit Type",
                          value: activeAudit.type || "Compliance & Financial",
                        },
                        {
                          label: "Audit Year",
                          value:
                            activeAudit.year || activeMandate?.auditYear || "—",
                        },
                        {
                          label: "Status",
                          value: activeAudit.status,
                        },
                        {
                          label: "Documents Approved",
                          value: `${docsApproved} / ${myDocs.length}`,
                        },
                      ].map((item) => (
                        <div key={item.label}>
                          <div
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--text-2)",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              marginBottom: "0.2rem",
                            }}
                          >
                            {item.label}
                          </div>
                          <div style={{ fontWeight: 600 }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {activeAudit.documentsSignedOff ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "1rem 1.25rem",
                        background: "#dcfce7",
                        borderRadius: "8px",
                        fontWeight: 600,
                        color: "#166534",
                      }}
                    >
                      <CheckCircle size={20} />
                      Scope Agreement Signed
                      {activeAudit.documentsSignedOffAt
                        ? ` on ${new Date(activeAudit.documentsSignedOffAt).toLocaleDateString("en-NG")}`
                        : ""}
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          padding: "1rem",
                          background: "#fef9c3",
                          borderRadius: "8px",
                          fontSize: "0.88rem",
                          color: "#713f12",
                          marginBottom: "1rem",
                        }}
                      >
                        <AlertCircle
                          size={14}
                          style={{
                            verticalAlign: "middle",
                            marginRight: "0.4rem",
                          }}
                        />
                        By signing off, you confirm that you have reviewed the
                        audit scope and agree to cooperate with the audit team
                        throughout the engagement.
                      </div>
                      <button className={s.btnPrimary} onClick={handleSignOff}>
                        <Handshake size={16} /> Sign Off Scope Agreement
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className={s.emptyState} style={{ padding: "2rem" }}>
                  <Handshake size={36} color="#cbd5e1" />
                  <p style={{ color: "var(--text-2)", marginTop: "0.75rem" }}>
                    No active audit found for scope agreement.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
