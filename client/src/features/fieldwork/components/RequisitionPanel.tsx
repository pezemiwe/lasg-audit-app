import React, { useState } from "react";
import { Upload, Send, X } from "lucide-react";
import type { AuditStore } from "../../../store/useAuditStore";
import type { DocumentRequisition } from "../../../types";
import StatusBadge from "../../../components/UI/StatusBadge";
import Card from "../../../components/UI/Card";
import { reqStatusVariant } from "../utils/statusVariants";
import s from "../../../styles/pages.module.css";

export interface RequisitionPanelProps {
  requisitions: DocumentRequisition[];
  store: AuditStore;
  auditId: string;
  lgaName: string;
  isLead: boolean;
  onClose: () => void;
}

const RequisitionPanel: React.FC<RequisitionPanelProps> = ({
  requisitions,
  store,
  auditId,
  lgaName,
  isLead,
  onClose,
}) => {
  const issued = requisitions.some((r) => r.status !== "Pending");
  const receivedCount = requisitions.filter(
    (r) => r.status === "Received",
  ).length;

  const [showAddItem, setShowAddItem] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocArea, setNewDocArea] = useState("");
  const [newDocDeadline, setNewDocDeadline] = useState("");

  const today = new Date();
  const getOverdueDays = (r: DocumentRequisition) => {
    if (r.status === "Received" || r.status === "Waived") return 0;
    const deadline = new Date(r.neededBy);
    const diff = Math.floor((today.getTime() - deadline.getTime()) / 86400000);
    return diff > 0 ? diff : 0;
  };

  const handleAddItem = () => {
    if (!newDocName.trim() || !newDocArea.trim() || !newDocDeadline) return;
    const nextRef = `REQ-${String(requisitions.length + 1).padStart(3, "0")}`;
    store.addDocumentRequisition({
      auditId,
      ref: nextRef,
      documentName: newDocName.trim(),
      auditArea: newDocArea.trim(),
      neededBy: newDocDeadline,
      status: "Pending",
      linkedProcedureIds: [],
    });
    setNewDocName("");
    setNewDocArea("");
    setNewDocDeadline("");
    setShowAddItem(false);
    store.addToast({
      type: "success",
      title: "Item Added",
      message: `${nextRef} added to requisition list`,
    });
  };

  const handleIssue = () => {
    requisitions.forEach((r) => {
      if (r.status === "Pending") {
        store.updateRequisitionStatus(r.id, "Issued");
      }
    });
    store.addToast({
      type: "success",
      title: "Requisition Issued",
      message: `Document requisition list sent to Council Treasurer of ${lgaName}`,
    });
    store.logActivity({
      userId: "",
      action: "ISSUE_REQUISITION",
      details: `Requisition issued to ${lgaName} — ${requisitions.length} documents`,
      entityType: "fieldwork",
      entityId: auditId,
    });
  };

  const handleReceive = (reqId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.xlsx,.csv,.doc,.docx,.jpg,.png";
    input.onchange = (ev) => {
      const f = (ev.target as HTMLInputElement).files?.[0];
      if (f) {
        const url = URL.createObjectURL(f);
        store.updateRequisitionStatus(reqId, "Received", f.name, url);
        store.addToast({
          type: "success",
          title: "Document Received",
          message: `${f.name} received and tagged to requisition`,
        });
      }
    };
    input.click();
  };

  return (
    <Card
      title={`Document Requisition — ${lgaName}`}
      borderColor="#2563eb"
      action={
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
            {receivedCount}/{requisitions.length} received
          </span>
          <button className={s.btnIcon} onClick={onClose}>
            <X size={14} />
          </button>
        </div>
      }
    >
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Ref</th>
              <th>Document Required</th>
              <th>Audit Area</th>
              <th>Needed By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requisitions.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600, fontSize: "0.78rem" }}>
                  {r.ref}
                </td>
                <td
                  style={{
                    maxWidth: "260px",
                    whiteSpace: "normal",
                    fontSize: "0.82rem",
                  }}
                >
                  {r.documentName}
                </td>
                <td style={{ fontSize: "0.78rem" }}>{r.auditArea}</td>
                <td style={{ fontSize: "0.78rem" }}>
                  {new Date(r.neededBy).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {getOverdueDays(r) > 0 && (
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color:
                          getOverdueDays(r) >= 7
                            ? "#dc2626"
                            : getOverdueDays(r) >= 3
                              ? "#ea580c"
                              : "#ca8a04",
                        marginTop: "0.1rem",
                      }}
                    >
                      {getOverdueDays(r)} day
                      {getOverdueDays(r) !== 1 ? "s" : ""} overdue
                      {getOverdueDays(r) >= 7 && " — Non-Cooperation Risk"}
                      {getOverdueDays(r) >= 3 &&
                        getOverdueDays(r) < 7 &&
                        " — Send Reminder"}
                    </span>
                  )}
                </td>
                <td>
                  <StatusBadge
                    label={r.status}
                    variant={reqStatusVariant(r.status)}
                  />
                </td>
                <td>
                  {r.status === "Issued" && (
                    <button
                      className={s.btnIcon}
                      onClick={() => handleReceive(r.id)}
                      title="Upload received document"
                    >
                      <Upload size={13} />
                    </button>
                  )}
                  {r.status === "Received" && r.receivedFileName && (
                    <span style={{ fontSize: "0.72rem", color: "#15803d" }}>
                      {r.receivedFileName}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isLead && !issued && (
        <div className={s.formActions}>
          <button className={s.btnPrimary} onClick={handleIssue}>
            <Send size={14} /> Issue Requisition
          </button>
        </div>
      )}
      {isLead && (
        <div style={{ marginTop: "0.75rem" }}>
          {!showAddItem ? (
            <button
              className={s.btnOutline}
              onClick={() => setShowAddItem(true)}
              style={{ fontSize: "0.75rem" }}
            >
              + Add Item
            </button>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr auto auto",
                gap: "0.5rem",
                alignItems: "flex-end",
                padding: "0.75rem",
                background: "#f8fafc",
                borderRadius: "0.5rem",
                border: "1px solid #e2e8f0",
              }}
            >
              <div className={s.formGroup} style={{ margin: 0 }}>
                <label className={s.formLabel}>Document Name</label>
                <input
                  className={s.formInput}
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Internal audit reports FY2024"
                />
              </div>
              <div className={s.formGroup} style={{ margin: 0 }}>
                <label className={s.formLabel}>Audit Area</label>
                <input
                  className={s.formInput}
                  value={newDocArea}
                  onChange={(e) => setNewDocArea(e.target.value)}
                  placeholder="e.g. IA Review"
                />
              </div>
              <div className={s.formGroup} style={{ margin: 0 }}>
                <label className={s.formLabel}>Needed By</label>
                <input
                  type="date"
                  className={s.formInput}
                  value={newDocDeadline}
                  onChange={(e) => setNewDocDeadline(e.target.value)}
                />
              </div>
              <button
                className={s.btnPrimary}
                onClick={handleAddItem}
                style={{ fontSize: "0.75rem", alignSelf: "flex-end" }}
              >
                Add
              </button>
              <button
                className={s.btnSecondary}
                onClick={() => setShowAddItem(false)}
                style={{ fontSize: "0.75rem", alignSelf: "flex-end" }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default RequisitionPanel;
