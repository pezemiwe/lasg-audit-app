/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { DocumentUpload, LGA } from "../../../types";
import StatusBadge from "../../../components/UI/StatusBadge";
import DocumentPreviewModal from "../../../components/UI/DocumentPreviewModal";
import {
  Upload,
  Clock,
  XCircle,
  CheckCircle2,
  Eye,
  ChevronLeft,
  RotateCw,
  Trash2,
} from "lucide-react";
import s from "../../../styles/pages.module.css";
import { docStatusVariant } from "../utils/docStatus";

type Props = {
  detailDoc: DocumentUpload;
  lga: LGA | undefined;
  isLGA: boolean;
  isAdmin: boolean;
  canApprove: boolean;
  rejectionReason: string;
  setRejectionReason: (v: string) => void;
  previewDoc: any | null;
  setPreviewDoc: (v: any | null) => void;
  onBack: () => void;
  onTriggerUpload: (docId: string) => void;
  onDelete: (docId: string) => void;
  onReview: (docId: string, approved: boolean) => void;
};

const DocumentDetailView: React.FC<Props> = ({
  detailDoc,
  lga,
  isLGA,
  isAdmin,
  canApprove,
  rejectionReason,
  setRejectionReason,
  previewDoc,
  setPreviewDoc,
  onBack,
  onTriggerUpload,
  onDelete,
  onReview,
}) => (
  <div>
    <button
      className={s.btnOutline}
      style={{ marginBottom: "1.5rem" }}
      onClick={onBack}
    >
      <ChevronLeft size={14} /> Back to Portal
    </button>

    <div className={s.pageHeader}>
      <div>
        <h1 className={s.pageTitle}>{detailDoc.documentName}</h1>
        <p className={s.pageSubtitle}>
          {lga?.name} | Due: {new Date(detailDoc.dueDate).toLocaleDateString()}
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
            <span className={s.detailValue}>{detailDoc.requiredFormat}</span>
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
                <span className={s.detailValue}>
                  <div className="flex items-center gap-2">
                    {detailDoc.fileName}
                    <button
                      onClick={() =>
                        setPreviewDoc({
                          id: detailDoc.id,
                          name: detailDoc.documentName,
                          type: detailDoc.requiredFormat,
                          uploadedBy: detailDoc.uploadedBy,
                          uploadedAt:
                            detailDoc.uploadedAt || new Date().toISOString(),
                          size: detailDoc.fileSize,
                          fileName: detailDoc.fileName,
                        })
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 rounded-md border border-blue-200 shadow-sm transition-all"
                      title="Preview Document"
                    >
                      <Eye size={14} /> Preview
                    </button>
                  </div>
                </span>
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
        <div
          className={s.cardBody}
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
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
                  onClick={() => onTriggerUpload(detailDoc.id)}
                >
                  <Upload size={14} />{" "}
                  {detailDoc.status === "Rejected"
                    ? "Re-Upload Document"
                    : "Upload Document"}
                </button>
              </div>
            )}

          {isLGA && detailDoc.status === "Uploaded" && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#0369a1",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                <Clock size={16} /> Pending Review by Audit Team
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  className={s.btnSecondary}
                  onClick={() => onTriggerUpload(detailDoc.id)}
                >
                  <RotateCw size={14} /> Re-Upload Document
                </button>
                <button
                  className={s.btnDanger}
                  onClick={() => onDelete(detailDoc.id)}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          )}

          {isAdmin && canApprove && detailDoc.status === "Uploaded" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
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
              <div
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                }}
              >
                <label className={s.formLabel}>
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  className={s.formTextarea}
                  style={{
                    flexGrow: 1,
                    minHeight: "150px",
                    resize: "none",
                  }}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide specific feedback on what needs to be corrected"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexShrink: 0,
                  marginTop: "auto",
                }}
              >
                <button
                  className={s.btnPrimary}
                  onClick={() => onReview(detailDoc.id, true)}
                >
                  <CheckCircle2 size={14} /> Approve
                </button>
                <button
                  className={s.btnDanger}
                  onClick={() => onReview(detailDoc.id, false)}
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
              You are in view-only mode. Only Audit Leads and Supervisors can
              approve documents.
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
    {previewDoc && (
      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    )}
  </div>
);

export default DocumentDetailView;
