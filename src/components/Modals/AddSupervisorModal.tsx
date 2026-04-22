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
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2rem 1rem",
        overflowY: "auto",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
            padding: "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                color: "white",
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: 700,
              }}
            >
              Add Supervisor
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                margin: "0.25rem 0 0",
                fontSize: "0.85rem",
              }}
            >
              Assign a supervisor to {zone.name}
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
          style={{
            padding: "1.5rem 2rem",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
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
