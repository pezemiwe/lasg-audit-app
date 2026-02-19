import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import StatusBadge from "../../components/UI/StatusBadge";
import { getSmartNotification } from "../../utils/auditLogic";
import type { DocumentUploadStatus } from "../../types";
import {
  Upload,
  Clock,
  XCircle,
  CheckCircle2,
  Eye,
  ChevronLeft,
  Search,
  FolderOpen,
  AlertTriangle,
} from "lucide-react";
import s from "../../styles/pages.module.css";

const docStatusVariant = (status: DocumentUploadStatus) => {
  switch (status) {
    case "Approved":
      return "success" as const;
    case "Uploaded":
      return "info" as const;
    case "Rejected":
      return "error" as const;
    default:
      return "default" as const;
  }
};

const DocumentPortalPage: React.FC<{
  auditId?: string;
  embedded?: boolean;
}> = ({ auditId, embedded }) => {
  const { user } = useAuth();
  const mandates = useAuditStore((st) => st.mandates);
  const lgas = useAuditStore((st) => st.lgas);
  const audits = useAuditStore((st) => st.audits);
  const documentUploads = useAuditStore((st) => st.documentUploads);
  const reviewDocument = useAuditStore((st) => st.reviewDocument);
  const addToast = useAuditStore((st) => st.addToast);
  const openModal = useAuditStore((st) => st.openModal);

  // If embedded, try to match the audit's mandate or LGA
  const parentAudit = auditId ? audits.find((a) => a.id === auditId) : null;
  const parentLgaId = parentAudit?.lgaId;

  const [selectedMandateId, setSelectedMandateId] = useState<string>(
    mandates.find((m) => m.status === "Published" || m.status === "Active")
      ?.id ||
      mandates[0]?.id ||
      "",
  );
  const [selectedLgaId, setSelectedLgaId] = useState<string>(
    parentLgaId || "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    DocumentUploadStatus | "All"
  >("All");
  const [detailDocId, setDetailDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const isAdmin =
    user?.role === "STATE_AUDITOR_GENERAL" ||
    user?.role === "AUDIT_SUPERVISOR" ||
    user?.role === "AUDIT_LEAD" ||
    user?.role === "SYSTEM_ADMIN";

  // Auditor General can only view, Audit Lead and Supervisor can approve
  const canApprove =
    user?.role === "AUDIT_LEAD" || user?.role === "AUDIT_SUPERVISOR";

  const isLGA = user?.role === "HEAD_OF_LOCAL_GOVERNMENT";

  const filteredDocs = useMemo(() => {
    let docs = documentUploads.filter((d) => d.mandateId === selectedMandateId);
    if (isLGA && user?.lgaId) {
      docs = docs.filter((d) => d.lgaId === user.lgaId);
    } else if (selectedLgaId !== "all") {
      docs = docs.filter((d) => d.lgaId === selectedLgaId);
    }
    if (statusFilter !== "All") {
      docs = docs.filter((d) => d.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.documentName.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q),
      );
    }
    return docs;
  }, [
    documentUploads,
    selectedMandateId,
    selectedLgaId,
    statusFilter,
    searchQuery,
    isLGA,
    user,
  ]);

  const allMandateDocs = useMemo(
    () => documentUploads.filter((d) => d.mandateId === selectedMandateId),
    [documentUploads, selectedMandateId],
  );

  const kpis = useMemo(() => {
    const target =
      isLGA && user?.lgaId
        ? allMandateDocs.filter((d) => d.lgaId === user.lgaId)
        : allMandateDocs;
    return {
      total: target.length,
      uploaded: target.filter((d) => d.status === "Uploaded").length,
      approved: target.filter((d) => d.status === "Approved").length,
      rejected: target.filter((d) => d.status === "Rejected").length,
      notUploaded: target.filter((d) => d.status === "Not Uploaded").length,
    };
  }, [allMandateDocs, isLGA, user]);

  const detailDoc = documentUploads.find((d) => d.id === detailDocId);

  const handleSimUpload = (docId: string, docName: string) => {
    const store = useAuditStore.getState();
    store.reviewDocument(docId, "", false);
    const doc = store.documentUploads.find((d) => d.id === docId);
    if (doc) {
      const idx = store.documentUploads.indexOf(doc);
      const updated = [...store.documentUploads];
      updated[idx] = {
        ...doc,
        status: "Uploaded",
        fileName: `${docName.replace(/\s+/g, "_").toLowerCase()}_v${doc.version + 1}.pdf`,
        fileSize: `${(doc.version * 1.2 + 0.8).toFixed(1)} MB`,
        uploadedBy: user?.id || "",
        uploadedAt: new Date().toISOString(),
        version: doc.version + 1,
        reviewedBy: undefined,
        reviewedAt: undefined,
        rejectionReason: undefined,
      };
      useAuditStore.setState({ documentUploads: updated });
    }

    // Automation: Notify Audit Team
    const notif = getSmartNotification("UPLOAD", docName);
    addToast({
      type: "success",
      title: "Document Uploaded",
      message: notif.message,
    });
  };

  const handleReview = (docId: string, approved: boolean) => {
    if (!approved && !rejectionReason.trim()) {
      addToast({
        type: "error",
        title: "Rejection Reason Required",
        message: "Please provide a reason for rejection",
      });
      return;
    }
    reviewDocument(
      docId,
      user?.id || "",
      approved,
      approved ? undefined : rejectionReason,
    );
    setRejectionReason("");
    if (approved) {
      addToast({ type: "success", title: "Document Approved" });
    } else {
      addToast({
        type: "warning",
        title: "Document Rejected",
        message: "LGA will be notified to re-upload",
      });
    }
  };

  if (detailDoc) {
    const lga = lgas.find((l) => l.id === detailDoc.lgaId);
    return (
      <div>
        <button
          className={s.btnOutline}
          style={{ marginBottom: "1.5rem" }}
          onClick={() => {
            setDetailDocId(null);
            setRejectionReason("");
          }}
        >
          <ChevronLeft size={14} /> Back to Portal
        </button>

        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>{detailDoc.documentName}</h1>
            <p className={s.pageSubtitle}>
              {lga?.name} LGA | Due:{" "}
              {new Date(detailDoc.dueDate).toLocaleDateString()}
            </p>
          </div>
          <StatusBadge
            label={detailDoc.status}
            variant={docStatusVariant(detailDoc.status)}
          />
        </div>

        <div className={s.gridTwoCols}>
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Document Details</h3>
            </div>
            <div className={s.cardBody}>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Description</span>
                <span className={s.detailValue}>{detailDoc.description}</span>
              </div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Required Format</span>
                <span className={s.detailValue}>
                  {detailDoc.requiredFormat}
                </span>
              </div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Version</span>
                <span className={s.detailValue}>v{detailDoc.version}</span>
              </div>
              <div className={s.detailRow}>
                <span className={s.detailLabel}>Due Date</span>
                <span className={s.detailValue}>
                  {new Date(detailDoc.dueDate).toLocaleDateString()}
                </span>
              </div>
              {detailDoc.fileName && (
                <>
                  <div className={s.detailRow}>
                    <span className={s.detailLabel}>File Name</span>
                    <span className={s.detailValue}>{detailDoc.fileName}</span>
                  </div>
                  <div className={s.detailRow}>
                    <span className={s.detailLabel}>File Size</span>
                    <span className={s.detailValue}>{detailDoc.fileSize}</span>
                  </div>
                  <div className={s.detailRow}>
                    <span className={s.detailLabel}>Uploaded At</span>
                    <span className={s.detailValue}>
                      {detailDoc.uploadedAt
                        ? new Date(detailDoc.uploadedAt).toLocaleString()
                        : "-"}
                    </span>
                  </div>
                </>
              )}
              {detailDoc.rejectionReason && (
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Rejection Reason</span>
                  <span className={s.detailValue} style={{ color: "#dc2626" }}>
                    {detailDoc.rejectionReason}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Actions</h3>
            </div>
            <div className={s.cardBody}>
              {isLGA &&
                (detailDoc.status === "Not Uploaded" ||
                  detailDoc.status === "Rejected") && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-2)",
                        marginBottom: "1rem",
                      }}
                    >
                      Upload your document in {detailDoc.requiredFormat} format.
                      {detailDoc.status === "Rejected" &&
                        " Please address the rejection feedback before re-uploading."}
                    </p>
                    <button
                      className={s.btnPrimary}
                      onClick={() =>
                        handleSimUpload(detailDoc.id, detailDoc.documentName)
                      }
                    >
                      <Upload size={14} />{" "}
                      {detailDoc.status === "Rejected"
                        ? "Re-Upload Document"
                        : "Upload Document"}
                    </button>
                  </div>
                )}

              {isLGA && detailDoc.status === "Uploaded" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#0369a1",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  <Clock size={16} /> Pending Review by Audit Team
                </div>
              )}

              {isAdmin && canApprove && detailDoc.status === "Uploaded" && (
                <div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-2)",
                      marginBottom: "1rem",
                    }}
                  >
                    Review the uploaded document and approve or reject with
                    feedback.
                  </p>
                  <div style={{ marginBottom: "1rem" }}>
                    <label className={s.formLabel}>
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      className={s.formTextarea}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide specific feedback on what needs to be corrected"
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                      className={s.btnPrimary}
                      onClick={() => handleReview(detailDoc.id, true)}
                    >
                      <CheckCircle2 size={14} /> Approve
                    </button>
                    <button
                      className={s.btnDanger}
                      onClick={() => handleReview(detailDoc.id, false)}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              )}

              {isAdmin && !canApprove && detailDoc.status === "Uploaded" && (
                <div
                  style={{
                    padding: "1rem",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "4px",
                    color: "#64748b",
                    fontSize: "0.85rem",
                    fontStyle: "italic",
                  }}
                >
                  You are in view-only mode. Only Audit Leads and Supervisors
                  can approve documents.
                </div>
              )}

              {detailDoc.status === "Approved" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#16a34a",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                  }}
                >
                  <CheckCircle2 size={16} /> Document Approved
                  {detailDoc.reviewedAt &&
                    ` on ${new Date(detailDoc.reviewedAt).toLocaleDateString()}`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!embedded && (
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Document Upload Portal</h1>
            <p className={s.pageSubtitle}>
              {isLGA
                ? "Submit required audit documents and track review status"
                : "Review and manage LGA document submissions across all mandates"}
            </p>
          </div>
          <span className={s.pageBadge}>
            <FolderOpen size={12} /> Document Portal
          </span>
        </div>
      )}

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <FolderOpen size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Total Documents</div>
            <div className={s.kpiValue}>{kpis.total}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Approved</div>
            <div className={s.kpiValue}>{kpis.approved}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Clock size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Pending Review</div>
            <div className={s.kpiValue}>{kpis.uploaded}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Rejected / Not Uploaded</div>
            <div className={s.kpiValue}>{kpis.rejected + kpis.notUploaded}</div>
          </div>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <div className={s.filterBar}>
            <select
              className={s.formSelect}
              value={selectedMandateId}
              onChange={(e) => setSelectedMandateId(e.target.value)}
              style={{ width: 260 }}
            >
              {mandates.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.auditYear})
                </option>
              ))}
            </select>
            {!isLGA && (
              <select
                className={s.formSelect}
                value={selectedLgaId}
                onChange={(e) => setSelectedLgaId(e.target.value)}
                style={{ width: 200 }}
              >
                <option value="all">All LGAs</option>
                {lgas.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            )}
            {(
              [
                "All",
                "Not Uploaded",
                "Uploaded",
                "Approved",
                "Rejected",
              ] as const
            ).map((f) => (
              <button
                key={f}
                className={
                  statusFilter === f ? s.filterChipActive : s.filterChip
                }
                onClick={() => setStatusFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className={s.searchContainer}>
            <Search size={14} className={s.searchIcon} />
            <input
              className={s.searchInput}
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className={s.cardBody} style={{ padding: 0 }}>
          {filteredDocs.length === 0 ? (
            <div className={s.emptyState}>
              <FolderOpen size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No Documents Found</div>
              <div className={s.emptyDesc}>
                {searchQuery
                  ? "Try adjusting your search or filters."
                  : "No documents match the current filter criteria."}
              </div>
            </div>
          ) : (
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    {!isLGA && <th>LGA</th>}
                    <th>Document</th>
                    <th>Format</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Version</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => {
                    const lga = lgas.find((l) => l.id === doc.lgaId);
                    const overdue =
                      doc.status !== "Approved" &&
                      new Date(doc.dueDate) < new Date();
                    return (
                      <tr key={doc.id}>
                        {!isLGA && (
                          <td style={{ fontWeight: 600 }}>
                            {lga?.name || doc.lgaId}
                          </td>
                        )}
                        <td>
                          <div style={{ fontWeight: 600 }}>
                            {doc.documentName}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-3)",
                              marginTop: "0.15rem",
                            }}
                          >
                            {doc.description.slice(0, 60)}
                            {doc.description.length > 60 ? "..." : ""}
                          </div>
                        </td>
                        <td>{doc.requiredFormat}</td>
                        <td>
                          <span
                            style={{
                              color: overdue ? "#dc2626" : "inherit",
                              fontWeight: overdue ? 600 : 400,
                            }}
                          >
                            {new Date(doc.dueDate).toLocaleDateString()}
                            {overdue && (
                              <AlertTriangle
                                size={12}
                                style={{
                                  marginLeft: "0.35rem",
                                  verticalAlign: "middle",
                                }}
                              />
                            )}
                          </span>
                        </td>
                        <td>
                          <StatusBadge
                            label={doc.status}
                            variant={docStatusVariant(doc.status)}
                          />
                        </td>
                        <td>v{doc.version}</td>
                        <td>
                          <div className={s.tableActions}>
                            <button
                              className={s.btnIcon}
                              title="View Details"
                              onClick={() => setDetailDocId(doc.id)}
                            >
                              <Eye size={14} />
                            </button>
                            {isLGA &&
                              (doc.status === "Not Uploaded" ||
                                doc.status === "Rejected") && (
                                <button
                                  className={`${s.btnPrimary} ${s.btnSmall}`}
                                  onClick={() =>
                                    handleSimUpload(doc.id, doc.documentName)
                                  }
                                >
                                  <Upload size={12} /> Upload
                                </button>
                              )}
                            {isAdmin &&
                              canApprove &&
                              doc.status === "Uploaded" && (
                                <>
                                  <button
                                    className={`${s.btnPrimary} ${s.btnSmall}`}
                                    onClick={() => {
                                      openModal({
                                        title: "Approve Document",
                                        message: `Approve "${doc.documentName}" from ${lga?.name || doc.lgaId}?`,
                                        confirmText: "Approve",
                                        variant: "info",
                                        onConfirm: () =>
                                          handleReview(doc.id, true),
                                      });
                                    }}
                                  >
                                    <CheckCircle2 size={12} />
                                  </button>
                                  <button
                                    className={`${s.btnDanger} ${s.btnSmall}`}
                                    onClick={() => setDetailDocId(doc.id)}
                                    title="Reject with feedback"
                                  >
                                    <XCircle size={12} />
                                  </button>
                                </>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className={s.cardFooter}>
          Showing {filteredDocs.length} of {allMandateDocs.length} documents
        </div>
      </div>
    </div>
  );
};

export default DocumentPortalPage;
