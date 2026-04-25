import React from "react";
import type { DocumentUpload, LGA } from "../../../types";
import {
  Upload,
  XCircle,
  CheckCircle2,
  Eye,
  FolderOpen,
  RotateCw,
  Trash2,
} from "lucide-react";
import s from "../../../styles/pages.module.css";

type Props = {
  filteredDocs: DocumentUpload[];
  allMandateDocsCount: number;
  lgas: LGA[];
  isLGA: boolean;
  isAdmin: boolean;
  canApprove: boolean;
  embedded: boolean | undefined;
  searchQuery: string;
  onOpenDetail: (docId: string) => void;
  onTriggerUpload: (docId: string) => void;
  onDelete: (docId: string) => void;
  onFileChange: (
    docId: string,
    e: React.ChangeEvent<HTMLInputElement>,
    docName: string,
  ) => void;
  onApprove: (doc: DocumentUpload, lgaName: string) => void;
};

const DocumentTable: React.FC<Props> = ({
  filteredDocs,
  allMandateDocsCount,
  lgas,
  isLGA,
  isAdmin,
  canApprove,
  embedded,
  searchQuery,
  onOpenDetail,
  onTriggerUpload,
  onDelete,
  onFileChange,
  onApprove,
}) => (
  <>
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
                {!isLGA && !embedded && <th>Council</th>}
                <th>Document</th>
                <th>Format</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => {
                const lga = lgas.find((l) => l.id === doc.lgaId);
                return (
                  <tr key={doc.id}>
                    {!isLGA && !embedded && (
                      <td style={{ fontWeight: 600 }}>
                        {lga?.name || doc.lgaId}
                      </td>
                    )}
                    <td>
                      <div style={{ fontWeight: 600 }}>{doc.documentName}</div>
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
                      <div className={s.tableActions}>
                        <input
                          type="file"
                          id={`file-input-${doc.id}`}
                          style={{ display: "none" }}
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                          onChange={(e) =>
                            onFileChange(doc.id, e, doc.documentName)
                          }
                        />

                        <button
                          className={s.btnIcon}
                          title="View Details"
                          onClick={() => onOpenDetail(doc.id)}
                        >
                          <Eye size={14} />
                        </button>
                        {isLGA &&
                          (doc.status === "Not Uploaded" ||
                            doc.status === "Rejected") && (
                            <button
                              className={`${s.btnPrimary} ${s.btnSmall}`}
                              onClick={() => onTriggerUpload(doc.id)}
                            >
                              <Upload size={12} /> Upload
                            </button>
                          )}
                        {isLGA && doc.status === "Uploaded" && (
                          <>
                            <button
                              className={`${s.btnSecondary} ${s.btnSmall}`}
                              title="Replace File"
                              onClick={(e) => {
                                e.stopPropagation();
                                onTriggerUpload(doc.id);
                              }}
                              style={{ marginRight: "0.5rem" }}
                            >
                              <RotateCw size={12} />
                            </button>
                            <button
                              className={`${s.btnDanger} ${s.btnSmall}`}
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(doc.id);
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </>
                        )}
                        {isAdmin && canApprove && doc.status === "Uploaded" && (
                          <>
                            <button
                              className={`${s.btnPrimary} ${s.btnSmall}`}
                              onClick={() =>
                                onApprove(doc, lga?.name || doc.lgaId)
                              }
                            >
                              <CheckCircle2 size={12} />
                            </button>
                            <button
                              className={`${s.btnDanger} ${s.btnSmall}`}
                              onClick={() => onOpenDetail(doc.id)}
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
      Showing {filteredDocs.length} of {allMandateDocsCount} documents
    </div>
  </>
);

export default DocumentTable;
