import React, { useState } from "react";
import { Clock, Eye, FileText, X } from "lucide-react";
import s from "../../../styles/pages.module.css";
import StatusBadge from "../../../components/UI/StatusBadge";
import DocumentPreviewModal from "../../../components/UI/DocumentPreviewModal";
import { useAuditStore } from "../../../store/useAuditStore";
import type { Mandate } from "../../../types";

const ComplianceLgaModal: React.FC<{
  mandate: Mandate;
  lgaId: string;
  onClose: () => void;
}> = ({ mandate, lgaId, onClose }) => {
  const lgas = useAuditStore((st) => st.lgas);
  const documentUploads = useAuditStore((st) => st.documentUploads);
  const [previewDoc, setPreviewDoc] = useState<
    (typeof documentUploads)[number] | null
  >(null);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        zIndex: 9999,
        padding: "2rem 1rem",
        overflowY: "auto",
      }}
      className="backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "800px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "column",
          minHeight: "50vh",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
            padding: "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "1.25rem",
                color: "white",
                fontWeight: 700,
              }}
            >
              {lgas.find((l) => l.id === lgaId)?.name} LGA
            </h3>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Compliance Checklist — {mandate.title}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
            }}
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
                    (d) => d.mandateId === mandate.id && d.lgaId === lgaId,
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
                                The council has not accepted this mandate so the
                                document checklist has not been generated.
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
                              {new Date(doc.uploadedAt!).toLocaleDateString()}
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
                            <Eye size={12} style={{ marginRight: "4px" }} />{" "}
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
          <button className={s.btnSecondary} onClick={onClose}>
            Close Checklist
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceLgaModal;
