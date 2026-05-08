import React, { useState } from "react";
import type { User, LGA } from "../../types";
import { X, Search } from "lucide-react";
import s from "../../styles/pages.module.css";

interface AssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lga: LGA | null;
  users: User[];
  onAssign: (lgaId: string, leadId: string) => void;
}

const AssignLeadModal: React.FC<AssignLeadModalProps> = ({
  isOpen,
  onClose,
  lga,
  users,
  onAssign,
}) => {
  const [search, setSearch] = useState("");

  if (!isOpen || !lga) return null;

  const leads = users.filter((u) => u.role === "AUDIT_LEAD");

  const filtered = leads.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "2rem 1rem", overflowY: "auto" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "white", borderRadius: "8px", width: "100%", maxWidth: "500px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Assign Audit Lead to {lga.name}</h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "6px", background: "#f8fafc", }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search Audit Leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "0.85rem",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "1rem",
              maxHeight: "300px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: "0.85rem",
                  padding: "1rem",
                }}
              >
                No leads found
              </div>
            ) : (
              filtered.map((u) => (
                <div
                  key={u.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    background: "#f8fafc",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                      {u.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      {u.email}
                    </div>
                  </div>
                  <button
                    className={s.btnPrimary}
                    style={{
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      background: "#3b82f6",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    onClick={() => {
                      onAssign(lga.id, u.id);
                      onClose();
                    }}
                  >
                    Assign
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignLeadModal;
