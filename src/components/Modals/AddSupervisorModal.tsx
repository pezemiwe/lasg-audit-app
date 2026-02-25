import React, { useState } from "react";
import type { User, Zone } from "../../types";
import { X, Search } from "lucide-react";
import s from "../../styles/pages.module.css";

interface AddSupervisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: Zone | undefined;
  supervisors: User[];
  assignedSupervisorIds: Set<string>;
  onAssign: (zoneId: string, supervisorId: string) => void;
}

const AddSupervisorModal: React.FC<AddSupervisorModalProps> = ({
  isOpen,
  onClose,
  zone,
  supervisors,
  assignedSupervisorIds,
  onAssign,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string>("");

  if (!isOpen || !zone) return null;

  const availableSupervisors = supervisors.filter(
    (sup) =>
      !assignedSupervisorIds.has(sup.id) &&
      !zone.supervisorIds?.includes(sup.id) &&
      (sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sup.email.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleConfirm = () => {
    if (selectedId) {
      onAssign(zone.id, selectedId);
      onClose();
    }
  };

  return (
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
    >
      <div
        className={s.card}
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className={s.cardHeader}
          style={{ justifyContent: "space-between" }}
        >
          <h3 className={s.cardTitle}>Add Supervisor to {zone.name}</h3>
          <button
            onClick={onClose}
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

        <div className={s.cardBody} style={{ padding: "1.5rem" }}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Search Supervisors</label>
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <input
                type="text"
                className={s.formInput}
                style={{ paddingLeft: "2.25rem", width: "100%" }}
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={s.formGroup}>
            <label className={s.formLabel}>Select Supervisor</label>
            <select
              className={s.formSelect}
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="" disabled>
                -- Select a Supervisor --
              </option>
              {availableSupervisors.map((kp) => (
                <option key={kp.id} value={kp.id}>
                  {kp.name} ({kp.email})
                </option>
              ))}
            </select>
            {availableSupervisors.length === 0 && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#ef4444",
                  marginTop: "0.5rem",
                }}
              >
                No supervisors available matching your search.
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
          }}
        >
          <button className={s.btnSecondary} onClick={onClose}>
            Cancel
          </button>
          <button
            className={s.btnPrimary}
            onClick={handleConfirm}
            disabled={!selectedId}
            style={{ opacity: !selectedId ? 0.5 : 1 }}
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSupervisorModal;
